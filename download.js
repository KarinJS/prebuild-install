const path = require('path')
const fs = require('fs')
const get = require('simple-get')
const pump = require('pump')
const tfs = require('tar-fs')
const zlib = require('zlib')
const util = require('./util')
const error = require('./error')
const proxy = require('./proxy')
const mkdirp = require('mkdirp-classic')

function downloadPrebuild (downloadUrl, opts, cb) {
  const log = opts.log || util.noopLogger
  log.info('downloadUrl', downloadUrl, opts)
  let cachedPrebuild = util.cachedPrebuild(downloadUrl)
  const localPrebuild = util.localPrebuild(downloadUrl, opts)
  const tempFile = util.tempFile(cachedPrebuild)

  if (opts.nolocal) return download()

  log.info('looking for local prebuild @', localPrebuild)
  fs.access(localPrebuild, fs.R_OK | fs.W_OK, function (err) {
    if (err && err.code === 'ENOENT') {
      return download()
    }

    log.info('found local prebuild')
    cachedPrebuild = localPrebuild
    unpack()
  })

  function download () {
    ensureNpmCacheDir(function (err) {
      if (err) return onerror(err)

      log.info('looking for cached prebuild @', cachedPrebuild)
      fs.access(cachedPrebuild, fs.R_OK | fs.W_OK, function (err) {
        if (!(err && err.code === 'ENOENT')) {
          log.info('found cached prebuild')
          return unpack()
        }

        log.http('request', 'GET ' + downloadUrl)
        const reqOpts = proxy({ url: downloadUrl }, opts)

        if (opts.token) {
          reqOpts.headers = {
            'User-Agent': 'simple-get',
            Accept: 'application/octet-stream',
            Authorization: 'token ' + opts.token
          }
        }

        const req = get(reqOpts, function (err, res) {
          if (err) return onerror(err)
          log.http(res.statusCode, downloadUrl)
          if (res.statusCode !== 200) return onerror()
          mkdirp(util.prebuildCache(), function () {
            log.info('downloading to @', tempFile)
            pump(res, fs.createWriteStream(tempFile), function (err) {
              if (err) return onerror(err)
              fs.rename(tempFile, cachedPrebuild, function (err) {
                if (err) return cb(err)
                log.info('renaming to @', cachedPrebuild)
                unpack()
              })
            })
          })
        })

        req.setTimeout(30 * 1000, function () {
          req.abort()
        })
      })

      function onerror (err) {
        fs.unlink(tempFile, function () {
          cb(err || error.noPrebuilts(opts))
        })
      }
    })
  }

  function unpack () {
    let binaryName

    const updateName = opts.updateName || function (entry) {
      if (/\.node$/i.test(entry.name)) binaryName = entry.name
    }

    log.info('unpacking @', cachedPrebuild)

    const options = {
      readable: true,
      writable: true,
      hardlinkAsFilesFallback: true
    }
    const extract = tfs.extract(opts.path, options).on('entry', updateName)

    pump(fs.createReadStream(cachedPrebuild), zlib.createGunzip(), extract,
      function (err) {
        if (err) return cb(err)

        let resolved
        if (binaryName) {
          try {
            resolved = path.resolve(opts.path || '.', binaryName)
          } catch (err) {
            return cb(err)
          }
          log.info('unpack', 'resolved to ' + resolved)

          if (opts.runtime === 'node' && opts.platform === process.platform && opts.abi === process.versions.modules && opts.arch === process.arch) {
            try {
              require(resolved)
            } catch (err) {
              return cb(err)
            }
            log.info(`unpack ${log.logColors.info(`required ${resolved} successfully`)}`)
          }
        }

        cb(null, resolved)
      })
  }

  function ensureNpmCacheDir (cb) {
    const cacheFolder = util.npmCache()
    fs.access(cacheFolder, fs.R_OK | fs.W_OK, function (err) {
      if (err && err.code === 'ENOENT') {
        return makeNpmCacheDir()
      }
      cb(err)
    })

    function makeNpmCacheDir () {
      log.info('npm cache directory missing, creating it...')
      mkdirp(cacheFolder, cb)
    }
  }
}

/**
 * 竞争请求获取最快响应
 * @param {string[]} urls 要测试的URL列表
 * @param {Function} cb 回调函数
 */
function raceRequest (urls, cb) {
  let resolved = false
  const results = []
  const timeout = 3000

  urls.forEach(function (url) {
    const startTime = Date.now()
    const req = get({ url: url, timeout: timeout }, function (err, res) {
      if (err) {
        results.push({ url: url, error: err, responseTime: Date.now() - startTime })
        if (results.length === urls.length && !resolved) {
          // 所有请求都失败了
          resolved = true
          cb(null, null)
        }
        return
      }

      res.destroy() // 立即结束响应

      if (!resolved) {
        resolved = true
        cb(null, { url: url, responseTime: Date.now() - startTime })
      }
    })

    req.setTimeout(timeout, function () {
      req.abort()
      results.push({ url: url, error: new Error('Request timeout'), responseTime: timeout })
      if (results.length === urls.length && !resolved) {
        // 所有请求都超时了
        resolved = true
        cb(null, null)
      }
    })
  })

  // 设置总体超时
  setTimeout(function () {
    if (!resolved) {
      resolved = true
      // 如果有部分成功的响应，返回响应最快的
      const successResults = results.filter(function (r) { return !r.error })
      if (successResults.length > 0) {
        successResults.sort(function (a, b) { return a.responseTime - b.responseTime })
        cb(null, { url: successResults[0].url })
      } else {
        cb(null, null)
      }
    }
  }, timeout + 1000)
}

/**
 * 获取最快的npm registry
 * @param {Function} cb 回调函数
 */
function getFastRegistry (cb) {
  const urls = [
    'https://registry.npmmirror.com',
    'https://registry.npmjs.com'
  ]

  raceRequest(urls, function (err, result) {
    if (err) {
      return cb(null, urls[0])
    }
    cb(null, result ? result.url : urls[0])
  })
}

/**
 * 判断是否为中国大陆网络环境
 * @param {string} registry registry URL
 * @returns {boolean} 是否为中国大陆网络环境
 */
function isChinaNetwork (registry) {
  return registry.includes('npmmirror.com')
}

module.exports = downloadPrebuild
module.exports.getFastRegistry = getFastRegistry
module.exports.isChinaNetwork = isChinaNetwork
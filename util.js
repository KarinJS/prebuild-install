const path = require('path')
const github = require('github-from-package')
const home = require('os').homedir
const crypto = require('crypto')
const expandTemplate = require('expand-template')()

function getDownloadUrl (opts) {
  const pkgName = opts.pkgName.replace(/^@[a-zA-Z0-9_\-.~]+\//, '')
  const pkgVersion = opts.pkgVersion || opts.pkg.version
  return expandTemplate(urlTemplate(opts), {
    name: pkgName,
    package_name: pkgName,
    version: pkgVersion,
    major: pkgVersion.split('.')[0],
    minor: pkgVersion.split('.')[1],
    patch: pkgVersion.split('.')[2],
    prerelease: pkgVersion.split('-')[1],
    build: pkgVersion.split('+')[1],
    abi: opts.abi || process.versions.modules,
    node_abi: process.versions.modules,
    runtime: opts.runtime || 'node',
    platform: opts.platform,
    arch: opts.arch,
    libc: opts.libc || '',
    configuration: (opts.debug ? 'Debug' : 'Release'),
    module_name: opts.pkg.binary && opts.pkg.binary.module_name,
    tag_prefix: opts['tag-prefix']
  })
}

function getApiUrl (opts) {
  return github(opts.pkg).replace('github.com', 'api.github.com/repos') + '/releases'
}

function getAssetUrl (opts, assetId) {
  return getApiUrl(opts) + '/assets/' + assetId
}

function urlTemplate (opts) {
  if (typeof opts.download === 'string') {
    return opts.download
  }

  const packageName = '{name}-v{version}-{runtime}-v{abi}-{platform}{libc}-{arch}.tar.gz'

  /**
   * 新增默认下载地址配置
   * @time 2025年4月14日23:42:50
   */
  const prebuildPkg = require(path.join(__dirname, 'package.json'))
  if (opts.pkgName && prebuildPkg.prebuild[opts.pkgName] && process.env.IS_CHINA_NETWORK) {
    return prebuildPkg.prebuild[opts.pkgName] + '/{tag_prefix}{version}/' + packageName
  }

  const hostMirrorUrl = getHostMirrorUrl(opts)

  if (hostMirrorUrl) {
    return hostMirrorUrl + '/{tag_prefix}{version}/' + packageName
  }

  if (opts.pkg.binary && opts.pkg.binary.host) {
    return [
      opts.pkg.binary.host,
      opts.pkg.binary.remote_path,
      opts.pkg.binary.package_name || packageName
    ].map(function (p) {
      return trimSlashes(p)
    }).filter(Boolean).join('/')
  }

  return github(opts.pkg) + '/releases/download/{tag_prefix}{version}/' + packageName
}

function getEnvPrefix (pkgName) {
  return 'npm_config_' + (pkgName || '').replace(/[^a-zA-Z0-9]/g, '_').replace(/^_/, '')
}

function getHostMirrorUrl (opts) {
  const envName = getEnvPrefix(opts.pkgName) + '_binary_host'
  return process.env[envName] || process.env[envName + '_mirror']
}

function trimSlashes (str) {
  if (str) return str.replace(/^\.|^\/|\/$/g, '')
}

function cachedPrebuild (url) {
  const digest = crypto.createHash('sha512').update(url).digest('hex').slice(0, 6)
  return path.join(prebuildCache(), digest + '-' + path.basename(url).replace(/[^a-zA-Z0-9.]+/g, '-'))
}

function npmCache () {
  const env = process.env
  return env.npm_config_cache || (env.APPDATA ? path.join(env.APPDATA, 'npm-cache') : path.join(home(), '.npm'))
}

function prebuildCache () {
  return path.join(npmCache(), '_prebuilds')
}

function tempFile (cached) {
  return cached + '.' + process.pid + '-' + Math.random().toString(16).slice(2) + '.tmp'
}

function packageOrigin (env, pkg) {
  // npm <= 6: metadata is stored on disk in node_modules
  if (pkg._from) {
    return pkg._from
  }

  // npm 7: metadata is exposed to environment by arborist
  if (env.npm_package_from) {
    // NOTE: seems undefined atm (npm 7.0.2)
    return env.npm_package_from
  }

  if (env.npm_package_resolved) {
    // NOTE: not sure about the difference with _from, but it's all we have
    return env.npm_package_resolved
  }
}

function localPrebuild (url, opts) {
  const envName = getEnvPrefix(opts.pkgName) + '_local_prebuilds'
  const prefix = process.env[envName] || opts['local-prebuilds'] || 'prebuilds'
  return path.join(prefix, path.basename(url))
}

const noopLogger = {
  http: function () { },
  silly: function () { },
  debug: function () { },
  info: function () { },
  warn: function () { },
  error: function () { },
  critical: function () { },
  alert: function () { },
  emergency: function () { },
  notice: function () { },
  verbose: function () { },
  fatal: function () { }
}

exports.getDownloadUrl = getDownloadUrl
exports.getApiUrl = getApiUrl
exports.getAssetUrl = getAssetUrl
exports.urlTemplate = urlTemplate
exports.cachedPrebuild = cachedPrebuild
exports.localPrebuild = localPrebuild
exports.prebuildCache = prebuildCache
exports.npmCache = npmCache
exports.tempFile = tempFile
exports.packageOrigin = packageOrigin
exports.noopLogger = noopLogger

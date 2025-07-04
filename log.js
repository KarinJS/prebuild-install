const levels = {
  silent: 0,
  error: 1,
  warn: 2,
  notice: 3,
  http: 4,
  timing: 5,
  info: 6,
  verbose: 7,
  silly: 8
}

/**
 * 日志等级与颜色映射
 */
const logColors = {
  /** 静默 */
  silent: (text) => text,
  /** 红色 */
  error: (text) => `\x1b[31m${text}\x1b[0m`,
  /** 黄色 */
  warn: (text) => `\x1b[33m${text}\x1b[0m`,
  /** 紫色 */
  notice: (text) => `\x1b[35m${text}\x1b[0m`,
  /** 蓝色 */
  http: (text) => `\x1b[34m${text}\x1b[0m`,
  /** 灰色 */
  timing: (text) => `\x1b[90m${text}\x1b[0m`,
  /** 绿色 */
  info: (text) => `\x1b[32m${text}\x1b[0m`,
  /** 青色 */
  verbose: (text) => `\x1b[36m${text}\x1b[0m`,
  /** 粉色 */
  silly: (text) => `\x1b[35m${text}\x1b[0m`
}

/**
 * 格式化日期为 "月-日 时:分:秒" 格式
 */
function formatDate (date) {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${month}-${day} ${hours}:${minutes}:${seconds}`
}

module.exports = function (rc, env) {
  const level = rc.verbose
    ? 'verbose'
    : env.npm_config_loglevel || 'notice'

  const logAtLevel = function (messageLevel) {
    return function (...args) {
      const color = logColors[messageLevel] || logColors.silent
      const time = formatDate(new Date())
      console.log(`${color(`[prebuild-install][${time}] [${messageLevel}]`)} ${args.join(' ')}`)
    }
  }

  return {
    error: logAtLevel('error'),
    warn: logAtLevel('warn'),
    http: logAtLevel('http'),
    info: logAtLevel('info'),
    level,
    logColors
  }
}

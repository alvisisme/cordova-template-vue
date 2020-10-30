/**
 * 首字母大写配置参数
 * @typedef {Object} CapitalizeOptions
 * @property {Boolean} onlyFirstLetter 是否仅第一个单词首字母大写，默认为false
 */

/**
 * 首字母大写
 * @param {String} value 需要处理的字符串
 * @param {CapitalizeOptions} options 配置参数
 */
function CapitalizeFilter(value, options = {}) {
  const globalOptions = (this && this.capitalize) ? this.capitalize : {}
  options = options || globalOptions
  var onlyFirstLetter = options.onlyFirstLetter != null ? options.onlyFirstLetter : false
  if (!value && value !== 0) return ''
  if (onlyFirstLetter === true) {
    return value.toString().charAt(0).toUpperCase() + value.toString().slice(1)
  } else {
    value = value.toString().toLowerCase().split(' ')
    return value.map(function(item) {
      return item.charAt(0).toUpperCase() + item.slice(1)
    }).join(' ')
  }
}

// 需要导出一个名字, 否则无法自动注入
export const capitalize = CapitalizeFilter

/*
 * @Description:
 * @Version: 2.0
 * @Autor: libo
 * @Date: 2021-04-14 18:58:57
 * @LastEditors: libo
 * @LastEditTime: 2021-04-26 14:23:55
 */
/**
 * @desc 格式化设备枚举值
 * @param {String|Number} val 表达式的值
 * @param {Object} data 数据类型
 * @returns {Number}
 */
export default (val, data) => {
  let isEnum = data.type === 'enum' || data.type === 'bool';
  let dict = data.rules;
  return isEnum ? dict[val] || val : val;
};

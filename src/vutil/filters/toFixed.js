/*
 * @Description: 
 * @Version: 1.0
 * @Autor: hs
 * @Date: 2021-04-14 18:05:25
 * @LastEditors: hs
 * @LastEditTime: 2021-09-07 18:53:26
 */
/**
 * @desc 格式化数字显示
 * @param {String|Number} val 表达式的值
 * @param {Number} [num] 保留 num 位小数
 * @returns {Number}
 */
export default (val, num = 2) => {
  if (val && typeof +val === 'number') {
    return (+val).toFixed(num);
  } else {
    return val;
  }
};

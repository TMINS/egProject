/** !
 * FileName      : toFixedSave
 * Version       : v1.0.0
 * Description   : 格式化数字显示指令不四舍五入 
 * Author        : lg
 * Created       : 
 **/
/**
 * @desc 格式化数字显示
 * @param {String|Number} val 表达式的值
 * @param {Number} [num] 保留 num 位小数
 * @returns {Number}
 */
export default (val, num = 3) => {
  if (val && typeof +val === 'number') {
    return val.toString().substr(0,val.toString().indexOf(".")+num);
  } else {
    return val;
  }
};

/*
 * @Description:;
 * @Version: 2.0
 * @Autor: libo
 * @Date: 2021-04-14 18:58:57
 * @LastEditors: libo
 * @LastEditTime: 2021-04-26 14:21:01
 */
/** !
 * FileName      : device
 * Version       : v1.0.0
 * Description   : 格式化设备参数
 * Author        : 1200 1053182739@qq.com
 * Created       : 2020-09-07 10:14
 **/
/**
 * @desc 格式化设备参数
 */
import { fn_util_get_environmentInfo } from '@/util/util';
export default (value, data) => {
  let hasRules = data.data && data.data.rules;
  let type = data.data.type;
  // 能力集如有格式化函数 返回调用函数的值
  if (data.data.formatter) {
    return data.data.formatter(data);
  }
  if (type === 'enum' || type === 'bool') {
    let dict = data.data.rules;
    if (type === 'bool') {
      value = +value;
    }
    value = dict[value] || value;
  } else if (value && (type === 'double' || type === 'float')) {
    // 是否为浮点数 浮点数统一保留两位小数
    value = parseFloat(value).toFixed(2);
  }
  //fn_util_get_environmentInfo
  // 是否带有单位
  if (value && hasRules && hasRules.unit) {
    return `${value} ${hasRules.unit} ${fn_util_get_environmentInfo(data)}`;
  }
  return value || value === 0
    ? `${value} ${fn_util_get_environmentInfo(data)}`
    : ' - - ';
};

/** !
 * FileName      : ymdhms
 * Version       : v1.0.0
 * Description   : 时间戳转换为yyyy-mm-dd hh:mm:ss
 * Author        : 1200 1053182739@qq.com
 * Created       : 2020-12-30 23:42
 **/
import { fn_util__date_format } from '@/util/util';
export default val => {
  if (val) {
    let { yy, MM, dd, hh, mm, ss } = fn_util__date_format(val);
    return `${yy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
  }
  return val;
};

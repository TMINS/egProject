/** !
 * FileName      : ymd
 * Version       : v1.0.0
 * Description   : 时间戳转换为yyyy-mm-dd
 * Author        : 
 * Created       : 
 **/

import { fn_util__date_format } from '@/util/util';
export default val => {
  if (val) {
    let { yy, MM, dd } = fn_util__date_format(val);
    return `${yy}-${MM}-${dd}`;
  }
  return val;
};

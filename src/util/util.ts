
// 定义Object类型
type typeObj = {[key:string]:any}

/**
 * @desc 获取字符长度 中文及日文算 2 个字符
 * @param {string} str
 */
export const fn_util__string_len = (str:string):number => {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[^\x00-\xff]/g, 'ab').length;
};

/**
 * @desc 过滤对象中的空数据
 * @param {Object} obj
 * @returns {Object}
 */
export const fn_util__filter_null = (obj:typeObj): object => {
  const res:typeObj = {};
  for (let key in obj) {
    const value = obj[key];
    const emptyVal = ['null', null, undefined, 'undefined', ''];
    !emptyVal.includes(value) && (res[key] = value);
  }
  return res;
};

// export const fn_util__filter_unique = (obj:typeObj) => {
//   let hash = {};
//   let newBuildData = obj.reduce((item, next) => {
//     hash[next.code] ? '' : (hash[next.code] = true && item.push(next));
//     return item;
//   }, []);

//   return newBuildData;
// };



//比较两个日期
export const checkTime = (stime:Date | string, etime:Date | string) => {
  let sdate = new Date(stime);
  let edate = new Date(etime);
  let smonth = sdate.getMonth() + 1;
  let syear = sdate.getFullYear();
  let sday = sdate.getDate();
  let emonth = edate.getMonth() + 1;
  let eyear = edate.getFullYear();
  let eday = edate.getDate();
  if (syear > eyear) {
    return false;
  } else {
    if (smonth > emonth) {
      return false;
    } else {
      if (sday > eday) {
        return false;
      } else {
        return true;
      }
    }
  }
};


/**
 * @desc 获取 DOM 距离视窗边界的距离
 * @param {String} select css选择器
 * @returns {Object} obj
 * @returns {Number} obj.top
 * @returns {Number} obj.right
 * @returns {Number} obj.bottom
 * @returns {Number} obj.left
 */
export const fn_util_get_clientRect = (select:string): object => {
  let dom = null;
  if (typeof select === 'string') {
    dom = document.querySelector(select) as Element | null;
  }
  let clientRect = dom?.getBoundingClientRect();
  let [clientWidth, clientHeight] = [
    document.body.clientHeight,
    document.body.clientWidth
  ];
  return {
    top: clientRect?.top,
    right: clientRect?.right,
    bottom: clientRect?.bottom,
    left: clientRect?.left
  };
};

/**
 * 构造树型结构数据（ruoyi）
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data:any, id:any, parentId:any, children:any, rootId:any) {
  id = id || 'id';
  parentId = parentId || 'parentId';
  children = children || 'children';
  rootId = rootId || 0;
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data));
  //循环所有项
  const treeData = cloneData.filter((father:any) => {
    let branchArr = cloneData.filter((child:any) => {
      //返回每一项的子级数组
      return father[id] === child[parentId];
    });
    branchArr.length > 0 ? (father.children = branchArr) : '';
    //返回第一层
    return father[parentId] === rootId;
  });
  return treeData != '' ? treeData : data;
}

export const fn_number_formatter = (val:any) => {
  return fn_format_number.addChineseUnit(val, 2);
};

const fn_format_number = (function() {
  function addWan(integer:any, number:any, mutiple:any, decimalDigit:any) {
    // var me = this;
    var digit = getDigit(integer);
    if (digit > 3) {
      var remainder = digit % 8;
      if (remainder >= 5) {
        // ‘十万’、‘百万’、‘千万’显示为‘万’
        remainder = 4;
      }
      return (
        Math.round(number / Math.pow(10, remainder + mutiple - decimalDigit)) /
          Math.pow(10, decimalDigit) +
        '|万'
      );
    } else {
      return (
        Math.round(number / Math.pow(10, mutiple - decimalDigit)) /
        Math.pow(10, decimalDigit)
      );
    }
  }

  function getDigit(integer:number) {
    var digit = -1;
    while (integer >= 1) {
      digit++;
      integer = integer / 10;
    }
    return digit;
  }

  function addChineseUnit(number:number, decimalDigit:any) {
    // var me = this;
    decimalDigit = decimalDigit == null ? 2 : decimalDigit;
    var integer = Math.floor(number);
    var digit = getDigit(integer);
    // ['个', '十', '百', '千', '万', '十万', '百万', '千万'];
    var unit = [];
    if (digit > 3) {
      var multiple = Math.floor(digit / 8);
      if (multiple >= 1) {
        var tmp = Math.round(integer / Math.pow(10, 8 * multiple));
        unit.push(addWan(tmp, number, 8 * multiple, decimalDigit));
        for (var i = 0; i < multiple; i++) {
          unit.push('亿');
        }
        return unit.join('');
      } else {
        return addWan(integer, number, 0, decimalDigit);
      }
    } else {
      return number;
    }
  }

  return {
    addWan,
    getDigit,
    addChineseUnit
  };
})();
// 车牌号码验证
/**
 * @description:
 * @param {车牌号} vehicleNumber
 * @return {*}
 */
export function isVehicleNumber(vehicleNumber:string): boolean {
  let express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1,2}$/;
  return express.test(vehicleNumber);
}
export const fn_rgb_color_gradient = (value:any, num:any) => {
  // 16进制颜色值的正则
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 把颜色值变成小写
  let color = value.toLowerCase();
  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      let colorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }
      color = colorNew;
    }
    // 处理六位的颜色值，转为RGB
    let colorChange = [];
    for (let j = 1; j < 7; j += 2) {
      colorChange.push(parseInt('0x' + color.slice(j, j + 2)));
    }
    return 'rgb(' + colorChange.join(',') + ',' + num + ')';
  } else {
    return color;
  }
};


/**
 * @description: 重置对象默认值
 * @param {object,config,callback}  对象数据  config 是否启用自定义处理函数  callback
 * @return {} Object
 * @author: libo
 */
export const objectReset = (obj:typeObj, custom = {}, callback: Function)  => {
  if (typeof custom !== 'object') return {};
  let object = obj;
  let config = {
    depth: 1, //深度
    // customObject: false,
    customArray: false,
    customString: false,
    customNumber: false,
    customBoolean: false,
    // customSymbol: false,
    // customUndefined: false,
    // customNull: false,
    // customFunction: false,
    customDate: false
    // customRegExp: false,
    // customError: false,
    // customHTMLDocument: false,
    // customglobal: false
  };
  let childConfig:typeObj = {};
  // if(Object.keys(custom).length > 0){
  //   config = Object.assign(config,custom)
  // }
  config = Object.assign(config, custom);
  for (let i in object) {
    let type = Object.prototype.toString.call(object[i]);
    // console.log(type);
    switch (type) {
      case '[object Object]':
        // 隔离配置
        childConfig = JSON.parse(JSON.stringify(config));
        childConfig.depth += 1;
        childConfig['isChild'] = true;
        if (object[i] == '0YUZSaYf7HN8msJz') {
          console.log('object', object, i);
        }
        object[i] = objectReset(object[i], childConfig, callback);
        break;
      case '[object Array]':
        if (config.customArray && callback) {
          object[i] = callback(i, object[i], config.depth);
        } else {
          object[i] = [];
        }
        break;
      case '[object String]':
        if (config.customString && callback) {
          object[i] = callback(i, object[i], config.depth);
        } else {
          object[i] = '';
        }
        break;
      case '[object Number]':
        if (config.customNumber && callback) {
          object[i] = callback(i, object[i], config.depth);
        } else {
          object[i] = 0;
        }
        break;
      case '[object Boolean]':
        if (config.customBoolean && callback) {
          object[i] = callback(i, object[i], config.depth);
        } else {
          object[i] = false;
        }
        break;
      case '[object Undefined]':
        object[i] = undefined;
        break;
      case '[object Null]':
        object[i] = null;
        break;
      case '[object Function]':
        // 不操作
        break;
      case '[object Date]':
        if (config.customDate && callback) {
          object[i] = callback(i, object[i]);
        } else {
          object[i] = new Date();
        }
        // 当前时间
        break;
      case '[object Symbol]':
        // 不知道咋操作
        break;
      case '[object RegExp]':
        break;
      case '[object Error]':
        break;
      case '[object HTMLDocument]':
        break;
      case '[object global]':
        break;
      default:
    }
  }
  return object;
};

// 判断是否为空
export const fn_validate__null = (val:any) => {
  if (typeof val === 'boolean' || typeof val === 'number') {
    return false;
  }
  if (Object.prototype.toString.call(val) === '[object Array]') {
    return !val.length;
  } else if (Object.prototype.toString.call(val) === '[object Object]') {
    return JSON.stringify(val) === '{}';
  } else if (
    val === 'null' ||
    val === null ||
    val === 'undefined' ||
    val === undefined ||
    val === ''
  ) {
    return true;
  }
  return false;
};
// 判断每一个参数是否为空
export const fn_validate__every_null = (...params:any[]) =>
  params.every(val => fn_validate__null(val));
// 判断是否某一个参数为空
export const fn_validate__some_null = (...params:any[]) =>
  params.some(val => fn_validate__null(val));
// 是否为正确的邮件
export const fn_validate__email = (value:string) => {
  let reg = /^[\dA-z]+@[\dA-z]+\.[a-z]{2,5}$/;
  return reg.test(value);
};
// 是否为正确的手机号
export const fn_validate__phone = (value:string) => {
  let reg = /^1[3456789]\d{9}/;
  return reg.test(value);
};
// 是否为正确的身份证号
/*
根据〖中华人民共和国国家标准 GB 11643-1999〗中有关公民身份号码的规定，公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。
    地址码表示编码对象常住户口所在县(市、旗、区)的行政区划代码。
    出生日期码表示编码对象出生的年、月、日，其中年份用四位数字表示，年、月、日之间不用分隔符。
    顺序码表示同一地址码所标识的区域范围内，对同年、月、日出生的人员编定的顺序号。顺序码的奇数分给男性，偶数分给女性。
    校验码是根据前面十七位数字码，按照ISO 7064:1983.MOD 11-2校验码计算出来的检验码。
出生日期计算方法。
    15位的身份证编码首先把出生年扩展为4位，简单的就是增加一个19或18,这样就包含了所有1800-1999年出生的人;
    2000年后出生的肯定都是18位的了没有这个烦恼，至于1800年前出生的,那啥那时应该还没身份证号这个东东，⊙﹏⊙b汗...
下面是正则表达式:
 出生日期1800-2099  (18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])
 身份证正则表达式 /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i
 15位校验规则 6位地址编码+6位出生日期+3位顺序号
 18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位

 校验位规则     公式:∑(ai×Wi)(mod 11)……………………………………(1)
                公式(1)中：
                i----表示号码字符从由至左包括校验码在内的位置序号；
                ai----表示第i位置上的号码字符值；
                Wi----示第i位置上的加权因子，其数值依据公式Wi=2^(n-1）(mod 11)计算得出。
                i 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
                Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1
*/
type typeObj = {[key:string]:any}
export const fn_validate__idCard = (code:string) => {
  const city:typeObj = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 ',
  };
  let tip = '';
  let pass = true;
  if (
    !code ||
    !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
      String(code)
    )
  ) {
    tip = '身份证号格式错误';
    pass = false;
  } else if (!city[code.slice(0,2)]) {
    tip = '地址编码错误';
    pass = false;
  } else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      const codeArr = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      for (let i = 0;i < 17;i++) {
        ai = Number(codeArr[i]);
        wi = factor[i];
        sum += ai * wi;
      }
      let last = parity[sum % 11];
      if (last != codeArr[17]) {
        tip = '校验位错误';
        pass = false;
      }
    }
  }
  if (!pass) console.log(tip);
  return pass;
};
// 是否为正确的车牌号
/**
  1.常规车牌号：仅允许以汉字开头，后面可录入六个字符，由大写英文字母和阿拉伯数字组成。如：粤B12345；
  2.最后一个为汉字的车牌：允许以汉字开头，后面可录入六个字符，前五位字符，由大写英文字母和阿拉伯数字组成，而最后一个字符为汉字，汉字包括“挂”、“学”、“警”、“港”、“澳”。如：粤Z1234港。
  3.新军车牌：以两位为大写英文字母开头，后面以5位阿拉伯数字组成。如：BA12345。
**/
export const fn_validate__car = (value:string):boolean => {
  let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
  return reg.test(value);
};
// 全中文
export const fn_validate__lang_zh = (value:string):boolean => {
  let reg = /^[\u4e00-\u9fa5]+$/;
  return reg.test(value);
};
// 全英文
export const fn_validate__lang_en = (value:string):boolean => {
  let reg = /^[A-z]+$/;
  return reg.test(value);
};

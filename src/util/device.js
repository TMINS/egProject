const userAgent = navigator.userAgent.toLocaleLowerCase();

/**
 * @desc 获取操作系统
 * @returns {String}
 */
const fn_device__os = () => {
  if (userAgent.match('android')) {
    return 'android';
  } else if (userAgent.match(/iphone|ipad/)) {
    return 'ios';
  } else if (userAgent.match(/macintosh|macIntel/)) {
    return 'mac';
  } else if (userAgent.match(/compatible|windows/)) {
    return 'windows';
  } else {
    return 'other';
  }
};
/**
 * @desc 获取设备类型
 * @returns {String}
 */
const fn_device__type = () => {
  if (
    userAgent.match(/ipad/) ||
    (userAgent.match(/android/) && userAgent.indexOf('mobile') === -1)
  ) {
    return 'pad';
  } else if (
    userAgent.match(/iphone/) ||
    (userAgent.match(/android/) && userAgent.indexOf('mobile') > -1)
  ) {
    return 'mobile';
  } else {
    return 'pc';
  }
};
/**
 * @desc 获取设备品牌
 */
const fn_device__brand = () => {
  const brand = ['huawei', 'honor', 'vivo', 'oppo']; // 常见品牌
  return brand;
};

/**
 * 其他移动端浏览器
 * 微信内置 QQ内置 QQ 微博 UC 支付宝内置 百度 今日头条 抖音内置
 */
const fn_device__browse = () => {
  const bws = [
    {
      name: 'sgssapp',
      it: /sogousearch/i.test(userAgent)
    },
    {
      name: 'wechat',
      it: /MicroMessenger/i.test(userAgent)
    },
    {
      name: 'weibo',
      it: !!userAgent.match(/Weibo/i)
    },
    {
      name: 'uc',
      it: !!userAgent.match(/UCBrowser/i) || userAgent.indexOf(' UBrowser') > -1
    },
    {
      name: 'sogou',
      it: userAgent.indexOf('MetaSr') > -1 || userAgent.indexOf('Sogou') > -1
    },
    {
      name: 'xiaomi',
      it: userAgent.indexOf('MiuiBrowser') > -1
    },
    {
      name: 'baidu',
      it:
        userAgent.indexOf('Baidu') > -1 || userAgent.indexOf('BIDUBrowser') > -1
    },
    {
      name: '360',
      it: userAgent.indexOf('360EE') > -1 || userAgent.indexOf('360SE') > -1
    },
    {
      name: '2345',
      it: userAgent.indexOf('2345Explorer') > -1
    },
    {
      name: 'edge',
      it: userAgent.indexOf('Edge') > -1
    },
    {
      name: 'ie11',
      it: userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
    },
    {
      name: 'ie',
      it: userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1
    },
    {
      name: 'firefox',
      it: userAgent.indexOf('Firefox') > -1
    },
    {
      name: 'safari',
      it: userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1
    },
    {
      name: 'qqbrowser',
      it:
        userAgent.indexOf('MQQBrowser') > -1 && userAgent.indexOf(' QQ') === -1
    },
    {
      name: 'qq',
      it: userAgent.indexOf('QQ') > -1
    },
    {
      name: 'chrome',
      it: userAgent.indexOf('Chrome') > -1 || userAgent.indexOf('CriOS') > -1
    },
    {
      name: 'opera',
      it: userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1
    }
  ];
  for (var i = 0; i < bws.length; i++) {
    if (bws[i].it) {
      return bws[i].name;
    }
  }
  return 'other';
};
// const isWeachat = () => {};
// const isQQ = () => {};

/**
 * @desc 判断移动设备方向
 * @returns {String}
 */
let fn_device__orientation = () => {
  let orientation = 'portrait';
  if (window.orientation == 90 || window.orientation == -90) {
    orientation = 'landscape'; // 横屏
  } else if (window.orientation == 0 || window.orientation == 180) {
    orientation = 'portrait'; // 竖屏
  }
  window.addEventListener('orientationchange', fn_device__orientation, false);
  fn_device__orientation = () => {
    if (window.orientation == 90 || window.orientation == -90) {
      return 'landscape'; // 横屏
    } else if (window.orientation == 0 || window.orientation == 180) {
      return 'portrait'; // 竖屏
    }
  };
  return orientation;
};
export default {
  fn_device__os,
  fn_device__type,
  fn_device__brand,
  fn_device__browse,
  fn_device__orientation
};

/** !
 * FileName      : point
 * Version       : v1.0.0
 * Description   : Canvas 绘制设备点位
 * Author        : 1200 1053182739@qq.com
 * Created       : 2020-12-22 23:39
 **/

class CanvasPoint {
  ctx = null;
  storage = new Map(); // 缓存绘画对象
  history = []; // 绘制历史记录
  events = new Map(); // 注册的事件集合
  currentTriggerEvent = null; // 当前触发的事件对象
  scale = 1; // 缩放比例.
  ele = null; // canvas 元素
  triggerEvent = null; // 事件触发函数
  cancelEvent = null; // 事件移除函数
  /**
   * @param {Object} params
   * @param {String|Element} params.select - 元素选择器或者元素
   * @param {String} params.bg - 背景图
   * @param {Number} params.clientWidth - 画布clientWidth宽度
   * @param {Number} [params.offsetTop=0] - 画布距离页面顶部高度
   * @param {Number} [params.offsetLeft=0] - 画布距离页面左部宽度
   * @param {Boolean} [params.auto=true] - 画布尺寸是否自适应(取背景图params.bg的尺寸),默认 true
   * @param {Number} [params.targetWidth] - 画布 高度；params.auto=flase 必传
   * @param {Number} [params.targetHeight] - 画布 宽度；params.auto=flase 必传
   **/
  constructor({
    select,
    bg,
    clientWidth,
    offsetTop = 0,
    offsetLeft = 0,
    auto = true,
    targetWidth = 0,
    targetHeight = 0
  }) {
    this.select = select;
    this.bg = bg;
    this.clientWidth = clientWidth;
    this.offsetTop = offsetTop;
    this.offsetLeft = offsetLeft;
    this.auto = auto;
    this.targetWidth = targetWidth;
    this.targetHeight = targetHeight;
  }
  /**
   * @callback initBeforeCallback
   * @param {Object} [content] 画布的 getContext('2d') 对象
   **/
  /**
   * @desc 初始化函数
   * @param {initBeforeCallback} callback 初始化时调用函数
   **/
  async init(callback) {
    // 1 参数校验（略）
    // 2 获取Canvas DOm
    let ele = this.select;
    if (typeof this.select === 'string') {
      ele = document.querySelector(this.select);
    }
    this.ele = ele;
    this.ctx = ele.getContext('2d');
    // 绘制背景图
    // this.createCanvasBg(callback);
    try {
      await this.createImage({
        name: 'bg',
        url: this.bg,
        cache: false,
        callback: imageData => {
          let [width, height] = [imageData.width, imageData.height];
          if (this.auto) {
            this.targetWidth = width;
            this.targetHeight = height;
          }
          this.scale = this.clientWidth / this.targetWidth; // 计算缩放比例
          // this.ctx.scale = this.scale;
          // 设置画布尺寸
          this.ele.width = width;
          this.ele.height = height;
        }
      });
      callback && (await callback());
      this.storage.set('bg', {
        imageData: this.ctx.getImageData(
          0,
          0,
          this.targetWidth,
          this.targetHeight
        ),
        w: this.targetWidth,
        h: this.targetHeight
      });
      this.currentTriggerEvent = this.reset;
      this.triggerEvent = this._triggerEvent(); // 事件触发
      this.cancelEvent = this._cancelEvent(); // 事件取消
      // 模拟hover事件
      this.ele.addEventListener('mousemove', this.triggerEvent);
      // 模拟click事件
      this.ele.addEventListener('click', this.triggerEvent);
      return this.ctx;
    } catch (error) {
      console.error(error);
    }
  }

  // 不改变移除函数事件句柄内部的this指向
  _cancelEvent() {
    return () => {
      this.ele.removeEventListener('mousemove', this.triggerEvent);
    };
  }
  /**
   * @desc 绘制背景图
   */
  // async createCanvasBg(callback) {
  //   // 绘制背景图
  //   try {
  //     await this.createImage({
  //       name: 'bg',
  //       url: this.bg,
  //       cache: false,
  //       callback: imageData => {
  //         let [width, height] = [imageData.width, imageData.height];
  //         if (this.auto) {
  //           this.targetWidth = width;
  //           this.targetHeight = height;
  //         }
  //         this.scale = this.clientWidth / this.targetWidth; // 计算缩放比例
  //         this.ctx.scale = this.scale;
  //         // 设置画布尺寸
  //         this.ele.width = width;
  //         this.ele.height = height;
  //       }
  //     });
  //     callback && (await callback());
  //     this.storage.set('bg', {
  //       imageData: this.ctx.getImageData(
  //         0,
  //         0,
  //         this.targetWidth,
  //         this.targetHeight
  //       ),
  //       w: this.targetWidth * this.scale,
  //       h: this.targetHeight * this.scale
  //     });
  //     this.currentTriggerEvent = this.reset;
  //     // 模拟hover事件
  //     this.ele.addEventListener('mousemove', this.triggerEvent);
  //     // this.ele.addEventListener('mousemove', this._cancelEvent);
  //     // 模拟click事件
  //     // this.ele.addEventListener('click', e => {
  //     //   this.triggerEvent(e);
  //     // });
  //     this.ele.addEventListener('click', this._cancelEvent);
  //     return this.ctx;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  /**
   * @desc 创建事件的路径范围
   * @param {Array[]} path 路径坐标集合
   **/
  _createPath(path) {
    return () => {
      const beginPoint = path[0]; // 起始路径
      this.ctx.strokeStyle = 'red';
      this.ctx.beginPath();
      this.ctx.moveTo(beginPoint[0] * this.scale, beginPoint[1] * this.scale);
      path.slice(1).forEach(point => {
        this.ctx.lineTo(point[0] * this.scale, point[1] * this.scale);
      });
      this.ctx.closePath();
      // 点位路径图 开发用
      // this.ctx.stroke();
    };
  }
  /**
   * @desc 事件绑定 提前注册事件响应的路径范围 和 响应事件
   * @param {Object[]} eventsAll 注册的事件集合
   * @param {String} [eventsAll[].name] 事件名称
   * @param {Array[]} [eventsAll[].path] 路径坐标集合
   * @param {Function} eventsAll[].callback 事件响应函数
   * @param {Function} [eventsAll[].props] 该事件自定义的其他参数 返会的是一个对像，需要解构到当前对象
   *
   **/
  bindEvent(eventsAll) {
    eventsAll.forEach(item => {
      let { name = 'default', path, event, props } = item;
      props = props ? props() : {};
      if (path) path = this._createPath(path);
      let eventGroup = {
        path,
        event,
        props
      };
      this.events.set(name, eventGroup);
    });
  }
  /**
   * @desc 事件触发 好好理解 待优化。（为什么返回一个箭头函数？ 为了不改变监听函数事件句柄内部的this指向）
   *
   **/
  _triggerEvent() {
    return e => {
      let offsetX = e.offsetX,
        offsetY = e.offsetY,
        eventType = e.type;
      let waitTriggerEvent = null; // 待触发事件名
      for (let [name, item] of this.events) {
        item.path && item.path();
        if (item.path && this.ctx.isPointInPath(offsetX, offsetY)) {
          waitTriggerEvent = { name, type: eventType, ...item };
          break;
        } else {
          waitTriggerEvent = { name: 'default' };
        }
      }
      // 如果待触发事件等于当前已触发事件 不执行任何操作
      if (
        (waitTriggerEvent.name === this.currentTriggerEvent.name &&
          waitTriggerEvent.type === this.currentTriggerEvent.type) ||
        (waitTriggerEvent.name === this.currentTriggerEvent.name &&
          waitTriggerEvent.type === 'mousemove') ||
        (waitTriggerEvent.name === this.currentTriggerEvent.name &&
          waitTriggerEvent.type === this.currentTriggerEvent.type &&
          waitTriggerEvent.type === 'click')
      ) {
        return false;
      } else {
        this.currentTriggerEvent = waitTriggerEvent;
        if (this.currentTriggerEvent.name !== 'default') {
          this.currentTriggerEvent.event({
            ...this.currentTriggerEvent.props,
            type: eventType,
            e
          });
        } else {
          this.reset(e);
          this.events.get('default').event({ e, type: e.type });
        }
      }
    };
  }
  /**
   * @desc 画布重置  1画布清空、2撤销当前操作、3图形绘制记录 待优化
   **/
  reset() {
    const imageData = this.storage.get('bg').imageData;
    this.ctx.clearRect(0, 0, this.targetWidth, this.targetHeight);
    this.ctx.putImageData(imageData, 0, 0);
  }
  /**
   * @desc 重绘路径
   **/
  repaint() {
    this.ctx.clearRect(0, 0, this.targetWidth, this.targetHeight);
    this.storage.clear();
    this.history = [];
    this.events.clear();
    this.currentTriggerEvent = null;
  }
  /**
   * @desc 绘制业务图
   * @param {Object} params
   * @param {String} params.url 当前图片url
   * @param {String} params.name 当前图片名称
   * @param {Number|Function} [params.x=0] 当前图片的左上角在设计尺寸上的X坐标 或 坐标计算公式
   * @param {Number|Function} [params.y=0] 当前图片的左上角在设计尺寸上的Y坐标 或 坐标计算公式
   * @param {Number} [params.w=this.targetWidht] 当前图片的在设计尺寸上的宽度
   * @param {Number} [params.y=this.targetHeight] 当前图片的在设计尺寸上的高度
   * @param {Boolean} [params.cache=true] 是否缓存当前图片对象
   * @param {Function} [params.callback] 外部图片加载完成的回调函数
   * @param {String} [params.operation='source-over'] 设置或如何将一个源（新的）图像绘制到目标（已有的）的图像上 https://www.w3cschool.cn/jsref/prop-canvas-globalcompositeoperation.html
   **/
  async createImage(params) {
    let {
      url,
      name,
      x = 0,
      y = 0,
      cache = true,
      operation = 'source-over',
      callback
    } = params;

    let imageStorage = this.storage.get(name) || null;
    if (imageStorage) {
      x = typeof x !== 'function' ? x : x(imageStorage.w);
      y = typeof y !== 'function' ? y : y(imageStorage.y);
      this.ctx.drawImage(
        imageStorage.imageData,
        x,
        y,
        imageStorage.w,
        imageStorage.h
      );
    } else {
      // 创建图片对象
      let imageData = new Image();
      // img.crossOrigin = 'anonymous'; // 支持跨域图片 https://www.zhangxinxu.com/wordpress/2018/02/crossorigin-canvas-getimagedata-cors/
      let w = 0,
        h = 0;

      await new Promise((resolve, reject) => {
        imageData.onload = function () {
          w = this.width;
          h = this.height;
          callback && callback(this, params);
          resolve();
        };
        // 图片加载错误时，调用同目录下的默认图片
        imageData.onerror = function (e) {
          let default_url = url.replace(
            /(.*\/)*([^.]+)(.*)/gi,
            '$1default_1$3'
          );
          if (this.src === default_url) {
            return reject();
          }
          imageData.src = default_url;
          console.error('point.js-181', e);
        };
        imageData.src = url;
      });

      x = typeof x === 'number' ? x : x(w);
      y = typeof y === 'number' ? y : y(h);
      this.ctx.globalCompositeOperation = operation;
      this.ctx.drawImage(imageData, x, y, w, h);
      if (cache) {
        // 缓存可考虑直接缓存图片数据imageData，减少ctx.getImageData操作，后续复用调用ctx.drawImage绘制
        this.storage.set(name, {
          imageData,
          w: w,
          h: h
        });
      }
      imageData = null;
    }
  }
}
export default CanvasPoint;

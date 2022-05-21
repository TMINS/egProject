/*
 * @Author: your name
 * @Date: 2021-04-14 18:58:57
 * @LastEditTime: 2021-11-02 15:59:17
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \smart-park-vue\src\vutil\directives\dialogDrag.js
 */
/** !
 * FileName      : dialogDrag
 * Version       : v1.0.0
 * Description   : 弹窗拖拽
 * Author        : 1200 1053182739@qq.com
 * Created       : 2020-09-07 10:51
 **/
/**
 * 1. 弹窗不能拖到可视界面意外
 * 2. 关闭、放大、缩小 弹窗应该回到默认位置
 * 3. 只要鼠标不在弹窗上 应该移除产生的事件
 */
export default {
  // v-dialog-drag: 弹窗拖拽
  bind(el) {
    const proxyDropDom = el.querySelector('.el-dialog__header');
    const dropDom = el.querySelector('.el-dialog');
    const [clientWidth, clientHeight] = [
      document.body.clientWidth,
      document.body.clientHeight
    ];
    // 距离可视界面边界值
    const client_offset = 20;
    // 鼠标正在滑动时坐标值（取 event.clientX， event.clientY 的值）
    let startPoint = [0, 0];
    // 相对于原坐标移动的距离
    let movePoint = [0, 0];
    // 移动弹窗
    const moveDropDom = (clientX, clientY) => {
      if (clientX && clientY) {
        let clientChange = [clientX - startPoint[0], clientY - startPoint[1]]; // 鼠标移动的距离
        let pointChange = [
          movePoint[0] + clientChange[0],
          movePoint[1] + clientChange[1]
        ];
        // 如果 dropDom 相对于视窗达到了距离可视界面边界值，则不应再向当前方向移动
        const clientRect = dropDom.getBoundingClientRect();
        if (
          (clientRect.left < client_offset && clientChange[0] < 0) ||
          (clientRect.right > clientWidth - client_offset &&
            clientChange[0] > 0)
        ) {
          clientX = startPoint[0];
          pointChange[0] = movePoint[0];
        }
        if (
          (clientRect.top < client_offset && clientChange[1] < 0) ||
          (clientRect.bottom > clientHeight - client_offset &&
            clientChange[1] > 0)
        ) {
          clientY = startPoint[1];
          pointChange[1] = movePoint[1];
        }
        // 移动 dropDom
        dropDom.style.transform = `translate(${pointChange[0]}px, ${pointChange[1]}px)`;
        movePoint = [...pointChange];
        startPoint = [clientX, clientY];
      } else {
        return false;
      }
    };
    // 关闭拖拽
    const cancelDrop = function() {
      document.onmouseup = null;
      document.onmousemove = null;
    };
    dropDom.style.cssText +=
      ';marign: 10vh auto 0;position: fixed;left: 0;right: 0';
    // 鼠标被按下
    proxyDropDom.onmousedown = function(e) {
      // 正则判断弹窗位置是否还原
      let transform = dropDom.style.transform; // eg: translate(0px, 44px)；translate(0, 44px)
      let res = /translate\((\d+)(px),\s?(\d+)\2\)/.exec(transform); // ["translate(0px, 44px)", "0", "px", "44"]； null
      if (!res || (+res[1] === 0 && +res[3] === 0)) {
        startPoint = [0, 0];
        movePoint = [0, 0];
      }
      startPoint = [e.clientX, e.clientY];
      // 移动
      document.onmousemove = function(e) {
        e.preventDefault();
        moveDropDom(e.clientX, e.clientY);
        return true;
      };
      // 释放鼠标 放弃拖拽
      document.onmouseup = function(e) {
        e.preventDefault();
        cancelDrop();
        return true;
      };
    };
  }
};

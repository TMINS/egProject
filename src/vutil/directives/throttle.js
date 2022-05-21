/*
 * @Description:
 * @Version: 2.0
 * @Autor: libo
 * @Date: 2021-09-22 15:49:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-15 16:23:21
 */
import Vue from 'vue';

const pointDoms = [];
const throttle = Vue.directive('throttle', {
  // 指令的定义
  bind(el, binding, vnode, oldVnode) {
    pointDoms.push(el); // 存储使用这个指令的DOM
    el.addEventListener('click', () => {
      // 禁用所有使用这个指令的DOM结构点击事件
      pointDoms.forEach(pointItem => {
        pointItem.style.pointerEvents = 'none';
      });
      setTimeout(() => {
        // 启动所有使用这个指令的DOM结构点击事件
        pointDoms.forEach(pointItem => {
          pointItem.style.pointerEvents = 'auto';
        });
      }, binding.value || 1000);
    });
  }
});
export default throttle;

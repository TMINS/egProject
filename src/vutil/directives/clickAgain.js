/*
 * @Description:
 * @Version: 2.0
 * @Autor: libo
 * @Date: 2021-09-22 15:49:20
 * @LastEditors: libo
 * @LastEditTime: 2021-09-22 15:49:20
 */
import Vue from 'vue';

const clickAgain = Vue.directive('clickAgain', {
  // 指令的定义
  bind(el, binding, vnode, oldVnode) {
    // 绑定this
    let self = vnode.context;
    el.onclick = function(e) {
      if (self._is_click) {
        return false;
      }
      /*执行指令绑定的事件*/
      self[binding.expression]();
      self._is_click = true;
      setTimeout(() => {
        self._is_click = false;
      }, 2000);
    };
  }
});
export default clickAgain;

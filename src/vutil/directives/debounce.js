/*
 * @Description:
 * @Version: 2.0
 * @Autor: libo
 * @Date: 2021-09-22 15:49:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-15 16:29:43
 */
import Vue from 'vue';

const debounce = Vue.directive('debounce', {
  inserted: function(el, binding) {
    let timer;
    el.addEventListener('click', () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        binding.value();
      }, binding.value || 1000);
    });
  }
});
export default debounce;

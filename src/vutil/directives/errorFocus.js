/** !
 * FileName      : ErrorFocus
 * Version       : v1.0.0
 * Description   : 定位表单校验错误点
 * Author        : 1200 1053182739@qq.com
 * Created       : 2020-09-07 09:14
 **/

const positionErrorInput = form => {
  let fields = form.fields;
  for (let field of fields) {
    if (field.validateState === 'error') {
      let dom = field.$el;
      try {
        dom.scrollIntoView({
          //滚动到指定节点
          block: 'center', // 值有start,center,end，nearest，当前显示在视图区域中间
          behavior: 'smooth' // 值有auto、instant,smooth，缓动动画（当前是慢速的）
        });
      } catch (e) {
        console.log(e);
      }
      try {
        dom.querySelector('input').focus();
      } catch (e) {
        console.log(e);
      }
      dom = null;
      return;
    }
  }
};
export default {
  update: function(el, binding, vnode) {
    let value = binding.value; // value 每次表单校验的结果
    let oldValue = binding.oldValue;
    if (value !== oldValue) {
      positionErrorInput(vnode.componentInstance.$data);
    }
  }
};

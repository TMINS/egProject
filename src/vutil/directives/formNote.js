/** !
 * FileName      : note
 * Version       : v1.0.0
 * Description   : 基于element-ui的表单属性描述指令
 * Author        : 1200 1053182739@qq.com
 * Created       : 2020-11-16 14:11
 **/

export default {
  bind: function(el, binding) {
    let value = binding.value; // value 每次表单校验的结果
    let labelNode = el.querySelector('.el-form-item__label');
    let noteNode = document.createElement('span');
    noteNode.className = 'web_note';
    noteNode.setAttribute('data-note', value);
    noteNode.textContent = '?';
    labelNode.appendChild(noteNode);
  }
};

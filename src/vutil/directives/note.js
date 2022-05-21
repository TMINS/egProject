/** !
 * FileName      : note
 * Version       : v1.0.0
 * Description   : 描述指令
 * Author        : 1200 1053182739@qq.com
 * Created       : 2020-11-16 14:11
 **/

export default {
  bind: function(el, binding) {
    let value = binding.value; // value 每次表单校验的结果
    let noteNode = document.createElement('span');
    noteNode.className = 'web_note';
    noteNode.setAttribute('data-note', value);
    noteNode.textContent = '?';
    el.appendChild(noteNode);
  }
};

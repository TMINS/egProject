/** !
 * FileName      : index
 * Version       : v1.0.0
 * Description   : 注册全局过滤器
 * Author        : 1200 1053182739@qq.com
 * Created       : 2020-09-07 10:10
 **/

import Vue from 'vue';
const requireComponent = require.context(
  // 其组件目录的相对路径
  '.',
  // 是否查询其子目录
  false,
  // 匹配文件名的正则表达式
  /\.js$/
);

requireComponent.keys().forEach(fileName => {
  const filterName = fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '');
  // 排除不必注册指令的文件
  if (filterName === 'index') {
    return false;
  }
  // 获取文件
  const module = requireComponent(fileName);
  // 全局注册过滤器
  Vue.filter(
    filterName,
    // 如果这个文件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    module.default || module
  );
});

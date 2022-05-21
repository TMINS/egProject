export default {
  /**
   * @desc 过滤对象中的空数据
   * @param {Object} obj
   * @returns {Object}
   */
  fn_util__filter_null(obj) {
    const res = {};
    for (let key in obj) {
      const value = obj[key];
      const emptyVal = ['null', null, undefined, 'undefined', ''];
      !emptyVal.includes(value) && (res[key] = value);
    }
    return res;
  },
  /**
   * @desc 在对象数组中通过给定的属性和和属性值查找对应的数据
   * @param {Array} options 原始数据
   * @param {*} value 属性值
   * @param {*} key 属性
   * @returns {Object}
   */
  fn_find__from_array(options, value, key) {
    return options.find(item => item[key] === value);
  },

  /**
   * 构造树型结构数据
   * @param {*} data 数据源
   * @param {*} id id字段 默认 'id'
   * @param {*} parentId 父节点字段 默认 'parentId'
   * @param {*} children 孩子节点字段 默认 'children'
   * @param {*} rootId 根Id 默认 0
   */
  handleTree(data, id, parentId, children, rootId) {
    id = id || 'id';
    parentId = parentId || 'parentId';
    children = children || 'children';
    rootId = rootId || 0;
    //对源数据深度克隆
    const cloneData = JSON.parse(JSON.stringify(data));
    //循环所有项
    const treeData = cloneData.filter(father => {
      let branchArr = cloneData.filter(child => {
        //返回每一项的子级数组
        return father[id] === child[parentId];
      });
      branchArr.length > 0 ? (father.children = branchArr) : '';
      //返回第一层
      return father[parentId] === rootId;
    });
    return treeData != '' ? treeData : data;
  }
};

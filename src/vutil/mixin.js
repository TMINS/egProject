/** !
 * FileName      : mixin
 * Version       : v1.0.0
 * Description   : 全局混入
 * Author        : 1200 1053182739@qq.com
 * Created       : 2020-09-03 15:09
 **/

import { mapGetters } from 'vuex';
import { fn_util__deep_clone } from '@/util/util';
export const SetProps = {
  props: {
    customProps: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    customModel() {
      return {
        ...(this.defaultProps || {}),
        ...this.props
      };
    }
  }
};
export const Crud = {
  mixins: [SetProps],
  computed: {
    ...mapGetters(['isTenant', 'tenantId'])
  },
  data() {
    return {
      dialogVisible: false,
      formData: {},
      status: '',
      isRefresh: false,
      size: 'small',
      loading: false
    };
  },
  methods: {
    async fn_open__form(row, type, callback) {
      row = fn_util__deep_clone(row);
      if (typeof callback === 'function') {
        try {
          await callback(row, type);
        } catch (error) {
          console.error(error);
          return false;
        }
      }
      this.formData = row;
      this.status = type;
      this.dialogVisible = true;
    },
    async fn_click__submit() {
      this.loading = true;
      try {
        let res = await this.$refs.form.fn_click__submit();
        this.dialogVisible = false;
        this.isRefresh = !this.isRefresh;
        this.fn_submit__success && this.fn_submit__success(res);
      } catch (error) {
        console.warn(error);
      }
      this.loading = false;
    },
    fn_click__cancel() {
      this.loading = false;
      this.dialogVisible = false;
    }
  }
};
export const CrudTabel = {
  mixins: [SetProps],
  props: {
    isRefresh: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['isTenant', 'tenantId']),
    // 获取多选表格选中的数据
    cp__selection() {
      return this.refTable ? this.refTable.selection : [];
    }
  },
  data() {
    return {
      refTable: null, // 表格DOM
      size: 'small', // 表格尺寸
      loading: false, // 数据加载层
      // 查询参数
      query_params: { parkId: '' },
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 80]
      },
      dataText: '',
      tableData: []
    };
  },
  created() {
    this.fn_get__list();
  },
  mounted() {
    this.refTable = this.$refs.table;
  },
  watch: {
    isRefresh() {
      this.fn_get__list();
    }
  },
  methods: {
    // 获取数据
    async fn_handle__get_list(reqCallback) {
      this.loading = true;
      try {
        let data = this.fn_formatter__reqdata();
        data.current = this.page.currentPage;
        data.size = this.page.pageSize;
        let res = await reqCallback(data);
        this.tableData = this.fn_formatter__resdata(res);
      } catch (error) {
        this.tableData = [];
      }
      this.loading = false;
    },
    // 搜索数据
    fn_handle__query() {
      this.page.currentPage = 1;
      this.fn_get__list();
    },
    // 刷新数据
    fn_click__refresh() {
      this.fn_get__list();
    },
    // 重置搜索条件
    fn_click__reset_query() {
      // 9-17   过滤 parkId  不被重置
      if (this.query_params.parkId) {
        for (let key in this.query_params) {
          if (key !== 'parkId') {
            this.query_params[key] = '';
          }
        }
      } else {
        this.query_params = {};
      }
      if (this.timeRange) {
        this.timeRange = [];
      }
      this.page.currentPage = 1;
    },
    // 用于多选表格，清空用户的选择
    fn_click__clear_selection() {
      this.refTable.clearSelection();
    },
    // 更新每页显示条数
    fn_pageSize__change(val) {
      // console.log(val)
      this.page.pageSize = val;
      this.fn_get__list();
    },
    // 更新当前页数
    fn_pageCurrent__change(val) {
      this.page.currentPage = val;
      this.fn_get__list();
    },
    // 新增
    fn_click__add() {
      this.$emit('add', {});
    },
    // 编辑
    fn_click__edit(row) {
      this.$emit('edit', row);
    },
    // 批量操作
    fn_handle__batch({
      row,
      label,
      key,
      params,
      reqCallback,
      tip,
      msg,
      cancelMsg
    }) {
      let ids = '';
      let temp_tip = [];
      if (Object.prototype.toString.call(row) === '[object Array]') {
        ids = row
          .map(item => (temp_tip.push(item[label]), item[key]))
          .toString();
      } else {
        ids = row[key];
        temp_tip = [row[label]];
      }
      if (ids) {
        tip = tip.replace('【】', `【${temp_tip.join(' | ')}】`);
        this.$confirm(`${tip}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        })
          .then(() => {
            reqCallback(params || ids).then(res => {
              if (res.code === 0 || res.code === 200) {
                this.fn_get__list();
                this.$message.success(msg || '操作成功!');
              }
            });
          })
          .catch(() => {
            this.$message.info(cancelMsg || '已取消操作！');
          });
      } else {
        this.$message.warning('请至少选择一条数据!');
      }
    }
  }
};
export const CrudForm = {
  mixins: [SetProps],
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    status: {
      type: String,
      default: 'add'
    },
    isReset: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['isTenant', 'tenantId'])
  },
  data() {
    return {
      refForm: null,
      size: 'small',
      form: {},
      validateState: true // 表单校验状态
    };
  },
  created() {
    this.form = { ...this.value };
  },
  mounted() {
    this.refForm = this.$refs.form;
  },
  watch: {
    isReset(val) {
      if (!val) {
        this.refForm.resetFields();
      }
    },
    value(val) {
      this.form = { ...val };
      if (this.form.signTime == -1) {
        this.form.signTime = '';
      }
    }
  },
  methods: {
    // 提交数据
    fn_handle__submit(reqCallback, message) {
      return new Promise((resolve, reject) => {
        this.refForm.validate(valid => {
          if (valid) {
            // console.log(this.form)
            let data = this.fn_formatter__reqdata(this.form);
            console.log(data);
            reqCallback(data)
              .then(() => {
                this.form = {};

                this.$message.success(message);
                resolve(data);
              })
              .catch(error => {
                console.log(error);
                reject();
              });
          } else {
            this.validateState = !this.validateState;
            reject('validate fail');
          }
        });
      });
    }
  }
};

<template>
  <Modal class="top-pop" v-model="show" title="商品分类" @on-ok="sureEvent" @on-visible-change="changeProductsModal" :scrollable="true" width="800">
    <Row>
      <Col span="14">
        <p style="margin-top: 8px;">显示个数：
          <input class="number-input" type="text" v-model="numberInput" @blur="inputChange" style="width: 100px" :disabled="pageType == 'productInfinite'"/>
          <span style="color: #999;">最小2，最大100</span>
        </p>
      </Col>
      <Col span="10">
        <Row type="flex" justify="end">
          <Form ref="formInline" :model="formInline" inline>
            <FormItem prop="user" class="no-margin">
              <Input type="text" v-model="formInline.name" placeholder="">
              </Input>
            </FormItem>
            <FormItem class="no-margin">
              <Button type="primary" @click="search(formInline.name)">查询</Button>
            </FormItem>
          </Form>
        </Row>
      </Col>
    </Row>
    <Row style="margin-top: 12px;" v-if="show">
      <Col span="8">
      <Table ref="table1" :columns="proCateColumns1" :highlight-row="this.multiple == 1 ? true : false" :data="proCateList1" height="375" @on-row-click="loadSubCate1"></Table>
      </Col>
      <Col span="8">
        <Table ref="table2" :columns="proCateColumns2" :highlight-row="this.multiple == 1 ? true : false" :data="proCateList2" height="375" @on-row-click="loadSubCate2"></Table>
      </Col>
      <Col span="8">
        <Table ref="table3" :columns="proCateColumns3" :highlight-row="this.multiple == 1 ? true : false" :data="proCateList3" height="375" @on-row-click="loadSubCate3"></Table>
      </Col>
      <!--<Col span="18" offset="1">-->
      <!--<div class="scroll">-->
        <!--<Tree :data="proCateListSub" @on-select-change="treeChange"></Tree>-->
      <!--</div>-->
      <!--</Col>-->
    </Row>
    <Row style="margin-top: 12px;" v-if="backCates.length > 0">
      <Col span="4"><div>已选分类：</div></Col>
      <Col span="20">
        <div class="selected-cates">
          <div class="item" v-for="(item, idx) in backCates">
            {{item.name}}
            <div class="close" @click="disSelect(idx)">x</div>
          </div>
        </div>
      </Col>
    </Row>
  </Modal>
</template>

<script>
import Bus from "../bus";
import { deepCopy } from "@/utils/util";

export default {
  name: "image-center",
  components: {},
  data() {
    return {
      formInline: {
        name: ""
      },
      token: this.$store.state.login.token,
      show: false,
      numberInput: 6,
      proCateColumns1: [
        {
          title: "一级分类名称",
          key: "name"
        }
      ],
      proCateColumns2: [
        {
          title: "二级分类名称",
          key: "name"
        }
      ],
      proCateColumns3: [
        {
          title: "三级分类名称",
          key: "name",
          render: (h, params) => {
            let name = params.row.name
            let id = params.row.id
            if (this.idInList(id)) {
              return h('div', name + ' √');
            }
            return h('div', name);
          }
        }
      ],
      proCateList1: [],
      proCateList2: [],
      proCateList3: [],
      proCateListSub: [],
      callback: null,
      backData: null,
      pageType: '',
      multiple: '1', // 是否多选 1 单选 2 多选
      backCates: [], // 多选的3级分类
    };
  },
  methods: {
    disSelect: function (idx) {
      this.backCates.splice(idx, 1)
    },
    // 查询
    search: function (name) {
      this._loadProCateList(name)
    },
    idInList: function (id) {
      let idStr = id + ''
      for (let i = 0; i < this.backCates.length; i++) {
        let item = this.backCates[i]
        if (item.id == idStr) {
          return true;
        }
      }
      return false
    },
    inputChange:function(e){
      let value = e.target.value ;
      let reg =/[^0-9]/ig;
      value = value.replace(reg, "")
      if (value < 2) {
        value = '2'
      } else if (value > 100) {
        value = '100'
      }
      this.numberInput = value;
    },
    getName(backCates){
      let name = '';
      backCates.forEach(item => name+=`,${item.name}`)
      return name.substr(1)
    },
    sureEvent: function() {
      if(!this.backCates.length) return ;
      if (this.multiple == '2') {
        let d = deepCopy(this.backData);
        this.callback({
          name: this.getName(this.backCates),
          cate: d,
          multiple: '2',
          backCates: this.backCates,
          number: this.numberInput,
        });
      } else if (this.backData) {
        let d = deepCopy(this.backData);
        this.callback({
          name: d.name,
          cate: d,
          number: this.numberInput,
        });
      } else {
        this.callback(null);
      }
      this.show = false;
    },
    loadSubCate1: function (item) {
      item.cateLevel = 1
      this.backData = item
      this.$refs.table2.clearCurrentRow();
      this.$refs.table3.clearCurrentRow();
      this.proCateList2 = item.childList
      if (this.proCateList2.length == 0) {
        return ;
      }
      this.proCateList3 = this.proCateList2[0].childList
    },
    loadSubCate2: function (item) {
      item.cateLevel = 2
      this.backData = item
      this.$refs.table1.clearCurrentRow();
      this.$refs.table3.clearCurrentRow();
      this.proCateList3 = item.childList
    },
    loadSubCate3: function (item) {
      item.cateLevel = 3
      this.backData = item
      this.$refs.table1.clearCurrentRow();
      this.$refs.table2.clearCurrentRow();
      if (this.multiple == 2) {
        let arr = []
        let has = false
        let idStr = item.id + ''
        for (let i = 0; i < this.backCates.length; i++) {
          let item = this.backCates[i]
          if (item.id == idStr) {
            has = true
          } else {
            arr.push(item)
          }
        }
        if (has == false) {
          arr.push(item)
        }
        this.backCates = arr
      }
    },
    changeProductsModal: function(params) {},
    // 获取商品分类
    _loadProCateList: function(categoryName = '') {
      let url = this.$market.apiBaseURL() + "/app/json/product/getAppProCategoryList";
      let paramsData = {
        categoryName: categoryName
      };
      this.$http.post(url, paramsData).then(
        res => {
          let data = res.data;
          this.proCateList2 = []
          this.proCateList3 = []
          this.proCateList1 = data.data.list;
          if (this.proCateList1.length == 0) {
            return ;
          }
          this.proCateList2 = this.proCateList1[0].childList
          if (this.proCateList2.length == 0) {
            return ;
          }
          this.proCateList3 = this.proCateList2[0].childList
        },
        error => {
        }
      );
    }
  },
  created() {
    Bus.$on("showCateCenter", busData => {
      let pageType = busData.pageType
      if (pageType == 'productInfinite') {
        this.pageType = pageType
        this.numberInput = 10
      } else {
        this.pageType = ''
      }
      this.multiple = busData.multiple || '1'
      this.backCates = busData.backCates || []
      this.callback = busData.fn;
      this.show = true;
    });
    this._loadProCateList();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.selected-cates {
  overflow hidden;
  .item {
    float left;
    position relative;
    padding 10px;
    .close {
      position absolute;
      right -5px;
      top -5px;
      text-align center;
      width 30px;
      height 30px;
      font-size 16px;
      color black;
      line-height 30px;
      background-color rgba(255, 255, 255, 0.5);
      border-radius 16px;
    }
  }
}

.scroll {
  height: 375px;
  overflow-x: hidden;
  overflow-y: auto;
}
.number-input {
  background-color #efefef;
  padding 8px 5px;
  border-radius 3px;
}
</style>

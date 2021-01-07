<template>
  <Modal class="top-pop" v-model="show" title="商品品牌" @on-ok="sureEvent" :scrollable="true" width="800">
    <Row>
      <Col span="24">
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
      <Col span="24">
        <Table ref="table1" :columns="brandColumns" :data="brandList" height="375" @on-row-click="selectedBrand"></Table>
      </Col>
    </Row>
    <Row style="margin-top: 12px;" v-if="backCates.length > 0">
      <Col span="4"><div>已选品牌：</div></Col>
      <Col span="20">
        <div class="selected-cates">
          <div class="item" v-for="(item, idx) in backCates">
            {{item.featureValue}}
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
        brandColumns: [
          {
            title: "id",
            key: "id"
          },
          {
            title: "名称",
            key: "featureValue"
          },
          {
            title: 'logo',
            key: 'logo',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.logo
                  },
                  style: {
                    display: 'block',
                    width: '60px',
                    height: '60px'
                  }
                }),
              ]);
            }
          }
        ],
        brandList: [],
        proCateListSub: [],
        callback: null,
        backData: null,
        pageType: '',
        multiple: '2', // 是否多选 1 单选 2 多选
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
      sureEvent: function() {
        let d = deepCopy(this.backData);
        this.callback({
          name: '多频道',
          cate: d,
          multiple: '2',
          backCates: this.backCates
        });
        this.show = false;
      },
      selectedBrand: function (item) {
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
      },
      // 获取商品品牌
      _loadProCateList: function(categoryName = '') {
        let url = this.$market.apiBaseURL() + "/system/jqGrid/brand/getProFeatureList";
        let paramsData = {
          page: {
            row: 1,
            pageSize: 100
          },
          token: this.$store.state.login.token,
          keyword: categoryName
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            this.brandList = data.data;
          },
          error => {
          }
        );
      }
    },
    created() {
      Bus.$on("showBrandCenter", busData => {
        this.multiple = busData.multiple || '2'
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

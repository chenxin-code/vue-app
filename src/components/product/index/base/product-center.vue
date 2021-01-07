<template>
  <Modal class="top-pop" v-model="show" title="商品中心" @on-ok="sureEvent" @on-visible-change="changeProductsModal"
         :scrollable="true" width="800">
    <Row type="flex" justify="start" class="modal-row padding-bottom row-bottom-line">
      <Col span="7">
        <div class="label">标题：</div>
        <Input type="text" v-model="sort.skuName" placeholder="请输入标题名称" />
      </Col>
      <Col span="7">
        <div class="label">商店：</div>
        <div @click="chooseStore"><Input type="text" clearable v-model="storeName" placeholder="请选择商店" readonly/></div>
      </Col>
      <Col span="7">
        <Button type="primary" @click="_getProductList('1')">搜索</Button>
      </Col>
      <Col span="10" offset="4" v-if="setting.deliveryTypeSelecter == '1'">
        <span>目标页面支持配送方式：</span>
        <RadioGroup v-model="deliverType">
          <Radio label="0">默认</Radio>
          <Radio label="1">自提</Radio>
          <Radio label="2">配送</Radio>
        </RadioGroup>
      </Col>
    </Row>
    <Table v-if="setting.type == 'radio' && show" border highlight-row ref="currentRowTable" :columns="RadioColumns"
           :data="products" @on-current-change="currentChange" height="320">
    </Table>
    <Table v-if="setting.type == 'select' && show" border ref="selectTable" :columns="selectColumns" :data="products"
           @on-selection-change='selectionChange' height="320">
    </Table>
    <Row type="flex" justify="center" class="row-padding no-padding-bottom">
      <Page :total="totalCount" @on-change="_getProductList" :page-size="20"></Page>
    </Row>
  </Modal>
</template>

<script>
  import Bus from "../bus";
  import {deepCopy} from "@/utils/util";

  export default {
    name: "image-center",
    components: {},
    data() {
      return {
        storeName:'',
        token: "",
        ouCode: "",
        products: [],
        selectedIdx: "-1",
        show: false,
        setting: "",
        backData: "",
        callback: function () {
          console.log("no callback");
        },
        RadioColumns: [
          {
            title: "图片",
            key: "phMainUrl",
            width: 100,
            align: "center",
            render: (h, params) => {
              return h("img", {
                attrs: {
                  src: params.row.phMainUrl
                },
                style: {
                  width: "50px",
                  height: "50px",
                  display: "block",
                  margin: "0 auto"
                }
              });
            }
          },
          {
            title: "标题",
            key: "skuName"
          },
          {
            title: "商店",
            key: "storeName"
          }
        ],
        selectColumns: [
          {
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "图片",
            key: "phMainUrl",
            width: 100,
            align: "center",
            render: (h, params) => {
              return h("img", {
                attrs: {
                  src: params.row.phMainUrl
                },
                style: {
                  width: "50px",
                  height: "50px",
                  display: "block",
                  margin: "0 auto"
                }
              });
            }
          },
          {
            title: "标题",
            key: "skuName"
          },
          {
            title: "商店",
            key: "storeName"
          }
        ],
        totalCount: 1,
        pageSize: "20",
        pageIndex: "1",
        sort: {
          skuName: '',
          mchName: '',
          storeCode: '',
          sortType: 'asc',
        },
        deliverType: '0'
      };
    },
    methods: {
      chooseStore: function() {
        Bus.$emit('showShopCenter', {
          fn: item => {
            if(item){
              this.storeName = item.storeName;
              this.sort.storeCode = item.storeCode;
            }else{
              this.storeName = '';
              this.sort.storeCode = '';
            }
          },
        });
      },
      selectEvent: function (idx) {
        this.selectedIdx = idx;
      },
      sureEvent: function () {
        let d = deepCopy(this.backData);
        if (this.setting.deliveryTypeSelecter == '1') {
          d.shareDeliveryType = this.deliverType
        }
        this.callback(d);
        this.show = false;
      },
      changeProductsModal: function (params) {
        if (params) return false;
        if (this.setting.type == "radio") {
          this.$refs.currentRowTable.clearCurrentRow();
        } else if (this.setting.type == "select") {
          this.$refs.selectTable.selectAll(false);
        }
      },
      currentChange: function (currentRow, oldCurrentRow) {
        this.backData = currentRow;
      },
      selectionChange: function (data) {
        this.backData = data;
      },
      _getProductList: function (index = "1") {
        this.pageIndex = index;
        let url;
        let paramsData = {
          page: index,
          rows: 20,
          // deliverType: this.deliverType,
          // 搜索key
          proName: this.sort.skuName,
        };
        if(this.storeName){
          url = this.$market.apiBaseURL() + '/app/json/product/getAppProSearchList';
          paramsData.storeOuCode = this.sort.storeCode;
        }else{
          url = this.$market.apiBaseURL() + '/app/json/product/getAppDesigneList';
        }
        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            this.products = data.data.list;
            this.totalCount = data.data.page.count;
          },
          error => {
          }
        );
      },
    },
    created() {
      // this.products = productCenter.getProducts();
      Bus.$on("showProductCenter", d => {
        this.setting = d;
        this.callback = this.setting.fn;
        this.show = true;
      });
      this.ouCode = this.$route.query.ouCode;
      this._getProductList();
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .modal-row{
    display: flex;
    justify-content: space-between;
    text-align:justify;
    .ivu-col{
      display:flex;
      align-items:center
      .label{
        flex-shrink:0;
        &+div{
          flex:1;
        }
      }
    }
  }
  .top-pop {
    z-index: 1999;
  }
</style>

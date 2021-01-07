/**Created by liaoyingchao on 2019-07-02.*/

<template>
  <Modal class="top-pop" v-model="show" title="店铺中心" @on-ok="sureEvent" :scrollable="true" width="800" @on-visible-change="changeProductsModal">
    <Form :model="sort" inline>
      <FormItem>
        <Input type="text" v-model="sort.skuName" placeholder="请输入标题名称" @on-keydown.enter="enterSearch">
        </Input>
      </FormItem>
      <!--<FormItem>-->
      <!--<Input type="text" v-model="sort.mchName" placeholder="请输入商店名称">-->
      <!--</Input>-->
      <!--</FormItem>-->
      <FormItem>
        <Button type="primary" @click="_loadShopList()">搜索</Button>
      </FormItem>
      <!--<FormItem style="float: right;">-->
      <!--<RadioGroup v-model="deliverType" @on-change="_getProductList('1')">-->
      <!--<Radio label="1">自提</Radio>-->
      <!--<Radio label="2">配送</Radio>-->
      <!--</RadioGroup>-->
      <!--</FormItem>-->
    </Form>
    <Row style="margin-top: 12px;" v-if="show">
      <Table border highlight-row ref="currentRowTable" :columns="RadioColumns" :data="shops" @on-current-change="currentChange" height="375">
      </Table>
      <!--<Table v-if="isMultiple == true" border ref="selectTable" :columns="selectColumns" :data="activities" @on-selection-change="selectionChange" height="375">-->
      <!--</Table>-->
    </Row>
  </Modal>
</template>

<script>
  import Bus from "../bus";
  import {deepCopy} from "@/utils/util";

  export default {
    name: "shop-center",
    components: {},
    data() {
      return {
        shops: [],
        selectedIdx: "-1",
        setting: '',
        show: false,
        backData: null,
        sort: {
          skuName: ''
        },
        callback: function () {
          console.log("no callback");
        },
        RadioColumns: [
          {
            title: "id",
            key: "id",
            width: 80
          },
          {
            title: "商店",
            key: "storeName"
          },
          {
            title: "店铺编码",
            key: "storeCode"
          }
        ],
        totalCount: 1,
        pageSize: "20",
        pageIndex: "1",
      }
    },
    methods: {
      enterSearch(e){
        e.stopPropagation();
      },
      sureEvent: function () {
        if (this.backData) {
          let d = deepCopy(this.backData);
          this.callback(d);
        } else {
          this.callback(null);
        }
        this.show = false;
      },
      changeProductsModal: function (params) {
        if (params) return false;
        // if (this.isMultiple == false) {
          this.$refs.currentRowTable.clearCurrentRow();
        // } else if (this.isMultiple == true) {
        //   this.$refs.selectTable.selectAll(false);
        // }
      },
      currentChange: function (currentRow, oldCurrentRow) {
        this.backData = currentRow;
      },
      _loadShopList: function () {
        let url = '/system/jqGrid/sys_enterprise/queryStoreList';
        let paramsData = {
          token: this.$store.state.login.token,
          rows: 10,
          page: 1,
          sysStore: {
            likeStoreCode: '',
            storeName: this.sort.skuName,
            enabled: 1,
          }
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.data) {
              this.shops = data.data;
            }
          },
          error => {
          }
        );
      }
    },
    created() {
      Bus.$on("showShopCenterSamecity", busData => {
        console.log('showShopCenterSamecity');
        this.setting = busData;
        this.callback = this.setting.fn;
        this.show = true;
      });
      this.ouCode = this.$route.query.ouCode;
      this._loadShopList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .shop-center {
    width 100%
    height 100%
    overflow hidden
  }
</style>

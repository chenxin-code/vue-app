<template>
  <div class="cancel">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="allFinish"
        :finished-text="showEmpty ? '' : '- 亲, 没有更多订单了 -'"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :immediate-check="false"
      >
        <div
          v-for="(item, index) in currentOrderList"
          :key="index"
          class="scroll"
        >
          <OrderItem
            :dataList="item.dataList"
            :params="item.params"
            :billType="item.billType"
            :amount="item.amount"
            :submitTime="item.submitTime"
            :billDetailObj="item.billDetailObj"
            :orderType="item.orderType"
            pageType="cancel"
            :orderMode="item.orderMode"
            :shoppingOrderId="item.shoppingOrderId"
            :bulkOrderType="item.bulkOrderType"
            :id="item.id"
            :tradeNo="item.tradeNo"
            :orderState="item.orderState ? item.orderState : ''"
            :shopOrderNo="item.shopOrderNo ? item.shopOrderNo : ''"
            :tag="item.tag"
            :orderItem="item"
          ></OrderItem>
        </div>
        <Empty v-show="currentOrderList.length == 0"></Empty>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import OrderItem from "../../components/order-item/order-item";
import Empty from "../../components/empty/empty.vue";
import { fetchMethod } from "@/utils/tmHttp.js";
export default {
  name: "cancel",
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      orderList: [],
      queryBadge: {},
      showEmpty: false,
      tabs: {
        text: "已取消",
        tag: "7",
        type: ["200018"],
      },
      currentOrderList: [],
      currentPage: 1,
      tmpage: 1,
      pageSize: 8,
      tmfinished: false,
      allFinish: false,
      tmerror: false,
    };
  },
  components: {
    OrderItem,
    Empty,
  },
  created() {},
  mounted() {
    this.commFn();
  },
  watch: {
    currentOrderList: function (newVal, oldVal) {
      if (newVal.length !== 0) {
        this.showEmpty = false;
      } else {
        this.showEmpty = true;
      }
    },
  },
  methods: {
    //滚动条与底部距离小于 offset 时触发
    onLoad() {
      this.refreshing = false;
      if (!this.allFinish && (this.currentPage > 1 || this.tmpage > 1)) {
        this.commFn();
      }
    },
    async commFn() {
      this.tmerror = false;
      this.error = false;
      this.refreshing = false;
      this.loading = true;
      if (!this.tmfinished) {
        await this.tMallFn();
      }
      if (!this.finished) {
        await this.ownMallFn();
      }
      await this.allLoadingFn();
    },
    allLoadingFn() {
      setTimeout((res) => {
        if (this.tmfinished && this.finished) {
          this.loading = false;
          this.allFinish = true;
        } else {
          this.allFinish = false;
        }
        if (this.tmerror && this.error) {
          this.error = true;
        } else {
          this.error = false;
        }
      }, 1000);
    },
    concatFn(list) {
      this.orderList = this.orderList.concat(list);
      /*按时间排序*/
      this.currentOrderList = this.sortKey(this.orderList, "submitTime");
    },
    /*按时间排序*/
    sortKey(array, key) {
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x > y ? -1 : x < y ? 1 : 0;
      });
    },
    /*服务商城的接口 --billType(物业清单) = 13*/
    tMallFn() {
      let param = {
        orderStateList: ["CANCELED", "CLOSE"],
        pageNum: this.tmpage,
        pageSize: this.pageSize,
      };
      console.log(this.tmpage, "this.tmpage1");
      let list = [];
      let seriveAPI = "/times-center-trade/mall/order/v1/shop/list";
      fetchMethod("POST", seriveAPI, param)
        .then((res) => {
          let { code } = res,
            { tmpage } = this;
          this.loading = false;
          if (code == 200) {
            let { data } = res,
              { records, pages, total } = data;
            if (tmpage <= pages) {
              if (tmpage == pages) {
                this.tmfinished = true;
              }
              if (records.length > 0) {
                let lists = this.formatOrderList(data);
                lists.map((item) => {
                  let init = {
                    billType: 13, //清单列表
                    amount: item.amountPay, //实付金额
                    submitTime: item.orderTime, //下单时间
                    deliverType: "", //配送方式
                    orderId: item.id, //店铺订单主键
                    orderCategory: "", // item.orderCategory,
                    orderMode: "", // item.orderMode, //
                    shoppingOrderId: "", // item.shoppingOrderId,
                    bulkOrderType: item.orderType, //团购订单类型
                    id: item.id,
                    tradeNo: item.tradeNo, //交易单号
                    orderState: item.orderState,
                    orderType: item.orderType, //订单类型
                    shopOrderNo: item.shopOrderNo,
                    params: {
                      deliverType: "", //配送方式
                      orderId: item.id,
                      orderType: item.orderType, //订单类型
                      orderCategory: "", //item.orderCategory,
                      orderStateType: "200017", // item.orderStateType,
                      state: 17, //订单状态
                      tradeNo: item.tradeNo, //交易单号
                    },
                    billDetailObj: {
                      groupBuyActivityId: "", //item.groupBuyActivityId
                      groupBuyId: "",
                      payMode: "", // item.payType,//是否是支付方式
                      tradeNo: item.tradeNo, //交易单号
                      shoppingOrderId: "", //item.shoppingOrderId
                      orderPayType: "", //item.payType,//是否是支付方式
                      id: item.id,
                      tag: "16",
                      tabIndex: 3,
                      awardActivityList: item.awardActivityList,
                    },
                  };
                  let dataList = [];
                  dataList.push({
                    billType: 13,
                    tag: 16, //状态订单
                    billImg: item.orderItemData.itemImg, //商品图片
                    billName: item.orderItemData.itemName,
                    billAmount: item.orderItemData.itemPrice,
                    billNum: item.orderItemData.buyNum,
                    skuId: item.orderItemData.skuId,
                    id: item.orderItemData.id,
                    storeOuCode: "",
                    expressNo: "",
                    expressName: "",
                    interfaceType: "",
                    deliverType: "",
                    address: item.projectName,
                    cityId: "",
                    countryId: "",
                    countryName: "",
                    provinceId: "",
                    provinceName: "",
                    townId: "",
                    townName: "",
                    receiver: item.receiverName,
                    mobile: item.receiverPhone,
                    orderState: item.orderState,
                    tradeNo: item.tradeNo,
                    orderType: item.orderType,
                    shopOrderNo: item.shopOrderNo,
                  });
                  init.dataList = dataList;
                  list.push(init);
                });
                this.concatFn(list);
              } else {
                this.tmfinished = true;
              }
            } else {
              this.tmfinished = true;
            }
            this.tmpage++;
            console.log(this.tmpage, "this.tmpage2");
          } else {
            this.tmfinished = false;
            this.tmerror = true; //大家错误状态
            this.tmfinished = true;
          }
        })
        .catch((err) => {
          this.loading = false;
          this.tmerror = true; //大家错误状态
          this.tmfinished = false;
          return false;
        });
    },
    /*自建商城的接口--billType(物业清单) = 11*/
    ownMallFn() {
      let { currentPage, pageSize } = this,
        ownlist = [];
      let obj = {
        orderType: this.tabs.type[0],
        orderTypeList: this.tabs.type,
        state: this.tabs.tag,
        page: { index: currentPage, pageSize: pageSize },
      };
      console.log(currentPage, "currentPage1");
      this.$http
        .post("/app/json/app_shopping_order/queryOrder", obj)
        .then((res) => {
          // 判断当前页数是否超过总页数或者等于总页数
          let { status, data } = res.data;
          this.loading = false;
          if (status == 0) {
            let { page, orderList } = data,
              { totalPages } = page;
            if (currentPage < totalPages || currentPage == totalPages) {
              if (orderList.length > 0) {
                orderList.map((item) => {
                  let list = {
                    billType: 11,
                    tag: 16, //状态订单
                    amount: item.realAmount,
                    submitTime: item.submitTime,
                    deliverType: item.deliverType,
                    orderId: item.id,
                    orderType: item.orderType,
                    orderCategory: item.orderCategory,
                    orderMode: item.orderMode,
                    shoppingOrderId: item.shoppingOrderId,
                    bulkOrderType: item.orderType,
                    id: item.id,
                    tradeNo: item.tradeNo,
                    params: {
                      deliverType: item.deliverType,
                      orderId: item.id,
                      orderType: item.orderType,
                      orderCategory: item.orderCategory,
                      orderStateType: item.orderStateType
                        ? item.orderStateType
                        : item.orderType,
                      state: item.state,
                      tradeNo: item.tradeNo,
                    },
                    billDetailObj: {
                      groupBuyActivityId: item.groupBuyActivityId,
                      groupBuyId: item.groupBuyId,
                      payMode: item.payMode,
                      tradeNo: item.tradeNo,
                      shoppingOrderId: item.shoppingOrderId,
                      orderPayType: item.orderPayType,
                      id: item.id,
                      tag: "16",
                      tabIndex: 3,
                      awardActivityList: item.awardActivityList,
                    },
                    dataList: item.itemAbstractList.map((sub) => {
                      return {
                        billType: 11,
                        billImg: sub.phPictureUrl,
                        billName: sub.skuName,
                        billAmount: sub.salePrice,
                        billNum: sub.number,
                        skuId: sub.skuId,
                        id: sub.id,
                        storeOuCode: item.storeOuCode,
                        expressNo: item.expressNo,
                        expressName: item.expressName,
                        interfaceType: item.interfaceType,
                        deliverType: item.deliverType,
                        address: item.address,
                        cityId: item.cityId,
                        countryId: item.countryId,
                        countryName: item.countryName,
                        provinceId: item.provinceId,
                        provinceName: item.provinceName,
                        townId: item.townId,
                        townName: item.townName,
                        receiver: item.receiver,
                        mobile: item.mobile,
                      };
                    }),
                  };

                  ownlist.push(list);
                });
              } else {
                this.finished = true;
              }
              this.concatFn(ownlist);
              if (currentPage == totalPages) {
                this.finished = true;
              }
            } else {
              this.finished = true; //如果超过总页数就显示没有更多内容了
            }
            this.currentPage++;
            console.log(this.currentPage, "currentPage2");
          } else {
            this.error = true; //大家错误状态
            this.finished = true;
          }
        })
        .catch((err) => {
          this.$toast("请求失败，点击重新加载");
          this.loading = false;
          this.error = true;
        });
    },
    /*服务商城的数据格式化*/
    formatOrderList(data) {
      //交易单
      let records = data.records;
      let recordsArray = [];
      for (let index = 0; index < records.length; index++) {
        let recordDataNew = {};
        let recordData = records[index];
        //店铺订单列表
        let orderItemList = recordData.orderItemList;
        //店铺订单列表第一个数据
        const orderItemData = (orderItemList && orderItemList[0]) || {};
        // console.log("orderItemData--->", orderItemData);
        //商品订单详情
        recordDataNew = {
          ...recordData,
          orderItemData: orderItemData,
        };
        delete recordDataNew.orderItemList;
        recordsArray.push(recordDataNew);
      }
      return recordsArray;
    },

    // 下拉刷新时触发
    onRefresh() {
      this.finished = false; //将没有更多的状态改成false
      this.allFinish = false;
      this.tmfinished = false; //服务商的加载
      this.tmpage = 1;
      this.currentPage = 1;
      this.orderList = [];
      this.currentOrderList = [];
      this.commFn();
    },
    // 初始化数据
    initData() {
      this.currentOrderList = this.orderList.map((item) => {
        return {
          billType: item.billType,
          tag: 7, //订单状态
          amount: item.realAmount,
          submitTime: item.submitTime,
          deliverType: item.deliverType,
          orderId: item.id,
          orderType: item.orderType,
          orderCategory: item.orderCategory,
          orderMode: item.orderMode,
          shoppingOrderId: item.shoppingOrderId,
          bulkOrderType: item.orderType,
          id: item.id,
          tradeNo: item.tradeNo,
          params: {
            deliverType: item.deliverType,
            orderId: item.id,
            orderType: item.orderType,
            orderCategory: item.orderCategory,
            orderStateType: item.orderStateType,
            state: item.state,
          },
          billDetailObj: {
            groupBuyActivityId: item.groupBuyActivityId,
            groupBuyId: item.groupBuyId,
            payMode: item.payMode,
            tradeNo: item.tradeNo,
            shoppingOrderId: item.shoppingOrderId,
            orderPayType: item.orderPayType,
            id: item.id,
            tag: "7",
            tabIndex: 6,
            awardActivityList: item.awardActivityList,
          },
          dataList: item.itemAbstractList.map((sub) => {
            return {
              billType: sub.billType,
              billImg: sub.phPictureUrl,
              billName: sub.skuName,
              billAmount: sub.salePrice,
              billNum: sub.number,
              skuId: sub.skuId,
              id: sub.id,
              storeOuCode: item.storeOuCode,
              expressNo: item.expressNo,
              expressName: item.expressName,
              interfaceType: item.interfaceType,
              deliverType: item.deliverType,
            };
          }),
        };
      });
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
// .scroll {
// padding-top: 10px;
// }
.cancel {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 130px;
}
</style>

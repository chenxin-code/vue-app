<template>
  <div class="waitDelivery">
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
            pageType="waitDelivery"
            :orderMode="item.orderMode"
            :shoppingOrderId="item.shoppingOrderId"
            :bulkOrderType="item.bulkOrderType"
            :id="item.id"
            :tradeNo="item.tradeNo"
            :orderState="item.orderState ? item.orderState : ''"
            :shopOrderNo="item.shopOrderNo ? item.shopOrderNo : ''"
            :tag="item.tag"
          ></OrderItem>
        </div>
        <Empty v-show="currentOrderList.length <= 0"></Empty>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import OrderItem from "../../components/order-item/order-item";
import Empty from "../../components/empty/empty.vue";
import { fetchMethod } from "@/utils/tmHttp.js";
export default {
  name: "waitDelivery",
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      orderList: [],
      massList: [],
      ownList: [],
      currentOrderList: [],
      orderList: [],
      currentPage: 1,
      tmpage: 1,
      tmfinished: false,
      allFinish: false,
      showEmpty: false,
      params: {},
      tabs: {
        text: "待发货",
        tag: "16",
        type: ["200017"],
      },
    };
  },
  components: {
    OrderItem,
    Empty,
  },
  created() {
    this.onLoad();
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
      if (!this.allFinish) {
        this.commFn();
      }

      let data = {
        tradeNo: tradeNo, //交易单
        orderType: orderType, //业态(家政，旅游)
        shoppingOrderId: shopeOrderNo, //交易单
        orderPayType: orderState, //交易单
      };
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
      let list = [],
        { tmpage } = this;
      let param = {
        orderStateList: ["PAID"],
        pageNum: tmpage,
        pageSize: 15,
      };
      let seriveAPI = "/times-center-trade/mall/order/v1/shop/list";
      fetchMethod("POST", seriveAPI, param)
        .then((res) => {
          let { code } = res;
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

              this.tmpage++;
            } else {
              this.tmfinished = true;
            }
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
      let { currentPage } = this,
        ownlist = [];
      let obj = {
        orderType: this.tabs.type[0],
        orderTypeList: this.tabs.type,
        state: this.tabs.tag,
        page: { index: currentPage, pageSize: 15 },
      };
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
      this.currentOrderList = [];
      this.orderList = [];
      this.commFn();
      return;
    },
    // 初始化数据--暂时不用
    initData() {
      let currentOrderList = [];
      currentOrderList = this.orderList.map((item) => {
        return {
          billType: item.billType,
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
      });
      this.currentOrderList = this.currentOrderList.concat(currentOrderList);
    },
    /*之前的自建代发货的接口--暂时不用*/
    oldOwnFn() {
      this.currentPage = 0; /*默认设置*/
      this.loading = true;
      let page = this.currentPage;
      page = page + 1;
      this.currentPage = page;
      this.refreshing = false;
      let obj = {
        orderType: this.tabs.type[0],
        orderTypeList: this.tabs.type,
        state: this.tabs.tag,
        page: { index: currentPage, pageSize: 30 },
      };
      this.$http
        .post("/app/json/app_shopping_order/queryOrder", obj)
        .then((res) => {
          // 判断当前页数是否超过总页数或者等于总页数
          if (
            page < res.data.data.page.totalPages ||
            page == res.data.data.page.totalPages
          ) {
            if (res.data.data.page.totalPages == page) {
              this.finished = true;
            }
            if (res.data.status == 0) {
              var indexList = res.data.data.orderList; //将请求到的内容赋值给一个变量
              this.orderList = this.orderList.concat(indexList);
              if (this.orderList.length > 0) {
                this.orderList.forEach((item) => {
                  item["billType"] = 11;
                  item.itemAbstractList.forEach((tab) => {
                    tab["billType"] = 11;
                  });
                });
                this.initData();
              } else {
                this.currentOrderList = [];
              }
              this.page = res.data.data.page.totalPages; //将总页数赋值给this
              // 加载状态结束
              this.loading = false;
            } else {
              this.loading = false; //将加载状态关掉
              this.error = true; //大家错误状态
            }
          } else {
            this.finished = true; //如果超过总页数就显示没有更多内容了
          }
        })
        .catch((err) => {
          this.$toast("请求失败，点击重新加载");
          this.loading = false;
          this.error = true;
        });
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
// .scroll {
// padding-top: 10px;
// }
.waitDelivery {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 130px;
}
</style>

<template>
  <div class="waitTakeDelivery">
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
            pageType="waitTakeDelivery"
            :orderMode="item.orderMode"
            :shoppingOrderId="item.shoppingOrderId"
            :bulkOrderType="item.bulkOrderType"
            :id="item.id"
            :tradeNo="item.tradeNo"
            :orderState="item.orderState ? item.orderState : ''"
            :shopOrderNo="item.shopOrderNo ? item.shopOrderNo : ''"
            :orderItem="item"
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
  name: "waitTakeDelivery",

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
      currentPage: 1,
      tmpage: 1,
      tmfinished: false,
      allFinish: false,
      showEmpty: false,
      params: {},
      tabs: {
        // text: '待收(提)货',
        text: "待收货",
        tag: "4",
        type: ["200017"],
      },
      deliveryType: "",
    };
  },
  components: {
    OrderItem,
    Empty,
  },
  created() {
    this.deliveryType = this.$store.state.mall2.staticDeliverType
      ? this.$store.state.mall2.staticDeliverType
      : "2";
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
    },
    async commFn() {
      this.tmerror = false;
      this.error = false;
      this.loading = true;
      if (!this.tmfinished) {
        // console.log("服务商城");
        await this.tMallFn();
      }
      if (!this.finished) {
        // console.log("自建商城");
        await this.ownMallFn();
      }
      await this.allLoadingFn();
    },
    /*服务商城的接口 --billType(物业清单) = 13*/
    tMallFn() {
      let list = [],
        { tmpage } = this;
      let param = {
        orderStateList: ["ON_GOING"],
        pageNum: tmpage,
        pageSize: 15,
      };
      let seriveAPI = "/times-center-trade/mall/order/v1/shop/list";
      fetchMethod("POST", seriveAPI, param).then((res) => {
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
                  tag: 4, //状态订单
                  amount: item.amountPay, //实付金额
                  submitTime: item.orderTime, //下单时间
                  deliverType: item.deliverType, //配送方式
                  orderId: item.id, //店铺订单主键
                  orderCategory: "", // item.orderCategory,
                  orderMode: "", // item.orderMode, //
                  shoppingOrderId: "", // item.shoppingOrderId,
                  bulkOrderType: item.orderType, //订单类型
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
                    orderStateType: "", // item.orderStateType,
                    state: item.orderState, //订单状态
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
                    tag: "4",
                    tabIndex: 4,
                    awardActivityList: item.awardActivityList,
                  },
                };
                let dataList = [];
                dataList.push({
                  billType: 13,
                  tag: "4",
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
          this.tmfinished = true;
          this.massList = [];
          this.tmerror = true; //大家错误状态
          this.loading = false;
        }
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
      if (this.tabs.tag == 4) {
        obj.deliverType = this.deliveryType;
        if (this.deliveryType == 2) {
          obj.deliverTypeList = [2, 3];
        }
      }
      this.$http
        .post("/app/json/app_shopping_order/queryOrder", obj)
        .then((res) => {
          // 判断当前页数是否超过总页数或者等于总页数
          let { status, data } = res.data,
            { page, orderList } = data,
            { totalPages } = page;
          this.loading = false;
          if (status == 0) {
            if (currentPage <= totalPages) {
              if (totalPages == currentPage) {
                this.finished = true;
              }
              if (orderList.length > 0) {
                orderList.map((item) => {
                  let list = {
                    billType: 11,
                    tag: 4, //状态订单
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
                      tag: "4",
                      tabIndex: 4,
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
                this.concatFn(ownlist);
              } else {
                ownlist = [];
                this.finished = true;
              }
              this.currentPage++;
            } else {
              this.finished = true; //如果超过总页数就显示没有更多内容了
            }
          } else {
            this.error = true; //大家错误状态
          }
        })
        .catch((err) => {
          this.$toast("请求失败，点击重新加载");
          this.loading = false;
          this.error = true;
        });
    },
    allLoadingFn() {
      setTimeout((res) => {
        if (this.tmfinished && this.finished) {
          this.loading = false;
          this.allFinish = true;
          this.loading = false;
        } else {
          this.allFinish = false;
        }
        if (this.tmerror && this.error) {
          this.error = true;
          this.loading = false;
        } else {
          this.error = false;
        }
      }, 500);
    },
    concatFn(list) {
      this.orderList = this.orderList.concat(list);
      /*按时间排序*/
      this.currentOrderList = this.sortKey(this.orderList, "submitTime");
      console.log(this.currentOrderList, "this.currentOrderList-concat");
      //   this.$forceUpdate();
    },
    /*按时间排序*/
    sortKey(array, key) {
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x > y ? -1 : x < y ? 1 : 0;
      });
    },
    // 下拉刷新时触发
    onRefresh() {
      this.finished = false; //将没有更多的状态改成false
      this.currentPage = 1;
      this.allFinish = false;
      this.tmfinished = false; //服务商的加载
      this.tmpage = 1;
      this.currentOrderList = [];
      this.commFn();
    },
    /*服务商城的数据格式化*/
    formatOrderList(data) {
      console.log(data, "data");
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
        console.log("orderItemData--->", orderItemData);
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
    // 初始化数据
    initData() {
      this.currentOrderList = this.orderList.map((item) => {
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
          },
          billDetailObj: {
            groupBuyActivityId: item.groupBuyActivityId,
            groupBuyId: item.groupBuyId,
            payMode: item.payMode,
            tradeNo: item.tradeNo,
            shoppingOrderId: item.shoppingOrderId,
            orderPayType: item.orderPayType,
            id: item.id,
            tag: "4",
            tabIndex: 4,
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
.waitTakeDelivery {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 130px;
}
</style>
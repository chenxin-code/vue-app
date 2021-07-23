<template>
  <div class="waitDelivery">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
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
          ></OrderItem>
        </div>
        <Empty v-show="showEmpty"></Empty>
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
      currentPage: 1,
      tmpage: 1,
      totalPage: 0,
      page: 0,
      showEmpty: false,
      currentOrderList: [],
      currentOrderLists: [],
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
    /*服务商城的订单*/
    // orderStateList: ["PAID"]/["ON_GOING"]
    // pageNum: 1
    // pageSize: 10
    // 服务商城的已支付订单'/times-center-trade/mall/order/v1/shop/list'
    // 服务商城的进行中订单'/times-center-trade/mall/order/v1/shop/list'
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
      //   let page = this.currentPage;
      //   page = page + 1;
      //   this.currentPage = page;
      this.loading = true;
      let { currentPage } = this;
      this.refreshing = false;
      let obj = {
        orderType: this.tabs.type[0],
        orderTypeList: this.tabs.type,
        state: this.tabs.tag,
        page: { index: currentPage, pageSize: 15 },
      };

      this.commFn(obj);
    },
    async commFn(obj, param) {
      await this.tMallFn();
      await this.ownMallFn(obj);
      //   await this.concatFn();
    },
    concatFn() {
      console.log(this.massList, this.currentOrderList, "currentOrderList");
      this.currentOrderLists.concat(this.massList, this.currentOrderList);
      console.log(this.currentOrderLists, "currentOrderLists");
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
      fetchMethod("POST", seriveAPI, param).then((res) => {
        let { code, data } = res,
          { records, pages, total } = data;
        if (code == 200) {
          if (tmpage < pages || tmpage == pages) {
            if (records.length > 0) {
              let lists = this.formatOrderList(data);
              lists.map((item) => {
                let init = {
                  billType: 13, //清单列表
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
                    tag: "16",
                    tabIndex: 3,
                    awardActivityList: item.awardActivityList,
                  },
                };
                let dataList = [];
                dataList.push({
                  billType: 13,
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
              //   this.massList = this.massList.concat(list);
              this.currentOrderList = this.currentOrderList.concat(list);
            }
            this.tmpage++;
          }
        } else {
          this.massList = [];
        }
      });
    },
    /*自建商城的接口--billType(物业清单) = 11*/
    ownMallFn(obj) {
      let { currentPage } = this;
      this.$http
        .post("/app/json/app_shopping_order/queryOrder", obj)
        .then((res) => {
          // 判断当前页数是否超过总页数或者等于总页数
          if (
            currentPage < res.data.data.page.totalPages ||
            currentPage == res.data.data.page.totalPages
          ) {
            if (res.data.data.page.totalPages == currentPage) {
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
              this.currentPage++;
              //   this.page = res.data.data.page.totalPages; //将总页数赋值给this
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
    // 下拉刷新时触发
    onRefresh() {
      let page = 1; //从第一页开始
      this.page = page; //将当前页数赋值给this
      this.finished = false; //将没有更多的状态改成false
      this.loading = true; //将下拉刷新状态改为true开始刷新
      this.currentPage = 1;
      let obj = {
        orderType: this.tabs.type[0],
        orderTypeList: this.tabs.type,
        state: this.tabs.tag,
        page: { index: page, pageSize: 10 },
      };
      this.$http
        .post("/app/json/app_shopping_order/queryOrder", obj)
        .then((res) => {
          if (res.data.status == 0) {
            this.orderList = res.data.data.orderList;
            if (this.orderList.length > 0) {
              this.orderList.forEach((item) => {
                item["billType"] = 11;
                item.itemAbstractList.forEach((tab) => {
                  tab["billType"] = 11;
                });
              });
              this.initData();
            }
            this.totalPage = res.data.totalPages; //将总页数赋值上去
            this.$toast("刷新成功");
            this.loading = false;
            this.refreshing = false; //刷新成功后将状态关掉
          }
        })
        .catch((res) => {
          this.$toast("网络繁忙,请稍后再试~");
        });
    },
    // 初始化数据
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
      console.log(this.currentOrderList, "this.currentOrderList");
    },
    /*自建代发货的接口*/
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

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
        offset="10"
      >
        <div
          v-for="(item,index) in currentOrderList"
          :key="item.id +'_'+index"
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
            :orderItem="item"
            :tag="item.tag"
          ></OrderItem>
        </div>
        <Empty v-show="currentOrderList.length <= 0 && !loading"></Empty>
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
      pageSize: 5,
      tmfinished: false,
      allFinish: false,
      showEmpty: false,
      params: {},
      tabs: {
        text: "待发货",
        tag: "16",
        type: ["200017"]
      }
    };
  },
  components: {
    OrderItem,
    Empty
  },
  created() {
    this.onLoad();
  },
  watch: {
    currentOrderList: function(newVal, oldVal) {
      if (newVal.length !== 0) {
        this.showEmpty = false;
      } else {
        this.showEmpty = true;
      }
    }
  },
  methods: {
    //滚动条与底部距离小于 offset 时触发
    onLoad() {
      this.refreshing = false;
      this.loading = true;
      if (this.allFinish) {
        return;
      }
      this.commFn();
    },
    commFn() {
      Promise.allSettled([this.tMallFn(), this.ownMallFn()]).then(res => {
        let ownData = "",
          tmallData = "";
        tmallData = res[0];
        ownData = res[1];
        this.loading = false;
        if (tmallData && tmallData.status == "fulfilled") {
          this.tmallDataFn(tmallData.value);
        }
        if (ownData && ownData.status == "fulfilled") {
          this.ownDataFn(ownData.value);
        }
        this.allLoadingFn();
      });
    },
    /*服务商城的接口 --billType(物业清单) = 13*/
    tMallFn() {
      let list = [],
        { tmpage, pageSize } = this;
      let param = {
        orderStateList: ["PAID"],
        pageNum: tmpage,
        pageSize: pageSize
      };
      return new Promise((resolve, reject) => {
        let seriveAPI = "/times-center-trade/mall/order/v1/shop/list";
        fetchMethod("POST", seriveAPI, param)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
            this.loading = false;
            //   this.loading = false;
            //   this.tmerror = true; //大家错误状态
            //   this.tmfinished = false;
            //   return false;
          });
      });
    },
    /*服务商城的数据*/
    tmallDataFn(res) {
      let { code, data } = res,
        { tmpage } = this;
      this.loading = false;
      if (code == 200) {
        let { records, pages } = data;
        this.tmpage++;
        let list = [];
        if (tmpage <= pages) {
          if (tmpage == pages) {
            this.tmfinished = true;
          }
          if (records.length > 0) {
            let lists = this.formatOrderList(data);
            lists.map(item => {
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
                  tradeNo: item.tradeNo //交易单号
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
                  awardActivityList: item.awardActivityList
                }
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
                shopOrderNo: item.shopOrderNo
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
      } else {
        this.tmfinished = false;
        this.tmerror = true; //大家错误状态
        this.tmfinished = true;
      }
    },
    /*自建商城的接口--billType(物业清单) = 11*/
    ownMallFn() {
      return new Promise((resolve, reject) => {
        let { currentPage, pageSize } = this;
        let obj = {
          orderType: this.tabs.type[0],
          orderTypeList: this.tabs.type,
          state: this.tabs.tag,
          page: { index: currentPage, pageSize: pageSize }
        };
        this.$http
          .post("/app/json/app_shopping_order/queryOrder", obj)
          .then(res => {
            resolve(res);
          })
          .catch(error => {
            reject(error);
            this.loading = false;
          });
      });
    },
    /*自建商城的数据*/
    ownDataFn(res) {
      // 判断当前页数是否超过总页数或者等于总页数
      let { status, data } = res.data;
      let { currentPage } = this;
      this.loading = false;
      if (status == 0) {
        let ownlist = [];
        let { page, orderList } = data,
          { totalPages } = page;
        if (currentPage < totalPages || currentPage == totalPages) {
          if (currentPage == totalPages) {
            this.finished = true;
          }
          this.currentPage++;
          if (orderList.length > 0) {
            orderList.map(item => {
              let list = {
                billType: 11,
                tag: 16, //状态订单
                amount: item.payAmount,
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
                  tradeNo: item.tradeNo
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
                  awardActivityList: item.awardActivityList
                },
                dataList: item.itemAbstractList.map(sub => {
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
                    mobile: item.mobile
                  };
                })
              };
              ownlist.push(list);
            });
            this.concatFn(ownlist);
          } else {
            this.finished = true;
          }
        } else {
          this.finished = true; //如果超过总页数就显示没有更多内容了
        }
      } else {
        this.error = true; //大家错误状态
        this.finished = true;
      }
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
          orderItemData: orderItemData
        };
        delete recordDataNew.orderItemList;
        recordsArray.push(recordDataNew);
      }
      return recordsArray;
    },
    /*按时间排序*/
    sortKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return x > y ? -1 : x < y ? 1 : 0;
      });
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
      this.onLoad();
      return;
    },
    concatFn(list) {
      this.orderList = this.orderList.concat(list);
      /*按时间排序*/
      this.currentOrderList = this.sortKey(this.orderList, "submitTime");
    },
    allLoadingFn() {
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
      console.log(this.allFinish, "allFinishl--loading2");
    },

    // 初始化数据--暂时不用
    initData() {
      let currentOrderList = [];
      currentOrderList = this.orderList.map(item => {
        return {
          billType: item.billType,
          amount: item.payAmount,
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
            tradeNo: item.tradeNo
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
            awardActivityList: item.awardActivityList
          },
          dataList: item.itemAbstractList.map(sub => {
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
              mobile: item.mobile
            };
          })
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
        page: { index: currentPage, pageSize: 30 }
      };
      this.$http
        .post("/app/json/app_shopping_order/queryOrder", obj)
        .then(res => {
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
                this.orderList.forEach(item => {
                  item["billType"] = 11;
                  item.itemAbstractList.forEach(tab => {
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
        .catch(err => {
          this.$toast("请求失败，点击重新加载");
          this.loading = false;
          this.error = true;
        });
    },

    ollld() {
      if (!this.finished) {
        let { currentPage, pageSize } = this,
          ownlist = [];
        let obj = {
          orderType: this.tabs.type[0],
          orderTypeList: this.tabs.type,
          state: this.tabs.tag,
          page: { index: currentPage, pageSize: pageSize }
        };
        this.$http
          .post("/app/json/app_shopping_order/queryOrder", obj)
          .then(res => {
            // 判断当前页数是否超过总页数或者等于总页数
            let { status, data } = res.data;
            this.loading = false;
            if (status == 0) {
              let { page, orderList } = data,
                { totalPages } = page;

              if (currentPage < totalPages || currentPage == totalPages) {
                if (currentPage == totalPages) {
                  this.finished = true;
                }
                this.currentPage++;
                if (orderList.length > 0) {
                  orderList.map(item => {
                    let list = {
                      billType: 11,
                      tag: 16, //状态订单
                      amount: item.payAmount,
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
                        tradeNo: item.tradeNo
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
                        awardActivityList: item.awardActivityList
                      },
                      dataList: item.itemAbstractList.map(sub => {
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
                          mobile: item.mobile
                        };
                      })
                    };

                    ownlist.push(list);
                  });
                } else {
                  this.finished = true;
                }
                this.concatFn(ownlist);
              } else {
                this.finished = true; //如果超过总页数就显示没有更多内容了
              }
            } else {
              this.error = true; //大家错误状态
              this.finished = true;
            }
          })
          .catch(err => {
            this.$toast("请求失败，点击重新加载");
            this.loading = false;
            this.error = true;
          });
      }
    }
  }
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

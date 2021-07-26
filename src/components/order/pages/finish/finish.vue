<template>
  <div
    class="finish"
    :class="{
      'finish-x': this.$util.getIsIphoneX_X(),
      'empty-page': showEmpty
    }"
  >
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      class="refresh-page"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="showEmpty ? '' : '- 亲, 没有更多订单了 -'"
        @load="onLoad"
        :error.sync="error"
        :error-text="errorText"
        :immediate-check="true"
      >
        <property-bill v-show="isLoadPropertyBill" :results="billResults" />
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
            :billId="item.billId"
            pageType="finish"
            :state="item.state"
            :orderCanEvaluate="item.orderCanEvaluate"
            :shoppingOrderId="item.shoppingOrderId"
            :bulkOrderType="item.bulkOrderType"
            :id="item.id"
            :tradeNo="item.tradeNo"
          ></OrderItem>
        </div>
        <Empty v-show="showEmpty"></Empty>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import propertyBill from "@/components/order/components/bill-item2/bill-item";
import OrderItem from "../../components/order-item/order-item";
import Empty from "../../components/empty/empty.vue";
import appLocalstorage from "@zkty-team/x-engine-module-localstorage";
export default {
  name: "finish",
  data() {
    return {
      userRoomId: "",
      loading: false,
      finished: false,
      error: false,
      errorText: "请求失败，点击重新加载",
      properWorng: false,
      refreshing: false,
      refresh: false,
      orderList: [],
      currentPage: 1,
      totalPage: 0,
      queryBadge: {},
      page: 0,
      index: 0,
      showEmpty: false,
      currentOrderList: [],
      tabs: {
        text: "已完成",
        tag: "9",
        type: ["200017"]
      },
      isLoadPropertyBill: false, //是否加载物业缴费账单组件
      billResults: [], //物业缴费数据
      reqBillType: "2,3,4,5,6,7,8,9,10,11,14" //账单类型 1-物业收费账单,2-月保续费账单,3-停车费账单,4-临时收费账单,5-零售,6-预缴费,7-旅游,8-家政,9-拎包,10-押金,11-新零售,12-美居,13-服务商城,14-维修服务费
    };
  },
  components: {
    propertyBill,
    OrderItem,
    Empty
  },
  created() {
    this.getRoomId();
  },
  mounted() {
    this.onLoad();
  },
  methods: {
    //获取原生人房
    getRoomId() {
      appLocalstorage
        .get({ key: "LLBUserRoomId", isPublic: true })
        .then(res => {
          if (res.hasOwnProperty("result")) {
            this.userRoomId = res.result;
          } else {
            this.userRoomId = "";
          }
        });
    },
    //获取物业账单列表
    propertyFn() {
      let airDefenseNoStr = this.userRoomId
        ? this.userRoomId
        : this.$store.state.userRoomId;
      let airDefenseNo = airDefenseNoStr.replace(/\|/gi, ","); //正则，将所有"|"替换成","
      let propertyObj = {
        airDefenseNo: airDefenseNo,
        memberId: this.$store.state.userInfo.phone
          ? this.$store.state.userInfo.phone
          : "",
        status: 90, //账单状态 10-待支付 90-成功
        type: 1, //type 1、列表 2、详情
        pageNo: "",
        pageTimes: ""
      };
      let url = "";
      this.$store.state.environment == "development"
        ? (url =
            "http://m-center-uat.linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList")
        : (url =
            "https://m-center-prod-linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList");
      return new Promise((resolve, reject) => {
        this.$http.get(url, { params: propertyObj }).then(
          res => {
            resolve(res);
          },
          err => {
            reject(err);
          }
        );
      });
    },
    //获取电商订单列表
    orderFn() {
      //这里是帮租售在uat加15类型测试的，不上生产环境
      if (this.$store.state.environment == "development") {
        this.reqBillType = "2,3,4,5,6,7,8,9,10,11,14,15";
      }

      let obj = {
        orderType: this.tabs.type[0],
        orderTypeList: this.tabs.type,
        // state: this.tabs.tag,
        page: { index: this.currentPage, pageSize: 5 },
        airDefenseNo: this.userRoomId
          ? this.userRoomId
          : this.$store.state.userRoomId,
        billType: this.reqBillType
      };

      return new Promise((resolve, reject) => {
        this.$http
          .post("/app/json/app_shopping_order/findOrderFormList", obj)
          .then(
            res => {
              resolve(res);
            },
            err => {
              reject(err);
            }
          );
      });
    },

    //滚动条与底部距离小于 offset 时触发
    onLoad() {
      this.loading = true;
      let orderError = false;
      let propertyError = false;
      let promiseArr = "";

      if (this.currentPage > 1 && !this.properWorng) {
        //如果当前页数大于1，那么说明是下滑分页的操作，因为物业账单没有分页，所以此时只需要请求电商订单的接口就好，不需要再请求物业账单接口了
        promiseArr = [this.orderFn()];
      } else {
        promiseArr = [this.propertyFn(), this.orderFn()];
      }
      Promise.allSettled(promiseArr).then(res => {
        let propertyRes = "";
        let orderRes = "";
        if (res.length == 2) {
          //如果是初始化或者是下拉刷新，会请求两个接口，此时res的长度就是2。所以物业账单和电商订单都要根据对应下标拿数据
          propertyRes = res[0];
          orderRes = res[1];
        } else {
          propertyRes = "";
          orderRes = res[0];
        }
        //这里是物业账单接口返回的数据处理逻辑
        if (propertyRes && propertyRes.status === "fulfilled") {
          let results = propertyRes.value.data;
          //接口发送请求成功
          if (results.code === 200) {
            this.billResults = results.data.finish;
          } else {
            this.billResults = [];
          }
          if (this.billResults.length) {
            this.isLoadPropertyBill = true;
          } else {
            //如果没有物业账单数据，则不显示物业账单标题
            this.isLoadPropertyBill = false;
          }
        } else {
          if (propertyRes) {
            this.loading = false;
            this.error = true;
            propertyError = true;
            this.properWorng = true;
          } else {
            this.loading = false;
            //如果propertyRes为空，则说明是翻页操作，此时error要为false，否则会提示物业账单错误信息
            this.error = false;
            propertyError = false;
            this.properWorng = false;
          }
        }

        //这里是电商订单接口返回的数据处理逻辑
        if (orderRes && orderRes.status === "fulfilled") {
          let orderResult = orderRes.value.data;
          let { data } = orderResult;
          // 判断当前页数是否超过总页数或者等于总页数
          let dataPages = 0;
          if (data.pages == 0) {
            dataPages = 1;
          } else {
            dataPages = data.pages;
          }

          if (this.currentPage <= dataPages) {
            //如果当前页数等于接口返回的页数，那么finished为true，否则会一直加载接口
            if (data.pages == this.currentPage) {
              this.finished = true;
            }
            if (orderResult.status == 0) {
              // var indexList = data.records; //将请求到的内容赋值给一个变量
              var indexList = data.records.filter(
                item =>
                  item.billType != 11 ||
                  (item.orderStateType == "200017" && item.state == 9)
              );
              this.orderList =
                this.currentPage == 1
                  ? indexList
                  : this.orderList.concat(indexList);
              this.page = data.pages; //将总页数赋值给this
              if (this.orderList.length !== 0) {
                this.initData();
              } else {
                this.currentOrderList = [];
                this.finished = true;
              }
              // 加载状态结束
              this.loading = false;
            } else {
              // 加载状态结束
              this.loading = false; //将加载状态关掉
              this.error = true; //大家错误状态
            }
            this.currentPage++;
          } else {
            this.finished = true; //如果超过总页数就显示没有更多内容了
          }
        } else {
          this.loading = false; // 加载状态结束
          this.error = true;
          orderError = true;
        }

        if (propertyError && orderError) {
          this.finished = false;
          this.errorText = "物业账单和订单请求失败，点击重新加载";
          this.$toast("物业账单和订单请求失败，点击重新加载");
        } else if (propertyError && !orderError) {
          this.finished = false;
          this.errorText = "物业账单请求失败，点击重新加载";
          this.$toast("物业账单请求失败，点击重新加载");
        } else if (!propertyError && orderError) {
          this.finished = false;
          this.errorText = "订单请求失败，点击重新加载";
          this.$toast("订单请求失败，点击重新加载");
        }

        //如果物业账单列表和电商订单列表都为空,并且请求不出错的情况下，则显示页面显示空状态
        if (
          this.billResults.length === 0 &&
          this.currentOrderList.length === 0 &&
          !this.error
        ) {
          this.showEmpty = true;
        } else {
          this.showEmpty = false;
        }

        //判断是否为下拉刷新操作，如果是，刷新成功后要将状态关掉
        if (this.refresh && !this.error) {
          this.$toast("刷新成功");
          this.refreshing = false;
        }
      });
    },

    // 下拉刷新时触发
    onRefresh() {
      let page = 1; //从第一页开始
      this.page = page; //将当前页数赋值给this
      this.currentPage = 1;
      this.finished = false; //将没有更多的状态改成false
      // this.refreshing = true;
      this.refreshing = false;
      this.refresh = true;
      this.onLoad();
    },
    // 初始化数据
    initData() {
      this.currentOrderList = this.orderList.map(item => {
        return {
          billType: item.billType,
          billId: item.billId,
          amount: item.totalPrice,
          submitTime: item.submitTime,
          deliverType: item.deliverType,
          orderId: item.id,
          orderType: item.orderStateType,
          orderCategory: item.orderCategory,
          orderCanEvaluate: item.orderCanEvaluate,
          state: item.state,
          bulkOrderType: item.orderType,
          shoppingOrderId: item.shoppingOrderId,
          id: item.id,
          tradeNo: item.tradeNo,
          params: {
            deliverType: item.deliverType,
            orderId: item.id,
            orderType: item.orderStateType,
            orderCategory: item.orderCategory,
            orderCanEvaluate: item.orderCanEvaluate,
            orderStateType: item.orderStateType,
            state: item.state,
            shoppingOrderId: item.shoppingOrderId
          },
          // case 17:
          //   return "支付已完成 · 待发货";
          // case 4:
          //   return "支付已完成 · 待收货";
          // case 9:
          //   return "订单已完成";
          // case 12:
          //   return "订单已取消";
          billDetailObj: {
            businessCstNo: item.loginUserPhone,
            groupBuyActivityId: item.groupBuyActivityId,
            groupBuyId: item.groupBuyId,
            payMode: item.payMode,
            tradeNo: item.tradeNo,
            shoppingOrderId: item.shoppingOrderId,
            orderPayType: item.orderPayType,
            id: item.id,
            tag:
              item.state == 17
                ? "16"
                : item.state == 16
                ? "16"
                : item.state == 4
                ? "4"
                : item.state == 9
                ? "9"
                : item.state == 12
                ? "7"
                : item.state,
            tabIndex: 5,
            awardActivityList: item.awardActivityList,
            isRefund: item.isRefund
          },
          dataList: item.orderFormItemList.map(sub => {
            return {
              billType: item.billType,
              billImg: sub.iconUrl,
              billName: sub.name,
              billAmount: sub.unitPrice,
              billNum: sub.quantity,
              skuId: sub.itemId,
              id: sub.itemId,
              storeOuCode: sub.storeOuCode,
              expressNo: item.expressNo,
              expressName: item.expressName,
              interfaceType: item.interfaceType,
              deliverType: item.deliverType,
              itemTypeName: sub.itemTypeName,
              snapshotTime: sub.snapshotTime,
              info: sub.info,
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
              itemOrderId: sub.itemOrderId
            };
          })
        };
      });
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
// .scroll {
//   padding-top: 10px;
// }
.finish{
  height 100%;
  overflow-y auto;
  padding-bottom: 130px;
  &.finish-x {
    padding-bottom: 150px;
  }
  &.empty-page {
    overflow-y: hidden;
  }
  .refresh-page {
    min-height: 100%;
  }
}
</style>

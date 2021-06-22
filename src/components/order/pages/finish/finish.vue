<template>
  <div class="finish">
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
        <Empty v-show="showEmpty && billResults.length === 0"></Empty>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import propertyBill from "@/components/order/components/bill-item2/bill-item";
import OrderItem from "../../components/order-item/order-item";
import Empty from "../../components/empty/empty.vue";
export default {
  name: "finish",
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      orderList: [],
      currentPage: 0,
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
    // this.onLoad();
    this.initPropert();
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
      this.loading = true;
      let page = this.currentPage;
      page = page + 1;
      this.currentPage = page;
      this.refreshing = false;
      let obj = {
        orderType: this.tabs.type[0],
        orderTypeList: this.tabs.type,
        // state: this.tabs.tag,
        page: { index: page, pageSize: 30 },
        airDefenseNo: this.$store.state.userRoomId,
        // airDefenseNo:
        //   "5B348999FEC0415CB63A12D7CEEC0A13|97F3477ABD5F42C695E3945A7DDB059C|801d1908ee804d68b439a33a518a2fc0|754e92fd503c4776a721f1dae97382ad",
        billType: this.reqBillType
      };
      this.$http
        .post("/app/json/app_shopping_order/findOrderFormList", obj)
        .then(res => {
          // 判断当前页数是否超过总页数或者等于总页数
          let dataPages = 0;
          if (res.data.data.pages == 0) {
            dataPages = 1;
          } else {
            dataPages = res.data.data.pages;
          }
          if (page < dataPages || page == dataPages) {
            if (res.data.data.pages == page) {
              this.finished = true;
            }
            if (res.data.status == 0) {
              var indexList = res.data.data.records; //将请求到的内容赋值给一个变量
              this.orderList = this.orderList.concat(indexList);
              this.page = res.data.data.pages; //将总页数赋值给this
              if (this.orderList.length !== 0) {
                this.initData();
              } else {
                this.currentOrderList = [];
              }
              // 加载状态结束
              this.loading = false;
              // 如果物业账单没有数据，则隐藏组件
              if (this.billResults.length) {
                this.isLoadPropertyBill = true;
              } else {
                this.isLoadPropertyBill = false;
              }
            } else {
              this.loading = false; //将加载状态关掉
              // 如果物业账单没有数据，则隐藏组件
              if (this.billResults.length) {
                this.isLoadPropertyBill = true;
              } else {
                this.isLoadPropertyBill = false;
              }
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
    // 下拉刷新时触发
    onRefresh() {
      let page = 1; //从第一页开始
      this.page = page; //将当前页数赋值给this
      this.finished = false; //将没有更多的状态改成false
      this.loading = true; //将下拉刷新状态改为true开始刷新
      this.currentPage = 1;

      this.loading = true;
      let airDefenseNoStr = this.$store.state.userRoomId;
      // let airDefenseNoStr =
      //   "5B348999FEC0415CB63A12D7CEEC0A13|97F3477ABD5F42C695E3945A7DDB059C|801d1908ee804d68b439a33a518a2fc0|754e92fd503c4776a721f1dae97382ad"; //测试
      let airDefenseNo = airDefenseNoStr.replace(/\|/gi, ","); //正则，将所有"|"替换成","
      let propertyObj = {
        airDefenseNo: airDefenseNo,
        memberId: this.$store.state.userInfo.phone,
        status: 90, //账单状态 10-待支付 90-成功
        type: 1, //type 1、列表 2、详情
        pageNo: "",
        pageTimes: ""
      };

      // let url = "/times/charge-bff/order-center/api-c/v1/getList";
      let url = "";
      this.$store.state.environment == "development"
        ? (url =
            "https://m-center-uat.linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList")
        : (url =
            "https://m-center-prod-linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList");
      this.$http
        .get(url, { params: propertyObj })
        .then(res => {
          let data = res.data.data;
          if (res.data.code === 200) {
            this.billResults = data.finish;
          } else {
            this.billResults = [];
          }
          this.loading = false;
        })
        .finally(() => {
          let obj = {
            orderType: this.tabs.type[0],
            orderTypeList: this.tabs.type,
            // state: this.tabs.tag,
            page: { index: page, pageSize: 30 },
            airDefenseNo: this.$store.state.userRoomId,
            billType: this.reqBillType
          };
          this.$http
            .post("/app/json/app_shopping_order/findOrderFormList", obj)
            .then(res => {
              if (res.data.status == 0) {
                this.orderList = res.data.data.records;
                this.totalPage = res.data.data.pages; //将总页数赋值上去
                if (this.orderList.length !== 0) {
                  this.initData();
                }
                this.$toast("刷新成功");
                this.loading = false;
                this.refreshing = false; //刷新成功后将状态关掉
              }
            })
            .catch(res => {
              this.$toast("网络繁忙,请稍后再试~");
            });
        });
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
    },

    //物业缴费列表接口
    initPropert() {
      this.loading = true;
      let airDefenseNoStr = this.$store.state.userRoomId;
      // let airDefenseNoStr =
      //   "6A0FCB11DF314A35A855F0A6372C6EBE,33cc09d4ecbf4c229006ea1fce3c0443,B2EAAE173C1D46FDE053D40C010ADDB8,3bb9ccb03dab4468920966c0bb639335,234273bba0804b8c8c12635b3d8bfcb0,ce4351406edb4dd2a1dcf46898e17b24"; //测试
      let airDefenseNo = airDefenseNoStr.replace(/\|/gi, ","); //正则，将所有"|"替换成","

      let propertyObj = {
        airDefenseNo: airDefenseNo,
        memberId: this.$store.state.userInfo.phone,
        status: 90, //账单状态 10-待支付 90-成功
        type: 1, //type 1、列表 2、详情
        pageNo: "",
        pageTimes: ""
      };

      // let url = "/times/charge-bff/order-center/api-c/v1/getList";
      let url = "";
      this.$store.state.environment == "development"
        ? (url =
            "https://m-center-uat.linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList")
        : (url =
            "https://m-center-prod-linli.timesgroup.cn/times/charge-bff/order-center/api-c/v1/getList");
      this.$http
        .get(url, { params: propertyObj })
        .then(res => {
          let data = res.data.data;
          if (res.data.code === 200) {
            this.billResults = data.finish;
          } else {
            this.billResults = [];
          }
          this.loading = false;
        })
        .finally(() => {
          this.onLoad();
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
}
</style>

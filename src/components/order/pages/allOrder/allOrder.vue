<template>
  <div class="allOrder">
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
          v-for="(item) in currentOrderList"
          :key="item.id"
          class="scroll"
        >
          <OrderItem
            pageType="allOrder"
            :billType="item.billType"
            :dataList="item.dataList"
            :amount="item.amount"
            :submitTime="item.submitTime"
            :params="item.params"
            :billId="item.billId"
            :billDetailObj="item.billDetailObj"
            :orderType="item.orderType"
            :payInfo="item.payInfo"
            :orderStateType="item.orderStateType"
          ></OrderItem>
        </div>
        <Empty v-show="showEmpty"></Empty>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import OrderItem from "@/components/order/components/order-item/order-item";
import Empty from "../../components/empty/empty.vue";

export default {
  name: "allOrder",
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      orderList: [],
      currentPage: 0,
      totalPage: 0,
      page: 0,
      showEmpty: false,
      currentOrderList: []
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
      this.loading = true;
      let page = this.currentPage;
      page = page + 1;
      this.currentPage = page;
      this.refreshing = false;
      let obj = {
        page: { index: page, pageSize: 10 },
        airDefenseNo: this.$store.state.userRoomId
      };
      console.log(
        "---------------this.$store.state.userRoomId----------",
        this.$store.state.userRoomId
      );
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
    // 下拉刷新时触发
    onRefresh() {
      let page = 1; //从第一页开始
      this.page = page; //将当前页数赋值给this
      this.finished = false; //将没有更多的状态改成false
      this.loading = true; //将下拉刷新状态改为true开始刷新
      this.currentPage = 1;
      let obj = {
        page: { index: page, pageSize: 10 },
        airDefenseNo: this.$store.state.userRoomId
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
    },
    initData() {
      this.currentOrderList = this.orderList.map(item => {
        return {
          billType: item.billType,
          billId: item.billId,
          amount: item.totalPrice,
          submitTime: item.submitTime,
          orderType: item.orderStateType,
          orderStateType: item.orderStateType,
          params: {
            deliverType: item.deliverType,
            orderId: item.id,
            orderType: item.orderStateType,
            orderPayType: item.orderPayType,
            orderCategory: item.orderCategory,
            orderCanEvaluate: item.orderCanEvaluate,
            orderStateType: item.orderStateType,
            state: item.state,
            tradeNo: item.tradeNo
          },
          billDetailObj: {
            businessCstNo: item.loginUserPhone,
            groupBuyActivityId: item.groupBuyActivityId,
            groupBuyId: item.groupBuyId,
            payMode: item.payMode,
            tradeNo: item.tradeNo,
            shoppingOrderId: item.shoppingOrderId,
            orderPayType: item.orderPayType,
            id: item.id,
            tag: this.getTag(item.state, item.orderStateType),
            tabIndex: 0,
            awardActivityList: item.awardActivityList,
            isRefund: item.isRefund
          },
          payInfo: {
            businessCstNo: item.loginUserPhone,
            platMerCstNo: item.platMerCstNo,
            tradeMerCstNo: item.tradeMerCstNo,
            billNo: item.billNo,
            orderId: item.id,
            orderCategory: item.orderCategory,
            orderType: item.orderType,
            tradeNo: item.tradeNo,
            deliverCheckcode: item.deliverCheckcode
          },
          dataList: item.orderFormItemList.map(sub => {
            return {
              billType: item.billType,
              billImg: sub.iconUrl,
              billName: sub.name,
              billAmount: sub.unitPrice,
              billNum: sub.quantity,
              skuId: sub.itemId,
              storeOuCode: sub.storeOuCode,
              id: sub.itemId,
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
              info: sub.info,
              itemTypeName: sub.itemTypeName,
              snapshotTime: sub.snapshotTime
            };
          })
        };
      });
      // console.log(this.currentOrderList[0].dataList)
      console.log(this.currentOrderList);
    },
    getTag(state, type) {
      if (state == 1 && type == "200015") {
        // 待支付
        return "1";
      } else if (state == 17 && type == "200017") {
        // 待发货
        return "16";
      } else if (state == 4 && type == "200017") {
        // 待收货
        return "4";
      } else if (state == 9 && type == "200017") {
        // 已完成
        return "9";
      } else if (state == 7 && type == "200018") {
        // 已取消
        return "7";
      }
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
.scroll {
  padding-top: 12px;
}
.allOrder{
  height 100%;
  overflow-y auto;
  padding-bottom: 130px;
}
</style>

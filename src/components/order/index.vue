<template>
  <div class="order">
    <nav-top></nav-top>
    <van-tabs
      v-model="active"
      swipeable
      swipe-threshold="6"
      title-active-color="#E8374A"
      @click="navTo"
    >
      <van-tab
        :title="item.title"
        v-for="(item, index) in orderStatusList"
        :key="index"
        title-class="tabTitle"
        :name="item.components"
      >
      </van-tab>
    </van-tabs>
    <component v-bind:is="active"></component>
    <pay-div></pay-div>
  </div>
</template>

<script>
import navTop from "@/components/order/components/nav-top/nav-top";
import orderItem from "@/components/order/components/order-item/order-item";
import payDiv from "@/components/order/components/pay-div/pay-div";
import AllPages from "./pages/allOrder/allOrder";
import Cancel from "./pages/cancel/cancel";
import Finish from "./pages/finish/finish";
import WaitDelivery from "./pages/waitDelivery/waitDelivery";
import WaitPay from "./pages/waitPay/waitPay";
import WaitTakeDelivery from "./pages/waitTakeDelivery/waitTakeDelivery";
export default {
  data() {
    return {
      active: "AllPages",
      orderStatusList: [
        { title: "全部", components: "AllPages", id: 1 },
        { title: "待支付", components: "WaitPay", id: 2 },
        { title: "待发货", components: "WaitDelivery", id: 3 },
        { title: "待收货", components: "WaitTakeDelivery", id: 4 },
        { title: "已完成", components: "Finish", id: 5 },
        { title: "已取消", components: "Cancel", id: 6 },
      ],
    };
  },
  components: {
    navTop,
    orderItem,
    payDiv,
    AllPages,
    Cancel,
    Finish,
    WaitDelivery,
    WaitPay,
    WaitTakeDelivery,
  },
  created() {
    this.initPage(this.$route.params.id);
  },
  methods: {
    navTo(name, title) {
      this.active = name;
    },
    initPage(id) {
      let component = this.orderStatusList.filter((e) => {
        return e.id == id;
      });
      if (component.length != 0) {
        this.active = component[0].components;
      }
    },
  },
};
</script>


<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

#app .router_class.order {
  background: #F9F9F9;
  overflow: auto;
  padding-bottom: 52px;
}

.van-tab__pane, .van-tab__pane-wrapper {
  padding-top: 10px;
}

.order {
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;

  /deep/.van-tab {
    font-size: 14px;
    font-weight: 400;
    color: #121212;
    line-height: 21px;
  }

  /deep/.van-tab--active {
    font-size: 15px;
    font-weight: 500;
  }
}
</style>
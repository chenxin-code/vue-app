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
        :name="item.path"
      >
        <router-view></router-view>
      </van-tab>
    </van-tabs>
    <order-item></order-item>
    <order-item></order-item>
    <pay-div></pay-div>
  </div>
</template>

<script>
import navTop from "@/components/order/components/nav-top/nav-top";
import orderItem from "@/components/order/components/order-item/order-item";
import payDiv from "@/components/order/components/pay-div/pay-div";
export default {
  data() {
    return {
      orderStatusList: [
        { title: "全部", path: "/order/allOrder" },
        { title: "待支付", path: "/order/waitPay" },
        { title: "待发货", path: "/order/waitDelivery" },
        { title: "待收货", path: "/order/waitTakeDelivery" },
        { title: "已完成", path: "/order/finish" },
        { title: "已取消", path: "/order/cancel" },
      ],
    };
  },
  components: {
    navTop,
    orderItem,
    payDiv
  },
  methods: {
    navTo(name, title) {
      this.$router.push({
        path: name,
      });
    },
  },
  computed: {
    active: {
      get() {
        switch (this.$route.path) {
          case "/order/allOrder":
            return "/order/allOrder";

          case "/order/waitPay":
            return "/order/waitPay";

          case "/order/waitDelivery":
            return "/order/waitDelivery";

          case "/order/waitTakeDelivery":
            return "/order/waitTakeDelivery";

          case "/order/finish":
            return "/order/finish";
            
          case "/order/cancel":
            return "/order/cancel";

          default:
            return "/order/allOrder";
        }
      },
      set() {},
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
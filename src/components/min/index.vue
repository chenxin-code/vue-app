<template>
  <div class="min">
    <min-top></min-top>
    <GridList :gridData="walletData" @navTo="navTo"></GridList>
    <GridList :gridData="orderData" @navTo="navTo"></GridList>
  </div>
</template>

<script>
import MinTop from "./components/min-top/min-top";
import GridList from "./components/gridList/gridList";
export default {
  data() {
    return {
      walletData: {
        gridList: [
          { title: "邦豆", value: "0", url: "grid" },
          { title: "优惠券", value: "10", url: "grid" },
          { title: "零钱（元）", value: "0.00", url: "grid" },
        ],
        endData: {
          title: "我的钱包",
          icon: require("./images/wallet.png"),
          url: "grid",
          imgWidth: "0.88rem",
          imgHeight: "0.706667rem",
        },
        isShowNumber:false,
      },
      orderData: {
        gridList: [
          {
            title: "待支付",
            icon: require("./images/pay.png"),
            url: "grid",
            imgWidth: "0.6rem",
            imgHeight: "0.48rem",
          },
          {
            title: "待发货",
            icon: require("./images/delivery.png"),
            url: "grid",
            imgWidth: "0.68rem",
            imgHeight: "0.546667rem",
          },
          {
            title: "待收货",
            icon: require("./images/gif.png"),
            url: "grid",
            imgWidth: "0.546667rem",
            imgHeight: "0.546667rem",
          },
          {
            title: "退换/售后",
            icon: require("./images/afterSales.png"),
            url: "grid",
            imgWidth: "0.626667rem",
            imgHeight: "0.546667rem",
          },
        ],
        endData: {
          title: "我的订单",
          icon: require("./images/order.png"),
          url: "grid",
          imgWidth: "0.773333rem",
          imgHeight: "0.826667rem",
        },
        isShowNumber:true,
      },
    };
  },
  components: {
    MinTop,
    GridList,
  },
  methods: {
    navTo(url) {
      console.log(url);
    },
  },
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.router_class {
  background: #F7F7F7 !important;
}
</style>
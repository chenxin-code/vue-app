<template>
  <div class="min">
    <min-top></min-top>
    <GridList :gridData="walletData" @navTo="navTo"></GridList>
    <GridList :gridData="orderData" @navTo="navTo"></GridList>
    <BottomCell :cellData="cellData"></BottomCell>
  </div>
</template>

<script>
import MinTop from "./components/min-top/min-top";
import GridList from "./components/gridList/gridList";
import BottomCell from "./components/bottomCell/bottomCell";
export default {
  data() {
    return {
      wallet: 0,
      walletData: {
        gridList: [
          { title: "邦豆", value: "0", url: "grid", id: "bean" },
          { title: "优惠券", value: "10", url: "grid", id: "coupons" },
          {
            title: "零钱（元）",
            value: "0.00",
            url: "grid",
            id: "wallet",
          },
        ],
        endData: {
          title: "我的钱包",
          icon: require("./images/wallet.png"),
          url: "grid",
          imgWidth: "0.88rem",
          imgHeight: "0.706667rem",
        },
        isShowNumber: false,
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
        isShowNumber: true,
      },
      cellData: [
        { title: "个人信息", icon: require("./images/user.png") },
        { title: "分享有礼", icon: require("./images/share.png") },
        { title: "收货地址", icon: require("./images/address.png") },
        {
          title: "客服热线",
          icon: require("./images/message.png"),
          phone: "400-111-9928",
        },
      ],
    };
  },
  components: {
    MinTop,
    GridList,
    BottomCell,
  },
  created() {
    this.getWallet();
  },
  methods: {
    navTo(url) {
      console.log(url);
    },
    getWallet() {
      //获取零钱
      this.$http.post("/app/json/app_pay/getWalletBalance").then((res) => {
        if (res.data.status == 0) {
          this.setValue(this.walletData.gridList,"wallet",res.data.data.availBalance)
          console.log(this.walletData.gridList)
        }
      });
    },
    setValue(arr, id, value) {
      let newArr = arr.filter((e) => {
        return e.id == id;
      });
      if (newArr.length !== 0) {
        newArr.value = value;
      }
    },
  },
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.router_class {
  background: #F7F7F7 !important;
}

.min {
  overflow-y: auto;
  padding-bottom: 28.5px;
}
</style>
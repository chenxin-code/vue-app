<template>
  <div class="order">
    <van-sticky :offset-top="offsetTop">
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
        <component
          v-bind:is="item.components"
          :key="$route.path + $route.query.time"
        ></component>
        </van-tab>
      </van-tabs>
    </van-sticky>
  </div>
</template>

<script>
import navTop from "@/components/order/components/nav-top/nav-top";
import AllPages from "./pages/allOrder/allOrder";
import Cancel from "./pages/cancel/cancel";
import Finish from "./pages/finish/finish";
import WaitDelivery from "./pages/waitDelivery/waitDelivery";
import WaitPay from "./pages/waitPay/waitPay";
import WaitTakeDelivery from "./pages/waitTakeDelivery/waitTakeDelivery";
import navToMicroApplication from "@zkty-team/x-engine-module-router";
import nav from "@zkty-team/x-engine-module-nav";
export default {
  data() {
    return {
      active: "AllPages",
      orderStatusList: [
        // { title: "全部", components: "AllPages", id: 1 },
        { title: "待支付", components: "WaitPay", id: 2 },
        { title: "待发货", components: "WaitDelivery", id: 3 },
        { title: "待收货", components: "WaitTakeDelivery", id: 4 },
        { title: "已完成", components: "Finish", id: 5 },
        { title: "已取消", components: "Cancel", id: 6 }
      ],
      offsetTop: "0rem"
    };
  },
  components: {
    navTop,
    AllPages,
    Cancel,
    Finish,
    WaitDelivery,
    WaitPay,
    WaitTakeDelivery
  },
  created() {
    this.initPage(this.$route.params.id);
    let padding = "";
    padding = document.getElementsByTagName("body")[0].style.paddingTop;
    if (padding !== "") {
      this.offsetTop = padding;
    }
  },
  activated() {
    // nav.setNavLeftBtn({
    //   title: "我的订单",
    //   titleColor: "#000000",
    //   titleSize: 24,
    //   titleFontName: "PingFangSC-Medium",
    //   titleBig: "500"
    // });
    // nav.setNavRightBtn({
    //   title: "历史缴费记录",
    //   titleColor: "#000000",
    //   titleSize: 18,
    //   icon: "",
    //   iconSize: ["20", "20"],
    //   __event__: () => {
    //     this.navToHistory();
    //   }
    // });
  },
  methods: {
    //跳到历史欠缴记录页面
    navToHistory() {
      navToMicroApplication.openTargetRouter({
        type: "microapp",
        uri: "com.times.microapp.AppcPrepay", // 微应用包名
        path: "/bill/index", // 微应用具体路由
        hideNavbar: false
      });
    },
    navTo(name, title) {
      this.active = name;
    },
    initPage(id) {
      let component = this.orderStatusList.filter(e => {
        return e.id == id;
      });
      if (component.length != 0) {
        this.active = component[0].components;
      }
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

#app .router_class.order {
  background: #F9F9F9;
  // overflow: auto;
}

.van-tab__pane, .van-tab__pane-wrapper {
  padding-top: 10px;
}

.order {
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;

  /deep/.van-tabs {
    box-shadow: 0px 5px 10px 0px #F1F1F1;
  }

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

  /deep/.van-tabs__line {
    position: absolute;
    bottom: 15px;
    left: 0;
    z-index: 1;
    width: 32px;
    height: 4px;
    background: url('./img/currentSelectIcon.png');
    background-repeat: no-repeat;
    background-size: 32px 4px;
    padding-bottom: 9px;
    border-radius: 0px;
  }
}
</style>

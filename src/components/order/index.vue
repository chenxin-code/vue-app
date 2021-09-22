<template>
  <div class="order" :class="{ 'order-x': this.$util.getIsIphoneX_X() }">
    <van-sticky :offset-top="offsetTop">
      <nav-top
        navLeftName="我的订单"
        navRightName="发票中心"
        @backEvent="goBack"
        @navToPage="navToInvoiceCenter"
      ></nav-top>
    </van-sticky>
    <!-- <van-sticky :offset-top="offsetTop" ref="stickyIndex"> -->
    <van-tabs
      v-model="active"
      swipeable
      swipe-threshold="6"
      title-active-color="#e5165a"
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
    <!-- </van-sticky> -->
    <component
      v-bind:is="active"
      :key="$route.path + $route.query.time"
    ></component>
  </div>
</template>

<script>
import navTop from "@/components/order/components/common/nav-top";
import AllPages from "./pages/allOrder/allOrder";
import Cancel from "./pages/cancel/cancel";
import Finish from "./pages/finish/finish";
import WaitDelivery from "./pages/waitDelivery/waitDelivery";
import WaitPay from "./pages/waitPay/waitPay";
import WaitTakeDelivery from "./pages/waitTakeDelivery/waitTakeDelivery";
import navToMicroApplication from "@zkty-team/x-engine-module-router";
import appLocalstorage from "@zkty-team/x-engine-module-localstorage";
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
      offsetTop: "0rem",
      backIndex: false
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
    if (this.$route.query.backIndex) {
      this.backIndex = true;
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
    //跳到发票中心页面
    navToInvoiceCenter() {
      let url = "";
      this.$store.state.environment == "production"
        ? (url = `https://mall-prod-app-linli.timesgroup.cn:5000`)
        : (url = `https://mall-uat-app-linli.timesgroup.cn:9000/`);
      navToMicroApplication.openTargetRouter({
        type: "h5",
        uri: url,
        hideNavbar: false
      });
    },
    goBack: function() {
      if (this.backIndex) {
        this.$router.replace({
          path: "/common"
        });
      } else {
        appLocalstorage
          .get({
            key: "LLBIsHomeView",
            isPublic: true
          })
          .then(res => {
            let _result = res.result;
            console.log("appLocalstorage_result", _result);
            if (
              !_result ||
              _result == "" ||
              _result == "null" ||
              _result == undefined
            ) {
              console.log("appLocalstorage_result", _result);
              nav.navigatorBack({ url: "0" }).then(res => {
                console.log(res);
              });
              return;
            }
            if (_result == "1") {
              this.$router.replace({
                path: "/common"
              });
            } else if (_result == "0") {
              nav.navigatorBack({ url: "0" }).then(res => {
                console.log(res);
              });
            } else if (_result == "2") {
              nav.navigatorBack({ url: "0" }).then(res => {
                console.log(res);
              });
            }
          });
      }
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
  top: 70px;
  &.order-x {
    top: 85px;
  }
}

.van-tab__pane, .van-tab__pane-wrapper {
  padding-top: 10px;
}

.order {
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;

  /deep/.van-tabs {
    box-shadow: 0px 10px 10px -3px #F1F1F1;
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
    width: 44px;
    height: 4px;
    background: url('./img/currentSelectIcon.png');
    background-repeat: no-repeat;
    background-size: 44px 4px;
    padding-bottom: 9px;
    border-radius: 0px;
  }
}
</style>

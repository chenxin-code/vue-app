<template>
  <div class="nav-top" :style="{ 'padding-top': adapterTop }">
    <div @click="goBack">
      <i class="icon"></i>
      <span class="title">我的订单</span>
    </div>
    <span class="history" @click="navToHistory">历史缴费记录</span>
    <!-- <van-popover
      v-model="showPopover"
      trigger="click"
      :actions="actions"
      @select="onSelect"
      placement="bottom-end"
    >
      <template #reference>
        <div class="more" @click="showPopover = true">
          <img :src="moreIcon" alt="" />
        </div>
      </template>
    </van-popover> -->
  </div>
</template>

<script>
import appNav from "@zkty-team/x-engine-module-nav";
import appLocalstorage from "@zkty-team/x-engine-module-localstorage";
import navToMicroApplication from "@zkty-team/x-engine-module-router";

export default {
  data() {
    return {
      adapterTop: "0.426667rem",
      showPopover: false,
      actions: [
        { text: "历史缴费记录", className: "history" },
        { text: "发票查询", className: "invoice" }
      ],
      moreIcon: require("../../img/more.png"),
      backIndex: false
    };
  },
  created() {
    // 判断是否是刘海屏
    const rate = window.screen.height / window.screen.width;
    let limit = window.screen.height == window.screen.availHeight ? 1.8 : 1.65; // 临界判断值
    // window.screen.height为屏幕高度
    //  window.screen.availHeight 为浏览器 可用高度
    if (rate < limit) {
      this.adapterTop = "1.173333rem";
    } else {
      this.adapterTop = "0.426667rem";
    }
    if (this.$route.query.backIndex) {
      this.backIndex = true;
    }
  },
  methods: {
    onSelect(action) {
      action.className == "history" &&
        this.navToMicroapp(
          "com.times.microapp.AppcPrepay",
          "/bill/index",
          false
        );
      action.className == "invoice" &&
        this.navToMicroapp("com.times.microapp.AppcInvoice", "/", true);
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
              return;
            }
            if (_result == "1") {
              this.$router.replace({
                path: "/common"
              });
            } else if (_result == "0") {
              appNav.navigatorBack({ url: "0" }).then(res => {
                console.log(res);
              });
            } else if (_result == "2") {
              appNav.navigatorBack({ url: "0" }).then(res => {
                console.log(res);
              });
            }
          });
      }
    },
    navToMicroapp(microappUri, microappPath, isHideNavbar) {
      //跳转微应用
      navToMicroApplication.openTargetRouter({
        type: "microapp",
        uri: microappUri, // 微应用包名
        path: microappPath, // 微应用具体路由
        hideNavbar: isHideNavbar
      });

      // 发票
      // router.openTargetRouter({
      //   type: "microapp",
      //   uri: "com.times.microapp.AppcInvoice",
      //   path: "/",
      // });
      //历史记录
      // uri: "com.times.microapp.AppcPrepay", // 微应用包名
      // path: "/bill/index", // 微应用具体路由
    },
    navToHistory() {
      this.navToMicroapp("com.times.microapp.AppcPrepay", "/bill/index", false);
      console.log(`跳到历史欠缴记录页面`);
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.nav-top {
  padding: 16px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  // padding-top: 44px;
  .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url('../../img/back.png') no-repeat;
    background-size: 20px auto;
    position: relative;
    top: 2px;
  }

  .title {
    // font-size: 24px;
    font-size: 18px;
    color: #121212;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
  }

  .history {
    font-size: 14px;
    font-weight: 500;
    font-family: PingFangSC-Medium, PingFang SC;
    color: #333333;
    line-height: 24px;
  }

  .more {
    width: 102px;
    height: 32px;
    background: linear-gradient(90deg, #FFFFFF 0%, #FFE3E5 100%);
    border-radius: 32px;
    padding: 0 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    img {
      width: 22px;
      height: 20px;
    }
  }
}
</style>

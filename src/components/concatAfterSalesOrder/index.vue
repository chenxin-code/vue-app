<template>
  <div class="order">
    <van-sticky :offset-top="offsetTop" ref="stickyIndex">
      <nav-top v-if="!$isWX"></nav-top>
      <van-tabs
        v-model="active"
        swipeable
        swipe-threshold="6"
        title-active-color="#121212"
        @click="navTo"
      >
        <van-tab
          :title="item.title"
          v-for="(item, index) in cancatAfterSalesOrderList"
          :key="index"
          title-class="tabTitle"
          :name="item.components"
        >
        </van-tab>
      </van-tabs>
    </van-sticky>
    <component :is="active" :key="$route.path + $route.query.time"></component>
  </div>
</template>

<script>
import navTop from "@/components/concatAfterSalesOrder/components/nav-top/nav-top";
import Processing from "./pages/processing/index";
import FigureOut from "./pages/figureOut/index";
import CloseProcess from "./pages/closeProcess/index";
import navToMicroApplication from "@zkty-team/x-engine-module-router";
// import nav from "@zkty-team/x-engine-module-nav";
// import appNav from "@zkty-team/x-engine-module-nav";
export default {
  data() {
    return {
      active: "Processing",
      cancatAfterSalesOrderList: [
        { title: "处理中", components: "Processing", id: 1 },
        { title: "处理完成", components: "FigureOut", id: 2 },
        { title: "处理关闭", components: "CloseProcess", id: 3 },
      ],
      offsetTop: "0rem",
    };
  },
  components: {
    navTop,
    Processing,
    FigureOut,
    CloseProcess,
  },
  created() {
    if(this.$isWX) {
      document.title = '售后列表'
    }
    this.initPage(this.$route.params.id);
    let padding = "";
    padding = document.getElementsByTagName("body")[0].style.paddingTop;
    if (padding !== "") {
      this.offsetTop = padding;
    }
    // if (this.$store.state.webtpye != 2 || this.$store.state.webtpye != 3) {
    //   appNav
    //     .setNavBarHidden({
    //       isHidden: true,
    //       isAnimation: false,
    //     })
    //     .then((res) => {});
    // }
  },
  methods: {
    //跳到历史欠缴记录页面
    navToHistory() {
      navToMicroApplication.openTargetRouter({
        type: "microapp",
        uri: "com.times.microapp.AppcPrepay", // 微应用包名
        path: "/bill/index", // 微应用具体路由
        hideNavbar: false,
      });
    },
    navTo(name, title) {
      this.active = name;
    },
    initPage(id) {
      let component = this.cancatAfterSalesOrderList.filter((e) => {
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
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #121212;
    line-height: 20px;
  }

  /deep/.van-tab--active {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #121212;
    line-height: 20px;
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
    background-size: 44px 3px;
    padding-bottom: 9px;
    border-radius: 0px;
  }
}
</style>

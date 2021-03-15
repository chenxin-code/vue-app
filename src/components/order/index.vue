<template>
  <div class="order">
    <nav-top></nav-top>

    <van-tabs
      v-model="active"
      animated
      swipeable
      swipe-threshold="6"
      title-active-color="#E8374A"
    >
      <van-tab
        :title="item.title"
        v-for="(item, index) in orderStatusList"
        :key="index"
        title-class="tabTitle"
        >内容 1</van-tab
      >
    </van-tabs>
  </div>
</template>

<script>
import navTop from "@/components/order/nav-top/nav-top";
export default {
  data() {
    return {
      active: 0,
      orderStatusList: [
        { title: "全部", path: "" },
        { title: "待支付", path: "" },
        { title: "待发货", path: "" },
        { title: "待收货", path: "" },
        { title: "已完成", path: "" },
        { title: "已取消", path: "" },
      ],
    };
  },
  components: {
    navTop,
  },
};
</script>


<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
#app .router_class.order-box {
  background: #F9F9F9;
}
.van-tab__pane, .van-tab__pane-wrapper {
  padding-top: 10px;

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
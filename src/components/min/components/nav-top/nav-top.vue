<template>
  <div class="nav-top" :style="{ 'padding-top': adapterTop }">
    <i class="icon" @click="goBack"></i>
    <span class="title">{{ title }}</span>
  </div>
</template>

<script>
export default {
  props: ["title"],
  data() {
    return {
      adapterTop: "0.426667rem",
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
  },
  methods: {
    goBack() {
      this.$emit("backEvent");
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.nav-top {
  padding: 16px;
  background: #fff;
  box-shadow: 0px 5px 10px 0px rgba(0, 64, 128, 0.04);

  .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url('../../images/back_icon.png') no-repeat;
    background-size: 20px auto;
    position: relative;
    top: 2px;
  }

  .title {
    font-size: 24px;
    color: #121212;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
  }
}
</style>
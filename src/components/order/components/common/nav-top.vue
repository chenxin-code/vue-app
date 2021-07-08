<!--
 * @Description: 这是***页面
 * @Date: 2021-06-10 18:00:33
 * @Author: shuimei
 * @LastEditTime: 2021-07-07 17:31:39
-->
<template>
  <div class="nav-top" :style="{ 'padding-top': adapterTop }">
    <div @click="goBack">
      <i class="icon"></i>
      <span class="left-title">{{ leftTitle }}</span>
    </div>
    <span class="right-title" @click="navToPage" v-if="rightTitle">{{
      rightTitle
    }}</span>
  </div>
</template>

<script>
export default {
  props: ["leftTitle", "rightTitle"],
  data() {
    return {
      adapterTop: "0.426667rem"
    };
  },
  created() {
    // 判断是否是刘海屏
    const rate = window.screen.height / window.screen.width;
    let limit = window.screen.height == window.screen.availHeight ? 1.8 : 1.65; // 临界判断值
    // window.screen.height为屏幕高度
    //  window.screen.availHeight 为浏览器 可用高度
    if (rate > limit) {
      this.adapterTop = "1.173333rem";
    } else {
      this.adapterTop = "0.426667rem";
    }
  },
  methods: {
    goBack() {
      this.$emit("backEvent");
    },
    navToPage() {
      this.$emit("navToPage");
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
  box-shadow: 0px 5px 10px 0px rgba(0, 64, 128, 0.04);

  .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url('../../img/back.png') no-repeat;
    background-size: 20px auto;
    position: relative;
    top: 2px;
  }

  .left-title {
    // font-size: 24px;
    font-size: 18px;
    color: #121212;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
  }
  .right-title {
    font-size: 14px;
    font-weight: 500;
    font-family: PingFangSC-Medium, PingFang SC;
    color: #333333;
    line-height: 24px;
  }
}
</style>

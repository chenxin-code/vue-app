<!--
 * @Description: 这是***页面
 * @Date: 2021-06-10 18:00:33
 * @Author: shuimei
 * @LastEditTime: 2021-08-16 10:44:33
-->
<template>
  <!--  :style="{ 'padding-top': adapterTop }"  -->
  <div
    class="nav-top"
    :style="{
      '--status-height': statusHeight,
      '--nav-height': navHeight
    }"
  >
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
import device from "@zkty-team/x-engine-module-device";
export default {
  props: ["leftTitle", "rightTitle"],
  data() {
    return {
      statusHeight: "20px",
      navHeight: "0px"
    };
  },
  beforeCreate() {
    return device
      .getStatusHeight({
        __event__: () => void 0
      })
      .then(({ content }) => {
        this.statusHeight = content + "px";
      });
  },
  created() {},
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

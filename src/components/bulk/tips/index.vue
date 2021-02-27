<template>
  <!-- // created by hjc 提示页面 -->
  <div class="tips">
    <img :src="require('./images/tips.png')" alt="" />
    <div class="tips_text">系统繁忙</div>
    <div class="tips_text">请稍后重试！</div>
    <div class="back_btn">返回首页</div>
  </div>
</template>

<script>
export default {
  name: "tips",
  props: {},
  data() {
    return {};
  },
  created() {},
};
//
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.router_class {
  background-color: #F9F9F9;
}

.tips {
  background-color: #F9F9F9;
  padding: 120px 0 193.5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  img {
    width: 239px;
    height: 137px;
  }

  .tips_text {
    font-size: 15px;
    font-weight: 400;
    color: #999999;
    line-height: 17px;
    margin: 4px auto;
  }

  .back_btn {
    margin-top: 68.5px;
    width: 177px;
    height: 49px;
    background: #D5474F;
    border-radius: 9px;
    text-align: center;
    line-height: 49px;
    font-size: 15px;
    font-weight: 400;
    color: #FFFFFF;
  }
}
</style>


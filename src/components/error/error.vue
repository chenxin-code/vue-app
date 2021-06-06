<template>
  <div class="error">
    <div class="tips">
      <div>亲，非常抱歉，忙不过来了，</div>
      <div>请您退出后重新登录！</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "error",
  props: {},
  data() {
    return {};
  },
  created() {
    this.$nextTick(() => {
      console.log("wx", wx);
        wx.miniProgram.navigateTo({
          url: "/pages/common/home/index",
        });
      })
    if (this.$store.state.webtype == 2 || this.$store.state.webtype == 3) {
      
    }
  },
};
//
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.router_class {
  background-color: #F9F9F9;
}

.error {
  background: url('./images/error.png');
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position-y: 30%;
  display: flex;
  justify-content: center;
  align-items: center;

  .tips {
    font-size: 16px;
    color: #999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 160px;

    div {
      margin: 0 0 10px;
    }
  }
}
</style>


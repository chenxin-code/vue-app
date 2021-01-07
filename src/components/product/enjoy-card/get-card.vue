<template>
  <div>
    <van-field
      v-model="value1"
      label="token"
      placeholder="请输入要跳转先享卡的token"
    />
    <van-button type="primary" @click='goCard'>跳转先享卡</van-button>
  </div>
</template>

<script>
  export default {
      data() {
        return {
          value1: null,
        }
      },
      methods:{
        goCard() {
          if(!this.value1) {
            this.$toast("请先输入token")
            return;
          }
          // 跳转先享卡的入口
          wx.navigateToMiniProgram({
            appId: 'wxcc2e4fbc5887661e',
            path: `/pages/get-card/get-card?prepare_card_token=${this.value1}`
          })
        }
      }
  }
</script>

<style lang="stylus" scoped>

</style>
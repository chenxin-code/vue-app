<template>
  <div>
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <van-tabs color='#F80F16' title-active-color='#F80F16' v-model="productCate" @change='changeProList'>
        <van-tab name='0' title="待领取"></van-tab>
        <van-tab name='1' title="已领取"></van-tab>
        <van-tab name='2' title="已过期"></van-tab>
      </van-tabs>
    </nav-content>
  </div>
</template>

<script>
  export default {
    data() {
      return{
        productCate: null
      }
    },
    methods:{
      backEvent() {
        this.$router.go(-1)
      },
      changeProList(val) {
        console.log("修改",val)
      }
    }
  }
</script>

<style lang="stylus" scoped>
& /deep/.van-tabs__line{
    width: 35px!important;
  }
</style>
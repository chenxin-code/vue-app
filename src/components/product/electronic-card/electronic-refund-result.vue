<template>
  <div>
    <nav-top title="申请退款" @backEvent="goback"></nav-top>
    <nav-content style='padding: 15px;'>
      <div class='content-info' v-if="type == 1">
        您的退款申请已成功提交，工作人员在马不停滴的审核ing，审核结果会在第一时间以短信和APP消息的方式通知到您，敬请留意。
      </div>
      <div class='content-info' v-else-if='type == 2'>
        您于{{$route.query.time || ""}}提交的退款申请还在马不停滴的审核ing，审核结果会在第一时间以短信和APP消息的方式通知到您，敬请留意。
      </div>
      <div class='content-info' v-else-if='type == 3'>
        您的开票申请以及提交成功！我们将在3个工作日内为您开出电子发票，开票成功后电子发票会邮寄到您留下的电子邮箱里，敬请查收。
      </div>
      <div class="btn">
        <van-button round type="info" block style="width: 50%; margin: 0 auto;" color='#F02C2D' @click='goback'>返回首页</van-button>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    mounted() {
        this.type = this.$route.query.type
    },
    data() {
      return{
        type:1
      }
    },
    methods:{
      goback() {
        this.$router.replace("/electronic_card")
      }
    }
  }
</script>

<style lang="stylus" scoped>
.content-info{
  font-size: 14px;
  line-height: 28px;
  color: #333333;
  font-family: PingFangSC-Regular, PingFang SC;
  margin-bottom:80px;
}

</style>
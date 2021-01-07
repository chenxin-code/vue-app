<template>
  <div class="box">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="rules-container">
        <div class="rule-content">
          <div v-html="content" >content</div>
<!--          <div class="title">规则说明：</div>-->
<!--          <div class="rules-list">1、活动时间2020年11月12日至2020年11月14日；</div>-->
<!--          <div class="rules-list">2、活动期间每人仅限发起砍价支付1次，每人最多帮助好友助力3次；</div>-->
<!--          <div class="rules-list">3、每天5场活动，每场200名额，先到先得，以实际支付为准，如已销售完，则自动砍价失败，请参与下一场活动；</div>-->
<!--          <div class="rules-list">4、砍价结束后请在我的订单查看已完成订单，点击订单查看卡密；</div>-->
<!--          <div class="rules-list">5、本活动不支持线上开具发票，请到站内开具。</div>-->
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content:''
    };
  },
  created(){
    this.getInfo()
  },
  mounted() {},
  methods: {
    backEvent() {
      this.$router.go(-1);
    },
    getInfo(){
      let params = {

      }
      this.$http.post("/app/json/news/getNewsList?values=72", params).then(res => {
        let data = res.data
        if (data.status == 0) {
          console.log(res)
          this.content=res.data.data[0]?res.data.data[0].content:''
        } else {
          this.$Toast(data.info)
        }
      }).catch((err) => {
        this.$Toast(err)
      })
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.box {
  width: 100%;
  height: 100%;

  .rules-container {
    padding: 0 10px;

    .rule-content {
      padding: 0 10px 20px 10px;
      background: #fff;
      line-height: 24px;

      .rules-list {
        color: #626262;
      }

      .title {
        padding-top: 10px;
        color: $color-theme;
        font-weight: 500;
        font-size: 16px;
      }
    }
  }
}
</style>

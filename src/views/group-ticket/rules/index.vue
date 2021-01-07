<template>
  <div class="box">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="rules-container">
        <div class="rules-title">
          <div class="process-list">
            <div class="process-item">
              <img class="img" src="../image/icon1.png" alt />
              <p>发起拼券</p>
            </div>
            <div class="process-item">
              <img class="img" src="../image/icon2.png" alt />
              <p>分享好友</p>
            </div>
            <div class="process-item">
              <img class="img" src="../image/icon3.png" alt />
              <p>好友助力</p>
            </div>
          </div>
          <div class="rule-flow">点击发起拼券，成为团长，分享给好友，好友助力，达到指定拼券人数，大家一起瓜分神券~</div>
        </div>
        <div class="rule-content">
          <div class="title">规则说明：</div>
          <div class="rules-list">1、用户参与拉人抢神券，按页面提示分享给好友；</div>
          <div class="rules-list">2、好友通过助力，助力成功并组团完成即可获得团员券；</div>
          <div class="rules-list">3、当参与人数在成团有效期内达到门槛值，组团完成，团长获得团长券；</div>
          <div class="rules-list">4、组团时间范围内，未达到成团人数的，自动视为失败，将不予发放优惠券；</div>
          <div class="title">参与规则：</div>
          <div class="rules-list">1、活动用户需要根据页面提示进行操作，如出现奖品无法发放、活动无法继续等异常情况，可咨询客服；</div>
          <div class="rules-list">2、对于免单券商品，商家不包邮的产品邮费需自理；</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    backEvent() {
      this.$router.go(-1);
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

    .rules-title {
      height: 140px;
      border-radius: 15px 15px 0 0;
      padding: 20px 16px;
      background: #fffbef;

      .process-list {
        display: flex;
        justify-content: space-between;

        .process-item {
          position: relative;
          width: 60px;
          height: 50px;
          text-align: center;
          z-index: 2;

          .img {
            width: 25px;
            height: 25px;
            margin-bottom: 6px;
          }

          & + .process-item:after {
            position: absolute;
            content: '';
            left: -64px;
            top: 38%;
            width: 90%;
            border-bottom: 1px solid #ebe2d2;
          }
        }
      }

      .rule-flow {
        color: #626262;
        padding-top: 10px;
        line-height: 21px;
        padding-bottom: 20px;
      }
    }

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

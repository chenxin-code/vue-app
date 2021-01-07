/**Created by liaoyingchao on 2019-05-16.*/

<template>
  <div class="pay-success mall2">
    <nav-top :no-back="true">
      <div class="right-btn theme_font_gray" style="right: 0px; height: 44px; top: 0px; padding-right: 12px;font-size: 16px;" @click="finishEvent">完成</div>
    </nav-top>
    <nav-content>
      <div>
        <div class="top-image">
          <i class="iconfont mall-xuanzhong theme_font_red"></i>
          <p class="theme_font_red">支付成功！</p>
        </div>
        <div class="block-div">
          <div class="flex-row" style="padding: 14px 0;">
            <div class="label theme_font_common">订单号</div>
            <div class="full"></div>
            <div class="theme_font_black right-margin">{{orderId}}</div>
          </div>
          <div class="flex-row line-top" style="padding: 14px 0;">
            <div class="label theme_font_common">支付金额</div>
            <div class="full"></div>
            <div class="theme_font_black right-margin">¥{{payAmount}}</div>
          </div>
          <div class="flex-row line-top" style="padding: 14px 0;">
            <div class="label theme_font_common">支付方式</div>
            <div class="full"></div>
            <div class="theme_font_black right-margin">{{payWayText}}</div>
          </div>
        </div>

        <div class="block-div">
          <div class="flex-row" style="padding: 14px 0;">
            <div class="label theme_font_common">核销二维码</div>
            <div class="full"></div>
          </div>

          <div class="line-top" style="padding: 14px 0;">
            <div class="img">
              <div id="qrcode"></div>
            </div>
            <p class="cantitle">请向前台展示二维码核销购买产品</p>
          </div>

        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'

  export default {
    name: "pay-success",
    components: {},
    data() {
      return {
        orderId: '',
        payAmount: '',
        payWayText: '',
        //交易流水号
        tradeNo:''
      }
    },
    methods: {
      finishEvent: function () {
        this.$bridgefunc.customGo(-1)
      },
      getCode: function () {
        this.$Loading.open();
        let url = '/app/json/app_shopping_order/detail';
        let paramsData = {
          token: this.$store.state.login.token,
          orderType: '200017',
          tradeNo: this.tradeNo
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.data.deliverCheckcode && data.data.deliverCheckcode.length) {
              this.$Loading.close();
              let qrcode = new QRCode('qrcode', {
                width: 140,  // 设置宽度
                height: 140, // 设置高度
                text: data.data.deliverCheckcode
              })
            }else {
              this.retry();
            }
          },
          error => {
            this.retry();
          }
        )

      },
      retry:function () {
        setTimeout(()=>{
          this.$Loading.close();
          this.getCode();
        },1500)
      }

    },
    mounted(){
      this.getCode();
    },
    created() {
      this.orderId = this.$route.query.orderId
      this.payAmount = this.$route.query.payAmount
      this.payWayText = this.$route.query.payWayText;
      this.tradeNo = this.$route.query.tradeNo;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .pay-success {
    width 100%
    height 100%
    overflow hidden

    .top-image {
      margin-top 20px;
      text-align center;
      i {
        font-size 50px;
      }
      p {
        margin-top 10px;
        font-size 16px;
        padding-bottom 20px;
      }
    }

    .img {
      display flex
      justify-content center
      margin-top 10px
    }
    .cantitle{
      text-align center
      margin-top 15px
    }

  }
</style>

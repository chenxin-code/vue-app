/**Created by Dell on 2019/7/30.*/

<template>
  <div class="index mall2">
    <div class="return" @click="backEvent">
      <img src="../../../../staticbak/image/close-btn.png" alt="">
    </div>
    <div v-if="hiddenInterface">
      <div class="title-first">
        <div class="content">
          <div class="content-div">
            <span class="symbol">￥</span>
            <span>{{integer}}.<span class="decimal">{{decimal}}</span></span>

          </div>
          <div style="margin-top: 10px; color: #888888">
            <span>支付剩余时间:</span>
            <span>{{timeString}}</span>
          </div>
        </div>
        <div class="flex-row block-div">
          <div class="tradingNumber">交易号:{{payInfo.orderNo}}</div>
        </div>
      </div>
      <div class="transaction">
        <div class="flex-row">
          <div class="title">支付方式</div>
        </div>
        <div class="flex-row flex-now" v-for="item in payWay" @click="payWaySelected(item)">
          <div class="icon-div">
            <img :src="item.icon"/>
          </div>
          <div class="full">{{item.text}}</div>
          <div class="selected-mark">
            <i class="iconfont mall-weixuanzhong theme_font_tint" v-if="hasToPays != item.payModeSub"></i>
            <i class="iconfont mall-xuanzhong theme_font_red" v-if="hasToPays == item.payModeSub"></i>
          </div>
        </div>
      </div>
      <div class="bottom-btn theme_font_white theme_standard_bg" @click="payEvent">
        {{paymentMethod}}支付￥{{payInfo.payAmount}}元
      </div>
    </div>
  </div>
</template>

<script>
  import payHelper from '@/utils/payHelper'

  export default {

    name: "index",
    components: {},
    data() {
      return {
        paymentMethod: "",
        payInfo: [],
        payWay: [],
        hasToPay: false,
        hasToPays: '',
        payMode: '',
        myTimer: null,
        timeValue: 0,
        timeString: '',
        prepayId: "",
        orderNo: "",
        clinetId: "",
        integer: "",
        decimal: "",
        redirectUrl: '',
        hiddenInterface:false
      }
    },
    methods: {
      backEvent: function () {
        window.history.go(-1)
      },
      payWaySelected: function (item) {
        if (this.hasToPays != item.payModeSub) {
          this.hasToPays = item.payModeSub
          this.payMode = item.payMode
        }
        if (item.payModeSub) {
          this.paymentMethod = item.text
        }
        // if (item.id == 201){
        //   this.paymentMethod = "支付宝"
        // }
        // if (item.payModeSub == '') {
        //   this.$Toast("暂未开通！")
        //   return;
        // }
        // this.selectedPayWay = item
      },
      payEvent: function () {
        if (this.hasToPays == '') {
          this.$Toast("请选择支付方式！")
          return;
        }
        let arr = ' '
        let arr1 = ' '
        if (this.payInfo.payModeSub != '') {
          arr = this.payInfo.payModeSub
          arr1 = this.payInfo.payMode
        } else {
          this.setPayWays();
          arr = this.hasToPays
          arr1 = this.payMode
        }
        this.$Loading.open();
        let url = '/app/json/app_pay/externalPay';
        let paramsData = {
          clinetId: this.payInfo.clinetId,
          orderNo: this.payInfo.orderNo,
          payMode: arr1,
          payModeSub: arr
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.hasToPay = true
            this.$Loading.close();
            payHelper.doPay(this.payWay[0], res.data.data.payInfo).then(() => {
              if (this.redirectUrl) {
                if (this.redirectUrl.indexOf('?') > '-1'){
                  let url = this.redirectUrl + '&result=success'
                  window.location.replace(url)
                } else {
                  let url = this.redirectUrl + '?result=success'
                  window.location.replace(url)
                }
              } else {
                window.history.go(-1)
              }
            }).catch(() => {
              this.$Toast('支付失败，请重新支付！')
            })
          },
          error => {
            this.hasToPay = false
            this.$Loading.close();
          }
        )
      },
      // enterSuccess: function () {
      //   if (this.$route.params.isGroup == '1') {
      //     this.$router.replace({
      //       path: '/group_detail',
      //       query: {
      //         orderId: this.$route.params.orderId,
      //         mktGroupBuyId: this.$route.params.mktGroupBuyId,
      //         formPaySuccess: '1'
      //       }
      //     });
      //     return;
      //   }
      //   this.$router.replace({
      //     path: '/mall2/paysuccess',
      //     query: {
      //       selectedIndex: 1,
      //       orderCategory: this.$route.query.orderCategory,
      //       vipUnitUserCode: this.$route.query.vipUnitUserCode
      //     }
      //   });
      // },
      async setPayWays() {
        this.payWay = await payHelper.getPayWays(this.payInfo.orderType, this.payInfo.occurOuCode)
        if (this.payWay.length > 0) {
          this.selectedPayWay = this.payWay[0];
        }
        this.hasToPays = this.payWay[0].payModeSub
        this.payMode = this.payWay[0].payMode
        this.paymentMethod = this.payWay[0].text
      },
      checkPayResult: function () {
        this.$Loading.open();
        let url = '/app/json/app_pay/queryExternalPayInfo';
        let paramsData = {
          prepayId: this.prepayId,
          orderNo: this.orderNo,
          clinetId: this.clinetId
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            this.payInfo = res.data.data
            if (res.data.status != '0'){
              this.applyOrder()
            }else {
              this.hiddenInterface = true
              this.payInfo = res.data.data
              // this.integer = parseInt(this.payInfo.payAmount)
              let str = this.payInfo.payAmount
              str = str.toString().split('.');
              this.integer = str[0]
              this.decimal = str[1]
              this.setPayWays()
            }
          },
          error => {
            this.$Loading.close();
          }
        )
      },
      // 重复提交订单时
      applyOrder: function () {
        this.$MessageBox.confirm('订单已提交，请勿重新提交订单！', '提示', {showCancelButton:false,closeOnClickModal:false}).then(action => {
          this.backEvent();
        }).catch(action => {
        });
      },
      timerCreated: function () {
        const TIME_COUNT = 1800;
        if (!this.myTimer) {
          this.timeValue = TIME_COUNT;
          this.myTimer = setInterval(() => {
            if (this.timeValue > 0 && this.timeValue <= TIME_COUNT) {
              this.timeValue--;
              this.timeValueString()
            } else {
              clearInterval(this.myTimer);
              this.myTimer = null;
            }
          }, 1000)
        }
      },
      timeValueString: function () {
        let time = this.timeValue
        let h = '00', m = '00', s = '00';
        if (time > 3600) {
          h = parseInt(time / 3600)
          time = time % 3600
        }
        if (time > 60) {
          m = parseInt(time / 60)
          time = time % 60
        }
        s = time
        this.timeString = h + ':' + m + ':' + s
      },
    },

    created() {
      // this.occurOuCode = this.$route.params.occurOuCode ? this.$route.params.occurOuCode : ''
      // this.payInfo = this.$route.params.payInfo ? this.$route.params.payInfo : {}
      // this.$mallCommon.dataProcessing(this.payInfo);
      this.prepayId = this.$route.query.prepayid;
      this.orderNo = this.$route.query.orderno;
      this.clinetId = this.$route.query.clientid;
      this.redirectUrl = this.$route.query.redirectUrl ? this.$route.query.redirectUrl : '';
      this.timerCreated();
      this.checkPayResult();


    },
    mounted() {
      //从后台进前台的协议
      this.$bridgefunc.enterForegroundCallBack(() => {
        if (this.hasToPay) {
          this.hasToPay = false;
          this.checkPayResult();
        }
      })
    },
    activated() {

    },
    // beforeRouteLeave(to, from, next) {
    //   this.$keepaliveHelper.deleteCache(this)
    //   next()
    // }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .index {
    width 100%
    height 100%
    overflow hidden

    .money-icon {
      margin-top 20px;
      text-align center;

      img {
        width 40px;
        height 40px;
      }
    }

    .return{
      height 64px
      text-align right
      padding-top 15px
      img{
        width 30px
        height 30px
      }
    }
    .title-first {

      .content {
        height 130px
        margin-top 50px
        text-align center
        align-items center

        .content-div {
          font-size 30px
          color #f80f16
          font-weight 500

          .symbol {
            font-size 14px
            font-weight 500
          }

          .decimal {
            font-size 14px
            font-weight 500
          }
        }
      }

      .tradingNumber {
        color #333333
        padding 10px 0 10px 5px
        font-weight 500
        font-size $font-size-medium;
      }
    }

    .transaction {
      margin 8px;
      padding 4px 0px;
      border-radius 8px;
      overflow hidden;
      box-shadow 0 1px 8px #efefef;

      .flex-row {
        padding 12px 0px;
        display flex;
        align-items center;
        font-size $font-size-medium;

        .label-min {
          width 50px;
        }

        .label-middle {
          width 65px;

          i {
            font-size 14px;
          }
        }

        .label {
          width 90px;
        }

        .label-btn {
          width 90px;
          margin -10px;
          padding 10px;
        }

        .full {
          flex 1;
        }

        .title {
          padding-left 8px
          font-size 15px;
        }

        .row-input {
          width 100%;
          margin 0px 0px;
          padding 5px 5px;
        }

        .name {
          font-size $font-size-medium-x;
          font-weight 500;
          margin-right 10px;
        }

        .swith {
          margin -3px 0px;

          img {
            width 44px;
            height 22px;
          }
        }

        .logo {
          height 18px;
          margin-right 10px;

          img {
            display block;
            height 100%;
          }
        }

        .row-btn {
          margin-left 8px;
          font-size $font-size-medium;
          padding 6px 8px;
          border-radius 16px;
          border-width 0.5px
          border-style solid
        }

        .row-btn-big-space {
          padding 4px 18px;
        }

        .shop-title {
          font-size $font-size-medium-x;
          margin-right 10px;

          .dianpu-icon {
            padding-right 5px;
            font-size $font-size-large;
            font-weight 600;
          }
        }

        .shop-info {
          font-size $font-size-medium
          text-align center;

          p:nth-child(2) {
            font-size $font-size-small
            padding-top 8px;
          }
        }

        .shop-info:nth-child(1) {
          padding-left 50px;
        }

        .shop-info:nth-child(2) {
          padding-right 50px;
        }

        .address-div {
          line-height 1.2;
        }
      }

    }

    .pay-info {
      text-align center;
      padding-bottom 10px;

      .text {
        font-size 16px;
        margin-top 10px;
      }

      .amount {
        font-size 12px;
        margin-top 8px;

        .price-i {
          font-size 18px;
          font-weight 500;
          margin-right -4px;
        }
      }
    }

    .icon-div {
      padding-left 8px
      margin-right 8px;

      img {
        width 22px;
        height 22px;
      }
    }

    .selected-mark {
      padding-right 10px

      i {
        font-size 18px;
      }
    }

    .bottom-btn {
      position absolute;
      bottom 0px;
      left 0px;
      right 0px;
      text-align center
      padding 16px;
      font-size 18px;
      font-weight 500;
    }
  }

  .flex-now:nth-child(n+3) {
    border-top 1px solid #efefef
  }
</style>

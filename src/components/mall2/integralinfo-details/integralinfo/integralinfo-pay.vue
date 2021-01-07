/**Created by steven on 2018/12/21.*/

<template>
  <div class="my-qrcode">
    <nav-top title="积分支付" @backEvent="backEvent"></nav-top>
    <nav-content class="my-qrcode-container" v-if="complete">
      <div class="code-content">
        <div class="top-div">
        </div>
        <div class="qr-div">
          <div class="phone">积分：{{$route.query.integralinfo || 0}}</div>
          <div class="barcode">
            <canvas id="barcode"></canvas>
          </div>
          <p class="code">{{myInfo.qrCode}}</p>
          <div class="codeimg-content">
            <div class="qrcode" id="qrcode" ref="qrcode"></div>
            <div class="icon">五分钟有效</div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'
  import JsBarcode from 'jsbarcode'
  import DigitalPwd from '../../../mall2/common/digital-pwd'
  import md5String from "../../../../utils/md5";
  export default {
    name: "my-qrcode",
    components: {
      QRCode,
      // AgreementContent
    },
    data() {
      return {
        myInfo: {},
        complete: false,
        myTimeout: null,
        brightnessResult: {}
      }
    },
    mounted() {
      this.makePayQrcode();
    },
    methods: {
      makePayQrcode: function () {
        // 用户生成预支付二维码接口
        this.$Loading.open()
        let url = '/app/json/app_pay/makePayQrcode';
        let params1 = {
          token: this.$store.state.login.token,
          payMode: 120, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金
          // groupValue: '', // 分组值  奖励金用
          distOuCode: 1, // 发单机构
          imgVerifyCode: this.$route.query.verifyCode || '',
          uuid: this.$route.query.uuid || ''
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.complete = true
            this.myInfo = data.data;
            this.$nextTick(() => {
              this.toCanvas()
              clearInterval(this.queryPayStateTimer)
              this.queryPayStateTimer = setInterval(() => {
                this.payQrcodeCheck(this.myInfo.qrcode)
              }, 2000)
            })
          } else {
            if (this.$store.state.globalConfig.qrcodePayVerify == '1') {
              /**
               * 如果配置了 需要验证码 报错时 直接返回上一页
               */
              this.$router.go(-1)
            }
            this.$Toast(data.info);
          }
        }, error => {
          this.$Loading.close();
        })
      },
      payQrcodeCheck(qrcode) {
        // 检查预支付二维码状态接口
        this.digitalPWD = ''
        let url = '/app/json/app_pay/payQrcodeCheck';
        let params1 = {
          token: this.$store.state.login.token,
          payMode: 120, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金
          qrcode: qrcode // 二维码
        }
        this.$http.post(url, params1).then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.payDetais = data.data
            if (this.payDetais.payUnit) {
              clearInterval(this.queryPayStateTimer)
              if (this.payDetais.needPayPwd) { // 是否需要支付密码
                // 需要
                if (this.payDetais.payPwdState == '1') { // 支付密码状态  0未设置支付密码 1支付密码已锁定 2已设置支付密码
                  this.$Toast("支付密码已锁定，请稍后再试！")
                  return ;
                } else {
                  DigitalPwd.open({
                    initData: {
                      payPwdState: this.payDetais.payPwdState
                    },
                    toSettingPwd: () => {
                      this.$router.push({
                        path: '/usercenter/nosetpwd',
                        query: {
                          isSet: this.payDetais.payPwdState,
                          source: 'rebate'
                        }
                      })
                      DigitalPwd.close();
                    },
                    inputFinished: (value) => {
                      this.digitalPWD = value
                      this.payQrcodePay(this.digitalPWD, qrcode)
                      DigitalPwd.close();
                    }
                  })
                }
              } else {
                this.payQrcodePay(this.digitalPWD, qrcode)
              }
            }
          } else {
          }

        }, error => {
        })
      },
      payQrcodePay(digitalPWD, qrcode) {
        // 预支付二维码支付接口
        let payPwd = ''
        if (digitalPWD) {
          payPwd = md5String(digitalPWD)
        }
        this.$request.post('/app/json/app_pay/payQrcodePay', {
          payMode: 120, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金
          qrcode: qrcode, // 二维码
          PayPwd: payPwd // 支付密码
        }).then(res => {
          if (res.status === 0) {
            this.$router.push({
              path: '/usercenter/pay-results',
              query: {payInfo: JSON.stringify(this.payDetais)}
            })
          } else {
            this.$Toast(res.info)
          }
        })
      },
      toCanvas: function () {

        let barcode = document.getElementById('barcode');
        JsBarcode(barcode, this.myInfo.qrcode);

        let qrDiv = document.getElementById('qrcode');
        qrDiv.innerHTML = '';
        let qrcode = new QRCode('qrcode', {
          width: 200,  // 设置宽度
          height: 200, // 设置高度
          text: this.myInfo.qrcode
        })
        let imgElArr = document.getElementById('qrcode').getElementsByTagName('img');
        let imgEl = imgElArr[0];
        imgEl.style.width = "100%";
        imgEl.style.height = "100%";
      },



      backEvent: function () {
        this.$keepaliveHelper.deleteCache(this)
        this.$router.go(-1)
      }
    },
    destroyed() {
      clearInterval(this.queryPayStateTimer)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .my-qrcode {
    .my-qrcode-container {
      overflow-y auto
      -webkit-overflow-scrolling touch
    }

    .code-content {

      .top-div {
        width 100%
        height 140px
        background-image: url('./img/hyqy.png')
        background-size: cover;

      }

      .qr-div {
        margin 0px 10px
        margin-top -90px; /*no*/
        position relative
        border-radius 5px
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
        background white
        .phone {
          padding: 15px
          font-size 16px
          font-weight bold
          border-bottom: 1px solid #f4f4f4
        }

        .barcode {
          margin: 20px 5px;
          height: 80px
          canvas {
            width 100%
            height 100%
          }
        }

        .code {
          text-align center
          font-size $font-size-medium
        }

        .codeimg-content {
          display flex
          justify-content center
          flex-direction column
          align-items center
          padding 20px 30px;

          .icon {
            font-size 14px
            color: $color-text
            padding-top: 20px
          }
        }

      }

      .qrcode-agreement {
        margin 20px 10px
        line-height 16px
      }
    }

  }
</style>

<template>
  <div class="my-qrcode">
    <nav-top @backEvent="backEvent" :title="details.dictValue"></nav-top>
    <nav-content class="my-qrcode-container">
      <div class="code-content" v-if="complete">
        <div class="balance qr-div">
          <p>账户红包余额</p>
          <span class="number">{{details.details.balanceUnit || '0'}}</span>
        </div>
        <div class="qr-div">
          <div class="barcode" @click="barcodeBtn">
            <canvas id="barcode"></canvas>
<!--            <p class="phone"><span class="phoneNumber">{{$store.state.login.phone.substring(0,4)+"*******"}}</span>查看数字-->
<!--            </p>-->
          </div>
          <div class="codeimg-content">
            <div class="qrcode" id="qrcode" ref="qrcode"></div>
          </div>
        </div>
        <div class="choseOil" @click="pushHistory">查看历史记录</div>
        <van-popup v-model="show">
          <div class="popup-show" @click="show = false">
            <div class="barcode">
              <canvas id="enlargeBarcode"></canvas>
<!--              <p class="phone">{{$store.state.login.phone.replace(/(.{4})/g, "$1&nbsp&nbsp&nbsp")}}</p>-->
            </div>
          </div>
        </van-popup>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'
  import JsBarcode from 'jsbarcode'
  import Config from '@/api/config.js'
  import DigitalPwd from '../../../mall2/common/digital-pwd'
  import md5String from "../../../../utils/md5";
  import {mapGetters} from 'vuex'


  export default {
    name: "my-qrcode",
    components: {
      QRCode
    },
    data() {
      return {
        show: false,
        myInfo: {},
        // myTimeout: null,
        statusObj: {
          totalAddUnit: 0,
          expireBalanceUnit: 0,
          totalConsumeUnit: 0
        },
        details: {
          details: {}
        },
        queryPayStateTimer: null,
        digitalPWD: '',
        payDetais: '', // 支付详情
        complete: false
      }
    },
    mounted() {
      this.details = JSON.parse(this.$route.query.details)
      this.makePayQrcode();
    },
    activated() {
      if (this.isPwdSet.status == 1) {
        // 设置过支付密码 直接调用支付接口
        this.payQrcodePay(this.isPwdSet.pwd, this.myInfo.qrcode)
        DigitalPwd.close();
      }
    },
    methods: {
      backEvent() {
        this.$keepaliveHelper.deleteCache(this)
        this.$router.go(-1)
      },
      barcodeBtn() {
        this.show = true
        this.$nextTick(res => {
          let barcode = document.getElementById('barcode');
          let enlargeBarcode = document.getElementById('enlargeBarcode');
          JsBarcode(barcode, this.myInfo.qrcode, {displayValue: false, width: 2, height: 130,});
          JsBarcode(enlargeBarcode, this.myInfo.qrcode, {displayValue: false, width: 2, height: 130,});
        })
      },
      makePayQrcode: function () {
        // 用户生成预支付二维码接口
        this.$Loading.open()
        let url = '/app/json/app_pay/makePayQrcode';
        let params1 = {
          token: this.$store.state.login.token,
          payMode: 121, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金
          groupValue: this.details.dictKey, // 分组值  奖励金用
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
          payMode: 121, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金
          qrcode: qrcode // 二维码
        }
        this.$http.post(url, params1).then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.payDetais = data.data
            if (this.payDetais.payUnit) {
              console.log(this.payDetais)// 支付点数  (如果为空,代表还没有发起支付)
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
                console.log(this.payDetais)
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
          payMode: 121, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金
          qrcode: qrcode, // 二维码
          PayPwd: payPwd // 支付密码
        }).then(res => {
          if (res.status === 0) {
            // this.$Toast("支付成功")
            console.log(this.payDetais)
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
        JsBarcode(barcode, this.myInfo.qrcode, {displayValue: false});

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
      pushHistory() {
        this.$keepaliveHelper.deleteCache(this)
        this.$router.push({
          path: '/usercenter/rebatebonuslist',
          query: {title: this.details.dictValue, dictKey: this.details.dictKey, ...this.statusObj}
        })
        console.log(this.details.dictValue)
        console.log(this.statusObj)
      }
    },
    destroyed() {
      clearInterval(this.queryPayStateTimer)
    },
    computed: {
      ...mapGetters(['isPwdSet'])
    }
  }
</script>

<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .my-qrcode {
    .my-qrcode-container {
      overflow-y auto
      -webkit-overflow-scrolling touch
    }

    .code-content {
      .qr-div {
        margin 5px 10px
        position relative
        border-radius 5px
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
        background white
        padding: 10px 0

        .phone {
          text-align center
          font-size $font-size-medium

          .phoneNumber {
            margin-right 2%
            font-weight $font-weight-x
          }
        }

        .barcode {
          height 64px
          padding: 0 20px

          canvas {
            width 100%
            height 100%
          }
        }

        .codeimg-content {
          display flex
          justify-content center
          padding 26px 0 10px 0

          .qrcode {
            width 56%
            height 56%
          }
        }
      }

      .balance {
        display flex
        align-items center
        flex-direction column
        padding 16px 0
        margin-top 10px
        font-size $font-size-medium

        .number {
          color $color-theme-r
          font-weight $font-weight-x
          font-size $font-size-medium-x
          display block
          margin-top 8px
        }
      }

      .choseOil {
        background-color: $color-theme-r;
        font-size $font-size-medium-x;
        color: #fff;
        font-weight $font-weight-x;
        text-align: center;
        padding: 0.32rem 0;
        border-radius: 50px;
        width: 92%;
        margin: 15px auto;
        box-shadow: 0 3px 10px 1px rgba(197, 197, 197, 0.56);

        &[disabled] {
          opacity 0.5
        }
      }
    }
  }

  >>> .van-popup {
    width 101%
    height 100%

    .popup-show {
      display flex
      justify-content center
      align-items center
      width 100%
      height 100%

      .barcode {
        transform: rotate(90deg)
      }

      .phone {
        text-align center
        font-size $font-size-large-x
      }
    }
  }
</style>

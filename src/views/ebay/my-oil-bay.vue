<template>
  <div class="my-ebay" v-if="complete">
    <nav-top :title="title" class="theme_bg_orange_i theme_font_white_i" :bgImg="1" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="my-ebay-container">
      <div class="top">
        <div class="help-tips">
          <span class="text" @click="openHelp">帮助说明</span>
        </div>
        <div class="title">当前拥有</div>
        <div class="ebay-num">
          <span class="num">{{balanceUnit}}</span>{{title}}
        </div>
      </div>
      <div class="my-ebay-info">
        <div class="qr-div">
          <div class="barcode" @click="barcodeBtn">
            <canvas id="barcode"></canvas>
          </div>
          <div class="codeimg-content">
            <div class="qrcode" id="qrcode" ref="qrcode"></div>
          </div>
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
    </nav-content>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'
  import JsBarcode from 'jsbarcode'
  import {mapGetters} from 'vuex'
  import DigitalPwd from '../../components/mall2/common/digital-pwd'
  import md5String from "../../utils/md5";
  import Verify from '@/components/commonui/common-verify/index'

  export default {
    data() {
      return {
        myInfo: {},
        show: false,
        digitalPWD: '',
        statusObj: {
          totalAddUnit: 0,
          expireBalanceUnit: 0,
          totalConsumeUnit: 0
        },
        cardList: [],
        dict: '', // 油贝信息
        title: '', // 标题
        complete: false,
        balanceUnit: '' // 当前拥有油贝总额
      }
    },
    mounted() {
      this.getlist() // 获取返利红包分组
      this.openVerify() // 用户生成预支付二维码接口
    },
    activated() {
      if (this.isPwdSet.status == 1) {
        // 设置过支付密码 直接调用支付接口
        this.payQrcodePay(this.isPwdSet.pwd, this.myInfo.qrcode)
        DigitalPwd.close();
      }
    },
    methods: {
      openVerify() {
        // 验证
        if (this.$store.state.globalConfig.qrcodePayVerify == '1') { // 为1判断开启验证码验证, 如果不存在配置则默认不开启
          Verify.open({
            type: 'qrcodePay_verify',
            sureFunc: this.imgSureFunc,
            vertifyCancelEvent: () => {
              this.$router.go(-1)
            },
            paras:{
              phone: this.$store.state.login.phone,
              token: this.$store.state.login.token
            }
          })
        } else {
          this.imgSureFunc(null, null)
        }
      },
      imgSureFunc:function(verifyCode,uuid) {
        this.makePayQrcode(verifyCode,uuid) // 获取二维码
      },
      getlist() {
        // 获取返利红包分组
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          alias: 'rewards_group' // 返利红包分组--字典表
        }
        this.$http.post('/app/json/app_dict/getDictByAlias', paramsData).then(res => {
          let data = res.data
          this.$Loading.close()
          if (data.status == 0) {
            this.cardList = data.data
            let list = this.cardList || []
            list.map(item => { // 循环 为了拿dictKey值 作为查询当前余额的参数
              if (item.dictKey == 1) {
                this.getAccountBaseInfo(item.dictKey)
                this.dict = item
                this.title = item.dictValue
              }
            })
          } else {
            this.$Toast(data.info)
          }
          this.complete = true
        })
      },
      getAccountBaseInfo(groupValue) {
        // 获取红包金额
        let paramsData = {
          token: this.$store.state.login.token,
          acctType: 8,
          groupValue: groupValue
        }
        this.$http.post('/app/json/acct/getAccountBaseInfo', paramsData).then(res => {
          let data = res.data || {}
          if (data.status == 0) {
            this.balanceUnit = data.data.balanceUnit
            this.$set(this.dict, 'details', data.data) // 新增参数 以获取 当前余额 解决新增属性 视图不更新
          } else {
            this.$Toast(data.info ? data.info : '获取失败')
          }
        })
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
      makePayQrcode(verifyCode,uuid) {
        // 用户生成预支付二维码接口
        this.$Loading.open()
        let url = '/app/json/app_pay/makePayQrcode';
        let params1 = {
          token: this.$store.state.login.token,
          payMode: 121, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金
          groupValue: 1, // 分组值  奖励金用 加油返利红包
          distOuCode: 1, // 发单机构
          imgVerifyCode: verifyCode,
          uuid: uuid
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.myInfo = data.data;
            this.$nextTick(() => {
              this.toCanvas()
              clearInterval(this.queryPayStateTimer)
              this.queryPayStateTimer = setInterval(() => {
                this.payQrcodeCheck(this.myInfo.qrcode)
              }, 2000)
            })

          } else {
            this.$Toast(data.info);
            if (this.$store.state.globalConfig.qrcodePayVerify == '1') {
              /**
               * 如果配置了需要验证码 错误以后 再次弹出验证码框
               */
              this.openVerify()
            }
          }

        }, error => {
          this.$Loading.close();
        })
      },
      payQrcodeCheck(qrcode) {
        // 检查预支付二维码状态接口
        this.digitalPWD = ''
        this.$request.post('/app/json/app_pay/payQrcodeCheck', {
          payMode: 121, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金
          qrcode: qrcode, // 二维码
          hideLoading: true
        }).then(res => {
          if (res.status === 0) {
            this.payDetais = res.data
            if (this.payDetais.payUnit) {  // 支付点数  (如果为空,代表还没有发起支付)
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
            this.$router.push({
              path: '/usercenter/pay-results',
              query: {payInfo: JSON.stringify(this.payDetais)}
            })
          } else {
            this.$Toast(res.info)
          }
        })
      },
      toCanvas() {

        let barcode = document.getElementById('barcode')
        JsBarcode(barcode, this.myInfo.qrcode, {displayValue: false})

        let qrDiv = document.getElementById('qrcode')
        qrDiv.innerHTML = ''
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
          path: '/oil-point-history'})
      },
      openHelp() {
        // 打开帮助说明
        this.$router.push({path: '/help-instructions'})
      }
    },
    destroyed() {
      clearInterval(this.queryPayStateTimer)
    },
    computed: {
      ...mapGetters(['isPwdSet'])
    },
    components: {
      QRCode
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .my-ebay {
    .my-ebay-container {
      .top {
        height: 130px
        background: -webkit-linear-gradient(90deg, #ee6c65, #f08160)
        color: #fff
        padding: 15px
        line-height 24px

        .help-tips {
          text-align right

          .text {
            padding: 5px 8px
            background #e46651
            border-radius 20px
            color: #f4e9e5
          }
        }

        .title, .ebay-num {
          text-align center
          font-size: 16px

          .num {
            font-size: 28px
            font-weight bold
          }
        }

        .ebay-num {
          padding-top: 5px
        }
      }

      .my-ebay-info {
        padding: 10px 0
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
</style>

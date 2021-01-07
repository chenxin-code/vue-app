<template>
  <div class="electronic-wallet" @click="dropmenuShow = false">
    <nav-top title="电子钱包" @backEvent="backEvent">
      <i class="iconfont mall-gengduo" @click.stop="dropmenuShow = !dropmenuShow"></i>
    </nav-top>
    <nav-content class="electronic-wallet-container" v-if="complete" >
      <!--      右上角弹框-->
      <div class="dropmenu" v-show="dropmenuShow" @click.stop>
        <div class="dropmenu-item" @click="linkTo(1)">我的账单</div>
        <div class="dropmenu-item" @click="linkTo(2)">刷新支付码</div>
        <div class="dropmenu-item" @click="linkTo(3)">常见问题</div>
        <div class="dropmenu-item" @click="linkTo(4)">申请退款</div>
        <div class="dropmenu-item" @click="linkTo(5)" v-if="walletState == true">{{noQrocode == true ? '启用付款码' : '关闭付款码'}}</div>
      </div>
      <div v-if="noOpen">
        <!--      未开通-->
        <div class="no-open" v-if="noAudit">
          <div class="top">
            <div class="img">
              <img src="./image/picture1@2x.png.png" alt="">
            </div>
            <div class="text">您还未开通电子钱包<br/>点击"立即开通"解锁钱包功能吧</div>
          </div>
          <div class="footer">
            <van-checkbox v-model="checked" checked-color="#F80F16">
              我已阅读并同意<span class="agreement" @click="showAgreement = true">《开通协议》</span>
            </van-checkbox>
            <div class="submit-btn" @click="nowOpen">立即开通</div>
            <van-dialog
              v-model="showDialog"
              show-cancel-button
              cancelButtonText="不了 我在想想"
              confirmButtonText="马上认证"
              @cancel="showDialog = false"
              @confirm="confirm"
            >
              <div class="content">您还没有进行实名认证<br/>是否前去认证</div>
            </van-dialog>
          </div>
        </div>
        <!--      审核中-->
        <div class="top" v-else>
          <div class="img">
            <img src="./image/picture2@2x.png" alt="">
          </div>
          <div class="text">实名认证审核中，审核通过将自动开启钱包功能，<br/>请耐心等待</div>
        </div>
      </div>
      <!--      已开通-->
      <div class="open" v-else>
        <div class="show-open-before" v-if="noQrocode">
          <div class="img">
            <img src="./image/icon4@2x.png" alt="">
          </div>
          <div class="money">￥<span class="num">{{walletBalance}}</span></div>
          <div class="use-btn" @click="openPayCode">启用付款码</div>
        </div>
        <div class="show-open-after" v-else>
          <div class="codeimg-content">
            <div class="qrcode" id="qrcode" ref="qrcode"></div>
          </div>
          <div class="text">商家扫一扫付款</div>
          <div class="money">￥<span class="num">{{walletBalance}}</span></div>
        </div>
        <div class="submit-btn" @click="walletRecharge">钱包充值</div>
      </div>
      <van-action-sheet v-model="showAgreement" title="开通协议">
        <div class="agreement" v-for="(item, index) in newsList" :key="index" v-html="item.content"></div>
      </van-action-sheet>
      <!--      弹框提示 密码输入错误 -->
      <van-dialog
        v-model="show"
        show-cancel-button
        confirmButtonText="忘记密码"
        cancelButtonText="重新输入"
        confirmButtonColor="#ffffff"
        @confirm="confirmPwd"
        @cancel="cancel"
      >
        <div class="tips-content">支付密码有误，请重新输入</div>
      </van-dialog>
      <!--      弹框提示 未设置密码 -->
      <van-dialog
        v-model="showSetPwd"
        show-cancel-button
        confirmButtonText="前往设置"
        cancelButtonText="不了，我再想想"
        confirmButtonColor="#ffffff"
        @confirm="confirmSetPwd"
        @cancel="showSetPwd = false"
      >
        <div class="tips-content">您还未设置虚拟支付密码<br />是否前去设置？</div>
      </van-dialog>
    </nav-content>
  </div>
</template>

<script>
  import DigitalPwd from '@/components/mall2/common/digital-pwd'
  import QRCode from 'qrcodejs2'
  import md5String from "@/utils/md5";
  import Verify from '@/components/commonui/common-verify/index'

  export default {
    data() {
      return {
        show: false, // 弹框提示 密码输入错误
        showSetPwd: false, // 弹框提示 未设置密码
        complete: false,
        dropmenuShow: false,
        checked: false, // 阅读协议
        showDialog: false, // 立即开通提示弹框
        payDetais: '', // 支付详情
        details: '',
        queryPayStateTimer: null,
        myInfo: {},
        noQrocode: true, // 付款码启用与否
        showAgreement: false, // 协议弹框
        newsList: [],
        walletState: '', // 电子钱包状态
        noOpen: true, // 电子钱包开通状态 true未开通 false 已开通
        noAudit: true, // 是否是审核状态   true 未开通 false 审核中
        authentState: '', // 实名认证的状态 0 : 未认证 1：认证成功 2 ：审核中
        payCodeState: '', // 付款码状态
        walletBalance: 0.00, // 钱包余额
        pwdState: '' // 是否设置密码
      }
    },
    mounted() {
      this.getWalletState()
      this.showagreement() // 开通协议
    },
    methods: {
      openVerify() {
        if (this.$store.state.globalConfig.qrcodePayVerify == '1') { // 为1判断开启验证码验证, 如果不存在配置则默认不开启
          Verify.open({
            type: 'qrcodePay_verify',
            sureFunc: this.imgSureFunc,
            vertifyCancelEvent: () => {
              if (this.payCodeState == true) {
                this.$router.go(-1)
              } else {
                Verify.close()
              }
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
      cancel() {
        // 重新输入按钮
        DigitalPwd.open({ // 支付密码状态  0未设置支付密码 1支付密码已锁定 2已设置支付密码
          initData: {
            payPwdState: this.pwdState.payPwdState,
            title: '验证身份',
            tips: '请输入虚拟支付密码，进行身份验证'
          },
          toSettingPwd: () => {
            this.$router.push({
              path: '/usercenter/nosetpwd',
              query: {
                isSet: this.pwdState.payPwdState
              }
            })
            DigitalPwd.close();
          },
          inputFinished: (value) => {
            // this.digitalPWD = value
            this.setPayCode(2, value)
            DigitalPwd.close();
          }
        })
      },
      confirmPwd() {
        // 忘记密码按钮
        this.$router.push({path: '/usercenter/forgetPwd'})
      },
      confirmSetPwd() {
        // 前往设置按钮
        this.$router.push({path: '/usercenter/nosetpwd', query: {isSet: 0}})
      },
      showagreement() {
        this.$request.post('/app/json/news/getNewsList', { values: 26 }).then(res => {
          if (res.status == 0) {
            this.newsList = res.data
          }
        })
      },
      backEvent() {
        this.$keepaliveHelper.deleteCache(this)
        this.$router.go(-1)
      },
      getWalletState() {
        // 电子钱包状态
        this.$request.post('/app/json/my_wallet/getWalletState').then(res => {
          if (res.status === 0) {
            this.walletState = res.data // true 开通  false 未开通 （走判断实名认证的状态接口）
            if (this.walletState) { // 开通成功以后 获取付款码状态
              this.getPayCodeState()
            } else { // 未开通
              this.getAuthentState()
            }
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      getAuthentState() {
        // 实名认证的状态
        this.$request.post('/app/json/my_wallet/getAuthentState').then(res => {
          if (res.status === 0) {
            this.complete = true
            this.noOpen = true
            this.authentState = res.data // 0 : 未认证 1：认证成功 2 ：审核中
            if (this.authentState == 2) {
              this.noAudit = false
            }
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      getPayCodeState() {
        // 付款码状态
        this.$request.post('/app/json/my_wallet/getPayCodeState').then(res => {
          if (res.status === 0) {
            // 获取成功以后 获取电子钱包余额
            this.payCodeState = res.data
            if (this.payCodeState == false) {
              this.noQrocode = true // 未开启
            } else {
              // this.makePayQrcode()
              this.openVerify()
            }
            this.getWalletBalance()
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      getWalletBalance() {
        // 电子钱包余额
        this.$request.post('/app/json/acct/getAccountBaseInfo', {
          acctType: 1
        }).then(res => {
          if (res.status === 0) {
            this.walletBalance = res.data.balanceUnit ? res.data.balanceUnit : '0.00'
            this.noOpen = false
            this.complete = true
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      setWallet() {
        // 开通电子钱包
        this.$request.post('/app/json/my_wallet/setWallet').then(res => {
          if (res.status === 0) {
            this.$Toast('开通成功') // 开通成功以后 获取付款码状态
            this.getPayCodeState()
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      setPayCode(type, payPwd) {
        // 开启或关闭付款码
        let pwd = ''
        if (type == 1) { // 1关闭 2开启
          pwd = ''
        } else {
          pwd = md5String(payPwd)
        }
        this.$request.post('/app/json/my_wallet/setPayCode', {
          payPwd: pwd
        }).then(res => {
          if (res.status === 0) {
            if (type == 1) {
              this.noQrocode == false
            } else {
              // this.makePayQrcode()
              this.openVerify()
            }
          } else {
            if (type == 1) {
              this.$Toast(res.info ? res.info : '操作失败')
            } else {
              this.show = true
            }
          }
        })
      },
      paPayPwdSate() {
        // 是否设置密码
        this.$request.post('/app/json/user/paPayPwdSate').then(res => {
          this.complete = true
          if (res.status === 0) {
            this.pwdState = res.data
            if (this.pwdState.payPwdState == 1) {
              this.$Toast('支付密码已锁定，请稍后再试！')
              return;
            } else if (this.pwdState.payPwdState == 0) {
              this.showSetPwd = true
            } else {
              DigitalPwd.open({ // 支付密码状态  0未设置支付密码 1支付密码已锁定 2已设置支付密码
                initData: {
                  payPwdState: this.pwdState.payPwdState,
                  title: '验证身份',
                  tips: '请输入虚拟支付密码，进行身份验证'
                },
                toSettingPwd: () => {
                  this.$router.push({
                    path: '/usercenter/nosetpwd',
                    query: {
                      isSet: this.pwdState.payPwdState
                    }
                  })
                  DigitalPwd.close();
                },
                inputFinished: (value) => {
                  this.setPayCode(2, value)
                  DigitalPwd.close();
                }
              })
            }
          } else {
            this.$Toast(res.info ? res.info : '操作失败')
          }
        })
      },
      nowOpen() {
        // 立即开通按钮
        if (this.checked == false) {
          this.$Toast('请阅读并同意协议')
        } else {
          // 0 : 未认证 1：认证成功 2 ：审核中
          if (this.authentState == 0) {
            // 未认证 给提示 去认证
            this.showDialog = true
          } else if (this.authentState == 1) {
            // 认证成功 走开通电子钱包接口
            this.setWallet()
          }
        }
      },
      openPayCode() {
        // 启用付款码
        /**
         *先判断用户是否设置支付密码
         */
        this.paPayPwdSate()
      },
      linkTo(type) {
        if (this.walletState == false && type != 3) {
          this.$Toast('请先开通电子钱包')
          return;
        }
        if (type == 1) {
          // 我的账单
          this.$router.push({path: '/bill'})
        } else if (type == 2) {
          // 刷新支付码
          if (this.noQrocode == true) {
            this.$Toast('请先启用付款码')
          } else {
            // this.makePayQrcode()
            this.openVerify()
          }
        } else if (type == 3) {
          // 常见问题
          this.$router.push({path: '/problems', query: {title: '常见问题', source: '1'}})
        } else if (type == 4) {
          // 申请退款
          this.$router.push({path: '/refund-application'})
        } else if (type == 5) {
          // 启用或关闭付款码
          if (this.noQrocode == true) {
            this.paPayPwdSate()
          } else {
            this.noQrocode = true
            this.setPayCode(1) // 关闭接口
            clearInterval(this.queryPayStateTimer)
          }
        }
        this.dropmenuShow = false
      },
      makePayQrcode: function (verifyCode,uuid) {
        // 用户生成预支付二维码接口
        this.$Loading.open()
        let url = '/app/json/app_pay/makePayQrcode';
        let params1 = {
          token: this.$store.state.login.token,
          payMode: 110, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金 110：电子账户
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
            this.noQrocode = false // 已开启
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
        // 用户生成预支付二维码接口
        this.digitalPWD = ''
        let url = '/app/json/app_pay/payQrcodeCheck';
        let params1 = {
          token: this.$store.state.login.token,
          payMode: 110, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金 110：电子账户
          qrcode: qrcode // 二维码
        }
        this.$http.post(url, params1).then(res => {
          this.noQrocode = false // 已开启
          let data = res.data;
          if (data.status == 0) {
            this.payDetais = data.data
            if (this.payDetais.payUnit) {  // 支付点数  (如果为空,代表还没有发起支付)
              clearInterval(this.queryPayStateTimer)
              if (this.payDetais.needPayPwd) { // 是否需要支付密码
                // 需要
                if (this.payDetais.payPwdState == '1') { // 支付密码状态  0未设置支付密码 1支付密码已锁定 2已设置支付密码
                  this.$Toast("支付密码已锁定，请稍后再试！")
                  return;
                } else {
                  DigitalPwd.open({
                    initData: {
                      payPwdState: this.payDetais.payPwdState,
                      title: '验证身份',
                      tips: '请输入支付密码，身份验证通过后即可向商家付款'
                    },
                    toSettingPwd: () => {
                      this.$router.push({
                        path: '/usercenter/nosetpwd',
                        query: {
                          isSet: this.payDetais.payPwdState
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
          payMode: 110, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金 110：电子账户
          qrcode: qrcode, // 二维码
          PayPwd: payPwd // 支付密码
        }).then(res => {
          if (res.status === 0) {
            // this.$Toast("支付成功")
            this.$router.push({
              path: '/pay-success',
              query: {payInfo: JSON.stringify(this.payDetais)}
            })
          } else {
            this.$Toast(res.info)
          }
        })
      },
      toCanvas: function () {

        // let barcode = document.getElementById('barcode');
        // JsBarcode(barcode, this.myInfo.qrcode, {displayValue: false});

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
      confirm() {
        // 弹框确认按钮
        this.$router.push({path: '/real-name-authentication'})
      },
      walletRecharge() {
        // 钱包充值
        this.$router.push({path: '/wallet-recharge'})
      }
    },
    destroyed() {
      DigitalPwd.close()
      clearInterval(this.queryPayStateTimer)
    },
    components: {
      DigitalPwd,
      QRCode
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .electronic-wallet {
    .electronic-wallet-container {
      padding: 11px 15px

      .top {
        text-align center
        color: $color-text-d
        line-height 20px
        padding-top: 30px

        .img {
          img {
            width: 170px
          }
        }
      }

      .no-open {
        .footer {
          text-align center
          padding-top 30px
          /deep/ .van-checkbox {
            display flex
            justify-content center
            align-items center
            padding: 10px 0
          }

          .agreement {
            color: $color-theme-r
          }

          .submit-btn {
            background-color: $color-theme-r;
            color: #fff;
            text-align: center;
            padding: 0.32rem 0;
            border-radius: 50px;
            width: 90%;
            margin: 0 auto
            box-shadow: 0 3px 10px 1px rgba(240, 44, 45, 0.5);

            &[disabled] {
              opacity 0.5
            }
          }

          .content {
            padding: 30px 0;
            line-height: 20px;
          }

          /deep/ .van-dialog__confirm {
            background: #F80F16;
            color: #fff;
          }
        }
      }

      .open {
        .show-open-before {
          text-align center
          line-height 30px

          .img {
            img {
              width: 80px
            }
          }

          .money {
            .num {
              font-size: 28px
            }
          }

          .use-btn {
            color: $color-theme-r
          }
        }

        .show-open-after {
          box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
          background: #fff
          border-radius 6px
          text-align center
          padding: 0 5px

          .codeimg-content {
            display flex
            justify-content center
            padding 26px 0 10px 0

            .qrcode {
              width 56%
              height 56%
            }
          }

          .text {
            padding: 10px 0 20px 0
          }

          .money {
            padding: 20px 0
            border-top: 1px solid #f3f3f3

            .num {
              font-size 28px
            }
          }
        }

        .submit-btn {
          background-color: $color-theme-r;
          color: #fff;
          text-align: center;
          padding: 0.32rem 0;
          border-radius: 50px;
          width: 90%;
          margin: 20px auto
          box-shadow: 0 3px 10px 1px rgba(240, 44, 45, 0.5);

          &[disabled] {
            opacity 0.5
          }
        }
      }
    }
  }

  .dropmenu {
    position: absolute;
    top: 0;
    right: 10px
    z-index: 10;
    background: rgba(0, 0, 0, 0.8);
    width: 100px;
    border-radius: 5px;
    text-align: center;
    font-size: 12px;
    line-height: 1.415;
    color: #fff
    padding: 0 5px

    .dropmenu-item {
      padding: 10px 0;

      & + .dropmenu-item {
        border-top: 0.5px solid #cccccc
      }
    }
  }

  .iconfont {
    position: absolute;
    right: 10px
    top: 0;
    font-size 20px
  }

  .agreement {
    padding: 15px
    line-height 20px
  }
  .tips-content {
    padding: 40px 0
    text-align center
    line-height 20px
  }
  /deep/ .van-dialog__confirm {
    background $color-theme-r
  }
</style>

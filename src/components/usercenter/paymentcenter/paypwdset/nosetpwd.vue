<template>
  <div class="no-set-pwd">
    <nav-top :title="titleTop" @backEvent="$router.go(-1)"></nav-top>
    <div class="pwd-div" :class="{'mask': active}">
      <!-- 密码输入框 -->
      <div class="topDiv">
        <!-- 密码输入框 -->
        <div class="pwd-input" v-show="pwdInput">
          <p class="title">{{title}}</p>
          <van-password-input
            :value="firstPwd"
            v-show="showFirstPwd"
          />
          <van-password-input
            :value="secondPwd"
            v-show="!showFirstPwd"
          />
        </div>
        <div class="yzPhone" v-show="!pwdInput">
          <div class="top">
            <div class="title">验证手机号</div>
            <div class="tips">输入手机尾号{{phone}}接受到的短信验证码</div>
            <van-field
              v-model="sms"
              center
              clearable
              maxlength="4"
              autosize
              placeholder="请输入短信验证码"
            >
              <van-button v-show="sendAuthCode" @click="sendSms" class="theme_font_red_i" slot="button" size="small"
                          type="default">发送验证码
              </van-button>
              <van-button v-show="!sendAuthCode" class="theme_font_red_i" slot="button" size="small"
                          type="default">{{auth_time}}秒后重发
              </van-button>
            </van-field>
          </div>
          <div class="two-btn">
            <div class="cancel" @click="$router.go(-1)">取消</div>
            <div class="query theme_bg_red_i" @click="modifyPwd">确定</div>
          </div>
        </div>
        <div class="modal-container img-modal-container" v-show="imgModal">
          <div class="modal">
            <div class="content">
              <div class="title">图像验证码</div>
              <div class="msg img-code-wrapper">
                <input class="input-control" type="text" v-model="imgCode" placeholder="请输入图形验证码"/>
                <img class="img img-code"
                     :src="imgCodeUrl"
                     mode="scaleToFill" alt="">
                <img class="img refresh" src="./img/refresh.png" @click="getVerifyImg" mode="widthFix" alt="">
              </div>
            </div>
            <div class="modal-btn-group">
              <div class="modal-btn" @click="imgModal = false">取消</div>
              <div class="modal-btn confirm theme_bg_red_i" @click="confirmImgCode">确定</div>
            </div>
          </div>
        </div>
        <p class="info" v-show="noEqually">{{equallyInfo}}</p>
      </div>
      <!-- 数字键盘 -->
      <div v-show="pwdInput">
        <van-number-keyboard
          :show="showKeyboardF"
          @input="onInputF"
          @delete="onDelete"/>
        <van-number-keyboard
          :show="!showKeyboardF"
          @input="onInputS"
          @delete="onDelete"/>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import MD5 from '@/utils/md5.js'
  import {Dialog} from 'vant'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: '',
    data() {
      return {
        titleTop: '设置6位支付密码', // 标题
        firstPwd: '', // 输入第1次的密码
        secondPwd: '', // 输入第2次的密码
        showKeyboardF: true, // 数字键盘
        showKeyboardSMS: true, // 短信数字键盘
        showFirstPwd: true, // 第一次输入的密码
        title: '输入6位支付密码', // title显示
        noEqually: false, // 密码不一致的提示现实与否
        equallyInfo: '两次密码不一致,请重新输入', // 密码不一致的提示内容
        isSet: '', // isSet为0 是未设置过密码 1 是设置过密码
        active: false, // 遮罩的背景
        sms: '', // 短信验证码
        auth_time: 0, // 发送短信倒计时
        sendAuthCode: true, /* 布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */
        pwdInput: true, // 密码显示框
        imgModal: false, // 图像验证码弹框
        imgCode: '', // 图片验证码
        imgCodeUrl: '', // 图片URL
        uuid: '', // 随机数
        originalPwd: '', // 原密码
        phone: '' // 手机号
      }
    },
    created() {
    },
    mounted() {
      // 获取手机号后四位
      this.phone = this.$store.state.login.phone
      this.phone = this.phone.substring(this.phone.length - 4)
      this.isSet = this.$route.query.isSet
      if (this.isSet == 1) {
        // 设置过支付密码
        this.titleTop = '验证原6位数字支付密码'
        this.title = '验证原6位数字支付密码'
      }
    },
    methods: {
      onInputF(key) {
        // 第一次输入密码的数字键盘
        let that = this
        that.firstPwd = (that.firstPwd + key).slice(0, 6)
        if (that.firstPwd.length == 6) {
          if (that.isSet != 1) {
            // 没设置
            that.title = '再次确认支付密码'
            that.showKeyboardF = false // 数字键盘切换
            that.showFirstPwd = false // 密码切换
            that.noEqually = false // 关闭密码不一致的提示
          } else {
            // 已设置 验证支付密码
            this.$Loading.open()
            let paramsData = {
              token: this.$store.state.login.token,
              originalPwd: MD5(this.firstPwd), // 原密码
              payPwdMode: 11 // 支付密码类型：11：普通支付密码；12：手势支付密码；13:刷脸支付密码；14：指纹支付密码；
            }
            this.$http.post('/app/json/user/validPayPwd', paramsData).then(res => {
                this.$Loading.close()
                let data = res.data
                if (data.status == 0) {
                  // 商品列表
                  Dialog.alert({
                    title: '提示',
                    message: '密码验证成功',
                  }).then(() => {
                    this.originalPwd = this.firstPwd
                    // 输入正确的原密码时 需验证手机号
                    this.pwdInput = false
                    this.titleTop = '身份验证'
                    this.active = true // 添加遮罩效果
                  })
                } else {
                  // 输入错误的原密码时
                  this.noEqually = true
                  this.equallyInfo = data.info
                  this.firstPwd = ''
                  if (data.errorCode == 3007) {
                    // 输入超过5次 被锁定
                    Dialog.alert({
                      title: '提示',
                      message: '密码已被锁定!',
                    }).then(() => {
                      this.$router.go(-1)
                    })
                  }
                }
              },
              error => {
                this.$Loading.close()
                this.$Toast('请求数据失败！')
              })
          }
        }
      },
      onInputS(key) {
        // 第二次输入密码的数字键盘
        let that = this
        that.secondPwd = (that.secondPwd + key).slice(0, 6)
        if (that.secondPwd.length == 6) {
          if (that.secondPwd != that.firstPwd) {
            that.noEqually = true // 密码不一致提示信息显示
            this.equallyInfo = '两次密码不一致,请重新输入'
            that.showKeyboardF = true // 数字键盘切换
            that.showFirstPwd = true // 密码切换
            that.secondPwd = ''
            that.firstPwd = ''
            that.title = '输入6位支付密码'
          } else {
            if (that.$route.query.isSet == 1) {
              // 修改支付密码
              that.$Loading.open()
              let paramsData = {
                token: that.$store.state.login.token,
                originalPwd: MD5(that.originalPwd), // 原密码
                userPayPwd: MD5(that.firstPwd), // 新密码
                confirmPwd: MD5(that.secondPwd), // 确认密码
                smsVerifyCode: that.sms, // 确认密码
                phone: that.$store.state.login.phone, // 确认密码
                payPwdMode: 8, // 密码类型，默认传8  支付密码
              }
              that.$http.post('/app/json/user/modifyPayPwd', paramsData).then(res => {
                that.$Loading.close()
                let data = res.data
                if (data.status == 0) {
                  // 商品列表
                  that.title = '密码修改成功'
                  Dialog.alert({
                    title: '提示',
                    message: '密码修改成功',
                  }).then(() => {
                    that.$router.go(-1)
                  })
                } else {
                  Dialog.alert({
                    title: '提示',
                    message: data.info,
                  }).then(() => {
                    that.$router.go(-1)
                  })
                }
              }, error => {
                that.$Loading.close()
                that.$Toast('请求数据失败！')
              })
            } else if (that.$route.query.sms) {
              // 忘记密码 重置
              that.$Loading.open()
              let paramsData = {
                token: that.$store.state.login.token,
                userPayPwd: MD5(that.firstPwd), // 新密码
                confirmPwd: MD5(that.secondPwd), // 确认密码
                smsVerifyCode: that.$route.query.sms, // 手机验证码
                phone: that.$store.state.login.phone, // 手机号
              }
              that.$http.post('/app/json/user/forgetPayPwd', paramsData).then(res => {
                that.$Loading.close()
                let data = res.data
                if (data.status == 0) {
                  // 商品列表
                  this.title = '密码重置成功'
                  Dialog.alert({
                    title: '提示',
                    message: '密码重置成功',
                  }).then(() => {
                    that.$router.go(-2)
                  })
                } else {
                  Dialog.alert({
                    title: '提示',
                    message: data.info,
                  }).then(() => {
                    that.$router.go(-1)
                  })
                }
              }, error => {
                that.$Loading.close()
                that.$Toast('请求数据失败！')
              })
            } else {
              // 设置支付密码
              that.$Loading.open()
              let paramsData = {
                token: that.$store.state.login.token,
                userPayPwd: MD5(that.firstPwd), // 新密码
                confirmPwd: MD5(that.secondPwd), // 确认密码
                payPwdMode: 8, // 密码类型，默认传8  支付密码
              }
              that.$http.post('/app/json/user/setUserPayPwd', paramsData).then(res => {
                that.$Loading.close()
                let data = res.data
                if (data.status == 0) {
                  // 商品列表
                  that.title = '密码设置成功'
                  Dialog.alert({
                    title: '提示',
                    message: '密码设置成功',
                  }).then(() => {
                    if (this.$route.query.source == 'rebate') {
                      this.setIsPwdSet(this.$assign({}, this.isPwdSet, {
                        status: 1, // 设置密码成功 返回 返利红包支付页 直接调起支付接口
                        pwd: that.secondPwd, // 设置的密码
                      }))
                      this.$bridgefunc.vuexStorage()
                    }
                    that.$router.go(-1)
                  })
                } else {
                  Dialog.alert({
                    title: '提示',
                    message: data.info,
                  }).then(() => {
                    that.$router.go(-1)
                  })
                }
              }, error => {
                that.$Loading.close()
                that.$Toast('请求数据失败！')
              })
            }
          }
        }
      },
      getVerifyImg() {
        // 获取图像验证码
        this.uuid = this.$util.randomString()
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          uuid: this.uuid // 随机数
        }
        this.$http.post('/app/json/login/getVerifyImg', paramsData).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.imgCodeUrl = data.data
          } else {
            this.$toast(res.info || '获取图片验证码失败！')
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('请求数据失败！')
        })
      },
      confirmImgCode() {
        // 图像密码 确认输入框
        if (this.imgCode == '') {
          this.$toast('请输入图形码')
        } else {
          this.imgModal = false
          this.sendAuthCode = false
          this.auth_time = 119
          let timer = setInterval(() => {
            this.auth_time--
            if (this.auth_time <= 0) {
              this.sendAuthCode = true
              clearInterval(timer)
            }
          }, 1000)
          this.getCode()
        }
      },
      getCode() {
        // 发送短信接口
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          phone: this.$store.state.login.phone,
          smsType: '1120',
          imgVerifyCode: this.imgCode,
          uuid: this.uuid // 随机数
        }
        this.$http.post('/app/json/login/sendSms', paramsData).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.imgCodeUrl = data.data
          } else {
            this.sendAuthCode = true
            this.$toast(res.info || '短信发送失败！')
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('请求数据失败！')
        })
      },
      modifyPwd() {
        // 去修改密码
        if (this.sms == '') {
          Dialog.alert({
            title: '提示',
            message: '请输入短信验证码',
          }).then(() => {

          })
        } else {
          this.titleTop = '设置6位支付密码'
          this.title = '输入6位支付密码'
          this.equallyInfo = ''
          this.firstPwd = ''
          this.isSet = 0
          this.pwdInput = true
          this.active = false
        }
      },
      onDelete() {
        // 删除数字键盘的值
        this.firstPwd = this.firstPwd.slice(0, this.firstPwd.length - 1)
        this.secondPwd = this.secondPwd.slice(0, this.secondPwd.length - 1)
        this.sms = this.sms.slice(0, this.sms.length - 1)
      },
      sendSms() {
        // 发送短信按钮
        this.imgModal = true
        this.getVerifyImg() // 获取图像验证码
      },
      ...mapMutations(['setIsPwdSet'])
    },
    computed: {
      ...mapGetters(['isPwdSet'])
    },
    components: {
      [Dialog.name]: Dialog
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .no-set-pwd {
    .mask {
      background rgba(0, 0, 0, 0.4)
    }
    .pwd-div {
      position absolute
      top 0
      left 0
      right: 0
      bottom 0
      .topDiv {
        width: 85%
        position absolute
        top 30%
        left 50%
        transform translate(-50%, -30%)
        .pwd-input {
          .title {
            width: 100%
            text-align: center
            line-height: 60px
          }
        }
        .info {
          width: 100%
          text-align: center
          line-height: 20px
          color: $color-theme-r
          padding: 10px 0
        }
        .yzPhone {
          width: 90%
          position absolute
          top 10%
          left 50%
          transform translate(-50%, -10%)
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
          border-radius 4px
          color: $color-text
          background: #fff
          .top {
            padding: 20px 11px 15px 11px
            .title {
              text-align: center
              font-size: 16px
              font-weight: bold
            }
            .tips {
              text-align: center
              color: #b5b4b4
              font-size: 12px
              padding: 15px 0
            }
          }
          .two-btn {
            border-bottom-right-radius 4px
            border-bottom-left-radius 4px
            box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
            overflow hidden
            div {
              float: left
              width: 50%
              text-align center
              font-size: 14px
              border-bottom-right-radius 4px
              padding: 15px 0
              font-weight bold
            }
            .query {
              color: #fff
            }
          }
        }
        .img-modal-container {
          .modal {
            width 90%
            .msg {
              padding 20px 0
            }
          }
        }
        .img-code-wrapper {
          display flex
          align-items center
          .input-control {
            flex 1
            height 40px
            line-height: 40px
            padding 0 6px
            background: #f2f2f2
            color: #232323
            width: 100%
          }
          .img-code {
            width 80px
            height 40px
            flex-shrink 0
          }
          .refresh {
            width 30px
            flex-shrink 0
          }
        }
      }
    }
    /deep/ .van-button--small {
      border-radius 4px
      width: 88px
    }
  }

  .modal-container {
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 99
    background: rgba(0, 0, 0, 0.5)
    .modal {
      position absolute
      top 10%
      left 50%
      transform translate(-50%, -10%)
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
      border-radius 4px
      z-index: 1
      background: #FFFFFF
      text-align: center
      .content {
        padding: 20px
        .title {
          font-size: 18px
          line-height: 25 rpx
          font-weight: 600
          position: relative
          padding-bottom: 10px
        }
        .msg {
          font-size: 14px
          line-height: 24px
          color: $color-gray
        }
      }
      .modal-btn-group {
        width: 100%
        border-top: 0.5px solid #f3f3f3
        height: 44px
        line-height: 44px
        font-size: 15px
        color: #333
        display flex
        .modal-btn {
          flex 1
          text-align: center
          line-height: 44px
          font-weight bold

          &:after {
            content: none
          }
          & + .modal-btn {
            border-left: 0.5px solid #f3f3f3
          }
        }
        .confirm {
          color: #fff
        }
      }
    }
  }

</style>

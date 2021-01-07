<template>
  <div class="no-set-pwd">
    <nav-top title="身份验证" @backEvent="$router.go(-1)"></nav-top>
    <div class="pwd-div">
      <!-- 密码输入框 -->
      <div class="topDiv">
        <!-- 密码输入框 -->
        <div class="pwd-input" v-show="pwdInput">
          <p class="title">请输入数字支付密码验证身份</p>
          <van-password-input
            :value="firstPwd"
            v-show="showFirstPwd"
          />
        </div>
        <p class="info theme_font_light_blue_i" @click="openForgetPwd">忘记密码?</p>
      </div>
      <!-- 数字键盘 -->
      <van-number-keyboard
        :show="showKeyboardF"
        @input="onInputF"
        @delete="onDelete"/>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Dialog} from 'vant'
  import MD5 from '@/utils/md5.js'
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    name: '',
    data() {
      return {
        firstPwd: '', // 输入第1次的密码
        secondPwd: '', // 输入第2次的密码
        showKeyboardF: true, // 数字键盘
        // showKeyboardSMS: true, // 短信数字键盘
        showFirstPwd: true, // 第一次输入的密码
        active: false, // 遮罩的背景
        pwdInput: true // 密码显示框
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      onInputF(key) {
        // 第一次输入密码的数字键盘
        let that = this
        that.firstPwd = (that.firstPwd + key).slice(0, 6)
        if (that.firstPwd.length == 6) {
          // 开启免密
          this.$Loading.open()
          let paramsData = {
            token: that.$store.state.login.token,
            freePayAmount: this.payInfo.freePayAmount, // 免密金额
            originalPwd: MD5(that.firstPwd) // 密码
          }
          this.$http.post('/app/json/user/openFreePay', paramsData).then(res => {
            let data = res.data
            if (data.status == 0) {
              // 密码正确
              this.setPayInfo(this.$assign({}, this.payInfo, {freePayAmount: this.payInfo.freePayAmount, isFreePayPwd: 1}))
              this.$bridgefunc.vuexStorage()
              this.$router.go(-2)
            } else {
              // 密码错误
              this.pwdInput = false // 密码显示框隐藏 出现提示框
              Dialog.confirm({
                title: '提示',
                message: data.info,
                confirmButtonText: '忘记密码',
                cancelButtonText: '重新输入',
              }).then(() => {
                // 忘记密码
                this.$router.push({path: '/usercenter/forgetPwd'})
              }).catch(() => {
                // 重新输入
                this.pwdInput = true
                that.firstPwd = ''
              })
            }
            this.$Loading.close()
          })
        }
      },
      openForgetPwd() {
        // 打开忘记密码页面
        this.$router.push({path: '/usercenter/forgetPwd'})
      },
      // onInputSMS(key) {
      //   // 发送短信的数字键盘
      //   this.sms = (this.sms + key).slice(0, 4)
      //   if (this.sms.length == 4) {
      //   }
      // },
      // onInputS(key) {
      //   // 第二次输入密码的数字键盘
      //   let that = this
      //   that.secondPwd = (that.secondPwd + key).slice(0, 6)
      //   if (that.secondPwd.length == 6) {
      //     if (that.secondPwd != that.firstPwd) {
      //       this.noEqually = true // 密码不一致提示信息显示
      //       this.showKeyboardF = true // 数字键盘切换
      //       this.showFirstPwd = true // 密码切换
      //       this.secondPwd = ''
      //       this.firstPwd = ''
      //     } else {
      //     }
      //   }
      // },
      onDelete() {
        // 删除数字键盘的值
        this.firstPwd = this.firstPwd.slice(0, this.firstPwd.length - 1)
        this.secondPwd = this.secondPwd.slice(0, this.secondPwd.length - 1)
        this.sms = this.sms.slice(0, this.sms.length - 1)
      },
      sendSms() {
        // 发送短信按钮
        this.sendAuthCode = false
        this.sendAuthCode = false
        this.auth_time = 119
        let timer = setInterval(() => {
          this.auth_time--
          if (this.auth_time <= 0) {
            this.sendAuthCode = true
            clearInterval(timer)
          }
        }, 1000)
      },
      ...mapMutations(['setPayInfo'])
    },
    computed: {
      ...mapGetters(['payInfo'])
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
        width: 80%
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
          text-align: right
          padding-right: 30px
          line-height: 60px
          font-weight bold
        }
        .yzPhone {
          width: 90%
          position absolute
          top 30%
          left 50%
          transform translate(-50%, -30%)
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
      }
    }
    /deep/ .van-button--small {
      border-radius 4px
      width: 88px
    }
  }
</style>

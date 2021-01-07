<template>
  <div class="forget-pwd">
    <nav-top title="身份验证" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="pay-setting">
      <div class="pay-box">
        <div class="tips theme_font_gray">您正在重置虚拟支付6位数字密码，请用以下验证方式完成身份验证</div>
        <ul class="pay-list">
          <li class="pay-item" @click="yzInfo">
            <mt-cell title="验证绑定手机与身份信息" is-link>
            </mt-cell>
          </li>
        </ul>
        <div class="pop" v-show="popInput" :class="{'mask': active}">
          <!-- 密码输入框 -->
          <div class="topDiv">
            <div class="yzPhone">
              <div class="top">
                <p class="title">验证手机号</p>
                <p class="tips">输入手机尾号{{phone}}接受到的短信验证码</p>
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
                  <van-button v-show="!sendAuthCode" slot="button" size="small" class="theme_font_red_i"
                              type="default">{{auth_time}}秒后重发
                  </van-button>
                </van-field>
              </div>
              <div class="two-btn">
                <div class="cancel" @click="smsCancel">取消</div>
                <div class="query theme_bg_red_i" @click="queryBtn">确定</div>
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
          </div>
          <!-- 数字键盘 -->
          <!--<div v-show="pwdInput">-->
            <!--<van-number-keyboard-->
              <!--:show="showKeyboard"-->
              <!--@input="onInput"-->
              <!--@delete="onDelete"/>-->
          <!--</div>-->
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    data() {
      return {
        showKeyboard: true, // 数字键盘
        noEqually: false, // 密码不一致的提示现实与否
        sms: '', // 短信验证码
        auth_time: 0, // 发送短信倒计时
        sendAuthCode: true, /* 布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */
        pwdInput: true, // 密码显示框
        active : false, // 遮罩的背景
        phone : '', // 手机号
        popInput: false, // 弹框
        imgModal: false, // 图像验证码弹框
        imgCode: '', // 图片验证码
        imgCodeUrl: '', // 图片URL
        uuid: '', // 随机数
      }
    },
    created() {
    },
    mounted() {
      this.phone = this.$store.state.login.phone
      this.phone = this.phone.substring(this.phone.length - 4)
    },
    methods: {
      yzInfo() {
        // 验证绑定手机与身份信息按钮
        this.active = true
        this.popInput = true
      },
      sendSms() {
        // 发送短信按钮
        this.imgModal = true
        this.getVerifyImg() // 获取图像验证码
      },
      onInput(key) {
        // 发送短信的数字键盘
        this.sms = (this.sms + key).slice(0, 4)
        if (this.sms.length == 4) {
        }
      },
      onDelete() {
        // 删除数字键盘的值
        this.sms = this.sms.slice(0, this.sms.length - 1)
      },
      smsCancel() {
        // 短信弹框的取消按钮
        this.active = false
        this.popInput = false
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
            this.$toast(res.info || '短信发送失败！')
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('请求数据失败！')
        })
      },
      queryBtn() {
        // 确定按钮
        this.$router.push({path: '/usercenter/nosetpwd', query: {sms: this.sms}})
      }
    },
    computed: {},
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .forget-pwd {
    .pay-setting {
      .mask {
        background rgba(0, 0, 0, 0.4)
      }
      .pay-box {
        padding: 11px 8px
        .pop {
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
        .pay-list {
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
          border-radius 4px
          .pay-item {
            padding: 5px 0
          }
        }
        .tips {
          padding: 11px 8px
          line-height 20px
        }
      }
    }
  }
  /deep/ .mint-cell-allow-right::after {
    width: 10px
    height: 10px
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

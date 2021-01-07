<template>
  <div class="register-container">
    <nav-top title="登录" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="video-index-contsainer">
      <div class="content">
        <!--        <van-steps :active="active" active-color="#FB4446">-->
        <!--          <van-step>输入手机号</van-step>-->
        <!--          <van-step>注册或激活</van-step>-->
        <!--        </van-steps>-->
        <div class="form">
          <div class="form-group">
            <div class="input-wrapper">
              <div class="left">
                <img src="./image/registe1.png" alt="">
              </div>
              <div class="phone-inp">
                <input
                  class="input-control"
                  maxlength="11"
                  placeholder="请输入手机号"
                  type="tel"
                  onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                  autosize
                  pattern="[0-9]*"
                  v-model="phone">
              </div>
            </div>
            <div class="input-wrapper sms">
              <div class="left">
                <img src="./image/registe3.png" alt="">
              </div>
              <div class="inp">
                <input class="input-control" type="number" v-model="code" placeholder="请输入短信验证码"/>
                <div class="sms-btn">
                  <div class="divider">&nbsp;|&nbsp;</div>
                  <button :disabled="codeBtnStatus" class="btn code" @click="getCode">{{codeText}}</button>
                </div>
              </div>
            </div>
            <template v-if="smsData">
              <template v-if="smsData == 0">
                <div class="input-wrapper">
                  <div class="left">
                    <img src="./image/registe2.png" alt="">
                  </div>
                  <div class="phone-inp">
                    <input placeholder="请输入密码" :type="isShowPwd?'text':'password'" v-model="passwords"/>
                  </div>
                </div>
                <div class="input-wrapper">
                  <div class="left">
                    <img src="./image/registe5.png" alt="">
                  </div>
                  <div class="phone-inp">
                    <input class="input-control" type="text" v-model="referrer" placeholder="请输入推荐码"/>
                  </div>
                </div>
              </template>
              <button class="btn bind-btn" @click="bindMember" v-if="smsData == 0">注册</button>
              <button class="btn bind-btn" @click="bindMember" v-else-if="smsData == 1">激活</button>
              <button class="btn bind-btn" @click="bindMember" v-else-if="smsData == 2">绑定</button>
            </template>
          </div>
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
              <img class="img refresh" src="./image/refresh.png" @click="getVerifyImg" mode="widthFix" alt="">
            </div>
          </div>
          <div class="modal-btn-group">
            <div class="modal-btn" @click="imgModal = false">取消</div>
            <div class="modal-btn confirm" @click="confirmImgCode">确定</div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>

  export default {
    data() {
      return {
        phone: '', // 手机号
        code: '', // 验证码
        passwords: '', // 密码
        referrer: '', // 推荐码
        imgCode: '', // 图片验证码
        imgCodeUrl: '', // 图片URL
        codeBtnStatus: false,
        sec: 60,
        codeText: '获取验证码',
        visible: false,
        imgModal: false,
        active: 0,
        isShowPwd: false,
        firstLevel: false, // 注册成功后   路由回退几级。  如果想回退1级为true，  如果回退2级为false。
        smsData: '' // 获取短信信息 data: 1 表示是老用户  0 是新用户  2 已注册用户
      }
    },
    computed: {},
    mounted() {
      this.pageInit()
      this.firstLevel = this.$route.query.firstLevel
    },
    methods: {
      pageInit() {
        this.getVerifyImg()
      },
      /**
       * 获取验证码
       */
      getCode() {
        let myreg = /^1[0-9]{10}$/;
        if (!this.phone) {
          this.$toast('请输入手机号')
          return
        }
        if (!myreg.test(this.phone)) {
          this.$toast('请输入正确的手机号')
          return
        }
        if (this.imgCode === '') {
          this.imgModal = true
          return
        }
        this.countDown()
        this.sendPhoneCode()
        this.codeBtnStatus = true
      },
      /**
       * 倒计时展示
       */
      countDown() {
        let that = this
        let sec = that.sec
        let time = null
        if (sec === 0) {
          that.sec = 60
          that.codeBtnStatus = false
          that.codeText = '获取验证码'
          clearTimeout(time)
        } else {
          sec--
          that.sec = sec
          that.codeText = `${sec}s重新发送`
          time = setTimeout(function () {
            that.countDown()
          }, 1000)
        }
      },
      sendPhoneCode() {
        let params = {
          phone: this.phone,
          smsType: 1020,
          imgVerifyCode: this.imgCode,
          uuid: this.uuid
        }
        this.$request.post('/app/json/message/sendThirdWxLoginSms', params).then(res => {
          if (res.status === 0) {
            this.$toast('发送成功！')
            this.smsData = res.data
            console.log(this.smsData)
          } else {
            this.sec = 0
            this.imgCode = ''
            this.$toast(res.info || '发送失败！')
          }
        })
      },
      /**
       * 绑定会员
       */
      bindMember() {
        let myreg = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/
        if (!this.phone) {
          this.$toast('请输入手机号')
          return
        }

        if (!myreg.test(this.phone)) {
          this.$toast('请输入正确的手机号')
          return
        }

        if (this.code === '' || !/\d{4,8}$/.test(this.code)) {
          this.$toast('验证码格式错误')
          return
        }
        if (this.passwords === '' && this.smsData == 0) {
          this.$toast('密码不能为空')
          return
        }
        // let regChannel = ''
        // if (this.smsData == 2) { // 已注册用户  regChannel 传3
        //   regChannel = 4
        // } else {
        //   regChannel = 4
        // }
        let params = {
          phone: this.phone,
          smsVerifyCode: this.code,
          thirdUserId: this.$route.query.thirdUserId,
          regChannel: this.$route.query.regChannel, // 注册渠道
          bindType: 4,
          // loginChannel: 2, // 登录渠道
          passwords: this.passwords,
          referrer: this.referrer
        }
        this.$request.post('/app/json/login/bindThirdUser', params).then(res => {
          if (res.status === 0) {
            this.active = 1
            if (this.firstLevel) {
              this.$userCenter.retsetToIndex(res.data, 1);
            } else {
              this.$userCenter.retsetToIndex(res.data, 2);
            }
          }else if (res.errorCode == 2002) {
            this.$Toast(res.info ? res.info : '手机号已存在用户已注册')
          } else {
            this.$Toast(res.info ? res.info : '注册失败')
          }
        }).catch(err => {
          this.$Loading.close();
          this.$Toast("系统运行过程中遇到问题，请稍候再试");
        })
      },
      confirmImgCode() {
        if (this.imgCode === '') {
          this.$toast('请输入图形码')
        } else {
          this.imgModal = false
          this.getCode()
        }
      },
      getVerifyImg() {
        this.uuid = this.$util.randomString()
        this.$request.post('/app/json/login/getVerifyImg', {uuid: this.uuid}).then(res => {
          if (res.status === 0) {
            this.imgCodeUrl = res.data
          } else {
            this.$toast(res.info || '获取图片验证码失败！')
          }
        })
      },
      // 打开授权弹框
      auth() {
        this.visible = true
      },
      // 关闭授权弹框
      closeModal() {
        this.visible = false
      }
    },
    components: {
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  @import '~@/common/stylus/mixin.styl'
  .register-container {
    padding 11px 0;

    .form-group {
      padding 0 11px;

      .input-wrapper {
        display flex
        align-items center
        padding: 11px 0;
        bdr-b()

        .img {
          width 18px;
          flex-shrink 0;
        }

        .phone-inp {
          flex 1

          .input-control {
            width: 100%
          }
        }

        .code {
          &[disabled]:not([type]) {
            color: $color-gray
          }
          flex-shrink 0
          color: $color-theme-r
        }
      }
    }

    .bind-btn {
      padding 10px 0;
      background: $color-theme-r
      text-align: center
      color: #fff;
      margin: 20px auto
      border-radius 30px;
      font-size: 16px;
      box-sizing border-box
      width 90%
    }

    .img-modal-container {
      .modal {
        width 80%

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
        height 40px;
        line-height: 40px;
        padding 0 6px;
        background: #f2f2f2
        color: #232323;
        width: 100%;
      }

      .img-code {
        width 80px;
        height 40px;
        flex-shrink 0
      }

      .refresh {
        width 30px;
        flex-shrink 0
      }
    }
  }

  .content {
    padding: 11px 15px

    .divider {
      color: #e2e0e0
    }

    .left {
      width 23px
      height 23px
      margin-right 5px

      img {
        width 100%
        height 100%
      }
    }

    .sms {
      display flex
      justify-content left
      align-items center

      .inp {
        display flex
        justify-content space-between
        align-items center
        flex: 1

        .sms-btn {
          display flex
          justify-content space-between
          align-items center
        }
      }
    }
  }

  /deep/ .van-steps {
    padding: 0 50px
  }
  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.5);
    .modal {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 70%;
      transform: translate3d(-50%, -50%, 0);
      z-index: 1;
      background: #FFFFFF;
      border-radius: 4px;
      text-align: center;
      .content {
        padding: 20px;
        .title {
          font-size: 18px;
          line-height: 25 rpx;
          font-weight: 600;
          position: relative;
          padding-bottom: 10px;
        }
        .msg {
          font-size: 14px;
          line-height: 24px;
          color: $color-gray
        }
      }
      .modal-btn-group {
        width: 100%;
        border-top: 0.5px solid #f3f3f3;
        height: 44px;
        line-height: 44px;
        font-size: 15px;
        color: #333;
        display flex
        .modal-btn {
          flex 1
          text-align: center
          line-height: 44px;
          &:after {
            content: none;
          }
          & + .modal-btn {
            border-left: 0.5px solid #f3f3f3;
          }
        }
        .confirm {
          color: $color-theme;
        }
      }
    }
  }
  .btn {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: 0;
    color: inherit;
    display: block;
    outline: 0;
    position: relative;
    text-align: center;
    height: inherit;
    padding: 0;
    background: transparent
  }

  .btn[disabled=disabled] {
    opacity: 0.6;
  }
</style>

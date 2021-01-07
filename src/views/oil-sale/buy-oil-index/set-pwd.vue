<template>
  <div class="set-pwd">
    <nav-top title="密码设置" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="set-pwd-container">
      <van-cell-group>
        <van-field
          v-model="userPwd.pwd"
          label="请输入密码"
          type="password"
          placeholder="请输入8-16位字母,数字+字符组合"
          :error-message="errorPwd"
          right-icon="question-o"
          @click-right-icon="showSymbol = true"
          @blur="inputPwd"
        />
        <van-field
          v-model="userPwd.confirmPwd"
          label="再次输入密码"
          type="password"
          placeholder="请输入8-16位字母,数字+字符组合"
          :error-message="errorAgainPwd"
          @blur="inputConfirmPwd"
        />
        <van-field
          v-model="userPwd.idCard"
          label="身份证号"
          placeholder="请输入身份证号"
          :error-message="errorID"
          @blur="inputIdCard"
        />
        <van-field
          v-model="vipUnitUserCodeInfo.vipUserPhone"
          label="预留手机号"
          disabled
          right-icon="question-o"
          placeholder="请输入预留手机号"
          @click-right-icon="show = true"
        />
      </van-cell-group>
      <div class="table-view special">
        <div class="table-view-cell">
          <div class="table-view-cell-text">
            <div class="left">
              <div class="text">验证码</div>
              <div class="inp">
                <input type="text" maxlength="6" placeholder="请输入短信验证码" v-model="userPwd.sms">
              </div>
            </div>
            <div class="right">
              |&nbsp;<count-button class="theme_font_blue_i" @getSmsEvent="getMsgCode" :phone="vipUnitUserCodeInfo.vipUserPhone"
                                   ref="countBtn"></count-button>
            </div>
          </div>
        </div>
      </div>
      <div class="bill-btn" @click="keepPwdSet">
        <div class="btn-show">保存</div>
      </div>
      <van-dialog
        v-model="show"
        title="温馨提示"
        @confirm="show = false"
        confirmButtonText="确定"
      >
        <div class="content">当前手机号为单位用户绑定预留手机号,若需修改,请持相关证件前往xxx地方进行修改。</div>
      </van-dialog>
      <van-dialog
        v-model="showSymbol"
        title="温馨提示"
        @confirm="showSymbol = false"
        confirmButtonText="确定"
      >
        <div class="content">字符包括:@$!%*#?&</div>
      </van-dialog>
    </nav-content>
  </div>
</template>

<script>
  import CountButton from '@/components/commonui/count-button'
  import eventBus from '@/utils/eventBus.js'

  let check = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/
  export default {
    data() {
      return {
        errorPwd: '', // 密码错误提示
        errorAgainPwd: '', // 再次输入密码错误提示
        errorID: '', // 身份证号错误提示
        userPwd: {},
        show: false, // 手机号提示
        showSymbol: false, // 符号提示
        vipUnitUserCodeInfo: ''
      }
    },
    mounted() {
      this.vipUnitUserCodeInfo = JSON.parse(this.$route.query.vipUnitUserCodeInfo) || ''
      console.log(this.vipUnitUserCodeInfo)
      console.log(this.vipUnitUserCodeInfo.vipUserIdCard)
    },
    methods: {
      keepPwdSet() {
        // 保存按钮
        if (!this.userPwd.pwd) {
          this.$toast('请输入密码')
        } else if (!this.userPwd.confirmPwd) {
          this.$toast('请输入确认密码')
        } else if (!this.userPwd.idCard) {
          this.$toast('请输入身份证号')
        } else if (!this.userPwd.sms) {
          this.$toast('请输入短信验证码')
        } else {
          this.$request.post('/app/json/user/vipUnitUserModifyPwd', {
            vipOriginPassword: this.userPwd.pwd, // 输入的密码
            vipUserPassword: this.userPwd.confirmPwd, // 确认密码
            vipUserIdCard : this.userPwd.idCard, // 身份证号
            smsVerifyCode: this.userPwd.sms, // 短信验证码
          }).then(res => {
            if (res.status === 0) {
              this.$router.go(-1)
              eventBus.$emit('getVipVipUnitListByUserId')
            } else {
              this.$Toast(res.info ? res.info : '设置密码失败')
            }
          })
        }
      },
      getMsgCode: function (imgVerifyCode, uuid) {
        // 获取短信验证码
        this.$refs.countBtn.startTime();
        this.$Loading.open();
        let url = '/app/json/login/sendSms';

        let paramsData = {
          phone: this.vipUnitUserCodeInfo.vipUserPhone,
          smsType: '1020',
          imgVerifyCode: imgVerifyCode,
          uuid: uuid
        };
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('获取短信验证码成功')
            } else {
              this.$Toast(data.info ? data.info : '获取短信验证码失败')
              this.$refs.countBtn.resetClock();
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
            this.$refs.countBtn.resetClock();
          }
        )
      },
      inputPwd() {
        // 密码校验
        if (this.userPwd.pwd) {
          if (this.userPwd.pwd.length < 8 || this.userPwd.pwd.length > 16) {
            this.errorPwd = '请输入8-16位密码'
            this.userPwd.pwd = ''
          } else if (this.userPwd.pwd.search(check) == -1) {
            this.errorPwd = '密码必须包含字母,数字+字符'
            this.userPwd.pwd = ''
          } else {
            this.errorPwd = ''
          }
        }
      },
      inputConfirmPwd() {
        // 密码校验
        if (this.userPwd.confirmPwd) {
          if (this.userPwd.confirmPwd.length < 8 || this.userPwd.confirmPwd.length > 16) {
            this.errorAgainPwd = '请输入8-16位密码'
            this.userPwd.confirmPwd = ''
          } else if (this.userPwd.confirmPwd.search(check) == -1) {
            this.errorAgainPwd = '密码必须包含字母,数字+字符'
            this.userPwd.confirmPwd = ''
          } else if (this.userPwd.pwd != this.userPwd.confirmPwd) {
            this.errorAgainPwd = '两次密码不一致'
            this.userPwd.confirmPwd = ''
          } else {
            this.errorAgainPwd = ''
          }
        }
      },
      inputIdCard() {
        let card = this.vipUnitUserCodeInfo.vipUserIdCard

        if (this.userPwd.idCard && this.userPwd.idCard != card) {
          this.errorID = '身份证信息不对'
        } else {
          this.errorID = ''
        }
      }
    },
    components: {
      CountButton
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  $color = #3c9df3
  .set-pwd {
    .set-pwd-container {
      background-color: #f8f8f8 !important
      padding: 11px 15px

      /deep/ .van-cell {
        line-height 28px
      }

      /deep/ .van-button--primary {
        color: #323233;
        background: #fff;
        border-color: #fff;
        border-left: 1px solid $color-line-gray-l
      }

      .content {
        padding: 30px 15px
        line-height 22px
        color: $color-text-d
      }

      /deep/ .van-dialog__confirm, .van-dialog__confirm:active {
        background $color
        color: #fff
      }

      .bill-btn {
        padding: 10px 0 20px 0
        text-align center
        font-size 14px
        flex-shrink 0

        .btn-show {
          border-radius 20px
          background: $color
          padding: 13px 0
          color: #fff
          font-weight bold

          & + .btn-show {
            margin-top: 10px
          }
        }

        .isClick {
          opacity 0.5
        }
      }
    }
  }

  .special {
    line-height 28px
    .left {
      display flex
      justify-content left
      align-items center

      .text {
        font-size: 0.373333rem
        width 90px
        color #323233
      }
      input:

      :-webkit-input-placeholder {
        font-size: 0.373333rem
        color: $color-text-l
      }
    }

    .right {
      color: $color-line-gray-l
      display flex

      .text {
        color: #009df8
      }
    }
  }
  /deep/ .van-cell:not(:last-child)::after {
    left 0
  }
</style>

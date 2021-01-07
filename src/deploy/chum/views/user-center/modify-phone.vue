<template>
  <div class="modify-phone">
    <nav-top @backEvent="back"></nav-top>
    <nav-content>
      <div class="sms-root">
        <div class="phone-row">
          <div class="sms-input line_radius" v-if="step === 1">
            <van-field
              :readonly="oldPhone&&oldPhone.length>0?true:false"
              :disabled="oldPhone&&oldPhone.length>0?true:false"
              v-model="phone"
              type="tel"
              placeholder="请输入手机号"
              maxlength="11"
              size="16"
              onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
              pattern="[0-9]*"
              @input="phone = /^\d+/.exec(phone) ? /^\d+/.exec(phone)[0] : ''"
              @blur="validPhone"
            />
          </div>
          <div class="sms-input line_radius" v-if="step === 2">
            <van-field
              v-model="newPhone"
              type="tel"
              placeholder="请输入新手机号"
              maxlength="11"
              size="16"
              onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
              pattern="[0-9]*"
              @input="newPhone = /^\d+/.exec(newPhone) ? /^\d+/.exec(newPhone)[0] : ''"
              @blur="validPhone"
            />
          </div>
        </div>
        <div class="sms-input line_radius">
          <van-field
            v-if="step === 1"
            v-model="smsCode"
            type="phone"
            maxlength="6"
            :border="false"
            pattern="[0-9]*"
            placeholder="请输入验证码"
          />
          <van-field
            v-else
            v-model="newSmsCode"
            type="phone"
            :border="false"
            pattern="[0-9]*"
            maxlength="6"
            placeholder="请输入验证码"
          />
          <div class="forget-btn">
            <CountButton
              @getSmsEvent="getMsgCode"
              class="verif-code-btn"
              slot="button"
              :phone="step === 1 ? phone : newPhone"
              ref="countBtn"
            ></CountButton>
          </div>
        </div>
        <div class="next-btn theme_standard_bg" v-if="step === 1" @click="nextStep">下一步</div>
        <div class="next-btn theme_standard_bg" v-else @click="confirm">提交</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
import CountButton from '@/components/commonui/count-button/index'
export default {
  name: 'modify-pwd',
  data() {
    return {
      phone: this.$store.state.userInfo.phone,
      oldPhone: this.$store.state.userInfo.phone,
      newPhone: '',
      smsCode: '',
      newSmsCode: '',
      step: 1,
    }
  },
  computed: {
    // phoneSection() {
    //   if (this.$store.state.phoneSection.areaCode == ""||this.$store.state.phoneSection.areaCode == undefined) {
    //     return 86;
    //   } else {
    //     return this.$store.state.phoneSection.areaCode;
    //   }
    // },
    reg() {
      if (this.$store.state.phoneSection.reg == '') {
        return /^1[0-9]{10}$/
      } else {
        return this.$store.state.phoneSection.phoneRule
      }
    },
  },
  created() {},
  methods: {
    // phoneSectionClick() {
    //   this.$router.push({ path: "/usercenter/phonesection" });
    // },
    validPhone() {
      if (!/^1[23456789]\d{9}$/.test(this.phone)) {
        this.$Toast('手机号码格式不正确')
      }
    },
    nextStep() {
      // debugger
      if (!/^1[23456789]\d{9}$/.test(this.phone)) {
        this.$Toast('请输入正确的手机号码！')
        return
      }
      if (!this.smsCode) {
        this.$Toast('请输入验证码！')
        return
      }
      this.step = 2
      this.$refs.countBtn.resetClock()
    },
    back() {
      if (this.step === 1) {
        this.$router.go(-1)
      } else {
        this.step = 1
      }
    },
    getMsgCode(imgVerifyCode, uuid) {
      let phone
      if (this.step === 1) {
        if (!/^1[23456789]\d{9}$/.test(this.phone)) {
          this.$Toast('请输入正确的手机号码！')
          return
        }
        phone = this.phone
      } else {
        if (!/^1[23456789]\d{9}$/.test(this.phone)) {
          this.$Toast('请输入正确的手机号码！')
          return
        }
        phone = this.newPhone
      }
      this.$refs.countBtn.startTime()
      let url = '/app/json/login/sendSms'
      this.$Loading.open()
      this.$http
        .post(url, {
          phone: phone,
          smsType: '1030',
          imgVerifyCode: imgVerifyCode,
          uuid: uuid,
        })
        .then((res) => {
          this.$Loading.close()
          let { status, result, info } = res.data
          if (status == 0) {
            this.$Toast('获取验证码成功')
          } else {
            this.$refs.countBtn.resetClock()
            this.$Toast(info)
          }
        })
        .catch((err) => {
          console.log('err>>>>' + err)
          this.$Loading.close()
          this.$refs.countBtn.resetClock()
          this.$Toast('系统运行过程中遇到问题，请稍候再试')
        })
    },
    confirm() {
      if (!/^1[23456789]\d{9}$/.test(this.phone)) {
        this.$Toast('请输入正确的原手机号码！')
        return
      }
      if (!/^1[23456789]\d{9}$/.test(this.phone)) {
        this.$Toast('请输入正确的新手机号码！')
        return
      }
      if (this.newPhone == this.phone) {
        this.$Toast('新手机号不能和原手机号相同')
        return
      }
      if (!this.smsCode || !this.newSmsCode) {
        this.$Toast('请输入验证码！')
        return
      }
      let url = '/app/json/user/modifyPhone'
      this.$Loading.open()
      this.$http
        .post(url, {
          loginChannel: 6,
          regChannel: 5,
          phone: this.newPhone,
          smsVerifyCode: this.newSmsCode,
          originalPhone: this.phone,
          originalVerifyCode: this.smsCode,
        })
        .then((res) => {
          this.$Loading.close()
          let { status, result, info } = res.data
          if (status === 0) {
            this.$Toast('修改成功')
            this.$router.go(-1)
          } else {
            this.$refs.countBtn.resetClock()
            this.$Toast(info)
          }
        })
        .catch((err) => {
          console.log('err>>>>' + err)
          this.$Loading.close()
          this.$Toast('系统运行过程中遇到问题，请稍候再试')
        })
    },
  },
  components: {
    CountButton,
  },
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
.sms-root {
  display: flex;
  flex-direction: column;
  align-items: center;

  .phone-row {
    display: flex;
    margin-top: 20px;
    width: 300px;
    height: 50px;
    padding: 0px 0;
    margin-bottom: 15px;

    .sms-select {
      background-color: white;
      width: 90px;
      padding: 17px 10px 17px 15px;
      height: 50px;
      font-size: 16px;
      color: #9FA0A0;
      border-radius: 5px;

      .arrow {
        margin-top: 4px;
        float: right;
        width: 14.5px;
        height: 8px;
      }
    }

    .phone-style {
      margin-left: 10px;
      flex: 1;
    }
  }

  .sms-input {
    width: 300px;
    height: 50px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    padding-left: 1px;
    padding-right: 15px;

    .forget-btn {
      min-width: 60px;

      .fontsize {
        font-size: 16px;
      }
    }

    .count-button {
      width: 90px;
      text-align: right;
    }
  }

  .next-btn {
    align-items: center;
    width: 300px;
    padding: 15px;
    background: linear-gradient(270deg, rgba(49, 49, 49, 1) 0%, rgba(84, 84, 84, 1) 51%, rgba(49, 49, 49, 1) 100%);
    border-radius: 49px;
    background-color: #CF000D;
    color: #C9A063;
    font-size: 16px;
    text-align: center;
    position: absolute;
    bottom: 20px;
    // border-radius: 5px;
  }

  .new-user {
    margin-top: 50px;
    color: #221916;
    font-size: 16px;
  }
}
</style>

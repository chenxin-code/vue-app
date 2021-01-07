<template>
  <div>
    <nav-top :title="toptitle" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="sms-root">
        <div class="smslogo">
          <img src="../login/login_imgs/cdf_logo.png" />
        </div>
        <div class="sms-input line_radius">
          <van-field
            v-model="phone"
            type="tel"
            placeholder="请输入手机号码"
            maxlength="11"
            size="16"
            onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
            pattern="[0-9]*"
            @input="phone = /^\d+/.exec(phone) ? /^\d+/.exec(phone)[0] : ''"
            @blur="phoneBlur"
          />
        </div>
        <div class="sms-input line_radius">
          <van-field
            v-model="vertifi_code"
            type="phone"
            :border="false"
            placeholder="请输入验证码"
            maxlength="6"
            size="16"
          />
          <div class="forget-btn">
            <CountButton
              class="theme_font_red_i count-button"
              @getSmsEvent="getMsgCode"
              :phone="phone"
              ref="countBtn"
            ></CountButton>
          </div>
        </div>
        <div class="next-btn theme_standard_bg">下一步</div>
        <div class="new-user" @click="gotoSmsRegister">新用户注册</div>
      </div>
    </nav-content>
  </div>
</template>
<script>
import CountButton from "../../../../components/commonui/count-button";
export default {
  components: {
    CountButton
  },
  data() {
    return {
      phone: "",
      vertifi_code: "",
      toptitle: "短信验证码登录"
    };
  },
  methods: {
    getMsgCode() {
      if (!this.$util.checkMobile(this.phone)) {
        this.$Toast("请输入正确的手机号码！");
        return;
      }
      let url = "/app/json/we_chat/verifyCode";
      this.$Loading.open();
      this.$http
        .post(url, {
          phone: this.phone,
          useType: 1020,
          receiveType: 0
        })
        .then(res => {
          this.$Loading.close();
          this.$Toast("正常响应了");
        })
        .catch(err => {
          this.$Loading.close();
          this.$Toast("异常了");
        });
    },
    
    phoneBlur() {},
    gotoSmsRegister() {
      this.$router.push({ path: "/smsregister" });
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
  .sms-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    .smslogo {
      margin-top: 70.5px;
      margin-bottom: 44px;
      img {
        width: 162px;
        height: 83px;
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
      .count-button {
        width: 90px;
        text-align: right;
      }
    }
    .next-btn {
      align-items: center;
      width: 300px;
      padding: 15px;
      background-color: #CF000D;
      color: #FFFFFF;
      font-size: 16px;
      text-align: center;
      border-radius: 5px;
    }
    .new-user {
      margin-top: 50px;
      color: #221916;
      font-size: 16px;
    }
  }
</style>

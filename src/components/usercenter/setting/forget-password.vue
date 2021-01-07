/**Created by liaoyingchao on 2018/11/11.*/

<template>
  <div class="forget-password login2">
    <nav-top @backEvent="backEvent" :title="title">
    </nav-top>
    <nav-content>
      <div class="login-div">
        <div class="text-input">
          <div class="left">手机号</div>
          <div class="cell-phone">
            <span class="active-phone" v-if="$route.query.phone">{{phone}}</span>
            <van-field v-if="!$route.query.phone"
                       v-model="phone"
                       type="tel"
                       placeholder="请输入手机号码"
                       maxlength="11"
                       autosize
                       onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                       pattern="[0-9]*"
                       @input="phone = /^\d+/.exec(phone) ? /^\d+/.exec(phone)[0] : ''"
            />
            <!--<input v-if="!$route.query.phone" @input="inputChange" placeholder="请输入手机号" v-model="phone"/>-->
          </div>
        </div>
        <div class="passwords-input">
          <div class="passwords">
            <input placeholder="请输入短信验证码" v-model="msgCode"/>
          </div>
          <div class="forget-btn">
            <count-button class="theme_standard_font" @getSmsEvent="getMsgCode" :phone="phone"
                          ref="countBtn"></count-button>
          </div>
        </div>
        <div class="text-input">
          <div class="left">请输入新密码</div>
          <div class="cell-phone">
            <input :placeholder="$util.pwdPlaceholder()":type="isShowPwd?'text':'password'" v-model="newPassword"
                   @blur="$util.checkPassWord(newPassword,true,true)"/>
          </div>
          <div class="show-passwords" @click="isShowPwd = !isShowPwd">
            <img :src="isShowPwd?'static/image/login2/see-icon.png':'static/image/login2/icon-eye.png'"
                 class="see-icon"/>
          </div>
        </div>
        <div class="text-input">
          <div class="left">再次输入密码</div>
          <div class="cell-phone">
            <input placeholder="请再次输入新密码" :type="isShowPwd1?'text':'password'" type="password" v-model="onceMore"
                   @blur="verifyPassword"/>
          </div>
          <div class="show-passwords" @click="isShowPwd1 = !isShowPwd1">
            <img :src="isShowPwd1?'static/image/login2/see-icon.png':'static/image/login2/icon-eye.png'"
                 class="see-icon"/>
          </div>
        </div>
        <div class="common-btn theme_standard_bg theme_font_white mt100" @click="getCheckOutFun">提交</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import MD5 from '@/utils/md5.js'
  import CountButton from '@/components/commonui/count-button';

  export default {
    name: "index",
    components: {
      CountButton
    },
    data() {
      return {
        phone: '',
        msgCode: '',
        newPassword: '',
        onceMore: '',
        isShowPwd: false,
        isShowPwd1: false,
        title:''
      }
    },
    watch: {
      msgCode(val) {
        this.msgCode = this.$util.checkVerifyCodeLenght(this.msgCode);
      }
    },
    methods: {
      inputChange: function (e) {
        let value = e.target.value;
        this.phone = this.$util.onlyNumber(value);
      },
      backEvent: function () {
        this.$router.go(-1)
      },
      //获取短信验证码
      getMsgCode: function (imgVerifyCode, uuid) {
        if (this.phone == '') {
          this.$Toast('手机号不能为空!')
          return
        } else if (!this.$util.checkMobile(this.phone)) {
          this.$Toast('请输入正确的手机号码！')
          return
        }
        this.$refs.countBtn.startTime();

        this.$Loading.open();
        let url = '/app/json/login/sendSms';

        let paramsData = {
          phone: this.phone,
          smsType: '1010',
          imgVerifyCode: imgVerifyCode,
          uuid: uuid
        };

        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('获取验证码成功');
              console.log(data)
            } else {
              this.$refs.countBtn.resetClock();
              this.$Toast(data.info ? data.info : '获取短信验证码失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$refs.countBtn.resetClock();
            this.$Toast(data.info ? data.info : '系统运行过程中遇到问题，请稍候再试')
          }
        )
      },


      forgetFun: function () {
        this.$Loading.open();
        let url = '/app/json/user/forgetPwd';

        let paramsData = {
          phone: this.phone,
          smsVerifyCode: this.msgCode,
          userPwd: MD5(this.newPassword),
        };
        if (this.$store.state.globalConfig.user_loginPwd_type == '1') {
          // 明文密码
          paramsData.userPwd = this.newPassword
        }

        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('修改密码成功')
              this.$router.go(-1)
            } else {
              this.$Toast(data.info ? data.info : '修改密码失败');
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast(data.info ? data.info : '系统运行过程中遇到问题，请稍候再试')
          }
        )
      },
      //密码格式效验
      verifyPassword: function () {
        if (this.onceMore == ""){
          return
        }
        if (this.onceMore != this.newPassword) {
          this.$Toast({
            message: '两次输入密码不一样，请重新输入！',
            position: 'middle',
            duration: 2000,
          });
          return
        }
      },

      getCheckOutFun: function () {
        let mobileReg = /^1\d{10}$/;
        if (this.phone == '') {
          this.$Toast('手机号不能为空!')
          return
        } else if (!mobileReg.test(this.phone)) {
          this.$Toast('手机号格式不对!')
          return
        } else if (this.msgCode == '') {
          this.$Toast('验证码不能为空!')
          return
        } else if (this.newPassword == '') {
          this.$Toast('请输入新密码！')
          return
        } else if (!this.$util.checkPassWord(this.newPassword)) {
          return
        } else if (this.onceMore != this.newPassword) {
          this.$Toast('两次输入密码不一样，请重新输入！')
          return
        }
        this.forgetFun()
      },
    },
    created() {
      this.phone = this.$route.query.phone;
      if (!this.phone || this.phone != undefined || this.phone != '') {
        let uPhone = this.$store.state.login.phone
        if (this.$util.checkMobile(uPhone)) {
          this.phone = uPhone;
        }
      }
      this.title = this.$route.query.title;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .forget-password {
    width 100%
    height 100%
    overflow hidden

    .login-div {
      margin 0px 20px 30px 20px;

      .text-input {
        padding: 24px 0px 10px 0px;
        display: flex;
        justify-content: end;
        align-items: center;
        border-bottom: 1px solid #dedede;

        .left {
          font-size: $font-size-medium;
        }


        .cell-phone {
          flex 1
          padding-left: 10px;

          .active-phone {
            font-size: 15px;
            display: block;
          }
          flex 1;
          padding-left: 10px;

          .van-cell {
            padding 0 !important;
          }

          input {
            display: block;
            font-size: $font-size-medium;
            width: 100%;
          }
        }

      }

      .text-input:first-child {
        border-bottom: none;
      }

      .passwords-input {
        border-bottom: 1px solid #dedede;
        padding: 25px 0px 10px 0px;
        display: flex;
        justify-content: space-between;

        .passwords {
          width: 70%;

          input {
            display: block;
            width: 100%;
            font-size: $font-size-medium-s;
          }
        }

        .forget-btn {
          border-left: 1px solid #dedede;
          padding-left 10px
          line-height: 1;
        }
      }

      .mt100 {
        margin-top: 50px;
      }

      .show-passwords {
        margin-left 8px;
        padding 8px 0;

        img {
          width 16px;
          display: block;
          // margin-top:4px;
        }
      }
    }
  }
</style>

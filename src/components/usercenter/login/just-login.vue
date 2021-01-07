/**Created by liaoyingchao on 2019-07-06.*/

<template>
  <div class="just-login login2">
    <nav-top @backEvent="$router.go(-1)">
    </nav-top>
    <nav-content>
      <div class="login-div">
        <div class="text-input">
          <div class="cell-phone">
            <van-field
              v-model="phone"
              type="tel"
              placeholder="请输入手机号码"
              maxlength="11"
              autosize
              onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
              pattern="[0-9]*"
              @input="phone = /^\d+/.exec(phone) ? /^\d+/.exec(phone)[0] : ''"
            />
            <!--<input placeholder="请输入手机号" @input="inputChange" v-model="phone" type="number"/>-->
          </div>
        </div>
        <div class="passwords-input">
          <div class="passwords">
            <input placeholder="请输入密码" :type="isShowPwd?'text':'password'" v-model="passwords"/>
          </div>
          <div class="show-passwords">
            <img :src="isShowPwd?'static/image/login2/see-icon.png':'static/image/login2/icon-eye.png'"
                 @click="showPassword()"/>
          </div>
          <div class="forget-btn" @click="forgetPwd">忘记密码?</div>
        </div>
        <div class="common-btn theme_standard_bg theme_font_white mt100" @click="checkOutFun()">登录</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import MD5 from '@/utils/md5.js'
  import Verify from '@/components/commonui/common-verify/index'

  export default {
    name: "just-login",
    components: {},
    data() {
      return {
        phone: '',
        isShowPwd: false,
        passwords: ''
      }
    },
    methods: {
      showPassword: function () {
        if (this.isShowPwd) {
          this.isShowPwd = false
        } else {
          this.isShowPwd = true
        }
      },
      forgetPwd: function () {
        this.$router.push({
          path: '/usercenter/forgetpassword',

        })
      },
      //账号密码登录
      checkOutFun: function () {
        if (this.phone == '') {
          this.$Toast('账号不能为空!')
          return
        }
        else if (this.passwords == '') {
          this.$Toast('密码不能为空!')
          return
        }
        else if (!this.$util.checkMobile(this.phone)) {
          this.$Toast('请输入正确的手机号码！')
          return
        }
        if(this.$store.state.globalConfig.verify_checkcode_login_enable == 'true') {
          Verify.open({
            type: 'login',
            sureFunc: this.loginFun,
            vertifyCancelEvent: () => {
            },
            paras:{
              phone: this.phone
            }
          })
        } else {
          this.loginFun()
        }
      },
      loginFun: function (verifyCode,uuid) {
        let url = '/app/json/login/login';

        let params = {
          phone: this.phone,
          userPwd: MD5(this.passwords),
          // deviceId: '12312' // 设备号： 调试办卡加的参数 --value---随便写的
        };
        if (verifyCode && uuid ) {
          params.imgVerifyCode = verifyCode
          params.uuid = uuid
        }
        this.$Loading.open();
        this.$http.post(url, params).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              this.$Toast(data.info ? data.info : '登录成功');
              this.$store.state.login.phone = this.phone;
              // 记住的是MD5后的密码
              this.$store.state.login.password = MD5(this.passwords);
              this.$userCenter.retsetToIndex(data.data, 2);
            } else {
              this.$Toast(data.info ? data.info : '登录失败');
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      }
    },
    created() {
      let uPhone = this.$store.state.login.phone
      if (this.$util.checkMobile(uPhone)) {
        this.phone = uPhone;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .just-login {
    width 100%
    height 100%
    overflow hidden
    .login-div {
      margin 10px 20px;
      .text-input {
        border-bottom: 1px solid #dedede;
        padding: 20px 0px 5px 0px;
        .cell-phone {
          width: 100%;
          .van-cell {
            padding 3px 0 !important;
          }
        }

      }
      .passwords-input {
        border-bottom: 1px solid #dedede;
        padding: 20px 0px 5px 0px;
        display: flex;
        justify-content: space-between;
        align-items center;
        .passwords {
          width: 70%;
          input {
            color #323233;
            height 30px;
            display: block;
            width: 100%;
            font-size: $font-size-medium;
          }
        }
        .show-passwords {
          width: 25px;
          height: 14px;
          padding-right: 10px;
          border-right: 1px solid #dedede;
          padding-top: 4px;
          extend-click()
          img {
            display: block;
            width: 100%;
          }
        }
        .forget-btn {
          extend-click()
          text-align right;
          line-height: 1;
        }
      }
      .mt100 {
        margin-top: 50px;
      }
      .login-way {
        margin-top: 25px;
        display: flex;
        justify-content: space-between;
        .btn-extend {
          extend-click()
          font-size: $font-size-medium-s;
        }
      }
    }
  }
</style>

/**Created by liaoyingchao on 2018/11/11.*/

<template>
  <div class="code-login login2">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="tip"><span class="tip-icon">为了您的帐号安全，需要验证您的身份</span></div>
      <div class="login-div">
        <div class="text-input">
          <div class="left">手机号</div>
          <div class="cell-phone">
            <span class="active-phone">{{$store.state.login.phone}}</span>
          </div>
        </div>
        <div class="passwords-input">
          <div class="passwords">
            <input placeholder="请输入短信验证码" v-model="msgCode"/>
          </div>
          <div class="forget-btn">
            <count-button class="theme_font_red_i"  @getSmsEvent="getMsgCode" :phone="$store.state.login.phone" ref="countBtn"></count-button>
          </div>
        </div>
        <div class="common-btn theme_bg_red theme_font_white mt100" @click="getCheckOutFun()">下一步</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import CountButton from '@/components/commonui/count-button';
  export default {
    name: "index",
    components: {
      CountButton
    },
    data() {
      return {
        msgCode:''
      }
    },
    watch: {
      msgCode(val) {
        this.msgCode = this.$util.checkVerifyCodeLenght(this.msgCode);
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1);
      },

      //获取短信验证码
      getMsgCode:function(imgVerifyCode,uuid){
        if(this.phone == ''){
          this.$Toast( '手机号不能为空!' )
          return
        }
        this.$refs.countBtn.startTime();
        this.$Loading.open();
        let url = '/app/json/login/sendSms';

        let paramsData = {
          smsType: '1020',
          phone: this.$store.state.login.phone,
          imgVerifyCode:imgVerifyCode,
          uuid:uuid
        };

        this.$http.post(url,paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if(data.status == 0){
              console.log(data)
              this.$Toast('获取验证码成功');
            }else {
              this.$refs.countBtn.resetClock();
              this.$Toast(data.info?data.info:'获取短信验证码失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$refs.countBtn.resetClock();
            this.$Toast('系统运行过程中遇到问题，请稍候再试')
          }
        )
      },
      loginFun:function(){
        this.$Loading.open();
        let url = '/app/json/login/smsLogin';

        this.$http.post(url,{
          phone: this.$store.state.login.phone,
          smsVerifyCode: this.msgCode
        }).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if(data.status == 0){
              this.$router.push({
                path: '/usercenter/updatephone'
              })
            }else {
              this.$Toast(data.info?data.info:'登录失败');
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast('系统运行过程中遇到问题，请稍候再试');
          }
        )
      },

      getCheckOutFun:function(){
        if(this.msgCode == ''){
          this.$Toast( '验证码不能为空!')
          return
        }
        this.$router.push({
          path: '/usercenter/updatephone',
          query: {
            loginChannel: '1',
            originalVerifyCode: this.msgCode
          }
        })
        // this.loginFun()
      },
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .code-login{
    width 100%
    height 100%
    overflow hidden
    .tip{
      height:30px;
      width:100%;
      background:#fbf8d9;
      line-height:30px;
      padding:0px 10px;
      .tip-icon{
        font-size:$font-size-small;
        line-height:30px;
        color:#e0782f;
        display:block;
        background:url("../../../../static/image/login2/tip-icon.png") 0px center no-repeat;
        background-size:10px 12px;
        padding-left:15px;
      }
    }
    .login-div {
      margin 0px 20px 30px 20px;
      .text-input{
        padding:25px 0px 10px 0px;
        display: flex;
        justify-content: end;
        align-items: center;
        .left{
          font-size:10px;
        }
        .cell-phone{
          padding-left:10px;
          .active-phone{
            font-size:15px;
            display:block;
          }
        }

      }
      .passwords-input{
        border-bottom:1px solid #dedede;
        padding:25px 0px 10px 0px;
        display: flex;
        justify-content: space-between;
        .passwords{
          width:70%;
          input{
            display:block;
            width:100%;
            font-size:$font-size-medium-s;
          }
        }
        .forget-btn {
          border-left:1px solid #dedede;
          padding:2px 0px 2px 10px;
          text-align right;
          line-height:1;
          color:#ee2d2e;
          font-weight:600;
        }
      }
      .mt100{
        margin-top:50px;
      }
    }
  }
</style>

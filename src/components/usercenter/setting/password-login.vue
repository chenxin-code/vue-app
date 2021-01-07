/**Created by liaoyingchao on 2018/11/11.*/

<template>
  <div class="password-login login2">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="tip"><span class="tip-icon">为了您的帐号安全，需要验证您的身份</span></div>
      <div class="login-div">
        <div class="text-input">
          <div class="cell-phone">
            <input placeholder="请输入密码" v-model="password"/>
          </div>
        </div>
        <div class="common-btn theme_bg_red theme_font_white mt100" @click="getCheckOutFun()">下一步</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {Toast } from 'mint-ui'
  import  MD5 from '@/utils/md5.js'
  import Verify from '@/components/commonui/common-verify/index'

  export default {
    name: "index",
    components: {
      Toast
    },
    data() {
      return {
        password:'',
      }
    },
    methods: {
      backEvent:function(){
        this.$router.go(-1);
      },
      loginFun:function(verifyCode,uuid){

        let url = '/app/json/login/login';
        let paramsData = {
          phone: this.$store.state.login.phone,
          userPwd: MD5(this.password),
        };
        if (verifyCode && uuid ) {
          paramsData.imgVerifyCode = verifyCode
          paramsData.uuid = uuid
        }

        this.$Loading.open();
        this.$http.post(url,paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if(data.status == 0){
              this.$router.push({
                path: '/usercenter/updatephone',
                query: {
                  loginChannel: '0',
                  userPwd: MD5(this.password)
                }
              })
            }else {
              this.$Toast(data.info);
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      },
      getCheckOutFun:function(){
         if(this.password == ''){
           this.$Toast( '密码不能为空!')
            return
        }
        if(this.$store.state.globalConfig.verify_checkcode_login_enable == 'true') {
          Verify.open({
            type: 'login',
            sureFunc: this.loginFun,
            vertifyCancelEvent: () => {
            },
            paras:{
              phone: this.$store.state.login.phone
            }
          })
        } else {
          this.loginFun()
        }
      },
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .password-login{
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
        border-bottom:1px  solid #f2f2f2;

        .cell-phone{
          input{
            display:block;
            font-size:15px;
            width:100%;
          }
        }

      }
      .mt100{
        margin-top:50px;
      }
    }
  }
</style>

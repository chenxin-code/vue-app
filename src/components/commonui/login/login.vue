/**Created by liaoyingchao on 2020-11-05.*/

<template>
  <div class="login" v-if="visible">
    <div class="pop-cont">
      <div class="close-btn" @click="closeEvent">
        <img src="static/image/mall/close.png"/>
      </div>
      <div class="title-info">
        <div class="logo">
          <img :src="getGlobalConfig.logoUrl"/>
        </div>
        <div class="title">登录/注册</div>
      </div>
      <div class="login-div">
        <div class="text-input line_bottom">
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
          </div>
        </div>
        <div class="text-input line_bottom">
          <div class="passwords">
            <van-field
              v-model="msgCode"
              placeholder="请输入短信验证码"
            />
          </div>
          <div class="forget-btn line_left">
            <count-button class="theme_standard_font"  @getSmsEvent="getMsgCode" :phone="phone" ref="countBtn"></count-button>
          </div>
        </div>
        <div class="tip" @click="clickAgreement">点击登录/注册按钮代表同意《用户使用协议》</div>
        <div class="login-btn" @click="loginRegisterFun">
          <img src="./img/login.png"/></div>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/vuex/store'
  import CountButton from '@/components/commonui/count-button';
  import util from "@/utils/util";
  import Loading from "../../Vendor/Loading";
  import http from "../../../utils/http";
  import Toast from "../../Vendor/toast";
  import actionStatistics from "../../../utils/actionStatistics";
  import userCenter from "../../usercenter/js/userCenter";
  import router from '@/router'

  export default {
    name: "login",
    components: {
      CountButton
    },
    computed: {
      getGlobalConfig: function () {
        return store.state.globalConfig
      },
      getUserInfo: function () {
        return store.state.userInfo
      }
    },
    data() {
      return {
        visible: false,
        phone: '',
        msgCode: '',
        formData: {},
        sureEvent: function () {
          console.log('sure event!')
        }
      }
    },
    watch: {
      msgCode(val) {
        this.msgCode = util.checkVerifyCodeLenght(this.msgCode);
      }
    },
    methods: {
      clickAgreement:function(){
        this.visible = false;
        router.push({
          path: '/usercenter/agreement'
        })
      },
      open: function () {
        this.visible = true;
      },
      closeEvent: function () {
        this.visible = false
      },
      //登录/注册
      loginRegisterFun:function(){
        Loading.open();
        let url = '/app/json/login/smsLogin';
        let paramsData = {
          phone: this.phone,
          smsVerifyCode:this.msgCode,
          ...this.formData
        };
        if (util.isIos()) {
          paramsData.appSysType = '1'
        } else {
          paramsData.appSysType = '2'
        }

        http.post(url,paramsData).then(res => {
            Loading.close();
            let data = res.data;
            if(data.status == 0){
              Toast('登录/注册成功')
              this.$userCenter.saveLoginData(data.data, true);
              actionStatistics.loginAction('110050', JSON.stringify(paramsData), store.state.indexData.city)
              this.visible = false
              this.loginFinishEvent()
            } else {
              Toast( data.info?data.info:'登录/注册失败')
            }
          }, err => {
            Loading.close();
            Toast( "系统运行过程中遇到问题，请稍候再试");
          }
        )
      },
      //获取短信验证码
      getMsgCode:function(imgVerifyCode,uuid){
        if(this.phone == ''){
          this.$Toast( '手机号不能为空!' )
          return
        }
        else if (!util.checkMobile(this.phone)) {
          this.$Toast('请输入正确的手机号码！')
          return
        }
        this.$refs.countBtn.startTime();
        Loading.open();
        let url = '/app/json/login/sendSms';

        let paramsData = {
          smsType: '1020',
          phone:this.phone,
          imgVerifyCode:imgVerifyCode,
          uuid:uuid
        };

        http.post(url,paramsData).then(res => {
            Loading.close();
            let data = res.data;
            if(data.status == 0){
              Toast('获取验证码成功');
            }else {
              this.$refs.countBtn.resetClock();
              Toast(data.info?data.info:'获取短信验证码失败')
            }
          },
          err => {
            Loading.close();
            this.$refs.countBtn.resetClock();
            Toast('系统运行过程中遇到问题，请稍候再试')
          }
        )
      },
    },
    mounted() {
      this.phone = this.getUserInfo.phone
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .login {
    width 100%
    height 100%
    overflow hidden
    position fixed;
    top 0
    left 0
    z-index 98
    background: rgba(0, 0, 0, 0.5);
    .pop-cont {
      position absolute
      top 50%;
      left 50%;
      width 290px;
      padding 0 20px;
      transform translate(-50%, -50%)
      background-color white;
      border-radius 10px;
      .close-btn {
        position absolute;
        right 3px;
        top 3px;
        padding 10px;
        img {
          width 20px;
          height 20px;
        }
      }
      .title-info {
        margin-top 50px;
        display flex;
        flex-direction column;
        align-items center;
        .logo {
          img {
            display block;
            width 50px;
          }
        }
        .title {
          text-align center;
          font-size 16px;
          font-weight 500;
          margin-top 12px;
        }
      }
      .login-div {
        margin-top 25px;
        margin-bottom 40px;
        .text-input{
          padding: 10px 0px 0px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left{
            font-size:$font-size-medium;
          }
          .cell-phone{
            flex 1;
          }
          .van-cell {
            padding-left 2px;
          }
          .forget-btn {
            padding 5px 5px 5px 10px;
            white-space: nowrap;
            flex-shrink: 0;
          }
        }
        .tip {
          font-size 12px;
          margin-top 5px;
          padding 7px 0px;
          color #aaa;
        }
        .login-btn {
          margin-top 50px;
          text-align center;
          img {
            width 200px;
          }
        }
      }
    }
  }
</style>

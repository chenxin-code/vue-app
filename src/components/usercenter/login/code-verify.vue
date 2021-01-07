/**Created by liaoyingchao on 2018/11/11.*/

<template>
  <div class="code-verify login2">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="tip"><span class="tip-icon">系统检测到您的登录设备发生变更，请验证身份</span></div>
      <div class="login-div">
        <div class="text-input">
          <div class="left">手机号</div>
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
              @blur="phoneBlur"
            />
            <!--<input placeholder="请输入手机号" @input="inputChange" v-model="phone"/>-->
          </div>
        </div>
        <div class="passwords-input">
          <div class="passwords">
            <input placeholder="请输入短信验证码" v-model="msgCode"/>
          </div>
          <div class="forget-btn">
            <count-button class="theme_standard_font"  @getSmsEvent="getMsgCode"  :phone="phone" ref="countBtn"></count-button>
          </div>
        </div>
        <div class="passwords-input-new"  v-if="$store.state.globalConfig.user_register_referrer_input != '0' && isRegister != '1'">
          <div class="left-img">
            <img src="static/image/login2/registe5.png" alt="">
          </div>
          <div class="passwords">
            <input placeholder="请输入推荐码" v-model="referrer"/>
          </div>
          <div class="show-passwords" @click="scanCodeFunc">
            <img src="static/image/setting/icon-scan.png" class="scancode"/>
          </div>

        </div>
        <div class="common-btn theme_standard_bg theme_font_white mt100" @click="getCheckOutFun()">提交</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import CountButton from '@/components/commonui/count-button';
  import { mapMutations } from 'vuex'

  export default {
    name: "index",
    components: {
      CountButton
    },
    data() {
      return {
        phone:'',
        msgCode:'',
        isRegister:'1',  //1已经注册 0未注册
        referrer:'',
        scanCode:'',
      }
    },
    watch: {
      msgCode(val) {
        this.msgCode = this.$util.checkVerifyCodeLenght(this.msgCode);
      }
    },
    methods: {
      phoneBlur:function(){
        if(!this.$util.checkMobile(this.phone) || this.$store.state.globalConfig.user_register_referrer_input == '0'){
          return;
        }

        let url = '/app/json/login/getPreRegReferrerByPhone';
        let params1 = {
          phone: this.phone
        };
         this.$http.post(url, params1).then(res => {
          let data = res.data;
          // console.log(data);
          if (data.status == 0) {
            this.referrer = data.data.referrer;
            this.isRegister = data.data.isRegister;
          } else {
            this.$Toast(data.info)
          }
        }, error => {
        });

      },
      scanCodeFunc:function(){

        this.$bridgefunc.scanCode((dic)=>{

          let code = dic.code
          if (dic.code && (dic.code.indexOf('http') > -1)) { // 兼容微信扫码我的二维码跳转到下载地址
            code = this.$util.getUrlParam(dic.code, 'qrCode')
          }
          this.scanCode = code;
          this.referrer = code;
        });
      },
      // 仅输入数字
      inputChange:function(e){
        let value = e.target.value ;
        this.phone = this.$util.onlyNumber(value);
      },
      backEvent: function () {
        this.$router.go(-1)
      },


      //获取短信验证码
      getMsgCode:function(imgVerifyCode,uuid){
        if(this.phone == ''){
          this.$Toast( '手机号不能为空!' )
          return
        }
        else if (!this.$util.checkMobile(this.phone)) {
          this.$Toast('请输入正确的手机号码！')
          return
        }
        this.$refs.countBtn.startTime();
        this.$Loading.open();
        let url = '/app/json/login/sendSms';

        let paramsData = {
          smsType: '1020',
          phone:this.phone,
          imgVerifyCode:imgVerifyCode,
          uuid:uuid,
          // category: 'oilsale'
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
        let params = {
          phone: this.phone,
          smsVerifyCode:this.msgCode
        };
        if(this.referrer && this.referrer.length){
          params['rfrCode'] = this.referrer;
        }
        // 1 手动输入  2扫一扫
        if(this.referrer == this.scanCode){
          params['rfrCodeType'] = 2;
        }else {
          params['rfrCodeType'] = 1;
        }
        // 存手机号防止原设备ID为空，作为设备ID
        this.$store.state.login.phone = this.phone

        this.$http.post(url,params).then(res => {
          this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if(data.status == 0){
              this.$actionStatistics.loginAction('110020', JSON.stringify(params), this.$store.state.indexData.city)
              this.$Toast(data.info?data.info:'登录成功')
              window.localStorage.setItem('hobby',1)
              this.$userCenter.retsetToIndex(data.data,2);
            }else {
              this.$refs.countBtn.resetClock();
              this.$Toast(data.info?data.info:'登录失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast('系统运行过程中遇到问题，请稍候再试')
          }
        )
      },
      getCheckOutFun:function(){
        let mobileReg = /^1\d{10}$/;
        if(this.phone == ''){
          this.$Toast( '手机号不能为空!' )
          return
        }else if(!mobileReg.test(this.phone)){
          this.$Toast( '手机号格式不对!' )
          return
        }else if(this.msgCode == ''){
          this.$Toast( '验证码不能为空!' )
          return
        }
        this.loginFun()
      },
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
  @import "~@/common/stylus/variable.styl"
  .code-verify{
    width 100%
    height 100%
    overflow hidden
    .tip{
      display none;
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
        padding-left:14px;
      }
    }
    .login-div {
      margin 0px 20px 30px 20px;
      .text-input{
        padding:24px 0px 10px 0px;
        display: flex;
        justify-content: end;
        align-items: center;
        .left{
          font-size:$font-size-medium;
        }
        .cell-phone{
          flex 1;
          padding-left:10px;
          .van-cell {
            padding 0 !important;
          }
          /*input{
            display:block;
            font-size:$font-size-medium;
            width:100%;
          }*/
        }

      }
      .passwords-input{
        border-bottom:1px solid #dedede;
        padding:24px 0px 10px 0px;
        display: flex;
        justify-content: space-between;
        .passwords{
          width:70%;
          input{
            color #323233;
            margin -3px 0px;
            height 24px;
            display:block;
            width:100%;
            font-size:$font-size-medium-s;
          }
        }
        .forget-btn {
          border-left:1px solid #dedede;
          padding-left 10px
          line-height:18px;
        }
      }
      .mt100{
        margin-top:50px;
      }
    }
    .left-img{
      width 23px
      height 23px
      margin-right 5px
      img{
        width 100%
        height 100%
      }
    }
    .passwords-input-new{
      border-bottom:1px solid #dedede;
      padding:20px 0px 5px 0px;
      display: flex;
      align-items center;
      justify-content: space-between;
      .passwords{
        flex 1
        input{
          height 30px;
          display:block;
          width:100%;
          font-size:$font-size-medium-s;
        }
      }
      .show-passwords{
        extend-click()
        img{
          display:block;
          // margin-top:4px;
        }
        .see-icon{
          width:15px;
          height:10px;
        }
        .scancode{
          width:15px;
          height:15px;
        }

      }
      .forget-btn {
        border-left:1px solid #dedede;
        padding-left 10px
        line-height:1;
      }
    }

    input::-webkit-input-placeholder { /* WebKit browsers */
            color: #999;
          }
  }
</style>

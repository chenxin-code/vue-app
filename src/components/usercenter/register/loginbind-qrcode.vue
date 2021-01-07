/**Created by steven on 2019/7/29.*/

<template>
  <div class="loginbind-qrcode login2" v-if="referrer && referrer.length">
    <nav-content>
      <div class="app-info">
        <div class="logo">
          <img :src="$store.state.globalConfig.logoUrl"/>
        </div>
        <div class="title">{{loginTitle}}</div>
      </div>
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
            />
            <!--<input placeholder="请输入手机号" @input="inputChange" v-model="phone"/>-->
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
        <div class="passwords-input">
          <div class="left-img">
            <img src="static/image/login2/registe5.png" alt="">
          </div>
          <div class="passwords">
            <input placeholder="请输入推荐码" disabled v-model="referrer"/>
          </div>

        </div>
        <div class="login-way">
          <div class="btn-extend" @click="download">已注册，去安装</div>
        </div>
        <div class="common-btn theme_standard_bg theme_font_white mt100" @click="getCheckOutFun()">提交</div>

      </div>
    </nav-content>
    <AdPage :pageAdKeywords="'AD_Key_LoginBindQrcode'"></AdPage>
  </div>
</template>

<script>
  import CountButton from '@/components/commonui/count-button';
  import AdPage from '@/components/product/index/subpage/adpage'

  export default {
    name: "loginbind-qrcode",
    components: {
      CountButton,
      AdPage
    },
    data() {
      return {
        loginTitle: this.$store.state.globalConfig.projectName,
        phone:'',
        msgCode:'',
        referrer:'',
      }
    },
    watch: {
      msgCode(val) {
        this.msgCode = this.$util.checkVerifyCodeLenght(this.msgCode);
      },

    },
    methods: {
      download:function(){
        this.$router.push({
          path: '/usercenter/downloadshare',
        })
      },
      // 仅输入数字
      inputChange:function(e){
        let value = e.target.value ;
        this.phone = this.$util.onlyNumber(value);
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
          smsType: '1000',
          phone:this.phone,
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
        let url = '/app/json/login/smsRegister';
        let paramsData = {
          phone: this.phone,
          smsVerifyCode:this.msgCode
        };

        if(this.referrer && this.referrer.length){
          paramsData['rfrCode'] = this.referrer;
          paramsData['rfrCodeType'] = 2;
        }

        this.$http.post(url,paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if(data.status == 0){
              this.$router.push({
                path: '/usercenter/downloadsharenew',
              })
            }else {
              this.$Toast(data.info?data.info:'注册失败')
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
      this.referrer = this.$route.query.qrCode;
      if(!this.referrer || this.referrer == ''){
        this.$Toast('推荐码不能为空');
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"

  .loginbind-qrcode {
    width 100%
    height 100%
    overflow hidden
    .app-info {
      text-align center;
      margin-top 15px;
      .logo {
        img {
          width 50px;
          height 50px;
        }
      }
      .title {
        margin-top 10px;
        font-size 18px;
        font-weight 500;
      }
    }
    .login-div {
      margin 20px 20px 30px 20px;
      .text-input{
        border-bottom:1px solid #dedede;
        padding:20px 0px 5px 0px;
        display: flex;
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
      .passwords-input{
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

      .mt100 {
        margin-top: 30px;
      }

      .login-way {
        margin-top: 25px;
        display: flex;
        justify-content: flex-end;
        .btn-extend {
          extend-click()
          font-size: $font-size-medium-s;
        }
      }
    }
    input:
    :-webkit-input-placeholder { /* WebKit browsers */
      color: #999;
    }
  }
</style>

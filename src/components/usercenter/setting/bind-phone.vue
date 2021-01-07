/**Created by steven on 2018/12/24.*/

<template>
  <div class="bind-phone login2">
    <nav-top  @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="login-div">
        <div class="text-input">
          <div class="cell-phone">
            <span class="input-text">{{$store.state.login.phone}}</span>
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
        <div class="common-btn theme_bg_red theme_font_white mt100" @click="getCheckOutFun()">提交</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import CountButton from '@/components/commonui/count-button';

export default {
  name: "bind-phone",
  components: {
    CountButton
  },
  data () {
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
    getCheckOutFun:function(){
      if(this.msgCode == ''){
        this.$Toast('请输入短信验证码');
        return;
      }
      this.$Loading.open();
      let url = '/app/json/user/bindThirdUser';
      let paramsData = {
        phone:this.$store.state.login.phone,
        thirdUserId:this.$route.query.thirdUserId?this.$route.query.thirdUserId:'',
        smsVerifyCode:this.msgCode,
        regChannel:this.$route.query.regChannel?this.$route.query.regChannel:'',
        bindType:this.$route.query.bindType,
        token:this.$store.state.login.token,
      };

      this.$http.post(url,paramsData).then(res => {
          this.$Loading.close();
          console.log(res.data)
          let data = res.data;
          if(data.status == 0){
            this.$MessageBox.alert('绑定成功!','提示').then(action => {
              this.backEvent();
            });
          }
          else {
            this.$Toast( data.info)
          }
        },
        err => {
          this.$Loading.close();
          this.$Toast( "系统运行过程中遇到问题，请稍候再试");
        }
      )
    },
    backEvent:function(){
      this.$router.go(-1);
    },
    //获取短信验证码
    getMsgCode:function(imgVerifyCode,uuid){

      this.$refs.countBtn.startTime();
      this.$Loading.open();
      let url = '/app/json/login/sendSms';
      let paramsData = {
        smsType: '1020',
        phone:this.$store.state.login.phone,
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
  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"

  .bind-phone {
  width 100%
  height 100%
  overflow hidden

  .login-div {
    margin 0px 20px 30px 20px;

    .text-input{
      border-bottom:1px solid #dedede;
      padding:25px 0px 10px 0px;
      .cell-phone{
        width:100%;
        .input-text{
          display:block;
          font-size:$font-size-medium;
          width:100%;
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
          font-size:$font-size-medium;
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

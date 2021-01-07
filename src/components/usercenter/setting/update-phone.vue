/**Created by liaoyingchao on 2018/11/11.*/

<template>
  <div class="update-phone login2">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="login-div">
        <div class="text-input">
          <div class="cell-phone">
            <input placeholder="请输入手机号" v-model="phone"/>
          </div>
        </div>
        <div class="passwords-input">
          <div class="passwords">
            <input placeholder="请输入短信验证码" v-model="msgCode"/>
          </div>
          <div class="forget-btn">
            <count-button class="theme_font_red_i"  @getSmsEvent="getMsgCode" :phone="phone"  ref="countBtn"></count-button>
          </div>
        </div>
        <div class="common-btn theme_bg_red theme_font_white mt100" @click="revisePhone()">提交</div>
      </div>
    </nav-content>
    <!--<Succee :succeeText = "succeeTxet"></Succee>-->
  </div>
</template>

<script>
  import {Toast } from 'mint-ui'
  import Succee from '../register/succee-mark'
  import CountButton from '@/components/commonui/count-button';

  export default {
    name: "index",
    components: {
      Toast,
      Succee,
      CountButton
    },
    data() {
      return {
        phone:'',
        msgCode:'',
        succeeTxet:'恭喜，手机号修改成功！',
        loginChannel: '',
        userPwd: '',
        originalVerifyCode: ''
      }
    },
    watch: {
      msgCode(val) {
        this.msgCode = this.$util.checkVerifyCodeLenght(this.msgCode);
      }
    },
    methods: {
      backEvent:function(){
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
          smsType: '1030',
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
      revisePhone:function () {
        if(this.phone == ''){
          this.$Toast( '手机号不能为空!' )
          return
        }
        if(this.msgCode == ''){
          this.$Toast( '验证码不能为空!' )
          return
        }
        this.$Loading.open();
        let url = '/app/json/user/modifyPhone';

        let paramsData = {
          token:this.$store.state.login.token,
          phone:this.phone,
          userPwd: this.userPwd,
          loginChannel: this.loginChannel,
          smsVerifyCode:this.msgCode,
          originalVerifyCode: this.originalVerifyCode
        };

        this.$http.post(url,paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if(data.status == 0){
              console.log(data)
              this.$store.state.login.phone = this.phone;
              this.$Toast("修改手机号成功！")
              this.$router.go(-3);
              // this.$bridgefunc.vuexStorage(()=>{
              //   this.$MessageBox.alert('修改手机号成功', '提示').then(action => {
              //   });
              // })
            }else {
              this.$Toast(data.info?data.info:'获取短信验证码失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast('系统运行过程中遇到问题，请稍候再试')
          }
        )
      }

    },
    created() {
      this.loginChannel = this.$route.query.loginChannel ? this.$route.query.loginChannel : ''
      this.originalVerifyCode = this.$route.query.originalVerifyCode ? this.$route.query.originalVerifyCode : ''
      this.userPwd = this.$route.query.userPwd ? this.$route.query.userPwd : ''
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .update-phone{
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
        border-bottom:1px solid #dedede;

        .cell-phone{
          input{
            display:block;
            font-size:$font-size-medium-s;
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

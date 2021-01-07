/**Created by liaoyingchao on 2018/11/11.*/

<template>
  <div class="update-password login2">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="login-div">
        <div class="text-input">
          <div class="left">请输入原密码</div>
          <div class="cell-phone">
            <input placeholder="请输入原密码" :type="isShowPwd1?'text':'password'" v-model="oldPassword"/>
          </div>
          <div class="show-passwords" @click="isShowPwd1 = !isShowPwd1">
            <img :src="isShowPwd1?'static/image/login2/see-icon.png':'static/image/login2/icon-eye.png'"  class="see-icon"/>
          </div>
        </div>
        <div class="text-input">
          <div class="left">请输入新密码</div>
          <div class="cell-phone">
            <input :placeholder="$util.pwdPlaceholder()" :type="isShowPwd2?'text':'password'" v-model="newPassword"
                   @blur="$util.checkPassWord(newPassword,true,true)"/>
          </div>
          <div class="show-passwords" @click="isShowPwd2 = !isShowPwd2">
            <img :src="isShowPwd2?'static/image/login2/see-icon.png':'static/image/login2/icon-eye.png'"  class="see-icon"/>
          </div>
        </div>
        <div class="text-input">
          <div class="left">确认新密码</div>
          <div class="cell-phone">
            <input placeholder="再次输入新密码" :type="isShowPwd3?'text':'password'" v-model="checkNwePassword" @blur="verifyPassword"/>
          </div>
          <div class="show-passwords" @click="isShowPwd3 = !isShowPwd3">
            <img :src="isShowPwd3?'static/image/login2/see-icon.png':'static/image/login2/icon-eye.png'"  class="see-icon"/>
          </div>
        </div>
        <div class="common-btn theme_bg_red theme_font_white mt100" @click="modifyPwd">提交</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {Toast } from 'mint-ui'
  import  MD5 from '@/utils/md5.js'
  export default {
    name: "index",
    components: {
      Toast
    },
    data() {
      return {
        oldPassword:'',
        newPassword:'',
        checkNwePassword:'',
        isShowPwd1: false,
        isShowPwd2: false,
        isShowPwd3: false,
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1)
      },
      //密码格式效验
      verifyPassword:function(){
        if (this.checkNwePassword == ""){
          return
        }
        if(this.newPassword != this.checkNwePassword){
          this.$Toast({
            message: '两次输入的新密码不一致！',
            position: 'middle',
            duration: 2000,
          });
          return
        }
      },
      modifyPwd:function(){
       if(!this.$util.checkPassWord(this.newPassword)){
          return
        }else if(this.newPassword != this.checkNwePassword){
         this.$Toast({
           message: '两次输入的新密码不一致！',
           position: 'middle',
           duration: 2000,
         });

          return
        }

        this.$Loading.open();
        let url = '/app/json/user/modifyPwd';
        let paramsData = {
          token:this.$store.state.login.token,
          originPwd:MD5(this.oldPassword),
          userPwd:MD5(this.newPassword)
        }
        if (this.$store.state.globalConfig.user_loginPwd_type == '1') {
          // 明文密码
          paramsData.originPwd = this.oldPassword
          paramsData.userPwd = this.newPassword
        }

        this.$http.post(url,paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if(data.status == 0){
              this.$MessageBox.alert('修改成功!','提示').then(action => {
                this.$store.state.login.password =  MD5(this.newPassword);
                this.$bridgefunc.vuexStorage(()=>{
                  this.backEvent();
                });
              });

            }else {
              this.$Toast(data.info?data.info:'登录失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试")
          }
        )
      },

    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .update-password{
    width 100%
    height 100%
    overflow hidden
    .login-div {
      margin 0px 20px 30px 20px;
      .text-input{
        padding:20px 0px 5px 0px;
        display: flex;
        justify-content: end;
        align-items: center;
        border-bottom:1px solid #dedede;
        .left{
          font-size:$font-size-medium;
          min-width 25%
        }
        .cell-phone{
          padding-left:10px;
          flex 1
          input{
            height 30px;
            display:block;
            font-size:$font-size-medium;
            width:100%;
          }
        }

      }
      .show-passwords{
        margin-left 8px;
        padding 8px 0;
        img{
          width 16px;
          display:block;
          // margin-top:4px;
        }
      }
      .mt100{
        margin-top:50px;
      }
    }
  }
</style>

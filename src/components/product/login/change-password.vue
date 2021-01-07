<template>
  <div class="bottom">

    <div class="line-style" v-if="isShowOriginPwd">
      <div class="text-left font-medium">
        原密码
      </div>
      <div class="input-style">
        <input type="password"  class="font-medium" placeholder="请输入原密码" v-model.trim="originPwd"/>
      </div>
    </div>

    <div class="line-style">
      <div class="text-left font-medium">
        新密码
      </div>
      <div class="input-style">
        <input type="password"  class="input-style font-medium" placeholder="请输入新密码" v-model.trim="userPwd"/>
      </div>
    </div>

    <div class="line-style">
      <div class="text-left font-medium ">
        确认新密码
      </div>
      <div class="input-style">
        <input type="password"  class="input-style font-medium" placeholder="请再次输入新密码" v-model.trim="sureuserPwd"/>
      </div>
    </div>

    <button class="btn-style font-medium-x" @click="changePWD">提交</button>
  </div>
</template>

<script>
  import { Toast} from 'mint-ui'
  import  MD5 from '@/utils/md5.js'

  export default {

    name: 'changepassword',
    components: {
      Toast
    },
    data() {
      return {
        msg: 'msg',
        sureuserPwd:'',
        originPwd:'',
        userPwd:'',
        isShowOriginPwd:'',
        token:'',
      }
    },
    methods: {
      testFunc: function () {
        console.log('testFunc')
      },
      changePWD: function () {
        if(!this.isShowOriginPwd){
          this.forceChangePwd();
          return;
        }
        if(!this.originPwd){
          this.$MessageBox.alert('请输入原密码!','提示');
          return;
        }else if(!this.userPwd || !this.$util.checkPassWord(this.userPwd )){
          return;
        }else if(!this.sureuserPwd || !this.$util.checkPassWord(this.sureuserPwd )){
          return;
        }else if(this.sureuserPwd !=this.userPwd){
          this.$MessageBox.alert('两次输入的密码不一样!', '提示');
          return;
        }
        this.$Loading.open('加载中')
        let url = '/app/json/user/modifyPwd';
       let oldpwd = MD5(this.originPwd);
       let newpwd = MD5(this.userPwd);
        let token = this.$store.state.login.token
        let params1 = {
          originPwd: oldpwd,
          userPwd: newpwd,
          token:token,
        };
        console.log(params1);
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
        let data = res.data;
        console.log('修改密码', data)
        if (data.status == 0) {
          Toast({
            message: data.info ? data.info :'修改密码成功',
            position: 'bottom',
            duration: 2000,
          });
          _this.$bridgefunc.customGo(-1)
        } else {
          Toast({
            message: data.info ? data.info :'修改密码失败',
            position: 'bottom',
            duration: 2000,
          });
        }

      }, error => {
          _this.$Loading.close();
          Toast({
            message: '修改密码失败',
            position: 'bottom',
            duration: 2000
          });
          console.log('修改密码失败', error)
        })
      },
      forceChangePwd:function () {
        console.log('强制修改密码')
        if(!this.userPwd){
          this.$MessageBox.alert('请输入新密码!', '提示');
          return;
        }else if(!this.sureuserPwd ){
          this.$MessageBox.alert('请确定新密码!', '提示');
          return;
        }else if(this.sureuserPwd !=this.userPwd){
          this.$MessageBox.alert('两次输入的密码不一样!', '提示');
          return;
        }
        this.$Loading.open('加载中')
        let url = '/app/json/user/forceModifyPwd';
        let newpwd = this.userPwd;
        let token = this.token;
        let params1 = {
          userPwd: newpwd,
          token:token,
        };
        console.log(params1);
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
        let data = res.data;
        console.log('修改密码', data)
        if (data.status == 0) {
          Toast({
            message: data.info ? data.info :'修改密码成功',
            position: 'bottom',
            duration: 2000,
          });
          _this.$bridgefunc.customGo(-2);
        } else {
          Toast({
            message: data.info ? data.info :'修改密码失败',
            position: 'bottom',
            duration: 2000,
          });
        }

      }, error => {
          _this.$Loading.close();
          Toast({
            message: '修改密码失败',
            position: 'bottom',
            duration: 2000
          });
          console.log('修改密码失败', error)
        })

      },
    },
    created() {
      if(this.$route.query.isFromLogin){
        this.isShowOriginPwd = false;
        this.token = this.$route.query.isFromLogin;
      }else{
        this.isShowOriginPwd = true;
      }
      console.log('isShowOriginPwd:', this.isShowOriginPwd);
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .bottom {
    position absolute
    top 0px
    bottom 0px
    left 0px
    right 0px
    overflow hidden
    background-color $color-background-lll
    //padding-top 10px
    .line-style {
      background-color white
      width 100%
      height 44px;
      line-height 44px;
      padding-left 3%
      padding-right 3%
      border-bottom solid $color-line-gray-l 1px
      .text-left {
        //padding-top 1px
        height 44px;
        line-height 44px;
        width 100px;
        float left
      }
      .input-style {
        // width 70%
        // margin-left 2%
        overflow hidden

        input {
          width 100%
        }
      }
      input:
      :-webkit-input-placeholder { /* WebKit browsers */
        color: $color-text-l;
      }
      input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: $color-text-l;
      }
      input:
      :-moz-placeholder { /* Mozilla Firefox 19+ */
        color: $color-text-l;
      }
      input:-ms-input-placeholder { /* Internet Explorer 10+ */
        color: $color-text-l;
      }
    }
    .btn-style {
      background-color $color-theme-btn-l
      width 90%
      margin 12px 5%
      padding 10px;
      color white
      border none
      border-radius 5px
    }
  }
</style>

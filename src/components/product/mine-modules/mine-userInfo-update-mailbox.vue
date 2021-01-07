<template>
  <div class="mine-userInfo-update-mailbox">
    <div class="update-mailbox">
      <input type="text" placeholder="请输入邮箱" class="textinput" v-model="email"/>
    </div>
    <button class="loginout font-medium-x" @click="saveEmail">保存</button>
  </div>
</template>

<script>
  import { Toast} from 'mint-ui'
  export default {
    name: 'mine-updatemail',
    components: {
      Toast
    },
    data() {
      return {
        msg: 'msg',
        email:'',
        userInfo:{},
      }
    },
    methods: {
      testFunc: function () {
        console.log('testFunc')
      },
      saveEmail:function () {
        if (!this.email || !this.$util.checkMail(this.email) ){
          Toast({
            message: '请输入正确的邮箱',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        this.$Loading.open('保存中')
        let url = '/app/json/user/modifyUserInfo';
        let token = this.$store.state.login.token
        let params1 = {
          realName:this.userInfo.realName?this.userInfo.realName:'',
          gender:this.userInfo.gender?this.userInfo.gender:'',
          email:this.email,
          idType:this.userInfo.idType?this.userInfo.idType:'',
           idNumber:this.userInfo.idNumber?this.userInfo.idNumber:'',
           address:this.userInfo.address?this.userInfo.address:'',
          provinceName:this.userInfo.provinceName?this.userInfo.provinceName:'',
          cityName:this.userInfo.cityName?this.userInfo.cityName:'',
          provinceCode:this.userInfo.provinceCode?this.userInfo.provinceCode:'',
          cityCode:this.userInfo.cityCode?this.userInfo.cityCode:'',
           postCode:'',
           userType:'',
          token:token,
        }
        console.log(params1);
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
        let data = res.data;
        console.log('邮箱', data)
        if (data.status == 0) {
          Toast({
            message: data.info ? data.info :'修改邮箱成功',
            position: 'bottom',
            duration: 2000,
          });
          _this.$store.state.userInfo.email = _this.email
          _this.$bridgefunc.vuexStorage(function () {
            _this.$bridgefunc.customGo(-1)
          })
        } else {

          Toast({
            message: data.info ? data.info :'修改邮箱失败',
            position: 'bottom',
            duration: 2000,
          });
        }
      }, error => {
          _this.$Loading.close();
          console.log('修改邮箱失败', error)
          Toast({
            message: '保存失败',
            position: 'bottom',
            duration: 2000,
          });
        })
      },
    },
    created() {
      this.email = this.$route.query.email ? decodeURIComponent(this.$route.query.email): ''
      if(this.$route.query.userInfo){
        this.userInfo = JSON.parse(decodeURIComponent(this.$route.query.userInfo));
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .mine-userInfo-update-mailbox {
    width: 100%;
    height :100%;
    overflow: hidden;
    background-color:#efefef;
    position:absolute;
    .update-mailbox{
      background :#fff;
      height:44px;
      .textinput{
        background:none;
        outline:none;
        border:0px;
        padding:5px 3%;
        height:44px;
        line-height:44px;
        width:100%;
        font-size:$font-size-medium;
      }
    }
    .loginout {
      margin:12px 5% 0px 5%;
      width: 90%;
      height: 44px;
      border-radius: 5px;
      color: #fff;
      background-color: $color-theme-btn-l;
      border: none;
    }
  }
</style>

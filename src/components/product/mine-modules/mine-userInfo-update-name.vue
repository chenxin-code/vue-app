<template>
  <div class="mine-userInfo-update-mailbox">
    <div class="update-mailbox">
      <input type="text" placeholder="请输入姓名" class="textinput" v-model="realName"/>
    </div>
    <button class="loginout font-medium-x" @click="saveNamae">保存</button>
  </div>
</template>

<script>
  import { Toast} from 'mint-ui'
  export default {
    name: 'mine-updatename',
    components: {
      Toast
    },
    data() {
      return {
        msg: 'msg',
        realName:'',
        userInfo:{},
      }
    },
    methods: {
      testFunc: function () {
        console.log('testFunc')
      },
      saveNamae:function () {
        if (!this.realName){
          Toast({
            message: '请输入姓名',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        this.$Loading.open('保存中')
        let url = '/app/json/user/modifyUserInfo';
        let token = this.$store.state.login.token
        let params1 = {
          realName:this.realName,
          gender:this.userInfo.gender?this.userInfo.gender:'',
          email:this.userInfo.email?this.userInfo.email:'',
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
        console.log('性别', data)
        if (data.status == 0) {
          Toast({
            message: data.info ? data.info :'修改姓名成功',
            position: 'bottom',
            duration: 2000,
          });
          _this.$store.state.userInfo.realName = _this.realName
          _this.$bridgefunc.vuexStorage(function () {
            _this.$bridgefunc.customGo(-1)
          })
        } else {
          Toast({
            message: data.info ? data.info :'修改姓名失败',
            position: 'bottom',
            duration: 2000,
          });
        }
      }, error => {
          _this.$Loading.close();
          console.log('修改姓名失败', error)
          Toast({
            message: '保存失败',
            position: 'bottom',
            duration: 2000,
          });
        })
      },
    },
    created() {
      this.realName = this.$route.query.realname ? this.$route.query.realname : ''
      this.userInfo = JSON.parse(this.$route.query.userInfo)
      console.log(this.userInfo)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .mine-userInfo-update-mailbox {
    width: 100%;
    height :100%;
    overflow: hidden;
    background-color: $color-background-lll;
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
      border: $color-theme-btn-l 1px solid;
    }
  }
</style>

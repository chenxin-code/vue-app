<template>
  <div class="mine-userInfo-update-address">
    <div class="update-address">
      <textarea type="text" placeholder="请输入详细地址" class="textinput" v-model="address"></textarea>
    </div>
    <button class="loginout font-medium-x" @click="saveaddress">保存</button>
  </div>
</template>

<script>
  import { Toast} from 'mint-ui'
  export default {
    name: 'updateAddress',
    components: {
        Toast
    },
    data() {
      return {
        address:'',
        userInfo:{},
      }
    },
    methods: {
      testFunc: function () {
        console.log('testFunc')
      },
      saveaddress:function () {
        if (!this.address){
          alert('请输入详细地址');
          return;
        }
        this.$Loading.open('保存中')
        let url = '/app/json/user/modifyUserInfo';
        let token = this.$store.state.login.token
        let params1 = {
          realName:this.userInfo.realName?this.userInfo.realName:'',
          gender:this.userInfo.gender?this.userInfo.gender:'',
          email:this.userInfo.email?this.userInfo.email:'',
          idType:this.userInfo.idType?this.userInfo.idType:'',
          idNumber:this.userInfo.idNumber?this.userInfo.idNumber:'',
          address:this.address,
          provinceName:this.userInfo.provinceName?this.userInfo.provinceName:'',
          cityName:this.userInfo.cityName?this.userInfo.cityName:'',
          provinceCode:this.userInfo.provinceCode?this.userInfo.provinceCode:'',
          cityCode:this.userInfo.cityCode?this.userInfo.cityCode:'',
          postCode:'',
          userType:'',
          token: this.$store.state.login.token
        }
        console.log(params1);
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
        let data = res.data;
        console.log('修改地址', data)
        if (data.status == 0) {
          Toast({
            message: data.info ? data.info :'修改地址成功',
            position: 'bottom',
            duration: 2000,
          });
          // _this.$bridgefunc.customGo(-1)
          _this.$store.state.userInfo.address = _this.address
          _this.$bridgefunc.vuexStorage(function () {
            _this.$bridgefunc.customGo(-1)
          })
        } else {
          Toast({
            message: data.info ? data.info :'修改地址失败',
            position: 'bottom',
            duration: 2000,
          });
        }
      }, error => {
          _this.$Loading.close();
          console.log('修改地址失败', error)
          Toast({
            message: '保存失败',
            position: 'bottom',
            duration: 2000,
          });
        })
      },
    },
    created() {
      this.address = this.$route.query.address ?decodeURIComponent(this.$route.query.address): ''
      this.userInfo = JSON.parse(this.$route.query.userInfo)
      console.log(this.userInfo)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .mine-userInfo-update-address {
    width: 100%;
    height :100%;
    overflow: hidden;
    background-color:#efefef;
    position:absolute;
    .update-address{
      background :#fff;
      .textinput{
        min-height:100px
        background:none;
        outline:none;
        border:0px;
        padding:5px 3%;
        width:100%;
        font-size:14px;
        line-height:16px;
        resize: none;
      }
    }
    .loginout {
      margin:10px 10% 0px 10%;
      width: 80%;
      height: 40px;
      border-radius: 5px;
      color: #fff;
      background-color: $color-theme-btn-l = #F8AB00;
      border: $color-theme-btn-l = #F8AB00 1px solid;
    }
  }
</style>

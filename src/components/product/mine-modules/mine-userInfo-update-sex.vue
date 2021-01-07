<template>
  <div class="mine-userInfo-update-sex">
    <ul class="update-sex">
      <li class="item" v-for="(item,index) in sexTab" :class="{selected:selected == item.id}" @click="selectedFunc(item)">{{item.sex}}</li>
    </ul>
  </div>
</template>

<script>
  import { Toast} from 'mint-ui'
  export default {
    name: 'mine-update',
    components: {
      Toast
    },
    data() {
      return {
        selected:'0',
        userInfo:{},
        sexTab:[
          {
            id:"1",
            sex:"男"
          },
          {
            id:"2",
            sex:"女"
          }
        ]
      }
    },
    methods: {
      testFunc: function () {
        console.log('testFunc')
      },
      selectedFunc:function (item) {
        this.selected = item.id;
        this.saveGender();

      },
      saveGender:function () {
        this.$Loading.open('保存中')
        let url = '/app/json/user/modifyUserInfo';
        let token = this.$store.state.login.token
        let params1 = {
          realName:this.userInfo.realName?this.userInfo.realName:'',
          gender:this.selected,
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
            message: data.info ? data.info :'修改性别成功',
            position: 'bottom',
            duration: 2000,
          });
          _this.$store.state.userInfo.gender = _this.selected
          _this.$bridgefunc.vuexStorage(function () {
            _this.$bridgefunc.customGo(-1)
          })
        } else {
          Toast({
            message: data.info ? data.info :'修改性别失败',
            position: 'bottom',
            duration: 2000,
          });
        }
      }, error => {
          _this.$Loading.close();
          console.log('修改性别失败', error)
          Toast({
            message: '保存失败',
            position: 'bottom',
            duration: 2000,
          });
        })
      },
    },
    created() {
      this.selected = this.$route.query.gender ? this.$route.query.gender : '0'
      this.userInfo = JSON.parse(this.$route.query.userInfo)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .mine-userInfo-update-sex{
    width: 100%;
    height :100%;
    overflow: hidden;
    background-color: $color-background-lll;
    position:absolute;
    .update-sex{
      background :#fff;
      height:88px;
      padding-left:3%;
      .item{
        position:relative;
        height:44px;
        line-height:44px;
        color:$color-text-l;
        font-size:$font-size-medium;
        &:after{
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          content: '';
          background: $color-line-gray-l;
          transform: scaleY(0.5);
          -webkit-transform: scaleY(0.5);
          z-index: 10;
        }
      }
      .selected{
        background:url("../../../../static/image/mine/xuanze.png")97% center no-repeat;
        -webkit-background-size: 20px 20px;
        background-size: 20px 20px;
      }
    }
  }
</style>

<template>
  <div class="mineinfo" @click="enterUserInfo">
    <div class="mine-header-img">
      <img ref="headerimg" :src="getHeadImg(userInfo.headImg)" class="full-img"/>
    </div>
    <div class="mine-icon-more">
      <img src="../../../assets/more.png" class="more-style"/>
    </div>
    <div class="mine-header-info">
      <p class="font-medium-x">{{userInfo.nickName}}</p>
      <p class="font-medium">{{getPhoneNum(userInfo)}}</p>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "minemodule-user-info",
    components: {
      mapGetters
    },
    // props: [
    //   'userInfo'
    // ],
    computed: {
      ...mapGetters([
        'userInfo',
      ]),
    },
    data() {
      return {
      }
    },
    methods: {
      testFunc: function () {
        console.log('testFunc')
      },
      getHeadImg:function(headImg){
        if(!headImg || headImg == ''){
          return 'static/image/mine/default-user.png'
        }
        return headImg
      },
      getPhoneNum: function () {
        let phonenum = this.userInfo.phone
        if (phonenum == undefined || phonenum.length != 11) {
          return ''
        }
        let str1 = phonenum.slice(0, 3)
        let str2 = phonenum.slice(7, phonenum.length)
        return str1 + ' **** ' + str2
      },
      uploadpic: function () {//上传图片

      },
      changeinfo: function (index) {//修改用户信息

      },
      getSubtitle: function (index) {
        return 123 * index;
      },
      enterUserInfo: function () {
        this.$bridgefunc.customPush({
          path: '/userinfo',
          isnativetop:'1',
        });
      },
    }
  }
</script>

<style lang=stylus scoped type="text/stylus">
  .mineinfo {
    width: 100%;
    position relative
    height 70px
    overflow hidden
    background-color white
    .mine-header-img {
      float left
      margin-left 10px;
      margin-top 10px;
      width: 50px;
      position relative
      height 50px
      border-radius 25px;
      overflow hidden
    }
    .mine-icon-more {
      float right
      // text-align right
      margin-right 2%;
      //width: 10%;
      // height 55px
      margin-top 25px
      .more-style {
        width 20px
        height: 20px
      }
    }
    .mine-header-info {
      /*float left*/
      overflow hidden
      /*width: 70%;*/
      position relative
      height 100%
      padding 8px
      p {
        padding 3px 0px
      }
    }
  }

</style>

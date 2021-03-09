/**Created by steven on 2019/10/15.*/

<template>
  <div class="authorization-page">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <p class="tips">服务声明:本服务有{{args.serviceName}}提供, 并承担法律责任</p>
      <!--$store.state.globalConfig.logoUrl-->
      <div class="companys">
        <div class="com-info">
          <img :src="args.selfImg" alt="">
          <p>{{$store.state.globalConfig.projectName}}</p>
        </div>
        <img class="auth-arrow" src="@/assets/login/double-jian.png" alt="">
        <div class="com-info">
          <img :src="args.serviceImg" alt="">
          <p>{{args.serviceName}}</p>
        </div>
      </div>
      <p class="auth-declare">授权说明</p>
      <p class="auth-declare-detial">{{args.serviceName}}申请获取您在{{$store.state.globalConfig.projectName}}中的个人信息</p>

      <van-button class="auth-btn" type="danger" @click="authEvent">授权</van-button>
      <van-button class="auth-btn" color="red" plain @click="backEvent">取消</van-button>

      <p class="bottom-tip">本服务由{{args.serviceName}}提供</p>

    </nav-content>
  </div>
</template>

<script>
  import { Button } from 'vant';
  import appLocalstorage from '@zkty-team/x-engine-module-localstorage'

export default {
  name: "authorization-page",
  components: {
     Button
  },
  data () {
    return {
      args:{
        serviceName:'友途车服',
        serviceImg: require('./images/auth-youtu.png'),
        selfImg:require('./images/auth-self.png')
      },
      itemInfo:{}
      // serviceName
    }
  },
  methods: {
    backEvent:function(){
      this.$router.go(-1);
    },

    authEvent:function () {
      let authorizationType = this.itemInfo.link.authorizationType
      if (this.$store.state.webtype == '1') {
        appLocalstorage.set({
          key: this.moduleId+'gndhPageArr',
          value: encodeURIComponent(JSON.stringify(arr)),
          isPublic: true,
        }).then(res => {
          this.backEvent();
          setTimeout(() => {
            this.$market.enterNav(this.itemInfo);
          }, 50)
        })
      } else {
        this.$bridgefunc.setItem('auth_'+ authorizationType, '1',()=>{
          this.backEvent();
          setTimeout(() => {
            this.$market.enterNav(this.itemInfo);
          }, 50)
        })
      }
    }
  },
  created () {
    this.itemInfo = JSON.parse(decodeURIComponent(this.$route.query.args));
    // this.args = JSON.parse(decodeURIComponent(this.$route.query.args));
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .authorization-page {
    width 100%
    height 100%
    overflow hidden
    background-color $color-background-lll !important
    .tips{
      background #FFF0D1
      color #A89068
      padding 6px 10px
      font-size $font-size-medium-s
      font-weight $font-weight-m
    }
    .companys{
      margin-top 30px
      display flex
      align-items center
      justify-content center
      .com-info{
        img{
          width 60px
          height 60px
        }
        p{
          width 100%
          text-align center
          font-size $font-size-small
          color $color-text
        }
      }
      .auth-arrow{
        width 30px
        height 30px
        margin 0px 20px
      }
    }
    .auth-declare{
      margin-top 20px
      width 100%
      font-size $font-size-large
      font-weight $font-weight-x
      text-align center
      padding 10px
    }
    .auth-declare-detial{
      margin-top 6px
      width 100%
      font-size $font-size-medium
      font-weight $font-weight-x
      text-align center
      margin-bottom 30px
    }
    .auth-btn{
      margin 10px
      width calc(100% - 20px)
    }
    .bottom-tip{
      position absolute
      bottom 5px
      width 100%
      font-size $font-size-small-s
      text-align center
      color $color-text-l
    }
  }
</style>

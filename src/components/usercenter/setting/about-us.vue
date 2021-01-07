/**Created by steven on 2018/12/24.*/

<template>
  <div class="about-us">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="logo-cname mine-box-shodow">
        <img class="logo-img" :src="$store.state.globalConfig.nameLogo" alt="">
      </div>
      <div class="about-content mine-box-shodow">
        <div class="inner-content">
          <div class="public-bar padding-lr border-bottom" v-if="customerService && customerService != ''">
            <span class="left-text">客服电话</span>
            <span class="left-text"><a :href="'tel:' + customerService" class="theme_font_red_i">{{customerService}}</a> </span>
          </div>
          <div class="public-bar  padding-lr border-bottom" v-if="merchantPhone && merchantPhone != ''">
            <span class="left-text">商户合作电话</span>
            <span class="left-text "><a :href="'tel:'+merchantPhone" class="theme_font_red_i">{{merchantPhone}}</a></span>
          </div>
          <div class="public-bar padding-lr  border-bottom" v-if="merchantEmail && merchantEmail != ''">
            <span class="left-text">商户合作邮箱</span>
            <span class="left-text theme_font_red">{{merchantEmail}}</span>
          </div>
          <div class="public-bar padding-lr border-bottom" @mousedown="touchstart" @touchstart="touchstart" @mouseup="touchend" @touchend="touchend" v-if="technicalSupport && technicalSupport != ''">
            <span class="left-text">技术支持</span>
            <span class="left-text theme_font_red">{{technicalSupport}}</span>
          </div>
        </div>

      </div>
      <!--<div class="bottom-comp" v-if="$store.state.deployType == '3'">-->
        <!--<p>Copyright  ©2020</p>-->
        <!--<p>广州有路科技有限公司 版权所有</p>-->
      <!--</div>-->
    </nav-content>
  </div>
</template>

<script>

  export default {
    name: "about-us",
    components: {},
    data() {
      return {
        // 客服电话
        customerService: this.$store.state.globalConfig.customerService,
        // 商户合作电话
        merchantPhone: this.$store.state.globalConfig.merchantPhone,
        // 商户合作电话
        merchantEmail: this.$store.state.globalConfig.merchantEmail,
        // 技术支持
        technicalSupport: this.$store.state.globalConfig.technicalSupport,
        touchstartTime: null
      }
    },
    methods: {
      backEvent:function(){
        this.$router.go(-1);
      },
      touchstart: function () {
        this.touchstartTime = this.$util.getDataString()
        console.log(this.touchstartTime)
      },
      touchend: function () {
        let now = this.$util.getDataString()
        console.log(now)
        console.log(now - this.touchstartTime)
        if (now - this.touchstartTime > 3000) {
          this.$router.push({
            path: '/logs'
          })
        }
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "../css/usercenter.styl"
  .about-us {
    width 100%
    height 100%
    overflow hidden
    .logo-cname{
      margin 10px
      display flex
      justify-content center
      align-items center
      padding 20px 0px
      .logo-img{
        width 178px
        height 182px
      }
    }

    .about-content{
      margin 10px
      .inner-content{
        padding 0px 10px
      }

      .padding-lr{
        padding-left 0px
        padding-right 0px
      }

    }

    .bottom-comp {
      position absolute;
      left 10px;
      right 10px;
      bottom 20px;
      text-align center;
      p {
        line-height 20px;
        font-size 12px;
        color #999;
      }
    }
  }
</style>

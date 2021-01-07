/**Created by liaoyingchao on 2018/12/1.*/

<template>
  <div class="detail mall2">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content v-if="orderData">
      <div class="scroll-div">
        <div class="block-div">
          <div class="flex-row">
            <img class="image-con" :src="orderData.userAvtUrl != '' ? orderData.userAvtUrl : 'static/image/mall2/header.png'"/>
            <div class="full">
              <div class="title">{{getCommentUserStr(orderData)}}</div>
              <div>
                <i class="iconfont mall-xingxing icon-level theme_font_tint" :class="{theme_font_red_i: orderData.score >= lv}" v-for="lv in 5"></i>
              </div>
            </div>
            <div class="theme_font_gray">{{orderData.evaluateTime}}</div>
          </div>
          <!--<div class="flex-row">-->
            <!--<div class="theme_font_common">评分：</div>-->
            <!--<i class="iconfont mall-xingxing icon-level theme_font_tint" :class="{theme_font_red_i: orderData.score >= lv}" v-for="lv in 5"></i>-->
          <!--</div>-->
          <div class="flex-row">
            <div class="content theme_font_gray">{{orderData.evaluateContent}}</div>
          </div>
          <div class="imgs" v-if="pics.length > 0">
            <div class="s-img-div" v-for="pic in pics" @click="showBigImageEvent">
              <img :src="pic">
            </div>
          </div>
          <div class="flex-row reply" v-if="orderData.evaluateReply != ''">
            <div class="theme_font_common" style="line-height: 1.4;">商家回复：</div>
            <div class="content theme_font_common" style="line-height: 1.4;">{{orderData.evaluateReply}}</div>
          </div>
        </div>
        <div class="block-div">
          <div class="pro-div">
            <div class="pro-img">
              <img :src="orderData.skuImage">
            </div>
            <div class="pro-info">
              <div class="row">
                <div class="pro-title theme_font_common">{{orderData.skuName}}</div>
              </div>
              <div class="row ">
                <!--<i class="iconfont mall-gouwuche theme_font_red car-size" style="float: right;" @click.stop="addToCart"></i>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
    <BigImage :picUrls="pics" v-if="showBigImage" @closeEvent="closeBigImage"></BigImage>
  </div>
</template>

<script>
  import BigImage from '../common/big-image/index'

  export default {
    name: "detail",
    components: {
      BigImage
    },
    data() {
      return {
        orderData: null,
        pics: [],
        showBigImage: false
      }
    },
    methods: {
      showBigImageEvent: function () {
        this.showBigImage = true
      },
      closeBigImage: function () {
        this.showBigImage = false
      },
      getCommentUserStr: function (comment) {
        if (comment.userName != '') {
          return comment.userName;
        }
        let phone = comment.userPhone + ''
        if (phone.length == 11) {
          let a = phone.split('')
          a.splice(1, 9, '*********')
          return a.join('')
        }
        return '未知用户'
      },
      addToCart: function () {
        
      }
    },
    created() {
      this.orderData = this.$route.params.data
      if (this.orderData.evaluateImages != '') {
        let picsStr = this.orderData.evaluateImages
        this.pics = picsStr.split(',')
      }
    },
    activated () {

    },
    beforeRouteLeave (to, from, next) {
      this.$keepaliveHelper.deleteCache(this)
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .detail {
    position relative;
    width 100%
    height 100%
    overflow hidden
    .scroll-div {
      position absolute;
      left 0px;
      right 0px;
      top 0px;
      bottom 0px;
      overflow-x hidden
      overflow-y auto
      -webkit-overflow-scrolling touch
      .icon-level {
        font-size 12px;
      }
      .content {
        flex 1;
        font-size 14px;
        line-height: 1.4;
      }
      .imgs {
        overflow hidden;
        padding-bottom 12px
        font-size $font-size-medium;
        .s-img-div {
          margin-right 2%
          float left;
          position relative;
          width 32%
          height 0px;
          padding-bottom 32%;
          overflow hidden;
          img {
            position absolute;
            left 0
            top 0
            width 100%;
            height 100%;
            overflow hidden;
          }
        }
        .s-img-div:nth-child(3n) {
          margin-right 0
        }
        .s-img-div:nth-child(n+4) {
          margin-top 7px;
        }
      }
      .reply {
        align-items flex-start
      }
      .pro-div {
        padding 12px 0;
        overflow hidden;
        .pro-img {
          float left;
          width 80px;
          height 80px;
          img {
            width 100%;
            height 100%;
          }
        }
        .pro-info {
          overflow hidden;
          .row {
            padding 8px 8px 0;
            .pro-title {
              font-size 16px;
            }
            .shop-com {
              padding-top 10px;
              font-size 14px;
            }
          }
        }
      }
      .image-con {
        margin-right 8px;
        width 28px;
        height 28px;
        border-radius 16px;
      }
    }
  }
</style>

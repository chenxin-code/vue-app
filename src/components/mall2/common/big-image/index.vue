/**Created by liaoyingchao on 2018/12/7.*/

<template>
  <div class="index theme_bg_white" @click.stop="closeEvent">
    <div class="index-div">
      <span class="cindex">{{proImgIndex}}</span>
      <span>/</span>
      <span class="total">{{picUrls.length}}</span>
    </div>
    <swiper :options="swiperOption1" class="swiper-arr">
      <swiper-slide v-for="(pic, pidx) in picUrls" :key="pidx" class="swiper-arr">
        <div class="swiper-arr-div">
          <img :src="pic"/>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: ['picUrls', 'initIndex'],
    components: {},
    data() {
      let that = this;
      return {
        swiperOption1: {
          autoHeight: false, //enable auto height
          spaceBetween: 0,
          speed: 300,
          autoplay: false,
          loop: true,
          paginationShow: true,
          initialSlide: that.initIndex ? that.initIndex : 0,
          observer: true,
          observeParents: true,
          scrollbarDraggable: true,
          scrollbarSnapOnRelease: true,
          scrollbarHide: false,
          on: {
            slideChange: function () {
              that.proImgIndex = this.realIndex + 1
            },
          }
        },
        proImgIndex: 1,
      }
    },
    methods: {
      closeEvent: function () {
        this.$emit('closeEvent', '')
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .index {
    position fixed;
    top 0px;
    left 0px;
    width 100%
    height 100%
    overflow hidden
    z-index 20;
    .swiper-arr {
      width 100%;
      height 100%;
      overflow hidden;
      .swiper-arr-div {
        width 100%;
        height 100%;
        overflow-x hidden
        overflow-y auto;
        display flex;
        align-items center;
        justify-content center;
        img {
          display block;
          width 100%;
        }
      }
    }
    .index-div {
      position absolute;
      top 40px;
      left 0px;
      right 0px;
      text-align center;
      overflow hidden;
      z-index 5;
      span {
        font-weight 500px;
      }
      .total {
        font-size 14px;
      }
      .cindex {
        font-size 24px;
      }
    }
  }
</style>

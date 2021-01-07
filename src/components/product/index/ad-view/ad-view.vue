<template>
  <div class="ad-view" v-if="moduleData && hideItem.length < moduleData.rows.length">
    <swiper :options="lbtOption" ref="mySwiper">
      <template v-for="(nav, index) in moduleData.rows">
        <swiper-slide :key="index" v-if="nav.canSee">
          <img v-if="moduleData.styleTempl == '1'" class="full-ad" :src="nav.imgUrl" @click="enterNav(nav)">
          <div class="full-div" v-if="moduleData.styleTempl == '2'">
            <img :style="'width: '+moduleData.width+'%;'" :src="nav.imgUrl" @click="enterNav(nav)">
            <div class="close-tbn-3" v-if="moduleData.closeStyle == '3'" @closeEvent="closeEvent">
              <img src="static/images/design/X.png">
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </swiper-slide>
      </template>
    </swiper>
    <div class="close-time" v-if="moduleData.closeStyle == '1'">{{moduleData.showTime}}</div>
    <div class="close-tbn" v-if="moduleData.closeStyle == '2'" @closeEvent="closeEvent">
      <img src="static/images/design/X.png">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ad-view',
  components: {
	},
	props: ['usePorpData', 'propData'],
  data() {
    return {
      hideItem:[],
      lbtOption: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        allowSlideNext: true,
        allowSlidePrev: true,
        // 循环滑动
        loop: false,
        // 自动切换
        autoplay: false,
        // 让slide在边缘不能被拖动
        resistanceRatio : 0
      },
      swiperSlideStyle: '',
      myTimeout: null
    }
  },
	computed: {
    pageData: function() {
			if (this.usePorpData == true) {
				return this.propData;
			}
			return this.$store.state.pageData;
		},
    moduleData: function() {
			return this.pageData.adData;
		},
	},
  methods: {
    resetTime(str){
      return str.replace(/-/g, '/');
    },
    showSlide(nav){
      if(nav.canSeeTime == undefined) return true;
      if(nav.canSeeTime[0] == '') return true;
      let date1 = new Date(this.resetTime(nav.canSeeTime[0]));
      let date2 = new Date(this.resetTime(nav.canSeeTime[1]));
      let dateNow = new Date();
      let show = dateNow >= date1 && dateNow <= date2;
      show ? null : this.hideItem.push(nav);
      return show;
    },
    closeEvent: function () {
      this.$emit('closeEvent')
    },
    enterNav:function(nav){
      this.$market.enterNav(nav)
    }
  },
  created() {
    if (this.moduleData && this.moduleData.closeStyle == '1' && this.usePorpData == true) {
      if (this.myTimeout) {
        window.clearInterval(this.myTimeout)
        this.myTimeout = null
      }
      this.myTimeout = window.setInterval(() => {
        this.moduleData.showTime = parseInt(this.moduleData.showTime) - 1
        if (this.moduleData.showTime == 0) {
          this.$emit('closeEvent')
          window.clearInterval(this.myTimeout)
          this.myTimeout = null
        }
      }, 1000)
    }
    this.moduleData && this.moduleData.rows.forEach(row => row.canSee = this.showSlide(row))
  },
  destroyed() {
    if (this.myTimeout) {
      window.clearInterval(this.myTimeout)
      this.myTimeout = null
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .ad-view {
    position absolute;
    left 0;
    top 0;
    right 0;
    bottom 0;
    z-index 1;
    overflow hidden
    background-color rgba(0, 0, 0, 0.5)
    .close-tbn {
      position absolute;
      right 10px;
      top 20px;
      background-color rgba(255, 255, 255, 0.3)
      z-index 10;
      border-radius 20px;
      overflow hidden;
      img {
        display block;
        width 40px;
        height 40px;
      }
    }
    .close-tbn-3 {
      position relative;
      z-index 10;
      margin-top 30px;
      height 0px;
      img {
        display block;
        width 40px;
        height 40px;
        background-color rgba(255, 255, 255, 0.3)
        border-radius 20px;
      }
    }
    .close-time {
      position absolute;
      right 10px;
      top 30px;
      background-color rgba(255, 255, 255, 0.3)
      color white;
      z-index 10;
      font-size 12px;
      text-align center;
      line-height 18px;
      width 24px;
      height 18px;
      border-radius 3px;
    }
    .swiper-container {
      height 100%;
    }
    .swiper-pagination {
      width 100%;
      height 20px;
      bottom 15px;
    }
    .full-ad {
      width 100%;
      height 100%;
      display block;
    }
    .full-div {
      width 100%;
      height 100%;
      display flex;
      align-items center;
      justify-content center;
      flex-flow column;
    }
  }
</style>

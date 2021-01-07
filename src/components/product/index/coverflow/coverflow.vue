/**Created by liaoyingchao on 2019-06-18.*/

<template>
  <div class="coverflow" :style="getFloatUp()">
    <div class="f-div" v-if="!usePorpData"></div>
    <div :style="getSidesStyle()" v-if="refresh">
      <swiper :options="coverOption" ref="mySwiper">
        <swiper-slide v-for="(item, index) in moduleData.rows" :key="index">
          <img ref="swiperImg" class="swiper-img" :src="item.imgUrl" :style="swiperSlideStyle" :class="hotareaClass(item)" @click="hotEvent(item.idCode);$market.enterNav(item)">
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Bus from "../bus";
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "coverflow",
    components: {},
    props: ['myIndex', 'usePorpData', 'propData'],
    computed: {
      ...mapGetters(['clientWidth']),
      pageData: function() {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function() {
        return this.pageData.moduleList[this.myIndex].data;
      },
    },
    mixins: [hee],
    data() {
      return {
        coverOption: {
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          spaceBetween: -10,
          loop: true,
          coverflowEffect: {
            rotate: -50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows : true
          }
        },
        refresh: true,
        swiperSlideStyle: ''
      }
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(idCode){
        this.actionBtnEvent(this.pageData.pgCode, idCode)
      },
      getSidesStyle: function () {
        let styleStr = '';
        let sidesMargin = this.moduleData.sidesMargin
        if (sidesMargin > 0) {
          styleStr += 'margin-left: ' + sidesMargin + '%; margin-right: ' + sidesMargin + '%;'
        }
        let upMargin = this.moduleData.upMargin
        let downMargin = this.moduleData.downMargin
        if (upMargin > 0) {
          styleStr += 'padding-top: ' + upMargin + '%;'
        }
        if (downMargin > 0) {
          styleStr += 'padding-bottom: ' + downMargin + '%;'
        }

        return styleStr;
      },
      getFloatUp: function () {
        let styleStr = '';
        let img = this.moduleData.bgImgUrl
        if (img != '') {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }
        let color = this.moduleData.bgColor
        if (color != '') {
          styleStr += "background-color: " + color +";"
        }
        let floatUp = this.moduleData.floatUp
        if (floatUp > 0) {
          styleStr += 'margin-top: -' + floatUp + '%;'
        }
        return styleStr
      },
      resetSwiper: function () {
        let sidesMargin = this.moduleData.sidesMargin
        if (!sidesMargin || sidesMargin == undefined || sidesMargin == '') {
          sidesMargin = 0;
        }
        this.swiperSlideStyle = "height: " + (this.clientWidth * (100-sidesMargin-sidesMargin)/100) * this.moduleData.ratio / 2.0 + 'px';
        let coverType = this.moduleData.coverType
        let rotate = this.moduleData.rotate
        if (coverType == 1) {
          this.coverOption.coverflowEffect.rotate = -rotate;
        } else if (coverType == 2) {
          this.coverOption.coverflowEffect.rotate = rotate;
        }
        let spaceBetween = this.moduleData.spaceBetween
        this.coverOption.spaceBetween = spaceBetween - 40

        this.refresh = false;
        this.$nextTick(() => {
          this.refresh = true;
        })
      }
    },
    created() {
      
    },
    mounted() {
      // console.log(this.swiperSlideStyle)
      this.resetSwiper();
      Bus.$on('refreshCoverFlow', () => {
        if (this.pageData.editingIndex == this.myIndex) {
          this.resetSwiper();
        }
      });
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .coverflow {
    position relative;
    z-index 10;
    width 100%
    overflow hidden
    .f-div {
      position absolute;
      left 0px;
      right 0px;
      top 0px;
      bottom 0px;
      z-index 99;
    }
    .swiper-box {
      position relative;
      overflow hidden;
    }
    .swiper-slide {
      background-position: center;
      // background-size: cover;
      width 50%;
      /*width: 180px;*/
      //height: 180px;
      .swiper-img {
        display block;
        width 100%;
        /*width: 180px;*/
        //height: 180px;
      }
    }
  }
</style>

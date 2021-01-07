<template>
  <div class="bottom-1001">
    <swiper :options="swiperOption">
      <swiper-slide v-for="(item,idx) in listItems.rows" :key="idx">
        <!--<div ref="list1003" class="list">-->
        <!--<div class="listitem" v-for="item in itemArr">-->
        <!--<p class="gasname">{{item.gasname}}</p>-->
        <!--<div class="gasprice">-->
        <!--<span class="price">{{item.price}}<span class="unit">元/升</span></span>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->

        <div :style="getImgStyle()" class="img-div" @click="topImgEvent(item)">
          <img class="full-img" :src="item.imageUrl">
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination" v-show="paginationShow"></div>
    </swiper>
  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.css'
  import "@/common/stylus/swiper-1036.styl"
  import {swiper, swiperSlide} from 'vue-awesome-swiper'

  export default {
    name: 'home-module-1001',
    components: {
      swiper,
      swiperSlide
    },
    props: [
      'items',
    ],
    data() {
      return {
        swiperOption: {
          autoHeight: false, //enable auto height
          spaceBetween: 0,
          speed:500,
          autoplay: {
            delay: 3000,//1秒切换一次
          },
          loop:true,
          pagination: {
            el: '.swiper-pagination',
            clickable: false
          },
          paginationShow:true
          // freeMode:true
        },
      }
    },
    computed:{
      listItems: {
        get() {
          if(this.items.rows.length <= 1){
            this.swiperOption.loop = false;
            this.swiperOption.allowTouchMove = false;
            this.paginationShow = false

          }else {
            this.swiperOption.loop = true;
            this.swiperOption.allowTouchMove = true;
            this.paginationShow = true;

          }
          return this.items
        }
      },
    },
    // watch: {
    //   listItems: function (val, oldVal) {
    //     if(this.listItems.length <= 1){
    //       console.log('fdsa');
    //     }
    //   }
    // },
    methods: {
      getImgStyle: function () {
        return 'padding-bottom:' + 100.0/this.listItems.aspectRatio  + '%';
      }

    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom-1001 {
    width 100%
    overflow hidden

    .img-div {
      width 100%
      height: 0

      overflow hidden
      .full-img {
        width 100%
      }
    }
  }
</style>

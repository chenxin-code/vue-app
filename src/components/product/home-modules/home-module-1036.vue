<template>
  <div class="bottom-1036">
    <swiper :options="swiperOption">
      <swiper-slide v-for="(itemArr,idx) in listShowArr" :key="idx">
        <div class="listitem" v-for="item in itemArr" :style="getImgStyle()" @click="enterDetail(item)">
          <img class="image-style" :src="item.imageUrl" alt="">
        </div>
      </swiper-slide>
      <div class="swiper-pagination point-style" slot="pagination"></div>
    </swiper>
  </div>
</template>


<script>
  import 'swiper/dist/css/swiper.css'
  import "@/common/stylus/swiper-1036.styl"
  import {swiper, swiperSlide} from 'vue-awesome-swiper'

  export default {
    name: "home-module-1036",
    components: {
      swiper,
      swiperSlide
    },
    props: [
      'items',
    ]
    ,
    data() {
      return {
        swiperOption: {
          autoHeight: false, //enable auto height
          spaceBetween: 20,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
        },
        listShowArr: [],
      }
    },
    methods: {
      getListShowArr: function () {
        //默认列数是5
        let column = this.items.column ? this.items.column : 5;
        let tempArr = this.items.rows;
        let storeArr = [];
        for (let i = 0; i < tempArr.length; i++) {
          if (i % (column * 2) == 0) {
            if (i > 0) {
              this.listShowArr.push(storeArr);
            }
            storeArr = [];
          }
          storeArr.push(tempArr[i]);
        }
        this.listShowArr.push(storeArr);
      },
      getImgStyle: function () {
        let width = 100.0 / (this.items.column ? this.items.column : 5);
        return 'width:' + width + '%;';
      },
      enterDetail: function (item) {

      }
    },
    created() {
      this.getListShowArr();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom-1036 {
    width 100%
    margin 0
    padding 0
    overflow hidden
    background-color white

    .swiper-slide {
      bottom 0
    }

    .listitem {
      float left
      text-align center
      overflow hidden

      .image-style {
        width 100%
      }
    }
    .point-style {
      width 100%
      bottom 0
      margin 0 4px
    }
  }
</style>


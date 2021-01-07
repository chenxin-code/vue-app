/**Created by steven on 2018/3/28.*/

<template>
  <div class="bottom-1005">
    <div class="itemimg">
      <img class="full-img" :src="items.bgImageUrl">
    </div>
    <div class="content_style">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(item,idx) in item.rows" :key="idx">
          <div class="listitem">
            <p class="title_style" :style="$stylefromitem.getStyleStr(item.subtitle)"><img src="../../../assets/dot.png"
                                                                                           alt="">{{item.title.text}}
            </p>
            <p class="title_style subtitle_style" :style="$stylefromitem.getStyleStr(item.subtitle)"><img
              src="../../../assets/dot.png" alt="">{{item.subtitle.text}}</p>
          </div>
        </swiper-slide>
      </swiper>
    </div>

  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.css'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'

  export default {
    name: "home-module-1005",
    components: {
      swiper,
      swiperSlide
    },
    props: [
      'items'
    ],
    data() {
      return {
        swiperOption: {
          autoHeight: false, //enable auto height
          spaceBetween: 20,
          autoplay: true,
          direction: 'vertical',
          loop: true,
        },
        item: {
          "bgImageUrl": "http://47.92.71.36:28807/app/layout/image/1005/1005-bg.png",
          "code": "1005",
          "column": "",
          "isShowEmploy": "1",
          "isShowMore": "0",
          "objData": "",
          "rows": [{
            "title": {
              'text': '数据一标题',
              'font': "13"
            },
            "subtitle": {
              'text': '数据一小标题',
              'font': "13"
            },
          },{
            "title": {
              'text': '数据二标题',
              'font': "13"
            },
            "subtitle": {
              'text': '数据二小标题',
              'font': "13"
            },
          },{
            "title": {
              'text': '数据三标题',
              'font': "13"
            },
            "subtitle": {
              'text': '数据三小标题',
              'font': "13"
            },
          },{
            "title": {
              'text': '数据四标题',
              'font': "13"
            },
            "subtitle": {
              'text': '数据四小标题',
              'font': "13"
            },
          }],
          "showSep": "5",
          "titleImageUrl": ""
        }
      }
    },
    methods: {},
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom-1005 {
    width 100%
    overflow hidden
    background-color white
    position relative
    height 60px

    .itemimg {
      width: 100%;
      height 100%
      position absolute
    }

    .content_style {
      position absolute
      right 0
      width 80%
      height 60px

      .swiper-container {
        height 60px
      }

      .listitem {
        overflow hidden
        padding 10px 0

        .title_style {
          /*height 30px*/
          /*line-height 30px*/
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis;
          overflow hidden
          img {
            float left
            height 15px
            width 15px
            /*margin-top: 7px;*/
          }
        }
        .subtitle_style {
          margin-top 8px
        }
      }
    }
  }
</style>

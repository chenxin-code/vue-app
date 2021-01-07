<template>
  <div class="bottom-1013">
    <div class="bg-div">
      <img class="full-img" :src="bgimg"/>
    </div>
    <div class="content-div">
      <div class="block-div" v-for="(item,idx) in items.rows" @click="itemEvent(item)">
        <div class="big-div" :class="{'big-div-1': idx%5 != 0}">
          <!--<div :style="$stylefromitem.getStyleStr(item.title)" class="title-div top-margin" v-if="item.title.text != ''">{{item.title.text}}</div>-->
          <!--<div :style="$stylefromitem.getStyleStr(item.subtitle)" class="title-div" v-if="item.subtitle.text != ''">{{item.subtitle.text}}</div>-->
          <!--<div :style="$stylefromitem.getStyleStr(item.promotion)" class="title-div" v-if="item.promotion.text != ''">{{item.promotion.text}}</div>-->
          <div class="img-div">
            <img class="full-img" :src="item.imageUrl"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'home-module-1013',
    props: [
      'items',
    ],
    data() {
      return {
        bgimg: '../../../static/image/1013-bg.png',
        item: {
          "bgImageUrl": "",
          "code": "1013",
          "column": "",
          "isShowEmploy": "1",
          "isShowMore": "0",
          "objData": "",
          "rows": [
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1013/1013-1.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "1",
              "linkUrl": "http://link/"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1013/1013-2.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "1",
              "linkUrl": "http://link/"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1013/1013-3.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "1",
              "linkUrl": "http://link/"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1013/1013-4.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "1",
              "linkUrl": "http://link/"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1013/1013-5.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "1",
              "linkUrl": "http://link/"
            }
          ],
          "showSep": "",
          "titleImageUrl": ""
        }
      }
    },
    methods: {
      itemEvent: function (item) {
        // console.log('testFunc', item)
        this.$emit('itemEvent', item)
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom-1013 {
    overflow hidden
    .bg-div {
      position absolute
      width 100%
      height 0px
      padding-bottom 46%
    }
    /*background-color #fff*/
    .content-div {
      overflow hidden
      .block-div {
        float left
        width 33.33%
        /*overflow hidden*/
        .big-div {
          position: relative;
          width: 100%;
          height 0px;
          padding-bottom: 138%;
          /*.top-margin {*/
            /*padding-top 6px;*/
          //}
          .img-div {
            /*margin-top 8px;*/
            /*margin-left 10%*/
            position: absolute;
            /*bottom 0px;*/
            left 0px;
            right 0px;
            width: 100%;
            height 100%;
            /*padding-bottom: 100%;*/
          }
        }
        .big-div-1 {
          padding-bottom: 69%;
          .img-div {
            /*right 0px;*/
            width: 100%;
            height 100%;
            /*padding-bottom: 66%;*/
          }
        }
      }
    }
  }
</style>

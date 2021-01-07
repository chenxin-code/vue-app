<template>
  <div class="bottom-1002">
    <div class="background-style" v-if="items.bgImageUrl != ''">
      <img class="full-img" :src="items.bgImageUrl"/>
    </div>
    <div class="content-div">
      <div :style="getStyleWithColumn()" class="block-div" v-for="item in items.rows" @click="itemEvent(item)">
        <div class="img-div">
          <img class="item-img" :src="item.imageUrl"/>
        </div>
        <!--<div :style="$stylefromitem.getStyleStr(item.title)" class="title-div" v-if="item.title.text != ''">{{item.title.text}}</div>-->
        <!--<div :style="$stylefromitem.getStyleStr(item.subtitle)" class="title-div" v-if="item.subtitle.text != ''">{{item.subtitle.text}}</div>-->
        <!--<div :style="$stylefromitem.getStyleStr(item.promotion)" class="title-div" v-if="item.promotion.text != ''">{{item.promotion.text}}</div>-->
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'home-module-1002',
    props: [
      'items',
    ],
    data() {
      return {
        item: {
          "bgImageUrl": "",
          "code": "1002",
          "column": "",
          "isShowEmploy": "1",
          "isShowMore": "0",
          "objData": "",
          "rows": [
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1002/icon1.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": "http://link/top"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1002/icon2.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": "http://imge/rotation"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1002/icon3.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": "http://imge/rotation"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1002/icon4.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": "http://imge/rotation"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1002/icon5.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": "http://imge/rotation"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1002/icon6.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": "http://imge/rotation"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1002/icon7.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": "http://imge/rotation"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1002/icon8.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": "http://imge/rotation"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1002/icon9.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": "http://"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1002/icon10.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": "http://"
            }
          ],
          "showSep": "",
          "titleImageUrl": ""
        }
      }
    },
    methods: {
      getStyleWithColumn: function () {
//         if ( == 4) {
//           return 'width: ' + '25%;'
//         }
        let columnWidth = 100/(this.items.column);
         return 'width:'+columnWidth+'%'
      },
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
  .bottom-1002 {
    width 100%
    overflow hidden
    position relative
    background-color white

    .background-style{
      width 100%
      height 100%
      float left
      position absolute
    }

    .content-div {
      overflow hidden
      .block-div {
        float left
        width 20%
        text-align center

        .img-div {
          /*margin-top 8px;*/
          position: relative;
          /*width: 100%;*/
          /*height 0px;*/
          /*padding-bottom: 120%;*/
          overflow hidden
          .item-img {
            width 100%
            height auto
          }
        }
        .title-div {
          padding 3px;
          font-size $font-size-medium
          color $color-text
        }
      }
    }
  }
</style>

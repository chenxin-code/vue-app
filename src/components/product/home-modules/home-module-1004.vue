<template>
  <div class="bottom-1004">
    <div class="content-div">
      <div class="block-div" v-for="item in items.rows" @click="itemEvent(item)">
        <div class="img-div">
          <img class="full-img" :src="item.imageUrl"/>
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
    name: 'home-module-1004',
    props: [
      'items',
    ],
    data() {
      return {
        item: {
          "bgImageUrl": "",
          "code": "1004",
          "column": "",
          "isShowEmploy": "1",
          "isShowMore": "0",
          "objData": "",
          "rows": [
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1004/1004-1.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": "http://"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1004/1004-2.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": "http://"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1004/1004-3.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": "http://"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1004/1004-4.png",
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
      };
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
  .bottom-1004 {

    .content-div {
      overflow hidden
      // background url("../../../assets/1004-bg.png")0px 0px no-repeat;background-size 100% 100%

      .block-div {
        /*padding 10px 3%;*/
        float left
        width 50%
        text-align center

        .img-div {
          /*margin-top 8px;*/
          /*float right*/
          /*margin-left 10%*/
          position: relative;
          width: 100%;
          height 0px;
          padding-bottom: 37%;
        }

        .title-div {
          padding 3px;
          font-size $font-size-medium
          color $color-text
          overflow hidden
        }
      }
    }
  }
</style>

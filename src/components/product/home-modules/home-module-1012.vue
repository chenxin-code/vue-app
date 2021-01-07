<template>
  <div class="bottom-1012">
    <div class="content-div">
      <div :style="getStyleWithColumn()" class="block-div" v-for="item in items.rows" @click="itemEvent(item)">
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
    name: 'home-module-1012',
    props: [
      'items',
    ],
    data() {
      return {
        item: {
          "bgImageUrl": "",
          "code": "1001",
          "column": "",
          "isShowEmploy": "1",
          "isShowMore": "0",
          "objData": "",
          "rows": [
            {
              "code": "",
              "imageUrl": "http://http://47.92.71.36:8807/app/layout/image/1001.png",
              "isLogin": "0",
              "isNativeTop": "0",
              "isOpen": "",
              "isParam": "0",
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
      getStyleWithColumn: function () {
        if (this.items.column == 4) {
          return 'width: ' + '25%;'
        }
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
  .bottom-1012 {

    .content-div {
      overflow-x auto
      overflow-y hidden
      .block-div {
        /*padding 10px 0;*/
        float left
        width 25%
        text-align center

        .img-div {
          /*margin-top 8px;*/
          /*margin-left 10%*/
          position: relative;
          width: 100%;
          height 0px;
          padding-bottom: 100%;
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

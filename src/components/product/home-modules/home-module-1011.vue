<template>
  <div class="bottom-1011">
    <div class="background-style" v-if="items.bgImageUrl != ''">
      <img class="full-img" :src="items.bgImageUrl"/>
    </div>
    <div class="content-div">
      <div class="scroll-div">
        <div class="block-div" v-for="item in items.rows" @click="itemEvent(item)">
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
    name: 'home-module-1011',
    props: [
      'items',
    ],
    data() {
      return {
        item:{
          "bgImageUrl": "",
          "code": "1011",
          "column": "",
          "isShowEmploy": "1",
          "isShowMore": "0",
          "objData": "",
          "rows": [
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1011/1011-1.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": "http://"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1011/1011-2.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": "http://"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1011/1011-3.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": "http://"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1011/1011-4.png",
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
  .bottom-1011 {
    width 100%
    overflow hidden
    position relative
    background-color white

    .background-style {
      /*float left*/
      position absolute
      width 100%
      height 100%
    }

    .content-div {
      position: relative;
      width: 100%;
      height 0px;
      padding-bottom: 25%;
      /*overflow-x auto*/
      /*overflow-y hidden*/
      .scroll-div {
        position absolute
        width 100%;
        height 100%;
        overflow-x hidden
        overflow-y hidden
      }
      .block-div {
        /*padding 10px 0;*/
        float left
        width 25%
        text-align center

        .img-div {
          /*margin-top 8px;*/
          /*float right*/
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
          overflow hidden
        }
      }
    }
  }
</style>

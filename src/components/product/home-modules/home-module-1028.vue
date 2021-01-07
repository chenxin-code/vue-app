<template>
  <div class="bottom-1028">
    <div class="background-style" v-if="items.bgImageUrl != ''">
      <img class="full-img" :src="items.bgImageUrl"/>
    </div>
    <div class="content-style">
      <div class="block-div" v-for="item in items.rows" @click="itemEvent(item)">
        <img class="full-img" :src="item.imageUrl">
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'

  export default {
    name: 'home-module-1028',
    components: {
      Toast
    },
    props: [
      'items'
    ],
    data() {
      return {
        item:{
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
<style lang="stylus" type="text/stylus" scoped>
  @import "~@/common/stylus/index.styl"
  .bottom-1028 {
    width 100%
    overflow hidden
    background-color white

    .background-style {
      /*float left*/
      position absolute
      width 100%
    }

    .content-style {
      position relative
      width 100%

      .block-div:nth-child(2n) {
        width 50%
        float left
      }

      .block-div {
        width 25%
        float left
        padding-bottom 23.5%
        position relative

        .item-style {
          text-align center
          width 100%
          overflow hidden
        }
      }
    }

  }
</style>

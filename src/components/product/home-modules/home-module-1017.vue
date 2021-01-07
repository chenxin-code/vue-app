<template>
  <div class="bottom-1017">
    <div class="header-default-div" v-for="item in items.rows">
      <img class="image-style" :src="item.imageUrl"/>
    </div>
  </div>
</template>

<script>
  import { Toast} from 'mint-ui'

  export default {
    name: 'home-module-1017',
    components: {
      Toast
    },
    props: [
      'items'
    ],
    data() {
      return {
        item: {
          "bgImageUrl": "",
          "code": "1017",
          "column": "",
          "isShowEmploy": "1",
          "isShowMore": "0",
          "objData": "",
          "rows": [
            {
              "code": "",
              "imageUrl": "http://http://47.92.71.36:8807/app/layout/image/1017/1017-1.png",
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
      moreEvent: function (item) {
        this.$emit('moreEvent', item)
      },
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/index.styl"
  .bottom-1017 {
    width 100%
    background-color white
    overflow hidden
    .header-default-div {
      position relative
      width 100%
      height auto

      .image-style {
        width 100%
      }
    }
  }
</style>

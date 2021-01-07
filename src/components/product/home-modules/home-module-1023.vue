<template>
  <div class="bottom-1023">
    <div class="background-style" v-if="items.bgImageUrl != ''">
      <img class="full-img" :src="items.bgImageUrl"/>
    </div>
    <div class="content-style">
      <div class="block-div" v-for="item in items.rows" @click="itemEvent(item)">
        <div class="item-style">
          <img class="full-img" :src="item.imageUrl">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast} from 'mint-ui'

  export default {
    name: 'home-module-1023',
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
          "code": "1023",
          "column": "",
          "isShowEmploy": "1",
          "isShowMore": "0",
          "objData": "",
          "rows": [
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1023/1023-1.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": ""
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1023/1023-2.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": ""
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1023/1023-3.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": ""
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1023/1023-4.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": ""
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1023/1023-5.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": ""
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1023/1023-6.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": ""
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1023/1023-7.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": ""
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1023/1023-8.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": ""
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
  @import '~@/common/stylus/variable.styl'
  .bottom-1023 {
    width 100%
    overflow hidden
    position relative
    .background-style {
      width 100%
      height 100%
      float left
      position absolute
    }

    .content-style {
      width 100%

      .block-div {
        width (100 / 4) %
        float left

        .item-style {
          text-align center
          width 100%
          overflow hidden
          padding-bottom 73%
          position relative

          .img-pleaseWait-style {
            width 35px
            height 35px
            float right
            margin-left -40px
            display inline-block
            position relative
            z-index 10
          }
        }
      }
    }
  }
</style>

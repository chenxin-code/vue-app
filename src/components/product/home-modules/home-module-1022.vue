<template>
  <div class="bottom-1022">
    <div class="background-style" v-if="items.bgImageUrl != ''">
      <img class="full-img" :src="items.bgImageUrl"/>
    </div>
    <div class="content-style">
      <div class="block-div" v-for="item in items.rows" @click="itemEvent(item)">
        <div class="item-style">
          <!--<div class="img-div">-->
          <!--<img class="img-style" :src="item.imageurl"/>-->
          <!--</div>-->
          <img class="full-img" :src="item.imageUrl"/>

          <!--<div class="title-style">-->
          <!--<p class="title1-style font-medium-x" >{{item.title}}</p>-->
          <!--<p class="title2-style font-small-l">{{item.subtitle}}</p>-->
          <!--</div>-->
          <!--<img v-if="!item.isopen" class="img-pleaseWait-style" src="../../../assets/iv_pleasewait.png"/>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'

  export default {
    name: 'home-module-1022',
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
          "code": "1022",
          "column": "",
          "isShowEmploy": "1",
          "isShowMore": "0",
          "objData": "",
          "rows": [
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1022/1022-1.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": ""
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1022/1022-2.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": ""
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1022/1022-3.png",
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
        },
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
  .bottom-1022 {
    width 100%
    overflow hidden
    position relative

    .background-style {
      /*float left*/
      position absolute
      width 100%
      height 100%
    }

    .content-style {
      position relative
      width 100%

      .block-div {
        float left
        width (100 / 3) %

        .item-style {
          text-align center
          width 100%
          overflow hidden
          padding-bottom 67%
          position relative
        }

        .img-pleaseWait-style {
          width 35px
          height 35px
          position relative
          z-index 10
          float right
          margin-left -40px
          display inline-block
        }
      }
    }
  }
</style>

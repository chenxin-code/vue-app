<template>
  <div class="bottom-header" :style="showSep()">
    <div class="header-default-div" v-if="items.titleImageUrl != ''">
      <img class="full-img" :src="items.titleImageUrl"/>
      <!--<img @click="moreEvent(item)" class="more-img" src="../../../../static/image/more.png" v-if="item.isShowMore == 1"/>-->
    </div>
  </div>
</template>

<script>
  import { Toast} from 'mint-ui'

  export default {
    name: 'home-module-header',
    components: {
      Toast
    },
    props: [
      'items',
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
      showSep:function () {
        return 'margin-top:'+this.items.showSep+'px';
      },
      moreEvent: function (item) {
        this.$emit('moreEvent', item)
      },
      getHeaderDivStyle: function (item) {
        let str = 'background-color: ' + item.bgcolor + ';'
        if (item.moreurl != '<null>' && item.moreurl.aspectratio != '') {
          str += 'padding-bottom: ' + item.moreurl.aspectratio * 100 + '%;'
        }
        return str
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus" >
  @import "~@/common/stylus/index.styl"

  .header-default-div {
    position relative
    width 100%
    height 0px
    padding-bottom 11%
    .center-text {
      position absolute
      top 50%
      margin-top -11px
      width 100%
      text-align center

    }
    .more-img {
      position absolute
      top 50%
      right 10px
      margin-top -15px
      width 30px
      height 30px
    }
  }
</style>

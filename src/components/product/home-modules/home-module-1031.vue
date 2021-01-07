<template>
  <div class="home-module-1031">
    <div class="background-style" v-if="items.bgImageUrl != ''">
      <img class="full-img" :src="items.bgImageUrl"/>
    </div>
    <div class="item-content">
      <div class="content-left">
        <div class="banner-img">
          <img class="full-img" :src="items.rows[0].imageUrl"/>
        </div>
      </div>
      <ul class="content-right">
        <li class="right-item">
          <div class="banner-img">
            <img class="full-img" :src="items.rows[1].imageUrl"/>
          </div>
        </li>
        <li class="right-item">
          <div class="banner-img">
            <img class="full-img" :src="items.rows[2].imageUrl"/>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { Toast} from "mint-ui";

  export default {
    name: "home-module-1031",
    components: {
      Toast
    },
    props: ["items"],
    data() {
      return {
        item: {
          "code": "1031",
          "titleImageUrl": "http://47.92.71.36:28807/app/layout/image/1031/1031-title.png",
          "isShowMore": "0",
          "bgImageUrl": "http://47.92.71.36:28807/app/layout/image/1031/1031-bg.png",
          "showSep": "5",
          "column": "",
          "isShowEmploy": "1",
          "objData": "",
          "rows": [{
            "code": "",
            "isShowEmploy": "1",
            "imageUrl": "http://47.92.71.36:28807/app/layout/image/1031/1031-1.png",
            "linkUrl": "http://link/",
            "isNativeTop": "1",
            "isLogin": "1",
            "isParam": "1",
            "isOpen": ""
          }, {
            "code": "",
            "isShowEmploy": "1",
            "imageUrl": "http://47.92.71.36:28807/app/layout/image/1031/1031-2.png",
            "linkUrl": "http://link/",
            "isNativeTop": "1",
            "isLogin": "1",
            "isParam": "1",
            "isOpen": ""
          }, {
            "code": "",
            "isShowEmploy": "1",
            "imageUrl": "http://47.92.71.36:28807/app/layout/image/1031/1031-3.png",
            "linkUrl": "http://link/",
            "isNativeTop": "1",
            "isLogin": "1",
            "isParam": "1",
            "isOpen": ""
          }]
        }
      }
    },
    methods: {
      itemEvent: function (item) {
        this.$emit("itemEvent", item);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"

  .home-module-1031 {
    position: relative;
    overflow: hidden;

    .background-style {
      width 100%
      position absolute
      height 100%
    }

    /*padding:10px 3%;*/
    .item-content {
      overflow: hidden;
      width: 100%;
      .content-left {
        float: left;
        position relative
        width: 50%;
        .banner-img {
          position: relative;
          width: 100%;
          height 0px;
          padding-bottom: 92.6%;
          overflow: hidden;
        }
      }
      .content-right {
        float: right;
        width: 50%;
        .right-item {
          height: 100%;
          .banner-img {
            position: relative;
            width: 100%;
            height 0px;
            padding-bottom 46.3%;

          }
        }
      }
    }
  }
</style>

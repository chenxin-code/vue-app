<template>
	<div class="home-module-1029">
		<div class="item-content">
      <ul class="item-list">
        <li class="item" v-for="item in items.rows" >
          <div class="banner-img">
            <img :src='item.imageUrl' class="item-img"/>
          </div>
        </li>
      </ul>
		</div>
	</div>
</template>

<script>
import {Toast } from "mint-ui";
export default {
  name: "home-module-1029",
  components: {
    Toast
  },
  props: [
    "items"
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
    };
  },
  methods: {
    itemEvent: function(item) {
      this.$emit("itemEvent", item);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped  type="text/stylus"  >
@import "~@/common/stylus/variable.styl"

.home-module-1029 {
	position: relative;
	overflow: hidden;
  .item-content{
    /*overflow-x:scroll;*/
    /*background:#fff;*/

    .item-list{
      white-space:nowrap;
      overflow-x:scroll;
      overflow-y:auto;
      /*border-bottom:1px solid #d2d2d2;*/
      /*padding:10px 10px 0px 10px;*/

      .item{
        vertical-align:top
        display:inline-block;
        width:40%;
        /*border-right:1px solid #d2d2d2;*/
        /*padding-bottom:10px;*/

        .banner-img{
         width:100%;
          .item-img{
            display:block;
            width:100%;
            height:100%;

          }
        }
      }
    }


  }
}
</style>

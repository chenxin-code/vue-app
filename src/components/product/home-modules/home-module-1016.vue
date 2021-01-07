<template>
  <div class=bottom-1016>
    <div class="background-style" v-if="items.bgImageUrl != ''">
      <img class="full-img" :src="items.bgImageUrl"/>
    </div>
    <div class="content-div">
      <div class=block-div-1016 v-for="(item,index) in items.rows" v-if="index%3==0" @click=itemEvent(item)>
        <div class=div-long-1016 v-if="index%3==0">
          <div class=div-in-long-1016>
            <img class=full-img :src=item.imageUrl>
          </div>
        </div>
        <div class=layout-div-1016>
          <div class=img-div-small-1016 v-if="(index+1)%3==1&&(index+1)<items.rows.length">
            <img class=full-img :src=items.rows[index+1].imageUrl>
          </div>
          <div class=img-div-small-1016 v-if="(index+2)%3==2&&(index+2)<items.rows.length">
            <img class=full-img :src=items.rows[index+2].imageUrl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast} from 'mint-ui'

  export default {
    name: 'home-module-1016',
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
          "code": "1016",
          "column": "",
          "isShowEmploy": "1",
          "isShowMore": "0",
          "objData": "",
          "rows": [
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1016/1016-1.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "1",
              "linkUrl": "http://link/"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1016/1016-2.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "1",
              "linkUrl": "http://link/"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1016/1016-3.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "1",
              "linkUrl": "http://link/"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1016/1016-4.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "1",
              "linkUrl": "http://link/"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1016/1016-5.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "1",
              "linkUrl": "http://link/"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1016/1016-6.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "1",
              "linkUrl": "http://link/"
            }
          ],
          "showSep": "",
          "titleImageUrl": ""
        },
      };
    },
    methods: {
      itemEvent: function (item) {
        // console.log('testFunc', item)
        this.$emit('itemEvent', item)
      }
    },
  }
</script>

<!-- Add scoped attribute to limit CSS to this component only -->
<style lang=stylus scoped type="text/stylus">
  .bottom-1016 {
    width 100%
    overflow hidden
    .background-style {
      width 100%
      float left
      position relative
      height: 0;
      padding-bottom: 50%;
    }
    .content-div {
      position absolute
      width 100%
      /*height: 100%;*/
    }

    .block-div-1016 {
      width 50%
      float left
      .layout-div-1016 {
        float left
        width: 50%;
        position: relative;
        height: 0;
        padding-bottom: 100%;
        .img-div-small-1016 {
          width: 100%;
          position: relative;
          height: 0;
          padding-bottom: 100%;
        }
      }
      .div-long-1016 {
        float left
        width: 50%;
        position relative
        height 0
        padding-bottom 100%
        .div-in-long-1016 {
          width: 100%;
          position relative
          height 0
          padding-bottom 200%
        }
      }
    }
  }
</style>

<template>
  <div class="bottom-1025">
    <div class="background-cons" v-if="items.bgImageUrl != ''">
      <img class="full-img" :src="items.bgImageUrl"/>
    </div>
    <div class="content-style">
      <div class="item-cons" v-for="item in items.rows" @click="itemEvent(item)">
        <img class="full-img" :src="item.imageUrl"/>
        <!--<div class="left-cons">-->
        <!--<div class="texts-cons font-medium">{{item.title}}</div>-->
        <!--<div class="texts-cons font-small-l" v-if="item.subtitle">{{item.subtitle}}</div>-->
        <!--<button class="texts-cons promotion-cons font-small-l" v-if="item.promotion">{{item.promotion}}</button>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast} from 'mint-ui'

  export default {
    name: 'home-module-1025',
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
          "code": "1025",
          "column": "",
          "isShowEmploy": "1",
          "isShowMore": "0",
          "objData": "",
          "rows": [
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1025/1025-1.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": ""
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1025/1025-2.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": ""
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1025/1025-3.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "",
              "linkUrl": ""
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1025/1025-4.png",
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
      testFunc: function () {
        console.log('testFunc')
      },
      getStyleWithColumn: function () {
//              if (this.column == 2) {
//                return 'width: ' + '48.5%;'
//              }else if(this.column == 3){
//                return 'width: ' + '32%;'
//              }else if(this.column == 4){
//                return 'width: ' + '23.75%;'
//              } else if(this.column == 5){
//                return 'width: ' + '18.8%;'
//              }
      },
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .bottom-1025 {
    width: 100%;
    margin-left: 0%;
    margin-right: 0%;
    overflow: hidden;
    position relative

    .background-cons {
      width: 100%;
      height: 100%;
      position absolute
    }

    .content-style {
      width 100%

      .item-cons{
        width 50%
        float left
        position relative
        padding-bottom 23.6%
      }
      /*.item-cons {
        position relative;
        width: (97.0 / 2.0) %;
        float: left;
        margin-left: 1%;
        margin-right: 0%;
        margin-bottom: 2%;
        .img-cons {
          float: left;
          text-align: center;
          overflow: hidden;
          width: 100%;
          height: auto;
          display: flex;
          !*height:30%;*!
          background: $color-background-ll
        }
        .left-cons {

          margin-right: 8px;
          margin-left: 30% + 8px;
          margin-bottom: 5%;
          margin-top: 5%;

          .texts-cons {

            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;

          }

          .promotion-cons {
            background: rgba(255, 32, 33, 0.81);
            border: 0px;
            text-align: left;
          }
        }
      }
      .item-cons:nth-child(2n) {
        margin-right: 0px;
      }*/
    }
  }

</style>

<template>
    <div class="bottom-1024">
      <div class="background-cons" v-if="items.bgImageUrl != ''">
        <img class="full-img" :src="items.bgImageUrl"/>
      </div>
        <div :style="getStyleWithColumn()" class="item-cons" v-for="item in items.rows" @click="itemEvent(item)">
          <!--<img v-if="!item.isopen" class="img-isopen" src="../../../assets/iv_pleasewait.png"/>-->
          <div >
            <!--<div class="texts-cons font-medium">{{item.title}}</div>-->
            <!--<div class="texts-cons font-small-l" v-if="item.subtitle">{{item.subtitle}}</div>-->
            <img class="img-cons" :src="item.imageUrl"/>
          </div>

        </div>
    </div>
</template>

<script>
    import { Toast } from 'mint-ui'

    export default {
        name: 'home-module-1024',
        components: {
            Toast
        },
        props: [
          'items',
        ],
        data () {
          return {
            item: {
              "bgImageUrl": "",
              "code": "1024",
              "column": "",
              "isShowEmploy": "1",
              "isShowMore": "0",
              "objData": "",
              "rows": [
                {
                  "code": "",
                  "imageUrl": "http://47.92.71.36:8807/app/layout/image/1024/1024-1.png",
                  "isLogin": "1",
                  "isNativeTop": "1",
                  "isOpen": "",
                  "isParam": "1",
                  "isShowEmploy": "1",
                  "linkUrl": "http://link/"
                },
                {
                  "code": "",
                  "imageUrl": "http://47.92.71.36:8807/app/layout/image/1024/1024-2.png",
                  "isLogin": "1",
                  "isNativeTop": "1",
                  "isOpen": "",
                  "isParam": "1",
                  "isShowEmploy": "1",
                  "linkUrl": "http://link/"
                },
                {
                  "code": "",
                  "imageUrl": "http://47.92.71.36:8807/app/layout/image/1024/1024-3.png",
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
            }
          }
        },
        methods: {
          testFunc: function () {
                console.log('testFunc')
            },

          itemEvent: function (item) {
            // console.log('testFunc', item)
            this.$emit('itemEvent', item)
          },
          getStyleWithColumn: function () {
//            if (this.column == 2) {
//              return 'width: ' + '48.5%;'
//            }else if(this.column == 3){
//              return 'width: ' + '32%;'
//            }else if(this.column == 4){
//              return 'width: ' + '23.75%;'
//            } else if(this.column == 5){
//              return 'width: ' + '18.8%;'
//            }

          },
        },
        created () {
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
    /*@import "~@/common/stylus/variable.styl"*/

    .bottom-1024 {
      margin-left: 0%;
      margin-right: 0%;
      width: 100%;
      overflow: hidden;
      position relative
      .background-cons{
        width: 100%;
        position absolute
        height 100%
      }

    .item-cons {
      position relative;
      /*overflow: hidden;*/
      width: (96.0/3.0)%;
      /*background: rgba(255, 255, 255, 0.81);*/
      float: left;
      /*margin-bottom: 2%;*/
      margin-left: 1%;
      margin-right: 0%;
      .texts-cons{
        text-align: left;
        overflow:hidden;
        text-overflow: ellipsis;
      }
      .img-cons{

        text-align: center;
        overflow: hidden;
        width: 100%;
        height: auto;
        margin-left: 0%;
        display: flex;
        margin-bottom: 0%;
        margin-top: 0%;
      }
      .img-isopen{
        float: right;
        width: 20px;
        height: 20px;
        margin-top: 0%;
        margin-left:-20px;
      }
    .promotion-cons{
      background: rgba(255, 32, 33, 0.81);
      border:0px;
    }

    }


    }
</style>

<template>
    <div class="bottom-1026">
     <div class="item-cons" v-for="item in items.rows" @click="itemEvent(item)">
       <img  class="img-cons" :src="item.imageUrl"  />
     </div>
    </div>
</template>

<script>
    import {Toast } from 'mint-ui'

    export default {
        name: 'home-module-1025',
        components: {
            Toast
        },
        props: [
          'items'
        ],
        data () {
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
            testFunc: function () {
                console.log('testFunc')
            },
            itemEvent: function (item) {
              this.$emit('itemEvent', item)
            },
        },
        created () {
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">

    .bottom-1026 {
      width: 100%;
      padding: 0px 0,0,0%;
      overflow: hidden;
      .item-cons {
        width: 100%;
        height: auto;
        /*background: rgba(255, 255, 255, 0.81);*/
        float: left;
        /*margin-bottom: 1%;*/
        .img-cons {
          width: 100%;
          height: auto;
          margin-top: 0%;
        }
      }
    }
</style>

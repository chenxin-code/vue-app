<template>
  <div class="bottom-1014">
    <div class="bg-div" v-if="items.bgImageUrl != ''">
      <img class="full-img" :src="items.bgImageUrl"/>
    </div>
    <div class="content-div">
      <div class="block-div" v-for="(item,idx) in items.rows" v-if="idx%5 == 0">
        <div class="row-div">
          <div class="left-div">
            <!--<div :style="$stylefromitem.getStyleStr(items.rows[0+idx].title)" class="title-div top-margin" v-if="items.rows[0+idx].title.text != ''">{{listDatas[0+idx].title.text}}</div>-->
            <!--<div :style="$stylefromitem.getStyleStr(items.rows[0+idx].subtitle)" class="title-div" v-if="items.rows[0+idx].subtitle.text != ''">{{listDatas[0+idx].subtitle.text}}</div>-->
            <!--<div :style="$stylefromitem.getStyleStr(items.rows[0+idx].promotion)" class="title-div" v-if="items.rows[0+idx].promotion.text != ''">{{listDatas[0+idx].promotion.text}}</div>-->
            <div class="img-div">
              <img class="full-img" :src="items.rows[0+idx].imageUrl"/>
            </div>
          </div>
          <div class="right-top-div" v-if="idx+2 < items.rows.length">
            <!--<div :style="$stylefromitem.getStyleStr(items.rows[1+idx].title)" class="title-div top-margin" v-if="items.rows[1+idx].title.text != ''">{{listDatas[1+idx].title.text}}</div>-->
            <!--<div :style="$stylefromitem.getStyleStr(items.rows[1+idx].subtitle)" class="title-div" v-if="items.rows[1+idx].subtitle.text != ''">{{listDatas[1+idx].subtitle.text}}</div>-->
            <!--<div :style="$stylefromitem.getStyleStr(items.rows[1+idx].promotion)" class="title-div" v-if="items.rows[1+idx].promotion.text != ''">{{listDatas[1+idx].promotion.text}}</div>-->
            <div class="img-div">
              <img class="full-img" :src="items.rows[1+idx].imageUrl"/>
            </div>
          </div>
          <div class="right-bottom-div" v-for="num in 3">
            <div v-if="idx+1+num < items.rows.length">
              <!--<div :style="$stylefromitem.getStyleStr(items.rows[1+num].title)" class="title-div top-margin" v-if="items.rows[1+num].title.text != ''">{{listDatas[1+num].title.text}}</div>-->
              <!--<div :style="$stylefromitem.getStyleStr(items.rows[1+num].subtitle)" class="title-div" v-if="items.rows[1+num].subtitle.text != ''">{{listDatas[1+num].subtitle.text}}</div>-->
              <!--<div :style="$stylefromitem.getStyleStr(items.rows[1+num].promotion)" class="title-div" v-if="items.rows[1+num].promotion.text != ''">{{listDatas[1+num].promotion.text}}</div>-->
              <div class="img-div">
                <img class="full-img" :src="items.rows[1+num].imageUrl"/>
              </div>
            </div>
            <span class="right-line" v-if="num != 3"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'home-module-1014',
    props: [
      'items',
      'column'
    ],
    data() {
      return {
        item: {
          "bgImageUrl": "",
          "code": "1014",
          "column": "",
          "isShowEmploy": "1",
          "isShowMore": "0",
          "objData": "",
          "rows": [
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1014/1014-1.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "1",
              "linkUrl": "http://link/"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1014/1014-2.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "1",
              "linkUrl": "http://link/"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1014/1014-3.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "1",
              "linkUrl": "http://link/"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1014/1014-4.png",
              "isLogin": "1",
              "isNativeTop": "1",
              "isOpen": "",
              "isParam": "1",
              "isShowEmploy": "1",
              "linkUrl": "http://link/"
            },
            {
              "code": "",
              "imageUrl": "http://47.92.71.36:8807/app/layout/image/1014/1014-5.png",
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
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom-1014 {
    overflow hidden
    position relative
    width 100%

    .bg-div {
      position absolute
      width 100%
      float left
      height 100%
    }
    /*background-color #fff*/
    .content-div {
      width 100%

      .block-div {
        width 100%
        overflow hidden

        .row-div {
          width 100%
          overflow hidden

          .left-div {
            float left
            overflow hidden
            position relative
            width 33.3%
            height 0px
            padding-bottom 44.44%

            .img-div {
              position: absolute;
              width: 100%;
              height 100%;
              /*padding-bottom: 100%;*/
            }
          }
          .right-top-div {
            float left
            position relative
            width 66.6%
            height 0px
            padding-bottom 22.22%
            overflow hidden

            .img-div {
              position: absolute;
              bottom 0px;
              right 0px;
              width: 100%;
              height 100%;
            }
          }
          .right-bottom-div {
            float left
            position relative
            width 22.2%
            height 0px
            padding-bottom 22.22%
            overflow hidden

            .right-line {
              position: absolute;
              right 0px
              top 0px
              width 0
              height 100%
            }

            .img-div {
              position: absolute;
              bottom 0px;
              width: 100%;
              height 100%;
            }

          }
          .title-div {
            padding 3px;
            font-size $font-size-medium
            color $color-text
          }
        }
      }
    }
  }
</style>

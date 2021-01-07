/**Created by steven on 2018/3/26.*/

<template>
  <div class="bottom-1037">
    <div  class="rowitem" v-for="rowitem in listData.rows">
      <div class="itemimg">
        <img :src="rowitem.backimage">
      </div>
      <div class="p-msg">
        <div class="ouname">
          {{rowitem.ouname}}
        </div>
        <div class="address">
          <img class="location" src="../../../assets/refuel/location.png" alt="">
          <img class="more" src="../../../assets/more.png" alt="">
          <div class="address-lb">{{rowitem.address}}</div>

        </div>
        <div class="distance">
          {{rowitem.distance/1000}}公里
        </div>
        <div class="servicelist">
          <div class="services" v-for="serviceitem in rowitem.servicelist">{{serviceitem.servicename}}</div>
        </div>
        <div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "home-module-1037",
    data() {
      return {
        listData:{
          rows:[
            {
              address : "大家好才是整的好大家好才是整的好大家好才是整的好大家好才是整的好大家好才是整的好大家好才是整的好",
              backimage : "http://www.bazhongol.com/ueditor/php/upload/image/20160830/1472546382813903.png",
              contacts : "我的天啊",
              content : "大家好才是整的好大家好才是整的好大家好才是整的好大家好才是整的好大家好才是整的好大家好才是整的好",
              distance : "1116.35",
              lat : "31.3848896",
              lng : "118.41638947",
              oucode : "",
              ouname : "花园店",
              phone : "0553-2817697",
              servicelist :[{
                serviceitem : 1,
                servicename : "洗车",
              },
              {
                serviceitem : 2,
                servicename : "卫生间",
              }],
              servorname : "有你想要的",
              status : 1,
              storeid : 31,
              storename : "不知所措",
              storeno : 32902841,
              tntCode : "",},
              ],
          total : 3,
        }
      }
    },
    methods: {
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom-1037 {
    width 100%
    overflow hidden
    background-color white
    .rowitem{
      width 97%
      overflow hidden
      margin-left  3%
      padding 6px 10px 6px 0
      border-bottom 1px solid $color-line-gray-l
      .itemimg{
        float left
        width   25+'%'
        height: 0
        padding-bottom (25.0/0.875)+'%'
        overflow hidden
        img{
          width: 100%;
        }
      }
      .p-msg{
        float left
        width  70%
        overflow hidden
        padding-left  8px
        height 100%
        .ouname{
          font-size 15px
          color $color-text
          line-height 23px
          font-weight bold
        }
        .address{
          overflow hidden
          height  $font-size-medium-s+6px
          line-height  $font-size-medium-s+6px
          .location{
            float left
            width 13px
            height 13px
            margin-top 2px
            /*margin-top 3px*/
          }
          .address-lb{
            color $color-text-l
            font-size $font-size-medium-s
            overflow: hidden;/*超出部分隐藏*/
            white-space: nowrap;/*不换行*/
            text-overflow:ellipsis;
            margin-right $font-size-medium-s+6px
          }
          .more{
            float right
            width  $font-size-medium-s+6px
            height  $font-size-medium-s+6px
          }
        }
        .distance{
          font-size $font-size-medium-s
          color $color-text-l
          line-height 19px
        }
        .servicelist{
          height 20px
          .services{
            float left
            color $color-text-l
            font-size $font-size-small
            border 1px solid  $color-text-l
            border-radius 2px
            padding 2px 2px
            margin-right 5px

          }
        }

      }
    }
  }
</style>


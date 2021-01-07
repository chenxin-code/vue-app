/**Created by steven on 2018/3/28.*/

<template>
  <div class="bottom-1003">
    <div class="itemimg">
      <img :src="this.mainImgUrl">
    </div>
    <swiper  :options="swiperOption" >
      <swiper-slide  v-for="(itemArr,idx) in listShowDatas"  :key="idx">
        <div ref="list1003" class="list">
          <div class="listitem" v-for="item in itemArr">
            <p class="gasname">{{item.gasname}}</p>
            <div class="gasprice">
              <span class="price">{{item.price}}<span class="unit">元/升</span></span>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>

  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.css'
  import "@/common/stylus/swiper-1036.styl"
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: "home-module-1003",
  props: {
    // calTime:Number,
    // mainImgUrl:String,
  },
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      swiperOption: {
        autoHeight: false, //enable auto height
        spaceBetween: 0,
        speed:3000,
        autoplay: {
          delay: 0,//1秒切换一次
        },
        loop:true,
        // freeMode:true
      },
      mainImgUrl:'http://www.bazhongol.com/ueditor/php/upload/image/20160830/1472546382813903.png',
      listShowDatas:[
        [{
          gascode : "",
          gasname : "92#汽油",
          oucode : "",
          price : "6.42",
          typename : "汽油",
          unit : "元/升",
        },{
          gascode : "",
          gasname : "92#汽油",
          oucode : "",
          price : "6.42",
          typename : "汽油",
          unit : "元/升",
        },{
          gascode : "",
          gasname : "92#汽油",
          oucode : "",
          price : "6.42",
          typename : "汽油",
          unit : "元/升",
        }],
        [ {
          gascode : "",
          gasname : "95#汽油（V）",
          oucode : "",
          price : "6.89",
          typename : "汽油",
          unit : "元/升",
        },
          {
            gascode : "",
            gasname : "98#汽油（V）",
            oucode : "",
            price : "7.70",
            typename : "汽油",
            unit : "元/升",
          },
          {
            gascode : "",
            gasname : "0#车柴（V）",
            oucode : "",
            price : "6.08",
            typename : "柴油",
            unit : "元/升",
          },],

      ],

    }
  },
  methods: {
    test: function () {
      console.log('test')
    }
  },
  watch:{
    // calTime(curVal,oldVal){
    //   console.log('新值:'+curVal+'旧值:'+oldVal)
    //   console.log(this.$refs.list1003.offsetLeft)
    // },
  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
.bottom-1003 {
  width 100%
  overflow hidden
  background-color white
  box-sizing: border-box
  padding  10px 0px 10px 3%

  .itemimg{
    float left
    width  60px
    height: 60px
    overflow hidden
    margin-right 10px
    img{
      width: 100%;
    }
  }
  .list{

    height 60px
    overflow-y hidden
    overflow-x auto
    white-space: nowrap;
    /*display -webkit-box*/
    .listitem{
      float left
      box-sizing border-box
      height 60px
      width calc(33.33% - 15px)
      margin-right 15px
      border-radius 4px
      text-align center
      overflow hidden
      .gasname{
        height 20px
        line-height 20px
        color white
        font-size $font-size-small
        background-color #8D9FA9
        overflow hidden

      }
      .gasprice{
        height 40px
        line-height 40px
        background-color #EFEFEF
        text-align center
        .price{
          font-size 15px
          font-weight bold
          color red
        }
        .unit{
          font-size $font-size-small
          color $color-text
        }

      }
    }
  }
}

</style>

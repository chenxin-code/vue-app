/**Created by steven on 2019/10/16.*/

<template>
  <div class="slider-verify" v-if="verifyData.backgroundImage">
    <div class="content">

      <p class="topt">请完成下方验证</p>
      <img class="closeimg" src="./img/close.png" alt="" @click="cancelEvent">

      <div class="img-content" >
        <div class="content-re" ref="contents" >
          <img class="bg-img" ref="bgimg" :src="verifyData.backgroundImage" alt="" v-if="verifyData">
          <img class="front-img" ref="frontimg"  :style="frontStyle" :src="verifyData.frontImage" alt="" v-if="verifyData">
          <img class="refresh-img" src="./img/shuaxin.png" @click.stop="getImgDatas" alt="">
        </div>
      </div>
      <div class="slide-div">
        <div class="slide-div-re">
          <img class="slide-bgimg" src="./img/slideBg.png" alt="">
          <img ref="slideBtn" class="slide-btnimg" src="./img/slideBtn.png" alt="" @touchstart='_touchstart'
               @touchmove="_touchmove"  @touchend="_touchend" @touchcancel="_touchend">
        </div>
      </div>

      <!--<div class="loading-gif" v-show="isLoading">-->
        <!--<img src="./img/Disqus.gif" alt="">-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  //  固定返回的图片是  482*242  80*80
  var bgImgWidth=482,bgImageHeight=242,frontImgWidth=80,frontImgHeight=80;

export default {
  name: "slider-verify",
  props: ['verifyData'],

  components: {

  },
  data () {
    return {
      ImgParas: {},
      frontStyle: {top: '0px',left:'0px'},
      startX:0,
      isCanDrag:true,
      pathList:[],
      // isLoading:false,
    }
  },
  methods: {
    cancelEvent: function () {
      this.$emit('cancelEvent')
    },

    //获取图像校验码
    getImgDatas: function () {
      this.$emit('getVertifyDatas');
    },
    resetData:function(){
      this.isCanDrag = true;
      this.$nextTick(() => {
        this.dealImgs();
      })
    },

    dealImgs: function () {
      let contentWidth = this.$refs.contents.clientWidth;
      this.frontStyle.width = frontImgWidth * contentWidth / bgImgWidth + 'px';
      this.frontStyle.height = frontImgHeight * contentWidth / bgImgWidth + 'px';
      this.frontStyle.top = bgImageHeight * this.verifyData.heightRatio * contentWidth / bgImgWidth + 'px';

    },

    _touchstart:function (e) {
      if(!this.isCanDrag || !this.verifyData){
        return;
      }
      let slideBtnEl = this.$refs.slideBtn;
      //1.鼠标按下之前必须清除掉后面设置的过渡属性
      slideBtnEl.style.transition = "";
      let touches = e.touches[0];
      // 获取拖拽按钮的默认坐标
      this.startX = touches.clientX;
      this.pathList.push({
        xd:0,
        yd:this.verifyData.heightRatio,
        time:this.$util.getPayTime(),
      })
    },
    _touchmove:function (e) {
      e.preventDefault();
      if(!this.isCanDrag){
        return;
      }
      let touches = e.touches[0];
      let pageX = touches.clientX
      let slideBtnEl = this.$refs.slideBtn;

      let left = 0;
      if(pageX - this.startX < 0 ){
        left = 0;
      }else if(pageX - this.startX > this.$refs.bgimg.clientWidth - this.$refs.frontimg.clientWidth){
        left = this.$refs.bgimg.clientWidth - this.$refs.frontimg.clientWidth;
      }else {
        left = pageX - this.startX;
      }
      this.pathList.push({
        xd:left/this.$refs.bgimg.clientWidth,
        yd:this.verifyData.heightRatio,
        time:this.$util.getPayTime(),
      })
      slideBtnEl.style.left = left +'px';
      this.frontStyle.left = left +'px';

    },
    _touchend:function (e) {
      console.log('_touchend')
      e.preventDefault();
      //只允许一次
      this.isCanDrag = false;
      let code = JSON.stringify({pathList:this.pathList});
      this.$emit('submitCode',code);
    },

  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .slider-verify {
    /*width: 100%;
    height: 100%;*/
    /*position: absolute;
    top: 0px;
    left: 0px;
    z-index: 99
    display flex
    align-items center
    justify-content center*/

    /*.loading-gif{
      position absolute
      top 0px
      width 100%
      height 100%
      background-color white
      display flex
      align-items center
      justify-content center
    }*/
    .content {
      background-color white
      border-radius 10px
      /*margin 0px 50px*/
      width 300px;
      overflow hidden
      position relative
      .topt {
        font-size $font-size-medium
        font-weight $font-size-medium-x
        width 100%
        padding 16px 0px 20px 0px
        text-align center
      }
      .closeimg {
        width 50px
        height 50px
        position absolute
        right 0
        top 0
      }
      .img-content {
        padding 0px 10px
        width 100%
        overflow hidden
        .content-re {
          position relative
          width 100%
          height 0px
          padding-bottom (242/4.82)+'%'
        }
        .bg-img {
          width 100%
        }
        .front-img {
          position absolute
        }
        .refresh-img{
          position absolute
          right 5px
          top 5px
          padding 3px
          width 30px
          height 30px
        }
      }

      .slide-div {
        padding 0px 10px
        width 100%
        margin-top 20px
        margin-bottom 20px
        overflow hidden
        .slide-div-re {
          width 100%
          height 55px
          position relative
          display flex
          align-items center
          .slide-bgimg {
            width 100%
          }
          .slide-btnimg {
            position absolute
            left 0px
            top 0px
            width 55px
            height 55px
          }
        }
      }
    }
  }
</style>

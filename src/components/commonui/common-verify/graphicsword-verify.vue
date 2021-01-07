/**Created by steven on 2019/10/12.*/

<template>
  <div class="graphicsword-verify" v-if="verifyData.backgroundImage">
    <div class="content">

      <p class="topt">请完成下方验证</p>
      <img class="closeimg" src="./img/close.png" alt="" @click="cancelEvent">

      <div class="img-content">
        <div class="content-re" ref="contents">
          <img class="bg-img" ref="bgimg" :src="verifyData.backgroundImage" alt="" v-if="verifyData" @click="imgClick">
          <img class="refresh-img" src="./img/shuaxin.png" @click.stop="getImgDatas" alt="">
          <img class="frontImage" :src="verifyData.frontImage" alt="">
          <div class="click-dot" v-for="item in clickPointArr" :style="{left: (item.x-10)+ 'px',top: (item.y-10)+ 'px'}">
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>

  export default {
    name: "graphicsword-verify",
    props: ['verifyData'],
    components: {},
    data() {
      return {
        clickPointArr: []
      }
    },
    methods: {
      cancelEvent: function () {
        this.$emit('cancelEvent')

      },
      getImgDatas: function () {
        this.clickPointArr = [];
        this.$emit('getVertifyDatas');
      },
      imgClick: function (event) {

        let x = this.getOffsetXY(event).x;
        let y = this.getOffsetXY(event).y;

        this.clickPointArr.push({
          x:x,
          y:y,
          xd:x/event.target.clientWidth,
          yd:y/event.target.clientHeight,
          time:this.$util.getPayTime(),
        })
        if(this.clickPointArr.length == this.verifyData.verifyNumber){
          let arr = [];
          this.clickPointArr.forEach(item=>{
            arr.push({
              xd:item.xd,
              yd:item.yd,
              time:item.time
            })
          })
          let code = JSON.stringify({pathList:arr});
          this.$emit('graphicswordSubmit',code);
        }
      },
      getOffsetXY: function (evt) {
        if (evt.offsetX && evt.offsetY) return {x: evt.offsetX, y: evt.offsetY};

        var ele = evt.target || evt.srcElement;
        var o = ele;

        var x = 0;
        var y = 0;
        while (o.offsetParent) {
          x += o.offsetLeft;
          y += o.offsetTop;
          o = o.offsetParent;
        }
        // 处理当元素处于滚动之后的情况
        var left = 0;
        var top = 0
        while (ele.parentNode) {
          left += ele.scrollLeft;
          top += ele.scrollTop;
          ele = ele.parentNode;
        }
        return {x: evt.pageX + left - x, y: evt.pageY + top - y};
      }

    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .graphicsword-verify {

    /*width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 99
    display flex
    align-items center
    justify-content center*/

    .content {
      background-color white
      border-radius 10px
      margin 0px 20px
      /*width 100%*/
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
        width 40px
        height 40px
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
          padding 0
          margin 0
          .bg-img {
            padding 0
            margin 0
            width 100%
          }
          .click-dot{
            width 20px
            height 20px
            border-radius 10px
            background-color red
            position absolute
          }

          .frontImage {
            width 100%
            padding 5px 0px
          }
          .refresh-img {
            position absolute
            right 5px
            top 5px
            padding 3px
            width 30px
            height 30px
          }
        }

      }

    }
  }
</style>

/**Created by steven on 2018/10/14.*/

<template>
  <div class="complex-tip" v-show="visible" @click.stop="visible = false">
    <div class="center-div">
      <div class="white-body" :style="bodyStyle">
        <div class="row" v-for="item in complexData.contentsList" @click="itemEvent(item)">
          <div v-if="item.type == 1">
            <div :style="textStyle(item)">{{item.text}}</div>
          </div>
          <div v-if="item.type == 2">
            <img :src="item.imgUrl">
          </div>
        </div>
        <div class="bottom-btns" v-if="complexData.btnsList.length > 0">
          <div class="btn single-line" :class="{'line_left': idx > 0}" v-for="(item, idx) in complexData.btnsList" :style="btnStyle(item)" @click="btnEvent(item)">
            {{item.name}}
          </div>
        </div>
      </div>
      <div class="bottom-close" v-if="complexData.closeStyle == 1" @click="visible = false">
        <div class="close-btn">
          <img src="static/images/design/X.png">
        </div>
      </div>
      <div class="right-close" v-else-if="complexData.closeStyle == 2" @click="visible = false">
        <div class="close-btn">
          <img src="static/images/design/X.png">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import market from "@/utils/market"

  export default {
    name: "complex-tip",
    components: {},

    data() {
      return {
        //hasCamera: false,
        visible: false,
        complexData: {
          // cornerSize: this.cornerSize,
          // closeStyle: this.closeStyle,
          // btnsList: this.btnsList,
          // contentsList: this.contentsList,
        }
      }
    },
    computed: {
      bodyStyle: function () {
        let style = ''
        let cornerSize = this.complexData.cornerSize
        style += 'border-radius: ' + cornerSize + 'px;'
        let bgColor = this.complexData.bgColor
        if (bgColor) {
          style += 'background-color: ' + bgColor + ';'
        }
        return style;
      }
    },
    methods: {
      textStyle: function (item) {
        let style = ''
        let color = item.color
        style += 'color: ' + color + ';'
        let textAlign = item.textAlign
        if (textAlign) {
          style += 'text-align: ' + textAlign + ';'
        }
        let textSize = item.textSize
        if (textSize) {
          style += 'text-size: ' + textSize + 'px;'
        }
        let bgColor = item.bgColor
        if (bgColor) {
          style += 'background-color: ' + bgColor + ';'
        }
        let upSpace = item.upSpace
        if (upSpace) {
          style += 'padding-top: ' + upSpace + 'px;'
        }
        let downSpace = item.downSpace
        if (downSpace) {
          style += 'padding-bottom: ' + downSpace + 'px;'
        }
        return style;
      },
      btnStyle: function (item) {
        let style = ''
        let color = item.color
        style += 'color: ' + color + ';'
        return style;
      },
      itemEvent: function (item) {
        market.enterNav(item)
      },
      btnEvent: function (item) {
        if (item.isCloseBtn) {
          this.visible = false
          return ;
        }
        market.enterNav(item)
      }
    },
    mounted() {
      console.log(this.complexData)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .complex-tip {
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    z-index 1999
    background-color: rgba(0, 0, 0, 0.4);
    .center-div {
      width 335px;
      position absolute;
      left 50%;
      top 50%;
      transform: translate(-50%, -50%);
      .bottom-close {
        position absolute;
        top 100%;
        left 50%;
        margin-top 10px;
        transform: translateX(-50%);
        .close-btn {
          border-radius 20px;
          border 2px solid #cdcdcd;
          overflow hidden;
          img {
            display block;
            width 36px;
            height 36px;
          }
        }
      }
      .right-close {
        position absolute;
        top 10px;
        right 10px;
        .close-btn {
          border-radius 20px;
          border 1px solid #cdcdcd;
          overflow hidden;
          img {
            display block;
            width 24px;
            height 24px;
          }
        }
      }

      .white-body {
        //background-color white;
        overflow hidden;
        .row {
          img {
            display block;
            width 100%;
          }
        }
        .bottom-btns {
          display flex;
          align-items center;
          .btn {
            flex 1;
            padding 12px 5px;
            font-size 14px;
            text-align center;
          }
        }
      }
    }
  }

</style>

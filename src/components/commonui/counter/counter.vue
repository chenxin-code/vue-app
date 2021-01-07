/**Created by liaoyingchao on 2018/11/3.*/

<template>
  <div class="counter" ref="TheCounter">
    <div class="counter-content no-right" @touchstart="minusEvent">
      <div class="counter-grid jian extend-click" >
        <i class="iconfont mall-jianhao  num theme_font_black"  :class="{theme_font_tint: myValue <= 1}"></i>
      </div>
    </div>
    <div class="counter-content number" @click.stop="clickNumber">
      <div class="counter-grid num theme_font_black">
        {{myValue}}
      </div>
    </div>
    <div class="counter-content no-left" @touchstart="plusEvent">
      <div class="counter-grid jia">
        <i class="iconfont mall-jiahao num theme_font_black"  :class="{theme_font_tint: myValue > myMaxValue - stepNum && myMaxValue != -1}"></i>
      </div>
    </div>
    <transition name="buyNum">
      <div class="buy-num" v-show="showKeyboard">
        请输入购买数量：{{valueStr}}
      </div>
    </transition>
    <van-number-keyboard
      :show="showKeyboard"
      extra-key=""
      close-button-text="完成"
      @blur="blurEvent"
      @input="onInput"
      @delete="onDelete"
    />
  </div>
</template>

<script>
  // import FastClick from 'fastclick'

  export default {
    name: "counter",
    components: {},
    props: {
      value: {
        default: '1'
      },
      stepNum: {
        default: '1'
      },
      minValue: {
        default: '1'
      },
      canInput: {
        default: false
      },
      maxValue: {
        default: '-1'
      },
      itemInfo:{},
    },
    computed: {
      myValue: function(){
        if(this.value == ''){
          return 0;
        }else {
          return parseInt( this.value);
        }
      },
      myStepNum: function(){
        if(this.stepNum == ''){
          return 1;
        }else {
          return parseInt(this.stepNum);
        }
      },
      myMinValue: function(){
        if(this.minValue == ''){
          return 1;
        }else {
          return parseInt(this.minValue);
        }
      },
      myMaxValue: function(){
        if(this.maxValue == ''){
          return -1;
        }else {
          return parseInt(this.maxValue);
        }
      },
    },
    data() {
      return {
        showKeyboard: false,
        valueStr: ''
      }
    },
    methods: {
      blurEvent: function () {
        this.showKeyboard = false
        if (this.valueStr >= this.minValue && (this.myMaxValue != -1 || this.valueStr <= this.myMaxValue)) {
          // this.value = this.valueStr
          this.$emit('input', this.valueStr);
          this.$emit('numChange',this.itemInfo);
        }
      },
      onDelete: function () {
        this.valueStr=this.valueStr.substring(0,this.valueStr.length-1)
      },
      onInput: function (value) {
        this.valueStr += value
      },
      clickNumber: function () {
        if (!this.canInput) {
          return
        }
        console.log('clickNumber')
        this.valueStr = this.myValue + ''
        this.showKeyboard = true
      },
      minusEvent: function (event) {
        event.preventDefault();
        if (this.myValue - this.myStepNum < this.myMinValue)  {
          return;
        }
        let v = parseInt(this.myValue) - parseInt(this.myStepNum)
        this.$emit('input', v);
        this.$emit('numChange',this.itemInfo);
      },
      plusEvent: function (event) {
        event.preventDefault();
        if (this.myMaxValue != -1 && this.myValue > this.myMaxValue - this.myStepNum) {
          return;
        }
        let v = parseInt(this.myValue) + parseInt(this.myStepNum)
        this.$emit('input', v);
        this.$emit('numChange',this.itemInfo);

      }
    },
    mounted() {
      // let dom = this.$refs.TheCounter
      // FastClick.attach(dom);
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .buy-num {
    position fixed;
    left 0;
    right 0;
    bottom 246px;
    background-color white;
    padding 15px;
    z-index 9;
    box-shadow 0 -1px 5px #aaa;
  }
  .counter {
    overflow hidden
    display flex;
    align-items center;
    .counter-content{
      position relative;
      z-index 9;
      padding 5px 20px

      &.number {
        padding 3px 0px;
        // margin 0px -10px;
      }
      &.no-right {
        padding-right 0;
      }
      &.no-left {
        padding-left 0;
      }
    }
    .counter-grid {
      padding 0px 5px;
      height 22px;
      font-size 12px;
      overflow hidden;
      border 1px solid #ddd;
      display flex
      align-items center
    }
    .jian {
      border-radius 5px 0 0 5px;
      border-right-width 0px;
    }
    .jia {
      border-radius 0px 5px 5px 0px;
      border-left-width 0px;
    }

    .num {
      font-size 12px
      position relative;
      z-index 1;
    }
  }

  .buyNum-enter-active {
    transition: all 0.4s;
  }

  .buyNum-enter {
    transform: translateY(246px);
  }
</style>

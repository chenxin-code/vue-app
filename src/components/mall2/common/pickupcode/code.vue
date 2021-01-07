<template>
  <div class="bottom theme_bg_white" v-if="visible">
    <div class="top-nav" :style="{height: (initData.barHeight+this.$market.getNavHeight())+ 'px'}">
      <div class="top-content" :style="{marginTop: initData.barHeight + 'px', height: this.$market.getNavHeight() + 'px'}">
        <div class="back-div" style="padding: 12px;" @click="backEvent">
          <i class="iconfont mall-fanhui theme_font_black" style="font-size: 20px;"></i>
        </div>
        <div class="title-div theme_font_black" >查看提货码</div>
      </div>
    </div>
    <div class="content">
      <div class="code-text">提货码：{{initData.code}}</div>
      <div class="code-div">
        <canvas id="codeDiv"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
  import JsBarcode from 'jsbarcode'

  export default {
    name: 'search',
    components: {},
    data() {
      return {
        initData: {
          barHeight: 20,
          code: '',
        },
        visible: false,
        closeEvent: null
      }
    },
    methods: {
      backEvent: function () {
        this.closeEvent();
      },
    },
    mounted() {
      let barcode = document.getElementById('codeDiv');
      JsBarcode(barcode, this.initData.code);
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .bottom{
    position fixed;
    left 0px;
    right 0px;
    top 0px;
    bottom 0px;
    z-index 199;
    overflow hidden
    .top-nav {
      overflow hidden;
      .top-content {
        position relative;
        width 100%;
        .back-div {
          position absolute;
          left 0px;
          top 0px;
          height 100%;
          overflow hidden;
        }
        .title-div {
          position absolute;
          left 50px;
          right 50px;
          bottom 0px;
          line-height 44px;
          text-align center;
          font-weight $font-weight-x
          font-size $font-size-large;
          height 100%
        }
      }
    }
    .content {
      overflow hidden;
      padding 30px;
      .code-text {
        padding 12px 0px;
        font-size 14px;
      }
      .code-div {
        width 100%;
        height 50px;
      }
    }
  }

</style>

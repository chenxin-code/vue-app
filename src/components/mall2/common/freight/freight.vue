<template>
  <div class="freight" v-if="visible">
    <div class="pop-bottom theme_bg_white">
      <div class="title theme_font_black">运费详情</div>
      <div class="freight-content">
        <div class="freight-block" v-for="item in initData.listData">
          <div class="block-title">
            <span class="full theme_font_gray">{{item.storeName}}</span>
            <span class="freight-price theme_font_black">运费：￥{{$util.toDecimal2(item.freightAmount - item.freightDiscountAmount)}}</span>
          </div>
          <div class="pros-div">
            <img v-for="img in item.proImgs" :src="img">
          </div>
        </div>
      </div>
      <div class="bottom-btn theme_font_red" @click="sureEvent">我知道了</div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'search',
    components: {},
    data() {
      return {
        initData: {
          listData: []
        },
        visible: false,
        sureEvent: null
      }
    },
    methods: {

    },
    mounted() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .freight {
    position fixed;
    left 0px;
    right 0px;
    top 0px;
    bottom 0px;
    z-index 199;
    overflow hidden
    background-color rgba(0, 0, 0, 0.5)
    .pop-bottom {
      position absolute;
      left 20px;
      right 20px;
      top 50%;
      margin-top -100px;
      height 200px;
      border-radius 6px;
      .title {
        text-align center;
        padding 10px;
        font-size 16px;
      }
      .freight-content {
        position absolute;
        left 16px;
        right 16px;
        top 36px;
        bottom 40px;
        overflow-y auto;
        overflow-x hidden;
        .freight-block {
          .block-title {
            display flex;
            align-items center;
            padding 8px 0px;
            font-size 14px;
            .full {
              flex 1;
            }
            .freight-price {
              font-size 12px;
              font-weight 500;
            }
          }
          .pros-div {
            padding-bottom 10px;
            width 100%;
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;
            font-size 0;
            img {
              display inline-block;
              width 60px;
              height 60px;
              margin-right 8px;
            }
          }
        }
      }
      .bottom-btn {
        position absolute;
        left 0px;
        right 0px;
        height 40px;
        line-height 40px;
        bottom 0px;
        font-size 16px;
        border-top 0.5px solid #ddd;
        text-align center;
      }
    }
  }

</style>

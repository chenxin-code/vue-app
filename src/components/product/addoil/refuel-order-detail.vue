<template>
  <div class="bottom">

    <div class="stationName_style">西沙屯加油站</div>
    <div class="item_style item_style1">
      <div class="left_div">油枪编码</div>
      <div class="right_div">{{oilRecord.gunNo}}油枪</div>
    </div>
    <div class="item_style">
      <div class="left_div">油品名称</div>
      <div class="right_div">{{oilRecord.oilName}}</div>
    </div>
    <div class="item_style">
      <div class="left_div">单价</div>
      <div class="right_div">{{oilRecord.oilPrice}}&nbsp;元/升</div>
    </div>
    <div class="item_style">
      <div class="left_div">升数</div>
      <div class="right_div">{{oilRecord.totalOilQty}}&nbsp;升</div>
    </div>
    <div class="item_style">
      <div class="left_div">订单金额</div>
      <div class="right_div">{{oilRecord.totalOilAmount}}元</div>
    </div>
    <div class="item_style">
      <div class="left_div">折扣金额</div>
      <div class="right_div">{{oilRecord.couponAmount.length > 0 ? oilRecord.couponAmount : 0}}元</div>
    </div>
    <div class="item_style">
      <div class="left_div">电子优惠券</div>
      <div class="right_div">{{oilRecord.couponAmount.length > 0 ? oilRecord.couponAmount : 0}}元</div>
    </div>
    <div class="item_style">
      <div class="left_div">实付金额</div>
      <div class="right_custom">¥{{oilRecord.totalOilAmount}}元</div>
    </div>
    <div class="item_style">
      <div class="left_div">支付方式</div>
      <div class="right_div">{{oilRecord.payMode}}</div>
    </div>
    <div class="item_style">
      <div class="left_div">支付时间</div>
      <div class="right_div">{{oilRecord.payTime}}</div>
    </div>
    <div class="item_style item_style0">
      <div class="left_div">订单编号</div>
      <div class="right_div">{{oilRecord.tradeNo}}</div>
    </div>

    <div class="invoice_div">
      <div class="left_div">是否开发票</div>
      <!--<div class="right_div" v-if="false">-->
      <!--<div class="company_div">{{oilRecord.totalOilAmount}}公司</div>-->
      <!--<div class="no_div">{{oilRecord.totalOilAmount}}</div>-->
      <!--</div>-->
      <!--<img src="static/images/icon-more.png">-->
    </div>

    <div class="next_div" @click="sureClick">确定</div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'

  export default {

    name: 'refuel-order-detail',
    components: {
      Toast
    },
    data() {
      return {
        result: {},
        oilRecord: null,

      }
    },
    methods: {
      sureClick: function () {
        this.$bridgefunc.customGo(-3);
      },
      getOrderStateStr: function () {
        return '恭喜您，支付成功'
      },
      setOriginalData: function () {
        let record = JSON.parse(decodeURIComponent(this.$route.query.oilRecord));
        console.log('record', record)
        this.oilRecord = record;
      }
    },
    created() {
      this.setOriginalData();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .bottom {
    position absolute
    top 0px
    bottom 0px
    left 0px
    right 0px
    background-color #efefef
    overflow hidden
    padding 10px

    .stationName_style {
      border-radius 5px 5px 0px 0px
      text-align center
      font-size $font-size-medium-x
      padding 10px
      background-color #FFFFFF

    }
    .item_style {
      display flex
      align-items center
      font-size $font-size-medium
      padding 5px 10px
      background-color #FFFFFF
      .left_div {
        color $color-text-l
      }
      .right_div {
        flex 1
        text-align right

      }
      .right_custom {
        flex 1
        text-align right
        color $color-theme-text-l

      }

    }
    .item_style1 {
      padding 10px 10px 5px 10px
      margin-top 1px

    }
    .item_style0 {
      padding 5px 10px 10px 10px
      border-radius 0px 0px 5px 5px

    }

    .invoice_div {
      display flex
      align-items center
      background-color #FFFFFF
      border-radius 5px
      margin-top 10px
      padding 10px

      .right_div {
        flex 1
        text-align right

        .company_div {
          color $color-text-d

        }
        .no_div {
          color $color-text-l

        }
      }
      img {
        width 15px
        height 15px
      }
    }
    .next_div {
      background-color $color-theme-r
      padding 10px
      margin 20px 5px
      border-radius 20px
      color #FFFFFF
      text-align center

    }
  }
</style>

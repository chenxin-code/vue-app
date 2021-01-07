<template>
  <div class="bottom">
    <div class="detail-bottom" v-show="oilRecord">
      <div class="line_one">{{getOrderStateStr()}}</div>
      <div class="line_two">{{oilRecord.stationName}}</div>
      <div class="line_items">
        <div class="item_left">订单号</div>
        <div class="item_right">{{oilRecord.orderNo}}</div>
      </div>
      <div class="line_items">
        <div class="item_left">枪号</div>
        <div class="item_right">{{oilRecord.gunNo}}</div>
      </div>
      <div class="line_items">
        <div class="item_left">油品</div>
        <div class="item_right">{{oilRecord.oilName}}</div>
      </div>
      <div class="line_items">
        <div class="item_left">单价</div>
        <div class="item_right">{{oilRecord.oilPrice}}</div>
      </div>
      <div class="line_items">
        <div class="item_left">支付方式</div>
        <div class="item_right">{{oilRecord.payMode}}</div>
      </div>
      <div class="line_items">
        <div class="item_left">支付时间</div>
        <div class="item_right">{{oilRecord.payTime}}</div>
      </div>

      <div class="line_end">
        <div class="item_left">支付金额</div>
        <div class="item_right">{{oilRecord.totalOilAmount}}元</div>
        <!--<img class="full-img background" src="../../../../static/image/iv_paysuccess_bottom.png"/>-->
      </div>

    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'

  export default {

    name: 'Template',
    components: {
      Toast
    },
    data() {
      return {
        oilRecord: null,
      }
    },
    methods: {
      getOrderStateStr:function () {
        return '加油记录'
      },
      setOriginalData:function () {
        let  record = JSON.parse(decodeURIComponent(this.$route.query.oilRecord));
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

    .detail-bottom {
      margin 10px

      .line_one {
        width 100%
        height 50px
        text-align center
        color $color-theme-text-d
        line-height 50px
        border-bottom solid #ddd 1px
        background url("../../../../static/image/mine/iv_paysuccess_top.png") 0px 0px no-repeat
        background-size 100% 100%
      }

      .line_two {
        padding-left 10px
        width 100%
        height 40px
        line-height 40px
        border-bottom solid #ddd 1px
        background-color white
      }
      .line_items {
        width 100%
        height 40px
        line-height 40px
        padding 0px 10px
        background-color white

        .item_left {
          float left

        }
        .item_right {
          float right
          color #a2a2a2

        }
      }
      .line_end {
        position relative
        width 100%
        height 50px
        text-align center
        color white
        /*background  #ec6719*/
        background url("../../../../static/image/mine/iv_paysuccess_bottom.png") 0px 0px no-repeat
        background-size 100% 100%
        padding 0px 10px
        line-height 50px
        .item_left {
          float left

        }
        .item_right {
          float right

        }
      }

    }

    .background {
      position absolute
    }
  }
</style>

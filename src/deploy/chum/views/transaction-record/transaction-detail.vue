<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="prod-info">
        <img :src="detailData.orderItemList[0].phPictureUrl" alt="" class="prod-img">
        <div class="right-c">
          <p class="prod-name">{{ detailData.orderItemList[0].skuName }}</p>
          <p class="specification-name">{{ detailData.orderItemList[0].specs }}</p>
          <p class="price">¥{{ dealWithPrice(detailData.orderItemList[0].realPrice)[2] }}</p>
          <span class="count">x{{ detailData.orderItemList[0].number }}</span>
        </div>
      </div>
      <div class="order-info">
        <div class="item-text">
          订单编号
          <div class="content trade-content">
            <span class="trade-no">{{ detailData.tradeNo }}</span>
            <van-button
              class="copy-btn"
              type="default"
              ref="copybtn"
              :data-clipboard-text="detailData.tradeNo"
              @click="copyClick"
              size="mini">复制</van-button></div>
        </div>
        <div class="item-text">
          支付时间
          <div class="content">{{ detailData.paidTime }}</div>
        </div>
        <div class="item-text">
          支付方式
          <div class="content">{{ detailData.payModeStr || '-' }}</div>
        </div>
        <div class="item-text">
          订单金额
          <div class="content">¥{{ detailData.payAmount }}</div>
        </div>
      </div>
      <div class="price-info">
        <div class="line">
          <p class="label">商品金额</p>
          <p class="content">￥{{ $util.toDecimal2(detailData.totalAmount) }}</p>
        </div>
        <div class="line">
          <p class="label">优惠券</p>
          <p class="content red">-￥{{ $util.toDecimal2(detailData.couponAmount) }}</p>
        </div>
        <div class="line">
          <p class="label"></p>
          <p class="content">共1件商品，实付款<span class="red">￥{{ $util.toDecimal2(detailData.payAmount) }}</span></p>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
import ClipboardJS from 'clipboard';
import utils from '../../assets/utils/tools'
export default {
  mixins: [utils],
  data() {
    return {
      // orderNo: 0,
      copyObject: null,
      detailData: {
        tradeNo: 0,
        orderItemList: [
          {}
        ]
      },
    }
  },
  mounted() {
    this.initDetail();
    this.$nextTick(() => {
      this.copyObject = new ClipboardJS(this.$refs.copybtn);
    });
  },
  methods: {
    copyClick() {
      this.copyObject.on('success', (e) => {
        this.$Toast('复制成功');
      });
      this.copyObject.on('error', function(e) {
      });
    },
    initDetail() {
      this.$STLoading.open();
      this.$http.post('/app/json/app_shopping_order/detail', {
        orderType: 200017,
        orderId: this.$route.query.orderId
      }).then(res => {
        let data = res.data;
        this.$STLoading.close();
        if (data.status == 0) {
          this.detailData = data.data;
        } else {
          this.$Toast(data.info);
        }
      }).catch(err => {
        this.$Toast(`detail err ${err}`);
        this.$STLoading.close();
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/deploy/chum/assets/stylus/chum-public.styl';
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.container {
  padding 0 20px;
  .prod-info {
    display flex;
    margin-top 15px;
    align-items center;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
    border-radius 5px;
    padding 10px;
    .prod-img {
      display block;
      width 80px;
      height 80px;
      border-radius 4px;
    }
    .right-c {
      flex 1;
      padding-left 10px;
      display flex;
      flex-direction column;
      justify-content space-between;
      position relative;
      height 80px;
      .prod-name {
        font-size 16px;
        font-weight 500;
        line-height 18px;
        padding-right 30px;
        padding-top 5px;
        ellipse-2();
      }
      .specification-name {
        font-size 13px;
        color #9FA0A0;
      }
      .price {
        font-size 16px;
        font-weight 700;
        color $color-theme-r;
        padding-bottom 5px;
      }
      .count {
        font-size 13px;
        position absolute;
        right 0;
        top 5px;
      }
    }
  }
  .order-info {
    padding 10px;
    border-radius 5px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
    margin-top 10px;
    .item-text {
      display flex;
      align-items center;
      font-size 14px;
      margin-top 10px
      &:first-child {
        margin-top 0;
      }
      .content {
        color #9FA0A0
        padding-left 50px;
        .copy-btn {
          margin-left 10px;
          width 40px;
        }
        &.trade-content {
          display flex;
          align-items center;
          .trade-no {
            max-width 140px;
            ellipse(); 
          }
        }
      }
    }
  }

  .price-info {
    padding 10px;
    border-radius 5px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
    margin-top 10px;
    .line {
      font-size 14px;
      line-height 20px;
      display flex;
      justify-content space-between;
      padding 4px 0;
      .label {
      }
      .content {
        &.red {
          color #f80f16;
        }
        .red {
          color #f80f16;
        }
      }
    }
  }
}
</style>
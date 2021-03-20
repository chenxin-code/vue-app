<template>
<!-- 
  billType: 订单类型
  billDate: 订单日期
  billImg: 订单图片
  billName: 订单名称
  billAmount: 订单金额
  billNum: 订单数量
 -->
  <div class="product-item">
    <div class="content">
      <div class="img">
        <img :src="productItem.billImg" @click.stop="gotoProductDetail(productItem)" />
        <p class="text" v-if="productItem.billType==11">{{productItem.billName}}</p>
        <div class="desc" v-if="productItem.billType != 11">
          <strong>物业缴费</strong>
          <p>时代地产中心2202房</p>
          <p>车位管理服务费</p>
          <p>{{productItem.submitTime}}</p>
        </div>
      </div>
      <div class="price" v-if="productItem.billType==11">
        <p class="pr">￥{{productItem.billAmount}}</p>
        <p class="am">x {{productItem.billNum}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'productItem',
    'billId',
    'billType'
  ],
  data() {
    return {
    };
  },
  methods: {
    gotoProductDetail: function (product) {
      // 砍价订单禁止进入详情
      if(this.$store.state.globalConfig.cut_price_strict==1){
        return
      }
      if (this.$store.state.globalConfig.app_home_special_flag == 'cnooc') {
        return ;
      }
      if (this.watermark == 1) {
        // 蜂鸟配送无法查看详情
        return ;
      }
      let path = '/mall2/detail/' + this.$util.getDataString()
      if (this.billType == '11') {
        this.$router.push({
          path: path,
          query: {
            storeOuCode: product.storeOuCode,
            skuId: product.skuId,
            lastPath: '/order/3',
            productType: product.productType
          }
        })
      } else {
        window.location.href = `x-engine-json://yjzdbill/queryBillDetail?args=${
          encodeURIComponent(JSON.stringify({
            billId: this.billId,
            payType: 'no',
            isRefund: 'no'
          }))
        }`
      }
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.product-item {
  .content {
    padding-top: 16px;
    display: flex;
    justify-content: space-between;
    .img {
      display: flex;
      width: 240px;
      img {
        width: 90px;
        height: 90px;
      }
      .text {
        padding-left: 8px;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #121212;
        line-height: 21px;
      }
      .desc {
        padding-left: 8px;
        strong {
          font-size: 17px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          line-height: 27px;
          color: #121212;
        }
        p {
          font-size: 13px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          line-height: 21px;
          color: #D8D8D8;
        }
      }
    }
    .price {
      .pr {
        font-size: 16px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #121212;
        line-height: 24px;
      }
      .am {
        font-size: 13px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #8D8D8D;
        line-height: 20px;
        text-align: right;
      }
    }
  }
}
</style>
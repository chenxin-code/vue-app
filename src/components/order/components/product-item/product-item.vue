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
        <img
          :src="productItem.billImg"
          v-if="productItem.billType == 11"
          @click.stop="gotoProductDetail(productItem)"
        />
        <div class="billImg" v-if="productItem.billType != 11" @click.stop="gotoProductDetail(productItem)" :style="{'width':'2.4rem','height':'2.4rem','background-image':'url('+billCenterImg+')','background-size':'2.4rem 2.4rem','background-repeat':'no-repeat'}"></div>
        <p class="text" v-if="productItem.billType == 11">
          {{ productItem.billName }}
        </p>
        <div class="desc" v-if="productItem.billType != 11">
          <strong>{{productItem.itemTypeName}}</strong>
          <p>{{ productItem.billName }}</p>
          <p>{{productItem.info}}</p>
          <p>{{ productItem.snapshotTime }}</p>
        </div>
      </div>
      <div class="price" v-if="productItem.billType == 11">
        <p class="pr">￥{{ productItem.billAmount }}</p>
        <p class="am">x {{ productItem.billNum }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["productItem", "billId", "billType"],
  data() {
    return {};
  },
  methods: {
    gotoProductDetail: function (product) {
      // 砍价订单禁止进入详情
      if (this.$store.state.globalConfig.cut_price_strict == 1) {
        return;
      }
      if (this.$store.state.globalConfig.app_home_special_flag == "cnooc") {
        return;
      }
      if (this.watermark == 1) {
        // 蜂鸟配送无法查看详情
        return;
      }
      let path = "/mall2/detail/" + this.$util.getDataString();
      if (this.billType == "11") {
        this.$router.push({
          path: path,
          query: {
            storeOuCode: product.storeOuCode,
            skuId: product.skuId,
            lastPath: "/order/3",
            productType: product.productType,
          },
        });
      } else {
        window.location.href = `x-engine-json://yjzdbill/queryBillDetail?args=${encodeURIComponent(
          JSON.stringify({
            billId: this.billId,
            payType: "no",
            isRefund: "no",
          })
        )}`;
      }
    },
  },
  computed: {
    billCenterImg: {
      get() {
        switch (this.productItem.billType) {
          case 1:
            return require("../../img/property.png");
          case 2:
            return require("../../img/warranty.png");
          case 3:
            return require("../../img/temporary.png");
          case 4:
            return require("../../img/payCost.png");
          case 5:
            return require("../../img/property.png");
          case 6:
            return require("../../img/expect.png");
          case 7:
            return require("../../img/tourism.png");
          case 8:
            return require("../../img/housekeeping.png");
          case 9:
            return require("../../img/bag.png");
          case 10:
            return require("../../img/deposit.png");

          default:
            return require("../../img/property.png");
        }
      },
      set() {},
    },
    billTypeName() {
      let billName = "";
      switch (this.billType) {
        case 11:
          billName = "邻里星选";
          break;
        case 1:
          billName = "物业缴费";
          break;
        case 2:
          billName = "月保续费";
          break;
        case 3:
          billName = "临停缴费";
          break;
        case 6:
          billName = "预缴费";
          break;
        case 4:
          billName = "临时缴费";
          break;
        case 7:
          billName = "旅游";
          break;
        case 8:
          billName = "家政";
          break;
        case 9:
          billName = "拎包";
          break;
        case 10:
          billName = "押金";
          break;
        case 12:
          billName = "美居";
          break;
      }
      return billName;
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.product-item {
  .content {
    padding-top: 14px;
    display: flex;
    justify-content: space-between;

    .img {
      display: flex;
      // width: 240px;
      justify-content: flex-start;

      img {
        width: 90px;
        height: 90px;
        margin-right: 14px;
      }
      .billImg{
        width: 90px;
        height: 90px;
        margin-right: 8px;
      }

      .text {
        // padding-left: 14px;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #121212;
        line-height: 21px;
      }

      .desc {
        // padding-left: 8px;
        flex: 1;
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
          color: #8D8D8D;
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
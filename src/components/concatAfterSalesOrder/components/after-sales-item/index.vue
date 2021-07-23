<template>
  <div class="afterSalesItem">
    <div class="cardHead">
      <div class="no">
        <img src="../../img/afterSales.png" alt="" />
        <div class="orderNo">单号: 432145689012344</div>
      </div>
      <div class="type">受理中</div>
    </div>
    <div class="cardContent">
      <img src="../../img/test.jpg" alt="" class="orderImg" />
      <div class="content">
        <div class="goodsName">兰舟水果利口青梅酒VOL8% 350ML（一瓶装）件</div>
        <div class="sku">
          <div class="price">¥35.9</div>
          <div class="num">x1</div>
        </div>
      </div>
    </div>
    <div class="cardFoot">
      <div class="date">2020-07-22 22:08:09</div>
      <div class="payPrice">
        <div class="title">已付款：</div>
        <div class="cunt">¥</div>
        <div class="priceBig">35.</div>
        <div class="priceSmall">90</div>
      </div>
    </div>
    <div class="cardBtn">
      <img src="../../img/detailBtn.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: "afterSalesItem",
  data() {
    return {};
  },
};
</script>
 
<style lang="stylus" scoped type="text/stylus">
.afterSalesItem {
  width: 94.4%;
  margin: 24px auto;
  background: #FFFFFF;
  border-radius: 12px;
  padding: 11px 17px 21px 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  .cardHead {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .no {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      img {
        width: 22px;
        height: 23px;
      }

      .orderNo {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #121212;
        line-height: 22px;
        margin-left: 6px;
      }
    }

    .type {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #E8374A;
      line-height: 20px;
      margin-top: 2px;
    }
  }

  .cardContent {
    display: flex;
    justify-content: flex-start;
    margin-top: 17px;

    .orderImg {
      display: block;
      width: 90px;
      height: 90px;
      margin-right: 13px;
    }

    .content {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;

      .goodsName {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #121212;
        line-height: 22px;
      }

      .sku {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 11px;

        .price {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #8D8D8D;
          line-height: 18px;
        }

        .num {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #8D8D8D;
          line-height: 18px;
        }
      }
    }
  }

  .cardFoot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 19px;

    .date {
      font-size: 13px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #999999;
      line-height: 14px;
    }

    .payPrice {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .title {
        font-size: 13px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
      }

      .cunt {
        font-size: 12px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #121212;
        line-height: 18px;
      }

      .priceBig {
        font-size: 16px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        color: #121212;
        line-height: 24px;
      }

      .priceSmall {
        font-size: 12px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        color: #121212;
        line-height: 24px;
        margin-top: 2px;
      }
    }
  }

  .cardBtn {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 18px;

    img {
      width: 108px;
      height: 32px;
    }
  }
}
</style>
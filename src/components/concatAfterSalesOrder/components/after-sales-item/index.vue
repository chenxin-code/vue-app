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
      <img src="../../img/afterSales.png" alt="" class="orderImg">
      <div class="content">
        <div class="goodsName">
          兰舟水果利口青梅酒VOL8% 350ML（一瓶装）件
        </div>
        <div class="sku">
          <div class="price">¥35.9</div>
          <div class="num">x1</div>
        </div>
      </div>
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
}
</style>
<template>
  <div class="order-item">
    <div class="title">
      <i class="icon"></i>
      <span>邻里选星</span>
    </div>
    <div class="content">
      <div class="img">
        <img src="../../img/product1.jpg" />
        <p class="text">视觉动态导航/高精度米家扫地机器人IC</p>
      </div>
      <div class="price">
        <p class="pr">￥2289.09</p>
        <p class="am">x 1</p>
      </div>
    </div>
    <div class="content">
      <div class="img">
        <img src="../../img/product1.jpg" />
        <p class="text">视觉动态导航/高精度米家扫地机器人IC</p>
      </div>
      <div class="price">
        <p class="pr">￥2289.09</p>
        <p class="am">x 1</p>
      </div>
    </div>
    <div class="total">
      <span class="to">共<i>1</i>件商品</span>
      <span class="pr"><i>实付款：</i>￥2289.00</span>
    </div>
    <div class="btn-box">
      <div class="btn"><p>再次购买</p></div>
      <div class="btn default"><p>查看物流</p></div>
      <div class="btn"><p>确认收货</p></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.order-item {
  width: 359px;
  background: #FFFFFF;
  margin: 0 auto;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;

  .title {
    height: 30px;
    line-height: 30px;

    .icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url('../../img/icon1.png') no-repeat;
      background-size: 20px 20px;
      position: relative;
      top: 5px;
    }

    span {
      font-size: 16px;
      padding-left: 6px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #121212;
    }
  }

  .content {
    padding-top: 16px;
    display: flex;
    justify-content: space-between;

    .img {
      display: flex;
      width: 240px;

      img {
        width: 90px;
        heigth: 90px;
      }

      .text {
        padding-left: 8px;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #121212;
        line-height: 21px;
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
  .total {
    padding-top: 16px;
    text-align: right;
    .to {
      font-size: 14px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #8D8D8D;
      line-height: 14px;
      i {
        padding: 0 4px;
        color: #121212;
      }
    }
    .pr {
      font-size: 16px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #121212;
      line-height: 24px;
      i {
        color: #8D8D8D;
        font-size: 14px;
      }
    }
  }
  .btn-box {
    display: flex;
    padding-top: 16px;
    justify-content: flex-end;
    .btn {
      width: 108px;
      height: 32px;
      font-size:16px;
      font-weight: bold;
      color: #e8374a;
      text-align: center;
      line-height: 32px;
      border: 1px solid #e8374a;
      border-radius: 20px;
      margin-left: 4px;
      &.default {
        color: #8d8d8d;
        border-color: #8d8d8d;
      }
      p {
        position relative;
        top: -1px;
      }
    }
  }
}
</style>
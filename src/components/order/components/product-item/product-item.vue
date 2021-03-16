<template>
  <div class="product-item">
    <div class="content">
      <div class="img">
        <img src="../../img/product1.jpg" />
        <!-- <p class="text">视觉动态导航/高精度米家扫地机器人IC</p> -->
        <div class="desc">
          <strong>物业缴费</strong>
          <p>时代地产中心2202房</p>
          <p>车位管理服务费</p>
          <p>2020年2月</p>
        </div>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
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
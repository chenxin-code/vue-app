<template>
  <!-- // created by hjc 售后申请选择商品 -->
  <div class="afterSalesSelectGoods">
    <navbar :title="'售后/申请'"></navbar>
    <div class="goods_list">
      <div class="goods_item" v-for="item in 10" :key="item">
        <img
          src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202011%2F11%2F20201111212304_5706f.thumb.400_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1615221459&t=c602d8447792fa22cbcb25a38b16031b"
          alt=""
        />
        <div class="goods_item_detail">
          <div class="goods_item_name">万宝路</div>
          <div class="goods_item_count">商品数量：<span>4</span></div>
          <div class="goods_item_price">商品价格：<span>￥75.00</span></div>
        </div>
        <div class="btn_box">
          <div class="after_btn" @click="navToAfterSales">申请售后</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from "@/components/bulk/components/navbar/index.vue";
export default {
  name: "afterSalesDetail",
  components: {
    navbar,
  },
  props: {},
  data() {
    return {};
  },
  created() {},
  methods: {
    navToAfterSales() {
      this.$router.push({
        path: "/bulk_after_sales_edit",
      });
    },
  },
};
//
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.router_class {
  background-color: #F6F6F6;
}

.afterSalesSelectGoods {
  width: 100%;
  height: 100%;
  background-color: #F6F6F6;
  font-family: PingFangSC-Regular, PingFang SC;
  letter-spacing: 1px;
  padding-bottom: 49px;

  .goods_list {
    width: 100%;
    height: 100%;
    background-color: #F6F6F6;
    padding: 10px 10px 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: auto;

    .goods_item {
      width: 100%;
      padding: 10px;
      display: flex;
      justify-content: flex-start;
      background: #FFFFFF;
      box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
      border-radius: 10px;
      margin-bottom: 10px;

      img {
        width: 85px;
        height: 85px;
        margin-right: 14.5px;
      }

      .goods_item_detail {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        font-weight: 400;
        color: #424242;

        span {
          font-weight: 600;
        }
      }

      .btn_box {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        .after_btn {
          width: 80px;
          height: 28px;
          background: #C61606;
          border-radius: 15px;
          line-height: 28px;
          text-align: center;
          font-size: 13px;
          font-weight: 400;
          color: #FFFFFF;
        }
      }
    }
  }
}
</style>


<template>
  <!-- // created by hjc 售后申请选择商品 -->
  <div class="afterSalesSelectGoods">
    <navbar :title="'售后/申请'"></navbar>
    <div class="goods_list">
      <div class="goods_item" v-for="(item, index) in goodsList" :key="index">
        <img :src="item.groupbuySkuPicurl" alt="" />
        <div class="goods_item_detail">
          <div class="goods_item_name">{{ item.groupbuySkuName }}</div>
          <div class="goods_item_count">
            商品数量：<span>{{ item.buyNumber }}</span>
          </div>
          <div class="goods_item_price">
            商品价格：<span>￥{{ item.groupbuyBuyerPrice }}</span>
          </div>
        </div>
        <div class="btn_box">
          <div class="after_btn" @click="navToAfterSales(item)">申请售后</div>
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
    return {
      goodsList: [],
      activityOrderId:"",
      activityOrderItemId:"",
    };
  },
  created() {
    // this.activityOrderId = JSON.parse(this.$route.query.activityOrderId);
    this.activityOrderItemId = JSON.parse(this.$route.query.activityOrderItemId);
    this.$http
      .post("http://192.168.31.9:18807/app/json/app_group_buying_after_sale/queryAfterOrderByIdList", {
        groupbuyOrderItemId: this.activityOrderItemId,
      })
      .then((res) => {
        if (res.data.result == "success") {
          console.log("res", res);
          this.goodsList = res.data.data;
        }
      });
  },
  methods: {
    navToAfterSales(item) {
      this.$router.push({
        path: "/bulk_after_sales_edit",
        query: {
          goodsData: JSON.stringify(item),
          // activityOrderId: JSON.stringify(this.activityOrderId),
        },
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
        justify-content: flex-end;
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


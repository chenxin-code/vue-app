<template>
  <!-- // created by hjc 订单详情 -->
  <div class="order">
    <navbar :title="'订单详情'"></navbar>
    <div class="orderDetail">
      <div class="user_info">
        <van-image class="user-image" :src="detailData.createUserAvtUrl" :error-icon="defaultAvatar" />
        <div class="info">
          <div class="user">
            <div>{{ detailData.receiveTypeStr }}</div>
            <div>{{ detailData.receiptTel }}</div>
          </div>
          <div class="address">
            {{ detailData.receiptAddress }}
          </div>
        </div>
        <div
          :class="detailData.receiveType == 0 ? 'pick_up' : 'delivery'"
          class="pick_up_type"
        >
          {{ detailData.receiveType == 0 ? "自提" : "配送上门" }}
        </div>
      </div>
      <div class="note">
        <div class="note_title">订单备注：</div>
        <div class="note_text">
          {{ detailData.orderRemark }}
        </div>
      </div>
      <div class="goods_info">
        <div class="goods_info_title">商品信息</div>
        <div
          class="goods_item"
          v-for="(item, index) in detailData.groupbuySkuInfoList"
          :key="index"
        >
          <img :src="item.skuPicUrl.split(',')[0]" alt="" />
          <div class="goods_detail">
            <div class="goods_name">{{ item.skuName }}</div>
            <div class="goods_price_count">
              <div>团购价格：¥{{ item.groupPrice }}</div>
              <div>X{{ item.purchasedItem }}</div>
            </div>
          </div>
        </div>
        <div class="price">合计：¥{{ detailData.orderAmount }}</div>
      </div>
      <div class="order_info">
        <div class="order_detail">
          <div class="order_title">订单编号</div>
          <div class="order_value">{{ detailData.payOrderNo }}</div>
        </div>
        <div class="order_detail">
          <div class="order_title">下单时间</div>
          <div class="order_value">{{ detailData.makeOrderTime }}</div>
        </div>
        <div class="order_detail">
          <div class="order_title">付款时间</div>
          <div class="order_value">{{ detailData.payTime }}</div>
        </div>
      </div>
      <!-- <div class="after_sales" @click="navToAfterSales">受理售后问题</div> -->
    </div>
  </div>
</template>

<script>
import navbar from "@/components/bulk/components/navbar/index.vue";
import vantImage from "@/components/bulk/components/vantImage.js"
export default {
  name: "orderDetail",
  components: {
    navbar,
  },
  props: {},
  data() {
    return {
      defaultAvatar: require("@/components/bulk/activity/images/user-default.png"),
      detailData: {},
    };
  },
  created() {
    this.$http
      .post("/app/json/group_buying_order/getOrderInfoListByItemId", {
        orderItemId: JSON.parse(this.$route.query.id),
      })
      .then((res) => {
        console.log(res);
        this.detailData = res.data.data;
      });
  },
  methods: {
    navToAfterSales() {
      this.$router.push({
        path: "/bulk_after_sales_select_goods",
        query: {
          // activityOrderId: JSON.stringify(this.detailData.activityOrderId),
          activityOrderItemId: JSON.stringify(
            this.detailData.activityOrderItemId
          ),
        },
      });
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.router_class {
  background-color: #F6F6F6;
}

.order {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.orderDetail {
  background: #F6F6F6;
  font-family: PingFangSC-Regular, PingFang SC;
  padding: 10px 10px 38.5px;
  letter-spacing: 1px;
  width: 100%;
  height: 100%;

  .user_info {
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: flex-start;
    position: relative;
    background: #FFFFFF;
    box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;

    .user-image{
      width: 42px;
      height: 42px;
      margin-right: 10px;
      border-radius: 50%;
      overflow: hidden;
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;

      .user {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 13px 0 5px;
        font-size: 12px;
        font-weight: 400;
        color: #666666;
        line-height: 16.5px;
      }

      .address {
        font-size: 12px;
        font-weight: 400;
        color: #666666;
        line-height: 16.5px;
      }
    }

    .pick_up_type {
      border-radius: 2px;
      border: 1px solid #FF9E4F;
      padding: 0 4px;
      border-radius: 2px;
      font-size: 12px;
      font-weight: 400;
      line-height: 16.5px;
      position: absolute;
      right: 10px;
      top: 10px;
    }

    .pick_up {
      border: 1px solid #FF9E4F;
      color: #FF9E4F;
    }

    .delivery {
      border: 1px solid #4F87FF;
      color: #4F87FF;
    }
  }

  .note {
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0px 2px 11px 3px rgba(210, 207, 207, 0.5);
    border-radius: 10px;
    padding: 15px 20px;
    display: flex;
    justify-content: flex-start;
    margin: 10px auto;

    .note_title {
      width: 71px;
      font-size: 13px;
      font-weight: 500;
      color: #424242;
      line-height: 18.5px;
      letter-spacing: 1px;
      margin-right: 5px;
    }

    .note_text {
      flex: 1;
      font-size: 13px;
      font-weight: 500;
      color: #424242;
      line-height: 18.5px;
      letter-spacing: 1px;
    }
  }

  .goods_info {
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    padding: 10px 15px 10px 20px;
    display: flex;
    flex-direction: column;

    .goods_info_title {
      font-size: 13x;
      font-weight: 500;
      color: #424242;
      line-height: 18.5px;
      padding-bottom: 9.5px;
      border-bottom: 1px solid #EEEDED;
    }

    .goods_item {
      padding: 11px 0 9.5px;
      display: flex;
      justify-content: flex-start;
      border-bottom: 1px solid #EEEDED;

      img {
        width: 105px;
        height: 105px;
        object-fit: cover;
        margin-right: 10px;
      }

      .goods_detail {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-top: 18px;

        .goods_name {
          font-size: 14px;
          font-weight: 400;
          color: #424242;
          line-height: 20px;
          margin-bottom: 47px;
        }

        .goods_price_count {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
          color: #424242;
          line-height: 20px;

          div:last-child {
            font-weight: 400;
            color: #E1DDDD;
          }
        }
      }
    }

    .price {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 14px;
      font-weight: 600;
      color: #E35161;
      line-height: 20px;
      margin-top: 9.5px;
    }
  }

  .order_info {
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0px 1px 11px 3px #E7E6E6;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 10px;
    margin: 10px auto;

    .order_detail {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .order_title {
        font-size: 13px;
        font-weight: 400;
        color: #020202;
        line-height: 18.5px;
      }

      .order_value {
        font-size: 12px;
        font-weight: 400;
        color: #5C5A5A;
        line-height: 16.5px;
      }
    }

    .order_detail:last-child {
      margin: 0;
    }
  }

  .after_sales {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 16.5px;
    letter-spacing: 1.5px;
  }
}
</style>

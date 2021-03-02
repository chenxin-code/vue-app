<template>
  <!-- // created by hjc 售后申请 -->
  <div class="afterSalesDetail">
    <navbar :title="'售后申请'" :backUrl="'/bulk_after_sales'"></navbar>
    <div class="afterSalesDetail_box">
      <div class="after_sales">
        <div class="after_sales_type">
          <div class="after_sales_title">
            <div>售后类型</div>
            <div>退款</div>
          </div>
          <!-- state 0 待审核 -->
          <div class="order_status">待审核</div>
        </div>
        <div class="goods_info">
          <div class="goods_info_title">商品信息</div>
          <div class="goods_item">
            <img :src="afterSalesData.phPictureUrl" alt="" />
            <div class="goods_item_detail">
              <div class="goods_name">{{ afterSalesData.skuName }}</div>
              <div class="goods_count">
                商品数量：
                <van-stepper
                  v-model="afterSalesData.payNumber"
                  input-width="0.466667rem"
                  button-size="0.466667rem"
                  disabled
                  integer
                />
              </div>
              <div class="goods_price_btn">
                <div class="price">
                  <div>商品价格：</div>
                  <div>¥{{ afterSalesData.salePrice }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="line"></div>
          <div class="refund_price">
            合计退款金额：¥{{ afterSalesData.predictRefundAmount }}
          </div>
        </div>
      </div>
      <div class="problem_description">
        <div class="problem_title">问题描述</div>
        <div class="problem_text">
          {{ afterSalesData.issueDesc }}
        </div>
        <div class="problem_img">
          <img :src="require('../../share/images/share.png')" alt="" />
          <img :src="require('../../share/images/share.png')" alt="" />
          <img :src="require('../../share/images/share.png')" alt="" />
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
      value: 1,
      id: "",
      afterSalesData: {},
    };
  },
  created() {
    this.id = JSON.parse(this.$route.query.id);
    this.$http
      .post("/app/json/app_order_after_sale/queryAfterDetail", { id: this.id })
      .then((res) => {
        if (res.data.result == "success") {
          this.afterSalesData = res.data.data;
        }
      });
  },
};
//
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.router_class {
  background-color: #F6F6F6 !important;
}

.afterSalesDetail {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  // padding: 10px 10px 20px;
  // padding-bottom: 20px;
  background-color: #F6F6F6;
  font-family: PingFangSC-Regular, PingFang SC;
  letter-spacing: 1px;

  .afterSalesDetail_box {
    // width: 100%;
    // height: 100%;
    // overflow-y: auto;
    padding: 10px 10px 20px;
    background-color: #F6F6F6;
  }

  .line {
    width: 100%;
    height: 1px;
    background-color: #EEEDED;
  }

  .after_sales {
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    padding: 6px 10.5px 10px 10px;

    .after_sales_type {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #EEEDED;
      padding-bottom: 5.5px;

      .after_sales_title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        div {
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 20px;
          margin-right: 20px;
        }

        div:last-child {
          color: #000000;
        }
      }

      .order_status {
        font-size: 14px;
        font-weight: 600;
        color: #C82010;
        line-height: 20px;
      }
    }

    .goods_info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods_info_title {
        padding: 4.5px 0 5px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
      }

      .goods_item {
        display: flex;
        justify-content: flex-start;
        padding-bottom: 12px;

        img {
          width: 85px;
          height: 85px;
          margin-right: 14.5px;
        }

        .goods_item_detail {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;

          .goods_name {
            font-size: 14px;
            font-weight: 400;
            color: #424242;
            line-height: 20px;
          }

          .goods_count {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-size: 14px;
            font-weight: 400;
            color: #424242;
            line-height: 20px;
            margin-top: 13.5px;
          }

          .goods_price_btn {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .price {
              display: flex;
              justify-content: space-between;
              align-items: center;

              div {
                font-size: 14px;
                font-weight: 400;
                color: #424242;
                line-height: 20px;
              }

              div:last-child {
                font-weight: 600;
              }
            }
          }
        }
      }

      .refund_price {
        display: flex;
        justify-content: flex-end;
        font-size: 13px;
        font-weight: 600;
        color: #707070;
        line-height: 18.5px;
        padding-top: 9.5px;
      }
    }
  }

  .problem_description {
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    margin-top: 10px;
    padding: 6px 10px 10px;

    .problem_title {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
      margin-bottom: 10px;
    }

    .problem_text {
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      line-height: 20px;
      margin-bottom: 20px;
    }

    .problem_img {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      img {
        width: 94px;
        height: 94px;
        margin-right: 5px;
      }
    }
  }
}
</style>


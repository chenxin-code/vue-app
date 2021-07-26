<template>
  <div class="afterSalesItem">
    <div class="cardHead">
      <div class="no">
        <img src="../../img/afterSales.png" alt="" />
        <div class="orderNo">单号: {{ orderItem.orderNo }}</div>
      </div>
      <!-- <div class="type">{{orderItem.state}}</div> -->
    </div>
    <div class="cardContent">
      <div
        v-for="(item, index) in orderItem.goodsItem"
        :key="index"
        class="goodsDetail"
        :style="{ width: orderItem.goodsItem.length == 1 ? '100%' : '2.56rem' }"
      >
        <div v-show="orderItem.goodsItem.length == 1" class="alone">
          <img :src="item.goodsPic" alt="" class="orderImg" />
          <div class="content">
            <div class="goodsName">
              {{ item.goodsName }}
            </div>
            <div class="sku">
              <div class="price">¥{{ item.goodsPrice }}</div>
              <div class="num">x{{ item.goodsNumber }}</div>
            </div>
          </div>
        </div>
        <div v-show="orderItem.goodsItem.length > 1" class="more">
          <div class="moreOrderImg" v-if="index < 3">
            <img :src="item.goodsPic" class="orderImg" />
          </div>
        </div>
      </div>
      <div class="moreTotal" v-show="orderItem.goodsItem.length > 1">
        共{{ orderItem.goodsItem.length }}件
      </div>
    </div>
    <div class="cardFoot">
      <div class="date">{{ orderItem.createTime }}</div>
      <div class="payPrice">
        <div class="title">已付款：</div>
        <div class="cunt">¥</div>
        <div class="priceBig">{{ goodsAmount.integer }}.</div>
        <div class="priceSmall">{{ goodsAmount.decimal }}</div>
      </div>
    </div>
    <div class="cardBtn" @click="navToDetail">
      <img src="../../img/detailBtn.png" alt="" />
    </div>
  </div>
</template>

<script>
import appNav from "@zkty-team/x-engine-module-nav";
export default {
  name: "afterSalesItem",
  data() {
    return {
      itemAmount: 0,
      goodsAmount: {
        integer: "0",
        decimal: "00",
      },
    };
  },
  props: ["orderItem"],
  created() {
    this.itemAmount = this.orderItem.price;
  },
  watch: {
    itemAmount: function (newVal, oldVal) {
      let amountArr = this.$util.toDecimal2(newVal).toString().split(".");
      if (amountArr.length !== 0) {
        this.goodsAmount.integer = amountArr[0];
        this.goodsAmount.decimal = amountArr[1];
      }
    },
  },
  methods: {
    navToDetail() {
      // /mall2/detailservice?id=134
      if (this.orderItem.orderType == "mall") {
        this.$router.push({
          path: "/mall2/detailservice",
          query: {
            id: this.orderItem.orderNo,
          },
        });
      } else {
        let url = "";
        let Authorization = "";
        this.$store.state.environment == "development"
          ? (url =
              "https://mall-uat-app-linli.timesgroup.cn:1443/order/afterSaleDetails")
          : (url =
              "https://mall-prod-app-linli.timesgroup.cn:9001/order/afterSaleDetails");
        if (
          this.$store.state.webtype == "2" ||
          this.$store.state.webtype == "3"
        ) {
          Authorization = localStorage.getItem("ythToken");
        } else {
          Authorization = this.$store.state.ythToken;
        }
        appNav
          .setNavBarHidden({
            isHidden: false,
            isAnimation: true,
          })
          .then((res) => {
            window.location.href = `${url}?afterSaleNo=${this.orderItem.orderNo}&Authorization=${Authorization}`;
          });
      }
    },
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
      align-items: flex-end;

      img {
        width: 22px;
        height: 23px;
      }

      .orderNo {
        font-size: 14px;
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
      // margin-top: 2px;
    }
  }

  .cardContent {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-top: 17px;

    .goodsDetail {
      width: 100%;
    }

    .alone {
      display: flex;
      justify-content: flex-start;

      .orderImg {
        display: block;
        width: 90px;
        height: 90px;
        margin-right: 13px;
      }

      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

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

          // margin-top: 11px;
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

    .more {
      display: flex;
      justify-content: flex-start;
      width: 90px;
      height: 90px;

      .moreOrderImg {
        display: flex;
        justify-content: flex-start;

        .orderImg {
          display: block;
          width: 90px;
          height: 90px;
          margin-right: 6px;
        }
      }
    }

    .moreTotal {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-left: 7px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8D8D8D;
      line-height: 18px;
      white-space: nowrap;
      flex-wrap: nowrap;
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
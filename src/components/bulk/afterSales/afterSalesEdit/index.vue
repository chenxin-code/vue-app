<template>
  <!-- // created by hjc 售后申请 -->
  <div class="after">
    <navbar :title="'售后申请'"></navbar>
    <div class="afterSalesEdit">
      <div class="after_sales">
        <div class="after_sales_type" @click="showSelectType">
          <div class="after_sales_title">
            <div>售后类型</div>
            <div>
              {{ select == 1 ? "退款" : select == 2 ? "退货" : "换货" }}
            </div>
          </div>
          <img
            :src="require('./images/right_icon.png')"
            alt=""
            class="select_icon"
          />
        </div>
        <div class="goods_info">
          <div class="goods_info_title">商品信息</div>
          <div class="goods_item">
            <img :src="goodsData.groupbuySkuPicurl" alt="" />
            <div class="goods_item_detail">
              <div class="goods_name">{{ goodsData.groupbuySkuName }}</div>
              <div class="goods_count">
                商品数量：
                <van-stepper
                  v-model="goodsCount"
                  input-width="0.466667rem"
                  button-size="0.466667rem"
                  integer
                  :max="goodsData.buyNumber"
                />
              </div>
              <div class="goods_price_btn">
                <div class="price">
                  <div>商品价格：</div>
                  <div>¥{{ goodsData.groupbuyBuyerPrice }}</div>
                </div>
                <!-- <div class="delet_btn">删除</div> -->
              </div>
            </div>
          </div>
          <div class="line"></div>
          <div class="refund_price">合计退款金额：¥{{ totalPrice }}</div>
        </div>
      </div>
      <div class="problem_description">
        <div class="problem_title">问题描述</div>
        <textarea rows="3" cols="20" v-model="problemText"></textarea>
        <van-uploader
          v-model="fileList"
          multiple
          :max-count="3"
          accept="image/png, image/jpeg,image/jpg"
        >
          <template>
            <div class="photo_btn">
              <img :src="require('./images/photo_icon.png')" alt="" />
              <div>上传照片</div>
            </div>
          </template>
        </van-uploader>
      </div>
      <div class="submit_btn" @click="afterSales">发起售后</div>
      <van-popup
        v-model="selectType"
        position="bottom"
        :style="{ height: '32%' }"
        round
      >
        <div class="select_type">
          <div class="select_type_title">
            <div>请选择申请类型</div>
            <img
              :src="require('./images/close_icon.png')"
              alt=""
              @click="selectType = false"
            />
          </div>
          <van-button block @click="(select = 1), (selectType = false)">
            <div class="select_btn">
              <div :class="select == 1 ? 'current' : ''">退款</div>
              <img
                :src="require('./images/select_icon.png')"
                alt=""
                v-show="select == 1"
              />
            </div>
          </van-button>
          <van-button block @click="(select = 2), (selectType = false)">
            <div class="select_btn">
              <div :class="select == 2 ? 'current' : ''">退货</div>
              <img
                :src="require('./images/select_icon.png')"
                alt=""
                v-show="select == 2"
              />
            </div>
          </van-button>
          <van-button block @click="(select = 3), (selectType = false)">
            <div class="select_btn">
              <div :class="select == 3 ? 'current' : ''">换货</div>
              <img
                :src="require('./images/select_icon.png')"
                alt=""
                v-show="select == 3"
              />
            </div>
          </van-button>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import navbar from "@/components/bulk/components/navbar/index.vue";
export default {
  name: "afterSalesEdit",
  props: {},
  data() {
    return {
      fileList: [],
      selectType: false,
      select: 1, // 1退款  2 退货  3换货
      goodsCount: 1,
      goodsData: {},
      activityOrderId: "",
      problemText: "",
      afterSalesData: {},
    };
  },
  components: {
    navbar,
  },
  created() {
    this.goodsData = JSON.parse(this.$route.query.goodsData);
    // this.activityOrderId = JSON.parse(this.$route.query.activityOrderId);
    this.$http
      .post(
        "/app/json/app_group_buying_after_sale/afterSalesType",
        {
          tradeNo: this.goodsData.payTradeNo,
          skuId: this.goodsData.skuId,
          shoppingOrderId: this.goodsData.groupbuyOrderId,
          afterType: "0",
        }
      )
      .then((res) => {
        this.goodsStatusData = res.data.data;
      });
  },
  computed: {
    totalPrice: {
      get() {
        return this.$util.toDecimal2(
          this.goodsData.groupbuyBuyerPrice * this.goodsCount
        );
      },
      set() {},
    },
  },
  methods: {
    showSelectType() {
      this.$toast("目前仅支持退款售后");
      return;

      this.selectType = true;
    },
    afterSales() {
      let picList = [];
      if (this.fileList.length !== 0) {
        this.fileList.forEach((e) => {
          picList.push(e.content);
        });
      }

      this.$http
        .post(
          "/app/json/app_order_after_sale/applyPage",
          {
            mainOrderId: this.goodsStatusData.mainOrderId,
            id: this.goodsStatusData.id,
            skuId: this.goodsStatusData.skuId,
            type: "5",
          }
        )
        .then((res) => {
          if (res.data.result == "success") {
            this.afterSalesData = res.data.data;

            this.$http
              .post(
                "/app/json/app_order_after_sale/afterSubmit",
                {
                  address: this.afterSalesData.address,
                  skuDetailList: this.afterSalesData.skuDetailList,
                  issueDesc: this.problemText,
                  consignee: "",
                  realName: this.afterSalesData.realName,
                  phone: this.afterSalesData.phone,
                  remark: "",
                  applyReason: "4",
                  receiver: this.afterSalesData.receiver,
                  mobile: this.afterSalesData.mobile,
                  number: this.goodsCount,
                  mainOrderId: this.afterSalesData.mainOrderId,
                  id: this.afterSalesData.id,
                  skuId: this.afterSalesData.skuId,
                  phPictureUrl: this.goodsData.groupbuySkuPicurl,
                  repairType: this.afterSalesData.repairType,
                  picList,
                  type: "5",
                }
              )
              .then((res) => {
                if (res.data.result == "success") {
                  this.$router.push({
                    path: "/bulk_after_sales_detail",
                    query: {
                      id: JSON.parse(res.data.data.id),
                    },
                  });
                  this.$toast("申请成功，请耐心等待审核");
                }
              });
          }
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
  background-color: #F6F6F6 !important;
}

.after {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #F6F6F6;
}

.afterSalesEdit {
  padding: 10px 10px 20px;
  background-color: #F6F6F6;
  font-family: PingFangSC-Regular, PingFang SC;
  letter-spacing: 1px;

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

      .select_icon {
        width: 7px;
        height: 12.5px;
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

            .delet_btn {
              width: 46px;
              height: 18.5px;
              background: #B52232;
              border-radius: 14px;
              text-align: center;
              line-height: 18.5px;
              font-size: 12px;
              font-weight: 400;
              color: #FFFFFF;
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
    height: 303px;
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

    textarea {
      width: 100%;
      height: 143px;
      border: none;
      resize: none;
      outline: none;
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      line-height: 20px;
    }

    .photo_btn {
      width: 76.5px;
      height: 76.5px;
      border-radius: 7px;
      border: 1px solid #CCCBCB;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      padding: 9.5px 0 8.5px;
      font-size: 12px;
      font-weight: 400;
      color: #CCCBCB;
      line-height: 16.5px;

      img {
        width: 40.5px;
        height: 33.5px;
        margin-bottom: 8.5px;
      }
    }
  }

  .submit_btn {
    width: 307.5px;
    height: 37.5px;
    background: #B52232;
    box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 5px;
    text-align: center;
    line-height: 37.5px;
    font-size: 15px;
    font-weight: 600;
    color: #FFFFFF;
    margin: 10px auto 0;
  }

  .select_type {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .select_type_title {
      padding: 10px 20px 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
      color: #000000;
      line-height: 20px;
      border-bottom: 1px solid #EEEDED;

      div {
        margin: 0 auto;
      }

      img {
        width: 13px;
        height: 13px;
      }
    }

    /deep/.van-button {
      width: 100%;
      height: 1.04rem;
      border: none;
      border-bottom: 1px solid #EEEDED;

      .van-button__content {
        width: 100%;

        .van-button__text {
          width: 100%;
        }

        .select_btn {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          line-height: 20px;

          img {
            width: 16.5px;
            height: 11px;
          }

          .current {
            font-size: 14px;
            font-weight: 400;
            color: #B52232;
            line-height: 20px;
          }
        }
      }
    }
  }
}
</style>


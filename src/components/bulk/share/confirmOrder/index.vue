<template>
  <!-- // created by hjc 分享确认订单 -->
  <div class="confirm_order" ref="confirmOrder">
    <div class="user_info">
      <div class="info">
        <span>提货人：</span>
        <input type="text" placeholder="姓名" v-model="userName" />
        <input
          type="number"
          placeholder="请输入手机号"
          v-model.number="userPhone"
        />
      </div>
      <div class="pick_up_way">
        <span> 提货方式：</span>
        <span>自提</span>
      </div>
    </div>
    <div class="pick_up_address">
      <div class="addres_title">
        <div class="addres_title_text">团购提货地点</div>
        <div class="line"></div>
      </div>
      <div class="addres_info">
        <img :src="shareData.headAvtUrl" alt="" />
        <div class="addres_info_detail">
          <div class="colonel_name">团长名称：{{ shareData.headUser }}</div>
          <div class="addres">提货地址：{{ shareData.place }}</div>
        </div>
      </div>
    </div>
    <div class="goods_info">
      <div class="goods_title">
        <div class="goods_title_text">商品信息</div>
        <div class="line"></div>
      </div>
      <div class="goods_item" v-for="(item, index) in goodsList" :key="index">
        <div class="goods_info_item">
          <img :src="item.skuPicUrl" alt="" />
          <div class="goods_info_detail">
            <div class="goods_name">{{ item.skuName }}</div>
            <div class="sell_price">销售价格：¥{{ item.crossedPrice }}</div>
            <div class="count_price">
              <div class="bulk_price">团购价格：¥{{ item.groupPrice }}</div>
              <div class="count">共{{ item.count }}件</div>
            </div>
          </div>
        </div>
        <div class="line" v-show="index !== goodsList.length <= 3"></div>
      </div>
      <img
        :src="require('./images/more_icon.png')"
        alt=""
        class="more"
        v-if="isShowMore"
        @click="showMore"
      />
      <div class="goods_detail" v-else>
        <div class="sell_price_statistics">¥{{ crossedPrice }}</div>
        <div class="bulk_price_statistics">团购价格：¥{{ totalPrice }}</div>
      </div>
    </div>
    <div class="remark">
      <span>订单备注</span>
      <textarea
        ref="textarea"
        :style="{ height: textareaHeight }"
        v-model="textareaValue"
      ></textarea>
    </div>
    <!-- 用来实现浏览器随着内容输入滚动   勿删 -->
    <div ref="nullBox"></div>
    <div class="pay_now">
      <div class="pay_price">¥{{ totalPrice }}</div>
      <div class="pay" @click="pay">立即支付</div>
    </div>
  </div>
</template>

<script>
import calcTextareaHeight from "../../utils/calcTextareaHeight"; //element 文本域自适应大小
import util from "@/utils/util.js";
export default {
  name: "confirmOrder",
  props: {},
  data() {
    return {
      goodsList: [],
      isShowMore: true,
      textareaHeight: "20px",
      textareaValue: "",
      userPhone: "13611111111",
      userName: "hj",
      shareData: {},
      purchaseId: "",
      chiefId: "",
      userId: "",
      activityName: "",
    };
  },
  created() {
    this.shareData = JSON.parse(this.$route.query.shareData);
    this.purchaseId = JSON.parse(this.$route.query.purchaseId);
    this.chiefId = JSON.parse(this.$route.query.chiefId);
    this.userId = JSON.parse(this.$route.query.userId);
    this.activityName = JSON.parse(this.$route.query.activityName);
    if (this.checkList.length > 3) {
      this.goodsList.push(this.checkList[0]);
      this.goodsList.push(this.checkList[1]);
      this.goodsList.push(this.checkList[2]);
      this.isShowMore = true;
    } else {
      this.goodsList = this.checkList;
      this.isShowMore = false;
    }
    console.log(this.checkList);
  },
  methods: {
    showMore() {
      this.goodsList = this.checkList;
      this.isShowMore = false;
    },
    //实现文本域自适应大小
    getHeight() {
      this.textareaHeight = calcTextareaHeight(
        this.$refs.textarea,
        1,
        null
      ).height;
      //浏览器随着内容大小滚动
      this.$refs.confirmOrder.scrollTop = this.$refs.nullBox.offsetTop;
    },
    pay() {
      if (this.userName !== "") {
        if (util.checkMobile(this.userPhone)) {
          let preProductSkuInfoList = [];
          this.checkList.forEach((e) => {
            preProductSkuInfoList.push({
              skuId: e.skuId,
              buyNumber: e.count,
            });
          });
          console.log(this.checkList);
          this.$http
            .post("/app/json/group_buying_order/createGroupBuyingOrder", {
              activityNo: this.purchaseId,
              teamLeaderNo: this.chiefId,
              deliveryMode: 2,
              consigneeName: this.userName,
              consigneePhoneNumber: this.userPhone,
              preProductSkuInfoList,
              remark: this.textareaValue,
            })
            .then((res) => {
              if (res.data.result == "success") {
                this.$router.push({
                  path: "/mall2/checkstand",
                  query: {
                    isBulk: JSON.stringify(true),
                    bulkData: JSON.stringify({
                      tradeNo: res.data.data.tradeNo,
                      orderType: res.data.data.orderType,
                      occurOuCode: res.data.data.occurOuCode,
                      orderId: res.data.data.orderId,
                      shoppingOrderId: res.data.data.shoppingOrderId,
                      payAmount: res.data.data.payAmount,
                    }),
                  },
                });
              }
            });
        } else {
          this.$toast("请输入正确的手机号码");
        }
      } else {
        this.$toast("请输入提货人姓名");
      }
    },
  },
  watch: {
    textareaValue() {
      //限定150字
      if (this.textareaValue.length <= 150) {
        this.getHeight();
      } else {
        this.textareaValue = String(this.textareaValue).slice(0, 150);
      }
    },
  },
  computed: {
    crossedPrice() {
      let price = this.checkList.reduce((pre, item) => {
        return item.count * item.groupPrice + pre;
      }, 0);
      return this.$util.toDecimal2(price);
    },
    totalPrice: {
      get() {
        return this.$store.state.bulkTotalPrice;
      },
      set() {},
    },
    checkList: {
      get() {
        return this.$store.state.bulkCheckList;
      },
      set() {},
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

.confirm_order {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 10px 10px 61px;
  background-color: #F6F6F6;
  font-family: PingFangSC-Medium, PingFang SC;
  background-image: url('./images/background.png');
  background-position: 0 -60px;
  background-size: 100% 135.5px;
  background-repeat: no-repeat;

  .line {
    width: 315px;
    height: 1px;
    background-color: #EEEDED;
  }

  .user_info {
    width: 100%;
    height: 70px;
    background: #FFFFFF;
    box-shadow: 0px 2px 11px 3px rgba(210, 207, 207, 0.5);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 10px 20px;

    .info {
      display: flex;
      justify-content: flex-start;
      align-content: center;
      align-items: center;

      span {
        width: 61.5px;
        height: 20px;
        font-size: 14px;
        font-weight: 500;
        color: #424242;
        line-height: 20px;
      }

      input {
        width: 125.5px;
        border-right: 1px solid #D8D7D7;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: #424242;
        line-height: 20px;
        letter-spacing: 1px;
      }

      input:last-child {
        border: none;
      }

      input::-webkit-input-placeholder {
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
      }
    }

    .pick_up_way {
      margin-top: 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      span {
        font-size: 14px;
        font-weight: 500;
        color: #424242;
        line-height: 20px;
        letter-spacing: 1px;
      }

      span:last-child {
        font-weight: 400;
        letter-spacing: 1px;
        margin-left: 15px;
      }
    }
  }

  .pick_up_address {
    width: 100%;
    height: 165px;
    background: #FFFFFF;
    box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    padding: 10px 10px 10px 20px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .addres_title {
      .addres_title_text {
        padding-bottom: 9.5px;
        font-size: 14px;
        font-weight: 500;
        color: #424242;
        line-height: 20px;
      }
    }

    .addres_info {
      display: flex;
      justify-content: flex-start;
      padding-top: 9.5px;

      img {
        width: 105px;
        height: 105px;
        margin-right: 10px;
      }

      .addres_info_detail {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-top: 12px;

        .colonel_name {
          font-size: 14px;
          font-weight: 400;
          color: #424242;
          line-height: 20px;
          letter-spacing: 1px;
          margin-bottom: 19.5px;
        }

        .addres {
          font-size: 14px;
          font-weight: 600;
          color: #424242;
          line-height: 20px;
          letter-spacing: 1px;
        }
      }
    }
  }

  .goods_info {
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    padding: 10px 7px 10px 20px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .goods_title {
      .goods_title_text {
        padding-bottom: 9.5px;
        font-size: 14px;
        font-weight: 500;
        color: #424242;
        line-height: 20px;
      }
    }

    .goods_item {
      padding-top: 9.5px;

      .goods_info_item {
        display: flex;
        justify-content: flex-start;
        padding-bottom: 9.5px;

        img {
          width: 105px;
          height: 105px;
          margin-right: 10px;
        }

        .goods_info_detail {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding-top: 12px;

          .goods_name {
            font-size: 14px;
            font-weight: 400;
            color: #424242;
            line-height: 20px;
            letter-spacing: 1px;
            margin-bottom: 24.5px;
          }

          .sell_price {
            font-size: 13px;
            font-weight: 400;
            color: #666666;
            line-height: 18.5px;
            letter-spacing: 1px;
            margin-bottom: 4px;
            text-decoration: line-through;
          }

          .count_price {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .bulk_price {
              font-size: 14px;
              font-weight: 600;
              color: #424242;
              line-height: 20px;
              letter-spacing: 1px;
            }

            .count {
              font-size: 14px;
              font-weight: 400;
              color: #E1DDDD;
              line-height: 20px;
              letter-spacing: 1px;
            }
          }
        }
      }
    }

    .more {
      width: 20px;
      height: 20px;
      margin: 10px auto 0;
    }

    .goods_detail {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 10px 0 0;

      .sell_price_statistics {
        font-size: 12px;
        font-weight: 400;
        color: #C3C2C2;
        line-height: 16.5px;
        letter-spacing: 1px;
        text-decoration: line-through;
      }

      .bulk_price_statistics {
        font-size: 14px;
        font-weight: 600;
        color: #E35161;
        line-height: 20px;
        letter-spacing: 1px;
        margin-left: 13.5px;
      }
    }
  }

  .remark {
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0px 2px 11px 3px rgba(210, 207, 207, 0.5);
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    // align-items: center;
    margin-top: 10px;
    padding: 14.5px 20px 14.5px 20px;

    span {
      font-size: 14px;
      font-weight: 500;
      color: #424242;
      line-height: 20px;
      letter-spacing: 1px;
      margin-right: 10px;
    }

    textarea {
      flex: 1;
      font-size: 14px;
      font-weight: 400;
      color: #424242;
      line-height: 20px;
      letter-spacing: 1px;
      outline: none;
      resize: none;
      // height: 143px;
      border: none;
    }
  }

  .pay_now {
    width: 100%;
    height: 49px;
    background: #FFFFFF;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 11px 20px 10.5px 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .pay_price {
      font-size: 16px;
      font-weight: 600;
      color: #000000;
      line-height: 22.5px;
      letter-spacing: 1px;
      margin-right: 15px;
    }

    .pay {
      width: 86px;
      height: 27.5px;
      background: #B52232;
      border-radius: 14px;
      font-size: 13px;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 27.5px;
      letter-spacing: 1px;
      text-align: center;
    }
  }
}
</style>


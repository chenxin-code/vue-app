<template>
  <!-- // created by hjc 分享确认订单 -->
  <div class="confirm_order" ref="confirmOrder">
    <div class="scrollBox">
      <div class="user_info">
        <div class="info">
          <span>提货人姓名：</span>
          <input placeholder="请输入姓名" v-model="userName" />
        </div>
        <div class="line"></div>
        <div class="info">
          <span>联系人电话：</span>
          <input
            placeholder="请输入联系人电话"
            v-model.number="userPhone"
            type="number"
          />
        </div>
        <!-- <div class="pick_up_way">
        <span> 提货方式：</span>
        <span>自提</span>
      </div> -->
      </div>
      <div class="pick_up_address">
        <div class="addres_title">
          <div class="addres_title_text">
            <span></span>
            团购提货地点
          </div>
          <!-- <div class="change" @click="$router.push('/selectAddress')">
          切换提货地址
          <img :src="require('./activity/images/button_next_default.png')" alt="">
        </div> -->
        </div>
        <div class="line"></div>
        <div class="addres_info">
          <div class="addres_info_detail">
            <div class="addres">
              <div class="adders-key">提货联系人：</div>
              <div class="adders-val">{{ shareData.headUser }}</div>
            </div>
            <div class="addres" style="margin-top: 0.42667rem">
              <div class="adders-key">提货小区：</div>
              <div class="adders-val">
                {{ shareData.communityCityName
                }}{{ shareData.communityDistrictName
                }}{{ shareData.communityName }}
              </div>
            </div>
            <div class="addres" style="margin-top: 0.42667rem">
              <div class="adders-key">详细地址：</div>
              <div class="adders-val">{{ shareData.place }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods_info" v-for="(item, index) in goodsList" :key="index">
        <div class="goods_title">
          <div class="goods_title_text">
            <span></span>
            商品信息
          </div>
          <div class="line"></div>
        </div>
        <div class="goods_item">
          <div class="goods_info_item">
            <img :src="item.skuPicUrl.split(',')[0]" alt="" />
            <div class="goods_info_detail">
              <div class="goods_name">{{ item.skuName }}</div>
              <div class="sell_price">销售价格：¥{{ item.crossedPrice }}</div>
              <div class="count_price">
                <div class="bulk_price">团购价格：¥{{ item.groupPrice }}</div>
                <div class="count">共{{ item.count }}件</div>
              </div>
            </div>
          </div>
          <!-- <div class="line" v-show="index !== goodsList.length <= 3"></div> -->
        </div>
        <!-- <img
        :src="require('./images/more_icon.png')"
        alt=""
        class="more"
        v-if="isShowMore"
        @click="showMore"
      />
      <div class="goods_detail" v-else>
        <div class="sell_price_statistics">¥{{ crossedPrice }}</div>
        <div class="bulk_price_statistics">团购价格：¥{{ totalPrice }}</div>
      </div> -->
      </div>
      <div class="remark">
        <span>订单备注</span>
        <textarea
          ref="textarea"
          :style="{ height: textareaHeight }"
          v-model="textareaValue"
          placeholder="请输入订单备注"
          @input="vaidateEmoji"
        ></textarea>
      </div>
      <!-- 用来实现浏览器随着内容输入滚动   勿删 -->
      <div ref="nullBox"></div>
    </div>
    <div
      class="pay_now"
      :style="{
        paddingBottom: this.$store.state.isX ? '0.98667rem' : '0.64rem',
      }"
    >
      <div class="pay_price">
        <div class="pay_title">应付金额：</div>
        <div class="pay_value">¥{{ totalPrice }}</div>
      </div>
      <div class="pay" @click="pay">立即支付</div>
    </div>
  </div>
</template>

<script>
import calcTextareaHeight from "../../utils/calcTextareaHeight"; //element 文本域自适应大小
import { Toast } from "vant";
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
      userPhone: "",
      userName: "",
      shareData: {},
      purchaseId: "",
      chiefId: "",
      userId: "",
      activityName: "",
    };
  },
  created() {
    Toast.clear();
    this.shareData = JSON.parse(this.$route.query.shareData);
    this.purchaseId = JSON.parse(this.$route.query.purchaseId);
    this.chiefId = JSON.parse(this.$route.query.chiefId);
    this.userId = JSON.parse(this.$route.query.userId);
    // if (this.checkList.length > 3) {
    //   this.goodsList.push(this.checkList[0]);
    //   this.goodsList.push(this.checkList[1]);
    //   this.goodsList.push(this.checkList[2]);
    //   this.isShowMore = true;
    // } else {
    //   this.goodsList = this.checkList;
    //   this.isShowMore = false;
    // }
    this.goodsList = this.checkList;
    console.log(this.shareData);
    this.getUser();
  },
  methods: {
    getUser() {
      this.$http
        .post("/app/json/group_buying_areas/findByRecentUseAddress")
        .then((res) => {
          if (res.data.status == 0) {
            let data = res.data.data;
            this.userPhone =
              data.mobile == ""
                ? this.$store.state.ythUserInfo.phone
                : data.mobile;
            this.userName =
              data.name == ""
                ? this.$store.state.ythUserInfo.userName
                : data.name;
          }
        });
    },
    showMore() {
      this.goodsList = this.checkList;
      this.isShowMore = false;
    },
    vaidateEmoji(e) {
      let value = e.target.value;
      //禁止输入emoji表情，兼容大部分手机
      value = value.replace(
        /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi,
        ""
      );
      value = value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
      value = value.replace(/[\uE000-\uF8FF]/g, "");
      this.textareaValue = value;
      console.log("textareaValue", this.textareaValue);
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
          this.$Loading.open();
          this.$http
            .post("/app/json/group_buying_order/createGroupBuyingOrder", {
              activityNo: this.purchaseId,
              teamLeaderNo: this.chiefId,
              deliveryMode: 0, //0自提1送货上门
              consigneeName: this.userName,
              consigneePhoneNumber: this.userPhone,
              preProductSkuInfoList,
              remark: this.textareaValue,
            })
            .then((res) => {
              this.$Loading.close();
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
              } else {
                this.$toast(res.data.info);
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
        console.log(
          "this.$route.query.checkList",
          JSON.parse(this.$route.query.checkList)
        );
        return JSON.parse(this.$route.query.checkList);
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
  background-color: #f6f6f6 !important;
}

.confirm_order {
  width: 100%;
  height: 100%;
  background-color: #F6F6F6;
  background-image: url('../../activity/images/bg.png');
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: top;
  // overflow: auto;
  overflow: hidden;
  bottom: 49px !important;
  box-sizing: border-box;
  position: relative;

  .scrollBox {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 12px;
    // background-color: rgba(0, 0, 0, 0);
  }

  .line {
    width: 315px;
    height: 1px;
    background-color: #EEEDED;
  }

  .user_info {
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0 2px 11px 3px rgba(210, 207, 207, 0.5);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0 auto 0;
    padding: 22px 24px 22px 28px;
    border-radius: 12px;

    .info {
      display: flex;
      justify-content: flex-start;
      align-content: center;
      align-items: center;

      span {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #121212;
        line-height: 15px;
      }

      input {
        width: 190px;
        font-size: 14px;
        font-weight: 400;
        color: #424242;
        line-height: 20px;
        letter-spacing: 1px;
        margin-left: 10px;
        text-align: right;
      }

      input::-webkit-input-placeholder {
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
        text-align: right;
      }
    }

    .line {
      width: 100%;
      height: 1px;
      background: #F0F0F0;
      margin: 20px 0;
    }

    .pick_up_way {
      margin-top: 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      /deep/ .van-dropdown-menu {
        // margin-left 20px
        // font-size: 14px;
        color: #424242;
        // width: 180px;
        border: none;
        resize: none;
        outline: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
      }

      /deep/ .van-dropdown-menu__bar {
        height: auto;
        -webkit-box-shadow: none;
        box-shadow: none;
      }

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
    background: #FFFFFF;
    box-shadow: 0 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    padding: 20px 25px 20px 18px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-image: url('../../activity/images/card_line_default.png');
    background-repeat: no-repeat;
    background-size: 100% 3px;
    background-position: 0 0;

    .addres_title {
      display: flex;

      // padding-bottom: 17px;
      .addres_title_text {
        flex: 1;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #666666;
        line-height: 16px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;
        white-space: nowrap;

        span {
          display: inline-block;
          width: 4px;
          height: 4px;
          background: #FE4886;
          border-radius: 50%;
          margin-right: 7px;
        }
      }

      .change {
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 300;
        color: #999999;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        img {
          width: 6px;
          height: 10px;
          margin-left: 6px;
        }
      }
    }

    .line {
      width: 315px;
      height: 1px;
      background-color: #EEEDED;
      margin: 17px 0;
    }

    .addres_info {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      textarea {
        font-size: 14px;
        color: #424242;
        width: 100%;
        height: 100px;
        border: none;
        resize: none;
        outline: none;
      }

      img {
        width: 65px;
        height: 65px;
        margin-right: 10px;
        border-radius: 50%;
      }

      .addres_info_detail {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .colonel_name {
          font-size: 14px;
          font-weight: 400;
          color: #424242;
          line-height: 20px;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }

        .addres {
          width: 100%;
          font-size: 14px;
          font-weight: 500;
          color: #424242;
          line-height: 20px;
          letter-spacing: 1px;
          display: flex;
          justify-content: space-between;

          .adders-key {
            width: 84px;
            font-size: 13px;
            font-family: PingFang SC;
            font-weight: 300;
            color: #666666;
            text-align: right;
            white-space: nowrap;
            flex-wrap: nowrap;
          }

          .adders-val {
            // width: 220px;
            flex: 1;
            text-align: left;
            font-size: 13px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #121212;
            // white-space :nowrap;
            // flex-wrap :nowrap;
          }
        }
      }
    }
  }

  .goods_info {
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0 1px 11px 3px rgba(231, 230, 230, 0.5);
    padding: 17px 19px;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: 12px;

    .goods_title {
      .goods_title_text {
        font-size: 14px;
        font-weight: 700;
        color: #424242;
        line-height: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        span {
          display: inline-block;
          width: 4px;
          height: 4px;
          background: #FE4886;
          border-radius: 50%;
          margin-right: 7px;
        }
      }
    }

    .line {
      width: 100%;
      height: 1px;
      background-color: #EEEDED;
      margin: 17px 0 14px;
    }

    .goods_item {
      .stepper {
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      .goods_info_item {
        display: flex;
        justify-content: flex-start;
        padding-left: 12px;

        img {
          width: 70px;
          height: 70px;
          margin-right: 14px;
          object-fit: cover;
        }

        .goods_info_detail {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;

          .goods_name {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #333333;
            line-height: 16px;
          }

          .sell_price {
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: bold;
            text-decoration: line-through;
            color: #999999;
            line-height: 15px;
            text-decoration: line-through;
            margin: 11px 0 9px;
          }

          .count_price {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .bulk_price {
              font-size: 13px;
              font-family: PingFang SC;
              font-weight: bold;
              color: #F00000;
              line-height: 15px;
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
    display: flex;
    justify-content: flex-start;
    // align-items: center;
    margin-top: 10px;
    margin-bottom: 74px;
    padding: 22px 22px 22px 28px;
    width: 351px;
    border-radius: 12px;

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
    // height: 49px;
    background: #FFFFFF;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 8px 22px 24px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .pay_price {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .pay_title {
        font-size: 15px;
        font-weight: 400;
        font-family: PingFang SC;
        color: #121212;
        line-height: 27.5px;
      }

      .pay_value {
        font-size: 15px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #F00000;
      }
    }

    .pay {
      width: 104px;
      height: 39px;
      background: linear-gradient(180deg, #FF7BA6 0%, #E9306D 100%);
      border-radius: 20px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #F4F4F4;
      text-align: center;
      line-height: 39px;
    }
  }
}
</style>

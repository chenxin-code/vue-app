<template>
  <div class="body">
    <nav-top
      bstyle="transparent"
      @backEvent="$router.go(-1)"
      title="确认订单"
    ></nav-top>
    <div class="user_info">
      <div class="info">
        <span>提货人：</span>
        <input placeholder="姓名" v-model="consigneeName" />
        <input placeholder="请输入手机号" v-model="consigneePhoneNumber" />
      </div>
      <div class="pick_up_way">
        <span> 提货方式：</span>
        <van-dropdown-menu active-color="#b52232">
          <van-dropdown-item v-model="takeWay" :options="takeWays" disabled />
        </van-dropdown-menu>
      </div>
    </div>
    <div class="pick_up_address">
      <div class="addres_title">
        <div class="addres_title_text">团购提货地点</div>
        <div class="change" @click="$router.push('/selectAddress')">
          切换提货地址
        </div>
      </div>
      <div class="line"></div>
      <div class="addres_info" v-if="placelist.length">
        <img
          src="https://times-mall-uat.oss-cn-shenzhen.aliyuncs.com/0ed8ff39422447d68f3c16234519df2d.jpg"
          alt=""
        />
        <div class="addres_info_detail">
          <div class="colonel_name">{{ placelist[0].teamLeaderName }}</div>
          <div class="addres">
            提货地址：{{ placelist[0].cucName }}{{ placelist[0].cudName
            }}{{ placelist[0].cuName }}
          </div>
        </div>
      </div>
    </div>
    <div class="pick_up_address" v-show="false">
      <div class="addres_title">
        <div class="addres_title_text">团购提货地点</div>
      </div>
      <div class="line"></div>
      <div class="addres_info">
        <textarea placeholder="" />
      </div>
    </div>
    <div class="goods_info">
      <div class="goods_title">
        <div class="goods_title_text">商品信息</div>
        <div class="line"></div>
      </div>
      <div class="goods_item">
        <div class="goods_info_item">
          <img :src="resouce.groupbuySkuPicurl" alt="" />
          <div class="goods_info_detail">
            <div class="goods_name">{{ resouce.groupbuySkuName }}</div>
            <div class="sell_price">
              销售价格：¥{{ resouce.groupbuyLinePrice }}
            </div>
            <div class="count_price">
              <div class="bulk_price">
                团购价格：¥{{ resouce.groupbuyBuyerPrice }}
              </div>
              <div class="count">共一件</div>
            </div>
          </div>
        </div>
        <div class="stepper">
          <van-stepper
            v-model.number="buyNumber"
            @change="buyChange($event, resouce.groupbuyBuyerPrice)"
          />
        </div>
        <div class="line"></div>
      </div>
      <!-- <div class="goods_detail">
        <div class="sell_price_statistics">¥{{ resouce.groupbuyLinePrice }}</div>
        <div class="bulk_price_statistics">团购价格：¥{{ resouce.groupbuyBuyerPrice }}</div>
      </div> -->
    </div>
    <div class="remark">
      <span>订单备注</span>
      <textarea
        ref="textarea"
        :style="{ height: textareaHeight }"
        v-model="textareaValue"
      ></textarea>
    </div>
    <div class="pay_now">
      <div class="pay_price">¥{{ total }}</div>
      <div class="pay" @click="confirmOrder">立即支付</div>
    </div>
  </div>
</template>

<script>
import calcTextareaHeight from "./utils/calcTextareaHeight.js"; //element 文本域自适应大小
import { DropdownMenu, DropdownItem } from "vant";
import Vue from "vue";
import { Stepper } from "vant";
import { BigNumber } from "bignumber.js";
Vue.use(Stepper);
export default {
  name: "confirmOrder",
  components: {
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
  },
  props: {},
  data() {
    return {
      placelist: [],
      resouce: {},
      buyNumber: 1,
      textareaHeight: "20px",
      textareaValue: "",
      consigneeName: "",
      consigneePhoneNumber: "",
      total: 0,
      takeWays: [
        { text: "自提", value: 1 },
        { text: "送货上门", value: 2 },
      ],
      takeWay: 1,
    };
  },
  created() {
    this.getPlaceList();
    this.resouce = this.$store.state.CharseInfo;
    console.log(this.$store.state.CharseInfo.masterPlace);
    this.total = BigNumber(this.buyNumber)
      .multipliedBy(this.$store.state.CharseInfo.groupbuyBuyerPrice)
      .toFixed(2);
  },
  methods: {
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
    confirmOrder() {
      this.$http
        .post("/app/json/group_buying_order/createGroupBuyingOrder", {
          activityNo: this.$store.state.CharseInfo.activityId,
          teamLeaderNo: this.$store.state.CharseInfo.masterPlace.teamLeaderNo,
          deliveryMode: 2,
          consigneeName: this.consigneeName,
          consigneePhoneNumber: this.consigneePhoneNumber,
          preProductSkuInfoList: [
            {
              skuId: this.$store.state.CharseInfo.skuid,
              buyNumber: this.buyNumber,
            },
          ],
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
    },
    getPlaceList() {
      let url = `/app/json/group_buying_head_info/findHeadInfoByList?validState=true&sortBy:headWeight_DESC&activityId=${this.$store.state.CharseInfo.activityId}`;
      this.$http
        .get(url)
        .then((res) => {
          if (res.data.status == 0) {
            if (this.$store.state.CharseInfo.masterPlace) {
              this.placelist = [this.$store.state.CharseInfo.masterPlace];
            } else {
              this.placelist = res.data.data.records;
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    buyChange(num, val) {
      this.total = BigNumber(val).multipliedBy(num).toFixed(2);
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
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.body {
  background-color: #F6F6F6;
  background-image: url('./activity/images/bg.png');
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: top;
  padding: 10px;
  // overflow: auto;
  overflow-y: auto;
  bottom: 49px !important;
  box-sizing: border-box;
  overflow-x: hidden;

  .line {
    width: 315px;
    height: 1px;
    background-color: #EEEDED;
  }

  .user_info {
    width: 100%;
    height: 70px;
    background: #FFFFFF;
    box-shadow: 0 2px 11px 3px rgba(210, 207, 207, 0.5);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin: 70px auto 0;
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
    height: 165px;
    background: #FFFFFF;
    box-shadow: 0 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    padding: 10px 10px 10px 20px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .addres_title {
      display: flex;

      .addres_title_text {
        flex: 1;
        padding-bottom: 9.5px;
        font-size: 14px;
        font-weight: 500;
        color: #424242;
        line-height: 20px;
      }

      .change {
        line-height: 20px;
        color: #a9a9a9;
      }
    }

    .addres_info {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-top: 9.5px;

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
          margin-bottom: 10px;
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
    box-shadow: 0 1px 11px 3px rgba(231, 230, 230, 0.5);
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
        font-weight: 700;
        color: #424242;
        line-height: 20px;
      }
    }

    .goods_item {
      padding-top: 9.5px;

      .stepper {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

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


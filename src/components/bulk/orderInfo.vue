<template>
  <div class="body" ref="confirmOrder">
    <nav-top
      bstyle="transparent"
      @backEvent="$router.go(-1)"
      :title="navTopTitle"
    ></nav-top>
    <div class="user_info">
      <div class="info">
        <span>提货人姓名：</span>
        <input v-model="consigneeName" disabled />
      </div>
      <div class="info" style="margin-top: 12px">
        <span>联系人电话：</span>
        <input v-model="consigneePhoneNumber" disabled />
      </div>
    </div>
    <div class="pick_up_address">
      <div class="addres_title">
        <div class="addres_title_text">团购提货地点</div>
        <!-- <div class="change" @click="$router.push('/selectAddress')">
          切换提货地址
        </div> -->
      </div>
      <div class="line"></div>
      <div class="addres_info">
        <!-- <img :src="placelist[0].teamLeaderAvatar" alt="" /> -->
        <div class="addres_info_detail">
          <div class="addres">
            <div class="adders-key">提货联系人：</div>
            <div class="adders-val">{{ orderInfo.headName }} {{ orderInfo.headContactTel }}</div>
          </div>
          <div class="addres" style="margin-top: 10px">
            <div class="adders-key">提货地址：</div>
            <div class="adders-val">{{ orderInfo.pickupAddress }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="pick_up_address" v-show="false">
      <div class="addres_title">
        <div class="addres_title_text">团购提货地点</div>
      </div>
      <div class="line"></div>
      <div class="addres_info">
        <textarea placeholder="" />
      </div>
    </div> -->
    <div class="goods_info">
      <div class="goods_title">
        <div class="goods_title_text">商品信息</div>
        <div class="line"></div>
      </div>
      <div
        class="goods_item"
        v-for="(item, index) in orderInfo.skuModelList"
        :key="index"
      >
        <div class="goods_info_item">
          <img :src="item.groupbuySkuPicurl.split(',')[0]" alt="" />
          <div class="goods_info_detail">
            <div class="goods_name">{{ item.groupbuySkuName }}</div>
            <div class="sell_price">
              销售价格：¥{{ item.groupbuyLinePrice }}
            </div>
            <div class="count_price">
              <div class="bulk_price">
                团购价格：¥{{ item.groupbuyBuyerPrice }}
              </div>
              <!-- <div class="count">共一件</div> -->
            </div>
          </div>
        </div>
        <div class="stepper">
          <van-stepper
            v-model.number="item.buyNumber"
            @change="buyChange($event, resouce.groupbuyBuyerPrice)"
            disabled
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
      <span>订单备注：</span>
      <textarea
        ref="textarea"
        :style="{ minHeight: textareaHeight }"
        v-model="textareaValue"
        disabled
      ></textarea>
    </div>
    <!-- 用来实现浏览器随着内容输入滚动   勿删 -->
    <div ref="nullBox"></div>
    <div class="pay_now" v-show="this.pageType == 'waitPay'">
      <div class="pay_price">¥{{ total }}</div>
      <div class="pay" @click="confirmOrder">立即支付</div>
    </div>

    <!-- <div class="customerService" @click="handleCustomer">
      <img :src="customerService" alt="">
    </div> -->
  </div>
</template>

<script>
import calcTextareaHeight from "./utils/calcTextareaHeight.js"; //element 文本域自适应大小
import { DropdownMenu, DropdownItem } from "vant";
import Vue from "vue";
import { Stepper } from "vant";
import { BigNumber } from "bignumber.js";
Vue.use(Stepper);
import util from "@/utils/util.js";
const titleData = {
    cancel: "社区团购·拼团失败",
    waitDelivery: "社区团购·待发货",
    waitPay: "社区团购·确认订单",
    waitTakeDelivery: "社区团购·待收货",
    finish: {
        '16':"社区团购·待发货",
        '17':"社区团购·待发货",
        '18':"社区团购·待发货",
        '19':"社区团购·待发货",
        '4':"社区团购·待收货",
        '9':"社区团购·已完成",
        '7':"社区团购·拼团失败",
        '12':"社区团购·拼团失败",
    },
};
export default {
  name: "confirmOrder",
  components: {
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
  },
  props: {},
  data() {
    return {
      customerService:require('../../../static/images/service.png'),
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
      pageAvtive: false,
      info: {},
      pageType:"",
      navTopTitle:"",
      state:"",
      orderInfo:{},
    };
  },
  created() {
    this.info = JSON.parse(this.$route.query.info);
    this.pageType = this.$route.query.pageType;
    this.state = this.$route.query.state;
    this.initInfo();
    if(this.pageType == "finish"){
        this.navTopTitle = titleData[this.pageType][this.state];
    }else{
        this.navTopTitle = titleData[this.pageType];
    };
  },
//   activated() {
//     if (this.pageAvtive) {
//       console.log("sss");
//       this.placelist = [this.$store.state.CharseInfo.masterPlace];
//     } else {
//       console.log("xxx");
//       this.getPlaceList();
//       this.resouce = this.$store.state.CharseInfo;
//       this.total = BigNumber(this.buyNumber)
//         .multipliedBy(this.$store.state.CharseInfo.groupbuyBuyerPrice)
//         .toFixed(2);
//     }
//   },
//   beforeRouteLeave(to, form, next) {
//     if (to.path == "/mall2/checkstand") {
//       console.log("aaa");
//       this.pageAvtive = true;
//     } else {
//       this.pageAvtive = false;
//     }
//     next();
//   },
  methods: {
    // 唤起客服
    handleCustomer: function() {
      ysf('config', {
        uid: this.$store.state.userInfo.userId,
        name: this.$store.state.userInfo.nickName,
        email:'',
        mobile: this.$store.state.userInfo.phone,
        data: this.$store.state.userLable,
        success: function(){     // 成功回调
          ysf('open');
        },
        error: function(){       // 错误回调
          // handle error
        }
      })
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
    initInfo() {
      this.$http
        .post("/app/json/app_community_group_order/queryByShoppingOrderId", {
          groupbuyOrderId: this.info.shoppingOrderId,
        })
        .then((res) => {
          if (res.data.status == 0) {
            this.orderInfo = res.data.data;
            this.consigneeName = this.orderInfo.receiptName;
            this.consigneePhoneNumber = this.orderInfo.receiptTel;
            this.total = this.orderInfo.totalPrice;
            this.textareaValue = this.orderInfo.orderRemark;
            this.$nextTick(()=>{
              this.getHeight();
            })
          }
        });
    },
    confirmOrder() {
    //   let preProductSkuInfoList = [];
    //   this.orderInfo.skuModelList.forEach((e) => {
    //     preProductSkuInfoList.push({
    //       skuId: e.groupbuySkuId,
    //       buyNumber: e.buyNumber,
    //     });
    //   });
    //   this.$http
    //     .post("/app/json/group_buying_order/createGroupBuyingOrder", {
    //       //   activityNo: this.$store.state.CharseInfo.activityId,
    //       //   teamLeaderNo: this.$store.state.CharseInfo.masterPlace
    //       //     .teamLeaderNo,
    //       //   deliveryMode: 0, //0自提1送货上门
    //       //   consigneeName: this.consigneeName,
    //       //   consigneePhoneNumber: this.consigneePhoneNumber,
    //       //   preProductSkuInfoList: [
    //       //     {
    //       //       skuId: this.$store.state.CharseInfo.skuid,
    //       //       buyNumber: this.buyNumber,
    //       //     },
    //       //   ],
    //       //   remark: this.textareaValue,
    //       activityNo: this.orderInfo.groupbuyActivityId,
    //       teamLeaderNo: this.orderInfo.headId,
    //       deliveryMode: 0, //0自提1送货上门
    //       consigneeName: this.orderInfo.receiptName,
    //       consigneePhoneNumber: this.orderInfo.receiptTel,
    //       preProductSkuInfoList: preProductSkuInfoList,
    //       remark: this.orderInfo.orderRemark,
    //     })
    //     .then((res) => {
    //       if (res.data.result == "success") {
    //         this.$router.push({
    //           path: "/mall2/checkstand",
    //           query: {
    //             isBulk: JSON.stringify(true),
    //             bulkData: JSON.stringify({
    //               tradeNo: res.data.data.tradeNo,
    //               orderType: res.data.data.orderType,
    //               occurOuCode: res.data.data.occurOuCode,
    //               orderId: res.data.data.orderId,
    //               shoppingOrderId: res.data.data.shoppingOrderId,
    //               payAmount: res.data.data.payAmount,
    //             }),
    //           },
    //         });
    //       } else {
    //         this.$toast(res.data.info);
    //       }
    //     });

        this.$router.push({
            path: "/mall2/checkstand",
            query: {
                isBulk: JSON.stringify(true),
                bulkData: JSON.stringify({
                    tradeNo: this.info.tradeNo,
                    orderType: '200502',
                    occurOuCode: this.orderInfo.skuModelList[0].storeOuCode,
                    orderId: this.info.id,
                    shoppingOrderId: this.info.id,
                    payAmount: this.orderInfo.totalPrice,
                }),
            },
        });
    },
    // getPlaceList() {
    //   let url = `/app/json/group_buying_head_info/findHeadInfoByList?validState=true&sortBy:headWeight_DESC&activityId=${this.$store.state.CharseInfo.activityId}`;
    //   this.$http
    //     .get(url)
    //     .then((res) => {
    //       if (res.data.status == 0) {
    //         if (this.$store.state.CharseInfo.masterPlace) {
    //           this.placelist = [this.$store.state.CharseInfo.masterPlace];
    //         } else {
    //           this.placelist = res.data.data.records;
    //           this.$store.commit("setCharseInfo", {
    //             masterPlace: this.placelist[0],
    //           });
    //           console.log(this.placelist);
    //         }
    //       }
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //     });
    // },
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

  .customerService{
    position: fixed;
    width: 42px;
    height : 42px;
    right: 0;
    bottom: 112px;
    img{
      width 100%;
      height 100%;
    }
  }

.body {
  width: 100%;
  height: 100%;
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
  position: relative;

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
    justify-content: flex-start;
    margin: 70px auto 0;
    padding: 12px 20px;

    .info {
      display: flex;
      justify-content: flex-start;
      align-content: center;
      align-items: center;

      span {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #424242;
      }

      input {
        width: 220px;
        border-right: 1px solid #D8D7D7;
        font-size: 14px;
        font-weight: 400;
        color: #424242;
        line-height: 20px;
        letter-spacing: 1px;
        margin-left: 10px;
        background: #fff;
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
    background: #FFFFFF;
    box-shadow: 0 1px 11px 3px rgba(231, 230, 230, 0.5);
    border-radius: 10px;
    padding: 14px 16px;
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
        font-weight: 600;
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
          font-weight: 500;
          color: #424242;
          line-height: 20px;
          letter-spacing: 1px;
          display: flex;

          .adders-key {
            width: 90px;
            font-weight: bolder;
          }

          .adders-val {
            width: 230px;
          }
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
    margin-bottom: 50px;
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
      background: #fff;
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

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
      <div class="line"></div>
      <div class="info">
        <span>联系人电话：</span>
        <input v-model="consigneePhoneNumber" disabled />
      </div>
    </div>
    <div class="pick_up_address">
      <div class="addres_title">
        <div class="addres_title_text">
          <span></span>
          团购提货地点
        </div>
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
          <div class="addres" style="margin-top: 0.42667rem">
            <div class="adders-key">提货小区：</div>
            <div class="adders-val">{{ orderInfo.pickupCityName }}{{ orderInfo.pickupDistrictName }}{{ orderInfo.communityName }}</div>
          </div>
          <div class="addres" style="margin-top: 0.42667rem">
            <div class="adders-key">详细地址：</div>
            <div class="adders-val">
              {{orderInfo.pickupAddress}}
          </div>
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
    <div class="goods_info" v-for="(item, index) in orderInfo.skuModelList" :key="index">
      <div class="goods_title">
        <div class="goods_title_text">
          <span></span>
          商品信息
        </div>
        <div class="line"></div>
      </div>
      <div
        class="goods_item"
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
            theme="round"
            button-size="0.64rem"
          />
        </div>
        <!-- <div class="line"></div> -->
      </div>
      <!-- <div class="goods_detail">
        <div class="sell_price_statistics">¥{{ resouce.groupbuyLinePrice }}</div>
        <div class="bulk_price_statistics">团购价格：¥{{ resouce.groupbuyBuyerPrice }}</div>
      </div> -->
    </div>
    <div class="remark">
      <span>备注：</span>
      <textarea
        ref="textarea"
        :style="{ height: textareaHeight }"
        v-model="textareaValue"
        disabled
      ></textarea>
    </div>
    <!-- 用来实现浏览器随着内容输入滚动   勿删 -->
    <div ref="nullBox"></div>
    <div class="pay_now" v-show="this.pageType == 'waitPay'" :style="{paddingBottom:this.$store.state.isX?'0.98667rem':'0.64rem'}">
      <div class="pay_price">
        <div class="pay_title">应付金额：</div>
        <div class="pay_value">¥{{ total }}</div>
      </div>
      <div class="pay" @click="confirmOrder">立即支付</div>
    </div>

    <div class="customerService" @click="handleCustomer">
      <img :src="customerService" alt="">
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
    // TODO
    // 唤起客服
    handleCustomer: function() {
      const that = this;
      console.log('----handleCustomer--->');
      console.log('----handleCustomer--->', that.orderInfo);
      ysf('config', {
        uid: this.$store.state.userInfo.userId,
        name: this.$store.state.userInfo.nickName,
        email:'',
        mobile: this.$store.state.userInfo.phone,
        data: this.$store.state.userLable,
        success: function(){     // 成功回调
          // ysf('open');
          ysf("product", {
            show: 1,
            title: that.orderInfo.groupbuyActivityName,
            desc: `价格：¥ ${that.orderInfo.skuModelList[0].groupbuyLinePrice}`,
            picture: that.orderInfo.skuModelList[0].groupbuySkuPicurl.split(',')[0],
            //   url: "跳转链接",
            success: function() {
              // 成功回调
              ysf("open");
            },
            error: function() {}
          });
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
            if(this.textareaValue !== ''){
              this.$nextTick(()=>{
                this.getHeight();
              })
            }
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

.router_class{
  background-color: #f6f6f6 !important;
}
.body {
  width: 100%;
  height: 100%;
  background-color: #F6F6F6;
  background-image: url('./activity/images/bg.png');
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: top;
  padding: 12px;
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
    justify-content: space-between;
    margin: 70px auto 0;
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
        background-color: #fff;
      }

      input::-webkit-input-placeholder {
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
        text-align: right;
      }
    }
    .line{
      width: 100%;
      height 1px;
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
    background-image:url('./activity/images/card_line_default.png');
    background-repeat: no-repeat;
    background-size :100% 3px;
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
          margin-right:7px;
        }
      }

      .change {
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 300;
        color: #999999;
        display: flex;
        justify-content :flex-start;
        align-items :center;
        img{
          width :6px;
          height :10px;
          margin-left: 6px;
        }
      }
    }

    .line {
      width: 315px;
      height: 1px;
      background-color: #EEEDED;
      margin:17px 0;
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
        display :flex;
        justify-content :flex-start;
        align-items: center;

        span {
          display :inline-block;
          width: 4px;
          height: 4px;
          background: #FE4886;
          border-radius: 50%;
          margin-right :7px;
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
        padding-left:12px;

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
            margin:11px 0 9px;
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
    margin-bottom: 94px;
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
      background-color: #fff;
    }
  }

  .pay_now {
    width: 100%;
    // height: 49px;
    background: #FFFFFF;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 8px 22px 24px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .pay_price {
      display :flex;
      justify-content: flex-start;
      align-items: center;
      .pay_title{
        font-size: 15px;
        font-weight: 400;
        font-family: PingFang SC;
        color: #121212;
        line-height: 27.5px;
      }
      .pay_value{
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
      line-height :39px;
    }
  }
  
}
</style>

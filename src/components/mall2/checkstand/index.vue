/**Created by liaoyingchao on 2018/11/10.*/

<template>
  <div class="index mall2">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="block-div">
        <div>
          <div class="flex-row">
            <div class="theme_font_common">
              需支付：
              <span class="font-small theme_font_red">￥</span>
              <span class="price-z theme_font_red" v-if="!isBulk">{{
                payInfo.dpedData.integer
              }}</span>
              <span
                class="left-no-space font-small theme_font_red"
                v-if="!isBulk"
                >.{{ payInfo.dpedData.decimals }}</span
              >
              <span class="price-z theme_font_red" v-if="isBulk">{{
                $util.toDecimal2(bulkData.payAmount)
              }}</span>
            </div>
          </div>
          <div class="flex-row">
            <div class="theme_font_common" v-if="!isBulk">
              交易号：{{ payInfo.tradeNo }}
            </div>
            <div class="theme_font_common" v-else>
              交易号：{{ bulkData.tradeNo }}
            </div>
          </div>
        </div>
      </div>
      <div class="block-div">
        <div class="flex-row">
          <div class="title">支付方式</div>
        </div>
        <div
          class="flex-row"
          v-for="item in payWay"
          @click="payWaySelected(item)"
          v-bind:key="item.text"
        >
          <div class="icon-div">
            <img :src="item.icon" />
          </div>
          <div class="full">{{ item.text }}</div>
          <div class="selected-mark">
            <i
              class="iconfont mall-weixuanzhong theme_font_tint"
              v-if="selectedPayWay.payModeSub != item.payModeSub"
            ></i>
            <i
              class="iconfont mall-xuanzhong theme_font_red"
              v-if="selectedPayWay.payModeSub == item.payModeSub"
            ></i>
          </div>
        </div>
      </div>
      <!-- <div class="con" v-if="$route.query.type!='app_purchase_order'">
        <div class="block-div" v-if="$store.state.globalConfig.replace_pay_enable == 1 && !isSubstitutePay">
          <div class="flex-row">
            <div class="title">找人代付</div>
          </div>
          <div
            class="flex-row"
            v-for="(item, index) in substitutePayWay"
            :key="index"
            @click="substitutePayClick(item, index)"
          >
            <div class="icon-div">
              <span class="pay-icon" :class="{blue: item.tips == '多'}">{{ item.tips }}</span>
            </div>
            <div class="full">{{ item.name }}</div>
            <div class="selected-mark">
              <i
                class="iconfont mall-weixuanzhong theme_font_tint"
                v-if="substitutePayActive !== index"
              ></i>
              <i class="iconfont mall-xuanzhong theme_font_red" v-else></i>
            </div>
          </div>
        </div>
      </div> -->

      <div
        class="bottom-btn theme_font_white theme_standard_bg"
        @click="payEvent"
        v-if="substitutePayActive === -1 && isBulk == false"
      >
        支付￥{{ $util.toDecimal2(payInfo.payAmount) }}元
      </div>
      <div
        class="bottom-btn theme_font_white theme_standard_bg"
        @click="payEvent"
        v-else-if="isBulk"
      >
        支付￥{{ $util.toDecimal2(bulkData.payAmount) }}元
      </div>
      <div
        class="bottom-btn theme_font_white theme_standard_bg"
        v-else
        @click="substitutePayEvent"
      >
        找人代付￥{{ $util.toDecimal2(payInfo.payAmount) }}元
      </div>
    </nav-content>
    <div class="copy-div" v-show="showCopyBtn">
      <div class="text">请用默认浏览器打开</div>
      <div class="btn-div">
        <div
          ref="copybtn"
          class="copy-btn"
          @click="copyLink"
          :data-clipboard-text="getCopyText()"
        >
          复制链接
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import payHelper from "@/utils/payHelper";
import { Dialog } from "vant";
import Cookie from "js-cookie";
import ClipboardJS from "clipboard";
export default {
  name: "index",
  components: {},
  data() {
    return {
      payInfo: {},
      payWay: [],
      //是否已经调起了微信
      hasToPay: false,
      payTime: 0, // 支付时间
      selectedPayWay: null,
      occurOuCode: "",
      getResultTimes: 0,
      tradeNo: "",
      payment: "",

      // 代付
      isSubstitutePay: 0,
      substitutePayActive: -1,
      substitutePayWay: [
        {
          tips: "单",
          name: "单人代付",
        },
        {
          tips: "多",
          name: "多人代付",
        },
      ],
      showCopyBtn: false,
      copyBtn: null,
      isSuccessed: false,
      lbId: "",
      lsProductName: "",
      isBulk: false,
      bulkData: {},
    };
  },
  methods: {
    getCopyText: function () {
      return window.location.href + "&token=" + this.$store.state.login.token;
    },
    copyLink: function () {
      this.copyBtn.on("success", (e) => {
        this.$Toast(
          "复制成功，请用默认浏览器，打开复制的链接地址，并且支付订单！"
        );
        this.showCopyBtn = false;
        setTimeout(() => {
          this.$MessageBox
            .confirm(
              "复制成功，请用默认浏览器，打开复制的链接地址，并且支付订单！",
              "提示",
              { confirmButtonText: "我已支付" }
            )
            .then((action) => {
              this.getResultTimes = 0;
              // this.checkPayResult();
              this.enterSuccess();
            })
            .catch((action) => {});
        }, 2000);
      });
      this.copyBtn.on("error", function (e) {
        console.log(e);
      });
    },
    backEvent: function () {
      if(localStorage.getItem('fromShoppingCar')) {
        localStorage.removeItem('fromShoppingCar')
        this.$router.push({
          path: '/mall2/orderlist',
          query: {
              selectedIndex: 0
          }
        })
      } else {
        this.$router.go(-1);
      }
    },
    payWaySelected: function (item) {
      if (item.payModeSub == "") {
        this.$Toast("暂未开通！");
        return;
      }
      console.log(item);
      this.selectedPayWay = item;
      this.substitutePayActive = -1;
    },
    payEvent: function () {
      console.log('微信h5支付：：：：：：', this.selectedPayWay.payModeSub)
      console.log('代付支付：：：：：：：：：', this.$store.state.globalConfig.replace_pay_enable, this.isSubstitutePay)
      console.log('团购订单：：：：：：：：：', this.$route.query.type)
      console.log('砍价订单：：：：：：：：：', this.$route.query.isWashCarOrder)
      console.log('砍价订单：：：：：：：：：', this.$route.query.washingWay)
      console.log('砍价订单：：：：：：：：：', this.$route.query.isGroup)
      if (this.selectedPayWay == null) {
        this.$Toast("请选择支付方式！");
        return;
      }

      if (this.selectedPayWay.payModeSub == "210004") {
        // 微信H5支付
        if (this.$util.isWeiXin()) {
          Dialog.confirm({
            title: "提示",
            message: "请在默认浏览器中打开",
            showCancelButton: false,
            confirmButtonText: "知道了",
          });
          return;
        }
      }
      this.hasToPay = true;
      this.payTime = new Date().getTime();
      if (
        this.$store.state.globalConfig.replace_pay_enable == 1 &&
        this.isSubstitutePay
      ) {
        // 代付付款
        payHelper
          .substitutePayEvent(
            this.selectedPayWay,
            this.payInfo.orderType,
            this.payInfo.orderId,
            this.payInfo.payAmount
          )
          .then((res1) => {
            if (this.$route.query.payInfo.style == "travel") {
              this.enterSuccess();
            } else {
              this.enterSuccess();
            }
          })
          .catch(() => {
            this.hasToPay = false;
          });
      } else {
        // 团购订单
        if (this.$route.query.type == "app_purchase_order") {
          payHelper
            .payPurchaseEvent(
              this.selectedPayWay,
              this.payInfo.orderType,
              this.payInfo.orderId
            )
            .then((res1) => {
              if (this.$route.query.payInfo.style == "travel") {
                this.enterSuccess();
              } else {
                this.enterSuccess();
              }
            })
            .catch(() => {
              this.hasToPay = false;
            });
          // 砍价订单
        } else {
          let redirectUrl = "";
          if (this.$route.query.isWashCarOrder == 1) {
            redirectUrl = `/carWash/paySuccess?orderId=${this.payInfo.orderId}&orderType=${this.payInfo.orderType}&tradeNo=${this.payInfo.tradeNo}&deliverCheckcode=${this.payInfo.deliverCheckcode}&deviceCode=${this.$route.query.deviceCode}&storeOuCode=${this.$route.query.storeOuCode}&stationName=${this.$route.query.stationName}`;
            if (
              this.$route.query.washingWay == 2 ||
              this.$route.query.washingWay == "2"
            ) {
              redirectUrl = `/carWash/scanPaySuccess?state=3&orderId=${this.payInfo.orderId}&orderType=${this.payInfo.orderType}&tradeNo=${this.payInfo.tradeNo}&deliverCheckcode=${this.payInfo.deliverCheckcode}&deviceCode=${this.$route.query.deviceCode}&storeOuCode=${this.$route.query.storeOuCode}&stationName=${this.$route.query.stationName}`;
            }
          } else if (this.$route.query.isGroup == "1") {
            redirectUrl = `/group_detail?skuId=${this.$route.query.skuId}&productType=${this.$route.query.productType}&groupId=${this.$route.query.groupId}&orderId=${this.$route.query.orderId}&mktGroupBuyId=${this.$route.query.mktGroupBuyId}&formPaySuccess=1`;
          }
          if (this.isBulk) {
            payHelper
              .payEvent(
                this.selectedPayWay,
                this.bulkData.orderType,
                this.bulkData.orderId,
                "/paySuccess"
              )
              .then((res1) => {
                console.log("paySuccess");
                this.enterSuccess(res1);
              })
              .catch(() => {
                this.hasToPay = false;
              });
            return;
          }

          payHelper
            .payEvent(
              this.selectedPayWay,
              this.payInfo.orderType,
              this.payInfo.orderId,
              redirectUrl
            )
            .then((res1) => {
              if (this.$route.query.payInfo.style == "travel") {
                this.enterSuccess();
              } else {
                this.enterSuccess(res1);
              }
            })
            .catch(() => {
              this.hasToPay = false;
            });
        }
      }
    },
    // 找人代付支付点击
    substitutePayEvent() {
      payHelper
        .payEvent(
          {
            payMode: 500,
            payModeSub: this.substitutePayActive == 0 ? 500001 : 500002,
          },
          this.payInfo.orderType,
          this.payInfo.orderId
        )
        .then((res) => {
          this.$router.push({
            path: "/substitute_pay",
            query: {
              payType: this.substitutePayActive,
              payInfo: res.payInfo,
              tradeNo: res.tradeNo,
            },
          });
        });
    },
    pustLiveStreamMsg: function () {
      if (this.lbId == "") {
        return;
      }
      let url = "/app/json/live_broadcast/comment";
      let params = {
        lbId: this.lbId,
        content: "【下单】成功下单 " + this.lsProductName + " 🎉🎉🎉",
      };

      this.$http.post(url, params).then(
        (res) => {
          let data = res.data;
          if (data.status == 0) {
          } else {
            this.$Toast(data.info);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    enterSuccess: function (res) {
      if (this.isSuccessed) {
        return;
      }
      // 直播购买，发送直播消息
      this.pustLiveStreamMsg();
      this.isSuccessed = true;
      if (this.$route.query.isGroup == "1") {
        console.log("res-----------", res);
        var payInfo = JSON.parse(JSON.parse(res.payInfo));
        window.location.href = `x-engine-json://yjzdbill/YJBillPayment?args=${encodeURIComponent(
          JSON.stringify({
            businessCstNo: payInfo.businessCstNo,
            platMerCstNo: payInfo.platMerCstNo,
            tradeMerCstNo: payInfo.tradeMerCstNo,
            billNo: payInfo.billNo,
            appScheme: "x-engine-c",
            payType: false,
          })
        )}&callback=${encodeURIComponent(
          location.origin +
            `/app-vue/app/index.html#/group_detail?orderId=${this.$route.query.orderId}&mktGroupBuyId=${this.$route.query.mktGroupBuyId}&formPaySuccess='1'&ret={ret}`
        )}`;
        // this.$router.replace({
        //   path: "/group_detail",
        //   query: {
        //     orderId: this.$route.query.orderId,
        //     mktGroupBuyId: this.$route.query.mktGroupBuyId,
        //     formPaySuccess: "1"
        //   }
        // });
        return;
      } else if (this.$route.query.buyType == "songli") {
        this.$router.replace({
          path: "/config-giftBox",
          query: {
            payInfo: this.$route.query.payInfo,
            carts: this.$route.query.giftCards,
            songliGoodsImgs: JSON.stringify(this.songliGoodsImgs),
            deliveryType: this.$route.query.deliveryType,
          },
        });
        return;
      } else if (this.$route.query.isContractOrder == 1) {
        this.hasToPay = false;
        this.$router.replace({
          path: "/contract-order-success",
          query: {
            packageRefuelId: this.$route.query.packageRefuelId,
            bundleName: this.$route.query.bundleName,
            rebateNum: this.$route.query.rebateNum,
          },
        });
        return;
      } else if (this.$route.query.isWashCarOrder == 1) {
        // 安徽洗车
        this.hasToPay = false;
        let targetPath = "/carWash/paySuccess";
        if (
          this.$route.query.washingWay == 2 ||
          this.$route.query.washingWay == "2"
        ) {
          targetPath = "/carWash/scanPaySuccess";
        }
        this.$router.replace({
          path: targetPath,
          query: {
            state: 3,
            orderId: this.payInfo.orderId,
            orderType: this.payInfo.orderType,
            tradeNo: this.payInfo.tradeNo,
            deliverCheckcode: this.payInfo.deliverCheckcode,
            deviceCode: this.$route.query.deviceCode,
            storeOuCode: this.$route.query.storeOuCode,
            stationName: this.$route.query.stationName,
          },
        });
        return;
      } else {
        console.log("唤起邻里邦支付平台");
        let currentOrderDetails = {
            "state": 3,
            "orderId": this.payInfo.orderId,
            "orderType": this.payInfo.orderType,
            "tradeNo": this.payInfo.tradeNo,
            "tag": 1,
            "deliverCheckcode": this.payInfo.deliverCheckcode,
            "deviceCode": this.$route.query.deviceCode,
            "storeOuCode": this.$route.query.storeOuCode,
            "stationName": this.$route.query.stationName,

        }
        localStorage.setItem("currentOrderDetails", JSON.stringify(currentOrderDetails));
        // 唤起邻里邦支付平台
        var payInfo = JSON.parse(JSON.parse(res.payInfo));
        window.location.href = `x-engine-json://yjzdbill/YJBillPayment?args=${encodeURIComponent(
          JSON.stringify({
            businessCstNo: payInfo.businessCstNo,
            platMerCstNo: payInfo.platMerCstNo,
            tradeMerCstNo: payInfo.tradeMerCstNo,
            billNo: payInfo.billNo,
            appScheme: "x-engine-c",
            payType: false,
          })
        )}&callback=${encodeURIComponent(
          location.origin +
            `/app-vue/app/index.html#/mall2/paysuccess?selectedIndex=1&orderCategory=${this.$route.query.orderCategory}&vipUnitUserCode=${this.$route.query.vipUnitUserCode}&type=${this.$route.query.type}&ret={ret}`
        )}`;
        // this.$router.replace({
        //   path: "/mall2/paysuccess",
        //   query: {
        //     selectedIndex: 1,
        //     orderCategory: this.$route.query.orderCategory,
        //     vipUnitUserCode: this.$route.query.vipUnitUserCode,
        //     type: this.$route.query.type
        //   }
        // });
      }
      // if (this.$route.query.type == "five_enter") {
      //   this.$router.replace({
      //     path: "/mall2/fiveenterdetail",
      //     query: {
      //       orderId: this.$route.query.orderId,
      //       tag: 4,
      //       orderType: '200001',
      //       // orderIndex: this.tabIndex,
      //       // awardActivity: JSON.stringify(awardActivity),
      //       // orderCategory: this.orderCategory,
      //       // vipUnitUserCode: this.vipUnitUserCode
      //     }
      //   });
      //   return;
      // }
    },
    async setPayWays() {
      if (this.$route.query.style == "travel") {
        // 旅游
        this.payWay = await payHelper.getPayWays("200104", this.occurOuCode);
      } else if (
        this.$store.state.globalConfig.replace_pay_enable == 1 &&
        this.isSubstitutePay == 1
      ) {
        // 找人代付-代付人付款
        this.payWay = await payHelper.getPayWays("200001007", this.occurOuCode);
      } else if (this.$route.query.isWashCarOrder == 1) {
        // 安徽洗车
        this.payWay = await payHelper.getPayWays("200030", this.occurOuCode);
      } else if (this.isBulk) {
        this.payWay = await payHelper.getPayWays(
          "200501",
          this.bulkData.occurOuCode
        );
      } else {
        this.payWay = await payHelper.getPayWays("200001", this.occurOuCode);
      }

      if (this.payWay.length > 0) {
        this.selectedPayWay = this.payWay[0];
      }
    },
    // checkPayResult: function() {
    //   this.$Loading.open();
    //   let url = "/app/json/app_shopping_order/detail";
    //   let paramsData = {
    //     token: this.$store.state.login.token,
    //     orderType: this.payInfo.orderType,
    //     orderId: this.payInfo.orderId
    //   };
    //   this.$http.post(url, paramsData).then(
    //     res => {
    //       this.$Loading.close();
    //       let data = res.data;
    //       if (data.status == 0) {
    //         if (data.data.state == 3) {
    //           this.enterSuccess();
    //         } else if (data.data.state == 1) {
    //           this.getResultTimes++;
    //           if (this.getResultTimes > 6) {
    //             return;
    //           }
    //           setTimeout(() => {
    //             this.checkPayResult();
    //           }, 500);
    //         }
    //       }
    //     },
    //     error => {
    //       this.$Loading.close();
    //     }
    //   );
    // },
    checkPayResult: function () {
      this.$Loading.open();
      let url = "/app/json/app_shopping_order/queryPayState";
      let paramsData = {
        token: this.$store.state.login.token,
        tradeNo: this.payInfo.tradeNo,
      };
      this.$http.post(url, paramsData).then(
        (res) => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            // 0 待支付  1支付成功  2其他(支付失败、支付取消等)
            if (data.data.state == 1) {
              this.enterSuccess();
            } else {
              this.getResultTimes++;
              if (this.getResultTimes > 2) {
                return;
              }
              setTimeout(() => {
                this.checkPayResult();
              }, 500);
            }
          }
        },
        (error) => {
          this.$Loading.close();
        }
      );
    },
    // 代付方式选择
    substitutePayClick(item, index) {
      this.selectedPayWay = {};
      this.substitutePayActive = index;
    },
  },

  created() {
    if (this.$route.query.isBulk && this.$route.query.bulkData) {
      this.isBulk = JSON.parse(this.$route.query.isBulk);
      this.bulkData = JSON.parse(this.$route.query.bulkData);
    }

    this.lbId = this.$route.query.lbId || "";
    this.lsProductName = this.$route.params.lsProductName || "";

    this.isSubstitutePay = this.$route.query.isSubstitutePay || 0;
    this.occurOuCode = this.$route.query.occurOuCode
      ? this.$route.query.occurOuCode
      : "";
    this.payInfo = this.$route.query.payInfo
      ? JSON.parse(this.$route.query.payInfo)
      : {};
    this.$mallCommon.dataProcessing(this.payInfo);
    this.setPayWays();
    // this.payment = this.$route.query.payment
    // this.tradeNo = this.$route.query.tradeNo
  },
  mounted() {
    //从后台进前台的协议
    this.$bridgefunc.enterForegroundCallBack(() => {
      if (this.isSuccessed) {
        // 如果回调成功，在页面回来的时候不处理查询了
        return;
      }
      const now = new Date().getTime();
      const diff = now - this.payTime;
      if (this.hasToPay && diff > 3000) {
        this.hasToPay = false;
        this.getResultTimes = 0;
        this.checkPayResult();
      }
    });
    if (this.$refs.copybtn) {
      this.copyBtn = new ClipboardJS(this.$refs.copybtn);
    }
  },
  activated() {},
  beforeRouteLeave(to, from, next) {
    this.$keepaliveHelper.deleteCache(this);
    next();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.copy-div {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  color: white;

  .text {
    padding: 120px 20px 30px;
    text-align: center;
    font-size: 16px;
  }

  .btn-div {
    text-align: center;

    >>> .copy-btn {
      display: inline-block;
      width: 120px;
      text-align: center;
      font-size: 16px;
      background-color: #358ff7;
      padding: 10px;
      border-radius: 20px;
    }
  }
}

.pay-icon {
  display: block;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  line-height: 22px;
  text-align: center;
  background-image: linear-gradient(#ffbdbe, #fe5c63);
  font-size: 13px;
  color: #fff;
  font-weight: 700;

  &.blue {
    background-image: linear-gradient(#afd0fe, #358ff7);
  }
}

.index {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .money-icon {
    margin-top: 20px;
    text-align: center;

    img {
      width: 40px;
      height: 40px;
    }
  }

  .pay-info {
    text-align: center;
    padding-bottom: 10px;

    .text {
      font-size: 16px;
      margin-top: 10px;
    }

    .amount {
      font-size: 12px;
      margin-top: 8px;

      .price-i {
        font-size: 18px;
        font-weight: 500;
        margin-right: -4px;
      }
    }
  }

  .icon-div {
    margin-right: 8px;

    img {
      width: 22px;
      height: 22px;
    }
  }

  .selected-mark {
    i {
      font-size: 18px;
    }
  }

  .bottom-btn {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    text-align: center;
    padding: 16px;
    font-size: 18px;
    font-weight: 500;
  }
}
</style>

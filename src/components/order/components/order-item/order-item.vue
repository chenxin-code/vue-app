<template>
  <!-- 
  billType: 
  dataList: [ 商品数组
    {
      billType: 订单类型
      billName: 订单名称
      billAmount: 订单金额
      billNum: 订单数量
    }
  ]
  surplusCommodity: 剩余商品
  amount: 金额
  submitTime: 提交时间

 -->
  <div>
    <div class="order-item">
      <div class="title">
        <van-checkbox
          v-if="isWaitPay"
          v-model="isChecked"
          :disabled="isDisabled"
          @change="checkEvent($event, orderItem)"
          checked-color="#e5165a"
          icon-size="18px"
        ></van-checkbox>
        <i class="icon" :class="iconClass"></i>
        <span>{{ billTypeName }}</span>
        <div class="stateText">{{ stateText }}</div>
      </div>
      <div
        class="product-box"
        :class="[isShow ? 'show' : '']"
        @click.stop="gotoBillDetail"
      >
        <product-item
          v-for="(item, index) in showMore ? dataList : smallDataList"
          :key="index"
          :productItem="item"
          :billType="billType"
          :billId="billId"
        ></product-item>
      </div>
      <div
        class="show-product-btn"
        @click.stop="switchProductList"
        v-if="dataList.length >= 3"
      >
        <p v-show="!isShow">显示剩余{{ dataList.length - 2 }}件商品</p>
        <p v-show="isShow">收起商品</p>
        <i class="downIco" v-show="!isShow"></i>
        <i class="upIco" v-show="isShow"></i>
      </div>
      <div class="need-pay" v-if="billType != 11">
        <p class="time">{{ submitTime }}</p>
        <p class="pr">
          <i>{{ moneyText }}:</i><span class="smallRMB">￥</span
          >{{ goodsAmount.integer
          }}<span class="decimal">.{{ goodsAmount.decimal }}</span>
        </p>
      </div>
      <div class="total need-pay" v-if="billType == 11">
        <p class="time row" style="height: 25px; line-height: 25px">
          {{ submitTime }}
        </p>
        <div>
          <span class="to"
            >共<i>{{ amountTotal }}</i
            >件商品</span
          >
          <span class="pr"
            ><i>{{ moneyText }}:</i><span class="smallRMB">￥</span
            >{{ goodsAmount.integer
            }}<span class="decimal">.{{ goodsAmount.decimal }}</span></span
          >
        </div>
      </div>
      <div class="btn-box">
        <!-- v-if="isChangeOrder && !isBulk" -->
        <!-- 不允许修改订单 -->
        <div class="btn" v-if="false" @click="modifyAddress(dataList[0])">
          <p>修改订单</p>
        </div>
        <div class="btn" v-if="false"  @click.stop="toComment">
          <!-- v-if="isEvalute && !isBulk" -->
          <p>立即评价</p>
        </div>
        <div
          class="btn"
          v-if="isBuyAgain && !isBulk && billType != 13"
          @click.stop="buyAgain"
        >
          <p>再次购买</p>
        </div>
        <div
          class="btn"
          v-if="billType == 13 && tag != 1"
          @click.stop="goTMDetail"
        >
          <p>查看详情</p>
        </div>
        <div
          class="btn"
          v-if="isViewLogistics && !isBulk"
          @click.stop="expressType(dataList[0])"
        >
          <p>查看物流</p>
        </div>
        <div
          class="btn"
          v-if="isWaitTakeDelivery && !isBulk"
          @click.stop="confirmProduct()"
        >
          <p>确认收货</p>
        </div>
        <div class="btn" v-if="isFinish && billType != 13"><p>已完成</p></div>
        <div class="btn" v-if="isPayAtOnce" @click="payAtOnce(payInfo)">
          <p>立即付款</p>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import productItem from "@/components/order/components/product-item/product-item";
import staticDataRequest from "@/utils/staticData/staticDataRequest.js";
import dataMergeInterceptor from "@/utils/staticData/dataMergeInterceptor";
export default {
  props: [
    "pageType",
    "amount",
    "billType",
    "submitTime",
    "dataList",
    "params",
    "res",
    "orderType",
    "payInfo",
    "billDetailObj",
    "orderItem",
    "type",
    "billId",
    "orderStateType",
    "state",
    "orderCanEvaluate",
    "orderMode",
    "shoppingOrderId",
    "bulkOrderType",
    "id",
    "tradeNo",
    "orderState",
    "shopOrderNo",
    "tag"
  ],
  data() {
    return {
      isChecked: false,
      isDisabled: false,
      isShow: false,
      smallDataList: [],
      showMore: false,
      vipUnitUserCode: "", // type  为空  待保留 旧订间为空，可不传
      itemAmount: "0",
      goodsAmount: {
        integer: "0",
        decimal: "00"
      },
      isBulk: false
    };
  },
  created() {
    if (this.dataList.length >= 3) {
      this.smallDataList.push(this.dataList[0]);
      this.smallDataList.push(this.dataList[1]);
    } else {
      this.smallDataList = this.dataList;
    }
    // console.log(this.smallDataList, "this.smallDataList");
    this.itemAmount = this.amount;
    if (this.orderMode == "12" || this.bulkOrderType == "200501") {
      this.isBulk = true;
    } else {
      this.isBulk = false;
    }
  },
  computed: {
    stateText() {
      if (this.pageType == "finish") {
        if (this.billType != "11" && this.billType != "13") {
          return "支付已完成";
        }
        if (this.billType == "13") {
          return "订单已完成";
        } else {
          switch (this.state) {
            case 16:
              return "支付已完成 · 待发货";
            case 17:
              return "支付已完成 · 待发货";
            case 18:
              return "支付已完成 · 待发货";
            case 19:
              return "支付已完成 · 待发货";
            case 4:
              return "支付已完成 · 待收货";
            case 9:
              return "订单已完成";
            case 7:
              return "订单已取消";
            case 12:
              return "订单已取消";
          }
        }
      } else {
        return "";
      }
    },
    moneyText() {
      let moneyText = "";
      switch (this.pageType) {
        case "waitPay":
          moneyText = "需付款";
          break;
        default:
          moneyText = "实付款";
          break;
      }
      return moneyText;
    },
    amountTotal() {
      let amount = 0;
      this.dataList.forEach(item => {
        amount += item.billNum;
      });
      return amount;
    },
    isChangeOrder() {
      //修改订单
      return (
        (this.pageType == "waitDelivery" ||
          this.pageType == "allOrder" ||
          (this.pageType == "finish" &&
            this.params.orderStateType == "200017" &&
            this.params.state == 17)) &&
        this.billType == 11
      );
    },
    isEvalute() {
      //评价
      return (
        ((this.pageType == "finish" &&
          this.orderCanEvaluate &&
          this.state != "12" &&
          this.state != "16" &&
          this.state != "17" &&
          this.state != "18" &&
          this.state != "19" &&
          this.state != "4") ||
          (this.pageType == "allOrder" &&
            this.params.orderStateType == "200017" &&
            this.params.state == 9)) &&
        this.billType == 11
      );
    },
    isBuyAgain() {
      //再次购买
      return (
        (this.pageType == "waitDelivery" ||
          this.pageType == "waitTakeDelivery" ||
          this.pageType == "cancel" ||
          this.pageType == "finish" ||
          (this.pageType == "allOrder" &&
            ((this.params.orderStateType == "200017" &&
              this.params.state == 17) ||
              (this.params.orderStateType == "200017" &&
                this.params.state == 4) ||
              (this.params.orderStateType == "200017" &&
                this.params.state == 9) ||
              (this.params.orderStateType == "200017" &&
                this.params.state == 7)))) &&
        this.billType == 11
      );
    },
    isFinish() {
      //已完成
      return (
        (this.pageType == "finish" ||
          (this.pageType == "allOrder" &&
            this.params.orderStateType == "200017" &&
            this.params.state == 9)) &&
        this.billType != 11
      );
    },
    isViewLogistics() {
      //查看物流
      return (
        (this.pageType == "waitTakeDelivery" ||
          this.pageType == "allOrder" ||
          (this.pageType == "finish" &&
            this.params.orderStateType == "200017" &&
            this.params.state == 4)) &&
        this.billType == 11
      );
    },
    isWaitTakeDelivery() {
      //确认收货
      return (
        (this.pageType == "waitTakeDelivery" ||
          this.pageType == "allOrder" ||
          (this.pageType == "finish" &&
            this.params.orderStateType == "200017" &&
            this.params.state == 4)) &&
        this.billType == 11
      );
    },
    isPayAtOnce() {
      //立即付款
      return (
        this.pageType == "waitPay" ||
        (this.pageType == "allOrder" &&
          this.params.orderStateType == "200015" &&
          this.params.state == 1)
      );
    },
    isWaitPay() {
      //支付页
      return this.pageType == "waitPay" ? true : false;
    },
    billTypeName() {
      let billName = "";
      switch (this.billType) {
        case 11:
          billName = "邻里星选";
          break;
        case 1:
          billName = "物业缴费";
          break;
        case 2:
          billName = "月保续费";
          break;
        case 3:
          billName = "临停缴费";
          break;
        case 4:
          billName = "临时缴费";
          break;
        case 5:
          billName = "零售";
          break;
        case 6:
          billName = "预缴费";
          break;
        case 7:
          billName = "旅游";
          break;
        case 8:
          billName = "家政";
          break;
        case 9:
          billName = "拎包";
          break;
        case 10:
          billName = "押金";
          break;
        case 12:
          billName = "美居";
          break;
        case 14:
          billName = "维修服务费";
          break;
        case 13:
          billName = "生活服务";
          break;
        case 15:
          billName = "租售";
          break;
      }
      return billName;
    },
    iconClass() {
      let sClass = "";
      switch (this.billType) {
        case 11:
          sClass = "icon1";
          break;
        case 12:
          sClass = "icon1";
          break;
        case 5:
          sClass = "icon1";
          break;
        case 1:
          sClass = "icon7";
          break;
        case 2:
          sClass = "icon8";
          break;
        case 3:
          sClass = "icon5";
          break;
        case 6:
          sClass = "icon4";
          break;
        case 4:
          sClass = "icon4";
          break;
        case 7:
          sClass = "icon6";
          break;
        case 8:
          sClass = "icon2";
          break;
        case 9:
          sClass = "icon3";

          break;
        case 10:
          sClass = "icon4";
          break;
        case 13:
          sClass = "icon2";
          break;
        case 14:
          sClass = "icon14";
          break;
      }
      return sClass;
    }
  },
  watch: {
    itemAmount: function(newVal, oldVal) {
      let amountArr = this.$util
        .toDecimal2(newVal)
        .toString()
        .split(".");
      if (amountArr.length !== 0) {
        this.goodsAmount.integer = amountArr[0];
        this.goodsAmount.decimal = amountArr[1];
      }
    }
  },
  components: {
    productItem
  },
  methods: {
    //立即支付
    payAtOnce(payInfo) {
      let callbackUrl = "";
      // this.billDetailObj.groupBuyActivityId
      if (
        this.orderType !== "200001" &&
        this.orderType !== "200501" &&
        this.billType == 11
      ) {
        //团购订单
        callbackUrl = `/app-vue/app/index.html#/group_detail?orderId=${this.billDetailObj.groupBuyId}&mktGroupBuyId=${this.billDetailObj.groupBuyActivityId}&formPaySuccess='1'&ret={ret}`;
        this.enginePay(payInfo, callbackUrl);
      } else if (this.billType == 11) {
        this.initPayInfo(payInfo, "mall");
      } else if (this.billType == 13) {
        /*去服务商城详情页*/
        // this.goTMDetail();
        this.initPayInfo(payInfo, "mall");
      } else {
        this.initPayInfo(payInfo, "bill");
      }
    },
    initPayInfo(payInfo, type) {
      let callbackUrl = "";
      let currentOrderDetails = {
        state: 3,
        orderId: payInfo.orderId,
        orderType: payInfo.orderType,
        tradeNo: payInfo.tradeNo,
        tag: 1,
        deliverCheckcode: payInfo.deliverCheckcode,
        deviceCode: this.$route.query.deviceCode, //正常流程支付也为空 待保留
        storeOuCode: this.$route.query.storeOuCode, //正常流程支付也为空 待保留
        stationName: this.$route.query.stationName //正常流程支付也为空 待保留
      };
      localStorage.setItem(
        "currentOrderDetails",
        JSON.stringify(currentOrderDetails)
      );
      //vipUnitUserCode type  为空  待保留   增加参数是否为账单中心订单
      if (type == "mall") {
        callbackUrl = `/app-vue/app/index.html#/mall2/paysuccess?selectedIndex=1&isBill=${
          this.billType != 11 ? true : false
        }&orderCategory=${payInfo.orderCategory}&vipUnitUserCode=${
          this.$route.query.vipUnitUserCode
        }&type=${this.$route.query.type}&ret={ret}`;
      } else {
        callbackUrl = `/app-vue/app/index.html#/order/2?time=${Date.now()}`;
      }
      this.enginePay(payInfo, callbackUrl);
    },
    enginePay(payInfo, callbackUrl) {
      console.log("唤起邻里邦支付平台", payInfo);
      window.location.href = `x-engine-json://yjzdbill/YJBillPayment?args=${encodeURIComponent(
        JSON.stringify({
          businessCstNo: payInfo.businessCstNo,
          platMerCstNo: payInfo.platMerCstNo,
          tradeMerCstNo: payInfo.tradeMerCstNo,
          billNo: payInfo.billNo,
          appScheme: "x-engine-c",
          payType: false
        })
      )}&callback=${encodeURIComponent(location.origin + callbackUrl)}`;
    },
    switchProductList() {
      //订单商品列表显示隐藏剩余商品
      this.isShow = !this.isShow;
      this.showMore = !this.showMore;
    },
    /*去服务商城详情页*/
    gotoBillDetail() {
      console.log("billId------------------", this.billId);
      // 跳转订单详情
      // billType: 判断物业或是商城类型
      // orderType: 订单状态
      if (this.billType == "11") {
        console.log("orderType--------------", this.orderType);
        if (
          this.orderType !== "200001" &&
          this.orderType != "200015" &&
          this.orderType != "200017" &&
          this.orderType != "200018" &&
          this.orderType != "200501"
        ) {
          this.$router.push({
            path: "/group_detail",
            query: {
              orderId: this.billDetailObj.groupBuyId,
              mktGroupBuyId: this.billDetailObj.groupBuyActivityId
            }
          });
        } else if (this.bulkOrderType == "200501" || this.orderMode == "12") {
          this.$router.push({
            path: "/orderInfo",
            query: {
              info: JSON.stringify({
                shoppingOrderId: this.shoppingOrderId,
                id: this.id,
                tradeNo: this.tradeNo
              }),
              pageType: this.pageType,
              state: this.state ? this.state : ""
            }
          });
        } else {
          let awardActivity =
            this.billDetailObj.awardActivityList &&
            this.billDetailObj.awardActivityList.length
              ? this.billDetailObj.awardActivityList[0]
              : {};
          this.$router.push({
            path: "/mall2/orderdetail",
            query: {
              payMode: this.billDetailObj.payMode,
              tradeNo: this.billDetailObj.tradeNo,
              shoppingOrderId: this.billDetailObj.shoppingOrderId,
              orderPayType: this.billDetailObj.orderPayType,
              orderId: this.billDetailObj.id,
              tag: this.billDetailObj.tag,
              orderType: this.orderStateType
                ? this.orderStateType
                : this.orderType,
              orderIndex: this.billDetailObj.tabIndex,
              awardActivity: JSON.stringify(awardActivity)
            }
          });
        }
      } else if (this.billType == "13") {
        /*去服务商城详情页*/
        this.goTMDetail();
      } else {
        console.log(
          "--------------------跳转账单中心详情----------------------"
        );
        console.log(
          "--------------------跳转账单中心详情----------------------",
          this.billId,
          this.billDetailObj.isRefund,
          this.billDetailObj.businessCstNo
        );
        window.location.href = `x-engine-json://yjzdbill/queryBillDetail?args=${encodeURIComponent(
          JSON.stringify({
            billId: this.billId,
            payType: "0",
            isRefund: this.billDetailObj.isRefund,
            businessCstNo: this.billDetailObj.businessCstNo
          })
        )}`;
      }
    },
    /*去服务商城详情页*/
    goTMDetail() {
      let { orderItem } = this;
      let token = this.$store.state.ythToken
        ? this.$store.state.ythToken
        : localStorage.getItem("ythToken");
      if (this.billType == 13) {
        let path = process.env.VUE_APP_TMASS_APP + "/order/detailPage?";
        let query = `orderState=${orderItem.orderState}&tradeNo=${orderItem.tradeNo}&orderType=${orderItem.orderType}&shopOrderNo=${orderItem.shopOrderNo}&tabShow=true&Authorization=${token}`;
        location.href = path + query;
      }
    },
    checkEvent(event, data) {
      console.log(event, data);
      data.checked = event;
      this.$emit("checkEvent", data);
    },
    buyAgain() {
      // if (this.dataList.length <= 0) return;
      // const detaisUrl = "/appcontent/js/product/productDetail.js";
      // let funcName = "productDetail_" + this.skuId;
      // let args = dataMergeInterceptor.getRequestArgs() || [];
      // args.push({ skuId: this.skuId });

      // staticDataRequest.request(detaisUrl, funcName, args).then(data => {});
      // return;
      //再次购买
      if (this.params.deliverType == 3) {
        let arr = [];
        for (let i = 0; i < this.dataList.length; i++) {
          let product = this.dataList[i];
          if (product.isGift == 0) {
            let cd = {
              skuId: product.skuId,
              storeOuCode: product.storeOuCode,
              number: product.billNum
            };
            arr.push(cd);
          }
        }
        sessionStorage.setItem("MDPS_Carts", JSON.stringify(arr));
        this.$router.push({
          path: "/mall2/store-delivery/list"
        });
        return;
      }
      // 重新购买修改为直接重新下单
      this.$Loading.open();
      let url = "/app/json/app_cart/SettleCart";
      let paramsData = {
        token: this.$store.state.login.token,
        deliveryType: this.params.deliverType,
        orderCategory: this.params.orderCategory, // 路由传递，旧订单为空可不传
        vipUnitUserCode: "", // 路由传递，旧订单为空可不传
        userAddress: this.$store.state.mall2.selectAddress,
        pickupId: this.$store.state.mall2.zitiAddress.id,
        userAddressId: ""
      };
      if (paramsData.deliveryType == 2) {
        if (this.$store.state.mall2.selectAddress.id > 0) {
          paramsData.userAddressId = this.$store.state.mall2.selectAddress.id;
        }
      }
      let arr = [];
      for (let i = 0; i < this.dataList.length; i++) {
        let product = this.dataList[i];
        let cd = {
          skuId: product.skuId,
          storeOuCode: product.storeOuCode,
          number: product.billNum
        };
        arr.push(cd);
      }
      paramsData.carts = arr;

      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            /*
             * 如果商品已经下架或者不存在了，需要终止操作
             */
            if (data.data.invalidCart !== "" || data.data.occur.length <= 0) {
              this.$MessageBox
                .confirm(
                  "抱歉，订单中的商品已经下架啦！再看看其他商品吧~",
                  "提示",
                  { confirmButtonText: "确定", showCancelButton: false }
                )
                .then(action => {})
                .catch(action => {});
              return;
            }
            let params = {
              res: data.data,
              paramsData: paramsData,
              deliveryType: paramsData.deliveryType
            };
              // this.detailData.deliveryType == 2
            // if (
            //   !(this.$store.state.mall2.selectAddress.id > 0) &&
            //   this.detailData.deliveryType == 2
            // ) {
            //   if (this.matchAddress) {
            //     this.$store.state.mall2.selectAddress = this.matchAddress;
            //     this.$bridgefunc.vuexStorage(() => {});
            //   } else {
            //     params.noMatch = true;
            //   }
            // }
            if (
              this.$mallCommon.isExistCanNotAttendActivity(data.data.occur) ==
              true
            ) {
              this.$MessageBox
                .confirm(
                  "部分商品不能参加活动</br>将按原价购买，是否继续？",
                  "提示",
                  { confirmButtonText: "确定" }
                )
                .then(action => {
                  this.$router.push({
                    name: "填写订单",
                    params: params
                  });
                })
                .catch(action => {});
            } else {
              this.$router.push({
                name: "填写订单",
                params: params
              });
            }
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
    async expressType(obj) {
      let url = "/app/json/app_shopping_order/detail";
      let paramsData = {
        token: this.$store.state.login.token,
        orderPayType: this.params.orderPayType,
        orderType: this.orderType,
        orderId: this.params.orderId,
        orderCategory: this.params.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode
      };
      if (this.$route.query.payUserId) {
        paramsData.payUserId = this.$route.query.payUserId;
      }
      try {
        let awaitData = await this.$http.post(url, paramsData);
        let data = awaitData.data.data;
        this.$router.push({
         path: '/mall2/logistics',
         query: {
           orderId: data.id,
           orderType: obj.orderType,
           expressNo: data.expressNo,
           expressName: data.expressName
         }
       })
      
      } catch (e) {
        this.$Toast(e);
      }
    },
    confirmProduct: function() {
      // 确认收货
      this.$MessageBox
        .confirm("您确定已经收到商品了吗？", "提示")
        .then(action => {
          this._confirmProductApi();
        })
        .catch(action => {});
    },
    _confirmProductApi: function() {
      this.$Loading.open();
      let url = "/app/json/app_shopping_order/orderConfirm";
      let paramsData = {
        token: this.$store.state.login.token,
        orderId: this.params.orderId,
        orderType: this.params.orderType,
        orderCategory: this.params.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode
      };
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            // this.$router.push({
            //   name: "我的订单",
            //   params: {
            //     id: 5
            //   },
            //   query: {
            //     time: Date.now()
            //   }
            // });
            this.$router.push({
              path:'/order/5',
              query:{
                time:Date.now()
              }
            })
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
    toComment: function(item) {
      // 评价晒单
      if (this.dataList.length > 0) {
        if (this.dataList.length > 1) {
          this.$router.push({
            path: "/mall2/comment2",
            query: {
              orderId: this.params.orderId
            }
          });
        } else {
          this.$router.push({
            path: "/mall2/comment",
            query: {
              skuId: this.dataList[0].skuId,
              orderId: this.dataList[0].itemOrderId,
              phPictureUrl: this.dataList[0].billImg,
              skuName: this.dataList[0].billName
            }
          });
        }
      }
    },
    modifyAddress: function(item) {
      console.log("params", this.params);
      this.$router.push({
        path: "/mall2/modifyorderaddress",
        query: {
          address: JSON.stringify({
            address: item.address || "",
            addressFull: item.addressFull || "",
            cityId: item.cityId || "",
            cityName: item.cityName || "",
            countryId: item.countryId || "",
            countryName: item.countryName || "",
            provinceId: item.provinceId || "",
            provinceName: item.provinceName || "",
            townId: item.townId || "",
            townName: item.townName || "",
            receiver: item.receiver || "",
            mobile: item.mobile || ""
          }),
          orderId: this.params.orderId,
          tradeNo: this.params.tradeNo,
          orderType: this.params.orderType
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.row {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-item: center;
  height: 27px;
}

.order-item {
  box-sizing: border-box;
  width: 95%;
  background: #FFFFFF;
  margin: 0 auto;
  border-radius: 14px;
  padding: 12px 14px 18px 14px;
  box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.04);
  margin-top: 12px;

  .smallRMB {
    font-weight: 500;
    font-size: 13px;
  }

  .decimal {
    font-size: 12px;
    font-weight: 550;
  }

  .title {
    display: flex;
    height: 30px;
    line-height: 30px;

    // justify-content: center;
    // // align-items: center;
    .van-checkbox {
      position: relative;
      top: 0px;
      margin-right: 4px;
    }

    .icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url('../../img/icon1.png') no-repeat;
      background-size: 20px 20px;
      position: relative;
      top: 5px;

      &.icon1 {
        background-image: ur('../../img/icon1.png');
      }

      &.icon2 {
        background-image: url('../../img/icon2.png');
      }

      &.icon3 {
        background-image: url('../../img/icon3.png');
      }

      &.icon4 {
        background-image: url('../../img/icon4.png');
      }

      &.icon5 {
        background-image: url('../../img/icon5.png');
      }

      &.icon6 {
        background-image: url('../../img/icon6.png');
      }

      &.icon7 {
        background-image: url('../../img/icon7.png');
      }

      &.icon8 {
        background-image: url('../../img/icon8.png');
      }
    }

    span {
      font-size: 16px;
      padding-left: 6px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 550;
      color: #121212;
    }

    .stateText {
      flex: 1;
      font-size: 15px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #E5165A;
      line-height: 30px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .content {
    padding-top: 16px;
    display: flex;
    justify-content: space-between;

    .img {
      display: flex;
      width: 240px;

      img {
        width: 90px;
        height: 90px;
      }

      .text {
        padding-left: 8px;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #121212;
        line-height: 21px;
      }

      .desc {
        padding-left: 8px;

        strong {
          font-size: 17px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          line-height: 27px;
          color: #121212;
        }

        p {
          font-size: 13px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          line-height: 21px;
          color: #D8D8D8;
        }
      }
    }

    .price {
      .pr {
        font-size: 16px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #121212;
        line-height: 24px;
      }

      .am {
        font-size: 13px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #8D8D8D;
        line-height: 20px;
        text-align: right;
      }
    }
  }

  .total {
    padding-top: 14px;
    text-align: right;

    .to {
      font-size: 14px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #8D8D8D;
      line-height: 14px;

      i {
        padding: 0 4px;
        color: #121212;
      }
    }

    .pr {
      font-size: 16px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 550;
      color: #121212;
      line-height: 24px;

      i {
        color: #8D8D8D;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }

  .need-pay {
    padding-top: 14px;
    padding-bottom: 4px;
    display: flex;
    justify-content: space-between;

    .time {
      font-size: 13px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #999999;
      margin-left: 2px;
    }

    .pr {
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 550;
      color: #121212;
      font-size: 16px;

      i {
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #999999;
      }
    }
  }

  .btn-box {
    display: flex;
    padding-top: 14px;
    justify-content: flex-end;

    .btn {
      // display: flex;
      // justify-content center;
      // align-items: center;
      width: 108px;
      height: 32px;
      font-size: 15px;
      font-weight: bold;
      color: #e5165a;
      text-align: center;
      line-height: 33px;
      border: 1px solid #e5165a;
      border-radius: 20px;
      margin-left: 4px;

      &.default {
        color: #e8374a;
        border-color: #e8374a;
      }

      p {
        position: relative;
        top: -1px;
      }
    }

    // .btn:last-child {
    //   color: #e8374a;
    //   border-color: #e8374a;
    // }
  }

  .product-box {
    // height: 110px;
    overflow: hidden;
    transition: 1s;

    &.show {
      height: auto;
    }
  }

  .show-product-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 130px;
    padding: 10px 0;

    p {
      font-size: 14px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #8D8D8D;
      line-height: 14px;
    }

    .downIco {
      width: 12px;
      height: 12px;
      display: block;
      background: url('../../img/down.png') no-repeat;
      background-size: 12px auto;
      margin-right: 5px;
    }

    .upIco {
      width: 12px;
      height: 12px;
      display: block;
      background: url('../../img/up.png') no-repeat;
      background-size: 12px auto;
      margin-right: 55px;
    }
  }
}
</style>
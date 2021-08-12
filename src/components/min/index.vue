<template>
  <div class="adapter">
    <min-top :memberInfo="memberInfo" :userInfo="userInfo"></min-top>
    <grid-list :gridData="walletData" @navTo="navTo"></grid-list>
    <grid-list :gridData="orderData" @navTo="navTo"></grid-list>
    <bottom-cell :cellData="cellData" @bottomNavTo="bottomNavTo"></bottom-cell>
  </div>
</template>

<script>
import MinTop from "./components/min-top/min-top";
import GridList from "./components/gridList/gridList";
import BottomCell from "./components/bottomCell/bottomCell";
export default {
  name: "NewMinPage",
  data() {
    return {
      memberId:
        process.env.NODE_ENV === "development"
          ? "2331048196588962398"
          : this.$store.state.userInfo.userCode,
      walletData: {
        gridList: [
          { title: "邦豆", value: "0", url: "/record", id: "bean" },
          {
            title: "优惠券",
            value: "0",
            url: "/coupon/get_coupon_list",
            id: "coupons"
          },
          {
            title: "零钱（元）",
            value: "0.00",
            url: "",
            id: "wallet",
            isShowUnit: true
          }
        ],
        endData: {
          title: "我的钱包",
          icon: require("./images/wallet.png"),
          url: "wallet",
          imgWidth: "0.88rem",
          imgHeight: "0.706667rem"
        }
      },
      orderData: {
        gridList: [
          {
            title: "待支付",
            icon: require("./images/pay.png"),
            url: "/mall2/orderlist?selectedIndex=0",
            imgWidth: "0.6rem",
            imgHeight: "0.48rem",
            isShowTip: false,
            id: "waitPay",
            tipValue: ""
          },
          {
            title: "待发货",
            icon: require("./images/delivery.png"),
            url: "/mall2/orderlist?selectedIndex=1",
            imgWidth: "0.68rem",
            imgHeight: "0.546667rem",
            isShowTip: false,
            id: "waitDelivery",
            tipValue: ""
          },
          {
            title: "待收货",
            icon: require("./images/gif.png"),
            url: "/mall2/orderlist?selectedIndex=2",
            imgWidth: "0.546667rem",
            imgHeight: "0.546667rem",
            isShowTip: false,
            id: "waitTakeDelivery",
            tipValue: ""
          },
          {
            title: "退换/售后",
            icon: require("./images/afterSales.png"),
            url: `/concatAfterSalesOrder/1?backUpPage=${true}`,
            imgWidth: "0.626667rem",
            imgHeight: "0.546667rem",
            isShowTip: false,
            id: "afterSales",
            tipValue: ""
          }
        ],
        endData: {
          title: "我的订单",
          icon: require("./images/order.png"),
          url: "/mall2/orderlist?selectedIndex=0",
          imgWidth: "0.773333rem",
          imgHeight: "0.826667rem"
        },
        isShowNumber: true
      },
      cellData: [
        {
          title: "服务商城订单",
          icon: require("./images/serviceOrder.png"),
          devUrl:
            "https://mall-uat-app-linli.timesgroup.cn:1443/order/listPage?token=",
          prodUrl:
            "https://mall-prod-app-linli.timesgroup.cn:9001/order/listPage?token=",
          externalLinks: true
        },
        {
          title: "服务商城售后",
          icon: require("./images/serviceAfterSales.png"),
          devUrl:
            "https://mall-uat-app-linli.timesgroup.cn:1443/order/afterSaleList?token=",
          prodUrl:
            "https://mall-prod-app-linli.timesgroup.cn:9001/order/afterSaleList?token=",
          externalLinks: true
        },
        {
          title: "个人信息",
          icon: require("./images/user.png"),
          pageUrl: "/minUserInfo"
        },
        {
          title: "分享有礼",
          icon: require("./images/share.png"),
          devUrl:
            "https://mall-uat-app-linli.timesgroup.cn:8001/wxApplyDistribution?token=",
          prodUrl:
            "https://mall-prod-app-linli.timesgroup.cn:8081/wxApplyDistribution?token=",
          externalLinks: true,
        },
        {
          title: "收货地址",
          icon: require("./images/address.png"),
          pageUrl: "/mall2/addresslist?pageType=1"
        },
        {
          title: "客服热线",
          icon: require("./images/message.png"),
          phone: "400-111-9928",
          pageUrl: "noNav"
        }
      ],
      memberInfo: {},
      userInfo: {
        userImage: "",
        userName: ""
      }
    };
  },
  components: {
    MinTop,
    GridList,
    BottomCell
  },
  methods: {
    navTo(url, value) {
      console.log(url);
      let params = {};
      if (url == "/record") {
        params = {
          totalRecord: value
        };
      }
      console.log(params);
      if (url == "") {
        return;
      } else {
        if (url == "wallet") {
          this.$toast("敬请期待");
        } else {
          this.$router.push({
            path: url,
            query: params
          });
        }
      }
    },
    bottomNavTo(item) {
      console.log(item);
      if (item.pageUrl == "") {
        this.$toast("敬请期待");
      } else {
        if (item.externalLinks) {
          // if (item.title == "分享有礼") {
          //   this.$store.state.environment == "development"
          //     ? (item.url =
          //         "http://8.129.64.205:8087/wxApplyDistribution?token=")
          //     : (item.url =
          //         "https://mall-prod-app-linli.timesgroup.cn:8081/wxApplyDistribution?token=");
          //   if (
          //     this.$store.state.webtype == 2 ||
          //     this.$store.state.webtype == 3
          //   ) {
          //     item.url = item.url + localStorage.getItem("ythToken");
          //   } else {
          //     item.url = item.url + this.$store.state.ythToken;
          //   }
          // } else {
          //   return;
          // }
          let url = "";
          this.$store.state.environment == "development"
            ? (url = item.devUrl)
            : (url = item.prodUrl);
          if (/token=/.test(url)) {
            let ythToken = "";

            this.$store.state.webtype == 2 || this.$store.state.webtype == 3
              ? (ythToken = localStorage.getItem("ythToken"))
              : (ythToken = this.$store.state.ythToken);

            url = url.replace(/token=/, `token=${ythToken}`);
          }
          console.log(url);
          window.location.href = url;
        } else {
          if (item.pageUrl == "noNav") {
            window.location.href = "tel:400-111-9928";
            return;
          } else {
            this.$router.push(item.pageUrl);
          }
        }
      }
    },
    async getMemberInformation() {
      let url = "/app/json/app_member_center/getDetailByMemberId";
      let params = {
        // memberId: this.$store.state.login.phone
      };
      try {
        let data = await this.$http.post(url, params);
        if (data && data.data.status == 0) {
          this.memberInfo = data.data.data;
          // this.memberInfo.memberCardRelats[0].rateBegin = 3
          // this.memberInfo.memberCardRelats[0].rangeBegin = 4000
          console.log("this.memberInfo", this.memberInfo);
          this.setValue(
            this.walletData.gridList,
            "bean",
            "value",
            this.memberInfo.integral ? this.memberInfo.integral : 0,
            false
          );
          // this.setValue(
          //   this.walletData.gridList,
          //   "coupons",
          //   "value",
          //   this.memberInfo.couponNum ? this.memberInfo.couponNum : 0,
          //   false
          // );
          const host = process.env.VUE_APP_CENTER_APP;
          const url = host + "/times/member-bff/coupon/api/v1/coupon-member/list";
          const params = {
            memberId: this.memberId,
            pageIndex: 1,
            businessType: "200001",
            pageSize: 10,
            state: 20
          };
          this.$http.get(url, { params: params }).then(resp => {
              if (resp.data.code === 200) {
                this.setValue(
                  this.walletData.gridList,
                  "coupons",
                  "value",
                  resp.data.data.total ? resp.data.data.total : 0,
                  false
                );
              }
            });
        } else {
          this.$toast("请求失败，请重新尝试");
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getUserInfo() {
      let url = "/app/json/login/getYthUser";
      console.log(
        "一体化token打印：：：：：：：：",
        this.$store.state.ythToken
      );
      console.log(
        "localstorage  ythtoken LLLL",
        localStorage.getItem("ythToken")
      );
      let params = {
        token: localStorage.getItem("ythToken")
      };
      try {
        let data = await this.$http.post(url, params);
        if (data && data.data.status == 0) {
          this.userInfo = data.data.data;
        } else {
          this.$toast("请求失败，请重新尝试");
        }
      } catch (err) {
        console.log(err);
      }
    },
    getWallet() {
      //获取零钱
      this.$http.post("/app/json/app_pay/getWalletBalance").then(res => {
        if (res.data.status == 0) {
          this.setValue(
            this.walletData.gridList,
            "wallet",
            res.data.data.availBalance,
            true
          );
        }
      });
    },
    getOrderCount() {
      //获取待支付订单数目
      this.$http.post("/app/json/app_shopping_order/queryBadge").then(res => {
        if (res.data.status == 0) {
          // this.setValue(
          //   this.orderData.gridList,
          //   "waitPay",
          //   "tipValue",
          //   res.data.data[0].count <=99? res.data.data[0].count :'99+',
          //   false
          // );
          // this.setValue(
          //   this.orderData.gridList,
          //   "waitDelivery",
          //   "tipValue",
          //   res.data.data[1].count <=99? res.data.data[1].count :'99+',
          //   false
          // );
          // this.setValue(
          //   this.orderData.gridList,
          //   "waitTakeDelivery",
          //   "tipValue",
          //   res.data.data[2].count <=99? res.data.data[2].count :'99+',
          //   false
          // );
          this.orderData.gridList.forEach((item, index) => {
            if (item.id !== "afterSales") {
              this.setValue(
                this.orderData.gridList,
                item.id,
                "tipValue",
                res.data.data[index].count <= 99
                  ? res.data.data[index].count
                  : "99+",
                false
              );
              this.setValue(
                this.orderData.gridList,
                item.id,
                "isShowTip",
                true,
                false
              );
            } else {
              console.log(this.orderData.gridList);
              return;
            }
          });
        }
      });
    },
    setValue(arr, id, valName, value, isToDecimal) {
      let newArr = arr.filter(e => {
        return e.id == id;
      });
      if (newArr.length !== 0) {
        let index = arr.indexOf(newArr[0]);
        if (isToDecimal) {
          arr[index][valName] = this.$util.toDecimal2(value);
        } else {
          arr[index][valName] = value;
        }
      }
    }
  },
  created() {
    if (!this.memberId) {
      this.$http
        .post("/app/json/user/getUserSummary", {
          deliveryType: "2",
          orderCategory: "0"
        })
        .then(res => {
          if (res.data.status == 0) {
            this.memberId = res.data.data.userInfo.userCode;
            this.getMemberInformation();
            this.getUserInfo();
            this.getWallet();
            this.getOrderCount();
          }
        });
    }else{
      this.getMemberInformation();
      this.getUserInfo();
      this.getWallet();
      this.getOrderCount();
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.router_class {
  background: #F7F7F7 !important;
}

.adapter {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 28.5px;
  background: #F7F7F7;
}
</style>

<template>
  <div class="min">
    <min-top :memberInfo="memberInfo" :userInfo="userInfo"></min-top>
    <GridList :gridData="walletData" @navTo="navTo"></GridList>
    <GridList :gridData="orderData" @navTo="navTo"></GridList>
    <BottomCell :cellData="cellData" @bottomNavTo="bottomNavTo"></BottomCell>
  </div>
</template>

<script>
import MinTop from "./components/min-top/min-top";
import GridList from "./components/gridList/gridList";
import BottomCell from "./components/bottomCell/bottomCell";
export default {
  data() {
    return {
      walletData: {
        gridList: [
          { title: "邦豆", value: "0", url: "", id: "bean" },
          { title: "优惠券", value: "0", url: "", id: "coupons" },
          {
            title: "零钱（元）",
            value: "0.00",
            url: "",
            id: "wallet",
            isShowUnit:true,
          },
        ],
        endData: {
          title: "我的钱包",
          icon: require("./images/wallet.png"),
          url: "wallet",
          imgWidth: "0.88rem",
          imgHeight: "0.706667rem",
        },
      },
      orderData: {
        gridList: [
          {
            title: "待支付",
            icon: require("./images/pay.png"),
            url: "/mall2/orderlist?selectedIndex=0",
            imgWidth: "0.6rem",
            imgHeight: "0.48rem",
            isShowTip:true,
            id:"waitPay",
            tipValue:"",
          },
          {
            title: "待发货",
            icon: require("./images/delivery.png"),
            url: "/mall2/orderlist?selectedIndex=1",
            imgWidth: "0.68rem",
            imgHeight: "0.546667rem",
            id:"waitDelivery",
            tipValue:"",
          },
          {
            title: "待收货",
            icon: require("./images/gif.png"),
            url: "/mall2/orderlist?selectedIndex=2",
            imgWidth: "0.546667rem",
            imgHeight: "0.546667rem",
            id:"waitTakeDelivery",
            tipValue:"",
          },
          {
            title: "退换/售后",
            icon: require("./images/afterSales.png"),
            url: "/mall2/serviceindex",
            imgWidth: "0.626667rem",
            imgHeight: "0.546667rem",
            id:"afterSales",
            tipValue:"",
          },
        ],
        endData: {
          title: "我的订单",
          icon: require("./images/order.png"),
          url: "/mall2/orderlist?selectedIndex=0",
          imgWidth: "0.773333rem",
          imgHeight: "0.826667rem",
        },
        isShowNumber: true,
      },
      cellData: [
        { title: "个人信息", icon: require("./images/user.png"),url:"" },
        { title: "分享有礼", icon: require("./images/share.png") ,url:"https://mall-prod-app-linli.timesgroup.cn:8081/wxApplyDistribution?token=",externalLinks:true },
        { title: "收货地址", icon: require("./images/address.png") ,url:"/mall2/addresslist?pageType=1"},
        {
          title: "客服热线",
          icon: require("./images/message.png"),
          phone: "400-111-9928",
          url:"noNav"
        },
      ],
      memberInfo: {},
      userInfo: {
        userImage: '',
        userName: ''
      },
    };
  },
  components: {
    MinTop,
    GridList,
    BottomCell,
  },
  methods: {
    navTo(url) {
      console.log(url);
      if( url == "" ){
        return;
      }else{
        if(url == 'wallet'){
          this.$toast('敬请期待')
        }else{
          this.$router.push(url)
        }
      }
    },
    bottomNavTo(item){
      console.log(item)
      if(item.url == ""){
        this.$toast("敬请期待");
      }else{
        if(item.externalLinks){
          if(item.title == '分享有礼'){
            process.env.NODE_ENV == 'development' ?item.url = 'http://8.129.64.205:8087/wxApplyDistribution?token=':item.url = 'https://mall-prod-app-linli.timesgroup.cn:8081/wxApplyDistribution?token='
            item.url = item.url + this.$store.state.ythToken
          }
          window.location.href = item.url;
        }else{
          if(item.url == "noNav"){
            return;
          }else {
            this.$router.push(item.url)
          }
        }
      }
    },
    async getMemberInformation() {
      let url = '/app/json/app_member_center/getDetailByMemberId'
      let params = {
        // memberId: this.$store.state.login.phone
      }
      try {
        let data = await this.$http.post(url, params);
        if (data && data.data.status == 0) {
          this.memberInfo = data.data.data;
          // this.memberInfo.memberCardRelats[0].rateBegin = 3
          // this.memberInfo.memberCardRelats[0].rangeBegin = 4000
          console.log("this.memberInfo",this.memberInfo);
          this.setValue(this.walletData.gridList,"bean",'value',this.memberInfo.integral,false);
          this.setValue(this.walletData.gridList,"coupons",'value',this.memberInfo.couponNum,false);
        } else {
          this.$toast("请求失败，请重新尝试");
        }
      } catch(err) {
        console.log(err)
      }
    },
    async getUserInfo() {
      let url = '/app/json/login/getYthUser'
      console.log('一体化token打印：：：：：：：：', this.$store.state.ythToken)
      let params = {
        token: this.$store.state.ythToken
      }
      try {
        let data = await this.$http.post(url, params);
        if (data && data.data.status == 0) {
          this.userInfo = data.data.data;
        } else {
          this.$toast("请求失败，请重新尝试");
        }
      } catch(err) {
        console.log(err)
      }
    },
    getWallet() {
      //获取零钱
      this.$http.post("/app/json/app_pay/getWalletBalance").then((res) => {
        if (res.data.status == 0) {
          this.setValue(this.walletData.gridList,"wallet",res.data.data.availBalance,true)
        }
      });
    },
    getOrderCount(){
      //获取待支付订单数目
      this.$http.post('/app/json/app_shopping_order/queryBadge').then(res=>{
        if (res.data.status == 0) {
          if(res.data.data[0].count<=99){
            this.setValue(this.orderData.gridList,"waitPay",'tipValue',res.data.data[0].count,false)
          }else{
            this.setValue(this.orderData.gridList,"waitPay",'tipValue','99+',false)
          }
        }
      })
    },
    setValue(arr, id, valName,value,isToDecimal) {
      let newArr = arr.filter((e) => {
        return e.id == id;
      });
      if (newArr.length !== 0) {
        let index = arr.indexOf(newArr[0]);
        if(isToDecimal){
          arr[index][valName] = this.$util.toDecimal2(value)
        }else{
          arr[index][valName] = value;
        }
      }
    },
  },
  created() {
    this.getMemberInformation()
    this.getUserInfo()
    this.getWallet();
    this.getOrderCount();
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.router_class {
  background: #F7F7F7 !important;
}

.min {
  overflow-y: auto;
  padding-bottom: 28.5px;
}
</style>
<template>
  <div class="order">
    <nav-top></nav-top>
    <van-tabs
      v-model="active"
      swipeable
      swipe-threshold="6"
      title-active-color="#E8374A"
      @click="navTo"
    >
      <van-tab
        :title="item.title"
        v-for="(item, index) in orderStatusList"
        :key="index"
        title-class="tabTitle"
        :name="item.components"
      >
      </van-tab>
    </van-tabs>
    <component v-bind:is="active"></component>
    <order-item 
      v-for="(item, index) in item" 
      :key="item.id" ref="order" 
      :type="item.type" 
      :id="item.id" 
      @checkEvent="checkEvent"
    ></order-item>
    <pay-div></pay-div>
  </div>
</template>

<script>
import navTop from "@/components/order/components/nav-top/nav-top";
import orderItem from "@/components/order/components/order-item/order-item";
import payDiv from "@/components/order/components/pay-div/pay-div";
import AllPages from "./pages/allOrder/allOrder";
import Cancel from "./pages/cancel/cancel";
import Finish from "./pages/finish/finish";
import WaitDelivery from "./pages/waitDelivery/waitDelivery";
import WaitPay from "./pages/waitPay/waitPay";
import WaitTakeDelivery from "./pages/waitTakeDelivery/waitTakeDelivery";
export default {
  data() {
    return {
      active: "AllPages",
      orderStatusList: [
        { title: "全部", components: "AllPages", id: 1 },
        { title: "待支付", components: "WaitPay", id: 2 },
        { title: "待发货", components: "WaitDelivery", id: 3 },
        { title: "待收货", components: "WaitTakeDelivery", id: 4 },
        { title: "已完成", components: "Finish", id: 5 },
        { title: "已取消", components: "Cancel", id: 6 },
      ],
      checkData: new Set(),
      item: [
        {type: 'xuanXing', id: 1},
        {type: 'wuyeFei', id: 2},
        {type: 'xuanXing', id: 3},
        {type: 'wuyeFei', id: 4}
      ]
    };
  },
  components: {
    navTop,
    orderItem,
    payDiv,
    AllPages,
    Cancel,
    Finish,
    WaitDelivery,
    WaitPay,
    WaitTakeDelivery,
  },
  created() {
    this.initPage(this.$route.params.id);
  },
  methods: {
    navTo(name, title) {
      this.active = name;
    },
    initPage(id) {
      let component = this.orderStatusList.filter((e) => {
        return e.id == id;
      });
      if (component.length != 0) {
        this.active = component[0].components;
      }
    },
    checkEvent(data) {
      let refs = this.$refs.order.filter((item) => {
        return item.type !== data.name
      })
      refs.forEach(item => {
        if (item.type !== data.name) {
          item.isDisabled = true
        }
      })
      if (data.checked) { // 选中
        this.checkData.add({type: data.name, id: data.id})
      } else { // 取消
        this.checkData.forEach(item => {
          if(item.id == data.id) {
            this.checkData.delete(item)
          }
        })
        if(this.checkData.size ==0) {
          this.$refs.order.forEach(item => {
            item.isDisabled = false
          })
        }
      }
      console.log(this.checkData)
    }
  },
  computed: {
    active: {
      get() {
        switch (this.$route.path) {
          case "/order/allOrder":
            return "/order/allOrder";

          case "/order/waitPay":
            return "/order/waitPay";

          case "/order/waitDelivery":
            return "/order/waitDelivery";

          case "/order/waitTakeDelivery":
            return "/order/waitTakeDelivery";

          case "/order/finish":
            return "/order/finish";
            
          case "/order/cancel":
            return "/order/cancel";

          default:
            return "/order/allOrder";
        }
      },
      set() {}
    },
  },
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

#app .router_class.order {
  background: #F9F9F9;
  overflow: auto;
  padding-bottom: 52px;
}

.van-tab__pane, .van-tab__pane-wrapper {
  padding-top: 10px;
}
.order {
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;
  /deep/.van-tab {
    font-size: 14px;
    font-weight: 400;
    color: #121212;
    line-height: 21px;
  }
  /deep/.van-tab--active {
    font-size: 15px;
    font-weight: 500;
  }
}
</style>
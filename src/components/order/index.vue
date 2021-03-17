<template>
  <div class="order">
    <van-sticky>
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
    </van-sticky>
    <div class="scroll">
      <component v-bind:is="active"></component>
    </div>
    <!-- <order-item
      v-for="item in item"
      :key="item.id"
      ref="order"
      :type="item.type"
      :id="item.id"
      @checkEvent="checkEvent"
    ></order-item> -->
  </div>
</template>

<script>
import navTop from "@/components/order/components/nav-top/nav-top";
import orderItem from "@/components/order/components/order-item/order-item";
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
        { type: "xuanXing", id: 1 },
        { type: "wuyeFei", id: 2 },
        { type: "xuanXing", id: 3 },
        { type: "wuyeFei", id: 4 },
      ],
      show: false,
    };
  },
  components: {
    navTop,
    orderItem,
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
      if (data.checkAll) {
        let refs = this.$refs.order.filter((item) => {
          return item.type == data.type;
        });
        if (data.checked) {
          refs.forEach((item) => {
            this.checkData.add({ type: item.name, id: item.id });
            item.isChecked = true;
            this.$refs.payDiv.isShow = true;
          });
        } else {
          this.checkData.clear();
          refs.forEach((item) => {
            item.isChecked = false;
            this.$refs.payDiv.isShow = false;
          });
        }
        return;
      }
      let refs = this.$refs.order.filter((item) => {
        return item.type !== data.name;
      });
      refs.forEach((item) => {
        if (item.type !== data.name) {
          item.isDisabled = true;
        }
      });
      if (data.checked) {
        // 选中
        this.checkData.add({ type: data.name, id: data.id });
        this.$refs.payDiv.isShow = true;
      } else {
        // 取消
        this.checkData.forEach((item) => {
          if (item.id == data.id) {
            this.checkData.delete(item);
          }
        });
        if (this.checkData.size == 0) {
          this.$refs.order.forEach((item) => {
            item.isDisabled = false;
            this.$refs.payDiv.isShow = false;
          });
        }
      }
      console.log(this.checkData);
    },
  },
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

#app .router_class.order {
  background: #F9F9F9;
  overflow: auto;
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

  /deep/.van-tabs__line {
    position: absolute;
    bottom: 15px;
    left: 0;
    z-index: 1;
    width: 32px;
    height: 4px;
    background: url('./img/currentSelectIcon.png');
    background-repeat: no-repeat;
    background-size: 32px 4px;
    padding-bottom: 9px;
    border-radius: 0px;
  }

  .scroll {
    overflow-y: auto;
    padding-top: 12px;
  }
}
</style>
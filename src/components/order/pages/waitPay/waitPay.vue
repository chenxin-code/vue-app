<template>
  <div class="waitPay">
    <order-item
      v-for="item in orderItem"
      :key="item.id"
      ref="order"
      :type="item.type"
      :id="item.id"
      @checkEvent="checkEvent"
    ></order-item>
    <pay-div
      ref="payDiv"
      :checkData="checkData"
      @checkEvent="checkEvent"
    ></pay-div>
  </div>
</template>

<script>
import payDiv from "@/components/order/components/pay-div/pay-div";
import orderItem from "@/components/order/components/order-item/order-item";

export default {
  name: "waitPay",

  data() {
    return {
      checkData: new Set(),
      orderItem: [
        { type: "xuanXing", id: 1 },
        { type: "wuyeFei", id: 2 },
        { type: "xuanXing", id: 3 },
        { type: "wuyeFei", id: 4 },
      ],
      show: false,
    };
  },
  components: {
    payDiv,
    orderItem,
  },
  methods: {
    checkEvent(data) {
      if (data.checkAll) {
        let refs = this.$refs.order.filter((item) => {
          return item.type == data.type;
        });
        if (data.checked) {
          refs.forEach((item) => {
            this.checkData.add({ type: item.type, id: item.id });
            item.isChecked = true;
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
        return item.type !== data.type;
      });
      refs.forEach((item) => {
        if (item.type !== data.type) {
          item.isDisabled = true;
        }
      });
      let checkedTotal = this.$refs.order.length - refs.length;
      if (data.checked) {
        // 选中
        this.checkData.add({ type: data.type, id: data.id });
        this.$refs.payDiv.type = data.type;
        this.$refs.payDiv.isShow = true;
        if (this.checkData.size == checkedTotal) {
          this.$refs.payDiv.isChecked = true;
        }
      } else {
        // 取消
        this.checkData.forEach((item) => {
          if (item.id == data.id) {
            this.checkData.delete(item);
            this.$refs.payDiv.isChecked = false;
          }
        });
        if (this.checkData.size == 0) {
          this.$refs.order.forEach((item) => {
            item.isDisabled = false;
            this.$refs.payDiv.isShow = false;
          });
        }
      }
    },
  },
};
</script>


<style lang="stylus" scoped type="text/stylus">
.waitPay {
  padding-bottom: 52px;
}
</style>
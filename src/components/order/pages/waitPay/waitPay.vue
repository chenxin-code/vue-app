<template>
  <div class="waitPay">
    <order-item
      v-for="item in orderItem"
      :key="item.id"
      ref="order"
      :type="item.type"
      :id="item.id"
      @checkEvent="checkEvent"
      :pageType="waitPay"
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
      // 从全选checkbox进来
      if (data.checkAll) {
        let refs = this.$refs.order.filter((item) => {  // 找出全选的类型并保存起来
          return item.type == data.type;
        });
        if (data.checked) { //全部选中
          refs.forEach((item) => { //保存选中数据并设置每个checkbox选中状态
            this.checkData.add({ type: item.type, id: item.id }); 
            item.isChecked = true;
          });
        } else { // 全部取消
          this.checkData.clear();  //清空checkData
          refs.forEach((item) => {
            item.isChecked = false;  // 设置每个checkbox为没选中状态
            this.$refs.payDiv.isShow = false;  //隐藏全选按钮
          });
        }
        return;
      }

      // 选中或取消当个checkbox
      let refs = this.$refs.order.filter((item) => {  // 找到不能选的checkbox
        return item.type !== data.type;
      });
      refs.forEach((item) => {   // 并设置不能选择属性
        if (item.type !== data.type) {
          item.isDisabled = true;
        }
      });

      let checkedTotal = this.$refs.order.length - refs.length;  // 计算出所有可以选的checkbox

      if (data.checked) {
        // 选中
        this.checkData.add({ type: data.type, id: data.id });
        this.$refs.payDiv.type = data.type;
        this.$refs.payDiv.isShow = true; // 显示全选按钮
        if (this.checkData.size == checkedTotal) {  //checkData数量跟可选checkbox数量相等 =>全选
          this.$refs.payDiv.isChecked = true;  // 全选按钮变成选中
        }
      } else {
        // 取消
        this.checkData.forEach((item) => {
          if (item.id == data.id) {
            this.checkData.delete(item); // 删除数据中取消选中的数据
            this.$refs.payDiv.isChecked = false; // 没有全选，所以全选checkbox变成没选中
          }
        });
        if (this.checkData.size == 0) { // 个数为0，全部取消选中
          this.$refs.order.forEach((item) => {
            item.isDisabled = false; // 所有checkbox变成可选
          });
          this.$refs.payDiv.isShow = false; //隐藏全选
        }
      }
      console.log(this.checkData);
    },
  },
};
</script>


<style lang="stylus" scoped type="text/stylus">
.waitPay {
  padding-bottom: 52px;
}
</style>
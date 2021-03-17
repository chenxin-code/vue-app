<template>
  <div class="allOrder">
      <order-item></order-item>
  </div>
</template>

<script>
import orderItem from "@/components/order/components/order-item/order-item";
export default {
  name:'allOrder',
  data() {
    return {

    };
  },
  components: {
    orderItem
  },
};
</script>


<style lang="stylus" scoped type="text/stylus">
</style>
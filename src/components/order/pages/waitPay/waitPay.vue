<template>
  <div class="waitPay">
    <pay-div
      ref="payDiv"
      :checkData="checkData"
      @checkEvent="checkEvent"
    ></pay-div>
  </div>
</template>

<script>
import payDiv from "@/components/order/components/pay-div/pay-div";

export default {
  name: "waitPay",

  data() {
    return {};
  },
  components: {
    payDiv,
  },
};
</script>


<style lang="stylus" scoped type="text/stylus">
.waitPay {
  padding-bottom: 52px;
}
</style>
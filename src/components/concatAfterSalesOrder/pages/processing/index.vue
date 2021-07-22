<template>
  <div class="processing">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="'- 亲, 没有更多订单了 -'"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :immediate-check="false"
      >
        <div
          v-for="(item, index) in currentOrderList"
          :key="index"
          class="scroll"
        >
          <AfterSalesItem />
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import AfterSalesItem from "@/components/concatAfterSalesOrder/components/after-sales-item/index";
export default {
  name: "processing",
  data() {
    return {
      currentOrderList: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      refreshing: false,
      loading: false,
      finished: false,
      error: false,
    };
  },
  components: {
    AfterSalesItem,
  },
  methods: {
    onLoad() {},
    onRefresh() {},
  },
};
</script>
 
<style lang="stylus" scoped type="text/stylus">
.processing {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 130px;
}
</style>
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
      currentPage: 0,
      maxPage: 0,
    };
  },
  components: {
    AfterSalesItem,
  },
  created() {
    this.getMallOrder();
    this.getServiceMallOrder();
  },
  methods: {
    onLoad() {},
    onRefresh() {},
    getMallOrder() {
      let url = "/app/json/app_order_after_sale/queryProcessingOrder";
      this.currentPage += 1;
      let parmas = {
        page: { index: this.currentPage, pageSize: 10 },
      };
      return new Promise((resolve, reject) => {
        this.$http.post(url, { ...parmas }).then(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
      });
    },
    getServiceMallOrder() {
      let url =
        "https://mall-uat-api-linli.timesgroup.cn:1443/times-center-trade/mall/after/sale/list";
      this.currentPage += 1;
      let parmas = {
        pageNum: 1,
        pageSize: 10,
      };
      return new Promise((resolve, reject) => {
        this.$http.post(url, parmas).then(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
      });
    },
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
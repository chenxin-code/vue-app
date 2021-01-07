<template>
  <div class="order-logistics-index">
    <nav-top title="订单物流" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="order-logistics-container">
      <van-steps class="orderlogistics" direction="vertical" :active="0">
        <van-step v-for="(item,index) in logisticsArr" :key="index">
          <h3>{{item.opDesc}}</h3>
          <p>{{item.opTime}}</p>
        </van-step>
      </van-steps>
    </nav-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logisticsArr: [],
      traceNo: ''
    }
  },
  mounted() {
    this.traceNo = this.$route.query.traceNo || ''
    this.$request.post('/app/json/app_third/queryPush', { traceNo: this.traceNo }).then(res => {
      if (res.status == 0) {
        this.logisticsArr = res.data.data
      }
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.order-logistics-index {
  background-color: #F2F2F4 !important;

  .order-logistics-container {
    padding: 10px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .orderlogistics {
      border-radius: 5px;
    }
  }
}
</style>


<template>
  <div class="box">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" >
        <van-cell v-for="item in list" :key="item.ouCode" :title="item.ouName" @click="backEvent(item)"/>
      </van-list> 
    </nav-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: true,
      finished: true,
    };
  },
  mounted() {
    this.$request.post('/app/json/micro_store_front_end/queryMerchantList').then(res => {
      let data = res.data
      if (res.status === 0) {
        console.log()
        this.list = data || []
      } else {
        this.$toast(res.info)
      }
    })
  },
  methods: {
    backEvent(item) {
      this.$emit("closeEvent",item);
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.box {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color #fff
  z-index: 10;
  /deep/ .nav-content {
    overflow-y: auto;
  }
}
</style>

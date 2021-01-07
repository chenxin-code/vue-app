
<template>
  <div>
    <nav-top :title="tab ? '网点列表' : '我的订单'" @backEvent="backEvent"></nav-top>
    <myOrder v-show="tab == 0" ref="myOrder"/>
    <deviceList v-show="tab == 1" />
    <div class="btm-btn">
      <div class="tab">
        <div class="img" @click="tabClick(0)">
          <img v-if="tab" src="./images/tab-我的订单2.png" alt="" class="icon-btn">
          <img v-else src="./images/tab-我的订单1.png" alt="" class="icon-btn">
        </div>
      </div>
      <div class="tab">
        <div class="img" @click="tabClick(1)">
          <img v-if="tab" src="./images/tab-网点查询1.png" alt="" class="icon-btn">
          <img v-else src="./images/tab-网点查询2.png" alt="" class="icon-btn">
        </div>
      </div>
      <div class="tabScanCode" @click="scanHandler">
        <img src="./images/tab-扫一扫.png" alt="" class="icon-btn">
      </div>
    </div>
  </div>
</template>
<script>
// import mixin from "./mixin";
import deviceList from './deviceList/index.vue'
import myOrder from './myOrder/index.vue'
export default {
  name: "home",
  // mixins: [mixin],
  data() {
    return {
      tab: 1
    };
  },
  components: {deviceList, myOrder},
  beforeRouteLeave(to, from, next) {
    if (to.path == "/common") {
      this.$keepaliveHelper.deleteCache(this)
    }
    next()
  },
  activated() {
    if (this.$route.query.lastPath == '/device_management/paySuccess') {
      this.tab = 0
      this.$refs.myOrder.setRewardState('进行中')
    } else if (this.$route.query.lastPath == '/device_management/paySuccess')  {
      // this.tab = 0
      // this.$refs.myOrder.setRewardState('退款‘)
    }
  },
  created() {},
  mounted() {},
  methods: {
    backEvent() {
      let num = this.$router.customRouterData.routerPaths.length - 2;
      this.$router.go(-num);
      this.$keepaliveHelper.deleteCache(this)
    },
    tabClick(tab) {
      this.tab = tab
    },
    scanHandler() {
      // this.$market.showScan()
      this.$bridgefunc.scanCode(res => {
        let tempCode = JSON.parse(res.code)
        if (tempCode) {
          this.$router.push({
            path: '/device_management/payment',
            query: {
              id: tempCode.deviceId
            }
          })
        }
      })
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
  .btm-btn {
    position fixed;
    left 0;
    right 0;
    bottom 0;
    height: 60px;
    background-color #fff
    display flex;
    justify-content center
    align-items center
    .tab {
      flex 1
      height 100%
      display flex;
      align-items center
      justify-content center
      .img {
        width 50px
        height 50px
        img {
          width 100%
          height 100%
        }
      }
    }
    .tabScanCode {
      position absolute
      bottom 20px
      img {
        width 70px
        height 70px
      }
    }
  }
</style>

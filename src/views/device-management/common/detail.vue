
<template>
  <div>
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content class="container">
      <div class="detail-item">
        <!-- <img :src="item.picUrl" alt="" class="left-icon"> -->
        <div class="center-content">
          <span class="titer">{{`${item.brandName}${item.deviceName}`}}</span>
          <span style="color: #666">{{item.stationName}}</span>
        </div>
        <div class="right-btn">
          <span>
            <van-tag :color="useState(item).color" type="primary"></van-tag>
            <i style='font-style:normal' :style="{color: useState(item).color}">{{useState(item).typeText}}</i>
          </span>
          <span>
            <i style="font-style:normal;color: #0e80ff">设备编号：7378987</i>
          </span>
        </div>
      </div>
      <div class="explain">
        <p>活动说明</p>
        <div class="content" v-html="item.instruction"></div>
      </div>
    </nav-content>
    <!-- v-if="item.electricState == 1 && item.useState == 0" -->
    <div class="btm-btn" >
      <div class="tabScanCode" @click="scanHandler">
        <img src="../images/tab-扫一扫.png" alt="" class="icon-btn">
      </div>
    </div>
  </div>
</template>
<script>
import mixin from "../mixin";
export default {
  name: "home",
  mixins: [mixin],
  data() {
    return {
      item: {}
    };
  },
  // components: {deviceList, myOrder},
  created() {
    let id = this.$route.query.id || ''
    this.$request.post('/app/json/app_selfservice_device/getDeviceDetail',{id: id}).then(res => {
      if (res.status == 0) {
        this.item = res.data || {}
      } else {
        this.$Toast(res.info);
      }
    })
  },
  mounted() {},
  methods: {
    backEvent() {
      this.$router.go(-1)
    },
    scanHandler() {
      // this.$router.push({
      //   path: '/device_management/payment',
      //   query: {
      //     id: 1327
      //   }
      // })
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
@import '~@/common/stylus/variable.styl';
.container {
  background-color #f6f6f6
  position: relative;
  width: 100%;
  height: 100%;
  // overflow: hidden;
  padding 10px
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  .detail-item {
    padding 10px;
    width 100%
    height 80px;
    border-radius 5px;
    background-color #fff;
    display flex
    .left-icon {
      display block;
      width 100px;
      height 80px;
    }
    .center-content {
      // margin-top 10px
      width calc(100% - 160px);
      display flex
      flex-direction column
      .titer {
        font-size 14px;
        font-weight 500
      }
      span {
        width 100%
        height 100%
        overflow hidden
        text-overflow:ellipsis
        white-space: nowrap
        display flex
        align-items center
      }
    }
    .right-btn {
      padding 10px 0
      width 160px
      display flex;
      flex-direction column;
      justify-content space-between
      align-items flex-end

      img {
        width 20px;
        height 20px;
      }
    }
  }
  .explain {
    margin-top 20px
    padding 10px
    background-color #fff
    p {
      font-size: 14px;
      margin-bottom: 6px;
    }

    .content {
      color: rgb(102, 102, 102)
      margin-top 10px
    }
  }
}
  .btm-btn {
    position fixed;
    left 0;
    right 0;
    bottom 0;
    height: 60px;
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
/deep/ .van-tag {
  height 10px
  width 10px
  border-radius 10px
}
/deep/ .van-icon {
  color: #666;
}
</style>

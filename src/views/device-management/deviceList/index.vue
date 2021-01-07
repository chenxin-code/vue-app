
<template>
  <nav-content class="container">
    <div class="container-box">
      <!-- <van-search v-model="value" shape="round" placeholder="请输入设备所在油站" /> -->
      <van-search v-model="stationName" show-action placeholder="请输入设备所在油站" @search="onSearch" >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
      <ul class="device-list" v-if="getDeviceList.length">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <li v-for="(item, index) in getDeviceList" :key="index" class="item" @click="toDevice(item)">
            <div class="left-icon">
              <img :src="item.picUrl" alt="" class="img">
            </div>
            <div class="center-content">
              <span class="titer">{{`${item.brandName}${item.deviceName}`}}</span>
              <span style="color: #666">{{item.stationName}}</span>
              <span style="color: #666">{{item.address}}</span>
            </div>
            <div class="right-btn">
              <span>
                <i style='font-style:normal' :style="{color: useState(item).color}">{{useState(item).typeText}}</i>
                <van-tag :color="useState(item).color" type="primary"></van-tag>
              </span>
              <span>
                <i style="font-style:normal;color: #666">{{`${item.distance} m`}}</i>
                <van-icon color="color: #666" size='12' name="location" />
              </span>
            </div>
          </li>
          <li style="text-align: center;margin: 10px 0; color: rgb(179, 175, 175)">暂无更多数据～</li>
        </van-pull-refresh>
      </ul>
      <p class="no-result-message" v-else>暂无数据～</p>
    </div>
  </nav-content>
</template>
<script>
import mixin from "../mixin";
export default {
  name: "home",
  mixins: [mixin],
  data() {
    return {
      tab: 0,
      isLoading: false,
      stationName: '',
      getDeviceList: []
    };
  },
  created() {
    this._loadList({
      stationName: '',
      posx: this.$store.state.currentLocation.posx,
      posy: this.$store.state.currentLocation.posy,
      bsnsType: 1
    })
  },
  mounted() {},
  methods: {
    backEvent() {
      this.$router.go(-1)
    },
    _loadList(obj) {
      this.$request.post('/app/json/app_selfservice_device/getDeviceList',obj).then(res => {
        if (res.status == 0) {
          this.isLoading = false;
          this.getDeviceList = res.data || []
          this.getDeviceList.forEach((res,index)=>{
            // res.useState = 1
            // res.electricState = index
          })
          console.log(this.getDeviceList)
        } else {
          this.$Toast(res.info);
        }
      })
    },
    onRefresh() {
      this._loadList({
        stationName: '',
        posx: this.$store.state.currentLocation.posx,
        posy: this.$store.state.currentLocation.posy,
        bsnsType: 1
      })
    },
    onSearch() {
      this._loadList({
        stationName: this.stationName,
        posx: this.$store.state.currentLocation.posx,
        posy: this.$store.state.currentLocation.posy,
        bsnsType: 1
      })
    },
    toDevice(item) {
      this.$router.push({
        path: '/device_management/detail',
        query: {
          id: item.id
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
  overflow: hidden;
  .container-box {
    width 100%
    height: 100%
    padding 10px;
    .device-list {
      width 100%
      height: calc(100% - 200px);
      // overflow-y: auto;
      // -webkit-overflow-scrolling: touch;
      .item {
        padding 10px;
        width 100%
        border-radius 5px;
        margin-top 10px;
        background-color #fff;
        display flex
        .left-icon {
          display block;
          width 100px;
          height 80px;
          .img {
            width 100%
            height 100%
          }
        }
        .center-content {
          margin-left 10px
          width calc(100% - 120px);
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
          width 100px
          display flex;
          flex-direction column;
          justify-content space-between
          align-items: flex-end;
          img {
            width 20px;
            height 20px;
          }
        }
      }
    }
  }
  .no-result-message {
    text-align center;
    font-size 13px;
    padding-top 50px;
    color #999;
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
/deep/ .van-pull-refresh{
  height 100%
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
} 
/deep/ .van-pull-refresh__track{
  height 100%
}
</style>

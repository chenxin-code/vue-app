/**Created by liaoyingchao on 2020-04-10.*/

<template>
  <div class="share">
    <LiveStream ref="LiveStream" v-show="showLiveStream" @backEvent="backEvent" :list="list"></LiveStream>
    <van-popup :close-on-click-overlay="false" v-model="showPop">
      <div class="subscribe-div">
        <div class="top-div line_bottom">
          <div class="header-img">
            <img :src="shareInfo.liveHeadImg">
          </div>
          <div class="title">{{shareInfo.liveTitle}}</div>
        </div>
        <div class="content">
          <div v-if="isTimeOut">
            <div class="tip">
              <span>主播还在来的路上，可点击下方订阅按钮，我们会在主播开播后第一时间通知您~</span>
            </div>
          </div>
          <div v-else>
            <div class="start-time">直播时间：{{shareInfo.startTime}}</div>
            <div class="count-down-cell">
              <span>距离开始还剩：</span>
              <Countdown @timeOut="timeOut" :endTime="getCountdownTime" ></Countdown>
            </div>
          </div>
          <div class="btn line_circle subscribe-btn" v-if="shareInfo.isSubscribe == 0" @click="subscribe">订阅</div>
          <div class="btn line_circle cancel-btn" v-else @click="cancelSubscribe">取消订阅</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import Countdown from "@/components/Vendor/countdown/countdown";
  import LiveStream from './detail'

  export default {
    name: "share",
    components: {
      LiveStream,
      Countdown
    },
    data() {
      return {
        showLiveStream: false,
        showPop: false,
        playId: '',
        detail: {},
        list: [],
        shareInfo: {},
        isTimeOut: false
      }
    },
    computed: {
      getCountdownTime: function () {
        let startT = this.$util.getDateFromString(this.shareInfo.startTime)
        return startT
      }
    },
    methods: {
      cancelSubscribe: function () {
        this.$Loading.open();
        let url = '/app/json/live_broadcast/liveSubscribe';
        let params = {
          streamerId: this.shareInfo.id,
          isSubscribe: '0',
          type: '0'
        }

        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.getShareInfo()
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },
      subscribe: function () {
        this.$Loading.open();
        let url = '/app/json/live_broadcast/liveSubscribe';
        let params = {
          streamerId: this.shareInfo.id,
          isSubscribe: '1',
          type: '1',
        }

        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.getShareInfo()
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },
      timeOut: function () {
        this.isTimeOut = true
        this.getShareInfo()
      },
      backEvent: function () {
        this.showLiveStream = false
        this.$router.replace({
          path: '/live-stream/list',
          query: {
            backType: 'backindex'
          }
        })
      },
      getDetailInfo: function () {
        this.$Loading.open();
        let url = '/app/json/live_broadcast/detail';
        let params = {
          lbId: this.playId
        }

        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.list = [data.data]
            this.detail = data.data;
            this.showLiveStream = true
            this.$refs.LiveStream.playDetail(this.detail)
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },
      getShareInfo: function () {
        this.$Loading.open();
        let url = '/app/json/live_broadcast/getStreamerInfoByQrCode';
        let params = {
          liveQrCode: this.liveQrCode
        }

        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.shareInfo = data.data
            this.playId = data.data.liveId
            if (this.shareInfo.type == '1') {
              this.showPop = false
              this.getDetailInfo()
            } else {
              this.showPop = true
            }
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },
    },
    created() {
      this.liveQrCode = this.$route.query.liveQrCode || ''
      if (this.liveQrCode) {
        this.getShareInfo()
      } else {
        this.playId = this.$route.query.playId || ''
        this.getDetailInfo()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .share {
    width 100%
    height 100%
    overflow hidden
    >>>.van-popup {
      border-radius 5px;
    }
    >>>.subscribe-div {
      width 300px;
      padding 12px;
      .top-div {
        padding-bottom 12px;
        display flex;
        align-items center;
        .header-img {
          overflow hidden;
          border-radius 20px;
          img {
            display block;
            width 34px;
            height 34px;
          }
        }
        .title {
          font-size 14px;
          padding-left 10px;
        }
      }
      .content {
        text-align center;
        padding-top 12px;
        .start-time {
          margin-top 10px;
          font-size 14px;
        }
        .tip {
          padding 10px;
          line-height 1.6;
          font-size 13px;
        }
        .count-down-cell {
          margin-top 10px;
          display flex;
          align-items center;
          justify-content center;
        }
        .btn {
          width 130px;
          margin 12px auto 10px;
          font-size 15px;
          padding 12px;
          &.subscribe-btn {
            border-radius 20px;
            background-color #f80f16
            color white;
          }
          &.cancel-btn {
            color #f80f16
          }
          &:before {
            border-color #f80f16
          }
        }
      }
    }
  }
</style>

<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="wash-state-container">
        <div class="loader-wrapper">
          <div class="loader">
            <div class="loader-inner"></div>
          </div>
          <div class="countdown-time">
           <img src="../images/洗车未开始.png" alt="">
          </div>
          <div class="time">
            <p>剩余</p>
            <van-count-down
              ref="countDown"
              :time="countdownTime"
              class="count-down"
              format="mm’ss''"
              @finish="countdownFinish"
              :auto-start="false"/>
          </div>
        </div>
      </div>
      <div class="btm-btn" v-if="!isFinish">
        <div class="btn-l" @click="isShowStopDialog = true">
          <img src="../images/icon-stop.png" alt="" class="icon-btn">
          停止洗车
        </div>
        <!-- <div class="btn-r" @click="pauseHandler">
          <img src="../images/icon-start.png" alt="" class="icon-btn">
          <span class="pause-text">开始洗车</span>
        </div> -->
        <!-- <div class="btn-r" @click="pauseHandler">
          <img src="../images/icon-pause.png" alt="" class="icon-btn">
          <span class="pause-text">暂停</span>
        </div> -->
        <!-- <div class="btn-r" @click="pauseHandler">
          <img src="../images/icon-pause.png" alt="" class="icon-btn" v-if="!isPause">
          <img src="../images/icon-start.png" alt="" class="icon-btn" v-else>
          <span class="pause-text" v-if="!isPause">暂停</span>
          <span class="continue-text" v-else>{{ pauseTime }}"秒后自动洗车</span>
        </div> -->
      </div>
      <div class="btm-btn-f" v-else>
        <div class="btn-l" @click="viewWashOrder">查看洗车记录</div>
        <div class="btn-r" @click="backHome">返回洗车首页</div>
      </div>
      <div class="tel">客服电话：<a href='3021883'>3021883</a></div>
    </nav-content>
    <!-- 紧急停止 -->
    <van-dialog
      class="reset-dialog-style"
      v-model="isShowStopDialog"
      show-cancel-button
      cancel-button-text="再想想"
      confirm-button-text="确认"
      @confirm="confirmStopWash">
      <div slot="title">紧急停止</div>
      点击紧急停止，将直接结束当前洗车，<br/>是否确认紧急停止？
    </van-dialog>
    <!-- 停车位置错误 -->
    <van-dialog
      class="reset-dialog-style"
      v-model="tips"
      confirm-button-text="我知道了！">
      <div slot="title">停车位置错误</div>
      当前停车不在洗车的有效范围内！<br/>无法开启洗车服务
    </van-dialog>
  </div>
</template>
<script>
import Moment from 'moment'
import { CountDown } from 'vant'
export default {
  data() {
    return {
      tips: false,
      isShowStopDialog: false,
      isFinish: false,
      countdownTime: 0,
      isPause: false,
      ifFinished: false,
      pauseTime: 60,
      interId: null,
      orderId: '',
      orderType: '',
      tradeNo: '',
    }
  },
  mounted() {
    console.log('orderId', this.$route.query.orderId)
    console.log('orderType', this.$route.query.orderType)
    console.log('tradeNo', this.$route.query.tradeNo)
    console.log('deviceCode', this.$route.query.deviceCode)
    console.log('storeOuCode', this.$route.query.storeOuCode)

    if (this.$route.query.isCountContinue == 1) {
      let endTime = Moment(this.$route.query.startTime).add(Number(this.$route.query.washerTime), 'minutes')
      let currentTime = Moment()
      this.countdownTime =  endTime.diff(currentTime)
      
      this.startHandler()
    } else {
      this.startWashCar()
    }
  },
  components: {
    'van-count-down': CountDown
  },
  methods: {
    // 开始洗车
    startWashCar() {
      this.$Loading.open()
      this.$http.post('/app/json/app_self_car_order/start', {
        orderId: this.$route.query.orderId,
        deviceCode: this.$route.query.deviceCode,
        tradeNo: this.$route.query.tradeNo,
        orderType: this.$route.query.orderType
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          let endTime = Moment(data.data.stockupFinishTime).add(Number(data.data.utilityType), 'minutes')
          let currentTime = Moment()
          this.countdownTime = endTime.diff(currentTime)
          
          this.startHandler()
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`start err ${err}`)
      })
    },
    // 检查订单详情
    checkWorkState() {
      this.$Loading.open()
      let params = {
        orderType: this.orderType,
        orderId: this.orderId
      }
      this.$http.post('/app/json/app_wash_car_order/detail', params).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          // 17 洗车中
          // 18 洗车完成
          // 19 洗车失败
          if (data.data.state == 18 || data.data.state == 19) {
            this.ifFinished = true
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`detail err ${err}`)
      })
    },
    // 开始倒计时
    startHandler() {
      this.$nextTick(() => {
        this.$refs.countDown.start()
        document.querySelector('.loader').classList.add('has-animation')
      })
    },
    // 暂停&继续
    pauseHandler() {
      this.$nextTick(() => {
        if (this.isPause) { // 继续
          this.$Loading.open()
          this.$http.post('/app/json/app_wash_car_order/continuing', {
            orderId: this.orderId,
            orderType: this.orderType
          }).then(res => {
            this.$Loading.close()
            let data = res.data
            if (data.status == 0) {
              this.isPause = !this.isPause
              this.$refs.countDown.start()
              document.querySelector('.loader').setAttribute('style', 'animation-play-state: running')
              if (this.interId) {
                window.clearInterval(this.interId)
              }
            } else {
              this.$Toast(data.info)
            }
          }).catch(err => {
            this.$Loading.close()
            this.$Toast(`continuing err ${err}`)
          })
        } else { // 暂停
          this.$Loading.open()
          this.$http.post('/app/json/app_wash_car_order/pause', {
            orderId: this.orderId,
            orderType: this.orderType
          }).then(res => {
            this.$Loading.close()
            let data = res.data
            if (data.status == 0) {
              this.isPause = !this.isPause
              this.$refs.countDown.pause()
              document.querySelector('.loader').setAttribute('style', 'animation-play-state: paused')
              this.startPauseCountDown()
            } else {
              this.$Toast(data.info)
            }
          }).catch(err => {
            this.$Loading.close()
            this.$Toast(`pause err ${err}`)
          })
        }
        this.pauseTime = 60
      })
    },
    // 开始暂停倒计时
    startPauseCountDown() {
      if (this.interId) {
        window.clearInterval(this.interId)
      }
      this.interId = setInterval(() => {
        --this.pauseTime
        console.log('计时钟', this.pauseTime)
        if (this.pauseTime <= 0) {
          window.clearInterval(this.interId)
          this.pauseHandler()
          this.checkWorkState()
          this.interId = null
        }
      }, 1000)
    },
    // 确定紧急停止
    confirmStopWash() {
      this.$Loading.open()
      this.$http.post('/app/json/app_self_car_order/stop', {
        deviceCode: this.$route.query.deviceCode,
        tradeNo: this.$route.query.tradeNo,
        orderId: this.$route.query.orderId,
        orderType: this.$route.query.orderType
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.countdownFinish()
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`stop err ${err}`)
      })
    },
    // 洗车倒计时完成
    countdownFinish() {
      // this.checkWorkState()
      this.$nextTick(() => {
        document.querySelector('.loader').setAttribute('style', 'animation-play-state: paused')
        this.countdownTime = 0
        this.$refs.countDown.pause()
        this.isFinish = true
      })
    },
    // 查看洗车记录
    viewWashOrder() {
      this.$router.replace({
        path: '/carWash/washRecording',
      })
    },
    // 返回洗车首页
    backHome() {
      this.$router.replace('/carWash/home')
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.interId) {
      window.clearInterval(this.interId)
    }
    next()
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.container {
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
  .tel {
    font-size 15px
    color #909090
    width 100%
    position fixed;
    bottom 20px;
    text-align center
  }
}

.wash-state-container {
  margin: 10px 15px 0;
  background-color: #fff;
  border-radius: 5px;
  height: 400px;
  position relative
  .loader-wrapper {
    position: absolute;
    left: 50%;
    top: 40%;
    width: 240px;
    height: 240px;
    transform: translate(-50%, -50%);
    .loader {
      width: 240px;
      height: 240px;
      border-radius: 50%;
      &.has-animation {
        animation loading 1s linear infinite;
      }
      .loader-inner {
        position: absolute;
        width: 50%;
        height: 100%;
        border-radius: 0 120px 120px 0;
        left: 50%;
        /* 过渡到中间颜色为 #d0cfcf 最终末尾颜色为 #eee */
        background: #E5F8E8;
        z-index: 1;
      }
    }
    .countdown-time {
      position absolute;
      left 0;
      right 0
      top 0;
      bottom 0;
      z-index 2
      display flex
      justify-content center
      align-items center
      img {
        width 70px
        height 70px
      }
    }
    .time {
      color #118820
      margin 30px 0
      display flex
      justify-content center
      align-items center
      flex-direction column
      p {
        font-size 15px
        font-weight 500
      }
      .count-down {
        color #118820
        font-size 30px
        font-weight 500
        margin-top 12px
      }
    }
  }
}


.loader::before {
  content: '';
  position: absolute;
  width: 50%;
  height: 100%;
  border-radius: 120px 0 0 120px;
  /* 起始最深颜色为 #999，过渡到中间颜色为 #d0cfcf */
  background: linear-gradient(#118820, #E5F8E8, #E5F8E8);
  z-index: 2;
}

.loader::after {
  content: '';
  position: absolute;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  top: 4px;
  left: 4px;
  border-radius: 50%;
  background-color: #fff;
  z-index: 2;
}

.btm-btn {
  padding 10px 0;
  margin 10px 16px
  display flex;
  justify-content center;

  .btn-l,
  .btn-r {
    width 48%;
    height 44px;
    line-height 43px;
    text-align center;
    border-radius 22px;
    overflow hidden;
    position relative;
    font-size 18px;
    .icon-btn {
      float left;
      width 44px;
      height 44px;
    }
    .continue-text {
      font-size 12px;
      font-weight 500
    }
  }
  .btn-l {
    background-color #FF6745;
    font-weight 500;
    color #fff;
  }
  .btn-r {
    background-color #118820;
    color #fff;
    font-weight 500;
  }
}

.btm-btn-f {
  padding 10px 0;
  margin 10px 16px
  display flex;
  justify-content center;

  .btn-l,
  .btn-r {
    width 48%;
    height 44px;
    line-height 43px;
    text-align center;
    border-radius 22px;
    overflow hidden;
    position relative;
    font-size 18px;
    font-weight 500;
    color #118820;
    border .5px solid #118820;
    .continue-text {
      font-size 12px;
      font-weight 500
    }
  }
  .btn-l {
    margin-right 5px;
  }
  .btn-r {
    margin-left 5px;
  }
}

.reset-dialog-style {
  border-radius 5px;
  /deep/ .van-dialog__header {
    padding-top 30px;
    font-size 24px;
    font-weight 500;
    color #118820
  }
  /deep/ .van-dialog__content {
    color #676767
    font-weight 500;
    font-size 14px;
    line-height 21px;
    padding 0 20px;
    margin-top 17px;
    margin-bottom 30px;
    text-align center;
  }
  /deep/ .van-dialog__confirm {
    color #118820
    font-weight 500;
  }
  .has-bg {
    font-weight 500;
    color #118820;
  }
}

.finish-container {
  width 100%;
  height 100%;
  text-align center;
  .icon-finish {
    display block;
    width 65px;
    height 40px;
    margin 56px auto 0;
  }
  .state-name {
    font-size 24px;
    font-weight 500;
    color #118820;
    padding-top 18px;
  }
  .sub-tip {
    font-size 15px;
    font-weight 500;
    padding-top 12px;
  }
  .finish-btn {
    width 165px;
    height 44px;
    line-height 42px;
    text-align center;
    color #118820;
    border .5px solid #118820;
    background-color #F1F8F2
    font-size 15px;
    margin 30px auto 0;
    border-radius 22px;
    &:last-child {
      margin-top 20px;
    }
  }
}
@keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
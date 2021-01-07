<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="store-info">
        <div class="icon">
          <img src="./images/icon-wash.png" alt class="icon-top" />
        </div>
        <p class="store-name">{{ this.$route.query.storeName }}</p>
        <van-icon name="question-o" class="explanation-btn" />
      </div>
      <div class="wash-state-container">
        <div class="loader-wrapper" v-if="!ifFinished">
          <div class="loader">
            <div class="loader-inner"></div>
          </div>
          <div class="countdown-time">
            <van-count-down
              ref="countDown"
              :time="countdownTime * 1000"
              class="time"
              format="mm:ss"
              @finish="countdownFinish"
              :auto-start="false"/>
            <span class="state" v-if="!isPause">洗车中...</span>
            <span class="state" v-else>暂停中...</span>
          </div>
        </div>
        <div class="finish-container" v-else>
          <img src="./images/icon-finish.png" alt="" class="icon-finish">
          <p class="state-name">洗车已结束</p>
          <p class="sub-tip">请安全驶离洗车区域</p>
          <div class="finish-btn" @click="$router.replace('/wash-recording')">查看洗车记录</div>
          <div class="finish-btn" @click="$router.replace('/smart-car-wash')">返回洗车首页</div>
        </div>
      </div>
      <div class="btm-btn" v-if="!ifFinished">
        <div class="btn-l" @click="isShowStopDialog = true">
          <img src="./images/icon-stop.png" alt="" class="icon-btn">
          紧急停止
        </div>
        <div class="btn-r" @click="pauseHandler">
          <img src="./images/icon-pause.png" alt="" class="icon-btn" v-if="!isPause">
          <img src="./images/icon-start.png" alt="" class="icon-btn" v-else>
          <span class="pause-text" v-if="!isPause">暂停</span>
          <span class="continue-text" v-else>{{ pauseTime }}"秒后自动洗车</span>
        </div>
      </div>
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
  </div>
</template>
<script>
import moment from 'moment'
import { CountDown } from 'vant'
export default {
  data() {
    return {
      countdownTime: 1800,
      isShowStopDialog: false,
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
    this.orderId = this.$route.query.orderId || ''
    this.orderType = this.$route.query.orderType || ''
    this.tradeNo = this.$route.query.tradeNo || ''
    if (this.$store.state.globalConfig.order_washcar_pausespan) {
      this.pauseTime = this.$store.state.globalConfig.order_washcar_pausespan
    }

    let washerOverTime = moment(this.$route.query.startTime).add(this.$route.query.washerTime, 'm')
    this.countdownTime = washerOverTime.diff(moment(), 'seconds')
    setTimeout(() => {
      this.startHandler()
    }, 50)

    if (this.$route.query.pauseTime) { // 暂停中
      let momPaustTime = moment(this.$route.query.pauseTime)
      let paustSec = moment().diff(momPaustTime, 'seconds')
      if (paustSec > this.pauseTime) { // 已经大于可暂停时间 -- 再次检查订单状态
        this.checkWorkState()
      } else {
        this.isPause = true;
        this.pauseTime = this.pauseTime - paustSec
        this.$refs.countDown.pause()
        document.querySelector('.loader').setAttribute('style', 'animation-play-state: paused')
        this.startPauseCountDown()
      }
    }

    this.checkWorkState()
  },
  components: {
    'van-count-down': CountDown
  },
  methods: {
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
        this.$Toast(`getWorkOrder err ${err}`)
      })
    },
    // 开始倒计时
    startHandler() {
      this.$refs.countDown.start()
      this.$nextTick(() => {
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
      this.$http.post('/app/json/app_wash_car_order/stop', {
        orderId: this.orderId,
        orderType: this.orderType
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.checkWorkState()
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
      this.checkWorkState()
      this.$nextTick(() => {
        document.querySelector('.loader').setAttribute('style', 'animation-play-state: paused')
      })
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
}

.store-info {
  margin: 35px 15px 0;
  background-color: #fff;
  border-radius: 5px;
  position: relative;

  .icon {
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-radius: 50%;
    background-color: #fff;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    .icon-top {
      display block;
      width 48px;
      height 48px;
      position absolute;
      left 50%;
      top 50%;
      transform translate(-50%, -50%)
    }
  }

  .store-name {
    padding: 45px 0 25px;
    font-size: 18px;
    line-height: 20px;
    font-weight: 500;
    text-align: center;
  }

  .explanation-btn {
    font-size: 24px;
    color: #118820;
    background-color: #E5F8E8;
    border-radius: 50%;
    position: absolute;
    right: 10px;
    top: 10px;
  }
}

.wash-state-container {
  margin: 10px 15px 0;
  background-color: #fff;
  border-radius: 5px;
  height: 350px;
  position relative
}

.loader-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 240px;
  height: 240px;
  transform: translate(-50%, -50%);
}

.loader {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  &.has-animation {
    animation loading 1s linear infinite;
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

.countdown-time {
  position absolute;
  left 0;
  right 0
  top 0;
  bottom 0;
  z-index 2
  .time {
    display block;
    width 131px;
    font-size 50px;
    font-weight 700;
    color #118820;
    position absolute;
    left 50%;
    top 40%;
    transform translate(-50%, -20%);
    line-height inherit;
  }
  .state {
    display block;
    width 90px;
    height 30px;
    line-height 28px;
    border-radius 15px;
    border .5px solid #61C36D;
    background-color #F1F8F2;
    text-align center;
    font-size 15px;
    color #118820;
    position absolute;
    left 50%;
    top 50%;
    transform translate(-50%, 80%);
  }
}

.btm-btn {
  position fixed;
  left 15px;
  right 15px;
  bottom 0;
  padding 10px 0;
  display flex;
  justify-content space-between;
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

.reset-dialog-style {
  border-radius 5px;
  /deep/ .van-dialog__header {
    padding-top 30px;
    font-size 24px;
    font-weight 500;
    color #FF6745;
  }
  /deep/ .van-dialog__content {
    font-size 13px;
    line-height 21px;
    padding 0 20px;
    margin-top 17px;
    margin-bottom 30px;
    text-align center;
  }
  /deep/ .van-dialog__confirm {
    color #118820;
  }
  .has-bg {
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
</style>
<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="store-info">
        <div class="icon">
          <img src="./images/icon-wash.png" alt class="icon-top" />
        </div>
        <p class="store-name">{{ storeName }}</p>
        <div class="work-info" v-if="isWorking">
          洗车机正在努力工作中，
          <br />预计当前洗车机的完成时间为
          <van-count-down
            class="reset-countdown has-bg"
            ref="countDown"
            :time="countdownTime * 1000"
            format="mm:ss"
            @finish="countdownFinish"
          />，请您耐心等待！
        </div>
        <van-icon name="question-o" class="explanation-btn" />
      </div>
      <p class="coupon-title">洗车券</p>
      <ul class="coupon-list" v-if="couponList.length > 0">
        <li
          class="item"
          @click="choseCoupon(item, index)"
          :class="{active: item.couNo == selectCoupon.couNo}"
          v-for="(item, index) in couponList"
          :key="index"
        >
          <div class="circle-l"></div>
          <div class="circle-r"></div>
          <div class="left">
            <p class="coupon-name">{{ item.couTypeTitle }}</p>
            <p class="coupon-date">{{ item.validStartDate }}至{{ item.validEndDate }}</p>
          </div>
          <div class="right">
            <div class="coupon-state">
              <van-icon name="success" class="icon" />
            </div>
          </div>
        </li>
      </ul>
      <div class="no-coupon" v-else>
        <img src="./images/no-coupon.png" alt class="icon-no-coupon" />
        <p class="no-coupon-text">暂无可用洗车券！</p>
      </div>
      <div class="btm-btn">
        <div
          class="btn-r"
          :class="{disabled: isWorking || couponList.length == 0}"
          @click="startWash"
        >开始洗车</div>
      </div>
    </nav-content>
    <!-- 超出范围提示弹窗 -->
    <van-dialog
      class="reset-dialog-style"
      v-model="isShowOutOfRange"
      @confirm="$router.go(-1)"
      confirm-button-text="我知道了！"
    >
      <div slot="title">超出有效范围</div>为了您和他人的洗车安全！您当前的定位与洗车机之间距离超过了
      <span class="has-bg">{{ limitDistance }}米</span>的限制，将无法启用洗车机，请缩短距离后重试！
    </van-dialog>
    <!-- 确认洗车 -->
    <van-dialog
      class="reset-dialog-style"
      v-model="isShowConfirmDialog"
      show-cancel-button
      cancel-button-text="再想想"
      confirm-button-text="确认"
      @confirm="confirmWash"
    >
      <div slot="title">洗车确认</div>您已选择
      <span class="has-bg">“{{ selectCoupon.couTypeTitle }}”</span>是否立即开始洗车？
    </van-dialog>
    <!-- 车辆停放问题弹窗 -->
    <van-dialog class="reset-dialog-style" v-model="isShowParkDialog" confirm-button-text="我知道了！">
      <div slot="title">车辆停放问题</div>当前车辆停放状态
      <span class="has-bg">“需要后退”</span>请调整车辆位置后重试！
    </van-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import { CountDown } from 'vant'
export default {
  data() {
    return {
      storeOuCode: '',
      isWorking: false,
      countdownTime: 0,
      // 超出范围弹窗
      isShowOutOfRange: false,
      // 确认洗车弹窗
      isShowConfirmDialog: false,
      // 车辆停放有问题弹窗
      isShowParkDialog: false,
      couponList: [],
      // 默认选中券
      selectCoupon: {},
      // 定位位置不能超过此距离
      limitDistance: 300,
      storeName: ''
    }
  },
  mounted() {
    if (this.$store.state.globalConfig.washcar_limit_range) {
      this.limitDistance = Number(
        this.$store.state.globalConfig.washcar_limit_range
      )
    }
    if (this.$route.query.storeOuCode) {
      this.storeOuCode = this.$route.query.storeOuCode
      this.checkState()
    }
  },
  components: {
    'van-count-down': CountDown
  },
  methods: {
    // 获取设备状态
    checkState() {
      this.$Loading.open()
      this.$http
        .post('/app/json/app_wash_car_order/checkStatus', {
          storeOuCode: this.storeOuCode,
          posx: this.$store.state.currentLocation.posx,
          posy: this.$store.state.currentLocation.posy
        })
        .then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            if (data.data.result || data.data.iotStatus == 'WASHING') { // 设备准备就绪 -- 检查是否工作中
            
              this.storeName = data.data.storeName

              if (data.data.distance && data.data.distance > this.limitDistance) { // 超过距离，不能使用
                this.isShowOutOfRange = true
              } else {
                this.checkWorkState()
              }
            } else if (data.data.iotStatus == 'LOCKING') { // 设备已锁定--可能有暂停的订单
              this.checkWorkState()
            } else {
              this.$Toast(data.data.codeDesc)
            }
          } else {
            this.$Toast(data.info)
          }
        })
        .catch(err => {
          this.$Loading.close()
          this.$Toast(`checkStatus err ${err}`)
        })
    },
    // 检查是否工作中
    checkWorkState(tradeNo) {
      this.$Loading.open()
      let params = {
        storeOuCode: this.storeOuCode
      }
      if (tradeNo) {
        params.tradeNo = tradeNo
        params.self = true
      }
      this.$http
        .post('/app/json/app_wash_car_order/getWorkOrder', params)
        .then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            if (data.data.work) {
              // 工作中
              if (data.data.self) {
                // 本人正在洗车 -- 跳转洗车中页面
                this.$router.replace({
                  path: '/car-washing',
                  query: {
                    orderId: data.data.shoppingOrderModel.id,
                    orderType: data.data.shoppingOrderModel.orderType,
                    tradeNo: data.data.shoppingOrderModel.tradeNo,
                    storeName: this.storeName,
                    startTime: data.data.startTime, // 洗车开始时间
                    washerTime: data.data.washerTime, // 洗车时长
                    pauseTime: data.data.pauseTime // 暂停时间
                  }
                })
              } else {
                // 他人正在洗车
                let washerOverTime = moment(data.data.startTime).add(data.data.washerTime, 'm')
                this.countdownTime = washerOverTime.diff(moment(), 'seconds')
                this.isWorking = true
                // 获取券列表
                this.initCouponList()
              }
            } else {
              // 获取券列表
              this.initCouponList()
            }
          } else {
            this.$Toast(data.info)
          }
        })
        .catch(err => {
          this.$Loading.close()
          this.$Toast(`getWorkOrder err ${err}`)
        })
    },
    // 获取洗车券
    initCouponList() {
      this.$Loading.open()
      this.$http
        .post('/app/json/app_wash_car_order/settle', {
          storeOuCode: this.storeOuCode
        })
        .then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            // 这两个字段中的券构成了可选择的券列表
            this.couponList = []
            this.couponList.push(...data.data.userCanUseCoupon)
            this.couponList.push(...data.data.userCanNotUseCoupon)
            // 设置默认选中券
            this.selectCoupon = this.couponList[0] || {}
          } else {
            this.$Toast(data.info)
          }
        })
        .catch(err => {
          this.$Loading.close()
          this.$Toast(`settle err ${err}`)
        })
    },
    // 券选择
    choseCoupon(item, index) {
      this.selectCoupon = item
    },
    // 底部开始洗车
    startWash() {
      if (!this.isWorking && this.couponList.length !== 0) {
        // 检查车辆位置
        this.$Loading.open()
        this.$http
          .post('/app/json/app_wash_car_order/checkParkStatus', {
            storeOuCode: this.storeOuCode
          })
          .then(res => {
            this.$Loading.close()
            let data = res.data
            if (data.status == 0) {
              if (data.data.result) {
                // 停放无问题
                this.isShowConfirmDialog = true
              } else {
                // 停放有问题
                this.isShowParkDialog = true
              }
            } else {
              this.$Toast(data.info)
            }
          })
          .catch(err => {
            this.$Loading.close()
            this.$Toast(`checkParkStatus err ${err}`)
          })
      }
    },
    // 确认洗车
    confirmWash() {
      this.$Loading.open()
      this.$http
        .post('/app/json/app_wash_car_order/submit', {
          storeOuCode: this.storeOuCode,
          couNo: JSON.stringify([this.selectCoupon.couNo])
        })
        .then(res => {
          let data = res.data
          if (data.status == 0) {
            setTimeout(() => {
              this.checkWorkState(data.data.tradeNo)
            }, 2000)
          } else {
            this.$Toast(data.info)
          }
        })
        .catch(err => {
          this.$Loading.close()
          this.$Toast(`submit err ${err}`)
        })
    },
    countdownFinish() {
      this.checkState()
    }
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
      display: block;
      width: 48px;
      height: 48px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .store-name {
    padding: 45px 0 25px;
    font-size: 18px;
    line-height: 20px;
    font-weight: 500;
    text-align: center;
  }

  .work-info {
    font-size: 13px;
    line-height: 21px;
    text-align: center;
    padding-bottom: 25px;

    .has-bg {
      color: #118820;
    }
    .reset-countdown {
      display inline-block;
    }
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

.coupon-title {
  padding: 16px 15px 10px;
  font-size: 15px;
  font-weight: 500;
  color: #999;
}

.coupon-list {
  flex: 1;
  padding-bottom: 64px;
  overflow-y: auto;
  margin: 0 15px;

  .item {
    height: 85px;
    border: 1px solid #61C36D;
    border-radius: 5px;
    background-color: #F1F8F2;
    position: relative;
    padding: 16px 0;
    display: flex;
    margin-top: 10px;

    &:first-child {
      margin-top: 0;
    }

    &.active {
      .right {
        .coupon-state {
          background-color: #118820;

          .icon {
            color: #fff;
          }
        }
      }
    }

    .circle-l, .circle-r {
      position: absolute;
      top: 50%;
      width: 15px;
      height: 15px;
      border-top: 1px solid #61C36D;
      border-right: 1px solid #61C36D;
      background-color: #F5F5F5;
      border-radius: 50%;
    }

    .circle-l {
      left: 0;
      transform: translate(-51%, -50%) rotate(45deg);
    }

    .circle-r {
      right: 0;
      transform: translate(51%, -50%) rotate(-135deg);
    }

    .left {
      padding: 0 10px 0 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .coupon-name {
        font-size: 15px;
        font-weight: 500;
        line-height: 18px;
        ellipse-2();
      }

      .coupon-date {
        font-size: 12px;
        color: #999;
      }
    }

    .right {
      width: 90px;
      position: relative;
      border-left: 0.5px solid #61C36D;

      .coupon-state {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 30px;
        height: 30px;
        background-color: #fff;
        border-radius: 50%;

        .icon {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-size: 15px;
          color: #ddd;
        }
      }
    }
  }
}

.no-coupon {
  flex: 1;

  .icon-no-coupon {
    display: block;
    width: 120px;
    margin: 110px auto 0;
  }

  .no-coupon-text {
    font-size: 13px;
    text-align: center;
    padding-top: 25px;
    color: #999;
  }
}

.btm-btn {
  position: fixed;
  background-color: #F5F5F5;
  left: 15px;
  right: 15px;
  bottom: 0;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;

  .btn-l, .btn-r {
    width: 100%;
    height: 44px;
    line-height: 43px;
    text-align: center;
    border-radius: 22px;
    overflow: hidden;
    position: relative;

    &.disabled {
      opacity: 0.6;
    }

    .icon-btn {
      position: absolute;
      left: 0;
      top: 0;
      width: 44px;
      height: 44px;
    }
  }

  .btn-l {
    border: 0.5px solid #61C36D;
    background-color: #F1F8F2;
    font-size: 15px;
    font-weight: 400;
    color: #118820;
  }

  .btn-r {
    background-color: #118820;
    font-size: 18px;
    color: #fff;
    font-weight: 500;
  }
}

.reset-dialog-style {
  border-radius: 5px;

  /deep/ .van-dialog__header {
    padding-top: 30px;
    font-size: 24px;
    font-weight: 500;
    color: #118820;
  }

  /deep/ .van-dialog__content {
    font-size: 13px;
    line-height: 21px;
    padding: 0 20px;
    margin-top: 17px;
    margin-bottom: 30px;
  }

  /deep/ .van-dialog__confirm {
    color: #118820;
  }

  .has-bg {
    color: #118820;
  }
}
</style>
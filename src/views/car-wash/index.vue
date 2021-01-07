<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="undone-order" v-if="hasUnFinishOrder">
        <div class="text">您有未完成订单，
          <van-count-down @finish="countDownFinish" :time="orderCountDownTime" class="reset-count-down" format="mm'ss''"/>后订单自动取消！</div>
        <div class="btn" @click="washNow">立即洗车</div>
      </div>
      <ul class="store-list" v-if="storeList.length > 0">
        <li v-for="(item, index) in storeList" :key="index" class="item" @click="toDetails(item)">
          <img src="./images/icon-wash.png" alt="" class="left-icon">
          <div class="center-content">
            <p class="store-name">{{item.storeName}}</p>
            <p class="address-info address"><van-icon color="color: #666" size='12' name="location" />&nbsp;{{`距您 ${$util.toDecimal2(item.distance / 1000)}km`}}</p>
            <p class="address-info">{{item.addressFull}}</p>
            <p class="link-phone">联系电话：{{ item.linkPhone || '暂无~' }}</p>
            <div class="store-state">
              <span class="business" :class="{disabled: dealwithBusinessStatus(item) != '营业中'}">{{ dealwithBusinessStatus(item) }}</span>&nbsp;
              <img src="./images/券.png" alt="" v-if="item._showCouponName">&nbsp;
              <span class="tip" v-if="item._showCouponName">{{ item._showCouponName }}</span>
            </div>
          </div>
          <div class="right-btn" @click.stop="goToMap(item)">
            <img src="./images/icon-navigation.png" alt="" class="icon-navigation">
            <p>导航</p>
          </div>
        </li>
        <li @click="showEruda" class="eruda"></li>
      </ul>
      <p class="no-result-message" v-else>暂无店铺~</p>
      <div class="btm-btn-n" v-if="!isHideCarWashCoupon">
        <div class="btn-l" @click="toCoupon">
          <img src="./images/icon-btn-1.png" alt="" class="icon">
          <p class="text">领券</p>
        </div>
        <div class="btn-c spec-btn" @click="scanHandler">
          <div class="icon-c">
            <div class="bg">
              <img src="./images/icon-btn-2.png" alt="" class="icon">
            </div>
          </div>
          <p class="text">扫码洗车</p>
        </div>
        <div class="btn-r" @click="toCarWashRecord">
          <img src="./images/icon-btn-3.png" alt="" class="icon">
          <p class="text">我的</p>
        </div>
      </div>
      <div class="btm-btn" v-else>
        <div class="btn-item" @click="toCarWashRecord">我的洗车</div>
        <div class="btn-item spec-sc-btn" @click="scanHandler"><img src="./images/icon-scan.png" class="icon-scan" alt="">扫码洗车</div>
      </div>
    </nav-content>
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
import { CountDown, Dialog } from 'vant'
import moment from 'moment'
// import eruda from 'eruda'

export default {
  data() {
    return {
      storeList: [],
      hasUnFinishOrder: false,
      unFinishOrder: {},
      orderCountDownTime: 0,
      tips: false,
      // 是否隐藏底部领券功能
      isHideCarWashCoupon: false,

      clickTime: -1,
      vConsoleTimes: 0,
    }
  },
  components: {
    VanCountDown: CountDown
  },
  mounted() {
    if (this.$store.state.globalConfig.isHideCarWashCoupon == '1') {
      this.isHideCarWashCoupon = true
    }

    // 检查定位是否成功
    this.$bridgefunc.saveCoordinate(isLocation => {
      if (isLocation) {
        console.log('洗车定位：', this.$store.state.currentLocation.posx, this.$store.state.currentLocation.posy)
        this.initStoreList()
        if (this.$route.query.gzCarWash == 1) {
          // 贵州扫码洗车进入-需要单独处理
          // 1. 检查是否有未完成订单
          // 2. 检查是否正在工作中
          // 3. 检查是否自己的订单
          this.dealwithGzCarWash()
        } else {
          this.checkOrderInfo()
        }
      } else {
        Dialog({
          title: '提示',
          message: '获取定位失败，请检查您的手机设置！',
        })
      }
    })
    
  },
  methods: {
    showEruda() {
      //连续点5次第一个item  显示vconsole
      let time = (new Date()).getTime();
      if (time - this.clickTime < 1000 || this.clickTime == -1) {
        this.vConsoleTimes += 1;
        this.clickTime = time;
        if (this.vConsoleTimes == 5) {
          eruda.init()
          this.vConsoleTimes = 0;
          this.clickTime = -1;
        }
      } else {
        this.vConsoleTimes = 0;
        this.clickTime = -1;
      }
    },
    // 检查店铺是否在营业时间内
    dealwithBusinessStatus(storeInfo) {
      if (storeInfo.openingTime && storeInfo.closingTime) {
        let tempOpenTime = moment(`${moment().format('YYYY-MM-DD')} ${storeInfo.openingTime}`).format('YYYY-MM-DD HH:mm:ss')
        let tempCloseTime = moment(`${moment().format('YYYY-MM-DD')} ${storeInfo.closingTime}`).format('YYYY-MM-DD HH:mm:ss')
        if (moment().isBetween(tempOpenTime, tempCloseTime)) {
          return '营业中'
        } else {
          return '歇业中'
        }
      } else {
        return '营业中'
      }
    },
    dealwithGzCarWash() {
      // 贵州扫码进入
      this.$Loading.open()
      this.$http.post('/app/json/app_self_car_order/getMyUnUseOrder', {}).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          if (data.data) {
            this.hasUnFinishOrder = true
            this.unFinishOrder = data.data || {}
            this.orderCountDownTime = data.data.cancelRemainTime * 1000
            this.$MessageBox.alert('当前存在待洗车的订单，请先完成洗车', '提示', {confirmButtonText: '我知道了'})
          } else {
            this.hasUnFinishOrder = false
            this.$Loading.open()
            let params = {
              storeOuCode: this.$route.query.stationOuCode,
              self: true
            }
            this.$http.post('/app/json/app_self_car_order/getWorkOrder', params).then(res => {
              this.$Loading.close()
              let data = res.data
              if (data.status == 0) {
                if (data.data.work) {
                  // 工作中
                  if (data.data.self) {
                    // 本人正在洗车 -- 跳转洗车中页面
                    this.$router.replace({
                      path: '/carWash/speedProgress',
                      query: {
                        orderId: data.data.shoppingOrderModel.id,
                        orderType: data.data.shoppingOrderModel.orderType,
                        tradeNo: data.data.shoppingOrderModel.tradeNo,
                        deviceCode: data.data.utilityAccount,
                        startTime: data.data.startTime, // 洗车开始时间
                        washerTime: data.data.washerTime, // 洗车时长
                        isCountContinue: 1
                      }
                    })
                  }
                } else {
                  this.$router.replace({
                    path: '/carWash/details',
                    query: {
                      stationOuCode: this.$route.query.stationOuCode,
                      deviceCode: this.$route.query.deviceCode || '',
                      washingWay: this.$route.query.washingWay || '',
                      isScanCode: true
                    }
                  })
                }
              } else {
                this.$Toast(data.info)
              }
            }).catch(err => {
              this.$Loading.close()
              this.$Toast(`getWorkOrder err ${err}`)
            })
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`getMyUnUseOrder err ${err}`)
      })
    },
    // 检查停车位置
    checkParkingPosition(deviceCode, storeOuCode, callback) {
      this.$Loading.open()
      this.$http.post('/app/json/app_self_car_order/checkParkStatus', {
        deviceCode,
        storeOuCode
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          if (data.data.result == true) {
            callback && callback()
          } else {
            if (data.data.msg) {
              this.$Toast(data.data.msg)
            } else {
              this.tips = true
            }
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`checkParkStatus err ${err}`)
      })
    },
    // 立即洗车
    washNow() {
      this.$Loading.open()
      this.checkParkingPosition(this.unFinishOrder.utilityAccount, this.unFinishOrder.storeOuCode, () => {
        // 车辆到位
        this.$router.push({
          path: '/carWash/speedProgress',
          query: {
            orderId: this.unFinishOrder.id,
            orderType: this.unFinishOrder.orderType,
            tradeNo: this.unFinishOrder.tradeNo,
            deviceCode: this.unFinishOrder.utilityAccount,
            storeOuCode: this.unFinishOrder.storeOuCode,
          }
        })
      })
    },
    checkOrderInfo() {
      this.$Loading.open()
      this.$http.post('/app/json/app_self_car_order/getMyUnUseOrder', {}).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          if (data.data) {
            this.hasUnFinishOrder = true
            this.unFinishOrder = data.data || {}
            this.orderCountDownTime = data.data.cancelRemainTime * 1000
          } else {
            this.hasUnFinishOrder = false
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`getMyUnUseOrder err ${err}`)
      })
    },
    countDownFinish() {
      this.checkOrderInfo()
    },
    // 列表点击
    toDetails(item) {
      this.$router.push({
        path: '/carWash/details',
        query: {
          stationOuCode: item.storeCode
        }
      })
    },
    // 扫码
    scanHandler() {
      // this.$router.push({
      //   path: '/carWash/details',
      //   query: {
      //     stationOuCode: '1000034006001007002',
      //     // washingWay: 2,
      //     deviceCode: 'R-STM0000001',
      //     isScanCode: true
      //   }
      // })

      if (this.hasUnFinishOrder) {
        // 已有洗车订单
        this.$MessageBox.alert('当前存在待洗车的订单，请先完成洗车', '提示', {confirmButtonText: '我知道了'})
      } else {
        // 无洗车订单
        this.$bridgefunc.scanCode(res => {
          let tempCode = {}
          if (res.code.indexOf('http') > -1) {
            res.code.split('?')[1].split('&').forEach(item => {
              tempCode[item.split('=')[0]] = item.split('=')[1]
            })
          } else {
            tempCode = JSON.parse(res.code)
          }
          console.log('扫码结果', tempCode)

          // 检查是否本人正在洗车
          this.$Loading.open()
          let params = {
            storeOuCode: tempCode.stationOuCode,
            self: true
          }
          this.$http.post('/app/json/app_self_car_order/getWorkOrder', params).then(res => {
            this.$Loading.close()
            let data = res.data
            if (data.status == 0) {
              if (data.data.work) {
                // 工作中
                if (data.data.self) {
                  // 本人正在洗车 -- 跳转洗车中页面
                  this.$router.replace({
                    path: '/carWash/speedProgress',
                    query: {
                      orderId: data.data.shoppingOrderModel.id,
                      orderType: data.data.shoppingOrderModel.orderType,
                      tradeNo: data.data.shoppingOrderModel.tradeNo,
                      deviceCode: data.data.utilityAccount,
                      startTime: data.data.startTime, // 洗车开始时间
                      washerTime: data.data.washerTime, // 洗车时长
                      isCountContinue: 1
                    }
                  })
                }
              } else {
                if (tempCode.washingWay && tempCode.washingWay == 2) {
                  // 人工洗车-无需检查停车状态
                  this.$router.push({
                    path: '/carWash/details',
                    query: {
                      stationOuCode: tempCode.stationOuCode,
                      deviceCode: tempCode.deviceCode || '',
                      washingWay: tempCode.washingWay || '',
                      isScanCode: true
                    }
                  })
                } else {
                  this.checkParkingPosition(tempCode.deviceCode, tempCode.stationOuCode, () => {
                    this.$router.push({
                      path: '/carWash/details',
                      query: {
                        stationOuCode: tempCode.stationOuCode,
                        deviceCode: tempCode.deviceCode || '',
                        washingWay: tempCode.washingWay || '',
                        isScanCode: true
                      }
                    })
                  })
                }
              }
            } else {
              this.$Toast(data.info)
            }
          }).catch(err => {
            this.$Loading.close()
            this.$Toast(`getWorkOrder err ${err}`)
          })
        })
      }
    },
    // 获取店铺列表
    initStoreList() {
      this.$Loading.open()
      this.$http.post('/app/json/app_selfservice_device/getWashCarStoreList', {
        posx: this.$store.state.currentLocation.posx,
        posy: this.$store.state.currentLocation.posy,
        // posx: 106.633895,
        // posy: 26.724141,
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          data.data.forEach(item => {
            let couponNameArr = []
            if (item.couponSkuList instanceof Array && item.couponSkuList.length > 0) {
              item.couponSkuList.forEach(item2 => {
                couponNameArr.push(item2.skuName)
              })
              item._showCouponName = couponNameArr.join(',')
            } else {
              item._showCouponName = ''
            }
          })
          this.storeList.push(...data.data)
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`getWashCarStoreListerr err ${err}`)
      })
    },
    // 去导航
    goToMap(item) {
      this.$bridgefunc.baiduNav({
        startlong: this.$store.state.currentLocation.posx,
        startlat: this.$store.state.currentLocation.posy,
        endlong: item.posx,
        endlat: item.posy,
        type: "nav"
      })
    },
    // 洗车记录
    toCarWashRecord() {
      this.$router.push({
        path: '/carWash/washRecording'
      })
    },
    // 领券
    toCoupon() {
      this.$router.push({
        path: '/carWash/carWashCoupon',
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .eruda {
    width 100%;
    height 20px;
  }
  @import '~@/common/stylus/mixin.styl';
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
  .reset-count-down {
    display inline-block;
    font-size 12px;
    color #fff;
    width 37px;
  }
  .container {
    background-color #F5F5F5
    display flex;
    flex-direction column;
  }
  .undone-order {
    height 50px;
    background-color #FF6745;
    padding 0 17px;
    display flex;
    align-items center;
    justify-content space-between;
    font-size 12px;
    color #fff;
    .btn {
      width 80px;
      height 30px;
      background-color #fff;
      line-height 30px;
      text-align center;
      color #FF6745;
      border-radius 15px;
    }
  }
  .store-list {
    flex 1;
    overflow-y auto;
    margin 0 15px;
    padding-bottom 20px;
    .item {
      border-radius 5px;
      background-color #fff;
      padding 10px 0px 10px 10px;
      margin-top 10px;
      display flex;
      .left-icon {
        display block;
        width 48px;
        height 48px;
      }
      .center-content {
        padding-left 10px
        // padding 10px 0px 10px 00px;
        width calc(100% - 100px)
        .store-name {
          width 100%
          font-size 15px;
          line-height 18px;
          font-weight 500;
          ellipse()
        }
        .address {
          margin-top 5px;
          display flex
          align-items center
        }
        .address-info {
          width 100%
          font-size 12px;
          color #666;
          line-height 18px;
          ellipse()
        }
        .link-phone {
          font-size 12px;
          color #666;
          line-height 18px;
          ellipse()
        }
        .store-state {
          width 100%
          display flex
          align-items center
          line-height 20px;
          font-size 12px;
          margin-top 5px;
          span {
            color #666;
            padding 0 2px;
            display inline-block;
          }
          img {
            width 23px
            height 19px
            margin-left 2px
          }
          .business {
            border-radius 2px;
            border .5px solid #61C36D;
            background-color #F1F8F2;
            &.disabled {
              border-color #999;
              background-color #f1f1f1;
            }
          }
          .tip {
            width calc(100% - 90px)
            ellipse()
          }
        }
      }
      .right-btn {
        display flex;
        flex-direction column;
        justify-content center
        padding 5px 10px;
        font-size 12px;
        font-weight 500;
        .icon-navigation {
          display block;
          margin 0 auto;
          width 20px;
          margin-bottom 5px;
        }
      }
    }
  }
  .no-result-message {
    text-align center;
    font-size 13px;
    padding-top 50px;
    color #999;
    flex 1
  }
  .btm-btn-n {
    height 60px;
    background-color #fff;
    display flex;
    justify-content space-between;
    .btn-l,
    .btn-c,
    .btn-r {
      flex 1;
      .icon {
        display block;
        width 30px;
        margin 0 auto;
        padding-top 8px;
      }
      .text {
        font-size 13px;
        line-height 16px;
        text-align center;
        color #333;
      }
    }
    .spec-btn {
      .icon-c {
        width 65px;
        height 65px;
        border-radius 50%;
        background-color #fff;
        margin -30px auto;
        position relative;
        .bg {
          background-color #1F9E20;
          width 80%;
          height 80%;
          border-radius 50%;
          position absolute;
          left 50%;
          top 50%;
          transform translate(-50%, -50%);
          z-index 5
          .icon {
            width 48px;
            position absolute;
            left 50%;
            top 50%;
            transform translate(-50%, -50%);
            padding-top 0;
          }
        }
      }
      .text {
        position relative;
        z-index 2;
        font-size 15px;
        font-size 15px;
        padding-top 32px;
      }
    }
  }
  .btm-btn {
    display flex;
    padding 10px 17px;
    justify-content space-between;
    .btn-item {
      height 44px
      border-radius 22px;
      background-color #F1F8F2;
      width 48%;
      text-align center;
      line-height 44px;
      font-size 15px;
      color #118820;
      border .5px solid #118820;
      &.spec-sc-btn {
        border none;
        background: linear-gradient(180deg, #27BD43 0%, #118820 100%);
        color #fff;
        font-size 18px;
        font-weight 700;
        position relative;
        padding-left 20px;
        .icon-scan {
          display block;
          width 44px;
          height 44px;
          position absolute;
          left 0;
          top 0;
        }
      }
    }
  }
</style>

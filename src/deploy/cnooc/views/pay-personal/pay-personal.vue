<template>
  <div class="container">
    <nav-top
      @backEvent="$router.go(-1)"
      :navTopStyle="{'background-color': '#068ed0'}"
      title="去支付"
      :noBack="true"
    ></nav-top>
    <nav-content>
      <div class="reset-container">
        <div @click="stationClick" class="station-chose">
          <img class="icon" src="../../assets/images/position-icon.png" alt />
          <span class="station-name">{{ $store.state.refuelStation.stationName }}</span>
        </div>
        <div class="card-info">
          <div class="member-content">
            <h2 class="member-title">会员码</h2>
            <div class="left">
              <p class="sub-title top">会员名称</p>
              <span class="sub-content">{{ userInfo.realName }}</span>
              <p class="sub-title btm">手机号</p>
              <span class="sub-content">{{ userInfo.phone }}</span>
            </div>
            <div class="right" @click="qrcodeClick">
              <canvas id="qrcode" class="qrcode-content"></canvas>
              <p class="count-time">{{ countTime }}秒后刷新二维码</p>
            </div>
          </div>
        </div>
        <div class="card-info" @click="goToPay">
          <div class="card-content">
            <h2 class="card-title">虚拟海油卡</h2>
            <div class="left">
              <p class="card-tip">
                <i></i>开通虚拟海油卡并充值
              </p>
              <p class="card-tip">
                <i></i>加油加气站进行虚拟海油卡支付
              </p>
            </div>
            <div class="right">
              <div class="card-pay">
                <div class="card-pay-icon">
                  <img src="../../assets/images/qr_icon.png" alt />
                </div>
                <p class="card-pay-text">去支付&gt;</p>
              </div>
            </div>
          </div>
        </div>
        <h2 @click="moreCoupon" class="coupon-list-title">
          可用电子券
          <span class="more-coupon">更多电子券 &gt;</span>
        </h2>

        <div class="coupon-list-c">
          <ul class="coupon-list" v-if="couponList.length > 0">
            <li
              class="coupon-item"
              v-for="(item, index) in couponList"
              @click="couponItemClick(item)"
              :key="index"
            >
              <div class="left" v-if="item.couCategory == 10">
                <img src="../../assets/images/bg-x.png" class="coupon-bg" alt />
                <p class="coupon-price">{{ item.couFaceValue }}</p>
                <span class="coupon-use">洗车券</span>
              </div>
              <div class="left" v-else>
                <img src="../../assets/images/coupon-bg.png" class="coupon-bg" alt />
                <p class="coupon-price">{{ item.couFaceValue }}</p>
                <span class="coupon-use">满{{ item.couThresholdAmount }}减{{ item.couFaceValue }}</span>
              </div>
              <div class="right">
                <p class="coupon-title">{{ item.couTypeTitle }}</p>
                <p class="cou-type-code">券类型编码:{{ item.couTypeCode }}</p>
                <p
                  class="coupon-validity"
                >{{ item.validStartDate.substring(0, 10) }}至{{ item.validEndDate.substring(0, 10) }}</p>
              </div>
            </li>
          </ul>
          <p v-else class="no-coupon">{{ noCouponText }}</p>
        </div>
      </div>
      <!-- 二维码点击模态框 -->
      <van-popup class="code-container" title="会员码" v-model="qrcodePopupVisible">
        <p class="user-name">{{ userInfo.realName }}</p>
        <canvas class="qrcode-content" id="bgQrcode"></canvas>
        <p class="refresh-time">{{ countTime }}秒后刷新二维码</p>
        <div class="member-code">
          <p class="title">会员动态码</p>
          <span class="num">{{ qrcodeData.codeStr }}</span>
        </div>
      </van-popup>
      <!-- 选择附近油站 -->
      <van-popup :get-container="getContainer" v-model="popupVisible" position="bottom">
        <van-picker
          :columns="slots"
          @change="onValuesChange"
          @cancel="popupVisible = false"
          @confirm="confirm"
          show-toolbar
          value-key="stationName"
        ></van-picker>
      </van-popup>
    </nav-content>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { Dialog, Popup, Picker } from 'vant'
import cnoocUtil from '@/deploy/cnooc/utils/index'
export default {
  name: 'payment',
  components: {
    VanDialog: Dialog.Component,
    VanPopup: Popup,
    VanPicker: Picker,
  },
  data() {
    return {
      clickIndex: 0,
      userInfo: {},
      autoPointFocus: false,
      noCouponText: '',
      // 倒计时时间
      countTime: 120,
      // 附近油站列表
      nearbyStations: { stationName: '' },
      // 选择的附近油站信息
      choseNearStation: null,
      popupVisible: false,
      qrcodePopupVisible: false,
      // 倒计时id
      interId: null,
      // 附近油站列表-弹框
      slots: [
        {
          flex: 1,
          values: [],
          textAlign: 'center',
        },
      ],
      // 通过微信定位的经纬度
      wechatPosition: {
        posx: '',
        posy: '',
      },
      // 二维码数据
      qrcodeData: {
        codeStr: '',
        mainTitle: '',
        codeName: '会员编码：',
        type: 0,
      },
      // 优惠券数据
      couponList: [],
      isLoading: false,
      finished: false,
    }
  },
  mounted() {
    window.localStorage.removeItem('userInfo')
    window.localStorage.removeItem('orgUserInfo')

    // 获取个人基础信息
    this.loadUserInfo()
    // 获取机构会员编码
    this.dogetMemberDynamicCode()

    // 是否在store中存储了油站信息
    if (!!this.$store.state.refuelStation.stationCode) {
      // 是
      this.findCouponList(this.$store.state.refuelStation.stationCode); // todo
    } else {
      // 否 获取用户默认油站
      this.getStation()
    }

    let that = this
    this.$bridgefunc.getLocation((locationinfo) => {
      if (locationinfo.longitude) {
        this.wechatPosition = {
          posx: locationinfo.longitude,
          posy: locationinfo.latitude,
        }
      } else {
        this.$Toast('定位失败，请检查您的手机设置！')
      }
    })
  },
  methods: {
    pageShow() {
      // 是否在store中存储了油站信息
      if (!!this.$store.state.refuelStation.stationCode) {
        // 是
        this.findCouponList(this.$store.state.refuelStation.stationCode); // todo
      } else {
        // 否 获取用户默认油站
        this.getStation()
      }
    },
    // 获取机构会员编码
    dogetMemberDynamicCode() {
      this.$http
        .post('/app/json/user_info/getMemberDynamicCode', {})
        .then((res) => {
          if (res.data.status == 0) {
            this.qrcodeData.codeStr = res.data.data
            setTimeout(() => {
              QRCode.toCanvas(
                document.getElementById('qrcode'),
                this.qrcodeData.codeStr || '',
                {
                  margin: 0,
                  width: 100,
                }
              )
              this.setInterval()
            }, 400)
          }
        })
        .catch((error) => {
          this.$Toast(error)
        })
    },
    // 获取用户信息
    loadUserInfo() {
      let that = this
      this.$http
        .post('/app/json/user_info/getUserInfo', {})
        .then((res) => {
          if (res.data.data != '') {
            var userInfoTemp = res.data.data
            this.qrcodeData.mainTitle = userInfoTemp.realName
            that.userInfo = userInfoTemp
            window.localStorage['userInfo'] = JSON.stringify(userInfoTemp)
          }
        })
        .catch((error) => {
          this.$Toast(error)
        })
    },
    // 获取附近油站
    getNearbyStation() {
      this.$http
        .post('/app/json/hy_station/getStationList', {
          posx: this.wechatPosition.posx,
          posy: this.wechatPosition.posy,
          getType: 2,
          count: 5,
          distLess: 100000,
        })
        .then((res) => {
          let data = res.data
          if (data.status == 0) {
            if (data.data[0]) {
              // 有附近油站
              if (this.$store.getters.getNearStation.stationName) {
                this.nearbyStations = this.$store.getters.getNearStation
              } else {
                this.nearbyStations = data.data[0]
              }
              this.slots = data.data
              if (this.nearbyStations.stationCode) {
                this.findCouponList(this.nearbyStations.stationCode)
              }
            } else {
              // 无附近油站
              this.$Toast('附近暂无油站，已为您获取常用油站')
              this.getCommonlyStation()
            }
          } else {
            this.$Toast('获取附近油站失败，已为您获取常用油站')
            this.getCommonlyStation()
          }
        })
        .catch(() => {
          this.$Toast('获取附近油站失败，已为您获取常用油站')
          this.getCommonlyStation()
        })
    },
    // 获取常用油站(定位失败，获取附近油站失败，获取附近油站为空都需要改为获取常用油站)
    getCommonlyStation() {
      this.$http
        .post('/app/json/station/findCommonStationList', {})
        .then((res) => {
          let data = res.data
          if (data.status == 0) {
            if (data.data instanceof Array) {
              if (this.$store.getters.getNearStation.stationName) {
                this.nearbyStations = this.$store.getters.getNearStation
              } else {
                this.nearbyStations = data.data[0] || {
                  stationName: '暂无附近油站',
                }
              }
              this.slots = data.data || [{ stationName: '暂无附近油站' }]
              if (this.nearbyStations.stationCode) {
                this.findCouponList(this.nearbyStations.stationCode)
              }
            }
          } else {
            this.$Toast(data.info)
          }
        })
        .catch((err) => {
          this.$Toast('获取常用油站失败')
        })
    },
    // 更改附近油站
    onValuesChange(picker, value, index) {
      this.choseNearStation = value
    },
    // 附近油站选择确认
    confirm() {
      if (this.choseNearStation) {
        this.nearbyStations = this.choseNearStation
        this.findCouponList(this.choseNearStation.stationCode)
        this.$store.commit('setStationInfo', this.choseNearStation)
      }
      this.popupVisible = false
    },
    goToPay() {
      cnoocUtil.jumpCardSysPage(4, '/pay-personal')
    },
    // 二维码点击
    qrcodeClick() {
      this.qrcodePopupVisible = true
      this.$nextTick(() => {
        QRCode.toCanvas(
          document.getElementById('bgQrcode'),
          this.qrcodeData.codeStr || '',
          {
            margin: 0,
            width: 300,
          }
        )
      })
    },
    // 设置倒计时
    setInterval() {
      let second = 120
      this.interId = setInterval(() => {
        second--
        if (second) {
          // console.log('计时进行中', second)
          this.countTime = second
        } else {
          if (this.interId) {
            window.clearInterval(this.interId)
          }
          this.dogetMemberDynamicCode()
        }
      }, 1000)
    },
    // 根据油站获取可用电子券
    findCouponList(stationCode) {
      this.$http
        .post('/app/json/user_coupon/getAllCouponList', {
          stationCode: stationCode,
          couUseType: 1, // 可用
          userType: 1, // 个人
        })
        .then((res) => {
          let data = res.data
          if (data.status == 0) {
            if (data.data.length > 0) {
              this.couponList = data.data
            } else {
              this.couponList = []
              this.noCouponText = '暂无优惠券~'
            }
          }
        })
        .catch((err) => {
          this.$Toast(err)
        })
    },
    // 更多电子券点击
    moreCoupon() {
      this.$router.push('/cnooc-my-coupon')
    },
    // 券点击
    couponItemClick(coupon) {
      this.$router.push({
        path: '/cnooc-my-coupon-detail',
        query: {
          couNo: coupon.couNo,
          couUseType: 1,
        },
      })
    },
    getContainer() {
      return document.getElementsByTagName('body')[0]
    },
    // 获取用户默认油站
    getStation() {
      this.$http
        .post('/app/json/hy_station/getDefaultStation', {})
        .then((res) => {
          let data = res.data
          if (data.status == 0) {
            this.$store.commit('setStationInfo', data.data)
            this.findCouponList(data.data.stationCode)
          } else {
            this.$Toast(data.info)
          }
        })
        .catch((err) => {
          this.$Toast(err)
        })
    },
    stationClick() {
      this.$router.push({
        path: '/nearstation',
      })
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.interId) {
      window.clearInterval(this.interId)
    }
    next()
  },
  watch: {},
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/deploy/cnooc/assets/stylus/cnooc-variable.styl';
@import '~@/deploy/cnooc/assets/stylus/cnooc-public.styl';

.container {
  .nav-content {
    background-color: #068ed0;
  }
}

.reset-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  .station-chose {
    font-size: 15px;
    height: 50px;
    line-height: 50px;
    margin: 0 15px;
    background: url('../../assets/images/chose-station-bg.png') no-repeat;
    background-size: cover;
    border-radius: 5px;
    position: relative;
    display: flex;
    align-items: center;

    .station-name {
      ellipse();
      margin-left: 10px;
    }

    .icon {
      width: 15px;
      height: 20px;
      vertical-align: middle;
      margin-left: 15px;
    }
  }

  .card-info {
    border-radius: 5px;
    margin: 10px 15px 0;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    background: url('../../assets/images/card-bg-pay.png') no-repeat;
    background-size: 100% 100%;

    .member-content, .card-content {
      display: flex;
      position: relative;

      .member-title, .card-title {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        color: $color-theme;
        font-size: 14px;
      }

      .left {
        width: 55%;
        text-align: left;
        box-sizing: border-box;
        padding-left: 40px;
        bdr-r();

        .sub-title {
          font-size: 14px;
          color: $color-gray;

          &.btm {
            margin-top: 18px;
          }
        }

        .sub-content {
          display: block;
          font-size: 18px;
          line-height: 27px;
          ellipse();
        }

        .haiyou-card {
          display: block;
          width: 120px;
          box-shadow: 0 0 10px #ddd;
          margin: 12px 0;
        }

        .card-tip {
          font-size: 13px;
          color: $color-gray;
          margin-top: 18px;
          line-height: 16px;
          position: relative;

          i {
            display: block;
            position: absolute;
            left: -12px;
            top: 3px;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            border: 1px solid $color-gray;

            &::before {
              content: '';
              display: block;
              width: 4px;
              height: 4px;
              border-radius: 50%;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              background-color: $color-gray;
            }
          }
        }
      }

      .right {
        width: 45%;
        text-align: center;
        position: relative;
        min-height: 100px;

        .qrcode-content {
          width: 80px !important;
          height: 80px !important;
          margin: 0 auto;
        }

        .count-time {
          color: $color-gray;
          margin-top: 8px;
        }

        .card-pay {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);

          .card-pay-icon {
            width: 70px;
            height: 70px;
            margin: 0 auto;
            background-color: #EEF9FD;
            border-radius: 50%;
            border: 1px solid #CCEBFA;
            position: relative;

            img {
              display: block;
              width: 40px;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }

          .card-pay-text {
            display: inline-block;
            font-size: 14px;
            margin-top: 4px;
          }
        }
      }
    }
  }

  .coupon-list-title {
    padding: 15px;
    font-size: 16px;
    color: #fff;

    .more-coupon {
      display: inline-block;
      float: right;
      font-size: 14px;
      opacity: 0.6;
    }
  }

  .coupon-list-c {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 360px;
    padding: 5px 0;
    overflow-y: auto;
  }

  .coupon-list {
    margin: 0 15px;

    .coupon-item {
      display: flex;
      background-color: #fff;
      padding: 12px;
      border-radius: 5px;
      margin-top: 10px;

      &:first-child {
        margin-top: 0;
      }

      .left {
        width: 80px;
        position: relative;

        &::before, &::after {
          content: '';
          display: block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: $color-theme;
          position: absolute;
          right: -20px;
        }

        &::before {
          top: -22px;
        }

        &::after {
          bottom: -23px;
        }

        .coupon-bg {
          display: block;
          width: 100%;
          height: 75px;
        }

        .coupon-price {
          position: absolute;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 25px;
          font-weight: 700;
          color: $color-theme;
        }

        .coupon-use {
          display: block;
          width: 100%;
          text-align: center;
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 13px;
          color: $color-theme;
        }
      }

      .right {
        padding-left: 25px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .coupon-title {
          font-size: 17px;
          max-width: 200px;
          ellipse();
        }

        .cou-type-code {
          font-size: 13px;
        }

        .coupon-validity {
          font-size: 13px;
        }
      }
    }
  }

  .no-coupon {
    text-align: center;
    font-size: 12px;
    color: #fff;
  }
}

.qr-dialog {
  width: 75%;
}

.code-container {
  min-width: 300px;
  background: url('../../assets/images/code-bg.png') no-repeat;
  background-size: 100%;
  background-clip: content-box;
  overflow: hidden;
  text-align: center;
  border-radius: 5px;

  .user-name {
    font-size: 18px;
    margin-top: 15px;
  }

  .qrcode-content {
    margin-top: 18px;
    width: 170px !important;
    height: 170px !important;
  }

  .refresh-time {
    font-size: 13px;
    color: #ccc;
    margin-top: 8px;
  }

  .member-code {
    background-color: #fff;
    margin-top: 10px;

    .title {
      font-size: 13px;
    }

    .num {
      display: block;
      font-size: 18px;
      margin: 5px 0 13px;
    }
  }
}

.big-qrcode {
  display: block;
  margin: 10px auto 0;
  width: 200px !important;
  height: 200px !important;
}

.chose-station-popup {
  width: 100%;

  .chose-btn {
    display: flex;
    bdr-b();

    span {
      display: block;
      text-align: center;
      width: 50%;
      line-height: 40px;
      font-size: 16px;
      color: $color-theme;
    }
  }
}
</style>

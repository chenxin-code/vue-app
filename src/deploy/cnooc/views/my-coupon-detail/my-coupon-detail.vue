<template>
  <div class="container">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="coupon-detail">
        <coupon-detail :item="couponDetails" :useType="1"></coupon-detail>
        <!-- 更多适用站按钮 -->
        <span class="more-station-btn" @click="moreStation">查看更多适用油站</span>
      </div>
      <div class="has-bg">
        <div class="qrcode-list">
          <div class="qrcode">
            <div class="img">
              <img src="../../assets/images/bg7-2.png" alt />
            </div>
            <div class="code_img">
              <div class="qr-container">
                <canvas id="qrcode"></canvas>
                <p class="countdown-text">{{ sec }}秒后刷新二维码</p>
              </div>
              <div class="code_num">券动态码：{{ showCode(couponDetails.dynamicCode) }}</div>
            </div>
            <div class="tips">
              <div class="title">使用须知</div>
              <div class="content" v-html="couDesc"></div>
            </div>
          </div>
        </div>
      </div>
      <van-popup class="reset-station-popup-w" v-model="moreStationList">
        <p class="title">当前优惠券适用加油加气站</p>
        <div class="content">
          <div v-for="(item, index) in slots" :key="index" class="item-text">{{ item }}</div>
        </div>
        <div class="btn-c" @click="moreStationList = false">我知道了</div>
      </van-popup>
      <div class="common-verify" v-if="isShowVerify">
        <GraphicswordVerify
          :verifyData="verifyData"
          @cancelEvent="cancelEvent"
          @getVertifyDatas="getVertifyDatas"
          @graphicswordSubmit="submitCode"
        ></GraphicswordVerify>
      </div>
    </nav-content>
  </div>
</template>

<script>
import GraphicswordVerify from '@/deploy/cnooc/components/graphicsword-verify/graphicsword-verify.vue'
import cnoocUtil from '@/deploy/cnooc/utils/index.js'
import QRCode from 'qrcode'
import CouponDetail from '@/deploy/cnooc/components/coupon/coupon.vue'
import { Popup, Dialog, Picker } from 'vant'
export default {
  components: {
    CouponDetail,
    GraphicswordVerify,
    VanPopup: Popup,
    VanDialog: Dialog.Component,
    VanPicker: Picker,
  },
  data() {
    return {
      couponStatus: 1,
      isShowMore: false,
      moreStationList: false,
      slots: [],
      couNo: '',
      stationnameList: [],
      couDesc: '',
      couponDetails: {
        dynamicCode: '',
      },
      sec: 120,
      interId: null,
      isShowVerify: false,
      verifyData: {},
      imgVerifyCode: '',
      uuid: '',
    }
  },
  methods: {
    // 获取验证码图片
    getVeify() {
      this.$http
        .post('/app/json/login/getCouponVerifyData', {})
        .then((res) => {
          let data = res.data
          if (data.status == 0) {
            this.uuid = data.data.uuid
            this.verifyData = data.data.verifyData
            this.isShowVerify = true
          } else {
            this.$message.notifyErr(data.info)
          }
        })
        .catch((err) => {
          this.$message.notifyErr(err)
        })
    },
    cancelEvent() {
      this.$router.go(-1)
    },
    // 刷新图片
    getVertifyDatas() {
      this.getVeify()
    },
    submitCode(imgVerifyCode) {
      this.isShowVerify = false
      this.imgVerifyCode = imgVerifyCode
      this.dogetstationlist()
    },
    dogetstationlist() {
      this.$http
        .post('/app/json/user_coupon/getCouDistUsedUserInfo', {
          couNo: this.couNo,
        })
        .then((res) => {
          let data = res.data
          if (data.status == 0) {
            this.couponDetails = res.data.data
            this.showHtmlDesc(this.couponDetails.couDesc)
            // 重置优惠券状态
            this.couponDetails.couUseType = this.couponStatus
            // 重置券适用站
            this.couponDetails.stationName = res.data.data.stationNameList[0]
            this.stationnameList = res.data.data.stationNameList
            setTimeout(() => {
              QRCode.toCanvas(
                document.getElementById('qrcode'),
                res.data.data.dynamicCode,
                {
                  margin: 1,
                  width: 240,
                }
              )
              this.countDown()
            }, 400)
          } else {
            this.$message.notifyErr(data.info)
            this.getVeify()
          }
        })
        .catch((error) => {
          this.$message.notifyErr(error)
          this.getVeify()
        })
    },
    showHtmlDesc(couDesc) {
      this.couDesc = cnoocUtil.showHtml(couDesc)
    },
    //数秒
    countDown() {
      let second = 120
      this.interId = setInterval(() => {
        second--
        if (second) {
          console.log('计时进行中', second)
          this.sec = second
        } else {
          window.clearInterval(this.interId)
          this.dogetstationlist()
        }
      }, 1000)
    },
    moreStation() {
      this.moreStationList = true
      this.slots = this.stationnameList
    },
    showCode(code) {
      if (/\S{5}/.test(code)) {
        return code.replace(/\s/g, '').replace(/(.{4})/g, '$1 ')
      } else {
        return code
      }
    },
  },
  mounted() {
    this.couNo = this.$route.query.couNo
    this.couponStatus = Number(this.$route.query.couUseType)
    this.dogetstationlist()
  },
  beforeRouteLeave(to, from, next) {
    window.clearInterval(this.interId)
    next()
  },
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/deploy/cnooc/assets/stylus/cnooc-variable.styl';
@import '~@/deploy/cnooc/assets/stylus/cnooc-public.styl';

.container {
  .nav-content {
    background-color: #f5f5f5;
  }
}

.coupon-detail {
  padding: 10px;
  position: relative;

  .more-station-btn {
    font-size: 12px;
    color: $color-theme;
    position: absolute;
    right: 22px;
    bottom: 20px;
  }
}

.qr-container {
  margin: 0 auto;
  text-align: center;

  canvas {
    width: 240px !important;
    height: 240px !important;
  }

  .countdown-text {
    color: $color-gray;
  }
}

.station_div {
  margin-top: 5px;
  width: 86%;
  border: solid 1px #cccccc;
  border-radius: 4px;
  margin: 0 auto;
  line-height: 20px;
  padding: 10px;
  height: 100%;
  overflow: auto;
}

.stationlist {
  width: 50%;
  font-size: 12px;
  float: left;
  line-height: 12px;
  margin-top: 2px;
  margin-bottom: 2px;
}

.item {
  height: 120px;
  width: 94%;
  margin: 0 auto;
  margin-top: 6px;
  border-radius: 6px;
  box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
  background-color: #fff;
}

.qrcode-list {
  padding: 12px;

  .qrcode {
    border-radius: 6px;
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    background-color: #fff;

    img {
      width: 100%;
    }
  }

  .tips {
    padding: 12px;
    color: $color-gray;

    .title {
      padding-bottom: 6px;
    }
  }
}

.item_top {
  display: flex;
}

.tips-title {
  padding: 10px;

  .title {
    font-size: 14px;
  }

  .content {
    padding-top: 10px;
    line-height: 18px;
    color: #504e4e;
  }
}

.item_info {
  flex: 3;
  color: #FFAB41;
  text-align: center;
  margin-top: 10px;
}

.item_info_1 span:first-child {
  font-size: 18px;
  margin-left: -11px;
}

.item_info_1 span:last-child {
  font-size: 40px;
  margin-left: -4px;
  font-weight: bold;
}

.item_content {
  flex: 7;
  line-height: 25px;
  height: 80px;
  padding: 10px;
}

.item_title {
  font-size: 16px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
}

.item_time {
  font-weight: bold;
  font-size: 10px;
  color: #504E4C;
}

.item_oil {
  color: #6E6E6E;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
}

.couponcode {
  text-align: center;
  margin-top: 10px;
  font-size: 16px;
}

.code_img {
  padding: 10px 15px;
}

.code_num {
  font-size: 14px;
  color: #7B7B7B;
  text-align: center;
  padding: 10px 0 20px 0;
  bdr-b();
}

.use {
  padding: 10px 20px;
  line-height: 20px;
  color: #5E6368;
}

.info-container {
  padding: 10px 15px 0 15px;
  margin-top: 10px;
  position: relative;
  background-color: #fff;

  .title {
    margin: 0;
    font-size: 17px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;

    .more-btn {
      display: block;
      float: right;
      font-size: 13px;
      color: #909090;
    }

    .station-exam {
      font-size: 14px;
      padding-left: 8px;
    }
  }

  .station-list {
    box-sizing: border-box;
    padding: 0 15px;
    width: 100%;
    background-color: #fff;
    font-size: 14px;
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    left: 0;
    top: 49px;

    li {
      width: 50%;
      padding: 7px 0;
    }
  }

  .usage-notice {
    font-size: 14px;
  }
}

.reset-station-popup-w {
  width: 80%;
  height: 350px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .title {
    font-size: 18px;
    text-align: center;
    padding: 10px 0;
    bdr-b();
  }

  .content {
    flex: 1;
    overflow-y: scroll;

    .item-text {
      font-size: 15px;
      text-align: center;
      padding: 10px 0;
    }
  }

  .btn-c {
    font-size: 14px;
    color: #fff;
    padding: 10px 0;
    margin: 10px;
    background-color: $color-theme;
    text-align: center;
    display: inline-block;
    border-radius: 5px;
  }
}

.common-verify {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  top: 0px;
  left: 0px;
  background: rgba(0, 0, 0, 0.66);
  z-index: 99;
}
</style>

<template>
  <div class="container">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <default-station
        class="chose-station-c"
        @getDefaultStation="selectStation"
        @getCurrentStation="selectStation"
      ></default-station>
      <div class="my-coupon">
        <div class="coupon-list" v-if="couponList.length > 0">
          <div
            class="coupon-item"
            v-for="(item, index) in couponList"
            :key="index"
            @click="clertnocan(item)"
          >
            <div v-if="item.userType===1" class="userType">个人</div>
            <div v-else-if="item.userType===2" class="userType">机构</div>
            <coupon-detail :useType="0" :item="item"></coupon-detail>
          </div>
        </div>
        <div class="no-info" v-else>{{ noResultText }}</div>
      </div>
      <div class="confirm-btn">
        <div class="btn-group">
          <div class="btn" @click="goUsedCpupon">已使用电子券</div>
        </div>
      </div>
      <van-popup class="reset-station-popup-w" v-model="moreStationList">
        <p class="title">当前优惠券适用加油加气站</p>
        <div class="content">
          <div v-for="(item, index) in slots" :key="index" class="item-text">{{ item }}</div>
        </div>
        <div class="btn-c" @click="moreStationList = false">我知道了</div>
      </van-popup>
    </nav-content>
  </div>
</template>

<script>
import DefaultStation from '@/deploy/cnooc/components/default-station/default-station'
import CouponDetail from '@/deploy/cnooc/components/coupon/coupon.vue'
import { Dialog, Picker, Tabs, Tab, Popup } from 'vant'

export default {
  name: 'mycoupon',
  components: {
    DefaultStation,
    CouponDetail,
    VanDialog: Dialog.Component,
    VanPicker: Picker,
    VanTabs: Tabs,
    VanTab: Tab,
    VanPopup: Popup,
  },
  data() {
    return {
      hasMechan: false,
      moreStationList: false,
      defaultStation: {},
      stationCode: '',
      page: 1,
      totalPage: 1,
      obj: {},
      couponList: [],
      noResultText: '',
      slots: [],
      userType: 1,
    }
  },
  methods: {
    clertnocan(item) {
      if (item.couUseType == 0) {
        this.$http
          .post('/app/json/user_coupon/getCouDistUsedUserInfo', {
            couNo: item.couNo,
          })
          .then((res) => {
            let data = res.data
            if (data.status == 0) {
              this.moreStationList = true
              this.slots = data.data.stationNameList
            }
          })
          .catch((error) => {
            this.$Toast(error)
          })
      } else if (item.couUseType === 2) {
        this.$Toast('该券未满足激活条件')
      } else {
        this.couponDetail(item)
      }
    },
    couponDetail(item) {
      this.$router.push({
        path: '/cnooc-my-coupon-detail?temp = ' + Math.random(),
        query: {
          couNo: item.couNo,
          couUseType: item.couUseType,
        },
      })
    },
    // 已使用电子券点击
    goUsedCpupon() {
      this.$router.push({
        path: '/cnooc-my-couponused',
        query: {
          stationCode: this.obj.stationCode,
          userType: this.userType,
          hasMechan: this.hasMechan,
        },
      })
    },
    loadCoupons() {
      var that = this
      if (that.page > that.totalPage) {
        this.$Toast('没有更多了!')
        return
      }
      var postdata = {
        stationCode: that.obj.stationCode,
        couUseType: -1,
      }
      this.$http
        .post('/app/json/user_coupon/getAllCouponList', postdata)
        .then((res) => {
          let data = res.data
          if (data.status == 0) {
            if (data.data) {
              var couponListTmp = data.data
              for (var i = 0; i < couponListTmp.length; i++) {
                couponListTmp[i]['startDate'] = couponListTmp[i][
                  'validStartDate'
                ].substring(0, 10)
                couponListTmp[i]['endDate'] = couponListTmp[i][
                  'validEndDate'
                ].substring(0, 10)
              }
              couponListTmp.sort((item, index) => {
                if (item.couUseType == 1) {
                  return -1
                } else {
                  return 1
                }
              })
              that.couponList = couponListTmp
              if (this.couponList.length == 0) {
                this.noResultText = '暂无优惠券'
              }
              that.totalPage = data.totalPages
            } else {
              this.noResultText = '暂无优惠券'
            }
          } else {
            this.$Toast(data.info)
            this.noResultText = '暂无优惠券'
          }
        })
        .catch((error) => {
          this.$Toast(error)
        })
    },
    selectStation(val) {
      this.couponList = []
      if (this.$store.state.refuelStation.stationName) {
        this.obj = this.$store.state.refuelStation
      } else {
        this.obj = val
      }
      this.loadCoupons()
    },
    // tab点击
    tabClick(name, title) {
      this.couponList = []
      if (name == 0) {
        // 个人
        this.userType = 1
        this.loadCoupons()
      } else if (name == 1) {
        // 机构
        this.userType = 2
        this.loadCoupons()
      }
    },
  },
  mounted() {
    this.$http
      .post('/app/json/user/loginOrgUser', {})
      .then((res) => {
        let data = res.data
        if (data.status == 0) {
          if (data.data) {
            this.hasMechan = true
          } else {
            this.hasMechan = false
          }
        } else {
          this.$Toast(data.info)
          this.hasMechan = false
        }
      })
      .catch((err) => {
        this.$Toast(err)
        this.hasMechan = false
      })
  },
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/deploy/cnooc/assets/stylus/cnooc-variable.styl';
@import '~@/deploy/cnooc/assets/stylus/cnooc-public.styl';

.container {
  .nav-content {
    background-color: #f5f5f5;
    display flex;
    flex-direction column;
  }
}

.chose-station-c {
  margin-top: 10px;
  margin-bottom 10px;
}

.my-coupon {
  flex 1;
  overflow-y auto;
  .coupon-list {
    padding: 0 10px 0;

    .coupon-item {
      position: relative;
      overflow: hidden;

      & + .coupon-item {
        margin-top: 8px;
      }

      .userType {
        position: absolute;
        right: 0px;
        z-index: 1;
        margin-right: 8px;
        font-size: 8px;
        width: 35px;
        height: 20px;
        text-align: right;
        padding-top: 2px;
        color: #ffffff;
        border-radius 0 5px 0 0;
      }

      &::after {
        content: '';
        display: block;
        width: 60px;
        height: 30px;
        position: absolute;
        right: 0;
        top: 0;
        background-color: $color-theme;
        transform: translate(18px, -12px) rotate(30deg);
      }
    }
  }

  .no-info {
    font-size: 14px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: $color-gray;
  }
}

.confirm-btn {
  padding: 10px;
  position relative;
  background: #fff;
  z-index: 2;
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
</style>

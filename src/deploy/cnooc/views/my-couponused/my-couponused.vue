<template>
  <div class="container">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <van-list
        class="coupon-list"
        v-model="loading"
        :finished="finished"
        :offset="200"
        finished-text="没有更多了"
        @load="loadMore">
        <div
          class="coupon-item"
          v-for="(item, index) in couponList"
          :key="index"
          @click="tocouponDetail(item)">
          <div v-if="item.userType===1" class="userType">个人</div>
          <div v-else-if="item.userType===2" class="userType">机构</div>
          <coupon-detail :item="item"></coupon-detail>
        </div>
      </van-list>
    </nav-content>
    <van-popup :get-container="getContainer" class="used-coupon-modal" v-model="popupVisible">
      <p class="pop_top">已使用电子券详情</p>
      <p class="pop_you">
        <span class="label">核销网点：</span>
        {{stationinfo.usedStationName}}
      </p>
      <p class="pop_time">
        <span class="label">使用时间：</span>
        {{stationinfo.usedTime}}
      </p>
      <p class="pop_num">
        <span class="label">交易流水号：</span>
        {{stationinfo.orderNo}}
      </p>
      <p class="pop_num">
        <span class="label">券号：</span>
        {{stationinfo.couNo}}
      </p>
      <p class="pop_num">
        <span class="label">券动态码：</span>
        {{stationinfo.couCheckCode}}
      </p>
      <canvas class="qrcode-content" id="coupon-qrcode"></canvas>
    </van-popup>
  </div>
</template>

<script>
import QRCode from "qrcode"
import CouponDetail from '@/deploy/cnooc/components/coupon/coupon.vue'
import { Popup, Tabs, Tab } from "vant"

export default {
  components: {
    CouponDetail,
    VanPopup: Popup,
    VanTabs: Tabs,
    VanTab: Tab
  },
  data() {
    return {
      hasMechan: false,
      stationCode: "",
      couponList: [],
      popupVisible: false,
      stationinfo: {},
      userType: "",
      hasMore: true,
      pageInfo: {
        page: 0,
        rows: 10
      },
      loading: false,
      finished: false,
    };
  },
  mounted() {
    this.stationCode = this.$route.query.stationCode
    this.userType = this.$route.query.userType
  },
  methods: {
    tocouponDetail(item) {
      this.popupVisible = true;
      this.$http.post("/app/json/user_coupon/getCouDistUsedUserInfo", {
        couNo: item.couNo
      })
        .then(res => {
          this.stationinfo = res.data.data
          if (!res.data.data.couCheckCode) {
            this.$Toast("编码为空，无法展示二维码")
            return false
          }
          QRCode.toCanvas(
            document.getElementById("coupon-qrcode"),
            res.data.data.couCheckCode,
            {
              margin: 1,
              width: 170
            }
          )
        })
        .catch(error => {
          this.$Toast(error);
        });
    },
    dofindUsedCoupons() {
      this.$http.post("/app/json/user_coupon/findUsedCoupons", this.pageInfo)
        .then(res => {
          this.loading = false
          let data = res.data
          if (data.status == 0) {
            if (data.data instanceof Array && data.data.length > 0) {
              this.couponList.push.apply(this.couponList, data.data)
              if (this.couponList.length >= data.totalRecords) {
                this.finished = true
              }
            } else {
              this.finished = true
            }
          } else {
            this.finished = true
            this.$Toast(data.info)
          }
        })
        .catch(error => {
          this.finished = true
          this.$Toast(error)
        })
    },
    getContainer() {
      return document.getElementsByTagName("body")[0]
    },
    loadMore() {
      this.pageInfo.page++
      this.dofindUsedCoupons()
    }
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/deploy/cnooc/assets/stylus/cnooc-variable.styl';
@import '~@/deploy/cnooc/assets/stylus/cnooc-public.styl';

.used-coupon-modal {
  border-radius: 5px;
  padding: 20px;
  width: 300px;
  box-sizing: border-box;

  .pop_top {
    font-size: 16px;
    font-weight: 700;
    text-align: center;
  }

  .pop_you {
    padding-top: 2px;
    font-size: 15px;
    margin-top: 18px;
    ellipse();
  }

  .pop_time {
    font-size: 13px;
    margin-top: 16px;
  }

  .pop_num {
    font-size: 13px;
    margin-top: 8px;
  }

  .label {
    display: inline-block;
    width: 90px;
  }

  .qrcode-content {
    margin: 15px auto 0;
    display: block;
    width: 170px !important;
    height: 170px !important;
  }
}

.cou_img {
  width: 55px;
  height: 55px;
}

.coupon-list {
  padding: 10px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow-y auto;

  .coupon-item {
    position relative;
    overflow hidden;

    .time {
      color: $color-gray;
      padding: 0 0 10px 0;
    }

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
</style>

/**Created by liaoyingchao on 2018/11/15.*/

<template>
  <div class="coupon mall2" v-if="visible">
    <pop-view v-if="visible" @closeEvent="visible = false">
      <div class="pop-body" v-if="initData.type == 'receive'">
        <div class="pop-title theme_font_common">优惠券</div>
        <div class="pop-scroll-div">
          <div v-if="canReceiveCoupon.length > 0">
            <div class="title theme_font_gray">可领取优惠券</div>
            <Coupon :coupons="canReceiveCoupon" :listType="0" @getCouponEvent="getCouponEvent" @couponProducts="couponProducts"></Coupon>
          </div>
          <div v-if="initData.jfhqData && initData.jfhqData.length > 0">
            <div class="title theme_font_gray">积分换券</div>
            <JFHQCoupon ref="JFHQCoupon" :coupons="initData.jfhqData" :listType="0" @jfdhCouponEvent="jfdhCouponEvent" @couponProducts="couponProducts"></JFHQCoupon>
          </div>
          <div v-if="receivedCoupon.length > 0">
            <div class="title theme_font_gray">已领取优惠券</div>
            <Coupon :coupons="receivedCoupon" :listType="0" @getCouponEvent="getCouponEvent" @couponProducts="couponProducts" :fiveEnter="initData.fiveEnter"></Coupon>
          </div>
        </div>
      </div>
      <div class="pop-body" v-if="initData.type == 'use'">
        <div class="pop-title theme_font_common">优惠券</div>
        <div class="pop-tabs">
          <div class="tab-item" @click="canUseCoupon = true">
            <div class="theme_font_gray" :class="{theme_font_black_i: canUseCoupon}">可用优惠券({{initData.freightCoupon ? initData.userCanUseCoupon.length + initData.freightCoupon.length : initData.userCanUseCoupon.length}})</div>
            <div class="selected-line" :class="{theme_bg_red: canUseCoupon}"></div>
          </div>
          <div class="tab-item" @click="canUseCoupon = false">
            <div class="theme_font_gray" :class="{theme_font_black_i: !canUseCoupon}">不可用优惠券({{initData.userCanNotUseCoupon.length}})</div>
            <div class="selected-line" :class="{theme_bg_red: !canUseCoupon}"></div>
          </div>
        </div>
        <div class="pop-scroll-div">
          <div v-show="canUseCoupon">
            <div class="no-coupon" v-if="(!initData.freightCoupon || initData.freightCoupon.length == 0) && initData.userCanUseCoupon.length == 0">
              <img src="static/image/mall2/no-coupon.png"/>
              <p class="theme_font_gray">您暂时没有可以使用的优惠券</p>
            </div>
            <div class="cate-title" v-if="initData.freightCoupon && initData.freightCoupon.length > 0">商场券</div>
            <Coupon :listType="2" :payAmount="initData.payAmount" :coupons="initData.userCanUseCoupon" @getCouponEvent="getCouponEvent" @couponProducts="couponProducts" @selectedItems="selectedItemsEvent" :fiveEnter="initData.fiveEnter" :isSelectedList="initData.isSelectedList" :storeIndex="initData.storeIndex"></Coupon>
            <div class="cate-title" v-if="initData.freightCoupon && initData.freightCoupon.length > 0">运费券</div>
            <Coupon :listType="2" :payAmount="initData.payAmount" :coupons="initData.freightCoupon" @getCouponEvent="getCouponEvent" @couponProducts="couponProducts" @selectedItems="selectedItemsEvent"></Coupon>
          </div>
          <div v-show="!canUseCoupon">
            <div class="no-coupon" v-if="initData.userCanNotUseCoupon.length == 0">
              <img src="static/image/mall2/no-coupon.png"/>
              <p class="theme_font_gray">您暂时没有不可以使用的优惠券</p>
            </div>
            <Coupon :listType="1" :coupons="initData.userCanNotUseCoupon" @getCouponEvent="getCouponEvent" @couponProducts="couponProducts"></Coupon>
          </div>
        </div>
        <div class="bottom-btn theme_font_white theme_bg_red" @click="sureEvent" v-if="canUseCoupon">确定</div>
      </div>
      <div class="pop-body" v-if="initData.type == 'show'">
        <div class="pop-title theme_font_common">优惠券</div>
        <div class="pop-scroll-div">
          <div v-if="receivedCoupon.length > 0">
            <div class="title theme_font_gray">已领取优惠券</div>
            <Coupon :coupons="receivedCoupon" :listType="0" @getCouponEvent="getCouponEvent" @couponProducts="couponProducts"></Coupon>
          </div>
        </div>
      </div>
    </pop-view>
  </div>
</template>

<script>
  import Coupon from './base/list'
  import JFHQCoupon from './base/jfhq-list'
  import store from "@/vuex/store";

  export default {
    name: "coupon",
    components: {
      Coupon,
      JFHQCoupon
    },
    data() {
      return {
        initData: {
          listData: [],
          userCanNotUseCoupon: [],
          userCanUseCoupon: [],
          userCanUseWhenNotSelectCoupon: [],
          freightCoupon: [],
          type: '',
          skuId: '',
          categoryId: '',
          storeOuCode: '',
          token: '',
          jfhqData: '',
          isSelectedList:[],
          storeIndex:0,
        },
        visible: false,
        selectedCoupon: function () {
          console.log('selectedCoupon')
        },
        getedCoupon: function () {
          console.log('getedCoupon')
        },
        couponProducts: function () {
          console.log('couponProducts')
        },
        receivedCoupon: [],
        canReceiveCoupon: [],
        canUseCoupon: true,
        selectedItems: [],
      }
    },
    methods: {
      reloadCoupons: function () {

      },
      sureEvent: function () {
        this.visible = false
        // console.log(this.selectedItems)
        // this.selectedCoupon(this.selectedItems)
      },
      selectedItemsEvent: function (items) {
        let arr = []
        if (this.initData.userCanUseCoupon && this.initData.userCanUseCoupon.length) {
          for (let i = 0; i < this.initData.userCanUseCoupon.length; i++) {
            if (this.initData.userCanUseCoupon[i].selected == true) {
              arr.push(this.initData.userCanUseCoupon[i])
            }
          }
        }
        if (this.initData.freightCoupon && this.initData.freightCoupon.length) {
          for (let i = 0; i < this.initData.freightCoupon.length; i++) {
            if (this.initData.freightCoupon[i].selected == true) {
              arr.push(this.initData.freightCoupon[i])
            }
          }
        }
        this.selectedItems = arr
        this.selectedCoupon(this.selectedItems)
      },
      popClose: function () {
        this.visible = false;
      },
      jfdhCouponEvent: function (item) {
        this.$Loading.open()
        let paramsData = {
          token: store.state.login.token,
          deliveryType: 2,
          virtualUserPhone: store.state.login.phone
        }
        if (item.perDiscountEmpRewardsPrice) {
          paramsData.carts = [{
            number: 1,
            skuId: item.skuId,
            storeOuCode: item.storeOuCode,
            empRewardsPrice: item.perDiscountEmpRewardsPrice,
            price: 0,
            selfActivityId: item.activityId
          }]
          paramsData.payDigital = [{payDigital: item.perDiscountEmpRewardsPrice, acctType: 'EmpRewards'}]
        } else {
          paramsData.carts = [{
            number: 1,
            skuId: item.skuId,
            storeOuCode: item.storeOuCode,
            pointsPrice: item.points,
            price: 0,
            selfActivityId: item.activityId
          }]
          paramsData.payDigital = [{payDigital: item.points, acctType: 'Points'}]
        }
        this.$http.post('/app/json/app_shopping_order/submit', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            // item.isReceived = 1
            // this.getedCoupon(item)
            this.$refs.JFHQCoupon.setItemReceived(item)
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
      getCouponEvent: function (item) {
        this.$Loading.open();
        let url = '/app/json/app_market/getCouScanUrl';
        let params1 = {
          token: this.initData.token,
          mktActivityId: item.mktActivityId,
          proCode: this.initData.skuId,
          categoryCode: this.initData.categoryId,
          storeOuCode: this.initData.storeOuCode
        }
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            item.isReceived = 1
            this.getedCoupon(item)
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('请求数据失败！')
        });
      }
    },
    mounted() {
      console.log(this.initData.fiveEnter,'initData.fiveEnter')
      this.canUseCoupon = true;
      if (this.initData.type == 'receive') {
        this.receivedCoupon = [];
        this.canReceiveCoupon = [];
        for (let i = 0; i < this.initData.listData.length; i++) {
          let item = this.initData.listData[i]
          if (item.isReceived == 0) {
            this.canReceiveCoupon.push(item)
          } else {
            this.receivedCoupon.push(item)
          }
        }
      } else if (this.initData.type == 'use') {

      } else if (this.initData.type == 'show') {
        this.receivedCoupon = this.initData.listData
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .coupon {
    width 100%
    height 100%
    overflow hidden
    .cate-title {
      font-size 14px;
      padding 8px 8px 5px;
    }
    .title {
      font-size 13px;
      padding 8px 8px 5px;
    }
    .pop-tabs {
      font-size 14px;
      display flex;
      align-items center;
      .tab-item {
        padding-top 6px;
        flex 1;
        text-align center;
        .selected-line {
          display inline-block;
          margin-top 6px;
          width 80px;
          height 3px;
        }
      }
    }
    .no-coupon {
      text-align center;
      img {
        margin 30px 0px 20px;
        width 100px;
      }
      p {
        font-size 12px;
      }
    }
  }
</style>

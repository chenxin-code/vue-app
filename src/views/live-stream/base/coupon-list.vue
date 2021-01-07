/**Created by liaoyingchao on 2020-04-07.*/

<template>
  <div class="coupon-list mall2">
    <pop-view v-if="showPop" @closeEvent="popClose">
      <div class="pop-body">
        <p class="pop-title theme_font_black">领券神券</p>
        <div class="pop-scroll-div" v-if="couponlist.length > 0">
          <div class="coupon-row line_bottom" v-for="(coupon, idx) in couponlist">
            <div class="img-div">
              <div class="value-div" v-if="coupon.couFaceValueType == '1'">
                <div>
                  <span>¥</span><span class="value">{{coupon.couFaceValue}}</span>
                </div>
              </div>
              <div class="value-div" v-else-if="coupon.couFaceValueType == '2'">
                <div>
                  <span>¥</span><span class="value1">{{coupon.couMinFaceValue}}~{{coupon.couMaxFaceValue}}</span>
                </div>
              </div>
              <img v-else :src="coupon.couPic">
            </div>
            <div class="info-div">
              <div class="title theme_font_black double-line">{{coupon.couTypeTitle}}</div>
              <div class="time">
                <div class="label">有效期</div>
                <div class="value" v-if="coupon.validType == 3">自派发日起{{coupon.validDays}}天有效<span v-if="coupon.offsetDays > 0">（{{coupon.offsetDays || 0}}天后派发）</span></div>
                <div class="value" v-else>{{coupon.validStartDate}}-{{coupon.validEndDate}}</div>
              </div>
            </div>
            <div class="btn-div">
              <div class="" @click="$Toast('您已经领过了')" v-if="coupon.receiveScuess == true">
                <img src="../imgs/get-suc.png"/>
              </div>
              <div class="" @click="$Toast('当前券已抢光')" v-else-if="coupon.remainderNumber == 0">
                <img src="../imgs/loot-all.png"/>
              </div>
              <div class="btn" @click="getCoupon(coupon, idx)" v-else>立即开抢</div>
              <!--<div class="btn btn2">已抢完</div>-->
              <!--<div class="btn btn3">领取成功</div>-->
            </div>
          </div>
        </div>
        <div class="pop-scroll-div" v-else>
          <div class="no-cous">暂无可领优惠券</div>
        </div>
      </div>
    </pop-view>
  </div>
</template>

<script>

  export default {
    name: "coupon-list",
    props: ['lbId'],
    components: {
    },
    data() {
      return {
        showPop: false,
        couponlist: []
      }
    },
    methods: {
      popClose: function () {
        this.showPop = false;
        this.$emit('popClose')
      },
      getCouponList: function () {
        let url = '/app/json/live_broadcast/receiveCouponList'
        let params = {
          lbId: this.lbId
        }
        this.$Loading.open()
        this.$http.post(url, params).then(res => {
          let data = res.data;
          this.$Loading.close();
          if (data.status == 0) {
            this.couponlist = data.data
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close();
          this.$Toast('请求数据失败！')
        });
      },
      getCoupon: function (coupon, idx) {
        let url = '/app/json/live_broadcast/robCoupon'
        let params = {
          lbId: this.lbId,
          id: coupon.id
        }
        this.$Loading.open()
        this.$http.post(url, params).then(res => {
          let data = res.data;
          this.$Loading.close();
          if (data.status == 0) {
            coupon.receiveScuess = true
            this.couponlist.splice(idx, 1, coupon)
            // this.getCouponList()
            // this.couponlist = data.data
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close();
          this.$Toast('请求数据失败！')
        });
      }
    },
    created() {
      this.showPop = true;
      this.getCouponList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .coupon-list {
    overflow hidden
    .no-cous {
      padding 20px;
      text-align center
      color #999;
    }
    .coupon-row {
      //box-shadow 0 1px 8px #efefef;
      display flex;
      align-items center;
      padding 15px 0;
      .img-div {
        width 70px;
        height 70px;
        border-radius 4px;
        overflow hidden;
        background-color #efefef;
        img {
          display block;
          width 100%;
          height 100%;
        }
        .value-div {
          width 100%;
          height 100%;
          display flex;
          align-items center;
          justify-content center;
          background: linear-gradient(-45deg, #ff403e, #ffa291);
          color white;
          span {
            font-size 12px;
          }
          .value {
            font-size 18px;
          }
          .value1 {
            font-size 16px;
          }
        }
      }
      .info-div {
        padding 0 8px;
        flex 1;
        color #999;
        .title {
          line-height 18px;
          height 36px;
          font-size 14px;
        }
        .time {
          line-height 1.6
        }
      }
      .btn-div {
        img {
          width 60px;
          height 60px;
          display block;
        }
        .btn {
          width 70px;
          padding 8px 0;
          text-align center;
          background-color #EA5149;
          border-radius 20px;
          overflow hidden;
          font-size 13px;
          color white;
          /*&.btn-suc {
            background-color #7FC13A;
          }
          &.btn-guang {
            background-color #cdcdcd;
          }*/
        }
      }
    }
  }
</style>

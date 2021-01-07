<!--详情的团券-->
<template>
  <div class="coupon-container" v-if="groupCoupon">
    <!--左侧-->
    <div class="coupon-left" @click.stop="toLink(groupCoupon.id)">
      <div class="coupon-type">
        <img v-lazy="require('../image/券@2x.png')" class="img" alt />
      </div>
      <div class="coupon-content" v-if="couponDetail.coupon">
        <div class="coupon-info">
          <div class="coupon-rule">
            <span class="group-num">{{groupCoupon.groupBuyNumOfPerson}}人团</span>
            <div class="title">{{couponDetail.coupon.couTypeTitle}}</div>
          </div>
        </div>
        <div class="coupon-info-sub">
          <div class="price-wrapper">
            <div class="price">
              <span class="prefix-unit">￥</span>
              <span class="num">{{couponDetail.coupon.couFaceValue}}</span>
              <span style="width: 10px"></span>
              <p v-if="couponDetail.coupon.couThresholdAmount" style="color:#686868">满{{couponDetail.coupon.couThresholdAmount}}元可用</p>
              <span v-else class="threshold">无门槛</span>
              <span style="width: 10px"></span>
              
              <span class="progress">
                <span class="zhang">{{couponDetail.rewardNumber}}张</span>
                 <p>已经抢<span>{{percent}}</span>%</p>
                <van-progress pivot-text="红色" color="#f80f16" :show-pivot='false' :percentage="percent"/>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="coupon-line"></div>
    <!--右侧-->
    <div class="coupon-right">
      <div v-if="isLeader">
        <span v-if="isGroupLeader && groupCoupon.state == 10" @click.stop="groupHandler(10)" style="color:#f80f16">去使用</span>
        <span v-else>团长券</span>
      </div>
      <div v-else>
         <span v-if="!isGroupLeader && groupCoupon.state == 10" @click.stop="groupHandler(10)" style="color:#f80f16">去使用</span>
         <span v-else>团员券</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Progress } from 'vant'
import { mapGetters } from 'vuex'
import CircleProgress  from './circleProgress';
import countdown from "@/components/Vendor/countdown/countdown";
export default {
  name: "",
  components: {
    [Progress.name]: Progress,
    countdown,
    CircleProgress
  },
  props: {
    groupCoupon: {
      type: Object,
      default() {
        return null;
      }
    },
    invalid: Boolean, // 是否失效
    isLeader: {
      // true 是团长，false是团员
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      countDownTimeout: false
    };
  },
  mounted() {},
  computed: {
    ...mapGetters(['userInfo']),
    endDate(){
      return this.$util.getMyDate(this.groupCoupon.endDate)
    },
    // 是否是团长
    isGroupLeader() {
      if(this.groupCoupon.leaderUserId){
        return this.userInfo.userId == this.groupCoupon.leaderUserId;
      }
    },
    couponDetail() {
      let coupon = {};
      if (this.groupCoupon.leaderUserAward || this.groupCoupon.userAward) {
        if (this.isLeader) {
          coupon = this.groupCoupon.leaderUserAward[0] || {};
        } else {
          coupon = this.groupCoupon.userAward[0] || {};
        }
      }
      return coupon;
    },
    percent() {
      let percent = 0;
      if (this.groupCoupon.leaderUserId == 0) {
        if (this.groupCoupon.groupBuyNumTotal) {
          percent = Math.round(
            ((Number(this.groupCoupon.currentNumOfPerson) * 10000) /
              (Number(this.groupCoupon.groupBuyNumTotal) * 10000)) *
              100
          );
        }
      } else {
        if (this.groupCoupon.groupBuyNumOfPerson) {
          percent = Math.round(
            ((Number(this.groupCoupon.currentNumOfPerson) * 10000) /
              (Number(this.groupCoupon.groupBuyNumOfPerson) * 10000)) *
              100
          );
        }
      }
      return percent;
    }
  },
  methods: {
    groupHandler(status) {
      if (status == 0 || status == 9) {
        // 立即开团 重新开团
        // this.$Loading.open();
        // this.$http.post("/app/json/app_fight_group_order/start", {
        //   groupBuyType: 0,
        //   mktGroupBuyId: this.groupCoupon.mktGroupBuyId
        // }).then(res => {
        //   if (res.data.status == 0) {
        //     this.$Toast("开团成功！");
        //     this.$emit("success");
        //   } else {
        //     this.$Toast(res.data.info || "开团失败");
        //   }
        //   this.$Loading.close();
        // });
      } else if (status === 10) {
        let path = '/mall2/list/' + this.$util.getDataString()
        this.$router.push({
          path: path,
          query: {
            pageType: 'coupon',
            coupon: this.groupCoupon.couTypeCode,
            couThresholdAmount: this.groupCoupon.couThresholdAmount,
            couFaceValue: this.groupCoupon.couFaceValue,
            lastPath: this.$route.path,
            endTime: this.$util.getDateFromString(this.groupCoupon.validEndDate)
          }
        })
      }
    },
    toLink(id) {
      this.$router.push({
        path: `/group_ticket/group_detail/${this.$util.getDataString()}`,
        query: {
          orderId: id
        }
      })
    }
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.coupon-container {
  // height: 100%;
  display: flex;
  align-items: stretch;
  background-color: #fff;
  box-shadow: 0 1px 8px #efefef;
  border-radius: 8px;
  margin-bottom: 10px;

  &.invalid {
    opacity: 0.5;
  }

  .coupon-left {
    flex: 1;
    background-size: 100% 100%;
    padding: 15px;
    padding-right 2px;
    display: flex;

    .coupon-type {
      width: 75px;
      height: 75px;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
      color: $color-theme;

      .img {
        width: 100%;
        height: 100%;
      }
    }

    .coupon-content {
      flex: 1;
      padding-left: 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .coupon-info {
        display: flex;
        align-items: flex-start;

        .coupon-rule {
          flex: 1;
          padding-left: 6px;
          position: relative;

          .title {
            font-size: 14px;
            font-weight: 600;
            text-indent: 3.5em;
            line-height: 20px;
          }

          .group-num {
            position: absolute;
            left: 0;
            top: 0;
            font-size: 10px;
            border: 0.5px solid #F80F16;
            color: #F80F16;
            padding: 2px 6px;
            border-radius: 5px;
            float: left;
            margin-right: 4px;
          }

          .sub-title {
            font-size: 12px;
            font-weight: normal;
          }
        }
      }

      .coupon-info-sub {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        .price-wrapper {
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;

          .price {
            color: #F80F16;
            display: flex;
            align-items: flex-end;

            .prefix-unit {
              font-size: 10px;
            }

            .num {
              font-size: 28px;
              line-height: 26px;
              font-weight: 600;
            }

            .threshold {
              font-size: 10px;
              border: 0.5px solid #F80F16;
              color: #363430;
              background: #fdeae9;
              padding: 6px 9px;
              border-radius: 5px;
            }
            .progress{
              position relative
              display flex
              flex-direction column
              justify-content space-between
              width 70px
              height 26px
              >>>.van-progress{
                height 6px
              }
              .zhang{
                color #686868
                position absolute
                top -22px
                right 0
              }
            }
          }
        }

        .count {
          font-size: 10px;
          color: $color-theme;
        }
      }
    }
  }

  .coupon-line {
    width: 1px;
    height: 80px;
    margin: auto;
    border: 0.5px dashed #f0f0f0;
  }

  .coupon-right {
    width: 45px;
    color #686868
    display flex
    justify-content center
    align-items center
    span{
      writing-mode:tb-rl
      letter-spacing:4px
      font-size 16px
    }
  }
}
</style>

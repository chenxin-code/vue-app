<!--列表的团券-->
<template>
  <div class="coupon-container" v-if="groupCoupon" :class="{invalid: groupCoupon.leaderUserId == 0 && groupCoupon.state == 1 && percent >= 100}">
    <!--左侧-->
    <div class="coupon-left" @click.stop="toLink(groupCoupon)">
      <div class="coupon-type">
        <img v-lazy="formatPic || require('../image/券@2x.png')" class="img" alt="">
      </div>
      <div class="coupon-content" v-if="couponDetail.coupon">
        <div class="coupon-info">
          <div class="coupon-rule">
            <span class="group-num">{{groupCoupon.groupBuyNumOfPerson}}人团</span>
            <div class="title">
              {{couponDetail.coupon.couTypeTitle}}
            </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="coupon-line"></div>
    <!--右侧-->
    <div class="coupon-right">
      <div class="process-wrapper" v-if="groupCoupon.leaderUserId == 0 && groupCoupon.state == 1">
        <div class="Progress">
          <circleProgress v-if="percent < 100" :id="groupCoupon.id" :radius="3" :progress="percent" barColor='#f80f16' backgroundColor='#ffe7e6'> 
            <div class="process-text">
              <div>已抢</div>
              <div>{{percent}}%</div>
            </div>
          </circleProgress>
          <circleProgress v-if="percent >= 100" :id="groupCoupon.id" :radius="3" :progress="percent" barColor='#9c9c9c' backgroundColor='#ffe7e6'> 
            <div class="process-text">
              <div style="color:#9c9c9c">已抢光</div>
            </div>
          </circleProgress>
        </div>
        <span class="btn" @click.stop="groupHandler(0)" v-if="percent < 100">立即开团</span>
        <span class="btn" :disabled="percent >= 100" v-if="percent >= 100">明天继续</span>
      </div>
      <div v-else>
        <div v-if="groupCoupon.state == 10">
          <div class="process-wrapper">
            <div class="Progress">
              <circleProgress :id="groupCoupon.id" :radius="3" :progress="percent" barColor='#f80f16' backgroundColor='#ffe7e6'> 
                <div class="process-text">
                  <div>已拼成</div>
                </div>
              </circleProgress>
            </div>
          </div>
          <span class="btn" @click.stop="groupHandler(10)">去使用</span>
        </div>
        <div class="time-info" v-if="groupCoupon.state == 2 && !countDownTimeout">
          <div class="tip">结束时间</div>
          <div class="time">
            <countdown :endTime="groupCoupon.endTime ? this.$util.getDateFromString(groupCoupon.endTime) : ''" type='theme_bg_black' @timeOut="countDownTimeout = true"/>
          </div>
          <div>
            <span class="btn" @click.stop="invitation">邀请好友</span>
          </div>
          <div class="msg">还差 <span style="color: #F80F16">{{residueNum}} </span>人</div>
        </div>
        <div class="time-info" v-if="groupCoupon.state == 9 || countDownTimeout">
          <div class="tip">未拼成</div>
          <div class="time">
              <countdown :endTime="groupCoupon.endTime ? this.$util.getDateFromString(groupCoupon.endTime) : ''" type='theme_bg_black' @timeOut="countDownTimeout = true"/>
          </div>
          <div>
            <span class="btn" @click.stop="groupHandler(9)">重新开团</span>
          </div>
          <div class="msg">仅差 <span style="color: #F80F16">{{residueNum}}</span> 人</div>
        </div>
      </div>
    </div>
    <!-- <van-popup v-model="isToUse" class="popupCard" :close-on-click-overlay="false">
      <div class="popupCardText">
        <span>确认使用该券，</span>
        <span>充值到&nbsp;{{replacePhone(userInfo.phone)}}&nbsp;的手机号码吗？</span>
      </div>
      <div class="popupCardBtn">
        <span @click="isToUse=false">取消</span>
       <span @click="toUseConfirm">确认</span>
      </div>
    </van-popup> -->
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from "vuex";
  import Config from "@/api/config";
  import circleProgress  from './circleProgress';
  import countdown from "@/components/Vendor/countdown/countdown";
  export default {
    name: '',
    components: {
      countdown,
      circleProgress
    },
    props: {
      groupCoupon: {
        type: Object,
        default() {
          return null
        }
      },
      // invalid: Boolean, // 是否失效
      isLeader: { // true 是团长，false是团员
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        isToUse: false,
        countDownTimeout: false
      }
    },
    mounted() {
    },
    computed: {
      ...mapGetters(["userInfo"]),
      couponDetail() {
        this.countDownTimeout = false
        let coupon = {}
        if (this.groupCoupon.leaderUserAward || this.groupCoupon.userAward) {
          if (this.isLeader) {
            coupon = this.groupCoupon.leaderUserAward[0] || {}
          } else {
            coupon = this.groupCoupon.userAward[0] || {}
          }
        }
        return coupon
      },
      residueNum() {
        return this.groupCoupon.groupBuyNumOfPerson - this.groupCoupon.currentNumOfPerson
      },
      percent() {
        let percent = 0
        if (this.groupCoupon.leaderUserId == 0) {
          if (this.groupCoupon.groupBuyNumTotal) {
            percent = Math.round((((Number(this.groupCoupon.currentNumOfPerson) * 10000) / (Number(this.groupCoupon.groupBuyNumTotal) * 10000)) * 100))
          }
        } else {
          if (this.groupCoupon.groupBuyNumOfPerson) {
            percent = Math.round((((Number(this.groupCoupon.currentNumOfPerson) * 10000) / (Number(this.groupCoupon.groupBuyNumOfPerson) * 10000)) * 100))
          }
        }
        return percent
      },
      isGroupLeader() {
        return this.userId == this.groupCoupon.leaderUserId
      },
      hasJoin() {
        let flag = false
        if (this.groupCoupon && this.groupCoupon.orderItemList && this.groupCoupon.orderItemList instanceof Array) {
          let i = this.groupCoupon.orderItemList.findIndex(item => item.userId == this.userId)
          if (i > 0) {
            flag = true
          }
        }
        return flag
      },
      isEnd() {
        return this.groupCoupon.endDate < this.currentTime
      },
      disabled() {
        return this.percent >= 100
      },
      formatPic() {
        let result = ''
        if (this.couponDetail && this.couponDetail.coupon && this.couponDetail.coupon.couPic) {
          result = this.$util.formatImage(this.couponDetail.coupon.couPic)[0]
        }
        return result
      }
    },
    methods: {
      replacePhone(phone) {
        return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
      },
      groupHandler(status) {
        if (status == 0 || status == 9) { // 立即开团 - 重新开团
          this.$Loading.open();
          this.$http.post('/app/json/app_fight_group_order/start', {number: 1, groupBuyType: 0, mktGroupBuyId: this.groupCoupon.mktGroupBuyId}).then(res => {
            if (res.data.status == 0) {
              this.$Toast('开团成功！');
              this.$emit('success')
            } else {
              this.$Toast(res.data.info || '开团失败');
            }
            this.$Loading.close();
          })
        } else if (status === 10) { // 去使用
          if (item.couTypeCategoryAlias === 'SC') {
            let path = '/mall2/list/' + this.$util.getDataString()
            this.$router.push({
              path: path,
              query: {
                pageType: 'coupon',
                coupon: item.couTypeCode,
                couThresholdAmount: item.couThresholdAmount,
                couFaceValue: item.couFaceValue,
                lastPath: this.$route.path,
                endTime: this.$util.getDateFromString(item.validEndDate)
              }
            })
          } 
          // else if (item.couTypeCategoryAlias === 'DSFJK') {
          //   this.isToUse = true
          // } else if (this.couponQrCodeEnabled == 3) {
          //   this.$router.push({
          //     path: '/addCard',
          //     query: {couNo: item.couNo}
          //   })
          // } else {
          //   if (this.couponLayoutType == 2) {
          //     this.$router.push({
          //       path: '/coupon_detail2',
          //       query: {couTypeCode: item.couTypeCode, couFaceValue: item.couFaceValue}
          //     })
          //   } else {
          //     this.$router.push({
          //       path: '/coupon_detail',
          //       query: {couNo: item.couNo}
          //     })
          //   }
          // }
          // let path = '/mall2/list/' + this.$util.getDataString()
          // this.$router.push({
          //   path: path,
          //   query: {
          //     pageType: 'coupon',
          //     coupon: this.groupCoupon.couTypeCode,
          //     couThresholdAmount: this.groupCoupon.couThresholdAmount,
          //     couFaceValue: this.groupCoupon.couFaceValue,
          //     lastPath: this.$route.path,
          //     endTime: this.$util.getDateFromString(this.groupCoupon.validEndDate)
          //   }
          // })
        }
      },
      toLink(groupCoupon) {
        this.$router.push({
          path: `/group_ticket/group_detail/${this.$util.getDataString()}`,
          query: {
            orderId: groupCoupon.id,
            mktGroupBuyId: groupCoupon.mktGroupBuyId
          }
        })
      },
      invitation(){
      // 分享微信
      let shareData = {};
      shareData.title = this.groupCoupon.groupBuyName
      shareData.sharetext = this.groupCoupon.groupBuyDesc
      shareData.imageurl = 'http://tbdwechat.deepermobile.com/download?uploadFile.id=445914'
      shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + `/group_ticket/group_detail/${this.$util.getDataString()}?orderId=${this.groupCoupon.id}&mktGroupBuyId=${this.groupCoupon.mktGroupBuyId}`;
      this.$bridgefunc.wechatShare(shareData);
    },
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  // .box{
  //   width 100%
  //   position relative
  //   .boxShadow{
  //     position absolute
  //     top 0
  //     left 0
  //     z-index 100
  //     width 100%
  //     height 104px
  //     background-color: rgba(0,0,0,0.75);
  //   }
  // }
  .coupon-container {
    height 100%
    display flex
    align-items stretch
    background-color #fff
    box-shadow 0 1px 8px #efefef;
    border-radius 8px;
    margin-bottom 10px
    &.invalid {
      opacity 0.5
    }

    .coupon-left {
      flex 1
      background-size 100% 100%
      padding 15px;
      display flex

      .coupon-type {
        width 75px;
        height 75px;
        background-size 100% 100%
        display flex
        align-items center
        justify-content center
        font-size: 16px;
        font-weight: 600;
        color: $color-theme

        .img {
          width 100%;
          height 100%
        }
      }

      .coupon-content {
        flex 1
        padding-left: 6px;
        display flex
        flex-direction column
        justify-content space-between

        .coupon-info {
          display flex
          align-items flex-start

          .coupon-rule {
            flex 1
            padding-left: 6px;
            position: relative

            .title {
              font-size: 14px;
              font-weight: 600
              text-indent 3.5em;
              line-height 20px
            }

            .group-num {
              position: absolute
              left: 0;
              top: 0;
              font-size: 10px;
              border: 0.5px solid #F80F16
              color: #F80F16
              padding 2px 6px;
              border-radius 5px;
              float: left
              margin-right 4px
            }

            .sub-title {
              font-size: 12px;
              font-weight normal
            }
          }
        }

        .coupon-info-sub {
          display flex
          justify-content space-between
          align-items flex-end

          .price-wrapper {
            display flex
            align-items flex-end
            justify-content flex-start

            .price {
              color: #F80F16
              display flex
              align-items flex-end

              .prefix-unit {
                font-size: 10px;
              }

              .num {
                font-size: 28px;
                line-height: 26px;
                font-weight: 600;
              }

              .threshold{
                font-size: 10px;
                border: 0.5px solid #F80F16
                color: #363430
                background: #fdeae9
                padding 6px 9px;
                border-radius 5px;
              }
            }
          }

          .count {
            font-size: 10px;
            color: $color-theme
          }
        }
      }
    }
    .coupon-line{
      width 1px
      height 80px
      margin auto
      border 0.5px dashed #e2dcdc
    }
    .coupon-right {
      width 98px;
      flex-shrink 0
      background-size 100% 100%
      display flex
      align-items center
      justify-content center
      flex-direction column
      padding 0 10px;
      position: relative

      &:after {
        content ''
        position: absolute
        height 60%
        border-left: 0.5px dotted #ddd
        left: 0;
        top: 50%;
        transform translateY(-50%)
      }

      .text {
        color: $color-gray;
        text-align: center
      }

      .btn {
        width 93%;
        display block
        border-radius 12px;
        background: #f80f16
        padding 4px 2px;
        color: #fff;
        text-align: center
        flex-shrink 0
        font-size: 14px;

        &[disabled]:not([type]) {
          color: #fff;
          background-color: #999;
        }
      }

      .process-wrapper {
        width 76px;
        height 100%
        display flex
        flex-direction column
        justify-content center
        align-items center
        > * {
          margin: 4px;
        }
        .Progress{
          width 50px
          height 50px
          >>> .center_text{
            font-size 12px
            color #f17a7d
          }
        }
      }

      .time-info {
        font-size: 10px;
        color: $color-theme;
        text-align: center
        > * {
          margin: 4px;
        }

        .time {
          font-size: 14px;
        }

        &.ungroup {
          color: $color-gray
        }
      }
    }
  }
  /deep/ .popupCard {
    height: 26%;
    flex-direction: column;
    line-height: 26px;

    .popupCardText {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .popupCardBtn {
      color: #000;
      height: 50px;
      display: flex;
      justify-content: center;

      >* {
        width: 115px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #ebc695;
      }

      >:first-child {
        border-radius: 30px 0 0 30px;
      }

      >:last-child {
        background-color: #ebc695;
        border-radius: 0 30px 30px 0;
      }
    }
  }

</style>

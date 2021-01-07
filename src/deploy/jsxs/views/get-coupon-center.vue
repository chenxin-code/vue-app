<template>
  <div>
    <nav-top title="领券中心" @backEvent="backEvent"></nav-top>
    <nav-content class="coupon-center" v-if="pageInit">
      <ul class="menu-list">
        <horizontal-scroll :dataList='defaultCouActivity'>
          <!--选中active-->
          <li
            @click="setMenuItem(index)"
            class="menu-item"
            :class="{active: index === couponTypeIndex}"
            v-for="(item, index) in defaultCouActivity"
            v-if="item.activityModelList.length > 0"
            :key="index">
            <span class="text">{{ item.activityTag }}</span>
          </li>
        </horizontal-scroll>
      </ul>
      <div class="coupon-list" v-if="couActivity.length">
        <template v-for="(item, index1) in couActivity">
          <template v-if="item.special">
            <exchange-coupon
              class="coupon-item"
              v-for="(item2, index2) in item.awardList"
              :key="item2.id"
              :couponInfo="item2.couTypeModel">
              <!--状态10为待领取-->
              <div class="operate">
                <div v-if="item2.state == 10" class="btn theme_bg_red" @click="collectingVoucher(item, item2)">立即领取</div>
                <template v-else-if="item2.state == 20 || item2.state == 30">
                    <img class="received" src="@/assets/state/received.png" alt="">
                    <div class="btn theme_bg_red" @click="couponProducts(item2.couTypeModel)">去使用</div>
                  </template>
              </div>
            </exchange-coupon>
          </template>
          <template v-else>
            <exchange-coupon
              class="coupon-item"
              v-for="(item2, index2) in item.couList"
              :key="item2.id"
              :couponInfo="item2">
              <div
                class="operate"
                v-if="isStart(item)">
                <p class="title theme_font_red">距开抢还剩</p>
                <countdown class="count-down"
                           :endTime="((new Date(item.mktStartTime.replace(/-/g, '/')).getTime())/1000)"></countdown>
              </div>
              <template v-else-if="isEnd(item)">
                <div class="operate btn-disabled">
                  <circle-progress size="44px" v-if="calCent(item2.distRewardCnt, item2.limitRewardCnt) >= 100 || item2.state != -1" :value="calCent(item2.distRewardCnt, item2.limitRewardCnt)">
                    <p class="text theme_font_red">已抢</p>
                    <p class="text theme_font_red">{{ calCent(item2.distRewardCnt, item2.limitRewardCnt) }}%</p>
                  </circle-progress>
                  <div class="btn theme_bg_red">活动已结束</div>
                </div>
              </template>
              <template v-else>
                <!--状态-1为已领取-->
                <div class="operate"
                     :class="{ 'btn-disabled' : (calCent(item2.distRewardCnt, item2.limitRewardCnt) >= 100) }"
                >
                  <circle-progress size="44px" v-if="calCent(item2.distRewardCnt, item2.limitRewardCnt) >= 100 || item2.state != -1" :value="calCent(item2.distRewardCnt, item2.limitRewardCnt)">
                    <p class="text theme_font_red">已抢</p>
                    <p class="text theme_font_red">{{ calCent(item2.distRewardCnt, item2.limitRewardCnt) }}%</p>
                  </circle-progress>
                  <div  v-if="calCent(item2.distRewardCnt, item2.limitRewardCnt) >= 100" class="btn theme_bg_red">已抢光</div>
                  <template v-else>
                    <template v-if="item2.state == -1">
                      <img class="received" src="@/assets/state/received.png" alt="">
                      <div class="btn theme_bg_red" @click="couponProducts">去使用</div>
                    </template>
                    <div v-else class="btn theme_bg_red" @click="collectingVoucher(item, item2)">立即领取</div>
                  </template>
                </div>
              </template>
            </exchange-coupon>
          </template>
        </template>
      </div>
      <div class="no-coupon-wrapper" v-else>
        <img class="img" src="../../../../static/image/coupon/none-icon.png" alt="">
        <p class="title theme_font_tint">暂时没有可领的券</p>
        <p class="title">
          <router-link class="theme_standard_font" to="/coupon_market">兑换电子券</router-link>
        </p>
      </div>
      <div class="my-coupon-link">
        <div class="link theme_standard_bg" @click="toCouponList">我的优惠券</div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import HorizontalScroll from '@/components/base/horizontal-scroll/horizontal-scroll'
  import ExchangeCoupon from '@/components/mall2/coupon/base/exchange-coupon.vue'
  import Countdown from "@/components/mall2/common/countdown/countdown";
  import CircleProgress from '@/components/mall2/coupon//base/circle.vue'

  export default {
    name: '',
    data() {
      return {
        couponTime: parseInt((new Date().getTime() + 500000) / 1000),
        defaultCouActivity: [],
        couponTypeIndex: 0, // 高亮index
        couActivity: [], // 当前选择的券数组
        allCouActivity: [], // 全部券数组
        specialCoupon: [], // 专享券
        pageInit: false
      }
    },
    mounted() {
      this.getCanReceiveAwardList()
    },
    methods: {
      // 专享券 (接口查询的是所有用户权益，awardType 10 是券)
      getCanReceiveAwardList() {
        this.$Loading.open();
        let paramsData = {
          token: this.$store.state.login.token,
          awardType: 10
        }
        this.$http.post(`/app/json/app_market/getCanReceiveAwardListGroupByActivity`, paramsData).then(res => {
          let data = res.data
          let list = data.data || []
          if (data.status == 0) {
            this.specialCoupon = list
          }
          this.getCouActivityAward()
          this.$Loading.close()
        })
      },
      setMenuItem(index) {
        this.couponTypeIndex = index
        this.couActivity = this.defaultCouActivity[this.couponTypeIndex].activityModelList
      },
      getCouActivityAward() {
        let paramsData = {
          token: this.$store.state.login.token
        }
        this.$http.post('/app/json/app_market/queryGetCouActivityAward', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            if (data.data) { // 有数据
              // 设置专享券置顶
              this.defaultCouActivity = data.data.sort((a) => {
                if (a.activityTag == '专享券') {
                  return -1
                }
              })
              // 添加全部
              this.defaultCouActivity.unshift({
                activityModelList: [],
                activityTag: '全部'
              })
              // 获取所有券
              this.defaultCouActivity.forEach(value => {
                value.activityModelList.forEach(value2 => {
                  this.defaultCouActivity[0].activityModelList.push(value2)
                })
              })
              // 会员权益，专享券
              if (this.specialCoupon.length) {
                // 添加专享券
                let activityModelList = this.specialCoupon.map(item => {
                  item.special = true
                  return item
                })
                this.defaultCouActivity[0].activityModelList.unshift(...activityModelList) // 全部的列表数组前插入专享券列表
                this.defaultCouActivity.unshift({ // 整个二维数组前插入专享券
                  activityModelList: activityModelList,
                  activityTag: '专享券'
                })
              }
              if (this.defaultCouActivity.length && this.defaultCouActivity[this.couponTypeIndex]) {
                this.couActivity = this.defaultCouActivity[this.couponTypeIndex].activityModelList
              }
            }
            this.$Loading.close()
          }
          this.pageInit = true
        })
      },
      backEvent() {
        this.$router.go(-1)
      },
      // 领取券
      collectingVoucher(item, item2) {
        if (item.special) { // 专享券
          // 立即领取
          this.$request.post('/app/json/app_market/receiveAward', {
            awardRecId: item2.awardRecId
          }).then(res => {
            if (res.status === 0) {
              this.$Toast('领取成功')
              item2.state = 20
              this.getCanReceiveAwardList()
            } else {
              this.$Toast(res.info ? res.info : '领取失败')
            }
          })
        }else if (item2.state == -1) {
          this.$Toast('今日可领取次数已用尽')
          return false
        } else {
          this.$Loading.open()
          let paramsData = {
            token: this.$store.state.login.token,
            mktActivityId: item.mktActivityId,
            ruleId: item.ruleId
          }
          this.$http.post('/app/json/app_market/getCouScanUrl', paramsData).then(res => {
            let data = res.data
            if (data.status == 0 && data.data) {
              if (data.data.mktAwardModelList && data.data.mktAwardModelList.length > 0) {
                this.$Toast('领取成功')
              } else {
                this.$Toast(data.info || '领取失败')
              }
              // 后台要求做此延迟
              setTimeout(() => {
                this.getCouActivityAward()
              }, 800)
            } else {
              this.$Toast(data.info || '领取失败')
            }
            // this.$Loading.close()
          })
        }
      },
      // 判断券是否已经开枪
      isStart(item) {
        let startTime = (new Date(item.mktStartTime.replace(/-/g, '/')).getTime()) / 1000
        let nowTime = this.$store.state.severTime.currentTime
        return (startTime - nowTime) > 0
      },
      isEnd(item) {
        let endTime = (new Date(item.mktEndTime.replace(/-/g, '/')).getTime()) / 1000
        let nowTime = this.$store.state.severTime.currentTime
        return (endTime - nowTime) < 0
      },
      // 计算券领取百分比
      calCent(distRewardCnt, limitRewardCnt) {
        if (distRewardCnt && limitRewardCnt) {
          let result = Math.floor(parseInt((distRewardCnt / limitRewardCnt) * 10000)) / 100
          if (result >= 100) {
            return 100
          } else {
            return result
          }
        } else {
          return 0
        }
      },
      couponProducts(coupon) {
        this.toCouponList()
//         if (coupon.couTypeCategoryAlias === 'SC') {
//           let path = '/mall2/list/' + this.$util.getDataString()
//           this.$router.push({
//             path: path,
//             query: {
//               pageType: 'coupon',
//               coupon: coupon.couTypeCode,
//               couThresholdAmount: coupon.couThresholdAmount,
//               couFaceValue: coupon.couFaceValue,
// //          skuId: this.detailData.skuId,
//               lastPath: this.$route.path,
// //          storeOuCode: this.detailData.storeOuCode,
//               endTime: this.$util.getDateFromString(coupon.validEndDate)
//             }
//           })
//         } else {
//           this.toCouponList()
//         }
      },
      toCouponList() {
        //配置跳转地址
        window.location.href = this.$store.state.globalConfig.coupon_window_location_href+'?token=' + this.$store.state.login.token
      }
    },
    components: {HorizontalScroll, ExchangeCoupon, Countdown, CircleProgress}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .btn-disabled {
    opacity .4
  }

  .coupon-center {
    display flex
    flex-direction column

    .menu-list {
      overflow hidden
      padding: 0 15px;
      flex-shrink: 0;

      .menu-item {
        float: left

        .text {
          padding: 11px 0;
          display inline-block
          font-size: 15px;
        }

        & + .menu-item {
          padding-left: 15px;
        }

        &.active {
          .text {
            color: #F80F16
            position: relative

            &:after {
              content ''
              position: absolute
              bottom: 0
              left: 0;
              width 100%
              border-bottom 2px solid #F80F16
            }
          }
        }
      }
    }

    .coupon-list {
      padding 8px;
      padding-bottom: 70px;
      overflow-x hidden
      overflow-y auto
      -webkit-overflow-scrolling touch
      flex 1

      .coupon-item {
        & + .coupon-item {
          margin-top: 8px;
        }

        .operate {
          text-align: center
          display flex
          flex-direction column
          align-items center
          justify-content center
          height 100%

          .title {
            font-size: 12px;
          }

          .count-down {
            margin-top: 6px;
          }

          .num {
            font-size: 10px;
            padding-top 6px;
          }

          .btn {
            margin-top: 8px;
            padding 6px 0
            text-align: center
            width 75%
            color: #fff;
            border-radius 20px;
            display inline-block
          }

          .text {
            font-size: 10px;

            & + .text {
              padding-top: 5px;
            }
          }
          .received{
            width 60px;
          }
        }
      }
    }

    .my-coupon-link {
      bottom: 15px;
      position: fixed
      width 100%
      padding 0 20%
      z-index 11
      .link {
        display block
        // background: $color-theme-r
        color: #fff;
        border-radius 40px;
        text-align: center
        height 40px;
        line-height: 40px;
        font-size: 16px;
      }
    }

    .no-coupon-wrapper {
      position: absolute
      top: 10%;
      left: 50%;
      transform translate3d(-50%, 0, 0)
      text-align: center

      .img {
        width 140px;
      }

      .title {
        padding-top 24px;
        font-size: 16px;
        color: #5a5a5a
      }
    }
  }
</style>

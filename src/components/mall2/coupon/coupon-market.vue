<template>
  <div>
    <nav-top title="兑换电子券" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="coupon-center">
      <div class="coupon-list" v-if="pageInit && defaultCoupon.length">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="moreLoading"
          :infinite-scroll-immediate-check="true"
          infinite-scroll-distance="20"
          ref="infiniteContainer">
          <exchange-coupon
            v-for="(item, index) in defaultCoupon"
            :key="index"
            :disabled="item.soldNum == 100"
            class="coupon-item"
            :couponInfo="item"
            :entryType="1">
            <!-- 暂时抢光 -->
            <div
              class="operate out"
              v-if="item.soldNum == 100">
              <p class="title">消耗{{excTypeName(item)}}</p>
              <div>
                <span class="point-wrapper">
                  <img class="img" :src="excTypeIcon(item)" alt="">
                  <span class="point-num">{{ excTypeVal(item) }}</span>
                </span>
              </div>
              <div class="btn">已抢光</div>
            </div>
            <!-- 可抢状态 -->
            <div v-else style="height: 100%;">
              <!-- 消耗积分领券 -->
              <div
                class="operate"
                v-if="!item.isExchangeSuccess">
                <p class="title">消耗{{excTypeName(item)}}</p>
                <div>
                  <span class="point-wrapper">
                    <img class="img" :src="excTypeIcon(item)" alt="">
                    <span class="point-num">{{ excTypeVal(item) || 0}}</span>
                  </span>
                </div>
                <div
                  class="btn"
                  @click="redeemNow(item, index)">立即兑换
                </div>
              </div>
              <!-- 抢券成功 -->
              <div
                class="operate"
                v-else>
                <img class="exchange-success" src="../../../../static/image/coupon/convert.png" alt="">
                <div class="btn theme_bg_red" @click="useCoupon">去使用</div>
              </div>
            </div>
          </exchange-coupon>
          <div class="no-data theme_font_tint" v-show="!hasMore">没有更多数据了~</div>
        </div>
      </div>
      <div class="no-coupon-wrapper" v-else>
        <img class="img" src="../../../../static/image/coupon/none-icon.png" alt="">
        <p class="title theme_font_tint">没有可兑换的券</p>
      </div>
    </nav-content>
    <!-- 立即兑换模态框 -->
    <mt-popup
      class="exchange-modal"
      v-model="popupVisible"
      position="bottom">
      <p class="close-btn" @click="popupVisible = false"><van-icon name="cross" /></p>
<!--      <div class="tip-container">-->
<!--        <p><span class="face-price">{{ calAmount(popupInfo.couFaceValue) }}</span>满<span class="total-price">{{ popupInfo.couThresholdAmount }}</span>可用-->
<!--        </p>-->
<!--        &lt;!&ndash; <p class="margin-top-10">TODO</p> &ndash;&gt;-->
<!--      </div>-->
      <!--      <div class="commodity-c">-->
      <!--        <ul class="comm-list">-->
      <!--          <li-->
      <!--            v-for="(item, index) in commodityList"-->
      <!--            :key="index"><img :src="item.phMainUrl" alt=""></li>-->
      <!--        </ul>-->
      <!--        <p class="more-btn" @click="useCoupon">查看全部适用商品&gt;</p>-->
      <!--      </div>-->
      <div class="dis-flex">
        <p class="exchange-btn" @click="confirmExchange">花<span>{{ excTypeVal(popupInfo) || 0}}</span>{{excTypeName(popupInfo)}}兑换
        </p>
      </div>
      <!--      员工并且券支持 油豆兑换 既可使用油豆-->
      <p class="surplus-txt">你的帐号还有<span>{{total}}</span>{{excTypeName(popupInfo)}}</p>
    </mt-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  import ExchangeCoupon from './base/exchange-coupon.vue'
  import CircleProgress from './base/circle.vue'

  export default {
    name: '',
    data() {
      return {
        popupVisible: false,
        moreLoading: false,
        totalPoints: 0, // 总积分
        totalAccount: 0, // 总福豆
        totalReward: 0, // 总红包奖励金
        popupInfo: {}, // 券信息
        defaultCoupon: [], // 券列表
        popupIndex: -1, // 兑换的券索引
        page: 0,
        commodityList: [], // 适用商品列表(模态框中使用)
        hasMore: true,
        pageInit: false,
        empFlag: false
      }
    },
    computed: {
      total() {
        if (this.popupInfo && this.popupInfo.perDiscountEmpRewardsPrice && this.empFlag) {
          return this.totalAccount
        } else if (this.popupInfo && this.popupInfo.perDiscountRewardsPrice) {
          return this.totalReward
        } else {
          return this.totalPoints
        }
      }
    },
    mounted() {
      this.empFlag = this.$store.state.mall2.myAssets.empFlag == 1 // 是否是员工
      this.checkScore(3) // 积分
      this.checkScore(8) // 红包
      if (this.empFlag) {
        this.checkScore(9) // 福豆
      }
      this.loadMore()
    },
    methods: {
      // 查询用户积分
      checkScore(type) {
        let paramsData = {
          token: this.$store.state.login.token,
          acctType: type,
          orderType: 200001
        }
        this.$http.post('/app/json/acct/getAccountBaseInfo', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            if (type === 3) {
              this.totalPoints = data.data.balanceUnit
            } else if (type === 8) {
              this.totalReward = data.data.balanceUnit
            } else if (type === 9) {
              this.totalAccount = data.data.balanceUnit
            }
          }
        })
      },
      getExchangeList() {
        this.$Loading.open()
        this.page++
        let paramsData = {
          token: this.$store.state.login.token,
          page: this.page,
          rows: 12,
          queryType: "ExCoupon"
        }
        this.$http.post('/app/json/product/getAppProExchangeList', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.defaultCoupon = this.defaultCoupon.concat(data.data.list || [])
            if (this.page < data.data.page.totalPages) {
              this.moreLoading = false
            } else {
              this.hasMore = false
            }
          }
          this.$Loading.close()
          this.pageInit = true
        })
      },
      // 加载更多
      loadMore() {
        this.moreLoading = true
        this.getExchangeList()
      },
      // 立即兑换
      redeemNow(item, index) {
        if (item.distCntCurUser >= item.discountGoodsCntPerUser) {
          this.$Toast(`每人限购${item.discountGoodsCntPerUser}个，您已到达上限，去看看其它商品吧！`)
        } else if (item.remainNum == 0) {
          this.$Toast('已售完')
        } else if (item.selfSoldNum == 100) {
          this.$Toast('今日可领取次数已用尽')
        } else {
          this.$Loading.open()
          let paramsData = {
            token: this.$store.state.login.token,
            page: 1,
            rows: 3,
            couTypeCode: item.couTypeCode
          }
          paramsData.deliverType = this.$store.state.mall2.staticDeliverType
          if (this.$store.state.mall2.staticDeliverType == 1) {
            paramsData.pickUpId = this.$store.state.mall2.zitiAddress.id;
          }
          this.$http.post('/app/json/product/getAppProSearchList', paramsData).then(res => {
            let data = res.data
            if (data.status == 0) {
              this.commodityList = data.data.list
              this.popupIndex = index
              this.popupInfo = item
              this.popupVisible = true
            } else {
              this.$Toast(data.info)
            }
            this.$Loading.close()
          })
        }
      },
      // 确认兑换
      confirmExchange() {
        // if (this.popupInfo.perDiscountEmpRewardsPrice  && this.empFlag) {
        //   if (this.totalAccount < this.popupInfo.perDiscountEmpRewardsPrice) {
        //     this.popupVisible = false
        //     this.$Toast(this.$store.state.globalConfig.Employees_wallet + '不足，无法兑换')
        //     return false
        //   }
        // } else if (this.totalPoints < this.popupInfo.points) {
        //   this.popupVisible = false
        //   this.$Toast('积分不足，无法兑换')
        //   return false
        // }
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          deliveryType: 2,

          virtualUserPhone: this.$store.state.login.phone
        }
        if (this.popupInfo.perDiscountEmpRewardsPrice) {
          paramsData.carts = [{
            number: 1,
            skuId: this.popupInfo.skuId,
            storeOuCode: this.popupInfo.storeOuCode,
            empRewardsPrice: this.popupInfo.perDiscountEmpRewardsPrice,
            price: 0,
            selfActivityId: this.popupInfo.activityId
          }]
          paramsData.payDigital = [{payDigital: this.popupInfo.perDiscountEmpRewardsPrice, acctType: 'EmpRewards'}]
        } else if (this.popupInfo.perDiscountRewardsPrice) {
          paramsData.carts = [{
            number: 1,
            skuId: this.popupInfo.skuId,
            storeOuCode: this.popupInfo.storeOuCode,
            empRewardsPrice: this.popupInfo.perDiscountRewardsPrice,
            price: 0,
            selfActivityId: this.popupInfo.activityId
          }]
          paramsData.payDigital = [{payDigital: this.popupInfo.perDiscountRewardsPrice, acctType: 'Rewards'}]
        } else {
          paramsData.carts = [{
            number: 1,
            skuId: this.popupInfo.skuId,
            storeOuCode: this.popupInfo.storeOuCode,
            pointsPrice: this.popupInfo.points,
            price: 0,
            selfActivityId: this.popupInfo.activityId
          }]
          paramsData.payDigital = [{payDigital: this.popupInfo.points, acctType: 'Points'}]
        }
        this.$http.post('/app/json/app_shopping_order/submit', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.defaultCoupon.forEach((value, index) => {
              if (this.popupIndex == index) {
                value.isExchangeSuccess = true
              }
            })
            this.checkScore() // 查询用户积分
            this.popupVisible = false
            this.$Toast('兑换成功')
          } else {
            this.popupVisible = false
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
      // 使用券
      useCoupon() {
        this.$util.linkToCouponList()
        // this.couponProducts(this.popupInfo)
      },
      // 去使用
      couponProducts: function (coupon) {
        let path = '/mall2/list/' + this.$util.getDataString()
        // console.log(coupon.skuId)
        // console.log(coupon.storeOuCode)
        this.$router.push({
          path: path,
          query: {
            pageType: 'coupon',
            coupon: coupon.couTypeCode,
            couThresholdAmount: coupon.couThresholdAmount,
            couFaceValue: coupon.couFaceValue,
            skuId: coupon.skuId,
            lastPath: this.$route.path,
            storeOuCode: coupon.storeOuCode,
            endTime: this.$util.getDateFromString(coupon.validEndDate)
          }
        })
      },
      // 计算券金额
      calAmount(amount) {
        if (amount) {
          amount = parseInt(amount)
          return amount
        } else {
          return 0
        }
      },
      excTypeVal(item) {
        if (!item || Object.keys(item).length === 0) {
          return
        }
        if (item.activityTags.indexOf('YouDouExCoupon') >= 0) {
          return item.perDiscountEmpRewardsPrice
        } else if (item.activityTags.indexOf('RewardExCoupon') >= 0) {
          return item.perDiscountRewardsPrice
        }
        return item.points
      },
      excTypeName(item) {
        if (!item || Object.keys(item).length === 0) {
          return
        }
        let name = ''
        if (item.activityTags.indexOf('YouDouExCoupon') >= 0) {
          name = this.$store.state.globalConfig.Employees_wallet || '福豆' // 福豆是员工奖励金
        } else if (item.activityTags.indexOf('RewardExCoupon') >= 0) {
          name = this.$store.state.globalConfig.Employees_wallet || '福豆'
        } else {
          name = '积分'
        }
        return name
      },
      excTypeIcon(item) {
        let path = ''
        if (item.perDiscountEmpRewardsPrice && this.empFlag) {
          if (item.soldNum == 100) {
            path = require('../../../../static/image/coupon/emp-reward-dis.png')
          } else {
            path = require('../../../../static/image/coupon/emp-reward.png')
          }
        } else if (item.points) {
          if (item.soldNum == 100) {
            path = require('../../../../static/image/coupon/point-de.png') // 抢光状态
          } else {
            path = require('../../../../static/image/coupon/point-icon.png')
          }
        }
        return path
      }
    },
    components: {ExchangeCoupon, CircleProgress}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .margin-top-10 {
    margin-top 8px
  }

  .coupon-center {
    display flex
    flex-direction column

    .coupon-list {
      padding 8px;
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
            color: #F80F16
          }

          .count-down {
            margin-top: 6px;
          }

          .point-wrapper {
            display inline-block
            font-size: 12px;
            margin-top 10px;
            margin-bottom: 4px;
            position relative

            .img {
              vertical-align: middle
              width 16px;
            }

            .point-num {
              vertical-align: middle
              padding-left: 4px;
              font-size: 16px;
              color: #F80F16
            }

            &:before, &:after {
              content ''
              position: absolute
              top: 50%;
              transform translateY(-50%)
              width 14px;
              border-bottom 1px solid #F80F16
            }

            &:before {
              right 110%
            }

            &:after {
              left: 110%;
            }
          }

          .btn {
            margin-top: 6px;
            padding 6px 0
            text-align: center
            width 75%
            color: #fff;
            border-radius 20px;
            display inline-block
            background: #F80F16
          }

          .text {
            font-size: 10px;

            & + .text {
              padding-top: 5px;
            }
          }

          .exchange-success {
            width 50px;
          }

          &.out {
            .title {
              color: #999999
            }

            .point-wrapper {
              &:before, &:after {
                border-color: #999999
              }

              .point-num {
                color: #999999
              }
            }

            .btn {
              background: #999999
            }
          }
        }
      }
    }

    .no-coupon-wrapper {
      position: absolute
      top: 10%;
      left: 50%;
      transform translate3d(-50%, 0, 0)
      text-align: center

      .img {
        width 90px;
      }

      .title {
        padding-top 24px;
        font-size: 16px;
        color: #5a5a5a
      }
    }
  }

  .no-data {
    padding: 15px;
    text-align: center;
  }

  // 模态框样式
  .exchange-modal {
    width 100%
    padding 15px 11px
    background-color #fff
    border-radius 6px 6px 0 0

    .close-btn {
      width 15px
      height 15px
      float right
      font-size 15px
      color #aaa
    }

    .tip-container {
      background-color #F12C2C
      margin-top 20px
      color #fff
      font-size 12px
      border-radius 6px 6px 0 0
      box-shadow 0 0 4px #ddd
      padding 10px 6px

      .face-price {
        font-size 20px
        padding-right 5px
      }

      .total-price {
        padding 0 5px
      }
    }

    .commodity-c {
      border-radius 0 0 6px 6px
      box-shadow 0 0 4px #ddd
      overflow hidden

      .comm-list {
        display flex
        justify-content space-around
        padding 10px 0

        li {
          width 80px
          height 80px

          img {
            display block
            width 100%
            height 100%
          }
        }
      }

      .more-btn {
        text-align center
        color #A7A7A7
        margin-bottom 10px
      }
    }

    .dis-flex {
      display flex
      justify-content center

      .exchange-btn {
        display inline-block
        color #fff
        padding 8px 15px
        background-color #f12c2c
        border-radius 5px
        margin-top 15px
        font-size 13px

        span {
          padding 0 3px
        }
      }
    }

    .surplus-txt {
      color #aaa
      text-align center
      margin-top 10px

      span {
        padding 0 3px
      }
    }
  }
</style>

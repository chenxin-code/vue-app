/**Created by liaoyingchao on 2019-09-27.*/

<template>
  <div class="coupon-jfhq" :style="getBgDivStyle()">
    <div class="tip" v-if="totalAccount != '' && moduleData.showTips">您的账户还有<span class="theme_font_red">{{totalAccount}}</span>{{accTypeName()}}</div>
    <div v-if="moduleData.styleTempl == 2">
      <div class="coupon-content style-h" v-if="(moduleData.rows.length > 0) || usePorpData != true" :style="getSidesStyle()">
        <HScroll :dataList="moduleData.rows" :click="false">
          <div class="item" v-for="(item, index) in moduleData.rows" :key="index">
            <div class="item-content">
              <div class="coupon">
                <img class="bg-img" src="static/images/hk/coupon-bg-2.png">
                <div class="couFaceValue">{{item.skuPropValues || 0+'元'}}</div>
                <div class="name single-line">{{item.shortName}}</div>
              </div>
              <div class="price single-line"><PriceOrder :listitem="item" :isRMBEnd="true"></PriceOrder></div>
              <div class="btn" @click="exchangeEvent(item)">立即兑换</div>
            </div>
          </div>
        </HScroll>
      </div>
    </div>
    <div v-else-if="moduleData.styleTempl == 3">
      <div class="coupon-content style-3" v-if="(moduleData.rows.length > 0) || usePorpData != true" :style="getSidesStyle()">
        <div class="item" v-for="(item, idx) in moduleData.rows" :key="idx">
          <img class="bg-img" src="static/images/hk/coupon-bg.png">
          <div class="coup-cont">
            <div class="couFaceValue">¥<span>{{item.couFaceValue}}</span></div>
            <div class="center-info line_left">
              <div class="title">{{item.couTypeTitle}}</div>
              <div class="term">有效期：兑换成功后90天内有效</div>
            </div>
            <div class="right-div">
              <div>兑换价</div>
              <div class="price single-line">{{ excTypeVal(item) || 0}}{{excTypeName(item)}}</div>
              <div class="btn" @click="exchangeEvent(item)">立即兑换</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="coupon-content" v-if="(moduleData.rows.length > 0) || usePorpData != true" :style="getSidesStyle()">
        <div class="coupon-item" v-for="(item, idx) in moduleData.rows" :key="idx">
          <ExchangeCoupon :couponInfo="item" :entryType="1">
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
                  @click="redeemNow(item, idx)">立即兑换
                </div>
              </div>
              <!-- 抢券成功 -->
              <div
                class="operate"
                v-else>
                <img class="exchange-success" src="static/image/coupon/convert.png" alt="">
                <div class="btn theme_bg_red" @click="useCoupon">去使用</div>
                <div class="btn theme_bg_red" @click="exchangeContinue(idx)">继续兑换</div>
              </div>
            </div>
          </ExchangeCoupon>
          <!--<div class="icon-img">-->
          <!--<img :src="item.couPic">-->
          <!--</div>-->
          <!--<div class="btn">{{item.points}}兑换</div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Bus from '../bus';
  import HScroll from '@/components/base/horizontal-scroll/horizontal-scroll'
  import ExchangeCoupon from '@/components/mall2/coupon/base/exchange-coupon'
  import PriceOrder from  '@/components/commonui/price/price-order'
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "coupon-jfhq",
    props: ['myIndex', 'usePorpData', 'propData'],
    computed: {
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function () {
        return this.pageData.moduleList[this.myIndex].data;
      },
    },
    components: {
      PriceOrder,
      HScroll,
      ExchangeCoupon
    },
    mixins: [hee],
    data() {
      return {
        totalAccount: '',
        accountType: ''
      }
    },
    methods: {
      exchangeEvent: function (item) {
        this.$market.exchangeCoupon(item)
      },
      accTypeName: function () {
        let name = '积分'
        if (this.accountType === 9) {
          name = this.$store.state.globalConfig.Employees_wallet || '福豆'
        }
        return name
      },
      // 查询用户积分
      checkScore() {
        if (this.$store.state.login.token == '' && this.$store.state.webtype != -1) {
          return ;
        }
        let paramsData = {
          token: this.$store.state.login.token,
          acctType: this.accountType,
          groupValue: '1'
        }
        this.$http.post('/app/json/acct/getAccountBaseInfo', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            if (this.accountType === 3) {
              this.totalAccount = data.data.balanceUnit
            } else if (this.accountType === 9) {
              this.totalAccount = data.data.balanceUnit
            }
            if (this.moduleData.showTips) {
              let msg = '兑换成功，您的账户剩余' + this.totalAccount + this.accTypeName()
              this.$Toast(msg)
            }
          }
        })
      },
      // 继续兑换
      exchangeContinue: function (index) {
        let arr = []
        for (let i = 0; i < this.moduleData.rows.length; i++) {
          if (index == i) {
            this.moduleData.rows[i].isExchangeSuccess = false
          }
          arr.push(this.moduleData.rows[i])
        }
        this.moduleData.rows = arr;
      },
      // 使用券
      useCoupon() {
        this.$util.linkToCouponList()
        // this.couponProducts(this.popupInfo)
      },
      // 确认兑换
      confirmExchange(item, popupIndex) {
        if (this.$store.state.webtype == -1) {
          return ;
        }
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          deliveryType: 2,
          virtualUserPhone: this.$store.state.login.phone
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
        } else if (item.perDiscountRewardsPrice) {
          paramsData.carts = [{
            number: 1,
            skuId: item.skuId,
            storeOuCode: item.storeOuCode,
            rewardsPrice: item.perDiscountRewardsPrice,
            price: 0,
            selfActivityId: item.activityId
          }]
          paramsData.payDigital = [{payDigital: item.perDiscountRewardsPrice, acctType: 'Rewards'}]
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
            let arr = []
            for (let i = 0; i < this.moduleData.rows.length; i++) {
              if (popupIndex == i) {
                this.moduleData.rows[i].isExchangeSuccess = true
              }
              arr.push(this.moduleData.rows[i])
            }
            this.moduleData.rows = arr;
            // this.$Toast('兑换成功')
            this.checkScore(true)
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
      // 立即兑换
      redeemNow(item, index) {
        if (this.$store.state.webtype == -1) {
          return ;
        }
        if (item.distCntCurUser >= item.discountGoodsCntPerUser) {
          this.$Toast(`每人限购${item.discountGoodsCntPerUser}个，您已到达上限，去看看其它商品吧！`)
        } else if (item.remainNum == 0) {
          this.$Toast('已售完')
        } else if (item.selfSoldNum == 100) {
          this.$Toast('今日可领取次数已用尽')
        } else {
          this.confirmExchange(item, index);
        }
      },
      excTypeVal(item) {
        if (item.activityTags.indexOf('YouDouExCoupon') >= 0) {
          return item.perDiscountEmpRewardsPrice
        } else if (item.activityTags.indexOf('RewardExCoupon') >= 0) {
          return item.perDiscountRewardsPrice
        }
        return item.points
      },
      excTypeIcon(item) {
        let path = ''
        if (item.activityTags.indexOf('YouDouExCoupon') >= 0 || item.activityTags.indexOf('RewardExCoupon') >= 0) {
          // 139是YouDouExCoupon 河南的是 RewardExCoupon
          if (item.soldNum == 100) {
            path = 'static/image/coupon/emp-reward-dis.png'
          } else {
            path = 'static/image/coupon/emp-reward.png'
          }
        } else {
          if (item.soldNum == 100) {
            path = 'static/image/coupon/point-de.png' // 抢光状态
          } else {
            path = 'static/image/coupon/point-icon.png'
          }
        }
        return path
      },
      excTypeName(item) {
        let name = ''
        if (item.activityTags.indexOf('YouDouExCoupon') >= 0) {
          name = this.$store.state.globalConfig.Employees_wallet || '福豆'
        } else if (item.activityTags.indexOf('RewardExCoupon') >= 0) {
          name = this.$store.state.globalConfig.Employees_wallet || '福豆'
        }else {
          name = '积分'
        }
        return name
      },
      _getMyData: function () {
        if (this.moduleData.couponFrom == null) {
          return ;
        }
        let url = this.$market.apiBaseURL() + '/app/json/product/getAppProSearchList';
        let paramsData = {
          page: 1,
          rows: this.moduleData.couponFrom.number
        };
        if (this.$store.state.login.token != '' && this.$store.state.webtype != -1) {
          paramsData.token = this.$store.state.login.token
        }
        paramsData.activityId = this.moduleData.couponFrom.activity.activityId

        if (this.moduleData.productType == '513') {
          paramsData.productType = '513'
        }

        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.moduleData.rows = []
              let list = data.data.list;
              for (let i = 0; i < list.length; i++) {
                let newitem = this.$market.dataProcessing(list[i])
                this.moduleData.rows.push(newitem)
              }
              if (list.length > 0) {
                let item = list[0]
                if (item.activityTags.indexOf('YouDouExCoupon') >= 0) {
                  this.accountType = 9
                } else if (item.activityTags.indexOf('RewardExCoupon') >= 0) {
                  this.accountType = 9
                } else {
                  this.accountType = 3
                }
                this.checkScore()
              }
            }
          },
          error => {
          }
        );
      },
      getBgDivStyle: function () {
        let styleStr = '';
        let img = this.moduleData.bgImgUrl
        if (img != '') {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }
        let color = this.moduleData.bgColor
        if (color != '') {
          styleStr += "background-color: " + color + ";"
        }
        return styleStr
      },
      getSidesStyle: function () {
        let styleStr = '';
        let sidesMargin = this.moduleData.sidesMargin
        if (sidesMargin > 0) {
          styleStr += 'margin-left: ' + sidesMargin + '%; margin-right: ' + sidesMargin + '%;'
        }
        // let upDownMargin = this.moduleData.upDownMargin
        // if (upDownMargin > 0) {
        //   styleStr += 'padding-top: ' + upDownMargin + '%; padding-bottom: ' + upDownMargin + '%;'
        // }
        return styleStr;
      },
      modeleReshow:function(){
        this._getMyData();
      },
    },
    created() {
      this.moduleData.rows = []
      this._getMyData()
      Bus.$on('CouponHQRefresh', () => {
        this._getMyData()
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .coupon-jfhq {
    overflow hidden
    .tip {
      padding 8px 8px 0px 8px;
      font-size 12px;
    }
    .coupon-content {
      min-height 30px;
      padding 8px;
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
    .style-h {
      padding 8px 0;
      .item {
        display inline-block;
        padding 0 5px;
        .item-content {
          width 140px;
          background-color white;
          border-radius 8px;
          padding 10px;
          text-align center;
          .coupon {
            position relative;
            img {
              display block;
              width 100%;
            }
            .couFaceValue {
              position absolute;
              left 5px;
              right 5px;
              top 14px;
              font-size 16px;
              font-weight 600;
              color #FD6802;
            }
            .name {
              position absolute;
              left 5px;
              right 5px;
              top 40px;
              font-size 13px;
              color #FD6802;
            }
          }
          .price {
            font-size 12px;
            padding 8px 0;
            >>>.theme_font_red {
              color #FD6802
            }
          }
          .btn {
            background-color #FD6802;
            margin 0 15px;
            border-radius 20px;
            padding 6px 10px;
            color white;
            font-size 14px;
          }
        }
      }
    }
    .style-3 {
      position relative;
      .bg-img {
        width 100%;
      }
      .coup-cont {
        position absolute;
        left 0;
        right 0;
        top 0;
        bottom 0;
        padding 0 8px;
        display flex;
        align-items center;
        .couFaceValue {
          width 80px;
          color #FD6802;
          text-align center;
          span {
            font-size 20px;
            font-weight 600;
          }
        }
        .center-info {
          padding 0 10px;
          flex 1;
          .title {
            line-height 22px;
            font-size 18px;
            font-weight 600;
          }
          .term {
            line-height 16px;
            font-size 12px;
            margin-top 25px;
          }
        }
        .right-div {
          //background-color rgba(255, 0, 0, 0.3)
          width 80px;
          text-align center;
          font-size 12px;
          .price {
            padding 10px 0;
            color #FD6802;
            font-weight 500;
            font-size 14px;
          }
          .btn {
            background-color #FD6802;
            margin 0 5px
            border-radius 20px;
            padding 6px 6px;
            color white;
            font-size 13px;
          }
        }
      }
    }
  }
</style>

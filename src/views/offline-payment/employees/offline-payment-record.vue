<template>
  <div class="offline-payment-record">
    <nav-top title="离线支付记录" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="offline-payment-record-content">
      <div class="content">
        <van-tabs class="tabs" v-model="tabActive" @change="changeTab">
          <van-tab title="加油交易记录"></van-tab>
          <van-tab title="非油交易记录"></van-tab>
        </van-tabs>
        <div class="screening">
          <div class="top">
            <div @click="showTime = true" class="filter-btn">
              <div class="time">{{ currentYear }}年{{ currentMonth }}月</div>
              <i :class="{active: showTime}" class="icon iconfont mall-arrow-down"></i>
            </div>
            <div @click="showScreening = true" class="filter-btn">
              <div class="time">筛选</div>
              <i :class="{active: showTime}" class="icon iconfont mall-arrow-down"></i>
            </div>
          </div>
          <div class="bottom">
            <span class="title">{{tabActive == '0' ? '加油总金额' : '非油交易总金额'}}</span>
            <span class="num">￥{{oilNum ? oilNum.toFixed(2) : '0.00'}}</span>
          </div>
        </div>
      </div>
      <div class="order-list"
           v-infinite-scroll="getPayBill"
           infinite-scroll-disabled="loading"
           :infinite-scroll-immediate-check="true"
           infinite-scroll-distance="20">
        <div class="order-item" v-for="(item, index) in orderList" @click="repayDetail(item)" :key="index">
          <div class="item">
            <span class="label">{{item.submitTime}}</span>
            <span class="con">{{formatState(item.state)}}</span>
          </div>
          <div class="item special">
            <span class="label">{{item.refuelCashierName}}</span>
          </div>
          <div class="item">
            <span class="label">{{$market.dealPhone(phone)}}</span>
            <span class="con theme_font_red money-special" v-if="item.payAmount !== '' || item.payAmount !== undefined">￥23</span>
          </div>
          <div class="item">
            <span class="label">{{item.refuelOilName}}</span>
          </div>
          <div class="item pay-btn special">
            <!-- <span class="shareBtn" @click="shareView">-->
            <!--   分享可得{{awardActivity.awardAmount}}元{{awardActivity.awardName}}-->
            <!-- </span>-->

            <div>
              <div class="con wait-pay again" @click.stop="toDetail(item)">查看详情</div>
            </div>
          </div>
        </div>
        <div class="no-data theme_font_tint" v-show="!hasMore">没有更多数据了~</div>
      </div>
      <van-popup position="bottom" v-model="showTime">
        <van-datetime-picker
          v-model="currentDate"
          type="year-month"
          :formatter="formatter"
          @confirm="confirmDate"
          @cancel="showTime = false"
        />
      </van-popup>
      <van-popup position="bottom" v-model="showScreening">
        <div class="screen-content">
          <div class="content">
            <div class="screen" v-if="false">
              <div class="title">加油筛选</div>
              <ul class="oil-list">
                <li class="oil-item" v-for="(item, index) in oilList">
                  <div :class="{active: currentIndex === index}" @click="tabChange(index, item)" class="oil">{{item.dictValue}}
                  </div>
                </li>
              </ul>
            </div>
            <div class="screen" v-if="tabActive == 1">
              <div class="title">商品付款类型</div>
              <ul class="oil-list">
                <li class="oil-item" v-for="(item, index) in payTypeList" v-if="index == 0">
                  <div :class="{active: currentIndex === index}" @click="tabChange(index, item)" class="oil">{{item.dictValue}}
                  </div>
                </li>
              </ul>
            </div>
            <div class="screen">
              <div class="title">支付状态</div>
              <ul class="oil-list special">
                <li class="oil-item" v-for="(item, index) in payType">
                  <div :class="{active: currentIndexPay === index}" @click="tabChangePay(index, item)" class="oil">
                    {{item}}
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="btn-group">
            <div class="btn-item" @click="resetBtn">重置</div>
            <div class="btn-item" @click="confirmBtn">确定</div>
          </div>
        </div>
      </van-popup>
    </nav-content>
  </div>
</template>

<script>
  import util from '@/utils/util'
  export default {
    data() {
      return {
        oilNum: '',
        currentIndex: -1,
        currentIndexPay: -1,
        payType: ['待支付', '已完成', '已取消'],
        oilList: [],
        refuelTankOilNoList: [],
        oil: '', // 选择的油品
        payTypeList: ['商品付款'],
        tabActive: 0,
        time: '本月',
        showTime: false,
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth() + 1,
        currentDate: new Date(),
        orderList: [],
        page: 0,
        skuNames: '', // 选择的付款方式
        hasMore: true,
        loading: false,
        phone: '14031312323',
        dateFrom: '',
        state: [], // 订单状态： state 1：待支付  3：已支付  7，8：取消
        showScreening: false // 筛选内容
      }
    },
    mounted() {
      this.dateFrom = util.getDealMonthFrom(this.currentYear, this.currentMonth)
      this.getPayBill()
      this.getDictByAlias() // 油品
      this.getDictByAliasGoods() // 商品付款类型
    },
    methods: {
      getDictByAliasGoods() {
        // 获取商品付款类型
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          alias: 'shoppingScanCodeProductPayType' // 字典表
        }
        this.$http.post('/app/json/app_dict/getDictByAlias', paramsData).then(res => {
          let data = res.data
          this.$Loading.close()
          if (data.status == 0) {
            this.payTypeList = data.data
          } else {
            this.$Toast(data.info)
          }
          this.complete = true
        })
      },
      getDictByAlias() {
        // 获取油品
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          alias: 'MatertialCode' // 字典表
        }
        this.$http.post('/app/json/app_dict/getDictByAlias', paramsData).then(res => {
          let data = res.data
          this.$Loading.close()
          if (data.status == 0) {
            this.oilList = data.data || []
          } else {
            this.$Toast(data.info)
          }
          this.complete = true
        })
      },
      resetBtn() {
        // 重置按钮
        this.currentIndex = -1
        this.currentIndexPay = -1
        this.state = []
        this.oil = ''
        this.showScreening = false
        this.getPayBill()
      },
      confirmBtn() {
        // 确定按钮
        this.orderList = []
        this.oilNum = 0
        this.getPayBill()
        this.showScreening = false
      },
      tabChange(index, item) {
        // 选择 油品
        this.currentIndex = index
        this.skuNames = item.dictKey
        // this.oil = item.dictValue
        console.log(this.oil)
      },
      tabChangePay(index, item) {
        // state 1：待支付  3：已支付  7，8：取消
        this.currentIndexPay = index
        if (index == 0) {
          this.state = 1
        } else if (index == 1) {
          this.state = 3
        } else {
          this.state = [7,8]
        }
      },
      changeTab(name, title) {
        this.skuNames = ''
        this.state = ''
        this.orderList = []
        this.oilNum = 0
        this.getPayBill()
      },
      confirmDate(value) {
        // 确认选择日期
        this.currentYear = new Date(this.currentDate).getFullYear()
        this.currentMonth = new Date(this.currentDate).getMonth() + 1
        this.dateFrom = util.getDealMonthFrom(this.currentYear, this.currentMonth)
        this.showTime = false
        this.orderList = []
        this.getPayBill()
      },
      formatter(type, val) {
        if (type === 'year') {
          return `${val}年`;
        } else if (type === 'month') {
          return `${val}月`
        }
        return val;
      },
      getPayBill() {
        this.page++
        this.loading = true
        this.$Loading.open()
        if (this.oil) {
          this.refuelTankOilNoList.push(this.oil)
        }
        let url = '/app/json/app_employee/queryRefuelOrder'
        if (this.tabActive == 1) {
          url = '/app/json/app_employee/queryShoppingScanOrder'
        }
        let params = {
          token: this.$store.state.login.token,
          refuelTakeDate: this.dateFrom.start + 'TO' + this.dateFrom.end,
          rows: 12,
          skuNames: this.skuNames,
          // refuelTankOilNoList: this.refuelTankOilNoList, // 油品名称
          page: this.page,
          state: this.state
        }
        this.$http.post(url, params).then(res => {
          let data = res.data;
          if (data.status == 0) {
            let list = data.data.orderList || []
            this.orderList = this.orderList.concat(list)
            if (this.page < data.data.page.totalPages) {
              this.loading = false
            } else {
              this.hasMore = false
            }
          if (this.orderList.length) {
            let num = 0 // oilNum
            this.orderList.forEach(item => {
              num = num + Number(item.payAmount)
            })
            this.oilNum = num
          }
          } else {
            this.$Toast(data.info);
          }
          this.$Loading.close();
        })
      },
      toDetail(item, index) {
        this.$router.push({
          path: '/offline_payment/oil_record_details',
          query: {
            detail: JSON.stringify(item),
            source: this.tabActive
          }
        })
      },
      formatState(state) {
        let str = ''
        if (state == 1) {
          str = '待支付'
        } else if (state == 3) {
          str = '已支付'
        } else if (state == 7 || state == 8) {
          str = '已取消'
        }
        return str
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .offline-payment-record {
    .offline-payment-record-content {
      display flex
      flex-direction column

      .content {
        flex-shrink 0

        .screening {
          margin-top: 10px
          background: #f6f6f6
          padding: 6px 15px
          line-height 28px

          .top {
            display flex
            justify-content space-between
            align-items center

            .filter-btn {

              font-size: 18px
              display flex
              justify-content space-between
              align-items center

              .time {
                color: $color-text
              }

              .icon {

                &.active {
                  transform rotate(-180deg)
                }
              }
            }
          }
        }
      }

      .order-list {
        padding 8px 10px;
        overflow-y auto
        -webkit-overflow-scrolling touch
        flex 1

        .order-item {
          border-radius 4px;
          overflow: hidden
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
          padding 0 15px;
          position: relative

          & + .order-item {
            margin-top: 8px;
          }

          .special {
            border-top: 1px solid $color-background-lll
            padding-top: 10px
          }

          .item {
            margin: 15px 0;
            overflow: hidden

            .label {
              float: left
            }

            .con {
              float: right
            }

            .money-special {
              font-weight bold
            }

            .price {
              color: #f02c2d
            }
          }

          .pay-btn {
            bdr-t()
            color: #f02c2d
            padding-top 12px
            display flex
            justify-content flex-end

            .shareBtn {
              padding: 0.186rem 0.26rem;
              border: 1px solid;
              border-radius: 15px;
              margin: auto 10px;
            }
          }
        }

        .wait-pay {
          font-size: 14px;
          border: 1px solid #f02c2d;
          padding: 0.186rem 0.26rem;
          border-radius: 0.4rem;
        }
      }

      .no-data {
        padding: 15px;
        text-align: center;
      }
    }
  }

  .screen-content {

    .content {
      padding: 15px 15px 15px 0
      line-height 24px
      overflow hidden

      .screen {
        .title {
          font-weight bold
          padding: 0 15px
        }

        .oil-list {
          overflow hidden
          .oil-item {
            padding 10px 0 10px 15px
            overflow hidden
            width 50%
            float left

            .oil {
              padding: 5px
              text-align center
              border: 1px solid $color-line-gray-l
              border-radius 6px
            }

            .active {
              border: 1px solid $color-theme-r
              color: $color-theme-r
            }
          }
        }
        .special {
          .oil-item {
            width 33%
          }
        }
      }
    }
    .btn-group {
      display flex
      justify-content space-between
      align-items center
      padding: 5px 0
      border-top: 1px solid #efecec
      font-size 18px
      font-weight bold

      .btn-item {
        flex 1
        text-align center
        padding: 8px 0
      }
    }
    .btn-item:first-child {
      border-right: 1px solid #efecec
    }
  }
</style>

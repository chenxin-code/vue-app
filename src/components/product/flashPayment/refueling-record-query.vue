<template>
  <div class="refueling-record-query">
    <nav-top title="加油凭证" @backEvent="$router.go(-1)">
    </nav-top>
    <nav-content class="refueling-record-query-container">
      <div class="top">
        <div class="change-title">
          <div class="left">{{date}}</div>
          <div class="right">
            <ScreenPopup @childToDadValue="screenChild"></ScreenPopup>
            <img src="./images/icon2@2x.png" alt="">
          </div>
        </div>
        <div class="title">共有<span class="num">{{list.length}}</span>笔订单，金额合计<span class="num">{{list[0] ? list[0].totalAllAmount : '0.00'}}</span>元</div>
      </div>
      <ul class="list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
          <li class="item" v-for="(item, index) in list" :key="index" @click="openDetails(item)">
            <div class="time">加油时间: {{dealTime(item.tradeTime)}}</div>
            <div class="main">
<!--              <div class="tips">-->
<!--                <img src="./images/icon@2x.png" alt="">-->
<!--              </div>-->
              <div class="text">
                <div class="name">油站名称</div>
                <div class="info">{{item.storeOuName}}</div>
              </div>
              <div class="text">
                <div class="name">油品名称</div>
                <div class="info">{{item.productName}}</div>
              </div>
              <div class="text">
                <div class="name">订单金额</div>
                <div class="info">{{item.amount}}</div>
              </div>
              <div class="text">
                <div class="name">支付渠道</div>
                <div class="info">{{item.payModeName}}</div>
              </div>
            </div>
          </li>
        </van-list>
      </ul>
    </nav-content>
  </div>
</template>

<script>
  import ScreenPopup from './components/screening-popup'
  import util from '@/utils/util'

  export default {
    data() {
      return {
        list: [],
        loading: false,
        finished: false,
        page: 0,
        date: '',
        dateFrom: '', // 本月的第一天和最后一天
        details: '' // 筛选数据
      }
    },
    mounted() {
      console.log(new Date())
      console.log(new Date().getFullYear())
      console.log(new Date().getDate())
      console.log(new Date('2019-10-31 12: 12: 00'))
      console.log(new Date('2019-10-31 12: 12: 00').getDate())
      console.log(util.getPreTime(new Date()))
      console.log(util.getPreTime(new Date()).replace(/-/g, '/'))
      console.log(util.getPreTime(util.getPreTime(new Date())))
      console.log(util.getDateFromString(util.getPreTime(util.getPreTime(new Date()))))
      console.log((util.getDateFromString(util.getPreTime(util.getPreTime(new Date())))) + 24 * 60 * 60 * 1000)

      this.dealDate()
    },
    methods: {
      screenChild(data) { // 筛选子组件传过来的值
        this.details = data
        console.log(data)
        this.list = []
        this.page = 0
        this.finished = false
      },
      dealDate() {
        this.date = util.getMyMonth(new Date())
        let dateList = this.date.split('-')
        this.dateFrom = util.getDealMonthFromSpecific(dateList[0], dateList[1])
      },
      loadMore() {
        this.page = this.page + 1
        let paramsData = {
          reqStockTradeOillModel: {
            // userId: this.$store.state.userInfo.userId,
            userId: 8066766,
            startDate: this.details.beginTime ? this.details.beginTime : this.dateFrom.start, // 开始时间
            endDate: this.details.endTime ? this.details.endTime : this.dateFrom.end, // 结束时间
            storeOuName: this.details.oilStation, // 加油站名称
            productCode: this.details.oilDetails ? this.details.oilDetails.skuCode : '', // 油品编号
            payMode: this.details.payDetails ? this.details.payDetails.payCode : '', // 支付方式
            startAmount: this.details.smallMoney, // 最小金额
            endAmount: this.details.bigMoney // 最大金额
          },
          token: this.$store.state.login.token,
          index: this.page,
          pageSize: 20
        }
        this.$http.post('/app/json/app_stock_month_bills/queryStockTradeOillList', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.list = this.list.concat(data.data || [])
            if (this.list.length >= data.totalRecords) {
              this.finished = true
            }
          } else {
            this.finished = true
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
          this.loading = false
        })
      },
      openDetails(item) {
        // 打开详情
        this.$router.push({path: '/refueling-record-query-details', query: {details: JSON.stringify(item)}})
      },
      dealTime(time) {
        if (time.indexOf('-') > -1) {
          time = time.replace(/\-/g, '/')
        }
        return util.getPreTime(time)
      }
    },
    components: {
      ScreenPopup
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .refueling-record-query {
    .refueling-record-query-container {
      display flex
      flex-direction column

      .top {
        flex-shrink 0

        .change-title {
          background #fff
          display flex
          justify-content space-between
          align-items center
          border-top: 0.5px solid #eaeaea
          border-bottom 0.5px solid #eaeaea
          padding: 5px 0 5px 15px

          .left {
            padding: 9px 0
            flex: 1
            border-right 1px solid $color-line-gray-l
          }

          .right {
            padding: 9px 0
            width: 80px
            display flex
            align-items center
            justify-content center
            overflow visible !important

            /deep/ .navcontent {
              overflow visible !important
            }

            img {
              width: 15px
              margin-left: 3px
            }
          }
        }

        .title {
          padding: 20px 0
          text-align center

          .num {
            font-size 18px
          }
        }
      }

      .list {
        flex: 1
        overflow-y auto
        -webkit-overflow-scrolling touch
        padding: 0 15px 15px 15px

        .item {
          .time {
            color: $color-text-d
            padding: 10px 0
          }

          .main {
            box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
            background: #fff
            border-radius 6px
            padding: 11px
            position relative
            overflow hidden

            .tips {
              position absolute
              top:0
              right: 0
              img {
                width: 60px
              }
            }

            .text {
              display flex
              justify-content left
              align-items center
              line-height 26px

              .name {
                color: $color-text-d
                padding-right: 15px
              }

              .info {
                color: $color-text
              }
            }
          }
        }
      }
    }
  }
</style>

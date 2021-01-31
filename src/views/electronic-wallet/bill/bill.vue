<template>
  <div class="bill">
    <nav-top title="账单" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="bill-container">
      <div class="top">
        <div @click="show = true" class="filter-btn">{{ currentYear }}年{{ currentMonth }}月
          <i :class="{active: show}" class="icon iconfont mall-arrow-down"></i>
        </div>
        <div class="details">
          <div class="info">支出￥{{billList.length ? billList[0].consumeUnitSum : '0.00'}}</div>
          <div class="info">收入￥{{billList.length ? billList[0].addUnitSum : '0.00'}}</div>
        </div>
      </div>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
        <ul class="bill-list">
          <li class="bill-item" v-for="(item, index) in billList" :key="index" @click="openDetails(item)">
            <div class="left">
              <div class="name">时代邻里邦</div>
              <div class="style" v-if="item.payType == 100">钱包充值</div>
              <div class="style" v-else-if="item.payType == 200">钱包消费</div>
              <div class="style" v-else-if="item.payType == 300">钱包退款</div>
              <div class="style" v-else-if="item.payType == 800">申请退款</div>
              <div class="time">{{item.paidTime}}</div>
            </div>
            <div class="right" :class="{add: item.payType == 100 || item.payType == 300}">
              <span v-if="item.payType == 100 || item.payType == 300">+</span>{{item.amountUnit}}
            </div>
          </li>
        </ul>
      </van-list>
      <van-popup position="bottom" v-model="show">
        <van-datetime-picker
          v-model="currentDate"
          type="year-month"
          @confirm="confirmDate"
          @cancel="show = false"
          :formatter="formatter"/>
      </van-popup>
    </nav-content>
  </div>
</template>

<script>
  import util from '@/utils/util'

  export default {
    /**
     * payType 类型
     * 钱包充值100、钱包消费200、钱包退款300、申请退款800
     */
    data() {
      return {
        show: false, // 时间弹框
        currentDate: new Date(),
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth() + 1,
        billList: [],
        page: 0,
        loading: false,
        finished: false,
        dateFrom: ''
      }
    },
    mounted() {
      this.dateFrom = util.getDealMonthFrom(this.currentYear, this.currentMonth)
    },
    methods: {
      loadMore() {
        // 查询账单
        this.page = this.page + 1
        let paramsData = {
          page: this.page,
          rows: this.rows,
          payTypeCodes: '100, 200, 300, 800',
          token: this.$store.state.login.token,
          acctType: 1,
          starTradeTime: this.dateFrom.start,
          endTradeTime: this.dateFrom.end
        }
        this.$http.post('/app/json/acct/getAccountPaymentList', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.billList = this.billList.concat(data.data)
            if (this.billList.length >= data.totalRecords) {
              this.finished = true
            }
          } else {
            this.finished = true
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
          this.loading = false
        })
      },
      confirmDate(value) {
        this.currentYear = new Date(this.currentDate).getFullYear()
        this.currentMonth = new Date(this.currentDate).getMonth() + 1
        this.show = false
        this.dateFrom = util.getDealMonthFrom(this.currentYear, this.currentMonth)
        this.billList = []
        this.page = 0
        this.loading = false
        this.hasMore = true
        this.loadMore()
      },
      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`;
        } else if (type === 'month') {
          return `${value}月`
        }
        return value;
      },
      openDetails(item) {
        // 打开明细
        this.$router.push({path: '/bill-details', query: {id: item.id}})
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .bill {
    .bill-container {
      padding: 11px 0

      .top {
        padding: 0 15px
        display flex
        justify-content space-between
        align-items center

        .filter-btn {
          font-size: 16px
          flex 1

          .icon {
            position absolute
            transition all .3s

            &.active {
              transform rotate(-180deg)
            }
          }
        }

        .details {
          line-height 20px
          text-align right
          color: $color-text
        }
      }
      /deep/ .van-list {
        overflow-y auto
        -webkit-overflow-scrolling touch
        height 100%
        padding-bottom: 25px
      }
      .bill-list {
        padding: 11px 15px

        .bill-item {
          box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
          border-radius 6px
          margin-bottom 10px
          padding: 11px 15px
          display flex
          justify-content space-between
          align-items center

          .left {
            line-height 28px

            .name {
              font-size 14px
            }

            .style {
              color: $color-text-d
            }

            .time {
              color: $color-text-l
            }
          }

          .add {
            color: $color-theme-r
          }
        }
      }
    }
  }
</style>

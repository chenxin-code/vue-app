<template>
  <div>
    <nav-top title="加油订单" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="order-container">
      <div class="order-header">
        <div class="order-date">
          <div class="date-con">
            <div class="left" @click="changeDate(1)">
              <span class="date">{{startDate}}</span>
              <van-icon class="icon" :name="showTime ? 'arrow-up' : 'arrow-down'"/>
            </div>
            <div class="center">至</div>
            <div class="right" @click="changeDate(2)">
              <span class="date">{{endDate}}</span>
              <van-icon class="icon" :name="showTime ? 'arrow-up' : 'arrow-down'"/>
            </div>
          </div>
          <div class="btn" @click="search">
            <van-icon name="search"/>
          </div>
        </div>
        <div class="total">共计 <span style="font-size: 15px;">{{total || 0}}</span> 笔，总共金额 <span style="font-size: 15px;">{{totalInfo.totalAmount || '0.00'}}</span> 元</div>
        <div class="order-tab">
          <van-tabs v-model="state" color="#bb313d" @click="search">
            <van-tab title="已支付"  name="3"></van-tab>
            <van-tab title="已取消" name="7,8"></van-tab>
            <van-tab title="全部订单" name=""></van-tab>
          </van-tabs>
        </div>
      </div>
      <div class="order-list">
        <van-pull-refresh v-model="refreshing" @refresh="search">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div class="order-item" v-for="item in list">
            <div class="info">
              <div class="cell">
                <span class="label">员工</span>
                <span class="con">{{item.refuelCashierName}}</span>
              </div>
              <div class="cell">
                <span class="label">加油时间</span>
                <span class="con">{{item.submitTime}}</span>
              </div>
              <div class="cell">
                <span class="label">加油油品</span>
                <span class="con">{{item.refuelOilName}}</span>
              </div>
              <div class="cell">
                <span class="label">订单金额</span>
                <span class="con">￥{{item.realAmount}}</span>
              </div>
            </div>
            <div class="status" @click="detailHandle(item)">
              <template v-if="item.state == 1">
                <img class="icon" src="../images/icon-pending.png" alt="">
                <div class="text">待支付</div>
              </template>
              <template v-else-if="item.state == 3">
                <img class="icon" src="../images/icon-complete.png" alt="">
                <div class="text dark">已支付</div>
              </template>
              <template v-else-if="item.state == 7 || item.state == 8">
                <img class="icon" src="../images/icon-cancel.png" alt="">
                <div class="text dark">已取消</div>
              </template>
              <div class="detail">查看详情</div>
            </div>
          </div>
        </van-list>
        </van-pull-refresh>
      </div>
      <van-popup position="bottom" v-model="showTime">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          @confirm="confirmDate"
          @cancel="showTime = false"
        />
      </van-popup>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'list',
    data() {
      return {
        showTime: false,
        currentDate: new Date(),
        startDate: '',
        endDate: '',
        type: 1,
        list: [],
        loading: true,
        finished: false,
        refreshing: false,
        page: 0,
        state: '3', // 订单状态： state 1：待支付  3：已支付  7，8：取消
        totalInfo: {},
        total: 0,
      }
    },
    created() {
      this.startDate = this.$util.getMyDate(this.currentDate)
      this.endDate = this.$util.getMyDate(this.currentDate)
      this.onLoad()
    },
    methods: {
      onLoad() {
        this.loading = true
        this.page++
        let params = {
          stateList: this.state ? this.state.split(',') : [],
          refuelTakeDate: `${this.startDate} 00:00:00TO${this.endDate} 23:59:59`,
          // refuelTakeDate: `2020-03-18 00:00:00TO2020-03-20 23:59:59`,
        }
        this.$request.post('/app/json/app_employee/queryRefuelOrder', {
          page:{index:this.page,pageSize:10},
          ...params
        }).then(res => {
          this.pageInitShow = true
          this.loading = false
          if (this.refreshing) {
            this.list = [];
            this.refreshing = false;
          }
          if (res.status === 0) {
            this.list = this.list.concat(res.data.orderList || [])
            this.total = res.data.page ? res.data.page.count : 0
            if (this.list.length >= res.data.page.count) {
              this.finished = true
            }
          } else {
            this.finished = true
          }
          if (this.page === 1) {
            this.queryRefuelOrderTotal(params)
          }
        })
      },
      queryRefuelOrderTotal(params) {
        this.$request.post('/app/json/app_employee/queryRefuelOrderTotal', params).then(res => {
          this.pageInitShow = true
          this.loading = false
          if (res.status === 0) {
            this.totalInfo = res.data
          }
        })
      },
      detailHandle(item) {
        this.$router.push({
          name: '/order-recommend/detail',
          params: {
            detail: item
          }
        })
      },
      search() {
        const day = this.getDaysBetween(this.startDate, this.endDate)
        if (day < 0) {
          this.$toast('结束时间不得小于开始时间')
          return
        }
        this.page = 0
        this.list = []
        this.loading = true
        this.finished = false
        this.onLoad()
      },
      changeDate(type) {
        this.type = type
        this.showTime = true
      },
      confirmDate(value) {
        // 确认选择日期
        this.showTime = false
        const date = this.$util.getMyDate(value)
        // const day = this.getDaysBetween(this.startDate, this.endDate)
        if (this.type === 1) {
          this.startDate = date
        } else {
          this.endDate = date
        }
        console.log(this.getDaysBetween(this.startDate, this.endDate))
      },
      getDaysBetween(start, end) {
        let startDate = Date.parse(start.replace(/\-/g, '/'));
        let endDate = Date.parse(end.replace(/\-/g, '/'));
        return (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
      }
    },
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/mixin.styl"
  .order-container {
    display flex
    flex-direction column

    /deep/ .van-info {
      background: #bb313d
    }

    /deep/ .van-picker__cancel, /deep/ .van-picker__confirm {
      color: #bb313d
    }

    .order-header {
      flex-shrink 0

      .order-date {
        padding 15px;
        display flex

        .btn {
          background: #e5e5e5
          border-radius 30px;
          color #727272
          flex-shrink 0
          margin-left: 10px;
          width: 40px;
          display flex
          align-items center
          font-size: 20px;
          justify-content center
        }
      }

      .date-con {
        background: #e5e5e5
        border-radius 30px;
        color #727272
        display flex
        width 70%
        padding 10px;
        font-size: 14px;
        align-items center
        justify-content space-between

        .left, .right {
          display flex

          .date {
            display inline-block
            padding-right: 6px;
          }
        }
      }

      .total {
        padding 0 15px 15px;
        color #727272
      }

      .order-tab {
        padding-bottom: 10px;
        background: #f3f3f3
      }
    }

    .order-list {
      background: #f3f3f3
      flex 1
      overflow-y auto

      .order-item {
        padding 15px 11px;
        background: #fff;
        display flex
        align-items center

        .info {
          padding-right 5px;
          flex 1
        }

        & + .order-item {
          margin-top: 10px
        }

        .cell {
          font-size: 14px;

          & + .cell {
            padding-top: 14px;
          }

          .label {
            color #727272
            display inline-block
            padding-right: 10px;
          }
        }

        .status {
          flex-shrink 0
          text-align center
          padding-left 10px
          bdr-l()

          .icon {
            width 24px;
          }

          .text {
            font-size: 16px;
            color #bb313d
            padding 6px 0;
          }

          .dark {
            color #727272
          }

          .detail {
            color #727272
          }
        }
      }
    }
  }
</style>

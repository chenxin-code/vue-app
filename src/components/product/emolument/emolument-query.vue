// create by LiuYong on 2020/10/27 12:00 联量薪酬查询
<template>
  <div class="emolument-query">
    <nav-top title="联量薪酬查询" @backEvent="goback"></nav-top>
    <nav-content class="content">
      <div class="top">
        <div class="emolument-content-header">
          <div class="search-item" @click="showOil = true">
            <span>{{oilShow ? oilShow : '所有油品'}}</span>
            <i :class="{active: showOil}" class="icon iconfont mall-arrow-down"></i>
          </div>
          <div class="time-change">
            <div @click="showTime = true" class="filter-btn">
              <div class="time">{{ currentYear }}年{{ currentMonth }}月</div>
              <i :class="{active: showTime}" class="icon iconfont mall-arrow-down"></i>
            </div>
          </div>
        </div>
        <div class="emolument-content-info">
          <div class="info-item line_right">
            <div class="title">付油量</div>
            <div class="value">{{info.totalLitre || 0}}L</div>
          </div>
          <div class="info-item">
            <div class="title">联量薪酬</div>
            <div class="value">￥{{info.totalAmount ? info.totalAmount.toFixed(2) : 0}}</div>
          </div>
        </div>
      </div>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
        <div class="emolument-content-list">
          <div class="list-div" v-for="(item, index) in list" :key="index">
            <div class="list-left">
              <div class="time">{{item.posRptDate}}</div>
              <div class="amount">付油量：{{item.totalLitre || 0}}L</div>
              <div class="amount">联量薪酬：{{item.totalAmount ? item.totalAmount.toFixed(2) : 0}}元</div>
            </div>
            <div class="list-right" @click="detailsQuery(item)">明细查询</div>
          </div>
        </div>
      </van-list>
      <!-- popup -->
      <van-popup position="bottom" v-model="showTime">
        <van-datetime-picker
          v-model="currentDate"
          type="year-month"
          :formatter="formatter"
          @confirm="confirmDate"
          @cancel="showTime = false"
        />
      </van-popup>
      <van-popup position="bottom" v-model="showOil">
        <van-picker show-toolbar
                    title="油品"
                    :columns="columns"
                    @cancel="showOil = false"
                    @confirm="confirmBtn"
        />
      </van-popup>
    </nav-content>
  </div>
</template>

<script>
  import util from '@/utils/util'

  export default {
    components: {},
    props: {},
    data() {
      return {
        value: '',
        showTime: false, // 时间
        showOil: false, // 油品
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth() + 1,
        currentDate: new Date(),
        dateFrom: '',
        currentIndex: -1,
        list: [],
        page: 0,
        loading: false,
        finished: false,
        oil: '', // 接口的油品
        oilShow: '', // 显示的油品
        rows: 10,
        columns: ['92#', '95#', '98#', '0#', 'CNG', 'LNG'],
        info: ''
      }
    },
    computed: {},
    created() {
    },
    mounted() {
      this.dateFrom = util.getDealMonthFrom(this.currentYear, this.currentMonth)
    },
    methods: {
      loadMore() {
        // 查询账单
        console.log(this.oilShow)
        if (this.oilShow) {
          if (this.oilShow == '92#') {
            this.oil = '92'
          } else if (this.oilShow == '95#') {
            this.oil = '95'
          } else if (this.oilShow == '98#') {
            this.oil = '98'
          } else if (this.oilShow == '0#') {
            this.oil = '0'
          } else if (this.oilShow == 'CNG') {
            this.oil = 'cng'
          } else if (this.oilShow == 'LNG') {
            this.oil = 'lng'
          }
        }
        this.list = []
        this.page = this.page + 1
        let paramsData = {
          page: this.page,
          rows: this.rows,
          token: this.$store.state.login.token,
          sDate: this.dateFrom.start,
          eDate: this.dateFrom.end,
          cashierPhone: this.$store.state.login.phone,
          oilCls: this.oil
        }
        this.$http.post('/app/json/app_emp_performance/queryEmpRefuelPerformanceDaySum', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.info = data.data
            const list = data.data.items || []
            this.list = this.list.concat(list)
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
      detailsQuery(item) {
        this.$router.push({
          path: '/emolument/detail',
          query: {cashierId: item.cashierId, sDate: item.posRptDate, eDate: item.posRptDate}
        })
      },
      goback() {
        if (this.$route.query.submitSuc) {
          this.$router.go(-4)
        } else {
          this.$router.go(-1)
        }
      },
      confirmDate(value) {
        // 确认选择日期
        this.currentYear = new Date(this.currentDate).getFullYear()
        this.currentMonth = new Date(this.currentDate).getMonth() + 1
        this.dateFrom = util.getDealMonthFrom(this.currentYear, this.currentMonth)
        this.showTime = false
        this.list = []
        this.loadMore()
      },
      formatter(type, val) {
        if (type === 'year') {
          return `${val}年`;
        } else if (type === 'month') {
          return `${val}月`
        }
        return val;
      },
      confirmBtn(val) {
        // 确定按钮
        // 92# 92
        // 95# 95
        // 98# 98
        // 0#   0
        // cng cng
        // lng  lng
        console.log(val)
        this.oilShow = val
        this.list = []
        this.loadMore()
        this.showOil = false
      }
    },
    filters: {},
    watch: {},
  }
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  @import "~@/common/stylus/variable.styl"

  .nav-content {
    padding: 11px 15px
    display flex
    flex-direction column

    .top {
      flex-shrink 0
      padding: 0 2px
    }
    .van-list {
      flex: 1
      overflow-y auto
      -webkit-overflow-scrolling touch
    }

    .emolument-content-list {
      padding: 0 2px
    }

    .emolument-content-header {
      display flex
      justify-content space-between

      .search-item {
        display: flex;
        align-items: center;
        font-size: 17px;
        font-weight: 500;

        .icon {

          &.active {
            transform rotate(-180deg)
          }
        }
      }

      .time-change {
        display flex
        justify-content space-between
        align-items center
        padding: 11px 15px
        flex-shrink 0

        .filter-btn {
          border-radius 20px
          padding: 6px 15px
          background: $color-background-lll
          font-size: 16px
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

        .num {
          font-size 14px
        }
      }

    }

    .emolument-content-info {
      display: flex;
      padding: 18px;
      margin-top: 18px;
      border-radius: 10px;
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);

      .info-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .title {
          font-size: 15px

        }

        .value {
          font-size: 22px
          margin-top: 12px;
          font-weight: 500;
        }
      }
    }

    .emolument-content-list {
      .list-div {
        margin-top: 12px;
        padding: 18px;
        border-radius: 10px;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
        display: flex;
        font-size: 16px;
        align-items: center;

        .list-left {
          flex: 1;
          line-height 24px

          .time {
            font-weight: 500;
            font-size 16px
          }

          .amount {
            color: $color-text-d
            font-size 14px
          }
        }

        .list-right {
          flex-shrink: 0;
          padding: 8px 10px;
          border-radius: 18px;
          background-color: #f02c2d;
          color: #fff;
        }
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

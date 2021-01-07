// create by LiuYong on 2020/10/27 12:00 联量薪酬明细
<template>
  <div class="emolument-detail">
    <nav-top title="联量薪酬明细" @backEvent="goback"></nav-top>
    <nav-content class="emolument-detail-container">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
        <div class="emolument-content-list">
          <div class="list-div" v-for="(item, index) in list" :key="index">
            <div class="list-left">
              <div class="time">{{item.oilClsName || '--'}}</div>
              <div class="amount">付油量：{{item.oilLiter || 0}}L</div>
              <div class="amount">联量薪酬系数：{{item.performanceRate || 0}}</div>
              <div class="amount">联量薪酬：{{item.performancefAmount ? item.performancefAmount.toFixed(2) : 0}}元</div>
            </div>
          </div>
        </div>
      </van-list>
    </nav-content>
  </div>
</template>

<script>
  export default {
    components: {},
    props: {},
    data() {
      return {
        list: [],
        page: 0,
        loading: false,
        finished: false,
      }
    },
    computed: {},
    created() {
    },
    mounted() {
    },
    methods: {
      goback() {
        if (this.$route.query.submitSuc) {
          this.$router.go(-4)
        } else {
          this.$router.go(-1)
        }
      },
      loadMore() {
        // 查询账单
        this.list = []
        this.page = this.page + 1
        let paramsData = {
          page: this.page,
          rows: this.rows,
          token: this.$store.state.login.token,
          cashierPhone: this.$route.query.cashierId,
          sDate: this.$route.query.sDate,
          eDate: this.$route.query.eDate
        }
        this.$http.post('/app/json/app_emp_performance/queryEmpRefuelPerformanceDetail', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            const list = data.data || []
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
      }
    },
    filters: {},
    watch: {},
  }
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  @import "~@/common/stylus/variable.styl"
  .emolument-detail {
    .emolument-detail-container {
      padding: 11px 15px
      overflow-y auto
      -webkit-overflow-scrolling touch

      .emolument-content-list {
        .list-div {
          margin-top: 12px;
          padding: 18px;
          border-radius: 10px;
          box-shadow: 0 0 0.24rem 0 rgba(197, 197, 197, 0.3);
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
  }
</style>

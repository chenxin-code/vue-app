<template>
  <div class="oil-record">
    <nav-top title="加油记录" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="oil-record-container">
      <ul class="list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
          <li class="item" v-for="(item, index) in recordList" :key="index">
            <div class="time">2019-11-08 09:50:05</div>
            <div class="table-view content">
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">订单号</div>
                  <div class="right">{{item.orderNo}}</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">加油升数</div>
                  <div class="right">{{item.oilLiter || '0'}}升</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">加油金额</div>
                  <div class="right">{{item.amount || '0.00'}}元</div>
                </div>
              </div>
              <!-- <div class="table-view-cell" v-if="packageType == 3">
                <div class="table-view-cell-text">
                  <div class="left">返利比例</div>
                  <div class="right">{{(item.rebate/item.amount).toFixed(2)}}%</div>
                </div>
              </div> -->
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">实时返利金额</div>
                  <div class="right">{{item.rebate || '0'}}</div>
                </div>
              </div>
            </div>
          </li>
        </van-list>
      </ul>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        recordList: [],
        loading: false,
        finished: false,
        page: 0,
        packageType: '' // 套餐类型
      }
    },
    mounted() {
      this.packageType = this.$route.query.packageType
    },
    methods: {
      loadMore() {
        this.page = this.page + 1
        let paramsData = {
          token: this.$store.state.login.token,
          packageRefuelOrderId: this.$route.query.id,
          page: {
            index: this.page,
            pageSize: 20
          }
        }
        this.$http.post('/app/json/app_package_refuel/queryPackageRefuelOrderRecord', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.recordList = this.recordList.concat(data.data || [])
            if (this.recordList.length >= data.totalRecords) {
              this.finished = true
            }
          } else {
            this.finished = true
            this.$Toast(data.info ? data.info : '获取列表失败')
          }
          this.loading = false
        })
      },

    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .oil-record {
    background-color: #f8f8f8 !important

    .oil-record-container {
      overflow-y auto
      -webkit-overflow-scrolling touch
      .list {
        .item {
          .time {
            text-align center
            padding: 10px 0
            color: $color-text-l
          }
          .content {
            .table-view-cell {
              padding: 15px
              .left {
                color $color-text-d
              }
            }
          }
        }
      }
    }
  }
</style>

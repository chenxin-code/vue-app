<template>
  <div class="employees-order-record">
    <nav-top title="订单记录" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="employees-order-record-container">
      <div class="top">
        <div class="inp">
          <div class="left">
            <input
              type="text"
              placeholder="输入订单号或加油金额、加油升数"
              v-model="orderData">
          </div>
          <div class="right" @click="searchBtn">
            <div class="btn">搜索</div>
          </div>
        </div>
        <div class="title">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">我的油站</div>
                <div class="right">{{orderDetails.ouName}}</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">时间</div>
                <div class="right">{{orderDetails.timeStr}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
          <div class="title" v-for="(item, index) in orderList" :key="index">
            <div class="table-view">
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">加油订单号</div>
                  <div class="right">{{item.refuelOrderId}}</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">加油时间</div>
                  <div class="right">{{item.refuelTakeDate}}</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">油品型号</div>
                  <div class="right">{{item.refuelOilName || '--'}}</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">加油升数</div>
                  <div class="right">{{item.refuelLiter || 0}}L</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">加油金额</div>
                  <div class="right">￥{{item.refuelPrice || 0.00}}</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">起始崩码数</div>
                  <div class="right">{{item.startReadout || 0}}</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">结束崩码数</div>
                  <div class="right">{{item.overReadout || 0}}</div>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        orderList: [], // 订单列表
        orderData: '', // 输入的搜索内容
        loading: false,
        finished: false,
        page: 0,
        orderDetails: '' // 详情
      }
    },
    mounted() {
    },
    methods: {
      searchBtn() {
        // 搜索按钮
        this.orderList = []
        this.page = 0
        this.finished = false
      },
      loadMore() {
        this.page = this.page + 1
        let paramsData = {
          token: this.$store.state.login.token,
          orderId: this.orderData, // 加油订单号
          refuelMoney: this.orderData, // 加油金额
          refuelLiter: this.orderData, // 加油升数
          page: {
            index: this.page,
            pageSize: 20
          }
        }
        this.$http.post('/app/json/app_employee_card/queryRefuelOrders', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.orderDetails = data.data
            this.orderList = this.orderList.concat(data.data.refuelOrders || [])
            if (this.orderList.length >= data.totalRecords) {
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
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .employees-order-record {
    background-color: #f8f8f8 !important

    .employees-order-record-container {
      padding: 11px 14px
      display flex
      flex-direction column
      .top {
        flex-shrink 0
      }
      .bottom {
        flex: 1
        overflow-y auto
        -webkit-overflow-scrolling touch
      }

      .inp {
        display flex
        justify-content space-between
        align-items center
        margin-bottom: 10px

        .left {
          flex: 1
          box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
          border-radius 6px
          padding: 5px 15px
          background #fff

          input {
            width: 100%
            line-height 34px
          }
        }

        .right {
          padding: 5px 15px
          line-height 34px
          border-radius 6px
          background $color-theme-r
          color: #fff
          text-align center
          margin-left: 10px

          .btn {
          }
        }
      }

      .title {
        box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
        border-radius 6px
        padding: 1px
        margin-bottom: 10px
        background #fff

        .table-view-cell {
          padding: 15px

          .right {
            .van-icon {
              padding-left: 5px
            }
          }
        }
      }
    }
  }
</style>

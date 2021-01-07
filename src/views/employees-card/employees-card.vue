<template>
  <div class="my-employees-card">
    <nav-top title="我的员工卡" @backEvent="$router.go(-1)">
      <div class="phone-bill" @click="openBill" v-if="carddetails.cardNum">历史记录</div>
    </nav-top>
    <nav-content class="my-employees-card-container" v-if="complete">
      <div class="title">
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">我的油站</div>
              <div class="right">{{carddetails.ouName || '--'}}</div>
            </div>
          </div>
          <div class="table-view-cell" @click="bindCard">
            <div class="table-view-cell-text">我的员工卡</div>
            <div class="table-view-cell-arrow">{{carddetails.cardNum != 0 ? `${carddetails.cardNum}张` : '未绑定'}}</div>
          </div>
        </div>
      </div>
      <div class="no-data" v-if="carddetails.cardNum == 0">暂无数据</div>
      <div v-else>
        <div class="title">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">数据类型</div>
                <div class="right">{{carddetails.type == 1 ? '班结' : '日结'}}</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">班次</div>
                <div class="right">{{carddetails.classes}}</div>
              </div>
            </div>
            <div class="table-view-cell" @click="homePage">
              <div class="table-view-cell-text">
                <div class="left">时间</div>
                <div class="right">{{carddetails.timeStr}}<i class="iconfont mall-shuaxin"></i></div>
              </div>
            </div>
            <div class="table-view-cell" @click="openOderRecord">
              <div class="table-view-cell-text">加油订单</div>
              <div class="table-view-cell-arrow">查看</div>
            </div>
          </div>
        </div>
        <div class="title total-show" v-if="carddetails.cardNum > 1">
          <div class="left">
            <div class="top">￥<span class="num">{{carddetails.refuelMoney}}</span></div>
            <div class="bottom">合计加油金额</div>
          </div>
          <div class="right">
            <div class="top"><span class="num">{{carddetails.refuelLiter}}</span>&nbsp;L</div>
            <div class="bottom">合计加油升数</div>
          </div>
        </div>
        <div class="card-list">
          <div class="title" v-for="(item, index) in carddetails.cards" :key="index">
            <div class="table-view">
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">卡号</div>
                  <div class="right">{{item.cardNo}}</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">接班余额</div>
                  <div class="right">￥{{item.takeBalance || 0.00}}</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">当前余额</div>
                  <div class="right">￥{{item.currentBalance || 0.00}}</div>
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
                  <div class="right">￥{{item.refuelMoney || 0.00}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        complete: false,
        noData: true, // 是否绑卡
        carddetails: '' // 详情
      }
    },
    mounted() {
      this.homePage()
    },
    methods: {
      homePage() {
        this.$request.post('/app/json/app_employee_card/homePage', {
          type: '', // 数据类型 1班结 2日结
          timeStr: '', // 日期 2019-09-30 如果传递日期代表是查看历史数据
          clazzNo: '' // 1 2 3 查看历史班结数据,如果查看当前班结数据不传此字段
        }).then(res => {
          if (res.status === 0) {
            this.complete = true
            this.carddetails = res.data
          } else {
            this.$Toast(res.info ? res.info : '获取数据失败')
          }
        })
      },
      bindCard() {
        if (this.carddetails.cards.length) {
          // 有卡 去卡列表
          this.$router.push({path: '/employees-card-list'})
        } else {
          // 无卡 去绑卡
          this.$router.push({path: '/bind-employees-card'})
        }
      },
      openBill() {
        // 历史记录
        this.$router.push({path: '/employees-card-record', query: {timeStrYes: this.carddetails.timeStrYes}})
      },
      openOderRecord() {
        // 打开订单记录
        this.$router.push({path: '/employees-card-order-record'})
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .my-employees-card {
    background-color: #f8f8f8 !important
    .phone-bill {
      font-size: 16px
      text-align right
      margin-right: 10px
    }
    .my-employees-card-container {
      padding: 11px 14px
      overflow-y auto
      -webkit-overflow-scrolling touch
      .title {
        box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
        border-radius 6px
        padding: 1px
        margin-bottom: 10px
        background #fff
        .table-view-cell {
          padding: 15px
          .right {
            .mall-shuaxin {
              padding-left: 5px
              font-size 12px
            }
          }
        }
      }
      .card-list {
        .title:nth-child(3n-2) {
          background #f2f2f2
          .table-view-cell {
            background #f2f2f2
          }
        }
        .title:nth-child(3n-1) {
          background #ffebec
          .table-view-cell {
            background #ffebec
          }
        }
        .title:nth-child(3n) {
          background #ebf5ff
          .table-view-cell {
            background #ebf5ff
          }
        }
        .table-view-cell:after {
          border-color #f9f8f8
        }
      }
      .total-show {
        display flex
        justify-content center
        align-items center
        padding: 15px 20px
        .left, .right {
          flex 1
          text-align center
          line-height 20px
          .top {
            .num {
              font-size 24px
            }
          }
          .bottom {
            color: $color-text
          }
        }
      }
      .no-data {
        padding: 50px
        text-align center
        color: $color-text-d
      }
    }
  }
</style>

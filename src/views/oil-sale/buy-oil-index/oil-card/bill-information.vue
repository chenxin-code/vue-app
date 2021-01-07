<template>
  <div class="bill">
    <nav-top title="账单信息" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="bill-container">
      <van-tabs v-model="active" title-active-color="#3c9df3" color="#3c9df3" @click="changeTab">
        <van-tab :title="tab.text" v-for="(tab, index) in tabList" :key="index">
          <ul class="list">
            <li class="item" v-for="(month, index) in list" :key="index">
              <div class="table-view">
                <div class="table-view-cell">
                  <div class="table-view-cell-text time">{{dealWith(month.monthTime)}}</div>
                </div>
                <div class="table-view-cell">
                  <div class="table-view-cell-text special">
                    <div class="info-list">
                      <div class="oil" v-for="(oilItem, key, index) in month.list" :key="index">
                        <span>{{key}}：</span>
                        <span v-for="(item, index2) in oilItem">{{index2 > 0 ? '、' : ''}}{{item}}</span>
                      </div>
                    </div>
                    <div class="oil-btn">
                      <div class="query-btn" v-if="tab.type == 0" @click="queryBill(month)">账单确定</div>
                      <div class="query-btn" @click="openDetails(month)">详情</div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="no-data theme_font_tint">没有更多数据了~</div>
        </van-tab>
      </van-tabs>
    </nav-content>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        active: 2,
        tabList: [
          {
            text: '待确定',
            type: 0
          },
          {
            text: '已确定',
            type: 1
          }
        ],
        list: [],
        state: 0 // 状态 1:已确认,0:未确认
      }
    },
    mounted() {
      this.erpBillForConfirm() // 获取账单列表
    },
    methods: {
      dealWith(time) {
        // 时间处理
        time = time.slice(0, 4) + '年' + time.slice(4) + '月'
        return time
      },
      changeTab(index, title) {
        this.state = index
        this.list = []
        this.erpBillForConfirm()
      },
      erpBillForConfirm() {
        this.$request.post('/app/json/app_oil_appoint/erpBillForConfirm', {
          state: this.state, // 1:已确认,0:未确认
          departcode: this.vipUnitUser.vipUnitUserCode // 单位客户编码
        }).then(res => {
          if (res.status === 0) {
            let list = res.data || []
            list.forEach(item => {
              item.list = {}
              item.oilBill && item.oilBill.forEach(bill => {
                if (item.list[bill.oilTypeStr]) {
                  item.list[bill.oilTypeStr].push(bill.oilname)
                } else {
                  item.list[bill.oilTypeStr] = [bill.oilname]
                }
              })
            })

            console.log(list)
            this.list = list
          } else {
            this.$Toast(res.info ? res.info : '获取账单信息失败')
          }
        })
      },
      queryBill(month) {
        // 账单确认
        this.$dialog.alert({title: '提示', message: '是否确认该账单？'}).then(() => {
          this.$request.post('/app/json/app_oil_appoint/monthBillConfirm', {
            monthTime: month.monthTime,
            departcode: this.vipUnitUser.vipUnitUserCode // 单位客户编码
          }).then(res => {
            if (res.status === 0) {
              this.$Toast('账单确认成功！')
              this.list = []
              this.erpBillForConfirm()
            } else {
              this.$Toast(res.info ? res.info : '获取账单信息失败')
            }
          })
        })
      },
      openDetails(month) {
        // 打开详情页面
        this.$router.push({path: '/bill-details', query: {
            monthTime: month.monthTime,
            state: this.state,
            departcode: this.vipUnitUser.vipUnitUserCode
          }})
      }
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  $color = #3c9df3
  .bill {
    background-color: #f8f8f8 !important
    .bill-container {
      overflow-y auto
      -webkit-overflow-scrolling touch
    }

    .list {
      padding: 11px 15px

      .item {
        box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
        background: #fff
        border-radius 6px
        margin-bottom: 8px

        .special {
          flex-direction column
          line-height 22px

          .oil {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            -moz-box-orient: vertical;
          }

          .oil-btn {
            width: 100%
            display flex
            justify-content center
            align-items center
            margin-top 8px

            .query-btn {
              padding: 5px
              width: 80px
              border-radius 6px
              background $color
              color: #fff
              display flex
              justify-content center
              align-items center

              & + .query-btn {
                margin-left: 30px
              }
            }
          }
        }

        .time {
          font-size: 14px
        }
      }
    }
  }

  /deep/ .van-hairline--top-bottom::after {
    border: 0
  }
</style>


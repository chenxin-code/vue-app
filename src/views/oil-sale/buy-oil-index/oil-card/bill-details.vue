<template>
  <div class="bill-details">
    <nav-top title="账单详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="bill-details-conyainer">
      <ul class="bill-details-list" v-if="complete">
        <li class="bill-details-item" v-for="(item, index) in oilList" :key="index">
          <div class="title">{{item.oilTypeStr}}</div>
          <div class="van-collapse">
            <div class="table-view special">
              <div class="table-view-cell" v-for="(billItem, index1) in item.oilBill" :key="index1">
                <div class="table-view-cell-text">
                  <div class="left">{{billItem.oilname}}</div>
                  <div class="right">剩余{{billItem.tons}}t</div>
                </div>
              </div>
            </div>
<!--            <van-collapse v-model="activeNames" v-else>-->
<!--              <van-collapse-item v-for="(billItem, index2) in item.oilBill" :key="index2" :title="billItem.oilname" :name="index+index2"-->
<!--                                 :value="`共提油${billItem.tons}t`">-->
<!--                <div class="table-view">-->
<!--                  <div class="table-view-cell oil-list-info" v-for="(item3, index3) in oilList" :key="index3">-->
<!--                    <div class="table-view-cell-text">-->
<!--                      <div class="left">提油时间:2019.1.1 9:11:11</div>-->
<!--                      <div class="right">提油数量:5000kg</div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </van-collapse-item>-->
<!--            </van-collapse>-->
          </div>
        </li>
        <li class="bill-details-item" v-if="$route.query.state == 1">
          <div class="title">订单确认</div>
          <div class="table-view special">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">账单确认人</div>
                <div class="right">{{oilList[0] ? oilList[0].confirmUser : '--'}}</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">确认时间</div>
                <div class="right">{{oilList[0] ? oilList[0].confirmTime : '--'}}</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        oilList: [1, 2, 3],
        oilList2: [1, 2, 3],
        activeNames: ['1'],
        oilRecord: ['1'],
        complete: false
      }
    },
    mounted() {
      this.oilBillGetDetail()
    },
    methods: {
      oilBillGetDetail() {
        this.$request.post('/app/json/app_oil_appoint/oilBillGetDetail', {
          monthTime: this.$route.query.monthTime,
          state: this.$route.query.state, // 1:已确认,0:未确认
          departcode: this.$route.query.departcode // 单位客户编码
        }).then(res => {
          if (res.status === 0) {
            this.oilList = res.data
            this.complete = true
          } else {
            this.$Toast(res.info ? res.info : '获取账单详情失败')
          }
        })
      },
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .bill-details {
    background-color: #f8f8f8 !important

    .bill-details-conyainer {
      padding: 10px 15px

      .bill-details-list {
        height 100%
        overflow auto
        -webkit-overflow-scrolling touch

        .bill-details-item {
          .title {
            padding: 11px 0
            font-size: 16px
          }

          .special {
            background #fff
            border-radius 4px
            line-height 24px

            .left {
              color: #000
            }
          }

          .van-collapse {
            padding: 1px
            background #fff
            border-radius 4px

            /deep/ .van-cell__value {
              color: #323233
            }

            /deep/ .van-cell {
              padding: 10px
            }
          }

          .oil-list-info {
            padding: 8px 0
          }
        }
      }
    }
  }
</style>

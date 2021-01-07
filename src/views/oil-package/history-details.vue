<template>
  <div class="history-details">
    <nav-top title="签约详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="history-details-container" v-if="complete">
      <div class="content">
        <div class="title-info">
          <div class="info">
            <div class="title-name">
              <div class="left">{{myHomeInfo.orderModel.packageRefuelName}}&nbsp;&nbsp;{{myHomeInfo.orderModel.duration}}天</div>
              <div class="right">{{dealState(myHomeInfo.orderModel.state, myHomeInfo.orderModel.startDate, myHomeInfo.orderModel.endDate)}}</div>
            </div>
            <div class="text">开通时间：{{myHomeInfo.orderModel.startDate}}</div>
            <div class="text">到期时间：{{myHomeInfo.orderModel.endDate}}</div>
            <div class="special" v-if="rebate.length && myHomeInfo.orderModel.packageType != 3">当前加油累计返利比例为{{rebate[0].rebate}}%</div>
            <div class="special" v-if="rebate.length && myHomeInfo.orderModel.packageType == 3">您当前加油单笔即时返利为{{rebate[0].rebate}}%</div>
          </div>
        </div>
        <div class="statistical" v-if="myHomeInfo.orderModel.packageType == 2">
          <div class="title">套餐加油统计</div>
          <div class="list">
            <div class="item">
              <div class="oil-info">
                <div class="name">实时返利金额</div>
                <div class="num">{{myHomeInfo.orderModel.rebate || '0'}}</div>
              </div>
              <div class="oil-info">
                <div class="name">结算返回油滴</div>
                <div class="num">{{myHomeInfo.orderModel.settledSumRebate || '0'}}</div>
              </div>
            </div>
            <div class="item">
              <div class="oil-info">
                <div class="name">加油升数</div>
                <div class="num">{{myHomeInfo.orderModel.sumOilLiter || '0'}}</div>
              </div>
              <div class="oil-info">
                <div class="name">加油金额</div>
                <div class="num">{{myHomeInfo.orderModel.sumAmount || '0.00'}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="statistical" v-if="myHomeInfo.orderModel.packageType == 3">
          <div class="title">个人加油统计</div>
          <ul class="list special">
            <li class="item">
              <div class="oil-info">
                <div class="name">加油升数</div>
                <div class="num">{{dealDiffData(1)}}</div>
              </div>
              <div class="oil-info middle">
                <div class="name">实时返利金额</div>
                <div class="num">{{dealDiffData(2)}}</div>
              </div>
              <div class="oil-info">
                <div class="name">加油金额</div>
                <div class="num">{{dealDiffData(3)}}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="statistical" v-else>
          <div class="title">个人加油统计</div>
          <div class="list">
            <div class="item">
              <div class="oil-info">
                <div class="name">实时返利金额</div>
                <div class="num">{{dealDiffData(2)}}</div>
              </div>
              <div class="oil-info">
                <div class="name">结算返回油滴</div>
                <div class="num">{{dealDiffData(4)}}</div>
              </div>
            </div>
            <div class="item">
              <div class="oil-info">
                <div class="name">加油升数</div>
                <div class="num">{{dealDiffData(1)}}</div>
              </div>
              <div class="oil-info">
                <div class="name">加油金额</div>
                <div class="num">{{dealDiffData(3)}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="title">
          <span v-if="myHomeInfo.orderModel.packageType != 3">加油明细</span>
          <span v-if="myHomeInfo.orderModel.packageType == 3">个人返利明细</span>
        </div>
      </div>
      <ul class="details-list">
        <li class="details-item" v-for="(item, index) in oilRecordList" :key="index" v-if="index < 5">
          <div class="info">
            <div class="name">订单号</div>
            <div class="details-text">{{item.orderNo}}</div>
          </div>
          <div class="info">
            <div class="name">加油时间</div>
            <div class="details-text">{{item.tradeTime}}</div>
          </div>
          <div class="info">
            <div class="name">加油升数</div>
            <div class="details-text">{{item.oilLiter || '0'}}</div>
          </div>
          <div class="info">
            <div class="name">加油金额</div>
            <div class="details-text">{{item.amount || '0.00'}}</div>
          </div>
          <!-- <div class="info" v-if="myHomeInfo.orderModel.packageType == 3">
            <div class="name">返利比例</div>
            <div class="details-text">{{(item.rebate/item.amount).toFixed(2)}}%</div>
          </div> -->
          <div class="info">
            <div class="name">实时返利金额</div>
            <div class="details-text">{{item.rebate || '0'}}</div>
          </div>
        </li>
        <div class="more-btn" v-if="oilRecordList.length > 5" @click="openRecord">查看更多加油记录</div>
        <div class="no-data" v-if="oilRecordList.length == 0">
          <div class="img">
            <img src="./image/p1.png" alt="">
          </div>
          <div class="text">暂无数据</div>
        </div>
      </ul>
    </nav-content>
  </div>
</template>

<script>
  import utils from "@/utils/util"

  export default {
    data() {
      return {
        oilRecordList: [], // 加油记录
        oilId: '',
        myHomeInfo: '', // 开通套餐信息
        complete: false,
        rebate: [] // 返利区间
      }
    },
    mounted() {
      this.queryPackageOrderInfo()
    },
    methods: {
      queryPackageOrderInfo() {
        // 查询开通套餐详情
        this.$request.post('/app/json/app_package_refuel/queryPackageOrderInfo', {
          id: this.$route.query.id
        }).then(res => {
          if (res.status === 0) {
            this.myHomeInfo = res.data
            // 获取返利信息
            let ruleDesc = JSON.parse(this.myHomeInfo.orderModel.ruleDesc) || {}
            this.dealRebate(ruleDesc.sumRebate, this.myHomeInfo.orderModel.sumOilLiter || 0)
            let id = ''
            if (this.myHomeInfo.orderModel.packageType == 1) { // 个人
              id = this.myHomeInfo.orderDetailModelList[0].packageRefuelOrderId
            } else { // 家庭
              this.myHomeInfo.orderDetailModelList.forEach(item => { // 查找本人数据
                if (item.userId == this.$store.state.mall2.behalf.userId) {
                  id = item.packageRefuelOrderId
                }
              })
            }
            this.queryPackageRefuelOrderRecord(id) // 加油记录
            this.complete = true
          } else {
            this.$Toast(res.info ? res.info : '获取详情失败')
          }
        })
      },
      dealRebate(arr, num) {
        let arry1 = [].concat(arr).sort((a, b) => a.oilLiter - b.oilLiter)
        let result = []
        for (let i = 0; i < arry1.length - 1; i++) {
          const item = arry1[i]
          const item2 = arry1[i + 1]
          if (item.oilLiter <= num && num < item2.oilLiter) {
            result.push(item)
            result.push(item2)
            break
          } else if (i === (arry1.length - 2) && num >= item2.oilLiter) {
            result.push(item2)
            break
          }
        }
        this.rebate = result
      },
      dealDiffData(type) {
        let sum = ''
        if (this.myHomeInfo.orderModel.packageType == 1) { // 个人
          if (type == 1) { // 加油升数
            return this.myHomeInfo.orderDetailModelList[0].sumOilLiter || '0'
          } else if (type == 2) { // 实时返利金额
            return this.myHomeInfo.orderDetailModelList[0].rebate || '0'
          } else if (type == 3) { // 加油金额
            return this.myHomeInfo.orderDetailModelList[0].sumAmount || '0.00'
          } else if (type == 4) { // 结算返回油滴
            return this.myHomeInfo.orderDetailModelList[0].settledSumRebate || '0'
          }
        } else { // 家庭
          this.myHomeInfo.orderDetailModelList.forEach(item => { // 查找本人数据
            if (item.userId == this.$store.state.mall2.behalf.userId) {
              if (type == 1) { // 加油升数
                sum =  item.sumOilLiter || '0'
              } else if (type == 2) { // 实时返利金额
                sum =  item.rebate || '0'
              } else if (type == 3) { // 加油金额
                sum =  item.sumAmount || '0.00'
              } else if (type == 4) { // 结算返回油滴
                sum =  item.settledSumRebate || '0'
              }
            }
          })
          return sum
        }
      },
      queryPackageRefuelOrderRecord(id) {
        // 加油记录
        this.oilId = id
        this.$request.post('/app/json/app_package_refuel/queryPackageRefuelOrderRecord', {
          packageRefuelOrderId: id
        }).then(res => {
          if (res.status === 0) {
            this.oilRecordList = res.data
          } else {
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
        })
      },
      openRecord() {
        // 打开加油记录
        this.$router.push({path: '/oil-record', query: {id: this.oilId, packageType: this.myHomeInfo.orderModel.packageType}})
      },
      dealTime(date) {
        return date.split(' ')[0]
      },
      dealState(state, start, end) {
        let date = utils.getMyDate(new Date()) // 当前时间
        if (state == 'WAIT_SIGN_UP') {
          return '待签约'
        } else if (state == 'SIGNED_UP') {
          let compareBegin = utils.dateCompare(date, start.split(' ')[0])
          let compareEnd = utils.dateCompare(date, end.split(' ')[0])
          if (compareBegin == 1) {
            return '未开始'
          } else if ((compareBegin == 0 || compareBegin == -1) && (compareEnd == 1 || compareEnd == 0)) {
            return '签约中'
          } else {
            return '已结束'
          }
        } else if (state == 'SETTLED') {
          return '已结算'
        } else if (state == 'CANCELED') {
          return '已取消'
        }
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .history-details {
    background-color: #f8f8f8 !important

    .history-details-container {
      padding: 11px 0
      overflow-y auto
      -webkit-overflow-scrolling touche

      .content {
        .title-info {
          .info {
            padding: 11px 15px
            background #fff
            line-height 24px

            .title-name {
              font-size 14px
              color: $color-text
              display flex
              justify-content space-between
              align-items center

              .right {
                color $color-theme-r
                font-size 12px
              }
            }

            .text {
              color: $color-text-d
            }

            .special {
              color: $color-text-l
            }
          }
        }

        .statistical {
          .special {
            background #fff
            padding: 15px 5px
            font-size 10px

            .item {
              display flex
              justify-content space-between
              align-items center

              .oil-info {
                flex: 1
                background #f3f2f2
                height 75px
                border-radius 6px
                display flex
                justify-content center
                align-items center
                flex-direction column
                line-height 24px

                & + .oil-info {
                  margin-left: 8px
                }

                .num {
                  font-size 16px
                  color: $color-theme-r
                  word-wrap: break-word;
                  word-break: break-all;
                  overflow: hidden;
                  text-align: center
                  line-height 22px
                }
              }

              .middle {
                box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
                background #fff

                .num {
                  font-size 24px
                }
              }
            }
          }

          .list {
            background #fff
            padding:0 5px
            font-size 10px

            .item {
              display flex
              justify-content space-between
              align-items center
              & + .item {
                border-top: 1px solid #f5f5f5
              }

              .oil-info {
                flex: 1
                padding: 15px 0
                text-align center
                line-height 24px

                .num {
                  font-size 18px
                  color: $color-theme-r
                  word-wrap: break-word;
                  word-break: break-all;
                  overflow: hidden;
                  line-height 18px
                }
              }
            }
          }
        }
        .title {
          padding: 10px 15px
        }
      }
      .details-list {
        max-height 400px
        overflow-y auto
        -webkit-overflow-scrolling touch
        .details-item {
          line-height 26px
          background #fff
          padding: 11px 15px
          margin-bottom: 10px

          .info {
            display flex
            justify-content space-between

            .name {
              width: 150px
              color: $color-text-d
            }
            .details-text {
              word-break:break-all;
              line-height 15px
            }
          }
        }
      }
      .more-btn {
        text-align center
        padding: 5px 0 11px 0
        color: $color-theme-r
        font-size 14px
      }
      .no-data {
        display flex
        justify-content center
        align-items center
        flex-direction column
        padding: 30px 0
        color: $color-text-d
        background #fff
        .img {
          padding-bottom: 20px
          img {
            width: 100px
          }
        }
      }
    }
  }

</style>

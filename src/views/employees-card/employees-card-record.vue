<template>
  <div class="employees-card-record">
    <nav-top title="历史记录" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="employees-card-record-container" v-if="complete">
      <div class="title">
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">我的油站</div>
              <div class="right">{{carddetails.ouName || '--'}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">我的员工卡</div>
              <div class="right">{{carddetails.cardNum}}张</div>
            </div>
          </div>
        </div>
      </div>
      <div class="title">
        <div class="table-view">
          <div class="table-view-cell" @click="show = true">
            <div class="table-view-cell-text">
              <div class="left">切换数据</div>
              <div class="right">{{type}}<van-icon size="14px" name="exchange" /></div>
            </div>
          </div>
          <div class="table-view-cell" @click="showDate = true">
            <div class="table-view-cell-text">选择日期</div>
            <div class="table-view-cell-arrow">{{time}}</div>
          </div>
          <div class="table-view-cell" v-if="type == '班结' && carddetails.clazzTime.length">
            <div class="table-view-cell-text">
              <van-radio-group v-model="radio" @change="change">
                <van-cell-group>
                  <van-cell v-for="(item, index) in carddetails.clazzTime" :key="index" clickable>
                    <div slot="title" class="pay-label">{{item}}</div>
                    <van-radio :name="index" checked-color="#F80F16"/>
                  </van-cell>
                </van-cell-group>
              </van-radio-group>
            </div>
          </div>
          <div class="table-view-cell" v-else-if="type == '日结' && carddetails.clazzTime.length == 1">
            <div class="table-view-cell-text">
              <div class="left">时间：</div>
              <div class="right">{{carddetails.clazzTime[0]}}</div>
            </div>
          </div>
          <div class="tips" v-else>无法查到历史记录</div>
          <div class="table-view-cell" v-if="carddetails.clazzTime.length" @click="openOderRecord">
            <div class="table-view-cell-text">加油订单</div>
            <div class="table-view-cell-arrow">查看</div>
          </div>
        </div>
      </div>
      <div class="have-recode" v-if="carddetails.cardNum > 0">
        <div class="have-data">
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
      </div>
      <div class="tips" v-else>无法查到班结数据</div>
<!--      班结日结切换弹框-->
      <van-popup
        v-model="show"
        position="bottom"
      >
        <van-picker
          show-toolbar
          title="选择类型"
          :columns="columns"
          @cancel="show = false"
          @confirm="onConfirm"
        />
      </van-popup>
      <!--      日期选择弹框-->
      <van-popup
        v-model="showDate"
        position="bottom"
      >
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          @cancel="showDate = false"
          @confirm="confirmDate"
        />
      </van-popup>
    </nav-content>
  </div>
</template>

<script>
  import util from '@/utils/util'
  export default {
    data() {
      return {
        complete: false,
        show: false, // 班结日结切换弹框
        showDate: false, // 日期选择弹框
        timeList: [1, 3, 4],
        radio: 0,
        columns: ['班结', '日结'],
        type: '班结',
        currentDate: '',
        time: '',
        haveRecode: true, // 有无历史记录
        haveData: true, // 有无班结数据
        carddetails: '' // 详情
      }
    },
    mounted() {
      this.time = this.$route.query.timeStrYes
      this.currentDate = new Date(this.time)
      this.homePage()
    },
    methods: {
      change() {
        // 切换班次
        this.homePage()
      },
      homePage() {
        this.$request.post('/app/json/app_employee_card/homePage', {
          type: this.type == '班结' ? 1 : 2, // 数据类型 1班结 2日结
          timeStr: this.time, // 日期 2019-09-30 如果传递日期代表是查看历史数据
          clazzNo: this.type == '班结' ? this.radio + 1 : '' // 1 2 3 查看历史班结数据,如果查看当前班结数据不传此字段
        }).then(res => {
          if (res.status === 0) {
            this.complete = true
            this.carddetails = res.data
            this.type = this.carddetails.type == 1 ? '班结' : '日结'
          } else {
            this.$Toast(res.info ? res.info : '获取数据失败')
          }
        })
      },
      onConfirm(value) {
        // 确定切换班结日结
        this.type = value
        this.show = false
        this.radio = 0
        this.homePage()
      },
      confirmDate(value) {
        // 确认选择日期
        console.log(value)
        this.time = util.getMyDate(value)
        this.showDate = false
        this.radio = 0
        this.homePage()
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
  .employees-card-record {
    background-color: #f8f8f8 !important
    .employees-card-record-container {
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
            .van-icon {
              padding-left: 5px
            }
          }
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
      .tips {
        text-align center
        color: $color-text-d
        padding: 20px
      }
    }
  }
  /deep/ .van-radio {
    display inline-block
  }
  /deep/ .van-cell__title, .van-cell__value {
    flex: unset
    padding-left 2px
  }
  /deep/ .van-cell {
    padding: 11px 1px
  }
  /deep/ .van-cell:not(:last-child)::after {
    border-bottom 0px
  }
  /deep/ .van-hairline--top-bottom::after {
    border-width: 0
  }
</style>

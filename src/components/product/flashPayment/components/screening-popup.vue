<template>
  <div>
    <div class="screening" @click="sideFiltrateModalShow = true" v-show="!sideFiltrateModalShow">筛选</div>
    <div class="screening" @click="sideFiltrateModalShow = false" v-show="sideFiltrateModalShow">关闭</div>
    <transition name="filtrate">
      <div class="filtrate-modal-wrapper" :style="{top: ($store.state.barHeight+$market.getNavHeight() + 40 )+ 'px'}"
           ref="sideFiltrateModal" v-if="sideFiltrateModalShow">
        <div class="filtrate-container">
          <div class="filtrate-content">
            <div class="content">
              <div class="change-list money">
                <div class="title">油站查询</div>
                <ul class="time-list">
                  <li class="item oil-station">
                    <div class="text">
                      <input type="text"
                             placeholder="请输入油站"
                             v-model="oilStation">
                    </div>
                  </li>
                </ul>
              </div>
<!--              <div class="change-list">-->
<!--                <div class="title">油站选择</div>-->
<!--                <ul class="list">-->
<!--                  <li class="item"-->
<!--                      v-for="(item, index) in oilStationList"-->
<!--                      :key="index"-->
<!--                      @click="changeStation(item, index)"-->
<!--                      :class="{'change': station == index}"-->
<!--                      v-if="stationAll ? index == 0 || index : index < 8"-->
<!--                  >-->
<!--                    <div class="text">油站A001</div>-->
<!--                  </li>-->
<!--                  <li class="item" @click="stationAll = !stationAll">-->
<!--                    <div class="text">{{stationAll ? '收起' : '展开全部'}}</div>-->
<!--                  </li>-->
<!--                </ul>-->
<!--              </div>-->
              <div class="change-list">
                <div class="title">油品名称</div>
                <ul class="list special">
                  <li class="item"
                      v-if="oilAll ? index == 0 || index : index < 5"
                      v-for="(item, index) in oilStationList"
                      :key="index"
                      :class="{'change': oil == index}"
                      @click="changeOil(item, index)"
                  >
                    <div class="text">{{item.skuName}}</div>
                  </li>
                  <li class="item" @click="oilAll = !oilAll" v-if="oilStationList.length > 6">
                    <div class="text">{{oilAll ? '收起' : '展开全部'}}</div>
                  </li>
                </ul>
              </div>
              <div class="change-list money">
                <div class="title">单笔金额</div>
                <ul class="time-list">
                  <li class="item">
                    <div class="text">
                      <input type="text"
                             placeholder="请输入金额"
                             v-model="smallMoney">
                    </div>
                  </li>
                  &nbsp;-&nbsp;
                  <li class="item">
                    <div class="text">
                      <input type="text"
                             placeholder="请输入金额"
                             v-model="bigMoney">
                    </div>
                  </li>
                </ul>
              </div>
              <div class="change-list">
                <div class="title">支付方式</div>
                <ul class="list special">
                  <li class="item"
                      v-if="payStyleAll ? index == 0 || index : index < 5"
                      v-for="(item, index) in payStyleList"
                      :key="index"
                      :class="{'change': payStyle == index}"
                      @click="changePayStyle(item, index)"
                  >
                    <div class="text">{{item.payName}}</div>
                  </li>
                  <li class="item" @click="payStyleAll = !payStyleAll" v-if="payStyleList.length > 6">
                    <div class="text">{{payStyleAll ? '收起' : '展开全部'}}</div>
                  </li>
                </ul>
              </div>
<!--              <div class="change-list pay-stype">-->
<!--                <div class="title">支付方式</div>-->
<!--                <ul class="list special">-->
<!--                  <li class="item"-->
<!--                      v-for="(item, index) in payStyleList"-->
<!--                      :key="index"-->
<!--                      @click="changePayStyle(item, index)"-->
<!--                      :class="{'change': payStyle == index}">-->
<!--                    <div class="text">{{item}}</div>-->
<!--                  </li>-->
<!--                </ul>-->
<!--              </div>-->
              <div class="change-list">
                <div class="title">统计时间范畴</div>
                <ul class="time-list">
                  <li class="item" @click="showStartTime = true">
                    <div class="text">{{beginTime}}</div>
                  </li>
                  &nbsp;-&nbsp;
                  <li class="item" @click="showEndTime = true">
                    <div class="text">{{endTime}}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="filtrate-btn">
            <button class="l-btn u-confirm clear" @click="clearData">重置</button>
            <button class="l-btn u-confirm" @click="confirm">查询</button>
          </div>
        </div>
        <!--开始时间弹框-->
        <van-popup position="bottom" v-model="showStartTime">
          <van-datetime-picker
            v-model="currentDateStart"
            type="year-month"
            @confirm="confirmActivitesTime"
            @cancel="showStartTime = false"
            @change="setColumnValue"
          />
        </van-popup>
        <!--结束时间弹框-->
        <van-popup position="bottom" v-model="showEndTime">
          <van-datetime-picker
            v-model="currentDateEnd"
            type="year-month"
            @confirm="confirmEndTime"
            @cancel="showEndTime = false"
            @change="setColumnValue"
          />
        </van-popup>
      </div>
    </transition>
  </div>
</template>

<script>
  import util from '@/utils/util'

  export default {
    data() {
      return {
        stationAll: false, // 油站的展开全部
        oilAll: false, // 油品的展开全部
        payStyleAll: false, // 支付方式
        sideFiltrateModalShow: false, // 筛选弹框
        screen: '筛选',
        oilStationList: [],
        payStyleList: [],
        station: '-1',
        oil: '-1',
        payStyle: '-1',
        showStartTime: false, // 开始时间弹框
        showEndTime: false, // 结束时间弹框
        currentDateStart: new Date(), // 开始时间弹框内容
        currentDateEnd: new Date(), // 结束时间弹框内容
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
        smallMoney: '', // 最小金额
        bigMoney: '', // 最大金额
        oilStation: '', // 油站
        dateBegin: '',
        dateEnd: '',
        oilDetails: '', // 油品信息
        payDetails: '' // 支付方式信息
      }
    },
    props: {
      isShowChangeCard: {
        type: Boolean,
        default: true
      },
      isShowChangeOilName: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      this.beginTime = util.getMyMonth(new Date())
      this.endTime = util.getMyMonth(new Date())
      this.dealDate()
      this.queryPayModeList()
      this.queryOilTypeList()
    },
    methods: {
      queryPayModeList() {
        // 支付方式
        this.$request.post('/app/json/app_stock_month_bills/queryPayModeList', {
          userId: this.$store.state.userInfo.userId
        }).then(res => {
          if (res.status === 0) {
            this.payStyleList = res.data
          } else {
            this.$Toast(res.info ? res.info : '获取支付方式失败')
          }
        })
      },
      queryOilTypeList() {
        // 油品类型
        this.$request.post('/app/json/app_stock_month_bills/queryOilTypeList', {
          userId: this.$store.state.userInfo.userId
        }).then(res => {
          if (res.status === 0) {
            this.oilStationList = res.data
          } else {
            this.$Toast(res.info ? res.info : '获取油品类型失败')
          }
        })
      },
      clearData() {
        // 重置按钮
        this.station = '-1'
        this.oil = '-1'
        this.oilStation = ''
        this.smallMoney = ''
        this.bigMoney = ''
        this.payStyle = '-1'
        this.beginTime = util.getMyMonth(new Date())
        this.endTime = util.getMyMonth(new Date())
      },
      dealDate() {
        this.beginTime = util.getMyMonth(new Date())
        this.endTime = util.getMyMonth(new Date())
        let dateList1 = this.beginTime.split('-')
        let dateList2 = this.endTime.split('-')
        this.dateBegin = util.getDealMonthFromSpecific(dateList1[0], dateList1[1])
        this.dateEnd = util.getDealMonthFromSpecific(dateList2[0], dateList2[1])
      },
      confirm() {
        // 查询按钮
        this.sideFiltrateModalShow = !this.sideFiltrateModalShow // 关闭弹框
        this.$emit('childToDadValue', {
          oilStation: this.oilStation, // 油站
          smallMoney: this.smallMoney, // 最小金额
          bigMoney: this.bigMoney, // 最大金额
          beginTime: this.dateBegin.start, // 开始时间
          endTime: this.dateEnd.end, // 结束时间
          oilDetails: this.oilDetails, // 油品信息
          payDetails: this.payDetails // 支付方式信息
        })
      },
      // onInput(type) {
      //   let money = ''
      //   if (type == 1) {
      //     this.smallMoney = money
      //   } else {
      //     this.bigMoney = money
      //   }
      //   if (money.substring(0, 1) === '.') {
      //     this.$Toast('请输入正确金额')
      //     money = ''
      //   }
      //   money = money.replace(/\.{2,}/g, ".").replace(".","$#$").replace(/\./g,"").replace("$#$",".").replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
      // },
      confirmActivitesTime(value) {
        // 开始时间 确认按钮
        this.showStartTime = false
        this.beginTime = util.getMyMonth(value)
        let dateList = this.beginTime.split('-')
        this.dateBegin = util.getDealMonthFromSpecific(dateList[0], dateList[1])
      },
      confirmEndTime(value) {
        // 结束时间 确认按钮
        this.showEndTime = false
        this.endTime = util.getMyMonth(value)
        let dateList = this.endTime.split('-')
        this.dateEnd = util.getDealMonthFromSpecific(dateList[0], dateList[1])
      },
      setColumnValue(index, value) {
        // 获取时间对应列中选中的值
        index = new Date()
      },
      // changeStation(item, index) {
      //   // 选择油站
      //   this.station = index
      // },
      changeOil(item, index) {
        // 选择油品
        this.oil = index
        this.oilDetails = item
      },
      changePayStyle(item, index) {
        // 选择支付方式
        this.payStyle = index
        this.payDetails = item
      }
    },
    computed: {},
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "~@/common/stylus/mixin.styl"
  .screening {
    font-size: 16px
    text-align right
  }

  .filtrate-modal-wrapper {
    background-color: #fff !important
    bdr-t()
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 0;
    z-index: 900;
    transition: all 0.3s

    .filtrate-container {
      width: 100%;
      height: 100%;
    }

    .filtrate-tit {
      font-weight: normal;
      height 40px
      line-height: 40px;
      padding-left: 10px
      box-shadow: 2px 0 15px 0 rgba(0, 0, 0, 0.1);
      z-index: 9;
      position: relative;
      display flex
      align-items center
      font-size: 14px;
      border-top: 1px solid rgba(220, 220, 220, 0.18);
    }

    .filtrate-content {
      position: absolute;
      top: 0
      bottom: 44px;
      width: 100%;
      overflow-y: auto
      -webkit-overflow-scrolling touch
      padding: 11px 15px
    }

    .filtrate-btn {
      bdr-t()
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 44px;
      display: flex;

      .reset, .u-confirm {
        flex: 1;
        width 100%
        text-align: center;
        line-height: 44px;
        font-size: 16px;
        background: #fff;
      }

      .u-confirm {
        background: $color-theme-r;
        color: #fff;
      }

      .clear {
        background #ffd3d4
        color: $color-theme-r
      }

      .query {
        color: #fff;
      }
    }
  }

  .filtrate-enter-active, .filtrate-leave-active {
    transition: all .3s;
  }

  .filtrate-enter, .filtrate-leave-to {
    transform: translate3d(100%, 0, 0)
  }

  .content {
    padding: 10px 0

    .change-list {
      display flex
      flex-direction column
      max-height: 150px

      .title {
        flex-shrink 0
        padding: 10px 10px
      }

      .list {
        flex: 1
        overflow-y auto
        -webkit-overflow-scrolling touch
        padding: 0 10px 0 0

        .item {
          float left
          width: 33.33%
          padding: 0 0 8px 10px
          overflow hidden

          .text {
            word-break:keep-all;//不换行
            word-break:break-all;//换行
            white-space:nowrap;//不换行
            border-radius 20px
            padding: 6px 0
            width: 100%
            border: 1px solid $color-line-gray-l
            text-align center
            color: $color-text-d
          }
        }

        .change {
          .text {
            border-color $color-theme-r
            color: $color-theme-r
          }
        }
      }

      .special {
        .item {
          width: 50%
        }
      }

      .time-list {
        display flex
        justify-content space-between
        align-items center
        padding: 0 10px

        .item {
          flex: 1

          .text {
            border-radius 20px
            padding: 8px 0
            width: 100%
            border: 1px solid $color-line-gray-l
            text-align center
            color: $color-text-d
          }
        }
      }
    }

    .pay-stype {
      height: auto
    }
    .money {
      height: auto
      .oil-station {
        flex: inherit !important
        width 50%
      }
      .text {
        padding: 5px 0 !important
        input {
          text-align center
        }
      }
    }
  }
</style>

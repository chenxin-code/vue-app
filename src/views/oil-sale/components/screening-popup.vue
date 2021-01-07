<template>
  <div>
    <div class="screening" @click="sideFiltrateModalShow = true" v-show="!sideFiltrateModalShow">筛选</div>
    <div class="screening" @click="sideFiltrateModalShow = false" v-show="sideFiltrateModalShow">关闭</div>
    <transition name="filtrate">
      <div class="filtrate-modal-wrapper" :style="{top: ($store.state.barHeight+$market.getNavHeight())+ 'px'}"
           ref="sideFiltrateModal" v-if="sideFiltrateModalShow">
        <div class="filtrate-container">
          <div class="filtrate-content">
            <div class="change-time">
              <div class="table-view time-text">
                <div class="table-view-cell info" @click="showStartTime = true">
                  <div class="table-view-cell-text">开始时间</div>
                  <div class="table-view-cell-arrow">{{beginTime}}</div>
                </div>
                <div class="table-view-cell info" @click="showEndTime = true">
                  <div class="table-view-cell-text">结束时间</div>
                  <div class="table-view-cell-arrow">{{endTime}}</div>
                </div>
              </div>
            </div>
            <div class="card-num" v-show="isShowChangeCard">
              <div class="title">提油卡号</div>
              <ul class="list">
                <li class="item" v-for="(item, index) in cardList" :key="index">
                  <div class="item" :class="{'active': num == index}" @click="changeCard(index, item.userCard)">
                    {{item.userCard}}
                  </div>
                </li>
              </ul>
            </div>
            <div class="card-num" v-show="isShowChangeOilName">
              <div class="title">油品选择</div>
              <ul class="list">
                <li class="item" v-for="(item, index) in oilNameList" :key="index">
                  <div class="item" :class="{'active': oil == index}" @click="changeOil(index, item.oilname)">
                    {{item.oilname}}
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="filtrate-btn">
            <button class="l-btn u-confirm" @click="clearData">清除</button>
            <button class="l-btn u-confirm theme_bg_blue_i" @click="confirm">确定</button>
          </div>
        </div>
      </div>
    </transition>
    <!--开始时间弹框-->
    <van-popup position="bottom" v-model="showStartTime">
      <van-datetime-picker
        v-model="currentDateStart"
        type="date"
        @confirm="confirmActivitesTime"
        @cancel="showStartTime = false"
        @change="setColumnValue"
      />
    </van-popup>
    <!--结束时间弹框-->
    <van-popup position="bottom" v-model="showEndTime">
      <van-datetime-picker
        v-model="currentDateEnd"
        type="date"
        @confirm="confirmEndTime"
        @cancel="showEndTime = false"
        @change="setColumnValue"
      />
    </van-popup>
  </div>
</template>

<script>
  import {Popup, DatetimePicker} from 'vant'
  import util from '@/utils/util'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        sideFiltrateModalShow: false, // 筛选弹框
        screen: '筛选',
        showStartTime: false, // 开始时间弹框
        showEndTime: false, // 结束时间弹框
        currentDateStart: new Date(), // 开始时间弹框内容
        currentDateEnd: new Date(), // 结束时间弹框内容
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
        cardList: [],
        oilNameList: [],
        num: '0',
        oil: '0',
        changeNum: '', // 选择卡号
        changeOilName: '' // 选择卡号
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
      this.getOilCardList()
      this.appQueryTakeOilNameList()
    },
    methods: {
      confirmActivitesTime(value) {
        // 开始时间 确认按钮
        this.showStartTime = false
        this.beginTime = util.getMyDate(value)
      },
      confirmEndTime(value) {
        // 结束时间 确认按钮
        this.showEndTime = false
        this.endTime = util.getMyDate(value)
      },
      setColumnValue(index, value) {
        // 获取时间对应列中选中的值
        index = new Date()
      },
      confirm() {
        // 确认按钮  
        let cardNum = this.changeNum
        let oilName = this.changeOilName
        this.sideFiltrateModalShow = !this.sideFiltrateModalShow;
        this.$emit('childToDadValue', [this.beginTime, this.endTime, cardNum, oilName]) // 这里的提油卡号是个索引  需匹配真实卡号
      },
      clearData() {
        // 清除按钮
        this.beginTime = ''
        this.endTime = ''
        this.changeNum = '0'
      },
      changeCard(index, item) {
        this.num = index
        this.changeNum = item
      },
      changeOil(index, item) {
        this.oil = index
        this.changeOilName = item
      },
      getOilCardList() {// 获取油卡列表
        let formdata = {
          token: this.$store.state.login.token,
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
        }
        // let formDataJson = {}
        this.$request.post('/app/json/app_oil_appoint/appQueryTakeOilCardList', formdata)
          .then(res => {
            if (res.status === 0) {
              let data = res.data
              this.cardList = data
            } else {
            }
          }).catch(err => {
        })
      },
      appQueryTakeOilNameList() {
        // 获取油品名称
        this.$request.post('/app/json/app_oil_appoint/appQueryTakeOilNameList', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
        }).then(res => {
          if (res.status === 0) {
            this.oilNameList = res.data
          } else {
            this.$Toast(res.info ? res.info : '获取油品名称失败')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
    components: {
      [Popup.name]: Popup,
      [DatetimePicker.name]: DatetimePicker,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "~@/common/stylus/mixin.styl"
  .screening {
    font-size: 16px
    text-align right
    margin-right: 15px
  }

  .filtrate-modal-wrapper {
    background-color: #f8f8f8 !important
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
        background: #bfdef0;
        color: #fff;
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

  .change-time {
    .time-text {
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
      border-radius 4px
      color: #009cf6
      font-size 14px

      .info {
        padding: 0 15px
        border-radius 0
      }
    }
  }

  .card-num {
    padding: 11px 15px
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
    border-radius 4px
    color: #009cf6
    font-size 14px
    margin: 10px 0

    .list {
      overflow hidden

      .item {
        float left
        width: 50%
        display flex
        justify-content center
        align-items center
        color: $color-text
        margin-bottom: 5px

        .item {
          height: 26px
          width: 95%
          background: $color-background-ll
          border-radius 20px
        }

        .active {
          background #e3f5ff
          color: #009cf6
        }
      }
    }
  }
</style>

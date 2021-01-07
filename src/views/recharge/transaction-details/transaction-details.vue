<template>
  <div ref="balanceContainer" class="reset-bg">
    <nav-top @backEvent="$router.go(-1)" title="交易明细"></nav-top>
    <!-- 内容区域 -->
    <nav-content>
      <div class="container" v-if="complete">
        <div class="top-filter" v-if="source == 'yj'">
          <div @click="choseType" class="filter-btn">{{ choseTypeName }}交易类型
            <i :class="{active: isShowSelect}" class="icon iconfont mall-arrow-down"></i>
          </div>
          <div @click="show = true" class="filter-btn">{{ currentYear }}年{{ currentMonth }}月
            <i :class="{active: show}" class="icon iconfont mall-arrow-down"></i>
          </div>
          <transition name="slide">
            <ul v-show="isShowSelect" class="filter-select">
              <li @click="typeConfirm(1)" class="item">全部</li>
              <li v-for="(item, index) in selectData" :key="index" @click="typeConfirm(item, index)" class="item">
                {{item}}
              </li>
            </ul>
          </transition>
          <transition name="fade">
            <div
              v-show="isShowSelect"
              class="my-overlay"
              @click="overlayClick"></div>
          </transition>
        </div>
        <div class="top-filter"v-else>
          <div class="tab-swiper filter-btn" >
            <van-tabs :swipe-threshold="swipeThreshold" @click="onClick">
              <van-tab v-for="(item, index) in serviceList" :key="index" :title="item.skuName">
              </van-tab>
            </van-tabs>
          </div>
          <div @click="show = true" class="filter-btn month-tab">
            <span class="segmentation">|</span>
            {{ currentYear }}年{{ currentMonth }}月
            <i :class="{active: show}" class="icon iconfont mall-arrow-down"></i>
          </div>
        </div>
        <van-list class="detail-list" v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
          <div
            v-for="(item, index) in productList"
            :key="index"
            @click="detailClick(item)"
            class="detail-item">
            <div class="icon">
              <img
                v-if="item.payTypeCode == 100"
                src="../assets/image/detail-item-2.png"
                alt="">
              <img
                v-else-if="item.payTypeCode == 200"
                src="../assets/image/detail-item-3.png"
                alt="">
              <img
                v-else="item.payTypeCode == 300"
                src="../assets/image/detail-item-1.png"
                alt="">
            </div>
            <div class="content">
              <p>{{ item.payTypeName }}</p>
              <p class="time">订单号：{{ item.orderNo }}</p>
              <p class="time">{{ item.tradeTime }}</p>
            </div>
            <div v-if="source == 'yj'">
              <div class="lessPrice" :class="{'addPrice': item.amount > 0}">{{ item.amount }}</div>
            </div>
            <div v-if="source == 'count'" class="count-item">
              <div class="count-num" v-for="(countItem, index2) in item.serviceItems" :key="index2">{{countItem.skuName}} {{countItem.useTimes}}次</div>
            </div>
          </div>
        </van-list>
      </div>
    </nav-content>
    <van-popup position="bottom" v-model="show">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        @confirm="confirmDate"
        @cancel="show = false"
        :formatter="formatter"/>
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Toast, DatetimePicker} from 'vant'
  import Scroll from '@/components/base/scroll/scroll.vue'
  import util from '@/utils/util'

  export default {
    name: 'recharge-result',
    components: {
      Toast,
      Scroll,
      [DatetimePicker.name]: DatetimePicker
    },
    data() {
      return {
        isShowSelect: false,
        currentDate: new Date(),
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth() + 1,
        show: false,
        choseTypeName: '全部',
        selectData: {},
        productList: [],
        source: '', // 页面来源
        payTypeCode: '', // 卡类型编码
        tradeTimeStr: '', // 交易时间
        addPrice: '', // 价钱
        loading: false,
        finished: false,
        page: 0,
        swipeThreshold: 3,
        complete: false,
        serviceList: [], // 服务列表
        skuCode: ''
      }
    },
    mounted() {
      this.source = this.$route.query.source
      if (this.source == 'yj') {
        this.tradeType()
      } else if (this.source == 'count') {
        this.getAccount()
      }
      if (this.source == 'count') {
        this.payTypeCode = ''
      }
    },
    methods: {
      tradeType() {
        // 获取交易类型
        let paramsData = {
          token: this.$store.state.login.token
        }
        this.$request.post('/app/json/app_user_easy_card/tradeType', paramsData).then(res => {
          this.complete = true
          if (res.status == 0) {
            this.selectData = res.data
          } else {
            this.$Toast(res.info)
          }
        })
      },
      getAccount() {
        // 获取服务内容
        let paramsData = {
          token: this.$store.state.login.token,
          id: this.$route.query.id
        }
        this.$request.post('/app/json/app_user_easy_card/getAccount', paramsData).then(res => {
          this.complete = true
          if (res.status == 0) {
            this.serviceList = res.data
            this.skuCode = this.serviceList[0].skuCode
          } else {
            this.$Toast(res.info)
          }
        })
      },
      loadMore() {
        // 获取交易明细
        this.page = this.page + 1
        let paramsData = {
          token: this.$store.state.login.token,
          cardNo: this.$route.query.easyCardModel, // 卡号
          payTypeCode: this.payTypeCode, // 卡类型编码
          tradeTimeStr: this.tradeTimeStr, // 交易时间
          skuCode: this.skuCode,
          page: this.page,
          id: this.$route.query.id,
          rows: 10
        }
        // this.$request.post('/app/jqGrid/app_user_easy_card/tradeDetailed', paramsData).then(res => {
        this.$request.post('/app/json/app_user_easy_card/tradeDetailed', paramsData).then(res => {
          if (res.status == 0) {
            this.productList = this.productList.concat(res.data) || []
            if (this.productList.length >= res.totalRecords) {
              this.finished = true
            }
          } else {
            this.finished = true
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
          this.loading = false
        })
      },
      detailClick(item) {
        if (item.payTypeCode == 100 && this.source == 'yj') {
          this.$router.push({
            path: '/recharge/recharge-details',
            query: {
              orderNo: item.orderNo
            }
          })
        }
      },
      onClick(index, title) {
        // 计次卡tab
        let skuCode = ''
        this.serviceList.map(item => {
          if (item.skuName == title) {
            skuCode = item.skuCode
          }
        })
        this.skuCode = skuCode
        this.page = 0
        this.loading = false
        this.hasMore = true
        this.productList = []
        this.loadMore()
      },
      choseType() {
        this.isShowSelect = !this.isShowSelect
      },
      confirmDate(value) {
        this.tradeTimeStr = util.getMyMonth(value)
        this.currentYear = new Date(this.currentDate).getFullYear()
        this.currentMonth = new Date(this.currentDate).getMonth() + 1
        this.show = false
        this.page = 0
        this.loading = false
        this.hasMore = true
        this.productList = []
        this.loadMore()
      },
      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`;
        } else if (type === 'month') {
          return `${value}月`
        }
        return value;
      },
      // 遮罩层点击
      overlayClick() {
        this.isShowSelect = false
      },
      // 类型选择确认
      typeConfirm(item, index) {
        if (item == 1) {
          this.choseTypeName = '全部'
          this.payTypeCode = ''
        } else {
          this.choseTypeName = item
          this.payTypeCode = index
        }
        this.isShowSelect = false
        this.page = 0
        this.loading = false
        this.hasMore = true
        this.productList = []
        this.loadMore()
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl'
  @import '~@/common/stylus/mixin.styl'
  @keyframes slide {
    0% {
      transform translateY(-100%)
    }
    100% {
      transform translateY(0)
    }
  }

  @keyframes fade {
    0% {
      background-color rgba(0, 0, 0, 0)
    }
    100% {
      background-color rgba(0, 0, 0, .7)
    }
  }

  .slide-enter-active {
    animation slide .3s linear
  }

  .slide-leave-active {
    animation slide .3s linear reverse
  }

  .fade-enter-active {
    animation fade .3s linear
  }

  .fade-leave-active {
    animation fade .3s linear reverse
  }

  .my-overlay {
    position fixed
    top 125px
    left 0
    width 100%
    height 100%
    background-color rgba(0, 0, 0, .7)
    z-index 10
  }


  .reset-bg {
    background-color #F6F6F6 !important
  }

  .container {
    display flex
    flex-direction column
    height 100%

    .top-filter {
      display flex
      justify-content space-between
      text-align center
      font-size 16px
      position relative
      flex-shrink 0
      background #fff
      padding: 0 5px

      .filter-btn {
        background-color #fff
        width 100%
        height 50px
        line-height 50px
        position relative
        z-index 20

        .icon {
          position absolute
          transition all .3s

          &.active {
            transform rotate(-180deg)
          }
        }
      }

      .filter-select {
        background-color #fff
        padding 0 20px
        text-align left
        position absolute
        left 0
        right 0
        top 50px
        z-index 19

        .item {
          height 45px
          line-height 45px
          padding: 0 25px
          bdr-t()
        }
      }
    }

    .total {
      padding 0 15px
      text-align right

      .income,
      .outlay {
        padding-top 10px
      }
    }

    .detail-list {
      margin-top 10px
      background-color #F6F6F6
      flex 1
      overflow-y auto
      -webkit-overflow-scrolling touch

      .detail-item {
        display flex
        align-items center
        padding 15px
        background-color #fff
        margin-bottom 10px

        .icon {
          width: 16%

          img {
            display block
            width 40px
            height 40px
            margin 0 auto
          }
        }

        .content {
          flex 3
          font-size 16px

          .time {
            color $color-text-l
            font-size 14px
            margin-top 10px
          }
        }
        .count-item {
          width: 40%
        }

        .lessPrice, .addPrice {
          flex 1
          font-size 20px
          text-align right
          color $color-text-d
        }

        .addPrice {
          color #DF4236
        }

        .count-num {
          font-size 14px
          line-height 20px
          color: $color-text
        }
      }
    }
  }

    .tab-swiper {
      flex: 1
      /deep/ .van-hairline--top-bottom::after {
        border: 0
      }
    }
  .month-tab {
    width: 40% !important
    .segmentation {
      color: $color-line-gray-l
    }
  }
</style>

<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <ul class="top-tab">
        <li
          @click="changeTab(index)"
          class="item"
          v-for="(item, index) in tabs"
          :key="index"
          :class="{active: currentTab == index}">{{ item }}</li>
      </ul>
          <div class="total-info">
          <div class="date" @click="showDatePicker = true">
            <p class="time">{{ startTime }}</p>
            <van-icon name="arrow-down" />
          </div>
          <span style="padding: 0 5px">-</span>
          <div class="date" @click="DatePicker = true">
            <p class="time">{{ endTime }}</p>
            <van-icon name="arrow-down" />
          </div>
          <!--        <div class="info">-->
          <!--          <p class="order-vol">订单量：{{ totalInfo.orderCount }}笔</p>-->
          <!--          <p class="total-amount">总金额：{{ totalInfo.totalAmount }}元</p>-->
          <!--        </div>-->
        </div>
      <van-list
        v-model="isLoading"
        :finished="finished"
        finished-text="没有更多了"
        :offset="200"
        class="order-list"
        @load="loadMore">
        <ul class="order-c">
          <li
            v-for="(item, index) in orderList"
            :key="index"
            @click="seeDetails(item.statisticsTime)"
            class="item">
            <div class="left">
              <p class="phone"><span class="tip" :class="{orange: currentTab !== 0}">共{{item.recommendedOrderNum}}笔订单 总金额{{currentTab !== 0?item.recommendedOilNum:item.recommendedShoppingNum}}元</span></p>
              <p class="time">{{ item.statisticsTime }}</p>
            </div>
            <!-- <div class="center">{{ item.realName }}</div> -->
            <div class="right">
              <!-- <p class="state">已取消</p> -->
              <p class="amount">+{{ $util.toDecimal2(item.empRebate) }}</p>
              <div class="details-btn">查看明细<van-icon name="arrow" /></div>
            </div>
          </li>
        </ul>
      </van-list>
    </nav-content>
    <van-popup v-model="showDatePicker" position="bottom">
      <van-datetime-picker
        v-model="startDate"
        @confirm="confirmChoseDate"
        @cancel="showDatePicker = false"
        :max-date="maxDate"
        :formatter="formatter"
        type="date"/>
    </van-popup>
    <van-popup v-model="DatePicker" position="bottom">
      <van-datetime-picker
        v-model="endDate"
        @confirm="endConfirmChoseDate"
        @cancel="DatePicker = false"
        :max-date="maxDate"
        :formatter="formatter"
        type="date"/>
    </van-popup>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      tabs: ['推荐购物', '推荐加油'],
      startTime: '',
      endTime: '',
      isLoading: true,
      finished: false,
      pageInfo: {
        page: 0,
        rows: 10,
      },
      currentTab: 0,
      orderList: [],
      showDatePicker: false,
      DatePicker: false,
      maxDate: new Date(),
      startDate: new Date(new Date()-6*24*3600*1000),
      endDate: new Date(),
      totalInfo: {}
    }
  },
  mounted() {
    this.startTime = moment().subtract(6, 'days').format('YYYY-MM-DD')
    console.log(this.startDate)
    this.endTime = moment().format('YYYY-MM-DD')
    console.log(this.endDate)
    this.loadMore()
    // this.queryTotalInfo()
  },
  // filters:{
  //   phoneCode(phone) {
  //      return phone = phone.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")
  //   }
  // },
  methods: {
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`;
      }
      return val;
    },
    seeDetails(statisticsTime) {
      // 查看明细
      this.$router.push({path: '/recommend-commodity/recommended-detail', query: {source: this.currentTab, statisticsTime: statisticsTime}})
    },
    loadMore() {
      this.isLoading = true;
      this.pageInfo.page++;
      this.$Loading.open();
      let queryUrl = ''
      let params = {}
      let tempCompleteTime = moment(this.startDate).startOf('day').format('YYYY-MM-DD') + 'TO' + moment(this.endDate).endOf('day').format('YYYY-MM-DD')
      console.log(tempCompleteTime)
      if (this.currentTab == 0) {
        queryUrl = '/app/jqGrid/app_recommend/queryOneselfRecommendShoppingList'
        params = {
          statisticsTime: tempCompleteTime,
          ...this.pageInfo
        }
      } else {
        queryUrl = '/app/jqGrid/app_recommend/queryOneselfRecommendOilList'
        params = {
          statisticsTime: tempCompleteTime,
          ...this.pageInfo
        }
      }
      this.$http.post(queryUrl, params).then(res => {
        console.log('res.data',res.data)
        this.isLoading = false;
        let data = res.data;
        if (data.status == 0) {
          if (data.data instanceof Array) {
            this.orderList.push(...data.data);
            this.finished = true
          } else {
            this.finished = true
          }
        } else {
          this.finished = true
          this.$Toast(data.info)
        }
        this.$Loading.close()
      })
      .catch(err => {
        this.$Toast(`queryCouServicePro err ${err}`)
        this.$Loading.close()
      })
    },
    // 查询订单汇总信息
    // queryTotalInfo() {
    //   this.$Loading.open()
    //   let queryUrl = ''
    //   let params = {}
    //   let tempCompleteTime = moment(this.currentDate).startOf('day').format('YYYY-MM-DD 00:00:00') + 'TO' + moment(this.currentDate).endOf('day').format('YYYY-MM-DD 23:59:59')
    //   if (this.currentTab == 0) {
    //     queryUrl = '/app/jqGrid/app_recommend/queryOneselfRecommendShoppingList'
    //     params = {
    //       statisticsTime: tempCompleteTime
    //     }
    //   } else {
    //     queryUrl = '/app/jqGrid/app_recommend/queryOneselfRecommendOilList'
    //     params = {
    //       statisticsTime: tempCompleteTime
    //     }
    //   }
    //   this.$http.post(queryUrl, params).then(res => {
    //     this.$Loading.close()
    //     let data = res.data
    //     if (data.status == 0) {
    //       this.totalInfo = data.data || {}
    //     } else {
    //       this.$Toast(data.info)
    //     }
    //   })
    //   .catch(err => {
    //     this.$Loading.close()
    //     this.$Toast(`queryShoppingOrderTotal err ${err}`)
    //   })
    // },
    // 时间确认
    confirmChoseDate() {
      console.log('startData',this.startDate)
      this.startTime = moment(this.startDate).format('YYYY-MM-DD')
      this.showDatePicker = false

      this.pageInfo = {
        page: 0,
        rows: 10
      }
      this.orderList = []
      this.isLoading = true
      this.finished = false
      this.loadMore()
      // this.queryTotalInfo()
    },
    endConfirmChoseDate() {
      this.endTime = moment(this.endDate).format('YYYY-MM-DD')
      this.DatePicker = false

      this.pageInfo = {
        page: 0,
        rows: 10
      }
      this.orderList = []
      this.isLoading = true
      this.finished = false
      this.loadMore()
      // this.queryTotalInfo()
    },
    // 更改tab
    changeTab(index) {
      if (this.currentTab == index) {
        return
      }
      this.currentTab = index
      this.pageInfo = {
        page: 0,
        rows: 10
      }
      this.orderList = []
      this.isLoading = true
      this.finished = false
      this.loadMore()
      // this.queryTotalInfo()
    },
    orderClick(item) {
      this.$router.push({
        path: '/recommend-commodity/recommended-order-detail',
        query: {
          orderPayType: item.orderPayType,
          orderType: item.orderType,
          orderId: item.id,
          userId: item.userId,
          tradeNo: item.tradeNo,
          customType: this.currentTab
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.top-tab {
  display flex;
  height 38px;
  line-height 38px;
  color #fe0218;
  font-size 14px;
  .item {
    flex 1;
    text-align center;
    background-color #fde8ea
    &.active {
      background-color #fe0218;
      color #fff;
    }
  }
}
.total-info {
  display flex;
  justify-content flex-start;
  align-items center;
  padding 15px 10px;
  .date {
    display flex;
    align-items center;
    padding 10px;
    border .5px solid #e3e3e3;
    border-radius 18px;
    color #353535;
    .time {
      margin-right 5px;
    }
  }
  .info {
    font-size 14px;
    color #353535;
    line-height 18px;
  }
}
.order-list {
  position absolute;
  left 0;
  right 0;
  bottom 0;
  top 94px;
  overflow-y auto;
  .order-c {
    margin 10px 10px 0;
    border-raidus 10px;
    box-shadow 0 0 10px #ddd;
    padding 0 10px;
    .item {
      display flex;
      justify-content space-between
      align-items center;
      padding 15px 0;
      bdr-b()
      &:last-child::after {
        display none;
      }
      .left {
        .phone {
          display flex;
          align-items center;
          font-size 14px;
          .tip {
            font-size 15px;
            /*color #ffffff;*/
            height 14px;
            line-height 14px;
            padding 0 3px;
            /*background-color #fe0218;*/
            border-radius 3px;
            margin-right 5px;
            /*&.orange {*/
              /*background-color #fd8001*/
            //}
          }
        }
        .time {
          font-size 12px;
          color #aaa;
          padding-top 10px;
        }
      }
      .center {
        font-size 14px;
      }
      .right {
        padding-right 10px;
        text-align center;
        .state {
          height 14px;
          line-height 13px;
          font-size 10px;
          color #fe0218;
          border .5px solid #fe0218;
          display inline-block;
          border-radius 3px;
          margin-bottom 10px;
        }
        .amount {
          font-size 13px;
          font-weight bold
          color #fe0218;
        }
        .details-btn {
          display flex
          justify-content center
          align-items center
          padding-top: 8px
          color: $color-text-d
        }
      }
    }
  }
}
</style>

<template>
  <div class="payorder">
    <!-- header -->
    <nav-top :title="isOfflineScan ? '商品支付凭证' : '加油支付凭证'" @backEvent="backEvent"></nav-top>
    <nav-content class="firm-order-content">
      <div class="time-change">
        <div @click="showTime = true" class="filter-btn">
          <div class="time">{{ currentYear }}年{{ currentMonth }}月</div>
          <i :class="{active: showTime}" class="icon iconfont mall-arrow-down"></i>
        </div>
        <div class="num" v-if="tabActive == 0 || tabActive == 2">累计加油：<span class="info">{{oilNum.toFixed(2)}}元</span></div>
      </div>
      <van-tabs class="tabs" v-model="tabActive" @change="changeTab">
        <van-tab title="全部"></van-tab>
        <van-tab title="待支付"></van-tab>
        <van-tab title="已完成"></van-tab>
        <van-tab title="已取消"></van-tab>
      </van-tabs>
      <div class="order-list"
           v-infinite-scroll="getPayBill"
           infinite-scroll-disabled="loading"
           :infinite-scroll-immediate-check="true"
           infinite-scroll-distance="20">
        <div class="order-item"  v-for="(item, index) in orderList" @click="repayDetail(item)" :key="index">
          <div class="item" v-if="!isOfflineScan">
            <span class="label"></span>
            <span class="con theme_font_red">
              <van-tag plain type="danger">{{ invoiceUse(item.invoiceUse) }}</van-tag></span>
          </div>
          <div class="item">
            <span class="label">{{ item.storeName }}</span>
            <span class="con">{{ item.submitTime }}</span>
          </div>
          <div class="item">
            <span class="label">支付金额</span>
            <span class="con theme_font_red" v-if="item.payAmount !== '' || item.payAmount !== undefined">￥{{item.payAmount.toFixed(2)}}</span>
          </div>
          <template v-for="item2 in item.itemAbstractList">
            <!--            小计优惠活动名称-->
            <div class="item" v-if="item2.activityTitle && item2.activityTitle != 'null'">
              <span class="label">参与活动</span>
              <span class="con">{{item2.activityTitle}}</span>
            </div>
            <!--            单品优惠活动名称-->
            <div class="item" v-if="item2.selfActivityTitle && item2.selfActivityTitle != 'null'">
              <span class="label">参与活动</span>
              <span class="con">{{item2.selfActivityTitle}}</span>
            </div>
            <!--            随机立减活动名称-->
            <div class="item" v-if="item2.randomDeductionActivityTitle && item2.randomDeductionActivityTitle != 'null'">
              <span class="label">参与活动</span>
              <span class="con">{{item2.randomDeductionActivityTitle }}</span>
            </div>
          </template>

          <div class="item pay-btn">
            <!-- <span class="shareBtn" @click="shareView">-->
            <!--   分享可得{{awardActivity.awardAmount}}元{{awardActivity.awardName}}-->
            <!-- </span>-->

            <div v-if="item.state == 1">
              <div class="con wait-pay" @click.stop="repayment(item)">重新支付</div>
              <div class="con wait-pay" style="margin-right:15px" @click.stop="cancelOrderHandler(item)">取消订单</div>
            </div>
            <div class="con" v-else>
              <div class="con check-detail" @click.stop="toDetail(item)">查看详情</div>
            </div>
          </div>
        </div>
        <div class="no-data theme_font_tint" v-show="!hasMore">没有更多数据了~</div>
      </div>
    </nav-content>
    <van-popup position="bottom" v-model="showTime">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="confirmDate"
        @cancel="showTime = false"
      />
    </van-popup>
    <!-- <van-popup v-model="successView" class="successBox">-->
    <!--   <div @click="sharePage">-->
    <!--     <div class="pic">-->
    <!--       <img src="static/image/microShop/icon3@2x.png">-->
    <!--     </div>-->
    <!--     <div class="tips">-->
    <!--       <p>分享好友，好友助力一起得{{awardActivity.awardAmount}}元现金券</p>-->
    <!--       <p>分享所得奖励可在商城充当现金直接消费</p>-->
    <!--     </div>-->
    <!--   </div>-->
    <!-- </van-popup>-->
    <repayments @queryOrder="queryOrder" :payStyle="payStyle" :isScan="isScan" :isOfflineScan="isOfflineScan" ref="repay"></repayments>
  </div>
</template>
<script>
  import util from '@/utils/util'
  import repayments from "./components/repayments.vue"
  import payHelper from "@/utils/payHelper";

  export default {
    components: {
      repayments
    },
    data() {
      return {
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth() + 1,
        minDate: new Date(2020, 0, 1),
        maxDate: new Date(2025, 10, 1),
        currentDate: new Date(),
        dateFrom: '',
        oilNum: 0,
        showTime: false,
        orderList: [],
        page: 0,
        hasMore: true,
        loading: false,
        successView: false,
        awardActivity: {}, // 活动
        tabActive: 0,
        payStyle: {}
      };
    },
    mounted() {
      this.dateFrom = util.getDealMonthFrom(this.currentYear, this.currentMonth)
      this.getPayBill()
    },
    computed: {
      isScan() { // 是否是扫码加油过来的
        return this.$route.path === '/firmScanOrder'
      },
      isOfflineScan() { // 是否是离线支付过来的
        return this.$route.path === '/firmScanOfflineOrder'
      },
    },
    methods: {
      changeTab(name, title) {
        this.page = 0
        this.tabActive = name
        this.orderList = []
        this.getPayBill()
      },
      cancelOrderHandler(item) {
        this.$dialog.confirm({message: '确定取消当前订单吗？'}).then(() => {
          this.cancelOrder(item)
        })
      },
      queryOrder() {
        this.page = 0;
        this.orderList = []
        this.getPayBill()
      },
      cancelOrder(payData) {
        let paramsData2 = {
          token: this.$store.state.login.token,
          orderType: payData.orderType,
          orderId: payData.id
        };
        let url = '/app/json/refuel_center/cancelOrder'
        if (payData.orderType == 100002002) {
          url = '/app/json/refuel_scan_code/cancelOrder'
        }
        if (this.isOfflineScan) {
          url = "/app/json/shopping_scan_code/cancelOrder";
        }
        this.$http.post(url, paramsData2).then(res => {
          let data2 = res.data;
          if (data2.status == 0) {
            this.$Toast("支付已取消");
            this.queryOrder()
          } else {
            this.$Toast(data2.info);
          }
        });
      },
      repayment(item) {
        console.log(item)
        let selectedPayWay = []
        payHelper.getPayWays('200001010', item.ouCode, '1').then(res => {
          selectedPayWay = res || []
          console.log(selectedPayWay)
          if (selectedPayWay.length > 0) {
            this.payStyle = selectedPayWay[0];
          }
        })
        this.$refs.repay.open(item)
      },
      shareView() {
        this.successView = true
      },
      sharePage() {
        this.$router.push({ path: '/share-gift/share', query: { awardActivity: JSON.stringify(this.awardActivity) } })
      },
      // 开票状态 0: 未开票 1: 已开票 2: 开票中
      invoiceUse(type) {
        let str = ''
        if (type === 0) {
          str = '未开票'
        } else if (type === 1) {
          str = '已开票'
        } else if (type === 2) {
          str = '开票中'
        }
        return str
      },
      changeTime() {
        this.showTime = true
      },
      confirmDate(value) {
        // 确认选择日期
        this.currentYear = new Date(this.currentDate).getFullYear()
        this.currentMonth = new Date(this.currentDate).getMonth() + 1
        this.dateFrom = util.getDealMonthFrom(this.currentYear, this.currentMonth)
        this.showTime = false
        this.orderList = []
        this.getPayBill()
      },
      formatter(type, val) {
        if (type === 'year') {
          return `${val}年`;
        } else if (type === 'month') {
          return `${val}月`
        }
        return val;
      },
      backEvent: function () {
        this.$router.go(-1);
      },
      getPayBill() {
        this.page++
        this.loading = true
        this.$Loading.open()
        console.log(this.tabActive)
        let url = '/app/json/refuel_center/queryOrder'
        if (this.isScan) {
          url = "/app/json/refuel_scan_code/queryOrder"
        }
        if (this.isOfflineScan) {
          url = "/app/json/shopping_scan_code/queryOrder"
        }
        let params = {
          token: this.$store.state.login.token,
          rows: 12,
          page: this.page
        }
        if (this.isScan) {
          params.orderTypeList = ["100011", "100002002", "100027002"] // 100011 app加油 100002002 扫码加油
          params.submitTime = this.dateFrom.start + 'TO' + this.dateFrom.end
        } else if (this.isOfflineScan) {
          params.orderType = '200401002'
          params.createTime = this.dateFrom.start + 'TO' + this.dateFrom.end
        } else {
          params.payTime = this.dateFrom.start + 'TO' + this.dateFrom.end
          params.orderType = ['100011','100002002','100027002']
        }
        if (this.tabActive == 1) {
          // 待支付
          params.state = 1
        } else if (this.tabActive == 2) {
          // 已完成
          params.state = 3
          if (this.isScan) {
            params.payTime = this.dateFrom.start + 'TO' + this.dateFrom.end
          }
        } else if (this.tabActive == 3) {
          // 已取消
          if (this.isScan) {
            params.stateList = [7, 8, 12]
          } else {
            params.state = 7
          }
        } else {
          // 全部
        }

        this.$http.post(url, params).then(res => {
          let data = res.data;
          if (data.status == 0) {
            console.log(data)
            let list = data.data.orderList || []
            this.orderList = this.orderList.concat(list)
            if (this.page < data.data.page.totalPages) {
              this.loading = false
            } else {
              this.hasMore = false
            }
            let num = 0 // oilNum
            this.orderList.forEach(item => {
              num = num + Number(item.payAmount)
            })
            this.oilNum = num
            
          } else {
            this.$Toast(data.info);
          }
          this.$Loading.close();
        })
      },
      repayDetail(item) {
        if(this.tabActive != '1') return;
        this.toDetail(item)
        console.log(9987)
      },
      toDetail(item) {
        let path = 'firmHistoryDetail'
        if (this.isScan) {
          path = '/firmHistoryScanDetail'
        }
        if (this.isOfflineScan) {
          path = '/firmOfflineScanDetail'
        }
        console.log(path)
        this.$router.push({
          path: path,
          query: {
            orderType: item.orderType,
            orderId: item.id
          }
        })
      }
    }
  };
</script>
<style ref="stylesheet/stylus" scoped lang="stylus">
  @import '~@/common/stylus/mixin'
  @import "~@/common/stylus/variable.styl"
  .firm-order-content{
    display flex
    flex-direction column
    .tabs{
      flex-shrink 0
    }
  }
  .time-change {
    display flex
    justify-content space-between
    align-items center
    padding: 11px 15px
    flex-shrink 0
    .filter-btn {
      border-radius 20px
      padding: 6px 15px
      background: $color-background-lll
      font-size: 16px
      display flex
      justify-content space-between
      align-items center

      .time {
        color: $color-text
      }

      .icon {

        &.active {
          transform rotate(-180deg)
        }
      }
    }

    .num {
      font-size 14px

      .info {
        color $color-theme-r
        font-weight bold
      }
    }
  }

  .order-list {
    padding 8px 10px;
    overflow-y auto
    -webkit-overflow-scrolling touch
    flex 1
    .order-item {
      border-radius 4px;
      overflow: hidden
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
      padding 0 15px;
      position: relative

      & + .order-item {
        margin-top: 8px;
      }

      .item {
        margin: 15px 0;
        overflow: hidden

        .label {
          float: left
        }

        .con {
          float: right
        }

        .price {
          color: #f02c2d
        }
      }

      .pay-btn {
        bdr-t()
        color: #f02c2d
        padding-top 12px
        display flex
        justify-content flex-end
        .shareBtn {
          padding: 0.186rem 0.26rem;
          border: 1px solid;
          border-radius: 15px;
          margin: auto 10px;
        }
      }
    }

    .check-detail {
      font-size: 14px;
      text-align: center;
      background-color: #f02c2d;
      padding: 0.186rem 0.26rem;
      border-radius: 0.4rem;
      color: #fff
      line-height: 12px;
    }
    .wait-pay {
      font-size: 14px;
      border: 1px solid #f02c2d;
      padding: 0.186rem 0.26rem;
      border-radius: 0.4rem;
      line-height: 12px;
    }
  }

  .no-data {
    padding: 15px;
    text-align: center;
  }
  .successBox {
    height: 350px;
    /* line-height: 180px; */
    width: 80%;
    text-align: center;
    font-size: 16px;
    background-position: 50% 50%;
    background: url("../../../../static/image/microShop/bg1@2x.png") no-repeat center;
    background-size: 100% 100%;
    .pic {
      border-radius: 50%;
      background: #fff;
      width: 100px;
      height: 100px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      position: absolute;
      top: 148px;
      left: 50%;
      margin-left: -50px;
      flex-direction: column;
      border: 2px solid #ffe9eb;
      img {
        width 50px;
        margin auto
      }
    }
    .tips {
      position: absolute;
      width: 96%;
      left: 2%;
      font-size: 14px;
      top: 270px;
      p {
        margin-bottom 10px;
      }
    }
  }
</style>

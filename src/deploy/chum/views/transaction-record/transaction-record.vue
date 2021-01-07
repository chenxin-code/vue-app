<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <p class="query-time" @click="isShowTimeModal = true">
        {{ showTime }}<i class="iconfont mall-arrow-down"></i>
      </p>
      <scroll
        ref="scroll"
        class="recording-list"
        :hasMore="hasMore"
        :pullUpLoad="true"
        @pullingUp="loadMore"
        :data="recordingList"
        v-if="recordingList.length !== 0">
        <ul class="recording-c">
          <li
            v-for="(item, index) in recordingList"
            :key="index"
            class="item"
            @click="recordingClick(item)">
            <p class="pay-top-info">订单编号：{{ item.tradeNo }}</p>
            <p class="pay-top-info">支付时间：{{ item.paidTime }}</p>
            <div class="prod-info">
              <img :src="item.orderItemList[0].phPictureUrl" alt="" class="prod-img">
              <div class="right-c">
                <p class="prod-name">{{ item.orderItemList[0].skuName }}</p>
                <p class="specification-name">{{ item.orderItemList[0].specs }}</p>
                <p class="price">￥{{ dealWithPrice(item.payAmount)[2] }}</p>
                <span class="count">x{{ item.orderItemList[0].number }}</span>
              </div>
            </div>
          </li>
        </ul>
      </scroll>
      <p class="no-result-message" v-else>暂无数据~</p>
    </nav-content>
    <van-popup v-model="isShowTimeModal" position="bottom">
      <van-datetime-picker
        v-model="selectDate"
        :max-date="maxDate"
        @cancel="isShowTimeModal = false"
        @confirm="confirmSelectTime"
        type="year-month"/>
    </van-popup>
  </div>
</template>
<script>
import utils from '../../assets/utils/tools'
import Moment from 'moment';
import scroll from "@/components/base/scroll/scroll";
export default {
  mixins: [utils],
  components: {
    scroll
  },
  data() {
    return {
      isShowTimeModal: false,
      showTime: Moment().format('YYYY年MM月'),
      selectDate: new Date(),
      maxDate: new Date(),
      recordingList: [],
      hasMore: true,
      pageInfo: {
        index: 0,
        pageSize: 10,
      }
    }
  },
  mounted() {
    this.initOrderList();
  },
  methods: {
    initOrderList() {
      let startTime = Moment(this.selectDate).format('YYYY-MM-01 00:00:00');
      let endTime = Moment(startTime).add(1, 'M').format('YYYY-MM-DD 23:59:59');
      this.$STLoading.open();
      this.$http.post('/app/json/app_shopping_order/queryOrder', {
        paidTime: startTime + 'TO' + endTime,
        orderType: 200017,
        state: 9,
        page: this.pageInfo
      }).then(res => {
        let data = res.data;
        this.$STLoading.close();
        if (data.status == 0) {
          if (data.data.orderList instanceof Array) {
            this.recordingList.push(...data.data.orderList);
            this.pageInfo.index = data.data.page.currentPageSize;
            if (this.pageInfo.index >= data.data.page.totalPages) {
              this.hasMore = false;  
            }
          }
        } else {
          this.$Toast(data.info);
        }
      }).catch(err => {
        this.$Toast(`queryOrder err ${err}`);
        this.$STLoading.close();
      })
    },
    confirmSelectTime(time) {
      this.showTime = Moment(time).format('YYYY年MM月');
      this.pageInfo = {
        index: 0,
        pageSize: 10
      }
      this.recordingList = [];
      this.initOrderList();
      this.hasMore = true;
      this.isShowTimeModal = false;
    },
    loadMore() {
      ++this.pageInfo.index
      this.initOrderList();
    },
    recordingClick(item) {
      this.$router.push({
        path: '/transaction_detail',
        query: {
          orderId: item.id
        }
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path != '/transaction_detail') {
      this.$keepaliveHelper.deleteCache(this)
    }
    next()
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/deploy/chum/assets/stylus/chum-public.styl';
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.container {
  .query-time {
    text-align center;
    font-size 13px;
    color #9FA0A0;
    .iconfont {
      font-size 12px;
    }
  }
  .recording-list {
    position absolute;
    left 0
    right 0
    top 20px;
    bottom 0;
    padding 0 20px;
    height auto;
    /deep/ .scroll-content {
      padding-top: 5px;
    }
    .item {
      padding 10px;
      box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
      border-radius 5px;
      margin-top 10px;
      &:first-child {
        margin-top 0;
      }
      .pay-top-info {
        font-size 14px;
        padding-bottom 11px
        &:nth-child(2) {
          bdr-b();
        }
      }
      .prod-info {
        display flex;
        margin-top 15px;
        align-items center;
        .prod-img {
          display block;
          width 80px;
          height 80px;
          border-radius 4px;
        }
        .right-c {
          flex 1;
          padding-left 10px;
          display flex;
          flex-direction column;
          justify-content space-between;
          position relative;
          height 80px;
          .prod-name {
            font-size 16px;
            font-weight 500;
            line-height 18px;
            padding-right 30px;
            padding-top 5px;
            ellipse-2();
          }
          .specification-name {
            font-size 13px;
            color #9FA0A0;
          }
          .price {
            font-size 16px;
            font-weight 700;
            color $color-theme-r;
            padding-bottom 5px;
          }
          .count {
            font-size 13px;
            position absolute;
            right 0;
            top 5px;
          }
        }
      }
    }
  }
}
</style>
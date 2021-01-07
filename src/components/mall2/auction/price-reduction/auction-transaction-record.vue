<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="transaction-title">
        <span class="item">状态</span>
        <span class="item">获拍人</span>
        <span class="item">价格</span>
        <span class="item">时间</span>
      </div>
      <van-list
        v-model="isLoading"
        :finished="finished"
        finished-text="没有更多了"
        :offset="200"
        class="transaction-list"
        @load="loadMore">
        <ul class="transaction-c">
          <li
            v-for="(item, index) in transactionList"
            :key="index"
            class="item">
            <div class="state">
              <span class="tip">成交</span>
            </div>
            <div class="people">{{ item.buyerName }}</div>
            <div class="price">￥{{ $util.toDecimal2(item.payAmount) }}</div>
            <div class="time">{{ item.paidTime }}</div>
          </li>
        </ul>
      </van-list>
    </nav-content>
  </div>
</template>
<script>
import moment from 'moment';
export default {
  data() {
    return {
      isLoading: true,
      finished: false,
      transactionList: [],
      pageInfo: {
        page: 0,
        rows: 10
      }
    }
  },
  components: {},
  mounted() {
    this.loadMore()
  },
  methods: {
    loadMore() {
      this.isLoading = true
      this.pageInfo.page++
      this.$Loading.open()
      this.$http.post('/app/json/app_product_auction/getDoneAuctionList', {
        auctionId: this.$route.query.auctionActivityId,
        ...this.pageInfo
      }).then(res => {
        this.isLoading = false
        let data = res.data
        if (data.status == 0) {
          if (data.data instanceof Array) {
            this.transactionList.push(...data.data)
            if (this.transactionList.length >= data.totalRecords) {
              this.finished = true
            }
          } else {
            this.finished = true
          }
        } else {
          this.$Toast(data.info)
          this.finished = true
        }
        this.$Loading.close()
      }).catch(err => {
        this.$Toast(`todo err ${err}`)
        this.$Loading.close()
      })
    }
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.container {
  display flex;
  flex-direction column;

  .transaction-title {
    display flex;
    padding 10px 15px;
    bdr-b();
    .item {
      font-size 13px;
      text-align center;
      line-height 16px;
      &:nth-child(1),
      &:nth-child(2) {
        flex 1
      }
      &:nth-child(3) {
        flex 2
      }
      &:nth-child(4) {
        flex 3
      }
    }
  }

  .transaction-list {
    flex 1;
    .transaction-c {
      padding 0 15px;
      .item {
        font-size 12px;
        padding 10px 0;
        color #515a6e;
        display flex;
        text-align center;
        .state,
        .people {
          height  18px;
          line-height 18px;
          flex 1;
          ellipse()
          .tip {
            display inline-block
            height 18px;
            line-height 18px;
            background-color: $color-theme-r;
            padding 0 5px;
            color #fff;
            font-size 12px;
            border-radius 9px;
          }
        }
        .price {
          flex 2;
          height  18px;
          line-height 18px;
        }
        .time {
          flex 3;
          height  18px;
          line-height 18px;
        }
      }
    }
  }
}
</style>
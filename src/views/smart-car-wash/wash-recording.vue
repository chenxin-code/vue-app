<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="recording-list">
        <van-list
          v-if="recordList.length !== 0"
          v-model="isLoading"
          :finished="finished"
          finished-text="没有更多了"
          :offset="200"
          @load="loadMore">
          <ul class="record-c">
            <li
              v-for="(item, index) in recordList"
              :key="index"
              class="item">
              <img src="./images/icon-wash.png" alt="" class="left-icon">
              <div class="center-info">
                <p class="store-name">{{ item.storeName }}</p>
                <p class="coupon-name">{{ item.itemAbstractList[0].skuName }}</p>
                <p class="wash-time">{{ item.stockupTime }}~{{ item.completeTime }}</p>
              </div>
              <div class="right-state">
                <span class="text red" v-if="item.rechargeState == 40">紧急停止</span>
                <span class="text green" v-else-if="item.rechargeState == 20">洗车完成</span>
                <span class="text gray" v-else-if="item.rechargeState == 30">暂停超时</span>
                <span class="text gray" v-else>其他</span>
              </div>
            </li>
          </ul>
        </van-list>
        <div v-else class="no-rec">
          <img src="./images/no-recording.png" alt="" class="no-recording">
          <p class="no-recording-text">暂无洗车记录！</p>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoading: true,
      finished: false,
      pageInfo: {
        index: 0,
        pageSize: 10,
      },
      recordList: [],
    }
  },
  mounted() {
    this.loadMore()
  },
  methods: {
    loadMore() {
      this.isLoading = true;
      this.pageInfo.index++;
      this.$Loading.open();
      let params = {
        orderType: 700004003,
        page: JSON.stringify(this.pageInfo)
      }
      if (this.$route.query.orderType) {
        params.orderType = this.$route.query.orderType
      }
      this.$http.post('/app/json/app_wash_car_order/queryOrder', params).then(res => {
        this.isLoading = false;
        let data = res.data;
        if (data.status == 0) {
          if (data.data.orderList instanceof Array) {
            this.recordList.push(...data.data.orderList)
            if (this.recordList.length >= data.data.page.count) {
              this.finished = true;
            }
          } else {
            this.finished = true;
          }
        } else {
          this.finished = true;
          this.$Toast(data.info);
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(`myCardBag err ${err}`);
        this.$Loading.close();
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.container {
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
}

.recording-list {
  width 100%;
  height 100%;
  overflow-y auto;
  .record-c {
    margin 0 15px;
    .item {
      background-color #fff;
      margin-top 10px;
      border-radius 5px;
      padding 10px;
      display flex;
      align-items center;
      .left-icon {
        display block;
        width 48px;
        height 48px;
      }
      .center-info {
        flex 1;
        padding 0 10px;
        .store-name {
          font-size 15px;
          font-weight 500;
        }
        .coupon-name {
          font-size 12px;
          font-weight 500;
          padding-top 10px;
        }
        .wash-time {
          color #666
          padding-top 5px;
        }
      }
      .right-state {
        font-size 12px;
        .text {
          &.red {
            color #FF6745;
          }
          &.green {
            color #118820;
          }
          &.gray {
            color #999;
          }
        }
      }
    }
  }
  .no-rec {
    position absolute;
    left 50%;
    top 45%;
    transform translate(-50%, -50%)
    .no-recording {
      display block;
      width 80px;
    }
    .no-recording-text {
      font-size 13px;
      text-align center;
      color #999;
      padding-top 25px;
    }
  }
}
</style>
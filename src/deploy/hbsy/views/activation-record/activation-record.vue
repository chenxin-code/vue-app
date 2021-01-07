<template>
  <div class="container">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <van-list
        class="activation-scroll-container"
        v-model="isLoading"
        :finished="finished"
        finished-text="没有更多了"
        :offset="200"
        @load="loadMore"
        v-if="activationRecordList.length > 0">
        <ul class="activation-container">
          <li class="item" v-for="(item, index) in activationRecordList" :key="index">
            <div class="line">
              <span class="label">订单号</span>
              <span class="content">{{ item.orderNo }}</span>
            </div>
            <div class="line">
              <span class="label">消费时间</span>
              <span class="content">{{ item.tradeTime }}</span>
            </div>
            <div class="line">
              <span class="label">消费金额</span>
              <span class="content">{{ item.amount }}</span>
            </div>
            <div class="line">
              <span class="label">消费升数</span>
              <span class="content">{{ item.oilLiter }}</span>
            </div>
            <div class="line">
              <span class="label">返利金额</span>
              <span class="content">{{ item.activeAward }}</span>
            </div>
          </li>
        </ul>
      </van-list>
      <div class="no-result" v-else>
        <img src="../image/no-data.png" alt="">
        <p class="text">暂无数据~</p>
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
        page: 0,
        rows: 10,
      },
      activationRecordList: [],
    }
  },
  created() {

  },
  mounted() {
    if (this.$route.query.packageRefuelOrderId) {
      this.loadMore()
    } else {
      this.$Toast(`缺少必要参数 packageRefuelOrderId`)
      this.finished = true
    }
  },
  methods: {
    loadMore() {
      this.$Loading.open()
      this.pageInfo.page++
      this.$http.post('/app/json/app_package_refuel/queryPackageRefuelOrderRecord', {
        ...this.pageInfo,
        packageRefuelOrderId: this.$route.query.packageRefuelOrderId
      }).then(res => {
        this.$Loading.close()
        this.isLoading = false
        let data = res.data
        if (data.status == 0) {
          if (data.data instanceof Array && data.data.length > 0) {
            this.activationRecordList.push(...data.data)
            if (this.activationRecordList.length >= data.totalRecords) {
              this.finished = true
            }
          } else {
            this.finished = true
          }
        } else {
          this.$Toast(data.info)
          this.finished = true
        }
      }).catch(err => {
        this.$Loading.close()
        this.finished = true
        this.$Toast(`queryPackageRefuelOrderRecord err ${err}`)
      })
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .container {
    .nav-content {
      background-color #F6F6F6;
    }
  }
  .activation-scroll-container {
    width 100%;
    height 100%;
    overflow-y auto;
    .item {
      background-color #fff;
      margin-top 10px;
      padding 0 10px;
      .line {
        padding 10px 0;
        display flex;
        justify-content space-between;
        border-bottom .5px solid #F2F2F2;
        &:last-child {
          border none;
        }
        .label {
          font-size 14px;
          color #666666;
          line-height 20px;
          display block;
          width: 30%;
        }
        .content {
          font-size 15px;
          color #333333;
          line-height 20px;
          display block;
          width: 70%;
          word-break: break-all;
          text-align right;
        }
      }
    }
  }
  .no-result {
    padding 30px 0;
    img {
      display block;
      width 200px;
      margin 0 auto;
    }
    .text {
      font-size 13px;
      text-align center;
      padding 10px 0;
      color #5f5e5e;
    }
  }
</style>
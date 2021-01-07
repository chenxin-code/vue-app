<template>
  <div class="recommended-detail" v-if="complete">
    <nav-top title="推荐明细" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="recommended-detail-container">
      <div class="title">共{{total.orderNum || 0}}笔订单，累计金额{{total.allAmount || 0}}元</div>
      <ul class="list">
        <li class="item">
          <div class="table-view">
            <div class="table-view-cell" v-for="(item, index) in list" :key="index">
              <div class="table-view-cell-text special">
                <div class="info">{{item.referrerName}}</div>
                <div class="info">{{item.referrerId}}</div>
                <div class="info" v-if="source != 0">{{item.liter || 0}}L</div>
                <div class="info money">￥{{item.amount || 0}}</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="no-data">没有更多了哦~</div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        list: [],
        phone: '13031932893',
        source: '', // 0 是推荐购物 1是推荐加油
        total: {},
        complete: false,
        statisticsTime: ''
      }
    },
    mounted() {
      this.source = this.$route.query.source || ''
      this.statisticsTime = this.$route.query.statisticsTime || ''
      this.getRecOilDetailTotal()
    },
    methods: {
      getRecOilDetailTotal() {
        // total接口
        this.$Loading.open()
        let params = {
          statisticsTime: this.statisticsTime
        }
        let url = '/app/json/app_recommend/getRecOilDetailTotal' // 推荐加油total
        if (this.source == 0) {
          url = '/app/json/app_recommend/getRecShoppingDetailTotal' // 推荐购物total
        }
        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.total = data.data
            console.log(data)
          } else {
            this.$Toast(data.info)
          }
          this.getRecOilDetailList()
        }).catch(err => {
          this.$Loading.close()
        })
      },
      getRecOilDetailList() {
        // 明细接口
        this.$Loading.open()
        let params = {
          statisticsTime: this.statisticsTime
        }
        let url = '/app/json/app_recommend/getRecOilDetailList' // 推荐加油明细
        if (this.source == 0) {
          url = '/app/json/app_recommend/getRecShoppingDetailList' // 推荐购物明细
        }
        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.list = data.data
            this.complete = true
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Loading.close()
        })
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .recommended-detail {
    background-color: #f8f8f8 !important
    .recommended-detail-container {
      padding: 15px
      overflow-y auto
      -webkit-overflow-scrolling touch
      .title {
        padding-bottom: 15px
        font-size 16px
      }
      .list {
        background #fff
        border-radius 6px
        color: $color-text
        .item {
          padding: 0 15px
          .table-view-cell {
            padding: 11px 0
            .special {
              padding: 8px 0
              display flex
              justify-content space-between
              .money {
                font-weight bold
              }
            }
          }
        }
      }
      .no-data {
        text-align center
        color: $color-text-d
      }
    }
  }
</style>

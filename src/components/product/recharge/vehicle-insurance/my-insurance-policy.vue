<template>
  <div class="my-insurance-policy">
    <nav-top title="我的保单" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="my-insurance-policy-container">
      <ul class="list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
          <li class="item" v-for="(item, index) in list" :key="index">
            <div class="time">{{dealTime(item.insureTime)}}</div>
            <div class="table-view">
              <div class="table-view-cell">
                <div class="table-view-cell-text special">
                  <div class="left">车牌号：{{item.licenseNo}}</div>
                  <div class="right" v-if="item.state == 3">已出单</div>
                </div>
              </div>
              <div class="table-view-cell center">
                <div class="table-view-cell-text">
                  <div class="info">
                    <div class="left">订单号</div>
                    <div class="right">{{item.tradeNo}}</div>
                  </div>
                  <div class="info">
                    <div class="left">车主姓名</div>
                    <div class="right">{{item.carOwnerName}}</div>
                  </div>
                  <div class="info">
                    <div class="left">保单金额</div>
                    <div class="right money">￥{{item.totalAmount}}</div>
                  </div>
                </div>
              </div>
              <div class="table-view-cell btn">
                <div class="right">
                  <div class="btn-details" @click="openDetails(item)">保单详情</div>
                </div>
              </div>
            </div>
          </li>
        </van-list>
      </ul>
    </nav-content>
  </div>
</template>

<script>
  import util from "@/utils/util";

  export default {
    data() {
      return {
        list: [],
        loading: false,
        finished: false,
        page: 0,
        rows: 10
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      loadMore() {
        // 我的订单接口
        this.page = this.page + 1
        let paramsData = {
          token: this.$store.state.login.token,
          page: this.page,
          rows: this.rows,
          category: 1
        }
        this.$http.post('/app/json/car_insure/getList', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            console.log(data.data)
            if (data.data) {
              this.list = this.list.concat(data.data)
              console.log(this.list)
            }
            if (this.list.length >= data.totalRecords) {
              this.finished = true
            }
          } else {
            this.finished = true
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
          this.loading = false
        })
      },
      openDetails(item) {
        // 打开详情页面
        this.$router.push({path: '/insurance-policy-details', query: {tradeNo: item.tradeNo}})
      },
      dealTime(time) {
        return util.getPayTime(time)
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .my-insurance-policy {
    .my-insurance-policy-container {
      background-color #f6f6f6

      .list {
        overflow-y auto
        height 100%
        padding-bottom: 20px

        .item {
          .time {
            text-align center
            color: $color-text-d
            padding: 10px
          }

          .special {
            .left {
              font-size: 16px
            }

            .right {
              color: $color-theme-r
            }
          }

          .center {
            .table-view-cell-text {
              display block
              line-height 24px
            }

            .info {
              display flex
              justify-content space-between
              align-items center

              .right {
                color: $color-text-d
              }

              .money {
                color: $color-theme-r
              }
            }
          }

          .btn {
            .right {
              text-align right

              .btn-details {
                display inline-block
                background $color-theme-r
                color: #fff
                padding: 10px 15px
                border-radius 20px
                font-size: 14px
              }
            }
          }
        }
      }

    }
  }
</style>

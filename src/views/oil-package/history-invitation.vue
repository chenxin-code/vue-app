<template>
  <div class="my-invitation">
    <nav-top title="历史签约" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="my-invitation-container">
      <ul class="list" v-if="true">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
          <li class="item" v-for="(item, index) in list" :key="index" @click="openDetails(item)">
            <div class="time">{{item.createTime}}</div>
            <div class="info">
              <div class="title">
                <div class="left">{{item.packageRefuelName}}&nbsp;&nbsp;{{item.duration}}天</div>
                <div class="right">{{dealState(item.state, item.startDate, item.endDate)}}</div>
              </div>
              <div class="text">开通时间：{{dealTime(item.startDate)}}</div>
              <div class="text">到期时间：{{dealTime(item.endDate)}}</div>
            </div>
          </li>
        </van-list>
      </ul>
      <div class="no-data" v-else>
        <div class="img">
          <img src="./image/p2.png" alt="">
        </div>
        <div class="text">你还没有已签约套餐！</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import utils from "@/utils/util"

  export default {
    data() {
      return {
        list: [],
        loading: false,
        finished: false,
        page: 0
      }
    },
    mounted() {
    },
    methods: {
      loadMore() {
        this.page = this.page + 1
        let paramsData = {
          token: this.$store.state.login.token,
          page: {
            index: this.page,
            pageSize: 20
          }
        }
        this.$http.post('/app/json/app_package_refuel/queryPackageOrderHistory', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.list = this.list.concat(data.data || [])
            if (this.list.length >= data.totalRecords) {
              this.finished = true
            }
          } else {
            this.finished = true
            this.$Toast(data.info ? data.info : '获取列表失败')
          }
          this.loading = false
        })
      },
      dealState(state, start, end) {
        let date = utils.getMyDate(new Date()) // 当前时间
        if (state == 'WAIT_SIGN_UP') {
          return '待签约'
        } else if (state == 'SIGNED_UP') {
          let compareBegin = utils.dateCompare(date, start.split(' ')[0])
          let compareEnd = utils.dateCompare(date, end.split(' ')[0])
          if (compareBegin == 1) {
            return '未开始'
          } else if ((compareBegin == 0 || compareBegin == -1) && (compareEnd == 1 || compareEnd == 0)) {
            return '签约中'
          } else {
            return '已结束'
          }
        } else if (state == 'SETTLED') {
          return '已结算'
        } else if (state == 'CANCELED') {
          return '已取消'
        }
      },
      dealTime(date) {
        return date
      },
      openDetails(item) {
        // 打开邀约详情
        this.$router.push({path: '/history-details', query: {id: item.packageRefuelOrderId}})
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .my-invitation {
    background-color: #f8f8f8 !important

    .my-invitation-container {
      padding: 0 11px 15px 11px
      overflow-y auto
      -webkit-overflow-scrolling touch
      .list {
        .item {
          .time {
            text-align center
            padding: 11px 0
            color: $color-text-l
          }
          .info {
            box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
            background: #fff
            border-radius 6px
            padding: 11px 15px
            line-height 20px
            .title {
              font-size 14px
              color: $color-text
              display flex
              justify-content space-between
              align-items center
              .right {
                color $color-theme-r
                font-size 12px
              }
            }
            .text {
              color: $color-text-d
            }
          }
        }
      }
    }
  }

  .no-data {
    text-align center
    display flex
    justify-content center
    align-items center
    flex-direction column
    padding-top: 80px
    .img {
      padding-bottom: 10px
      img {
        width: 120px
      }
    }
    .text {
      color: $color-text-d
    }
  }
</style>

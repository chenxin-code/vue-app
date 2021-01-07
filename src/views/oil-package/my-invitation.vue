<template>
  <div class="my-invitation">
    <nav-top title="我的邀约" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="my-invitation-container">
      <ul class="list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
          <li class="item" v-for="(item, index) in list" :key="index" @click="openDetails(item)">
            <div class="time">{{item.createTime}}</div>
            <div class="info">
              <div class="title">{{item.packageRefuelName}}&nbsp;&nbsp;{{item.duration}}天</div>
              <div class="text">开通时间：{{dealTime(item.startDate)}}</div>
              <div class="text">到期时间：{{dealTime(item.endDate)}}</div>
              <div class="text">邀约状态：{{dealState(item.state, item.startDate, item.endDate)}}</div>
              <div class="text" v-if="type == -1 && item.signUpNum > (item.joinNum + 1)">失败原因：成员不足</div>
              <div class="text" v-if="type == -1 && item.signUpNum < (item.joinNum + 1)">失败原因：未确认开通</div>
            </div>
          </li>
        </van-list>
      </ul>
<!--      <div class="no-data" v-else>-->
<!--        <div class="img">-->
<!--          <img src="./image/p2.png" alt="">-->
<!--        </div>-->
<!--        <div class="text">你还没有家庭套餐邀约！</div>-->
<!--      </div>-->
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
        page: 0,
        type: '' // 1和0:未超过三天  -1:超过三天
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
        this.$http.post('/app/json/app_package_refuel/queryMyInviteList', paramsData).then(res => {
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
      timeJudge(time) {
        let date = utils.getMyDate(new Date()) // 当前时间
        let curDate = new Date(time);
        let nextTime = new Date(curDate.getTime() + 3 * 24 * 60 * 60 * 1000) // 套餐开始时间的三天以后的时间
        // 1和0:未超过三天  -1:超过三天
        return utils.dateCompare(date, utils.getPreTime(nextTime.getTime()).split(' ')[0])
      },
      dealState(state, start, end) {
        if (state == 'WAIT_SIGN_UP') {
          this.type = this.timeJudge(start.split(' ')[0])
          if (this.type != -1) {
            return '邀约中'
          } else {
            return '邀约失败'
          }
        } else if (state == 'SIGNED_UP') {
          return '邀约成功'
        }
      },
      openDetails(item) {
        // 打开邀约详情
        this.$router.push({path: '/invitation-details', query: {id: item.packageRefuelOrderId, startDate: item.startDate}})
      },
      dealTime(date) {
        // return date.split(' ')[0]
        return date
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

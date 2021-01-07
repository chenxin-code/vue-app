<template>
  <div class="expire-integralinfo">
    <nav-top :title="$route.query.title" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="expire-integralinfo-container">
<!--      <div class="title">{{overdueDays || '0'}}天内将要过期总数：{{expireUnit || '0'}}</div>-->
      <div class="title">将要过期总数：{{expireUnit || '0'}}</div>
      <ul class="list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
          <li class="item" v-for="(item, index) in list" :key="index">
            <div class="content">
              <div class="left">
                <div class="top">{{item.orderTypeName}}</div>
                <div class="bottom">{{$route.query.title + '过期时间：' +item.expireDate}}</div>
              </div>
              <div class="right">-{{item.balanceUnit}}</div>
            </div>
          </li>
        </van-list>
      </ul>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        overdueDays: '', // 过期天数
        expireUnit: '', // 过期积分
        list: [],
        loading: false,
        finished: false,
        page: 0
      }
    },
    mounted() {
      this.overdueDays = this.$store.state.globalConfig.Count_overdue_days
      this.expireUnit = this.$route.query.expireUnit || 0
    },
    methods: {
      loadMore() {
        // 获取过期积分列表数据
        this.page = this.page + 1
        let paramsData = {
          token: this.$store.state.login.token,
          acctType: this.$route.query.acctType,
          page: this.page,
          rows: 10,
          groupValue: this.$route.query.groupValue || '',
          queryDays: this.$store.state.globalConfig.Count_overdue_days
        }
        this.$http.post('/app/json/acct/getAboutExpireList', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.list = this.list.concat(data.data)
            if (this.list.length >= data.totalRecords) {
              this.finished = true
            }
          } else {
            this.finished = true
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
          this.loading = false
        })
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .expire-integralinfo {
    .expire-integralinfo-container {
      padding: 11px 0
      display flex
      flex-direction column

      .title {
        flex-shrink 0
        padding: 0 15px
        color: $color-text
      }

      .list {
        flex: 1
        overflow-y auto
        -webkit-overflow-scrolling touch
        padding: 11px 15px

        .item {
          margin-bottom: 10px
          .content {
            box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
            background: #fff
            border-radius 6px
            padding: 11px 15px
            display flex
            justify-content space-between
            align-items center
            line-height 28px

            .left {
              .bottom {
                color: $color-text-d
              }

              .top {
                font-size 14px
              }
            }

            .right {
              color #b03b44
            }
          }
        }
      }
    }
  }

</style>

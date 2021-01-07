<template>
  <div class="pay-settings">
    <nav-top title="活动列表" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="pay-setting">
      <div class="pay-box">
        <ul class="prize-list">
          <li class="prize-item" @click="openDetails(item)" v-for="(item, index) in prizeList" :key="index">
            <div class="time">
              <span class="text theme_font_black">{{item.activityTitle}}</span>
            </div>
            <div class="content">
              <div class="title theme_font_gray">活动时间：{{item.startDate}}-{{item.endDate}}</div>
              <div class="title theme_font_gray">活动内容：{{item.activityDesc}}</div>
            </div>
          </li>
        </ul>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Cell} from 'mint-ui'

  export default {
    name: '',
    data() {
      return {
        prizeList: [] // 活动列表
      }
    },
    created() {
    },
    mounted() {
      this.loadMore()
    },
    methods: {
      openDetails(item) {
        // 查看活动详情
        this.$router.push({path: '/usercenter/activitydetails', query: {item: item}})
      },
      loadMore() {
        // 获取可参与活动列表
        let paramsData = {
          token: this.$store.state.login.token
        }
        this.$http.post('/app/json/app_market/queryCanAttendActivity', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            // 商品列表
            this.prizeList = data.data
          }
        })
      }
    },
    computed: {},
    components: {
      Cell
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .pay-settings {
    .pay-box {
      height 100%
      overflow: auto
      .prize-list {
        padding: 11px 15px
        .prize-item {
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
          border-radius 4px
          margin-bottom: 10px
          padding: 11px 11px 0 11px
          line-height 22px
          position: relative
          .time {
            font-size 16px
            font-weight bold
            padding-bottom: 8px
            display flex
            justify-content space-between
            .info {
              font-size 12px
            }
          }
          .content {
            padding: 8px 0
            border-bottom 1px solid #f3f3f3
            border-top 1px solid #f3f3f3
            .title {
              font-size: 12px
              word-break break-all
            }
          }
        }
      }
    }
  }
</style>

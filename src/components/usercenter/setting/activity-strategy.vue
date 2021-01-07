<template>
  <div class="activity-strategy">
    <nav-top title="活动攻略" :class="{bgImg: true}" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="activity-strategy-container">
      <div class="top">
        <div class="tips">
          <span class="title">活动描述：</span>
          <span class="text">获得期间内，邀请好友数量注册数量达到指定人数即可解锁奖品，完成奖品的领取！</span>
        </div>
        <div class="tips">
          <span class="title">活动时间：</span>
          <span class="text">{{dealTime(datails.startDate, datails.endDate)}}</span>
        </div>
      </div>
      <div class="content" v-if="complete">
        <RecommendedGift :type="type" :datails="datails"></RecommendedGift>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import RecommendedGift from './recommended-gift'

  export default {
    data() {
      return {
        selectIndex: '',
        datails: {},
        complete: false,
        type: 1
      }
    },
    mounted() {
      this.selectIndex = this.$route.query.selectIndex
      if (this.selectIndex == 0) {
       this.queryRecommendRegisterAwardList()
      } else {
        this.queryRecommendBindCardAwardList()
      }
    },
    methods: {
      dealTime(begin, end) {
        if (begin || end) {
          return begin.split(' ')[0] + '~' + end.split(' ')[0]
        } else {
          return ''
        }
      },
      queryRecommendRegisterAwardList() {
        // 推荐注册奖励
        console.log('推荐注册奖励')
        this.$request.post('/app/json/app_market/queryRecommendRegisterAwardList', {}).then(res => {
          if (res.status === 0) {
            this.complete= false
            this.datails = res.data
            this.$nextTick(()=>{
              this.complete = true
            })
            this.$set(this.datails, 'index', this.selectIndex)
          } else {
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
        })
      },
      queryRecommendBindCardAwardList() {
        // 推荐绑卡奖励
        console.log('推荐绑卡奖励')
        this.$request.post('/app/json/app_market/queryRecommendBindCardAwardList', {}).then(res => {
          if (res.status === 0) {
            this.complete= false
            this.datails = res.data
            this.$nextTick(()=>{
              this.complete = true
            })
            this.$set(this.datails, 'index', this.selectIndex)
          } else {
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
        })
      },
    },
    components: {
      RecommendedGift
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .bgImg {
    background #fbf8d7
  }
  .activity-strategy {
    .activity-strategy-container {
      position absolute
      top:0
      left 0
      right 0
      bottom: 0
      background #fbf8d7
      padding: 11px 15px
      display flex
      flex-direction column
      .top {
        flex: 0
        .tips {
          padding-bottom: 5px
          line-height 20px
          .title {
            color: $color-theme-r
          }
          .text {
            color: $color-text
          }
        }
      }
      .content {
        flex: 1
        overflow-y auto
        border-radius 4px
        background #fff
        padding: 11px 15px
      }
    }
  }
</style>

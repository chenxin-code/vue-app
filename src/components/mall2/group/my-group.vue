<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="my-group">
      <div class="nav-bar">
        <div class="nav-bar-item" :class="{active: currentIndex === index}" v-for="(item, index) in menu"
             @click="tabChange(index)">
          <span class="text">{{item.text}}</span>
        </div>
      </div>
      <div class="my-group-list">
        <div class="my-group-item" v-for="(item, index) in groupList" :key="index" @click="openGroupDetails(item)">
          <img class="media-object" :src="getItemImg(item)" alt="">
          <div class="media-content">
            <div class="name ellipsis-2">{{item.skuName}}</div>
            <div class="count-down" v-if="item.state == 2 || item.state == 4">
              <countdown class="count-down-con" :hiddenDay="true" :endTime="$util.getDateFromString(item.endTime)"
                         type="theme_bg_red"></countdown>
              <span class="text">后结束</span>
            </div>
            <div class="count-down" v-else></div>
            <div class="message">
              <div class="text" v-if="item.groupBuyNumOfPerson - item.currentNumOfPerson > 0">
                还差<span class="num">{{getLessMember(item)}}人</span>可拼团成功
              </div>
              <div class="text" v-else>
                恭喜您！已开团成功！
              </div>
              <div class="btn" v-if="item.state == '2'">邀请好友</div>
              <div class="btn" v-if="item.state == '4'">去付款</div>
            </div>
            <div class="state">
              <img class="img" src="@/assets/state/success.png" alt="" v-if="item.state == 10">
              <img class="img" src="@/assets/state/expire.png" alt="" v-else-if="item.state == 9 || item.state == 6">
            </div>
          </div>
        </div>
        <div class="tips" v-if="groupList.length == 0">暂无活动,快去发起拼团活动吧~</div>
        <div class="tips" v-else v-show="showTips">没有更多数据了~</div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import Countdown from "@/components/Vendor/countdown/countdown"

  export default {
    name: '',
    data() {
      return {
        currentIndex: 0,
        groupList: [], // 列表
        showTips: false, // 加载完毕提示
        state: '', // 状态 0-未启用 1-生效 2-已开团 9-组团失败 10-组团成功(0和1暂时没有)
        menu: [{text: '全部拼团'}, {text: '待支付'}, {text: '进行中'}, {text: '拼团成功'}, {text: '拼团失败'}]
      }
    },
    mounted() {
      this.queryGroupList()
    },
    methods: {
      getLessMember: function (item) {
        return item.groupBuyNumOfPerson - item.currentNumOfPerson
      },
      getItemImg: function (item) {
        let leaderUserAward = item.leaderUserAward
        if (leaderUserAward.length > 0) {
          let gameAwardPic = leaderUserAward[0].gameAwardPic
          return gameAwardPic
        }
        return ''
      },
      tabChange(index) {
        // 切换tab
        this.currentIndex = index
        console.log(index)
        if (this.currentIndex === 0) {
          this.state = ''
        } else if (this.currentIndex === 1) {
          this.state = 4
        } else if (this.currentIndex === 2) {
          this.state = 2
        } else if (this.currentIndex === 3) {
          this.state = 10
        } else if (this.currentIndex === 4) {
          this.state = 9
        }
        this.groupList = []
        this.queryGroupList()

      },
      queryGroupList() {
        // 列表
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          state: this.state,
          groupBuyType: '1'
        }
        this.$http.post('/app/json/app_fight_group_order/query', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.groupList = data.data.orderList || []
            this.showTips = true
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
      openGroupDetails(item) {
        // 打开拼团详情
        this.$router.push({
          path: '/group_detail',
          query: {
            orderId: item.id,
            mktGroupBuyId: item.mktGroupBuyId
          }
        })
      }
    },
    components: {Countdown}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .my-group {
    .nav-bar {
      height 44px
      line-height: 44px
      display: flex
      background: #fff

      .nav-bar-item {
        text-align: center
        flex 1

        .text {

        }

        &.active {
          .text {
            color: $color-theme-r
            position: relative

            &:after {
              content ''
              position: absolute
              bottom: -6px
              width 100%
              left: 0
              height 2px
              background: $color-theme-r
            }
          }
        }

      }
    }
  }

  .my-group-list {
    background: #fff
    padding 7px
    position: absolute
    top: 44px
    left: 0
    right: 0
    bottom: 0
    overflow-y auto
    -webkit-overflow-scrolling touch

    .my-group-item {
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
      padding 11px
      margin 8px
      border-radius 5px
      overflow: hidden

      .media-object {
        width 90px
        height 90px
        float: left
      }

      .media-content {
        overflow: hidden
        padding-left 8px
        position: relative

        .name {
          font-size: 15px
          line-height: 19px
        }

        .count-down {
          display flex
          min-height 25px;
          align-items center
          padding-top: 10px

          .count-down-con {
            justify-content: flex-start
          }

          .text {
            flex-shrink 0
            font-size: 12px
          }
        }

        .state {
          position: absolute
          right: 10px
          bottom: 10px

          .img {
            width 50px
          }
        }
      }

      .message {
        display flex
        align-items center
        justify-content space-between
        padding-top: 14px

        .text {
          .num {
            color: $color-theme-r
          }
        }

        .btn {
          color: #fff
          background: $color-theme-r
          border-radius 30px
          padding 6px
        }
      }
    }

    .tips {
      padding: 20px 0
      text-align center
      color: $color-text-l
    }
  }
</style>

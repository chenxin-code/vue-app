<template>
  <div class="application-history">
    <nav-top title="申请历史" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="application-history-container">
      <ul class="list">
        <li class="item" v-for="(item, index) in historyList" :key="index">
          <div class="time">{{item.createTime}}</div>
          <div class="content">
            <div class="info">
              <div class="left">申请金额</div>
              <div class="right money">￥{{item.refundAmount}}</div>
            </div>
            <div class="info" v-if="item.state == 2">
              <div class="left">审批金额</div>
              <div class="right money">￥{{item.actualRefundAmount}}</div>
            </div>
            <div class="info">
<!--              0：待审核 1：待退款 2：已完成 3：审核失败-->
              <div class="left">申请状态</div>
              <div class="right" v-if="item.state == 0">待审核</div>
              <div class="right" v-else-if="item.state == 1">待退款</div>
              <div class="right" v-else-if="item.state == 2">已完成</div>
              <div class="right" v-else-if="item.state == 3">审核失败</div>
            </div>
            <div class="info">
              <div class="left">申请备注</div>
              <div class="right">{{item.applyRemark}}</div>
            </div>
            <div class="info" v-if="item.state != 0">
              <div class="left">审核备注</div>
              <div class="right">{{item.approvalRemark}}</div>
            </div>
          </div>
        </li>
      </ul>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        historyList: []
      }
    },
    mounted() {
      this.refundApplyList()
    },
    methods: {
      refundApplyList() {
        // 申请退款列表
        this.$request.post('/app/jqGrid/my_wallet/refundApplyList').then(res => {
          if (res.status === 0) {
            this.historyList = res.data
          } else {
            this.$Toast(res.info ? res.info : '获取退款列表失败')
          }
        })
      },
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .application-history {
    .application-history-container {
      padding: 0 15px 11px 15px
      overflow-y auto
      -webkit-overflow-scrolling touch
      .list {
        .item {
          .time {
            padding: 10px
            color: $color-text-d
          }
          .content {
            box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
            border-radius 6px
            padding: 11px
            line-height 26px

            .info {
              display flex
              justify-content space-between
              align-items center
              .left {
                color: $color-text-d
              }
              .right {
                color: $color-text
              }
              .money {
                color: $color-theme-r
              }
            }
          }
        }
      }
    }
  }
</style>

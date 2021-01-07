<template>
  <div class="oil-package">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="oil-package-container open" v-if="complete">
      <div class="content">
        <div class="title-info">
          <div class="info">
            <div class="title-name">
              <div class="left">{{assembleDetail.groupName}}</div>
              <div class="right">拼团成功</div>
            </div>
            <div class="text">活动开始时间：{{assembleDetail.rebateStartTime}}</div>
            <div class="text">活动结束时间：{{assembleDetail.rebateEndTime}}</div>
          </div>
        </div>
        <div class="statistical">
          <div class="title">个人加油统计</div>
          <ul class="list">
            <li class="item">
              <div class="oil-info">
                <div class="name">加油升数</div>
                <div class="num">{{assembleDetail.refuelLiter || 0}}</div>
              </div>
              <div class="oil-info middle">
                <div class="name">返还油点</div>
                <div class="num">{{assembleDetail.oilPointNumber || 0}}</div>
              </div>
              <div class="oil-info">
                <div class="name">加油金额</div>
                <div class="num">{{assembleDetail.refuelAmount || 0.00}}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="title">个人加油明细</div>
      </div>
      <ul class="details-list">
        <li class="details-item" v-for="(item, index) in assembleDetail.refuleRecords" :key="index" v-if="index < 5">
          <div class="info">
            <div class="name">订单号</div>
            <div class="details-text">{{assembleDetail.orderId}}</div>
          </div>
          <div class="info">
            <div class="name">加油时间</div>
            <div class="details-text">{{assembleDetail.refuelDate}}</div>
          </div>
          <div class="info">
            <div class="name">加油升数</div>
            <div class="details-text">{{assembleDetail.refuelLiter}}</div>
          </div>
          <div class="info">
            <div class="name">加油金额</div>
            <div class="details-text">{{assembleDetail.refuelAmount}}</div>
          </div>
          <div class="info">
            <div class="name">返还油点</div>
            <div class="details-text">{{assembleDetail.oilPointNumber}}</div>
          </div>
        </li>
        <div class="more-btn" v-if="assembleDetail.refuleRecords && assembleDetail.refuleRecords.length > 5" @click="openRecord">查看更多加油记录</div>
        <div class="no-data" v-if="assembleDetail.refuleRecords && assembleDetail.refuleRecords.length == 0">
          <div class="img">
            <img src="../oil-package/image/p1.png" alt="">
          </div>
          <div class="text">暂无数据</div>
        </div>
      </ul>
    </nav-content>
  </div>
</template>

<script>
  import utils from "@/utils/util"
  import Cookie from 'js-cookie'

  export default {
    data() {
      return {
        complete: false,
        assembleDetail: {}
      }
    },
    mounted() {
      this.myAssembleDetail()
    },
    methods: {
      myAssembleDetail() {
        // 成功参团详情
        this.$request.post('/app/json/app_assemble_activity/myAssembleDetail', {
          id: this.$route.query.id
        }).then(res => {
          if (res.status == 0) {
            this.assembleDetail = res.data
            this.complete = true
          } else {
            this.$Toast(res.info ? res.info : '获取参团信息失败')
          }
        })
      },
      openRecord() {
        this.$router.push({path: '/oil-group-record', query: {id: this.$route.query.id}})
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .oil-package {
    background-color: #f8f8f8 !important

    .open {
      padding: 11px 0
      overflow-y auto

      .content {
        .already {
          padding: 8px 15px
          background #fbf8d9
          color #e38641
          line-height 20px
          font-size 14px

          .over-due-tips {
            color: $color-theme-r
          }
        }

        .title-tips {
          background #fbf8d9
          padding: 5px 15px
          text-align center
          margin-bottom: 10px
          display flex
          justify-content space-between
          align-items center

          .text {
            color #e38641
          }

          .btn {
            padding: 5px 10px
            border-radius 20px
            background $color-theme-btn-d
            color: #fff
          }
        }

        .title-info {
          .info {
            padding: 11px 15px
            background #fff
            line-height 24px

            .title-name {
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

            .special {
              color: $color-text-l
            }
          }
        }

        .statistical {

          .list {
            background #fff
            padding: 15px 5px
            font-size 10px

            .item {
              display flex
              justify-content space-between
              align-items center

              .oil-info {
                flex: 1
                background #f3f2f2
                height 75px
                border-radius 6px
                display flex
                justify-content center
                align-items center
                flex-direction column
                line-height 24px

                & + .oil-info {
                  margin-left: 8px
                }

                .num {
                  font-size 16px
                  color: $color-theme-r
                  word-wrap: break-word;
                  word-break: break-all;
                  overflow: hidden;
                  text-align: center
                  line-height 22px
                }
              }

              .middle {
                box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
                background #fff

                .num {
                  font-size 24px
                }
              }
            }
          }
        }

        .title {
          padding: 10px 15px
        }
      }

      .details-list {
        overflow-y auto
        -webkit-overflow-scrolling touch
        max-height 350px

        .details-item {
          line-height 26px
          background #fff
          padding: 11px 15px
          margin-bottom: 10px

          .info {
            display flex
            justify-content space-between

            .name {
              width: 150px
              color: $color-text-d
            }

            .details-text {
              word-break: break-all;
              line-height 15px
            }
          }
        }
      }

      .more-btn {
        text-align center
        padding: 5px 0 11px 0
        color: $color-theme-r
        font-size 14px
      }

      .no-data {
        display flex
        justify-content center
        align-items center
        flex-direction column
        padding: 30px 0
        color: $color-text-d
        background #fff

        .img {
          padding-bottom: 20px

          img {
            width: 100px
          }
        }
      }
    }
  }

</style>

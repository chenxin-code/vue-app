<template>
  <div class="oil-group-share">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="oil-group-share-container" v-if="complete">
      <div class="share">
        <div class="group-details">
          <div class="img-text">
            <div class="img">
              <img :src="shareDetail.image" alt="">
            </div>
            <div class="text">
              <div class="name">{{shareDetail.assembleName}}</div>
              <div class="tips">
                <div class="left">拼团中({{shareDetail.assembleState == 1 ? '未成团' : '已成团'}})</div>
              </div>
            </div>
          </div>
          <div class="details">
            <div class="main">
              <div class="info">
                <div class="progress">
                  <van-progress :color="shareDetail.joinNumber < shareDetail.groupNumber ? '#F80F16' : '#009800'" :percentage="percentage" :show-pivot="showPivot"/>
                </div>
                <div class="tips" v-if="shareDetail.joinNumber < shareDetail.groupNumber">当前参团人数为<span class="num">{{shareDetail.joinNumber}}</span>人，再有<span class="num">{{(shareDetail.groupNumber - shareDetail.joinNumber).toFixed(0)}}</span>人参加才可拼团成功</div>
                <div class="tips" v-else>当前参团人数为<span class="num">{{shareDetail.joinNumber}}</span>人，只剩<span class="num">{{(shareDetail.groupUpLimit - shareDetail.joinNumber).toFixed(0)}}</span>个参团名额</div>
              </div>
            </div>
          </div>
        </div>
        <div class="group-details">
          <div class="title">参团优惠规则</div>
          <div class="content" v-html="shareDetail.activityDesc"></div>
        </div>
        <div class="tips" v-if="success">加入成功！点击<span class="special" @click="openDetails">前速查看</span>可前往查看拼团详情</div>
        <div class="btn-show">
          <div class="time">
            还剩：<countdown
            :endTime="$util.getDateFromString(this.shareDetail.endTime)"
            type="theme_bg_white"
          />
          </div>
          <div class="btn" @click="addAssembleUser">接受邀请</div>
        </div>
      </div>
      <van-dialog
        v-model="show"
        confirmButtonText="取消"
        @confirm="show = false"
      >
        <div class="pop-tips">邀请链接已失效</div>
      </van-dialog>
    </nav-content>
  </div>
</template>

<script>
  import {Progress} from 'vant'
  import countdown from "@/components/Vendor/countdown/countdown";

  export default {
    data() {
      return {
        complete: false,
        success: false, // 邀请成功提示
        show: false, // 邀请链接已失效
        showPivot: false, // 进度条文字
        shareDetail: {},
        percentage: 0
      }
    },
    mounted() {
      this.queryAssembleActivityDetail()
    },
    methods: {
      addAssembleUser() {
        // 参加拼团
        this.$request.post('/app/json/app_assemble_activity/addAssembleUser',{assembleId: this.shareDetail.id}).then(res => {
          if (res.status == 0) {
            this.queryAssembleActivityDetail()
            this.$toast('参团成功')
            this.success = true
          } else {
            this.$Toast(res.info ? res.info : '参团失败')
          }
        })
      },
      queryAssembleActivityDetail() {
        // 获取拼团详情
        this.$request.post('/app/json/app_assemble_activity/queryAssembleActivityDetail',{
          id: this.$route.query.id // groupActivityId
        }).then(res => {
          if (res.status == 0) {
            this.shareDetail = res.data
            this.dealState()
            this.percentage = this.calculateProgress()
            this.complete = true
          } else {
            this.$Toast(res.info ? res.info : '参团失败')
          }
        })
      },
      dealState() {
        // 判断当前链接是否失效
        const date = new Date(this.$store.state.severTime.currentTime)
        const endDate = new Date(this.shareDetail.endTime)
        if (date > endDate) {
          this.show = true // 邀请链接已失效
        }
      },
      calculateProgress() {
        // 计算进度条
        if (this.shareDetail.groupUpLimit) {
          let calculateResult = ((this.shareDetail.joinNumber / this.shareDetail.groupUpLimit) * 100)
          return Number(parseInt(calculateResult))
        }
      },
      openDetails() {
        this.$router.push({path: '/oil-group-details', query: {id: this.$route.query.id}})
      }
    },
    components: {
      [Progress.name]: Progress,
      countdown
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .oil-group-share {
    .oil-group-share-container {
      .share {
        position absolute
        top: 0
        left: 0
        right: 0
        bottom: 0
        background url('./image/bg@2x.png')
        background-size 100% 100%
        padding 200px 15px 15px 15px
        .group-details {
          box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
          background: #fff
          border-radius 6px
          padding: 11px
          margin: 10px 0
          .title {
            font-size 14px
          }
          .content {
            padding-top: 10px
            color: $color-text-d
            line-height 20px
            max-height 80px
            overflow-y auto
          }
          .img-text {
            display flex
            justify-content space-between
            align-items center
            .img {
              width: 90px
              padding-right: 5px
              img {
                width 100%
              }
            }
            .text {
              flex: 1
              .name {
                line-height 18px
                font-weight bold
                font-size 16px
              }
              .tips {
                padding-top: 10px
                color: $color-theme-r
                font-size: 12px
                display flex
                justify-content space-between
                align-items center
                .btn {
                  background $color-theme-r
                  color: #fff
                  border-radius 20px
                  padding: 8px 10px
                  text-align center
                }
              }
            }
          }
          .details {
            .main {
              display flex
              justify-content space-between
              align-items center
              padding: 10px 0
              .info {
                flex: 1
                padding-right: 25px
                .tips {
                  color: $color-text-d
                  padding-top: 10px
                  font-size 10px
                  line-height 18px
                  .num {
                    color: $color-theme-r
                  }
                }
                .progress {
                  width 70%
                }
              }
              .btn {
                width: 30%
                background $color-theme-r
                color: #fff
                border-radius 20px
                padding: 10px 0
                text-align center
              }
            }
            .special {
              padding: 10px 0
              .oil {
                display flex
                justify-content space-between
                align-items center
                color: $color-text
                & + .oil {
                  padding-top: 10px
                }
                .num {
                  color: $color-theme-r
                }
              }
            }
          }
          /deep/ .van-hairline--top-bottom::after {
            border-width: 0
          }
          /deep/ .van-cell {
            padding 10px 0 0 0
          }
          /deep/ .van-cell:not(:last-child)::after {
            border-bottom: 0
          }
          /deep/ .van-collapse-item__content {
            padding: 10px 0 0 0
          }
        }
        .btn-show {
          position absolute
          bottom: 15px
          left: 0
          right: 0
          text-align center
          color: #fff
          .time {
            display flex
            justify-content center
            align-items center
            padding-bottom: 10px
          }
          .btn {
            background url("./image/btn.png") no-repeat
            background-size 100% 100%
            width: 95%
            padding: 15px 0
            text-align center
            margin: 0 auto
            color: #341f90
            font-size 14px
          }
        }
        .tips {
          color: #fff
          text-align center
          .special {
            color: #fbda30
            text-decoration underline
          }
        }
      }
    }
  }
    /deep/ .countdown {
      .theme_font_white {
        color: $color-text !important
      }
    }
  .pop-tips {
    text-align center
    padding: 50px 0
    line-height 20px
    font-size 16px
  }
  /deep/ .van-dialog__confirm {
    color: $color-text
  }
</style>

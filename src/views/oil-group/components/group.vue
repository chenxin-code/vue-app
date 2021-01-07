<template>
  <div class="group">
    <div class="time-show" v-if="currentIndex == 0 || !type">
      <div class="left">参团倒计时</div>
<!--      <van-progress :percentage="50" />-->
      <div class="right">
        还剩：<countdown
        :endTime="$util.getDateFromString(details.endTime)"
        type="theme_bg_black"
      />
      </div>
    </div>
    <div class="group-details">
      <div class="img-text">
        <div class="img">
          <img :src="details.image" alt="">
        </div>
        <div class="text">
          <div class="name">{{details.assembleName}}</div>
          <div class="tips">
            <div class="left" v-if="type == 1">
              <span v-if="currentIndex == 0">拼团中({{details.assembleState == 1 ? '未成团' : '已成团'}})</span>
              <span v-if="currentIndex == 1">拼团成功({{state}})</span>
              <span v-if="currentIndex == 2">拼团失败</span>
            </div>
            <div class="left" v-else>拼团中({{details.assembleState == 1 ? '未成团' : '已成团'}})</div>
            <div class="btn" @click="openDetails" v-if="currentIndex == 1">查看详情</div>
          </div>
        </div>
      </div>
      <div class="details">
        <div class="main" v-if="currentIndex != 1">
          <div class="info">
            <div class="progress" :class="{active: currentIndex == 2}">
<!--              <van-progress :percentage="50" />-->
              <van-progress :percentage="calculateProgress()"  :color="details.joinNumber < details.groupNumber ? '#F80F16' : '#009800'" :show-pivot="showPivot"/>
            </div>
            <div class="tips" v-if="details.joinNumber < details.groupNumber">当前参团人数为<span class="num">{{details.joinNumber}}</span>人，再有<span class="num">{{(details.groupNumber - details.joinNumber).toFixed(0)}}</span>人参加才可拼团成功</div>
            <div class="tips" v-else>当前参团人数为<span class="num">{{details.joinNumber}}</span>人，只剩<span class="num">{{((details.groupUpLimit - details.joinNumber).toFixed(0)) > 0 ? (details.groupUpLimit - details.joinNumber).toFixed(0) : 0}}</span>个参团名额</div>
          </div>
          <div class="btn" :class="{active: details.joinNumber == details.groupUpLimit}" @click="oilGroupBtn" v-if="currentIndex != 2">{{type == 1 ? '邀请好友' : '点击参团'}}</div>
        </div>
        <div class="special" v-if="currentIndex == 1">
          <div class="oil">
            <div class="title">已返利油点</div>
            <div class="oil-info num">{{details.oilPointNumber || 0}}</div>
          </div>
          <div class="oil">
            <div class="title">返利活动开始时间</div>
            <div class="oil-info">{{details.rebateStartTime}}</div>
          </div>
          <div class="oil">
            <div class="title">返利活动结束时间</div>
            <div class="oil-info">{{details.rebateEndTime}}</div>
          </div>
        </div>
      </div>
      <van-collapse v-model="activeNames">
        <van-collapse-item title="参团优惠规则">
          <div v-html="details.activityDesc"></div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <!--        分享弹框-->
<!--    <van-popup v-model="showShare" position="bottom">-->
<!--      <div class="share-content">-->
<!--        <div class="title">邀请好友一起拼团</div>-->
<!--        <div class="share-main" @click="shareBtn">-->
<!--          <div class="img">-->
<!--            <img src="../../oil-package/image/icon-weixin.png" alt="">-->
<!--          </div>-->
<!--          <div class="text">微信好友</div>-->
<!--        </div>-->
<!--        <div class="btn" @click="showShare = false">取消</div>-->
<!--      </div>-->
<!--    </van-popup>-->
  </div>
</template>

<script>
  import {Progress} from 'vant'
  import Config from "@/api/config"
  import countdown from "@/components/Vendor/countdown/countdown";
  export default {
    data() {
      return {
        showPivot: false, // 进度条文字
        activeNames: [], // 折叠面板
        // showShare: false, // 分享弹框
        state: '' // 状态
      }
    },
    props: {
      type: '', // 1 我的拼团 其余 首页
      currentIndex: '', // 0拼团中 1拼团成功 2拼团失败
      details: {} // 详情
    },

    mounted() {
      /**
       * joinNumber 参与人数
       * groupNumber 成团人数
       * groupUpLimit 团上限
       */
      if (this.details) {
        this.state = this.dealState()
      }
    },
    methods: {
      calculateProgress() {
        // 计算进度条
        if (this.details.groupUpLimit) {
          let calculateResult = ((this.details.joinNumber / this.details.groupUpLimit) * 100)
          if (parseInt(calculateResult) > 100) {
            return 100
          } else {
            return parseInt(calculateResult) || 0
          }
        }
      },
      dealState() {
        if (this.details) {
          const date = new Date()
          const startDate = new Date(this.details.rebateStartTime.replace(/-/g, "/"))
          const endDate = new Date(this.details.rebateEndTime.replace(/-/g, "/"))
          if (date < startDate) {
            return '未开始'
          } else if (date <= endDate){
            return '进行中'
          } else if (date > endDate){
            return '已结束'
          } else {
            return '--'
          }
        }
      },
      addAssembleUser() {
        // 参加拼团
        this.$request.post('/app/json/app_assemble_activity/addAssembleUser',{assembleId: this.details.id}).then(res => {
          if (res.status == 0) {
            this.$toast('参团成功')
            this.$emit('updateData')
          } else {
            this.$Toast(res.info ? res.info : '参团失败')
          }
        })
      },
      shareBtn() {
        // 去分享
        // this.$router.push({path: '/oil-group-share', query: {id: this.details.groupActivityId}})
        const shareData = {
          title: this.details.assembleName,
          sharetext: this.details.activityDesc,
          imageurl: this.details.image,
          detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/oil-group-share?id=${this.details.groupActivityId}`
        }
        this.$bridgefunc.wechatShare(shareData)
      },
      oilGroupBtn() {
        console.log(this.type)
        if (this.details.joinNumber == this.details.groupUpLimit) {
          this.$Toast('该活动已达到最大上限人数')
        } else {
          if (this.type == 1) {
            // 邀请好友
            this.shareBtn()
          } else {
            // 点击参团
            this.addAssembleUser()
          }
        }
      },
      openDetails() {
        // 查看详情
        this.$router.push({path: '/oil-group-details', query: {id: this.details.id}})
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
  .group {
    .time-show {
      display flex
      justify-content space-between
      align-items center
      .right {
        display flex
        justify-content center
        align-items center
      }
    }
    .group-details {
      box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
      background: #fff
      border-radius 6px
      padding: 11px
      margin: 10px 0
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
        border-bottom: 1px solid #ebedf0
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
            .active {
              width: 70%
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
          .active {
            opacity 0.3
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
    .share-content {
      padding: 20px
      display flex
      justify-content center
      align-items center
      flex-direction column
      .share-main {
        display flex
        justify-content center
        align-items center
        flex-direction column
        padding-bottom: 30px
        width 100%
      }

      .title {
        font-weight bold
        font-size 14px
        color: $color-text
        padding-bottom: 30px
      }

      .img {
        padding-bottom: 10px

        img {
          width: 40px
        }
      }

      .text {
        color: $color-text
      }
    }
  }

</style>

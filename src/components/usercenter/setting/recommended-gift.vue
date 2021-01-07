<template>
  <div class="step-container">
    <div class="time" v-if="type != 1">活动时间：{{dealTime(datails.startDate, datails.endDate)}}</div>
    <div class="steps-list" :class="{vertical: type == 1}">
      <div class="step" v-for="(item, index) in list" :class="{noAchieve: item.num > joinNum}">
        <div class="circle" :class="{dot: index===0}" @click.stop="tipsBtn(index, item)">
          <template v-if="index !== 0">
            <img class="icon" v-if="item.num < joinNum" src="./images/gift1.png" alt="">
            <img v-else class="icon" src="./images/gift2.png" alt="">
          </template>
        </div>
        <div class="content">
          <div class="left-con">
            <p>{{item.desc}}<span v-if="index != 0">人</span></p>
            <p v-if="type == 1 && item.num > joinNum && item.num == nowPeople" class="people-num">差{{peopleNum || 0}}人</p>
          </div>
          <div class="right-con" v-if="type == 1 && index !== 0">
            <p>任务描述：活动时间内，邀请新用户注册数量达到{{item.desc}}人即可。</p>
            <p>奖品描述：<span v-for="(item2, index2) in item.info" :key="index2"><span
              v-if="index2 != 0">+</span>{{item2.awardName}}*{{item2.awardNum}}</span></p>
          </div>
        </div>
        <div class="line-wrapper">
          <div class="line">
            <span class="line-inner" :style="formatLineStyl(item.step)"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="from-num" v-if="type != 1">距完成下一任务还差{{peopleNum || 0}}人</div>
    <div v-if="waitPriceList">
      <van-dialog
        v-model="showAllPrice"
        :title="title"
        overlay="overlay"
        confirmButtonText="全部领取"
        @confirm="allConfirm"
      >
        <div class="dialog-tips">
          <div class="no-receive">
            <div class="title">恭喜您成功邀请了{{joinNum}}位好友注册APP，可立即领取奖品</div>
            <ul class="list">
              <li class="item" v-for="(item, index) in waitPriceList" :key="index">奖品{{index
                +1}}:{{item.awardName}}*{{item.awardNum}}
              </li>
            </ul>
          </div>
        </div>
      </van-dialog>
      <div class="van-overlay" v-show="showAllPrice" style="z-index: 99;"></div>
    </div>
    <div v-if="priceInfo">
      <van-dialog
        v-model="showTips"
        :title="title"
        :confirmButtonText="confirmButtonText"
        @confirm="partConfirm"
      >
        <div class="dialog-tips">
          <div class="no-receive">
            <div class="title" v-if="priceInfo.info[0].state == -1">再邀请{{priceInfo.num - joinNum}}人注册，即可领取以下奖品</div>
            <div class="title" v-else-if="priceInfo.info[0].state == 10">恭喜您成功邀请了{{joinNum}}位好友注册APP，可立即领取奖品</div>
            <div class="title"
                 v-else-if="priceInfo.info[0].state == 15 || priceInfo.info[0].state == 20 || priceInfo.info[0].state == 30">
              奖品已经领过啦！
            </div>
            <div class="title" v-else></div>
            <ul class="list">
              <li class="item" v-for="(item, index) in priceInfo.info" :key="index">奖品{{index
                +1}}:{{item.awardName}}*{{item.awardNum}}
              </li>
            </ul>
          </div>
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'step',
    data() {
      return {
        list: [],
        overlay: true,
        peopleNum: 0,
        joinNum: 0,
        showTips: false, // 弹框
        showAllPrice: false, // 全部奖品弹框
        priceInfo: '', // 信息
        title: '', // 弹框标题
        confirmButtonText: '',
        waitPriceList: [], // 所有待领取的奖品
        nowPeople: '' // 距离此人数 还差几人
      }
    },
    props: {
      datails: {},
      type: ''
    },
    mounted() {
      this.deal()
      this.stepShow()
    },
    methods: {
      deal() {
        // 弹框title显示
        if (this.datails.index == 0) {
          this.title = '推荐注册有礼'
        } else {
          this.title = '推荐绑卡有礼'
        }
        // 获取 整个list
        let arr = []
        for (var key in this.datails.awardMap) {
          arr.push({desc: key, num: key, info: this.datails.awardMap[key]})
        }
        this.list = arr
        console.log(arr)
        // 获取当前推荐或者绑卡人数
        if (this.datails.index === 0) {
          // this.joinNum = 13
          this.joinNum = this.datails.registerReferrals
        } else {
          this.joinNum = this.datails.bindCardReferrals
        }
        // 计算 还差多少人 达到下一任务
        if (arr.length) {
          arr.unshift({desc: '开始', num: 0, step: 0, total: 0})
          this.dealRebate(this.list, this.joinNum)
        }
        // 获取全部待领取奖品
        let waitPriceList = []
        this.list.forEach(item => {
          if (item.info && item.info[0].state == 10) {
            // 待领取
            item.info.forEach(item2 => {
              waitPriceList.push(item2)
            })
          }
        })
        this.waitPriceList = waitPriceList
        if (this.waitPriceList.length) {
          this.$nextTick(() => {
            this.showAllPrice = true
          })
        }
        console.log(waitPriceList)
      },
      nowGet(awardRecId) {
        // 立即领取
        this.$request.post('/app/json/app_market/receiveAward', {
          awardRecId: awardRecId
        }).then(res => {
          if (res.status === 0) {
            this.$Toast('领取成功')
          } else {
            this.$Toast(res.info ? res.info : '领取失败')
          }
        }).catch(err => {
          this.$Toast(res.info ? res.info : '领取失败')
        })
      },
      tipsBtn(index, item) {
        if (index !== 0 && this.type != 1) {
          console.log(this.joinNum)
          this.priceInfo = item
          console.log(this.priceInfo)
          console.log(this.datails)
          if (this.priceInfo.info[0].state == -1) {
            // state:-1 未满足人数条件 10 待领取（奖品机会）(15 派发失败 20 派发成功 30 补派发成功) - 已领取
            this.confirmButtonText = '我知道了'
          } else if (this.priceInfo.info[0].state == 10) {
            this.confirmButtonText = '领取奖品'
          } else if (this.priceInfo.info[0].state == 15 || this.priceInfo.info[0].state == 20 || this.priceInfo.info[0].state == 30) {
            this.confirmButtonText = '我知道了'
          }
          this.showTips = true // 提示框
        }
      },
      dealRebate(arr, num) {
        let arry1 = [].concat(arr).sort((a, b) => a.oilLiter - b.oilLiter)
        let result = []
        for (let i = 0; i < arry1.length - 1; i++) {
          const item = arry1[i]
          const item2 = arry1[i + 1]
          if (item.num <= num && num < item2.num) {
            result.push(item)
            result.push(item2)
            break
          } else if (i === (arry1.length - 2) && num >= item2.num) {
            result.push(item2)
            break
          }
        }
        this.peopleNum = result[1].num - num
        this.nowPeople = result[1].num
      },
      stepShow() {
        // this.list.unshift({desc: '开始', num: 0, step: 0, total: 0})
        for (let i = 1; i < this.list.length; i++) {
          const item = this.list[i]
          const preItem = this.list[i - 1]
          this.$set(item, 'step', 0)
          if (item.num < this.joinNum) {
            preItem.step = 100
          } else {
            preItem.step = parseInt((this.joinNum - preItem.num) / (item.num - preItem.num) * 100)
            break
          }
        }
      },
      allConfirm() {
        // 全部领取
        let awardRecIdList = []
        this.waitPriceList.forEach(item => {
          awardRecIdList.push(item.awardRecId)
        })
        this.nowGet(awardRecIdList.join(','))
      },
      partConfirm() {
        // 部分领取
        if (this.priceInfo && this.priceInfo.info[0].state == 10) {
          let awardRecIdList = []
          this.priceInfo.info.forEach(item => {
            awardRecIdList.push(item.awardRecId)
          })
          this.nowGet(awardRecIdList.join(','))
        } else {
          this.showTips = false
        }
      },
      formatLineStyl(s) {
        return this.type == 1 ? {height: `${s}%`} : {width: `${s}%`}
      },
      dealTime(begin, end) {
        if (begin || end) {
          return begin.split(' ')[0] + '~' + end.split(' ')[0]
        } else {
          return ''
        }
      },
    },
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  $width = 40px
  $color = #fd0019
  .time {
    text-align left
    padding-bottom: 15px
  }
  .steps-list {
    display: flex;
    overflow-y: auto;

    .step {
      position: relative;
      flex-shrink: 0;

      .circle {
        width: $width
        height: $width
        position: absolute;
        z-index 2
        display: flex;
        border-radius: 50%;
        justify-content: center;
        align-items: center;

        &.dot:after {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0);
          content: '';
          width: 20px;
          height: 20px;
          background: #fff;
          border 2px solid $color
          border-radius: 50%;
        }

        .icon {
          width 80%;
          height 80%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0);
        }
      }

      .content {
        padding-top: $width + 5px
        min-width 90px;
        text-align left
        padding-left 8px
      }

      .line-wrapper {
        position: absolute;
        display: block;
        top: $width* 0.5 - 3px;
        left: $width* 0.5;
        width: 100%;
        padding 0 $width* 0.25

        .line {
          width 100%
          border .5px solid $color
          height 6px;
          position: relative

          .line-inner {
            content: '';
            position absolute
            left: 0;
            background: $color
            height 6px;
          }
        }
      }

      &:last-child {
        .line {
          display: none;
        }
      }

      .icon {

      }
    }

    .noAchieve {
      color: $color-text-d
    }
    &.vertical {
      display block
      padding-left: 50px;

      .step {
        height 150px;
        width auto
      }

      .content {
        position: absolute;
        top: 24px;
        padding-top 0
        text-align left
        transform translate3d(0, -50%, 0)
        .left-con {
          position absolute
          top: 50%;
          left -50px;
          transform translate3d(0, -50%, 0)
          line-height 20px
          .people-num {
            color: $color-theme-r
          }
        }

        .right-con {
          padding-left: 40px;
          line-height 20px
          p {
            & + p {
              padding-top: 5px
            }
          }
        }
      }

      .line-wrapper {
        position: absolute;
        display: block;
        top: $width - 10px;
        left: $width* 0.5 - 3px;
        height: 100%;
        width auto
        padding 0

        .line {
          width 6px
          border .5px solid $color
          height 100%
          position: relative

          .line-inner {
            content: '';
            position absolute
            left: 0;
            background: $color
            width 4px;
          }
        }
      }
    }
  }
  .from-num {
    padding-top: 10px
    color: $color-theme-r
  }
  .dialog-tips {
    text-align left
    padding: 15px
    color: $color-text-d

    .title {
      line-height 20px
      padding-bottom: 5px
    }

    .list {
      max-height 80px
      overflow-y auto

      .item {
        line-height 22px
        text-indent 2em
      }
    }
  }

  /deep/ .van-dialog__confirm, .van-dialog__confirm:active {
  }

  /deep/ .van-overlay {
    z-index 9999
  }

  /deep/ .van-dialog__header {
    font-size 16px
  }
</style>

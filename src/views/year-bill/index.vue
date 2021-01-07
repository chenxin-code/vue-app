<template>
  <div class="year-bill">
    <div class="music" @click="setMusic">
      <img class="anim-music" v-if="music" src="./image/music.png" alt="">
      <img v-else src="./image/music_no.png" alt="">
    </div>
    <audio ref="music" src="./mp3/opus.mp3"></audio>

    <van-swipe ref="swipe" @change="change" :touchable="touchable" style="height: 100%;" vertical
               :show-indicators='false' :loop='false'>
      <van-swipe-item v-if="showIndex">
        <div class="year-bill-index" @click="showEruda">
          <div class="btn" @click="nowOpen"></div>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="one page">
          <div class="icon">
            <img src="./image/next-icon.png" alt="">
          </div>
          <div class="page-show">
            <div class="top">
              <img src="./image/top-1.png" alt="">
            </div>
            <div class="center">
              <ul class="text-list">
                <li class="text-item" v-for="(item, index) in oneList" :key="index">
                  <span :class="{'text-show': item.show}" class="text">{{item.text}}</span>
                </li>
              </ul>
            </div>
            <div class="footer">
              <img src="./image/page-footer.png" alt="">
            </div>
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="two page">
          <div class="icon">
            <img src="./image/next-icon.png" alt="">
          </div>
          <div class="page-show">
            <div class="top">
              <img src="./image/top-2.png" alt="">
            </div>
            <div class="center">
              <ul class="text-list">
                <li class="text-item" :class="{'special': index == 6}" v-for="(item, index) in twoList" :key="index">
                  <span class="text" :class="{'text-show': item.show}" v-if="index < 6">{{item.text}}</span>
                  <span class="text" :class="{'text-show': item.show}" v-else-if="index == 6">
                    <img :src="item.url" alt="">
                  </span>
                </li>
              </ul>
            </div>
            <div class="footer">
              <img src="./image/page-footer.png" alt="">
            </div>
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="three page">
          <div class="icon">
            <img src="./image/next-icon.png" alt="">
          </div>
          <div class="page-show">
            <div class="top">
              <img src="./image/top-4.png" alt="">
            </div>
            <div class="center">
              <ul class="text-list">
                <li class="text-item" v-if="index !=2 || (index == 2 && userAnnualBill.stationNameFirst != '')"
                    :class="{'special': index == 5}" v-for="(item, index) in threeList" :key="index">
                  <span class="text" :class="{'text-show': item.show}" v-if="index < 5">{{item.text}}</span>
                  <span class="text" :class="{'text-show': item.show}" v-else-if="index == 5">
                    <img :src="item.url" alt="">
                  </span>
                </li>
              </ul>
            </div>
            <div class="footer">
              <img src="./image/page-footer.png" alt="">
            </div>
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="four page">
          <div class="icon">
            <img src="./image/next-icon.png" alt="">
          </div>
          <div class="page-show">
            <div class="top">
              <img src="./image/top-3.png" alt="">
            </div>
            <div class="center">
              <ul class="text-list">
                <li class="text-item" v-show="index != 3 || (index == 3 && userAnnualBill.storeNameFirst != '')"
                    :class="{'last': index == 6}" v-for="(item, index) in fourList" :key="index">
                  <span class="text" :class="{'text-show': item.show}"
                        v-if="index < 6 && index != 3">{{item.text}}</span>
                  <span class="text" :class="{'text-show': item.show}" v-else-if="index == 6">
                    <img :src="item.url" alt="">
                  </span>
                </li>
              </ul>
            </div>
            <div class="footer">
              <img src="./image/page-footer.png" alt="">
            </div>
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="five page">
          <div class="title">
            <p>分享到朋友圈</p>
            <p v-if="awardDetail.couCategory == 20">领满<span
              class="num">{{awardDetail.couThresholdAmount || 0}}</span>减<span class="num">{{awardDetail.couFaceValue || 0}}</span>元专属优惠券
            </p>
          </div>
          <div class="lb">
            <div class="top">
              <p class="num">￥<span class="money">{{awardDetail.couFaceValue || 0}}</span></p>
              <p class="tips">便利店消费满{{awardDetail.couThresholdAmount || 0}}元可用</p>
            </div>
          </div>
          <div class="people">已有{{userAnnualBill.receiveSuccessNum}}人成功领取</div>
          <div class="btn" @click="share"></div>
        </div>
      </van-swipe-item>
    </van-swipe>
    <!--    领取优惠券弹框-->
    <van-popup v-model="showReceiveCoupon">
      <div class="popup-content">
        <div class="top">
          <p class="num">￥<span class="money">{{awardDetail.couFaceValue || 0}}</span></p>
          <p class="tips">便利店消费满{{awardDetail.couThresholdAmount || 0}}元可用</p>
        </div>
        <div class="bottom" v-if="awardDetail.validEndDate">{{awardDetail.validEndDate}}前有效</div>
      </div>
      <div class="popup-btn" @click="receiveHandle">
        <img class="bgimg" src="./image/now_get.png" alt="">
      </div>
    </van-popup>
    <!--    领取成功弹框-->
    <van-popup v-model="showSeeCoupon">
      <div class="popup-content see-coupon">
        <div class="top">
          <p class="num">￥<span class="money">{{awardDetail.couFaceValue || 0}}</span></p>
          <p class="tips">便利店消费满{{awardDetail.couThresholdAmount || 0}}元可用</p>
        </div>
        <div class="bottom" v-if="awardDetail.validEndDate">{{awardDetail.validEndDate}}前有效</div>
      </div>
      <div class="popup-btn" @click="seeCoupon">
        <img class="bgimg" src="./image/see.png" alt="">
      </div>
    </van-popup>
    <!--    活动已结束弹框-->
    <van-popup v-model="activityIsLatePop">
      <div @click="goAtherActivity" class="popup-content activity-islate"></div>
    </van-popup>
    <!--    没有记录弹框-->
    <van-popup v-model="noRecordPop">
      <div @click="goAtherActivity" class="popup-content no-record"></div>
    </van-popup>
<!--    微信分享弹框-->
    <van-popup class="tips-show" v-model="showTips" :style="{ height: '20%' }">
      <div class="close-icon tips-icon">
        <img src="./image/jt.png" alt="">
      </div>
      <div class="popup-main">
        <div class="tips-title">提示</div>
        <div class="tips-content">点击右上角进行fen享</div>
        <div class="tips-btn" @click="showTips = false">取消</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import Config from '@/api/config'
  import eruda from 'eruda'
  import wxfunc from '@/utils/wxfunc'
  import utils from "@/utils/util"
  import Login from '@/components/commonui/login/index'

  export default {
    data() {
      return {
        showReceiveCoupon: false, // 立即领取优惠券弹框
        showSeeCoupon: false, // 查看优惠券弹框
        touchable: false,
        music: true,
        showTips: false, // 分享提示
        oneList: [
          {text: ''},
          {text: '那是一个美丽的日子'},
          {text: '那天，我们相遇了...'},
          {text: '一眨眼，2020年已经过去了'},
          {text: '而...我们'},
          {text: ''}
        ],
        twoList: [
          {text: '2020年'},
          {text: '我们一起陪伴的日子里'},
          {text: ''},
          {text: '无关金钱'},
          {text: '是陪伴'},
          {text: '让你我携手更远'},
          {url: require('./image/t1.png')}
        ],
        threeList: [
          {text: '这一年'},
          {text: ''},
          {text: ''},
          {text: '你也许忘了'},
          {text: '但我们依然记得'},
          {url: require('./image/t2.png')}
        ],
        fourList: [
          {text: '2020年'},
          {text: ''},
          {text: ''},
          {text: ''},
          {text: '懂得爱自己'},
          {text: '才懂得享受生活'},
          {url: require('./image/t3.png')}
        ],
        showIndex: true, // 首页
        userAnnualBill: {}, // 年度账单
        awardDetail: {}, // 活动详情
        animatedList: [],
        activityIsLate: '',
        activityIsLatePop: false, // 活动过期弹框
        noRecordPop: false, // 没有记录弹框
      }
    },

    mounted() {
      // Login.open({
      //   formData: {
      //     regChannel: 29
      //   },
      //   source: 'year_bill',
      //   loginFinishEvent: (res) => {
      //     console.log(res)
      //     this.getUserAnnualBill()
      //   }
      // })
      this.count = 0
      this.$refs.music.play()
    },

    methods: {
      showEruda() {
        //连续点5次第一个item  显示vconsole
        let time = (new Date()).getTime();
        if (time - this.clickTime < 1000 || this.clickTime == -1) {
          this.vConsoleTimes += 1;
          this.clickTime = time;
          if (this.vConsoleTimes == 5) {
            eruda.init()
            this.vConsoleTimes = 0;
            this.clickTime = -1;
          }
        } else {
          this.vConsoleTimes = 0;
          this.clickTime = -1;
        }
      },
      nowOpen() {
        /**
         *  活动已结束 到2020-1-31
         */
        this.activityIsLate = this.isLate()
        if (this.activityIsLate && this.activityIsLate == 0) {
          this.activityIsLatePop = true
          console.log(this.activityIsLate)
        } else {
          console.log(this.$store.state.login.token)
          if (!this.$store.state.login.token) {
            // 未登录
            Login.open({
              formData: {
                regChannel: 29
              },
              loginFinishEvent: (res) => {
                console.log(res)
                this.getUserAnnualBill()
              }
            })
            // this.$router.push({
            //   path: '/usercenter/loginbinding',
            //   query: {
            //     thirdUserId: this.$store.state.login.thirdUserId,
            //     code: this.$store.state.login.code,
            //     regChannel: 29,
            //     firstLevel: true,
            //     bindType: 4
            //   }
            // })
          } else {
            // 登录
            this.getUserAnnualBill() // 年度账单
          }

        }
      },
      goAtherActivity() {
        // 跳转加油山西小程序首页
        this.$bridgefunc.navigateToMiniProgram('gh_9e5193d54d93', 'pages/index/main.html')
      },
      isLate() {
        var oDate1 = new Date();
        var oDate2 = new Date('2021-01-31');
        if (oDate1.getTime() > oDate2.getTime()) {
          return 0; // 第一个大
        } else if (oDate1.getTime() == oDate2.getTime()) {
          return 1; //一样大
        } else {
          return 2; //第二个大
        }
      },
      getUserAnnualBill() {
        // 获取年度账单
        this.$request.post('/app/json/app_annual_bill/getUserAnnualBill', {}).then(res => {
          if (res.status === 0) {
            this.userAnnualBill = res.data
            // 没有记录 进行弹框提示
            if (this.userAnnualBill.stationCnt == 0) {
              this.noRecordPop = true
            } else {
              this.$refs.swipe.next()
              this.touchable = true
              this.pvUvHandle() // pv、uv统计
              this.getAwardDetail() // 获取活动奖品详情
              this.dealDate(this.userAnnualBill)
            }
          } else {
            this.$Toast(res.info)
          }
        })
      },
      pvUvHandle() {
        // pv、uv统计
        this.$request.post('/app/json/app_annual_bill/pvUvHandle', {}).then(res => {
          if (res.status === 0) {
          } else {
            this.$Toast(res.info)
          }
        })
      },
      share() {
        // 立即分享：
        if (this.$util.isWeiXin()) {
          this.showTips = true
          let shareData = {
            title: '您的好友邀您查看2020年账单，有惊喜哦！',
            desc: '点开即可查看',
            imgUrl: this.$store.state.globalConfig.yearBillShareIcon,
            link: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/year-bill`
          };
          wxfunc.getWechatSignature((isSignature) => {
            //签名成功
            if (isSignature) {
              wxfunc.wxSetShareData(shareData, (res)=> {
                if (res == 1) {
                  this.$toast('分享成功')
                  this.shareHandle()
                }
              });

            } else {
              console.log('签名失败');
            }
          })
          console.log('走了wxSetShareData方法')
          console.log(shareData)
        } else {
          // title标题 sharetext副标题 imageurl图标url   detailurl链接url shareplatform 0 微信 1 朋友圈 2 QQ好友 3QQ空间
          let shareData = {
            shareplatform: [0, 1],
            title: '您的好友邀您查看2020年账单，有惊喜哦！',
            sharetext: '点开即可查看',
            imageurl: this.$store.state.globalConfig.yearBillShareIcon,
            detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/year-bill`
          };
          console.log(shareData)
          this.$bridgefunc.share(shareData, (res) => {
            console.log('分享', res);
            if (res == '1') { // 分享成功
              this.$toast('分享成功')
              this.shareHandle()
            } else {
              this.$toast('分享失败')
            }
          })
        }
      },
      shareHandle() {
        this.$request.post('/app/json/app_annual_bill/shareHandle', {}).then(res => {
          if (res.status === 0) {
            // isReceive  是否领取（0：否，1：是）
            let shareInfo = res.data
            if (shareInfo.isReceive == 0) {
              this.showReceiveCoupon = true // 立即领取弹框 弹出
            } else {
              this.$Toast('已经领取了哦~')
            }
          } else {
            this.$Toast(res.info)
          }
        })
      },
      receiveHandle() {
        // 立即领取：
        this.$request.post('/app/json/app_annual_bill/receiveHandle', {}).then(res => {
          if (res.status === 0) {
            this.showReceiveCoupon = false // 立即领取弹框 关闭
            this.showSeeCoupon = true // 领取成功弹框 弹出
          } else {
            this.$Toast(res.info)
          }
        })
      },
      seeCoupon() {
        // 查看
        this.$router.push({path: '/coupon_list'})
      },
      setMusic() {
        console.log('music', this.music)
        this.music = !this.music
        if (this.music) {
          this.$refs.music.play()
        } else {
          this.$refs.music.pause()
        }
      },
      getAwardDetail() {
        // 获取活动奖品详情：
        this.$request.post('/app/json/app_annual_bill/getAwardDetail', {}).then(res => {
          if (res.status === 0) {
            this.awardDetail = res.data
          } else {
            this.$Toast(res.info)
          }
        })
      },
      dealDate(data) {
        // 数据处理
        /**
         * oneList
         * 注册时间 createTime
         */
        let createTime = data.createTime
        let time = createTime.split(' ')
        let _time = time[0].split('-')
        let nowTime = utils.getMyDate(new Date())
        console.log(time[0])
        console.log(nowTime)
        let distance = utils.daysDistance(time[0], nowTime)
        console.log(distance)
        this.oneList[0].text = `${_time[0]}年${_time[1]}月${_time[2]}日`
        this.oneList[5].text = `也相识了${distance}天`
        /**
         * twoList
         * 已经为您节省了XXXX元
         */
        this.twoList[2].text = `已经为您节省了${data.couAmount}元`
        /**
         * threeList
         * 您去了..次加油站
         *
         */
        this.threeList[1].text = `您去了${data.stationCnt}次加油站`
        this.threeList[2].text = `最喜欢去${data.stationNameFirst}` + `${data.stationNameSecond ? '和' + data.stationNameSecond : ''}`
        /**
         * fourList
         * 您在油站便利店消费了....次
         * 优惠了....元
         * 最喜欢去 .....站和.....站的易捷便利店
         */
        this.fourList[1].text = `您在油站便利店消费了${data.storeCnt}次`
        this.fourList[2].text = `优惠了${data.storeCouAmount}元`
        this.fourList[3].text = `最喜欢去${data.storeNameFirst}站` + `${data.storeNameSecond ? '和' + data.storeNameSecond + '站的易捷便利店' : ''}`
      },
      change(index) {
        // 当滑到滚动页时 index页就不展示了
        console.log(index)
        //
        let list = ['oneList', 'twoList', 'threeList', 'fourList']
        const curList = list[this.showIndex ? index - 1 : index]
        if (!this.animatedList.includes(curList)) {
          this[curList] && this.startTransition(this[curList])
          this.animatedList.push(curList)
          console.log(curList)
        }
        if (index == 1) {
          this.showIndex = false
        }
      },
      startTransition(list) {
        console.log(list)
        if (!list || !list.length) return
        let len = list.length
        let count = 0
        let timer = setInterval(() => {
          if (count >= len) {
            console.log('Transition_Done')
            clearInterval(timer)
          } else {
            const item = list[count]
            if (item) {
              item.show = true
              this.$set(list, count, item)
            }
            count++
          }
        }, 1000)
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .year-bill {
    .music {
      text-align right
      position: absolute;
      right: 20px;
      top: 20px;
      z-index: 999

      img {
        width 35px
        opacity 0.6

        &.anim-music {
          animation music-ani 5s linear infinite
        }
      }

    }

    @keyframes music-ani {
      form {
        transform rotate(0)
      }
      to {
        transform rotate(360deg)
      }
    }

    .year-bill-index {
      position absolute
      left 0
      right 0
      bottom 0
      top 0
      background: url('./image/index_bg.png') no-repeat center center / 100% 100%;
      padding: 11px 15px


      .btn {
        position absolute
        left 20px
        right 20px
        bottom 40px
        width 70%
        height 50px
        margin 0 auto
        background: url('./image/open.png') no-repeat center center / 100% 100%;
      }
    }

    .one, .two, .three, .four {
      background: url('./image/bg.png') no-repeat center center / 100% 100%;
    }

    .five {
      background: url('./image/five_bg.png') no-repeat center center / 100% 100%;
    }

    .page {
      position absolute
      left 0
      right 0
      bottom 0
      top 0
      text-align center

      .icon {
        position absolute
        bottom 20px
        left 0
        right 0

        img {
          width 20px
        }
      }

      .btn {
        position absolute
        left 20px
        right 20px
        bottom 60px
        width 70%
        height 50px
        margin 0 auto
        background: url('./image/now-share.png') no-repeat center center / 100% 100%;
      }

      .title {
        color: #ffffff
        font-size 26px
        padding-top: 80px
        line-height 38px

        .num {
          font-size 34px
        }
      }

      .lb {
        background url('./image/gift.png') no-repeat
        background-size 100% 100%
        height 300px

        .top {
          padding-top: 100px
          line-height 28px
          font-size 16px
          color: #EC3530

          .num {

            .money {
              font-size 28px
            }
          }
        }
      }

      .people {
        color: #ffffff
        font-size 16px
      }

      .page-show {

        .top, .footer {
          img {
            width 100%
            vertical-align top
          }

        }

        .center {
          background url("./image/page-center.png") no-repeat
          background-size 100% 100%
          height 300px

          .text-list {
            text-align left
            width: 70%
            margin: 0 auto

            .text-item {
              border-bottom: 1px solid #f9d6b4
              line-height 40px

              .text {
                transition: all 1s
                transform: translateY(40px);
                opacity: 0;
                color $color-text
                display: inline-block;

                &.text-show {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
            }

            .special {
              text-align right
              line-height 37px
              padding-top: 3px

              img {
                width 60%
              }
            }

            .last {
              text-align right
              line-height 37px
              padding-top: 3px

              img {
                width 30%
              }
            }
          }
        }
      }
    }
  }


  .popup-content {
    background #fff
    width 100%
    height 250px
    border-radius 4px
    background url("./image/pop_share.png") no-repeat
    background-size 100% 100%
    text-align center
    color: #EC3530
    position relative

    .top {
      padding-top: 90px
      line-height 28px
      font-size 16px

      .num {

        .money {
          font-size 28px
        }
      }
    }

    .bottom {
      position absolute
      bottom: 30px
      left: 0
      right: 0
      color: #fff
    }
  }

  .activity-islate {
    background url("./image/end.png") no-repeat
    background-size 100% 100%
    height 300px
  }

  .see-coupon {
    background url("./image/pop_success.png") no-repeat
    background-size 100% 100%
  }

  .no-record {
    background url("./image/no-jl.png") no-repeat
    background-size 100% 100%
    height 300px
  }

  .popup-btn {
    position: relative;
    top 5px
    width 85%
    margin: 0 auto

    img {
      width 100%
    }
  }

  /deep/ .van-popup {
    border-radius 4px
    width 80%
    background: none;
    height 400px
  }
  /deep/ .van-popup--center {
    width 80%
    overflow-y: visible

    .content {

    }

    .close-icon {
      text-align right
      margin-top: -20%

      img {
        width 40px

      }
    }

    .popup-main {
      width 100%
      margin-top: 15%
      text-align center

      .title {
        font-size 28px
        font-weight bold
        padding-bottom: 30px
      }

      .inp {
        width 90%
        margin: 0 auto
        padding-bottom: 15px
        color: $color-text

        input {
          width 100%
          padding: 10px 15px
          line-height 34px
          border-radius 4px
        }
      }

      .message {
        .show-message {
          border-radius 4px
          display flex
          justify-content space-between
          align-items center
          background #fff

          input {
            flex: 1
          }

          .messgae-inp {
            width 40%
          }

          .blue {
            color: #2266c0
          }
        }
      }
    }
  }
  .tips-show {
    background none !important
    background #fff !important
    border-radius 6px
    color: $color-text

    .tips-icon {
      margin-top: -50% !important

      img {
        width 120px !important
      }
    }
    .tips-title {
      font-size 16px !important
      font-weight bold
      padding-bottom: 25px
    }
    .tips-content {
      font-size 12px
      padding-bottom: 20px
    }
    .tips-btn {
      color: #2266c0
      position: absolute;
      bottom: 15px;
      left: 0;
      right: 0
    }
  }
</style>

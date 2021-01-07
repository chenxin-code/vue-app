<template>
  <div class="rights-and-interests">
    <nav-top title="权益" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="rights-and-interests-container">
      <div v-for="(item, index) in interestslist" :key="index" class="interests">
        <div class="time">2019年8月9日&nbsp;&nbsp;晚上19:21:12</div>
        <div class="content">
          <div class="bind-oil-card-content">
            <div class="text">恭喜您于{{item.tradeTime}}参加了{{item.activityTitle}}，赢得了下列奖励，请您领取：</div>
            <div class="interests-tips"><span class="icon">*</span>您最多可以选择两个超值权益</div>
          </div>
          <ul class="gift-list">
            <li class="gift-item" v-for="(item2, index2) in item.awardList" :key="index2">
              <div class="content">
                <div class="left" v-if="item2.awardType == 10">
                  <img src="./image/qpl.png" alt="">
                  <div class="text">全品类</div>
                </div>
                <div class="left" v-else-if="item2.awardType == 20">
                  <img src="./image/jf.png" alt="">
                  <div class="text">积分</div>
                </div>
                <div class="left" v-else-if="item2.awardType == 80">
                  <img src="./image/hy.png" alt="">
                  <div class="text">会员成长值</div>
                </div>
                <div class="left" v-else-if="item2.awardType == 40">
                  <img src="./image/hy.png" alt="">
                  <div class="text">游戏</div>
                </div>
                <div class="left" v-else-if="item2.awardType == 30 && item2.groupValue == 2 && item2.groupValue != ''">
                  <img src="./image/oil-card.png" alt="">
                  <div class="text">加油卡充值</div>
                </div>
                <div class="left" v-else-if="item2.awardType == 30 && item2.groupValue == 1 && item2.groupValue != ''">
                  <img src="./image/oil.png" alt="">
                  <div class="text">加油红包</div>
                </div>
                <div class="left" v-else-if="item2.awardType == 30 && item2.groupValue == 3 && item2.groupValue != ''">
                  <img src="./image/shop.png" alt="">
                  <div class="text">商城消费红包</div>
                </div>
                <div class="left" v-else-if="item2.awardType == 30 && item2.groupValue == ''">
                  <img src="./image/hb.png" alt="">
                  <div class="text">奖励金</div>
                </div>
                <div class="right" v-if="item2.awardType == 10 || item2.awardType == 30">
                  <div class="top">
                    <span class="top-tips" v-if="item2.awardType == 10">满减券</span>
                    {{item2.awardName}}
                  </div>
                  <div class="bottom">
                    <div class="money">
                      <div class="num-info" v-if="item2.awardType == 10 || (item2.awardType == 30 && item2.groupValue != '')">￥<span class="info">{{item2.couTypeModel.couFaceValue}}</span></div>
                      <div class="num-info" v-else-if="item2.awardType == 30 && item2.groupValue == ''"><span class="info">{{item2.awardNum}}</span></div>&nbsp;
                      <div class="text" v-if="item2.awardType == 10 || (item2.awardType == 30 && item2.groupValue != '')">{{item2.awardType == 10 ? '无门槛' : '元'}}</div>
                      <div class="text" v-else-if="item2.awardType == 30 && item2.groupValue == ''">个</div>
                    </div>
                    <div class="num" v-if="item2.awardType == 10">x{{item2.awardNum}}</div>
                  </div>
                </div>
                <div class="right" v-else>
                  <div class="jf" v-if="item2.awardType == 20 ">
                    <div>
                      <span class="info"><span class="num">{{item2.awardNum}}</span></span>&nbsp;{{item2.awardName}}
                    </div>
                  </div>
                  <div class="jf" v-if="item2.awardType == 80">
                    <div>
                            <span class="info"><span>￥</span><span
                              class="num">{{item2.couTypeModel.couFaceValue}}</span></span>&nbsp;{{item2.awardName}}
                    </div>
                  </div>
                  <div class="jf play" v-else-if="item2.awardType == 40">
                    <div class="play-left">
                      <p>免费参与游戏:{{item2.awardName}}</p>
                    </div>
                    <div class="play-right">x{{item2.awardNum}}</div>
                  </div>
                </div>
                <div class="show-btn" @click="nowGet(item2)">
                  <div class="btn" v-if="item2.state == 20 || item2.state == 30">已领取</div>
                  <div class="btn" v-else-if="item2.state == 10">立即领取</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        interestslist: [],
      }
    },
    mounted() {
      this.getCanReceiveAwardListGroupByActivity()
    },
    methods: {
      getCanReceiveAwardListGroupByActivity() {
        // 获取待领取的奖品按活动分组
        this.$request.post('/app/json/app_market/getCanReceiveAwardListGroupByActivity').then(res => {
          if (res.status === 0) {
            this.interestslist = res.data
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      nowGet(item2) {
        // 立即领取
        this.$request.post('/app/json/app_market/receiveAward', {
          awardRecId: item2.awardRecId
        }).then(res => {
          if (res.status === 0) {
            this.$Toast('领取成功')
            item2.state = 20
          } else {
            this.$Toast(res.info ? res.info : '领取失败')
          }
        }).catch(err => {
          this.$Toast(res.info ? res.info : '领取失败')
        })
      },
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .rights-and-interests {

    .rights-and-interests-container {
      overflow-y auto
      -webkit-overflow-scrolling touch
      padding: 11px 15px
      background-color #f6f6f6
      .interests {
        margin-bottom: 10px
        .time {
          padding: 10px 0
          text-align center
          color: $color-text-d
        }
        .content {
          box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
          background: #fff
          border-radius 6px
          padding: 11px 0
          .bind-oil-card-content {
            font-size: 14px
            line-height 20px
            color: $color-text
            padding: 0 15px

            .text {
              & + .text {
                padding: 10px 0
              }
            }
            .interests-tips {
              text-align right
              color: $color-text-d

              .icon {
                color: $color-theme-r
              }
            }
          }
          .gift-list {
            overflow hidden

            .gift-item {
              font-size: 10px
              width: 100%
              flex: none
              padding: 10px 15px

              .content {
                box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
                border-radius 4px
                display flex
                justify-content left
                padding: 10px
                align-items: center
              }

              .left {
                background #fde9ea
                border-radius 4px
                display flex
                justify-content center
                align-items center
                flex-direction column
                padding: 5px 3px
                color: #f02c2d
                width: 65px
                margin-right: 6px


                img {
                  width: 25px
                  height: 25px
                }

                .text {
                  transform: scale(0.7)
                  padding-top: 3px
                }
              }

              .right {
                display flex
                justify-content: space-between
                align-items left
                flex-direction column
                flex: 1

                .top {
                  white-space: normal
                }

                .bottom {
                  display flex
                  justify-content: space-between
                  align-items left

                  .money {
                    display flex
                    justify-content: space-between
                    align-items left

                    .num-info {
                      color: $color-theme-r

                      .info {
                        font-size: 20px
                      }
                    }

                    .text {
                      color: $color-text-d
                      line-height: 20px
                    }
                  }

                  .num {
                    color: $color-text-d
                    line-height: 20px
                  }
                }

                .jf {
                  line-height 50px

                  .info {
                    color: $color-theme-r

                    .num {
                      font-size: 24px
                    }
                  }
                }

                .play {
                  display flex
                  justify-content space-between
                  align-items left align-items
                  line-height 20px

                  .play-right {
                    color: $color-text-d
                  }
                }
              }
              .show-btn {
                margin-left: 6px
                width: 70px
                display flex
                justify-content center
                align-items center

                .btn {
                  font-size: 10px
                  width: 100%
                  padding: 6px 0
                  border: 1px solid $color-theme-r
                  color: $color-theme-r
                  border-radius 20px
                  text-align center
                }
              }
            }
          }
        }
      }
    }
  }
</style>

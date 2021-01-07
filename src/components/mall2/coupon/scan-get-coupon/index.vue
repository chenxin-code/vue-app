<template>
  <div class="scan-get-conpon">
    <nav-top title="扫码领券" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="scan-get-conpon-container" v-if="complete">
      <div class="top">
        <div class="oil-station-show">
          <div class="left">
            <img src="./image/logo.png" alt="">
          </div>
          <div class="right">
            <div class="name">{{myStation.stationName}}</div>
            <div class="distance" v-if="myStation.distance > couponRange">
              <img class="icon-img" src="./image/icon.png" alt="">您当前位置距离油站超过200米，无法获取油站扫码领券活动
            </div>
            <div class="distance" v-else>
              <img class="icon-img" src="./image/icon.png" alt="">您当前距离油站{{myStation.distance}}米，可正常获取油站扫码领券活动
            </div>
          </div>
        </div>
        <div class="table-view" @click="openHistory">
          <div class="table-view-cell">
            <div class="table-view-cell-text">领券活动</div>
            <div class="table-view-cell-arrow">历史记录</div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <ul class="list" v-if="list.length && myStation.distance < couponRange">
          <li class="item" v-for="(item, index) in list" :key="index">
            <div class="left" @click="showQRCodeBtn(item)">
              <canvas class="qrcode" :id="`id_${index}`"></canvas>
              <div class="text">点击扫码</div>
            </div>
            <div class="center">
              <div class="title">{{item.activityTitle}}</div>
              <div class="time">{{`${dealTime(item.startDate)}-${dealTime(item.endDate)}`}}</div>
              <div class="coupon-name">
                <span v-for="(item2, index2) in item.couStockDetailModelList">{{item2.couTypeTitle}}</span>
              </div>
              <van-progress color="#F80F16" :percentage="dealPercentage(item.limitCnt, item.distCnt)"
                            :show-pivot="showPivot"/>
              <div class="tips">已领{{dealPercentage(item.limitCnt, item.distCnt)}}%</div>
            </div>
            <div class="btn">
              <div class="btn-show" @click="openDetails(item)">活动详情</div>
            </div>
          </li>
          <li class="no-data-tips">没有更多了哦~</li>
        </ul>
        <div class="no-data" v-else-if="!list.length && myStation.distance < couponRange">
          <div class="img">
            <img src="./image/p1.png" alt="">
          </div>
          <div class="text">暂无最新活动，敬请期待~</div>
        </div>
        <div class="no-data" v-if="myStation.distance > couponRange">
          <div class="img">
            <img src="./image/p2.png" alt="">
          </div>
          <div class="text">您已离开油站，无法获取扫码领券活动~{{couponRange}}</div>
        </div>
      </div>
      <van-popup v-model="showQRCode">
        <div class="title-show">
          <div class="text">扫描二维码领券</div>
          <div class="close-icon" @click="closeQrcodeShowBtn">
            <van-icon size="20" color="#898989" name="cross"/>
          </div>
        </div>
        <div class="show-qrcode">
          <canvas class="qrcode" id="qrcode"></canvas>
          <div class="refresh" @click="refreshGetCouDynamicCode">
            <img src="./image/icon2.png" alt="">
          </div>
          <div class="text">3分钟后二维码自动刷新</div>
        </div>
      </van-popup>
    </nav-content>
  </div>
</template>

<script>
  import utils from "@/utils/util"
  import { mapState } from 'vuex'
  import QRCode from 'qrcode'

  export default {
    computed:{
      ...mapState(['globalConfig']),
      couponRange(){
        return Number(this.globalConfig.ahCouponRange || 200);
      }
    },
    data() {
      return {
        list: [],
        complete: false,
        showPivot: false, // 进度条文字
        percentage: 50,
        queryPayStateTimer: null, // 定时器
        showQRCode: false, // 二维码弹框
        myStation: '', // 油站信息
        mktActivityId: '', // 刷新二维码所用的id
        bd09: [] // 百度坐标
      }
    },
    mounted() {
      /**
       * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
       * @type {*|*[]}
       */
      // this.bd09 = utils.gcj02tobd09(this.$store.state.currentLocation.posx, this.$store.state.currentLocation.posy)
      this.bd09 = [this.$store.state.currentLocation.posx, this.$store.state.currentLocation.posy]
      this.queryMyStation()
    },
    methods: {
      queryMyStation() {
        // 获取油站信息
        this.$request.post('/app/json/app_market/queryMyStation', {
          token: this.$store.state.login.token,
          posx: this.bd09[0],
          posy: this.bd09[1],
          // posy: '40.087943',
          // posx: '116.350847',
          getType: '1' // 1百度 2腾讯
        }).then(res => {
          if (res.status == 0) {
            this.myStation = res.data
            this.queryGetCouQrcodeActivityByGsOuCode()
          } else {
            this.$Toast(res.info ? res.info : '获取油站信息失败')
          }
        })
      },
      queryGetCouQrcodeActivityByGsOuCode() {
        // 列表
        this.$request.post('/app/json/app_market/queryGetCouQrcodeActivityByGsOuCode', {
          token: this.$store.state.login.token,
          posx: this.bd09[0],
          posy: this.bd09[1],
          // posy: '40.087943',
          // posx: '116.350847',
          getType: '1' // 1百度 2腾讯
        }).then(res => {
          if (res.status == 0) {
            this.list = res.data || []
            this.complete = true
            this.list.forEach((item, index) => {
              this.$nextTick(() => {
                document.getElementById(`id_${index}`).innerHTML = ""; // 清空二维码
                QRCode.toCanvas(document.getElementById(`id_${index}`), item.dynamicCode, {
                  width: 80,
                  height: 80,
                  margin: -10
                })
              });
            })
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      showQRCodeBtn(item) {
        // 弹框展示二维码
        this.showQRCode = true
        this.mktActivityId = item.id
        this.$nextTick(() => {
          document.getElementById('qrcode').innerHTML = ""; // 清空二维码
          QRCode.toCanvas(document.getElementById('qrcode'), item.dynamicCode, {width: 160, height: 160, margin: -10})
        });
        clearInterval(this.queryPayStateTimer)
        this.queryPayStateTimer = setInterval(() => {
          this.refreshGetCouDynamicCode()
        }, 180000) // 三分钟一刷新
      },
      closeQrcodeShowBtn() {
        // 关闭二维码展示
        this.showQRCode = false
        clearInterval(this.queryPayStateTimer) // 清除定时器
      },
      refreshGetCouDynamicCode() {
        // 刷新二维码
        this.$request.post('/app/json/app_market/refreshGetCouDynamicCode', {
          token: this.$store.state.login.token,
          mktActivityId: this.mktActivityId,
          posx: this.bd09[0],
          posy: this.bd09[1],
          // posy: '39.911576',
          // posx: '116.344172',
          getType: '1', // 1百度 2腾讯
        }).then(res => {
          if (res.status == 0) {
            this.$nextTick(() => {
              document.getElementById('qrcode').innerHTML = ""; // 清空二维码
              QRCode.toCanvas(document.getElementById('qrcode'), res.data, {width: 160, height: 160, margin: -10})
            });
          } else {
            this.$Toast(res.info ? res.info : '获取油站信息失败')
          }
        })
      },
      openHistory() {
        // 打开历史活动
        this.$router.push('/mall2/scan-get-coupon-history')
      },
      openDetails(item) {
        // 打开活动详情
        this.$router.push({path: '/mall2/scan-get-coupon-details', query: {details: JSON.stringify(item)}})
      },
      dealTime(time) {
        // 处理时间
        let timeNow = time.split(' ')[0]
        return timeNow.replace(/-/g, '.')
      },
      dealPercentage(limitCnt, distCnt) {
        // 处理百分比
        let num = (distCnt / limitCnt) * 100
        return Number(num.toFixed(0))
      }
    },
    destroyed() {
      clearInterval(this.queryPayStateTimer)
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "~@/common/stylus/mixin.styl"
  .scan-get-conpon {
    color: $color-text

    .scan-get-conpon-container {
      display flex
      flex-direction column

      .top {
        padding: 11px 15px 0 15px
        flex-shrink 0

        .oil-station-show {
          box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
          background: #fff
          border-radius 6px
          display flex
          justify-content left
          padding: 11px 15px
          margin-bottom: 10px

          .left {
            img {
              width: 60px
            }
          }

          .right {
            flex: 1
            padding: 5px 0 5px 5px

            .name {
              font-size 16px
              padding-bottom: 5px
            }

            .distance {
              display flex
              justify-content left
              align-items center
              line-height 18px
              font-size 12px
              color: $color-text-d

              .icon-img {
                padding-right: 5px
                width: 20px
              }
            }
          }
        }

        .table-view-cell {
          padding: 0 5px

          .table-view-cell-text {
            font-size: 14px
          }

          .table-view-cell-arrow {
            color: $color-text-d
          }
        }
      }

      .bottom {
        flex: 1
        overflow-y auto
        -webkit-overflow-scrolling touch
        padding: 11px 15px

        .list {
          .item {
            box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
            background: #fff
            border-radius 6px
            display flex
            justify-content space-between
            padding: 3px 10px
            margin-bottom: 10px
            line-height 22px

            .left {
              display flex
              justify-content center
              align-items center
              flex-direction column
              width: 80px

              .text {
                text-align center
                color: $color-text-d
                font-size 10px
              }

              .qrcode {
                width 80%
              }
            }

            .center {
              padding: 11px 5px 11px 11px
              flex: 1
              line-height 24px
              display flex
              flex-direction column

              .title {
                font-size 16px

              }

              .coupon-name, .time {
                color: $color-text-d
              }

              .coupon-name {
                width: 150px
                ellipse()
              }

              .tips {
                color: $color-theme-r
              }
            }

            .btn {
              width: 70px
              display flex
              justify-content center
              align-items center

              .btn-show {
                width 100%
                text-align center
                background $color-theme-r
                color: #fff
                border-radius 20px
                padding: 3px 0
              }
            }
          }
          .no-data-tips {
            text-align center
            padding: 10px 0
            color: $color-text-d
          }
        }

        .no-data {
          padding: 70px 0
          display flex
          justify-content center
          align-items center
          flex-direction column
          font-size 14px
          color: $color-text

          .img {
            padding-bottom: 20px

            img {
              width: 150px
            }
          }
        }
      }
    }
  }

  .van-popup--center {
    padding: 20px
    border-radius 4px
    width 80%

    .title-show {
      .text {
        text-align center
        font-size 16px
        font-weight bold
      }

      .close-icon {
        position absolute
        right 15px
        top: 10px
      }
    }

    .show-qrcode {
      text-align center

      .refresh {
        padding-bottom: 10px

        img {
          width 20px
        }
      }

      .qrcode {
        width 100%
      }
    }
  }
  .van-progress {
    width 60%
  }
</style>

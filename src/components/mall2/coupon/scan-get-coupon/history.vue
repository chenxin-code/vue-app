<template>
  <div class="history">
    <nav-top title="历史活动" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="history-container">
      <ul class="list" v-if="list.length">
        <li class="item" v-for="(item, index) in list" :key="index">
          <div class="show-time">{{item.endDate}}</div>
          <div class="container">
            <div class="left">
              <canvas class="qrcode" id="qrcode"></canvas>
              <div class="text">二维码已过期</div>
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
            <div class="tips-show">
              <img src="./image/tips2.png" alt="">
            </div>
          </div>
        </li>
      </ul>
      <div class="no-data">没有更多了哦~</div>
    </nav-content>
  </div>
</template>

<script>
  import QRCode from 'qrcode'
  import utils from "@/utils/util"


  export default {
    data() {
      return {
        showPivot: false, // 进度条文字
        percentage: 50,
        list: [],
        queryPayStateTimer: null, // 定时器
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
      this.queryGetCouQrcodeHistoryByGsOuCode()
    },
    methods: {
      queryGetCouQrcodeHistoryByGsOuCode() {
        // 列表
        this.$request.post('/app/json/app_market/queryGetCouQrcodeHistoryByGsOuCode', {
          token: this.$store.state.login.token,
          posx: this.bd09[0],
          posy: this.bd09[1],
          // posy: '40.0839',
          // posx: '116.343427',
          getType: '1', // 1百度 2腾讯
          page: {
            index: this.page,
            pageSize: 20
          }
        }).then(res => {
          if (res.status == 0) {
            this.list = res.data || []
            this.complete = true
            this.list.forEach((item, index) => {
              this.$nextTick(() => {
                document.getElementById('qrcode').innerHTML = ""; // 清空二维码 写死 就是假图
                QRCode.toCanvas(document.getElementById('qrcode'), 'COUPON_DYNAMIC_CODE:0058182119888', {
                  width: 70,
                  height: 70,
                  margin: -10
                })
              });
            })
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
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
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "~@/common/stylus/mixin.styl"
  .history {
    .history-container {
      padding: 0 15px 11px 15px
      overflow-y auto
      -webkit-overflow-scrolling touch
      .no-data {
        text-align center
        padding: 10px 0
        color: $color-text-d
      }
      .list {
        .item {
          .show-time {
            padding: 11px 0
            color: $color-text-d
            text-align center
          }
          .container {
            box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
            background: #fff
            border-radius 6px
            padding: 0 11px
            display flex
            justify-content space-between
            line-height 22px
            position relative
            .left {
              display flex
              justify-content center
              align-items center
              flex-direction column
              padding-top: 3px
              width: 100px
              .text {
                text-align center
                color: $color-text-d
                padding-bottom: 11px
              }
              .qrcode {
                width 80%
                opacity 0.4
              }
            }
            .center {
              flex: 1
              line-height 24px
              display flex
              flex-direction column
              padding: 11px 0
              .title {
                font-size 16px
              }
              .coupon-name, .time {
                color: $color-text-d
              }
              .coupon-name {
                width: 180px
                ellipse()
              }
              .tips {
                color: $color-theme-r
              }
            }
            .tips-show {
              position absolute
              top: 0
              right: 0
              img {
                width: 60px
              }
            }
          }
        }
      }
    }
  }
  .van-progress {
    width 60%
  }
</style>

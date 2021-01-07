<template>
  <div class="details">
    <nav-top title="活动详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="details-container">
      <div class="show-qrcode">
        <canvas class="qrcode" id="qrcode"></canvas>
        <div class="refresh" @click="refreshGetCouDynamicCode">
          <img src="./image/icon2.png" alt="">
        </div>
        <div class="text">3分钟后二维码自动刷新</div>
      </div>
      <div class="activity-prize">
        <div class="title">活动奖品</div>
        <ul class="coupon-list">
          <li class="item" v-for="(item, index) in details.couStockDetailModelList" :key="index">
            <div class="left">
              <div class="price">￥<span class="num">{{item.couFaceValue || 0}}</span></div>
              <div class="name" v-if="item.couCategory == 10">代金券</div>
              <div class="name" v-else-if="item.couCategory == 20">满减券</div>
              <div class="name" v-else-if="item.couCategory == 30">兑换券</div>
              <div class="name" v-else-if="item.couCategory == 40">折扣券</div>
            </div>
            <div class="right">
              <div class="coupon-name">{{item.couTypeTitle || '--'}}</div>
              <div class="number">可领数量：{{(details.limitCnt - details.distCnt).toFixed(0)}}张</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="activity-prize">
        <div class="title">活动说明</div>
        <div class="info" v-html="details.activityDesc"></div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import QRCode from 'qrcode'
  import utils from "@/utils/util"

  export default {
    data() {
      return {
        couponList: [1, 2],
        details: '',
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
      this.details = JSON.parse(this.$route.query.details) || {}
      this.$nextTick(() => {
        document.getElementById('qrcode').innerHTML = ""; // 清空二维码
        QRCode.toCanvas(document.getElementById('qrcode'), this.details.dynamicCode, {width: 150, height: 150, margin: -10})
      });
      clearInterval(this.queryPayStateTimer)
      this.queryPayStateTimer = setInterval(() => {
        this.refreshGetCouDynamicCode()
      }, 180000) // 三分钟一刷新
    },
    methods: {
      refreshGetCouDynamicCode() {
        // 刷新二维码
        this.$request.post('/app/json/app_market/refreshGetCouDynamicCode', {
          token: this.$store.state.login.token,
          mktActivityId: this.details.id,
          posx: this.bd09[0],
          posy: this.bd09[1],
          // posy: '39.911576',
          // posx: '116.344172',
          getType: '1', // 1百度 2腾讯
        }).then(res => {
          if (res.status == 0) {
            this.$nextTick(() => {
              document.getElementById('qrcode').innerHTML = ""; // 清空二维码
              QRCode.toCanvas(document.getElementById('qrcode'), res.data, {width: 150, height: 150, margin: -10})
            });
          } else {
            this.$Toast(res.info ? res.info : '获取油站信息失败')
          }
        })
      },
    },
    destroyed() {
      clearInterval(this.queryPayStateTimer)
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .details {
    .details-container {
      padding: 11px 15px
      overflow-y auto
      -webkit-overflow-scrolling touch

      .show-qrcode {
        box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
        background: #fff
        border-radius 6px
        padding: 15px
        display flex
        justify-content space-between
        align-items center
        flex-direction column
        margin-bottom: 10px

        .refresh {
          padding-bottom: 10px

          img {
            width 20px
          }
        }

        .qrcode {
          width 60%
        }
      }
      .activity-prize {
        .title {
          padding-bottom: 10px
          color: $color-text
        }
        .coupon-list {
          .item {
            box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
            background: #fff
            border-radius 6px
            margon-bottom: 10px
            display flex
            justify-content left
            height 80px
            margin-bottom: 10px
            .left {
              width: 90px
              display flex
              justify-content center
              align-items center
              flex-direction column
              line-height 24px
              border-top-left-radius 4px
              border-bottom-left-radius 4px
              background: linear-gradient(145deg, #ee7878, #f3939f)
              color: #fff
              .num {
                font-size 24px
              }
            }
            .right {
              padding: 11px 0 11px 11px
              flex: 1
              display flex
              justify-content space-between
              flex-direction column
              .coupon-name {
                font-size 16px
              }
              .number {
                color: $color-text-d
              }
            }
          }
        }
        .info {
          color: $color-text-d
          line-height 20px
        }
      }
    }
  }
</style>

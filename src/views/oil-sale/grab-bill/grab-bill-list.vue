<template>
  <div class="oil-sale-container">
    <nav-top title="抢单列表" @backEvent="backEvent">
      <div class="record-iocn" @click="openRecord">
        <img src="../assets/image/zd.png" alt="">
      </div>
    </nav-top>
    <nav-content class="bill-list-container">
      <div class="bill-list-content">
        <div class="bill-item-info" v-for="(item, index) in billList" :key="index">
          <div class="bill-item">
            <div class="img-wrapper">
              <img class="img" src="../assets/image/bill.png" alt="">
            </div>
            <div class="center-text">
              <div class="title">{{item.matertialName}}</div>
              <div class="time">活动结束时间:{{item.endDate}}</div>
              <div class="tips info">
                ￥<span class="now-price">{{item.discountPrice ? item.discountPrice : 0}}</span>/t
                <span class="default-num">￥{{item.basePrice ? item.basePrice : 0}}</span>
              </div>
            </div>
            <div class="bill-btn">
              <div class="record-btn-show" slot="btn">
                <div class="record-img">
                  <div class="tips">剩{{item.remainTonnes || item.remainTonnes == 0  ? item.remainTonnes : item.totalTonnes}}t</div>
                  <van-progress v-if="item.remainTonnes === 0 || item.totalTonnes === 0" :percentage=100
                                :show-pivot="showPivot"/>
                  <van-progress v-else :percentage="calculateProgress(item.remainTonnes, item.totalTonnes)"
                                :show-pivot="showPivot"/>
                </div>
                <div class="btn" :class="{'noClick': item.state === 0 || (item.limitCnt && item.limitCnt === item.attendCnt) || item.remainTonnes === 0}" @click="openDetails(item)">立即抢单</div>
              </div>
            </div>
          </div>
          <van-popup v-model="showTips" :close-on-click-overlay="overlay">
            <div class="tips-content">
              <div class="title">温馨提示</div>
              <div class="content">当前可参与次数{{numTipsInfo.limitCnt}}，已参与次数{{numTipsInfo.attendCnt}}，不可再参与！</div>
              <div class="btn-group">
                <div class="btn" @click="showTips = false">我知道了</div>
              </div>
            </div>
          </van-popup>
        </div>
        <div class="no-data theme_font_tint" v-show="!hasMore">没有更多数据了~</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {Progress,Dialog} from 'vant'
  import eventBus from '@/utils/eventBus.js'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        overlay: false, // 蒙版
        billList: [],
        showPivot: false, // 进度条文字
        hasMore: true,
        showTips: false,
        numTipsInfo: '' // 提示的参数
      }
    },

    mounted() {
      this.getGrabOilSaleActivityList()
    },
    methods: {
      backEvent: function () {
        eventBus.$emit('oilSaleHomeData')
        this.$router.go(-1)
      },
      calculateProgress(remainTonnes, totalTonnes) {
        if (remainTonnes && totalTonnes) {
          let calculateResult = 100 - ((remainTonnes / totalTonnes) * 100)
          return parseInt(calculateResult)
        } else {
          return 0
        }
      },
      openRecord() {
        // 打开记录
        this.$router.push({path: '/grab-bill-record'})
      },
      openDetails(item) {
        // 打开立即抢单页面
        if (item.remainTonnes === 0) {
          Dialog.alert({
            title: '提示',
            message: '已售空'
          }).then(() => {

          })
        } else if (item.limitCnt && item.limitCnt === item.attendCnt) {
          // 可参与 == 已参与
          this.numTipsInfo = item
          this.showTips = true
        } else if (item.state !== 0) {
          this.$router.push({path: '/grab-bill-details', query: {grabItem: JSON.stringify(item), source: 'list'}})
        }
      },
      getGrabOilSaleActivityList() {
        // 获取抢单活动
        this.$request.post('/app/json/app_oil_sale/getGrabOilSaleActivityList', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId // 单位用户id
        }).then(res => {
          this.hasMore = false
          if (res.status === 0) {
            let preResult = []
            let sufResult = []
            let list = res.data
            list.forEach(item => {
              if (item.state === 0) {
                sufResult.push(item)
              } else {
                preResult.push(item)
              }
            })
            this.billList = [...preResult, ...sufResult]
          } else {
            this.$Toast(res.info ? res.info : '获取抢单活动失败')
          }
        })
      }
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
    components: {
      [Progress.name]: Progress,
      [Dialog.name]: Dialog
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../assets/stylus/oil-sale-base.styl"
</style>

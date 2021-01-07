<template>
  <div class="oil-sale-container">
    <nav-top title="撞单列表" @backEvent="backEvent">
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
              <div class="time">距活动结束:{{item.endDate}}</div>
              <div class="tips">撞单吨数范围：{{item.tonnesLowerLimit}}t-{{item.tonnesUpperLimit}}t</div>
            </div>
            <div class="bill-btn" @click="openDetails(item)">
              <div class="btn-show" :class="{'noClick': item.state == 1 || item.state == 2}">立即撞单</div>
            </div>
          </div>
        </div>
        <div class="no-data theme_font_tint" v-show="!hasMore">没有更多数据了~</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import eventBus from '@/utils/eventBus.js'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        billList: [],
        hasMore: true
      }
    },
    mounted() {
      this.getHitOilSaleActivityList() // 获取参与撞单活动列表
    },
    methods: {
      backEvent: function () {
        eventBus.$emit('oilSaleHomeData')
        this.$router.go(-1)
      },
      getHitOilSaleActivityList() {
        // 获取撞单活动
        this.$request.post('/app/json/app_oil_sale/getHitOilSaleActivityList', {
          activityType: 1, // 活动类型:1-撞单 2-约单 3-抢单
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId // 单位用户id
        }).then(res => {
          this.hasMore = false
          if (res.status === 0) {
            let preResult = []
            let sufResult = []
            let list = res.data
            list.forEach(item => {
              if (item.state === 1 || item.state === 2) {
                sufResult.push(item)
              } else {
                preResult.push(item)
              }
            })
            this.billList = [...preResult, ...sufResult]
          } else {

          }
        })
      },
      openDetails(item) {
        // 打开立即撞单页面
        if (item.state != 1 && item.state != 2) {
          this.$router.push({path: '/buy-bill-details', query: {buyItem: JSON.stringify(item), source: 'list'}})
        }
      },
      openRecord() {
        // 打开记录
        this.$router.push({path: '/buy-bill-record'})
      }
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../assets/stylus/oil-sale-base.styl"
</style>

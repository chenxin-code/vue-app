<template>
  <div class="oil-sale-container">
    <nav-top title="约单列表" @backEvent="backEvent">
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
            <div class="center-text" @click="openDetails(item)">
              <div class="title">{{item.matertialName}}</div>
              <div class="time" v-if="item.state != 2">活动结束时间:{{item.endDate}}</div>
              <div class="time" v-else>约单时间:{{item.submitTime}}</div>
              <div class="tips" v-if="item.state != 2">约单吨数范围：{{item.tonnesLowerLimit}}t~{{item.tonnesUpperLimit}}t
              </div>
              <div class="tips" v-else>约单单价：{{item.price}}</div>
            </div>
            <div class="bill-btn">
              <div class="appointment-circle" v-if="item.state == 2">约单中</div>
              <!--              <div class="btn-show noAppointment" v-if="item.state == 2">立即约单</div>-->
              <div class="btn-show" v-if="item.state == 2" @click="cacelAppointmentBill(item)">取消约单</div>
              <div class="btn-show" v-else :class="{'noClick': item.state == 0}" @click="openDetails(item)">立即约单</div>
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
        hasMore: true,
        recordResult: false // 是否是立即约单
      }
    },
    mounted() {
      this.getReserveOilSaleActivityList()
      console.log(123)
    },
    methods: {
      backEvent: function () {
        // eventBus.$emit('oilSaleHomeData')
        this.$router.go(-1)
      },
      openDetails(item) {
        // 打开立即约单页面
        if (item.state != 0) {
          this.$router.push({path: '/appointment-bill-details', query: {appointmentItem: JSON.stringify(item)}})
        }
      },
      openRecord() {
        // 打开记录
        this.$router.push({path: '/appointment-bill-record'})
      },
      cacelAppointmentBill(item) {
        // 取消约单按钮
        this.$dialog.confirm({message: '确定取消当前约单吗？'}).then(() => {
          this.$request.post('/app/json/app_oil_sale/cancelReserveOrder', {
            id: item.recordId, // 约单id
            vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
          }).then(res => {
            if (res.status === 0) {
              this.$Toast('约单取消成功')
              this.getReserveOilSaleActivityList()
            } else {
              this.$Toast(res.info ? res.info : '约单取消失败')
            }
          })
        })
      },
      getReserveOilSaleActivityList() {
        // 获取约单活动
        this.$request.post('/app/json/app_oil_sale/getReserveOilSaleActivityList', {
          activityType: 2, // 活动类型:1-撞单 2-约单 3-抢单
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
        }).then(res => {
          this.hasMore = false
          if (res.status === 0) {
            let preResult = []
            let sufResult = []
            let list = res.data
            list.forEach(item => {
              if (item.state != 2) {
                sufResult.push(item)
              } else {
                preResult.push(item)
              }
            })
            this.billList = [...preResult, ...sufResult]
          } else {
            this.$Toast(res.info ? res.info : '获取约单活动失败')
          }
        })
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
  .bill-btn {
    display flex
    justify-content center
    align-items center
    flex-direction column

    .appointment-circle {
      width: 40px
      height: 40px
      border-radius 50%
      background $color-background-l
      display flex
      align-items center
      justify-content center
      color: #fff
      margin-bottom: 3px
    }
  }
</style>

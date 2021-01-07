<template>
  <div class="oil-sale-container">
    <div class="buy-bill-record">
      <nav-top title="撞单记录" @backEvent="$router.go(-1)"></nav-top>
      <nav-content class="buy-bill-record-container">
        <div class="buy-bill-record-content">
          <div class="bill-item-info" v-for="(item, index) in billRecordList" :key="index">
            <div class="bill-item">
              <div class="img-wrapper">
                <img class="img" src="../assets/image/bill.png" alt="">
              </div>
              <div class="center-text">
                <div class="title">{{item.matertialName ? item.matertialName : '--'}}&nbsp;&nbsp;{{item.tonnes}}t</div>
                <div class="time">撞单时间：{{item.submitTime}}</div>
                <div class="tips">撞单单价：{{item.price}}（元/t）</div>
              </div>
              <div class="bill-btn">
                <div class="record-btn-show">
                  <div class="record-img">
                    <img src="../assets/image/icon.png" alt="" v-if="item.state == 1">
                    <img src="../assets/image/icon2.png" alt="" v-else-if="item.state == 0">
                  </div>
                  <div class="btn" @click="openDetails(item)">详情</div>
                </div>
              </div>
            </div>
          </div>
          <div class="no-data theme_font_tint" v-show="!hasMore">没有更多数据了~</div>
        </div>
      </nav-content>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        billRecordList: [],
        recordResult: false,
        hasMore: true
      }
    },
    mounted() {
      this.getHitOilSaleActivityRecordList()
    },
    methods: {
      openDetails(item) {
        // 打开详情页面
        this.$router.push({path: '/buy-bill-success', query: {resultItem: JSON.stringify(item)}})
      },
      getHitOilSaleActivityRecordList() {
        // 获取参与撞单活动列表
        this.$request.post('/app/json/app_oil_sale/getHitOilSaleActivityRecordList', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId // 单位用户id
        }).then(res => {
          this.hasMore = false
          if (res.status === 0) {
            this.billRecordList = res.data
          } else {
            this.$Toast(res.info ? res.info : '获取参与撞单活动列表失败')
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

</style>

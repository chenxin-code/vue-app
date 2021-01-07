<template>
  <div class="return-goods">
    <nav-top title="退货" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="return-goods-container">
      <div class="nav-bar">
        <div
          class="nav-bar-item"
          :class="{active: currentIndex === index}"
          v-for="(item, index) in tabList" :key="index"
          @click="tabChange(index)"
        >
          <span class="text">{{item}}</span>
        </div>
      </div>
      <ul class="list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
          <li class="item" v-for="(item2, index) in list" :key="index" @click="openDetails(item2)">
            <div class="content">
              <div class="left">
                <div class="img">
                  <img src="../../../assets/image/bill.png" alt="">
                </div>
                <div class="text">
                  <div class="info">油品名称：{{item2.matertialName}}</div>
                  <div class="info">购油数量：{{item2.tonnes}}t</div>
                  <div class="info">订单金额：{{item2.amount}}元</div>
                </div>
              </div>
              <div class="right" v-if="currentIndex == 0" @click="applicationBtn(item2)">
                <div class="btn">申请退货</div>
              </div>
            </div>
            <div class="tips-img" v-if="currentIndex == 2 || currentIndex == 3">
              <img src="../../../assets/image/tips1.png" alt="" v-if="item2.state == 5">
              <img src="../../../assets/image/tips2.png" alt="" v-else-if="item2.state == 6">
              <img src="../../../assets/image/tips3.png" alt="" v-else>
            </div>
          </li>
        </van-list>
      </ul>
    </nav-content>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import eventBus from '@/utils/eventBus.js'
  import util from '@/utils/util'
  export default {
    data() {
      return {
        tabList: ['退货申请', '审批中', '审批成功', '审批失败'],
        currentIndex: 0,
        list: [],
        loading: false,
        finished: false,
        page: 0,
        rows: 10,
        state: '3' // 3 退货申请  5 审批中 6，7完成
      }
    },
    mounted() {
      eventBus.$on('getOilSaleOrderList', () => {
        this.list = []
        this.page = 0
        this.finished = false
        this.loadMore()
      })
    },
    methods: {
      loadMore() {
        // 我的订单接口
        let time = util.getPreDate()
        this.page = this.page + 1
        let paramsData = {
          token: this.$store.state.login.token,
          page: this.page,
          rows: this.rows,
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
          state: this.state,
          startPickupTime: time
        }
        this.$http.post('/app/json/app_oil_sale/getOilSaleOrderList', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            console.log(data.data)
            if (data.data) {
              this.list = this.list.concat(data.data)
              console.log(this.list)
            }
            if (this.list.length >= data.totalRecords) {
              this.finished = true
            }
          } else {
            this.finished = true
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
          this.loading = false
        })
      },
      tabChange(index) {
        this.currentIndex = index
        if (index == 0) {
          this.state = '3'
        } else if (index == 1) {
          this.state = '5'
        } else if (index == 2) {
          this.state = '6'
        } else if (index == 3) {
          this.state = '7'
        }
        this.list = []
        this.page = 0
        this.finished = false
        // this.loadMore()
      },
      openDetails(item2) {
        // 打开退货详情
        if (this.currentIndex != 0) {
          this.$router.push({path: '/return-goods-details', query: {source: this.currentIndex, details: JSON.stringify(item2)}})
        }
      },
      applicationBtn(item2) {
        this.$router.push({path: '/return-goods-details', query: {source: this.currentIndex, details: JSON.stringify(item2)}})
      }
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  $color = #3c9df3
  .return-goods {
    .return-goods-container {
      display: flex
      flex-direction: column

      .nav-bar {
        height: 44px
        line-height: 44px
        display: flex
        background: #fff
        flex-shrink: 0

        .nav-bar-item {
          text-align: center
          flex: 1
          font-size: 14px

          .text {
          }

          &.active {
            .text {
              color: #009df8
              position: relative

              &:after {
                content: ''
                position: absolute
                bottom: -6px
                width: 100%
                left: 0
                height: 2px
                background: #009df8
              }
            }
          }
        }
      }

      .list {
        padding: 11px 15px
        flex 1
        -webkit-overflow-scrolling: touch
        overflow-y: auto

        .item {
          margin-bottom: 10px
          position relative

          .content {
            box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
            border-radius 6px
            display flex
            justify-content space-between
            align-items center
            padding: 15px

            .left {
              display flex
              justify-content left
              flex: 1

              .img {
                padding-right: 10px
                display flex
                justify-content center
                align-items center

                img {
                  width: 50px
                }
              }

              .text {
                display flex
                justify-content space-between
                align-items left
                flex-direction column
                line-height 22px
              }
            }

            .right {
              width: 90px
              text-align center
              .btn {
                background $color
                color: #fff
                padding: 10px 15px
                border-radius 20px
              }
            }
          }

          .tips-img {
            position absolute
            right 0
            top: 0

            img {
              width 50px
            }
          }
        }
      }
    }
  }
</style>

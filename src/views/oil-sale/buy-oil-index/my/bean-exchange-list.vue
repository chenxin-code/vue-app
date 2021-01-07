<template>
  <div class="oil-sale-container">
    <nav-top title="金豆兑换订单列表" @backEvent="backEvent"></nav-top>
    <!-- 金豆兑换订单列表 -->
    <nav-content class="buy-oil-order-list">
      <div class="nav-bar">
        <div
          class="nav-bar-item"
          :class="{active: currentIndex === index}"
          v-for="(item, index) in goldMenu"
          @click="tabChange(index)"
        >
          <span class="text">{{item.text}}</span>
        </div>
      </div>
      <!-- 金豆兑换订单列表 -->
      <div class="my-group-list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
          <div class="bill-item-info" v-for="(item, index) in billList" :key="index">
            <div class="bill-item">
              <div class="img-wrapper">
                <img class="img" :src="item.itemAbstractList[0].phPictureUrl" alt>
              </div>
              <div class="center">
                <div class="tips double-line">{{item.payBody}}</div>
                <div class="time">兑换数量：12</div>
              </div>
              <div class="bill-btn" @click="openDetails(item)">
                <div class="btn-show">详情</div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import Countdown from "@/components/Vendor/countdown/countdown"
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    name: "",
    data() {
      return {
        currentIndex: 0,
        billList: [], // 商品订单详情
        goldMenu: [
          {
            text: "待发货",
            cut: 0,
            tag: "16",
            nowPage: 1,
            type: "200017"
          },
          {
            text: "待提货",
            cut: 0,
            deliveryType: 1,
            tag: "4",
            nowPage: 1,
            type: "200017"
          },
          {
            text: "待收货",
            cut: 0,
            deliveryType: 2,
            tag: "4",
            nowPage: 1,
            type: "200017"
          },
          {
            text: "已完成",
            cut: 0,
            tag: "9",
            nowPage: 1,
            type: "200017"
          }
        ], // 金豆兑换订单 tab
        h: "00",
        m: "00",
        s: "00",
        // endTime: "1558238749000", // 倒计时时间戳
        titleIndex: "", // tab定位使用
        loading: false,
        finished: false,
        page: 0,
        beanItemDetails: '' // 金豆列表请求参数
      }
    },
    mounted() {
      if (this.tabBeanLocation.currentIndex !== '') {
        this.currentIndex = parseInt(this.tabBeanLocation.currentIndex)
        // this.state = parseInt(this.tabBeanLocation.currentIndex) + 1
        console.log(this.tabBeanLocation.currentIndex)
      } else if (this.$route.query.titleIndex !== '' && this.tabBeanLocation.currentIndex == '') {
        this.currentIndex = parseInt(this.$route.query.titleIndex)
        // this.state = parseInt(this.$route.query.titleIndex) + 1
        console.log(this.$route.query.titleIndex)
      } else {
        this.state = ''
      }
      if (this.$route.query.beanItemDetails) {
        this.beanItemDetails = JSON.parse(this.$route.query.beanItemDetails)
      }
    },
    methods: {
      tabChange(index) {
        // 根据菜单判断操作状态  待发货 待提货 已完成 等
        this.currentIndex = index
        if (this.currentIndex == 0) {
          this.beanItemDetails = this.goldMenu[0]
        } else if (this.currentIndex == 1) {
          this.beanItemDetails = this.goldMenu[1]
        } else if (this.currentIndex == 2) {
          this.beanItemDetails = this.goldMenu[2]
        } else if (this.currentIndex == 3) {
          this.beanItemDetails = this.goldMenu[3]
        }
        this.billList = []
        this.page = 0
        this.finished = false
        this.setTabBeanLocation(this.$assign({}, this.tabBeanLocation, {currentIndex: index}))
        this.$bridgefunc.vuexStorage()
      },
      backEvent() {
        this.$router.go(-1)
        this.setTabBeanLocation(this.$assign({}, this.tabBeanLocation, {currentIndex: ''}))
        this.$bridgefunc.vuexStorage()
      },
      loadMore() {
        // 获取金豆兑换订单列表数据
        this.page = this.page + 1
        let paramsData = {
          token: this.$store.state.login.token,
          orderType: this.beanItemDetails.type,
          state: this.beanItemDetails.tag,
          orderCategory: 1, // 金豆标识
          deliverType: this.beanItemDetails.deliveryType,
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
          page: {
            index: 0,
            pageSize: 20
          }
        }
        this.$http.post('/app/json/app_shopping_order/queryOrder', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.billList = this.billList.concat(data.data.orderList).reverse()
            if (this.billList.length >= data.totalRecords) {
              this.finished = true
            }
          } else {
            this.finished = true
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
          this.loading = false
        })
      },
      openDetails(item) {
        // 打开详情
        console.log(item)
        this.$router.push({
          path: "/bean-exchange-details",
          query: {beanItem: JSON.stringify(item)}
        })
      },
      ...mapMutations(['setTabBeanLocation'])
    },
    computed: {
      ...mapGetters(['vipUnitUser', 'tabBeanLocation'])
    },
    components: {Countdown}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl'
  @import '../../assets/stylus/oil-sale-base.styl'

  .buy-oil-order-list {
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
  }

  .my-group-list {
    padding: 11px 15px
    flex: 1
    -webkit-overflow-scrolling: touch
    overflow-y: auto
    .bill-item {
      .img-wrapper {
        width: 18%
      }
      .center {
        flex: 1
        line-height 18px
        .time {
          font-size: 12px
          padding-top: 5px
        }
      }
      .bill-btn {
        width: 20%
        .btn-show {
          padding: 6px 18px !important
        }
      }
    }
  }

</style>

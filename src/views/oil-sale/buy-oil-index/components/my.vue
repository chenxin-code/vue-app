<template>
  <div class="my">
    <div class="blue-container"></div>
    <div class="my-info">
      <div class="my-title-info">
        <div class="top">
          <div class="img">
            <img src="../../assets/image/tx.png" alt>
          </div>
          <div class="info">
            <div class="name">{{userInfo.departName}}</div>
            <div class="company-num">单位税务编号：{{userInfo.taxCode}}</div>
          </div>
        </div>
        <div class="bottom">
          <div class="groups" v-for="(item, index) in groupList" :key="index">群组{{item}}</div>
        </div>
      </div>
      <div class="balance-info">
        <div class="balance-item">
          <div class="text">金豆</div>
          <div class="num">{{userInfo.goldBeans ? userInfo.goldBeans : 0}}</div>
        </div>
        <div class="balance-item" @click="openCoupon">
          <div class="text">优惠券</div>
          <div class="num">{{userInfo.unusedCoupons ? userInfo.unusedCoupons : 0}}</div>
        </div>
      </div>
      <div class="buy-oil-order">
        <div class="title" @click="openOrderList">
          <div class="left">购油订单</div>
          <div class="right">
            全部订单
            <img src="../../assets/image/arrow.png" alt>
          </div>
        </div>
        <div class="order-list">
          <div
            class="order-item"
            v-for="(item, index) in BuyOilTabList"
            :key="index"
            @click="openItemTab(index, item.type)"
          >
            <div class="img">
              <img :src="item.imgUrl" alt>
            </div>
            <div class="text">{{item.text}}</div>
            <div class="circle" v-if="item.cut != 0 && index != 2 && index != 3 ">{{ item.cut }}</div>
          </div>
        </div>
      </div>
      <div class="buy-oil-order">
        <div class="title" @click="openBeanOrderList(1)">
          <div class="left">金豆兑换订单</div>
          <div class="right">
            全部订单
            <img src="../../assets/image/arrow.png" alt>
          </div>
        </div>
        <div class="order-list">
          <div
            class="order-item"
            v-for="(item, index) in beanTabList"
            :key="index"
            @click="openBeanOrderList(item.orderTab)"
          >
            <div class="img">
              <img :src="item.imgUrl" alt>
            </div>
            <div class="text">{{item.text}}</div>
            <div class="circle" v-if="item.cut != 0 && index != 3">{{ item.cut }}</div>
          </div>
        </div>
      </div>
      <div class="buy-oil-order batch-oil">
        <div class="title">
          <div class="left">预约提油</div>
        </div>
        <div class="order-list">
          <div class="order-item" @click="openOilExtraction(1)" v-if="appointmentOil == 1">
            <div class="img">
              <img src="../../assets/image/yyty.png" alt>
            </div>
            <div class="text">预约提油</div>
          </div>
          <div class="order-item" v-for="(item, index) in oilExtraction" :key="index"
               @click="openOilExtraction(item.type)">
            <div class="img">
              <img :src="item.imgUrl" alt>
            </div>
            <div class="text">{{item.text}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        groupList: [],
        BuyOilTabList: [
          {
            text: "待确认",
            imgUrl: require("../../assets/image/dqd.png"),
            cut: 0
          },
          {
            text: "待提货",
            imgUrl: require("../../assets/image/dth.png"),
            cut: 0
          },
          {
            text: "已完成",
            imgUrl: require("../../assets/image/ywc.png"),
            cut: 0
          },
          {
            text: "已取消",
            imgUrl: require("../../assets/image/dsh.png"),
            cut: 0
          },
          {
            text: "退货",
            imgUrl: require("../../assets/image/dsh.png"),
            cut: 0,
            type: '1'
          }
        ], // 购油订单 tab
        beanTabList: [
          {
            text: "待发货",
            imgUrl: require("../../assets/image/dfh.png"),
            cut: 0,
            tag: "16",
            nowPage: 1,
            type: "200017",
            orderTab: 1
          },
          {
            text: "待提货",
            imgUrl: require("../../assets/image/dth.png"),
            cut: 0,
            deliveryType: 1,
            tag: "4",
            nowPage: 1,
            type: "200017",
            orderTab: 2
          },
          {
            text: "待收货",
            imgUrl: require("../../assets/image/dsh.png"),
            cut: 0,
            deliveryType: 2,
            tag: "4",
            nowPage: 1,
            type: "200017",
            orderTab: 2
          },
          {
            text: "已完成",
            imgUrl: require("../../assets/image/ywc.png"),
            cut: 0,
            tag: "9",
            nowPage: 1,
            type: "200017",
            orderTab: 3
          }
        ], // 金豆兑换订单 tab
        oilExtraction: [
          {
            text: "待提油品",
            imgUrl: require("../../assets/image/yswt.png"),
            type: 2
          },
          {
            text: "提油记录",
            imgUrl: require("../../assets/image/ysyt.png"),
            type: 3
          },
          {
            text: "购油记录",
            imgUrl: require("../../assets/image/gyjl.png"),
            type: 4
          },
          {
            text: "账单信息",
            imgUrl: require("../../assets/image/account.png"),
            type: 5
          },
          {
            text: "提油卡办理",
            imgUrl: require("../../assets/image/account.png"),
            type: 6
          }
        ], // 预约提油
        appointmentOil: '' // 可配置项  0不显示  1显示
      }
    },
    props: {
      userInfo: {
        type: Object
      },
      orderCategory: {
      },
      vipUnitUserCode: {
        type: String
      }
    },
    mounted() {
      this.getOilSaleOrderCnt()
      this.getGoldSaleOrderCnt()
      this.appointmentOil = this.$store.state.globalConfig.appointmentOil
    },
    methods: {
      openOrderList() {
        // 打开购油订单列表
        this.$router.push({path: "/buy-oil-order-list"})
      },
      openItemTab(index, type) {
        // 购油订单的tab点击
        if (type) {
          this.$router.push({path: "/return-goods"})
        } else {
          this.$router.push({path: "/buy-oil-order-list", query: {titleIndex: index}})
        }
      },
      openBeanOrderList(index) {
        // 打开金豆订单列表
        this.$router.push({path: "/mall2/orderlist", query: {selectedIndex: index, orderCategory: this.orderCategory,vipUnitUserCode:this.vipUnitUserCode}})
      },
      openCoupon() {
        // 打开优惠券
        this.$router.push({path: "/coupon-list"})
      },
      openOilExtraction(type) {
        // 预约提油列表
        if (type == 1) {
          // 打开预约提油页面
          this.$router.push({path: '/appointment-oil'})
        } else if (type == 2) {
          // 打开待提油品页面
          this.$router.push({path: '/not-mention'})
        } else if (type == 3) {
          // 打开提油记录页面
          this.$router.push({path: '/have-mention'})
        } else if (type == 4) {
          // 打开购油记录页面
          this.$router.push({path: '/buy-oil-record'})
        } else if (type == 5) {
          // 打开账单信息页面
          this.$router.push({path: '/bill-information'})
        } else if (type == 6) {
          // 打开办卡页面
          this.$router.push({path: '/handle-card-index'})
        }
      },
      getOilSaleOrderCnt() {
        // 获取购油订单的cut
        this.$request.post("/app/json/app_oil_sale/getOilSaleOrderCnt", {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId
        }).then(res => {
          if (res.status === 0) {
            let data = res.data
            for (var i = 0; i < this.BuyOilTabList.length; i++) {
              if (this.BuyOilTabList[i].text == "待确认") {
                this.BuyOilTabList[i].cut = data.submitCnt
              } else if (this.BuyOilTabList[i].text == "待提货") {
                this.BuyOilTabList[i].cut = data.confirmCnt
              } else if (this.BuyOilTabList[i].text == "已完成") {
                this.BuyOilTabList[i].cut = data.completeCnt
              } else if (this.BuyOilTabList[i].text == "已取消") {
                this.BuyOilTabList[i].cut = data.cancelCnt
              }
            }
          } else {
            this.$Toast(res.info ? res.info : '获取购油订单失败')
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getGoldSaleOrderCnt() {
        // 金豆兑换订单
        /** 订单状态state
         * 1 未支付 3 已支付 7 已废弃 8 已失效 17 待备货 18 已备货 12 支付后取消 16 待发货 4 待收货 9 已完成 6 拒收
         * 16 待发货   4 待收货 待提货  9 已完成
         */
        this.$http.post("/app/json/app_shopping_order/queryBadge", {
          orderCategory: 1,
          vipUnitUserCode: this.vipUnitUser.vipUnitUserCode
        }).then(res => {
          if (res.status === 0) {
            let data = res.data
            for (var i = 0; i < data.length; i++) {
              if (data[i].state == 16) {
                this.beanTabList[0].cut = data[i].count
              } else if (data[i].state == 4 && data[i].deliveryType == 1) {
                this.beanTabList[1].cut = data[i].count
              } else if (data[i].state == 4 && data[i].deliveryType == 2) {
                this.beanTabList[2].cut = data[i].count
              } else if (data[i].state == 9) {
                this.beanTabList[3].cut = data[i].count
              }
            }
          } else {
            this.$Toast(res.info ? res.info : '获取金豆兑换订单失败')
          }
        }).catch(err => {
          console.log(err)
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
  @import '~@/common/stylus/variable.styl'

  .my {
    position: relative

    .blue-container {
      height: 80px
      background: #029cf6
    }

    .my-info {
      position: absolute
      top: 10px
      left: 10px
      right: 10px
      padding-bottom: 20px

      .my-title-info {
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
        background: #fff
        border-radius: 4px
        padding: 15px

        .top {
          display: flex
          justify-content: left
          align-items: center

          .img {
            width: 53px
            height: 53px
            border-radius: 50%
            background: #f8f8f8
            margin-right: 10px

            img {
              width: 100%
              height: 100%
              border-radius: 50%
            }
          }

          .info {
            flex: 1
            line-height: 20px

            .name {
              font-size: 16px
            }

            .company-num {
              font-size: 12px
              color: $color-text-l
            }
          }
        }

        .bottom {
          display: flex
          justify-content: left
          align-items: center
          padding-top: 10px

          .groups {
            background: $color-background-lll
            color: $color-text-l
            padding: 3px 5px
            border-radius: 20px
            margin-right: 10px
            font-size: 12px
          }
        }
      }

      .balance-info {
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
        background: #fff
        border-radius: 4px
        padding: 15px 60px
        margin-top: 10px
        display: flex
        justify-content: space-between
        align-items: center

        .balance-item {
          line-height: 22px
          text-align: center
          font-size: 14px

          .text {
            color: $color-text-d
          }

          .num {
            font-size: 24px
          }
        }
      }

      .buy-oil-order {
        .title {
          padding: 15px 0
          font-size: 16px
          display: flex
          justify-content: space-between
          align-items: center

          .right {
            color: $color-text-d
            font-size: 12px
            display: flex
            justify-content: center
            align-items: center

            img {
              width: 6px
              height: 10px
              margin-left: 3px
            }
          }
        }

        .order-list {
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
          background: #fff
          border-radius: 4px
          padding: 15px 15px 11px 15px
          display: flex
          justify-content: space-between
          align-items: center
          text-align: center
          line-height: 20px
          color: $color-text

          .order-item {
            position: relative

            .img {
              img {
                width: 25px
              }
            }

            .circle {
              width: 20px
              height: 20px
              border-radius: 50%
              background: $color-theme-r
              color: #fff
              display: flex
              align-items: center
              justify-content: center
              position: absolute
              top: -10px
              right: -5px
            }
          }
        }
      }
      .batch-oil {
        .order-list {
          display inline-block
          overflow hidden
          width 100%
          padding: 15px 15px 0 15px
          .order-item {
            width: 25%
            float left
            padding-bottom: 11px
          }
        }
      }
    }
  }
</style>

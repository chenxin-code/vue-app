<template>
  <div class="qq-recharge">
    <nav-top title="QQ充值" @backEvent="$router.go(-1)">
      <div class="phone-bill" @click="openPhoneBill">
        <img src="../phone-bill-recharge/image/zd.png" alt="">
      </div>
    </nav-top>
    <nav-content class="qq-recharge-content">
      <ul class="tab-list">
        <li class="tab-item" @click="changeTab(index)" :class="{'active': changetab == index}"
            v-for="(item, index) in tabList" :key="index">{{item}}
        </li>
      </ul>
      <div class="pay-setting-details">
        <div class="inp">
          <input
            type="number"
            onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
            placeholder="请输入qq号"
            @blur="overQq"
            @input="okQq"
            v-model="qqNum">
        </div>
        <recharge-grid :col="3" :list="list" @change="change" :status="status"></recharge-grid>
        <div class="price" v-show="showPrice">
          <div class="price-info">
            售价￥9.80
            <span class="yuan-price">原价￥10.00</span>
          </div>
        </div>
        <div class="cozy-tips">
          <div class="title">温馨提示</div>
          <div class="content">1.温馨提示</div>
          <div class="content">1.温馨提示</div>
          <div class="content">1.温馨提示</div>
          <div class="content">1.温馨提示</div>
          <div class="content">1.温馨提示</div>
          <div class="content">1.温馨提示</div>
          <div class="content">1.温馨提示</div>
          <div class="content">1.温馨提示</div>
          <div class="content">1.温馨提示</div>
          <div class="content">1.温馨提示</div>
        </div>
      </div>
<!--      <div class="re-btn" @click="nowRecharge">立即充值</div>-->
      <van-action-sheet v-model="showRecharg" title="确认付款">
        <div class="recharge-popup">
          <div class="num">
            ￥<span class="text">{{changeNum}}</span>
          </div>
          <div class="info">
            <div class="details">
              <span class="title">订单信息</span>
              <span class="content">qq号{{qqNum}}充值{{changeNum}}元</span>
            </div>
            <div class="details">
              <span class="title">支付方式</span>
              <span class="content">微信支付</span>
            </div>
          </div>
        </div>
        <div class="re-btn" @click="nowPay">立即支付</div>
      </van-action-sheet>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import RechargeGrid from '../components/recharge-grid'
  import payHelper from '@/utils/payHelper'

  export default {
    name: '',
    data() {
      return {
        tabList: ['Q币充值', 'QQ会员充值', 'QQ等级'], // tab 菜单名称
        changetab: 0, // 已选的tab
        list: [], // qq面额 列表
        showPrice: false, // 售价的显示
        changeNum: '', // 选择的面额
        showRecharg: false, // 充值页面弹框
        status: false,
        orderInfo: '', // 支付的订单信息
        submitInfo: '', // 下单成功的信息 为支付使用
        selectedPayWay: { // 支付方式
          text: '微信',
          payMode: '210',
          payModeSub: '210001',
          icon: 'static/image/mall2/weixin.png'
        },
        qqNum: '' // qq号
      }
    },
    created() {
    },
    mounted() {
      this.getRechargeProList()
    },
    methods: {
      changeTab(index) {
        // 切换tab
        this.changetab = index
        if (this.changetab != 0) {
          this.showPrice = true // 只有Q币充值的售价不显示
        } else {
          this.showPrice = false
        }
      },
      openPhoneBill() {
        // 打开话费账单
        this.$router.push({path: '/recharge-bill', query: {name: 'qq'}})
      },
      nowRecharge() {
        // 立即充值按钮
        let filter = /^\s*[.0-9]{5,11}\s*$/
        if (!filter.test(this.qqNum)) {
          this.qqNum = ''
          this.$Toast('请输入有效qq号码！')
        } else {
          this.showRecharg = true
        }
      },
      nowPay() {
        // 立即支付按钮
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          virtualUserPhone: this.$store.state.login.phone, // 手机号
          virtualUserQq: this.qqNum, // QQ
          deliveryType: '2',
          carts: [{
            skuId: this.orderInfo.skuId,
            storeOuCode: this.orderInfo.storeOuCode,
            number: 1
          }]
        }
        this.$http.post('/app/json/fee_life_order/submit', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.submitInfo = data.data
            console.log(this.submitInfo)
            this.pay()
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
      pay() {
        if (this.selectedPayWay == null) {
          this.$Toast("请选择支付方式！")
          return;
        }
        payHelper.trafficPayEvent(this.selectedPayWay, this.submitInfo.orderType, this.submitInfo.orderId).then(() => {
          this.$router.replace({
            path: '/recharge-bill-details',
            query: {
              orderType: this.submitInfo.orderType,
              orderId: this.submitInfo.orderId
            }
          })
        }).catch(() => {
        })
        // 支付订单
        // this.$Loading.open()
        // let paramsData = {
        //   token: this.$store.state.login.token,
        //   orderType: this.submitInfo.orderType, // 订单类型
        //   orderId: this.submitInfo.orderId, // 商城订单ID
        //   payMode: this.selectedPayWay.payMode, // 支付方式
        //   payModeSub: this.selectedPayWay.payModeSub // 支付具体方式
        // }
        // this.$http.post('/app/json/fee_life_order/pay', params).then(res => {
        //   let data = res.data
        //   if (data.status == 0) {
        //     let payInfo = JSON.parse(data.data.payInfo)
        //     this.$bridgefunc.wxPay(payInfo, (result) => {
        //       if (result == '1') {
        //         this.$router.replace({
        //           path: '/recharge-bill-details',
        //           query: {
        //             orderType: this.submitInfo.orderType,
        //             orderId: this.submitInfo.orderId
        //           }
        //         })
        //       }
        //     })
        //   } else {
        //     this.$Toast(data.info)
        //   }
        //   this.$Loading.close()
        // })
      },
      change(num) {
        // 子组件点击事件
        let filter = /^\s*[.0-9]{5,11}\s*$/
        if (!filter.test(this.qqNum)) {
          this.qqNum = ''
          this.$Toast('请输入有效qq号码！')
        } else {
          this.showRecharg = true
          this.changeNum = num.salePrice
          this.orderInfo = num
        }
      },
      overQq() {
        // 输入QQ 号
        let filter = /^\s*[.0-9]{5,11}\s*$/
        if (!filter.test(this.qqNum)) {
          this.qqNum = ''
          this.$Toast('请输入有效qq号码！')
        }
      },
      okQq() {
        // 输入完qq 面额可选
        let filter = /^\s*[.0-9]{5,11}\s*$/
        if (filter.test(this.qqNum)) {
          this.status = true
        } else {
          this.status = false
        }

      },
      getRechargeProList() {
        // 获取面额
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          productType: '503', // 501话费充值，502流量充值 503qq充值
        }
        this.$http.post('/app/json/product_recharge/getRechargeProList', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.list = data.data.list
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
    },
    computed: {},
    components: {
      RechargeGrid
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "../asset/recharge.styl"
  .qq-recharge-content {
    padding: 11px 15px
    display flex
    flex-direction column
    width 100%

    .pay-setting-details {
      flex 1;
      -webkit-overflow-scrolling touch;
      overflow-y auto
      padding-bottom: 44px;
    }

    .tab-list {
      padding: 15px 15px
      display flex
      justify-content space-between
      align-items center
      font-size: 15px
      flex-shrink 0

      .tab-item {
        padding-bottom: 5px
      }

      .active {
        color: $color-theme-r
        border-bottom: 2px solid $color-theme-r
      }
    }

    .default-number {
      line-height 26px
      padding 15px 0

      .num {
        font-size: 24px
      }

      .tips {
        color: $color-text-l
        font-size: 12px
      }
    }

    .inp {
      input {
        font-size 24px
        width: 100%
        height: 50px
      }
    }

    .price {
      padding: 20px 0
      color: $color-theme-r
      font-size: 14px

      .yuan-price {
        color: $color-text-l
        font-size: 12px
        display inline-block
        padding-left: 5px
        text-decoration line-through
      }
    }

    .cozy-tips {
      padding: 20px 0
      line-height 22px

      .title {
        font-size: 16px
      }

      .content {
        color: $color-text-l
      }
    }
  }

  .recharge-popup {
    padding: 11px 15px
    height: 350px

    .num {
      text-align center
      font-weight bold
      padding: 20px 0

      .text {
        font-weight bold
        font-size 34px
      }
    }

    .info {
      .details {
        padding: 15px 0
        display flex
        justify-content space-between
        align-items center
        font-size 14px
        border-bottom: 0.5px solid #ecebeb

        .title {
          color: $color-text-l
        }
      }
    }
  }

  /deep/ .van-action-sheet--withtitle {
    border-top-left-radius 10px
    border-top-right-radius 10px
  }
  .phone-bill {
    text-align right
    padding-right: 10px
    img {
      width: 20px
      vertical-align middle
    }
  }
</style>

<template>
  <div class="oil-sale-container">
    <nav-top title="撞单活动" @backEvent="backEvent"></nav-top>
    <nav-content class="buy-bill-results-container">
      <div class="buy-bill-results-content">
        <div class="bill-results" v-if="queryInfo.state == 1">
          <img src="../assets/image/ok.png" alt="">
          <div class="text">恭喜您撞单成功，请尽快提货</div>
          <div class="btn-show" @click="openOtherBuyBill">
            <div class="btn">查看其他撞单</div>
          </div>
        </div>
        <div class="bill-results" v-else-if="queryInfo.state == 0">
          <img src="../assets/image/no.png" alt="">
          <div class="text">很遗憾，撞单失败</div>
          <div class="btn-show" @click="openOtherBuyBill">
            <div class="btn">查看其他撞单</div>
          </div>
        </div>
        <div class="buy-bill">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="bill-item">
                  <div class="img-wrapper">
                    <img class="img" src="../assets/image/bill.png" alt="">
                  </div>
                  <div class="center-text">
                    <div class="title">{{queryInfo.matertialName}}&nbsp;&nbsp;{{queryInfo.tonnes}}t</div>
                    <div class="time">订单编号：{{queryInfo.id}}</div>
                    <div class="tips">下单时间：{{queryInfo.submitTime}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <ul class="details-list">
                  <li class="details-item">
                    <div class="left">购油量</div>
                    <div class="right">
                      <input type="text" disabled placeholder="请输入购油量(t)" v-model="queryInfo.tonnes">
                    </div>
                  </li>
                  <li class="details-item">
                    <div class="left">撞单油品单价</div>
                    <div class="right">
                      <input type="text" disabled placeholder="请输入撞单单价" v-model="queryInfo.price">
                    </div>
                  </li>
                  <li class="details-item" v-if="queryInfo.deliveryType == 1">
                    <div class="left">自提油库</div>
                    <div class="right">
                      <input type="text" disabled placeholder="选择油库" v-model="queryInfo.pickUpOilDepotName">
                    </div>
                    <!--      油库选择弹框-->
                    <TipsPopup></TipsPopup>
                  </li>
                  <li class="details-item" v-if="queryInfo.deliveryType == 1">
                    <div class="left">提货人</div>
                    <div class="right">
                      <input type="text" disabled placeholder="请输入提货人" v-model="queryInfo.consignee">
                    </div>
                  </li>
                  <li class="details-item" v-if="queryInfo.deliveryType == 1">
                    <div class="left">联系方式</div>
                    <div class="right">
                      <input type="text" disabled placeholder="请输入联系方式" v-model="queryInfo.consigneePhone">
                    </div>
                  </li>
                  <li class="details-item" v-if="queryInfo.deliveryType == 2">
                    <div class="left">收货人姓名</div>
                    <div class="right">
                      <input type="text" disabled v-model="addressInfo.receiverName">
                    </div>
                  </li>
                  <li class="details-item" v-if="queryInfo.deliveryType == 2">
                    <div class="left">收货人手机号</div>
                    <div class="right">
                      <input type="text" disabled v-model="addressInfo.mobile">
                    </div>
                  </li>
                  <li class="details-item" v-if="queryInfo.deliveryType == 2">
                    <div class="left">区域</div>
                    <div class="right">
                      <input type="text" disabled v-model="addressInfo.regionText">
                    </div>
                  </li>
                  <li class="details-item" v-if="queryInfo.deliveryType == 2">
                    <div class="left">详细地址</div>
                    <div class="right">
                      <input type="text" disabled v-model="addressInfo.address">
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <ul class="buy-bill-money-list">
                  <li class="buy-bill-money-item">
                    <div class="money">
                      <div class="left">油品总金额</div>
                      <div class="right">
                        ￥<span class="num">{{dealNum()}}</span>
                      </div>
                    </div>
                    <div class="money">
                      <div class="left">活动优惠</div>
                      <div class="right special">
                        ￥<span class="num">{{calculatePrice()}}</span>
                      </div>
                    </div>
                    <div class="money">
                      <div class="left">实际需支付</div>
                      <div class="right special">
                        ￥<span class="num">{{(dealNum()-calculatePrice()).toFixed(2)}}</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import TipsPopup from '../components/tips-popup'
  import eventBus from '@/utils/eventBus.js'

  export default {
    data() {
      return {
        clickOil: false, // 不可选择油库
        buyBillResults: true, // 撞单成功与否
        oilNum: '', // 购油量
        price: '', // 单价
        oilLibrary: '', // 油库
        people: '', // 提货人
        phone: '', // 联系方式
        queryInfo: '', // 提交详情
        addressInfo: ''
      }
    },
    computed: {
    },
    mounted() {
      this.queryInfo = JSON.parse(this.$route.query.queryInfo)
      if (this.queryInfo.addressInfo) {
        this.addressInfo = JSON.parse(this.queryInfo.addressInfo)
        console.log(this.addressInfo)
      }
    },
    methods: {
      dealNum() {
        let res = (this.queryInfo.price * this.queryInfo.tonnes).toFixed(2)
        return Math.round(res * 100) / 100
      },
      calculatePrice() {
        if (this.queryInfo.listingPrice > this.queryInfo.price) {
          let num1 = this.queryInfo.listingPrice * this.queryInfo.tonnes
          let num2 = this.queryInfo.tonnes * this.queryInfo.price
          let num = (Math.round(num1 * 100) - Math.round(num2 * 100)) / 100
          return num ? num.toFixed(2) : 0
        } else {
          return 0
        }
      },
      backEvent: function () {
        eventBus.$emit('oilSaleHomeData')
        this.$router.go(-2)
      },
      openOtherBuyBill() {
        // 查看其他撞单
        if (this.$route.query.source == 'list') {
          this.$router.go(-2)
        } else {
          this.$router.push({path: '/buy-bill-list'})
        }
      }
    },
    components: {
      TipsPopup
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../assets/stylus/oil-sale-base.styl"
  .btn-show {
    padding: 5px 15px 5px 15px !important

    .btn {
      border-radius 20px
      padding: 10px 0
      width: 50%
      margin: 0 auto
      color: #fff
      background: #009df8
      text-align center
      font-size: 14px
      font-weight bold
    }
  }
</style>

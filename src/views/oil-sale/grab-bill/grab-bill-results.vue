<template>
  <div class="oil-sale-container">
    <nav-top title="抢单活动" @backEvent="backEvent"></nav-top>
    <nav-content class="buy-bill-results-container">
      <div class="buy-bill-results-content">
        <div class="bill-results">
          <img src="../assets/image/ok.png" alt="">
          <div class="text">恭喜您抢单成功</div>
          <div class="btn-show" @click="openOtherGrabBill">
            <div class="btn">继续抢单</div>
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
                    <div class="title">{{queryItem.matertialName}}</div>
                    <div class="time">抢单时间:{{queryItem.submitTime}}</div>
                    <div class="tips info">
                      ￥<span class="now-price">{{queryItem.price ? queryItem.price : 0}}</span>/t
                      <span class="default-num">￥{{queryItem.basePrice ? queryItem.basePrice : 0}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <ul class="details-list">
                  <li class="details-item">
                    <div class="left">订单编号</div>
                    <div class="right">
                      <input type="text" disabled v-model="queryItem.id">
                    </div>
                  </li>
                  <li class="details-item">
                    <div class="left">下单时间</div>
                    <div class="right">
                      <input type="text" disabled v-model="queryItem.submitTime">
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <ul class="details-list">
                  <li class="details-item">
                    <div class="left">购油量</div>
                    <div class="right">
                      <input type="text" disabled placeholder="请输入购油量(t)" v-model="queryItem.tonnes">
                    </div>
                  </li>
                  <li class="details-item" v-if="queryItem.deliveryType == 1">
                    <div class="left">自提油库</div>
                    <div class="right">
                      <input type="text" disabled placeholder="选择油库" v-model="queryItem.pickUpOilDepotName">
                    </div>
                    <!--      油库选择弹框-->
                    <TipsPopup></TipsPopup>
                  </li>
                  <li class="details-item" v-if="queryItem.deliveryType == 1">
                    <div class="left">提货人</div>
                    <div class="right">
                      <input type="text" disabled placeholder="请输入提货人" v-model="queryItem.consignee">
                    </div>
                  </li>
                  <li class="details-item" v-if="queryItem.deliveryType == 1">
                    <div class="left">联系方式</div>
                    <div class="right">
                      <input type="text" disabled placeholder="请输入联系方式" v-model="queryItem.consigneePhone">
                    </div>
                  </li>
                  <li class="details-item" v-if="queryItem.deliveryType == 2">
                    <div class="left">收货人姓名</div>
                    <div class="right">
                      <input type="text" disabled v-model="addressInfo.receiverName">
                    </div>
                  </li>
                  <li class="details-item" v-if="queryItem.deliveryType == 2">
                    <div class="left">收货人手机号</div>
                    <div class="right">
                      <input type="text" disabled v-model="addressInfo.mobile">
                    </div>
                  </li>
                  <li class="details-item" v-if="queryItem.deliveryType == 2">
                    <div class="left">区域</div>
                    <div class="right">
                      <input type="text" disabled v-model="addressInfo.regionText">
                    </div>
                  </li>
                  <li class="details-item" v-if="queryItem.deliveryType == 2">
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
        queryItem: '', // 详情
        addressInfo: ''
      }
    },
    mounted() {
      this.queryItem = JSON.parse(this.$route.query.queryItem)
      if (this.queryItem.addressInfo) {
        this.addressInfo = JSON.parse(this.queryItem.addressInfo)
        console.log(this.addressInfo)
      }
    },
    computed: {
    },
    methods: {
      dealNum() {
        let res = (this.queryItem.basePrice * this.queryItem.tonnes).toFixed(2)
        return (Math.round(res * 100) / 100).toFixed(2)
      },
      calculatePrice() {
        if (this.queryItem.basePrice > this.queryItem.price) {
          let num1 = this.queryItem.basePrice * this.queryItem.tonnes
          let num2 = this.queryItem.price * this.queryItem.tonnes
          let num = (Math.round(num1 * 100) - Math.round(num2 * 100)) / 100
          return num > 0 ? num.toFixed(2) : 0
        } else {
          return 0
        }
      },
      backEvent: function () {
        eventBus.$emit('oilSaleHomeData')
        this.$router.go(-2)
      },
      openOtherGrabBill() {
        // 继续抢单
        if (this.$route.query.source == 'list') {
          this.$router.go(-2)
        } else {
          this.$router.push({path: '/grab-bill-list'})
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

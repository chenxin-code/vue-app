<template>
  <div class="oil-sale-container">
    <nav-top title="订单提交" @backEvent="$router.go(-2)"></nav-top>
    <nav-content class="buy-bill-results-container">
      <div class="buy-bill-results-content">
        <div class="bill-results" v-if="queryItem.state == 1">
          <img src="../../assets/image/ok.png" alt="">
          <div class="text">订单提交成功！等待后台确认</div>
        </div>
        <div class="bill-results" v-else-if="queryItem.state == 0">
          <img src="../../assets/image/no.png" alt="">
          <div class="text">很遗憾，抢单失败</div>
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
                    <img class="img" src="../../assets/image/bill.png" alt="">
                  </div>
                  <div class="center-text">
                    <div class="title">{{queryItem.matertialName}}</div>
                    <div class="tips info">
                      ￥<span class="now-price">{{queryItem.basePrice}}元</span>/t
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
                  <li class="details-item" v-if="deliveryType == 1">
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
                        -￥<span class="num">{{calculatePrice()}}</span>
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
  import TipsPopup from '../../components/tips-popup'

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
      }
    },
    methods: {
      openOtherGrabBill() {
        // 查看其他抢单
        this.$routdeliveryTypeer.go(-2)
      },
      dealNum() {
        let res = (this.queryItem.basePrice * this.queryItem.tonnes).toFixed(2)
        return Math.round(res * 100) / 100
      },
      calculatePrice() {
        let num1 = this.queryItem.basePrice * this.queryItem.tonnes
        let num2 = this.queryItem.price * this.queryItem.tonnes
        let num = (Math.round(num1 * 100) - Math.round(num2 * 100)) / 100
        return num > 0 ? num.toFixed(2) : 0
      }
    },
    components: {
      TipsPopup
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/oil-sale-base.styl"
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

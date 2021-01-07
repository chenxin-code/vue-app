<template>
  <div class="oil-sale-container">
    <nav-top :title="title" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="buy-bill-record-container">
      <div class="buy-bill-record-content">
        <div class="buy-bill">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="bill-item">
                  <div class="img-wrapper">
                    <img class="img" src="../assets/image/bill.png" alt="">
                  </div>
                  <div class="center-text">
                    <div class="title">{{resultItem.matertialName ? resultItem.matertialName : '--'}}&nbsp;&nbsp;{{resultItem.tonnes}}t</div>
                    <div class="time">撞单时间：{{resultItem.submitTime}}</div>
                    <div class="tips">撞单单价：{{resultItem.price}}（元/t）</div>
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
                      <input type="text" disabled placeholder="请输入订单编号" v-model="resultItem.id">
                    </div>
                  </li>
                  <li class="details-item" v-if="resultItem.deliveryType == 1">
                    <div class="left">自提油库</div>
                    <div class="right">
                      <input type="text" disabled placeholder="选择油库" v-model="resultItem.pickUpOilDepotName">
                    </div>
                    <!--      油库选择弹框-->
                    <TipsPopup :oilName="oilName"></TipsPopup>
                  </li>
                  <li class="details-item" v-if="resultItem.deliveryType == 1">
                    <div class="left">提货人</div>
                    <div class="right">
                      <input type="text" disabled placeholder="请输入提货人" v-model="resultItem.consignee">
                    </div>
                  </li>
                  <li class="details-item" v-if="resultItem.deliveryType == 1">
                    <div class="left">联系方式</div>
                    <div class="right">
                      <input type="text" disabled placeholder="请输入联系方式" v-model="resultItem.consigneePhone">
                    </div>
                  </li>
                  <li class="details-item" v-if="resultItem.deliveryType == 2">
                    <div class="left">收货人姓名</div>
                    <div class="right">
                      <input type="text" disabled v-model="addressInfo.receiverName">
                    </div>
                  </li>
                  <li class="details-item" v-if="resultItem.deliveryType == 2">
                    <div class="left">收货人手机号</div>
                    <div class="right">
                      <input type="text" disabled v-model="addressInfo.mobile">
                    </div>
                  </li>
                  <li class="details-item" v-if="resultItem.deliveryType == 2">
                    <div class="left">区域</div>
                    <div class="right">
                      <input type="text" disabled v-model="addressInfo.regionText">
                    </div>
                  </li>
                  <li class="details-item" v-if="resultItem.deliveryType == 2">
                    <div class="left">详细地址</div>
                    <div class="right">
                      <input type="text" disabled v-model="addressInfo.address">
                    </div>
                  </li>
                  <li class="details-item">
                    <div class="left">经办人手机号</div>
                    <div class="right">
                      <input type="text" disabled placeholder="请输入联系方式" v-model="resultItem.userPhone">
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="table-view-cell" v-if="resultItem.state == 1">
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

  export default {
    data() {
      return {
        billDetails: {},
        clickOil: false, // 不可选择油库
        title: '撞单失败', // 标题
        resultItem: '', // 撞单结果信息
        oilName: '', // 油库 组件
        phone: '', // 联系方式
        addressInfo: ''
      }
    },
    computed: {
    },
    mounted() {
      this.resultItem = JSON.parse(this.$route.query.resultItem)
      if (this.resultItem.addressInfo) {
        this.addressInfo = JSON.parse(this.resultItem.addressInfo)
        console.log(this.addressInfo)
      }
      if (this.resultItem.state == 0) { // 0是失败 1是成功
        this.title = '撞单失败'
      } else {
        this.title = '撞单成功'
      }
    },
    methods: {
      dealNum() {
        let res = (this.resultItem.price * this.resultItem.tonnes).toFixed(2)
        return Math.round(res * 100) / 100
      },
      calculatePrice() {
        if (this.resultItem.listingPrice > this.resultItem.price) {
          let num1 = this.resultItem.listingPrice * this.resultItem.tonnes
          let num2 = this.resultItem.tonnes * this.resultItem.price
          let num = (Math.round(num1 * 100) - Math.round(num2 * 100)) / 100
          return num ? num.toFixed(2) : 0
        } else {
          return 0
        }
      },
    },
    components: {
      TipsPopup
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../assets/stylus/oil-sale-base.styl"

</style>

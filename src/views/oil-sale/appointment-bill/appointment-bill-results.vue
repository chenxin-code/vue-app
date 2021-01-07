<template>
  <div class="oil-sale-container">
    <nav-top title="约单活动" @backEvent="backEvent"></nav-top>
    <nav-content class="buy-bill-results-container">
      <div class="buy-bill-results-content">
        <div class="bill-results">
          <img src="../assets/image/ok.png" alt="">
          <div class="text">约单提交成功，等待后台确认</div>
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
                    <div class="title">{{queryInfo.matertialName || ''}}</div>
                    <div class="time">约单时间：{{queryInfo.submitTime}}</div>
                    <div class="tips">约单单价：{{queryInfo.price}}元/t</div>
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
                      <input type="text" disabled v-model="queryInfo.id">
                    </div>
                  </li>
                  <li class="details-item">
                    <div class="left">下单时间</div>
                    <div class="right">
                      <input type="text" disabled v-model="queryInfo.submitTime">
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
                      <input type="text" disabled v-model="queryInfo.tonnes">
                    </div>
                  </li>
                  <li class="details-item" v-if="queryInfo.deliveryType == 1">
                    <div class="left">自提油库</div>
                    <div class="right">
                      <input type="text" disabled v-model="queryInfo.pickUpOilDepotName">
                    </div>
                    <!--      油库选择弹框-->
                    <TipsPopup></TipsPopup>
                  </li>
                  <li class="details-item" v-if="queryInfo.deliveryType == 1">
                    <div class="left">提货人</div>
                    <div class="right">
                      <input type="text" disabled v-model="queryInfo.consignee">
                    </div>
                  </li>
                  <li class="details-item" v-if="queryInfo.deliveryType == 1">
                    <div class="left">联系方式</div>
                    <div class="right">
                      <input type="text" disabled v-model="queryInfo.consigneePhone">
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
        <div class="cancel-btn" @click="cacelAppointmentBill">
          <div class="btn">取消约单</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import TipsPopup from '../components/tips-popup'
  import eventBus from '@/utils/eventBus.js'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        clickOil: false, // 不可选择油库
        buyBillResults: true, // 约单成功与否
        queryInfo: '', // 提交详情
        addressInfo: ''
      }
    },
    mounted() {
      this.queryInfo = JSON.parse(this.$route.query.queryInfo)
      if (this.queryInfo.addressInfo) {
        this.addressInfo = JSON.parse(this.queryInfo.addressInfo)
      }
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
    methods: {
      calculatePrice() {
        if (this.queryInfo.basePrice) {
          let num1 = this.queryInfo.basePrice * this.queryInfo.tonnes
          let num2 = this.queryInfo.tonnes * this.queryInfo.price
          let num = (Math.round(num1 * 100) - Math.round(num2 * 100)) / 100
          return num > 0 ? num.toFixed(2) : 0
        } else {
          return 0
        }
      },
      dealNum() {
        let res = (this.queryInfo.tonnes * this.queryInfo.price).toFixed(2)
        return Math.round(res * 100) / 100
      },
      backEvent: function () {
        eventBus.$emit('oilSaleHomeData')
        this.$router.go(-2)
      },
      cacelAppointmentBill() {
        // 取消约单按钮
        this.$dialog.confirm({message: '确定取消当前约单吗？'}).then(() => {
          this.$request.post('/app/json/app_oil_sale/cancelReserveOrder', {
            id: this.queryInfo.id, // 约单id
            vipUnitUserCode: this.vipUnitUser.vipUnitUserId // 单位用户id
          }).then(res => {
            if (res.status === 0) {
              this.$dialog.alert({message: '取消成功'}).then(() => {
                this.$router.go(-2)
              })
            } else {
              this.$Toast(res.info ? res.info : '约单取消失败')
            }
          })
        })
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

  .cancel-btn {
    padding: 11px 15px

    .btn {
      border-radius 20px
      padding: 15px 0
      width: 100%
      color: #fff
      background: #009df8
      text-align center
      font-size: 14px
      font-weight bold
    }
  }
</style>

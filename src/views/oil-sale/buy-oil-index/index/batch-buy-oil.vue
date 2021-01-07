<template>
  <div class="oil-sale-container">
    <nav-top title="批量购油" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="bill-details-container">
      <div class="buy-bill">
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="bill-item">
                <div class="img-wrapper">
                  <img class="img" src="../../assets/image/bill.png" alt="">
                </div>
                <div class="center-text">
                  <div class="title">{{batchBuyOilItem.matertialName}}</div>
                  <div class="tips info">
                    ￥<span class="now-price">{{batchBuyOilItem.price}}元</span>/t
                  </div>
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
                    <input
                      type="number"
                      @input="input"
                      @keyup="keyup"
                      placeholder="请输入购油量(t)"
                      v-model="oilNum">
                  </div>
                </li>
                <li class="details-item">
                  <div class="left">配送方式</div>
                  <div class="right">
                    <div class="switch-bar">
                      <div class="switch-bar-item" @click="switchHandler(item.type)"
                           :class="[item.type === switchBarType ? 'theme_bg_blue theme_font_white active': '']"
                           v-for="item in switchBar">{{item.name}}
                      </div>
                    </div>
                  </div>
                </li>
                <Address v-if="switchBarType == 2" :receiver="receiver" @info="info"></Address>
                <li class="details-item" @click="openOilWarehouse" v-if="switchBarType == 1">
                  <div class="left">自提油库</div>
                  <div class="right">
                    <input type="text" disabled placeholder="选择油库" v-model="oilLibrary">
                  </div>
                  <!--      油库选择弹框-->
                  <TipsPopup @getOilInfo="getOilInfo" ref="mychild" :isOpenPopup="isOpenPopup"></TipsPopup>
                </li>
                <li class="details-item" v-if="switchBarType == 1">
                  <div class="left">提货人</div>
                  <div class="right">
                    <input type="text" placeholder="请输入提货人" v-model="people">
                  </div>
                </li>
                <li class="details-item" v-if="switchBarType == 1">
                  <div class="left">提货人手机号</div>
                  <div class="right">
                    <input
                      maxlength="11"
                      type="tel"
                      onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                      placeholder="请输入提货人手机号"
                      v-model="phone">
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
      <div class="now-buy-bill-btn" @click="nowBuyBill">
        <div class="btn">立即下单</div>
      </div>
      <!--      立即撞单提示内容-->
      <van-popup v-model="showTips" :close-on-click-overlay="overlay">
        <div class="tips-content">
          <div class="title">温馨提示</div>
          <div class="content">
            您正在购买油品名称为{{batchBuyOilItem.matertialName}}的油品，购油数量为{{oilNum}}t，共需支付{{batchBuyOilItem.price * oilNum}}元
          </div>
          <div class="btn-group">
            <div class="btn" @click="showTips = false">再想想</div>
            <div class="btn" @click="queryBuyBill">确定下单</div>
          </div>
        </div>
      </van-popup>
    </nav-content>
  </div>
</template>

<script>
  import {Dialog} from 'vant'
  import TipsPopup from '../../components/tips-popup'
  import {mapGetters} from 'vuex'
  import Address from '../../components/address'

  export default {
    data() {
      return {
        receiver: {},
        addressInfo: {},
        switchBarType: 1,
        switchBar: [{name: '配送', type: 2}, {name: '自提', type: 1}],
        showTips: false, // 立即撞单提示内容
        overlay: false, // 蒙版
        oilNum: '', // 购油量
        oilLibrary: '', // 油库
        people: '', // 提货人
        isOpenPopup: true, // 只有在详情中的油库才能打开弹框
        phone: '', // 联系方式
        oilInfo: '', // 所选油库信息
        batchBuyOilItem: '' // 详情
      }
    },
    computed: {},
    mounted() {
      this.batchBuyOilItem = JSON.parse(this.$route.query.batchBuyOilItem)
    },
    methods: {
      switchHandler(type) {
        this.switchBarType = type
        if (this.switchBarType == 2) {

        } else {

        }
      },
      info(val) {
        this.addressInfo = val
      },
      dealNum() {
        let res = (this.batchBuyOilItem.price * this.oilNum).toFixed(2)
        return Math.round(res * 100) / 100
      },
      calculatePrice() {
        let num1 = this.batchBuyOilItem.basePrice * this.oilNum
        let num2 = this.batchBuyOilItem.price * this.oilNum
        let num = (Math.round(num1 * 100) - Math.round(num2 * 100)) / 100
        return num > 0 ? num.toFixed(2) : 0
      },
      nowBuyBill() {
        let newPhone = this.phone
        newPhone = newPhone.replace(/\s*/g, "")
        let myreg = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/
        if (this.oilNum == '' || this.oilNum <= 0) {
          this.$Toast('请输入正确购油量')
        } else if (this.switchBarType == 2) {
          if (Object.keys(this.receiver).length == 0 || this.receiver.receiverName == '') {
            this.$Toast('请输入收货人姓名')
          } else if (this.receiver.mobile == '') {
            this.$Toast('请输入收货人手机号')
          } else if (!myreg.test(this.receiver.mobile)) {
            this.$Toast('请输入请输入有效收货人手机号')
            this.receiver.mobile = ''
          } else if (!this.receiver.regionText) {
            this.$Toast('请选择区域')
          } else if (!this.receiver.address) {
            this.$Toast('请输入详细地址')
          } else {
            this.showTips = true
          }
        } else if (this.switchBarType == 1) {
          if (this.oilLibrary == '') {
            this.$Toast('请选择自提油库')
          } else if (this.people == '') {
            this.$Toast('请输入提货人')
          } else if (this.phone == '') {
            this.$Toast('请输入联系方式')
          } else if (!myreg.test(newPhone)) {
            this.phone = ''
            this.$Toast('请输入有效手机号！')
          } else {
            this.showTips = true
          }
        }
      },
      getOilInfo(data) {
        this.oilInfo = data
        this.oilLibrary = data.text
      },
      openOilWarehouse() {
        // 获取油库
        this.$refs.mychild.queryPickUpDepot()
      },
      queryBuyBill() {
        // 立即下单
        this.showTips = false
        let paramData = {}
        if (this.switchBarType == 1) { // 1自提 2配送
          paramData = {
            deliveryType: this.switchBarType, // 配送方式 1自提 2配送
            tonnes: this.oilNum, // 购油量
            skuId: this.batchBuyOilItem.skuId, // 油品skuId
            pickUpOilDepot: this.oilInfo.code, // 自提油库编码
            pickUpOilDepotName: this.oilInfo.text, // 自提油库名称
            activityId: this.batchBuyOilItem.activityId, // 活动Id
            activityDetailId: this.batchBuyOilItem.id, // 活动明细Id
            price: this.batchBuyOilItem.costPrice, // 油品单价
            consignee: this.people, // 提货人
            consigneePhone: this.phone, // 联系方式
            vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
          }
        } else {
          paramData = {
            deliveryType: this.switchBarType, // 配送方式 1自提 2配送
            tonnes: this.oilNum, // 购油量
            consignee: this.receiver.receiverName, // 提货人
            consigneePhone: this.receiver.mobile, // 联系方式
            price: this.batchBuyOilItem.costPrice, // 油品单价
            skuId: this.batchBuyOilItem.skuId, // 油品skuId
            activityId: this.batchBuyOilItem.activityId, // 活动Id
            activityDetailId: this.batchBuyOilItem.id, // 活动明细Id
            vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
            addressInfo: {
              address: this.receiver.address,
              regionText: this.receiver.regionText,
              mobile: this.receiver.mobile,
              receiverName: this.receiver.receiverName,
              cityId: this.addressInfo.cityId,
              cityName: this.addressInfo.cityName,
              countryId: this.addressInfo.countryId,
              countryName: this.addressInfo.countryName,
              provinceId: this.addressInfo.provinceId,
              provinceName: this.addressInfo.provinceName,
              townId: this.addressInfo.townId,
              townName: this.addressInfo.townName
            }
          }
        }
        this.$request.post('/app/json/app_oil_sale/submitOilSaleOrder', paramData).then(res => {
          if (res.status === 0) {
            this.$router.push({path: '/buy-oil-results', query: {queryItem: JSON.stringify(res.data)}})
          } else {
            this.$Toast(res.info ? res.info : '下单失败')
          }
        })
      },
      input() {
        this.oilNum = this.oilNum.replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        if ((this.oilNum.substring(0, 1) === '0' && this.oilNum.substring(1, 2) != '.') || this.oilNum.substring(0, 1) === '.') {
          this.$Toast('请输入正确购油量')
          this.oilNum = ''
        }
      },
      keyup() {
        this.oilNum = this.oilNum.replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      }
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
    components: {
      [Dialog.name]: Dialog,
      TipsPopup,
      Address
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/oil-sale-base.styl"
  .remaining {
    font-size: 12px
    color: #1a1a1a
  }
</style>

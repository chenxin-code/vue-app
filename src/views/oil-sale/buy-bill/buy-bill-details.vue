<template>
  <div class="oil-sale-container">
    <nav-top title="撞单详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="bill-details-container">
      <div class="bill-content">
        <div class="buy-bill">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="bill-item">
                  <div class="img-wrapper">
                    <img class="img" src="../assets/image/bill.png" alt="">
                  </div>
                  <div class="center-text">
                    <div class="title">{{buyItem.matertialName}}</div>
                    <div class="time">活动结束时间:{{buyItem.endDate}}</div>
                    <div class="tips">撞单吨数范围：{{buyItem.tonnesLowerLimit}}t-{{buyItem.tonnesUpperLimit}}t</div>
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
                        @blur="blurOilNum"
                        @input="input"
                        @keyup="keyup"
                        placeholder="请输入购油量(t)"
                        v-model="oilNum">
                    </div>
                  </li>
                  <li class="details-item">
                    <div class="left">撞单油品单价</div>
                    <div class="right">
                      <input
                        type="number"
                        @input="inputPrice"
                        @keyup="keyupPrice"
                        placeholder="请输入撞单油品单价"
                        v-model="price">
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
                        pattern="[0-9]*"
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
        <div class="now-buy-bill-btn" @click="nowBuyBill">
          <div class="btn">立即撞单</div>
        </div>
        <!--      立即撞单提示内容-->
        <van-popup v-model="showTips" :close-on-click-overlay="overlay">
          <div class="tips-content">
            <div class="title">温馨提示</div>
            <div class="content">撞单成功之后，需要在24小时之内，去油库完成支付并提货，否则将会被认定为黑名单</div>
            <div class="btn-group">
              <div class="btn" @click="showTips = false">再想想</div>
              <div class="btn" @click="queryBuyBill">确定撞单</div>
            </div>
          </div>
        </van-popup>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {Dialog} from 'vant'
  import TipsPopup from '../components/tips-popup'
  import {mapGetters} from 'vuex'
  import Address from '../components/address'
  import util from "@/utils/util"

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
        price: '', // 单价
        oilLibrary: '', // 油库
        people: '', // 提货人
        isOpenPopup: true, // 只有在详情中的油库才能打开弹框
        buyItem: '', // 详情
        oilInfo: '', // 所选油库信息
        phone: '' // 联系方式
      }
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
    mounted() {
      this.buyItem = JSON.parse(this.$route.query.buyItem)
      console.log(this.buyItem)
    },
    methods: {
      switchHandler(type) {
        this.switchBarType = type
      },
      info(val) {
        this.addressInfo = val
      },
      dealNum() {
        let res = (this.oilNum * this.price).toFixed(2)
        return (Math.round(res * 100) / 100).toFixed(2)
      },
      calculatePrice() {
        if (this.buyItem.basePrice > this.price) {
          let num1 = this.buyItem.basePrice * this.oilNum
          let num2 = this.oilNum * this.price
          let num = (Math.round(num1 * 100) - Math.round(num2 * 100)) / 100
          return num ? num : 0
        } else {
          return 0
        }
      },
      nowBuyBill() {
        let newPhone = this.phone
        newPhone = newPhone.replace(/\s*/g, "")
        let myreg = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/
        if (this.oilNum == '' || this.oilNum <= 0) {
          this.$Toast('请输入正确购油量')
        } else if (this.price == '') {
          this.$Toast('请输入单价')
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
      blurOilNum() {
        // 撞单吨数范围限制
        if (this.oilNum < this.buyItem.tonnesLowerLimit || this.oilNum > this.buyItem.tonnesUpperLimit) {
          this.$Toast('请在撞单的吨数范围内填写！')
          this.oilNum = ''
        }
      },
      input() {
        this.oilNum = this.oilNum.replace(/\.{2,}/g, ".").replace(".","$#$").replace(/\./g,"").replace("$#$",".").replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
        if ((this.oilNum.substring(0, 1) === '0' && this.oilNum.substring(1, 2) != '.')  || this.oilNum.substring(0, 1) === '.') {
          this.$Toast('请输入正确购油量')
          this.oilNum = ''
        }
      },
      inputPrice() {
        this.price = this.price.replace(/\.{2,}/g, ".").replace(".","$#$").replace(/\./g,"").replace("$#$",".").replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
        if ((this.price.substring(0, 1) === '0' && this.price.substring(1, 2) != '.')  || this.price.substring(0, 1) === '.') {
          this.$Toast('请输入正确价格')
          this.price = ''
        }
      },
      keyupPrice() {
        this.price = this.price.replace(/\.{2,}/g, ".").replace(".","$#$").replace(/\./g,"").replace("$#$",".").replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
      },
      keyup() {
        this.oilNum = this.oilNum.replace(/\.{2,}/g, ".").replace(".","$#$").replace(/\./g,"").replace("$#$",".").replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
      },
      queryBuyBill() {
        // 提交撞单
        this.showTips = false
        let paramData = {}
        if (this.switchBarType == 1) { // 1自提 2配送
          paramData = {
            deliveryType: this.switchBarType, // 配送方式 1自提 2配送
            tonnes: this.oilNum, // 购油量
            skuId: this.buyItem.skuId, // 油品skuId
            pickUpOilDepot: this.oilInfo.code, // 自提油库编码
            pickUpOilDepotName: this.oilInfo.text, // 自提油库名称
            activityId: this.buyItem.activityId, // 活动Id
            activityDetailId: this.buyItem.id, // 活动明细Id
            price: this.price, // 油品单价
            consignee: this.people, // 提货人
            vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
            consigneePhone: this.phone, // 联系方式
          }
        } else {
          paramData = {
            deliveryType: this.switchBarType, // 配送方式 1自提 2配送
            consignee: this.receiver.receiverName, // 提货人
            consigneePhone: this.receiver.mobile, // 联系方式
            activityDetailId: this.buyItem.id, // 活动明细Id
            skuId: this.buyItem.skuId, // 油品skuId
            activityId: this.buyItem.activityId, // 活动Id
            vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
            tonnes: this.oilNum, // 购油量
            price: this.price, // 油品单价
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
        this.$request.post('/app/json/app_oil_sale/submitHitOilSaleActivityOrder', paramData).then(res => {
          if (res.status === 0) {
            this.$router.push({
              path: '/buy-bill-results',
              query: {queryInfo: JSON.stringify(res.data), source: this.$route.query.source}
            })
          } else {
            this.$Toast(res.info ? res.info : '撞单失败')
          }
        })
      }
    },
    components: {
      [Dialog.name]: Dialog,
      TipsPopup,
      Address
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../assets/stylus/oil-sale-base.styl"
</style>

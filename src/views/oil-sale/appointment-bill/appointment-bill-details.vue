<template>
  <div class="oil-sale-container">
    <nav-top title="约单详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="bill-details-container">
      <div class="bill-content">
        <div class="tips-appointment" v-if="appointmentItem.state == 2">您有约单订单处理待确定状态，订单审批通过后才能再次进行约单。</div>
        <div class="buy-bill">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="bill-item">
                  <div class="img-wrapper">
                    <img class="img" src="../assets/image/bill.png" alt="">
                  </div>
                  <div class="center-text">
                    <div class="title">{{appointmentItem.matertialName}}</div>
                    <div class="time" v-if="appointmentItem.state == 2">约单时间：{{appointmentItem.submitTime}}</div>
                    <div class="time" v-else>活动结束时间:{{appointmentItem.endDate}}</div>
                    <div class="tips" v-if="appointmentItem.state == 2">约单单价：{{appointmentItem.price}}</div>
                    <div class="tips" v-else>
                      约单吨数范围：{{appointmentItem.tonnesLowerLimit}}t~{{appointmentItem.tonnesUpperLimit}}t
                    </div>
                  </div>
                  <div class="bill-btn" v-if="appointmentItem.state == 2" @click="cacelAppointmentBill">
                    <div class="appointment-circle">约单中</div>
                    <div class="btn-show">取消约单</div>
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
                        :disabled="disabled"
                        @blur="blurOilNum"
                        @input="input"
                        @keyup="keyup"
                        placeholder="请输入购油量(t)"
                        v-model="oilNum">
                    </div>
                  </li>
                  <li class="details-item">
                    <div class="left">约单油品单价</div>
                    <div class="right">
                      <input
                        type="number"
                        :disabled="disabled"
                        @input="inputPrice"
                        @keyup="keyupPrice"
                        placeholder="请输入约单油品单价"
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
                      <input type="text" :disabled="disabled" placeholder="请输入提货人" v-model="people">
                    </div>
                  </li>
                  <li class="details-item" v-if="switchBarType == 1">
                    <div class="left">提货人手机号</div>
                    <div class="right">
                      <input
                        maxlength="11"
                        type="tel"
                        pattern="[0-9]*"
                        :disabled="disabled"
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
          <div class="btn" :class="{'active': appointmentItem.state == 2}">立即约单</div>
        </div>
        <!--      立即撞单提示内容-->
        <van-popup v-model="showTips" :close-on-click-overlay="overlay">
          <div class="tips-content">
            <div class="title">温馨提示</div>
            <div class="content">确认约单{{oilNum}}t{{appointmentItem.matertialName}}，约单价为{{price}}元的订单吗</div>
            <div class="btn-group">
              <div class="btn" @click="showTips = false">再想想</div>
              <div class="btn" @click="queryAppointmentBill">确定约单</div>
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
        appointmentItem: '', // 详情
        activityRecord: '', // 根据约单id  查询的详情
        oilInfo: '', // 所选油库信息
        phone: '', // 联系方式
        disabled: false // 表单是否可编辑
      }
    },
    mounted() {
      this.appointmentItem = JSON.parse(this.$route.query.appointmentItem)
      console.log(this.appointmentItem)
      if (this.appointmentItem.state == 2) {
        this.loadOilSaleActivityRecord()
        this.disabled = true // 表单不可编辑
        this.isOpenPopup = false // 约单中的时候 油库不可选择
      }
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
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
      calculatePrice() {
        if (this.appointmentItem.basePrice) {
          let num1 = this.appointmentItem.basePrice * this.oilNum
          let num2 = this.oilNum * this.price
          let num = (Math.round(num1 * 100) - Math.round(num2 * 100)) / 100
          return num > 0 ? num.toFixed(2) : 0
        } else {
          return 0
        }
      },
      dealNum() {
        let res = (this.oilNum * this.price).toFixed(2)
        return (Math.round(res * 100) / 100).toFixed(2)
      },
      loadOilSaleActivityRecord() {
        // 加载直分销活动订单详情 根据约单id  查询详情
        this.$request.post('/app/json/app_oil_sale/loadOilSaleActivityRecord', {
          id: this.appointmentItem.recordId, // 约单id
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId // 单位用户id
        }).then(res => {
          if (res.status === 0) {
            this.activityRecord = res.data
            this.oilNum = this.activityRecord.tonnes // 购油量
            this.oilLibrary = this.activityRecord.pickUpOilDepotName // 油库
            this.people = this.activityRecord.consignee // 提货人
            this.price = this.activityRecord.price // 油品单价
            this.phone = this.activityRecord.consigneePhone // 提货人
          } else {
            this.$Toast(res.info ? res.info : '获取详情失败')
          }
        })
      },
      cacelAppointmentBill() {
        // 取消约单按钮
        this.$dialog.confirm({message: '确定取消当前约单吗？'}).then(() => {
          this.$request.post('/app/json/app_oil_sale/cancelReserveOrder', {
            id: this.appointmentItem.recordId, // 约单id
            vipUnitUserCode: this.vipUnitUser.vipUnitUserId // 单位用户id
          }).then(res => {
            if (res.status === 0) {
              this.$dialog.alert({message: '取消成功'}).then(() => {
                this.$router.go(-1)
              })
            } else {
              this.$Toast(res.info ? res.info : '约单取消失败')
            }
          })
        })
      },
      nowBuyBill() {
        if (this.appointmentItem.state != 2) {
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
        } else {
          this.showTips = false
          this.isOpenPopup = false
        }
      },
      openOilWarehouse() {
        // 获取油库
        if (this.appointmentItem.state != 2) {
          this.$refs.mychild.queryPickUpDepot()
        }
      },
      blurOilNum() {
        // 约单吨数范围限制
        if (this.oilNum < this.appointmentItem.tonnesLowerLimit || this.oilNum > this.appointmentItem.tonnesUpperLimit) {
          this.oilNum = ''
          this.$Toast('请在约单的吨数范围内填写！')
        }
      },
      input() {
        this.oilNum = this.oilNum.replace(/\.{2,}/g, ".").replace(".","$#$").replace(/\./g,"").replace("$#$",".").replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
        if ((this.oilNum.substring(0, 1) === '0' && this.oilNum.substring(1, 2) != '.')  || this.oilNum.substring(0, 1) === '.') {
          this.$Toast('请输入正确购油量')
          this.oilNum = ''
        }
      },
      keyup() {
        this.oilNum = this.oilNum.replace(/\.{2,}/g, ".").replace(".","$#$").replace(/\./g,"").replace("$#$",".").replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
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
      getOilInfo(data) {

        this.oilInfo = data
        this.oilLibrary = data.text
      },
      queryAppointmentBill() {
        // 确定约单
        this.showTips = false
        let paramData = {}
        if (this.switchBarType == 1) { // 1自提 2配送
          paramData = {
            deliveryType: this.switchBarType, // 配送方式 1自提 2配送
            tonnes: this.oilNum, // 购油量
            skuId: this.appointmentItem.skuId, // 油品skuId
            pickUpOilDepot: this.oilInfo.code, // 自提油库编码
            pickUpOilDepotName: this.oilInfo.text, // 自提油库名称
            activityId: this.appointmentItem.activityId, // 活动Id
            activityDetailId: this.appointmentItem.id, // 活动明细Id
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
            activityDetailId: this.appointmentItem.id, // 活动明细Id
            skuId: this.appointmentItem.skuId, // 油品skuId
            activityId: this.appointmentItem.activityId, // 活动Id
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
        this.$request.post('/app/json/app_oil_sale/submitReserveOilSaleActivityOrder', paramData).then(res => {
          if (res.status === 0) {
            this.$router.push({path: '/appointment-bill-results',
              query: {queryInfo: JSON.stringify(res.data)}})
          } else {
            this.$Toast(res.info ? res.info : '约单失败')
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
  .tips-appointment {
    padding: 11px
    background: #f4ecd8
    color: #ffc615
    margin: 5px 0 10px 0
    border-radius 4px
  }

  .now-buy-bill-btn {
    .active {
      background: $color-background-l !important
    }
  }

  .bill-btn {
    display flex
    justify-content center
    align-items center
    flex-direction column

    .appointment-circle {
      width: 40px
      height: 40px
      border-radius 50%
      background $color-background-l
      display flex
      align-items center
      justify-content center
      color: #fff
      margin-bottom: 3px
    }
  }
  .details-item {
    position relative
  }
</style>

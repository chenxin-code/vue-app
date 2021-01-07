<template>
  <div class="oil-sale-container">
    <nav-top title="抢单详情" @backEvent="$router.go(-1)"></nav-top>
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
                    <div class="title">{{grabItem.matertialName}}</div>
                    <div class="time">活动结束时间:{{grabItem.endDate}}</div>
                    <div class="tips info" v-if="priceList.length == 0">
                      ￥<span class="now-price">{{grabItem.discountPrice ? grabItem.discountPrice : 0}}</span>/t
                      <span class="default-num">￥{{grabItem.basePrice ? grabItem.basePrice : 0}}</span>
                    </div>
                    <div class="tips info" v-else>
                      ￥<span class="now-price">{{priceList[0].discountPrice}}</span>/t
                      <span class="default-num">￥{{grabItem.basePrice ? grabItem.basePrice : 0}}</span>
                    </div>
                  </div>
                  <div class="bill-btn">
                    <div class="record-btn-show">
                      <div class="record-img">
                        <div class="tips">剩{{grabItem.remainTonnes || grabItem.remainTonnes == 0 ? grabItem.remainTonnes : grabItem.totalTonnes}}t</div>
                        <van-progress v-if="grabItem.remainTonnes == 0 || grabItem.totalTonnes == 0" :percentage="100"
                                      :show-pivot="showPivot"/>
                        <van-progress v-else :percentage="calculateProgress(grabItem.remainTonnes, grabItem.totalTonnes)"
                                      :show-pivot="showPivot"/>
                      </div>
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
                        @blur="blur"
                        @keyup="keyup"
                        placeholder="请输入购油量(t)"
                        v-model="oilNum">
                      <div class="oilNum-tips" v-if="showOilNumTips">再买{{nowNum}}t，即可享受单价{{priceList[1].discountPrice}}元<van-icon @click="showPriceTips = true" name="info-o" /></div>
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
        <div class="now-buy-bill-btn" @click="nowGrabBill">
          <div class="btn">立即抢单</div>
        </div>
        <!--      立即撞单提示内容-->
        <van-popup v-model="showTips" :close-on-click-overlay="overlay">
          <div class="tips-content">
            <div class="title">温馨提示</div>
            <div class="content">当前可参与次数{{grabItem.limitCnt}}，已参与次数{{grabItem.attendCnt || 0}}，是否确认下单？</div>
            <div class="btn-group">
              <div class="btn" @click="showTips = false">再想想</div>
              <div class="btn" @click="queryGrabBill">确定抢单</div>
            </div>
          </div>
        </van-popup>
        <van-dialog v-model="showPriceTips" title="优惠规则">
          <div class="price-content">
            <span v-for="(item, index) in priceList" :key="index">优惠规则购买数量达到{{item.tonnesLowerLimit}}时，单价为{{item.discountPrice}},</span>
          </div>
        </van-dialog>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import {Dialog, Progress} from 'vant'
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
        oilLibrary: '', // 油库
        people: '', // 提货人
        isOpenPopup: true, // 只有在详情中的油库才能打开弹框
        phone: '', // 联系方式
        showPivot: false, // 进度条文字
        grabItem: '', // 详情
        oilInfo: '', // 所选油库信息
        priceList: [], // 阶梯价格
        showOilNumTips: false,
        showPriceTips: false, // 阶梯价格提示
        nowNum: '' // 再买多少吨
      }
    },
    mounted() {
      this.phone = this.$store.state.login.phone
      this.people = this.$store.state.userInfo.nickName
      this.grabItem = JSON.parse(this.$route.query.grabItem)
      this.oilNum = this.grabItem.detailList[0].tonnesLowerLimit
      console.log(this.grabItem)
      this.queryPickUpDepot()
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
    methods: {
      queryPickUpDepot() {
        // 获取自提油库
        this.$request.post('/app/json/app_oil_sale/queryPickUpDepot', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
        }).then(res => {
          if (res.status === 0) {
            let arr = res.data
            let columns = []
            arr.map(item => {
              columns.push({text: item.name, code: item.code})
              return columns
            })
            this.columns = columns
            this.oilInfo = this.columns[0]
            console.log(this.oilInfo)
            this.oilLibrary = this.columns[0].text
          } else {
            this.$Toast(res.info ? res.info : '获取自提油库失败')
          }
        })
      },
      switchHandler(type) {
        this.switchBarType = type
      },
      info(val) {
        this.addressInfo = val
      },
      calculateProgress(remainTonnes, totalTonnes) {
        if (remainTonnes && totalTonnes) {
          let calculateResult = 100 - ((remainTonnes / totalTonnes) * 100)
          return parseInt(calculateResult)
        } else {
          return 0
        }
      },
      dealNum() {
        /**
         * 油品总金额： 原价*数量
         * 实际需要支付：现价*数量 （油品总金额-优惠价）
         * 优惠价：活动总金额-实际需要支付 (原价*数量-现价*数量)
         */
        if (this.priceList.length) {
          let res = (this.priceList[0].basePrice * this.oilNum).toFixed(2)
          return (Math.round(res * 100) / 100).toFixed(2)
        } else if (this.grabItem) {
          let res = (this.grabItem.detailList[0].basePrice * this.oilNum).toFixed(2)
          return (Math.round(res * 100) / 100).toFixed(2)
        }
      },
      calculatePrice() {
        if (this.priceList.length) {
          if (this.grabItem.basePrice > this.priceList[0].discountPrice) {
            let num1 = this.grabItem.basePrice * this.oilNum
            let num2 = this.priceList[0].discountPrice * this.oilNum
            let num = (Math.round(num1 * 100) - Math.round(num2 * 100)) / 100
            return num > 0 ? num.toFixed(2) : 0
          } else {
            return 0
          }
        } else if (this.grabItem) {
          if (this.grabItem.basePrice > this.grabItem.detailList[0].discountPrice) {
            let num1 = this.grabItem.basePrice * this.oilNum
            let num2 = this.grabItem.detailList[0].discountPrice * this.oilNum
            let num = (Math.round(num1 * 100) - Math.round(num2 * 100)) / 100
            return num > 0 ? num.toFixed(2) : 0
          } else {
            return 0
          }
        }
      },
      nowGrabBill() {
        let newPhone = this.phone
        newPhone = newPhone.replace(/\s*/g, "")
        let myreg = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/
        if (this.switchBarType == 2) {
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
            /**
             *  limitCnt限制参与次数(0或者空表示不限制) attendCnt已参与次数
             */
            if (this.grabItem.limitCnt) {
              this.showTips = true
            } else {
              this.queryGrabBill()
            }
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
            if (this.grabItem.limitCnt) {
              this.showTips = true
            } else {
              this.queryGrabBill()
            }
          }
        }
      },
      getOilInfo(data) {
        this.oilInfo = data
        this.oilLibrary = data.text
      },
      input() {
        // 上下限的控制
        this.oilNum = this.oilNum.replace(/\.{2,}/g, ".").replace(".","$#$").replace(/\./g,"").replace("$#$",".").replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
        if ((this.oilNum.substring(0, 1) === '0' && this.oilNum.substring(1, 2) != '.')  || this.oilNum.substring(0, 1) === '.') {
          this.$Toast('请输入正确购油量')
          this.oilNum = ''
        }
        this.dealPrice(this.grabItem.detailList, this.oilNum)
        console.log(this.priceList.length)
        if (this.priceList.length > 1) {
          this.nowNum = this.dealNumber(this.priceList[1].tonnesLowerLimit, this.oilNum)
          this.showOilNumTips = true
        } else {
          this.showOilNumTips = false
        }
      },
      blur() {
        if (this.oilNum < this.grabItem.detailList[0].tonnesLowerLimit) {
          this.$Toast(`该活动最低购油量是${this.grabItem.detailList[0].tonnesLowerLimit}`)
          this.oilNum = this.grabItem.detailList[0].tonnesLowerLimit
        }
      },
      dealPrice(arr, num) {
        let arry1 = [].concat(arr).sort((a, b) => a.tonnesLowerLimit - b.tonnesLowerLimit)
        let result = []
        for (let i = 0; i < arry1.length - 1; i++) {
          const item = arry1[i]
          const item2 = arry1[i + 1]
          if (item.tonnesLowerLimit <= num && num < item2.tonnesLowerLimit) {
            result.push(item)
            result.push(item2)
            break
          } else if (i === (arry1.length - 2) && num >= item2.tonnesLowerLimit) {
            result.push(item2)
            break
          }
        }
        this.priceList = result
        console.log(result)
      },
      dealNumber(a, b) {
        let num = ((a * 100) - (b * 100)) / 100
        return num.toFixed(2)
      },
      keyup() {
        this.oilNum = this.oilNum.replace(/\.{2,}/g, ".").replace(".","$#$").replace(/\./g,"").replace("$#$",".").replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
      },
      openOilWarehouse() {
        // 获取油库
        this.$refs.mychild.queryPickUpDepot()
      },
      queryGrabBill() {
        // 提交抢单
        this.showTips = false
        let paramData = {}
        let activityDetailId = ''
        let price = ''
        // if (this.priceList.length > 1) {
        if (this.priceList.length) {
          activityDetailId = this.priceList[0].id
          price = this.priceList[0].discountPrice
        } else {
          activityDetailId = this.grabItem.detailList[0].id
          price = this.grabItem.detailList[0].discountPrice
        }
        if (this.switchBarType == 1) { // 1自提 2配送
          paramData = {
            deliveryType: this.switchBarType, // 配送方式 1自提 2配送
            skuId: this.grabItem.skuId, // 油品skuId
            pickUpOilDepot: this.oilInfo.code, // 自提油库编码
            pickUpOilDepotName: this.oilInfo.text, // 自提油库名称
            activityId: this.grabItem.activityId, // 活动Id
            activityDetailId: activityDetailId, // 活动明细Id
            price: price, // 油品单价
            consignee: this.people, // 提货人
            vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
            consigneePhone: this.phone, // 联系方式
            tonnes: this.oilNum, // 购油量
          }
        } else {
          paramData = {
            deliveryType: this.switchBarType, // 配送方式 1自提 2配送
            price: price, // 油品单价
            consignee: this.receiver.receiverName, // 提货人
            consigneePhone: this.receiver.mobile, // 联系方式
            activityDetailId: activityDetailId, // 活动明细Id
            skuId: this.grabItem.skuId, // 油品skuId
            activityId: this.grabItem.activityId, // 活动Id
            vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
            tonnes: this.oilNum, // 购油量
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
        this.$request.post('/app/json/app_oil_sale/submitGrabOilSaleActivityOrder', paramData).then(res => {
          if (res.status === 0) {
            this.$router.push({
              path: '/grab-bill-results',
              query: {queryItem: JSON.stringify(res.data), source: this.$route.query.source}
            })
          } else {
            this.$Toast(res.info ? res.info : '抢单失败')
          }
        })
      }
    },
    components: {
      [Dialog.name]: Dialog,
      [Progress.name]: Progress,
      TipsPopup,
      Address
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../assets/stylus/oil-sale-base.styl"
  .oilNum-tips {
    color: $color-theme-r
    display flex
    justify-content left
    align-items center
    /deep/ .van-icon {
      margin-left: 5px
      color: $color-text-l
    }
  }
  .price-content {
    padding: 20px 25px
    line-height 24px
    text-indent: 25px
  }
</style>

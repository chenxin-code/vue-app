<template>
  <div class="oil-sale-container">
    <nav-top title="预约提油" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="bill-details-container">
      <div class="buy-bill">
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <ul class="details-list">
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
                <li class="details-item" @click="openOilNameNum">
                  <div class="left">油品名称</div>
                  <div class="right">
                    <input type="text" disabled placeholder="请选择自提油品" v-model="oilName">
                  </div>
                  <!--      油品选择弹框-->
                  <TipsPopup @getOilNameNum="getOilNameNum" ref="mychildOilName" :title="titleOil"
                             :isOpenPopup="isOpenPopup"></TipsPopup>
                </li>
                <li class="details-item" @click="openOilCardNum">
                  <div class="left">{{$store.state.globalConfig.oilExtractionCertificate == 2 ? '提油卡号' : '身份证号'}}</div>
                  <div class="right">
                    <input type="text" disabled
                           :placeholder="$store.state.globalConfig.oilExtractionCertificate == 2 ? '请选择提油卡号' : '请选择身份证号'"
                           v-model="oilCard">
                  </div>
                  <!--      提油卡选择弹框-->
                  <TipsPopup @getOilCard="getOilCard" ref="mychildCardNum" :title="titleCard"
                             :isOpenPopup="isOpenPopup"></TipsPopup>
                </li>
                <li class="details-item">
                  <div class="left">提油数量</div>
                  <div class="right">
                    <input type="text" placeholder="请输入提油数(t)" v-model="oilNum">
                  </div>
                </li>
                <!-- 配送 -->
                <li class="details-item" v-if="switchBarType == 2">
                  <div class="left">配送地址</div>
                  <div class="right">
                    <input type="text" class="address" disabled placeholder="请选择配送地址" v-model="tradeAddress">
                  </div>
                  <div class="icon-info" @click="openAddress">
                    <span class="icon">
                        <i class="small"></i>
                        <i class="big"></i>
                        <i class="small"></i>
                      </span>
                  </div>
                </li>
                <!-- 自提 -->
                <li class="details-item" v-if="switchBarType == 1" @click="openOilLibrary">
                  <div class="left">自提油库</div>
                  <div class="right">
                    <input type="text" disabled placeholder="请选择自提油库" v-model="oilLibrary">
                  </div>
                  <!--      自提油库选择弹框-->
                  <TipsPopup @getOilInfo="getOilInfo" ref="mychild" :title="titleDetalis"
                             :isOpenPopup="isOpenPopup"></TipsPopup>
                </li>
                <li class="details-item">
                  <div class="left">收货人</div>
                  <div class="right">
                    <input type="text" placeholder="请输入提货人" v-model="people">
                  </div>
                </li>
                <li class="details-item">
                  <div class="left">联系方式</div>
                  <div class="right">
                    <input
                      maxlength="11"
                      placeholder="请输入联系方式"
                      v-model="phone"
                      type="tel"
                      autosize
                      onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                      pattern="[0-9]*"
                      @input="phone = /^\d+/.exec(phone) ? /^\d+/.exec(phone)[0] : ''">
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="now-buy-bill-btn" @click="nowBuyBill">
        <div class="btn">立即预约</div>
      </div>
      <!--      立即撞单提示内容-->
      <van-popup v-model="showTips" :close-on-click-overlay="overlay">
        <div class="tips-content">
          <div class="title">温馨提示</div>
          <div class="content" v-if="switchBarType == 1">您正在使用卡号为{{oilCard}}的提油卡预约油品配送，预约成功之后将不可取消。</div>
          <div class="content" v-else-if="switchBarType == 2">
            您正在使用卡号为{{oilCard}}的提油卡预约去{{oilLibrary}}提取{{oilName}}{{oilNum}}t，预约成功之后将不可取消。
          </div>
          <div class="btn-group">
            <div class="btn" @click="showTips = false">再想想</div>
            <div class="btn" @click="queryBuyBill">确定预约</div>
          </div>
        </div>
      </van-popup>
<!--      {{$store.state.globalConfig.oilExtractionCertificate}}-->
    </nav-content>
  </div>
</template>

<script>
  import {Dialog} from 'vant'
  import TipsPopup from '../../components/tips-popup'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        switchBarType: 2,
        switchBar: [{name: '配送', type: 2}, {name: '自提', type: 1}],
        titleOil: '选择油品',
        titleCard: '选择油卡',
        titleDetalis: '选择油库',
        titleAddress: '选择配送地址',
        showTips: false, // 立即撞单提示内容
        overlay: false, // 蒙版
        tradeStyle: '', // 配送方式
        oilName: '', // 油品名称
        oilCard: '', // 提油卡号
        oilNum: '', // 提油数量
        tradeAddress: '', // 配送地址
        people: '', // 提货人
        phone: '', // 联系方式
        isOpenPopup: true, // 只有在详情中的油库才能打开弹框
        oilInfo: '', // 所选油库信息
        oilLibrary: '' // 油库
      }
    },
    mounted() {
      this.tradeAddress = this.$store.state.mall2.selectAddress.addressFull
      this.people = this.$store.state.mall2.selectAddress.receiverName
      this.phone = this.$store.state.mall2.selectAddress.mobile
    },
    computed: {},
    methods: {
      nowBuyBill() {
        let myreg = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/
        if (this.oilName == '') {
          this.$Toast('请选择油品名称')
        } else if (this.oilCard == '') {
          this.$Toast('请选择提油卡号')
        } else if (this.oilNum == '') {
          this.$Toast('请输入提油数量')
        } else if (this.switchBarType == 1 && this.oilLibrary == '') {
          this.$Toast('请选择自提油库')
        } else if (this.people == '') {
          this.$Toast('请输入提货人')
        } else if (this.phone == '') {
          this.$Toast('请输入联系方式人')
        } else if (!myreg.test(this.phone) || this.phone.length != 11) {
          this.phone = ''
          this.$Toast('请输入有效的手机号码')
        } else {
          this.showTips = true
        }
      },
      getOilNameNum(data) {// 油品
        this.oilName = data.text
      },
      getOilCard(data) {// 提油卡
        this.oilCard = data.text
      },
      getOilInfo(data) {
        this.oilInfo = data
        this.oilLibrary = data.text
      },
      openAddress() {
        // 选择地址 调到地址页面
        this.$router.push('/mall2/addresslist')
      },
      openOilCardNum() {
        // 获取提油卡号
        this.$refs.mychildCardNum.appQueryTakeOilCardList()
      },
      openOilNameNum() {
        // 获取油品名称
        this.$refs.mychildOilName.appQueryTakeOilNameList()
      },
      openOilLibrary() {
        // 自提油库
        this.$refs.mychild.queryPickUpDepot()
      },
      queryBuyBill() {
        // 确定预约
        this.showTips = false
        let formDataJson = {
          deliveryType: this.switchBarType, // 配送方式
          matertialName: this.oilName, // 油品名称
          oilCardNo: this.oilCard, // 油卡号
          Tonnes: this.oilNum, // 购油吨数
          deliveryAddress: this.tradeAddress, // 配送地址
          pickUpOilDepot: this.oilInfo.code, // 自提油库编码
          pickUpOilDepotName: this.oilInfo.text, // 自提油库名称
          consigneePhone: this.phone,
          Consignee: this.people,
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
        }
        if (this.switchBarType == 1) { // 自提
          let formDataJson = {
            deliveryType: this.switchBarType, // 配送方式
            matertialName: this.oilName, // 油品名称
            oilCardNo: this.oilCard, // 油卡号
            Tonnes: this.oilNum, // 购油吨数
            pickUpOilDepot: this.oilInfo.code, // 自提油库编码
            pickUpOilDepotName: this.oilInfo.text, // 自提油库名称
            consigneePhone: this.phone,
            Consignee: this.people,
            vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
          }
          this.appsubmmitAppoint(formDataJson)
        } else { // 配送
          let formDataJson = {
            deliveryType: this.switchBarType, // 配送方式
            matertialName: this.oilName, // 油品名称
            oilCardNo: this.oilCard, // 油卡号
            Tonnes: this.oilNum, // 购油吨数
            deliveryAddress: this.tradeAddress, // 配送地址
            consigneePhone: this.phone,
            Consignee: this.people,
            vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
          }
          this.appsubmmitAppoint(formDataJson)
        }
      },
      appsubmmitAppoint(formDataJson) {
        this.$request.post('/app/json/app_oil_appoint/appsubmmitAppoint', formDataJson)
          .then(res => {
            if (res.status === 0) {
              let data = res.data
              this.$router.push({path: 'appointment-oil-results', query: {appointmentOilDetails: JSON.stringify(data)}})
            } else {
              this.$Toast(res.info ? res.info : '预约失败')
            }
          }).catch(err => {
          console.log(err);
        })
      },
      switchHandler(type) {
        this.switchBarType = type
        if (this.switchBarType == 2) {
          this.people = this.$store.state.mall2.selectAddress.receiverName
          this.phone = this.$store.state.mall2.selectAddress.mobile
        } else {
          this.people = ''
          this.phone = ''
        }
      },
    },
    components: {
      [Dialog.name]: Dialog,
      TipsPopup
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/oil-sale-base.styl"
  @import "~@/common/stylus/variable.styl"
  .oil-sale-container {
    background-color: #f8f8f8 !important

    .switch-bar {
      background: #e0f5fe;
      border-radius 15px;
      display inline-block
      overflow: hidden

      .switch-bar-item {
        display inline-block
        padding 5px 15px;
        text-align: center
        font-size: 12px;

        &.active {
          border-radius inherit;
        }
      }
    }
  }

  .icon-info {
    .icon {
      display flex
      align-items center

      .small {
        display inline-block
        width: 4px
        height: 4px
        background: #999
        border-radius 50%
      }

      .big {
        display inline-block
        width: 6px
        height: 6px
        background: #666
        border-radius 50%
        margin: 0 3px
      }
    }
  }

  .address {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>

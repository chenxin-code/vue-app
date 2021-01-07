<template>
    <div class="oil-sale-container">
        <nav-top title="收货方式" @backEvent="$router.go(-1)"></nav-top>
        <nav-content class="bill-details-container">
            <div class="bill-content">
                <div class="buy-bill">
                    <div class="table-view">
                        <div class="table-view-cell">
                            <div class="table-view-cell-text">
                                <ul class="details-list">
                                    <li class="details-item">
                                        <div class="left">购油量</div>
                                        <div class="right">
                                            <input type="number" @keyup="keyup" placeholder="购油量(t)" v-model="oilNum">
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
                                            <input maxlength="11" type="tel" pattern="[0-9]*"
                                                onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                                                placeholder="请输入提货人手机号" v-model="phone">
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="table-view-cell" v-if="lastPath != '/limit-order-result'">
                            <div class="table-view-cell-text">
                                <ul class="buy-bill-money-list">
                                    <li class="buy-bill-money-item">
                                        <div class="money">
                                            <div class="left">竞拍单价</div>
                                            <div class="right">
                                                <span class="num">{{oilPrice}}</span>元/吨
                                            </div>
                                        </div>
                                        <div class="money">
                                            <div class="left">油品总金额</div>
                                            <div class="right">
                                                ￥<span class="num">{{(oilNum * oilPrice).toFixed(2)}}</span>
                                            </div>
                                        </div>
                                        <div class="money">
                                            <div class="left">实际需支付</div>
                                            <div class="right special">
                                                ￥<span class="num">{{(oilNum * oilPrice).toFixed(2)}}</span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="now-buy-bill-btn" @click="nowGrabBill">
                    <div class="btn" v-if="lastPath != '/limit-order-result' && lastPath !='/buy-oil-order-list'">确认订单</div>
                    <div class="btn" v-else>确认</div>
                </div>
            </div>
        </nav-content>
    </div>
</template>

<script>
import { Dialog, Progress } from 'vant'
import TipsPopup from '../components/tips-popup'
import { mapGetters } from 'vuex'
import Address from '../components/address'

export default {
    data() {
        return {
            receiver: {},
            addressInfo: {},
            switchBarType: 1,
            switchBar: [{ name: '配送', type: 2 }, { name: '自提', type: 1 }],
            oilNum: '', // 购油量
            oilPrice: '', // 价格
            oilLibrary: '', // 油库
            people: '', // 提货人
            isOpenPopup: true, // 只有在详情中的油库才能打开弹框
            phone: '', // 联系方式
            showPivot: false, // 进度条文字
            oilInfo: '', // 所选油库信息
            biddingData: {}, //
            lastPath: '',
        }
    },
    mounted() {
        console.log(this.$route)
        this.lastPath = this.$route.query.lastPath
        this.phone = this.$store.state.login.phone
        this.people = this.$store.state.userInfo.nickName
        this.biddingData = JSON.parse(this.$route.query.biddingData)
        this.activityData = this.biddingData.oilSaleActivityDetailModel ? this.biddingData.oilSaleActivityDetailModel : this.biddingData
        console.log(this.biddingData)
        this.oilNum = this.biddingData.tonnes || ''
        this.oilPrice = this.biddingData.price || ''
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
                        columns.push({ text: item.name, code: item.code })
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
                    this.queryGrabBill()
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
                    this.queryGrabBill()
                }
            }
        },
        getOilInfo(data) {
            this.oilInfo = data
            this.oilLibrary = data.text
        },
        keyup() {
            this.oilNum = this.oilNum.replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        },
        openOilWarehouse() {
            // 获取油库
            this.$refs.mychild.queryPickUpDepot()
        },
        queryGrabBill() {
            // 提交抢单
            let paramData = {}
            let activityDetailId = ''
            let price = ''
            if (this.switchBarType == 1) { // 1自提 2配送
                paramData = {
                    id: this.biddingData.id,
                    deliveryType: this.switchBarType, // 配送方式 1自提 2配送
                    skuId: this.biddingData.skuId, // 油品skuId
                    pickUpOilDepot: this.oilInfo.code, // 自提油库编码
                    pickUpOilDepotName: this.oilInfo.text, // 自提油库名称
                    activityId: this.biddingData.activityId, // 活动Id
                    activityDetailId: activityDetailId, // 活动明细Id
                    price: price, // 油品单价
                    consignee: this.people, // 提货人
                    vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
                    consigneePhone: this.phone, // 联系方式
                    tonnes: this.oilNum, // 购油量
                }
            } else {
                paramData = {
                    id: this.biddingData.id,
                    deliveryType: this.switchBarType, // 配送方式 1自提 2配送
                    price: price, // 油品单价
                    consignee: this.receiver.receiverName, // 提货人
                    consigneePhone: this.receiver.mobile, // 联系方式
                    activityDetailId: activityDetailId, // 活动明细Id
                    skuId: this.biddingData.skuId, // 油品skuId
                    activityId: this.biddingData.activityId, // 活动Id
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
            if (this.lastPath != '/limit-order-result' && this.lastPath != '/buy-oil-order-list') {
                this.$request.post('/app/json/app_oil_sale/confirmSuccessBidOrder', paramData).then(res => {
                    if (res.status === 0) {
                        this.$router.go(-2)
                    } else {
                        this.$Toast(res.info)
                    }
                })
            } else {
                // paramData.id = this.biddingData.oilSaleOrderId
                this.$request.post('/app/json/app_oil_sale/inputAddressInfo', paramData).then(res => {
                    if (res.status === 0) {
                        this.$router.go(-2)
                    } else {
                        this.$Toast(res.info)
                    }
                })
            }
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
// @import '../assets/stylus/oil-sale-base.styl';
@import '../assets/stylus/oil-sale-base.styl';

.oilNum-tips {
    color: $color-theme-r;
    display: flex;
    justify-content: left;
    align-items: center;

    /deep/ .van-icon {
        margin-left: 5px;
        color: $color-text-l;
    }
}

.price-content {
    padding: 20px 25px;
    line-height: 24px;
    text-indent: 25px;
}
</style>

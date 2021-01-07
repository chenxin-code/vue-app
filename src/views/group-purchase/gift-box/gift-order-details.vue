<template>
    <div class="orderdetail mall2">
        <nav-top title="礼单详情" @backEvent="$router.go(-1)"></nav-top>
        <nav-content
            :class="giftOrderGoodsDetails.receiveState == 1&&giftType == 2 ? 'giftOrder-content' : 'giftOrder-content mb50'"
            v-if="giftOrderGoodsDetails">
            <div class="giftOrder-details">
                <!-- 商品详情 -->
                <div class="goods-info boxShadow">
                    <div class="left">
                        <img :src="giftOrderGoodsDetails.proImgUrl" alt="" width="70" height="70">
                    </div>
                    <div class="right" v-if="giftType == 1">
                        <div class="goods-info-title">{{giftOrderGoodsDetails.proName}}</div>
                        <div class="goods-info-number">
                            <p>剩余<span class="colorred">{{giftOrderGoodsDetails.surplusNum}}</span>份
                                共<span class="colorred">{{giftOrderGoodsDetails.totalNum}}</span>份</p>
                        </div>
                        <div class="dialogBox" v-if="giftOrderGoodsDetails.sendState == 1">
                            有效期
                            <countdown
                                :endTime="giftOrderGoodsDetails.createTime ? $util.getDateFromString($util.getOtherDate(giftOrderGoodsDetails.createTime, 15)) : ''"
                                type="theme_font_red" @timeOut="timeOut" />
                            <van-icon name="info-o" @click="countDownHandle(1)" />
                        </div>
                    </div>
                    <div class="right" v-else-if="giftType == 2">
                        <div class="goods-info-title">{{giftOrderGoodsDetails.proName}}</div>
                        <div class="gift-order-type">
                            <img v-if="giftOrderGoodsDetails.receiveState == 1" src="../images/dfh.png" alt="" width="70"
                                height="70">
                            <img v-else-if="giftOrderGoodsDetails.receiveState == 2" src="../images/dsh.png" alt="" width="70"
                                height="70">
                            <img v-else-if="giftOrderGoodsDetails.receiveState == 3" src="../images/yqs.png" alt="" width="70"
                                height="70">
                        </div>
                    </div>
                </div>
                <div class="receiving-status place boxShadow block-div theme_bg_white"
                    v-if="giftType == 2 && giftOrderGoodsDetails.receiveState == 1 || giftOrderGoodsDetails.receiveState == 2 ">
                    <!--待发货-->
                    <div v-if="giftOrderGoodsDetails.receiveState == 1">
                        <!--日期型-->
                        <div v-if="hasDateProduct(giftOrderDetails.orderItemList)">
                            <div class="flex-row">
                                <i class="iconfont mall-peisong"></i>
                                <div class="title theme_font_black">订单已提交，等待商家备货</div>
                            </div>
                            <div class="flex-row">
                                <div class="left-space theme_font_tint full">{{giftOrderDetails.paidTime}}</div>
                            </div>
                        </div>
                        <!--配送-->
                        <div v-if="giftOrderDetails.deliverType == 2 || giftOrderDetails.deliverType == 3">
                            <!--普通商品-->
                            <div v-if="hasCommonPro(giftOrderDetails.orderItemList)">
                                <div class="flex-row" v-if="giftOrderDetails.stockupFinishTime != ''">
                                    <i class="iconfont mall-peisong"></i>
                                    <div class="title theme_font_black" v-if="giftOrderDetails.deliverType == 3">备货已完成，骑手前往取货<span
                                            class="theme_font_red">（蜂鸟快送）</span></div>
                                    <div class="title theme_font_black" v-else>备货已完成，等待商家发货</div>
                                </div>
                                <div class="flex-row" v-if="giftOrderDetails.stockupFinishTime != ''">
                                    <div class="left-space theme_font_tint full">{{giftOrderDetails.stockupFinishTime}}</div>
                                </div>
                                <div class="flex-row">
                                    <i class="iconfont mall-peisong" v-if="giftOrderDetails.stockupFinishTime == ''"></i>
                                    <div class="title theme_font_black"
                                        :class="{'left-space': giftOrderDetails.stockupFinishTime != ''}">订单已提交，等待商家备货</div>
                                </div>
                                <div class="flex-row">
                                    <div class="left-space theme_font_tint full">{{giftOrderDetails.paidTime}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--待收货提货-->
                    <div v-if="giftOrderGoodsDetails.receiveState == 2">
                        <!--日期型，待收货没有日期型-->
                        <!--蜂鸟配送-->
                        <div v-if="giftOrderDetails.deliverType == 3">
                            <!--普通商品-->
                            <div v-if="hasCommonPro(giftOrderDetails.orderItemList)">
                                <div class="flex-row">
                                    <i class="iconfont mall-peisong"></i>
                                    <div class="title theme_font_black">
                                        骑手已取货，正向您赶来，预计{{getArriverTimeStr(storeDeliverlyData.arriverTime)}}送达</div>
                                </div>
                                <div class="flex-row">
                                    <div class="left-space theme_font_tint full">骑手姓名：<span
                                            class="theme_font_black">{{storeDeliverlyData.carrierDriverName}}</span></div>
                                </div>
                                <div class="flex-row">
                                    <div class="left-space theme_font_tint full">骑手电话：<a
                                            :href="'tel:'+storeDeliverlyData.carrierDriverPhone"
                                            class="theme_font_black">{{storeDeliverlyData.carrierDriverPhone}}</a></div>
                                </div>
                                <div class="flex-row">
                                    <div class="left-space theme_font_tint full">
                                        取货时间：{{giftOrderDetails.interfaceType == 2?giftOrderDetails.thirdpartySplitTime:giftOrderDetails.deliveryTime}}
                                    </div>
                                </div>
                                <div class="flex-row">
                                    <div class="left-space title theme_font_black">备货已完成，骑手前往取货<span
                                            class="theme_font_red">（蜂鸟快送）</span></div>
                                </div>
                                <div class="flex-row">
                                    <div class="left-space theme_font_tint full">{{giftOrderDetails.stockupFinishTime}}</div>
                                </div>
                                <div class="flex-row">
                                    <div class="left-space title theme_font_black">订单已提交，等待商家备货</div>
                                </div>
                                <div class="flex-row">
                                    <div class="left-space theme_font_tint full">{{giftOrderDetails.paidTime}}</div>
                                </div>

                            </div>
                        </div>
                        <!--配送-->
                        <div v-if="giftOrderDetails.deliverType == 2">
                            <!--普通商品-->
                            <div v-if="hasCommonPro(giftOrderDetails.orderItemList)">
                                <div class="flex-row">
                                    <i class="iconfont mall-peisong"></i>
                                    <div class="title theme_font_black">快递公司已发货，请密切注意物流信息</div>
                                </div>
                                <!--不是同城配送才显示-->
                                <div class="flex-row" v-if="giftOrderDetails.deliveryStatusType != 2">
                                    <div class="left-space theme_font_tint full">
                                        物流公司：{{giftOrderDetails.interfaceType == 2?getPeisongString(giftOrderDetails.interfaceType):giftOrderDetails.expressName}}
                                    </div>
                                    <div class="copy-btn" v-if="giftOrderDetails.interfaceType == 2" @click="showExpress">查看物流
                                    </div>
                                </div>

                                <!--不是京东快递 && 不是同城配送才显示-->
                                <div class="flex-row"
                                    v-if="giftOrderDetails.interfaceType != 2 && giftOrderDetails.deliveryStatusType != 2">
                                    <div class="left-space theme_font_tint full">物流单号：{{giftOrderDetails.expressNo}}</div>
                                    <div class="copy-btn" ref="copybtn"
                                        v-if="giftOrderDetails.expressNo && giftOrderDetails.expressNo.length"
                                        :data-clipboard-text="giftOrderDetails.expressNo" @click="copyExpressNo">复制</div>

                                </div>
                                <div class="flex-row">
                                    <div class="left-space theme_font_tint full">
                                        发货时间：{{giftOrderDetails.interfaceType == 2?giftOrderDetails.thirdpartySplitTime:giftOrderDetails.deliveryTime}}
                                    </div>
                                </div>
                                <!--不是京东快递才显示-->
                                <div v-if="giftOrderDetails.interfaceType != 2">
                                    <div class="flex-row">
                                        <div class="left-space title theme_font_black">备货已完成，等待商家发货</div>
                                    </div>
                                    <div class="flex-row">
                                        <div class="left-space theme_font_tint full">{{giftOrderDetails.stockupFinishTime}}</div>
                                    </div>
                                    <div class="flex-row">
                                        <div class="left-space title theme_font_black">订单已提交，等待商家备货</div>
                                    </div>
                                    <div class="flex-row">
                                        <div class="left-space theme_font_tint full">{{giftOrderDetails.paidTime}}</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <!--自提-->
                        <div v-if="giftOrderDetails.deliverType == 1">
                            <div class="flex-row">
                                <i class="iconfont mall-time theme_font_black"></i>
                                <div class="label-text theme_font_black">提货时间:</div>
                                <div class="theme_font_black full">{{giftOrderDetails.selectReceiveTime}}</div>
                            </div>
                            <div class="flex-row">
                                <i class="iconfont mall-dianpu theme_font_black"></i>
                                <div class="label-text theme_font_black">提货店铺:</div>
                                <div class="theme_font_black full">{{giftOrderDetails.pickupName}}</div>
                            </div>
                            <div class="flex-row">
                                <i class="iconfont mall-ren-copy"></i>
                                <div class="label-text theme_font_black">联系电话:</div>
                                <div class="theme_font_black full">{{giftOrderDetails.storePhone}}</div>
                            </div>
                            <div class="flex-row">
                                <i class="iconfont mall-dingwei theme_font_tint"></i>
                                <div class="label-text theme_font_black">提货地址:</div>
                                <div class="theme_font_black full">{{giftOrderDetails.address}}</div>
                            </div>
                            <div class="flex-row" v-if="tag == '4' && giftOrderDetails.deliverType == 1">
                                <i class="iconfont mall-scan theme_font_tint"></i>
                                <div class="label-text theme_font_black">提货码:</div>
                                <div class="theme_font_black full" v-if="$store.state.globalConfig.webpos_type != 'cloudpos'">
                                    {{giftOrderDetails.deliverCheckcode}}</div>
                            </div>
                            <div class="flex-row"
                                v-if="tag == '4' && giftOrderDetails.deliverType == 1 && giftOrderDetails.orderMode == 6">
                                <div class="pick-up-tip"
                                    v-if="giftOrderDetails.orderMode == 6 && giftOrderDetails.selectReceiveTime && giftOrderDetails.receiveEndTime">
                                    提货时间：{{giftOrderDetails.selectReceiveTime}}到{{giftOrderDetails.receiveEndTime}}，超过自提时间后系统将自动取消订单<span
                                        v-if="$store.state.globalConfig.order_fresh_pickup_cancel_type != '0'">并退款</span>
                                </div>
                            </div>
                            <div class="flex-row"
                                v-else-if="tag == '4' && giftOrderDetails.deliverType == 1 && $store.state.globalConfig.order_pickup_cancel_tip_show != 'false'">
                                <div class="pick-up-tip">请于{{pickUpEndTime}}之前提货，超过自提时间后系统将自动取消订单并退款</div>
                            </div>
                            <div class="flex-row" style="justify-content:center;flex-direction: column; padding-bottom: 0px;"
                                v-if="tag == '4' && giftOrderDetails.deliverType == 1">
                                <div class="code-div">
                                    <canvas id="codeDiv"></canvas>
                                    <div class="tip theme_font_black"
                                        v-if="$store.state.globalConfig.order_message_pickup && $store.state.globalConfig.order_message_pickup != ''">
                                        {{$store.state.globalConfig.order_message_pickup}}</div>
                                </div>
                                <div class="refresh-div" @click="_getOrderDetail"
                                    v-if="$store.state.globalConfig.webpos_type == 'cloudpos'">
                                    <img src="static/image/mall2/shuaxin.png" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 未被领取完-通知 -->
                <div class="tips" v-if="CountDownOver && giftOrderGoodsDetails.surplusNum != 0 && giftType == 1">
                    未被领取的礼品金额将在1-3个工作日内将原路退回到您的资金账户
                </div>

                <!-- 领取记录 -->
                <div class="receive-record boxShadow" v-if="getGifyArr.length && giftType == 1">
                    <p class="title">领取记录</p>
                    <div class="record-list">
                        <div class="record-item" v-for="(item,index) in getGifyArr" :key="index">
                            <div class="record-info">
                                <img :src="item.proImgUrl" alt="" width="25" height="25">
                                <div class="info-details">
                                    <p class="record-name">{{item.receiveName}}</p>
                                    <p class="record-time">{{item.receiveTime}}</p>
                                </div>
                            </div>
                            <div class="record-state">{{receiveStateArr[item.receiveState]}}</div>
                        </div>
                    </div>
                </div>
                <!-- 订单信息 -->
                <div class="order-info boxShadow">
                    <p class="title">订单信息</p>
                    <div class="order-info-details">
                        <div class="order-number info-item">
                            <p class="left">订单号:</p>
                            <p class="right">{{giftOrderDetails.id}}</p>
                        </div>
                        <div class="order-state info-item">
                            <p class="left">订单类型:</p>
                            <p class="right">{{giftOrderGoodsDetails.giftType == 1 ? '送礼订单' : '收礼订单'}}</p>
                        </div>
                        <div class="order-number info-item">
                            <p class="left">下单时间:</p>
                            <p class="right">{{giftOrderDetails.submitTime}}</p>
                        </div>
                        <div class="order-number info-item" v-if="giftOrderDetails.payMode != ''">
                            <p class="left">支付方式:</p>
                            <p class="right">{{getPayWayText(giftOrderDetails.payMode)}}</p>
                        </div>
                        <div class="order-number info-item">
                            <p class="left">支付完成时间:</p>
                            <p class="right">{{giftOrderDetails.payTime}}</p>
                        </div>
                    </div>
                </div>
                <!-- 商品金额 -->
                <div class="goods-price-info boxShadow" v-if="giftType == 1">
                    <div class="goods-price price-item">
                        <p class="left">商品金额</p>
                        <p class="right">￥{{$util.toDecimal2(giftOrderDetails.totalAmount)}}</p>
                    </div>
                    <div class="goods-freight price-item">
                        <div class="dialogBox">
                            <p class="left">运费</p>
                            <van-icon name="info-o" @click="countDownHandle('2')" />
                        </div>
                        <p class="right colorred">
                            +￥{{$util.toDecimal2(parseFloat(giftOrderDetails.freightAmount) - parseFloat(giftOrderDetails.freightDiscountAmount))}}
                        </p>
                    </div>
                    <div class="goods-price price-item">
                        <p class="left">优惠券</p>
                        <p class="right colorred">-￥{{$util.toDecimal2(giftOrderDetails.couponAmount)}}</p>
                    </div>
                    <div class="goods-price price-item">
                        <p class="left">积分</p>
                        <p class="right colorred">-￥{{$util.toDecimal2(giftOrderDetails.pointsAmount)}}</p>
                    </div>
                    <div class="goods-price price-item">
                        <p class="left"></p>
                        <p class="right">共{{giftOrderDetails.orderItemList.length}}件商品 实付款:<span
                                class="colorred">￥{{giftOrderDetails.payAmount}}</span></p>
                    </div>
                </div>
                <!-- 收货人信息 -->
                <div class="consignee-info boxShadow" v-if="giftType == 2">
                    <div class="user-address">
                        <van-icon name="location-o" />
                        <div class="user-info">
                            <span>{{giftOrderDetails.receiver}}</span>
                            <span>{{giftOrderDetails.mobile}}</span>
                        </div>
                    </div>
                    <div class="address-info">
                        收货地址: {{giftOrderDetails.provinceName + giftOrderDetails.cityName + giftOrderDetails.countryName + giftOrderDetails.townName
                    + giftOrderDetails.address}}
                    </div>
                </div>
                <!-- 按钮组 -->
                <div class="btns" v-if="giftOrderGoodsDetails.receiveState != 1">
                    <div class="btn-info">
                        <div v-if="giftType == 1" class="btn line_circle theme_standard_font" @click.stop="reBuy">再次购买</div>
                        <div v-if="giftType == 1" class="btn" @click.stop="showInvoice">查看发票</div>
                        <div v-if="giftType == 2 && giftOrderGoodsDetails.receiveState == 2" class="btn"
                            @click.stop="showInvoice">查看物流</div>
                        <div v-if="giftType == 2 && giftOrderGoodsDetails.receiveState == 2" class="btn"
                            @click.stop="showInvoice">确认收货</div>
                        <div v-if="giftType == 2 && giftOrderGoodsDetails.receiveState == 3" class="btn"
                            @click.stop="showInvoice">申请售后</div>
                        <div v-if="giftType == 2 && giftOrderGoodsDetails.receiveState == 3" class="btn"
                            @click.stop="showInvoice">晒单评价</div>
                    </div>
                </div>
            </div>
        </nav-content>
        <van-dialog v-model="dialogShow" :title="dialogTitle">
            <div class="content">{{dialogMessage}}</div>
        </van-dialog>
    </div>
</template>
<script>
import { Dialog } from 'vant';
import PriceOrder from '@/components/commonui/price/price-order'
import countdown from "@/components/Vendor/countdown/countdown";
export default {
    data() {
        return {
            dialogShow: false,
            dialogTitle: '',
            dialogMessage: '',
            giftOrderGoodsDetails: {},
            giftOrderDetails: {},
            getGifyArr: [],
            receiveStateArr: {
                1: '待发货',
                2: '待收货',
                3: '已领取',
                4: '领取失败'
            },
            CountDownOver: false,
            giftType: '',
            giftTypeImg: {
                1: '../images/dfh.png',
                2: '../images/dsh.png',
                3: '../images/ylq.png'
            }
        }
    },
    components: {
        PriceOrder,
        countdown
    },
    mounted() {
        this.giftType = this.$route.query.giftType  // 1 送礼 2 收礼
        if (this.giftType == 2) {
            this.getOrderItemDetails()
        } else {
            this.giftOrderGoodsDetails = JSON.parse(this.$route.query.giftData)
        }
        console.log(this.giftOrderGoodsDetails)
        this.getReceiveGiftList() // 领取记录
        this.getOrderDetail()
    },
    methods: {
        // 倒计时提示
        countDownHandle(state) {
            if (state == 1) {
                this.dialogTitle = '我要送礼'
                this.dialogMessage = '礼单有效期为15天，未被领取的礼品金额将原路返回到您的资金账户当中。'
            } else if (state == 2) {
                this.dialogTitle = '运费详情'
                this.dialogMessage = '礼单运费=单个商品商品运费*购买数量'
            }
            this.dialogShow = true
        },
        getOrderItemDetails() {
            this.$request.post('/app/json/app_send_gift_order/getReceiveGiftDetail', {
                userId: this.$route.query.userId,
                orderId: this.$route.query.orderId
            }).then((res) => {
                if (res.status === 0) {
                    this.giftOrderGoodsDetails = res.data
                } else {
                    this.$Toast(res.info)
                }
            })

        },
        getReceiveGiftList() {
            // 领取记录
            this.$request.post('/app/json/app_send_gift_order/getReceiveGiftList', {
                userId: this.$route.query.userId,
                orderId: this.$route.query.orderId
            }).then((res) => {
                if (res.status === 0) {
                    this.getGifyArr = res.data
                } else {
                    this.$Toast(res.info)
                }
            })
        },
        getOrderDetail() {
            // 订单信息
            this.$request.post('/app/json/app_shopping_order/detail', {
                orderType: "200015",
                // orderId: "2624"
                // orderType: this.$route.query.orderType,
                orderId: this.$route.query.orderId
            }).then((res) => {
                if (res.status === 0) {
                    this.giftOrderDetails = res.data
                } else {
                    this.$Toast(res.info)
                }
            })
        },
        getPayWayText(payModel) {
            if (payModel == '200') {
                return '支付宝支付'
            } else if (payModel == '210') {
                return '微信支付'
            }
            return ''
        },
        // 有效期结束
        timeOut() {
            this.CountDownOver = true
        },
        // 再次购买
        reBuy() {
            if (this.giftOrderDetails.deliverType == 3) {
                let arr = []
                for (let i = 0; i < this.giftOrderDetails.itemAbstractList.length; i++) {
                    let product = this.giftOrderDetails.itemAbstractList[i]
                    let cd = {
                        skuId: product.skuId,
                        storeOuCode: product.storeOuCode,
                        number: product.number,
                    }
                    arr.push(cd)
                }
                sessionStorage.setItem('MDPS_Carts', JSON.stringify(arr))
                this.$router.push({
                    path: '/mall2/store-delivery/list'
                })
                return;
            }

            this.$Loading.open();
            let url = '/app/json/app_cart/addCart';
            let paramsData = {
                token: this.$store.state.login.token,
                carts: [],
                deliveryType: this.giftOrderDetails.deliverType,
                orderCategory: this.orderCategory,
                vipUnitUserCode: this.vipUnitUserCode
            };
            let arr = []
            for (let i = 0; i < this.giftOrderDetails.itemAbstractList.length; i++) {
                let product = this.giftOrderDetails.itemAbstractList[i]
                let cd = {
                    skuId: product.skuId,
                    storeOuCode: product.storeOuCode,
                    number: product.number,

                }
                arr.push(cd)
            }
            paramsData.carts = arr;
            this.$http.post(url, paramsData).then(
                res => {
                    this.$Loading.close();
                    let data = res.data;
                    if (data.status == 0) {
                        this.$store.state.mall2.staticDeliverType = this.giftOrderDetails.deliverType
                        this.$store.state.mall2.cartNum = data.data;
                        this.$router.push({
                            path: '/mall2/cart',
                            query: {
                                orderCategory: this.orderCategory,
                                vipUnitUserCode: this.vipUnitUserCode
                            }
                        })
                    } else {
                        this.$Toast(data.info);
                    }
                },
                error => {
                    this.$Loading.close();
                    this.$Toast('请求数据失败！')
                }
            );
        },
        // 查看发票
        showInvoice() {
            this.$Toast('暂不支持！')
        },
        hasCommonPro: function (list) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].productType == 1 || list[i].productType == 4) {
                    return true
                }
            }
            return false
        },
        hasDateProduct: function (list) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].productType == 2) {
                    return true
                }
            }
            return false
        },
    },
}
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~@/common/stylus/variable.styl';

// .mb50 {
// bottom: 50px;
// }
.giftOrder-content {
    // height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding: 10px;
    // bottom: 40px;

    .boxShadow {
        border-radius: 5px;
        box-shadow: 0px 0px 5px #eaeaea;
        background: #fff;
        margin-bottom: 15px;
    }

    .dialogBox {
        display: flex;
        align-items: center;

        p {
            margin-right: 8px;
        }
    }

    .colorred {
        color: red;
    }

    // 商品详情
    .goods-info {
        display: flex;
        justify-content: flex-start;
        padding: 10px;

        .right {
            flex: 1;
            margin-left: 10px;
            font-size: 14px;

            &>div {
                line-height: 25px;
            }

            .gift-order-type {
                position: relative;
                height: 68px;

                img {
                    width: 60px;
                    height: 60px;
                    position: absolute;
                    right: 10px;
                }
            }
        }
    }

    // 收货状态
    .receiving-status {
        padding: 10px;
        margin: 0 0 15px;
    }

    .tips {
        background: #FBF8D7;
        color: #F38B2F;
        margin: -5px -10px 10px;
        height: 30px;
        line-height: 30px;
        text-align: center;
    }

    // 领取记录
    .receive-record {
        padding: 0 0 10px;

        p.title {
            text-align: center;
            line-height: 35px;
            margin: 0;
            font-size: 16px;
        }

        .record-list {
            padding: 0 10px;
            max-height: 150px;
            overflow-y: scroll;

            .record-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                font-size: 14px;

                .record-info {
                    display: flex;
                    align-items: center;

                    .info-details {
                        margin-left: 10px;

                        .record-name {
                            line-height: 25px;
                        }

                        .record-time {
                            font-size: 12px;
                            color: #ccc;
                        }
                    }
                }
            }
        }
    }

    // 订单信息
    .order-info {
        padding: 10px;

        p.title {
            line-height: 35px;
            font-size: 16px;
        }

        .order-info-details {
            .info-item {
                display: flex;
                line-height: 25px;
                font-size: 14px;

                .left {
                    width: 100px;
                    color: #909090;
                }
            }
        }
    }

    // 商品金额
    .goods-price-info {
        padding: 10px;
        font-size: 14px;

        .price-item {
            display: flex;
            justify-content: space-between;
            line-height: 25px;
        }
    }

    .consignee-info {
        padding: 10px;

        .user-address {
            display: flex;
            align-items: center;

            .van-icon {
                font-size: 20px;
                width: 25px;
            }

            .user-info {
                font-size: 16px;
            }
        }

        .address-info {
            margin-left: 25px;
            line-height: 15px;
            color: #979797;
        }
    }

    // 按钮组
    .btns {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        background: #fff;
        box-shadow: 0px 2px 8px #ccc;

        .btn-info {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            height: 100%;

            .btn {
                border: 1px solid red;
                border-radius: 20px;
                padding: 7px 12px;
                margin-right: 15px;
                color: red;
            }
        }
    }
}

/deep/ .van-button--default {
    background: $color-theme-r;
    color: #fff;
}

/deep/ .van-dialog__content {
    padding: 10px 15px;
    line-height: 25px;
}
</style>

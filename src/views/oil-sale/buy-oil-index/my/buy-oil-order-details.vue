<template>
    <div class="buy-oil-order-details">
        <nav-top title="订单详情" @backEvent="$router.go(-1)"></nav-top>
        <!-- 普通订单 -->
        <nav-content class="buy-oil-order-content">
            <div class="order-status theme_bg_blue_i">
                <div class="title">{{stateInfo}}</div>
                <div class="time" v-if="billItem.state == 2">
                    提货剩余时间:
                    <div class="count-down">
                        <countdown class="count-down-con" :hiddenDay="true"
                            :endTime="billItem.countdown ? ((new Date(billItem.countdown.replace(/-/g, '/')).getTime())/1000) : ''"
                            type="theme_bg_blue"></countdown>
                    </div>
                </div>
            </div>
            <div class="oil-order-details">
                <div class="user-info" >
                    <div class="name">
                        <div class="left">{{billItem.consignee}}</div>
                        <div class="right">{{billItem.consigneePhone}}</div>
                    </div>
                    <div class="name" v-if="billItem.deliveryType == 2">
                        {{billItem.addressInfo ? JSON.parse(billItem.addressInfo).regionText : ''}}
                    </div>
                    <div class="name" v-else>
                        <div class="left">自提油库</div>
                        <div class="right">{{billItem.pickUpOilDepotName}}</div>
                    </div>
                </div>
                <div class="user-info" v-if="billItem.state == 2">
                    <div class="qr-cord">
                        <div class="left">我的提油码</div>
                        <div class="right">
                            <canvas class="qrcode" id="qrcode"></canvas>
                        </div>
                        <div class="qr-code-num">{{billItem.id.toString()}}</div>
                    </div>
                </div>
                <div class="oil-sale-container">
                    <div class="buy-bill">
                        <div class="table-view">
                            <div class="table-view-cell">
                                <div class="table-view-cell-text">
                                    <div class="bill-item">
                                        <div class="img-wrapper">
                                            <img class="img" src="../../assets/image/bill.png" alt>
                                        </div>
                                        <div class="center-text">
                                            <div class="title">
                                                {{billItem.matertialName}}
                                                <div class="tips-btn">{{activityTypeList[billItem.activityType]}}</div>
                                                <!-- <div class="tips-btn" v-if="billItem.activityType == 2">约单</div>
                                                <div class="tips-btn" v-else-if="billItem.activityType == 1">撞单</div>
                                                <div class="tips-btn" v-else-if="billItem.activityType == 3">抢单</div>
                                                <div class="tips-btn" v-else-if="billItem.activityType == 4">竞价</div>
                                                <div class="tips-btn" v-else-if="billItem.activityType == 5">限价抢单</div> -->
                                            </div>
                                            <div class="tips info">
                                                ￥
                                                <span
                                                    class="now-price">{{billItem.adjustPriceCheckState == 1 ? billItem.adjustPrice : billItem.price}}</span>/t
                                                <van-icon v-if="billItem.activityType == 5" name="info-o"
                                                    @click="countDownHandle" />
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
                                                <input type="text" disabled v-model="billItem.id">
                                            </div>
                                        </li>
                                        <li class="details-item">
                                            <div class="left">下单时间</div>
                                            <div class="right">
                                                <input type="text" disabled v-model="billItem.submitTime">
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="table-view-cell">
                                <div class="table-view-cell-text">
                                    <ul class="details-list">
                                        <li class="details-item">
                                            <div class="left">业务类型</div>
                                            <div class="right">
                                                <input type="text" disabled
                                                    v-model="billItem.bizType == '' || billItem.bizType == 0 ? '普通购油' : '预约提油'">
                                            </div>
                                        </li>
                                        <li class="details-item" v-if="billItem.bizType == 1">
                                            <div class="left">提油卡号</div>
                                            <div class="right">
                                                <input type="text" disabled v-model="billItem.oilCardNo">
                                            </div>
                                        </li>
                                        <li class="details-item" v-if="billItem.bizType == 1">
                                            <div class="left">预约时间</div>
                                            <div class="right">
                                                <input type="text" disabled v-model="billItem.submitTime">
                                            </div>
                                        </li>
                                        <li class="details-item" v-if="billItem.bizType != 1">
                                            <div class="left">购油数量</div>
                                            <div class="right">
                                                <input type="text" disabled v-model="billItem.tonnes+'t'">
                                            </div>
                                        </li>
                                        <li class="details-item" v-if="billItem.state == 2 || billItem.state == 3">
                                            <div class="left">确认时间</div>
                                            <div class="right">
                                                <input type="text" disabled v-model="billItem.confirmTime">
                                            </div>
                                        </li>
                                        <li class="details-item"
                                            v-if="billItem.bizType == 1 && billItem.state == 3 && billItem.deliveryType == 1">
                                            <div class="left">提货时间</div>
                                            <div class="right">
                                                <input type="text" disabled v-model="billItem.pickUpTime">
                                            </div>
                                        </li>
                                        <li class="details-item"
                                            v-if="billItem.bizType == 1 && billItem.state == 3 && billItem.deliveryType == 2">
                                            <div class="left">完成时间</div>
                                            <div class="right">
                                                <input type="text" disabled v-model="billItem.pickUpTime">
                                            </div>
                                        </li>
                                        <li class="details-item"
                                            v-if="(billItem.bizType != 1 && billItem.state == 3) || (billItem.bizType == 1 && billItem.state == 3 && billItem.deliveryType == 2)">
                                            <div class="left">完成时间</div>
                                            <div class="right">
                                                <input type="text" disabled v-model="billItem.pickUpTime">
                                            </div>
                                        </li>
                                        <li class="details-item">
                                            <div class="left">经办人手机号</div>
                                            <div class="right">
                                                <input type="text" disabled placeholder="请输入联系方式" v-model="billItem.userPhone">
                                            </div>
                                        </li>
                                        <li class="details-item" v-if="billItem.state != 1">
                                            <div class="left">配送费用</div>
                                            <div class="right">
                                                <input type="text" disabled v-model="billItem.freightAmount">
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="table-view-cell" v-if="billItem.bizType != 1">
                                <div class="table-view-cell-text">
                                    <ul class="buy-bill-money-list">
                                        <li class="buy-bill-money-item">
                                            <div class="money">
                                                <div class="left">油品总金额</div>
                                                <div class="right">
                                                    ￥
                                                    <span class="num">{{billItem.amount}}</span>
                                                </div>
                                            </div>
                                            <div class="money">
                                                <div class="left">活动优惠</div>
                                                <div class="right special">
                                                    ￥<span class="num">{{billItem.couAmount}}</span>
                                                </div>
                                            </div>
                                            <div class="money">
                                                <div class="left">实际需支付</div>
                                                <div class="right special">
                                                    ￥
                                                    <span class="num">{{billItem.payAmount}}</span>
                                                </div>
                                            </div>
                                            <!-- <div class="money">
                                                <div class="left">油品总金额</div>
                                                <div class="right">
                                                    ￥
                                                    <span class="num">{{dealNum()}}</span>
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
                                                    ￥
                                                    <span class="num">{{(dealNum()-calculatePrice()).toFixed(2)}}</span>
                                                </div>
                                            </div> -->
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="now-buy-bill-btn" v-if="billItem.activityType == 2">
                <div class="btn">取消订单</div>
            </div>
            <van-dialog v-model="dialogShow" :title="`${activityTypeList[billItem.activityType]}价格说明`">
                <div class="order-content">
                    <div class="title">订单信息:</div>
                    <div class="orderPrice-List"
                        v-for="(item, index) in billItem.grabDetail ? JSON.parse(billItem.grabDetail) : []" :key="index">
                        <div class="price-item borderB">
                            <div>
                                <p class="left">油品单价{{index}}: </p>
                                <p class="right">{{item.price}}元/吨</p>
                            </div>
                            <div>
                                <p class="left">油品数量: </p>
                                <p class="right">{{item.tonnes}}吨</p>
                            </div>
                        </div>
                    </div>
                    <div class="average-price">
                        <p>平均价: {{billItem.price}}元/吨</p>
                    </div>
                </div>
            </van-dialog>
        </nav-content>
    </div>
</template>

<script>
import QRCode from "qrcode"
import utils from '@/utils/util'
import Countdown from "@/components/Vendor/countdown/countdown"


export default {
    data() {
        return {
            dialogShow: false,
            billItem: {}, // 订单详情数据
            stateInfo: '', // 订单状态 1提交 2确认 3提货完成 4取消
            activity_type: '', // 撞单 抢单 约单
            brightnessResult: {},
            activityTypeList: {
                1: '撞单',
                2: '约单',
                3: '抢单',
                4: '竞价',
                5: '限价抢单'
            }
        };
    },
    mounted() {
        this.billItem = JSON.parse(this.$route.query.billItem)
        console.log(this.billItem)
        this.dealWith()
    },
    computed: {
    },
    methods: {
        calculatePrice() {
            let num = (this.billItem.adjustPriceCheckState == 1 ? this.billItem.adjustPrice : this.billItem.basePrice) * this.billItem.tonnes - this.billItem.price * this.billItem.tonnes
            return num > 0 ? num.toFixed(2) : 0
        },
        dealNum() {
            let num = (this.billItem.adjustPriceCheckState == 1 ? this.billItem.adjustPrice : this.billItem.basePrice) * this.billItem.tonnes
            return num.toFixed(2)
        },
        // 类型判断
        dealWith() {
            if (this.billItem.state == 1) {
                this.stateInfo = "等待确认!"
            } else if (this.billItem.state == 2) {
                this.stateInfo = "等待提货!"
                this.$nextTick(() => {
                    QRCode.toCanvas(document.getElementById("qrcode"), this.billItem.id.toString())
                })
            } else if (this.billItem.state == 3) {
                this.stateInfo = "订单已完成!"
            } else if (this.billItem.state == 4) {
                this.stateInfo = "订单已取消!"
            }
        },
        countDownHandle() {
            this.dialogShow = true
        }
    },
    components: {
        Countdown
    },
    destroyed() {
        this.$bridgefunc.brightness(this.brightnessResult.value, this.brightnessResult.isauto, (result) => { })
    },
    created() {
        this.$bridgefunc.brightness(1, 0, (result) => {
            this.brightnessResult = result
        })
    }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';
@import '../../assets/stylus/oil-sale-base.styl';

.buy-oil-order-content {
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch;
}

.order-status {
    padding: 11px 15px;
    height: 100px;
    color: #fff;

    .title {
        font-size: 16px;
    }

    .time {
        text-align: right;

        .count-down {
            display: inline-block;
        }
    }
}

.oil-order-details {
    position: absolute;
    top: 60px;
    left: 15px;
    right: 15px;
    padding-bottom: 10px;

    .user-info {
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
        background: #fff;
        border-radius: 4px;
        padding: 11px 15px;
        line-height: 24px;
        font-size: 14px;
        color: $color-text;
        margin-bottom: 10px;

        .name {
            display: flex;

            .left {
                width: 30%;
            }
        }
    }

    .oil-sale-container {
        #quxiaoBtn {
            width: 100%;
            text-align: right;

            .van-button {
                margin: 20px 20px;
            }
        }
    }
}

.qr-cord {
    .right {
        text-align: center;

        .qrcode {
            margin: -20px 0;
        }
    }

    .qr-code-num {
        text-align: center;
        padding-top: 10px;
    }
}

.title {
    display: flex;
    justify-content: left;
    align-items: center;

    .tips-btn {
        background: #009df8;
        color: #fff;
        padding: 4px 6px;
        border-radius: 20px;
        font-size: 12px;
        margin-left: 5px;
    }
}

.now-buy-bill-btn {
    padding: 11px 15px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    .btn {
        border-radius: 20px;
        padding: 15px 0;
        width: 100%;
        color: #fff;
        background: #009df8;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
    }
}

.order-content {
    .orderPrice-List {
        padding: 10px 0 0;
        color: #868686;

        .price-item {
            div {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            p {
                line-height: 25px;
            }
        }
    }

    .average-price {
        margin-top: 10px;
        text-align: right;
    }
}

/deep/ .van-dialog__content {
    padding: 10px 15px;
    line-height: 25px;
}

/deep/ .van-dialog {
    border-radius: 5px;
}
</style>

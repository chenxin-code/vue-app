<template>
    <div class="viola-details-index">
        <nav-top :title="title" @backEvent="goback"></nav-top>
        <nav-content class="viola-details-container">
            <!-- 违章处理 -->
            <div v-if="type == 1">
                <div class="order-detail">
                    <ul>
                        <li class="viola-item">
                            <div class="viola-title">违章时间</div>
                            <div class="viola-content">{{violaDetail.time}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">违章地点</div>
                            <div class="viola-content">{{violaDetail.address}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">违章原因</div>
                            <div class="viola-content">{{violaDetail.reason}}</div>
                        </li>
                    </ul>
                </div>
                <div class="order-detail">
                    <ul>
                        <li class="viola-item">
                            <div class="viola-title">是否可处理</div>
                            <div class="viola-content">{{canSelectType[violaDetail.canSelect]}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">罚单状态</div>
                            <div class="viola-content">{{violaType[violaDetail.processStatus]}}</div>
                        </li>
                    </ul>
                </div>
                <div class="order-detail">
                    <ul>
                        <li class="viola-item">
                            <div class="viola-title">罚款金额</div>
                            <div class="viola-content">{{violaDetail.fine}}元</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">所需服务费</div>
                            <div class="viola-content">{{violaDetail.serviceFee}}元</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">扣分</div>
                            <div class="viola-content">{{violaDetail.point}}分</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">共需支付</div>
                            <div
                                class="viola-content total-price"
                            >{{violaDetail.fine*1 + violaDetail.serviceFee*1}}元</div>
                        </li>
                    </ul>
                </div>
                <div class="driverlicense">
                    <div class="table-view">
                        <div class="table-view-cell">
                            <div class="table-view-cell-text">
                                <div class="left" @click="driverslicenseFun">
                                    <div class="title">驾驶证编码：</div>
                                    <div class="inp">
                                        <input
                                            type="text"
                                            disabled
                                            placeholder="去认证"
                                            v-model="driversText"
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 违章详情 -->
            <div v-else-if="type == 2">
                <div class="viola-detail order-detail">
                    <ul>
                        <li class="viola-item">
                            <div class="viola-title">订单编号：</div>
                            <div class="viola-content">{{violaDetail.rechargeNo}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">缴费时间：</div>
                            <div class="viola-content">{{violaDetail.time}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">罚单状态：</div>
                            <div class="viola-content">{{violaType[violaDetail.processStatus]}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">订单总金额：</div>
                            <div
                                class="viola-content"
                            >{{violaDetail.fine*1 + violaDetail.serviceFee*1}}元</div>
                        </li>
                    </ul>
                </div>

                <div class="viola-detail">
                    <ul>
                        <li class="viola-item">
                            <div class="viola-title">违章时间：</div>
                            <div class="viola-content">{{violaDetail.time}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">违章地点：</div>
                            <div class="viola-content">{{violaDetail.address}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">违章原因：</div>
                            <div class="viola-content">{{violaDetail.reason}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">是否可处理：</div>
                            <div class="viola-content">{{canSelectType[violaDetail.canSelect]}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">罚单状态：</div>
                            <div class="viola-content">{{violaType[violaDetail.processStatus]}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">罚款金额：</div>
                            <div class="viola-content">{{violaDetail.fine}}元</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">所需服务费：</div>
                            <div class="viola-content">{{violaDetail.serviceFee}}元</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">扣分：</div>
                            <div class="viola-content">{{violaDetail.point}}元</div>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- 缴费详情 -->
            <div v-else-if="type == 3">
                <div class="viola-detail order-detail">
                    <ul>
                        <li class="viola-item">
                            <div class="viola-title">订单编号：</div>
                            <div class="viola-content">{{violaDetail.rechargeNo}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">缴费时间：</div>
                            <div class="viola-content">{{violaDetail.time}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">罚单状态：</div>
                            <div class="viola-content">{{violaType[violaDetail.processStatus]}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">订单总金额：</div>
                            <div
                                class="viola-content"
                            >{{violaDetail.fine*1 + violaDetail.serviceFee*1}}元</div>
                        </li>
                    </ul>
                </div>

                <div class="viola-detail">
                    <ul>
                        <li class="viola-item">
                            <div class="viola-title">决定书编码：</div>
                            <div class="viola-content">{{violaDetail.number}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">车牌号码：</div>
                            <div class="viola-content">{{violaDetail.plateNumber}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">发动机号：</div>
                            <div class="viola-content">{{violaDetail.engineNum}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">违法时间：</div>
                            <div class="viola-content">{{violadetail.penaltyDate}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">违法城市：</div>
                            <div class="viola-content">{{violadetail.province}}</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">罚款金额：</div>
                            <div class="viola-content">{{violadetail.fine}}元</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">服务费：</div>
                            <div class="viola-content">{{violadetail.serviceCharge}}元</div>
                        </li>
                        <li class="viola-item">
                            <div class="viola-title">滞纳金：</div>
                            <div class="viola-content">{{violadetail.overdueFine}}元</div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="bill-btn">
                <!-- 只有在违章处理的情况下存在 -->
                <div class="btn-show-abled btn-show" v-if="type == 1" @click="bindBtn">立即办理</div>
            </div>
        </nav-content>

        <!-- <van-popup v-model="showplateNumber" position="bottom">
            <van-picker
                show-toolbar
                title="选择驾驶证"
                :columns="columns"
                @cancel="showplateNumber = false"
                @confirm="onConfirm"
            />
        </van-popup>-->
    </div>
</template>

<script>
export default {
    data() {
        return {
            showplateNumber: false,
            // columns: [],
            driversText: '',
            title: '违章处理',  // 违章处理 违章详情 缴费详情
            type: '',
            id: '',
            violaDetail: {
                point: 0
            },
            carMsg: {},
            canSelectType: {
                0: '不可处理',
                1: '可处理'
            },
            violaType: {
                1: '未处理',
                2: '处理中',
                3: '已处理',
                4: '不支持处理'
            },
        }
    },
    mounted() {
        this.id = this.$route.query.id
        this.type = this.$route.query.type
        if (this.type != 1) {
            this.title = this.type == 2 ? '违章详情' : '缴费详情'
            this.$request.post('/app/json/fee_life_order/detail', { orderType: '205004', orderId: this.id }).then(res => {
                if (res.status == 0) {
                    this.violaDetail = JSON.parse(res.data.orderExtendData)
                }
            })
        } else {
            this.violaDetail = JSON.parse(this.$route.query.violaDetail)
            this.carMsg = JSON.parse(this.$route.query.carmessage)
        }

        this.$request.post('/app/json/user/checkDriverInfo').then(res => {
            if (res.status === 0) {
                // this.driverInfo = res.data
            } else {
                this.$Toast(res.info ? res.info : '获取驾驶证信息失败')
            }
        })

    },
    methods: {
        goback() {
            this.$router.go(-1)
        },
        bindBtn() {
            if (this.violaDetail.point * 1 > 0 && this.driversText == '') {
                this.$Toast('请先进行驾驶证认证')
                return
            }
            let violaSubmitData = {
                carts: [{
                    number: 1,
                    skuId: this.$store.state.globalConfig.trafficFinesSkuId,
                    storeOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
                    checked: '1'
                }],
                rechargeNo: this.violaDetail.rechargeNo,
                plateNumber: this.carMsg.plateNumber,
                deliveryType: '2'
            }
            this.$request.post('/app/json/fee_life_order/submit', violaSubmitData).then(res => {
                if (res.status == 0) {
                    console.log(res)
                    this.$router.push({
                        name: 'violation-pay',
                        params: {
                            occurOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
                            payInfo: res.data
                        }
                    })
                    // this.$router.go(-1)
                }
            })
        },
        // 驾驶证认证
        driverslicenseFun() {
            if (!this.driversText) {
                this.$router.push({ path: '/certification' })
            }
        }
        // onConfirm(data, index) {
        //     this.driversText = data
        //     this.showplateNumber = false
        // },
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.viola-details-index {
    background-color: #F2F2F4 !important;

    .viola-details-container {
        padding: 10px;

        .viola-title {
            color: #797979;
        }

        .order-detail {
            margin-bottom: 10px;

            ul {
                margin-bottom: 10px;
            }
        }

        .driverlicense {
            .left {
                width: 100%;
                display: flex;
                justify-content: left;
                align-items: center;

                .title {
                    width: 35%;
                    font-size: 14px;
                }

                .inp {
                    flex: 1;
                    width: 100%;

                    input {
                        width: 100%;
                        line-height: 25px;
                        background-color: #fff;
                    }
                }
            }
        }

        .viola-detail, .order-detail {
            border-radius: 5px;
            background-color: #fff;
            padding: 10px;

            .viola-content {
                line-height: 16px;
                max-width: 70%;
            }

            .viola-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                line-height: 30px;

                .total-price {
                    color: red;
                }
            }
        }

        .bill-btn {
            position: fixed;
            bottom: 11px;
            left: 15px;
            right: 15px;
            text-align: center;
            font-size: 14px;

            .btn-show {
                border-radius: 20px;
                padding: 13px 0;
                color: #fff;
                font-weight: bold;

                & + .btn-show {
                    margin-top: 10px;
                }
            }

            .btn-show-enabled {
                background: #CCCCCC;
            }

            .btn-show-abled {
                background: #009df8;
            }
        }
    }
}
</style>

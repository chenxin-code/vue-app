<template>
    <div class="violation-query-index">
        <nav-top :title="Listtype[type]" @backEvent="goBack">
            <div v-if="type == 1 && violaList.length > 0" class="go-pay-record" @click="goPayRecord">缴费记录</div>
            <div v-else-if="violaList.length > 0">
                <ScreenPopup @childToDadValue="screenChild"></ScreenPopup>
            </div>
        </nav-top>
        <!-- 违章查询 -->
        <nav-content class="violation-query-container" v-if="type == 1">
            <div class="violation-query-content" v-if="violaList.length > 0">
                <div class="violation-query-tips" v-if="type == 1">
                    <div class="tips-content">温馨提示：驾照扣分仅限车主本人驾照</div>
                </div>

                <div
                    class="violation-query-list"
                    @click="itemDetailsFun(item,index)"
                    v-for="(item,index) in violaList"
                    :key="index"
                >
                    <div class="violation-query-item">
                        <div :class="violationItemBGC[item.processStatus]">
                            <div class="item-violation-details">
                                <div class="violation-left">
                                    <div class="violation-address">{{item.address}}</div>
                                    <div class="violation-time">{{item.time}}</div>
                                    <div class="violation-text">{{item.reason}}</div>
                                </div>
                                <div class="violation-right">
                                    <div
                                        class="violation-type"
                                    >{{canSelectType[item.processStatus]}}</div>
                                </div>
                            </div>
                            <div class="item-violation-price">
                                <div class="viola-service-prive">服务费{{item.serviceFee || 0}}元</div>
                                <div class="viola-fine-prive">罚款费{{item.fine || 0}}元</div>
                                <div class="viola-latefee-prive">滞纳金{{item.overdueFine || 0}}元</div>
                                <div class="viola-deduction-prive">扣分{{item.point || 0}}分</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="no-list">
                    <img src="./assets/image/picture.png" alt width="200" />
                    <p>爱车无违章</p>
                    <p class="go-payrecord" @click="goPayRecord">点击查看违章记录</p>
                </div>
            </div>
        </nav-content>
        <!-- 违章缴费记录 -->
        <nav-content class="violation-query-container" v-else-if="type == 2">
            <div class="violation-query-content">
                <div
                    class="violation-query-list"
                    @click="itemDetailsFun(item,index)"
                    v-for="(item,index) in violaList"
                    :key="index"
                >
                    <div class="violation-query-item">
                        <!-- 缴费记录下才存在 -->
                        <div class="payRecord-time">
                            <div>
                                缴费时间：
                                {{changeDataType(item.orderExtendData).time}}
                            </div>
                        </div>

                        <div
                            :class="violationItemBGC[changeDataType(item.orderExtendData).processStatus]"
                        >
                            <div class="item-violation-details">
                                <div class="violation-left">
                                    <div
                                        class="violation-address"
                                    >{{changeDataType(item.orderExtendData).address}}</div>
                                    <div
                                        class="violation-time"
                                    >{{changeDataType(item.orderExtendData).time}}</div>
                                    <div
                                        class="violation-text"
                                    >{{changeDataType(item.orderExtendData).reason}}</div>
                                </div>
                                <div class="violation-right">
                                    <div
                                        class="violation-type"
                                    >{{canSelectType[changeDataType(item.orderExtendData).processStatus]}}</div>
                                </div>
                            </div>
                            <div class="item-violation-price">
                                <div
                                    class="viola-service-prive"
                                >服务费{{changeDataType(item.orderExtendData).serviceFee || 0}}元</div>
                                <div
                                    class="viola-fine-prive"
                                >罚款费{{changeDataType(item.orderExtendData).fine || 0}}元</div>
                                <div
                                    class="viola-latefee-prive"
                                >滞纳金{{changeDataType(item.orderExtendData).overdueFine || 0}}元</div>
                                <div
                                    class="viola-deduction-prive"
                                >扣分{{changeDataType(item.orderExtendData).point || 0}}分</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav-content>
        <!-- 罚单缴费记录 -->
        <nav-content class="violation-query-container" v-else>
            <div class="violation-query-content">
                <div
                    class="violation-query-list"
                    @click="itemDetailsFun(item,index)"
                    v-for="(item,index) in violaList"
                    :key="index"
                >
                    <div class="violation-query-item">
                        <!-- 缴费记录下才存在 -->
                        <div class="payRecord-time">
                            <div>
                                缴费时间：
                                {{changeDataType(item.orderExtendData).time}}
                            </div>
                        </div>

                        <div
                            :class="violationItemBGC[changeDataType(item.orderExtendData).processStatus]"
                        >
                            <div class="item-violation-details">
                                <div class="violation-left">
                                    <div
                                        class="violation-address"
                                    >处罚决定书编号: {{changeDataType(item.orderExtendData).address}}</div>
                                    <div
                                        class="violation-time"
                                    >{{changeDataType(item.orderExtendData).time}}</div>
                                    <div
                                        class="violation-text"
                                    >缴费订单号: {{changeDataType(item.orderExtendData).reason}}</div>
                                </div>
                                <div class="violation-right">
                                    <div
                                        class="violation-type"
                                    >{{canSelectType[changeDataType(item.orderExtendData).processStatus]}}</div>
                                </div>
                            </div>
                            <div class="item-violation-price">
                                <div
                                    class="viola-service-prive"
                                >服务费{{changeDataType(item.orderExtendData).serviceFee || 0}}元</div>
                                <div
                                    class="viola-fine-prive"
                                >罚款费{{changeDataType(item.orderExtendData).fine || 0}}元</div>
                                <div
                                    class="viola-latefee-prive"
                                >滞纳金{{changeDataType(item.orderExtendData).overdueFine || 0}}元</div>
                                <div
                                    class="viola-deduction-prive"
                                >扣分{{changeDataType(item.orderExtendData).point || 0}}分</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav-content>
    </div>
</template>

<script>
import ScreenPopup from '../components/screening-popup'
// 1 违章查询  2 违章缴费记录  3 罚单代缴记录
export default {
    data() {
        return {
            violationItemBGC: {     // item项背景颜色
                1: 'viola-query-detail',    // 可处理
                2: 'viola-query-detail',    // 处理中
                3: 'viola-query-detail pay-record-completed',    // 已完成
                4: 'viola-query-detail violation-query-nothandle'  // 不可处理
            },
            carmessage: {},
            violaList: [],
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
            type: 1,
            Listtype: {
                1: '违章查询',
                2: '违章缴费记录',
                3: '罚单代缴记录'
            }
        }
    },
    mounted() {
        if (this.$route.query.type == 1) {
            this.carmessage = {
                plateNumber: this.$route.query.plateNumber || this.$route.query.carmessage.plateNumber || '',
                storeOuCode: this.$store.state.globalConfig.trafficStoreOuCode
            }
            this.getTrafficFines(this.carmessage)
        } else if (this.$route.query.type == 3) {
            this.goPayRecord()
        }
        this.type = this.$route.query.type

    },
    methods: {
        changeDataType(data) {
            if (data) {
                return JSON.parse(data)
            } else {
                return {}
            }
        },
        goBack() {
            if (this.type == 2) {
                this.type = 1
                this.violaList = []
                this.getTrafficFines(this.carmessage)
            } else {
                this.$router.go(-1)
            }
        },
        getTrafficFines(carmessage) {
            this.$request.post('/app/json/fee_life_order/queryTrafficFines', carmessage).then(res => {
                if (res.status == 0) {
                    this.violaList = res.data.trafficQueryResult.trafficViolationList
                }
            })
        },
        goPayRecord(timeData) {
            this.violaList = []
            console.log(this.type)
            if (this.type == 1) {
                this.type = 2
            }
            let violaOrder = {
                orderType: '205004',
                page: { "index": 0, "pageSize": 20 },
                productType: this.$route.query.type == 3 ? 505 : 504
            }
            // 获取订单列表
            this.queryOrderFun(violaOrder)
        },
        // 筛选时间返回的结果
        screenChild(data) {
            console.log(data)
            let violaOrder = {
                orderType: '205004',
                page: { "index": 0, "pageSize": 20 },
                paidTime: data[0] + 'TO' + data[1],
                state: data[2] == 1 ? 9 : '',
                productType: this.$route.query.type == 3 ? 505 : 504
            }
            // 获取订单列表
            this.queryOrderFun(violaOrder)
        },
        queryOrderFun(data) {
            this.$request.post('/app/json/fee_life_order/queryOrder', data).then(res => {
                if (res.status == 0) {
                    this.violaList = res.data.orderList
                }
            })
        },
        // item项点击详情
        itemDetailsFun(item, index) {
            if (this.type == 1) {
                item = JSON.stringify(item)
            } else {
                item = item.orderExtendData
            }
            this.$router.push({ path: '/violation-details', query: { type: this.type, carmessage: JSON.stringify(this.carmessage), violaDetail: item, id: this.violaList[index].id } })
        }
    },
    components: {
        ScreenPopup
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.violation-query-index {
    background-color: #F2F2F4 !important;

    .no-list {
        padding-top: 120px;
        text-align: center;

        p {
            padding: 10px;
            font-size: 16px;
        }

        .go-payrecord {
            color: #1393DE;
        }
    }

    .go-pay-record {
        font-size: 14px;
        margin-right: 15px;
        text-align: right;
    }

    .violation-query-content {
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        padding: 10px 10px;

        .violation-query-tips {
            padding: 10px;
            background-color: #FFF8E5;
            color: #FFC637;
            border-radius: 5px;
        }

        .violation-query-list {
            margin-top: 10px;

            .violation-query-item {
                margin-bottom: 10px;

                // 缴费时间
                .payRecord-time {
                    padding: 10px;
                }

                .viola-query-detail {
                    background-color: #fff;
                    border-radius: 5px;

                    .item-violation-details {
                        padding: 10px;
                        position: relative;
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;

                        &:after {
                            content: '';
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            -webkit-transform: scaleY(0.5);
                            transform: scaleY(0.5);
                            -webkit-transform-origin: 0 0;
                            transform-origin: 0 0;
                            pointer-events: none;
                            box-sizing: border-box;
                            border: 0 solid #D6D6D6;
                            border-bottom-width: 1px;
                        }

                        .violation-left {
                            max-width: 80%;

                            .violation-text {
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }

                            div {
                                line-height: 20px;
                                color: #676767;
                            }

                            .violation-address {
                                font-weight: bold;
                                color: #3C3C3C;
                                font-size: 14px;
                            }
                        }
                    }

                    .item-violation-price {
                        padding: 10px;
                        display: flex;
                        justify-content: space-between;
                        color: #1FA4F0;
                    }
                }

                .violation-query-nothandle {
                    background-color: #ddd;
                }

                .pay-record-completed {
                    background-color: #BFDEF0;
                }
            }
        }
    }
}
</style>

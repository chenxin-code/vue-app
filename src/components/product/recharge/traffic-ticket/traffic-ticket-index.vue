<template>
    <div class="traffic-ticket-index">
        <nav-top title="违章缴费" @backEvent="$router.go(-1)"></nav-top>
        <nav-content class="index">
            <div class="traffic-banner">
                <img src="./assets/image/banner@2x.png" alt>
            </div>
            <div class="violation-ticket-content" @click="violationTicketFun">
                <div class="table-view">
                    <div class="table-view-cell">
                        <div class="table-view-cell-text">
                            <div class="viola-ticket">
                                <img class="img" src="./assets/image/icon1@2x.png" width="35" alt>
                                罚单代缴
                            </div>
                            <div class="table-view-cell-arrow"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tarffic-order">
                <div class="title">
                    <div class="left">我的罚单：</div>
                    <div class="right">
                        <p v-if="!carList" class="warningText">您当前还未绑定车辆,请先绑定车辆</p>
                    </div>
                </div>
                <div class="violation-ticket-content" @click="addCarFun">
                    <div class="table-view">
                        <div class="table-view-cell">
                            <div class="table-view-cell-text">
                                <div class="viola-ticket">
                                    <img
                                        class="img"
                                        src="./assets/image/addicon.png"
                                        width="35"
                                        alt
                                    >
                                    车辆新增
                                </div>
                                <div class="table-view-cell-arrow"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tarffic-order-list">
                    <div class="mycar-item" v-for="(item,index) in carList" :key="index">
                        <div class="car-message">
                            <div class="car-message-number">{{item.plateNum}}</div>
                            <div class="car-message-code">车辆识别代码：{{item.vin}}</div>
                        </div>
                        <div class="car-operation">
                            <div class="red" @click="ViolationQueryFun(item)">
                                违章
                                <br>查询
                            </div>
                            <!-- <div class="blue" @click="editViolaFun(item)">编辑</div> -->
                        </div>
                    </div>
                </div>
            </div>
        </nav-content>
    </div>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex'

export default {
    data() {
        return {
            carList: [],
        }
    },
    mounted() {
        // this.$request.post('/app/json/user/getVehicleListByUserId').then(res => {
        //     if (res.status == 0) {
        //         this.carList = res.data
        //     }
        // })
        this.$request.post('/app/json/user/getVehicleListByUserId').then(res => {
            if (res.status == 0) {
                this.carList = res.data
            }
        })
    },
    methods: {
        addCarFun() {
            this.setIdentifyState(this.$assign({}, this.identifyState, {
                plateNum: '', // 车牌号
                imageUrl: '', // 行驶证首页url
                ownerName: '', // 所有人姓名
                vin: '', // 车辆识别代号
                engineNum: '', // 发动机号
                vehType: '', // 车辆类型
                brand: '', // 品牌车系
                brandModel: '', // 车型
                vehColor: '' // 车辆颜色
            }))
            this.$bridgefunc.vuexStorage()
            this.$router.push({ path: '/bind-car'})
        },
        ViolationQueryFun(val) {
            this.$router.push({ path: '/violation-query', query: { plateNumber: val.plateNum, type: 1 } })
        },
        violationTicketFun() {
            this.$router.push({ path: '/violation-ticket' })
        },
        editViolaFun(item) {
            this.$router.push({ path: '/bind-car', query: { fromTicket: true } })
        },
        ...mapMutations(['setIdentifyState'])
    },
    computed: {
      ...mapGetters(['identifyState'])
    },
    components: {}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.traffic-ticket-index {
    background-color: #F2F2F4 !important;

    .index {
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;

        .traffic-banner {
            img {
                padding: 10px 0;
                width: 100%;
            }
        }

        .violation-ticket-content {
            padding: 10px;
            font-size: 16px;

            .viola-ticket {
                display: flex;
                align-items: center;
                justify-content: space-between;
                // padding: 10px 10px;
                background-color: #fff;
                border-radius: 5px;
                // font-weight: bold;

                img {
                    margin-right: 10px;
                }
            }
        }

        .tarffic-order {
            .title {
                padding: 10px 10px;
                font-size: 16px;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .right {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .warningText {
                        font-size: 12px;
                        color: #FF9700;
                    }
                }
            }

            .tarffic-order-list {
                padding: 0 10px;

                .mycar-item {
                    padding: 10px 10px;
                    margin-bottom: 10px;
                    background-color: #fff;
                    height: 80px;
                    width: 100%;
                    border-radius: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .car-message {
                        .car-message-number {
                            font-size: 14px;
                            font-weight: bold;
                        }

                        div {
                            line-height: 25px;
                        }
                    }

                    .car-operation {
                        display: flex;
                        justify-content: space-between;
                        color: #fff;
                        line-height: 14px;

                        div {
                            width: 50px;
                            height: 50px;
                            border-radius: 50%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-right: 8px;
                            font-size: 12px;
                        }

                        .red {
                            background-color: #FE0018;
                        }

                        .blue {
                            background-color: #009DF8;
                        }
                    }
                }
            }
        }
    }
}
</style>

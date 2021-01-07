<template>
    <div id="addCard" class="home-page-index">
        <nav-top title="加油卡列表" @backEvent="$router.go(-1)">
            <div class="binding-records" @click="goBindingRecords">绑定记录</div>
        </nav-top>
        <nav-content class="home-page-content">
            <div class="add-card-btn" @click="addCardBtn">
                <p>添加本人其他加油卡</p>
                <van-icon name="add" color="#FF011A" size="20px" />
            </div>
            <div class="card-list">
                <div class="card-item" v-for="(item,index) in cardListArr" :key="index">
                    <div>
                        <div class="item-bgcolor-red"></div>
                        <div class="item-content">
                            <div class="item-content-title">
                                <div class="table-view">
                                    <div class="table-view-cell">
                                        <van-collapse v-model="activeNames">
                                            <van-collapse-item :name="index">
                                                <div slot="title" class="item-content-title-news">
                                                    <div style="display: flex;align-items: center;">
                                                        <img src="./image/logo@2x.png" alt width="30" />
                                                        <!-- <span v-if="item.cardtype != '03'"
                                                            style="margin-left:10px;">单位卡{{`${item.ispricard == 1 ? '(主卡)' : '(副卡)'}`}}</span>
                                                        <span style="margin-left:10px;" v-else>个人卡</span> -->
                                                        <!-- <span>{{item.cardTypeName}}-{{`${item.ispricard == 1 ? '(主卡)' : '(副卡)'}`}}</span> -->
                                                        <span>
                                                            {{item.cardtype != '01' && item.cardtype != '02' ? '个人卡' : '单位卡'}}</span>
                                                        <span
                                                            v-if="item.cardtype == '01' || item.cardtype == '02'">{{`${item.ispricard == 1 ? '(主卡)' : '(副卡)'}`}}</span>
                                                    </div>
                                                    <p>{{item.cardno | jiami}}</p>
                                                </div>

                                                <div class="table-view content-show">
                                                    <div class="table-view-cell">
                                                        <div class="table-view-cell-text">
                                                            <div class="left">
                                                                <img src="./image/zje.png" alt width="30" />
                                                                总金额
                                                            </div>
                                                            <div class="right">{{item.totalbalance || 0}}元</div>
                                                        </div>
                                                    </div>
                                                    <div class="table-view-cell">
                                                        <div class="table-view-cell-text">
                                                            <div class="left">
                                                                <img src="./image/bfj.png" alt width="30" />
                                                                备付金(圈存)
                                                            </div>
                                                            <div class="right">{{item.prebalance || 0}}元</div>
                                                        </div>
                                                    </div>
                                                    <div class="table-view-cell">
                                                        <div class="table-view-cell-text">
                                                            <div class="left">
                                                                <img src="./image/kyye.png" alt width="30" />
                                                                可用余额
                                                            </div>
                                                            <div class="right">{{item.balance || 0}}元</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </van-collapse-item>
                                        </van-collapse>
                                    </div>
                                </div>
                            </div>
                            <div class="item-content-nav">
                                <p @click="goRouters('/recharge', item, index)" v-if="item.ispricard != '0'">充值</p>
                                <p @click="gotoquery(1,item.cardno)" v-if="item.ispricard != '0'">充值查询</p>
                                <!-- <p v-if="item.cardtype == '01' || item.cardtype == '02'">消费</p> -->
                                <p @click="gotoquery(2,item.cardno)">消费查询</p>
                                <p @click="goRouters('/oilMoney',item, index)">油卡积分</p>
                                <p @click="goRouters('/oilmoneyDistribution', item)"
                                    v-if="item.cardtype == '01' || item.cardtype == '02' && item.ispricard == 1 && showOilMoney">
                                    分配油币
                                </p>
                                <p @click="goRouters('/subCardList',item)"
                                    v-if="item.cardtype == '01' || item.cardtype == '02' && item.ispricard == 1">副卡列表
                                </p>
                                <span @click="handleUnBind(item)">解绑</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav-content>

        <!--  -->
        <van-popup v-model="CardTypePopup" round position="bottom" :style="{ height: '40%' }">
            <div class="card-type">
                <p class="title">卡类型选择:</p>
                <div class="type-list">
                    <span v-for="(item, index) in cardTypeList" :key="index"
                        @click="handleCardType(item)">{{item.title}}</span>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
import { Dialog } from 'vant';
export default {
    filters: { //监听加密卡号
        jiami(bankNumber) {
            return bankNumber.substr(0, 4) + "****" + bankNumber.substr(-4);
        }
    },
    data() {
        return {
            CardTypePopup: false,
            activeNames: ['1'],
            cardListArr: [],

            cardTypeList: [
                {
                    title: '个人加油卡',
                    type: 0
                }, {
                    title: '单位加油卡',
                    type: 1
                }
            ],
            showOilMoney: false
        }
    },
    mounted() {
        this.getCardList()
        this.$request.post('/app/json/enterprise_card/queryAppConfig').then(res => {
            if (res.status == 0) {
                if (res.data == 0) {
                    this.showOilMoney = false
                } else {
                    this.showOilMoney = true
                }
            } else {
                this.$Toast(res.info)
            }
        })
    },
    methods: {
        goRouters(url, item, index, status = '') {
            console.log(item)
            this.$router.push({
                path: url,
                query: {
                    cardNo: item.cardno,
                    usercard: item.cardno,
                    mindex: index,
                    status: status
                }
            })
        },
        // 充值查询,交易查询
        gotoquery(index, cardno) {
            this.$router.push({
                path: '/chongquerys',
                query: {
                    key: index,
                    cardno: cardno
                }
            })
        },
        addCardBtn() {
            this.CardTypePopup = true
        },
        handleCardType(item) {
            let url = '/refuelingCard'
            if (item.type == '1') {
                url = '/bindUnitCard'
            }
            this.$router.push({ path: url })
        },

        // 绑卡记录
        goBindingRecords() {
            this.$router.push('/bindCardRecord')
        },
        getCardList() {
            // this.$request.post('/app/json/enterprise_card/getCardInfoList', this.bindingData).then(res => {
            //     if (res.status == 0) {
            //         this.cardListArr = res.data.cardAcctList || []
            this.$request.post('/app/json/card/getCardInfoList', this.bindingData).then(res => {
                if (res.status == 0) {
                    // let cardList = res.data.cardAcctList || []
                    // this.cardListArr = this.cardListArr.concat(cardList)
                    this.cardListArr = res.data.cardAcctList || []
                    if (this.cardListArr.length > 0) {
                        this.addCardDialog = false
                    }
                } else {
                    this.$Toast(res.info)
                }
            })
            //     } else {
            //         this.$Toast(res.info)
            //     }
            // })
        },
        //  解绑
        handleUnBind(item) {
            Dialog.confirm({
                title: '提示',
                message: '确定解绑当前加油卡么?'
            }).then(() => {
                let unbindUrl = ''
                let params = {}
                if (item.flag == 1) {
                    unbindUrl = '/app/json/enterprise_card/unbindEnterpriseCard'
                    params.cardNo = item.cardno
                } else {
                    unbindUrl = '/app/json/card/unbindCard'
                    params.cardno = item.cardno
                }
                this.$request.post(unbindUrl, params).then(res => {
                    if (res.status == 0) {
                        this.getCardList()
                    } else {
                        this.$Toast(res.info)
                    }
                })
            })
        }

    },
}
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
.home-page-index {
    .binding-records {
        font-size: 14px;
        margin-right: 15px;
        text-align: right;
    }

    .home-page-content {
        padding: 10px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;

        .add-card-btn {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 48px;
            padding: 10px;
            border-radius: 10px;
            box-shadow: 1px 3px 6px #f8f8f8;

            p {
                font-size: 16px;
            }
        }

        .card-list {
            margin-top: 10px;

            .card-item {
                // position: relative;
                margin-bottom: 15px;

                .item-bgcolor-red {
                    background-color: #ff001a;
                    height: 30px;
                    border-radius: 10px;
                    width: 100%;
                    z-index: 1;
                }

                .item-content {
                    box-shadow: 1px 3px 5px #f8f8f8;
                    border-radius: 10px;
                    z-index: 2;
                    margin-top: -25px;

                    .item-content-title {
                        .table-view-cell {
                            padding: 10px 0px;
                        }

                        .item-content-title-news {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;

                            img {
                                margin-right: 10px;
                            }
                        }

                        .content-show {
                            .left {
                                display: flex;
                                align-items: center;

                                img {
                                    margin-right: 10px;
                                }
                            }

                            .right {
                                color: red;
                            }
                        }
                    }

                    .item-content-nav {
                        height: 50px;
                        width: 100%;
                        overflow-x: scroll;
                        overflow-y: hidden;
                        white-space: nowrap;

                        p, span {
                            display: inline-block;
                            padding: 3px 15px;
                            line-height: 50px;
                            position: relative;
                        }

                        p:after {
                            content: '';
                            width: 0.026667rem;
                            height: 0.533333rem;
                            background: #ccc;
                            display: inline-block;
                            position: absolute;
                            right: 0;
                            top: 50%;
                            margin-top: -13px;
                        }
                    }
                }
            }
        }
    }

    .card-type {
        .title {
            font-size: 16px;
            padding: 10px;
        }

        .type-list {
            text-align: center;
            margin-top: 20%;

            span {
                border: 1px solid #ccc;
                padding: 7px 45px;
                border-radius: 10px;
                display: inline-block;
                font-size: 14px;
                margin-bottom: 20px;
                width: 51%;
            }

            .active {
                border-color: red;
                color: red;
            }
        }
    }
}

/deep/ .van-popup--bottom {
    border-radius: 15px 15px 0 0;
}

/deep/ .van-tabs__wrap {
    height: 50px;
}
</style>
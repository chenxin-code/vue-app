<template>
    <div id="addCard" class="home-page-index">
        <nav-top title="副卡列表" @backEvent="$router.go(-1)"></nav-top>
        <nav-content class="home-page-content">
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
                                                        <span style="margin-left:10px;">单位卡(副)</span>
                                                    </div>
                                                    <!-- <p>{{item.cardno|jiami}}</p> -->
                                                    <p>{{item.cardno}}</p>
                                                </div>

                                                <div class="table-view content-show">
                                                    <div class="table-view-cell">
                                                        <div class="table-view-cell-text">
                                                            <div class="left">
                                                                <img src="./image/phone.png" alt width="30" />
                                                                手机号
                                                            </div>
                                                            <div class="right">{{item.telephone}}</div>
                                                        </div>
                                                    </div>

                                                    <div class="table-view-cell">
                                                        <div class="table-view-cell-text">
                                                            <div class="left">
                                                                <img src="./image/sqsj.png" alt width="30" />
                                                                申请时间
                                                            </div>
                                                            <div class="right">{{item.approveDate}}</div>
                                                        </div>
                                                    </div>

                                                    <div class="table-view-cell">
                                                        <div class="table-view-cell-text">
                                                            <div class="left">
                                                                <img src="./image/qyfh.png" alt width="30" />
                                                                权益返还路径
                                                            </div>
                                                        </div>

                                                        <div class="table-view-cell-text p50">
                                                            <div class="left">
                                                                <p class="w40"></p>
                                                                油币
                                                            </div>
                                                            <div class="right youbi-back">
                                                                <p>{{item.oilMoney == 1 ? '单位主卡' : item.oilMoney == 2 ? '单位副卡' : ''}}
                                                                </p>
                                                                <van-icon
                                                                    v-if="item.bindState == 3 || item.bindState == 1"
                                                                    name="weapp-nav"
                                                                    @click="handleBackCard(index, item)" />
                                                            </div>
                                                        </div>
                                                        <div class="table-view-cell-text p50">
                                                            <div class="left">
                                                                <p class="w40"></p>
                                                                积分
                                                            </div>
                                                            <div class="right">单位副卡</div>
                                                        </div>
                                                        <div class="table-view-cell-text p50">
                                                            <div class="left">
                                                                <p class="w40"></p>
                                                                电子券
                                                            </div>
                                                            <div class="right">单位副卡</div>
                                                        </div>
                                                        <div class="table-view-cell-text p50">
                                                            <div class="left">
                                                                <p class="w40"></p>
                                                                成长值
                                                            </div>
                                                            <div class="right">单位副卡</div>
                                                        </div>
                                                    </div>

                                                    <div class="table-view-cell">
                                                        <div class="table-view-cell-text opinion">
                                                            <div class="left">
                                                                <img src="./image/shyj.png" alt width="30" />
                                                                审核意见
                                                            </div>
                                                            <div>
                                                                <input type="textarea" class="opinion-inp"
                                                                    :disabled="item.bindState != 3"
                                                                    v-model="item.opinion" placeholder="请输入审核意见" name
                                                                    id />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </van-collapse-item>
                                        </van-collapse>
                                    </div>
                                </div>
                            </div>
                            <div class="item-content-nav">
                                <div class="item-nav-left" v-if="item.bindState == 3">
                                    <p style="width:15%" @click="handleExamine(item, 0)">拒绝</p>
                                    <span></span>
                                    <p style="width:15%" @click="handleExamine(item, 1)">通过</p>
                                </div>
                                <div class=" item-nav-left" v-else>
                                    <p @click="unbindCard(item)">
                                        {{bindStateList[item.bindState]}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav-content>

        <!--  -->
        <van-popup v-model="CardTypePopup" round position="bottom" :style="{ height: '40%' }">
            <div class="card-type">
                <p class="title">权益返回路径选择:</p>
                <div class="type-list">
                    <span :class="cardTypeIndex == index ? 'active' : ''" v-for="(item, index) in cardTypeList"
                        :key="index" @click="handleCardType(item, index)">{{item.title}}</span>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
import { Dialog } from 'vant';
export default {
    // filters: { //监听加密卡号
    //   jiami(bankNumber) {
    //     return bankNumber.substr(0, 4) + "****" + bankNumber.substr(-4);
    //   }
    // },
    data() {
        return {
            bindStateList: {
                1: '解绑',
                3: '通过',
                4: '管理员审核中',
                5: '审核未通过',
                6: '管理员审核未通过'
            },
            // 1(显示解绑按钮) 3(显示通过、拒绝按钮) 4(管理员审核中) 5(审核未通过) 6(管理员审核未通过)
            CardTypePopup: false,
            activeNames: ['1'],
            oilMoneyState: '',
            cardListArr: [],

            cardTypeList: [{
                title: '单位主卡',
                type: 1
            }, {
                title: '单位副卡',
                type: 2
            }],
            cardTypeIndex: 0,

            cardNo: '',
            cardListIndex: '',
            cardBindState: '',
            subCardno: ''
        }
    },

    mounted() {
        this.cardNo = this.$route.query.cardNo
        this.getCardList()
    },
    methods: {
        // 返还路径选择
        handleBackCard(index, item) {
            this.cardListIndex = index
            this.CardTypePopup = true
            this.cardBindState = item.bindState
            this.subCardno = item.cardno
        },
        handleCardType(item, index) {
            if (this.cardBindState == 1) {
                let params = {
                    cardNo: this.subCardno,
                    oilMoney: item.type,
                    integral: 2,
                    coupon: 2,
                    growth: 2
                }
                this.$request.post('/app/json/enterprise_card/updateDeputyCardInfo', params).then(res => {
                    if (res.status == 0) {
                        this.$Toast('权益返还路径修改成功')
                    } else {
                        this.$Toast(res.info)
                    }
                })
            }
            this.CardTypePopup = false
            this.cardTypeIndex = index
            this.$set(this.cardListArr[this.cardListIndex], 'oilMoney', item.type)
            // this.cardListArr[this.cardListIndex].oilMoney = item.type
        },
        getCardList() {
            this.$request.post('/app/json/enterprise_card/deputyCardList', { cardNo: this.cardNo }).then(res => {
                if (res.status == 0) {
                    this.cardListArr = res.data || []
                } else {
                    this.$Toast(res.info)
                }
            })
        },
        // 解绑
        unbindCard(item) {
            if (item.bindState == 1) {
                Dialog.confirm({
                    title: '提示',
                    message: '确定解绑当前加油卡么?'
                }).then(() => {
                    this.$request.post('/app/json/enterprise_card/unbindEnterpriseCard', { cardNo: item.cardno }).then(res => {
                        if (res.status == 0) {
                            this.getCardList()
                        } else {
                            this.$Toast(res.info)
                        }
                    })
                })

            }
        },
        handleExamine(item, state) {
            if (item.oilMoney == '') {
                this.$Toast('请选择油币返还路径')
                return
            }
            if (item.opinion == '') {
                this.$Toast('请填写审核意见')
                return
            }
            let params = {
                oilMoney: item.oilMoney,
                integral: 2,
                coupon: 2,
                growth: 2,
                cardNo: item.cardno,
                opinion: item.opinion
            }
            let url = '/app/json/enterprise_card/auditDeputyCardPass' // 通过
            if (state == 0) {
                url = '/app/json/enterprise_card/auditDeputyCardReject' // 拒绝
            }
            console.log(params)
            this.$request.post(url, params).then(res => {
                if (res.status == 0) {
                    this.getCardList()
                } else {
                    this.$Toast(res.info)
                }
            })
        }
    },
}
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
.w40 {
    width: 40px;
}

.p50 {
    padding: 5px 0;
}

.table-view-cell {
    .opinion {
        display: block;

        .opinion-inp {
            margin: 8px 0;
            padding: 10px;
            background: #f3f3f3;
            width: 100%;
            border-radius: 8px;
        }
    }
}

.youbi-back {
    display: flex;
    align-items: center;

    p {
        margin-right: 10px;
    }
}

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
                        }

                        .content-show {
                            .left {
                                display: flex;
                                align-items: center;

                                img {
                                    margin-right: 10px;
                                }
                            }
                        }
                    }

                    .item-content-nav {
                        line-height: 50px;
                        height: 50px;
                        display: flex;
                        justify-content: space-between;
                        // align-items: center;
                        font-size: 14px;

                        .item-nav-left {
                            display: flex;
                            justify-content: flex-end;
                            align-items: center;
                            flex: 1;

                            p {
                                width: 35%;
                                text-align: center;
                            }
                        }

                        span {
                            width: 1px;
                            height: 65%;
                            content: '';
                            display: inline-block;
                            background: #f0f0f0;
                        }
                    }
                }
            }
        }
    }

    .card-type {
        .title {
            font-size: 16px;
            padding: 15px;
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
</style>
<template>
    <div class="oil-money-index">
        <nav-top title="油币分配" @backEvent="$router.go(-1)"></nav-top>
        <nav-content class="oil-money-content">
            <div class="oil-money-number mb20">
                <img src="./image/bg1@2x.png" alt="" width="100%">
                <div>
                    <p class="oil-number">{{cardOilMoney}}</p>
                    <p>当前油币</p>
                </div>
            </div>
            <div class="distribution mb20">
                <div class="distri-number mb20 bshadow">
                    <p>单张分配数量:</p>
                    <input type="text" v-model="oilMoneyNumber" name="" id="" placeholder="请输入油币数量"
                        @input="handleInpChange">
                </div>
                <div class="distri-card bshadow">
                    <van-checkbox v-model="checked" @click="handleCheckAll" checked-color="red">选择需要分配的副卡
                    </van-checkbox>
                    <div class="check-card-list">
                        <van-checkbox class="check-card-item" v-for="(item, index) in cardListArr" :key="index"
                            checked-color="red" v-model="item.check" @change="handleCheck($event, index)">
                            <div class="card-info">
                                <img src="./image/logo@2x.png" alt="" height="30">
                                <div>
                                    <p class="cardno">{{item.cardno}}</p>
                                    <p class="phone">{{item.telephone}}</p>
                                </div>
                            </div>
                        </van-checkbox>
                    </div>
                </div>
            </div>
            <div class="distri-btns">
                <p class="total">分配总额: <span>{{oilMoneyNumberTotal}}</span></p>
                <p class="btn" @click="handleDistribution">立即分配</p>
            </div>
        </nav-content>
    </div>
</template>
<script>
export default {
    data() {
        return {
            cardOilMoney: 200,
            checked: false,
            checkboxData: ['a', 'b'], // 选择分配的卡
            ischeckAll: false,
            cardListArr: [
                {
                    cardno: 1,
                    telephone: 1,
                    check: false
                }, {
                    cardno: 2,
                    telephone: 2,
                    check: false
                }, {
                    cardno: 3,
                    telephone: 3,
                    check: false
                }
            ], // 副卡列表
            cardNo: '',
            checkedCardList: [],
            oilMoneyNumber: '',
            oilMoneyNumberTotal: 0
        }
    },
    mounted() {
        this.cardNo = this.$route.query.cardNo
        this.getOilMoneyData()
    },
    methods: {
        // 获取副卡
        getOilMoneyData() {
            let url = '/app/json/enterprise_card/sendOilMainPage'
            this.$request.post(url, { cardNo: this.cardNo }).then(res => {
                if (res.status == 0) {
                    this.cardListArr = res.data.deputyCardList
                    this.cardOilMoney = res.data.oilBalance
                    this.cardListArr.forEach(item => {
                        this.$set(item, 'check', false)
                    });
                } else {
                    this.$Toast(res.info)
                }
            })
        },
        handleInpChange() {
            this.getOilMoneyTotal()
        },
        // 全选
        handleCheckAll() {
            let a = !this.checked
            this.cardListArr = this.cardListArr.map(item => {
                item.check = a
                return item
            })
        },
        handleCheck(item, index) {
            let a = true
            this.cardListArr.forEach(item => {
                if (item.check === false) {
                    a = false
                }
            });
            this.checked = a
            if (item) {
                this.checkedCardList.push(this.cardListArr[index])
            } else {
                this.checkedCardList.forEach((item, index1) => {
                    if (item.cardno == this.cardListArr[index].cardno) {
                        this.checkedCardList.splice(index1, 1)
                    }
                });
            }
            this.getOilMoneyTotal()
        },
        getOilMoneyTotal() {
            this.oilMoneyNumberTotal = this.checkedCardList.length * this.oilMoneyNumber
        },
        handleDistribution() {
            let cardArr = []
            this.checkedCardList.forEach(item => {
                cardArr.push(item.cardno)
            });
            let params = {
                cardNo: this.cardNo,
                deputyCardList: JSON.stringify(cardArr),
                sendNum: this.oilMoneyNumber
            }

            this.$request.post('/app/json/enterprise_card/sendOilMoney', params).then(res => {
                if (res.status == 0) {
                    this.$Toast('油币分配完成')
                    this.getOilMoneyData()
                } else {
                    this.$Toast(res.info)
                }
            })
        }
    },
}
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
.mb20 {
    margin-bottom: 20px;
}

.oil-money-index {
    height: 100%;

    .oil-money-content {
        .oil-money-number {
            display: flex;
            align-items: center;
            text-align: center;

            div {
                position: absolute;
                width: 100%;
                font-size: 14px;
                color: #fff;

                .oil-number {
                    font-size: 30px;
                    margin-bottom: 3px;
                    color: #efda45;
                }
            }
        }

        .distribution {
            padding: 10px;

            .bshadow {
                box-shadow: 0px 0px 5px #ccc;
                border-radius: 6px;
                font-size: 14px;
            }

            .distri-number {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 10px;

                input {
                    text-align: right;
                    flex: 1;
                }
            }

            .distri-card {
                padding: 10px;

                .check-card-list {
                    height: 200px;
                    overflow-y: scroll;

                    .check-card-item {
                        margin-top: 15px;

                        .card-info {
                            border: 1px solid #ebebeb;
                            width: 100%;
                            border-radius: 6px;
                            display: flex;
                            align-items: center;
                            padding: 5px 10px;

                            img {
                                margin-right: 10px;
                            }

                            .phone {
                                font-size: 12px;
                            }
                        }
                    }
                }
            }
        }

        .distri-btns {
            height: 12%;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;

            .total {
                text-align: center;
            }

            .btn {
                position: absolute;
                bottom: 10px;
                left: 10px;
                right: 10px;
                background: red;
                height: 40px;
                border-radius: 20px;
                line-height: 40px;
                text-align: center;
                font-size: 14px;
                color: #fff;
            }
        }
    }
}

/deep/ .van-checkbox__label {
    width: 100%;
}
</style>
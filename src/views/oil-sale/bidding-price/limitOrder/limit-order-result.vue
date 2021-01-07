<template>
    <div>
        <nav-top title="抢单结果" @backEvent="$router.go(-1)"></nav-top>
        <nav-content class="limitOrder-index">
            <div class="orderResult-content">
                <div class="grabsheet-tips">
                    <p>恭喜您抢单成功!</p>
                    <!-- <p v-for="(item, index) in grabDetailsArr" :key="index">油品单价为¥<span>{{item.price}}</span>元/吨,
                        购买数量<span>{{item.tonnes}}</span>吨</p> -->
                </div>
                <div class="result-details boxShadow">
                    <div class="oilName disflex">
                        <p class="left">油品名称：</p>
                        <p class="right">{{resultData.matertialName}}</p>
                    </div>
                    <div class="oilName disflex">
                        <p class="left">购买数量：</p>
                        <p class="right">{{resultData.tonnes}}吨</p>
                    </div>
                    <div class="oilName disflex">
                        <p class="left">油品单价：</p>
                        <p class="right">{{resultData.price}}元/吨</p>
                    </div>
                    <div class="orderPrice disflex">
                        <p class="left">订单金额：</p>
                        <div class="right">
                            <p>{{resultData.payAmount}}元</p>
                            <div class="orderPrice-List" v-for="(item, index) in grabDetailsArr" :key="index">
                                <div class="price-item borderB">
                                    <p>油品单价：{{item.price}}元/吨</p>
                                    <p>油品数量：{{item.tonnes}}吨</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="oilName disflex">
                        <p class="left">订单编号：</p>
                        <p class="right">{{resultData.id}}</p>
                    </div>
                    <div class="oilName disflex">
                        <p class="left">下单时间：</p>
                        <p class="right">{{resultData.submitTime}}</p>
                    </div>

                    <div class="btns">
                        <p class="continue-grabSheet btn" @click="$router.go(-1)">继续抢单</p>
                        <p class="fillIn-address btn" @click="fillInAddressHandle">填写收货方式</p>
                    </div>
                </div>
            </div>
        </nav-content>
    </div>
</template>
<script>
export default {
    data() {
        return {
            cxf: true,
            resultData: {},
            grabDetailsArr: []
        }
    },
    mounted() {
        this.resultData = JSON.parse(this.$route.query.resultData)
        this.grabDetailsArr = JSON.parse(this.resultData.grabDetail)
    },
    methods: {
        fillInAddressHandle() {
            this.$router.push({
                path: '/bidding-confirmation-order',
                query: {
                    biddingData: JSON.stringify(this.resultData)
                }
            })
        }
    },
}
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~@/common/stylus/variable.styl';

.limitOrder-index {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    .boxShadow {
        border-radius: 5px;
        box-shadow: 0px 0px 5px #cecece;
        background: #fff;
    }

    .borderB {
        border-bottom: 1px solid #F1F1F1;
    }

    .orderResult-content {
        padding: 10px;

        .grabsheet-tips {
            font-size: 15px;
            font-weight: bold;
            padding: 0 10px 10px;

            p {
                display: inline-block;
            }

            span {
                font-size: 20px;
                color: #40baf5;
                font-weight: bold;
            }
        }

        .result-details {
            padding: 10px;

            .disflex {
                display: flex;
                justify-content: flex-start;
                font-size: 14px;
                padding: 6px 0;

                .left {
                    width: 80px;
                    color: #acacac;
                }
            }

            .orderPrice {
                .right {
                    flex: 1;
                }

                .orderPrice-List {
                    padding: 10px 0 0;
                    color: #868686;

                    .price-item {
                        p {
                            line-height: 25px;
                        }
                    }
                }
            }

            .btns {
                display: flex;
                justify-content: flex-end;
                padding: 10px 0;

                .btn {
                    padding: 6px 15px;
                    font-size: 14px;
                    border: 1px solid #ccc;
                    border-radius: 20px;
                    margin-left: 15px;
                }

                .fillIn-address {
                    color: #99D7F9;
                    border-color: #99D7F9;
                }
            }
        }
    }
}
</style>

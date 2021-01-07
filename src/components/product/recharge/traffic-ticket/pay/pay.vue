/**Created by liaoyingchao on 2018/11/10.*/

<template>
    <div class="index mall2">
        <nav-top @backEvent="backEvent" title="收银台"></nav-top>
        <nav-content>
            <div class="block-div">
                <div class="flex-row">
                    <div class="theme_font_common">
                        需支付：
                        <span class="font-small theme_font_red">￥</span>
                        <span class="price-z theme_font_red">{{payInfo.dpedData.integer}}</span>
                        <span
                            class="left-no-space font-small theme_font_red"
                        >.{{payInfo.dpedData.decimals}}</span>
                    </div>
                </div>
                <div class="flex-row">
                    <div class="theme_font_common">交易号：{{payInfo.tradeNo}}</div>
                </div>
                <!--<div class="money-icon">-->
                <!--<img src="static/image/mall2/pay-icon.png"/>-->
                <!--</div>-->
                <!--<div class="pay-info">-->
                <!--<div class="text theme_font_common">需支付</div>-->
                <!--<div class="amount theme_font_red">-->
                <!--<span>￥</span>-->
                <!--<span class="price-i">{{payInfo.dpedData.integer}}</span>-->
                <!--<span>.{{payInfo.dpedData.decimals}}</span>-->
                <!--</div>-->
                <!--</div>-->
            </div>
            <!--<div class="block-div">-->
            <!---->
            <!--</div>-->
            <div class="block-div">
                <div class="flex-row">
                    <div class="title">支付方式</div>
                </div>
                <div class="flex-row" v-for="(item, index) in payWay" :key="index" @click="payWaySelected(item)">
                    <div class="icon-div">
                        <img :src="item.icon">
                    </div>
                    <div class="full">{{item.text}}</div>
                    <div class="selected-mark">
                        <i
                            class="iconfont mall-weixuanzhong theme_font_tint"
                            v-if="selectedPayWay.payModeSub != item.payModeSub"
                        ></i>
                        <i
                            class="iconfont mall-xuanzhong theme_font_red"
                            v-if="selectedPayWay.payModeSub == item.payModeSub"
                        ></i>
                    </div>
                </div>
            </div>
            <div
                class="bottom-btn theme_font_white theme_standard_bg"
                @click="payEvent"
            >支付￥{{$util.toDecimal2(payInfo.payAmount)}}元</div>
        </nav-content>
    </div>
</template>

<script>
import payHelper from '@/utils/payHelper'

export default {
    name: "index",
    components: {},
    data() {
        return {
            payInfo: {},
            payWay: [],
            //是否已经调起了微信
            hasToPay: false,
            selectedPayWay: null,
            occurOuCode: ''
        }
    },
    methods: {
        backEvent: function () {
            this.$router.go(-1);
        },
        payWaySelected: function (item) {
            console.log(item)
            if (item.payModeSub == '') {
                this.$Toast("暂未开通！")
                return;
            }
            this.selectedPayWay = item
        },
        payEvent: function () {
            if (this.selectedPayWay == null) {
                this.$Toast("请选择支付方式！")
                return;
            }
            this.hasToPay = true;
            payHelper.trafficPayEvent(this.selectedPayWay, this.payInfo.orderType, this.payInfo.orderId).then(() => {
                this.enterSuccess();
            }).catch(() => {
                this.hasToPay = false;
            })
        },
        enterSuccess: function () {
            this.$router.replace({
                path: '/pay-success',
                query: {
                    selectedIndex: 1
                }
            });
        },
        async setPayWays() {
            this.payWay = await payHelper.getPayWays('200001', this.occurOuCode)
            if (this.payWay.length > 0) {
                this.selectedPayWay = this.payWay[0];
            }
        },
        checkPayResult: function () {
            this.$Loading.open();
            let url = '/app/json/app_shopping_order/detail';
            let paramsData = {
                token: this.$store.state.login.token,
                orderType: this.payInfo.orderType,
                orderId: this.payInfo.orderId,
            };
            this.$http.post(url, paramsData).then(
                res => {
                    this.$Loading.close();
                    let data = res.data;
                    if (data.status == 0 && data.data.state == 3) {
                        this.enterSuccess();
                    }
                },
                error => {
                    this.$Loading.close();
                }
            )
        }
    },

    created() {
        console.log(this.$route)
        this.occurOuCode = this.$route.params.occurOuCode ? this.$route.params.occurOuCode : ''
        this.payInfo = this.$route.params.payInfo ? this.$route.params.payInfo : {}
        this.$mallCommon.dataProcessing(this.payInfo);
        this.setPayWays();
    },
    mounted() {
        //从后台进前台的协议
        this.$bridgefunc.enterForegroundCallBack(() => {
            if (this.hasToPay) {
                this.hasToPay = false;
                this.checkPayResult();
            }
        })
    },
    activated() {

    },
    beforeRouteLeave(to, from, next) {
        this.$keepaliveHelper.deleteCache(this)
        next()
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.index {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .money-icon {
        margin-top: 20px;
        text-align: center;

        img {
            width: 40px;
            height: 40px;
        }
    }

    .pay-info {
        text-align: center;
        padding-bottom: 10px;

        .text {
            font-size: 16px;
            margin-top: 10px;
        }

        .amount {
            font-size: 12px;
            margin-top: 8px;

            .price-i {
                font-size: 18px;
                font-weight: 500;
                margin-right: -4px;
            }
        }
    }

    .icon-div {
        margin-right: 8px;

        img {
            width: 22px;
            height: 22px;
        }
    }

    .selected-mark {
        i {
            font-size: 18px;
        }
    }

    .bottom-btn {
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;
        text-align: center;
        padding: 16px;
        font-size: 18px;
        font-weight: 500;
    }
}
</style>

<template>
    <div class="viola-ticket-index">
        <nav-top title="罚单代缴" @backEvent="$router.go(-1)">
            <div
                v-if="componentName == 'ViolaTicketQuery'"
                class="go-pay-record"
                @click="ViolationQueryFun"
            >缴费记录</div>
        </nav-top>
        <nav-content class="viola-ticket-container">
            <div class="viola-ticket-content">
                <component ref="violaTicket" :violadetail="violadetail" :is="componentName"></component>
            </div>
            <div class="bill-btn">
                <div v-if="componentName != 'ViolaTicketQuery'">
                    <div class="agreement">
                        <van-checkbox v-model="checked"></van-checkbox>
                        <div>
                            同意
                            <a @click="showagreement">《违章代缴协议》</a>
                        </div>
                    </div>
                    <div
                        :class="checked ? 'btn-show' : 'btn-show btn-payment'"
                        @click="payment"
                        :disabled="checked"
                    >确认支付</div>
                </div>
                <div v-else class="btn-show" @click="bindBtn">立即查询</div>
            </div>
        </nav-content>
    </div>
</template>

<script>
import ViolaTicketQuery from './components/viola-ticket-query'
import ViolaTicketPayment from './components/viola-ticket-payment'
import { Dialog } from 'vant';
export default {
    data() {
        return {
            componentName: 'ViolaTicketQuery',
            checked: false,
            violadetail: {}
        }
    },
    methods: {
        bindBtn() {
            if (this.componentName == 'ViolaTicketQuery') {
                let violaData = this.$refs.violaTicket.violaData
                violaData.storeOuCode = this.$store.state.globalConfig.trafficStoreOuCode
                if(violaData.fine && violaData.penaltyDate && violaData.plateNumber && violaData.number){
                    this.$request.post('/app/json/fee_life_order/queryTrafficPenalty', violaData).then(res => {
                        if (res.status == 0) {
                            this.violadetail = res.data
                            this.componentName = 'ViolaTicketPayment'
                        }else{
                            this.$Toast('查询失败')
                        }
                    })
                }else{
                    this.$Toast('请将内容填写完整')
                }
                

            }
        },
        payment() {
            if (this.checked) {
                console.log(this.violadetail)
                let violaSubmitData = {
                    carts: [{
                        number: 1,
                        skuId: this.$store.state.globalConfig.trafficPenaltySkuId,
                        storeOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
                        checked: '1'
                    }],
                    rechargeNo: this.violadetail.number,
                    plateNumber: this.violadetail.plateNumber,
                    deliveryType: '2'
                }
                this.$request.post('/app/json/fee_life_order/submit', violaSubmitData).then(res => {
                    if (res.status == 0) {
                        this.$router.push({
                            name: 'violation-pay',
                            params: {
                                occurOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
                                payInfo: res.data
                            }
                        })
                    }else{
                        this.$Toast(res.info)
                    }
                })
            } else {
                this.$Toast('请同意"违章代缴协议"')
            }
        },
        showagreement() {
            this.$request.post('/app/json/news/getNewsList', { values: 19 }).then(res => {
                if (res.status == 0) {
                    Dialog.confirm({
                        title: res.data[0].title,
                        message: res.data[0].content
                    }).then(() => {

                    })
                }
            })
        },
        ViolationQueryFun() {
            this.$router.push({ path: '/violation-query', query: { type: 3 } })
        }
    },
    components: {
        ViolaTicketQuery,
        ViolaTicketPayment
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.viola-ticket-index {
    background-color: #F2F2F4 !important;

    .go-pay-record {
        font-size: 14px;
        margin-right: 15px;
        text-align: right;
    }

    .viola-ticket-container {
        padding: 10px;

        .viola-ticket-content {
            border-radius: 5px;
            background-color: #fff;
        }

        .bill-btn {
            position: fixed;
            bottom: 11px;
            left: 15px;
            right: 15px;
            text-align: center;
            font-size: 14px;

            .agreement {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 10px;

                div {
                    padding-left: 10px;

                    a {
                        color: #019CF0;
                    }
                }
            }

            .btn-show {
                border-radius: 20px;
                background: #009df8;
                padding: 13px 0;
                color: #fff;
                font-weight: bold;

                & + .btn-show {
                    margin-top: 10px;
                }
            }

            .btn-payment {
                background-color: #B5B5B7;
            }
        }
    }
}
</style>

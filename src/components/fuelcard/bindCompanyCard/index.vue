<template>
    <div class="home-page-index">
        <nav-top :title="pricard1Type == 'pricard1' ? '加油卡副卡绑定' : pricard1Type == 'otherProv' ? '外省卡绑定' : '加油卡绑定'" @backEvent="$router.go(-1)">
            <div class="binding-records" @click="goBindingRecords">绑定记录</div>
        </nav-top>
        <nav-content>
            <div class="bindcard">
                <div class="bindcard-number">
                    <div class="left">加油卡卡号:</div>
                    <div class="right">
                        <input type="text" v-model="cardNumber" placeholder="请输入加油卡卡号" />
                    </div>
                </div>
                <div class="bindcard-btns">
                    <div class="btn" @click="nextFun">下一步</div>
                </div>
            </div>
        </nav-content>
    </div>
</template>

<script>
import { Dialog } from 'vant';
export default {
    data() {
        return {
            activeNames: ['1'],
            addCardDialog: true,
            cardNumber: '', // 单位卡卡号
            cardListArr: [],
            pricard1Type: ''
        }
    },
    mounted() {
        console.log(this.$route.query)
        this.pricard1Type = this.$route.query.status
        this.cardNumber = ''
    },
    methods: {
        nextFun() {
            if (this.cardNumber && this.cardNumber.trim().length == 19) {
                if (this.pricard1Type == 'otherProv') {
                    this.$router.push({
                        path: '/binding-other-provinces',
                        query: { cardNo: this.cardNumber }
                    })
                } else {
                    this.$request.post('/app/json/enterprise_card/getCardInfoByCardNo', { cardNo: this.cardNumber }).then(res => {
                        if (res.status == 0) {
                            console.log(this.pricard1Type == 'pricard1')
                            if (this.pricard1Type == 'pricard1') {
                                if (res.data.ispricard == 1) {
                                    this.$Toast('只可绑定加油卡副卡')
                                } else {
                                    if (res.data.cardtype == '02' || res.data.cardtype == '04') {
                                        this.$router.push({
                                            path: '/binding-subcard', query: { cardData: JSON.stringify(res.data), isAdd: true, cardtype: res.data.cardtype }
                                        })
                                    } else {
                                        this.$Toast('只可绑定个人多用户副卡/单位多用户副卡')
                                    }
                                }
                            } else {
                                if (res.data.cardtype == '01' || res.data.cardtype == '02') {
                                    this.$router.push({
                                        path: '/binding-company-card', query: { cardData: JSON.stringify(res.data), isAdd: true }
                                    })
                                } else {
                                    this.$Toast('只可绑定单位卡')
                                }
                            }
                        } else {
                            this.$Toast(res.info)
                        }

                    })
                }
            } else {
                this.$Toast('请输入正确的卡号')
            }
        },
        goBindingRecords() {
            this.$router.push({
                path: '/binding-companyCard-record',
            })
        },
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.home-page-index {
    .binding-records {
        font-size: 14px;
        margin-right: 15px;
        text-align: right;
    }

    .bindcard {
        padding: 10px;
        font-size: 14px;

        .bindcard-number {
            line-height: 40px;
            box-shadow: 1px 3px 6px #eaeaea;
            padding: 0 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 7px;

            .right {
                flex: 1;
                margin-left: 10px;
            }
        }

        .bindcard-btns {
            margin-top: 50px;

            .btn {
                height: 40px;
                line-height: 40px;
                text-align: center;
                color: #Fff;
                background-color: red;
                border-radius: 20px;
            }
        }
    }
}
</style>

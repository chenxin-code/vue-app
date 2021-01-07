<template>
    <div id="chongquerys">
        <!-- 头部 -->
        <mt-header title="IC卡对账单">
            <mt-button icon="back" @click="backEvent" slot="left"></mt-button>
            <p class="history-record" slot="right" @click="gohistoryRecord">历史记录</p>
        </mt-header>
        <div class="conter">
            <div class="goaddcard chriqi">
                <p class="" @click="openPicker">查询日期</p>
                <!-- 日期选择 -->
                <ul class="mydate">
                    <li @click="openPicker">
                        <p class=""><span>{{startDate |zhuan}}</span></p>&nbsp;&nbsp;&nbsp;
                        <img src="static/image/fuelcard/bnt_drop-down.png" alt="" width="24px">
                    </li>
                    <p class="zhi">至</p>
                    <li @click="openPickers">
                        <p class=""><span>{{endDate | zhuan}}</span></p>&nbsp;&nbsp;&nbsp;
                        <img src="static/image/fuelcard/bnt_drop-down.png" alt="" width="24px">
                    </li>
                </ul>
            </div>
            <p class="tipSpecial">温馨提示：</p>
            <p class="tipSpecial" v-html="tipsData"></p>

            <p class="btn" @click="chaxun">查询</p>
        </div>
        <mt-datetime-picker ref="picker" :startDate="limitDate" :endDate="endDate" type="date" @confirm="startDateConfirm"
            v-model="startDate"></mt-datetime-picker>
        <mt-datetime-picker ref="picker2" :startDate="startDate" type="date" @confirm="endDateConfirm" v-model="endDate">
        </mt-datetime-picker>
    </div>
</template>
<script>
import { formatDate } from '../js/date.js';
import { Toast } from 'mint-ui';

let date = new Date()
let year = date.getFullYear() - 30
date.setFullYear(year)
export default {
    filters: {
        zhuan(s) {
            return formatDate(s, 'yyyy-MM-dd')
        }
    },
    data() {
        return {
            startDate: new Date, //初始起日期
            endDate: new Date, // 结束日期
            limitDate: date,
            tipsData: '',
            cardNo: ''
        }
    },
    created() {
        this.cardNo = this.$route.query.usercard
        console.log(this.cardNo)
        const limitDate = this.$store.state.globalConfig.oilCardQueryLimitDate || ''
        if (limitDate) {
            let date = new Date()
            let m = date.getMonth() - limitDate + 1
            date.setMonth(m)
            this.limitDate = date
        }
    },
    computed: {

    },
    mounted() {
        this.getTipsData()
    },
    methods: {
        getTipsData() {
            this.$request.post('/app/json/news/getNewsList', {
                values: 33
            }).then(res => {
                if (res.status === 0) {
                    this.tipsData = res.data[0] ? res.data[0].content : ''
                } else {
                    this.$Toast(res.info)
                }
            })
        },
        backEvent: function () {
            this.$router.go(-1)
        },
        openPicker() {
            this.$refs.picker.open();
        },
        openPickers() {
            this.$refs.picker2.open();
        },
        //转换时分秒
        startDateConfirm() {
            // console.log(formatDate(this.startDate,'yyyy-MM-dd'))
        },
        endDateConfirm() {
            // console.log(formatDate(this.endDate,'yyyy-MM-dd'))
        },
        chaxun() {
            let params = {
                cardno: this.cardNo,
                // cardno: '1000114600000935935',
                startDate: formatDate(this.startDate, 'yyyy-MM-dd'),
                endDate: formatDate(this.endDate, 'yyyy-MM-dd')
            }
            this.$request.post('/app/json/card/getCompStandingBookByDate', params).then(res => {
                if (res.status == 0) {
                    this.$router.push({
                        path: '/send-email',
                        query: {
                            pdfFileInfo: JSON.stringify(res.data.pdfFileInfo),
                            startDate: params.startDate,
                            endDate: params.endDate
                        }
                    })
                }
            })
        },
        gohistoryRecord() {
            this.$router.push({
                path: '/history-record'
            })
        }
    }
}
</script>

<style scoped>
.history-record {
    font-size: 14px;
}
.mint-header {
    margin-top: 0.693333rem;
}

#chongquerys {
    width: 100%;
    height: 100%;
    overflow: auto;
}

.mint-header {
    background: #fff;
    color: #000;
    height: 60px;
    font-size: 20px;
}
.tipSpecial {
    color: rgb(240, 44, 44);
    margin-top: 20px;
    padding: 10px 8px;
    padding-bottom: 0;
    line-height: 20px;
    font-size: 14px;
}
.mintui-back {
    font-size: 28px;
}

.conter {
    padding: 0 10px;
}

.tips {
    background: #fbf8d9;
    color: #e1782e;
    padding: 5px;
    text-align: center;
    width: 100%;
    margin-bottom: 10px;
}

.tips img {
    display: inline-block;
    width: 16px;
    vertical-align: middle;
}

.tips span {
    display: inline-block;
    font-size: 12px;
    vertical-align: middle;
    padding-left: 6px;
}

.jiayoyka {
    line-height: 30px;
    padding: 8px 10px;
    color: #666;
    font-size: 15px;
    box-shadow: 0 2.5px 5px #eee;
    border-radius: 6px;
}

.jiayoyka span {
    color: #333;
}

.chriqi {
    padding: 10px 8px;
    font-size: 16px;
    line-height: 24px;
    box-shadow: 0 2.5px 5px #eee;
    border-radius: 6px;
    /* margin-bottom: 46px; */
}

.mint-button--danger {
    border-radius: 1rem;
    box-shadow: 0px 3px 4px pink;
    background: rgb(240, 44, 44);
    font-weight: 700;
}

.btn {
    padding: 10px 0px;
    text-align: center;
    line-height: 20px;
    border-radius: 1rem;
    -webkit-box-shadow: 0 0.08rem 0.106667rem pink;
    box-shadow: 0 0.08rem 0.106667rem pink;
    background: rgb(240, 44, 44);
    color: #fff;
    margin-top: 15px;
}

.mydate {
    display: flex;
}

.mydate li {
    flex: 1;
    display: flex;
    border: 1px solid #ccc;
    margin: 8px;
    justify-content: center;
    align-items: center;
    padding: 5px 0;
}

.mydate li p {
    line-height: 30px;
    font-size: 16px;
    color: #333;
}

.zhi {
    /* line-height: 100%;
    height: 100%; */
    align-items: center;
    padding: 0.133333rem 0;
    display: flex;
}

/* 支付方式 */
#chongquerys .chongbottom {
    margin-top: 20px;
}

#chongquerys .zhiftext {
    font-size: 15px;
    line-height: 30px;
}

#chongquerys .mode {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 8px;
    border-bottom: 1px solid #e5e5e5;
    border-top: 1px solid #e5e5e5;
    padding: 10px 0px;
}

.bordercolor {
    border: 1px solid rgb(240, 44, 44) !important;
}

#chongquerys .mode li {
    flex: 1;
    line-height: 20px;
    padding: 10px 5px;
    margin: 0 5px;
    border: 1px solid #e5e5e5;
    text-align: center;
    border-radius: 8px;
}
</style>
<style>
#chongquerys .mintui-back {
    font-size: 28px;
}

#chongquerys .mintui-back {
    font-size: 28px;
}

#chongquerys .mint-header {
    margin-top: 0.693333rem;
}

#chongquerys .mint-header {
    background: #fff;
    color: #000;
    height: 60px;
    font-size: 20px;
}

#chongquerys .mintui-back {
    font-size: 28px;
}

#chongquerys .mint-field-core {
    font-size: 13px;
}
</style>

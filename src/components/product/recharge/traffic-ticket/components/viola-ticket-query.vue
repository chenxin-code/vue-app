<template>
    <div class="viola-ticket-content">
        <div class="table-view">
            <div class="table-view-cell">
                <div class="table-view-cell-text">
                    <div class="left">
                        <div class="title">处罚决定书编号：</div>
                        <div class="inp">
                            <input
                                type="text"
                                :disabled="disabled"
                                placeholder="请输入处罚决定书编号"
                                v-model="violaData.number"
                            >
                        </div>
                    </div>
                </div>
            </div>
            <div class="table-view-cell" @click="getAddressFun">
                <div class="table-view-cell-text">
                    <div class="left">
                        <div class="title">违章省份：</div>
                        <div class="inp">
                            <input type="text" disabled placeholder="请选择罚单省份" v-model="regionText">
                        </div>
                        <div class="table-view-cell-arrow"></div>
                    </div>
                </div>
            </div>
            <div class="table-view-cell" @click="showStartTime = true">
                <div class="table-view-cell-text">
                    <div class="left">
                        <div class="title">罚单日期：</div>
                        <div class="inp">
                            <input
                                type="text"
                                disabled
                                placeholder="请选择罚单日期"
                                v-model="violaData.penaltyDate"
                            >
                        </div>
                        <div class="table-view-cell-arrow"></div>
                    </div>
                </div>
            </div>
            <div class="table-view-cell" @click="showplateNumber = true">
                <div class="table-view-cell-text">
                    <div class="left">
                        <div class="title">车牌编号：</div>
                        <div class="inp">
                            <input
                                type="text"
                                :disabled="!disabled"
                                placeholder="请选择车牌号"
                                v-model="violaData.plateNumber"
                            >
                        </div>
                        <div class="table-view-cell-arrow"></div>
                    </div>
                </div>
            </div>
            <div class="table-view-cell">
                <div class="table-view-cell-text">
                    <div class="left">
                        <div class="title">发动机号：</div>
                        <div class="inp">
                            <input
                                type="text"
                                :disabled="!disabled"
                                v-model="violaData.engineNum"
                            >
                        </div>
                    </div>
                </div>
            </div>
            <div class="table-view-cell">
                <div class="table-view-cell-text">
                    <div class="left">
                        <div class="title">罚单金额：</div>
                        <div class="inp">
                            <input
                                type="text"
                                :disabled="disabled"
                                placeholder="请输入罚单金额"
                                v-model="violaData.fine"
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <van-popup v-model="showplateNumber" position="bottom">
            <van-picker
                show-toolbar
                title="选择车牌编号"
                :columns="columns"
                @cancel="showplateNumber = false"
                @confirm="onConfirm"
            />
        </van-popup>

        <van-popup position="bottom" v-model="showSelect">
            <van-area :area-list="areaList" @confirm="getAddress" :columns-num="2" title="请选择罚单省份"/>
        </van-popup>

        <van-popup position="bottom" v-model="showStartTime">
            <van-datetime-picker
                v-model="currentDateStart"
                type="date"
                @confirm="confirmActivitesTime"
                @cancel="showStartTime = false"
                @change="setColumnValue"
            />
        </van-popup>
    </div>
</template>

<script>
import { Popup, DatetimePicker } from 'vant'
import addressList from '../../../../../config/area.min.js'
import RegionSelect from '../../../../base/region-select'
import TipsPopup from '../../components/tips-popup.vue'
import util from '@/utils/util'
export default {
    data() {
        return {
            showSelect: false,
            showStartTime: false,
            areaList: {},
            currentDateStart: new Date(), // 开始时间弹框内容
            penaltyDate: '', // 开始时间
            initData: {
                title: '请选择地区'
            },
            disabled: false,
            titleOil: '请选择汽车类型',
            isOpenPopup: true,
            companyName: '',
            region: [],
            regionText: '', // 省份地址
            violaData: {},

            carNumberList: [],
            columns: [],   // 车牌编号
            showplateNumber: false
        }
    },
    mounted() {
        this.areaList = addressList
        this.$request.post('/app/json/user/getVehicleListByUserId').then(res => {
            if (res.status == 0) {
                this.carNumberList = res.data
                let number = []
                res.data.forEach(item => {
                    number.push(item.plateNum)
                });
                this.columns = number
                // this.carList = res.data
            }
        })
    },
    methods: {
        getAddressFun() {
            this.showSelect = true
        },
        getAddress(val) {
            let str = ''
            for (let i = 0; i < val.length; i++) {
                str += val[i].name
            }
            this.regionText = str;
            this.violaData.province = val[0].name
            this.violaData.cityName = val[1].name
            this.showSelect = false
            // this.$refs.regionselect.reset(null);
        },
        /**
         * 获取车牌编号
         */
        onConfirm(data, index){
            this.violaData.plateNumber = data
            this.violaData.engineNum = this.carNumberList[index].engineNum
            this.showplateNumber = false
        },
        /**
         * 获取时间
         */
        confirmActivitesTime(value) {
            // 开始时间 确认按钮
            this.showStartTime = false
            this.violaData.penaltyDate = util.getMyDate(value)
        },
        setColumnValue(index, value) {
            // 获取时间对应列中选中的值
            index = new Date()
        }
    },
    components: {
        TipsPopup,
        RegionSelect,
        [Popup.name]: Popup,
        [DatetimePicker.name]: DatetimePicker,
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.viola-ticket-content {
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    background: #fff;
    border-radius: 4px;
    margin-bottom: 65px;

    .left {
        width: 100%;
        display: flex;
        justify-content: left;
        align-items: center;

        .title {
            width: 35%;
            font-size: 14px;
        }

        .inp {
            flex: 1;
            width: 100%;

            input {
                width: 100%;
                line-height: 25px;
                background-color: #fff;
            }
        }
    }
}
</style>

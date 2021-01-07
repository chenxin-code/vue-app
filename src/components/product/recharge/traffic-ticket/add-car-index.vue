<template>
    <div class="add-car-index">
        <nav-top title="添加车辆" @backEvent="$router.go(-1)"></nav-top>
        <nav-content class="add-car-container">
            <div class="add-car-content">
                <div class="table-view">
                    <div class="table-view-cell">
                        <div class="table-view-cell-text">
                            <div class="left">
                                <div class="img">
                                    <img class="img" src="./assets/image/icon7@2x.png" alt>
                                </div>
                                <div class="inp">
                                    <input
                                        type="text"
                                        :disabled="disabled"
                                        placeholder="请输入车牌号"
                                        v-model="plateNum"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="table-view-cell" @click="queryCarType"> -->
                    <div class="table-view-cell">
                        <div class="table-view-cell-text">
                            <div class="left">
                                <div class="img">
                                    <img class="img" src="./assets/image/icon8@2x.png" alt>
                                </div>
                                <div class="inp">
                                    <input
                                        type="text"
                                        placeholder="请选择汽车类型"
                                        v-model="vehType"
                                    >
                                </div>
                            </div>
                        </div>
                        <!-- <div class="table-view-cell-arrow"></div> -->
                    </div>
                    <div class="table-view-cell">
                        <div class="table-view-cell-text">
                            <div class="left">
                                <div class="img">
                                    <img class="img" src="./assets/image/icon3@2x.png" alt>
                                </div>
                                <div class="inp">
                                    <input
                                        type="text"
                                        :disabled="disabled"
                                        placeholder="请输入用户姓名"
                                        v-model="ownerName"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="table-view-cell">
                        <div class="table-view-cell-text">
                            <div class="left">
                                <div class="img">
                                    <img class="img" src="./assets/image/icon4@2x.png" alt>
                                </div>
                                <div class="inp">
                                    <input
                                        type="text"
                                        :disabled="disabled"
                                        placeholder="请输入用户手机号"
                                        v-model="phone"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="table-view-cell">
                        <div class="table-view-cell-text">
                            <div class="left">
                                <div class="img">
                                    <img class="img" src="./assets/image/icon5@2x.png" alt>
                                </div>
                                <div class="inp">
                                    <input
                                        type="text"
                                        :disabled="disabled"
                                        placeholder="请输入车牌识别代码"
                                        v-model="vin"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="table-view-cell">
                        <div class="table-view-cell-text">
                            <div class="left">
                                <div class="img">
                                    <img class="img" src="./assets/image/icon6@2x.png" alt>
                                </div>
                                <div class="inp">
                                    <input
                                        type="text"
                                        :disabled="disabled"
                                        placeholder="请输入发动机代码"
                                        v-model="engineNum"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bill-btn">
                <div class="btn-show" @click="bindBtn" v-show="!bindSuccess">保存</div>
                <div class="btn-show" @click="$router.go(-2)" v-show="bindSuccess">返回</div>
            </div>
            <van-popup v-model="showOil" position="bottom">
                <van-picker
                    show-toolbar
                    title="汽车类型"
                    :columns="columns"
                    @cancel="onCancel"
                    @confirm="onConfirm"
                />
            </van-popup>
        </nav-content>
    </div>
</template>

<script>

export default {
    data() {
        return {
            showOil: false,
            columns: [],

            disabled: false,
            bindSuccess: false,
            titleOil: '请选择汽车类型',
            isOpenPopup: true,

            plateNum: '', // 车牌号
            vehType: '', // 车辆类型
            ownerName: '', // 用户姓名
            phone: '',  // 用户手机号
            vin: '', // 车牌识别代码
            engineNum: '' // 发动机代码
        }
    },
    mounted() {
        if (this.$route.query.carmsg) {
            let { plateNum, vehType, ownerName, phone, vin, engineNum } = this.$route.query.carmsg
            this.plateNum = plateNum
            this.vehType = vehType
            this.ownerName = ownerName
            this.phone = phone
            this.vin = vin
            this.engineNum = engineNum
        }
    },
    methods: {
        bindBtn() {
            if (this.plateNum == '' || this.vehType == '' || this.ownerName == '' || this.phone == '' || this.vin == '' || this.engineNum == '') {
                this.$Toast('所有填写项都为必填项，请将信息填写完整！')
                return
            } else if (!this.$util.checkMobile(this.phone)) {
                this.$Toast('请填写正确的手机号码！')
                return
            }

            let carInfor = {
                plateNum: this.plateNum,
                vehType: this.vehType,
                ownerName: this.ownerName,
                phone: this.phone,
                vin: this.vin,
                engineNum: this.engineNum
            }
            let url = ''
            if (this.$route.query.carmsg) {
                url = '/app/json/user/editVehicle'
                carInfor.id = this.$route.query.carmsg.id
            } else {
                url = '/app/json/user/bindVehicle'
            }
            this.$request.post(url, carInfor).then(res => {
                if (res.status == 0) {
                    this.$router.go(-1)
                }
            })
        },
        queryCarType() {// 汽车类型
            this.showOil = true
            this.$request.post('/app/json/user/queryVehicleType').then(res => {
                if (res.status == 0) {
                    res.data.forEach(item => {
                        this.columns.push({
                            type: item.type, text: item.name
                        })
                    });
                    // this.columns = res.data || []
                }
            })
        },
        onCancel() {
            this.showOil = false
        },
        onConfirm(value, index) {
            console.log(value)
            this.showOil = false
            this.vehType = value.text
        }
    },
    components: {
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.add-car-index {
    background-color: #F2F2F4 !important;

    .add-car-container {
        padding: 10px 10px;

        .add-car-content {
            box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
            background: #fff;
            border-radius: 4px;
            margin-bottom: 65px;

            .left {
                width: 100%;
                display: flex;
                justify-content: left;
                align-items: center;

                .img {
                    vertical-align: top;
                    padding-right: 5px;

                    img {
                        width: 30px;
                    }
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

        .bill-btn {
            position: fixed;
            bottom: 11px;
            left: 15px;
            right: 15px;
            text-align: center;
            font-size: 14px;

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
        }
    }
}
</style>

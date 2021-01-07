<template>
    <div class="subcardIndex">
        <nav-top title="加油卡副卡绑定" @backEvent="$router.go(-1)"></nav-top>
        <nav-content>
            <div class="content">
                <div class="card-information">
                    <div class="table-view">
                        <div class="table-view-cell" v-if="cardtypeData == '04' && $store.state.vue_conf_deputy_card_bind_verify_name_phone != 0">
                            <div class="table-view-cell-text">
                                <div class="left">主卡人姓名：</div>
                                <div class="right">
                                    <input type="text" v-model="bindingData.name" placeholder="请输入主卡人姓名" />
                                </div>
                            </div>
                        </div>
                        <div class="table-view-cell" v-if="cardtypeData == '04' && $store.state.vue_conf_deputy_card_bind_verify_name_phone != 0">
                            <div class="table-view-cell-text">
                                <div class="left">主卡人手机号：</div>
                                <div class="right">
                                    <input type="text" v-model="bindingData.phone" placeholder="请输入主卡人手机号" />
                                </div>
                            </div>
                        </div>
                        <div class="table-view-cell" v-if="cardtypeData == '02'">
                            <div class="table-view-cell-text">
                                <div class="left">企业名称：</div>
                                <div class="right">
                                    <input type="text" v-model="bindingData.enterpriseName" placeholder="请输入企业名称" />
                                </div>
                            </div>
                        </div>
                        <div class="table-view-cell">
                            <div class="table-view-cell-text">
                                <div class="left">推荐人：</div>
                                <div class="right refereeLflex">
                                    <input type="text" v-model="referrer" placeholder="请输入推荐人（选填）"
                                        @input="changeRfrCodeType" />
                                    <img src="static/image/fuelcard//btn_Sweep.png" width="25" height="25" @click="sweep" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card-information">
                    <div class="table-view">
                        <div class="table-view-cell">
                            <div class="table-view-cell-text upload">
                                <div class="title">加油卡照片</div>
                                <div class="ID-upload-img upload-img">
                                    <div class="img-show ID-img-show" @click="takePictures(2)">
                                        <div class="img">
                                            <img :src="bindingData.cardPicUrl" class="show-img" alt />
                                            <img v-show="showimageUrl2" src="./image/icon3@2x.png" class="btn-img" alt />
                                        </div>
                                        <div class="tips">加油卡正面</div>
                                    </div>
                                    <div class="img-show ID-img-show" @click="takePictures(3)">
                                        <div class="img">
                                            <img :src="bindingData.cardPicUrlV" class="show-img" alt />
                                            <img v-show="showimageUrl3" src="./image/icon3@2x.png" class="btn-img" alt />
                                        </div>
                                        <div class="tips">加油卡反面</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="table-view-cell">
                            <div class="table-view-cell-text upload">
                                <div class="title">身份证照片</div>
                                <div class="ID-upload-img upload-img">
                                    <div class="img-show ID-img-show" @click="takePictures(0)">
                                        <div class="img">
                                            <img :src="bindingData.idPicUrl" class="show-img" alt />
                                            <img v-show="showimageUrl0" src="./image/icon3@2x.png" class="btn-img" alt />
                                        </div>
                                        <div class="tips">身份证正面</div>
                                    </div>
                                    <div class="img-show ID-img-show" @click="takePictures(1)">
                                        <div class="img">
                                            <img :src="bindingData.idVPicUrl" class="show-img" alt />
                                            <img v-show="showimageUrl1" src="./image/icon3@2x.png" class="btn-img" alt />
                                        </div>
                                        <div class="tips">身份证反面</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button class="order-pay" @click="submitHandle">提交</button>
            <!--弹框 选择拍照方式-->
            <van-popup v-model="showUploadStyle" position="bottom">
                <div class="upload-style">
                    <div class="style" @click="onSelect(0)">拍照</div>
                    <div class="style" @click="onSelect(1)">相册</div>
                    <div class="style" @click="showUploadStyle = false">取消</div>
                </div>
            </van-popup>
            <div class="no-cancel">
                <van-dialog v-model="showOilState" title="温馨提示" @confirm="$router.go(-1)">
                    <div>您已成功提交绑卡审核，需要您去中石化任意发卡网点去进行副卡绑定审核!</div>
                </van-dialog>
            </div>
        </nav-content>
    </div>
</template>
<script>
import { Dialog } from 'vant';
export default {
    data() {
        return {
            showOilState: false,
            showUploadStyle: false, // 弹框选择拍照方式
            imgType: '', // 图片类型 0身份证正面 1身份证反面 2加油卡正面 3加油卡反面
            showimageUrl0: true, // 身份证正面
            showimageUrl1: true, // 身份证反面
            showimageUrl2: true, // 加油卡正面
            showimageUrl3: true, // 加油卡反面
            cardPicUrl: '', // 加油卡正面
            cardPicUrlV: '', // 加油卡反面
            idPicUrl: '', // 身份证正面
            idVPicUrl: '', // 身份证反面
            bindingData: {
                cardPicUrl: '', // 加油卡正面
                cardPicUrlV: '', // 加油卡反面
                idPicUrl: '', // 身份证正面
                idVPicUrl: '' // 身份证反面
            },
            cardtypeData: '', // 02单位多用户副卡    04 个人多用户副卡
            cardNo: '',
            referrer: '',
            theScanCode: ''
        }
    },
    mounted() {
        this.cardNo = JSON.parse(this.$route.query.cardData).cardno
        this.cardtypeData = this.$route.query.cardtype
        console.log(this.cardNo)
        this.bindingData.idPicUrl = require('./image/sfzzm.png')
        this.bindingData.idVPicUrl = require('./image/sfzfm.png')
    },
    created() {
        this.rfrCodeType = 1 // 推荐方式  1 填写  2 扫码
        // 填写默认推荐人(相对时间内)
        let referrerInvalidDate = this.$store.state.mall2.behalf.referrerInvalidDate
        if (referrerInvalidDate && referrerInvalidDate != undefined && referrerInvalidDate != '') {
            let referrerInvalidDateTime = (new Date(referrerInvalidDate)).getTime();
            let newTime = (new Date()).getTime();
            if (referrerInvalidDateTime >= newTime) {
                this.referrer = this.$store.state.mall2.behalf.referrer
            }
        } else {
            this.referrer = this.$store.state.mall2.behalf.referrer
        }
    },
    methods: {
        takePictures(type) {
            if (!this.binddetail) {
                // 拍照 1 行驶证首页
                this.showUploadStyle = true
                this.imgType = type
            }
        },
        changeRfrCodeType() {
            this.rfrCodeType = 1
        },
        sweep() {
            this.$bridgefunc.scanCode(res => {
                this.rfrCodeType = 2
                this.theScanCode = res.code;
                this.referrer = res.code;
            })
        },
        // 选择照片
        onSelect(op) {
            // 拍照
            this.showUploadStyle = false
            if (op == 0) {  // 拍照
                if (this.imgType == 0 || this.imgType == 1) {
                    this.getImg('3') // 身份证识别长方形框
                } else {
                    this.getImg('2')
                }
            } else if (op == 1) {  // 相册
                this.getImg('1')
            }

        },
        getImg: function (op) {
            let that = this;
            console.log(op)
            this.$bridgefunc.getPhoto(op, function (img) {
                console.log(img)
                that.updateImg(img)

                let imgBack = 'data:image/jpg;base64,' + img
                if (that.imgType == 0) {
                    that.idPicUrl = imgBack
                    that.showimageUrl0 = false
                } else if (that.imgType == 1) {
                    that.idVPicUrl = imgBack
                    that.showimageUrl1 = false
                } else if (that.imgType == 2) {
                    that.cardPicUrl = imgBack
                    that.showimageUrl2 = false
                } else if (that.imgType == 3) {
                    that.cardPicUrlV = imgBack
                    that.showimageUrl3 = false
                }
            })
        },
        updateImg(image) {
            this.$Loading.open('保存中')
            let url = '/uploadFile'
            let token = this.$store.state.login.token
            let params1 = {
                base64File: image,
                fileType: 'jpg',
                fileName: 'id-card-img',
                bucketName: 'app_img',
                token: token
            }
            let that = this
            this.$http.post(url, params1).then(res => {
                that.$Loading.close()
                let data = res.data
                if (data.status == 0) {
                    if (that.imgType == 0) {
                        that.bindingData.idPicUrl = data.data
                    } else if (that.imgType == 1) {
                        that.bindingData.idVPicUrl = data.data
                    } else if (that.imgType == 2) {
                        that.bindingData.cardPicUrl = data.data
                    } else if (that.imgType == 3) {
                        that.bindingData.cardPicUrlV = data.data
                    }
                } else {
                    this.$Toast(data.info)
                }
            }, error => {
                that.$Loading.close();
                this.$Toast('上传图片失败')
            })
        },
        submitHandle() {
            let url = ''
            if (this.referrer == this.theScanCode) {
                this.rfrCodeType = 2;
            } else {
                this.rfrCodeType = 1;
            }
            if (this.cardtypeData == '02') {  //单位
                if (!this.bindingData.enterpriseName) {
                    this.$Toast('请填写企业名称')
                    return
                }
                url = '/app/json/enterprise_card/submitEnterprise'
            } else if (this.cardtypeData == '04' && this.$store.state.vue_conf_deputy_card_bind_verify_name_phone != 0) {    //个人
                if (!this.bindingData.name) {
                    this.$Toast('请填写主卡人姓名')
                    return
                } else if (!this.bindingData.phone) {
                    this.$Toast('请填写手机号')
                    return
                } else if (!this.$util.checkMobile(this.bindingData.phone)) {
                    this.$Toast('请填写正确手机号')
                    return
                }
                url = '/app/json/enterprise_card/submitPerson'
            }
            if (this.showimageUrl0) {
                this.$Toast('请上传身份证正面照片')
                return
            } else if (this.showimageUrl1) {
                this.$Toast('请上传身份证反面照片')
                return
            } else if (this.showimageUrl2) {
                this.$Toast('请上传加油卡正面照片')
                return
            } else if (this.showimageUrl3) {
                this.$Toast('请上传加油卡反面照片')
                return
            }

            let params = {
                cardNo: this.cardNo,
                referrer: this.referrer,
                rfrCodeType: this.rfrCodeType,
                ...this.bindingData,

            }
            console.log(params)
            this.$request.post(url, params).then(res => {
                if (res.status == 0) {
                    this.showOilState = true
                } else {
                    this.$Toast(res.info)
                }
            })
            console.log(this.bindingData)
        }
    },
}
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~@/common/stylus/variable.styl';

.subcardIndex {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .content {
        position: absolute;
        top: 0px;
        right: 0px;
        left: 0px;
        bottom: 50px;
        padding: 10px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;

        .card-information {
            margin-bottom: 10px;
            box-shadow: 0px 5px 6px #f0f0f0;

            .title {
                font-size: 14px;
            }

            .card-type-radio {
                display: flex;
                justify-content: space-around;
            }

            .left {
                width: 30%;
            }

            .upload {
                display: block;

                .upload-img {
                    width: 50%;
                    margin: 0 auto;
                    padding-top: 10px;
                    text-align: center;

                    .img-show {
                        .img {
                            position: relative;
                            width: 163px;
                            height: 100px;

                            .show-img {
                                width: 100%;
                                height: 100%;
                            }

                            .btn-img {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                width: 50px;
                                height: 50px;
                            }
                        }

                        .tips {
                            color: $color-text-d;
                            padding: 10px 0;
                            font-size: 12px;
                        }

                        .two-tips {
                            padding-bottom: 0px;
                        }
                    }

                    .ID-img-show {
                        .img {
                            width: 133px;
                            height: 70px;
                        }
                    }
                }

                .ID-upload-img {
                    width: 100%;
                    display: flex;
                    justify-content: space-around;
                }
            }

            .right {
                flex: 1;

                input {
                    width: 100%;
                    line-height: 28px;
                    background-color: #fff;
                }
            }

            .refereeLflex {
                display: flex;
                align-items: center;
            }
        }
    }

    .order-pay {
        border: none;
        width: 90%;
        position: absolute;
        margin: 0 auto;
        height: 45px;
        left: 10px;
        right: 10px;
        bottom: 30px;
        background: #fe0018;
        color: #fff;
        text-align: center;
        line-height: 45px;
        font-size: 0.426667rem;
        border-radius: 30px;
    }

    /deep/ .van-popup {
        background: none;
        padding: 11px 15px;
    }

    .upload-style {
        text-align: center;

        .style {
            padding: 18px 0;
            background: #fff;
            margin-top: 10px;
            border-radius: 6px;

            & + .style {
                border-top: 1px solid $color-line-gray-l;
            }
        }
    }

    .tips-dialog {
        text-align: center;
        padding: 50px 0;
    }

    .no-cancel {
        /deep/ .van-dialog__content {
            padding: 20px;
        }

        /deep/ .van-dialog__confirm {
            color: #fff;
            background: red;
        }
    }
}
</style>

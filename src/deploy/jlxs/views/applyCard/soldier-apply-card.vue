<template>
    <div class="full-class">
        <img class="top-img-class" src="../image/applyCard/soldierApplyCardBGI.png" alt="">
        <div class="content-class-1">
            <div class="content-class" v-if="scheduleCard && applyStatus!==-1" style="padding: 0">
                <span class="alert-class" style="margin-top: 30px;">办卡进度</span>
<!--                <img class="img-text-class" src="../image/applyCard/top_text_schedule.png" alt="">-->
                <div style="width: 100%;margin-top: 30px">
                    <van-steps :active="applyStatus-1" active-icon="success" active-color="#07c160">
                        <van-step>待审核</van-step>
                        <van-step>待制卡</van-step>
                        <van-step>待领卡</van-step>
                        <van-step>已领卡</van-step>
                    </van-steps>
                </div>
                <span class="alert-class" v-html="msgArr[applyStatus]"></span>
            </div>
            <div v-if="!scheduleCard" class="content-class">
                <soldier-personal-card :referrerPhone="referrerPhone" :cityList="cityList" :referrerId="referrerId"
                               :userTypeList="userTypeList"
                               :invoiceTypeList="invoiceTypeList"
                               :personalCardTypeList="personalCardTypeList"
                               :userPhone="userPhone"></soldier-personal-card>
            </div>
        </div>
    </div>
</template>

<script>
    //办卡
    import SoldierPersonalCard from "./soldier-personal-card";
    import wx from 'weixin-js-sdk'

    export default {
        name: "apply-card",
        components: {SoldierPersonalCard},
        data() {
            return {
                applyStatus: -1,
                imageArr: [
                    '../image/applyCard/error.png',
                    '../image/applyCard/step01_big.png',
                    '../image/applyCard/step02_big.png',
                    '../image/applyCard/step03_big.png',
                    '../image/applyCard/step04_big.png',
                ],
                msgArr: [
                    '<span style="font-size: 20px;font-weight: 500;color: #333">审核失败</span>！<br>您提供的资料不完整，请重新提交',
                    '加油卡申请成功，正在审核中',
                    '审核通过，正在制卡中',
                    '制卡完成！<br>请去加油站领取你的加油卡<br>(领取时请出示您的身份证或其他有效证件)',
                    '您的卡片已领取',

                ],
                btnImg: '../image/applyCard/close_btn.png',
                scheduleCard: true,
                userPhone: '',
                personalCardTypeList: [],
                invoiceTypeList: [],
                userTypeList: [],
                cityList: [],
                downloadUrl: '',
                referrerId: '',
                referrerPhone: ''
            }
        },
        methods: {
            getPersonalCardType() {
                let url = '/platform/json/cnpc_onsale_oil_card_online/getPersonalCardType';
                this.$http.post(url).then(res => {
                    let data = res.data;
                    if (data.status === 0)
                        this.personalCardTypeList = data.data || [];

                });
            },
            //开票类型
            getInvoiceType() {
                let url = '/platform/json/cnpc_onsale_oil_card_online/getInvoiceType';
                this.$http.post(url).then(res => {
                    let data = res.data;
                    if (data.status === 0)
                        this.invoiceTypeList = data.data || [];
                });
            },
            //用户类型
            getUserTypes() {
                let url = '/platform/json/cnpc_onsale_oil_card_online/getUserTypes';
                this.$http.post(url).then(res => {
                    let data = res.data;
                    if (data.status === 0) {
                        this.userTypeList = data.data || [];
                    }
                });
            },
            getCityList() {
                let url = '/platform/json/cnpc_onsale_oil_card_online/getCityList';
                this.$http.post(url).then(res => {
                    let data = res.data;
                    if (data.status === 0) {
                        this.cityList = data.data || []
                    }
                })
            },
            getRefferPhone() {
                let url = '/platform/json/cnpc_onsale_oil_card_online/getRefferPhone';
                let params = {
                    referrerId: this.referrerId
                }
                this.$http.post(url, params).then(res => {
                    let data = res.data;
                    if (data.status === 0) {
                        this.referrerPhone = data.data.phone
                    }
                })
            },
            //获取办卡状态
            getApplyStatus() {
                this.$Loading.open();
                let params = {
                    token: this.$store.state.login.token
                    // cardType: 3
                };
                let url = '/platform/json/cnpc_onsale_oil_card_online/getApplyStatus';
                this.$http.post(url, params).then(res => {
                    this.$Loading.close();
                    let data = res.data;
                    if (data.status === 0 && data.data) {
                        if (data.data.url) {
                            this.downloadUrl = data.data.url;
                        }
                        this.userPhone = data.data.phone
                        this.scheduleCard = true;
                        switch (Number(data.data.applyStatus)) {
                            // 1：待审核  2：待制卡 3：待领取 4已领取 5.已驳回  判定改成这个了。
                            case -1:
                                this.scheduleCard = false;
                                this.getPersonalCardType();
                                this.getInvoiceType();
                                this.getUserTypes();
                                this.getCityList();
                                break
                            case 1:
                                this.applyStatus = 1;
                                break
                            case 2:
                                this.applyStatus = 2;
                                break
                            case 3:
                                //待领卡
                                this.applyStatus = 3;
                                this.getCarInfo();//查询领卡地址
                                break
                            case 4:
                                this.applyStatus = 4;
                                break
                            case 5:
                                this.applyStatus = 0;
                                //申请失败
                                this.btnImg = '..image/applyCard/reset_btn.png'
                                break
                            default:
                                break
                        }
                    } else {
                        if (data.info) this.$Toast(data.info)
                        else this.$Toast('获取数据失败，稍后再试')
                    }
                }).catch(res => {
                    this.$Loading.close();
                });
            },
            //查询领卡地址
            getCarInfo() {
                let params = {
                    token: this.$store.state.login.token
                }
                let url = '/platform/json/cnpc_onsale_oil_card_online/getCarInfo';
                this.$http.post(url, params).then(res => {
                    let data = res.data;
                    if (data.status === 0) {
                        if (data.data.getCardStationCodeStr) {
                            this.$set(this.msgArr, 3, `制卡完成！<br>${data.data.getCardStationCodeStr}领取卡<br>(领取时请出示您的身份证或其他有效证件)`);
                        }
                    } else {
                        if (data.info) this.$Toast(data.info)
                        else this.$Toast('获取数据失败，稍后再试')
                    }
                });
            },
            //
            closeEvent() {
                if (this.applyStatus == 0) {
                    //重新提价
                    this.scheduleCard = false;
                    this.getPersonalCardType();
                    this.getInvoiceType();
                    this.getUserTypes();
                    this.getCityList();
                } else
                    wx.closeWindow();
            },
        },
        created() {
            this.getApplyStatus();
            this.referrerId = this.$util.getUrlParam(window.location.href, 'referrerId');
            if (this.referrerId) {
             this.getRefferPhone();
            }
        }
    }
</script>

<style scoped lang="stylus" type="text/stylus">
    $item-height = 35px
    $item-interval = 10px
    $base-color = #ff3d34
    $border-radius = 8px
    .full-class {
        width 100%
        height 100%
        overflow hidden
        overflow-y scroll
        position relative
        top 0
        left 0
        /* background $base-color*/
        -webkit-overflow-scrolling touch
        .top-img-class {
            width 100%
            height 100%
        }
        .content-class-1 {
            width 90%
            top 160px
            border-radius $border-radius
            position fixed
            overflow scroll
            bottom 10px
            margin-left 5%
            .content-class {
                display flex
                width 100%
                /*background white*/
                height auto
                justify-content center
                align-items center
                flex-direction column
                border-radius $border-radius
                .img-text-class {
                    width 90%
                    height 15px
                }
                .tab-class {
                    height $item-height
                    background $base-color
                    width 50%
                    display flex
                    justify-content center
                    align-items center
                    margin-top $item-interval
                    margin-bottom 5px
                    border-radius $border-radius
                    button {
                        width 49%
                        height 95%
                        background transparent
                        color white
                        font-size $font-size-medium-s
                        border 0
                        border-radius $border-radius
                    }
                    button:active {
                        opacity 0.8
                    }
                }
                .item-div-class {
                    width 90%
                    margin-left 5%
                    display flex
                    flex-direction row
                    line-height $item-height
                    justify-content space-between
                    margin-top $item-interval
                    font-size $font-size-medium-s
                    .input-class {
                        width: 65%;
                        color #333
                        font-size $font-size-medium-s
                    }
                    span {
                        width: 30%;
                        text-align right
                    }
                }
                .big-img-class {
                    margin-top 10px
                    width 50%
                }
                .alert-class {
                    font-size: 20px;
                    margin-top: 100px;
                    font-weight: 600;
                    color: #343434;
                    text-align center
                    line-height 20px
                }
                .btn-img-class {
                    height 40px
                    width 90%
                    margin-top 20px
                    margin-bottom $item-interval
                }
                .btn-img-class:active {
                    opacity 0.8
                }
            }

        }

    }

</style>
<style type="text/stylus" lang="stylus">
    .full-class {
        .step01, .step02, .step03, .step04 {
            width: 35px;
            height: 35px;
            display: inline-block;
            background-image: url("../image/applyCard/step01.png");
            background-size 30px
            background-repeat: no-repeat;
            background-position center
        }

        .el-step__icon {
            width: 35px !important;
        }

        .el-step__icon.is-text {
            border 0 !important
        }

        .step01 {
            background-image: url("../image/applyCard/step01.png");
        }

        .step02 {
            background-image: url("../image/applyCard/step02.png");
        }

        .step03 {
            background-image: url("../image/applyCard/step03.png");
        }

        .step04 {
            background-image: url("../image/applyCard/step04.png");
        }

        .shopCard_step .el-step__head.is-text {
            border-style: hidden !important;
            background-color: transparent !important;
        }

        .el-step__head.is-finish .el-step__icon.is-text .step01 {
            background-image: url("../image/applyCard/step01H.png") !important;
        }

        .el-step__head.is-finish .el-step__icon.is-text .step02 {
            background-image: url("../image/applyCard/step02H.png") !important;
        }

        .el-step__head.is-finish .el-step__icon.is-text .step03 {
            background-image: url("../image/applyCard/step03H.png");
        }

        .el-step__head.is-finish .el-step__icon.is-text .step04 {
            background-image: url("../image/applyCard/step04H.png");
        }

        .el-step__title.is-finish, .el-step__title.is-process, .el-step__title.is-wait {
            //当前步骤
            color #343434 !important
            font-weight 400 !important
        }

        .el-step__head.is-finish {
            color #dcdcdd !important
            border-color #dcdcdd !important
        }

        .el-step__line {
            /*color  #dcdcdd!important*/
            background-color #dcdcdd !important
        }
    }
    .van-steps--horizontal {
      padding: 20px 10px 5px 10px;
    }
    .van-step--horizontal:first-child .van-step__title {
      -ms-transform: none;
      transform: none;
      margin-left: -10px;
    }
    .van-step--horizontal:last-child .van-step__title {
      margin-left: 0;
      -ms-transform: none;
      transform: none;
      margin-right: -10px;
    }
    .van-step--horizontal .van-step__title {
      display: inline-block;
      margin-left: 0.08rem;
      font-size: 18px;
      -ms-transform: translateX(-50%);
      transform: translateX(-50%);
    }
</style>

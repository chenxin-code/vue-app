<template>
    <div class="p-card-class">
        <div class="alert-class" style="width: 90%;text-align: center;display: initial;font-size: 14px;">
            <span>加油卡申请表</span>
        </div>
        <div class="item-div-class">
            <input type="text" class="input-class" v-model="userInfo.userName" placeholder="姓名">
            <label class="label-class" v-show="userInfo.userName==''">*</label>
        </div>
        <div class="item-div-class">
          <input type="text" class="input-class" v-model="userPhone" placeholder="手机号">
            <label class="label-class" v-show="userPhone==''">*</label>
        </div>
        <div class="item-div-class">
            <input type="text" class="input-class" v-model="userInfo.idCardNum" placeholder="证件号码">
            <label class="label-class" v-show="userInfo.idCardNum==''">*</label>
        </div>
        <div class="item-div-class">
            <div class="btn-div-class" style="width: 100%">
                <input type="button" class="btn-class"
                       :value="userInfo.idCardFrontImg.length>0?'证件正面照已上传':'上传身份证正面'" @click="uploadA()">
                <input type="button" class="btn-class"
                       :value="userInfo.idCardReverseImg.length>0?'证件反面照已上传':'上传身份证反面'" @click="uploadB()">
            </div>
        </div>
        <div class="item-div-class">
            <input type="text" class="input-class" style="width: 90%;margin-right: 10px;" v-model="userInfo.drivingLicenseNum" placeholder="行驶证号码">
            <label class="label-class" v-show="userInfo.drivingLicenseNum==''">*</label>
            <input type="button" class="btn-class" :value="userInfo.drivingLicenseImg.length>0?'行驶证已上传':'上传行驶证'"
                   @click="uploadC()">
        </div>
        <div class="alert-class" style="width: 90%;margin-top: 10px;">
            <span>选择领卡地址:</span>
        </div>
        <div class="referrer-class">
          <select class="input-class" v-model="userInfo.cityCode" @change="getAreaListByCity" style="height: 38px;"
                  placeholder="请选择市">
            <option v-for="item in cityList" :value="item.code">{{ item.name }}</option>
          </select>
          <select class="input-class" v-model="userInfo.areaCode" @change="getStationListByArea()" style="height: 38px;"
                  placeholder="请选择区">
            <option v-for="item in areaList" :value="item.code">{{ item.name }}</option>
          </select>

<!--            <select class="input-class" v-model="userInfo.cityCode" @change="getAreaListByCity" style="height: 38px;"-->
<!--                       placeholder="请选择市">-->
<!--                <option-->
<!--                        v-for="(item,index) in cityList"-->
<!--                        :key="index"-->
<!--                        :label="item.name"-->
<!--                        :value="item.code">-->
<!--                </option>-->
<!--            </select>-->
<!--            <select class="input-class" v-model="userInfo.areaCode" @change="getStationListByArea()" style="height: 38px;"-->
<!--                       placeholder="请选择区">-->
<!--                <option-->
<!--                        v-for="(item,index) in areaList"-->
<!--                        :key="index"-->
<!--                        :label="item.name"-->
<!--                        :value="item.code">-->
<!--                </option>-->
<!--            </select>-->
        </div>
        <div class="item-div-class">
          <select style="width:100%;height: 38px" class="input-class" v-model="userInfo.stationCode" placeholder="请选油站">
            <option v-for="item in stationList" :value="item.code">{{ item.name }}</option>
          </select>

<!--            <select style="width:100%;height: 38px" class="input-class" v-model="userInfo.stationCode" placeholder="请选油站">-->
<!--                <option v-for="(item,index) in stationList"-->
<!--                        :key="index"-->
<!--                        :label="item.name"-->
<!--                        :value="item.code">-->
<!--                </option>-->
<!--            </select>-->
        </div>
        <div class="alert-class" style="width: 90%;margin-top: 10px;">
            <span>居住地址(选填)</span>
        </div>
        <div class="item-div-class">
            <input v-model="userInfo.address" type="textarea" style="width: 100%" aria-rowspan="3"
                      placeholder="请输入详细地址"
            ></input>
        </div>
        <div class="alert-class" style="margin: 5px 0 8% 0;">
            <span>(如果不知道附近油站名称,请填写您的居住地址.)</span>
        </div>
        <div class="item-div-class">
            <input style="width: 100%" type="button" class="btn-class submit-btn-class" value="提  交" @click="submitEvent">
        </div>
    </div>
</template>

<script>
  import Photo from '@/components/commonui/choosephoto'
    export default {
        name: "soldier-personal-card",
        components: {
            VirtualKeyBoard: () => import('./virtual-keyboard.vue')
        },
        data: function () {
            return {
                userInfo: {
                    userName: '',//姓名
                    userPhone: '',//手机号
                    userType: '9',//用户类型 9-其他
                    idCardType: '1',//证件类型 1-身份证
                    idCardNum: '',//证件号码
                    idCardFrontImg: '',//证件正面照片地址
                    idCardReverseImg: '',//证件反面照片地址
                    drivingLicenseNum: '',//行驶证号码
                    drivingLicenseImg:'',//行驶证图片
                    militaryCardNum:'',//军人证号码
                    militaryCardImg:'',//军人证图片
                    companyName:'',//单位名称
                    carNum: '',//车牌号
                    ticketType: '',//开票类型
                    cityCode: '',//领卡城市编码
                    areaCode: '',//领卡片区地址
                    stationCode: '',//领卡油站编码
                    isRefer: '0',//是否是推荐办卡 0:不是，1是
                    cardType: '3',//卡片类型 1:个人卡,2:单位卡,3:拥军卡
                    referrerId: '',//推荐人信息
                    address: '',//邮寄地址
                },
                stationList: [],
                areaList: [],
            }
        },
        props: ['personalCardTypeList', 'invoiceTypeList', 'userTypeList', 'cityList', 'referrerId', 'referrerPhone', 'userPhone'],
        watch: {},
        methods: {
            //提交
            submitEvent() {
                this.userInfo.userPhone = this.userPhone
                if (this.userInfo.userName.trim() === '') {
                    this.$Toast('请输入姓名');
                    return
                }
                if (this.userInfo.userPhone === '') {
                    this.$Toast('请输入手机号');
                    return
                }
                if (!this.$util.checkMobile(this.userInfo.userPhone)) {
                    this.$Toast('请输入正确的手机号');
                    return
                }
                if (this.userInfo.userType === '') {
                    this.$Toast('请选择用户类型');
                    return
                }
                if (this.userInfo.idCardType === '') {
                    this.$Toast('请选择证件类型');
                    return
                }
                if (this.userInfo.idCardNum === '') {
                    this.$Toast('请输入证件号码');
                    return
                }
                if (this.userInfo.idCardFrontImg === '') {
                    this.$Toast('请上传身份证正面照');
                    return
                }
                if (this.userInfo.idCardReverseImg === '') {
                    this.$Toast('请上传身份证反面照');
                    return
                }
                if (this.userInfo.drivingLicenseNum === '') {
                    this.$Toast('请输入行驶证号码');
                    return
                }
                if (this.userInfo.drivingLicenseImg === '') {
                    this.$Toast('请上传行驶证图片');
                    return
                }
                if (this.userInfo.cityCode === '') {
                    this.$Toast('请选择领卡城市');
                    return
                }
                if (this.userInfo.areaCode === '') {
                    this.$Toast('请选择领卡市区');
                    return
                }
                if (this.userInfo.stationCode === '' && this.userInfo.address === '') {
                    this.$Toast('请选择加油站或输入地址');
                    return
                }
                let params = Object.assign(this.userInfo);
                this.$Loading.open();
                params.token = this.$store.state.login.token
                let url = '/platform/json/cnpc_onsale_oil_card_online/applyOilCard';
                this.$http.post(url, params).then(res => {
                    this.$Loading.close();
                    let data = res.data;
                    if (data.status === 0) {
                        if (data.info) this.$Toast(data.info)
                        else this.$Toast('申请成功');
                        this.$parent.getApplyStatus();
                    } else {
                        if (data.info)
                            this.$Toast(data.info)
                        else this.$Toast('申请失败')
                    }
                }).catch(res => {
                    this.$Loading.close();
                })
            },
            uploadA(){
              Photo.open({
               linkFunc: (picUrl) => {
                  this.userInfo.idCardFrontImg = picUrl;
                },
                token: '',
             })
           },
           uploadB(){
              Photo.open({
               linkFunc: (picUrl) => {
                 this.userInfo.idCardReverseImg = picUrl;
                },
               token: '',
              })
           },
            uploadC(){
              Photo.open({
               linkFunc: (picUrl) => {
                  this.userInfo.drivingLicenseImg = picUrl;
               },
               token: '',
              })
            },
            getAreaListByCity() {
                this.userInfo.areaCode = '';
                this.userInfo.stationCode = '';
                let url = '/platform/json/cnpc_onsale_oil_card_online/getAreaListByCityV2';
                let params = {
                    cityId: this.userInfo.cityCode
                }
                debugger
                this.$http.post(url, params).then(res => {
                    let data = res.data;
                    if (data.status === 0) {
                        this.areaList = data.data || []
                    }
                })
            },
            getStationListByArea() {
                this.userInfo.stationCode = '';
                let url = '/platform/json/cnpc_onsale_oil_card_online/getStationListByArea';
                let params = {
                    areaId: this.userInfo.areaCode
                }
                this.$http.post(url, params).then(res => {
                    let data = res.data;
                    if (data.status === 0) {
                        this.stationList = data.data || []
                    }else {
                        this.$Toast(data.info)
                    }
                })
            }
        },
        mounted() {
            setTimeout(() => {
                if (this.referrerId) {
                    //推荐的
                    this.userInfo.isRefer = 1;//是推荐用户
                    this.userInfo.referrerId = this.referrerId;
                }
            }, 1000)

        }
    }
</script>

<style scoped lang="stylus" type="text/stylus">
    $item-height = 35px
    $item-interval = 5px
    $base-color = #ff3d34
    $border-radius = 8px
    .p-card-class {
        width 100%
        text-align center
        display flex
        align-items center
        flex-direction column
        .item-div-class {
            width 90%
            display flex
            flex-direction row
            line-height $item-height
            justify-content space-between
            margin-top $item-interval
            font-size $font-size-medium-s
            .input-class {
                width: 100%;
                color #333
                font-size $font-size-medium-s
            }
            .btn-div-class {
                width 100%
                display flex
                justify-content space-between
                flex-direction row
                .btn-positive-class, .btn-reverse-class {
                    font-size $font-size-medium
                    border 1px solid #DCDFE6
                    -webkit-appearance: none;
                    border-radius 5px
                    height 40px
                    flex 0 0 48%
                    background white
                }
            }
            .label-class {
                position absolute
                color: red
                margin 5px 0 0 3px
                font-size: 20px
            }
            span {
                width: 27%;
                text-align right
            }
            .btn-class {
                background white
                text-align left
                font-size $font-size-medium
                width 49%
                text-align: center;
                color: #333
                border 1px solid #DCDFE6
                -webkit-appearance: none;
                border-radius 5px
            }
        }
        .referrer-class {
            display flex
            flex-direction row
            width 90%
            font-size $font-size-medium-s
            line-height $item-height
            margin-top $item-interval
            justify-content space-between
            align-items center
            .input-class {
                width 49%
            }
            span {
                width: 25%;
                text-align right
            }
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
        .alert-class {
            display flex
            text-align center
            flex-direction column
            justify-content flex-start
            align-items center
            span {
                color white
                align-self flex-start
                font-size $font-size-medium
                line-height 20px
            }
            span:first-child {
                font-weight bold
            }
        }

    }
</style>
<style lang="stylus" type="text/stylus">
    .el-input__inner {
        text-indent 8px
        height 35px !important
        padding-left 5px !important
        &:focus {
            border 1px solid $color-measure!important
        }
    }

    .el-select .el-input.is-focus .el-input__inner {
        border-color $color-measure!important
    }

    li {
        margin-left 10px !important
        font-size $font-size-medium-s!important
    }

    .el-scrollbar {
        > .el-scrollbar__bar {
            opacity: 1 !important;
        }
    }

    .el-tabs__item.is-active {
        color $color-measure!important
        height 1px !important
    }

    .el-tabs__active-bar {
        width 10% !important
        left 7% !important
        background $color-measure!important
    }

    .el-tabs__item.is-top {
        border-bottom none !important
    }

    .el-tabs__nav-wrap:after {
        background: none !important;
    }

    .el-tabs__header {
        height 30px !important
    }

    .el-textarea__inner {
        padding-left 5px !important
        outline: none !important
        -webkit-appearance: none !important
    }
</style>

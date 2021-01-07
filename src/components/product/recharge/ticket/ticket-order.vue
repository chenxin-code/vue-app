<template>
    <div class="ticketorder">
        <nav-top title="演出票务列表" @backEvent="$router.go(-1)">
            <!-- <div class="life-pay">北京市</div> -->
        </nav-top>
        <nav-content class="ticketOrder-details">
            <div class="content">
                <div class="ticket-infomation mt10 p10">
                    <div class="item-img">
                        <img :src="ticketDetails.poster" alt width="100" height="100" />
                    </div>
                    <div class="infomation-right-content">
                        <div class="infomation-right-title">
                            <p>{{ticketDetails.goodsName}}</p>
                        </div>
                        <div class="infomation-right-price">
                            <p class="price">¥{{orderData.price}}({{orderData.count}}张)</p>
                            <!-- <van-stepper v-model="ticketFileNumber" /> -->
                        </div>
                    </div>
                </div>
                <div class="ticket-address mt10 p10">
                    <div class="time">
                        <van-icon name="clock" />
                        <span>{{ticketDetails.startTime}}</span>
                    </div>
                    <div class="address">
                        <van-icon name="location" />
                        <div class="address-info">
                            <p>{{ticketDetails.address}}</p>
                            <!-- <p class="address-details">北京市昌平区霍营</p> -->
                        </div>
                    </div>
                </div>
                <div class="order-info mt10 p10">
                    <div class="left">
                        <div class="title">取票方式</div>
                        <div class="mode">
                            <span :class="typeIndex == index+1 ? 'active' : ''" v-for="(item, index) in typeList"
                                :key="index">{{item}}</span>
                        </div>
                    </div>
                    <div class="left">
                        <div class="title">取票人</div>
                        <div class="inp">
                            <input type="text" placeholder="请输入取票人" v-model="userName" />
                        </div>
                    </div>
                    <div class="left">
                        <div class="title">联系方式</div>
                        <div class="inp">
                            <input type="text" placeholder="请输入联系方式" v-model="userPhone" />
                        </div>
                    </div>
                    <div class="left">
                        <div class="title">配送地址</div>
                        <div class="inp" @click="toSelectAddress">
                            <input type="text" placeholder="请选择配送地址"
                                v-model="$store.state.mall2.selectAddress.addressFull" />
                        </div>
                        <div class="table-view-cell-arrow"></div>
                    </div>
                </div>
                <div class="order-price mt10 p10">
                    <div class="left">
                        <div class="title">商品价格</div>
                        <div class="red">¥{{orderData.price}}</div>
                    </div>
                    <div class="left">
                        <div class="title">快递运费</div>
                        <div class="red">¥{{orderData.express}}</div>
                    </div>
                    <div class="left">
                        <div class="title">共需支付</div>
                        <div class="red">¥{{orderData.price+orderData.express}}</div>
                    </div>
                </div>
            </div>
            <button class="order-pay" @click="submitPay">立即支付</button>
        </nav-content>
        <!-- <van-popup position="bottom" v-model="showSelect">
            <van-area
                :area-list="areaList"
                @cancel="showSelect = false"
                @confirm="getAddress"
                :columns-num="2"
                title="请选择配送地址"
            />
        </van-popup>-->
    </div>
</template>
<script>
import addressList from '../../../../config/area.min.js'
export default {
    data() {
        return {
            typeList: ['快递配送', '上门自取', '现场自取'],
            typeIndex: 0,
            // showSelect: false,
            areaList: {},
            regionText: '',
            userPhone: '', // 联系方式
            userName: '', // 收货人
            orderData: {},
            ticketDetails: {}
        }
    },
    mounted() {
        this.areaList = addressList
        this.userPhone = this.$store.state.login.phone
        this.orderData = JSON.parse(this.$route.query.priceData)
        console.log(this.orderData)
        this.ticketDetails = JSON.parse(this.$route.query.ticketDetails)
        this.typeIndex = this.orderData.deliverType * 1
    },
    methods: {
        toSelectAddress() {
            this.$router.push({
                path: "/mall2/addresslist"
            });
        },
        submitPay() {
            if (!this.userPhone || !this.userName) {
                this.$Toast('请填写联系方式或者取票人姓名')
                return
            }
            let params = {
                carts: [
                    {
                        skuId: this.$store.state.globalConfig.ticketSkuId,
                        storeOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
                        number: 1,
                        checked: '1'
                    }
                ],
                externalDeliveryType: this.orderData.deliverType,
                deliveryType: 2,
                userAddress: this.$store.state.mall2.selectAddress,
                userAddressId: this.$store.state.mall2.selectAddress.id,
                pickupMobile: this.userPhone,
                pickupReceiver: this.userName,
                ticketCateId: this.$route.query.cateId,
                ticketGoodsId: this.orderData.goodsId,
                ticketPlanId: this.orderData.planId,
                ticketLevelId: this.orderData.levelId,
                ticketPriceId: this.orderData.priceId,
                ticketCount: this.orderData.count
            }
            this.$request.post('/app/json/fee_life_order/submit', params).then(res => {
                if (res.status === 0) {
                    // this.$router.replace({
                    //     name: "收银台",
                    //     params: {
                    //         payInfo: res.data,
                    //         occurOuCode: res.data.occurOuCode
                    //     }
                    // });
                  this.$router.replace({
                    path: '/mall2/checkstand',
                    query: {
                      payInfo: JSON.stringify(res.data),
                      occurOuCode: res.data.occurOuCode
                    }
                  });
                } else {
                    this.$Toast(res.info)
                }
            })
        },
        pay() {
            if (this.selectedPayWay == null) {
                this.$Toast("请选择支付方式！")
                return;
            }
            payHelper.trafficPayEvent(this.selectedPayWay, this.submitInfo.orderType, this.submitInfo.orderId).then(() => {
                this.$router.replace({
                    path: '/recharge-bill-details',
                    query: {
                        orderType: this.submitInfo.orderType,
                        orderId: this.submitInfo.orderId
                    }
                })
            }).catch(() => {
            })

        },
    },
}
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
.ticketorder {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .ticketOrder-details {
        // position: relative;
        background: #F2F2F4;

        .content {
            position: absolute;
            top: 0px;
            right: 0px;
            left: 0px;
            bottom: 50px;
            padding: 10px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;

            .mt10 {
                margin-top: 10px;
            }

            .p10 {
                padding: 10px;
                background: #fff;
            }

            .ticket-infomation {
                display: flex;
                justify-content: flex-start;

                .item-img {
                    img {
                        border-radius: 10px;
                    }
                }

                .infomation-right-content {
                    margin-left: 15px;
                    position: relative;
                    padding: 10px 0;
                    flex: 1;

                    .infomation-right-title {
                        p {
                            font-size: 14px;
                            font-weight: bold;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            overflow: hidden;
                            line-height: 20px;
                        }
                    }

                    .infomation-right-price {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;

                        .price {
                            font-size: 16px;
                            color: red;
                            font-weight: bold;
                        }
                    }
                }
            }

            .ticket-address {
                font-size: 14px;

                .time {
                    border-bottom: 1px solid #ccc;
                    padding: 10px 0;

                    span {
                        padding-left: 3px;
                    }
                }

                .address {
                    margin-top: 10px;
                    display: flex;
                    justify-content: flex-start;

                    .address-info {
                        padding-left: 3px;

                        .address-details {
                            color: #A7A7A7;
                            margin-top: 5px;
                        }
                    }
                }
            }

            .order-info {
                .left {
                    width: 100%;
                    display: flex;
                    justify-content: left;
                    align-items: center;
                    line-height: 25px;

                    .title {
                        width: 35%;
                        font-size: 14px;
                    }

                    .mode {
                        span {
                            background: #ccc;
                            color: #fff;
                            border-radius: 10px;
                            padding: 3px 6px;
                            margin-right: 10px;
                        }

                        .active {
                            background: red;
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

            .order-price {
                .left {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    line-height: 25px;

                    .title {
                        width: 35%;
                        font-size: 14px;
                    }

                    .red {
                        color: red;
                        font-size: 14px;
                        font-weight: bold;
                    }
                }
            }
        }

        .order-pay {
            border: none;
            width: 100%;
            position: absolute;
            height: 50px;
            left: 0;
            right: 0;
            bottom: 0;
            background: #FE0018;
            color: #fff;
            text-align: center;
            line-height: 50px;
            font-size: 16px;
        }
    }
}
</style>

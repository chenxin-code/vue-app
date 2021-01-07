<template>
    <div>
        <nav-top title="演出票务详情" @backEvent="$router.go(-1)">
            <!-- <div class="life-pay">北京市</div> -->
        </nav-top>
        <nav-content class="ticket-details">
            <div class="ticket-content" ref="content">
                <div :class="tabAnimation ? 'tab tab-start-animation' : 'tab tab-end-animation' ">
                    <div :class="tabIndex == index ? 'tab-active' : ''" v-for="(item,index) in tabList" :key="index"
                        @click="HandleClick(index)">
                        <span>{{item}}</span>
                    </div>
                </div>
                <div class="ticket-infomation mt10">
                    <div class="item-img">
                        <img :src="ticketDetails.poster" alt width="100" height="100" />
                    </div>
                    <div class="infomation-right-content">
                        <div class="infomation-right-title">
                            <p>{{ticketDetails.goodsName}}</p>
                        </div>
                        <div class="infomation-right-price">
                            <p class="price">{{ticketDetails.price}}元</p>
                        </div>
                    </div>
                </div>
                <div class="ticket-address mt10">
                    <div class="time">
                        <van-icon name="clock" />
                        <span>{{ticketDetails.endTime}}</span>
                    </div>
                    <div class="address">
                        <van-icon name="location" />
                        <div class="address-info">
                            <p>{{ticketDetails.address}}</p>
                            <!-- <p class="address-details">北京市昌平区霍营--</p> -->
                        </div>
                    </div>
                </div>
                <div ref="ticketDetails" class="ticket-show-details mt10" v-html="ticketDetails.details"></div>
                <div ref="buyNotice" class="ticket-buy-notice mt10">购票须知--</div>
            </div>
            <button class="reserve-btn" @click="handleReserveBtn">立即预定</button>
        </nav-content>
        <van-popup v-model="ShowReserve" position="bottom">
            <van-picker show-toolbar title="选择场次" :columns="reserveList" value-key="planName"
                @cancel="ShowReserve = false" @confirm="onConfirm" />
        </van-popup>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tabAnimation: false,
            scrollTop: 0,
            tabList: ['演出介绍', '购票须知'],
            tabIndex: 0,
            ShowReserve: false,
            ticketDetails: {},
            reserveList: [],
            goodsId: ''
        }
    },
    mounted() {
        this.$refs.content.addEventListener('scroll', this.handleScroll)
        this.goodsId = this.$route.query.goodsId
        this.getDetails()   // 获取详情
        this.getReserveList()
        console.log(this.$route.query.id)
    },
    methods: {
        getDetails() {
            this.$request.post('/app/json/fee_life_order/queryTicketGoodsDetail', {
                storeOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
                goodsId: this.goodsId
            }).then(res => {
                if (res.status === 0) {
                    this.ticketDetails = JSON.parse(res.data)
                } else {
                    this.$Toast(res.info)
                }
            })
        },
        getReserveList() {
            this.$request.post('/app/json/fee_life_order/queryTicketGoodsPlan', {
                storeOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
                goodsId: this.goodsId
            }).then(res => {
                if (res.status === 0) {
                    this.reserveList = JSON.parse(res.data)
                } else {
                    this.$Toast(res.info)
                }
            })
        },
        handleScroll(el) {
            this.scrollTop = this.$refs.content.scrollTop
            if (this.scrollTop >= this.$refs.ticketDetails.offsetTop) {
                this.tabAnimation = true
            } else if (this.scrollTop <= this.$refs.ticketDetails.offsetTop - 60) {
                this.tabAnimation = false
            }
            if (this.scrollTop < this.$refs.buyNotice.offsetTop - (this.$refs.buyNotice.offsetTop / 3)) {
                this.tabIndex = 0
            }
            if (this.scrollTop > this.$refs.buyNotice.offsetTop - (this.$refs.buyNotice.offsetTop / 3)) {
                this.tabIndex = 1
            }
        },
        HandleClick(index) {
            this.tabIndex = index
            this.$refs.content.scrollTop = index == 0 ? this.$refs.ticketDetails.offsetTop - 50 : this.$refs.buyNotice.offsetTop - 50
        },
        handleReserveBtn() {
            this.ShowReserve = true
        },
        onConfirm(data, index) {
            if (data.planName) {
                this.ShowReserve = false
                this.$router.push({ path: '/ticketFile-selection', query: { PlanDataObject: JSON.stringify(data), ticketDetails: JSON.stringify(this.ticketDetails), cateId: this.$route.query.cateId } })
            }else{
                this.$Toast('请选择场次')
            }
        }

    },
}
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
.ticket-details {
    background: #F2F2F4;

    .ticket-content {
        height: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;

        @keyframes ticket-tab-start {
            from {
                top: -50px;
            }

            to {
                top: 0;
            }
        }

        @keyframes ticket-tab-end {
            from {
                top: 0;
            }

            to {
                top: -50px;
            }
        }

        .tab-start-animation {
            animation: ticket-tab-start 0.3s forwards;
        }

        .tab-end-animation {
            animation: ticket-tab-end 0.3s forwards;
        }

        .tab {
            z-index: 5;
            background: #fff;
            position: absolute;
            top: -50px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 45px;
            box-shadow: 1px 2px 10px #fff;
            font-size: 14px;

            .tab-active {
                height: 100%;
                line-height: 45px;

                span {
                    display: inline-block;
                    box-sizing: border-box;
                    height: 100%;
                    border-bottom: 2px solid red;
                    color: red;
                }
            }
        }

        .mt10 {
            margin-top: 10px;
            background: #fff;
            padding: 10px;
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
                    .price {
                        font-size: 16px;
                        color: red;
                        font-weight: bold;
                        position: absolute;
                        bottom: 5px;
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

        .ticket-show-details {
            // height: 800px;
            p {
                img {
                    width: 100%;
                }
            }
        }

        .ticket-buy-notice {
            // height: 600px;
        }
    }

    .reserve-btn {
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

/deep/ .van-popup {
    border-radius: 15px 15px 0 0;
}
</style>
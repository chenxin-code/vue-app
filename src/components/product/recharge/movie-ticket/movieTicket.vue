<template>
    <div>
        <nav-top :title="showInstruImg ? '兑换步骤' : '卡虚拟卡券'" @backEvent="goback">

        </nav-top>
        <nav-content class="movie-ticket">
            <div class="movie-ticket-content">
                <div class="ticket-details" v-if="!showInstruImg">
                    <!-- <div class="ticket-banner mb10">
                        <img src="./image/banner.png" alt height="100" width="100%" />
                    </div> -->
                    <div class="ticket-type-list mb10">
                        <p class="type-list-title">类型选择</p>
                        <div class="type-lists">
                            <div class="type-item" v-for="(item, index) in movieTicketList" :key="index"
                                @click="handleType(item)">
                                <div class="item-img">
                                    <img :src="item.phMainUrl" height="80" width="80" alt />
                                </div>
                                <div class="item-infomation">
                                    <p class="ticket-name">{{item.skuName}}</p>
                                    <p class="ticket-price">￥{{item.salePrice || 0}}元/张</p>
                                </div>
                                <van-icon name="arrow" class="item-left-icon" />
                            </div>
                        </div>
                    </div>
                    <div class="ticket-instructions">
                        <div class="instr-header">
                            <p class="ticket-instr-title">使用说明</p>
                            <!-- <p class="ticket-instr-btn" @click="handleInstru">
                                兑换步骤
                                <van-icon name="arrow" />
                            </p> -->
                        </div>
                        <div class="instr-content">
                            <div class="instr-item">
                                <img src="./image/icon1.png" alt />
                                <p>下单完成</p>
                            </div>
                            <div class="instr-item">
                                <img src="./image/icon2.png" alt />
                                <p>卡密接收</p>
                            </div>
                            <div class="instr-item">
                                <img src="./image/icon3.png" alt />
                                <p>卡密使用</p>
                            </div>
                            <div class="instr-item">
                                <img src="./image/icon4.png" alt />
                                <p>完成</p>
                            </div>
                        </div>
                    </div>
                    <div class="ticket-rules mb10">
                        <p class="rules-title">规则:</p>
                        <p class="rules-content" v-html="mobileDetail"></p>
                    </div>
                </div>
                <div v-else>
                    <img class="InstruImage" src="./image/instru.png" alt />
                </div>
            </div>
        </nav-content>
    </div>
</template>
<script>
export default {
    data() {
        return {
            showInstruImg: false,
            movieTicketList: [],
            tipsData: '',
            skuId: '',
            mobileDetail: '', // 规则
        }
    },
    mounted() {
        this.movieTicketList = JSON.parse(this.$route.query.ticketShopArr)
        this.mobileDetail = this.$route.query.mobileDetail
        this.skuId = this.$route.query.skuId
        this.getTipsData()
        // this.getMovieTicketList()
    },
    methods: {
        getTipsData() {
            this.$request.post('/app/json/news/getNewsList', {
                values: 34
            }).then(res => {
                if (res.status === 0) {
                    this.tipsData = res.data[0] ? res.data[0].content : ''
                } else {
                    this.$Toast(res.info)
                }
            })
        },
        goback() {
            if (this.showInstruImg) {
                this.showInstruImg = false
            } else {
                this.$router.go(-1)
            }
        },
        getMovieTicketList() {
            this.$request.post('/app/json/product/getAppProDetail', {
                skuId: this.skuId,
                pickupStoreOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
                deliverType: 2
            }).then(res => {
                if (res.status === 0) {
                    this.movieTicketList = res.data.featureList
                } else {
                    this.$Toast(res.info)
                }
            })
        },
        // handleInstru() {
        //     this.showInstruImg = true
        // },
        handleType(item) {
            console.log(item)
            let params = {
                skuId: item.skuId,
                storeOuCode: item.storeOuCode,
                skuName: item.skuName,
                price: item.salePrice
            }
            this.$router.push({
                path: '/movie-ticket-order',
                query: {
                    // params: JSON.stringify(params)
                    skuId: item.skuId
                }
            })
        }
    },
}
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
.movie-ticket {
    .mb10 {
        margin-bottom: 10%;
    }

    .movie-ticket-content {
        padding: 10px;
        height: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;

        .InstruImage {
            width: 100%;
        }

        .ticket-banner {
            img {
                border-radius: 10px;
            }
        }

        .ticket-type-list {
            .type-list-title {
                font-size: 16px;
                margin-bottom: 10px;
            }

            .type-lists {
                .type-item {
                    margin-bottom: 10px;
                    box-shadow: 0px 0px 5px #e3e3e3;
                    border-radius: 10px;
                    display: flex;
                    justify-content: flex-start;
                    position: relative;

                    .item-img {
                        img {
                            border-radius: 10px 0 0 10px;
                        }
                    }

                    .item-infomation {
                        position: relative;
                        padding: 10px 15px;

                        .ticket-name {
                            font-size: 16px;
                            font-weight: bold;
                        }

                        .ticket-price {
                            position: absolute;
                            bottom: 15px;
                        }
                    }

                    .item-left-icon {
                        position: absolute;
                        top: 30px;
                        right: 10px;
                        font-size: 22px;
                        color: #ccc;
                    }
                }
            }
        }

        .ticket-instructions {
            .instr-header {
                font-size: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .ticket-instr-btn {
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                }
            }

            .instr-content {
                margin-top: 10px;
                background: #FEFAF9;
                text-align: center;
                display: flex;
                justify-content: space-around;
                align-items: center;
                padding: 15px 0;
                border-radius: 10px;

                .instr-item {
                    img {
                        display: inline-block;
                        height: 30px;
                        margin-bottom: 5px;
                    }
                }
            }
        }

        .ticket-rules {
            .rules-title {
                font-size: 16px;
                margin-bottom: 10px;
            }

            .rules-content {
                line-height: 17px;
                font-size: 14px;

                p {
                    img {
                        width: 100%;
                    }

                    .tiny-img {
                        width: 100%;
                    }
                }
            }
        }
    }
}

/deep/ .tiny-img {
    width: 100%;
}
</style>
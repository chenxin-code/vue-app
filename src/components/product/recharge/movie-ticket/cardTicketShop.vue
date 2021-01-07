<template>
    <div>
        <nav-top title="卡券商城" @backEvent="$router.go(-1)">
        </nav-top>
        <nav-content class="ticketShop-content">
            <div class="ticket-shop-details">
                <div class="banner">
                    <img src="./image/banner.png" alt="" width="100%">
                </div>
                <div class="lists">
                    <div class="shop-item" v-for="(item, index) in cardTicketList" :key="index"
                        @click="handleCardTicket(item)">
                        <img :src="item.phMainUrl" width="100" height="100" alt="">
                        <div class="item-info">
                            <p class="title">{{item.spuName}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </nav-content>
    </div>
</template>
<script>
export default {
    data() {
        return {
            cardTicketList: [],
            cardTicketShopList: []
        }
    },
    mounted() {
        this.getCardTicketShopList()
    },
    methods: {
        getCardTicketShopList() {
            this.$request.post('/app/json/product_recharge/getRechargeProList', {
                productType: 511
            }).then(res => {
                if (res.status === 0) {
                    this.cardTicketList = res.data.spuModels
                    this.cardTicketShopList = res.data.list
                } else {
                    this.$Toast(res.info)
                }
            })

        },
        handleCardTicket(row) {
            let ticketShopArr = []
            this.cardTicketShopList.forEach(item => {
                if (row.spuId == item.spuId) {
                    ticketShopArr.push(item)
                }
            });
            this.$router.push({ path: '/cardTicket-shop', query: { spuId: row.spuId, ticketShopArr: JSON.stringify(ticketShopArr), mobileDetail: row.mobileDetail } })
        }
    },
}
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
.buy-record {
    font-size: 14px;
    margin-right: 15px;
    text-align: right;
}

.ticketShop-content {
    padding: 10px;

    .lists {
        margin-top: 10px;
        display: flex;
        // justify-content: space-between;
        flex-wrap: wrap;

        .shop-item {
            width: 30%;
            margin-bottom: 15px;
            text-align: center;
            margin-right: 11px;

            img {
                border-radius: 10px;
            }

            .item-info {
                margin-top: 10px;

                .title {
                    font-size: 16px;
                    margin-bottom: 5px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    text-align: left;
                    text-align: center;
                }

                p {
                    span {
                        font-size: 16px;
                        color: red;
                        font-weight: bold;
                    }
                }
            }
        }
    }
}
</style>
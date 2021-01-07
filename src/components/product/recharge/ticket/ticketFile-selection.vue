<template>
    <div class="ticketfileselection">
        <nav-top title="票档选择" @backEvent="$router.go(-1)">
            <!-- <div class="life-pay">北京市</div> -->
        </nav-top>
        <nav-content class="ticketFile-details">
            <div class="content">
                <div class="ticketFile-time mt10 p10">
                    门票日期:
                    <span>{{PlanDataObject.startTime}}</span>
                </div>
                <div class="ticketFile-selection mt10 p10">
                    <div class="ticket-price">
                        <p>选择票档</p>
                        <div class="price-list">
                            <span :class="ticketFileIndex == index ? 'price-item price-item-active' : 'price-item'"
                                v-for="(item,index) in PlanDataObject.levelList" :key="index"
                                @click="handleTickFile(item,index)">{{item.levelName}}</span>
                        </div>
                    </div>
                    <div class="ticket-compose">
                        <p>组合价</p>
                        <div class="price-list">
                            <span :class="ticketFilePriceIndex == index ? 'price-item price-item-active' : 'price-item'"
                                v-for="(item, index) in ticketFilePriceList" :key="index"
                                @click="handleTickFilePrice(item, index)">{{item.price}}*{{item.count}}张</span>
                        </div>
                    </div>
                </div>
                <!-- <div class="ticketFile-number mt10 p10">
                    <p>购买数量</p>
                    <van-stepper v-model="ticketFileNumber" />
                </div> -->
            </div>
            <button class="next-btn" @click="handleNext">下一步</button>
        </nav-content>
    </div>
</template>
<script>
export default {
    data() {
        return {
            ticketTime: '', // 时间
            // ticketFileNumber: 1, // 购买数量
            ticketFileList: [], // 票档
            ticketFileIndex: 0,
            ticketFilePriceList: [], // 组合价
            ticketFilePriceIndex: 0,
            PlanDataObject: {},
            priceData: {}
        }
    },
    mounted() {
        this.PlanDataObject = JSON.parse(this.$route.query.PlanDataObject)
        this.ticketFilePriceList = this.PlanDataObject.levelList[this.ticketFileIndex].priceList
        this.priceData = this.PlanDataObject.levelList[this.ticketFileIndex].priceList[this.ticketFileIndex]
    },
    methods: {
        handleTickFile(item, index) {
            this.ticketFileIndex = index
            this.ticketFilePriceList = item.priceList
            this.priceData = this.PlanDataObject.levelList[this.ticketFileIndex].priceList[0]
        },
        handleTickFilePrice(item, index) {
            this.priceData = item
            this.ticketFilePriceIndex = index
        },
        handleNext() {
            // this.priceData.ticketFileNumber = this.ticketFileNumber
            this.priceData.goodsId = this.PlanDataObject.goodsId
            this.priceData.levelId = this.PlanDataObject.levelList[this.ticketFileIndex].levelId
            this.priceData.planId = this.PlanDataObject.levelList[this.ticketFileIndex].planId
            this.$router.push({ path: '/ticket-order', query: { priceData: JSON.stringify(this.priceData), ticketDetails: this.$route.query.ticketDetails, cateId: this.$route.query.cateId } })
        }
    },
}
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
.ticketfileselection {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .ticketFile-details {
        // background: #F2F2F4;
        .content {
            position: absolute;
            top: 0px;
            right: 0px;
            left: 0px;
            bottom: 50px;

            .mt10 {
                margin-top: 10px;
            }

            .p10 {
                padding: 10px;
                background: #fff;
            }

            .ticketFile-time {
                font-size: 14px;
            }

            .ticketFile-selection {
                font-size: 14px;

                .ticket-compose {
                    margin-top: 10px;
                }

                .price-list {
                    // display: flex;
                    // justify-content: space-around;
                    // align-items: center;
                    .price-item {
                        display: inline-block;
                        font-size: 14px;
                        width: 30%;
                        border: 1px solid #ccc;
                        padding: 10px 0;
                        border-radius: 7px;
                        margin: 10px 10px 0 0;
                        text-align: center;
                    }

                    .price-item-active {
                        border: 1px solid red;
                        color: red;
                    }
                }
            }

            .ticketFile-number {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }

        .next-btn {
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
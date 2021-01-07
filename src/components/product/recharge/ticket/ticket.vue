<template>
    <div>
        <div class="ticket" v-if="searchType">
            <nav-top title="演出票务列表" @backEvent="$router.go(-1)">
                <div class="life-pay" @click="ticketAddress">{{cityName ? cityName : address[0]}}</div>
            </nav-top>
            <nav-content class="ticket-details">
                <div class="ticket-content">
                    <van-tabs sticky @change="ticketTabsChange">
                        <van-tab v-for="(item,index) in classify" :key="index" :title="item"></van-tab>
                    </van-tabs>
                </div>
                <div class="ticket-list">
                    <div v-if="isShowGoodsList" class="noList">
                        暂无查询结果!!!
                    </div>
                    <scroll v-else ref="scroll" class="coupon-list" :hasMore="hasMore" :pullUpLoad="true"
                        @pullingUp="loadMore" :data="couponList">
                        <ul>
                            <li v-for="(item, index) in goodsList" :key="index" @click="ticketItemClick(item)">
                                <div class="ticket-list-item">
                                    <div class="item-img">
                                        <img :src="item.poster" alt width="100" height="100" />
                                    </div>
                                    <div class="item-right-content">
                                        <div class="item-right-title item-right">
                                            <p>{{item.goodsName}}</p>
                                        </div>
                                        <div class="item-right-time item-right">
                                            <p>{{item.endTime}}</p>
                                        </div>
                                        <div class="item-right-address item-right">
                                            <p class="address">
                                                <span>{{item.venueName}}</span>
                                                <!-- <span>工人体育场</span> -->
                                            </p>
                                            <p class="price">{{item.price}} 元</p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </scroll>
                </div>
            </nav-content>
        </div>
        <div class="card-classifyList-index" v-else>
            <nav-top title="演出票区地点" @backEvent="searchType = true">
                <!-- <div class="search-div theme_bg_white_f5"
                    style="left: 50px; right: 55px; height: 30px; top: 7px; padding: 0 15px; border-radius: 15px;">
                    <i class="iconfont mall-sousuo theme_font_tint" style="font-size: 16px;"></i>
                    <form class="search-input" action id="form">
                        <input style="display: none" type="text" name="keyword">
                        <input id="searchInput" class type="search" placeholder="搜你想要的商品" v-model="searchStr"
                            @keyup.enter="searchgoods">
                    </form>
                </div> -->
            </nav-top>
            <nav-content class="card-classifyList-content">
                <van-cell v-for="(item, index) in addressArr" :key="index" :title="item.cityName"
                    @click="gorecharge(item)" />
            </nav-content>
        </div>
    </div>

</template>
<script>
import Scroll from '@/components/base/scroll/scroll'
export default {
    data() {
        return {
            searchType: true,

            classify: ['全部', '演唱会', '话剧歌剧', '音乐会', '儿童亲子', '休闲展览', '舞蹈芭蕾', '戏曲综艺', '体育赛事'],
            cateId: 0,
            page: 1,
            // 上拉加载
            hasMore: true, // 是否还有更多
            couponList: [],
            couponListLength: 10,
            loading: false,

            goodsList: [],
            address: [],
            cityCode: '',
            cityName: '',

            addressArr: [],
            searchStr: '',
            isShowGoodsList: false,  // 没有数据的情况下展示

        }
    },
    mounted() {
        this.address = this.$store.state.globalConfig.Ofdefault_area.split('/')
        this.getAddress()
        this.getGoodsList()
    },
    methods: {
        getAddress() {
            this.$request.post('/app/json/fee_life_order/queryTicketCitys', {
                storeOuCode: 1070000001001,
            }).then(res => {
                if (res.status === 0) {
                    this.addressArr = JSON.parse(res.data)
                } else {
                    this.$Toast(res.info)
                }
            })
        },
        searchgoods() {

        },
        gorecharge(item) {
            this.searchType = true
            this.cityCode = item.cityCode
            this.cityName = item.cityName
            this.getGoodsList()
        },


        getGoodsList() {
            this.goodsList = []
            this.$request.post('/app/json/fee_life_order/queryGoodsList', {
                storeOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
                cityCode: this.cityCode ? this.cityCode : this.address[1],
                pageNum: this.page,
                cateId: this.cateId
            }).then(res => {
                if (res.status === 0) {
                    this.goodsList = JSON.parse(res.data)
                    if(this.goodsList.length == 0){
                        this.isShowGoodsList = true
                    }
                } else {
                    this.$Toast(res.info)
                    this.isShowGoodsList = true
                }
            })
        },
        ticketTabsChange(name) {
            if (this.$refs.scroll) {
                this.$refs.scroll.scrollTo(0, 0)
            }
            // this.reset()
            this.cateId = name
            this.getGoodsList()
        },
        reset() {
            this.$refs.scroll.closePullUp()
            this.hasMore = true
            this.page = 1
            this.couponList = []
            this.couponListLength = 10
            this.loadMore()
        },
        ticketItemClick(item) {
            this.$router.push({ path: '/ticket-details', query: { goodsId: item.goodsId, cateId: item.categoryId } })
        },
        // 上拉加载
        loadMore() {
            if (this.loading) {
                return
            }
            this.$Loading.open()
            this.page++
            this.loading = true
            console.log('加载中')

            setTimeout(() => {
                this.couponListLength += 5
                if (this.couponListLength >= 25) {
                    this.hasMore = false
                }
                this.loading = false
                this.$refs.scroll.openPullUp()
                this.$Loading.close()
            }, 2000);

        },
        ticketAddress() {
            this.searchType = false
            this.getAddress()
        }
    },
    components: { Scroll }
}
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
.ticket {
    .life-pay {
        font-size: 16px;
        color: $color-theme-r;
        text-align: right;
        margin-right: 15px;
    }

    .ticket-details {
        .ticket-content {
            height: 45px;
        }

        .ticket-list {
            background: #F2F2F4;
            position: absolute;
            top: 45px;
            bottom: 0;
            width: 100%;

            .noList {
                background: #ffffff;
                height: 100%;
                text-align: center;
                padding-top: 30%;
                font-size: 16px;
            }

            .coupon-list {
                background: #F2F2F4;
            }

            ul {
                height: 100%;
                overflow: auto;
                -webkit-overflow-scrolling: touch;

                li {
                    margin-top: 10px;

                    .ticket-list-item {
                        background: #fff;
                        padding: 10px;
                        display: flex;
                        justify-content: flex-start;

                        .item-img {
                            img {
                                border-radius: 10px;
                            }
                        }

                        .item-right-content {
                            margin-left: 15px;
                            flex: 1;

                            .item-right {
                                padding: 5px 0;
                            }

                            .item-right-title {
                                p {
                                    font-size: 16px;
                                    font-weight: bold;
                                    display: -webkit-box;
                                    -webkit-box-orient: vertical;
                                    -webkit-line-clamp: 2;
                                    overflow: hidden;
                                    line-height: 20px;
                                }
                            }

                            .item-right-time {
                                p {
                                    font-size: 12px;
                                    color: #929292;
                                }
                            }

                            .item-right-address {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;

                                .address {
                                    color: #929292;
                                    display: -webkit-box;
                                    -webkit-box-orient: vertical;
                                    -webkit-line-clamp: 2;
                                    overflow: hidden;
                                    width: 70%;
                                }

                                .price {
                                    width: 30%;
                                    font-size: 16px;
                                    color: red;
                                    font-weight: bold;
                                    text-align: right;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

.card-classifyList-index {
    .card-classifyList-content {
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
}
</style>
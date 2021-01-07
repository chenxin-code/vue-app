<template>
    <div class="oil-sale-container">
        <nav-top title="购油订单列表" @backEvent="backEvent"></nav-top>
        <nav-content class="buy-oil-order-list">
            <div class="nav-bar">
                <div class="nav-bar-item" :class="{active: currentIndex === index}" v-for="(item, index) in menu" :key="index"
                    @click="tabChange(index)">
                    <span class="text">{{item.text}}</span>
                </div>
            </div>
            <!-- 购油订单列表 -->
            <div class="my-group-list">
                <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMore">
                    <div class="bill-item-info special" v-for="(items, index) in billList" :key="index">
                        <!-- 购油订单列表 -->
                        <div class="bill-item">
                            <div class="img-wrapper">
                                <img class="img" src="../../assets/image/bill.png" alt>
                            </div>
                            <div class="center">
                                <div class="title">{{items.matertialName}}&nbsp;&nbsp;购油{{items.tonnes}}t</div>
                                <div class="tips">订单编号：{{items.id}}</div>
                                <div class="tips">
                                    业务类型：
                                    <span v-if="items.bizType == 0 || items.bizType == ''">普通购油</span>
                                    <span v-if="items.bizType == 1">预约购油</span>
                                </div>
                                <div class="time">下单时间：{{items.submitTime}}</div>
                            </div>
                            <div class="bill-btn">
                                <div class="record-btn-show" v-if="currentIndex == 1">
                                    <div class="record-img">
                                        <div class="tips">提货倒计时</div>
                                        <div class="count-down">
                                            <countdown class="count-down-con" :hiddenDay="true"
                                                :endTime="items.countdown ? ((new Date(items.countdown.replace(/-/g, '/')).getTime())/1000) : ''"
                                                type="theme_bg_blue"></countdown>
                                        </div>
                                    </div>
                                </div>
                                <div class="btn-show" v-if="items.deliveryType" @click="openDetails(items)">详情</div>
                                <div class="btn-show" v-else @click="fillInAddressHandle(items)">填写地址</div>
                            </div>
                        </div>
                    </div>
                </van-list>
            </div>
        </nav-content>
    </div>
</template>

<script type="text/ecmascript-6">
import { List } from 'vant'
import Countdown from "@/components/Vendor/countdown/countdown"
import { mapMutations, mapGetters } from 'vuex'
import utils from '@/utils/util'

export default {
    name: "",
    data() {
        return {
            currentIndex: 0,
            state: '', // 状态 0-未启用 1-生效 2-已开团 9-组团失败 10-组团成功(0和1暂时没有)
            billList: [], // 商品订单详情
            menu: [
                { text: "待确认" },
                { text: "待提货" },
                { text: "已完成" },
                { text: "已取消" }
            ],
            titleIndex: '', // tab定位使用
            loading: false,
            finished: false,
            page: 0
        }
    },
    mounted() {
        if (this.tabLocation.currentIndex !== '') {
            this.currentIndex = parseInt(this.tabLocation.currentIndex)
            this.state = parseInt(this.tabLocation.currentIndex) + 1
        } else if (this.$route.query.titleIndex !== '' && this.tabLocation.currentIndex == '') {
            this.currentIndex = parseInt(this.$route.query.titleIndex)
            this.state = parseInt(this.$route.query.titleIndex) + 1
        } else {
            this.state = ''
        }
    },
    methods: {
        backEvent() {
            this.$router.go(-1)
            this.setTabLocation(this.$assign({}, this.tabLocation, { currentIndex: '' }))
            this.$bridgefunc.vuexStorage()
        },
        tabChange(index) {
            // 根据菜单判断操作状态 1提交 2确认 3提货完成 4取消
            this.currentIndex = index
            this.state = index + 1
            this.billList = []
            this.page = 0
            this.finished = false
            this.setTabLocation(this.$assign({}, this.tabLocation, { currentIndex: index }))
            this.$bridgefunc.vuexStorage()
        },
        loadMore() {
            // 获取购油订单列表数据
            this.page = this.page + 1
            let paramsData = {
                token: this.$store.state.login.token,
                state: this.state,
                page: this.page,
                vipUnitUserCode: this.vipUnitUser.vipUnitUserId, // 单位用户id
                rows: 10
            }
            this.$http.post('/app/json/app_oil_sale/getOilSaleOrderList', paramsData).then(res => {
                let data = res.data
                if (data.status == 0) {
                    this.billList = this.billList.concat(data.data)
                    if (this.billList.length >= data.totalRecords) {
                        this.finished = true
                    }
                } else {
                    this.finished = true
                    this.$Toast(res.info ? res.info : '获取列表失败')
                }
                this.loading = false
            })
        },
        openDetails(items) {
            // 打开详情
            this.$router.push({ path: "/buy-oil-order-details", query: { billItem: JSON.stringify(items) } })
        },
        fillInAddressHandle(item) {
            this.$router.push({
                path: '/bidding-confirmation-order',
                query: {
                    biddingData: JSON.stringify(item)
                }
            })
        },
        ...mapMutations(['setTabLocation'])
    },
    computed: {
        ...mapGetters(['tabLocation', 'vipUnitUser'])
    },
    components: {
        Countdown,
        [List.name]: List
    }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';
@import '../../assets/stylus/oil-sale-base.styl';

.buy-oil-order-list {
    display: flex;
    flex-direction: column;

    .nav-bar {
        height: 44px;
        line-height: 44px;
        display: flex;
        background: #fff;
        flex-shrink: 0;

        .nav-bar-item {
            text-align: center;
            flex: 1;
            font-size: 14px;

            .text {
            }

            &.active {
                .text {
                    color: #009df8;
                    position: relative;

                    &:after {
                        content: '';
                        position: absolute;
                        bottom: -6px;
                        width: 100%;
                        left: 0;
                        height: 2px;
                        background: #009df8;
                    }
                }
            }
        }
    }
}

.my-group-list {
    padding: 11px 15px;
    flex: 1;
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;

    .bill-btn {
        width: 25%;

        .btn-show {
            padding: 6px 0 !important;
            width: 80%;
            margin: 0 auto;
        }
    }

    .tip {
        padding: 20px 0;
        text-align: center;
        color: $color-text-l;
    }

    .record-btn-show {
        .record-img {
            .tips {
                color: #009df8;
            }
        }
    }

    .count-down {
        padding: 5px 0;
    }
}

.special {
    .center {
        padding-left: 5px;
        display: flex;
        justify-content: space-between;
        align-items: left;
        flex-direction: column;
        line-height: 20px;

        .title {
            font-size: 14px;
        }

        .tips, .time {
            color: $color-text-d;
        }
    }
}

.item {
    display: inline-block;
    width: 22px;
    margin-right: 5px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    background-color: #1989fa;
}
</style>

<template>
    <div class="card-classifyList-index">
        <nav-top title="视听卡搜索" @backEvent="$router.go(-1)">
            <div class="search-div theme_bg_white_f5"
                style="left: 50px; right: 55px; height: 30px; top: 7px; padding: 0 15px; border-radius: 15px;">
                <i class="iconfont mall-sousuo theme_font_tint" style="font-size: 16px;"></i>
                <form class="search-input" action id="form">
                    <input style="display: none" type="text" name="keyword">
                    <input id="searchInput" class type="search" placeholder="搜你想要的商品" v-model="searchStr"
                        @keyup.enter="searchgoods">
                </form>
            </div>
        </nav-top>
        <nav-content class="card-classifyList-content">
            <div class="card-classifyList">
                <van-cell v-for="(item, index) in addressArr" :key="index" :title="item.cityName"
                    @click="gorecharge(item)" />
            </div>
        </nav-content>
    </div>
</template>

<script>

export default {
    data() {
        const indexList = ['#'];
        const charCodeOfA = 'A'.charCodeAt(0);
        for (let i = 0; i < 26; i++) {
            indexList.push(String.fromCharCode(charCodeOfA + i));
        }
        return {
            searchStr: '',
            indexList,
            addressArr: []
        }
    },
    mounted() {
        this.getAddress()
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
            console.log(123456)
        },
        gorecharge(item) {
            console.log(item)
            this.$router.push({
                path: '/ticket',
                query: { item: JSON.stringify(item) }
            })
        },
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.card-classifyList-index {
    .go-recharge-bill {
        font-size: 14px;
        margin-right: 15px;
        text-align: right;
    }

    .search-div {
        position: absolute;
        display: flex;
        align-items: center;

        .icon-font {
            font-size: $font-size-medium;
        }

        .search-input {
            flex: 1;
            margin-left: 10px;
            font-size: $font-size-medium;

            input {
                background: none;
                width: 100%;
                height: 100%;
            }
        }
    }

    .card-classifyList-content {
        .card-classifyList {
            height: 100%;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }
    }
}
</style>

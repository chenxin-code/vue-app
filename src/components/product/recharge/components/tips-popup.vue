<template>
    <div>
        <div class="table-view-cell-arrow" @click="openPopup"></div>
        <van-popup v-model="showOil" position="bottom">
            <van-picker
                show-toolbar
                :title="title"
                :columns="columns"
                @cancel="onCancel"
                @confirm="onConfirm"
            />
        </van-popup>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            columns: [],
            showOil: false, // 油库选择弹框
        }
    },
    props: {
        isOpenPopup: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '选择汽车类型'
        }
    },
    mounted() {
        console.log(this.$store)
    },
    // computed: {
    //   ...mapState([
    //     'token'
    //   ])
    // },
    methods: {
        onCancel() {
            // 取消按钮
            this.showOil = false
        },
        onConfirm(value, index) {
            this.showOil = false
            // this.$Toast(`当前值：${value}, 当前索引：${index}`)
            this.$emit('getOilInfo', value)
            console.log(value)
        },
        openPopup() {
            // 打开弹框
            if (this.isOpenPopup == true) {
                this.showOil = true
            } else {
                this.showOil = false
            }
        },
        getCarTypeList() {
            this.$request.post('/app/json/user/queryVehicleType').then(res => {
                if (res.status == 0) {
                    this.columns = res.data
                }
            })
        }
    },
    components: {}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
/deep/ .van-popup {
    width: 100% !important;
    border-radius: 0 !important;
}

.icon-info {
    .icon {
        display: flex;
        align-items: center;

        .small {
            display: inline-block;
            width: 4px;
            height: 4px;
            background: #999;
            border-radius: 50%;
        }

        .big {
            display: inline-block;
            width: 6px;
            height: 6px;
            background: #666;
            border-radius: 50%;
            margin: 0 3px;
        }
    }
}
</style>

<template>
    <div>
        <div class="viola-detail">
            <ul>
                <li class="viola-item">
                    <div class="viola-title">决定书编码：</div>
                    <div class="viola-content">{{violadetail.number}}</div>
                </li>
                <li class="viola-item">
                    <div class="viola-title">车牌号码：</div>
                    <div class="viola-content">{{violadetail.plateNumber}}</div>
                </li>
                <li class="viola-item">
                    <div class="viola-title">违法时间：</div>
                    <div class="viola-content">{{violadetail.penaltyDate}}</div>
                </li>
                <li class="viola-item">
                    <div class="viola-title">违法城市：</div>
                    <div class="viola-content">{{violadetail.province}}</div>
                </li>
                <li class="viola-item">
                    <div class="viola-title">罚款金额：</div>
                    <div class="viola-content">{{violadetail.fine}}元</div>
                </li>
                <li class="viola-item">
                    <div class="viola-title">服务费：</div>
                    <div class="viola-content">{{violadetail.serviceCharge}}元</div>
                </li>
                <li class="viola-item">
                    <div class="viola-title">滞纳金：</div>
                    <div class="viola-content">{{violadetail.overdueFine}}元</div>
                </li>
                <li class="viola-item">
                    <div class="viola-title">共需支付：</div>
                    <div class="viola-content total-price">{{violadetail.salePrice}}元</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        violadetail:{}
    },
    data() {
        return {
            
        }
    },
    mounted(){
        console.log(this.violadetail)
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.viola-detail, .order-detail {
    border-radius: 5px;
    background-color: #fff;
    padding: 10px;

    .viola-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height 30px;
        font-size: 14px;

        .viola-title {
            color: #797979;
            width 30%;
        }

        .total-price {
            color red;
        }
    }
}
</style>

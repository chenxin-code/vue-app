<template>
  <div class="mine-card-expense-demand">
    <div class="tip">
      <p class="demand">加油卡消费记录查询:</p>
      <p class="demend-time">当日加油交易记录可在48小时后查询</p>
    </div>
    <mineCardDemand :card="card"></mineCardDemand>
  </div>
</template>

<script>
  import { DatetimePicker,Toast } from 'mint-ui'
  import mineCardDemand from './mine-card-demand'
  export default {
    name: 'MineCarExpenseDemand',
    components: {
      DatetimePicker,
      Toast,
      mineCardDemand
    },
    data () {
      return {
        card:{
          "cardBalance": "0.0",
          "cardNo": "9030240002351554",
          "cardType": "个人卡",
          "cityName": "邯郸市",
          "pointBalance": "100",
          "reserveBalance": "81.05",
          "totalBalance": "81.05"
        },
      }
    },
    methods: {
      open(picker) {
        this.$refs[picker].open();
      },
      handleChange(value) {
        Toast({
          message: '已选择 ' + value.toString(),
          position: 'bottom'
        });
      },

      handleVisibleChange(isVisible) {
        console.log('弹窗是否展示:', isVisible);
      },
      getCookie: function () {
        return "4.3M";
      }
    },
    created () {
      this.card.carNo = this.$route.query.cardNo
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .mine-card-expense-demand{
    background-color: $color-background-lll;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .tip{
      padding:10px 8%;
      background: $color-theme-btn-l
      p{
        color: #fff;
        font-size: $font-size-small;
        padding:2px 0px;
      }
    }
  }

</style>

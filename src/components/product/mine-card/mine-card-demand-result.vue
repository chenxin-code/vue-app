<template>
  <div class="mine-card-demand">
    <div class="card-num">
      <p>加油卡卡号:{{card.cardNo}}</p>
      <p>交易时间: {{startDate}}至{{endDate}}</p>
    </div>
    <ul class="form">
      <li class="item width25">序号</li>
      <li class="item width25">金额</li>
      <li class="item width50">交易时间</li>
    </ul>
    <ul class="form reset">
      <li class="form-item" v-for="item in list">
        <p class="item width25">{{item.serialNum}}</p>
        <p class="item width25">{{item.rechargeAmount?item.rechargeAmount:item.consumeAmount}}</p>
        <p class="item width50">{{item.rechargeTime?item.rechargeTime:item.consumeTime}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
  import {DatetimePicker, Toast} from 'mint-ui'

  export default {
    name: 'mineCardDemand',
    components: {
      DatetimePicker,
      Toast
    },
    data() {
      return {
        startDate: '',
        endDate: '',
        card: {
          "cardBalance": "0.0",
          "cardNo": "9030240002351554",
          "cardType": "个人卡",
          "cityName": "邯郸市",
          "pointBalance": "100",
          "reserveBalance": "81.05",
          "totalBalance": "81.05"
        },
        list: [
//          {
//            num: "1",
//            money: "0.01",
//            time: "2018-04-16 12:03:06"
//          },
//          {
//            num: "1",
//            money: "0.01",
//            time: "2018-04-16 12:03:06"
//          },
//          {
//            num: "1",
//            money: "0.01",
//            time: "2018-04-16 12:03:06"
//          },
//          {
//            num: "1",
//            money: "0.01",
//            time: "2018-04-16 12:03:06"
//          },
//          {
//            num: "1",
//            money: "0.01",
//            time: "2018-04-16 12:03:06"
//          }
        ]
      }
    },
    methods: {
      getCookie: function () {
        return "4.3M";
      }
    },
    created() {
      document.title = this.$route.query.tag == '1' ? "消费查询结果" : "充值查询结果";
      this.list = JSON.parse(this.$route.query.listJson);
      this.card.cardNo = this.$route.query.cardNo;
      this.startDate = this.$route.query.startDate;
      this.endDate = this.$route.query.endDate
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .mine-card-demand {
    background-color: $color-background-lll;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y auto
    .card-num {
      overflow: hidden;
      padding: 0px 3%;
      padding 8px;
    //height:30px;
    //line-height:2px;
      font-size: 14px;
      background: #fff;
      color: $color-text-l;
      p {
        padding 2px 0px
      }
    }
    .form {
      margin-top: 10px;
      background: #fff;
      overflow: hidden;
    // border-bottom:1px solid #ddd;
      .item {
        float: left;
        text-align: center;
        font-size: $font-size-medium;
        color: #666;
        padding: 10px 0px;
        border-right: 1px solid $color-line-gray-l;
      }
      .width25 {
        width: 25%
      }
      .width50 {
        width: 49%;
        border-right: none;
      }
    }
    .reset {
      margin-top: 0px;
      .form-item {
        overflow: hidden;
        border-top: 1px solid $color-line-gray-l;
      }
      .form-item:last-child {
        border-bottom: none;
      }
    }
  }

</style>

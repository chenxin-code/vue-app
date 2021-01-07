<template>
  <div id="oilMoney">
    <!-- 头部 -->
    <mt-header title="油卡积分">
      <mt-button icon="back" @click="backEvent" slot="left"></mt-button>
      <router-link to="./explains" slot="right">
        <mt-button>油卡积分说明</mt-button>
      </router-link>
    </mt-header>
    <div class="conter">
      <mt-cell title="主卡卡号" class="info"><span style="color:#333">{{cardmoney.cardno}}</span></mt-cell>
      <mt-cell title="油卡积分总额（可加油）" class="goaddcard" icon="">
        <span style="color:#333">￥{{cardmoney.totalintegral}}</span>
      </mt-cell>
      <ul class="Effect">
        <li>加油卡号</li>
        <li>持卡人</li>
        <li>余额</li>
        <li>备用余额</li>
        <li>总余额</li>
      </ul>
      <ul class="Effect">
        <li>{{cardmoney.cardno | jiami}}</li>
        <li>{{cardmoney.cardholder}}</li>
        <li>{{cardmoney.integral}}</li>
        <li>{{cardmoney.preintegral}}</li>
        <li>{{cardmoney.totalintegral}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    filters: { //监听加密卡号
      jiami(bankNumber) {
        if (bankNumber) {
          return ("****" + bankNumber.substr(-4));
        } else {
          return ''
        }
      }
    },
    data() {
      return {
        cardmoney: '',
      }
    },
    created() {
      console.log(this.$route.query);
      this.render();
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1)
      },
      render() {
        this.$Loading.open();
        let _this = this;
        let url = '/app/json/card/getCardInfoList';
        this.$http.post(url, {
          cardno: this.$route.query.usercard,
        }).then(
          res => {
            _this.$Loading.close();
            console.log(res);
            console.log(this.$route.query.mindex)
            _this.cardmoney = res.data.data.cardAcctList[this.$route.query.mindex]
            console.log(_this.cardmoney)
          })
      }
    }
  }
</script>

<style scoped>
  .mint-header {
    margin-top: 0.693333rem;
  }

  #oilMoney {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  /* .navcontent{
    line-height: 24px!important;
  } */
  .mint-header {
    background: #fff;
    color: #000;
    height: 60px;
    font-size: 20px;
  }

  .mintui-back {
    font-size: 28px;
  }

  .mint-button-text {
    font-size: 14px;
  }

  .conter {
    padding: 0 10px;
  }

  .info {
    border-bottom: 1px solid #e6e7e7;
    margin-bottom: 5px;
  }

  .goaddcard {
    box-shadow: 0 2.5px 5px #eee;
    margin-bottom: 12px;
  }

  .fl-right {
    float: right;
  }

  .Effect {
    display: flex;
    border-bottom: 1px solid #e6e7e7;
    /* padding: 10px 0; */
  }

  .Effect li {
    flex: 1;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-right: 1px solid #e6e7e7;
    color: #333;
  }

  .Effect li:nth-last-of-type(1) {
    border-right: none;
  }

  .mint-cell-text {
    color: #666;
  }
</style>
<style>
  #oilMoney .mintui-back {
    font-size: 28px;
  }

  #oilMoney .mint-header {
    margin-top: 0.693333rem;
  }

  #oilMoney .mint-header {
    background: #fff;
    color: #000;
    height: 60px;
    font-size: 20px;
  }

  #oilMoney .mintui-back {
    font-size: 28px;
  }

  #oilMoney .mint-field-core {
    font-size: 13px;
  }

  #oilMoney .mint-button-text {
    font-size: 14px;
  }
</style>

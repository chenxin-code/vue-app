<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="微店收益"></nav-top>
    <nav-content style="overflow-y: auto;">
     <!-- 账户余额-->
<!--     <div class="profit" v-if="showView == 1">-->
<!--       <p class="p1"><span>{{profit.moneyBalance}}</span> 元</p>-->
<!--       <p>账户余额</p>-->
<!--       <div class="div1">-->
<!--          <div>-->
<!--            <p>{{profit.moneyAccounted}}</p>-->
<!--            <p>已入账收益金额（元）</p>-->
<!--          </div>-->
<!--         <div>-->
<!--           <p>{{profit.moneyUnaccounted}}</p>-->
<!--           <p>未入账收益金额（元）</p>-->
<!--         </div>-->
<!--       </div>-->
<!--     </div>-->

      <!-- 账户积分-->
      <div class="profit" v-if="showView == 3">
        <p class="p1"><span>{{profit.integralAccounted+profit.integralUnaccounted}}</span></p>
        <p>账户积分</p>
        <div class="div1">
          <div>
            <p>{{profit.integralAccounted}}</p>
            <p>收益已入账积分</p>
          </div>
          <div>
            <p>{{profit.integralUnaccounted}}</p>
            <p>收益未入账积分</p>
          </div>
        </div>
      </div>
      <!-- 油滴-->
      <div class="profit" v-if="showView == 8">
        <p class="p1"><span>{{profit.oilAccounted+profit.oilUnaccounted}}</span> 升</p>
        <p>油滴</p>
        <div class="div1">
          <div>
            <p>{{profit.oilAccounted}}</p>
            <p>已入油滴</p>
          </div>
          <div>
            <p>{{profit.oilUnaccounted}}</p>
            <p>未入油滴</p>
          </div>
        </div>
      </div>
      <!-- 豌豆-->
      <div class="profit" v-if="showView == 9">
        <p class="p1"><span>{{profit.peasBalance}}</span> 个</p>
        <p>豌豆</p>
        <div class="div1">
          <div>
            <p>{{profit.peasAccounted}}</p>
            <p>已入账豌豆</p>
          </div>
          <div>
            <p>{{profit.peasUnaccounted}}</p>
            <p>未入账豌豆</p>
          </div>
        </div>
      </div>
      <!-- 收益金额-->
       <div class="profit" v-if="showView == 0">
        <p class="p1"><span>{{profit.moneyBalance}}</span> 元</p>
        <p>收益金额</p>
      </div>
      <div class="detailBox">
          <div class="contain">
           <div class="containDiv" v-for="(item,index) in dataList" :key="index">
              <div class="row">
                <span>{{item.dateStr}}</span>
                <span>{{strtext(item.rewardStatus)}}</span>
              </div>
             <div class="row" style="margin-top: 12px;">
                <span>订单号：{{item.orderNo}}</span>
                <span>{{item.amount}} {{$route.params.type==3?'积分':($route.params.type==8?'L':($route.params.type==9?'个':'元'))}}</span>
             </div>
           </div>
        </div>
      </div>
      <div class="tip">
       <p class="tipP">说明：</p>
        <p>未入账收益：在售后期限内，所产生的收益，统称未入账收益；</p>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import api from './api'
  export default {
    name: "Profit",
    mixins: [api],
    data() {
      return {
        showView: 0,
        profit: {},
        dataList: []
      }
    },
    created() {

    },
    mounted() {
      if (this.$route.params.type == 3) { // 积分
        this.showView = 3
      } else if (this.$route.params.type == 8) {
        this.showView = 8
      } else if (this.$route.params.type == 9) {
        this.showView = 9
      } else if (this.$route.params.type == 0) { // 现金
        this.showView = 0
      }
      this.loadIndex()
      this.loadIndex1()
    },
    methods: {
      strtext(srt) {
        let text = ''
        if(srt == 0){
          text='待入账'
        } else if (srt == 1) {
          text='已入账'
        } else if (srt == 2) {
          text='未入账'
        } else if (srt == 3) {
          text='已入账'
        }
        return text
      },
      loadIndex() {
        let that = this
        let params = {
          token: this.$store.state.login.token,
          rewardType: this.showView
        }

        that.profitData(params).then(res => {
          let data = res.data.data || {}
          console.log(data)
          // that.profit = data
        })
      },
      loadIndex1() {
        let that = this
        let params = {
          token: this.$store.state.login.token,
          // queryType: that.queryType,
          // queryDateType: that.queryDateType
          rewardType: this.$route.params.type // 0 现金 3 积分
        }

        that.profitDatahn(params).then(res => {
           that.profit = res.data.data || {}
           that.dataList = res.data.data.dataList || []
        })
      },
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background #f6f6f6 !important;
    .tip {
      background white;
      margin 10px 0
      padding 20px
      /*text-align center*/
      font-size 14px;
      color #666666
      .tipP {
        font-size 16px;
        font-weight 600
        margin-bottom 10px;
        color black
      }
    }
    .profit {
      background white;
      margin 10px 0
      padding 20px 0
      text-align center
      font-size 16px;
      .p1 {
        color #f44;
        margin 10px 0;
        span {
          font-size 22px;
          font-weight 600
        }
      }
      .div1 {
        display flex
        justify-content space-around
        margin-top 20px;
        div {
          p {
            margin 10px 0
          }
          p:nth-child(1) {
            font-weight 600
          }
          p:nth-child(2) {
            font-size 14px;
          }
        }
      }
    }
  }
  .detailBox {
      background white
      .screen {
        background: white;
        display: flex;
        padding: 15px 0;
        font-size: 15px;
        width: 94%;
        margin: 0 auto;
        border-bottom: 1px solid #e5e5e5;
        div {
          width 50%
          text-align center
        }
        .div1 {
          width: 50%;
          text-align: center;
          border-right: 1px solid #e5e5e5;
        }
      }
      .contain {
        width: 94%;
        margin: 0 auto;
        .containDiv {
          padding: 15px 10px;
          // display flex
          // justify-content: space-between;
          border-bottom: 1px solid #e5e5e5;
          .row {
            width 100%
            display flex
            justify-content space-between
            align-items center
          }
          .p1 {
            margin-bottom 10px
          }
          span {
            margin auto 0
          }
        }
        
      }
  }
</style>

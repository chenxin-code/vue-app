<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="现金收益"></nav-top>
    <nav-content style="overflow-y: auto;">
      <!-- 现金收益-->
       <div class="profit">
        <p class="p1"><span>{{profit.moneyAccounted+profit.moneyUnaccounted}}</span> 元</p>
        <p>总金额</p>
        <div class="div1">
          <div>
            <p>{{profit.moneyUnaccounted?profit.moneyUnaccounted:0}}</p>
            <p>待入账（元）</p>
          </div>
          <div>
            <p>{{profit.moneyAccounted?profit.moneyAccounted:0}}</p>
            <p>已入账（元）</p>
          </div>
          <div>
            <p>{{profit.moneyUnDrawn?profit.moneyUnDrawn:0}}</p>
            <p>待提现（元）</p>
          </div>
          <div>
            <p>{{profit.moneyDrawn?profit.moneyDrawn:0}}</p>
            <p>已提现（元）</p>
          </div>
        </div>
      </div>
      <div class="detailBox">
        <!-- <div class="screen">
            <div class="div1" @click="cashData">
             {{cashDataStr}}<span class="iconfont mall-arrow-down"></span>
            </div>
            <div @click="timeData">
             {{timeDataStr}}<span class="iconfont mall-arrow-down"></span>
            </div>
        </div> -->
        <div class="contain">
           <div class="containDiv" v-for="(item,index) in dataList" :key="index">
              <div class="row">
                <span>{{item.dateStr}}</span>
                <span>{{strtext(item.rewardStatus)}}</span>
              </div>
             <div class="row" style="margin-top: 12px;">
                <span>订单号：{{item.orderNo}}</span>
                <span>¥ {{(item.amount).toFixed(2)}}</span>
             </div>
             <!-- <div>
               <p class="p1">{{item.dateStr}}</p>
               <p v-if="item.orderNo">订单号:{{item.orderNo}}</p>
             </div>
             <span v-if="item.amountStr">{{item.amountStr}}</span> -->
           </div>
        </div>
      </div>
      <!-- <div class="tip">
       <p class="tipP">说明：</p>
        <p>未入账收益：在售后期限内，所产生的收益，统称未入账收益；</p>
      </div> -->
      <van-action-sheet
        v-model="show1"
        :actions="actions1"
        @select="onSelect1"
      />
    <van-action-sheet
      v-model="show2"
      :actions="actions2"
      @select="onSelect2"
    />
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
        cashDataStr: '金额明细',
        timeDataStr: '最近1年',
        showView: 0,
        profit: {},
        show2: false,
        dataList: [],
        queryType: '1', //1 余额明细de 2待入帐明细 3提现明细 4已入账明细
        queryDateType: '1', //1 最近1年 2 最近3月 3 最近1月
        actions2: [
          {name: '最近1年',queryDateType: '1'},
          {name: '最近3月',queryDateType: '2'},
          {name: '最近1月',queryDateType: '3'}
        ],
        actions1: [
          {name: '金额明细',queryType: '1'},
          {name: '待入账明细',queryType: '2'},
          {name: '提现明细',queryType: '3'},
          {name: '已入账明细',queryType: '4'}
        ],
        show1: false,
      }
    },
    created() {

    },
    mounted() {
      this.loadIndex()
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
          // queryType: that.queryType,
          // queryDateType: that.queryDateType
          rewardType: 0 // 0 现金 3 积分
        }

        that.profitDatahn(params).then(res => {
           that.profit = res.data.data || {}
           that.dataList = res.data.data.dataList || []
        })
      },
      cashData() {
        this.show1 = true
      },
      timeData() {
        this.show2 = true
      },
      onSelect2(item) {
        this.timeDataStr = item.name
        this.queryDateType = item.queryDateType
        this.loadIndex()
        this.show2 = false
      },
      onSelect1(item) {
        this.cashDataStr = item.name
        this.queryType = item.queryType
        this.loadIndex()
        this.show1 = false
      }
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
    }
</style>

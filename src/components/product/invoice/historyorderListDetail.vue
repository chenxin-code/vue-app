<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="订单明细"></nav-top>
    <nav-content>
      <div class="publicInvoice">
        <van-cell-group>
          <div class="div1">
            <van-field :label="paramsData.storeName" disabled/>
            <van-field v-model="paramsData.orderId" label="订单号" disabled/>
            <van-field v-model="paramsData.transactionTime" label="下单时间" disabled/>
            <van-field v-model="paramsData.model" label="油品型号" v-if="oilView" disabled/>
            <van-field v-model="paramsData.fuelLift" label="加油升数" v-if="oilView" disabled/>
            <van-field v-model="paramsData.deliveryType" label="配送方式" v-if="!oilView" disabled/>
          </div>
          <div class="div1" v-if="!oilView">
            <van-field label="商品明细" disabled/>
            <div v-for="item in paramsData.commodityModels">
              <!--                <van-field v-model="item.amount" label="赖茅酒 x 1" disabled/>-->
              <van-field v-model="item.amount" :label="item.tradeName +'x'+ item.tradeCount" disabled/>
            </div>
          </div>
          <div class="div1 div2">
            <van-field v-model="paramsData.amountPayable" label="应付金额" disabled/>
            <van-field v-model="paramsData.prefAmount" label="优惠金额" disabled/>
            <van-field v-model="paramsData.vouchersAmount" label="代金券金额" disabled/>
            <van-field v-model="paramsData.actualAmount" label="实付金额" disabled/>
            <van-field v-model="paramsData.invoiceAmount" label="可开票金额" disabled/>
          </div>
        </van-cell-group>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from "./api";
  import {Toast} from 'vant'
  export default {
    name: "orderListDetail",
    mixins: [api],
    data() {
      return {
        paramsData: {},
        id: '',
        orderTypeName: '',
        orderId: 0,
        oilView: true,
        goldId: '',
        id1: ''
      }
    },
    created() {
      this.id = this.$route.query.id
      this.id1 = this.$route.query.id
      this.orderTypeName = this.$route.query.orderTypeName
      // this.goldId = this.$route.query.orderId
      let that = this
      if (that.orderTypeName == '商品订单') {
        that.orderId = 777888
        that.oilView = false
        this.loadData()
      } else if (that.orderTypeName == '油品订单') {
        that.orderId = 98098890
        that.oilView = true
        this.loadData()
      }  else if (that.orderTypeName == '加油订单') {
        that.loadData()
        that.oilView = true
      } else if (that.orderTypeName == '现金加油订单') {
        that.loadData3()
        that.oilView = false
      }
    },
    mounted() {

    },
    methods: {
      loadData() {
        let that = this
        let params = {
          token: that.$store.state.login.token,
          id: that.id,
          orderId: that.orderId
        }

        that.hisdetailData(params).then(res => {
          if (res.data.result === 'success') {
            that.paramsData = res.data.data
          } else {
            Toast(res.data.info)
          }
        })
      },
      loadData3() {
        let that = this
        let data = ''
        if (that.id1 instanceof Array){
          if (that.id1.length){
            data = that.id1.join(',')
          }else{
            data = ''
          }
        }else {
          data = that.id1
        }
        let params = {
          token: that.$store.state.login.token,
          ids: data
        }

        that.golddetailData(params).then(res => {
          if (res.data.result === 'success') {
            that.paramsData = res.data.data || {}
          } else {
            Toast(res.data.info)
          }
        })
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .publicInvoice {
    box-shadow: #f3f3f3 0px 0px 15px;
    width: 95%;
    margin: 0 auto 10px auto;

    /deep/ .van-cell:not(:last-child)::after {
      right: 0.4rem;
    }
    .van-cell-group {
      /deep/ .van-field__control {
        text-align: right;
      }

      /deep/ .van-field__control:disabled {
        color: #323233;
      }
    }
    .div1 {
      border-bottom: 0.026667rem solid #ebedf0!important;
      margin: 0.266667rem 0.4rem;
    }
    /deep/ .div1 .van-cell div:nth-child(1) {
      width auto !important
    }

    .div2 {
      border-bottom: none!important;
    }
  }

  /deep/ .van-cell-group .van-cell:not(:last-child)::after {
    border-bottom: 0!important
  }
  /deep/ .van-cell-group .van-cell:nth-child(1) span {
    font-size 16px;
    color black
  }
  /deep/ .van-field__label {
    max-width: auto!important
  }
  /deep/ .nav-content {
    overflow-y auto !important
  }
</style>

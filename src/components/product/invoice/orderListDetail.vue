<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="订单详情"></nav-top>
    <nav-content>
      <div class="publicInvoice">
        <van-cell-group>
          <div class="div1">
            <!--             <van-field :label="paramsData.storeName" disabled/>-->
            <span class="span">{{paramsData.storeName}}</span>
            <van-field v-model="paramsData.shoppingOrderId" label="订单号" disabled/>
            <van-field v-model="paramsData.completeTime" label="下单时间" disabled/>
            <van-field v-model="paramsData.refuelOilName" label="油品型号" v-if="oilView" disabled/>
            <van-field v-model="paramsData.refuelLiter" label="加油升数" v-if="oilView" disabled/>
            <!--             <van-field v-model="paramsData.deliverType" label="配送方式" v-if="!oilView" disabled/>-->
            <div class="openBox" v-if="!oilView">
              <div class="openBox1">
                <span>配送方式</span>
              </div>
              <div>
                <span class="span" v-if="paramsData.deliverType == 1">自提</span>
                <span class="span" v-if="paramsData.deliverType == 2">配送</span>
              </div>
            </div>
          </div>
          <div class="div1" v-if="!oilView">
            <van-field label="商品明细" disabled/>
            <div v-for="item in paramsData.itemAbstractList">
              <div class="van-multi-ellipsis--l2" style="padding: 0 18px;margin-bottom: 3px">
                {{item.skuName}}
              </div>
<!--              <span style="padding: 0 13px"></span>-->
              <van-field v-model="item.realPrice" :label="item.realPrice +'x'+ item.number" disabled/>
            </div>
          </div>
          <div class="div1 div2">
            <van-field v-model="paramsData.totalAmount" label="应付金额" disabled/>
            <van-field v-model="paramsData.discountAmount" label="优惠金额" disabled/>
            <van-field v-model="paramsData.couponAmount" label="代金券金额" disabled/>
            <van-field v-model="paramsData.payAmount" label="实付金额" disabled/>
            <van-field v-model="price" label="可开票金额" disabled/>
          </div>
        </van-cell-group>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from './api'
  import {Toast} from 'vant'
  export default {
    name: "orderListDetail",
    mixins: [api],
    data() {
      return {
        paramsData: {},
        oilView: true, //为true是加油卡订单，  false为商品订单
        orderId: '',
        price: ''
      }
    },
    created() {
      this.orderId = this.$route.query.orderId
      this.orderTypeName = this.$route.query.orderTypeName
      console.log(this.$route.query.orderTypeName);
    },
    mounted() {
      let that = this
      if (that.orderTypeName == '商城订单') {
        that.loadData1()
        that.oilView = false
      } else if (that.orderTypeName == '加油订单' || that.orderTypeName == 'ETC无感加油订单') {
        that.loadData2()
        that.oilView = true
      } else if (that.orderTypeName == '便利店订单') {
        let that = this
        let params = {
          token: that.$store.state.login.token,
          // orderType: 200015, //
          orderId: that.orderId
        }
        that.shopdetailData(params).then(res => {
          if (res.data.result === 'success') {
            that.paramsData = res.data.data || {}
            console.log(typeof Number(that.paramsData.payAmount));
            console.log(typeof that.paramsData.invoiceCouponAmount);
            if (!that.paramsData.invoiceCouponAmount){
              that.paramsData.invoiceCouponAmount = 0
            }
            that.price = (that.paramsData.payAmount + that.paramsData.invoiceCouponAmount).toFixed(2)
            // that.price = (Number(that.paramsData.payAmount) + Number(that.paramsData.invoiceCouponAmount)).toFixed(2)
          } else {
            Toast(res.data.info)
          }
        })
        that.oilView = true
      }
    },
    methods: {
      loadData1() {
        let that = this
        let params = {
          token: that.$store.state.login.token,
          orderType: 200017,
          orderId: that.orderId
        }

        that.malldetailData(params).then(res => {
          if (res.data.result === 'success') {
            that.paramsData = res.data.data || {}
            console.log(typeof that.paramsData.payAmount);
            console.log(typeof that.paramsData.invoiceCouponAmount);
            if (!that.paramsData.invoiceCouponAmount){
              that.paramsData.invoiceCouponAmount = 0
            }
            // that.price = (Number(that.paramsData.payAmount) + Number(that.paramsData.invoiceCouponAmount)).toFixed(2)
            that.price = (that.paramsData.payAmount + that.paramsData.invoiceCouponAmount).toFixed(2)
          } else {
            Toast(res.data.info)
          }
        })
      },
      loadData2() {
        let that = this
        let params = {
          token: that.$store.state.login.token,
          orderId: that.orderId,
          orderType: 100011,
        }
        if (this.$route.query.source == 'janeIndex') {
          this.$http.post('/app/json/user_invoice_assistant/ordEsayPayOrderDetail', params).then(res => {
            let data = res.data
            console.log('------>',data)
            if (data.status == 0 || res.data.result === 'success') {
              that.paramsData = data.data || {}
              that.paramsData.shoppingOrderId = that.paramsData.id || ''
              if (!that.paramsData.invoiceCouponAmount){
                that.paramsData.invoiceCouponAmount = 0
              }
              that.price = (that.paramsData.payAmount + that.paramsData.invoiceCouponAmount).toFixed(2)
            } else {
              Toast(res.data.info)
            }
          })
        } else {
          that.oildetailData(params).then(res => {
            if (res.data.result === 'success') {
              that.paramsData = res.data.data || {}
              console.log(typeof that.paramsData.payAmount);
              console.log(typeof that.paramsData.invoiceCouponAmount);
              if (!that.paramsData.invoiceCouponAmount){
                that.paramsData.invoiceCouponAmount = 0
              }
              that.price = (that.paramsData.payAmount + that.paramsData.invoiceCouponAmount).toFixed(2)
            } else {
              Toast(res.data.info)
            }
          })
        }
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
    .div2 {
      border-bottom: none!important;
    }
  }

  .openBox {
    display: flex;
    justify-content: space-between;
    margin: 0 0.4rem;
    padding: 0.266667rem 0;
    box-sizing: border-box;
    color: #323233;
    font-size: 0.373333rem;
    line-height: 0.64rem;
    .openBox1 {
      span:nth-child(2) {
        font-size: 12px;
        margin-left: 6px;
        color #323233
      }
    }
    .span {
      padding 0 14px;
    }
  }
  /deep/ .van-cell-group .van-cell:not(:last-child)::after {
    border-bottom: 0!important
  }
  /deep/ .van-cell-group .van-cell:nth-child(1) span {
    font-size 16px;
    color black
  }
  .span {
    padding: 0.266667rem 0.4rem;
    line-height: 0.64rem;
    display: block;
    font-size: 14px;
  }
</style>

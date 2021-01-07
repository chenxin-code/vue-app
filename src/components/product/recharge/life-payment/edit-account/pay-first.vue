<template>
  <div class="pay-first">
    <!--    生活缴费先付费-->
    <nav-top :title="`${title}充值`" @backEvent="$router.go(-1)">
      <!-- <div class="life-pay">北京市</div> -->
    </nav-top>
    
    <nav-content class="pay-first-details">
      <div class="p10">
        <div class="p10 pay-first-content">
          <div class="money">
            <div class="balance-txt">
              <p v-if="detailsData.balanceAmount * 1 > 0">暂无欠费记录</p>
              <p v-else>账户欠费 <span>{{detailsData.balanceAmount}}</span>元</p>
            </div>
            <div class="balance flex-between">
              <p>账户余额</p>
              <!--              <p><span>53.00</span>元</p>-->
              <p><span class="colorRed">{{detailsData.balanceAmount}}</span>元</p>
            </div>
          </div>
          
          <div class="info">
            <div class="houseNumber flex-between">
              <p class="left">缴费户号</p>
              <p class="right">{{detailsData.account}}</p>
            </div>
            <div class="account-name flex-between">
              <p class="left">账户姓名</p>
              <p class="right">{{detailsData.accountName}}</p>
            </div>
            <div class="account-address flex-between">
              <p class="left">账户地址</p>
              <p class="right">{{detailsData.address}}</p>
            </div>
          </div>
          
          <!--          面额选择-->
          <div class="denomination">
            <p class="title">面额选择</p>
            <div class="denomination-list">
              <p class="denomination-item" :class="denominationIndex == index ? 'denomination-item-active' : ''"
                 v-for="(item, index) in denominatorArr" :key="index" @click="denominationHandle(index)">
                <span>{{item}}</span>元
              </p>
            </div>
            <div class="rendom-money">
              <span>¥</span>
              <input type="text" v-model="eleNum" @focus="payPriceFun" placeholder="请输入缴费金额">
            </div>
          </div>
        
        </div>
        <div class="btn">
          <div class="btn-pay" @click="paySubmitFun">
            立即缴费
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        denominatorArr: [50, 100, 200],
        denominationIndex: null,
        title: '',
        phone: '', // 当前账户手机号
        itemdata: {},
        detailsData: {},
        eleNum: '', // 缴费金额
      }
    },
    mounted() {
      console.log(this.$route.query)
      this.phone = this.$store.state.login.phone // 取得当前账户的手机号
      this.detailsData = JSON.parse(this.$route.query.detailsData)
      this.itemdata = JSON.parse(this.$route.query.item)
      // this.payUnitName = JSON.parse(this.$route.query.item).payUnitName
      const name = this.$route.query.name
      console.log(this.detailsData, this.itemdata)
      if (name == 'ele') {
        this.title = '电费'
      } else if (name == 'water') {  // 需获取应缴金额
        this.showNum = false
        this.title = '水费'
      } else if (name == 'gas') {
        this.title = '燃气费'
      } else if (name == 'phone') {
        this.title = '固话'
      }
    },
    methods: {
      denominationHandle(index) {
        this.eleNum = ''
        this.denominationIndex = index
      },
      payPriceFun() {
        this.denominationIndex = null
      },
      paySubmitFun() {
        let payPrice = this.eleNum ? this.eleNum : this.denominatorArr[this.denominationIndex]
        if(!payPrice) {
          this.$Toast('缴费金额不能为空')
          return
        }
        let violaSubmitData = {
          deliveryType: '2',
          utilityType: this.itemdata.type,
          provinceId: this.itemdata.provinceId || this.itemdata.provId,
          cityId: this.itemdata.cityId,
          utilityUnit: this.itemdata.payUnitId || this.itemdata.chargeCompanyCode,
          utilityAccount: this.itemdata.account,
          utilityAmount: payPrice,
          carts: [{
            number: 1,
            skuId: this.$store.state.globalConfig.utilitySkuId,
            storeOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
            checked: '1'
          }],
        }
        console.log(violaSubmitData)
        this.$request.post('/app/json/fee_life_order/submit', violaSubmitData).then(res => {
          if (res.status == 0) {
            this.$router.push({
              name: 'life-violation-pay',
              params: {
                occurOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
                payInfo: res.data
              }
            })
          } else {
            this.$Toast(res.info)
          }
        })
      }
    },
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  @import '~@/common/stylus/variable.styl';
  .pay-first {
    .p10 {
      padding 10px
    }
    
    .pay-first-details {
      .pay-first-content {
        box-shadow: 0px 0px 5px #ccc;
        border-radius: 5px;
        
        .flex-between {
          display: flex;
          justify-content: space-between;
          line-height: 24px;
          font-size: 14px;
        }
        
        .money {
          .balance-txt {
            height: 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            font-weight: bold;
          }
          
          .colorRed {
            color red;
          }
        }
        
        .info {
          border: 1px solid #ccc;
          border-left: none;
          border-right: none;
          padding: 10px 0;
          margin: 10px 0;
          
          .left {
            color #7d7d7d;
          }
          
          .right {
            width: 60%;
            text-align right
          }
          
          .account-address {
            align-items center
          }
        }
        
        .denomination {
          margin-top 15px;
          
          .title {
            font-size 16px
          }
          
          .denomination-list {
            display: flex;
            justify-content: space-between;
            margin: 15px 0;
            
            .denomination-item {
              border 1px solid #ccc
              width: 100px;
              text-align: center;
              line-height: 35px;
              border-radius: 6px;
              
              span {
                font-size 16px
              }
            }
            
            .denomination-item-active {
              background: red;
              color: #fff;
              border: transparent;
            }
          }
          
          .rendom-money {
            display: flex;
            align-items: center;
            line-height: 35px;
            
            span {
              font-size: 20px;
              margin-right: 5px;
            }
            
            input {
              width: 100%;
              font-size: 16px;
              border-bottom: 1px solid #ccc;
            }
          }
        }
        
      }
      
      .btn {
        .btn-pay {
          position: fixed;
          bottom: 10px;
          left: 10px;
          right: 10px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 16px;
          background: red;
          border-radius: 20px;
          color: #fff;
        }
      }
    }
    
  }
</style>
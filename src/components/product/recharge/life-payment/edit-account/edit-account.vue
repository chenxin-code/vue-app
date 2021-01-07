<template>
  <div class="phone-bill">
    <nav-top title="新增缴费账户" @backEvent="$router.go(-1)">
      <!-- <div class="life-pay">北京市</div> -->
    </nav-top>
    <nav-content class="phone-bill-details">
      <div class="phone-bill-content">
        <div class="new-recharge-title">
          <img src="../image/dfx.png" alt v-if="name == 'ele'"/>
          <img src="../image/sfx.png" alt v-else-if="name == 'water'"/>
          <img src="../image/rqx.png" alt v-else-if="name == 'gas'"/>
          <img src="../image/ghx.png" alt v-else-if="name == 'phone'"/>
          <span class="text">{{title}}</span>
        </div>
        <div class="inp-num" v-show="showNum">
          <input
            type="text"
            :placeholder="`请输入${inpName}金额`"
            v-model="eleNum"
            :disabled="detailsData.prepaidFlag == '2'"
          />
        </div>
        <div class="num" v-show="!showNum">
          <span class="text">应缴金额</span>
          <span class="num-info">
            ￥
            <span class="info">{{eleNum}}</span>
          </span>
        </div>
        <div class="content">
          <ul class="list">
            <li class="item">
              <div class="info">
                <div class="details">缴费单位</div>
                <div class="text">{{payUnitName}}</div>
              </div>
            </li>
            <li class="item">
              <div class="info">
                <div class="details" v-if="name == 'phone' || name == 'gas' || name == 'water'">缴费户号</div>
                <div class="details" v-else>客户编号</div>
                <div class="text">{{detailsData.userCode}}</div>
              </div>
            </li>
            <li class="item" v-if="name != 'phone'">
              <div class="info">
                <div class="details">户名</div>
                <div class="text">{{detailsData.accountName}}</div>
              </div>
            </li>
            <li class="item" v-if="name != 'phone'">
              <div class="info">
                <div class="details">用户地址</div>
                <div class="text address">{{detailsData.address}}</div>
              </div>
            </li>
            <li class="item" v-if="name != 'phone' && name != 'gas' && name != 'water'">
              <div class="info">
                <div class="details">补加金额</div>
                <div class="text">{{detailsData.repairAmt}}元</div>
              </div>
            </li>
            <li class="item" v-if="name != 'phone' && name != 'gas' && name != 'water'">
              <div class="info">
                <div class="details">扣减金额</div>
                <div class="text">{{detailsData.deductionAmt}}元</div>
              </div>
            </li>
            <li class="item" v-if="name != 'phone' && name != 'gas' && name != 'water'">
              <div class="info">
                <div class="details">补交阶梯差价金额</div>
                <div class="text">{{detailsData.repairLadderAmt}}元</div>
              </div>
            </li>
            <li
              class="item"
              v-show="!showNum"
              v-if="name != 'phone' && name != 'gas' && name != 'water'"
            >
              <div class="info">
                <div class="details">入表金额</div>
                <div class="text">{{eleNum}}元</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="re-btn" @click="nextBtn" v-show="btnShow">下一步</div>
      <div
        class="re-btn"
        @click="payBtn"
        v-show="!btnShow"
        v-if="name == 'gas' || name == 'phone'"
      >立即充值
      </div>
      <div class="re-btn" @click="payBtn" v-show="!btnShow" v-else>立即支付</div>
      <van-action-sheet v-model="showRecharg" title="确认付款">
        <div class="recharge-popup">
          <div class="num">
            ￥
            <span class="text">10.00</span>
          </div>
          <div class="info">
            <div class="details">
              <span class="title">订单信息</span>
              <span class="content">手机号{{phone}}充值10元</span>
            </div>
            <div class="details">
              <span class="title">支付方式</span>
              <span class="content">微信支付</span>
            </div>
          </div>
        </div>
        <div class="re-btn" v-if="name == 'gas' || name == 'phone'">立即充值</div>
        <div class="re-btn" v-else>立即支付</div>
      </van-action-sheet>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    data() {
      return {
        name: '', // 费用名称来源
        eleNum: '', // 购电金额
        payUnitName: '', // 缴费单位
        title: '', // 费用名称显示
        btnShow: true, // 按钮的变化
        inpName: '充值', // 输入框文字
        showNum: true, // 编辑金额
        showRecharg: false, // 充值页面弹框
        phone: '', // 当前账户手机号
        itemdata: {},
        detailsData: {}
      }
    },
    created() {
    },
    mounted() {
      console.log(this.$route.query)
      this.phone = this.$store.state.login.phone // 取得当前账户的手机号
      this.detailsData = JSON.parse(this.$route.query.detailsData)
      this.itemdata = JSON.parse(this.$route.query.item)
      this.payUnitName = JSON.parse(this.$route.query.item).payUnitName
      this.name = this.$route.query.name
      // 费用名称显示
      if (this.name == 'ele') {
        this.title = '电费'
        this.inpName = '购电'
      } else if (this.name == 'water') {  // 需获取应缴金额
        this.showNum = false
        this.title = '水费'
        this.inpName = '购水'
      } else if (this.name == 'gas') {
        this.title = '燃气费'
        this.inpName = '购燃气'
        this.btnShow = false // 按钮变成立即支付
      } else if (this.name == 'phone') {
        this.title = '固话'
        this.btnShow = false // 按钮变成立即支付
      }
      // this.$request.post('/app/json/fee_life_order/queryUtilityBalance', {
      //   storeOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
      //   provId: this.itemdata.provId || this.itemdata.provinceId,
      //   cityId: this.itemdata.cityId,
      //   chargeCompanyCode: this.itemdata.chargeCompanyCode || this.itemdata.payUnitId,
      //   type: this.itemdata.type,
      //   account: this.itemdata.account
      // }).then(res => {
      //   if (res.status === 0) {
      //     this.detailsData = res.data
      //     this.eleNum = res.data.balance
      //   } else {
      //     this.$router.push({ path: '/nothing-paybill', query: { name: this.name, payUnitName: this.payUnitName, account: this.itemdata.account } })
      //     // this.$Toast(res.info ? res.info : '获取地区失败')
      //   }
      // })
    },
    methods: {
      nextBtn() {
        // 下一步按钮
        if (this.eleNum == '') {
          // 购水金额不能为空 为空提示
          if (this.name == 'ele') {
            this.$Toast('请输入购电金额')
          } else if (this.name == 'water') {
            this.$Toast('请输入购水金额')
          } else {
            this.$Toast('请输入充值金额')
          }
        } else {
          // 除了燃气和固话 其他的点击下一步 都隐藏输入框 按钮变成立即支付
          if (this.name != 'gas' && this.name != 'phone') {
            this.showNum = false // 编辑金额框隐藏
            this.btnShow = false // 按钮变成立即支付
          }
        }
      },
      payBtn() {
        // 立即支付按钮
        // this.showRecharg = true
        if (this.name == 'ele') {
          if (this.eleNum < 10) {
            this.$Toast('最低充值金额10元')
            return
          }
        }

        let violaSubmitData = {
          deliveryType: '2',
          utilityType: this.itemdata.type,
          provinceId: this.itemdata.provinceId || this.itemdata.provId,
          cityId: this.itemdata.cityId,
          utilityUnit: this.itemdata.payUnitId || this.itemdata.chargeCompanyCode,
          utilityAccount: this.itemdata.account,
          utilityAmount: this.eleNum,
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
    computed: {},
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  @import '../../asset/recharge.styl';
  
  .phone-bill {
    overflow: auto;
    height: 100%;
  }
  
  .phone-bill-content {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 15px 44px 15px;
    
    .content {
      margin-bottom: 30px;
      
      .title {
        padding: 15px 0;
        font-size: 20px;
        color: $color-text;
      }
      
      .list {
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
        border-radius: 4px;
        padding: 0 5px;
        
        .item {
          & + .item {
            border-top: 0.5px solid #ecebeb;
          }
          
          .info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 5px;
            font-size: 14px;
            
            .details {
              color: $color-text-l;
            }
            
            .address {
              ellipse();
            }
            
            .text {
              width: 60%;
              text-align: right;
            }
          }
        }
      }
    }
    
    .new-recharge-title {
      padding: 20px 11px;
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
      border-radius: 4px;
      margin: 10px 0;
      vertical-align: top;
      display: flex;
      justify-content: left;
      align-items: center;
      font-size: 16px;
      
      img {
        width: 30px;
        display: inline-block;
        padding-right: 10px;
      }
    }
    
    .inp-num {
      padding: 11px;
      line-height: 50px;
      border: 0.5px solid #ecebeb;
      border-radius: 4px;
      margin: 10px 0;
      
      input {
        font-size: 18px;
        width: 100%;
        background: #fff;
      }
    }
    
    .num {
      padding: 20px 11px;
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .text {
        font-size: 16px;
      }
      
      .num-info {
        .info {
          font-size: 22px;
        }
      }
    }
  }
  
  .life-pay {
    font-size: 16px;
    color: $color-theme-r;
    text-align: right;
    margin-right: 15px;
  }
  
  /deep/ .van-icon {
    font-size: 20px;
    color: $color-text-l;
  }
  
  .recharge-popup {
    padding: 11px 15px;
    height: 350px;
    
    .num {
      text-align: center;
      font-weight: bold;
      padding: 20px 0;
      
      .text {
        font-weight: bold;
        font-size: 34px;
      }
    }
    
    .info {
      .details {
        padding: 15px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        border-bottom: 0.5px solid #ecebeb;
        
        .title {
          color: $color-text-l;
        }
      }
    }
  }
  
  /deep/ .van-action-sheet--withtitle {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
</style>

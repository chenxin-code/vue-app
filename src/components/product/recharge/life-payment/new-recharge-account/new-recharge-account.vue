<template>
  <div class="phone-bill">
    <nav-top title="新增缴费账户" @backEvent="$router.go(-1)">
      <!-- <div class="life-pay">北京市</div> -->
      <div class="life-pay" @click="openRechargeBill">
        <img src="../image/zd.png" alt/>
      </div>
    </nav-top>
    <nav-content class="phone-bill-details">
      <div class="phone-bill-content">
        <div class="new-recharge-title">
          <img src="../image/dfx.png" alt v-if="name == 'ele'"/>
          <img src="../image/sfx.png" alt v-else-if="name == 'water'"/>
          <img src="../image/rqx.png" alt v-else-if="name == 'gas'"/>
          <img src="../image/ghx.png" alt v-else/>
          <span class="text">{{title}}</span>
        </div>
        <div class="content">
          <ul class="list">
            <li class="item">
              <div class="info">
                <div class="details">缴费单位</div>
                <div class="text">{{paymentunit}}</div>
                <div class="details right">
                  <van-icon name="arrow"/>
                </div>
              </div>
            </li>
            <li class="item" v-if="name == 'ele' || name == 'water'">
              <div class="info">
                <div class="details">缴费账户</div>
                <div class="text">
                  <input type="text" placeholder="请输入账号" v-model="paymentaccount"/>
                </div>
              </div>
            </li>
            <li class="item" v-else-if="name == 'gas'">
              <div class="info">
                <div class="details">户号</div>
                <div class="text">
                  <input type="text" placeholder="请输入户号" v-model="paymentaccount"/>
                </div>
              </div>
            </li>
            <li class="item" v-else-if="name == 'phone'">
              <div class="info">
                <div class="details">固话号码</div>
                <div class="text">
                  <input type="text" placeholder="请输入固话号码" v-model="paymentaccount"/>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="card-prompt">
          <h3 class="title">温馨提示：</h3>
          <div class="content" v-html="lifePayPrompt"></div>
        </div>
      </div>
      <div class="re-btn" @click="nextBtn">下一步</div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    data() {
      return {
        name: '', // 费用名称来源
        title: '', // 费用名称
        paymentunit: '', // 缴费单位
        paymentaccount: '', // 缴费账户
        lifePayPrompt: '',
      }
    },
    created() {
    },
    mounted() {
      this.name = this.$route.query.name
      this.paymentunit = JSON.parse(this.$route.query.item).payUnitName
      // 费用名称显示
      if (this.name == 'ele') {
        this.title = '电费'
        // this.inpName = '购电'
      } else if (this.name == 'water') {
        this.title = '水费'
        // this.inpName = '购水'
      } else if (this.name == 'gas') {
        this.title = '燃气费'
        // this.inpName = '购燃气'
        // this.btnShow = false // 按钮变成立即支付
      } else if (this.name == 'phone') {
        this.title = '固话'
        // this.btnShow = false // 按钮变成立即支付
      }

      this.getPayInfo()

    },
    methods: {
      // 温馨提示信息
      getPayInfo() {
        console.log(this.$store.state.globalConfig)
        let params = {
          skuId: this.$store.state.globalConfig.utilitySkuId,
          pickupStoreOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
          deliverType: 1
        }
        this.$request.post('/app/json/product/getAppProDetail', params).then(res => {
          if (res.status == 0) {
            this.lifePayPrompt = res.data.proSkuMediaModel ? res.data.proSkuMediaModel.mobileDetail : ''
          } else {
            this.$Toast(res.info)
          }
        })
      },
      nextBtn() {
        // 购水金额不能为空 为空提示
        if (this.paymentaccount == '') {
          if (this.name == 'ele' || this.name == 'water') {
            this.$Toast('请输入缴费账户')
          } else if (this.name == 'gas') {
            this.$Toast('请输入户号')
          } else if (this.name == 'phone') {
            this.$Toast('请输入固话号码')
          }
        } else {
          let itemdata = Object.assign({}, JSON.parse(this.$route.query.item), {account: this.paymentaccount})
          this.$request.post('/app/json/fee_life_order/queryUtilityBalance', {
            storeOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
            provId: itemdata.provId || itemdata.provinceId,
            cityId: itemdata.cityId,
            chargeCompanyCode: itemdata.chargeCompanyCode || itemdata.payUnitId,
            type: itemdata.type,
            account: itemdata.account
          }).then(res => {
            if (res.status === 0) {
              let pathUrl = ''
              if (res.data.prepaidFlag == 1) {  // 先付费
                pathUrl = '/pay-first'
              } else { // 后付费
                pathUrl = '/pay-first'
              }
              this.$router.push({
                path: pathUrl,
                query: {
                  name: this.name,
                  detailsData: JSON.stringify(res.data),
                  item: JSON.stringify(itemdata)
                }
              })
              // this.detailsData = res.data
              // this.eleNum = res.data.balance
            } else {
              // this.$router.push({ path: '/nothing-paybill', query: { name: this.name, payUnitName: this.payUnitName, account: this.itemdata.account } })
            }
          })
          // this.$router.push({path: '/edit-account', query: {name: this.name, item: JSON.stringify(itemdata)}})
        }

      },
      openRechargeBill() {
        // 打开账单页面
        this.$router.push({path: '/recharge-bill', query: {name: 'lify'}})
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
  
  .life-pay {
    text-align: right;
    padding-right: 10px;
    
    img {
      width: 20px;
      vertical-align: middle;
    }
  }
  
  .phone-bill-content {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 15px 11px 15px;
    
    .content {
      .title {
        padding: 15px 0;
        font-size: 20px;
        color: $color-text;
      }
      
      .list {
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
        border-radius: 4px;
        margin-bottom: 10px;
        padding: 0 5px;
        
        .item {
          & + .item {
            border-top: 0.5px solid #ecebeb;
          }
          
          .info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 13px 5px;
            
            .details {
              font-size: 14px;
            }
            
            .text {
              padding-left: 20px;
              flex: 1;
              color: $color-text-l;
              ellipse();
            }
            
            .right {
              text-align: right;
            }
          }
        }
      }
    }
    
    .new-recharge-title {
      padding: 11px;
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
      border-radius: 4px;
      margin: 10px 0;
      vertical-align: top;
      display: flex;
      justify-content: left;
      align-items: center;
      
      img {
        width: 30px;
        display: inline-block;
        padding-right: 10px;
      }
    }
    
    .card-prompt {
      padding-top: 15px;
      text-align: left;
      
      .title {
        font-size: 14px;
        padding-bottom: 8px;
        font-weight: bold;
      }
      
      .content {
        font-size: 12px;
        line-height: 17px;
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
</style>

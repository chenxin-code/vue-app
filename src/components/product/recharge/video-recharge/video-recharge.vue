<template>
  <div class="phone-bill-recharge">
    <nav-top title="视频充值" @backEvent="$router.go(-1)">
      <div class="phone-bill" @click="openPhoneBill">充值记录</div>
    </nav-top>
    <nav-content class="phone-bill-recharge-details">
      <div class="phone-bill-recharge-content">
        <div class="title-show">
          <img :src="spuImage" alt="">{{playName}}
        </div>
        <!--        <div class="inp">-->
        <!--          <input-->
        <!--            type="text"-->
        <!--            placeholder="请输入充值账号"-->
        <!--            v-model="phone" />-->
        <!--        </div>-->
        <div class="tips-top">
          <span>充值类型</span>
        </div>
        <recharge-grid :col="3" :list="typeList" :kingType="kingType" :kingTypeItem="kingTypeItem" @change="changeType"
                       :status="status"></recharge-grid>
        <div class="tips-top">
          <span>充值面额</span>
        </div>
        <recharge-grid :col="3" :list="numList" @change="change" :kingType="kingType" :status="status"></recharge-grid>
        <div class="tips" v-if="agreement">
          <div class="title">充值说明</div>
          <div class="content" v-html="agreement"></div>
        </div>
      </div>
      <div class="re-btn" @click="nowRecharge">立即充值</div>
      <!--      <van-action-sheet v-model="showRecharg" title="确认付款">-->
      <!--        <div class="recharge-popup">-->
      <!--          <div class="num">-->
      <!--            ￥<span class="text">{{changeNum}}</span>-->
      <!--          </div>-->
      <!--          <div class="info">-->
      <!--            <div class="details">-->
      <!--              <span class="title">充值账号</span>-->
      <!--              <span class="content">{{phone}}</span>-->
      <!--            </div>-->
      <!--            <div class="details">-->
      <!--              <span class="title">应用名称</span>-->
      <!--              <span class="content">{{playName}}</span>-->
      <!--            </div>-->
      <!--            <div class="details">-->
      <!--              <span class="title">支付方式</span>-->
      <!--              <span class="content">{{`${payStyle.text || '&#45;&#45;'}支付`}}</span>-->
      <!--            </div>-->
      <!--            <van-radio-group v-model="radio">-->
      <!--              <van-cell-group>-->
      <!--                <van-cell v-for="(item, index) in selectedPayWay" :key="index" clickable-->
      <!--                          @click="changeStyle(item, index)">-->
      <!--                  <div slot="title" class="pay-label">-->
      <!--                    <img class="pay-icon" v-if="item.payMode == '210'"-->
      <!--                         src="../../../../../static/image/mall2/weixin.png" alt="">-->
      <!--                    <img class="pay-icon" v-else src="../../../../../static/image/mall2/zhifubao.png" alt="">-->
      <!--                    {{item.text}}支付-->
      <!--                  </div>-->
      <!--                  <van-radio @click="changeStyle(item, index)" :name="index" checked-color="#F80F16"/>-->
      <!--                </van-cell>-->
      <!--              </van-cell-group>-->
      <!--            </van-radio-group>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <div class="re-btn" @click="nowPay">立即支付</div>-->
      <!--      </van-action-sheet>-->
    </nav-content>
  </div>
</template>

<script>
  import RechargeGrid from '../components/recharge-grid'
  import payHelper from '@/utils/payHelper'

  export default {
    name: '',
    data() {
      return {
        // showRecharg: false, // 充值页面弹框
        playName: '', // 应用名称
        // phone: '', // 手机号
        list: [], // 充值面额总列表
        rechargeProList: [], // 充值类型总列表
        typeList: [], // 充值类型 列表
        numList: [], // 充值面额 列表
        status: false,
        changeNum: '', // 选择的面额
        payNum: '', // 支付的面额
        selectedPayWay: [], // 支付方式
        payStyle: {}, // 支付方式
        radio: '',
        kingType: false, // 显示类型
        kingTypeItem: false, // 充值类型 、充值面额
        spuId: '', // 查找充值类型
        spuImage: '', // 图片
        agreement: '',
        activityId: ''
      }
    },
    mounted() {
      this.spuId = this.$route.query.spuId
      this.activityId = this.$route.query.activityId || ''
      this.spuImage = this.$route.query.spuImage
      if (this.$route.query.spuName) {
        this.playName = this.$route.query.spuName
      }
      this.getRechargeProList()
      // this.showagreement()
    },
    methods: {
      showagreement() {
        this.$request.post('/app/json/news/getNewsList', {values: 31}).then(res => {
          if (res.status == 0) {
            this.agreement = res.data[0] ? res.data[0].content : ''
          }
        })
      },
      getRechargeProList() {
        // 获取面额
        let productType = ''
        if (this.$store.state.globalConfig.videoRechargeStyle == 1) { // 默认 或者0 卡密充值    1就是直冲
          productType = '510'
        } else {
          productType = '508'
        }
        this.$Loading.open()
        let paramsData = {
          activityId: this.activityId,
          // token: this.$store.state.login.token,
          productType: productType // 501话费充值，502流量充值 503qq充值 508视频充值 510游戏及互娱产品直充
        }
        this.$http.post('/app/json/product_recharge/getRechargeProList', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            if (data.data.list.length && data.data.spuModels.length) {
              this.list = data.data.list
              this.rechargeProList = data.data.spuModels
              let rechargeProItem = []
              this.rechargeProList.map(item => {
                if (item.spuId == this.spuId) {
                  rechargeProItem.push(item)
                }
              })
              this.agreement = rechargeProItem[0].mobileDetail
              this.typeList = rechargeProItem[0].featureValueModels
              this.numList = this.formatCardInfo(this.typeList[0].featureValueId)
            }
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
      nowRecharge() {
        if (this.playName == '') {
          this.$Toast('请输入应用名称')
        } else if (!this.orderInfo) {
          this.$Toast('请选择充值面额')
        } else {
          this.$router.push({path: '/movie-ticket-order', query: {id: this.orderInfo.id, skuId: this.orderInfo.skuId}})
          // this.showRecharg = true
          // this.setPayWays() // 获取支付方式
        }
      },
      setPayWays() {
        this.selectedPayWay = []
        payHelper.getPayWays('205001', this.orderInfo.receivablesOuCode).then(res => {
          this.selectedPayWay = res || []
          if (this.selectedPayWay.length > 0) {
            this.radio = 0
            this.payStyle = this.selectedPayWay[0];
          }
        })
      },
      nowPay() {
        // 提交订单
        console.log(this.radio)
        if (this.radio !== '') {
          this.$Loading.open()
          let paramsData = {
            token: this.$store.state.login.token,
            deliveryType: '2',
            virtualUserPhone: this.phone,
            carts: [{
              skuId: this.orderInfo.skuId,
              storeOuCode: this.orderInfo.storeOuCode,
              number: 1
            }]
          }
          this.$http.post('/app/json/fee_life_order/submit', paramsData).then(res => {
            let data = res.data
            if (data.status == 0) {
              this.submitInfo = data.data
              this.pay()
            } else {
              this.$Toast(data.info)
            }
            this.$Loading.close()
          })
        } else {
          this.$Toast('请选择支付方式')
        }
      },
      pay() {
        // 支付订单
        if (this.payStyle == null) {
          this.$Toast("请选择支付方式！")
          return;
        }
        payHelper.trafficPayEvent(this.payStyle, this.submitInfo.orderType, this.submitInfo.orderId).then(() => {
          this.enterSuccess()
        }).catch(() => {
        })
        // this.$Loading.open()
        // let paramsData = {
        //   token: this.$store.state.login.token,
        //   orderType: this.submitInfo.orderType, // 订单类型
        //   orderId: this.submitInfo.orderId, // 商城订单ID
        //   payMode: this.payStyle.payMode, // 支付方式
        //   payModeSub: this.payStyle.payModeSub // 支付具体方式
        // }
        // this.$http.post('/app/json/fee_life_order/pay', params).then(res => {
        //   let data = res.data
        //   if (data.status == 0) {
        //     payHelper.doPay(this.payStyle, data.data.payInfo).then(() => {
        //       this.enterSuccess()
        //     }).catch(() => {
        //       this.$Toast('支付失败')
        //     })
        //   } else {
        //     this.$Toast(data.info)
        //   }
        //   this.$Loading.close()
        // })
      },
      enterSuccess() {
        // 支付宝成功支付以后的回调
        this.$router.replace({
          path: '/recharge-bill-details',
          query: {
            orderType: this.submitInfo.orderType,
            orderId: this.submitInfo.orderId
          }
        })
      },
      changeStyle(item, index) {
        // 选择支付方式
        this.radio = index
        this.payStyle = item
      },
      openPhoneBill() {
        // 打开视频账单
        this.$router.push({path: '/recharge-bill', query: {name: 'video'}})
      },
      change(num) {
        // 子组件点击事件
        this.orderInfo = num
        this.changeNum = num.salePrice
        let payNum = num.skuFeatures || []
        if (payNum) {
          // this.payNum = payNum[0].featureValue
        }
        console.log(num)
      },
      changeType(num) {
        // 选择充值类型
        console.log(num)
        this.numList = this.formatCardInfo(num.featureValueId)
        console.log(this.numList)
      },
      formatCardInfo(featureValueId) {
        console.log(featureValueId)
        let arr = []
        this.list.forEach(item => {
          if (item.spuId == this.spuId) {
            item.skuFeatures.forEach(item2 => {
              if (item2.featureValueId == featureValueId) {
                arr.push(item)
              }
            })
          }
        })
        return arr
      },
      overPhone() {
        // 输入账号以后 面额可选
        this.status = true
      }
    },
    computed: {},
    components: {
      RechargeGrid
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "../asset/recharge.styl"
  .phone-bill-recharge-content {
    padding: 11px 15px 100px 15px
    height 100%
    overflow auto
    -webkit-overflow-scrolling touch
    
    .title-show {
      font-size: 18px; /*no*/
      display: flex;
      align-items: center
      
      img {
        width: 45px
        margin-right: 5px
      }
    }
    
    .tips {
      padding: 10px 0
    }
    
    .inp {
      padding: 5px 0
      border-bottom: 1px solid #f3f1f1
      
      input {
        line-height 34px
        font-size 24px
      }
    }
    
    .video-recharge {
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
      border-radius 4px
      padding: 5px
      font-size: 14px
      
      .name {
        padding: 10px 5px
        line-height 20px
        
        & + .name {
          border-top: 0.5px solid #ecebeb
        }
      }
    }
    
    .tips-top {
      padding: 15px 0
      font-size: 20px
      
      .tips {
        font-size: 14px
        color: $color-text-l
      }
    }
    
    .more-recharge-list {
      display: flex
      flex-wrap wrap
      text-align center
      padding: 20px 0
      
      .more-recharge-item {
        width: 25%
        padding-bottom: 20px
        
        .img {
          padding-bottom 5px
          width: 100%
          height: 40px
          text-align center
          display flex
          justify-content center
          align-items center
          
          img {
            width: 30%
            display inline-block
            vertical-align middle
          }
        }
      }
    }
  }
  
  .phone-bill-img {
    text-align right
    padding-right: 10px
    
    img {
      width: 30px
      vertical-align middle
    }
  }
  
  .recharge-popup {
    padding: 11px 15px
    height: 350px
    
    .num {
      text-align center
      font-weight bold
      padding: 20px 0
      
      .text {
        font-weight bold
        font-size 34px
      }
    }
    
    .info {
      .details {
        padding: 15px 0
        display flex
        justify-content space-between
        align-items center
        font-size 14px
        border-bottom: 0.5px solid #ecebeb
        
        .title {
          color: $color-text-l
        }
      }
    }
  }
  
  /deep/ .van-action-sheet--withtitle {
    border-top-left-radius 10px
    border-top-right-radius 10px
  }
  
  .pay-label {
    display flex
    align-items center
    
    .pay-icon {
      width 25px
      margin-right 10px
    }
  }
  
  /deep/ .van-radio {
    display inline-block
  }
  
  .van-hairline--top-bottom::after {
    display none
  }
  
  input:disabled {
    background #fff
  }
  
  .re-btn {
    text-align center
    background: $color-theme-r
    color: #fff
    font-size: 16px
    position fixed
    bottom: 0
    left: 0
    right: 0
    z-index 10;
    height 44px;
    line-height: 44px;
  }
  
  .tips {
    .title {
      font-size 14px
      padding-bottom: 10px
    }
    
    .content {
      font-size 12px
      line-height 22px
      color: $color-text-d
      
      /deep/ .tiny-img{
        width 100%
      }
    }
  }
</style>

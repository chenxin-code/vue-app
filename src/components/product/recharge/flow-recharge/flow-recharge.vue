<template>
  <div class="phone-bill-recharge">
    <nav-top title="流量充值" @backEvent="$router.go(-1)">
      <div class="phone-bill" @click="openPhoneBill">充值记录</div>
    </nav-top>
    <nav-content class="phone-bill-recharge-details">
      <div class="phone-bill-recharge-content">
        <div class="inp">
          <input
            maxlength="13"
            type="tel"
            onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
            placeholder="请输入手机号"
            @focus="onInpFocus"
            @blur="inpBulr"
            @input="overPhone" v-model="phone">
          <div class="tips" v-show="showTips" v-if="phoneInfo.area != '' && phoneInfo.area != ''">
            <span v-if="seifPhone == phone.replace(/\s*/g,'')">默认号码</span>
            <span>（{{phoneInfo.area}}{{phoneInfo.operator}}）</span>
          </div>
        </div>
        <div class="tips-top">
          <span>流量包月</span>
          <span class="tips">到账后生效, 当月有效</span>
        </div>
        <recharge-grid :col="3" :list="list" @change="change" :status="status"></recharge-grid>
        <!--<div class="tips-top">-->
        <!--<span>流量日包</span>-->
        <!--<span class="tips">到账后生效, 24h有效</span>-->
        <!--</div>-->
        <!--<recharge-grid :col="3" :list="list" @change="change" :status="status"></recharge-grid>-->
        <!--<div class="tips-top">-->
        <!--<span>流量7天包</span>-->
        <!--<span class="tips">到账后生效, 7天有效</span>-->
        <!--</div>-->
        <!--<recharge-grid :col="3" :list="list" @change="change" :status="status"></recharge-grid>-->
      </div>
      <div class="tips-show" v-if="agreement">
        <div class="title">充值说明</div>
        <div class="content" v-html="agreement"></div>
      </div>
      <!--<div class="re-btn" @click="nowRecharge">立即充值</div>-->
      <van-action-sheet v-model="showRecharg" title="确认付款">
        <div class="recharge-popup">
          <div class="num">
            ￥<span class="text">{{changeNum}}</span>
          </div>
          <div class="info">
            <div class="details">
              <span class="title">充值手机号</span>
              <span class="content">{{showPhone(phone)}}</span>
            </div>
            <div class="details">
              <span class="title">流量充值</span>
              <span class="content">{{phoneInfo.operator}}{{payNum}}</span>
            </div>
            <div class="details">
              <span class="title">支付方式</span>
              <span class="content">{{`${payStyle.text || '--'}支付`}}</span>
            </div>
            <van-radio-group v-model="radio">
              <van-cell-group>
                <van-cell v-for="(item, index) in selectedPayWay" :key="index" clickable
                          @click="changeStyle(item, index)">
                  <div slot="title" class="pay-label">
                    <img class="pay-icon" v-if="item.payMode == '210'" src="../../../../../static/image/mall2/weixin.png" alt="">
                    <img class="pay-icon" v-else src="../../../../../static/image/mall2/zhifubao.png" alt="">
                    {{item.text}}支付
                  </div>
                  <van-radio @click="changeStyle(item, index)" :name="index" checked-color="#F80F16"/>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </div>
        </div>
        <div class="re-btn" @click="nowRecharge">立即支付</div>
      </van-action-sheet>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import RechargeGrid from '../components/recharge-grid'
  import payHelper from '@/utils/payHelper'

  export default {
    name: '',
    data() {
      return {
        havePhone: false, // 默认手机号
        showRecharg: false, // 充值页面弹框
        list: [], // 话费面额 列表
        status: false,
        payNum: '', // 支付的流量
        changeNum: '', // 选择的面额
        phone: '', // 输入的手机号
        status: false,
        phoneInfo: '', // 手机号信息 运行商
        seifPhone: '', // 本机号码
        orderInfo: '', // 支付的订单信息
        showTips: true,
        payStyle: '', // 支付方式
        submitInfo: '', // 下单成功的信息 为支付使用
        radio: '',
        selectedPayWay: [], // 支付方式
        agreement: ''
      }
    },
    created() {
    },
    mounted() {
      this.phone = this.$store.state.login.phone
      this.seifPhone = this.$store.state.login.phone
      this.addSpace() // 加空格
      this.getPhoneSgmt()
      this.getRechargeProList()
      this.showagreement()
    },
    methods: {
      showagreement() {
        this.$request.post('/app/json/news/getNewsList', { values: 50 }).then(res => {
          if (res.status == 0) {
            this.agreement = res.data[0] ? res.data[0].content : ''
          }
        })
      },
      setPayWays() {
        this.selectedPayWay = []
        payHelper.getPayWays('205001', this.orderInfo.receivablesOuCode).then(res => {
          this.selectedPayWay = res || []
          if (this.selectedPayWay.length > 0) {
            this.radio = 0
            this.payStyle = this.selectedPayWay[0]
          }
        })
      },
      changeStyle(item, index) {
        // 选择支付方式
        this.radio = index
        this.payStyle = item
      },
      getPhoneSgmt() {
        // 跟手机号(phone)获取运营商
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          // phone: '130080212345'
          phone: this.phone.replace(/\s*/g, "") // 去掉手机号的空格
        }
        this.$http.post('/app/json/product_recharge/getPhoneSgmt', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.phoneInfo = data.data
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
      getRechargeProList() {
        // 获取面额
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          phone: this.phone.replace(/\s*/g, ""), // 去掉手机号的空格
          productType: '502' // 501话费充值，502流浪充值
        }
        this.$http.post('/app/json/product_recharge/getRechargeProList', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.list = data.data.list
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
      nowRecharge() {
        // 提交订单
        if (this.radio !== '') {
          this.$Loading.open()
          let paramsData = {
            token: this.$store.state.login.token,
            virtualUserPhone: this.phone.replace(/\s*/g, ""), // 手机号
            deliveryType: '2',
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
              console.log(this.submitInfo)
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
        if (this.payStyle == null) {
          this.$Toast("请选择支付方式！")
          return;
        }
        payHelper.trafficPayEvent(this.payStyle, this.submitInfo.orderType, this.submitInfo.orderId).then(() => {
          this.enterSuccess()
        }).catch(() => {
        })
        // 支付订单
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
        this.$router.replace({
          path: '/recharge-bill-details',
          query: {
            orderType: this.submitInfo.orderType,
            orderId: this.submitInfo.orderId
          }
        })
      },
      addSpace() {
        // 加空格
        let insertStr = (soure, start, newStr) => {
          return soure.slice(0, start) + newStr + soure.slice(start)
        }
        this.phone = insertStr(this.phone, 3, " ")
        this.phone = insertStr(this.phone, 8, " ")
        if (this.phone.length == 13) {
          this.status = true
        }
      },
      openPhoneBill() {
        // 打开流量账单
        this.$router.push({
          path: '/recharge-bill',
          query: {name: 'flow', orderType: this.submitInfo.orderType, orderId: this.submitInfo.orderId}
        })
      },
      openQQCharge() {
        // 打开qq充值
        this.$router.push('/qq-recharge')
      },
      change(num) {
        // 子组件点击事件
        this.radio = ''
        this.payStyle = ''
        this.showRecharg = true
        this.changeNum = num.salePrice
        this.orderInfo = num
        let payNum = num.skuFeatures || []
        this.payNum = payNum[0].featureValue
        this.setPayWays() // 获取支付方式
        console.log(num)
      },
      overPhone() {
        // 输入完手机号
        // this.phone = /^\d+/.exec(this.phone) ? /^\d+/.exec(this.phone)[0] : ''
        if (this.phone.length == 13) {
          this.getPhoneSgmt() // 查询运营商
          this.list = []
          this.getRechargeProList()
          let newPhone = this.phone
          newPhone = newPhone.replace(/\s*/g, "")
          let myreg = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/
          if (!myreg.test(newPhone)) {
            // this.phone = ''
            this.$Toast('请输入有效手机号！')
          } else {
            // 面额 可选 提示语显示
            this.status = true
            this.showTips = true
          }
        } else {
          // 面额不可选 提示语隐藏
          this.status = false
          this.showTips = false
        }
      },
      onInpFocus() {
        // 输入框获取焦点 提示语隐藏
        this.showTips = false
      },
      showPhone(phone) {
        // 替换手机号的空格为-
        return phone.replace(/\ /g, "-")
      },
      inpBulr() {
        // 输入框失去焦点 提示语显示
        this.showTips = true
      }
    },
    watch: {
      // 通过watch来设置空格
      phone(newValue, oldValue) {
        if (newValue.length > oldValue.length) { // 文本框中输入
          if (newValue.length == 3 || newValue.length == 8) {
            this.phone += ' '
          }
        } else { // 文本框中删除
          if (newValue.length === 9 || newValue.length === 4) {
            this.phone = this.phone.trim()
          }
        }
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
    padding: 11px 15px

    .default-number {
      line-height 26px

      .num {
        font-size: 24px
      }
    }

    .inp {
      padding-bottom 15px
      height: 75px

      input {
        font-size 24px
      }

      .tips {
        color: $color-text-l
        font-size: 14px
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

  .phone-bill {
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
    margin-bottom: 30px

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
      .pay-label {
        display flex
        align-items center

        .pay-icon {
          width 25px
          margin-right 10px
        }
      }
    }
  }

  /deep/ .van-action-sheet--withtitle {
    border-top-left-radius 10px
    border-top-right-radius 10px
  }
  /deep/ .van-radio {
    display inline-block
  }
  .van-hairline--top-bottom::after {
    display none
  }
  .tips-show {
    padding: 11px 15px
    flex: 1
    overflow-y auto
    -webkit-overflow-scrolling touch
    .title {
      font-size 14px
      padding-bottom: 10px
    }
    .content {
      font-size 12px
      line-height 22px
      color: $color-text-d
    }
  }
</style>

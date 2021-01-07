<template>
  <div class="wallet-recharge">
    <nav-top title="充值" @backEvent="$router.go(-1)">
      <div class="my-cards" @click.stop="instructions">说明</div>
    </nav-top>
    <nav-content class="wallet-recharge-container">
      <div class="top">
        <div class="title">充值金额</div>
        <div class="inp">
          <div class="left">
            <span class="icon">￥</span>
            <input type="text"
                   readonly
                   clickable
                   placeholder="请输入金额"
                   @click="showKeyboard = true"
                   v-model="money">
          </div>
          <div class="right" @click="money = ''" v-if="money != ''">
            <van-icon name="close" color="#666" size="18px"/>
          </div>
        </div>
      </div>
      <div class="top">
        <div class="pay-stype">
          <div class="title">支付方式</div>
          <div class="style">
            <van-radio-group v-model="radio">
              <van-cell-group>
                <van-cell clickable v-for="(item, index) in selectedPayWay" :key="index"
                          @click="changeStyle(item, index)">
                  <div slot="title" class="pay-label">
                    <img class="pay-icon" :src="item.icon" alt="">{{item.text}}
                  </div>
                  <van-radio @click="changeStyle(item, index)" :name="index" checked-color="#F80F16"/>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </div>
        </div>
      </div>
      <div class="submit-btn" :class="{active: money == ''}" @click="recharge">充值</div>
      <van-action-sheet v-model="showRecharg" title="确认充值">
        <div class="recharge-popup">
          <div class="num">
            ￥<span class="text">{{money}}</span>
          </div>
          <div class="info">
            <div class="details">
              <span class="title">订单信息</span>
              <span class="content">钱包充值</span>
            </div>
            <div class="details">
              <span class="title">支付方式</span>
              <span class="content">{{payStyle.text}}</span>
            </div>
          </div>
        </div>
        <div class="submit-btn" @click="nowPay">立即充值</div>
      </van-action-sheet>
      <!--      数字键盘-->
      <van-number-keyboard
        :show="showKeyboard"
        extra-key="."
        v-model="moneyInp"
        close-button-text="完成"
        @blur="showKeyboard = false"
        @input="onInput"
        @delete="onDelete"
      />
    </nav-content>
  </div>
</template>

<script>
  import payHelper from '@/utils/payHelper'

  export default {
    data() {
      return {
        showKeyboard: true, // 数字键盘
        show: false,
        money: '',
        radio: '',
        showRecharg: false, // 确认订单弹框
        payStyle: {}, // 支付方式
        selectedPayWay: [],
        submitInfo: '', // 支付信息
        moneyInp: ''
      }
    },
    mounted() {
      this.settle()
    },
    created() {
    },
    methods: {
      onInput(value) {
        this.money = this.money + value
        if (this.money.substring(0, 1) === '.') {
          this.$Toast('请输入正确金额')
          this.money = ''
        }
        this.money = this.money.replace(/\.{2,}/g, ".").replace(".","$#$").replace(/\./g,"").replace("$#$",".").replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
      },
      onDelete() {
        this.money = this.money.slice(0, this.money.length - 1)
      },
      settle() {
        // 加油卡充值结算接口 为获取收单机构
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          rechargeAmount: '10' // 支付金额
        }
        this.$http.post('/app/json/elec/settle', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            let receivablesOuCode = data.data.ouCode
            this.setPayWays(receivablesOuCode)
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
      setPayWays(receivablesOuCode) {
        this.selectedPayWay = []
        payHelper.getPayWays('150004', receivablesOuCode).then(res => {
          this.selectedPayWay = res || []
          console.log(res)
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
            rechargeAmount: this.money // 支付金额
          }
          this.$http.post('/app/json/elec/submit', paramsData).then(res => {
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
        payHelper.elecPayEvent(this.payStyle, this.submitInfo.orderType, this.submitInfo.orderId).then(() => {
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
        // this.$http.post('/app/json/elec/pay', paramsData).then(res => {
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
          path: '/pay-success',
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
      recharge() {
        // 充值按钮
        if (this.money != '') {
          if (this.radio === '') {
            this.$Toast('请选择支付方式')
          } else {
            this.showRecharg = true
          }
        }
      },
      instructions() {
        // 说明按钮
        this.$router.push({path: '/problems', query: {title: '说明', source: '2'}})
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .wallet-recharge {
    .wallet-recharge-container {
      background-color: #f8f8f8 !important

      .top {
        background #fff
        padding: 11px 15px
        margin-bottom 10px
      }

      .title {
        color: $color-text
      }

      .inp {
        display flex
        justify-content space-between
        align-items center

        .left {
          flex: 1
          font-size: 16px
          padding: 20px 0
          display flex
          justify-content left
          align-items center

          .icon {
            font-size: 28px
          }

          input {
            line-height 34px
            font-size 28px
            width: 100%
          }
        }

        .right {
          width: 20px
        }
      }

      .pay-stype {
        padding-top: 10px

        .style {
          border-radius 6px
          padding: 0 5px
          margin: 10px 0

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

          /deep/ .van-cell {
            padding: 11px
          }
        }
      }

      .submit-btn {
        background-color: $color-theme-r;
        color: #fff;
        text-align: center;
        padding: 0.32rem 0;
        border-radius: 50px;
        width: 90%;
        margin: 40px auto
        box-shadow: 0 3px 10px 1px rgba(240, 44, 45, 0.5);

        &[disabled] {
          opacity 0.5
        }
      }

      .active {
        opacity 0.5
      }
    }
  }

  .my-cards {
    position absolute
    right 10px
    top 0
    font-size 13px
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
</style>

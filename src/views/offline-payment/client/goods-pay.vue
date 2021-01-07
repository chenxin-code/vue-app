<template>
  <div class="confirm-bill">
    <nav-top title="商品支付" @backEvent="$router.go(-1)">
      <div class="credentials" @click="goPaymentVoucher">支付凭证</div>
    </nav-top>
    <nav-content class="confirm-bill-content">
      <div class="f-safe">请在安全区域内使用手机</div>
      <div class="content">
        <div class="pay-type card">
          <div class="title">商品金额</div>
          <div class="type">
            <div class="inp">
              <input type="number"
                     class="num"
                     clickable
                     @input="inputNum"
                     placeholder="请输入商品金额"
                     v-model="goodsNum">
            </div>
          </div>
        </div>
        <div class="pay-type card">
          <div class="title">商品付款类型</div>
          <div class="type">
            <div class="left">
              <div class="img">
                <img src="../image/img1.png" alt="">
              </div>
              <div class="text">{{dictByAlias.dictKey}}</div>
            </div>
            <div class="right">
              <van-radio-group v-model="radio">
                <van-radio checked-color="#f44" name="1"></van-radio>
              </van-radio-group>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="bottom">
          <div class="money">{{scanInfo.storeReceivablesOuName}}</div>
          <div class="btn" :class="{btnChange: btnChange == 1}"  @click="changeBtn">选好了</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        radio: '1', // 选中商品付款方式
        source: 0, // 来源
        btnChange: 0, // 是否选好 输入金额后 ‘选好了’按钮颜色变成红色
        goodsNum: '', // 商品金额
        codeObj: '', // 码
        scanInfo: '', // 根据码获取的信息
        dictByAlias: '', // 商品付款类型
        submitInfo: '' // 提交订单返回参数
      }
    },
    mounted() {
      this.getDictByAlias()
      this.source = this.$route.query.source
      this.codeObj = this.$route.query.codeObj
    },
    methods: {
      getDictByAlias() {
        // 获取商品付款类型
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          alias: 'shoppingScanCodeProductPayType' // 字典表
        }
        this.$http.post('/app/json/app_dict/getDictByAlias', paramsData).then(res => {
          let data = res.data
          this.$Loading.close()
          if (data.status == 0) {
            this.dictByAlias = data.data[0]
            if (this.codeObj) {
              this.scanCodeInfo()
            }
          } else {
            this.$Toast(data.info)
          }
          this.complete = true
        })
      },
      scanCodeInfo() {
        this.$request.post("/app/json/refuel_scan_code/getScanCodeInfo", {rfrCode: this.codeObj}).then(res => {
          if (res.status == 0) {
            this.scanInfo = res.data
          } else {
            this.$Toast(res.info ? res.info : '获取失败')
          }
        })
      },
      changeBtn() {
        // 选好了 结算接口
        if (this.btnChange == 1) {
          this.$request.post("/app/json/shopping_scan_code/settle", {
            rfrCode: this.codeObj,
            amount: this.goodsNum,
          }).then(res => {
            if (res.status == 0) {
              this.nowPay()
            } else {
              this.$Toast(res.info ? res.info : '获取活动失败')
            }
          })
        } else {
          this.$toast('请输入商品金额')
        }
      },
      nowPay() {
        // 提交订单
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          amount: this.goodsNum,
          rfrCode: this.codeObj,
          productPayType: this.dictByAlias.dictValue,
        }
        this.$http.post('/app/json/shopping_scan_code/submit', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.submitInfo = data.data
            this.$router.push({path: '/offline_payment/confirm_bill', query: {source: 2, codeObj: this.codeObj, submitInfo: JSON.stringify(this.submitInfo), scanInfo: JSON.stringify(this.scanInfo)}})
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
      goPaymentVoucher() {
        // 加油支付凭证
        // this.$router.push({path: '/offline_payment/payment_voucher', query: {source: 2}})
        this.$router.push({path: "/firmScanOfflineOrder"});
      },
      yesBtn() {
        // 弹框 是 按钮
      },
      inputNum() {
        // 输入金额后
        if (this.goodsNum) {
          this.btnChange = 1
        } else {
          this.btnChange = 0
        }
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .credentials {
    font-size: 14px
    text-align right
    margin-right: 15px
  }
  .card {
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
    background: #fff
    border-radius 6px
    margin-bottom: 10px
  }
  .confirm-bill {
    font-size 14px
    .confirm-bill-content {
      display flex
      flex-direction column
      .f-safe {
        flex-shrink 0
        padding: 11px 15px;
        background-color: rgba(253, 250, 229, 0.9);
        color: #e68e4c
        font-size: 12px;
        text-align center
      }
      .content {
        flex: 1
        padding: 11px 15px
        .details {
          padding: 11px 15px
          .item {
            display flex
            align-items center
            .img {
              padding-right: 10px
              img {
                width 23px
              }
            }
          }
          .oil-item {
            margin-top: 10px
            .img {
              img {
                width 25px
              }
            }
          }
        }
        .oil-pay {
          padding: 15px
          .item {
            line-height 28px
            display flex
            justify-content space-between
          }
          .money {
            .num {
              color $color-theme-r
            }
          }
        }
        .pay-type {
          padding: 11px 15px
          .type {
            padding-top: 10px
            display flex
            justify-content space-between
            .left {
              display flex
              align-items center
              .img {
                padding-right: 10px
                img {
                  width 25px
                }
              }
            }
          }
          .inp {
            flex: 1
            border-bottom: 1px solid $color-line-gray-l
            .num {
              line-height 34px
              width 100%
            }
          }
        }
      }
      .footer {
        flex-shrink 0
        .f-safe {
          padding: 11px 15px;
          background-color: rgba(253, 250, 229, 0.9);
          color: #e68e4c
          font-size: 12px;
          text-align center
        }
        .bottom {
          margin-top: 10px
          flex-shrink 0
          padding-left: 15px
          box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
          display flex
          justify-content space-between
          div {
            padding: 15px 0
          }
          .btn {
            text-align center
            width 30%
            background $color-background-ll
            color: #fff
            font-size 16px
          }
          .btnChange {
            background $color-theme-r
          }
          .money {
            font-weight bold
            .num {
              font-size 20px
            }
          }
        }
      }
    }
  }
  /deep/ .van-dialog__confirm {
    background: #F80F16;
    color: #fff;
  }
  .tips-content {
    padding: 20px 15px
    text-align center
    line-height 20px
    .list {
      padding-top: 15px
      .item {
        line-height 28px
        display flex
        justify-content space-between
      }
    }
  }
</style>

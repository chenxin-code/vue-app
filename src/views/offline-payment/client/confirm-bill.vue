<template>
  <div class="confirm-bill">
    <nav-top title="确认账单" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="confirm-bill-content">
      <div class="content">
        <div class="details card">
          <div class="item">
            <div class="img">
              <img src="../image/oil-station.png" alt="">
            </div>
            <div class="text">{{scanInfo.storeReceivablesOuName}}</div>
          </div>
          <div class="item oil-item">
            <div class="img">
              <img src="../image/img2.png" alt="">
            </div>
            <div class="text">{{dictByAlias.dictKey}}</div>
          </div>
        </div>
        <div class="oil-pay card">
          <div class="item time" v-if="source == 1">
            <div class="text">支付时间</div>
            <div class="num">2020年10月13日11:26:45</div>
          </div>
          <div class="item money">
            <div class="text">{{source == 2 ? '商品金额' : '加油金额'}}</div>
            <div class="num">￥{{submitInfo.payAmount}}</div>
          </div>
        </div>
        <div class="pay-type card">
          <div class="title">支付方式</div>
          <div class="type">
            <van-radio-group v-model="radio">
              <van-cell-group>
                <van-cell v-for="(item, index) in selectedPayWay" :key="index" clickable
                          @click="changeStyle(item, index)">
                  <div slot="title" class="pay-label">
                    <img class="pay-icon" v-if="item.payMode == '210'"
                         src="../image/wx.png" alt="">
                    {{item.text}}
                  </div>
                  <van-radio @click="changeStyle(item, index)" :name="index" checked-color="#F80F16"/>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
<!--            <div class="left">-->
<!--              <div class="img">-->
<!--                <img src="../image/wx.png" alt="">-->
<!--              </div>-->
<!--              <div class="text">微信APP支付</div>-->
<!--            </div>-->
<!--            <div class="right">-->
<!--              <van-radio-group v-model="radio">-->
<!--                <van-radio checked-color="#f44" name="1"></van-radio>-->
<!--              </van-radio-group>-->
<!--            </div>-->
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="f-safe">请核对账单进行支付</div>
        <div class="bottom">
          <div class="money">￥<span class="num">{{submitInfo.payAmount}}</span></div>
          <div class="btn" @click="confirmPay">确认支付</div>
        </div>
      </div>
      <van-dialog
        v-model="payTip"
        show-cancel-button
        confirmButtonText="是"
        cancelButtonText="否"
        confirmButtonColor="#ffffff"
        @confirm="yesBtn"
        @cancel="payTip = false"
      >
        <div class="tips-content">
          <div class="title">确认支付？</div>
          <div class="list">
            <div class="item">
              <div class="left">支付方式</div>
              <div class="right">{{payStyle.text || '--'}}</div>
            </div>
            <div class="item">
              <div class="left">金额</div>
              <div class="right">￥{{submitInfo.payAmount}}</div>
            </div>
            <div class="item">
              <div class="left">应付金额</div>
              <div class="right">￥{{submitInfo.payAmount}}</div>
            </div>
          </div>
        </div>
      </van-dialog>
    </nav-content>
  </div>
</template>

<script>
  import payHelper from '@/utils/payHelper'
  import logCenter from "@/utils/logCenter";

  export default {

    data() {
      return {
        radio: '1', // 选中微信支付方式
        payTip: false, // 确认支付弹框
        source: 0, // 默认0  1是加油支付里的支付凭证入口  2是商品支付入口
        submitInfo: '', // 提交订单返回参数
        scanInfo: '', // 扫码后的信息
        selectedPayWay: [], // 支付方式
        payStyle: {}, // 支付方式
        dictByAlias: '', // 商品付款类型
        codeObj: '' // 码
      }
    },
    mounted() {
      this.source = this.$route.query.source
      this.codeObj = this.$route.query.codeObj
      this.submitInfo = JSON.parse(this.$route.query.submitInfo)
      this.scanInfo = JSON.parse(this.$route.query.scanInfo)
      console.log(this.submitInfo)
      console.log(this.scanInfo)
      this.getDictByAlias()
      this.setPayWays() // 获取支付方式
    },
    methods: {
      setPayWays() {
        this.selectedPayWay = []
        payHelper.getPayWays('200001010', this.submitInfo.occurOuCode, '1').then(res => {
          this.selectedPayWay = res || []
          if (this.selectedPayWay.length > 0) {
            this.radio = 0
            this.payStyle = this.selectedPayWay[0];
          }
        })
      },
      changeStyle(item, index) {
        // 选择支付方式
        this.radio = index
        this.payStyle = item
        console.log(item)
      },
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
          } else {
            this.$Toast(data.info)
          }
          this.complete = true
        })
      },
      confirmPay() {
        // 确认支付
        this.payTip = true
      },
      yesBtn() {
        // 弹框 是 按钮
        console.log(this.submitInfo)
        let fn = 'refuelOfflinePayEvent'
        let params = Object.assign({}, this.submitInfo)
        if (!this.submitInfo.payMode) {
          params = Object.assign({}, params, this.payStyle)
        }
        console.log('payHelper[fn]')

        payHelper[fn](params, this.submitInfo.orderType, this.submitInfo.orderId, {rfrCode: this.codeObj}).then(() => {
          this.resultHand("1", this.submitInfo);
        }).catch((error) => {
          this.resultHand("0", this.submitInfo);
        })
      },
      resultHand(result, payData) {
        this.$Loading.close();
        logCenter.addLog("支付结果", result ? "成功" : "失败");
        if (result == "1") {
          this.$router.replace({
            path: '/offline_payment/pay_success',
            query: {
              orderType: payData.orderType,
              orderId: payData.orderId,
              source: 1
            }
          });
        } else {
          this.cancelOrder(payData)
        }
      },
      cancelOrder(payData) {
        let params = {
          token: this.$store.state.login.token,
          orderType: payData.orderType,
          orderId: payData.orderId
        };
        let url = '/app/json/shopping_scan_code/cancelOrder'
        this.$http.post(url, params).then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.$Toast("支付已取消");
          } else {
            this.$Toast(data.info);
          }
        });
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
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
            background $color-theme-r
            color: #fff
            font-size 16px
            line-height: 18px
          }
          .money {
            color $color-theme-r
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
  .pay-label {
    display flex
    align-items center

    .pay-icon {
      width 25px
      margin-right 10px
    }
  }
  /deep/ .van-radio-group {
    width 100%
  }
  /deep/ .van-cell {
    padding: 10px 0
  }
  /deep/ .van-radio {
    display inline-block
  }
</style>

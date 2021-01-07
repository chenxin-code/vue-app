<template>
  <div class="confirm-bill" v-if="complete">
    <nav-top title="查看账单" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="confirm-bill-content">
      <div class="content">
        <div class="details card">
          <div class="item">
            <div class="img">
              <img src="../image/img1.png" alt="">
            </div>
            <div class="text">{{orderDetail.ouName}}</div>
          </div>
          <div class="item oil-item">
            <div class="img">
              <img src="../image/img2.png" alt="">
            </div>
            <div class="text">{{dictByAlias.dictKey}}</div>
          </div>
        </div>
        <div class="oil-pay card">
          <div class="item time">
            <div class="text">支付时间</div>
            <div class="num">{{orderDetail.payTime}}</div>
          </div>
          <div class="item">
            <div class="text">{{source == 1 ? '商品金额' : '加油金额'}}</div>
            <div class="num">￥{{orderDetail.payAmount}}</div>
          </div>
          <div class="item">
            <div class="text">支付方式</div>
            <div class="num">{{getPayWayStr(this.orderDetail.payMode)}}</div>
          </div>
        </div>
      </div>
      <div class="footer" @click="goHome">返回首页</div>
    </nav-content>
  </div>
</template>

<script>

  export default {

    data() {
      return {
        orderDetail: {},
        dictByAlias: '', // 商品付款类型
        orderType: '',
        orderId: '',
        source: '',
        complete: false
      }
    },
    mounted() {
      this.source = this.$route.query.source
      this.orderType = this.$route.query.orderType
      this.orderId = this.$route.query.orderId
      this.getOrderDetail()
      this.getDictByAlias()
    },
    methods: {
      goHome() {
        this.$router.back("/offline_payment/payment_type")
      },
      getOrderDetail: function () {
        this.$Loading.open();
        let url = "/app/json/shopping_scan_code/detail"
        let paramsData = {
          token: this.$store.state.login.token,
          // orderType: '200401002',
          orderType: this.orderType,
          orderId: this.orderId
          // orderId: '2565'
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.orderDetail = data.data || {};
              this.complete = true
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast("请求数据失败！");
          }
        )
      },
      getPayWayStr(payMode) {
        let str = ''
        if (payMode == 200) {
          str = '支付宝支付'
        } else if (payMode == 210) {
          str = '微信支付'
        } else if (payMode == 250) {
          str = '翼支付'
        } else if (payMode == 320) {
          str = '建行龙支付'
        } else if (payMode == 300) {
          str = '银联支付'
        }
        return str
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
        background $color-theme-r
        color: #fff
        text-align center
        padding: 15px 0
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

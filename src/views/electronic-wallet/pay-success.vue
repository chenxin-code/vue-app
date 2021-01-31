<template>
  <div class="pay-success">
    <nav-top title="支付成功" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="pay-success-container">
      <div class="top">
        <div class="img">
          <img src="./image/icon3@2x.png" alt="">
        </div>
        <div class="text">支付成功</div>
      </div>
      <div class="bottom">
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">交易单号</div>
<!--              <div class="left">订单号</div>-->
              <div class="right">{{detaiList.tradeNo}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">充值金额</div>
              <div class="right money">￥{{detaiList.realAmount}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">商家</div>
<!--              <div class="left">商品名称</div>-->
              <div class="right">{{detaiList.storeName}}</div>
            </div>
          </div>
<!--          <div class="table-view-cell">-->
<!--            <div class="table-view-cell-text">-->
<!--              <div class="left">商家名称</div>-->
<!--              <div class="right">广州市时代邻里邦网络科技有限公司</div>-->
<!--            </div>-->
<!--          </div>-->
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">支付时间</div>
              <div class="right">{{detaiList.payTime}}</div>
            </div>
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
        detaiList: ''
      }
    },
    mounted() {
      this.getDetail()
    },
    methods: {
      getDetail() {
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          // orderType: '150004002', // 订单类型
          // orderId: '1982' // 商城订单ID
          orderType: this.$route.query.orderType, // 订单类型
          orderId: this.$route.query.orderId // 商城订单ID
        }
        this.$http.post('/app/json/elec/detail', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.detaiList = data.data
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .pay-success {
    .pay-success-container {
      padding: 11px 15px
      .top {
        text-align center
        .img {
          img {
            width: 50px
          }
        }
        .text {
          padding: 20px 0
        }
      }
      .bottom {
        box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
        border-radius 6px
        padding: 0 5px
        margin: 20px 0 10px 0
        .table-view-cell {
          padding: 15px 5px
          .left {
            color: $color-text-d
          }
          .money {
            color: $color-theme-r
          }
        }
      }
    }
  }
</style>

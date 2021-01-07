/**Created by liaoyingchao on 2019-06-03.*/

<template>
  <div class="detail">
    <nav-top title="账单详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="bill-content">
      <div class="top-div">
        <div class="img-div">
          <img src="./imgs/icon@2x.png" alt="">
          <p>{{detailData.bizTypeName}}</p>
        </div>
        <p class="paymoney">-{{$util.toDecimal2(detailData.amount)}}</p>
        <p class="payres">支付成功</p>
      </div>

      <div class="content-div">
        <div class="cell" v-for="item in listArr">
          <p>{{item.left}}</p>
          <p>{{item.right}}</p>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "detail",
    components: {},
    data() {
      return {
        listArr: [],
        tradeNo: '',
        detailData: {}
      }
    },
    methods: {
      getPayTime(time) {
        var oDate = new Date(),
          oYear = oDate.getFullYear(),
          oMonth = oDate.getMonth() + 1,
          oDay = oDate.getDate(),
          oHour = oDate.getHours(),
          oMinute = oDate.getMinutes(),
          oSecond = oDate.getSeconds(),

          oTime = oYear + '-' + this.$util.getzf(oMonth) + '-' + this.$util.getzf(oDay) + ' ' + this.$util.getzf(oHour) + ':' + this.$util.getzf(oMinute) + ':' + this.$util.getzf(oSecond);//最后拼接时间
        return oTime;
      },
      initData: function () {
        let classification = ''
        if (this.detailData.bizTypeName == '商城购物' || this.detailData.bizTypeName == '线下购物') {
          classification = '易捷消费'
        }
        if (this.detailData.bizTypeName == 'App加油' || this.detailData.bizTypeName == '线下加油' || this.detailData.bizTypeName == '加油卡充值') {
          classification = '加油消费'
        }
        this.listArr = [
          {
            left: '支付方式',
            right: this.detailData.payList[0].payModeName
          },
          {
            left: '商品说明',
            right: this.detailData.productList[0].productName
          },
          {
            left: '账单分类',
            right: classification,
          },
          // {
          //   left: '商户名称',
          //   right: this.detailData.bizTypeName
          // },
          {
            left: '支付时间',
            right: this.getPayTime(this.detailData.tradeTime)
          },
          {
            left: '订单号',
            right: this.detailData.tradeNo
          },
        ]
      },
      getDetailData: function () {
        let url = '/app/json/app_stock_month_bills/queryTradeBills';
        let paramsData = {
          stockTradeBillsModel: {
            userId: this.$store.state.userInfo.userId,
            tradeNo: this.tradeNo
          }
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.detailData = data.data
              this.initData()
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      }
    },
    created() {
      this.tradeNo = this.$route.query.tradeNo
      this.getDetailData();
      // this.initData();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"

  .detail {
    width 100%
    height 100%
    overflow hidden

    .bill-content {
      background-color $color-background-lll

      .top-div {
        width 100%
        margin-top 10px
        padding 20px 0px
        display flex
        flex-direction column
        justify-content center
        align-items center
        background-color white

        .img-div {
          display flex
          justify-content center
          align-items center

          img {
            width 25px
            height 25px
          }

          p {
            margin-left 10px
            font-size $font-size-large
            font-weight $font-weight-x
          }
        }

        .paymoney {
          font-size $font-size-large-x
          font-weight $font-weight-x
          margin-top 10px
        }

        .payres {
          font-size $font-size-small
          font-weight $font-weight-m
          color $color-text-l
          margin-top 10px
        }
      }

      .content-div {
        margin-top 10px
        width 100%
        padding 10px 20px
        background white

        .cell {
          display flex
          justify-content space-between
          font-size $font-size-medium
          color #666666

          & + .cell {
            margin-top 15px
          }
        }
      }
    }
  }
</style>

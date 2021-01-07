<template>
  <div class="phone-bill">
    <nav-top title="账单详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="phone-bill-details">
      <div class="phone-bill-content">
        <div class="title">
          <div class="name">
            <img src="./image/ll.png" alt v-if="name == 'flow'" />
            <img src="./image/bill.png" alt v-else-if="name == 'phone'" />
            <img src="./image/yxzd.png" alt v-else-if="name == 'play'" />
            <img src="./image/spzd.png" alt v-else-if="name == 'video'" />
            <img src="../recharge-bill/image/qq.png" alt v-else-if="name == 'qq'" />
            <img src="../recharge-bill/image/sfx.png" alt v-else-if="name == 'lify' && type == '001'" />
            <img src="../recharge-bill/image/dfx.png" alt v-else-if="name == 'lify' && type == '002'" />
            <img src="../recharge-bill/image/rqx.png" alt v-else-if="name == 'lify' && type == '003'" />
            {{detaiList.storeName}}
          </div>
          <div class="money">{{detaiList.payAmount}}</div>
          <div class="status" v-if="detaiList.state == 17">充值中</div>
          <div class="status" v-else-if="detaiList.state == 9">充值成功</div>
          <div class="status" v-else-if="detaiList.state == 12">充值失败</div>
          <div class="status" v-else-if="detaiList.state == 3">已支付</div>
        </div>
        <div class="content">
          <ul class="list">
            <li class="item">
              <div class="info">
                <div class="details">付款方式</div>
                <div
                  class="text"
                >{{detaiList.payItemList != '' ? detaiList.payItemList[0].payModeStr : '微信支付'}}</div>
              </div>
            </li>
            <li class="item">
              <div class="info">
                <div class="details">充值手机号</div>
                 <div class="text">{{detaiList.virtualUserPhone}}</div>
              </div>
            </li>
            <li class="item">
              <div class="info">
                <div class="details">商品信息</div>
                <!-- <div class="text address">{{showFlow(detaiList.itemAbstractList[0].specs)}}</div> -->
                <div class="text address">{{detaiList.itemAbstractList[0].skuName}}</div>
              </div>
            </li>
            <!--            <li class="item" >-->
            <!--              <div class="info">-->
            <!--                <div class="details">账单分类</div>-->
            <!--                <div class="text">{{detaiList.productType}}</div>-->
            <!--              </div>-->
            <!--            </li>-->
            <!--<li class="item" >-->
            <!--<div class="info">-->
            <!--<div class="details">积分奖励</div>-->
            <!--<div class="text">{{detaiList.payAmount}}</div>-->
            <!--</div>-->
            <!--</li>-->
            <!--<li class="item" >-->
            <!--<div class="info">-->
            <!--<div class="details">交易对象</div>-->
            <!--<div class="text">{{detaiList.payAmount}}</div>-->
            <!--</div>-->
            <!--</li>-->
            <li class="item">
              <div class="info">
                <div class="details">充值时间</div>
                <div class="text">{{detaiList.payTime}}</div>
              </div>
            </li>
            <li class="item">
              <div class="info">
                <div class="details">订单号</div>
                <div class="text">{{detaiList.tradeNo}}</div>
              </div>
            </li>
            <li class="item" v-if="detaiList.interfaceOrderId">
              <div class="info">
                <div class="details">商家订单号</div>
                <div class="text">{{detaiList.interfaceOrderId}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  data() {
    return {
      detaiList: '',
      name: ''
    }
  },
  created() {
  },
  mounted() {
    this.name = this.$route.query.name
    this.type = this.$route.query.type
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.$Loading.open()
      let paramsData = {
        token: this.$store.state.login.token,
        orderType: this.$route.query.orderType, // 订单类型
        orderId: this.$route.query.orderId // 商城订单ID
      }
      this.$http.post('/app/json/fee_life_order/detail', paramsData).then(res => {
        let data = res.data
        if (data.status == 0) {
          this.detaiList = data.data
        } else {
          this.$Toast(data.info)
        }
        this.$Loading.close()
      })
    },
    showFlow(item) {
      return item.split(':')[1]
    }
  },
  computed: {},
  components: {}
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
@import '../asset/recharge.styl';

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

  .title {
    text-align: center;
    padding: 20px 0;
    font-size: 14px;

    .name {
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 25px;
        margin-right: 6px;
      }
    }

    .money {
      padding: 10px 0;
      font-size: 30px;
    }

    .status {
      color: $color-text-l;
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

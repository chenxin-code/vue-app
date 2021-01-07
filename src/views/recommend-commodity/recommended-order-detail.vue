<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="card">
        <p class="business-name">{{ orderInfo.storeName }}</p>
        <div class="prod-info" v-if="type == 0">
          <img :src="orderInfo.orderItemList[0].phPictureUrl" alt="" class="prod-img">
          <div class="right-info">
            <p class="name">{{ orderInfo.orderItemList[0].skuName }}</p>
            <p class="type">{{ orderInfo.orderItemList[0].specs }}</p>
            <p class="amount">￥<span class="big">{{ $util.toDecimal2(orderInfo.orderItemList[0].realPrice) }}</span></p>
          </div>
          <div class="number">x {{ orderInfo.orderItemList[0].number }}</div>
        </div>
        <div class="prod-info" v-else>
          <img src="./img/icon-oil.png" alt="" class="prod-img">
          <div class="right-info">
            <p class="name">{{ orderInfo.payBody }}</p>
            <p class="type">{{ orderInfo.itemAbstractList[0].unit || '升' }}</p>
            <p class="amount">￥<span class="big">{{ $util.toDecimal2(orderInfo.itemAbstractList[0].realPrice) }}</span></p>
          </div>
          <div class="number">x {{ orderInfo.itemAbstractList[0].number }}</div>
        </div>
      </div>
      <div class="card" v-if="type == 1">
        <p class="info-item">
          <span class="label">油站编码</span>
          <span class="text">{{ orderInfo.refuelOuCode || '-' }}</span>
        </p>
        <p class="info-item">
          <span class="label">油枪枪编码</span>
          <span class="text">{{ orderInfo.refuelRecordId || '-' }}</span>
        </p>
      </div>
      <div class="card">
        <!-- <p class="info-item">
          <span class="label">用户姓名</span>
          <span class="text">{{ orderInfo.realName || '-' }}</span>
        </p> -->
        <p class="info-item">
          <span class="label">用户手机号</span>
          <span class="text">{{ orderInfo.userName | phoneCode }}</span>
        </p>
        <p class="info-item">
          <span class="label">订单状态</span>
          <span class="text">{{ '已完成' }}</span>
        </p>
      </div>
      <div class="card">
        <p class="info-item">
          <span class="label">订单号</span>
          <span class="text">{{ orderInfo.id }}</span>
        </p>
        <p class="info-item">
          <span class="label">下单时间</span>
          <span class="text">{{ orderInfo.submitTime }}</span>
        </p>
        <p class="info-item">
          <span class="label">支付完成时间</span>
          <span class="text">{{ orderInfo.paidTime }}</span>
        </p>
        <p class="info-item" v-if="type == 0">
          <span class="label">订单状态</span>
          <span class="text">{{ '已完成' }}</span>
        </p>
        <p class="info-item" v-if="type == 0">
          <span class="label">订单完成时间</span>
          <span class="text">{{ orderInfo.completeTime }}</span>
        </p>
      </div>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {
      type: 0, // 0 商城 1 加油
      orderInfo: {
        orderItemList: [{}],
        itemAbstractList: [{}]
      }
    }
  },
  mounted() {
    this.type = this.$route.query.customType || 0
    this.initDetail()
  },
  filters:{
    phoneCode(phone) {
       return phone = phone.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")
    }
  },
  methods: {
    initDetail() {
      this.$Loading.open()
      let url = ''
      let params = {}
      if (this.type == 0) {
        url = '/app/json/app_employee/shoppingDetail'
        params = {
          orderPayType: this.$route.query.orderPayType,
          orderType: this.$route.query.orderType,
          orderId: this.$route.query.orderId,
        }
      } else {
        url = '/app/json/app_employee/detail'
        params = {
          orderPayType: this.$route.query.orderPayType,
          orderType: this.$route.query.orderType,
          orderId: this.$route.query.orderId,
          userId: this.$route.query.userId,
          tradeNo: this.$route.query.tradeNo,
        }
      }
      this.$http.post(url, params).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.orderInfo = data.data || {}
        } else {
          this.$Toast(data.info)
        }
      })
      .catch(err => {
        this.$Loading.close()
        this.$Toast(`detail err ${err}`)
      })
    }
  }
}
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.card {
  padding 12px 10px;
  border-radius 5px;
  box-shadow 0 0 10px #ddd;
  margin 10px 10px 0;
  position relative;
}
.business-name {
  font-size 16px;
  font-weight 500;
  line-height 18px;
}
.prod-info {
  display flex;
  padding-top 5px;
  .prod-img {
    display block;
    width 70px;
    height 80px;
  }
  .right-info {
    flex 1;
    padding 10px;
    display flex;
    flex-direction column;
    justify-content space-between;
    .name {
      font-size 16px;
    }
    .type {
      font-size 12px;
      color #6d6d6d;
    }
    .amount {
      color #f70415;
      font-weight 700;
      font-size 12px;
      .big {
        font-size 16px;
        font-weight 700
      }
    }
  }
  .number {
    font-size 12px;
    position absolute;
    right 10px;
    top 50%;
    transform translateY(-50%)
  }
}
.info-item {
  font-size 13px;
  color #666;
  margin-top 10px;
  display flex;
  &:first-child {
    margin-top 0;
  }
  .label {
    width 90px;
  }
  .text {
    flex 1;
  }
}
</style>
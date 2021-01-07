<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <p class="prod-name">{{ refundData.skuName }}</p>
      <div class="public-block refund-info">
        <div class="item">
          退款数量
          <van-stepper v-model="refundNum" :min="1" :max="refundData.number" integer/>
        </div>
        <div class="item">
          退款金额
          <span class="price">¥{{ computedPrice() }}</span>
        </div>
      </div>
      <!-- 退款方式 -->
      <div class="public-block refund-type">
        <div class="item">退还方式</div>
        <div class="item">原路退还<span class="description">（审核通过后，将在1-7个工作日退回原支付方）</span></div>
      </div>
      <!-- 退款原因 -->
      <div class="public-block refund-reason">
        <div class="item" v-for="(item, index) in refundData.returnList" :key="index" @click="reasonClick(item)">
          <span class="name">{{ item.value }}</span>
          <span class="tick" :class="{active: item.code == selectReason.code}">
            <i class="iconfont mall-gou"></i>
          </span>
        </div>
      </div>
      <!-- 底部按钮 -->
      <div class="refund-btn theme_bg_red theme_font_white" @click="submitRefund">申请退款</div>
    </nav-content>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      refundNum: 1,
      activeIndex: 0,
      refundReason: [
        {
          text: '店里优惠更多',
          value: 1
        },
      ],
      refundData: {},
      selectReason: {},
    }
  },
  mounted() {
    this.getApplyInfo();
  },
  methods: {
    reasonClick(item) {
      this.selectReason = item;
    },
    // 获取售后信息
    getApplyInfo() {
      this.$Loading.open();
      this.$http.post('/app/json/app_order_after_sale/applyPage', {
        mainOrderId: this.$route.query.mainOrderId,
        id: this.$route.query.id,
        skuId: this.$route.query.skuId
      }).then(res => {
        let data = res.data;
        if (data.status == 0) {
          this.refundData = data.data;
          this.selectReason = data.data.returnList[0];
        } else {
          this.$Toast(data.info);
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(`applyPage err ${err}`);
        this.$Loading.close();
      })
    },
    computedPrice() {
      return this.dealWithPrice(this.refundNum * this.refundData.salePrice)[2];
    },
    // 处理价格整数小数方法
    dealWithPrice(price) {
      price = Number(price);
      if (!price) {
        return [0, 0, `0.00`];
      }
      price = String(price.toFixed(2));
      let decimalNum = price.split('.')[1]; // 小数
      let integerNum = price.split('.')[0]; // 整数
      return [integerNum, decimalNum, `${integerNum}.${decimalNum}`];
    },
    // 售后提交
    submitRefund() {
      this.$Loading.open();
      this.$http.post('/app/json/app_order_after_sale/afterSubmit', {
        applyReason: this.selectReason.code,
        number: this.refundNum, // 申请数量
        mainOrderId: this.refundData.mainOrderId,
        id: this.refundData.id,
        skuId: this.refundData.skuId,
        type: 0, // 类型（0退货1换货2维修3补发）
      }).then(res => {
        let data = res.data;
        if (data.status == 0) {
          this.$router.replace({
            path: '/mall2/paysuccess',
            query: {
              entryType: 2,
              id: data.data.id,
              type: data.data.type,
              price: data.data.predictRefundAmount,
              createTime: data.data.createTime
            }
          })
        } else {
          this.$Toast(data.info);  
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(`afterSubmit err ${err}`);
        this.$Loading.close();
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/deploy/chum/assets/stylus/chum-public.styl';
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.public-block {
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
  border-radius: 5px;
  padding 0 10px;
  margin-top 10px;
}
.container {
  padding 0 20px;
  .prod-name {
    font-size 15px;
    font-weight 500;
    margin-top 15px;
  }
  .refund-info {
    .item {
      display flex;
      font-size 14px;
      height 43px;
      line-height 43px;
      justify-content space-between
      .price {
        font-size 14px;
        font-weight 700
        color $color-theme-r;
      }
      &:first-child {
        bdr-b();
      }
    }
  }
  .refund-type {
    .item {
      font-size 14px;
      height 43px;
      line-height 43px;
      &:first-child {
        bdr-b();
      }
      .description {
        font-size 10px;
        color $color-theme-r;
      }
    }
  }
  .refund-reason {
    .item {
      font-size 14px;
      display flex;
      justify-content space-between;
      height 43px;
      line-height 43px;
      align-items center;
      bdr-b();
      .tick {
        height 20px;
        width 20px;
        border-radius 3px;
        border 1px solid #949195;
        line-height 20px;
        text-align center;
        .iconfont {
          display none;
        }
        &.active {
          border-color $color-theme-r;
          background-color $color-theme-r;
          .iconfont {
            display block;
            color #fff;
          }
        }
      }
    }
  }
  .refund-btn {
    font-size $font-size-medium-x
    padding 12px;
    border-radius 20px
    text-align center;
    margin-top 30px;
  }
}
</style>
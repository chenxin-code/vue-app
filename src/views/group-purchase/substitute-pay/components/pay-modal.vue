<template>
  <div>
    <div class="pay-modal" v-if="isShowPopup">
      <div class="overlay" @click="overlayClick"></div>
      <div class="pay-content">
        <div class="top-info">
          <p class="title">代付进度</p>
          <div class="price-info">
            <p class="left">订单金额：￥{{ dealWithPrice(orderInfo.payAmount)[2] }}</p>
            <p class="right">剩余金额：<span class="red">￥{{ dealWithPrice(orderInfo.unPaidAmount)[2] }}</span></p>
          </div>
          <div class="progress">
            <div class="progress-bar">
              <span class="progress-portion" :style="{width: 10 + '%'}"></span>
            </div>
          </div>
          <p class="amount-title">金额</p>
          <div class="amount-c">
            ￥
            <input
              type="text"
              placeholder="请输入支付金额"
              class="amount-input"
              readonly
              v-model="amount">
          </div>
          <p class="tips">请输入您的付款金额，最多{{ dealWithPrice(orderInfo.unPaidAmount)[2] }}元</p>
        </div>
        <van-number-keyboard
          v-model="amount"
          :show="true"
          theme="custom"
          extra-key="."
          close-button-text="完成"
          :hide-on-click-outside="false"
          @close="onClose"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'isShowPopup',
    event: 'close'
  },
  props: {
    orderInfo: {
      type: Object,
      required: true,
      default: function () {
        return {}
      }
    },
    isShowPopup: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  watch: {
    isShowPopup: function() {
      this.amount = '';
    }
  },
  data() {
    return {
      isShowKeyboard: false,
      amount: '',
      amountReg: /^(?:0\.\d{0,1}[1-9]|(?!0)\d{1,6}(?:\.\d{0,1}[1-9])?)$/,
    }
  },
  mounted() {
  },
  methods: {
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
    overlayClick() {
      this.$emit('close', false)
    },
    onClose() {
      if (this.amount && this.amountReg.test(this.amount)) {
        let am1 = this.amount;
        let am2 = this.orderInfo.unPaidAmount;
        if (Number(am1) > Number(am2)) {
          this.$Toast('支付金额不能大于商品剩余金额');
        } else {
          this.$emit('amountConfirm', this.amount)
        }
      } else {
        this.$Toast('输入的金额不正确');
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.pay-modal {
  position fixed;
  left 0;
  right 0;
  top 0
  bottom 0;
  z-index 6
  .overlay {
    content '';
    position absolute;
    left 0;
    right 0
    top 0;
    bottom 0;
    background-color rgba(0, 0, 0, 0.7);
  }
  .pay-content {
    width 100%
    height 100%;
    .top-info {
      position absolute;
      left 5px;
      right 5px;
      bottom 222px;
      border-radius 5px;
      box-shadow 0 0 5px #fff;
      background-color #fff
      padding 10px;
      .title {
        font-size 15px;
      }
      .price-info {
        display flex;
        justify-content space-between
        font-size 14px;
        margin-top 10px;
        .red {
          color $color-theme-r;
        }
      }
      .progress {
        margin-top 10px;
        .progress-bar {
          height 12px;
          background-color #f6f6f6
          border-radius 6px;
          width 100%;
          margin-top 10px;
          position relative;
          .progress-portion {
            position absolute;
            left 0
            top 0;
            height 100%;
            background-color $color-theme-r;
            border-radius 6px;
          }
        }
      }
      .amount-title {
        font-size 14px;
        margin-top 14px;
      }
      .amount-c {
        font-size 18px;
        margin-top 10px;
        font-weight 700;
        position relative;
        &::before {
          content '';
          display block
          width 100%
          height 1px
          background-color #ddd;
          position absolute;
          left 0
          right 0
          bottom -5px;
        }
      }
      .tips {
        font-size 13px;
        color $color-text-l;
        margin-top 15px;
      }
    }
  }
}

</style>
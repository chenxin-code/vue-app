<template>
  <div class="pay-mode">
    <div class="title">支付方式</div>
    <div class="pay-mode-item" v-for="item in payWay" @click="payWaySelected(item)">
      <template v-if="item.payModeSub != '210009' || (item.payModeSub == '210009' && $store.state.webtype ==3)">
        <div class="icon">
          <img :src="item.icon"/>
        </div>
        <div class="text">{{item.text}}</div>
        <div class="selected">
          <i
            class="iconfont mall-weixuanzhong theme_font_tint"
            v-if="selectedPayWay.payModeSub != item.payModeSub"
          ></i>
          <i
            class="iconfont mall-xuanzhong theme_font_red"
            v-if="selectedPayWay.payModeSub == item.payModeSub"
          ></i>
        </div>
      </template>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import payHelper from "@/utils/payHelper";
  export default {
    name: 'pay-mode',
    props:{
      supportCompany: Boolean
    },
    data() {
      return {
        payWay: [],
        selectedPayWay: {}
      }
    },
    mounted() {
      
    },
    methods: {
      init(orderType, ouCode) {
        payHelper.getPayWays(orderType, ouCode).then(res => {
          this.payWay = res || [];
          if(!this.supportCompany) {
            this.selectedPayWay = this.payWay[0];
          } else {
            this.selectedPayWay = []
          }
          this.$emit('setPayWay', this.selectedPayWay,'init')
        });
      },
      payWaySelected(item) {
        if (item.payMode) {
          this.selectedPayWay = item
          this.$emit('setPayWay', this.selectedPayWay)
        } else {
          this.$Toast("暂未开通！")
        }
      },
    },
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .pay-mode {
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    padding: 10px 15px;
    position: relative;
    margin-top: 8px;

    .title {
      padding: 6px 0;
      font-size: 14px;
    }

    .pay-mode-item {
      display: flex;
      align-items: center;
      padding-top: 8px;

      .icon {
        flex-shrink: 0;

        img {
          width: 24px;
        }
      }

      .text {
        flex: 1;
        padding: 0 8px;
      }

      .selected {
        flex-shrink: 0;
      }

      & + .pay-mode-item {
      }
    }
  }
</style>

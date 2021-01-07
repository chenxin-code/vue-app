/**Created by liaoyingchao on 2020-06-30.*/

<template>
  <div class="exchagne-coupon-success mall2" v-if="visible">
    <pop-view ref="myPop" v-if="visible" @closeEvent="visible = false">
      <div class="pop-body">
        <div class="pop-scroll-div">
          <div class="icon">
            <img src="./img/icon-success.png">
          </div>
          <div class="tip">
            <p v-if="type == 1">兑换成功！</p>
            <p v-else>兑换成功，加油金将在一个工作日内完成派发</p>
            <p>您可在<span>{{getAppName()}}</span>查看使用</p>
          </div>
        </div>
        <div class="btn" @click="toRules" v-if="type != 1">
          使用规则<i class="iconfont mall-gengduojiantou"></i>
        </div>
      </div>
    </pop-view>
  </div>
</template>

<script>
  import router from '@/router'
  import store from '@/vuex/store'
  import PriceOrder from '@/components/commonui/price/price-order'
  import utils from "@/utils/util";

  export default {
    name: "exchagne-coupon-success",
    components: {
      PriceOrder
    },
    data() {
      return {
        visible: false,
        type: '0', // 0 正常， 1 广东
      }
    },
    methods: {
      getAppName: function () {
        if (this.type == 1) {
          return '大家来加油小程序'
        } else {
          return '易捷加油APP'
        }
      },
      toRules: function () {
        this.visible = false;
        router.push({
          path: '/usercenter/agreement',
          query:{
            value: 80
          }
        })
      },
      open: function () {
        this.visible = true;
      },
    },
    created() {
      if (utils.getShortName(store.state.indexData.province) == '广东') {
        this.type = 1
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .exchagne-coupon-success {

    .icon {
      margin-top 40px;
      display flex;
      align-items center;
      justify-content center;
      img {
        width 80px;
      }
    }
    .tip {
      margin-top 20px;
      text-align center;
      line-height 30px;
      font-size 14px;
      span {
        font-size 18px;
        font-weight 500;
        color #FD6802
        padding 0 5px;
      }
    }
    .btn {
      text-align center;
      font-size 14px;
      color #999;
      padding 14px 10px;
      width 100px;
      margin 0 auto 80px;
      i {
        font-size 14px;
        margin-left 3px;
      }
    }
  }
</style>

/**Created by steven on 2018/6/19.*/

<template>
  <div class="Test">
    <div class="item" @click="pageEvent(1)">商品分类</div>
    <div class="item" @click="pageEvent(2)">商品列表</div>
    <div class="item" @click="pageEvent(3)">购物车</div>
    <div class="item" @click="pageEvent(4)">订单列表</div>
  </div>
</template>

<script>
import { Indicator,Toast } from 'mint-ui'

export default {
  name: "Test",
  components: {
    Indicator,
    Toast
  },
  data () {
    return {
    }
  },
  methods: {
    pageEvent: function (pageType) {
      let url
      if (pageType == 1) {
        url = '/mallcategories'
      } else if (pageType == 2) {
        url = '/mallgoodlist'
      } else if (pageType == 3) {
        url = '/mallshoppingcart'
      } else if (pageType == 4) {
        url = '/mallorderlist'
      }
      this.$bridgefunc.customPush({
        path: url
      })
    },
    getToken: function () {
      // let phonenum = '13853103962'
      // let pwd = '34F85CA80EC353D3052B8A2D3973A0C5'
      let phonenum = '18612568595'
      let pwd = 'E10ADC3949BA59ABBE56E057F20F883E'
      let url = 'http://139.224.74.177:18807/app/json/login/login?phone='+phonenum+'&userPwd='+pwd
      let _this = this;
      // this.$Loading.open();
      this.$http.get(url).then(res => {
        // _this.$Loading.close();
        let data = res.data;
        console.log(data)
        if (data.result == 'success') {
          let token = data.data.token
          _this.$store.state.login.token = token;
          _this.$store.state.login.bindCardState = data.data.bindCardState
          _this.$bridgefunc.vuexStorage()
        } else {
          _this.$Toast("请求数据失败!请稍后重试")
        }
      }, error => {
        // _this.$Loading.close();
        _this.$Toast("请求数据失败!")
      })
    }
  },
  created () {
    this.getToken()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import "~@/common/stylus/variable.styl"
.Test {
  width 100%;
  height 100%;
  overflow hidden
  .item {
    margin 10%;
    width 30%;
    height 120px;
    background-color $color-background-lll
    border-radius 10px;
    float left;
    text-align center
    line-height 120px;
  }
}
</style>

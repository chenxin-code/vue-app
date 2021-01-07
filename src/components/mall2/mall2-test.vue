/**Created by liaoyingchao on 2018/11/22.*/

<template>
  <div class="mall2-test">
    <div class="big-btn" @click="pushEvent(item)" v-for="item in pageData">{{item.name}}</div>
  </div>
</template>

<script>
  export default {
    name: "mall2-test",
    components: {},
    data() {
      return {
        pageData: [{
          path: '/mall2/categories',
          name: '分类'
        },{
          path: '/mall2/cart',
          name: '购物车'
        },{
          path: '/mall2/orderlist',
          name: '我的订单'
        },{
          path: '/mall2/serviceindex',
          name: '我的售后'
        }]
      }
    },
    methods: {
      pushEvent: function (item) {
        this.$router.push({
          path: item.path
        })
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .mall2-test {
    width 100%
    height 100%
    padding-top 50px;
    overflow hidden
    .big-btn {
      float left;
      margin 5% 10%;
      width 30%;
      background-color #efefef
      padding 20px;
      border-radius 10px;
      font-size 15px;
      text-align center;
    }
  }
</style>

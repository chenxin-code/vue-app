<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="订单列表"></nav-top>
    <nav-content>
      <router-link :to="{path: '/historyorderListDetail',query:{id: id, orderTypeName: orderTypeName}}">
        <div class="publicInvoice" v-for="item in list">
          <div>
            <span>开票金额:{{item.amount}}</span>
            <span>订单号:{{item.orderId}}</span>
            <span>下单时间:{{item.transactionTime}}</span>
            <span>订单类型:{{item.orderTypeName}}</span>
          </div>
          <span class="span iconfont mall-gengduojiantou"></span>
        </div>
      </router-link>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from "./api";
  import {Toast} from 'vant'
  export default {
    name: "orderList",
    mixins: [api],
    data() {
      return {
        id: '', //根据id查订单列表
        list: [],
        orderTypeName: '',
        lastPath: ''
      }
    },
    created() {
      this.id = this.$route.query.id
      this.orderTypeName = this.$route.query.orderTypeName
      this.lastPath = this.$route.query.lastPath
    },
    mounted() {
      this.loadData()
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == this.lastPath) {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
    methods: {
      loadData() {
        let that = this
        let params = {
          token: that.$store.state.login.token,
          id: that.id
        }
        that.hisData(params).then(res => {
          if (res.data.result === 'success') {
            that.list = res.data.data
          } else {
            Toast(res.data.info)
          }
        })
      },
    },

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .publicInvoice {
    box-shadow: #f3f3f3 0px 0px 15px;
    width: 95%;
    margin: 0 auto 10px auto;
    overflow: hidden;
    display flex
    justify-content space-between
    div {
      width: 95%;
      margin: 0 auto;
      display: flex;
      padding: 0.266667rem 0.4rem;
      flex-direction: column;
      span {
        /*margin auto*/
        font-size 16px;
        padding 6px 0
      }
    }
    .span {
      margin auto
    }
  }
  /deep/ .nav-content {
    overflow-y auto !important
  }
</style>

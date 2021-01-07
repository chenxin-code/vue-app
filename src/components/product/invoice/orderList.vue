<template>
    <div class="body">
      <nav-top @backEvent="$router.go(-1)" title="订单列表"></nav-top>
      <nav-content>
<!--        <router-link to="{name: 'orderListDetail',params: {id: id}}">-->
          <div class="invoice-contanier">
            <div class="publicInvoice" v-for="item in list" @click="toDetail(item)">
              <div>
                <span>开票金额:{{item.invoiceAmount}}</span>
                <span>订单号:{{item.orderId}}</span>
                <span>下单时间:{{item.transactionTime}}</span>
                <span>订单类型:{{item.orderTypeName}}</span>
              </div>
              <span class="span iconfont mall-gengduojiantou"></span>
            </div>
          </div>
<!--        </router-link>-->
      </nav-content>
      <div v-show="titleView">
        <p class="nullData" v-show="list.length==0">暂无数据</p>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import api from './api'
  import {Toast} from 'vant'
    export default {
      name: "orderList",
      mixins: [api],
      data() {
          return {
           ids: '', //根据id查订单列表
            orderType: '',
            sign: '',
            list: [],
            totalMoney: '',
            lastPath: '',
            titleView: false,
          }
      },
      created() {
        this.lastPath = this.$route.query.lastPath
        this.ids = this.$route.query.ids
        if (this.$route.query.type == 'mallOrder') {
          this.orderType = 2
        } else if (this.$route.query.type == 'appOrder') {
          if (this.$route.query.source == 'janeIndex') {
            this.orderType = 5
          } else {
            this.orderType = 1
          }
        } else if (this.$route.query.type == 'goldOrder') {
          this.orderType = 3
        } else if (this.$route.query.type == 'storeOrder') {
          this.orderType = 4
        }
      },
      beforeRouteLeave(to, from, next) {
        if (to.path == this.lastPath) {
          this.$keepaliveHelper.deleteCache(this)
        }
        next()
      },
      mounted() {
        this.loadData()
      },
      methods: {
        loadData() {
          let that = this
          let params = {
            token: that.$store.state.login.token,
            // ids: that.ids,
            type: that.orderType
          }
          if (that.ids instanceof Array){
            if (that.ids.length){
              params.ids = that.ids.join(',')
            }else {
              params.ids = ''
            }
          }else {
            params.ids = that.ids
          }

          that.mingxiData(params).then(res => {
            if (res.data.result === 'success') {
              this.titleView = true
              that.list = res.data.data || []
            } else {
              Toast(res.data.info)
            }
          })
        },
        toDetail(index) {
          let that = this
          if (this.$route.query.type == 'goldOrder') {
            that.$router.push({
              path: '/historyorderListDetail',
              query: {
                orderId: index.id,
                orderTypeName: index.orderTypeName,
                id: that.$route.query.ids
              }
            })
          } else {
            that.$router.push({
              path: '/orderListDetail',
              query: {
                orderId: index.id,
                orderTypeName: index.orderTypeName,
                source: this.$route.query.source
              }
            })
          }
        },
      },

    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .invoice-contanier{
    height 100%;
    width 100%;
    overflow-y auto
  }
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
  .nullData {
    font-size 20px;
    margin-top 50%;
    text-align center;
  }
</style>

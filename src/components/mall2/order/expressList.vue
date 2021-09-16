/**Created by liaoyingchao on 2018/11/5.*/

<template>
  <van-skeleton :row="3" :row-width :loading="loading">
  </van-skeleton>
  

</template>

<script>


export default {
  name: 'order',
  components: {
  },
  data() {
    return {
      loading:true
    }
  },
  computed: {},
  mounted() {

  },
  methods: {
    toExpressDetailPage(item) {
      //京东快递
      if (item.interfaceType == 2 || item.interfaceType == 1) {
        //请求详情
        this.$Loading.open()
        let url = '/app/json/app_shopping_order/detail'
        let paramsData = {
          token: this.$store.state.login.token,
          orderId: item.id,
          orderType: item.orderType,
          orderCategory: this.orderCategory,
          vipUnitUserCode: this.vipUnitUserCode
        }
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close()
            let data = res.data
            if (data.status == 0) {
              this.$router.push({
                name: 'expressinfo',
                params: {
                  expressinfo: encodeURIComponent(
                    JSON.stringify(data.data.tracksList)
                  )
                }
              })
            } else {
              this.$Toast(data.info)
            }
          },
          error => {
            this.$Loading.close()
            this.$Toast('请求数据失败！')
          }
        )
      } else if (
        // EMS快递
        this.$store.state.globalConfig.enableEMS == 1 &&
        item.interfaceType == 0 &&
        item.expressSendingMode == '1'
      ) {
        this.$router.push({
          path: '/mall2/orderlogistics',
          query: {
            traceNo: item.expressNo
          }
        })
      } else if (
        // 阿里物流
        this.$store.state.globalConfig.order_ali_deliver_enable == '1' &&
        item.interfaceType == '0' &&
        item.deliverType == '2'
      ) {
        this.$router.push({
          path: '/mall2/aliexpressinfo',
          query: {
            orderType: item.orderType,
            orderId: item.id,
            logisticsOrderNo: item.expressNo,
          }
        })
      } else if (this.$store.state.globalConfig.hasApiForExpress100 == 1) {
        // 快递100API版本
        this.$router.push({
          path: '/mall2/100expressinfo',
          query: {
            expressNo: item.expressNo,
            expressName: item.expressName
          }
        })
      } else {
        // 快递100web版本
        let url =
          'https://m.kuaidi100.com/index_all.html?type=' +
          encodeURIComponent(item.expressName) +
          '&postid=' +
          encodeURIComponent(item.expressNo)
        this.$bridgefunc.customPush({
          path: url,
          isnativetop: '1',
          isVuePage: false
        })
      }
    },
  },
  created() {
    
  }
}
</script>

<style lang="stylus" scoped type="text/stylus">

</style>

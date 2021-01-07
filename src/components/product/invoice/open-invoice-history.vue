<template>
  <div>
    <nav-top title="开票历史" @backEvent="$router.go(-1)"></nav-top>
    <nav-content style='padding: 15px 10px'>
      <div class="list" v-for='(item,index) in list' :key='index'>
          <div class="left">
            <h2>{{item.createTime}}</h2>
            <p class="info">
              电子发票：{{item.amount || 0}} 元
            </p>
          </div>
          <div class="right">
            <van-button round type="danger" v-if='item.invoicePdfAddr' size="small" @click='downLoad(item.invoicePdfAddr)'>
              下载发票
            </van-button>
          </div>
        </div> 
    </nav-content>
  </div>
</template>

<script>
  export default {
    created() {
      this.getInfo()
    },
    data() {
      return {
        list: []
      }
    },
    methods:{
      downLoad(params) {
        let that = this
        var u = navigator.userAgent
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
        if (this.$store.state.webtype == 2 && isAndroid) {
            window.location.href = params
        } else {
          that.$bridgefunc.openMobileBrowsers(params)
        }
      },
      getInfo() {
        // 目前没有支持分页，因为这个只为天津服务，目前天津开票数量只有条
        let obj = {
          token: this.$store.state.login.token
        }
        this.$http.post("/app/json/user_invoice_assistant/queryInvoicedList",obj).then(res=>{
          let data = res.data;
          if(data.status == 0) {
            this.list = data.data;
          } else {
            this.$toast(data.info)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
.list{
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
  display: flex;
  justify-content : space-between;
  font-family: PingFangSC-Medium, PingFang SC;
  .right{
    display: flex;
    align-items: center;
  }
  h2{
    color: #333;
    font-size: 14px;
    line-height: 28px;
  }
  .info{
    color: #999999;
    line-height: 28px;
  }
}
</style>
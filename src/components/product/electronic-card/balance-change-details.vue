<template>
  <div>
    <nav-top title="余额变动明细" @backEvent="goback"></nav-top>
    <nav-content style="padding: 20px 10px">
      <div class="content-info">
        <van-list
          v-model="isLoading"
          :finished="finished"
          finished-text="没有更多了"
          :offset="200"
          class="transaction-list"
          @load="loadMore">
          <div class="list" v-for='(item,index) in list' :key='index'>
            <div class="left">
              <h2>{{item.orderTypeName}}</h2>
              <p class="info">
                {{item.tradeTime}}
              </p>
            </div>
            <div class="right">
              <h2>
                -{{item.amountUnit}}
              </h2>
              <p class="info">
                余额：{{item.amountUnit}}
              </p>
            </div>
          </div> 
        </van-list>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    created() {
      this.loadMore()
    },
    data() {
      return {
        isLoading: true,
        finished: false,
        page: 0,
        list:[]
      }
    },
    methods:{
      goback() {
        this.$router.go(-1)
      },
      loadMore() {
        this.isLoading = true
        this.page++
        this.$Loading.open()
        let obj = {"token": this.$store.state.login.token,"acctType":"21","page":{"index":this.page,"pageSize":10}}
        this.$http.post("/app/json/acct/getAccountPaymentList",obj).then(res=>{
          this.isLoading = false
          let data = res.data
          if (data.status == 0) {
            if (data.data instanceof Array) {
              this.list.push(...data.data)
              if (this.list.length >= data.totalRecords) {
                this.finished = true
              }
            } else {
              this.finished = true
            }
          } else {
            this.$Toast(data.info)
            this.finished = true
          }
          this.$Loading.close()
        }).catch(err=>{
          console.error(err)
          this.finished = true
          this.$Loading.close()
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
.content-info{
  height: 100%;
  padding:10px 5px;
  overflow-y: auto;
}
.list{
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
  display: flex;
  justify-content : space-between;
  font-family: PingFangSC-Medium, PingFang SC;
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
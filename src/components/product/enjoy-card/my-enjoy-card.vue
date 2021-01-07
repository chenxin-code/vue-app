<template>
  <div>
    <nav-top title="我的先享卡" @backEvent="goback"></nav-top>
    <nav-content>
      <div class="header">
        <h2>累计为我节省</h2>
        <div>
          <span class='price'>{{totalAmount}}</span>元
        </div>
      </div>
      <h2 class='title'>我的先享卡</h2>
      <div class="content">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          class="search-list"
        >
          <template v-if="list.length">
            <couponCard style='margin-bottom: 8px;' v-for="(item, index) in list" :key="index" :item="item"></couponCard>
          </template>
      </van-list>
      </div>
    </nav-content>
  </div>
</template>

<script>
import couponCard from "./components/coupon-card"
  export default {
    data() {
      return {
        list: [],
        page: 0,
        rows: 10,
        totalAmount: 0,
        loading: false,
        finished: false
      }
    },
    created() {
      this.getCardInfo()
    },
    methods:{
      getCardInfo() {
        this.$http.post("/app/json/wx_discount_card/getTotalDiscount").then(res=>{
          let data = res.data;
          if(data.status == 0) {
            this.totalAmount = data.data || 0;
          } else {
            this.$toast(data.info)
          }
        })
      },
      goback() {
        this.$router.go(-1)
      },
      onLoad() {
        this.$Loading.open();
        this.page ++;
        let paramsData = {
          page: this.page,
          rows: this.rows
        }
        this.$http.post("/app/json/wx_discount_card/getDiscountCardListSelf",paramsData).then(res=>{
           let data = res.data
          if (data.status == 0) {
            const list = data.data || []
            this.list = this.list.concat(list)
            if (this.list.length >= data.totalRecords) {
              this.finished = true
            }
          } else {
            this.finished = true
            this.$Toast(res.info ? res.info : '获取列表失败')
          }
          this.Loading = false
          this.$Loading.close()
        }).catch(err=>{
          this.$Loading.close()
        })
      }
    },
    components:{
      couponCard
    }
  }
</script>

<style lang="stylus" scoped>
.header{
  height: 150px;
  background:url(./images/header-bg.png)no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content:center;
  flex-direction: column;
  align-items:center;
  color: #fff;
  font-family: PingFangSC-Regular, PingFang SC;
  h2{
    margin-bottom: 5px;
    line-height: 24px;
  }
  .price{
    font-size: 24px;
    font-family: PingFangSC-Medium, PingFang SC;
  }
}
.title{
  font-family: PingFangSC-Medium, PingFang SC;
  text-align center;
  font-size: 14px;
  line-height: 30px;
  color: #333333;
  font-weight: 600;
}
.content{
  height: calc(100% - 200px);
  padding: 0 10px;
  overflow-y: auto;
  
}
</style>
<template>
  <div>
    <nav-top title="券包详情" @backEvent="back"></nav-top>
    <nav-content>
      <div class="content">
          <template v-for="(item,index) in couponList">
          <coupon :item="item" :index="index" :key='index'
              class="coupon-item"></coupon>
        </template>
      </div>
    </nav-content>
  </div>
</template>

<script>
import coupon from './base/coupon'
  export default {
    components:{
      coupon
    },
    data() {
      return{
        couponList:[]
      }
    },
    created() {
      this.$Loading.open();
      let obj = {
        couPackage:this.$route.query.couPackage
      }
      this.$http.post("/app/json/coupon/getUnusedCouponsWithCols",obj).then(res=>{
        let data = res.data;
        if(data.status == 0) {
          this.couponList = data.data;
        }
        this.$Loading.close()
      }).catch(err=>{
        this.$Loading.close()
      })
    },
    methods:{
      back() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .content{
    padding: 10px;
    height: calc(100% - 30px);
    overflow-y: auto;
  }
  .coupon-item{
    margin: 10px 0;
  }
</style>
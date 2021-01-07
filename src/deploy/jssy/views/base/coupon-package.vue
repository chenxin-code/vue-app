<template>
  <div class='package' v-if='item.couPackage'>
    <div class="coupon-left">
      <h3>{{item.couPackageName}}</h3>
      <p>共{{item.couCount}}张</p>
    </div>
    <div class='coupon-right' @click='use(item.couPackage)'>
      <span>立即使用</span>
    </div>
  </div>
</template>

<script>
  export default {
    props:{
      item:{
        type: Object,
        default: ()=>{}
      }
    },
    methods:{
      use(couPackage) {
        let url = {
          path: '/coupon_package_detail',
          query:{
            couPackage
          }
        }
        this.$router.push(url)
      }
    }
  }
</script>

<style lang="stylus" scoped>
.package{
  border-radius 4px;
  overflow: hidden
  box-shadow: 0 0 9px rgba(197, 197, 197, 0.3);
  // background-size 100% 100%;
  background-repeat: no-repeat
  background-color: #fff;
  display flex;
  justify-content: space-between;
  padding: 15px;

  .coupon-left{
    padding-left: 10px;
    h3{
      font-size: 14px;
      line-height: 28px;
      color: #333333;
      font-weight: 500;
    }
    p{
      font-size 12px
      line-height: 28px;
      color: #909090;
    }
  }
  .coupon-right{
    display: flex;
    padding: 0 15px;
    border-left: 0.5px solid #DDDDDD;
    justify-content: center;
    align-items: center;
    span{
      color:#F32922
      padding: 7px 8px;
      border-radius: 14px;
      border: 0.5px solid #F32922
    }
  }
}
</style>
<template>
    <div class="body">
      <nav-top @backEvent="$router.go(-1)" title="预约成功"></nav-top>
      <nav-content>
        <div class="div">
          <img src="static/image/microShop/baojia3.png" alt="">
          <p>预约报价成功！</p>
        </div>
          <router-link class="div1 div3" to="/user_center/offerlist">查看我的报价单</router-link>
        <router-link class="div2 div3" to="/user_center/offer_index">返回首页</router-link>
      </nav-content>
    </div>
</template>

<script>
    export default {
        name: "offerSuccess"
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .body {
    background #f6f6f6 !important;
   .div {
     text-align center;
     font-size 16px;
     margin-bottom: 40px;
     font-weight bold
     img {
       width: 60px;
       height: 60px;
       margin: 30px auto 10px auto;
       display: block;
     }
   }
    .div3 {
      display: block;
      width: 70%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: white;
      background: #fe0018;
      margin: 20px auto;
      border-radius: 25px;
      font-size: 16px;
    }
    .div2 {
      background white;
      color #fe0018;
      border 1px solid #fe0018
    }
  }

</style>

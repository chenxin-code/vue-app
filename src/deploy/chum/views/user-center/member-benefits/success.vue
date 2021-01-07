<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="qrroot">
      <div class="headera">
        <img src="../userimgs/success.png" alt="">
        <div class="title">需求提交成功</div>
      </div>
     <div class="content">
        <div class="orderNo">
          <div class="left">订单号：</div>
          <div class="right">{{$route.query.id}}</div>
        </div>
       <div class="orderNo">
         <div class="left">提交时间：</div>
         <div class="right">{{time}}</div>
       </div>
     </div>
      <div class="handle">
        <van-button type="info" native-type="submit" class="sliver" @click="home">
          查看预约订单
        </van-button>
      </div>

    </nav-content>
  </div>
</template>
<script>
    export default {
        name: "",
        components: {},
        data() {
            return {
              item:{},
              time:''
            }
        },
        methods: {
          home(){
            this.$router.push({
                          path: "/benefits/myPackage",
                          query: {
                          }
                        })
          }
        },
      created() {
         this.time=this.$util.getPreTime(new Date())
      }
    }
</script>

<style lang="stylus" scoped>
  .headera{
    height 100px
    margin 0 auto
    img{
      width 40px
      height 40px
      margin 10px auto
      display block
    }
    .title{
      width 60%
      margin 0 auto
      text-align center
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(16,16,16,1);
      line-height:20px;
    }
  }
  .content{
    /*height:105px;*/
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 5px 0px rgba(0,0,0,0.1);
    border-radius:5px;
    margin 0 30px
    padding 15px 10px
  }
  .orderNo{
    display flex
    justify-content space-between
    .left{
      height:20px;
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(16,16,16,1);
      line-height:20px;
    }
    .right{
      height:20px;
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(159,160,160,1);
      line-height:20px;
    }

  }
  .sliver {
    height: 49px;
    width 80%;
    border-radius 24px
    margin 0 auto
    margin-top 50px
    display block
    border none
    background: linear-gradient(270deg, rgba(49, 49, 49, 1) 0%, rgba(84, 84, 84, 1) 51%, rgba(49, 49, 49, 1) 100%);

    .van-button__text {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #C9A063;
      line-height: 25px;
    }
  }

</style>

<template>
  <div>
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="content">
        <div class='pic' style='width: 100%;text-align:center;'> 
          <img class='success-icon' src="./images/success.png" alt="">
          <p>权益使用成功~</p>
        </div>
        <van-button v-if='infoData.equityType == 51008' round type="info" block style='width: 50%;' color='#F02C2D' @click='callPhone(infoData.servicePhone)'>立即拨号</van-button>
        <van-button v-else-if='infoData.equityType == 51009'  round type="info" block style='width: 50%;' color='#F02C2D' @click='backEvent'>返回首页</van-button>
        <div class='phone' v-if='infoData.equityType == 51008'>
          客服电话：{{infoData.servicePhone}}
        </div>
      </div>
      <div class="des" v-html='infoData.equityDes'></div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        infoData:{}
      }
    },
    methods:{
      callPhone(phone) {
        if(!phone) {
          this.$toast('未获取到联系方式'); 
          return
        }
        
        window.location.href = 'tel:'+phone
      },
      backEvent() {
        this.$router.replace('/service_list')
      }
    },
    
    created(){
      this.infoData = JSON.parse(window.localStorage.getItem("eqItem")) || {}
    }
  } 
</script>

<style lang="stylus" scoped>
.content{
  padding-top: 30px;
  display: flex;
  height: 40%;
  flex-direction column
  align-items center
  justify-content space-around
  color #333333
  .success-icon{
    width: 18%;
  }
}
.pic{
  line-height: 30px;
  p{
    font-size 16px
    
  }
}
.phone{
  font-size: 15px;
  padding-left: 24px;
  position relative
  &::before{
    content:"";
    position absolute
    left 0
    top -2px;
    width 18px
    height 18px
    background: url(./images/phone.png)no-repeat;
    background-size: 100% 100%;
  }
}
.des{
  padding: 0 2%;
}
</style>
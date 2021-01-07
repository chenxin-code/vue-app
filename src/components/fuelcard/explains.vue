<template>
<div id="oilMoney">
<!-- 头部 -->
<mt-header title="油卡积分加油说明">
    <mt-button icon="back"  slot="left" @click="backEvent"></mt-button>
</mt-header>
  <div class="conter">
    <!-- <div class="what">
        <h2>什么是油币？</h2>
        <p>指参加各种加油优惠活动所获得的，可以直接用于加油卡内的积分余额。</p>
    </div> -->
    <div class="what" style="margin-top: 20px;">
      <h2>如何使用油卡积分加油？</h2>
      <p>您需将加油卡插入加油机读卡槽并告知需用油卡积分加油，营业员在键盘上选择加油模式，再提枪加油即可，加油时将减扣卡内积分账户余额。</p>
    </div>
  </div>
</div>
</template>
<script>
export default {
  data (){
    return{
    }
  },
  created (){
  },
  methods:{
    backEvent: function () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.mint-header {
    margin-top: 0.693333rem;
}
.mint-header{
  background: #fff;
  color: #000;
  height: 60px;
  font-size: 20px;
}
.mintui-back{
  font-size: 28px;
}
#oilMoney{
  /* overflow: visible; */
  width: 100%;
  height: 100%;
  overflow: auto;
}
/* .navcontent{
  line-height: 24px!important;
} */
.conter{
  padding: 10px 10px;
}
.what{
  box-shadow: 0 2.5px 5px #eee;
  padding: 10px
}
.what h2{
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}
.what p{
  line-height: 30px;
  color: #666;
}
</style>
<style>
#oilMoney .mint-header {
    margin-top: 0.693333rem;
}
#oilMoney .mint-header{
  background: #fff;
  color: #000;
  height: 60px;
  font-size: 20px;
}
#oilMoney .mintui-back{
  font-size: 28px;
}
#oilMoney .mint-header-title{
  overflow:	visible;
}
</style>

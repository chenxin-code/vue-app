<template>
  <!-- 支付成功列表页 -->
  <div id="page-paySuccess">
    <div>
      <div class="pay-status-v">
        <img src="./paysuccess-icon.png" alt="" />
        <span>恭喜您，支付成功！</span>
      </div>
      <div class="recommond-txt-v">
        <div class="v-v">商品推荐</div>
      </div>
    </div>
    <div class="recommond-list-v">
        <recommondPanel v-for="(item,index) in 8" :key="index" class="lux"></recommondPanel>
    </div>
  </div>
</template>
<script>
import recommondPanel from "@/components/bulk/components/recommondPanel"
export default {
  name: 'paySuccess',
  components:{
      recommondPanel
  }
}
</script>
<style>
#page-paySuccess {
  width: 100%;
  height: 100vh;
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
}
.pay-status-v {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
}
.pay-status-v img {
  width: 50%;
}
.pay-status-v span {
  font-weight: 500;
  color: #666666;
  line-height: 40px;
  font-size: 20px;
  margin-top: 10px;
}

.recommond-txt-v {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-v {
  width: 48%;
  height: 18px;
  background: url('./recommond-icon.png');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 900;
  color: #333333;
  font-size: 18px;
  margin-top: 30px;
  letter-spacing: 3px;
}
.recommond-list-v {
    flex:1;
    height: 0;
    flex-shrink: 0;
    margin-top:25px;
    padding:0 10px;
    box-sizing: border-box;
    overflow: auto;
    padding-bottom:40px;
}

.lux:nth-last-child(1)::after{
  background: none !important;
}
.lux:nth-last-child(1){
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.lux:first-child{
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>
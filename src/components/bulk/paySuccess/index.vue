<template>
  <!-- 支付成功列表页 -->
  <div class="pay_success">
    <navbar :title="'确认订单'"></navbar>
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
        <recommondPanel
          v-for="(item, index) in 8"
          :key="index"
          class="lux"
        ></recommondPanel>
      </div>
    </div>
  </div>
</template>
<script>
import recommondPanel from "@/components/bulk/components/recommondPanel";
import navbar from "@/components/bulk/components/navbar";
export default {
  name: "paySuccess",
  components: {
    recommondPanel,
    navbar,
  },
  created() {
    this.recommend();
  },
  methods:{
    recommend(){
      let url = `/app/json/group_buying_home/findGroupBuyingBySearchHotWords`;
      this.$http.post(url,{
       
      }).then(res => {
        console.log("response",res.data);
      }).catch(e=>{
        console.log(e);
      })
    },
    
  }
};
</script>
<style scoped>
.router_class {
  background-color: #f6f6f6 !important;
}
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
  width: 169px;
  height: 184.5px;
  margin: 0 auto;
}
.pay-status-v span {
  margin-top: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  line-height: 20px;
}

.recommond-txt-v {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-v {
  width: 175px;
  height: 12px;
  background: url("./recommond-icon.png");
  background-size: 175px 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  line-height: 20px;
  margin-top: 30px;
}
.recommond-list-v {
  flex: 1;
  height: 0;
  flex-shrink: 0;
  margin-top: 25px;
  padding: 0 10px;
  box-sizing: border-box;
  overflow: auto;
  padding-bottom: 40px;
}

.lux:nth-last-child(1)::after {
  background: none !important;
}
.lux:nth-last-child(1) {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.lux:first-child {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>
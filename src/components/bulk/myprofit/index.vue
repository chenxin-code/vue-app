<template>
  <!-- 我的收益页面 -->
  <div id="page-myprofit">
    <div class="myprofit-header">
      <div class="lur-header">
        <dl class="profit-box-x">
          <dd class="profit-advantor-x">
            <img
              src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=843941027,2522415533&fm=26&gp=0.jpg"
              alt=""
            />
          </dd>
          <dt class="profit-msg-x">
            <div class="profit-name-x">张三</div>
            <div class="profit-jointime-x">加入时间：2020/10/10-2021/10/10</div>
          </dt>
        </dl>
      </div>
      <div class="profit-sub-x">
        <div class="profit-sub-x-bg"></div>
        <div class="total-profit">
          <div class="total-profit-top">
            <span>总收益</span>
            <img src="./see-icon.png" alt="" />
          </div>
          <div class="total-profit-bot">
            <span>¥</span>
            <i>1000</i>
          </div>
        </div>
        <div class="wait-profit">
          <div class="total-profit-top">
            <span>待结算收益</span>
          </div>
          <div class="total-profit-bot">
            <span>¥</span>
            <i>1000</i>
          </div>
        </div>
      </div>
    </div>
    <div class="myprofit-section">
      <div class="profit-scroll">
        <div class="profit-scroll-title">结算日期与金额</div>
        <div class="profit-scroll-auto">
          <div
            class="profit-amount-item"
            v-for="(item, index) in 20"
            :key="index"
          >
            <span>2020/10/10 20:00:00</span>
            <em>¥30:00</em>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "myprofit",
  components: {},
  data() {
    return {};
  },
  created() {
    this.$http.post("/app/json/app_my_earnings/getMyEarnings").then((res) => {
      console.log(res);
    });
  },
  methods: {},
};
</script>
<style scoped>
#page-myprofit {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #bf3846;
  padding-bottom: 49px;
}
.myprofit-header {
  height: 200px;
  width: 100%;
  background: url("./profit-bg-icon.png");
  background-size: 100% 100%;
  padding-bottom: 50px;
  box-sizing: border-box;
  background-clip: content-box;
  position: relative;
}
.myprofit-header .lur-header {
  width: 100%;
  height: 180px;
  background-clip: border-box;
  display: flex;
  flex-direction: column;
  padding-bottom: 35px;
  background-clip: content-box;
}
.profit-box-x {
  display: flex;
  height: 40px;
  align-items: center;
  flex: 1;
  padding: 0 10px;
  box-sizing: border-box;
  padding-bottom: 20px;
}
.profit-box-x .profit-advantor-x {
  width: 52.5px;
  height: 52.5px;
}
.profit-box-x .profit-advantor-x img {
  width: 52.5px;
  height: 52.5px;
  border-radius: 50%;
  box-sizing: border-box;
  margin-left: 10px;
}
.profit-box-x .profit-msg-x {
  margin-left: 30px;
}
.profit-box-x .profit-name-x,
.profit-jointime-x {
  font-size: 13px;
  font-weight: 400;
  color: #ffffff;
  line-height: 18.5px;
}

.myprofit-section {
  flex: 1;
  height: 0;
  overflow: auto;
  background: #bd3342;
}
.profit-sub-x {
  bottom: 0;
  left: 0;
  width: 100%;
  /* height: 100px; */
  background: #bf3846;
  position: absolute;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  z-index: 1;
}
.profit-sub-x-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to bottom, #fff, #d76775, #c03a48);
  opacity: 0.4;
  z-index: -1;
}
.total-profit,
.wait-profit {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  color: #fff;
  align-items: flex-start;
  justify-content: flex-start;
  width: 50%;
  padding: 12px 20px;
}
.wait-profit {
  align-items: flex-end;
}
.total-profit-top img {
  width: 12px;
  height: 7.5px;
  margin-left: 5px;
}
.total-profit-bot span {
  font-size: 12.5px;
  font-weight: 600;
  color: #ffffff;
  line-height: 18px;
  letter-spacing: 1px;
  position: relative;
  top: -10px;
}
.total-profit-bot {
  margin-top: 11px;
}
.total-profit-bot i {
  font-size: 19px;
  font-weight: 600;
  color: #ffffff;
  line-height: 26.5px;
  letter-spacing: 1.5px;
  margin-left: 5px;
}
.total-profit-top span {
  color: #ffffff;
  letter-spacing: 2px;
  font-weight: 100;
}

.profit-scroll {
  width: 100%;
  height: 100%;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
}
.profit-scroll-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  line-height: 50px;
  padding: 10px 20px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 600;
  color: #424242;
  line-height: 20px;
  letter-spacing: 2px;
}
.profit-scroll-auto {
  flex: 1;
  background: #f6f6f6;
  height: 0;
  overflow: auto;
}
.profit-amount-item {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  color: #999999;
  line-height: 40px;
  font-weight: 100;
}
.profit-amount-item span,
em {
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  letter-spacing: 1px;
  margin-bottom: 20px;
}
</style>

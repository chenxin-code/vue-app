<template>
  <div class="component-goodPanel">
    <div class="goodPanel-remain">
      <div class="remain_title">拼团结束时间剩余</div>
      <div class="remain-times">
        <van-count-down :time="time">
          <template #default="timeData">
            <span class="block">{{ timeData.hours }}</span>
            <span class="colon">:</span>
            <span class="block">{{ timeData.minutes }}</span>
            <span class="colon">:</span>
            <span class="block">{{ timeData.seconds }}</span>
          </template>
        </van-count-down>
      </div>
    </div>
    <dl class="good-ms">
      <dd>
        <img
          src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1429175118,2649084526&fm=111&gp=0.jpg"
          alt=""
        />
      </dd>
      <dt>
        <div class="good-name">新鲜的大西瓜</div>
        <div class="price-x">
          <div class="sale-price line-through">
            <span>销售价格&nbsp;:</span><em>&nbsp;&nbsp;¥5.00</em>
          </div>
          <div class="purchase-price">
            <span>团购价格&nbsp;:</span><em>&nbsp;&nbsp;¥5.00</em>
          </div>
        </div>
      </dt>
    </dl>
    <div class="remain-num-x">已抢2000件/剩余50件</div>
    <div class="use-buy-x">
      <div class="advantor-x">
        <img
          v-for="(item, index) in 3"
          :key="index"
          src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1429175118,2649084526&fm=111&gp=0.jpg"
          alt=""
        />
      </div>
      <span>等购买了此商品</span>
    </div>
    <button class="buy-button-x">立即购买</button>
    <div class="line"></div>
  </div>
</template>
<script>
export default {
  name: "goodPanel",
  data() {
    return {
      time: 2123123,
    };
  },
};
</script>
<style scoped>
.line-though {
  text-decoration: line-through;
}
.line {
  width: 334.5px;
  height: 1px;
  background-color: #eeeded;
  margin: 9.5px auto 0;
}
.component-goodPanel {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  background: #fff;
  position: relative;
}

.goodPanel-remain {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;
}
.goodPanel-remain .remain_title {
  font-size: 13px;
  font-weight: 400;
  color: #d0021b;
  line-height: 18.5px;
  letter-spacing: 1px;
}
.remain-times {
  margin-left: 10.5px;
}

.colon {
  display: inline-block;
  margin: 0 4px;
  color: #ee0a24;
}
.block {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 17px;
  background: #d0021b;
  border-radius: 3.5px;
  font-size: 11px;
  font-weight: 400;
  color: #ffffff;
  line-height: 15px;
  letter-spacing: 1px;
}

.good-ms {
  display: flex;
  padding: 0 10px;
  box-sizing: border-box;
}
.good-ms dd {
  width: 85px;
  height: 85px;
}
.good-ms dd img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}
.good-ms dt {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.good-ms dt .good-name {
  font-size: 14px;
  font-weight: 400;
  color: #424242;
  line-height: 20px;
  letter-spacing: 1px;
}
.good-ms dt .price-x {
  margin-top: 24.5px;
}
.good-ms dt .price-x .sale-price {
  text-decoration: line-through;
  font-size: 13px;
  font-weight: 400;
  color: #666666;
  line-height: 18.5px;
  letter-spacing: 1px;
}
em,
i {
  font-style: normal;
}
.good-ms dt .price-x .purchase-price {
  font-size: 14px;
  font-weight: 600;
  color: #424242;
  line-height: 20px;
  letter-spacing: 1px;
  margin-top: 4px;
}
.remain-num-x {
  margin-top: 10px;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 11px;
  font-weight: 400;
  color: #999999;
  line-height: 15px;
  letter-spacing: 1px;
}
.use-buy-x {
  box-sizing: border-box;
  padding: 0 10px;
  color: #999999;
  font-size: 12px;
  display: flex;
  align-items: center;
  line-height: 50px;
  margin-top: 7.5px;
}
.advantor-x {
  display: flex;
}
.use-buy-x span {
  margin-left: 5px;
  font-size: 11px;
  font-weight: 400;
  color: #999999;
  line-height: 15px;
}
.advantor-x img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
}
.advantor-x img:not(:nth-of-type(1)) {
  margin-left: 5px;
}
.buy-button-x {
  position: absolute;
  right: 10px;
  bottom: 20px;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 86px;
  height: 27.5px;
  background: #b52232;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 400;
  color: #ffffff;
  line-height: 18.5px;
  letter-spacing: 1px;
}
</style>
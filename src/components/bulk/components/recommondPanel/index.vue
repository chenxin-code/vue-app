<template>
  <div class="component-recommondPanel">
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
  </div>
</template>
<script>
export default {
  name: "recommondPanel",
  data() {
    return {};
  },
};
</script>
<style scoped>
.component-recommondPanel {
  width: 100%;
  height: auto;
  position: relative;
  background: #fff;
  padding-top: 10px;
  box-sizing: border-box;
}
.component-recommondPanel::after {
  content: "";
  width: 94%;
  height: 1px;
  position: relative;
  left: 3%;
  bottom: 0px;
  display: inline-block;
  background: #eeeded;
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
  margin-top: 5px;
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
  font-weight: 400;
  color: #666666;
  letter-spacing: 1px;
  text-decoration: line-through;
  font-size: 13px;
  line-height: 18.5px;
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
  font-size: 11px;
  font-weight: 400;
  color: #999999;
  line-height: 15px;
  letter-spacing: 2px;
  margin-top: 10px;
  padding: 0 10px;
  box-sizing: border-box;
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
  margin-left: 4px;
}
.buy-button-x {
  width: 86px;
  height: 27.5px;
  background: #b52232;
  border-radius: 14px;
  position: absolute;
  right: 10px;
  bottom: 30px;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 400;
  color: #ffffff;
  line-height: 18.5px;
  letter-spacing: 1px;
}
</style>
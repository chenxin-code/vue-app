<template>
  <!-- 收获地址页 -->
  <div id="page-deliveryAddress">
    <div class="deliveryAddress-io-v">
      <input type="text" placeholder="当前商品可选提货地点" />
    </div>
    <div class="deliveryAddress-list-v">
      <dl class="deliveryAddress-item-v" v-for="(item,index) in 8" :key="index">
        <dd>
          <img
            src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1571244479,180767781&fm=26&gp=0.jpg"
            alt=""
          />
        </dd>
        <dt>
          <div class="user-name-v">张三</div>
          <div class="user-place-v">提货地点：北京市西城区五福玲珑局小区物业管理处</div>
        </dt>
        <img src="./arrow.png" alt="" class="arrow-viki">
      </dl>
    </div>
  </div>
</template>
<script>
export default {
  name: 'deliveryAddress'
}
</script>
<style>
#page-deliveryAddress {
  width: 100%;
  height: 100vh;
  background: #f6f6f6;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.deliveryAddress-list-v{
    flex:1;
    height: 0;
    overflow: auto;
    padding-bottom:20px;
    box-sizing: border-box;
}
.deliveryAddress-io-v {
  width: 100%;
  height: auto;
  margin-top: 20px;
}
.deliveryAddress-io-v input {
  width: 100%;
  height: 35px;
  box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
  border-radius: 17px;
  background: #fff;
  border: none;
  outline: none;
  padding-left: 20px;
  box-sizing: border-box;
}
.deliveryAddress-io-v input::-webkit-input-placeholder {
  color: #999;
  font-size: 14px;
  letter-spacing: 3px;
}
.deliveryAddress-item-v {
  display: flex;
  padding: 10px;
  box-sizing: border-box;
  background: #fff;
  margin-top: 20px;
  border-radius: 10px;
  height: 120px;
  display: flex;
  align-items: center;
  position: relative;
}
.deliveryAddress-item-v dd {
  width: 60px;
  height: 60px;
}
.deliveryAddress-item-v dd img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.deliveryAddress-item-v dt {
  margin-left: 12px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 0px;
  box-sizing: border-box;
}
.deliveryAddress-item-v dt .user-name-v,
.user-place-v {
  width: 80%;
  font-weight: 300;
  color: #666666;
  letter-spacing: 1px;
  font-size:16px;
}
.arrow-viki{
    position: absolute;
    right:15px;
    top:50%;
    margin-top:-10px;
    width:10px;
}
</style>
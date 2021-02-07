<template>
  <!-- 我的收益页面 -->
  <div id="page-myprofit">
    <div class="myprofit-header">
      <div class="lur-header">
        <channelSearch></channelSearch>
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
                <div class="profit-amount-item" v-for="(item,index) in 20" :key="index">
                    <span>2020/10/10 20:00:00</span>
                    <em>¥30:00</em>
                </div>
            </div>
        </div>
    </div>
    <div class="myprofit-footer">
      <switchMenu></switchMenu>
    </div>
  </div>
</template>
<script>
import channelSearch from '@/components/bulk/components/channelSearch'
import switchMenu from '@/components/bulk/components/switchMenu'
export default {
  name: 'myprofit',
  components: {
    channelSearch,
    switchMenu
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style>
#page-myprofit {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #bf3846;
}
.myprofit-header {
  height: auto;
  width: 100%;
  background: url('./profit-bg-icon.png');
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
  padding-bottom:20px;
}
.profit-box-x .profit-advantor-x {
  width: 70px;
  height: 70px;
}
.profit-box-x .profit-advantor-x img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  box-sizing: border-box;
  margin-left:10px;
}
.profit-box-x .profit-msg-x {
  margin-left: 30px;
}
.profit-box-x .profit-name-x,
.profit-jointime-x {
  font-weight: 300;
  color: #ffffff;
  line-height: 37px;
  font-size: 16px;
}

.myprofit-section {
  flex: 1;
  height: 0;
  overflow: auto;
  background:#BD3342;
}
.profit-sub-x {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: #bf3846;
  position: absolute;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  z-index:1;
}
.profit-sub-x-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to bottom, #fff,#D76775, #c03a48);
  opacity: 0.4;
  z-index:-1;
}
.total-profit,.wait-profit{
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  color:#fff;
  align-items: flex-start;
  justify-content: space-between;
  width:50%;
  padding: 15px 20px;
}
.wait-profit{
     align-items: flex-end;
}
.total-profit-top img{
    width:20px;
}
.total-profit-bot span{
    position: relative;
    top:-10px;
    font-weight: 200;
}
.total-profit-bot i{
    font-size:22px;
    font-weight: 700;
    margin-left:8px;
}
.total-profit-top span{
    color: #FFFFFF;
    letter-spacing: 2px;
    font-weight: 100;
}

.profit-scroll{
    width:100%;
    height:100% ;
    border-top-left-radius:25px;
    border-top-right-radius:25px;
    background:#f6f6f6;
    display: flex;
    flex-direction: column;
}
.profit-scroll-title{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 50px;
    padding:0 20px;
    box-sizing: border-box;
    font-weight: 600;
    color: #424242;
    letter-spacing: 2px;
    font-size: 18px;
}
.profit-scroll-auto{
   flex:1;
   background:#f6f6f6;
   height: 0;
   overflow: auto;
}
.profit-amount-item{
    display: flex;
    justify-content: space-between;
    padding:0 20px;
    box-sizing: border-box;
    color: #999999;
    line-height: 40px;
    font-weight: 100;
}
.profit-amount-item span,em{
    font-size:18px;
    font-weight: 100;
    letter-spacing: 2px;
}
</style>

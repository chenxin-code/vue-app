<template>
  <div class='info'>
    <h3>加油时间：{{item.refuelTakeDate}}</h3>
    <p><span>油站名称：</span>{{item.storeName}}</p>
    <p><span>油品名称：</span>{{item.refuelOilName}}</p>
    <p><span>加油金额：</span>{{item.realAmount}}</p>
    <p><span>支付渠道：</span>{{item.payModeStr}}</p>
  </div>
</template>

<script>
  export default {
    props:{
      item:{
        type: Object,
        default:()=>{
          return {}
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
.info{
  padding: 10px;
  border-radius: 4px;
  background: url(../images/pay.png) no-repeat right top;
  background-color:#fff;
  box-shadow: 0px 0px 3px rgba(0,0,0,0.2)
  background-size: auto 40%;
  h3{
    font-size: 13px;
    font-weight 600;
    margin-bottom: 10px;
  }
  p{
    line-height: 22px;
    span{
      color: #888;
    }
  }
}
</style>
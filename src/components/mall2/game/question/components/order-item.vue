<template>
    <div>
      <div class="item">
        <div class="name">
          <div class="time-con">{{item.ouName}}</div>
          <div class="time-con">{{item.state==1||item.state==0?'待评价':'已评价'}}</div>
        </div>
        <div class="name">
          <div class="time-con">加油时间：</div>
          <div class="time-con">{{item.createTime}}</div>
        </div>
        <div class="name">
          <div class="time-con">加油金额：</div>
          <div class="time-con">{{item.refuelAmount}}</div>
        </div>
        <div class="time"></div>
        <div class="handler">
          <van-button round type="info" plain color="#F02C2D" size="small" class="btn" @click="goEvaluate(item)">{{(item.state==1||item.state==0)?'去评价':'查看评价'}}</van-button>
        </div>
      </div>
    </div>
</template>
<script>
    export default {
      props:['item'],
        name: "",
        components: {},
        data() {
            return {}
        },
        methods: {
          goEvaluate(item){
            // if(item.state==0||item.state==1){
              this.$router.push({
                path:'/evaluateDetail',
                query:{
                  id:item.configId,
                  orderId:item.orderId,
                  refuelOrderId:item.refuelOrderId,
                  //0 评价 1查看
                  viewFlag:item.state==0||item.state==1?0:1
                }
              })
            // }
          }
        }
    }
</script>

<style lang="stylus" scoped>
.item{
  padding 10px
  margin 10px 10px
  /*width: 355px;*/
  /*height: 140px;*/
  background: #FFFFFF;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.1);
  border-radius: 6px;
}
  .name{
    display flex
    justify-content space-between
    align-items center
    margin-top 5px
  }
  .time-con{
    /*width: 56px;*/
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
  }
.handler{
  display flex
  justify-content flex-end
  padding 5px 10px
}
  .btn{
    /*margin-right 20px*/
  }
  .time{
    margin 5px 0px
    height: 1px;
    background #dddddd

  }

</style>

<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="qrroot">
      <div class="list-con">
        <div  class="card">
          <div class="left">
            <div class="title">{{changeStatus(item.serviceType)}}</div>
<!--            <div class="title">{{item.equityTypeName}}</div>-->
            <div class="range" v-if="item.useState==2">保障期限：{{changeTime(item)}}</div>
            <div class="company" v-if="item.useState==2">由{{item.insureCompany}}承保</div>
          </div>
          <div class="right" v-if="changeDate1(item)">
            <div class="date" ><span class="num">{{changeDate(item)}}</span>天</div>
            <div class="bottom">已保障</div>
          </div>
          <div class="right" v-else-if="!changeDate1(item)">
            <div class="insuStatus">未生效</div>
          </div>
        </div>
        <div class="detail">
          <div class="title">基本信息</div>
          <div class="con">
            <div class="item">
              <div class="left">被保人</div>
              <div class="right">{{item.memberName}}</div>
            </div>
            <div class="item">
              <div class="left">身份证号</div>
              <div class="right">{{item.idCard}}</div>
            </div>
            <div class="item">
              <div class="left">手机号码</div>
              <div class="right">{{item.memberPhone}}</div>
            </div>
<!--            <div class="item">-->
<!--              <div class="left">保障期限</div>-->
<!--              <div class="right">{{changeTime(item)}}</div>-->
<!--            </div>-->
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
    export default {
        name: "insuraanceDetail",
        components: {},
        data() {
            return {
              item:{}
            }
        },
        methods: {
          changeStatus(status){
            let obj=['航班延误险','行李延误险','行李遗失险']
            return obj[status]
          },
          changeDate(item){
            let  useBeginTime= item.useBeginTime.replace(/-/g,"/")
            if(item.useState==2&&useBeginTime){
              return parseInt((new Date()-new Date(useBeginTime))/(60*60*1000*24))
            }else{
              console.log(123)
              return " "
            }

          },
          changeDate1(item){
            // item.useBeginTime="2020-05-22 00:00:00"
            let  useBeginTime= item.useBeginTime.replace(/-/g,"/")
            // item.useBeginTime.replace(/-/g,"/")
            let useEndTime=item.useEndTime.replace(/-/g,"/")
            console.log(useBeginTime)
            let date=new Date()-new Date(useBeginTime)
            if(date>0){
              if(new Date()-new Date(useEndTime)>0){
                // 当前时间大于结束时间，已过期
                return 1
              }else{
                // 当前时间小于结束时间，大于生效时间 保障中
                return 2
              }
            }else{
              // 当前时间小于开始时间 未生效
              return 0
            }


          },
          changeTime(item){
            if(item.useBeginTime){
              return `${item.useBeginTime.split(' ')[0]}至${item.useEndTime.split(' ')[0]}`
            }else{
              return " "
            }
          },
        },
      created() {
         this.item=JSON.parse(this.$route.query.item)
      }
    }
</script>

<style lang="stylus" scoped>
  .card{
    margin 10px 20px
    padding 10px 13px
    display flex
    justify-content space-between
    align-items center
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 5px 0px rgba(0,0,0,0.1);
    border-radius:5px;
  .title{
    font-size:16px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(16,16,16,1);
    line-height:23px;
  }
  .range{
    font-size:13px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(159,160,160,1);
    line-height:19px;
  }
    .company{
      font-size:13px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(159,160,160,1);
      line-height:19px;
    }
  .right{
    font-size:11px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(159,160,160,1);
    line-height:15px;
  .num{
    font-size:15px;
    font-family:Arial-BoldMT,Arial;
    font-weight:normal;
    color:rgba(16,16,16,1);
    line-height:17px;
  }
  }
  }
  .detail{
    margin 10px 20px
    padding 10px 13px
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 5px 0px rgba(0,0,0,0.1);
    border-radius:5px;
    .title{
      font-size:16px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(16,16,16,1);
      line-height:23px;
    }
    .item{
      font-size:13px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(16,16,16,1);
      line-height:19px;
      display flex
      justify-content space-between
      align-items center
      margin 3px 0
    }
  }
  .insuStatus{
    height:20px;
    font-size:14px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(16,16,16,1);
    line-height:20px;
  }
</style>

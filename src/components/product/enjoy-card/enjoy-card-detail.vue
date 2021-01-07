<template>
  <div>
    <nav-top title="先享卡详情" @backEvent="goback"></nav-top>
    <nav-content>
      <div class="header">
        <div class="icon" :class="{ icon2: iconType == 2,icon3: iconType == 3}"></div>
        
        <div class="info">
          {{stateText()}}
        </div>
        <h2>{{timeInfo}}</h2>
      </div>
      <div class="state-warp">
        <h2>约定内容</h2>
        <div class="card top">
          <div class="detail">
            <div class="time">
              {{dataInfo.actEffEndTime}}前
            </div>
            <h3>
              {{dataInfo.totalObjective}}
            </h3>
            <div class="info" v-if='dataInfo.remark'>
              {{dataInfo.remark}}
            </div>
            <div class="state">
              <span v-if='stateInfo' class='btn'>{{stateInfo}}</span>
              <span>已完成{{dataInfo.completeCnt || 0}}次，待完成{{unDone(dataInfo.objectiveCnt,dataInfo.completeCnt)}}次</span>
            </div>
            <van-progress :percentage="range(dataInfo.objectiveCnt,dataInfo.completeCnt)" color='#F02C2D' :show-pivot='false' />
          </div>
          <van-notice-bar
            scrollable 
            text="若未完成约定，仅扣回已享优惠不吃亏"
          />
          <!-- <p class="tip">
            若未完成约定，仅扣回已享优惠不吃亏
          </p> -->
        </div>
        <h2 v-if="recordList.length">先享卡享受优惠记录</h2>
        <div class="card bottom" v-if="recordList.length">
          <div class="record" v-for='(item,index) in recordList' :key='index'>
            <div class="r-time">
              {{item.tradeTime}}
            </div>
            <div v-if="item.type == 2">
              领取先享卡成功
            </div>
            <div v-else-if="item.type == 3">
              {{item.info}}
            </div>
            <div v-else class="r-info">
              使用奖励优惠1次，已享优惠{{item.discountAmount}} 元
            </div>

          </div>
        </div>
      </div>
      
    </nav-content>
  </div>
</template>

<script>
import NavContent from '../../commonui/nav-content/nav-content.vue'
  export default {
    data() {
      return {
        dataInfo:{},
        timeInfo:"",
        stateInfo: "",
        iconType: 1, //顶部显示图标
        recordList: [
          
        ]
      }
    },
    created() {
        this.$Loading.open()
        let obj = {
          id: this.$route.query.id
        }
        this.$http.post("/app/json/wx_discount_card/loadDiscountCardDetail",obj).then(res=>{
          this.$Loading.close()
          let data = res.data;
          if(data.status == 0) {
            this.dataInfo = data.data;
            this.recordList = this.dataInfo.detail || []
            if(this.dataInfo.getTime) {
              this.recordList.unshift({
                tradeTime: this.dataInfo.getTime,
                type: 3,
                info: this.stateText()
              })
              this.recordList.push({
                tradeTime: this.dataInfo.getTime,
                type: 2
              })
              console.log(this.recordList,'record')
            }
          } else {
            this.$toast(data.info)
          }
        }).catch((err)=>{
          this.$Loading.close()
        })
    },
    methods:{
      goback() {
        this.$router.go(-1)
      },
      stateText() {
        if(this.dataInfo.state == "APPLY") {
          this.stateInfo = "先享卡申请中"
          return this.stateInfo;
        } else if(this.dataInfo.state == "ONGOING") {
          this.timeInfo = `履约截止时间：${this.dataInfo.actEffEndTime}`
          this.stateInfo = '约定进行中'
          return `${this.stateInfo}，已享优惠${this.dataInfo.discountAmount || 0}元`
        } else if(this.dataInfo.state == 'CHECKING') {
          this.stateInfo = '约定到期核对中'
          return stateInfo;
        } else if(this.dataInfo.state == 'FINISHED') {
          this.iconType = 2;
          this.timeInfo = `${this.dataInfo.finishedTime}已完成约定`
          this.stateInfo = '已完成约定';
          return `${this.stateInfo}，已享优惠${this.dataInfo.discountAmount || 0}元`
        } else if(this.dataInfo.state == 'UNFINISHED') {
          this.iconType = 3;
          if(this.dataInfo.payState == 'PAYING') {
            this.timeInfo = `${this.dataInfo.finishedTime}履约时间结束`
            this.stateInfo = '未完成约定';
            return `${this.stateInfo}，奖励退还中`

          } else if(this.dataInfo.payState == 'PAID') {
            if(this.dataInfo.unfinishedReason == 'DUE_TO_QUIT') {
              this.timeInfo = `${this.dataInfo.finishedTime}履约时间结束`
            } else if(this.dataInfo.unfinishedReason == 'EARLY_QUIT') {
              this.timeInfo = `${this.dataInfo.finishedTime}提前退出约定`
            }
            this.stateInfo = '未完成约定';
            return `${this.stateInfo}，已退款${this.dataInfo.discountAmount || 0}元`
          }
        }
      },
      unDone(un = 0,done = 0) {
        let unNum = un || 0;
        let doneNum = done || 0;
        return unNum - doneNum;
      },
      range(un = 0,done = 0) {
        let unNum = un || 0;
        let doneNum = done || 0;
        if(!unNum && !doneNum) {
          return 100;
        }
        let result = parseInt(doneNum / un * 100);
        return result
      }
    }
  }
</script>

<style lang="stylus" scoped>
.header{
  height: 150px;
  background:url(./images/header-bg.png)no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content:center;
  flex-direction: column;
  align-items:center;
  color: #fff;
  font-family: PingFangSC-Regular, PingFang SC;
  .icon{
    width: 25px;
    height: 25px;
    background: url(./images/lock.png) no-repeat;
    background-size: 100% 100%;
    margin-bottom: 10px
  }
  .icon2{
    background-image: url('./images/success.png')
  }
  .icon3{
    background-image: url('./images/sprite.png')
  }
  h2{
    margin-top: 5px;
    line-height: 30px;
  }
  .info{
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
  }
  .price{
    font-size: 24px;
    font-family: PingFangSC-Medium, PingFang SC;
  }
}
.state-warp{
  height: calc(100% - 170px);
  font-family: PingFangSC-Regular, PingFang SC;
  overflow-y: auto;
  padding: 8px;
  padding-top: 0;
  color: #333333;
  h2{
    font-weight: 600;
    padding-left: 5px;
    line-height: 50px;
    font-size: 13px;
  }
  .top{
    line-height: 20px;
    .detail{
      padding: 10px;
      h3{
        font-size: 14px;
        font-weight: 600;
        line-height: 26px;
      }
      .info{
        color:#999999;
      }
    }
    .tip{
      background: #FBF8D9;
      color: #E1782E;
      line-height: 32px;
      font-size: 13px;
      padding-left: 10px;
    }
    .state{
      padding: 5px 0;
      .btn{
        border: 1px solid #F02C2D;
        color: #F02C2D;
        padding: 1px 7px;
        border-radius: 14px;
        display: inline-block;
      }
    }
  }
  .bottom{
    padding: 10px;
    .record{
      line-height: 20px;
      margin-bottom: 10px;
      &:first-child{
        color: #F02C2D;
      }
    }
  }
}
.card{
  box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
  // padding: 10px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
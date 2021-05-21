<template>
  <div class="firmdetail">
    <!-- header -->
    <div class="header">
      <div class="header-top">
        <i class="iconfont mall-fanhui theme_font_black backmall" @click="backEvent"></i>
        <span class="title">加油支付凭证详情</span>
      </div>
      <div class="headerTime" v-if="fromPage == 1">
        <div class="time">
          <span>{{month}}</span>
          <span>月</span>
          <span>{{day}}</span>
          <span>日</span>
          <span>{{hour}}</span>
          <span>时</span>
          <span>{{min}}</span>
          <span>分</span>
          <span>{{second}}</span>
          <span>秒</span>
          <span class="millisecond">{{millisecond}}</span>
        </div>
      </div>
    </div>
    <template v-if="orderDetail">
      <div class="detailstation">{{orderDetail.storeName}}</div>
      <div class="detailm">
        <div class="money detailmon">
          <p>
            <span>加油金额</span>
          </p>
          <p>¥<span>{{orderDetail.totalAmount.toFixed(2)}}</span></p>
        </div>
        <!-- <div class="ttc detailmon">
          <div class="ttc-content">
            <div class="item">
              <span class="label">TTC：</span>
              <span class="con">{{orderDetail.refuelPosTtc}}</span>
            </div>
            <div class="item">
              <span class="label">枪号：</span>
              <span class="con"><span class="num">{{orderDetail.refuelGunNo}}</span> <span class="suffix">号枪</span></span>
            </div>
          </div>
        </div> -->
        <!-- <div class="ttc detailmon">
          <p>
            <span>员工卡号后六位</span>
          </p>
          <p>
            <span>{{refuelCardNo}}</span>
          </p>
        </div> -->
      </div>
      <div class="detailli">
        <ul>
          <li>
            <span>员工编号</span>
            <span>{{ orderDetail.refuelCashierId }}</span>
          </li>
          <li>
            <span>员工姓名</span>
            <span>{{ orderDetail.refuelCashierName }}</span>
          </li>
          <li v-if="!source && source != 'offline'">
            <span>asn加油卡序列号</span>
            <span>{{ orderDetail.refuelCardNo }}</span>
          </li>
        </ul>
      </div>
      <div class="detailli">
        <ul>
          <li>
            <span>加油时间</span>
            <span>{{orderDetail.submitTime}}</span>
          </li>
          <li>
            <span>油品</span>
            <span>{{orderDetail.refuelOilName}}</span>
          </li>
          <!-- <li>
            <span>加油升数</span>
            <span>{{orderDetail.refuelLiter}}L</span>
          </li> -->
          <li>
            <span>实付金额</span>
            <span>¥{{orderDetail.payAmount.toFixed(2)}}</span>
          </li>
          <li v-if="!source && source != 'offline'">
            <span>优惠抵扣金额</span>
            <span>¥{{ discountAmountCom }}</span>
          </li>
        </ul>
      </div>
      <div class="evaluation">
        <div v-if="$store.state.globalConfig.oil_appraise_type == 2">
          <!--        <p class="evaluate">加油评价</p>-->
          <div class="question" >
<!--            <evaluate :detail="orderDetail"></evaluate>-->
            <!--          <subject :firmdetailSubject="firmdetailSubject" :orderIds="orderId" :ouCode="ouCode" @firmData="firmData"></subject>-->
          </div>
        </div>
        <!-- <span class="text" @click="goEvaluation">去评价</span> -->
      </div>
      <van-popup v-model="hasPrizeFlag"  class="eva-con"  closeable
                  >
        <p class="title">通知</p>
        <div class="icon-bg">
          <div class="conten">您在{{orderDetail.storeName}}</div>
          <div class="conten">加油¥{{orderDetail.payAmount.toFixed(2)}}元</div>
          <div class="conten">请对本次服务进行评价！</div>

        </div>
        <van-button round type="info"  color="#F02C2D" size="small" class="btn" @click="enterEvaluate">去评价</van-button>
        <div v-if="hasPrize">
          <p v-if="prize.length>0&&prize[0].prizeType!='20030'">* 完成评价后有机会获赠{{prize[0].prizeNum}}张{{prize[0].prizeName}}{{prize.length>1?'等':''}}</p>
          <p v-if="prize.length>0&&prize[0].prizeType=='20030'">* 完成评价后有机会获赠{{prize[0].prizeName}}{{prize[0].prizeNum}}次{{prize.length>1?'等':''}}</p>
        </div>
      </van-popup>
    </template>
  </div>
</template>
<script>
  import  evaluate from './evaluation'
  export default {
    components:{
      evaluate
    },
    data() {
      return {
        month: '',
        day: '',
        hour: '',
        min: '',
        second: '',
        millisecond: '',
        orderDetail: null,
        fromPage: '',
        configId: '',
        source: '',
        prize:{},
        hasPrize:null,
        hasPrizeFlag:false,
      };
    },
    computed: {
      discountAmountCom() {
        let couponAmount = Number(this.orderDetail.couponAmount) || 0;
        let pointsAmount = Number(this.orderDetail.pointsAmount) || 0;
        let discountAmount = Number(this.orderDetail.discountAmount) || 0;
        let rewardsAmount = Number(this.orderDetail.rewardsAmount) || 0;
        let empRewardsAmount = Number(this.orderDetail.empRewardsAmount) || 0;
        let enterpriseAmount = Number(this.orderDetail.enterpriseAmount) || 0;
        let randomDeductionAmount = Number(this.orderDetail.randomDeductionAmount) || 0;
        return couponAmount + pointsAmount + discountAmount + rewardsAmount + empRewardsAmount + enterpriseAmount + randomDeductionAmount;
      },
      refuelCardNo() {
        let num = this.orderDetail ? this.orderDetail.refuelCardNo : "";
        return num.slice(-6) || "";
      }
    },
    created() {
      this.orderType = this.$route.query.orderType;
      this.orderId = this.$route.query.orderId;
      this.fromPage = this.$route.query.fromPage;
      this.source = this.$route.query.source
      // this.fromPage = 1;
      if (this.fromPage == 1) {
        // 支付时展示时间
        this.counttime();
      }
      /* this.orderDetail = {
          payAmount: 12,
          totalAmount: 12,
          refuelPosTtc: 'qweqwewqeqwe',
          submitTime: '2018-12-12',
          refuelGunNo: 12,
          refuelOilName: '#92',
          refuelLiter: 12
        }*/
      this._getOrderDetail();
      if(this.$store.state.globalConfig.oil_appraise_type == 2){
        this.getEvaluateOrder()
      }

    },
    methods: {
      enterEvaluate(){
        this.$router.push({path: '/evaluateList' })
      },
      goEvaluation() {
        // 去评价按钮
        this.$router.push({path: '/service/questionlist', query: {id: this.configId, orderId: this.orderDetail.refuelOrderId}})
      },
      // nav-top部分
      backEvent: function () {
        this.$router.go(-1);
      },
      counttime() {
        let d = new Date();
        this.month = d.getMonth() + 1;
        this.day = d.getDate();
        this.hour = d.getHours();
        this.min = this.padZero(d.getMinutes());
        this.second = this.padZero(d.getSeconds() + 1);
        this.millisecond = this.padZero(d.getMilliseconds(), 3)
        const that = this;
        clearTimeout(this.timer)
        this.timer = setTimeout(function () {
          that.counttime();
        }, 1);
      },
      _getOrderDetail: function () {
        this.$Loading.open();
        let url = "/app/json/refuel_center/detail";
        let paramsData = {
          token: this.$store.state.login.token,
          orderType: this.orderType,
          orderId: this.orderId
        }
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.orderDetail = data.data;
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast("请求数据失败！");
          }
        )
      },
      // 获取未评价订单
      getEvaluateOrder: function (flag) {
        if (this.$store.state.login.token == '') {
          return;
        }
        let paramsData = {
          token: this.$store.state.login.token,
        };
        let url='/app/json/questionaire/getLatestAppraise'
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            console.log(data)
            if (data.status == 0) {
              // this.evaluateObj=data.data
              // this.limitOrderDayNum=data.data.limitOrderDayNum
              // this.toEvaluatedNum=data.data.toEvaluatedNum
              // if(!flag){
              //   if(this.toEvaluatedNum>0||this.showFlag1==true){
              //     this.commitModel=true
              //   }else{
              //     this.commitModel=false
              //   }
              // }

              this.hasPrize=data.data.hasPrize
              // if(this.hasPrize>0){
                this.hasPrizeFlag=true
              // }
              if(data.data.questionPrize){
                this.prize=JSON.parse(data.data.questionPrize)
              }

            }else{
              this.$Toast('网络加载较慢，请稍后重试!')
            }
          },
          error => {
          }
        );
      },
      padZero(num, len = 2) {
        let str = num + ''
        return ('0000'.substr(0, len) + str).substr(str.length)
      }
    }
  };
</script>
<style lang="stylus" scoped="" ref="stylesheet/stylus">
  @import '~@/common/stylus/mixin.styl'
  .firmdetail {
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow-y: auto;
  }

  .header {
    padding-top: 20px;
    background-image: url('./images/top_bg.jpg');
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
    background-repeat: no-repeat;
  }

  .header-top {
    line-height: 44px;
    color: #fff;
  }

  .header-top .backmall {
    font-size: 20px;
    margin-left: 10px;
    color: #fff;
  }

  .header-top span {
    display: inline-block;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    width: 80%;
  }

  .headerTime .time {
    text-align: center;
    padding: 10px;
    font-size: 16px;
  }

  .headerTime .time span {
    vertical-align: middle;

    &:nth-of-type(2n-1) {
      display: inline-block;
      width: 32px;
      height: 32px;
      line-height: 32px;
      background-color: #fff;
      font-size: 20px;
      margin: 0 3px;
      border-radius: 5px;
    }

    &:nth-of-type(2n) {
      color: #fff;
    }
  }

  .detailstation, .detailmon, .detailli {
    border-radius: 5px;
    margin: 0 0.24rem 15px;
    box-shadow: -1px 0 3px -2px #c2c2c2, 0 -1px 3px -2px #c2c2c2, 0 1px 3px -2px #c2c2c2, 1px 0 3px -2px #c2c2c2;
  }

  .detailstation {
    padding: 11px 0;
    font-size: 22px;
    font-weight: 600;
    color: #333;
    text-align: center;
    margin-top: 0.24rem;
    margin-bottom: 0.24rem;
  }

  .detailmon {
    padding: 0.4rem 0.26rem 0.26rem 0.26rem;
  }

  .detailmon {
    margin-top: 0.24rem;
    margin-bottom: 0.24rem;
  }

  .detailmon p {
    font-size: 14px;
    color: #333;
  }

  .detailmon p:last-of-type {
    padding-top: 0.13rem;
    text-align: center;
  }

  .detailmon p:last-of-type span {
    font-size: 30px;
  }

  .detailli ul li {
    margin: 0 0.26rem;
    padding: 0.4rem 0;
    font-size: 16px;
    color: #666;
    bdr-b()
  }

  .detailli ul li:last-of-type {
    &:after{
      content none
    }
  }

  .detailli ul li span:last-of-type {
    font-size: 18px;
    color: #333;
    float: right;
  }

  .headerTime .time .millisecond {
    font-size: 16px !important;
  }

  .ttc-content {
    display: flex;

    .item {
      flex 1
      text-align: center
      display flex
      align-items center
      justify-content center
    }

    .label {
      font-size: 14px;
      vertical-align middle
    }

    .con {
      font-size: 30px;
      vertical-align middle
      .num{
        vertical-align: middle
      }
      .suffix{
        font-size:24px;
        vertical-align middle
      }
    }
  }
  .evaluation {
    text-align right
    padding: 11px 15px
    .text {
      padding: 3px 13px
      border-radius 20px
      border: 1px solid #ddd
      color: #666
    }
  }
  .eva-con{
    width 279px
    border-radius 10px
    /*height 300px*/
    /*height 50%*/
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    /*margin auto 50px*/
    /*.icon-bg{*/
    /*background url('../../../../static/images/evabg.png') no-repeat top center*/
    background-size cover
    //}
    .icon-bg{
      margin 10px 38px 20px
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
    }
    p{
      padding 20px
      text-align center
    }
    .btn{
      width 90px
      margin 0 auto
      margin-bottom 10px
    }
    .title{
      padding 20px
      text-align center
      font-size 18px
      /*margin-bottom 10px*/
    }
    .conten{
      text-align center
    }



  }
</style>

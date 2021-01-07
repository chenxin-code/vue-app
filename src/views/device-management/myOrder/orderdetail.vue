
<template>
  <div>
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content class="container mall2" v-show="isDetail">
      <div class="item">
        <div class="leftImg">
          <img :src="item.orderExtendData.picUrl" alt="" class="img">
        </div>
        <div class="center-content">
          <span class="titer">设备编号：{{item.orderExtendData.deviceCode}}</span>
          <span style="color: #666">{{item.orderExtendData.brandName}}{{item.orderExtendData.deviceName}}</span>
          <span style="color: #666">{{item.orderExtendData.stationName}}</span>
        </div>
        <div class="right-btn" v-if="item.state == 3 && item.rechargeState == 10">
          <!-- item.state == 3 ? (item.rechargeState != 5 && item.rechargeState != 10) : ''" -->
          <span>剩余</span>
          <van-count-down :time="item.stockupFinishTimeNew" format="mm:ss"></van-count-down>
        </div>
        <!-- <div class="right-btn" v-if="query.rewardState == '进行中'">
          <div v-if="item.priceMode == 0"><span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{getInteger(item.orderExtendData.amount)}}</span><span class="price-x theme_font_red">.{{getDecimals(item.orderExtendData.amount)}}</span></div>
          <div v-else class="theme_font_red"><span class="price-z">{{item.orderExtendData.amount}}</span> <span class="price-x">{{getDictByAliasText(item.orderExtendData.priceMode)}}</span> </div>
        </div> -->
      </div>
      <div class="explain">
        <p>服务信息</p>
        <div class="block-div">
          <div class="flex-row">
            <div class="label full theme_font_common">使用时长</div>
            <div class="theme_font_black">{{item.rechargeState == 20 ? item.rechargeNo : item.stockupFinishTime ? (((($util.getDateFromString(item.completeTime) - $util.getDateFromString(item.stockupFinishTime))) >0 ? (($util.getDateFromString(item.completeTime) - $util.getDateFromString(item.stockupFinishTime))) : 0)  / 60).toFixed() : 0}} 分钟</div>
          </div>
          <div class="flex-row">
            <div class="label full theme_font_common">开始时间</div>
            <div class="theme_font_black">{{item.stockupFinishTime || '--'}}</div>
          </div>
          <div class="flex-row">
            <div class="label full theme_font_common">结束时间</div>
            <div class="theme_font_black">{{item.completeTime || '--'}}</div>  
          </div>
          <div class="flex-row">
            <div class="label full theme_font_common">结束方式</div>
            <div class="theme_font_black">{{rechargeState(item.rechargeState)}}</div>
          </div>
        </div>
      </div>
      <div class="explain">
        <p>订单信息</p>
        <div class="block-div">
          <div class="flex-row">
            <div class="label full theme_font_common">订单号</div>
            <div class="theme_font_black">{{item.tradeNo}}</div>
          </div>
          <div class="flex-row">
            <div class="label full theme_font_common">支付时间</div>
            <div class="theme_font_black">{{item.paidTime}}</div>
          </div>
          <div class="flex-row">
            <div class="label full theme_font_common">支付方式</div>
            <div class="theme_font_black">{{item.priceMode == 0 ? item.orderExtendData.payModeStr : getDictByAliasText(item.orderExtendData.priceMode)}}支付</div>  
          </div>
          <div class="flex-row">
            <div class="label full theme_font_common">订单时长</div>
            <div class="theme_font_black">{{item.rechargeNo}} 分钟</div>
          </div>
          <div class="flex-row">
            <div class="label full theme_font_common">订单金额</div>
            <div class="theme_standard_font">
              <template v-if="item.priceMode == 0">
                ¥ {{$util.toDecimal2(item.orderExtendData.amount)}}
              </template>
              <template v-else>
                {{item.orderExtendData.amount}}{{getDictByAliasText(item.orderExtendData.priceMode)}}
              </template>
            </div>
          </div>
<!--          <div class="flex-row">-->
<!--            <div class="label full theme_font_common">优惠券</div>-->
<!--            <div class="theme_standard_font">-￥{{$util.toDecimal2(item.couponAmount)}}</div>-->
<!--          </div>-->
<!--          <div class="flex-row">-->
<!--            <div class="label full theme_font_common">积分</div>-->
<!--            <div class="theme_standard_font">-￥{{$util.toDecimal2(item.pointsAmount)}}</div>-->
<!--          </div>-->
<!--          <div class="flex-row">-->
<!--            <div class="label full theme_font_common">柴油豆</div>-->
<!--            <div class="theme_standard_font">-￥{{$util.toDecimal2(item.rewardsAAmount)}}</div>-->
<!--          </div>-->
          <div class="flex-row" v-for="(acctitem, index) in acctListType" :key="index">
            <div class="label full theme_font_common">{{acctitem.acctTypeName}}</div>
            <div class="theme_standard_font">-￥{{$util.toDecimal2(acctitem.acctTypeAmount)}}</div>
          </div>
          <span style="display: block;height: 1px;width: 100%;background-color: rgb(232, 232, 232);margin-bottom: 10px;"></span>
          <div class="flex-row top-padding">
            <div class="full"></div>
            <div class="price theme_font_common">
              <span>实付金额:</span>
              <span class="theme_standard_font">
                <template v-if="item.priceMode == 0">
                  ¥ {{$util.toDecimal2(item.payAmount)}}
                </template>
                <template v-else-if="item.orderExtendData.priceMode == 8">
                  {{item.orderExtendData.amount}}{{getDictByAliasText(item.orderExtendData.priceMode)}}
                </template>
                <template v-else>
                  {{item.payAmount}}{{getDictByAliasText(item.orderExtendData.priceMode)}}
                </template>
              </span>
            </div>
          </div>
          <div class="flex-row top-padding">
            <div class="full"></div>
            <div class="theme_font_common">
              <div class="bottom-btn" v-if="item.state == 3 && item.rechargeState == 10">
                <span><a :href="'tel:'+item.orderExtendData.hotline">联系客服</a></span> 
                <span @click.stop="stopClick">强制结束</span>
                <span @click.stop='addSubmit'>加时间</span>
              </div>
              <div class="bottom-btn" v-if="item.state == 3 && (item.rechargeState == 20 ||  item.rechargeState == 30)">
                <span @click.stop="applyRefund" v-if="item.rechargeState == 30 && !item.afterSaleHasReturn">申请退款</span>
                <!-- <span @click.stop="buyAgain">再次购买</span> -->
              </div>
              <div class="bottom-btn" v-if="item.state == 12">
                <!-- <span @click.stop="applyRefund(item)">再次购买</span> -->
                <!-- <span @click.stop="applyRefund(item)">我的申请</span>
                <span @click.stop="applyRefund(item)">取消申请</span> -->
              </div>
              <div class="bottom-btn" v-if="item.state == 70">
                <span><a :href="'tel:'+item.orderExtendData.hotline">联系客服</a></span> 
                <span @click.stop="applyRefund">我的申请</span>
                <!-- <span @click.stop="applyRefund">取消申请</span> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <van-popup v-model="stopStatus" class="popupCard" :close-on-click-overlay="false">
      <div class="popupCardText">
        <span>设备正在运行是否要强制结束？</span>
      </div>
      <div class="popupCardBtn">
        <span @click="stopStatus=false">取消</span>
        <span @click="stop">确定</span>
      </div>
    </van-popup>
    </nav-content>
  </div>
</template>
<script>
import mixin from "../mixin";
import { CountDown } from "vant";
export default {
  name: "home",
  mixins: [mixin],
  data() {
    return {
      title: '',  
      isDetail: false,  
      stopStatus: false,
      query: {},
      rowItem: {},
      item: {
        orderExtendData: [{}]
      },
      acctListType: []
    };
  },
  components: {
    [CountDown.name]: CountDown
  },
  // components: {deviceList, myOrder},
  created() {
    this.query = this.$route.query || {}
    this.$request.post('/app/json/app_self_washer_order/detail',{orderId: this.query.id,orderType: this.query.orderType}).then(res => {
      if (res.status == 0) {
        this.item = res.data || {}
        if (this.item.orderExtendData) {
          this.item.orderExtendData = JSON.parse(this.item.orderExtendData)
        }
        if (this.item.stockupFinishTime) {
          this.item.stockupFinishTimeNew = (this.item.rechargeNo * 60 - (this.$store.state.severTime.currentTime - this.$util.getDateFromString(this.item.stockupFinishTime))) * 1000
        }
        this.isDetail = true
      //  渲染虚拟支付类型
        this.renderType()
      } else {
        this.$Toast(res.info);
      }
    })
    this.renderType()
  },
  mounted() {},
  methods: {
    // 渲染订单类型
    renderType(){
      let arr = []
      let globalAcctList = this.$store.state.globalConfig.acctList
      let AllAcctList = {'acct.points': 'Points', 'acct.rewards_a': 'RewardsA', 'acct.rewards': 'Rewards', 'acct.emp_rewards': 'EmpRewards', 'acct.enterprise':'Enterprise', 'acct.limit_wallet':'LimitWallet', 'acct.elec':'Elec'}
      console.log(globalAcctList, AllAcctList)
      for (let key in AllAcctList) {
        globalAcctList.forEach(item => {
          if(item.acctType === AllAcctList[key]){
            arr.push({
              acctKey: item.acctType,
              detailsKey: `${item.acctType.toLowerCase()}Amount`
            })
          }
        })
      }
      arr.forEach(item => {
        if(this.item[item.detailsKey] && this.item[item.detailsKey] !== 0){
          this.acctListType.push({
            acctTypeName: $mallCommon.accTypeToName(item.acctKey),
            acctTypeAmount: this.item[item.detailsKey]
          })
        }
      })
      console.log(arr, this.acctListType)
    },
    backEvent() {
      this.$router.go(-1)
    },
    // 加时间
    addSubmit(item) {
      this.$router.push({
        path: '/device_management/payment',
        query: {
          addSubmit: true,
          id: 26
          // id: item.id
        }
      })
    },
    // 结束
    stopClick(item) {
      this.stopStatus = true
      this.rowItem = item
    },
    stop() {
      this.$request.post('/app/json/app_self_washer_order/stop', {orderType: this.rowItem.orderType, orderId: this.rowItem.id}).then(res => {
        if (res.status == 0) {
          this.getQueryOrder(this.queryOrder);
          this.$Toast('结束成功！');
        } else {
          this.$Toast(res.info);
        }
      })
    }, 
    buyAgain() {
      this.$router.push({
         path: '/device_management/payment',
        query: {
          id: this.item.orderExtendData.id
        }
      })
    },
    applyRefund() {
      this.$router.push({
        path: '/device_management/applyRefund',
        query: {
          item: JSON.stringify(this.item)
        }
      })
    },
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
.container {
  background-color #f6f6f6
  position: relative;
  width: 100%;
  height: 100%;
  padding 10px
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  .item {
    padding 10px;
    width 100%
    border-radius 5px;
    background-color #fff;
    display flex
    .leftImg {
      width 70px
      height 100%
      img {
        width 100%
        height 100%
      }
    }
    .center-content {
      margin-left 10px
      width calc(100% - 100px);
      display flex
      flex-direction column
      .titer {
        font-size 14px;
        font-weight 500
      }
      span {
        width 100%
        height 100%
        overflow hidden
        text-overflow:ellipsis
        white-space: nowrap
        display flex
        align-items center
      }
    }
    .right-btn {
      padding 6px 0
      width 100px
      display flex;
      align-items center
      justify-content center
      flex-direction column;
      color #0e80ff
      /deep/ .van-count-down {
        color #0e80ff
        font-size 500
      }
      img {
        width 20px;
        height 20px;
      }
    }
  }
  .explain {
    margin-top 10px
    padding 10px 10px 0
    background-color #fff
    p {
      font-size: 14px;
      margin: 6px 0;
    }

    .block-div {
      padding 0
      box-shadow 0 0 0 #efefef
      .bottom-btn {
        margin 6px 0
        span {
          color #0e80ff
          font-size 12px
          border 1px solid #0e80ff
          padding 4px 10px
          border-radius 100px
          a {
            color #0e80ff
          }
          &:first-child {
            margin-right 4px
            background-color #dfebf6
          }
          &:last-child {
            color #fff
            background-color #0e80ff
          }
        }
      }
    }
  }
}
  /deep/ .van-popup {
    width: 76%;
    font-size: 14px;
    color: #8c8c8c;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .popupCard {
    height: 160px;
    flex-direction: column;
    line-height: 26px;

    .popupCardText {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .popupCardBtn {
      width: 100%;
      color: #000;
      height: 45px;
      display: flex;
      justify-content: center;
      font-size 16px

      span {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      >:last-child {
        color #fff;
        background-color  #0e80ff
      }
    }
  }
/deep/ .van-count-down {
  display: inline-block;
}
.colon {
  display: inline-block;
  color: #0e80ff
}
.block {
  display: inline-block;
  padding 0px 4px
  border-radius 4px
  color: #fff;
  text-align: center;
  background-color: #0e80ff
}
</style>

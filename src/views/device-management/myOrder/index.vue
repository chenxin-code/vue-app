<template>
  <nav-content>
    <div class="container">
      <div class="screen">
        <div  v-for="(screenItem,screenIndex) in screenArr" :key="screenIndex" class="tab" :class="{'tabColor': rewardState == screenItem.type}" @click="screenBtn(screenItem)" >
          <span class="name">{{`${screenItem.name}`}}</span>
          <span v-if="rewardState == screenItem.type" class="line"></span>
        </div>
      </div>
      <div class="container-box">
        <ul class="device-list">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <li class="row" v-for="(item,index) in array" :key="index" @click="orderdetail(item)">
              <div class="row-top" style="color: #666">
                <span class="row-top-left">
                  <span class="row-top-left-tel" >设备编号: {{item.utilityAccount}}</span>
                </span>
                <span class="row-top-right">
                  <!-- <i>{{rewardState == '进行中' ? '' : rechargeState(item.rechargeState)}}</i>&nbsp;&nbsp; -->
                  <!-- <i style="color:#0e80ff">{{item.rechargeState == '5' ? '等待中' : rewardState == '已完成' ? '已完成' : status(item.state)}}</i> -->
                  <i>{{item.state == 3 ? '' : rechargeState(item.rechargeState)}}</i>&nbsp;&nbsp;
                  <i style="color:#0e80ff">{{item.state == 3 ? rechargeState(item.rechargeState) : status(item.state)}}</i>
                </span>
              </div>
              <div class="row-content">
                <div class="contentLift">
                  <div class="leftImg">
                    <img :src="item.orderExtendData.picUrl">
                  </div>
                  <div class="leftText">
                    <span class="titer">{{item.skuNames}}</span>
                    <span style="color: #666">{{item.storeName}}</span>
                  </div>
                </div>
                <div class="contentRight">
                  <div v-if="item.priceMode == 0"><span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{getInteger(item.orderExtendData.amount)}}</span><span class="price-x theme_font_red">.{{getDecimals(item.orderExtendData.amount)}}</span></div>
                  <div v-else class="theme_font_red"><span class="price-z">{{item.orderExtendData.amount}}</span> <span class="price-x">{{getDictByAliasText(item.orderExtendData.priceMode)}}</span> </div>
                </div>
              </div>
              <div class="row-bottom">
                <div>
                  <span>{{item.rechargeNo}}分钟</span>&nbsp;
                  <van-count-down :time="item.stockupFinishTimeNew" format="mm:ss" v-if="item.state == 3 && item.rechargeState == 10">
                    <template v-slot="timeData">
                      <span class="block">{{ (timeData.hours * 60 + timeData.minutes).toString().length == 2 ? `${timeData.hours * 60 + timeData.minutes}` :  `0${timeData.hours * 60 + timeData.minutes}`}}</span>
                      <span class="colon">:</span>
                      <span class="block">{{ timeData.seconds.toString().length == 2 ? timeData.seconds : `0${timeData.seconds}` }}</span>
                    </template>
                  </van-count-down>{{item.stockupFinishTimetrue}}
                  <span style="color: #666" v-if="item.state == 3 ? (item.rechargeState != 5 && item.rechargeState != 10 && item.stockupFinishTime) : true">使用时长 {{item.rechargeState == 20 ? item.rechargeNo : (($util.getDateFromString(item.completeTime) - $util.getDateFromString(item.stockupFinishTime)) / 60).toFixed()}} 分钟</span>
                </div>
                <div class="bottom-btn" v-if="item.state == 3 && item.rechargeState == 10">
                  <span @click.stop="stopClick(item)">强制结束</span>
                  <span @click.stop='addSubmit(item)'>加时间</span>
                </div>
                <div class="bottom-btn" v-if="item.state == 3 && (item.rechargeState == 20 ||  item.rechargeState == 30)">
                  <span @click.stop="applyRefund(item)" v-if="item.rechargeState == 30 && !item.afterSaleHasReturn">申请退款</span>
                  <!-- <span @click.stop="buyAgain(item)">再次购买</span> -->
                </div>
                <div class="bottom-btn" v-if="item.state == 12">
                  <!-- <span @click.stop="applyRefund(item)">再次购买</span> -->
                  <!-- <span @click.stop="applyRefund(item)">我的申请</span>
                  <span @click.stop="applyRefund(item)">取消申请</span> -->
                </div>
                <div class="bottom-btn" v-if="item.state == 70">
                  <span @click.stop="applyRefund(item)">我的申请</span>
                  <!-- <span @click.stop="applyRefund(item)">取消申请</span> -->
                </div>
              </div>
            </li>
            <li style="text-align: center;margin: 10px 0; color: rgb(179, 175, 175)">暂无更多数据～</li>
          </van-pull-refresh>
        </ul>
        <div class="no-list" v-if="!array.length">
          <div class="img-div">
            <img src="static/image/mall2/no-data-img.png">
          </div>
          <div class="tip theme_font_gray">抱歉没有找到相应订单~</div>
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
</template>

<script>
import { mapGetters } from "vuex";
import { CountDown } from "vant";
import mixin from "../mixin";
export default {
  name: "order",
  mixins: [mixin],
  data() {
    return {
      isLoading: false,
      stopStatus: false,
      rowItem: {},
      rewardState: '进行中',
      array: [],
      screenArr: [
        { name: "进行中", type: '进行中' }, // "orderType":"700005002","state":"3","rechargeState":"10"
        { name: "已完成", type: '已完成' }, // orderType":"700005002","state":"3","rechargeState":"20",
        { name: "退款", type: '退款' } // "orderType":"202012"
      ],
      queryOrder: {
        orderType: '700005002',
        state: '3',
        rechargeState: '10',
      }
    };
  },
  components: {
    [CountDown.name]: CountDown
  },
  computed: {},
  created() {
    this.getQueryOrder(this.queryOrder);
  },
  mounted() {},
  methods: {
    onRefresh() {
      this.getQueryOrder(this.queryOrder);
      this.isLoading = false
    },
    setRewardState (rewardState) {
      this.rewardState = rewardState || this.rewardState
      if (rewardState == '进行中') {
        this.queryOrder = {
          orderType: '700005002',
          state: '3',
          rechargeState: '10',
        }
      } else if (rewardState == '已完成') {
        this.queryOrder = {
          orderType: '700005002',
          state: '3',
          rechargeState: '20',
        }
      } else if (rewardState == '退款') {
        this.queryOrder = {
          orderType: '700005003'
        }
      }
      this.getQueryOrder(this.queryOrder);
    },
    backEvent() {
      this.$router.go(-1);
    },
    screenBtn(item) {
      this.array = [];
      this.rewardState = item.type;
      if (item.type == '进行中') {
        this.queryOrder = {
          orderType: '700005002',
          state: '3',
          rechargeState: '10',
        }
      } else if (item.type == '已完成') {
        this.queryOrder = {
          orderType: '700005002',
          state: '3',
          rechargeState: '20',
        }
      } else if (item.type == '退款') {
        this.queryOrder = {
          orderType: '700005003'
        }
      }
      this.getQueryOrder(this.queryOrder);
    },
    // 加时间
    addSubmit(item) {
      this.$router.push({
        path: '/device_management/payment',
        query: {
          addSubmit: true,
          id: item.orderExtendData.id
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
          this.stopStatus = false,
          this.getQueryOrder(this.queryOrder);
          this.$Toast('结束成功！');
        } else {
          this.$Toast(res.info);
        }
      })
    },
    // 申请退款
    applyRefund(item) {
      this.$router.push({
        path: '/device_management/applyRefund',
        query: {
          item: JSON.stringify(item)
        }
      })
    },
    finish() {
      this.getQueryOrder(this.queryOrder);
    },
    getQueryOrder(queryOrder) {
      this.$request.post('/app/json/app_self_washer_order/queryOrder', queryOrder || this.queryOrder).then(res => {
        if (res.status == 0) {
          this.array = res.data.orderList || []
          this.array.forEach(item=> {
            if (item.stockupFinishTime) {
              // console.log((this.$store.state.severTime.currentTime - this.$util.getDateFromString(item.stockupFinishTime))*60/1000)
              item.stockupFinishTimeNew = (Number(item.rechargeNo) * 60 - (this.$store.state.severTime.currentTime - this.$util.getDateFromString(item.stockupFinishTime))) * 1000
            }
            if (item.orderExtendData) {
              item.orderExtendData = JSON.parse(item.orderExtendData)
            }
          })
        } else {
          this.$Toast(res.info);
        }
      })
    },
    text(rewardType) {
      console.log("rewardType", rewardType);
      // 3 积分 8 油滴 9 豌豆 12 元
      let text = ''
      if(rewardType == 3){
      text = '积分'
      }else if(rewardType == 8){
      text = '油滴'
      }else if(rewardType == 9){
      text = '豌豆'
      }else if(rewardType == 0){
      text = '元'
      }
      return text;
    },
    getInteger: function (price) {
      let str = this.$util.toDecimal2(price)
      let arr = str.split('.')
      return arr[0]
    },
    getDecimals: function (price) {
      let str = this.$util.toDecimal2(price)
      let arr = str.split('.')
      return arr[1]
    },
    buyAgain(row) {
      this.$router.push({
         path: '/device_management/payment',
        query: {
          id: row.orderExtendData.id
        }
      })
    },
    orderdetail(row) {
      this.$router.push({
        path: '/device_management/orderdetail',
        query: {
          orderType: row.orderType,
          id: row.id,
          rewardState: this.rewardState
        }
      })
    }
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';
@import "../common/css/price.styl"
  .container {
    background-color #f6f6f6
    position: relative;
    width: 100%;
    height: 100%;
    padding 10px

    .screen {
      display: flex;
      justify-content: space-between;
      padding: 4px 40px 10px
      font-size: 14px;
      font-weight: 800;
      .tabColor {
        color #0e80ff
      }
      .tab {
        display flex
        flex-direction column
        .name {
          margin-bottom 4px
        }
        .line {
          width 100%
          border 1px solid #0e80ff
        }
      }
    }
  .container-box {
    position: relative;
    width 100%
    height: 100%
    .device-list {
      width 100%
      height: calc(100% - 120px);
      .row {
        padding: 0 10px;
        margin-bottom 10px
        background-color: #fff;
        .row-top {
          height: 40px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .row-top-left {
            display: flex;
            align-items: center;

            .row-top-left-tel {
              margin-left: 4px;
            }
            img {
              width: 26px;
            }
          }
          .row-top-right {
            display: flex;
            align-items: center;
            i {
              font-style normal
              &:first-child {
                font-size 12px
              }
            }
          }
        }

        .row-content {
          padding 10px 0
          height 90px
          width 100%
          border-top: 1px solid #f1eded;
          border-bottom: 1px solid #f1eded;
          display flex
          align-items center
          justify-content space-between
          .contentLift {
            width: calc(100% - 80px);
            height 100%
            display flex
            align-items center
            .leftImg {
              width 70px
              height 100%
              img {
                width 100%
                height 100%
              }
            }
            .leftText {
              padding 8px 10px
              width: calc(100% - 70px);
              height 100%
              display flex
              flex-direction column
              justify-content space-between
              .titer {
                font-size 14px;
                font-weight 500
              }
              span {
                width 100%
                display block
                text-overflow:ellipsis
                white-space: nowrap
                overflow: hidden;
              }
            }
          }
          .contentRight {
            width 80px
            height 100%
            display flex
            justify-content center
            align-items center
          }
        }
        .row-bottom {
          height: 40px;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .bottom-btn {
            span {
              font-size 12px
              border 1px solid #0e80ff
              padding 4px 10px
              border-radius 100px
              &:first-child {
                color #0e80ff
                margin-right 4px
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
    .no-list {
      position absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-x hidden;
      overflow-y auto;
      -webkit-overflow-scrolling touch;

      .img-div {
        margin-top 80px;
        text-align center;

        img {
          width 160px;
        }
      }

      .tip {
        margin-top 10px;
        padding 10px;
        font-size 12px;
        text-align center;
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
/deep/ .van-pull-refresh{
  height 100%
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
} 
/deep/ .van-pull-refresh__track{
  height 100%
}
</style>

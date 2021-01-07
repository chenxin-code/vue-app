<template>
    <div>
        <nav-top title="竞价详情" @backEvent="$router.go(-1)"></nav-top>
        <nav-content class="biddingDetails-index">
            <div class="bidding-content">
                <div class="bidding-details">
                    <div class="right">
                        <img src="./images/bidding-success.png" alt="">
                    </div>
                    <!-- 竞价成功 -->
                    <div class="left" v-if="tabBarIndex == 1">
                        <p class="order-state-tips">
                            恭喜您竞价成功,请尽快完成竞价确认!
                        </p>
                        <div class="count-down" v-if="biddingData.isConfirm == 0">
                            <p>竞价倒计时</p>
                            <countdown :endTime="biddingData.endDateTimeout ? biddingData.endDateTimeout / 1000 : ''"
                                type="theme_bg_black" @timeOut="timeOut" />
                        </div>
                        <div class="order-state" v-if="biddingData.isConfirm == 1">
                            <p>确认状态</p>
                            <p class="order-state-info">已确认</p>
                        </div>
                        <p class="order-tips">
                            请尽快完成确认,超时未完成确认将自动取消!
                        </p>
                    </div>
                    <!-- 竞价失败 -->
                    <div class="left" v-if="tabBarIndex == 0">
                        <p class="order-state-tips">
                            很遗憾! 您的出价没能竞价成功
                        </p>
                    </div>
                    <!-- 取消 -->
                    <div class="left" v-if="tabBarIndex == 3">
                        <p class="order-state-tips">
                            订单已取消
                        </p>
                        <div class="order-state">
                            <p>确认状态</p>
                            <p class="order-state-info">已取消</p>
                        </div>
                        <p class="order-tips">
                            取消时间 {{biddingData.optTime}}
                        </p>
                    </div>
                </div>
                <!-- 我的竞价 -->
                <div class="order-bidding-state">
                    <p class="title">我的竞价</p>
                    <p class=bidding-state v-if="tabBarIndex == 1">竞价成功</p>
                    <p class=bidding-state v-if="tabBarIndex == 0">竞价失败</p>
                </div>
                <div class="my-biddingPrice boxShadow ">
                    <div class="auction-number borderB mybidding-display">
                        <p class="right">竞拍数量</p>
                        <div class="auction-inp">
                            <input type="text" v-model="b_tonnes" :disabled="tabBarIndex!=2">
                            <p>吨</p>
                        </div>
                    </div>
                    <div class="auction-price borderB ">
                        <div class="mybidding-display">
                            <p class="right">竞拍单价</p>
                            <div class="auction-inp">
                                <input type="text" v-model="b_price" :disabled="tabBarIndex!=2">
                                <p>元/吨</p>
                            </div>
                        </div>
                        <p class="tips">价格排名靠前的,拥有订单的优先成交权</p>
                    </div>
                    <div class="auction-orderNumber borderB mybidding-display" v-if="biddingData.isConfirm == 1">
                        <p class="right">订单号</p>
                        <p class="order-number">{{biddingData.id}}</p>
                    </div>
                    <div class="auction-orderPrice borderB mybidding-display">
                        <p class="right">订单总金额</p>
                        <p class="order-allPrice">
                            ¥
                            <span>{{b_tonnes * b_price || 0.00}}</span>
                        </p>
                    </div>
                    <!-- <div class="auction-oildepot mybidding-display">
                        <p class="right">自提油库</p>
                        <p class="order-oildepot">{{biddingData.pickUpOilDepotName}}</p>
                    </div> -->

                </div>
                <!-- 竞价状态 -->
                <div class="list-item boxShadow">
                    <div class="item-info">
                        <div class="left">
                            <img src="./images/list-icon.png" alt />
                        </div>
                        <div class="right">
                            <div class="info-name">{{biddingData.matertialName}}</div>
                            <div class="info-price">
                                <p>
                                    当前最高出价:
                                    <span class="info-price-company">¥</span>
                                    <span
                                        class="info-price-price">{{activityData.maxBidPrice ? activityData.maxBidPrice.toFixed(2) : 0.00}}</span>
                                    <span class="info-price-company">元/吨</span>
                                </p>
                                <p>{{activityData.bidCnt || 0}}次出价</p>
                            </div>
                            <div class="info-progress">
                                <van-progress
                                    :percentage="(activityData.boughtTonnes/activityData.totalTonnes)*100 > 100 ? 100 : (activityData.boughtTonnes/activityData.totalTonnes)*100 ? (activityData.boughtTonnes/activityData.totalTonnes)*100 : 0"
                                    stroke-width="15" :show-pivot="false" />
                                <p v-if="(activityData.boughtTonnes/activityData.totalTonnes)*100 > 100">
                                    超出{{Math.abs(activityData.totalTonnes - activityData.boughtTonnes)}}吨</p>
                                <p v-else>剩余{{activityData.totalTonnes - activityData.boughtTonnes }}吨</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 商品信息 -->
                <p class="title">商品信息</p>
                <div class="goods-info boxShadow">
                    <div class="starting-price displayFlex">
                        <p class="price">起拍价:
                            <span>{{activityData.priceLowerLimit}}</span>元
                        </p>
                        <p class="price-upper">
                            竞拍价上限:
                            <span>{{activityData.priceUpperLimit}}</span>元/吨
                        </p>
                    </div>
                    <div class="starting-amount displayFlex">
                        <p class="amount">起拍量:
                            <span>{{activityData.tonnesLowerLimit}}</span>吨
                        </p>
                        <p class="amount-upper">
                            最高竞拍:
                            <span>{{activityData.tonnesUpperLimit}}</span>吨
                        </p>
                    </div>
                </div>
                <!-- 竞拍说明 -->
                <p class="title">竞拍说明</p>
                <div class="auction-description boxShadow">
                    <div class="instr-content borderB">
                        <div class="instr-item">
                            <img src="./images/auction-start.png" alt />
                            <p>出价竞拍</p>
                        </div>
                        <div class="instr-item">
                            <img src="./images/auction-success.png" alt />
                            <p>竞拍成功</p>
                        </div>
                        <div class="instr-item">
                            <img src="./images/auction-order.png" alt />
                            <p>确认订单</p>
                        </div>
                        <div class="instr-item">
                            <img src="./images/auction-over.png" alt />
                            <p>完成支付</p>
                        </div>
                    </div>
                    <div class="description-info">
                        {{activityData.activityDesc}}
                    </div>
                </div>
                <!-- 竞价结果 -->
                <p class="title">竞价结果</p>
                <div class="bidding-results boxShadow">
                    <div class="t-head borderB">
                        <p class="ranking">排名</p>
                        <p class="price">竞价</p>
                        <p class="number">数量</p>
                        <p class="time">时间</p>
                    </div>
                    <div :class="item == biddingRecord.length ? 't-body' : 't-body borderB'"
                        v-for="(item, index) in biddingRecord" :key="index">
                        <p class="ranking">{{index + 1 }}</p>
                        <p class="price">{{item.price}}元/吨</p>
                        <p class="number">{{item.tonnes}}吨</p>
                        <p class="time">{{$util.getPreTime(item.createTime)}}</p>
                    </div>
                </div>
            </div>
            <div class="submit-btns" v-if="tabBarIndex == 1 && biddingData.isConfirm == 0">
                <div class="cancel-btn btn" @click="cancelOrderBtn">取消订单</div>
                <div class="confirmation-btn btn" @click="confirmationBtn">确认订单</div>
            </div>
        </nav-content>
    </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import countdown from "@/components/Vendor/countdown/countdown";

  export default {
    data() {
      return {
        biddingData: {}, // 竞价信息
        activityData: {}, // 活动信息
        RecordModelData: {}, // 活动信息 - 详情
        tabBarIndex: '',
        b_tonnes: '',
        b_price: '',
        biddingRecord: [], // 竞价记录
      }
    },
    components: {
      countdown
    },
    mounted() { // tabBarIndex 2竞价中 1成功 0失败 3取消
      this.tabBarIndex = this.$route.query.tabBarIndex
      this.biddingData = JSON.parse(this.$route.query.biddingData)
      this.activityData = this.biddingData.oilSaleActivityDetailModel
      this.b_tonnes = this.biddingData.tonnes || ''
      this.b_price = this.biddingData.price || ''

      if (this.tabBarIndex == 1 || this.tabBarIndex == 0) {
        this.getBiddingResult()
      }
    },
    methods: {
      timeOut() {

      },
      // 竞价成功 - 取消订单
      cancelOrderBtn() {
        this.$request.post('/app/json/app_oil_sale/cancelSuccessBidOrder', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId,
          id: item.id
        }).then(res => {
          if (res.status === 0) {
            this.$router.go(-1)
          } else {
            this.$Toast(res.info)
          }
        })
      },
      // 竞价成功 - 确认订单
      confirmationBtn() {
        this.$router.push({
          path: '/bidding-confirmation-order',
          query: {
            biddingData: JSON.stringify(this.biddingData)
          }
        })
      },
      getBiddingResult() {
        this.$request.post('/app/json/app_oil_sale/queryBidRecord', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId,
          activityId: this.activityData.activityId
        }).then(res => {
          if (res.status === 0) {
            this.biddingRecord = res.data
          } else {
            this.$Toast(res.info)
          }
        })
      }
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  @import '~@/common/stylus/variable.styl';

  .biddingDetails-index {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 120px;
    position: relative;

    .boxShadow {
      border-radius: 5px;
      box-shadow: 0px 0px 5px #eaeaea;
      background: #fff;
    }

    p.title {
      margin: 13px 0 10px;
      font-size: 14px;
    }

    .borderB {
      border-bottom: 1px solid #F1F1F1;
    }

    .bidding-details {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      box-shadow: 0px 0px 5px #ccc;
      margin: -10px -10px 0;
      padding: 15px;

      .right {
        img {
          width: 60px;
        }
      }

      .left {
        margin-left: 20px;

        .order-state-tips {
          font-size: 14px;
          line-height: 25px;
        }

        .count-down {
          display: flex;
          padding: 0 0 10px;
          font-size: 14px;
          align-items: center;

          p {
            margin-right: 10px;
          }

          .time-item {
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 5px 2px;
            border-radius: 4px;
            margin: 0 5px;
          }
        }

        .order-state {
          display: flex;
          padding: 0 0 10px;
          font-size: 14px;
          align-items: center;
          line-height: 20px;

          .order-state-info {
            color: #2EAEF2;
            margin-left: 20px;
          }
        }

        .order-tips {
          color: #919191;
        }
      }
    }

    .bidding-content {
      padding: 10px;

      // 竞价状态

      .list-item {
        padding: 10px;
        margin: 15px 0 15px;

        .item-info {
          display: flex;
          padding: 10px 0 0;

          .left {
            margin-right: 10px;

            img {
              width: 70px;
            }
          }

          .right {
            flex: 1;

            .info-name {
              font-size: 14px;
              line-height: 23px;
            }

            .info-price {
              line-height: 25px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              color: #818181;

              .info-price-company {
                color: #069FEF;
              }

              .info-price-price {
                color: #069FEF;
                font-size: 18px;
              }
            }

            .info-progress {
              line-height: 25px;
              color: #818181;
              display: flex;
              justify-content: space-between;
              align-items: center;

              /deep/ .van-progress {
                width: 70%;
                height: 12px;
                border-radius: 10px;
              }
            }
          }
        }
      }

      // 商品信息

      .goods-info {
        padding: 10px;
        font-size: 14px;

        .displayFlex {
          display: flex;
        }

        .starting-price {
          margin-bottom: 10px;
        }

        .price, .amount {
          width: 50%;
        }
      }

      // 我的竞价

      .order-bidding-state {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .bidding-state {
          color: #2EAEF2;
          font-size: 14px;
        }
      }

      .my-biddingPrice {
        font-size: 14px;
        padding: 10px;

        p.right {
          color: #7B7B7B;
        }

        .mybidding-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .auction-inp {
          background: #EFEFEF;
          display: flex;
          padding: 7px 10px;
          border-radius: 7px;
          width: 45%;
          justify-content: space-between;

          input {
            background: transparent;
            width: 70%;
          }

          p {
            color: #8A8A8A;
          }
        }

        .auction-number {
          padding: 0 0 13px;
        }

        .auction-price, .auction-orderNumber {
          padding: 13px 0;

          .tips {
            display: flex;
            justify-content: flex-end;
            padding: 10px 0 0;
            font-size: 12px;
            color: #B0B0B0;
          }
        }

        .auction-orderPrice, .auction-oildepot {
          padding: 13px 0 13px;

          .order-allPrice {
            color: #21A9F1;

            span {
              font-size: 16px;
            }
          }
        }
      }

      // 竞拍说明

      .auction-description {
        padding: 10px;

        .instr-content {
          padding: 0 0 10px;
          text-align: center;
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-radius: 10px;

          .instr-item {
            img {
              display: inline-block;
              height: 45px;
              width: 45px;
              margin-bottom: 5px;
            }
          }
        }

        .description-info {
          padding: 10px 0 0;
          word-break: break-all;
          line-height 15px;
        }
      }
    }

    .bidding-results {
      padding: 10px;

      .t-head, .t-body {
        padding: 10px 0;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .ranking {
          width: 50px;
        }

        .price {
          width: 60px;
        }

        .number {
          width: 60px;
        }

        .time {
          width: 160px;
        }
      }
    }

    .submit-btns {
      bottom: -153px;
      background: #fff;
      display: flex;
      justify-content: space-around;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 10px;

      .btn {
        border: 1px solid #DDDDDD;
        border-radius: 20px;
        width: 47%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 16px;
      }

      .again-btn {
        color: #0097EE;
        border-color: #0097EE;
      }

      .confirmation-btn {
        background: #0097EE;
        color: #fff;
      }
    }
  }
</style>

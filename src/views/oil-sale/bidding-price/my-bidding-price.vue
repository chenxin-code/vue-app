<template>
  <div>
    <nav-top title="我的竞价" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="myBidding-index">
      
      <div class="myBidding-tabbar">
        <p :class="tabBarIndex == item.state ? 'active' : ''" v-for="(item, index) in tabbarList" :key="index"
           @click="tabBarHandle(item)">
          {{item.name}}</p>
      </div>
      <div class="myBindding-content">
        <!-- 竞价中 -->
        <div class="bidding-list">
          <div class="list-item" v-for="(item, index) in biddingPriceList" :key="index">
            <!-- 竞价中 -->
            <div class="item-time" v-if="tabBarIndex == 2 && biddingState != index">
              <p>竞价倒计时</p>
              <countdown
                :endTime="item.oilSaleActivityDetailModel.endDate ? $util.getDateFromString(item.oilSaleActivityDetailModel.endDate): ''"
                type="theme_bg_black" @timeOut="timeOut(item, index)"/>
            </div>
            <div class="item-time" v-else-if="tabBarIndex == 2 && biddingState == index">
              <p>竞价计算中...</p>
            </div>
            <!-- 竞价成功 -->
            <div class="item-time" v-else-if="tabBarIndex == 1 && item.isConfirm != 0">
              <p>竞价成功-{{item.isConfirm == 1 ? '确认完成' : ''}}</p>
            </div>
            <div class="item-time" v-else-if="tabBarIndex == 1 && item.isConfirm == 0">
              <p>竞价成功-确认倒计时</p>
              <countdown :endTime="item.endDateTimeout ? $util.getDateFromString(item.endDateTimeout): ''" type="theme_bg_black"
                         @timeOut="timeOut(item, index)"/>
            </div>
            <!-- 竞价失败 -->
            <div class="item-time" v-if="tabBarIndex == 0">
              <p>竞价失败</p>
            </div>
            <!-- 已取消 -->
            <div class="item-time" v-if="tabBarIndex == 3">
              <p v-if="item.isConfirm == -1">手动取消</p>
              <p v-else-if="item.isConfirm == -2">超时未确认</p>
              <p v-else>已取消</p>
            </div>
            <div :class="tabBarIndex == 1 ? 'item-info borderB' : 'item-info'" @click="biddingDetailsHandle(item)">
              <div class="left">
                <img src="./images/list-icon.png" alt/>
              </div>
              <div class="right">
                <div class="info-name">{{item.matertialName}}</div>
                <div class="info-price">
                  <p>
                    当前最高出价:
                    <span class="info-price-company">¥</span>
                    <span class="info-price-price">{{item.oilSaleActivityDetailModel.maxBidPrice}}</span>
                    <span class="info-price-company">元/吨</span>
                  </p>
                  <p>{{item.oilSaleActivityDetailModel.bidCnt || 0}}次出价</p>
                </div>
                <div class="info-progress" v-if="tabBarIndex == 2">
                  <van-progress
                    :percentage="(item.oilSaleActivityDetailModel.boughtTonnes/item.oilSaleActivityDetailModel.totalTonnes)*100 > 100 ? 100 : (item.oilSaleActivityDetailModel.boughtTonnes/item.oilSaleActivityDetailModel.totalTonnes)*100 ? (item.oilSaleActivityDetailModel.boughtTonnes/item.oilSaleActivityDetailModel.totalTonnes)*100 : 0"
                    stroke-width="15" :show-pivot="false"/>
                  <p
                    v-if="(item.oilSaleActivityDetailModel.boughtTonnes/item.oilSaleActivityDetailModel.totalTonnes)*100 > 100">
                    超出{{item.oilSaleActivityDetailModel.boughtTonnes - item.oilSaleActivityDetailModel.totalTonnes}}吨
                  </p>
                  <p v-else>
                    剩余{{(item.oilSaleActivityDetailModel.totalTonnes - item.oilSaleActivityDetailModel.boughtTonnes).toFixed(2) }}吨
                  </p>
                </div>
              </div>
            </div>
            <!-- 竞价成功-确认按钮 -->
            <div v-if="tabBarIndex == 1 && item.isConfirm == 0">
              <div class="bidding-success-btns"
                   v-if="$util.getDateFromString(item.endDateTimeout) > parseInt((new Date()).getTime() / 1000)">
                <p class="btn" @click="cancelOrderBtn(item)">取消订单</p>
                <p class="btn confirmation-btn" @click="confirmationBtn(item)">确认订单</p>
              </div>
              <div class="bidding-success-btns" v-else>
                <p>取消订单中...</p>
              </div>
            </div>
          </div>
        </div>
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
        tabbarList: [
          {
            name: '竞价中',
            state: 2
          }, {
            name: '竞价成功',
            state: 1
          }, {
            name: '竞价失败',
            state: 0
          }, {
            name: '已取消',
            state: 3
          }
        ],
        tabBarIndex: '2',
        biddingPriceList: [],
        biddingState: ''
      }
    },
    components: {
      countdown
    },
    mounted() {
      this.getData()
    },
    methods: {
      timeOut(item, index) {
        console.log(item, index)
        this.biddingState = index
      },
      getData() {
        this.$Loading.open()
        this.$request.post('/app/json/app_oil_sale/queryBidActivityRecordList', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId,
          state: this.tabBarIndex
        }).then(res => {
          if (res.status === 0) {
            this.$Loading.close()
            this.biddingPriceList = res.data
            console.log(this.biddingPriceList)
          } else {
            this.$Toast(res.info)
          }
        })
      },
      tabBarHandle(item) {
        if (this.tabBarIndex != item.state) {
          this.biddingPriceList = []
        }
        this.tabBarIndex = item.state
        this.getData()
      },
      // 竞价中  详情
      biddingDetailsHandle(item) {
        let url = ''
        if (this.tabBarIndex == 2) {
          url = '/bidding-details'
        } else {
          url = '/bidding-order-details'
        }
        this.$router.push({
          path: url,
          query: {
            biddingData: JSON.stringify(item),
            tabBarIndex: this.tabBarIndex
          }
        })
      },
      // 竞价成功 - 取消订单
      cancelOrderBtn(item) {
        this.$request.post('/app/json/app_oil_sale/cancelSuccessBidOrder', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId,
          id: item.id
        }).then(res => {
          if (res.status === 0) {
            this.getData()
          } else {
            this.$Toast(res.info)
          }
        })
      },
      // 竞价成功 - 确认订单
      confirmationBtn(item) {
        this.$router.push({
          path: '/bidding-confirmation-order',
          query: {
            biddingData: JSON.stringify(item)
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
  
  .myBindding-index {
    height: 100%;
    padding-bottom: 50px;
  }
  
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .myBidding-tabbar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 14px;
    height: 30px;
    background: #fff;
    
    p {
      line-height: 30px;
      padding: 0 10px;
      box-sizing: content-box;
      border-bottom: 2px solid transparent;
    }
    
    p.active {
      color: #059EEF;
      border-bottom: 2px solid #059EEF;
    }
  }
  
  .myBindding-content {
    height: 100%;
    padding-bottom: 50px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .nodata-box {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    font-size: 16px;
  }
  
  .bidding-list {
    padding: 0 10px;
    
    .borderB {
      border-bottom: 1px solid #F1F1F1;
      padding-bottom: 10px !important;
    }
    
    .list-item {
      padding: 10px;
      margin: 15px 0;
      border-radius: 5px;
      box-shadow: 0px 0px 5px #eaeaea;
      background: #fff;
      
      .item-time {
        border-bottom: 1px solid #ececec;
        display: flex;
        padding: 0 0 10px;
        font-size: 14px;
        align-items: center;
        
        p {
          margin-right: 10px;
        }
        
        .time {
          .time-item {
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 5px 2px;
            border-radius: 4px;
            margin: 0 5px;
          }
        }
      }
      
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
      
      .bidding-success-btns {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 10px 0 0;
        
        .btn {
          border: 1px solid #ccc;
          border-radius: 20px;
          padding: 5px 10px;
          margin-left: 15px;
        }
        
        .confirmation-btn {
          color: #0097EE;
          border-color: #0097EE;
        }
      }
    }
  }
</style>

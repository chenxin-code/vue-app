<template>
  <div>
    <nav-top title="竞价列表" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="biddingPrice-content">
      <div class="bg-img">
        <p class="title">竞价活动</p>
        <div class="my-biddingPrice">
          <p class="bgc"></p>
          <p class="txt" @click="myBiddingPrice">我的竞价</p>
        </div>
        <img src="./images/banner-bg.png" alt/>
      </div>
      <div class="bidding-list">
        <div class="list-item" v-for="(item, index) in biddingPriceList" :key="index"
             @click="bindingPriceListHandle(item)">
          <div class="item-time" v-if="timeDiff(item) < 0">
            <p>竞价倒计时</p>
            <countdown :endTime="item.endDate ? $util.getDateFromString(item.endDate) : ''" type="theme_bg_black"
                       @timeOut="timeOut"/>
          </div>
          <div class="item-time">
            <p>距活动开始</p>
            <countdown :endTime="item.startDate ? $util.getDateFromString(item.startDate) : ''" type="theme_bg_black"
                       @timeOut="timeOut"/>
          </div>
          <div class="item-info">
            <div class="left">
              <img src="./images/list-icon.png" alt/>
            </div>
            <div class="right">
              <div class="info-name">{{item.matertialName}}</div>
              <div class="info-price">
                <p>
                  当前最高出价:
                  <span class="info-price-company">¥</span>
                  <span
                    class="info-price-price">{{item.maxBidPrice ? item.maxBidPrice.toFixed(2) : 0.00}}</span>
                  <span class="info-price-company">元/吨</span>
                </p>
                <p>{{item.bidCnt || 0}}次出价</p>
              </div>
              <div class="info-progress">
                <van-progress
                  :percentage="((item.boughtTonnes/item.totalTonnes)*100) > 100 ? 100 : ((item.boughtTonnes/item.totalTonnes)*100)"
                  stroke-width="15" :show-pivot="false"/>
                <p v-if="(item.boughtTonnes/item.totalTonnes)*100 > 100">
                  超出{{item.boughtTonnes - item.totalTonnes}}吨</p>
                <p v-else>剩余{{item.totalTonnes - item.boughtTonnes }}吨</p>
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
        biddingPriceList: []
      }
    },
    mounted() {
      this.getData()
    },
    components: {
      countdown
    },
    methods: {
      timeDiff(item) {
        return this.$util.getDateFromString(item.startDate) - parseInt(this.$util.getDataString() / 1000)
      },
      timeOut() {

      },
      getData() {
        this.$request.post('/app/json/app_oil_sale/getBidOilSaleActivityList', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId
        }).then(res => {
          if (res.status === 0) {
            this.biddingPriceList = res.data
          } else {
            this.$Toast(res.info)
          }
        })
      },
      // 我的竞价
      myBiddingPrice() {
        this.$router.push({path: '/my-bidding-price'})
      },
      // 竞价列表
      bindingPriceListHandle(item) {
        this.$router.push({path: '/bidding-details', query: {biddingData: JSON.stringify(item)}})
      }
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  @import '~@/common/stylus/variable.styl';
  
  .biddingPrice-content {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    
    .bg-img {
      position: relative;
      
      .title {
        position: absolute;
        left: 30px;
        top: 50px;
        font-size: 30px;
        color: #fff;
      }
      
      .my-biddingPrice {
        position: absolute;
        top: 20px;
        right: -15px;
        
        .bgc {
          width: 100px;
          height: 32px;
          background: #000;
          border-radius: 15px;
          opacity: 0.3;
        }
        
        .txt {
          position: absolute;
          width: 100px;
          line-height: 33px;
          top: 0;
          text-align: center;
          font-size: 16px;
          color: #d8d8d8;
        }
      }
      
      img {
        width: 100%;
      }
    }
    
    .bidding-list {
      padding: 10px;
      
      .list-item {
        padding: 10px;
        margin: 15px 10px;
        border-radius: 5px;
        box-shadow: 0px 0px 5px #eaeaea;
        position: relative;
        top: -50px;
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
          
          .time-item {
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 5px 2px;
            border-radius: 4px;
            margin: 0 5px;
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
                width: 65%;
                height: 12px;
                border-radius: 10px;
              }
            }
          }
        }
      }
    }
  }
</style>
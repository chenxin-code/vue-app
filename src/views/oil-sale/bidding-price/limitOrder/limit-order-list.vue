<template>
  <div>
    <nav-top title="限价抢单" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="limitOrder-index">
      <div class="limitOrder-content">
        <div class="limitOrder-list">
          <div class="list-item" v-for="(item, index) in limitOrderList" :key="index">
            <div class="item-time" v-if="timeDiff(item) < 0">
              <p>限价抢单倒计时</p>
              <countdown :endTime="item.endDate ? $util.getDateFromString(item.endDate): ''" type="theme_bg_black"
                         @timeOut="timeOut"/>
            </div>
            <div class="item-time" v-else>
              <p>距活动开始</p>
              <countdown :endTime="item.startDate ? $util.getDateFromString(item.startDate) : ''" type="theme_bg_black"
                         @timeOut="timeOut"/>
            </div>
            <div class="item-info">
              <div class="left">
                <img src="../images/list-icon.png" alt/>
              </div>
              <div class="center">
                <div class="info-name">{{item.matertialName}}</div>
                <div class="info-price">
                  <p>
                    <span class="info-price-company">¥</span>
                    <span class="info-price-price">{{item.discountPrice}}</span>
                    <span class="info-price-company">元/吨起</span>
                  </p>
                </div>
                <div class="info-progress">
                  <van-progress
                    :percentage="(item.boughtTonnes/item.totalTonnes)*100 > 100 ? 100 : (item.boughtTonnes/item.totalTonnes)*100 ? (item.boughtTonnes/item.totalTonnes)*100 : 0"
                    stroke-width="15" :show-pivot="false"/>
                  <p v-if="(item.boughtTonnes/item.totalTonnes)*100 > 100">
                    超出{{item.boughtTonnes - item.totalTonnes}}吨
                  </p>
                  <p v-else>
                    剩余{{item.totalTonnes - item.boughtTonnes }}吨
                  </p>
                </div>
              </div>
              <div class="right">
                <p class="limitOrder-btn" @click="limitOrderHandle(item)">立即抢单</p>
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
        limitOrderList: []
      }
    },
    components: {
      countdown
    },
    mounted() {
      this.getData()
    },
    methods: {
      timeDiff(item) {
        return this.$util.getDateFromString(item.startDate) - parseInt(this.$util.getDataString() / 1000)
      },
      getData() {
        this.$Loading.open()
        this.$request.post('/app/json/app_oil_sale/getGrabPriceOilSaleActivityList', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId,
        }).then(res => {
          if (res.status === 0) {
            this.$Loading.close()
            this.limitOrderList = res.data
            // this.biddingPriceList = res.data
            // console.log(this.biddingPriceList)
          } else {
            this.$Toast(res.info)
          }
        })
      },
      timeOut() {

      },
      limitOrderHandle(item) {
        this.$router.push({
          path: '/limit-order-details',
          query: {
            orderItemData: JSON.stringify(item)
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
  
  .limitOrder-content {
    height: 100%;
    padding-bottom: 50px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .limitOrder-list {
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
        
        .center {
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
              width: 60%;
              height: 12px;
              border-radius: 10px;
              background: #bbcffc;
            }
          }
        }
        
        .right {
          display: flex;
          align-items: center;
          padding: 0 10px;
          
          .limitOrder-btn {
            background: #1989fa;
            padding: 8px 10px;
            color: #fff;
            border-radius: 4px;
          }
        }
      }
    }
  }
</style>
<template>
  <div>
    <nav-top title="竞价详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="biddingDetails-index">
      <div class="bidding-content">
        <!-- 竞价状态 -->
        <div class="list-item boxShadow">
          <div class="bidding-state">
            <p class="state-info">竞价中</p>
            <div class="end-time" v-if="biddingState && timeDiff(activityData) < 0">
              <p>距竞价结束</p>
              <countdown :endTime="activityData.endDate ? $util.getDateFromString(activityData.endDate) : ''"
                         type="theme_bg_blue" @timeOut="timeOut"/>
            
            </div>
            <div class="end-time" v-else-if="biddingState && timeDiff(activityData) > 0">
              <p>距活动开始</p>
              <countdown :endTime="activityData.startDate ? $util.getDateFromString(activityData.startDate) : ''"
                         type="theme_bg_blue" @timeOut="timeOut"/>
            </div>
            <div class="end-time" v-else>
              <p>竞价计算中...</p>
            </div>
          </div>
          <div class="item-info">
            <div class="left">
              <img src="./images/list-icon.png" alt/>
            </div>
            <div class="right">
              <div class="info-name">{{biddingData.matertialName}}</div>
              <div class="info-price">
                <p v-if="activityData.bidCnt != 0">
                  当前最高出价:
                  <span class="info-price-company">¥</span>
                  <span
                    class="info-price-price">{{activityData.maxBidPrice ? activityData.maxBidPrice.toFixed(2) : 0.00}}</span>
                  <span class="info-price-company">元/吨</span>
                </p>
                <p v-else>
                  起拍价:
                  <span class="info-price-company">¥</span>
                  <span class="info-price-price">{{activityData.priceLowerLimit}}</span>
                  <span class="info-price-company">元/吨</span>
                </p>
                <p>{{activityData.bidCnt || 0}}次出价</p>
              </div>
              <div class="info-progress">
                <van-progress
                  :percentage="(activityData.boughtTonnes/activityData.totalTonnes)*100 > 100 ? 100 : (activityData.boughtTonnes/activityData.totalTonnes)*100 ? (activityData.boughtTonnes/activityData.totalTonnes)*100 : 0"
                  stroke-width="15" :show-pivot="false"/>
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
        <!-- 我的竞价 -->
        <p class="title">我的竞价</p>
        <div class="my-biddingPrice boxShadow ">
          <div class="auction-number borderB mybidding-display">
            <p class="right">竞拍数量</p>
            <div class="auction-inp">
              <input type="number" v-model="b_tonnes" @blur="tonnesHandle" @input="tonnesInp">
              <p>吨</p>
            </div>
          </div>
          <div class="auction-price borderB ">
            <div class="mybidding-display">
              <p class="right">竞拍单价</p>
              <div class="auction-inp">
                <input type="number" v-model="b_price" @blur="priceHandle" @input="priceInp">
                <p>元/吨</p>
              </div>
            </div>
            <p class="tips">价格排名靠前的,拥有订单的优先成交权</p>
          </div>
          <div class="auction-orderNumber borderB mybidding-display" v-if="false">
            <p class="right">订单号</p>
            <p class="order-number">{{biddingData.id}}</p>
          </div>
          <div class="auction-orderPrice mybidding-display">
            <p class="right">订单总金额</p>
            <p class="order-allPrice">
              ¥
              <span>{{b_tonnes * b_price || 0.00}}</span>
            </p>
          </div>
        
        </div>
        
        <!-- 竞拍说明 -->
        <p class="title">竞拍说明</p>
        <div class="auction-description boxShadow">
          <div class="instr-content borderB">
            <div class="instr-item">
              <img src="./images/auction-start.png" alt/>
              <p>出价竞拍</p>
            </div>
            <div class="instr-item">
              <img src="./images/auction-success.png" alt/>
              <p>竞拍成功</p>
            </div>
            <div class="instr-item">
              <img src="./images/auction-order.png" alt/>
              <p>确认订单</p>
            </div>
            <div class="instr-item">
              <img src="./images/auction-over.png" alt/>
              <p>完成支付</p>
            </div>
          </div>
          <div class="description-info">
            {{biddingData.activityDesc}}
          </div>
        </div>
      </div>
      <div v-if="timeDiff(activityData) < 0">
        <div class="submit-btns" v-if="btnShow">
          <div class="submitBidding" @click="submitBiddingBtn">提交竞拍</div>
        </div>
        <div class="submit-btns" v-else-if="!btnShow && biddingState">
          <div class="cancel-btn btn" @click="cancelBiddingBtn">取消竞拍</div>
          <div :class="againBidding ? 'again-btn btn' : 'again-btn-ccc btn'" @click="againBiddingBtn">重新竞拍</div>
        </div>
        <div class="submit-btns" v-else>
          <p class="biddingOverTips">竞价计算中...</p>
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
        biddingData: {}, // 竞价信息
        activityData: {}, // 活动信息
        RecordModelData: {}, // 活动信息 - 详情
        tabBarIndex: '',
        b_tonnes: '',
        b_price: '',
        btnShow: true, // true提交 false取消/重新
        againBidding: false,
        biddingState: true
      }
    },
    components: {
      countdown
    },
    mounted() { // tabBarIndex 2竞价中 1成功 0失败 3取消
      this.tabBarIndex = this.$route.query.tabBarIndex
      if (this.tabBarIndex == 2) {
        this.biddingData = JSON.parse(this.$route.query.biddingData)
        this.activityData = this.biddingData.oilSaleActivityDetailModel
        this.b_tonnes = this.biddingData.tonnes || ''
        this.b_price = this.biddingData.price || ''
        if (this.biddingData.state == 2) {
          this.btnShow = false
        }
      } else {
        this.biddingData = JSON.parse(this.$route.query.biddingData)
        console.log(this.biddingData)
        this.RecordModelData = this.biddingData.oilSaleActivityRecordModel
        this.b_tonnes = this.RecordModelData.tonnes || ''
        this.b_price = this.RecordModelData.price || ''
        if (this.biddingData.state == 2) {
          this.btnShow = false
        }
        this.activityData = {...this.biddingData}
      }
    },
    methods: {
      timeDiff(item) {
        return this.$util.getDateFromString(item.startDate) - parseInt(this.$util.getDataString() / 1000)
      },
      timeOut() {
        this.biddingState = false
      },
      tonnesHandle() {
        if (this.tabBarIndex == 2) {
          if (this.b_tonnes < this.activityData.tonnesLowerLimit || this.b_tonnes > this.activityData.tonnesUpperLimit) {
            this.b_tonnes = this.biddingData.tonnes || ''
            this.againBidding = false
          } else if (this.b_tonnes != this.biddingData.tonnes) {
            this.againBidding = true
          }
        } else {
          if (this.b_tonnes < this.activityData.tonnesLowerLimit || this.b_tonnes > this.activityData.tonnesUpperLimit) {
            this.b_tonnes = this.RecordModelData.tonnes || ''
            this.againBidding = false
          } else if (this.b_tonnes != this.RecordModelData.tonnes) {
            this.againBidding = true
          }
        }
      },
      tonnesInp(val) {
        let tonnes = val.target.value
        if (this.b_tonnes < this.activityData.tonnesLowerLimit || this.b_tonnes > this.activityData.tonnesUpperLimit) {
          this.againBidding = false
        } else {
          if (this.tabBarIndex == 2) {
            if (this.b_tonnes == this.biddingData.tonnes) {
              this.againBidding = false
            } else {
              this.againBidding = true
            }
          } else {
            if (this.b_tonnes == this.RecordModelData.tonnes) {
              this.againBidding = false
            } else {
              this.againBidding = true
            }
          }
        }
      },
      priceInp(val) {
        let price = val.target.value
        if (this.b_price < this.activityData.priceLowerLimit || this.b_price > this.activityData.priceUpperLimit) {
          this.againBidding = false
        } else {
          if (this.tabBarIndex == 2) {
            if (this.b_price == this.biddingData.price) {
              this.againBidding = false
            } else {
              this.againBidding = true
            }
          } else {
            if (this.b_price == this.RecordModelData.price) {
              this.againBidding = false
            } else {
              this.againBidding = true
            }
          }
        }
      },
      priceHandle() {
        if (this.tabBarIndex == 2) {
          if (this.b_price < this.activityData.priceLowerLimit || this.b_price > this.activityData.priceUpperLimit) {
            this.b_price = this.biddingData.price || ''
            this.againBidding = false
          } else if (this.b_price != this.biddingData.price) {
            this.againBidding = true
          }
        } else {
          if (this.b_price < this.activityData.priceLowerLimit || this.b_price > this.activityData.priceUpperLimit) {
            this.b_price = this.RecordModelData.price || ''
            this.againBidding = false
          } else if (this.b_price != this.biddingData.price) {
            this.againBidding = true
          }
        }
      },
      // 提交竞价
      submitBiddingBtn() {
        if (!this.b_tonnes || !this.b_price) {
          this.$Toast('请填写范围内的的竞价数量/单价')
          return
        }
        let params = {
          tonnes: this.b_tonnes,
          price: this.b_price,
          activityId: this.biddingData.activityId,
          activityDetailId: this.biddingData.id,
          skuId: this.biddingData.skuId,
          matertialName: this.biddingData.matertialName,
          matertialCode: this.biddingData.matertialCode,
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId
        }
        if (this.tabBarIndex == 2) {
          params.activityDetailId = this.activityData.id
        }
        this.$request.post('/app/json/app_oil_sale/submitBidOilSaleActivityOrder', params).then(res => {
          if (res.status === 0) {
            this.$Toast('参与竞价成功!')
            this.$router.go(-1)
          } else {
            this.$Toast(res.info)
          }
        })
      },
      // 取消竞拍
      cancelBiddingBtn() {
        let params = {
          id: this.RecordModelData.id,
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId
        }
        if (this.tabBarIndex == 2) {
          params.id = this.biddingData.id
        }
        this.$request.post('/app/json/app_oil_sale/cancelBidOilSaleActivityOrder', params).then(res => {
          if (res.status === 0) {
            this.$Toast('已取消参与竞价')
            this.$router.go(-1)
          } else {
            this.$Toast(res.info)
          }
        })
      },

      // 重新竞拍
      againBiddingBtn() {
        if (this.againBidding) {
          this.submitBiddingBtn()
        }
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
    
    .bidding-content {
      padding: 10px;
      
      // 竞价状态
      
      .list-item {
        padding: 10px;
        margin: 5px 0 15px;
        
        .bidding-state {
          border-bottom: 1px solid #ececec;
          display: flex;
          justify-content: space-between;
          padding: 0 0 10px;
          font-size: 14px;
          align-items: center;
          
          .end-time {
            display: flex;
            border: 1px solid #009CEF;
            /* padding: 5px 10px; */
            border-radius: 20px;
            align-items: center;
            
            p {
              padding: 5px 10px;
              background: #009CEF;
              color: #fff;
              border-radius: 20px;
            }
            
            .time {
              padding: 5px 10px;
              color: #009CEF;
              
              span {
                font-weight: bold;
              }
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
        
        .auction-orderPrice {
          padding: 13px 0 0;
          
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
        }
      }
    }
    
    .submit-btn {
      position: absolute;
      left: 10px;
      right: 10px;
      height: 40px;
      background: #009CEF;
      bottom: -90px;
      border-radius: 18px;
      font-size: 18px;
      text-align: center;
      line-height: 40px;
      color: #fff;
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
      
      .biddingOverTips {
        line-height: 30px;
        font-size: 14px;
      }
      
      .submitBidding {
        width: 100%;
        height: 40px;
        background: #009CEF;
        bottom: -90px;
        border-radius: 18px;
        font-size: 18px;
        text-align: center;
        line-height: 40px;
        color: #fff;
      }
      
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
      
      .again-btn-ccc {
        color: #ccc;
        border-color: #ccc;
      }
      
      .confirmation-btn {
        background: #0097EE;
        color: #fff;
      }
    }
  }
</style>
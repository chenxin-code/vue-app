<template>
  <div>
    <nav-top title="待确定" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="limitOrder-index">
      <div class="limitOrder-content">
        <div class="limitOrder-details">
          <!-- 限价抢单 -->
          <div class="list-item boxShadow">
            <div class="bidding-state">
              <p class="state-info">限价抢单中</p>
              <div class="end-time" v-if="timeDiff(orderItemData) < 0">
                <p>距抢单结束</p>
                <countdown :endTime="orderItemData.endDate ? $util.getDateFromString(orderItemData.endDate): ''"
                           type="theme_bg_blue" @timeOut="timeOut"/>
              </div>
              <div class="end-time" v-else>
                <p>距活动开始</p>
                <countdown :endTime="orderItemData.startDate ? $util.getDateFromString(orderItemData.startDate): ''"
                           type="theme_bg_blue" @timeOut="timeOut"/>
              </div>
            </div>
            <div class="item-info">
              <div class="left">
                <img src="../images/list-icon.png" alt/>
              </div>
              <div class="right">
                <div class="info-name">{{orderItemData.matertialName}}</div>
                <div class="info-price">
                  <p>
                    <span class="info-price-company">¥</span>
                    <span class="info-price-price">{{orderItemData.discountPrice}}</span>
                    <span class="info-price-company">元/吨起</span>
                  </p>
                </div>
                <div class="info-progress">
                  <van-progress
                    :percentage="(orderItemData.boughtTonnes/orderItemData.totalTonnes)*100 > 100 ? 100 : (orderItemData.boughtTonnes/orderItemData.totalTonnes)*100 ? (orderItemData.boughtTonnes/orderItemData.totalTonnes)*100 : 0"
                    stroke-width="15" :show-pivot="false"/>
                  <p v-if="(orderItemData.boughtTonnes/orderItemData.totalTonnes)*100 > 100">
                    超出{{orderItemData.boughtTonnes - orderItemData.totalTonnes}}吨
                  </p>
                  <p v-else>
                    剩余{{orderItemData.totalTonnes - orderItemData.boughtTonnes }}吨
                  </p>
                </div>
              </div>
            </div>
          </div>
          <!-- 限价阶梯 -->
          <div class="title-box">
            <img src="../images/div-line-left.png" alt="" width="60">
            <p class="title">限价阶梯</p>
            <img src="../images/div-line-right.png" alt="" width="60">
          </div>
          <div class="price-ladder boxShadow">
            <p class="ladder-description borderB">从第1档开始，当第1挡价格对应的库存售空，立即按照第2档的单价进行销售，依次类推，下单越早优惠越大！！</p>
            <div class="t-head borderB">
              <p class="activityPrice">活动单价</p>
              <p class="activityStock">活动库存</p>
              <p class="number">剩余数量</p>
              <p class="currentState">当前状态</p>
            </div>
            <div :class="item.totalTonnes !=item.boughtTonnes ? 't-body' : 't-body borderB t-body-ccc'"
                 v-for="(item, index) in orderItemData.detailList" :key="index">
              <p class="activityPrice">{{item.discountPrice}}元/吨</p>
              <p class="activityStock">{{item.totalTonnes}}吨</p>
              <p class="number">{{item.totalTonnes - item.boughtTonnes}}吨</p>
              <p class="currentState">{{item.totalTonnes == item.boughtTonnes ? '已抢光' : '进行中'}}</p>
            </div>
          </div>
          <!-- 我要购买 -->
          <div class="title-box">
            <img src="../images/div-line-left.png" alt="" width="60">
            <p class="title">我要购买</p>
            <img src="../images/div-line-right.png" alt="" width="60">
          </div>
          <div class="buy-number boxShadow">
            <div class="auction-number mybidding-display">
              <p class="right">购买数量</p>
              <div class="auction-inp">
                <input type="number" v-model="t_tonnes" placeholder="请输入购买吨数">
                <p>吨</p>
              </div>
            </div>
          </div>
          <!-- 限价抢单说明 -->
          <div class="title-box">
            <img src="../images/div-line-left.png" alt="" width="60">
            <p class="title">限价抢单说明</p>
            <img src="../images/div-line-right.png" alt="" width="60">
          </div>
          <div class="auction-description boxShadow">
            <div class="instr-content borderB">
              <div class="instr-item">
                <span>1</span>
                <p>出价竞拍</p>
              </div>
              <div class="instr-item">
                <span>2</span>
                <p>竞拍成功</p>
              </div>
              <div class="instr-item">
                <span>3</span>
                <p>确认订单</p>
              </div>
              <div class="instr-item">
                <span>4</span>
                <p>完成支付</p>
              </div>
            </div>
            <div class="description-info">
              {{orderItemData.activityDesc}}
            </div>
          </div>
          
          <!-- 确认抢单 -->
          <div class="submit-btns" v-if="timeDiff(orderItemData) < 0">
            <div class="submitBidding" @click="submitlimitOrderBtn">确认抢单</div>
          </div>
        </div>
      </div>
      <div class="submit-dialog">
        <van-dialog v-model="showDialog" show-cancel-button cancelButtonText="调整数量" confirmButtonText="确认抢单"
                    @cancel="showDialog = false" @confirm="confirm">
          <div class="content">当前购买数量为{{t_tonnes}}吨，确认抢单之后，立即生成订单，切不可手动取消，是否确认抢单？</div>
        </van-dialog>
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
        showDialog: false,
        orderItemData: {},
        t_tonnes: '', // 购买数量
      }
    },
    components: {
      countdown
    },
    mounted() {
      this.orderItemData = JSON.parse(this.$route.query.orderItemData)
    },
    methods: {
      timeDiff(item) {
        return this.$util.getDateFromString(item.startDate) - parseInt(this.$util.getDataString() / 1000)
      },
      timeOut() {

      },
      submitlimitOrderBtn() {
        this.showDialog = true
      },
      confirm() {
        this.$request.post('/app/json/app_oil_sale/submitGrabPriceOilSaleActivityOrder', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId,
          tonnes: this.t_tonnes,
          price: this.orderItemData.discountPrice,
          skuId: this.orderItemData.skuId,
          activityId: this.orderItemData.activityId
        }).then(res => {
          if (res.status === 0) {
            // this.getData()
            this.$router.push({
              path: '/limit-order-result',
              query: {
                resultData: JSON.stringify(res.data)
              }
            })
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
  
  .limitOrder-index {
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
    
    .title-box {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0 10px;
      
      p.title {
        font-size: 14px;
        padding: 0 15px;
      }
    }
    
    .borderB {
      border-bottom: 1px solid #F1F1F1;
    }
    
    .limitOrder-content {
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
      
      // 限价阶梯
      
      .price-ladder {
        padding: 10px;
        margin: 5px 0 15px;
        
        .ladder-description {
          line-height: 20px;
          padding-bottom: 8px;
        }
        
        .t-head, .t-body {
          padding: 10px 0;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: space-between;
          
          .activityPrice {
            width: 80px;
          }
          
          .activityStock {
            width: 80px;
          }
          
          .number {
            width: 80px;
          }
          
          .currentState {
            width: 80px;
          }
        }
        
        .t-body-ccc {
          color: #ccc;
        }
      }
      
      // 我要购买
      
      .buy-number {
        padding: 10px;
        margin: 5px 0 15px;
        
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
          width: 60%;
          justify-content: space-between;
          
          input {
            background: transparent;
            width: 70%;
          }
          
          p {
            color: #8A8A8A;
          }
        }
      }
      
      // 限价抢单说明
      
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
            span {
              width: 17px;
              height: 17px;
              line-height: 18px;
              background: #92bdf3;
              color: #fff;
              display: inline-block;
              text-align: center;
              border-radius: 20px;
              margin-bottom: 10px;
            }
            
            p {
              font-size: 14px;
            }
          }
        }
        
        .description-info {
          padding: 10px 0 0;
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
      }
    }
    
    .submit-dialog {
      /deep/ .van-dialog__content {
        padding: 25px 20px;
        line-height: 22px;
        text-align: center;
      }
    }
  }
</style>
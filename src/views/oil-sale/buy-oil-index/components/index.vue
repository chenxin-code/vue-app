<template>
  <div class="index">
    <div class="show-img">
      <img src="../../assets/image/banner2.png" alt="">
    </div>
    <div class="index-info">
      <!-- 抢单 -->
      <div class="activity" v-if="grabOilList.length">
        <div class="title" @click="openGrabBillList">
          <div class="left">抢单活动</div>
          <div class="right">全部抢单</div>
        </div>
        <div class="grab-oil-activity-info">
          <div class="info" v-for="(item, index) in grabOilList" :key="index">
            <div class="activity-left">
              <div class="left-title">{{item.matertialName}}</div>
              <div class="money">￥{{item.discountPrice}}/t</div>
            </div>
            <div class="activity-center">
              <div class="tips">
                剩{{item.remainTonnes || item.remainTonnes == 0 ? item.remainTonnes : item.totalTonnes}}t
              </div>
              <van-progress v-if="item.remainTonnes == 0 || item.totalTonnes == 0" :percentage='100'
                            :show-pivot="showPivot"/>
              <van-progress v-else :percentage="calculateProgress(item.remainTonnes, item.totalTonnes)"
                            :show-pivot="showPivot"/>
            </div>
            <div class="activity-btn" @click="nowGrab(item)">
              <div class="btn" v-if="timeDiff(item) < 0"
                   :class="{'noClick': item.state === 0 || (item.limitCnt && item.limitCnt === item.attendCnt) || item.remainTonnes === 0}">
                立即抢单
              </div>
              <div v-else style="text-align: center;">
                <p>距活动开始:</p>
                <countdown
                  :endTime="item.startDate ? $util.getDateFromString(item.startDate): ''"
                  type="theme_bg_blue" @timeOut="timeOut"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 竞价 -->
      <div class="activity" v-if="$store.state.login.phone == 15709611048 && biddingPriceList.length">
        <!-- <div class="activity" v-if="true"> -->
        <div class="title">
          <div class="left">竞价活动</div>
          <div class="right" @click="biddingPriceAll">全部竞价</div>
        </div>
        <div class="grab-oil-activity-info">
          <div class="info" v-for="(item, index) in biddingPriceList" :key="index">
            <div class="activity-left">
              <div class="left-title">{{item.matertialName}}</div>
              <div class="money">￥{{item.priceLowerLimit}}/t</div>
            </div>
            <div class="activity-center">
              <div class="tips">
                {{item.remainTonnes || item.remainTonnes == 0 ? item.remainTonnes < 0 ? `超出${Math.abs(item.remainTonnes)}` :
                `剩余${item.remainTonnes}` : `剩${item.totalTonnes}`}}t
              </div>
              <van-progress v-if="item.remainTonnes == 0 || item.totalTonnes == 0" :percentage='100'
                            :show-pivot="showPivot"/>
              <van-progress v-else :percentage="calculateProgress(item.remainTonnes, item.totalTonnes)"
                            :show-pivot="showPivot"/>
            </div>
            <div class="activity-btn" @click="biddingHandle(item)">
              <div class="btn" v-if="timeDiff(item) < 0" :class="{'noClick': item.state === 0}">立即竞价</div>
              <div v-else style="text-align: center;">
                <p>距活动开始:</p>
                <countdown
                  :endTime="item.startDate ? $util.getDateFromString(item.startDate): ''"
                  type="theme_bg_blue" @timeOut="timeOut"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 限价抢单 -->
      <div class="activity" v-if="$store.state.login.phone == 15709611048 && limitOrderList.length">
        <div class="title">
          <div class="left">限价抢单活动</div>
          <div class="right" @click="limitOrderAll">全部限价</div>
        </div>
        <div class="grab-oil-activity-info">
          <div class="info" v-for="(item, index) in limitOrderList" :key="index">
            <div class="activity-left">
              <div class="left-title">{{item.matertialName}}</div>
              <div class="money">￥{{item.discountPrice}}/t</div>
            </div>
            <div class="activity-center">
              <div class="tips">
                {{item.remainTonnes || item.remainTonnes == 0 ? item.remainTonnes < 0 ? `超出${Math.abs(item.remainTonnes)}` :
                `剩余${item.remainTonnes}` : `剩${item.totalTonnes}`}}t
              </div>
              <van-progress v-if="item.remainTonnes == 0 || item.totalTonnes == 0" :percentage='100'
                            :show-pivot="showPivot"/>
              <van-progress v-else :percentage="calculateProgress(item.remainTonnes, item.totalTonnes)"
                            :show-pivot="showPivot"/>
            </div>
            <div class="activity-btn" @click="limitHandle(item)">
              <div class="btn" v-if="timeDiff(item) < 0" :class="{'noClick': item.attendCnt == item.limitCnt}">立即抢单</div>
              <div v-else style="text-align: center;">
                <p>距活动开始:</p>
                <countdown
                  :endTime="item.startDate ? $util.getDateFromString(item.startDate): ''"
                  type="theme_bg_blue" @timeOut="timeOut"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 撞单 -->
      <div class="activity" v-if="buyOilList.length">
        <div class="title">
          <div class="left">撞单活动</div>
        </div>
        <div class="buy-oil-activity-info">
          <horizontal-scroll :dataList="buyOilList" :click="false">
            <div class="content" v-for="(item, index) in buyOilList" :key="index">
              <div class="info">
                <div class="activity-title">
                  <div class="left-title">{{item.matertialName}} <span
                    class="num">{{item.tonnesLowerLimit}}t~{{item.tonnesUpperLimit}}t</span>
                  </div>
                </div>
                <div class="activity-btn" @click="openBuyBil(item, index)">
                  <div class="btn" :class="{'noClick': item.state == 1 || item.state == 2}">撞单</div>
                </div>
              </div>
            </div>
            <div class="content">
              <div class="info link" @click.stop="$router.push('/buy-bill-list')">
                                <span class="theme_font_bule">全部撞单 <span
                                  class="iconfont mall-gengduojiantou theme_font_bule"></span></span>
              </div>
            </div>
          </horizontal-scroll>
        </div>
      </div>
      <!-- 约单 -->
      <div class="activity" v-if="reserveActivityList.length">
        <div class="title">
          <div class="left">约单活动</div>
        </div>
        <div class="buy-oil-activity-info">
          <horizontal-scroll :dataList="reserveActivityList" :click="false">
            <div class="content" v-for="(item, index) in reserveActivityList" :key="index">
              <div class="info">
                <div class="activity-title">
                  <div class="left-title">{{item.matertialName}} <span
                    class="num">{{item.tonnesLowerLimit}}t~{{item.tonnesUpperLimit}}t</span>
                  </div>
                </div>
                <div class="activity-btn" @click="openAppointmentBill(item, index)">
                  <div class="btn" v-if="item.state == 2">取消约单</div>
                  <div class="btn" v-else :class="{'noClick': item.state == 0}">约单</div>
                </div>
                <div class="triangle-topright" v-if="item.state == 2">
                  <div class="tips">约单中</div>
                </div>
              </div>
            </div>
            <div class="content">
              <div class="info link" @click.stop="$router.push('/appointment-bill-list')">
                                <span class="theme_font_bule">全部约单 <span
                                  class="iconfont mall-gengduojiantou theme_font_bule"></span></span>
              </div>
            </div>
          </horizontal-scroll>
        </div>
      </div>
      <!-- 在售油品 -->
      <div class="activity" v-if="saleOilList.length">
        <div class="title">
          <div class="left">在售油品</div>
        </div>
        <div class="buy-oil-activity-info sale-oil">
          <div class="sale-content" v-for="(item, index) in saleOilList" :key="index"
               @click="openBatchBuyOil(item, index)">
            <div class="info">
              <div class="activity-title">
                <div class="left-title">{{item.matertialName}}</div>
                <div class="money">￥{{item.price}}元/t</div>
              </div>
              <div class="activity-btn">
                <div class="btn">购油</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="showTips" :close-on-click-overlay="overlay">
      <div class="tips-content">
        <div class="title">温馨提示</div>
        <div class="content">当前可参与次数{{numTipsInfo.limitCnt}}，已参与次数{{numTipsInfo.attendCnt}}，不可再参与！</div>
        <div class="btn-group">
          <div class="btn" @click="showTips = false">我知道了</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import {Dialog, Progress, Swipe, SwipeItem} from 'vant'
  import Scroll from '@/components/base/scroll/scroll'
  import HorizontalScroll from '@/components/base/horizontal-scroll/horizontal-scroll'
  import eventBus from '@/utils/eventBus.js'
  import {mapGetters} from 'vuex'
  import moment from 'moment';
  import countdown from "@/components/Vendor/countdown/countdown";

  export default {
    data() {
      return {
        limitOrderList: [], // 限价抢单
        biddingPriceList: [], // 竞价活动
        grabOilList: [], // 抢单活动
        buyOilList: [], // 撞单活动
        reserveActivityList: [], // 约单活动
        saleOilList: [], // 在售油品
        showPivot: false, // 进度条文字
        pageData: {},
        overlay: false, // 蒙版
        showTips: false,
        numTipsInfo: '' // 提示的参数
      }
    },
    mounted() {
      console.log(this.$store.state.globalConfig.oilsale_activity_notice_ahead_hours)
      console.log(
        moment(new Date()).add(1, 'h').diff(moment(new Date()), 's')
      )
      // setTimeout(()=>{
      //   console.log(moment(new Date()).add(1, 'h').format('YYYY/MM/DD HH:mm:ss'))
      // },1000)
      console.log(moment(new Date()).add(1, 'h').format('YYYY/MM/DD HH:mm:ss'))

      eventBus.$on('oilSaleHomeData', () => {
        this.getOilSaleHomeData()
      })
    },
    methods: {
      timeOut() {
        this.getOilSaleHomeData()
      },
      timeDiff(item) {
        return this.$util.getDateFromString(item.startDate) - parseInt(this.$util.getDataString() / 1000)
      },
      /**
       * 活动列表state
       * 撞单 1是参与成功，2是参与失败
       * 约单 2是约单中，0是有其他约单进行中，1是可以参与约单
       * 抢单 0是不能抢 其他都可以
       * 记录以及提交订单的state
       * 0参加活动失败 1参加活动成功 2待确认(约单) 3取消
       */
      getOilSaleHomeData() {
        this.$request.post('/app/json/app_oil_sale/getOilSaleHomeData', {
          vipUnitUserCode: this.vipUnitUser.vipUnitUserId
        }).then(res => {
          if (res.status === 0) {
            console.log(123)
            // 约单活动
            if (res.data.reserveActivityList && res.data.reserveActivityList.length) {
              let preResult = []
              let sufResult = []
              let list = res.data.reserveActivityList
              list.forEach(item => {
                if (item.state === 2) {
                  preResult.push(item)
                } else {
                  sufResult.push(item)
                }
              })
              let arr = [...preResult, ...sufResult]
              this.reserveActivityList = arr.slice(0, 4)
            }
            // 在售油品
            if (res.data.oilSalePriceList && res.data.oilSalePriceList.length) {
              this.saleOilList = res.data.oilSalePriceList
            }
            // 撞单活动
            if (res.data.hitActivityList && res.data.hitActivityList.length) {
              /*let preResult = []
              let sufResult = []
              let list = res.data.hitActivityList
              list.forEach(item => {
                  if (item.state === 1 || item.state === 2) {
                      sufResult.push(item)
                  } else {
                      preResult.push(item)
                  }
              })
              let arr = [...preResult, ...sufResult]
              this.buyOilList = arr.slice(0, 4)*/
              this.buyOilList = this.editShowList(res.data.hitActivityList)

            }
            // 抢单活动
            if (res.data.grabActivityList && res.data.grabActivityList.length) {
              this.grabOilList = this.editShowList(res.data.grabActivityList)

              /*let preResult = []
              let sufResult = []
              let list = res.data.grabActivityList
              list.forEach(item => {
                  if (item.state === 0) {
                      sufResult.push(item)
                  } else {
                      preResult.push(item)
                  }
              })
              let arr = [...preResult, ...sufResult]
              /!**
               * 设置显示在首页的抢单活动数量
               * 当超过2个时所有设置显示的活动都在首页显示
               * 一个也没有时默认显示两个
               * 有一个显示该活动在加一个后创建的活动
               *!/
                  // this.grabOilList = arr
              let isShowList = []
              let isNoShowList = []
              arr.forEach(item => {
                  if (item.isShow == 1) {
                      isShowList.push(item)
                  } else {
                      isNoShowList.push(item)
                  }
              })
              if (isShowList.length > 2 || isShowList.length == 2) {
                  this.grabOilList = isShowList
              } else if (isShowList.length == 1) {
                  this.grabOilList.push(isShowList[0])
                  if (isNoShowList.length) {
                      this.grabOilList.push(isNoShowList[0])
                  }
              } else if (!isShowList.length) {
                  this.grabOilList = arr.slice(0, 2)
              }
              this.grabOilList.forEach((item, index) => { // 将参与次数已满的放到最后
                  if (item.limitCnt === item.attendCnt || item.remainTonnes === 0) {
                      this.grabOilList.splice(index, 1)
                      this.grabOilList.push(item)
                  }
              })
              // console.log(isShowList.length)
              // console.log(isShowList)
              // console.log(isNoShowList)
              console.log(this.grabOilList)*/
            }
            // 竞价活动
            if (res.data.bidActivityList && res.data.bidActivityList.length) {
              this.biddingPriceList = this.editShowList(res.data.bidActivityList)
            }
            // 限价活动
            if (res.data.grabPriceActivityList && res.data.grabPriceActivityList.length) {
              this.limitOrderList = this.editShowList(res.data.grabPriceActivityList)
            }
            this.pageData = res.data
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
      // 设置展示的活动数量
      editShowList(list) {
        let showList = []
        let ShowArr = []
        let NotShow = []
        list.forEach(item => {
          if (item.isShow == 1) {
            ShowArr.push(item)
          } else {
            NotShow.push(item)
          }
        })
        if (ShowArr.length && ShowArr.length > 1) {
          showList = ShowArr
        } else {
          let arr = [...ShowArr, ...NotShow]
          showList = arr.slice(0, 2)
        }
        console.log(showList)
        return showList
      },
      calculateProgress(remainTonnes, totalTonnes) {
        if (remainTonnes && totalTonnes) {
          let calculateResult = 100 - ((remainTonnes / totalTonnes) * 100)
          return parseInt(calculateResult > 100 ? 100 : calculateResult)
        }
      },
      // 全部竞价
      biddingPriceAll() {
        this.$router.push({path: '/bidding-price-list'})
      },
      limitOrderAll() {
        this.$router.push({path: '/limit-order-list'})
      },
      bidActivityHandle(item) {
        console.log(item)
      },
      openBatchBuyOil(item) {
        // 打开批量购油 页面
        console.log(item)
        this.$router.push({path: '/batch-buy-oil', query: {batchBuyOilItem: JSON.stringify(item)}})
      },
      openGrabBillList() {
        // 打开抢单列表
        this.$router.push({path: '/grab-bill-list'})
      },
      nowGrab(item) {
        console.log(item)
        // 打开立即抢单页面
        if (item.remainTonnes === 0) {
          Dialog.alert({
            title: '提示',
            message: '已售空'
          }).then(() => {

          })
        } else if (item.limitCnt && item.limitCnt === item.attendCnt) {
          // 可参与 == 已参与
          this.numTipsInfo = item
          this.showTips = true
        } else if (item.state !== 0) {
          this.$router.push({path: '/grab-bill-details', query: {grabItem: JSON.stringify(item)}})
        }
      },
      openBuyBil(item) {
        // 打开撞单页面
        if (item.state != 1 && item.state != 2) {
          this.$router.push({path: '/buy-bill-details', query: {buyItem: JSON.stringify(item)}})
        }
      },
      openAppointmentBill(item) {
        // 打开约单页面
        if (item.state == 2) {
          // 取消约单按钮
          this.$dialog.confirm({message: '确定取消当前约单吗？'}).then(() => {
            this.$request.post('/app/json/app_oil_sale/cancelReserveOrder', {
              id: item.recordId, // 约单id
              vipUnitUserCode: this.vipUnitUser.vipUnitUserId
            }).then(res => {
              if (res.status === 0) {
                this.$dialog.alert({message: '约单取消成功'}).then(() => {
                  this.getOilSaleHomeData()
                })
              } else {
                this.$Toast(res.info ? res.info : '约单取消失败')
              }
            })
          })
        } else if (item.state == 1) {
          this.$router.push({path: '/appointment-bill-details', query: {appointmentItem: JSON.stringify(item)}})
        }
      },
      scrollHandler({y}) {
        let scrollY = y + this.shopContentHeight
        if (scrollY < 0) {
          scrollY = 0
        } else if (scrollY > this.shopContentHeight) {
          scrollY = this.shopContentHeight
        }
        this.$refs.shopProList.style.top = scrollY + 'px'
        this.$refs.shopContent.style.opacity = scrollY / this.shopContentHeight
      },
      // 竞价
      biddingHandle(item) {
        this.$router.push({
          path: '/bidding-details',
          query: {
            biddingData: JSON.stringify(item)
          }
        })
      },
      // 限价
      limitHandle(item) {
        if (item.attendCnt == item.limitCnt) {
          this.$Toast(`每个单位限抢${item.limitCnt}次`)
          return
        } else {
          this.$router.push({
            path: '/limit-order-details',
            query: {
              orderItemData: JSON.stringify(item)
            }
          })
        }
      }
    },
    computed: {
      ...mapGetters(['vipUnitUser'])
    },
    components: {
      [Dialog.name]: Dialog,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
      [Progress.name]: Progress,
      Scroll,
      HorizontalScroll,
      countdown
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  @import '../../assets/stylus/oil-sale-base.styl';
  
  .index {
    .show-img {
      img {
        height: 140px;
        width: 100%;
      }
    }
    
    .index-info {
      padding: 10px 10px 10px 0;
      
      .activity {
        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 3px 0 3px 18px;
          
          .left {
            font-size: 14px;
            position: relative;
            
            &:after {
              content: '';
              position: absolute;
              left: -6px;
              width: 2px;
              height: 100%;
              background: #009df8;
            }
          }
          
          .right {
            color: $color-text-l;
          }
        }
      }
      
      .grab-oil-activity-info {
        padding: 10px 0 10px 10px;
        
        .info {
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
          background: #fff;
          border-radius: 4px;
          padding: 11px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 20px;
          font-size: 12px;
          
          & + .info {
            margin-top: 6px;
          }
          
          .activity-left {
            width: 35%;
            
            .money {
              color: #009df8;
            }
            
            .left-title {
              font-size: 14px;
            }
          }
          
          .activity-center {
            flex: 1;
            padding: 0 20px 0 10px;
            text-align: center;
            
            .tips {
              color: $color-text-l;
            }
          }
        }
      }
      
      .buy-oil-activity-info {
        padding-top: 10px;
        overflow: hidden;
        white-space: nowrap;
        
        /deep/ .scroll-content {
          display: flex;
        }
        
        .content {
          float: left;
          padding: 0 0 10px 10px;
          
          .link {
            height: 100%;
            
            .iconfont {
              vertical-align: middle;
            }
          }
          
          .info {
            box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
            background: #fff;
            border-radius: 4px;
            padding: 11px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            line-height: 20px;
            position: relative;
            overflow: hidden;
            
            .activity-title {
              padding-bottom: 10px;
              font-size: 14px;
              
              .num {
                font-size: 12px;
                color: $color-text-d;
              }
            }
            
            .triangle-topright {
              width: 0;
              height: 0;
              border-width: 50px;
              border-top: 60px solid #009df8;
              border-left: 60px solid transparent;
              position: absolute;
              top: 0;
              right: 0;
              opacity: 0.7;
              
              .tips {
                position: absolute;
                top: -50px;
                right: 0;
                color: #fff;
                transform: rotate(45deg);
              }
            }
          }
        }
      }
      
      .sale-oil {
        white-space: normal;
        
        .sale-content {
          float: left;
          width: 33.33%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding: 0 0 10px 10px;
          
          .info {
            box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
            background: #fff;
            border-radius: 4px;
            padding: 11px;
            height: 96px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            text-align: center;
            width: 100%;
            
            .money {
              color: #009df8;
              padding: 5px 0 10px 0;
            }
            
            .left-title {
              font-size: 14px;
            }
            
            .activity-btn {
              .btn {
                width: 60px;
              }
            }
          }
        }
      }
    }
  }
  
  /* 公共按钮样式 */
  .activity-btn {
    .btn {
      border-radius: 20px;
      background: #009df8;
      padding: 5px 0;
      width: 70px;
      text-align: center;
      color: #fff;
    }
    
    .noClick {
      background: $color-background-l;
    }
  }
  
  /deep/ .van-popup {
    border-radius: 4px;
    width: 80%;
  }
</style>

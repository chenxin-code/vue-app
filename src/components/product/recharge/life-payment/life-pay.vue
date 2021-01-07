<template>
  <div class="lify-pay">
    <nav-top title="生活缴费" @backEvent="goback">
      <div class="phone-bill" @click="openRechargeBill">充值记录</div>
    </nav-top>
    <nav-content class="phone-bill-details">
      <div class="phone-bill-content">
        <div class="content">
          <div class="lifepaybanner">
            <img src="./image/banner@2x.png" alt/>
          </div>
          <div v-if="commonPayList.length > 0">
            <div class="commonly-used-title">
              <div class="title">常用缴费</div>
            </div>
            <ul class="list">
              <li class="item" @click="openUsedWater(item)" v-for="(item,index) in commonPayList"
                  :key="index">
                <div class="info">
                  <div class="img">
                    <img src="./image/sf.png" alt v-if="item.type == '001'"/>
                    <img src="./image/df.png" alt v-else-if="item.type == '002'"/>
                    <img src="./image/rqf.png" alt v-else-if="item.type == '003'"/>
                    <img src="./image/ghf.png" alt v-else-if="item.type == '004'"/>
                  </div>
                  <div class="details">
                    <div class="bill-title">{{item.typeName}}</div>
                    <div class="text">{{item.account}}&nbsp;|&nbsp;{{item.accountName}}</div>
                  </div>
                  <div class="details right">
                    <van-icon name="arrow"/>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="title">新增缴费</div>
          <ul class="more-recharge-list">
            <li class="more-recharge-item" v-for="(item, index) in rechargeListNow" :key="index"
                @click="openDIGChoice(item.type)">
              <div class="recharge-info">
                <div class="img">
                  <img :src="item.imgUrl" alt/>
                </div>
                <div class="text">{{item.text}}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="card-prompt">
          <h3 class="title">温馨提示：</h3>
          <div class="content" v-html="lifePayPrompt"></div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    data() {
      return {
        lifePayPrompt: '', // 温馨提示
        commonPayList: [],
        nameList: {
          '001': 'water',
          '002': 'ele',
          '003': 'gas',
          '004': 'phone'
        },
        rechargeList: [
          {
            text: "电费",
            imgUrl: require("./image/dfx.png"),
            type: 8
          },
          {
            text: "水费",
            imgUrl: require("./image/sfx.png"),
            type: 9
          },
          {
            text: "燃气费",
            imgUrl: require("./image/rqx.png"),
            type: 10
          },
          {
            text: "固话费",
            imgUrl: require("./image/ghx.png"),
            type: 11
          }
        ], // 各项充值
        rechargeListNow: []
      }
    },
    created() {
    },
    mounted() {
      this.getCommonPaymentList()
      this.dealWith() // 获取显示各项配置
      this.getPayInfo()
    },
    methods: {
      // 温馨提示信息
      getPayInfo() {
        // let params = {
        //     skuId: this.$store.state.globalConfig.utilitySkuId,
        //     pickupStoreOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
        //     deliverType: 1
        // }
        // this.$request.post('/app/json/product/getAppProDetail', params).then(res => {
        //     if (res.status == 0) {
        //         this.lifePayPrompt = res.data.proSkuMediaModel ? res.data.proSkuMediaModel.mobileDetail : ''
        //     } else {
        //         this.$Toast(res.info)
        //     }
        // })
        this.$request.post('/app/json/news/getNewsList', {values: 41}).then(res => {
          if (res.status == 0) {
            this.lifePayPrompt = res.data[0] ? res.data[0].content : ''
          } else {
            this.$Toast(res.info)
          }
        })
      },
      dealWith() {
        let hideRechargeEntry = this.$store.state.globalConfig.hideRechargeEntry
        if (hideRechargeEntry) {
          this.rechargeList = this.rechargeList.map(item => {
              if (!hideRechargeEntry.includes(item.type)) {
                  this.rechargeListNow.push(item)
                  return this.rechargeListNow
              }
          })
          // this.rechargeList = this.rechargeList.map(item => {
          //   if (hideRechargeEntry.includes(item.type)) {
          //     this.rechargeListNow.push(item)
          //     return this.rechargeListNow
          //   }
          // })
        }
      },
      goback() {
        if (this.$route.query.submitSuc) {
          this.$router.go(-4)
        } else {
          this.$router.go(-1)
        }
      },
      getCommonPaymentList() {
        if (this.$store.state.globalConfig.trafficStoreOuCode) {

          this.$request.post('/app/json/fee_life_order/queryUtilityAccountList', {
            storeOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
          }).then(res => {
            if (res.status === 0) {
              this.commonPayList = res.data
            } else {
              this.$Toast(res.info)
            }
          })
        } else {
          this.$Toast('请配置店铺编码')
        }
      },
      openDIGChoice(type) {
        // 打开各项机构选择
        /**
         * @type {string}
         * 话费充值 type=1
         * 流量充值 type=2
         * 游戏充值 type=3
         * 视频会员 type=4
         * QQ充值   type=5
         * 公共事业 type=6
         * 燃气费   type=7(公共事业和燃气费不能同时存在)
         * 电费    type=8
         * 水费    type=9
         * 燃气费    type=10
         * 固话费    type=11
         *
         * key: hideRechargeEntry
         value: 字符串，多个逗号分隔
         列如要隐藏 游戏充值和固化充值 value = 3,6
         */
        if (type == 8) { // 电费
          this.$router.push({path: '/institutional-choice', query: {name: 'ele'}})
          // this.$router.push({path: '/new-recharge-account', query: {name: 'ele'}})
        } else if (type == 9) { // 水费
          this.$router.push({path: '/institutional-choice', query: {name: 'water'}})
        } else if (type == 10) { // 燃气费
          this.$router.push({path: '/institutional-choice', query: {name: 'gas'}})
        } else if (type == 11) { // 固话费
          this.$router.push({path: '/institutional-choice', query: {name: 'phone'}})
        }
      },
      openUsedWater(item) {
        console.log(item)
        // 打开常用缴费水费
        this.$router.push({path: '/edit-account', query: {name: this.nameList[item.type], item: JSON.stringify(item)}})
      },
      // openUsedEle() {
      //   // 打开常用缴费电费
      //   this.$router.push({ path: '/edit-account', query: { name: 'ele' } })
      // },
      // openUsedGas() {
      //   // 打开常用缴费燃气费
      //   this.$router.push({ path: '/edit-account', query: { name: 'gas' } })
      // },
      // openUsedPhone() {
      //   // 打开常用缴费固话费
      //   this.$router.push({ path: '/edit-account', query: { name: 'phone' } })
      // },
      openRechargeBill() {
        // 打开账单页面
        this.$router.push({path: '/recharge-bill', query: {name: 'lify'}})
      }
    },
    computed: {},
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  @import '../asset/recharge.styl';
  
  .phone-bill-content {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 15px 11px 15px;
    
    .content {
      .lifepaybanner {
        img {
          width: 100%;
        }
      }
      
      .commonly-used-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .title {
        padding: 15px 0;
        font-size: 20px;
        color: $color-text;
      }
      
      .list {
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
        border-radius: 4px;
        margin-bottom: 10px;
        padding: 0 10px;
        
        .item {
          & + .item {
            border-top: 0.5px solid #ecebeb;
          }
          
          .info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 13px 5px;
            
            .details {
              flex: 1;
              line-height: 22px;
              
              .bill-title {
                font-size: 16px;
              }
              
              .text {
                color: $color-text-l;
              }
            }
            
            .right {
              text-align: right;
            }
            
            .img {
              padding-right: 5px;
              
              img {
                width: 40px;
              }
            }
          }
        }
      }
      
      .more-recharge-list {
        display: flex;
        flex-wrap: wrap;
        text-align: center;
        padding: 20px 0;
        
        .more-recharge-item {
          width: 25%;
          padding-bottom: 20px;
          
          .img {
            padding-bottom: 5px;
            width: 100%;
            height: 40px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            
            img {
              width: 30%;
              display: inline-block;
              vertical-align: middle;
            }
          }
        }
      }
    }
    
    .card-prompt {
      text-align: left;
      
      .title {
        font-size: 14px;
        padding-bottom: 8px;
        font-weight: bold;
      }
      
      .content {
        font-size: 12px;
        line-height: 17px;
      }
    }
  }
  
  /deep/ .van-icon {
    font-size: 20px;
    color: $color-text-l;
  }
</style>

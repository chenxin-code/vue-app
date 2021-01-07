<template>
  <div class="phone-bill">
    <nav-top :title="title" @backEvent="$router.go(-1)">
      <div
        class="right-btn theme_font_gray"
        style="right: 0px; height: 44px; top: 0px; padding-right: 10px;font-size: 12px;"
        @click="toHistory"
        v-if="name == 'phone' && $store.state.globalConfig.kshop_phoneBillList_url && $store.state.globalConfig.kshop_phoneBillList_url != undefined"
      >历史记录
      </div>
      <div
        class="right-btn theme_font_gray"
        style="right: 0px; height: 44px; top: 0px; padding-right: 10px;font-size: 12px;"
        @click="toHistory"
        v-if="name == 'lify' && $store.state.globalConfig.kshop_electBillList_url && $store.state.globalConfig.kshop_electBillList_url != undefined"
      >历史记录
      </div>
    </nav-top>
    <nav-content class="phone-bill-details">
      <div class="phone-bill-content">
        <ul class="phone-bill-list">
          <li class="phone-bill-item" v-for="(item, index) in list" :key="index">
            <div class="content">
              <div class="title">{{item.title}}月</div>
              <ul class="list">
                <li class="item">
                  <div class="info" v-for="(item2, index) in item.list" :key="index" @click="openDetails(item2)">
                    <div class="img">
                      <img src="./image/bill.png" alt="" v-if="name == 'phone'">
                      <img src="./image/spzd.png" alt="" v-else-if="name == 'video'">
                      <img src="./image/ll.png"   alt="" v-else-if="name == 'flow'">
                      <img src="./image/yxzd.png" alt="" v-else-if="name == 'play'">
                      <img src="./image/qq.png"   alt="" v-else-if="name == 'qq'">
                      <img src="./image/sfx.png"  alt="" v-else-if="item2.utilityType == '001'">
                      <img src="./image/dfx.png"  alt="" v-else-if="item2.utilityType == '002'">
                      <img src="./image/rqx.png"  alt="" v-else-if="item2.utilityType == '003'">
                      <img src="./image/ghx.png"  alt="" v-else>
                    </div>
                    <div class="details">
                      <div class="bill-title">{{item2.itemAbstractList[0].skuName}}</div>
                      <div class="text">{{item2.createTime}}</div>
                    </div>
                    <div class="right">
                      <div class="bill-title">￥{{item2.payAmount}}</div>
                      <div class="text" v-if="item2.state == 17">充值中</div>
                      <div class="text" v-else-if="item2.state == 9">充值成功</div>
                      <div class="text" v-else-if="item2.state == 18">充值成功</div>
                      <div class="text" v-else-if="item2.state == 12">充值失败</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <div class="no-data theme_font_tint" v-show="!hasMore">没有更多数据了~</div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    data() {
      return {
        list: [], // 话费充值账单列表
        title: '', // title
        name: '', // 来自哪
        productType: '', // 充值类型
        monthZh: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二' ],
        hasMore: true,
      }
    },
    created() {
    },
    mounted() {
      this.name = this.$route.query.name
      if (this.name == 'flow') {
        this.title = '流量充值账单'
        this.productType = '502'
      } else if (this.name == 'phone') {
        this.title = '话费充值账单'
        this.productType = '501'
      } else if (this.name == 'video') {
        this.title = '视频充值账单'
        if (this.$store.state.globalConfig.videoRechargeStyle == 1) { // 默认 或者0 卡密充值    1就是直冲
          this.productType = '510'
        } else {
          this.productType = '508'
        }
      } else if (this.name == 'play') {
        this.title = '游戏充值账单'
      } else if (this.name == 'lify') {
        this.title = '生活缴费记录'
        this.productType = '509'
      } else if (this.name == 'qq') {
        this.title = 'qq充值记录'
        this.productType = '503'
      }
      this.queryOrder()
    },
    methods: {
      toHistory: function () {
        if (this.name == 'phone') {
          this.$Loading.open();
          let redUrl = this.$store.state.globalConfig.kshop_phoneBillList_url
          let url = '/app/json/login/redirectToKShop';
          let paramsData = {
            redirectUrl: redUrl
          };
          this.$http.post(url, paramsData).then(
            res => {
              this.$Loading.close();
              let data = res.data;
              if (data.status == 0) {
                let realUrl = data.data
                this.$bridgefunc.customPush({
                  path: realUrl,
                  isnativetop: '1'
                }, false)
              } else {
                this.$Toast(data.info);
              }
            },
            error => {
              this.$Loading.close();
              this.$Toast('请求数据失败！')
            }
          );
        } else if (this.name == 'lify') {
          this.$Loading.open();
          let redUrl = this.$store.state.globalConfig.kshop_electBillList_url
          let url = '/app/json/login/redirectToKShop';
          let paramsData = {
            redirectUrl: redUrl
          };
          this.$http.post(url, paramsData).then(
            res => {
              this.$Loading.close();
              let data = res.data;
              if (data.status == 0) {
                let realUrl = data.data
                this.$bridgefunc.customPush({
                  path: realUrl,
                  isnativetop: '1'
                }, false)
              } else {
                this.$Toast(data.info);
              }
            },
            error => {
              this.$Loading.close();
              this.$Toast('请求数据失败！')
            }
          );
        }
      },
      queryOrder() {
        // 查询订单
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          orderType: '205004', // 订单类型
          orderId: '', // 商城订单ID
          productType: this.productType, // 501话费充值，502流量充值 503qq充值 508视频充值 509生活缴费
        }
        this.$http.post('/app/json/fee_life_order/queryOrder', paramsData).then(res => {
          this.hasMore = false
          let data = res.data
          if (data.status == 0) {
            let list = data.data.orderList
            let result = []
            for (let item of list) {
              let month = this.monthZh[(new Date(item.createTime || new Date())).getMonth()]
              let currentObj = result.find(el => {
                return el.title === month
              })
              if (currentObj) {
                currentObj.list.push(item)
              } else {
                let obj = {
                  title: month,
                  list: []
                }
                obj.list.push(item)
                result.push(obj)
              }
            }
            this.list = result
            console.log(this.list)
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      },
      openDetails(list) {
        // 打开账单详情
        let orderType = list.orderType
        let orderId = list.id
        this.$router.push({path: '/recharge-bill-details', query: {name: this.name, orderType: orderType, orderId: orderId, type: list.utilityType}})
      }
    },
    computed: {},
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "../asset/recharge.styl"
  .phone-bill-content {
    height 100%
    overflow: auto
    -webkit-overflow-scrolling touch
    padding: 0 15px 11px 15px
    .phone-bill-list {
      .phone-bill-item {
        .content {
          .title {
            padding: 10px 0
            font-size: 16px
            color: $color-text-d
          }
          .list {
            box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
            border-radius 4px
            .item {
              padding: 0 10px
              .info {
                display flex
                justify-content space-between
                align-items center
                padding: 13px 5px
                .details {
                  flex: 1
                  line-height 22px
                  text-align left
                  .bill-title {
                    font-size: 16px
                  }
                  .text {
                    color: $color-text-l
                    font-size: 12px
                  }
                }
                .right {
                  text-align right
                  line-height 22px
                  .bill-title {
                    font-size: 16px
                  }
                  .text {
                    color: $color-text-l
                  }
                }
                .img {
                  padding-right: 5px
                  img {
                    width: 40px
                  }
                }
                & + .info {
                  border-top: 1px solid #ecebeb
                }
              }
            }
          }
        }
      }
    }
  }
  .no-data {
    padding: 15px;
    text-align: center;
  }
</style>

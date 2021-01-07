<template>
  <div class="oil-order_background">
    <Navigation title="加油记录" hasBack="1" @backEvent="backEvent" rightText="筛选" @rightClick="rightClick"></Navigation>
    <div class="content_div" :style="{marginTop: topHeight + 'px'}">
      <div class="content-item top">
        <span class="title">全部订单</span>
        <img class="img" src="static/image/refuel/calendar.png"/>
      </div>
      <div class="content-item unFinished" v-if="unFinishedOrder">
        <!--<div class="title">待支付订单</div>-->
        <ul class="ul">
          <li class="li" v-for="(item, index) of unFinishedOrder" :key="index">
            <div class="li-item">
              <span class="item-left">
                <span>订单号：</span>
                <span>{{item.orderNo}}</span>
              </span>
              <span class="item-right item-top">￥{{item.payAmount}}</span>
            </div>
            <div class="li-item">
              <span class="item-left">{{item.createTime}}</span>
              <span class="item-right item-bottom">开具发票</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="content-item finished">
        <!--<div class="title">已支付订单</div>-->
        <pull-to :bottom-load-method="getMore" :top-load-method="refresh" class="pullTo">
          <ul class="ul">
            <li class="li" v-for="(item, index) of finishedOrder" :key="index" @click="slectOrder(index)">
              <div class="li-item">
              <span class="item-left">
                <span>订单号：</span>
                <span>{{item.orderNo}}</span>
              </span>
                <span class="item-right item-top">￥{{item.payAmount}}</span>
              </div>
              <div class="li-item">
                <span class="item-left">{{item.createTime}}</span>
                <span class="item-right item-bottom notHelp" v-if="checkFp(item) == '00'">不支持</span>
                <span class="item-right item-bottom" @click="openInvoice(index)"
                      v-if="checkFp(item) == '01'">开具发票</span>
                <span class="item-right item-bottom openSuccess" v-if="checkFp(item) == '02'"
                      @click="lookInvoice(item)">已开发票</span>

              </div>
            </li>
          </ul>
        </pull-to>
      </div>
      <hight-slected-page :style="{top: topHeight + 'px'}" v-if="hightSlected && slectedData" :pageData="slectedData"
                          @dismiss="hightDismiss" @heightSlect="heightSlect"></hight-slected-page>
    </div>
  </div>
</template>

<script>
  // import PullTo from 'vue-pull-to'
  import {DatetimePicker, Toast} from 'mint-ui'
  import Navigation from '@/components/base/navigation'
  import hightSlectedPage from '@/components/base/hight-slectedPage'

  export default {
    name: "mine-card-record",
    components: {
      PullTo,
      Toast,
      Navigation,
      hightSlectedPage
    },
    data() {
      return {
        topHeight: 0,
        tag: 0,//1为消费查询，2为充值查询
        paySlected: 0,
        slectedData: {},
        // payModeList: [{
        //   schannelInfo: '全部',
        //   schannelCode: '00'
        // },{
        //   schannelInfo: '微信',
        //   schannelCode: '01'
        // },{
        //   schannelInfo: '支付宝',
        //   schannelCode: '01'
        // },{
        //   schannelInfo: '斑马',
        //   schannelCode: '01'
        // }],
        // finishedOrder: [],
        // "data": [{
        //   "id": 6875,
        //   "objectId": "",
        //   "listIndex": 0,
        //   "inAppId": "",
        //   "limitStart": "",
        //   "splitPartitionId": "",
        //   "tradeNo": "",
        //   "orderNo": "15444165035981057374",
        //   "stationCode": "CCCC",
        //   "orderState": "01",
        //   "gunNo": "2",
        //   "oilCode": "300591",
        //   "oilName": "97#汽油",
        //   "oilPrice": 0.01,
        //   "oilQty": 2.33,
        //   "payAmount": 0.02,
        //   "payMode": "01",
        //   "payTime": "",
        //   "payAccount": "5088",
        //   "loginName": "",
        //   "realName": "",
        //   "phone": "18810697706",
        //   "creator": "",
        //   "createTime": "2018-12-10 12:35:06",
        //   "modifier": "",
        //   "modifyTime": "",
        //   "payTimeStr": "",
        //   "userCode": "5088",
        //   "mktCode": "",
        //   "totalAmount": "",
        //   "couponAmount": "",
        //   "deviceNo": "",
        //   "channel": "110",
        //   "couponOrderNo": "",
        //   "invoiceNo": "",
        //   "remark": "",
        //   "stationName": "沙河实验室"
        finishedOrder: [],
        unFinishedOrder: null,
        hightSlected: false,
        pageNum: '1',
        pageSize: '10',
        //
        finishOptionDefault: {
          queryType: '0',
          channelType: '',
          pageNum: '1',
          pageSize: '10',
          startDate: '',
          endDate: ''
        },
        finishQueryOption: {}
      }
    },
    methods: {
      lookInvoice(item) {
        Toast({
          message: '请到电子发票>我的发票查看',
          position: 'bottom',
          duration: 2000,
        });
        return
        let invoiceInfo = {
          id: item.invoiceNo
        }
        this.$bridgefunc.customPush({
          path: '/dzinvoice',
          isnativetop: '1',
          query: {
            invoiceInfo: encodeURIComponent(JSON.stringify(invoiceInfo)),
          },
        })
      },
      getMore(loaded) {
        this.pageNum = (parseInt(this.pageNum) + 1).toString()
        this.finishQueryOption.pageNum = this.pageNum
        let _this = this
        this.queryFinishOrder().then((data) => {
          data.forEach(item => {
            _this.finishedOrder.push(item)
          })
          loaded('done')
        }).catch(() => {
          loaded('fail')
        })
      },
      refresh(loaded) {
        this.pageNum = 1
        this.finishQueryOption.pageNum = this.pageNum
        let _this = this
        this.queryFinishOrder().then((data) => {
          _this.finishedOrder = data
          loaded('done')
        }).catch(() => {
          loaded('fail')
        })
      },
      rightClick() {
        console.log('data1', this.slectedData)
        this.hightSlected = true
      },
      backEvent() {
        this.$bridgefunc.customGo(-1)
      },
      queryPayModeList() {
        let url = '/app/json/refuel/getRefuelChannels';

        let _this = this;
        this.$http.post(url, {
          token: this.$store.state.login.token,
        }).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              _this.slectedData.payModes = data.data
            } else {
              Toast({
                message: data.info ? data.info : '',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            _this.$Loading.close();
            Toast({
              message: '',
              position: 'bottom',
              duration: 2000,
            });
          }
        )
      },
      queryUnFinishOrder() {
        let url = '/app/json/refuel/queryRefuelRecords';
        let params1 = {
          token: this.$store.state.login.token,
        }

        let _this = this;
        this.$http.post(url, params1).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              _this.unFinishedOrder = data.data
            } else {
              Toast({
                message: data.info ? data.info : '',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            _this.$Loading.close();
            Toast({
              message: '',
              position: 'bottom',
              duration: 2000,
            });
          }
        );
      },
      queryFinishOrder: function () {
        let _this = this
        let promise = new Promise((resolve, reject) => {
          _this.$Loading.open();
          let url = '/app/json/refuel/queryFinishedRecord';
          let params1 = {
            token: _this.$store.state.login.token,
            queryType: _this.finishQueryOption.queryType,
            channelType: _this.finishQueryOption.channelType,
            pageNum: _this.finishQueryOption.pageNum,
            pageSize: _this.finishQueryOption.pageSize,
            startDate: _this.finishQueryOption.startDate,
            endDate: _this.finishQueryOption.endDate
          }

          this.$http.post(url, params1).then(
            res => {
              _this.$Loading.close();
              let data = res.data;
              if (data.status == 0) {
                resolve(data.data)
              } else {
                Toast({
                  message: data.info ? data.info : '消费记录查询失败',
                  position: 'bottom',
                  duration: 2000,
                });
                reject()
              }
            },
            error => {
              _this.$Loading.close();
              Toast({
                message: '消费记录查询失败',
                position: 'bottom',
                duration: 2000,
              });
              reject()
            }
          );
        })
        return promise
      },
      payModeSlected(index) {
        this.paySlected = index
      },
      slectOrder(index) {

      },
      openInvoice: function (index) {
        let record = this.finishedOrder[index]
        let payload = {
          type: '00',
          record: record
        }
        // this.$store.state.fPContentMessage = payload
        // this.$store.commit('setFPContentMessage', payload)
        let _this = this
        this.$bridgefunc.vuexStorage(function () {
          _this.$bridgefunc.customPush({
            path: '/selectinvoice',
            isnativetop: '1',
            query: {
              fPContentMessage: encodeURIComponent(JSON.stringify(payload))
            }
          })
        })
      },
      checkFp(item) {
//         Channel    110|| 908     invoic_no ？
// invoic_no
//         remark
//
//         907  移动支付室外支付  和卡相关（卡是否支持开票  remark   然后再invoic_no？）
// 		说明：加油卡号和开票类型由“-”隔开
//         9002560000000068-1
//         1：消费时消费地单笔开普通发票
//         2：充值后发卡地开普通发票        不能开
//         3：消费后发卡地统一开增值发票   不能开

        // 00不支持开票   01可以开票  02 已开发票
        if ((item.channel == '110') || (item.channel == '908')) {
          if (item.invoiceNo.length > 0) {
            return '02'
          } else {
            return '01'
          }
        } else if (item.channel == '907') {
          let remark = item.remark
          let remarkType = remark.split('-')[1]
          if (remarkType == '1') {
            if (item.invoiceNo.length > 0) {
              return '02'
            } else {
              return '01'
            }
          } else {
            return '00'
          }
        } else {
          return '00'
        }
      },
      hightDismiss() {
        this.hightSlected = false
      },
      heightSlect(item) {
        this.hightSlected = false
        this.finishQueryOption = this.finishOptionDefault

        this.finishQueryOption.channelType = item.channelCode
        this.finishQueryOption.queryType = '1'
        let _this = this
        this.queryFinishOrder().then(item => {
          _this.finishedOrder = item
        })
      },
    },
    mounted() {
      let _this = this
      this.$bridgefunc.registePageShow(() => {
        _this.queryFinishOrder().then(data => {
          _this.finishedOrder = data
        })
      })
    },
    created() {
      this.topHeight = this.$store.state.barHeight + this.$market.getNavHeight();
      let _this = this
      this.finishQueryOption = this.finishOptionDefault
      this.queryFinishOrder().then(data => {
        _this.finishedOrder = data
      })
      this.queryPayModeList()
      this.queryUnFinishOrder()
    },
    computed: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .oil-order_background {
    background $color-background-lll
    height 100%
    display flex
    flex-direction column
    .content_div {
      display flex
      flex-direction column
      flex 1
      .top {
        display flex
        justify-content space-between
        align-items center
        background white
        .img {
          width 25px
          height 25px
        }
      }
      .content-item {
        padding 10px
        .title {
        }
      }
      .finished {
        margin-top 10px
        overflow hidden
        padding 0
        flex 1
        display flex
        flex-direction column
        .title {
          padding 5px 10px
        }
        .pullTo {
          flex 1
          .ul {
            background white
            margin-top 10px
            .li {
              border-bottom solid 1px $color-line-gray-l
              font-size $font-size-medium-x
              padding 5px 10px
              background white
              .li-item {
                display flex
                justify-content space-between
                align-items center
                color $color-text-d
                .item-left {
                  padding 5px
                }
                .item-right {
                  color red
                }
                .item-top {

                }
                .item-bottom {
                  font-size $font-size-medium-s
                  border solid 1px $color-theme-o
                  border-radius 8px
                  padding 4px
                  color $color-theme-o
                }
                .notHelp {
                  color $color-line-gray-l
                  border none
                }
                .openSuccess {
                  border none
                }
              }
            }
          }
        }
      }
    }
  }
</style>

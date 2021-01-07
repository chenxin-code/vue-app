<template>
  <div class="bottom">
    <div class="moudleUp-style" v-if="isYunCardIndoor">
      <div class="item">
        <span class="left-span">订单号</span>
        <span class="right-span">{{yunCardInfo.orderNo}}</span>
      </div>
      <div class="item">
        <span class="left-span">加油站</span>
        <span class="right-span">{{yunCardInfo.stationName}}</span>
      </div>
      <div class="item">
        <span class="left-span">金额</span>
        <span class="right-span">
          <span>
            <span class="money">￥{{yunCardInfo.totalAmount}}</span>元
          </span>
        </span>
      </div>
    </div>

    <div class="moudleUp-style" v-else>
      <div class="item">
        <span class="left-span">枪号</span>
        <span class="right-span">{{refuelInfo.gunNo}}号</span>
      </div>
      <div class="item">
        <span class="left-span">油品</span>
        <span class="right-span">{{refuelInfo.oilName}}</span>
      </div>
      <div class="item">
        <span class="left-span">金额</span>
        <span class="right-span">
          <span>
            <span class="money">￥{{refuelInfo.totalOilAmount}}</span>元
          </span>
        </span>
      </div>
      <!--<div class="text_style hint_style hint_text">金额</div>-->
      <!--<div class="text_style orange">¥&nbsp;</div>-->
      <!--<div class="text_style orange money_style">{{refuelInfo.totalOilAmount}}</div>-->
      <!--<div class="text_style">元</div>-->
    </div>
    <div class="moudle2_style">
      <div class="line_style text_style money_style">选择支付方式</div>
      <div class="paytype_style moudle_style" @click="paytypeselect()" v-if="cardInfo">
        <img class="img-full" src="static/image/refuel/checked.png" v-if="selectedIndex=='0'">
        <img class="img-full" src="static/image/refuel/unchecked.png" v-else="selectedIndex=='0'">
        <div class="hint_style">
          <div>加油卡支付（{{cardInfo.cityName}}）</div>
          <div class="hint_text">{{cardInfo.cardNo}}&nbsp;&nbsp;余额¥ {{cardInfo.totalBalance}}</div>
        </div>
        <div class="btn_change_card" @click="pushSelectCard">更换</div>
      </div>
      <div class="paytype_style moudle_style" v-for="item in paytype_normal" @click="paytypeselect(item)">
        <img class="img-full" src="static/image/refuel/checked.png" v-if="item.type==selectedIndex">
        <img class="img-full" src="static/image/refuel/unchecked.png" v-else="item.type==selectedIndex">
        <img class="img_style" :src="item.img">
        <div style="flex: 1">{{item.name}}</div>
      </div>
      <!--<div class="paytype_style moudle_style">-->
      <!--<div class="otherpaytype hint_text" @click="payPage()">更多支付方式</div>-->
      <!--</div>-->
    </div>
    <div class="moudle_style" @click="selectticket" v-if="selectedIndex=='0'">
      <div class="text_style hint_style ">优惠券</div>
      <div class="text_style hint_text" :class="{mtop:elticket.limit}">{{elticket.limit?elticket.limit:'不适用优惠券'}}</div>
      <img class="moreimg_style" src="static/images/icon-more.png">
    </div>
    <div class="moudle_style">
      <div class="text_style hint_style">需付金额</div>
      <div class="text_style orange">¥&nbsp;</div>
      <div class="text_style orange money_style">{{money}}</div>
      <div class="text_style">元</div>
    </div>
    <div class="sure-div" @click="payClick()">付款</div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'

  export default {
    name: 'refuel-order',
    components: {
      Toast
    },
    data() {
      return {
        orderNo: '',
        pageShow: 0,//1是更换加油卡回来；2是更换优惠券回来; 3 是后台推到前台回来
        selectedIndex: '0',//01微信，02支付宝,>03加油卡
        cardInfo: null,
        elticket: {
          couNo: '',
          userId: '',
          couPic: '',
          couTypeTitle: '不适用优惠券',
          couTypeSubTitle: '',
          validDate: '',
          state: '',
          couCanGift: ''
        },
        refuelInfo: {
          stationCode: '',
          stationName: '',
          gunNo: '',
          tradeNo: '',
          oilName: '',
          oilCode: '',
          oilType: '',
          oilPrice: '',
          totalOilQty: '',
          totalOilAmount: '',
          tradeTime: '',
        },
        paytype_normal: [
          {
            type: '01',
            name: '微信',
            img: 'static/image/refuel/pay_wechat.png'
          },
          {
            type: '02',
            name: '支付宝',
            img: 'static/image/refuel/pay_zhifubao.png'
          }
        ],
        pageType: '',   //yunPay-indoor 二维码室内支付
        yunCardInfo: null
      }
    },
    computed: {
      money: function () {
        let youhuiquan = this.elticket.limit ? this.elticket.limit : 0;
        let orderMoney = this.refuelInfo.totalOilAmount;
        return orderMoney - youhuiquan < 0 ? 0 : orderMoney - youhuiquan;
//        return this.refuelInfo.totalOilAmount-(this.elticket.limit?this.elticket.limit:0)<0?0:this.refuelInfo.totalOilAmount-(this.elticket.limit?this.elticket.limit:0)
      },
      isYunCardIndoor() {
        return (this.pageType === 'yunPay-indoor')
      }
    },
    mounted() {
      let _this = this;
      this.$bridgefunc.registePageShow(() => {
        _this.$bridgefunc.vuexRead(() => {
          switch (_this.pageShow) {
            case 1:
              let card = _this.$util.cloneDeep(_this.$store.state.card);
              if (card.cardNo != '') {
                _this.cardInfo = card;
              }
              for (let key in  this.$store.state.card) {
                _this.$store.state.card[key] = '';
              }
              break;
            case 2:
              let elticket = _this.$util.cloneDeep(_this.$store.state.elticket);
              if (elticket.coucode != '') {
                _this.elticket = elticket;
              }
              for (let key in  this.$store.state.elticket) {
                _this.$store.state.elticket[key] = '';
              }
              break;
            case 3:
              console.log('orderNo', _this.orderNo)
              if (_this.orderNo && _this.orderNo.length > 0) {
                _this.queryOrder()
              }
              break
          }
          _this.$bridgefunc.vuexStorage()
          _this.pageShow = 0;
        })
      })
    },
    methods: {
      getUserCardList: function () {
        this.$Loading.open();
        let url = '/app/json/card/getUserCardList';
        let token = this.$store.state.login.token
        let params1 = {
          token: token,
        }
        let _this = this;
        this.$http.post(url, params1).then(res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              let cardList = data.data
              if (!cardList || !cardList.length) {
                _this.$store.state.login.bindCardState = '0';
              } else {
                _this.cardInfo = cardList[0];
              }
            } else {
              Toast({
                message: data.info ? data.info : '获取加油卡列表失败',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            _this.$Loading.close();
            Toast({
              message: '获取加油卡列表失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        );
      },
      cancelOrder: function () {
        this.$Loading.open();
        let _this = this;
        let url = '/app/json/refuel/cancelOrder'
        let token = this.$store.state.login.token
        let params1 = {
          token: token,
          orderNo: _this.orderNo,
        }
        this.$http.post(url, params1).then(res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              _this.orderNo = '';
            }
          },
          error => {
            _this.$Loading.close();
          }
        );
      },
      payPage: function () {
        this.payWay = !this.payWay;
        this.selectedIndex = '0';

      },
      selectticket: function () {
        this.pageShow = 2;
        this.$bridgefunc.customPush({
          path: '/selectelticket',
          isnativetop: 1,
          query: {}
        })
      },
      paytypeselect: function (item) {
        if (item) {
          this.selectedIndex = item.type;
        } else {
//          if (this.selectedIndex == '0') {
//            this.pushSelectCard();
//          } else {
          this.selectedIndex = '0';
//          }
        }
      },
      pushSelectCard: function () {
        this.pageShow = 1;
        this.$bridgefunc.customPush({
          path: '/refuelcardselect',
          isnativetop: '1',
        })
      },
      repickOilGun: function () {
        this.$bridgefunc.customGo(-2)
      },

//      itemEvent: function (index) {
//        this.selectedIndex = index
//      },
      payClick: function () {
        if (this.isYunCardIndoor) {
          let payData = {
            orgId: this.yunCardInfo.stationCode,
            orderId: this.yunCardInfo.orderNo,
            amount: (this.yunCardInfo.totalAmount * 100),
          }

          let yunParmas = {
            payStr: encodeURIComponent(JSON.stringify(payData)),
            pan: this.yunCardInfo.cardNo
          }
          console.log('yunParams', yunParmas)

          this.$bridgefunc.yunConfirmPayCode(yunParmas, function (data) {
            alert(data)
          })
          return
        }
        if (this.selectedIndex == 0) {
          //室外支付
          // {
          //   "terminal": {
          //   "terminalID": "1"
          // },
          //   "tender": {
          //   "authorization": {
          //     "acquirerID": "1",
          //       "timeStamp": "20181220023342000"
          //   }
          // },
          //   "saleItem": {
          //   "itemID": "1",
          //     "productCode": "23",
          //     "amount": 0.01,
          //     "unitMeasure": "LTR",
          //     "unitPrice": 0.01,
          //     "quantity": 1.99,
          //     "additionalProductCode": "300591",
          //     "transactionNumber": "603",
          //     "gradeName": "97"
          // },
          //   "requestType": "CardBalanceQuery",
          //   "applicationSender": "RetalixFuel",
          //   "workstationID": "POS99",
          //   "requestID": "88861844",
          //   "overallResult": "Success"
          // }
          let yunData = this.refuelInfo.yunCardInfo || {}

          let yunPayInfo = {
            epsSn: 0,
            nozzle: this.refuelInfo.gunNo || '',
            orgCode: this.refuelInfo.oilCode || '',
            paidAmount: 0,
            rposNo: yunData.workstationID || '',
            rposSn: yunData.saleItem.transactionNumber || '',
            rposTime: yunData.tender.authorization.timeStamp || '',
            saleItems: [{
              categoryCode: yunData.saleItem.productCode || '', //类别代码           productCode
              goodCode: yunData.saleItem.additionalProductCode || '',	//商品代码              addtionalProductCode
              isOil: true,		//是否油品交易	      true
              itemName: this.refuelInfo.oilName || '',	//商品名称      oilName
              payAmount: this.refuelInfo.totalOilAmount * 100 || '',	//本次支付金额           payAmt     互联网原始
              price: yunData.unitPrice * 100 || '',		//商品单价              oilPrice
              quantity: yunData.quantity * 100 || '',	//商品数量              quantity   * 100
              rposSn: 0,		//rpos流水             transactionNumber
              sendAmount: this.refuelInfo.totalOilAmount * 100 || '',	//Retalix发送的商品的金额    互联网原始
              sourceAmount: this.refuelInfo.totalOilAmount * 100 || '',   //商品原始金额 			互联网原始
              totalAmount: this.refuelInfo.totalOilAmount * 100 || ''
            }],
            srcTransactionAmount: this.refuelInfo.totalOilAmount * 100 || '',	//当笔交易的金额，如果是混合支付，则是金额，单一支付方式时等于   totalAmount                                   原始金额
            totalAmount: this.refuelInfo.totalOilAmount * 100 || '',	//此支付方式的总金额      减券之后的金额
            transactionAmount: this.refuelInfo.totalOilAmount * 100 || '', //当笔交易的金额       原始金额
            transactionBalance: this.refuelInfo.totalOilAmount * 100 || '',//混合支付时，表示交易还有多少需要支付      原始金额
            voucher: '',//电子卷信息
            voucherAmount: 0
          }

          console.log('lastInfo', yunPayInfo)
          return
        }//电子券支付金额

        this.$Loading.open();
        let url = '/app/json/refuel/refuel';
        let _this = this;

        this.$http.post(url, {
          stationCode: _this.refuelInfo.stationCode,
          gunNo: _this.refuelInfo.gunNo,
          payMode: _this.selectedIndex,
          token: _this.$store.state.login.token,
          stationName: _this.refuelInfo.stationName,
          oilCode: _this.refuelInfo.oilCode,
          oilName: _this.refuelInfo.oilName,
          oilPrice: _this.refuelInfo.oilPrice,
          totalOilQty: _this.refuelInfo.totalOilQty,
          totalOilAmount: _this.refuelInfo.totalOilAmount,
          tradeNo: _this.refuelInfo.tradeNo,
          respData: this.$route.query.respData ? decodeURIComponent(this.$route.query.respData) : '',
        }).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              _this.orderNo = data.data.orderNo;
              console.log('index', _this.selectedIndex)
              _this.pageShow = 3
              if (_this.selectedIndex == '01') {
                _this.payForWX(data.data);
              } else if (_this.selectedIndex == '02') {
                _this.payForAli(data.data.aliPrepay);
              } else {
                // todo:加油卡支付
              }
            } else {
              _this.$MessageBox.alert(data.info ? data.info : '获取订单失败', '提示');
            }
          },
          error => {
            _this.$Loading.close();
            Toast({
              message: '获取订单失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        );
      },
      payForAli: function (info) {
        let _this = this;
        this.$bridgefunc.aliPay(info, function (result) {
          console.log(result)
          if (result) {
            _this.queryOrder();
          } else {
            // _this.cancelOrder();
            Toast({
              message: '支付失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        });
      }
      ,
      payForWX: function (info) {
        let _this = this;
        this.$bridgefunc.wxPay(info, function (result) {
          console.log(result)
          if (result) {
            // _this.pushOrderDetail();
            _this.queryOrder();

          } else {
//            _this.cancelOrder();
            Toast({
              message: '支付失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        });
      }
      ,
      pushOrderDetail: function () {
        if (this.selectedIndex == '01') {
          this.refuelInfo.payMode = '微信支付'
        } else if (this.selectedIndex == '02') {
          this.refuelInfo.payMode = '支付宝支付'
        }
        this.refuelInfo.payTime = this.$util.getPayTime();
        this.$bridgefunc.customPush({
          path: '/refuelorderdetail',
          isnativetop: 1,
          query: {
            oilRecord: encodeURIComponent(JSON.stringify(this.refuelInfo))
          }
        })

      }
      ,
      queryOrder: function () {
        this.$Loading.open();
        let url = '/app/json/refuel/queryOrderState';
        let token = this.$store.state.login.token
        let params1 = {
          token: token,
          orderNo: this.orderNo,
          stationCode: this.refuelInfo.stationCode
        }

        let _this = this;
        this.$http.post(url, params1).then(res => {

          _this.$Loading.close();
          let data = res.data;

          // biz_code( "312", "订单不存在")：弹窗提示
          // biz_code( "313", "订单待支付")：跳转到加油记录页面
          // biz_code( "316" '318', "订单已支付")：跳转到加油成功页面
          // biz_code( "317", "订单已退款")：弹窗提示
          if ((data.data.bizCode == '316') || (data.data.bizCode == '318')) {
            _this.pushOrderDetail();
          } else if (data.data.bizCode == '313') {
            _this.$bridgefunc.customPush({
              path: '/oilrecord',
              isnativetop: '1',
              query: {
                selected: '00',
              },
            })
          } else {
            _this.$MessageBox.alert(data.info ? data.info : '查询失败', '提示');
          }

        }, error => {

          _this.$Loading.close();
          Toast({
            message: '查询失败',
            position: 'bottom',
            duration: 2000,
          });
        })
      }
      ,
    },
    created() {
      this.pageType = this.$route.query.pageType

      if (this.pageType === 'yunPay-indoor') {
        this.yunCardInfo = JSON.parse(decodeURIComponent(this.$route.query.payData))

        console.log('this.pageType', this.pageType)
        console.log('this.yunCardInfo', this.yunCardInfo)
        return
      }


      //这里refuelinfo 不一定返回信息
      this.refuelInfo = JSON.parse(decodeURIComponent(this.$route.query.refuelInfo));
      this.getUserCardList();
    }
    ,
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom {
    width 100%
    height 100%
    background-color $color-background-lll
    overflow hidden

    .moudleUp-style {
      margin 10px
      padding 5px 10px
      background white
      border-radius 10px
      color $color-text-l
      font-size $font-size-medium
      .item {
        display flex
        justify-content space-between
        padding 5px 0
        .left-span {

        }
        .right-span {
          color black
          .money {
            font-size $font-size-large
            color $color-theme-text-d
          }
        }
      }
    }
    .moudle_style {
      margin 10px
      background #FFFFFF
      border-radius 5px
      padding 10px
      display flex
      align-items center

      .hint_style {
        flex 1
      }
      .text_style {
        font-size $font-size-medium
      }
      .mtop {
        margin-top 3px
      }
      .orange {
        font-size $font-size-medium-x
        color $color-theme-text-d
      }
      .money_style {
        font-size $font-size-large
      }

      .moreimg_style {
        width 15px
        height 15px
      }
    }
    .btn_change_card {
      border-radius 20px
      border 1px solid $color-theme-text-l
      color $color-theme-text-l
      padding 1px 5px
    }
    .hint_text {
      color $color-text-l
    }
    .moudle2_style {
      margin 10px
      background #FFFFFF
      border-radius 5px
      .line_style {
        padding 10px
        border-bottom solid 1px $color-line-gray-l
      }
      .line_style:last-child {
        border none
      }
      .paytype_style {
        padding-top 0px
        font-size $font-size-medium
        border-bottom solid 1px $color-line-gray-l
        padding 0px 0px 10px 0px
        border-radius 0
        img {
          width 15px
          height 15px
          margin-right 10px
        }
        .img_style {
          width 20px
          height 20px
          margin-right 10px
        }
        .otherpaytype {
          width 100%
          text-align center

        }
      }
      .paytype_style:last-child {
        border none
      }
    }
    .white-block {
      margin-bottom 10px;
      background-color #fff
      overflow hidden

      .tip-div {
        padding 4%;
        text-align center

        .tip-img {
          width 22px;
          height 22px;
          vertical-align: text-top
        }

        p {
          display inline-block
          vertical-align: text-top
          color $color-theme-text-d
          padding 2px 5px 0px 5px;
        }
      }

      .padding-div {
        padding 4%

        .icon-div {
          float left
          /*margin 4% 0px 4% 4%*/
          position relative
          width 40px;
          height 40px;
        }

        .info-div {
          height 40px;
          overflow hidden
          padding-left 10px

          .station-p {
            margin-top 4px;
            color $color-theme-text-l
          }

          .btn-div {
            float right
            margin-top 12px;
            color $color-theme-text-l
          }
        }
      }

      .refuel-info {
        padding 10px 4%;

        span {
          padding-top 1px
          display inline-block
          vertical-align middle
        }

        .span-right {
          float right
        }

        .theme-color {
          color $color-theme-text-l
        }

        .pay-way-img {
          width 24px
          height 24px
          display inline-block
          vertical-align middle
        }

        .selected-img {
          float right
          width 24px
          height 24px
          display inline-block
          vertical-align middle
        }
      }

      .line-bottom {
        border-bottom 1px solid $color-line-gray-l
      }

      .bottom-padding-12 {
        padding-bottom 12px
      }

      .top-padding-12 {
        padding-top 12px
      }

      .selecte-info-div {
        overflow hidden
        border-top 1px solid $color-line-gray-l

        .info-item {
          padding 12px 0px;
          float left
          width 50%
          text-align center
          box-sizing border-box
          border-right 1px solid $color-line-gray-l
          /*padding 12px;*/

          .gun-div {
            margin-top 5px;
            background-color $color-background-ll
            padding 6px 0px;
            margin-left 20%
            width 60%
            border-radius 5px
            color $color-theme-text-d
          }
        }
      }
    }

    .refuel-info-title {
      padding-left 4%
      margin-bottom 8px
    }

    .sure-div {
      text-align center
      margin 14px 4%;
      color #fff
      background-color $color-theme-text-d
      padding 8px;
      border-radius 20px;
    }
  }
</style>

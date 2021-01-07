<template>
  <div class="bottom">
    <div class="white-block">
      <div class="tip-div">
        <!--<img class="tip-img" src="static/image/refuel/tishi.png"/>-->
        <p class="font-medium-s" style="color: #FFFFFF">警告:加油站请勿下车使用手机！</p>
      </div>
      <div class="top_style">
        <div class="img_style">
          <img src="static/image/refuel/refuel01.png">
        </div>
        <div class="stationinfo_stle">
          <div class="hint_style">当前位置:</div>
          <div class="name_style">{{station.stationName}}</div>
          <div class="gun_style">{{gunNo}}号油枪
            <span class="gun_hint_style" v-if="orderInfo.oilOrders.length>0">({{orderInfo.oilOrders[0].oilName}})</span>
          </div>
        </div>
        <div class="change_style" @click="backClick">更改油站</div>
      </div>
    </div>
    <div>
      <div class="moudle_style" v-for="item in orderInfo.oilOrders" @click="placeOrder(item)"
           v-if="orderInfo.oilOrders.length>0">
        <div class="div_line_style">
          <div class="hint_style">金额</div>
          <div class="text_style">¥{{item.totalOilAmount}}元</div>
        </div>
        <div class="div_line_style">
          <div class="hint_style">加油升数</div>
          <div class="text_style">{{item.totalOilQty.replace('L','')}}L</div>
        </div>
        <!--<div class="div_line_style">-->
          <!--<div class="hint_style">挂枪时间</div>-->
          <!--<div class="text_style">{{item.tradeTime}}</div>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'

  export default {
    name: 'refuel-info2',
    components: {
      Toast
    },
    data() {
      return {
        gunNo: '',
        station: {},
        orderInfo: {
          payMode: '',
          respData: '',
          oilOrders: [],
        },
        selectedIndex: -1,
      }
    },
    methods: {
      backClick: function () {
        this.$bridgefunc.customGo(-1)
      },
      getOilName: function () {
        let oilName = '';
        if (this.orderInfo.oilOrders && this.orderInfo.oilOrders.length) {
          return oilName = this.orderInfo.oilOrders[0].oilName;
        }
        return oilName;
      },
      repickOilGun: function () {
        this.$bridgefunc.turnBack()
      },
      placeOrder: function (item) {
        //制作respdata 下一个界面会用到
       let respdata = JSON.parse(decodeURIComponent(this.orderInfo.respData))
        let saleItems = respdata.saleItem
        let lastSaleItem = {}
        saleItems.forEach(saleItem => {
          if (saleItem.transactionNumber == item.tradeNo) {
            lastSaleItem = saleItem
          }
        })
        respdata.saleItem = lastSaleItem
        item.yunCardInfo = respdata

        let refuelInfo = item;
        refuelInfo.stationName = this.station.stationName
        this.$bridgefunc.customPush({
          path: '/refuelorder',
          isnativetop: '1',
          query: {
            respData: this.orderInfo.respData,
            refuelInfo: encodeURIComponent(JSON.stringify(refuelInfo)),
          }
        })
      },
      getTradeList: function () {
        this.$Loading.open();
        let url = '/app/json/refuel/getTradeList';
        let _this = this;

        this.$http.post(url, {
          stationCode: _this.station.stationCode,
          gunNo: _this.gunNo,
          token: _this.$store.state.login.token,
        }).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              _this.orderInfo = data.data;
            } else {
              _this.stations = [];
              Toast({
                message: data.info ? data.info : '获取订单失败',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            console.log(error);
            _this.$Loading.close();
            _this.stations = [];
            Toast({
              message: '获取订单失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        );
      }
    },
    created() {
      this.station = JSON.parse(decodeURIComponent(this.$route.query.station));
      this.gunNo = this.$route.query.gunNo;
      this.getTradeList();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom {
    width 100%
    background-color $color-background-lll
    overflow hidden

    .moudle_style {
      background #FFFFFF
      border-radius 10px
      margin 10px
      padding: 10px
      font-size $font-size-medium

      .div_line_style {
        display flex
        align-items flex-end
        margin 0px 10px 10px 10px
      }
      .div_line_style:last-child {
        margin-bottom 0px
      }
      .hint_style {
        color $color-text-l
        flex 1

      }
      .text_style {

      }
      .text_orange {
        color $color-theme-text-l
      }
    }
    .top_style {
      display flex
      align-items center
      position relative
      overflow hidden
      padding 10px 10px

      .img_style {
        position relative
        overflow hidden
        margin-top -20px
        img {
          height 40px
        }
      }
      .stationinfo_stle {
        flex 1
        margin-left 10px

        .name_style {
          font-weight 500
          font-size $font-size-medium-x

        }
        .hint_style {
          font-size $font-size-small
          color $color-text-l
        }
        .gun_style {
          font-size $font-size-medium-x
          font-weight 500

          .gun_hint_style {
            font-size $font-size-small
            font-weight 400
          }

        }
      }

      .change_style {
        color $color-theme-text-l
        padding 3px 10px
        border-radius 20px
        font-size $font-size-medium
        border 1px solid $color-theme-text-l

      }
    }
    .white-block {
      margin-bottom 10px;
      background-color #fff
      overflow hidden

      .tip-div {
        padding 5px
        text-align center
        background #ff615a
      }
    }
  }
</style>

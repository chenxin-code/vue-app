<template>
  <div class="minr-card-recharge">
    <div class="cells">
      <div class="money-list">
        <div class="item" v-for="(item,index) in items" :class="{isActive:selectedid == index}"
             @click="selectedFunc(index)">
          <img class="selected-img" v-if="selectedid == index" src="@/assets/refuel/selected.png"/>
          {{item.text}}元
        </div>
        <div class="item" :class="{isActive:selectedid == items.length}">
          {{otherPrice}}
          <img class="selected-img" v-if="selectedid == items.length" src="@/assets/refuel/selected.png"/>
          <input type="number" class="otherItext" v-model="otherPriceNum" ref="otherInput"
                 @focus="inputFocus()" @blur="inputBlur()"/>
        </div>
      </div>
      <div class="pay-way">
        <p class="font-medium-x">支付方式</p>
      </div>
      <ul class="way-list">
        <li class="item" v-for="(item,index) in payWay" :class="{isActive:chosed==item.id}"
            @click="selectedPayWay(index)">
          <p class="icon" :class="item.id==0 ? 'aliPay':'weChat'">{{item.name}}</p>
        </li>
        <!--<li class="item"><p class="icon weChat">微信支付</p></li>-->
      </ul>
      <div class="voucher font-medium">
        <span class="use">抵用券</span>
        <span class="number">可用抵用券0张</span>
      </div>
      <div class="agree">
        <p class="agree-item">充值后可以前往指定加油站服务网点索取发票</p>
        <p class="agree-item">点击“确定充值”按钮即同意<i @click="rechargeGuide">《*****客户端充值协议》</i></p>
      </div>
      <div class="submit">
        <button class="btn" @click="recharge()">确定充值</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui';
  import mineCardInfo from './mine-card-info'
  import defaultImg from "@/assets/dot.png";
  import RechargeAlert from '@/components/commonui/recharge-alert'

  export default {
    name: 'mineCard',
    props: [
      'card',
    ],
    components: {
      mineCardInfo
    },
    data() {
      return {
        rechargeAmount: '',
        selected: '',
        otherInput: '',
        items: [
          {id: "1", text: "500"},
          {id: "2", text: "1000"},
          {id: "3", text: "2000"}
        ],
        payWay: [
          {name: '支付宝支付', id: '0'},
          {name: '微信支付', id: '1'}
        ],
        selectedid: -1,
        otherPrice: '其他金额',
        otherPriceNum: '',
        otherInput: true,
        chosed: '-1',
      }
    },
    methods: {
      //办卡指南路径写死
      rechargeGuide:function () {
        this.$bridgefunc.customPush({
          path: 'http://app.95504.net/html/recharge-agreement.html',
          isnativetop:1
        });
      },
      selectedFunc: function (index) {
        this.selectedid = index;
        this.otherPriceNum = '';
        this.rechargeAmount = this.items[index].text;
      },
      inputFocus: function () {
        this.selectedid = this.items.length;
        this.otherPriceNum = '';
        this.otherPrice = ''
      },
      inputBlur: function () {
        if (this.otherPriceNum == '') {
          this.otherPrice = '其他金额'
          this.selectedid = -1
          return
        }
        this.otherPrice = this.otherPriceNum + '元';
        this.rechargeAmount = this.otherPriceNum;
        this.otherPriceNum = ''
      },
      selectedPayWay: function (index) {
        this.chosed = index;
      },
      recharge: function () {
        if (this.chosed == -1) {
          Toast({
            message: '请选择支付方式',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        if (this.rechargeAmount == '') {
          Toast({
            message: '请选择或输入充值金额',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        this.$Loading.open();
        let url = '/app/json/card/recharge';

        let _this = this
        this.$http.post(url, {
          token: this.$store.state.login.token,
          phone: this.$store.state.phone,
          cardNo: this.card.cardNo,
          rechargeMode: this.chosed == 1 ? '01' : '02',//01-WeiXin，02-AliPay
          amount: this.rechargeAmount,
          invoice: '0',//0-不开，1-未开，2-已开
          ip: ''//手机终端ip
        }).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              if (_this.chosed == 1) {
                _this.payForWX(data.data);
              } else {
                _this.payForAli(data.data.aliPrepay);
              }
            } else {
              Toast({
                message: data.info ? data.info :'充值失败',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            _this.$Loading.close();
            Toast({
              message: '充值失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        );
      },
      payForAli: function (info) {
        let orderNo = this.$util.getUrlParam(info,'out_trade_no');
        let _this = this;
//        _this.payFinish(orderNo);
//return;

        this.$bridgefunc.aliPay(info,function (result) {
          if (result == false) {
            Toast({
              message: '支付宝支付失败',
              position: 'bottom',
              duration: 2000,
            });
          } else {
            _this.payFinish(orderNo);
            Toast({
              message: '支付宝支付成功',
              position: 'bottom',
              duration: 2000,
            });
          }
        });
      },
      payForWX: function (info) {
        let orderNo = info.out_trade_no
        let _this = this;
        this.$bridgefunc.wxPay(info,function (result) {
          if (result == false) {
            Toast({
              message: '微信支付失败',
              position: 'bottom',
              duration: 2000,
            });
          } else {
            _this.payFinish(orderNo);
            Toast({
              message: '微信支付成功',
              position: 'bottom',
              duration: 2000,
            });
          }
        });
      },
      payFinish:function (orderNo) {
        let time = 3
        let _this = this;
        RechargeAlert.open({
          contentmsg:'支付完成后,请根据实际情况点击下面按钮。',
          suremsg:'支付成功('+time+')',
          surebg:'grey',
          cancelmsg:'遇到问题',
          disabel:true,
          sureback:function () {// 支付成功按钮, 查询订单
            //此处去查询订单
            _this.seeProblem(orderNo);
            closeAlert();
          },
          cancelback:function () {//遇到问题按钮 点击跳转在线客服
            closeAlert();
            //跳转在线客服
            _this.getOnlineUrl();
          }
        });

        let interval = setInterval(function(){
          time -= 1;
          RechargeAlert.updateSureMsg('支付成功('+time+')');
          if (time == 0){//倒计时0  支付成功 按钮变主题色
            clearInterval(interval);
            RechargeAlert.changeDisabel(false);
            RechargeAlert.updateSurebg('#ff8819');
            RechargeAlert.updateSureMsg('支付成功');
          }
        }, 1000);
        function closeAlert() {
          clearInterval(interval);
          RechargeAlert.close();
        }
      },
      seeProblem:function (orderNo) {
//        orderNo = 'liqiang'

        this.$Loading.open();
        let url = 'app/json/card/orderQuery';

        let _this = this
        this.$http.post(url, {
          orderNo: orderNo,
          rechargeMode: this.chosed == 1 ? '01' : '02',//01-WeiXin，02-AliPay
        }).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {//查询订单成功
              console.log('查询订单:',data);
              Toast({
                message: data.info ? data.info :'查询订单成功',
                position: 'bottom',
                duration: 2000,
              });
              //跳转充值成功界面
              this.$bridgefunc.customPush({
                path: '/minecardrechargeresult',
                isnativetop:1,
                query: {
                  payTime:data.payTime,
                  payAmount:data.payAmount,
                  rechargeMode:_this.chosed == 1 ? '微信支付' : '支付宝支付',
                  orderNo:orderNo,

                }
              });

            } else {
              _this.queryFail()
            }
          },
          error => {
            _this.$Loading.close();
            _this.queryFail()
          }
        );
      },
      queryFail:function () {
        RechargeAlert.open({
          headermsg:'未查询到订单支付信息',
          contentmsg:'系统仍未查询到该订单，建议您联系95504客服',
          suremsg:'回到首页',
          cancelmsg:'联系客服',
          cancelbg:'#ffa500',
          sureback:function () {//回到首页 index = 0返回跟界面
            this.$bridgefunc.customGo(0);
          },
          cancelback:function () {
            this.getOnlineUrl();
          }
        });
      },

      getOnlineUrl() {//在线客服地址
        this.$Loading.open();
        let url = '/app/json/home/aiClient';
        let _this = this;

        this.$http.post(url, {
          token: _this.$store.state.login.token,
        }).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$bridgefunc.newPage({
                weburl: data.data,
                isnativetop: 1
              })
            }
          },
          error => {
            _this.$Loading.close();
          }
        );
      }

    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  /*@import recharge from '~@/assets/card/rechargeIcon1.png'*/

  .minr-card-recharge {
    background-color: #efefef;
    width: 100%;
    height: auto;
    overflow: hidden;
    .cells {
      overflow: hidden;
      .money-list {
        overflow: hidden;
        padding: 10px 0% 10px 3%;
        background: #fff;
        /*height: 60px;*/
        overflow hidden
        .item {
          position relative
          float: left;
          width: 21%;
          text-align: center;
          height: 40px;
          line-height 40px;
          margin-right: 4%;
          box-sizing: border-box;
          border: 1px solid $color-line-gray-l;
          border-radius: 5px;
          -webkit-border-radius: 5px;
          font-size $font-size-medium
          color $color-text

          .selected-img {
            position absolute
            right 0px
            bottom 0px
            height 16px
            width 16px
            overflow hidden
            border-radius 0px 0px 3px 0px
          }
          /* span {
             padding: 9px 0px;
             width: 100%
             height 40px;
             border: 1px solid $color-line-gray-l;
             border-radius: 5px;
              -webkit-border-radius: 5px;
             color: $color-text;
             font-size: $font-size-medium;
             display: inline-block;
           }*/
          .otherItext {
            position absolute
            top 1px;
            bottom 1px;
            left 0px
          // display: inline-block;
            width: 100%;
            border-radius: 5px;
            -webkit-border-radius: 5px;
            color: $color-theme-text-d;
            font-size: $font-size-medium;
            background: none;
            /*background-color #0000ff*/
            outline: none;
            text-align: center;
          }
        }
        .item:nth-child(4n) {
          padding-right: 0px;
        }
        .isActive {
          border-color: $color-theme-text-d;
          color: $color-theme-text-d;
        }
      }
      .pay-way {
      // padding: 0px 3%;
        margin-top: 10px;
        background: #fff;
        p {
          padding: 0px 3%
          border-bottom: 1px solid $color-line-gray-l;
          height: 40px;
          line-height: 40px
        }
      }
      .way-list {
        background: #fff;
        padding: 0px 3%;
        .item {
          position relative
          heigt: 40px;
          line-height: 39px;
          border-bottom: 1px solid #dcdddd;

          .icon {
            background-position: left center;
            background-repeat: no-repeat;
            background-size: 20px 20px;
            padding-left: 30px;
            font-size $font-size-medium
            color $color-text
            padding-top 1px;
          }
          .aliPay {
            background-image: url("../../../../static/image/mine/zhifu1.png")
          }
          .weChat {
            background-image: url("../../../../static/image/mine/zhifu2.png")
          }
        }
        .isActive {
          background: url("../../../../static/image/mine/xuanze.png") right center no-repeat;
          background-size: 20px 20px;
        }
      }
      .voucher {
        background: #fff;
        overflow: hidden;
        padding: 0px 3%;
        height: 40px;
        line-height: 40px;
        .use {
          float: left;
          color: #4c4948;
        }
        .number {
          float: right;
          color: $color-text-l;
        }
      }
      .submit {
        padding: 4px 3vh;
        .btn {
          width: 100%;
          background: orange;
          color: #fff;
          font-size: $font-size-medium-x;
          border-radius: 5px;
          -webkit-border-radius: 5px;
          border: none;
          padding: 8px 0px;
        }
      }
      .agree {
        padding: 12px 3%;
      // margin-top: 10px;
        overflow: hidden;

        .agree-item {
          color: $color-text-l;
          font-size: $font-size-small;
          text-align: center;
          i {
            color: orange;
            font-style: normal;
          }
        }
        .warm-tip {
          text-align: center;
          color: $color-text-l;
          font-size: font-size-small;
        // margin-top: 10px;
        }
      }
    }

  }

</style>

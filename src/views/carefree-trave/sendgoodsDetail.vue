<template>
    <div class="body">
      <nav-top @backEvent="$router.go(-1)" title="订单详情"></nav-top>
      <nav-content>
        <div class="statusBox">
         <div><img src="static/image/microShop/icon_finish.png" alt=""><span>提交成功</span></div>
          <p></p>
          <div><img src="static/image/microShop/icon_finish.png" alt=""><span>商家出票</span></div>
          <p></p>
          <div><img src="static/image/microShop/icon_finish.png" alt=""><span>订单完成</span></div>
        </div>
        <div class="bg"></div>
        <div class="box">
          <div class="div1">
            <div><img src="static/image/microShop/icon_entrance ticket.png" alt=""><span>{{obj.name}}</span></div>
            <span>已出票</span>
          </div>
          <div class="div2" style="height: 80px;margin-top: 20px;">
            <img :src="obj.picUrl" alt="">
            <div>
              <p>有效期：{{obj.timeFrame}}</p>
              <p><span>票单价：￥{{obj.unitPrice}}元</span><span>共{{obj.buyTicketsNumber}}张门票</span></p>
            </div>
          </div>
        </div>
        <div class="box">
          <router-link :to="{path:'/carefree_trave/afterSale',query: {id: id, orderId:$route.query.orderId, tradeNo:$route.query.tradeNo}}">
            <div class="tuipiao"><span>去使用</span><div>退票记录（12） <i class="icon iconfont mall-gengduojiantou"></i></div></div>
          </router-link>
          <div class="recordBox">
            <div class="div1">
              <p>已用张数：{{obj.usedAmount}}张<i class="icon iconfont mall-gengduojiantou"></i></p>
              <p>可用张数：{{obj.validAmount}}张<i class="icon iconfont mall-gengduojiantou"></i></p>
            </div>
            <div class="div2">
              <div class="ma">
                <canvas class="qrcode" id="qrcode"></canvas>
              </div>
            </div> <!-- 二维码obj.qrcode-->
          </div>
        </div>
        <div class="box box1">
          <p>订单信息</p>
          <div><span>订单标题</span><span>{{obj.name}}</span></div>
          <div><span>订单编号</span><span>{{orderObj.tradeNo}}</span></div>
          <div><span>下单时间</span><span>{{orderObj.createTime}}</span></div>
          <div><span>出票时间</span><span>{{orderObj.payTime}}</span></div>
          <div><span>接收手机号</span><span>{{obj.contactMobile}}</span></div>
        </div>
        <div class="box box1">
          <p>支付信息</p>
          <div><span>支付时间</span><span>{{orderObj.payTime}}</span></div>
<!--          <div><span>支付方式</span><span>支付宝支付</span></div>-->
          <div><span>实付金额</span><span>{{orderObj.payAmount}}元</span></div>
        </div>
      </nav-content>
    </div>
</template>

<script>
  import QRCode from "qrcode";
  import Config from "@/api/config";
  import api from './api'
    export default {
        name: "sendgoodsDetail",
      mixins: [api],
      components: {
        QRCode
      },
      data() {
        return {
          show: false,
          obj: {},
          orderObj: {},
          id: ''
        }
      },
      mounted() {
        this.loadData()
      },
      methods: {
        loadData() {  ///app/json/app_shopping_order/detail
          let that = this
          let params = {
            token: this.$store.state.login.token,
            orderId: that.$route.query.orderId,
            tradeNo: that.$route.query.tradeNo,
            orderType: this.$route.query.orderType
          };

          that.orderdetail1Data(params).then(res => {
            if (res.data.result) {
              that.obj = res.data.data.travelJson || {}
              let code = that.obj.qrcode || ''
              that.orderObj = res.data.data || {}
              that.id = res.data.data.id
              that.$nextTick(() => {
                QRCode.toCanvas(document.getElementById('qrcode'),  res.data.data.travelJson.qrcode)
                /* let qrcode = new QRCode(`id_${index}`, {
                   width: 150, // 设置宽度
                   height: 150, // 设置高度
                   text: binaryString
                 });*/
              });

            }
          });
        },
      },
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background-color: #f6f6f6 !important;
    .statusBox {
      background #fbf6f0
      padding 10px 20px;
      display flex;
      justify-content space-between;
      p {
        width: 60px;
        height: 1px;
        background: #deb98c;
        margin: auto;
      }
      div {
        display flex;
        flex-direction column
        img {
          margin: auto;
          width: 30px;
          margin-bottom 5px;
        }
        span {
          margin: auto;
        }
      }
    }
    .bg {
      background #f6f6f6;
      height 15px;
    }
    .box {
      padding 20px;
      background white;
      margin-bottom 15px;
      font-size 14px;
      .div1 {
        display flex;
        justify-content space-between
        span {
          font-size 14px;
          margin auto 0
        }
        div{
          display flex;
          justify-content space-between
          img {
            width 24px;
            height 24px;
            margin auto
            margin-right 5px;
          }
          span {
            font-size 18px;
            margin auto
            width 260px;
          }
        }
      }
      .div2 {
        display flex;
        justify-content start
        img {
          width: 60px;
          height 60px;
          border-radius: 6px;
          margin: auto 0;
          margin-right: 15px;
        }
        div{
          display flex;
          flex-direction column
          font-size 14px;
          flex 1
          p:nth-child(1) {
            margin-top: 30px;
            margin-bottom: 10px;
          }
          p:nth-child(2) {
            display flex;
            justify-content space-between
          }
        }
      }
      .tuipiao {
        display flex;
        justify-content space-between;
        span {
          font-size 16px;
        }
        div {
          font-size 14px;
        }
      }
      .recordBox {
        display flex;
        justify-content start;
        margin-top 20px;
        .div1 {
          display flex;
          flex-direction column;
          font-size 14px;
          margin: auto 0;
          margin-right: 20px;
          p:nth-child(1) {
            margin  10px 0 20px 0
          }
        }
        .div2 {
          width 150px;
          height 150px;
          margin auto 0
          .ma {
            width: 150px;
            height: 150px;
            /deep/ .qrcode {
              width: 150px !important;
              height: 150px !important;
            }
          }
        }
      }
    }
    .box1 {
      p {
        font-size 16px;
      }
      div {
        display flex;
        justify-content space-between;
        margin-top 10px;
        span:nth-child(2) {
          color #a6a6a6
        }
      }
    }
  }
  /deep/ .nav-content {
    overflow-y auto !important
  }

</style>

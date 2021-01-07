<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="订单详情"></nav-top>
    <nav-content>
      <div class="statusBox" v-if="$route.query.type=='sendGoods'">
        <div><img src="static/image/microShop/icon_finish.png" alt=""><span>提交成功</span></div>
        <p></p>
        <div><img src="static/image/microShop/icon_finish.png" alt=""><span>商家出票</span></div>
        <p></p>
        <div><img src="static/image/microShop/icon_finish.png" alt=""><span>订单完成</span></div>
      </div>
      <div class="title" v-if="$route.query.type=='tobepaid'">
        <span>待支付：{{obj.payment}}</span>
        <span>订单金额：{{obj.payment}}元</span>
      </div>
      <div class="title" v-if="$route.query.type=='cancelgood'">
        <div>
          <p>订单已取消</p>
          <p>2019-09-09   23:23:23</p>
        </div>
        <span class="jindu">退款进度？</span>
      </div>
      <div class="bg"></div>
      <div class="box">
        <div class="div1">
          <div><img src="static/image/microShop/icon_entrance ticket.png" alt=""><span>{{obj.name}}</span></div>
          <span class="state">待支付</span>
        </div>
        <div class="div2">
          <img :src="obj.picUrl" alt="">
          <div>
            <p>共{{obj.buyTicketsNumber}}张门票</p>
            <p>实付款：{{obj.payment}}元</p>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="boxDiv">
          <p class="chu">出行人</p>
          <ul>
            <li v-for="(item,index) in obj.players" :key="index" v-if="index<3">
              <p>{{item.name}}</p>
              <span>身份证号：{{item.idNumber}}</span>
              <span>手机号：{{item.mobile}}</span>
            </li>
          </ul>
        </div>
<!--        <div class="allDiv" @click="chupeople(obj.players)">查看全部（{{obj.players.length?obj.players.length: '0'}}） <i class="icon iconfont mall-gengduojiantou"></i></div>-->
      </div>
      <div class="box box1">
        <div>订单信息</div>
        <p><span>订单编号</span><span>{{orderObj.tradeNo}}</span></p>
        <p><span>下单时间</span><span>{{orderObj.createTime}}</span></p>
<!--        <p><span>支付方式</span><span>支付宝支付</span></p>-->
        <p><span>订单实付金额</span><span>{{orderObj.payAmount}}元</span></p>
        <p><span>短信接收手机号</span><span>{{obj.contactMobile}}</span></p>
      </div>
      <div class="btns" v-if="$route.query.type=='tobepaid'">
        <span @click="pay">立即支付</span>
        <span @click="cancel">取消订单</span>
      </div>
      <div class="btns" v-if="$route.query.type=='cancelgood'">
        <span>重新购买</span>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import api from './api'
  import {Toast} from 'vant'
  export default {
    name: "tobePaidDetail",
    mixins: [api],
    data() {
      return {
        obj: {},
        orderObj: {},
        orderId: '',
        ouCode: '', //传至收银台
      }
    },
    created() {

    },
    mounted() {
      this.loadData()
    },
    methods: {
      loadData() {
        let that = this
        let params = {
          token: this.$store.state.login.token,
          orderId: that.$route.query.orderId,
          tradeNo: that.$route.query.tradeNo,
          orderType: this.$route.query.orderType
        };

        that.orderdetailData(params).then(res => {
          if (res.data.result) {
          that.obj = res.data.data.travelJson ||{}
          that.orderObj = res.data.data || {}
          that.ouCode = res.data.data.ouCode
          }
        });
      },
      chupeople(params) {
        this.$router.push({
          path:'/carefree_trave/travellingPeople',
          query: {
            peopleList: params
          }
        })
      },
      pay() {
        // this.$router.push({
        //   name: '收银台',
        //   params: {
        //     payInfo: {
        //       orderId: this.$route.query.orderId,
        //       tradeNo: this.$route.query.tradeNo,
        //       style: 'travel',
        //       payAmount: this.obj.payment
        //     },
        //     occurOuCode: this.ouCode
        //   }
        // })
        this.$router.push({
          path: '/mall2/checkstand',
          query: {
            payInfo: JSON.stringify({
              orderId: this.$route.query.orderId,
              tradeNo: this.$route.query.tradeNo,
              style: 'travel',
              payAmount: this.obj.payment
            }),
            occurOuCode: this.ouCode
          }
        })
        // let that = this
        // let params = {
        //   token: that.$store.state.login.token,
        //   payMode: '',
        //   payModeSub: '',
        //   orderId: that.$route.query.orderId
        // }
        // console.log(params);
        // this.$Loading.open()
        // formData.append(
        //   'jsonData',
        //   JSON.stringify(params)
        // );
        // that.payorderData(formData).then(res => {
        //   this.$Loading.close()
        //   if (res.data.result === 'success') {
        //
        //   } else {
        //     Toast(res.data.info)
        //   }
        // })
      },
      cancel() {
        let that = this
        let params = {
          token: that.$store.state.login.token,
          orderId: that.$route.query.orderId
        }
        console.log(params);
        this.$Loading.open()

        that.cancelorderData(params).then(res => {
          this.$Loading.close()
          if (res.data.result === 'success') {
            Toast('您已取消订单')
            that.$router.go(-1)
          } else {
            Toast(res.data.info)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background-color: #f6f6f6 !important;

    .title {
      background #fbf6f0
      display flex;
      justify-content space-between
      font-size 16px;
      height 60px
      line-height 60px;
      padding 0 20px;
      div {
        margin auto 0
        span {
          margin auto 0
        }
      }
      .jindu {
        margin: auto 0;
        border: 1px solid #deb98c;
        border-radius: 20px;
        padding: 5px;
        font-size: 14px;
        text-align: center;
      }
    }

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
      margin: 15px 0;
      margin-top 0
      font-size 14px;

      .div1 {
        display flex;
        justify-content space-between

        span {
          font-size 14px;
          margin auto 0
        }

        .state {
          width 75px;
          text-align: right;
        }

        div {
          display flex;
          justify-content space-between

          img {
            width 24px;
            height 24px;
            margin auto
            margin-right 5px;
          }

          span {
            font-size 16px;
            margin auto
            width 260px;
            line-height 22px;
          }
        }
      }

      .div2 {
        display flex;
        justify-content start
        margin-top 20px;

        img {
          width: 110px;
          height: 110px;
          border-radius: 6px;
          margin-right: 15px;
        }

        div {
          display flex;
          flex-direction column
          font-size 14px;

          p:nth-child(1) {
            margin-top: 30px;
            margin-bottom: 10px;
          }
        }
      }

      .boxDiv {
        display flex
        justify-content space-between

        p {
          width 70px;
          font-size 16px;
          margin auto 0
        }

        ul {
          li {
            margin-bottom: 14px;
            display: flex;
            flex-direction: column;

            p {
              margin-bottom 8px
              font-size 14px;
            }

            span:nth-child(2) {
              margin-bottom 8px;
            }

            span {
              color #656464
            }
          }
        }
      }

      .allDiv {
        text-align: right;
        margin-top: 10px;
        height: 20px;
        line-height: 20px;
      }
    }

    .box1 {
      div {
        font-size 16px;
      }

      p {
        display flex
        justify-content space-between
        margin-top 15px;

        span {
          font-size 14px
        }

        span:nth-child(2) {
          font-size 12px
          color #656464
        }
      }
    }

    .btns {
      display flex
      flex-direction: row-reverse;
      margin 20px 0
      span {
        padding 10px 15px
        font-size 14px;
        text-align center
        border-radius 8px;
      }
      span:nth-child(1) {
        margin: 0 20px 0 10px;
        border 1px solid #deb98c
        color #deb98c
      }
      span:nth-child(2) {
        color white
        background #deb98c
      }
    }
  }

  /deep/ .nav-content {
    overflow-y auto !important
  }
</style>

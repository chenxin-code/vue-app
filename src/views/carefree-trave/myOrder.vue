<template>
    <div class="body">
      <nav-top @backEvent="$router.go(-1)" title="订单列表"></nav-top>
      <nav-content>
        <van-tabs @click="changes" v-model="title">
          <van-tab :title="'待支付'">
            <div class="box" @click="tobepaid" v-for="(item,index) in list" :key="index">
              <div class="div1">
                <div><img src="static/image/microShop/icon_entrance ticket.png" alt=""><span>三亚西岛门票（成人票）</span></div>
                <span class="state">待支付</span>
              </div>
              <div class="div2">
                <img src="static/image/microShop/icon_entrance ticket.png" alt="">
                <div>
                  <p>共1张门票</p>
                  <p>实付款：200.0元</p>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab :title="'待发货'">
            <div class="box" @click="tosendDetail">
              <div class="div1">
                <div><img src="static/image/microShop/icon_entrance ticket.png" alt=""><span>三亚西岛门票（成人票）</span></div>
                <span class="state">待发货</span>
              </div>
              <div class="div2">
                <img src="static/image/microShop/icon_entrance ticket.png" alt="">
                <div>
                  <p>共1张门票</p>
                  <p>实付款：200.0元</p>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab :title="'待收(提)货'">
            <div class="box">
              <div class="div1">
                <div><img src="static/image/microShop/icon_entrance ticket.png" alt=""><span>三亚西岛门票（成人票）</span></div>
                <span class="state">待发货</span>
              </div>
              <div class="div2">
                <img src="static/image/microShop/icon_entrance ticket.png" alt="">
                <div>
                  <p>共1张门票</p>
                  <p>实付款：200.0元</p>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab :title="'已完成'">
            <div class="box">
              <div class="div1">
                <div><img src="static/image/microShop/icon_entrance ticket.png" alt=""><span>三亚西岛门票（成人票）</span></div>
                <span class="state">待发货</span>
              </div>
              <div class="div2">
                <img src="static/image/microShop/icon_entrance ticket.png" alt="">
                <div>
                  <p>共1张门票</p>
                  <p>实付款：200.0元</p>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab :title="'已取消'">
            <div class="box">
              <div class="div1">
                <div><img src="static/image/microShop/icon_entrance ticket.png" alt=""><span>三亚西岛门票（成人票）</span></div>
                <span class="state">已取消</span>
              </div>
              <div class="div2">
                <img src="static/image/microShop/icon_entrance ticket.png" alt="">
                <div>
                  <p>共1张门票</p>
                  <p>实付款：200.0元</p>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </nav-content>
    </div>
</template>

<script>
   import api from './api'
    export default {
        name: "myOrder",
      mixins: [api],
      data() {
          return {
            titleList: ['待支付','待发货','待收(提)货','已完成','已取消'],
            title: '待支付', // 7已取消，1:待支付  3:已支付  9:已完成
            state: 1,
            list: [],
          }
      },
      mounted() {
          this.loadData()
      },
      methods: {
        changes(index,title) {
          console.log(index,title);
          let that = this
          if (title == '待支付') {
            that.state = 1
          } else if (title == '待发货') {
            that.state = ''
          } else if (title == '待收(提)货') {
            that.state = ''
          } else if (title == '已完成') {
            that.state = 9
          } else if (title == '已取消') {
            that.state = 7
          }
        },
        loadData() {
          let that = this
          let params = {
            token: this.$store.state.login.token,
            orderType: 200104,
            state: that.state
          };

          that.orderData(params).then(res => {
            if (res.data.result) {
              // that.titleView = true
              that.list = res.data.data || []
            }
          });
        },
        tosendDetail() { //待发货
         this.$router.push({
           path: '/carefree_trave/sendgoodsDetail'
         })
        },
        tobepaid() { //待支付
          this.$router.push({
            path: '/carefree_trave/tobePaidDetail'
          })
        },
      },
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background-color: #f6f6f6 !important;
    .box {
      padding 20px;
      background white;
      margin: 15px 12px;
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
            font-size 16px;
            margin auto
            line-height 22px;
          }
        }
      }
      .div2 {
        display flex;
        justify-content start
        img {
          width: 110px;
          height: 110px;
          border-radius: 6px;
          margin-right: 15px;
        }
        div{
          display flex;
          flex-direction column
          font-size 14px;
          p:nth-child(1) {
            margin-top: 30px;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
  /deep/ .van-tabs__line {
    background-color: #deb98c !important;
  }
</style>

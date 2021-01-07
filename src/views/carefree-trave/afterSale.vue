<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="售后维修"></nav-top>
    <nav-content>
      <van-tabs v-model="active" @change="change">
        <van-tab :title="'处理中('+list.length+')'?'处理中('+list.length+')':'0'">
          <div class="box" @click="shenqing" v-for="(item,index) in list" :key="index">
            <div class="div1">
              <div><img src="static/image/microShop/icon_entrance ticket.png" alt=""><span>{{obj.name}}</span></div>
              <span class="state">处理中</span>
            </div>
            <div class="div2">
              <img :src="obj.picUrl" alt="">
              <div>
                <p>总票数：{{obj.buyTicketsNumber}}（张）</p>
                <p>可退票数：{{obj.number}}（张）</p>
                <span>申请售后</span>
              </div>
            </div>
          </div>
          <p class="tips" v-if="list.length==0">暂无数据</p>
        </van-tab>
        <van-tab :title="'处理中('+list.length+')'?'处理中('+list.length+')':'0'">
          <div class="box" @click="chuli" v-for="(item,index) in list" :key="index">
            <div class="div1">
              <div><img src="static/image/microShop/icon_entrance ticket.png" alt=""><span>{{item.skuName}}</span></div>
              <span class="state">处理中</span>
            </div>
            <div class="div2">
              <img :src="item.phPictureUrl" alt="">
              <div>
                <p>申请时间：{{item.createTime}}</p>
                <p>申请退票张数：{{item.number}}（张）</p>
                <span>取消售后</span>
              </div>
            </div>
          </div>
          <p class="tips" v-if="list.length==0">暂无数据</p>
        </van-tab>
        <van-tab :title="'已完成('+list.length+')'?'已完成('+list.length+')':'0'">
          <div class="box" @click="complete" v-for="(item,index) in list" :key="index">
            <div class="div1">
              <div><img src="static/image/microShop/icon_entrance ticket.png" alt=""><span>{{item.skuName}}</span></div>
              <span class="state">已完成</span>
            </div>
            <div class="div2">
              <img :src="item.phPictureUrl" alt="">
              <div>
                <p>取消时间：{{item.completeTime}}</p>
                <p>申请退票张数：{{item.number}}（张）</p>
              </div>
            </div>
          </div>
          <p class="tips" v-if="list.length==0">暂无数据</p>
        </van-tab>
      </van-tabs>
    </nav-content>
  </div>
</template>

<script>
  import {Toast} from 'vant'
  import api from './api'
  export default {
    name: "afterSale",
    mixins: [api],
    data() {
      return {
        active: 0,
        obj: {},
        list: [],
        id: '',
        id1: ''
      };
    },
    mounted() {
      this.loadData()
      this.haveDone()
    },
    methods: {
      haveDone() { //待申请接口
        let that = this
        let params = {
          token: this.$store.state.login.token,
          orderId: that.$route.query.orderId,
          tradeNo: that.$route.query.tradeNo
        };

        this.$Loading.open()
        that.orderdetailData(params).then(res => {
          this.$Loading.close()
          if (res.data.result) {
            that.obj = res.data.data.travelJson || {}
            that.id1 = res.data.data.id //订单详情带过来的id
            // that.orderObj = res.data.data || {}
          }
        });
      },
      loadData() { //处理中、已完成接口
        let state = 0
        if (this.active == 1) {
          state = 0
        } else if (this.active == 2) {
          state = 1
        }
          let that = this
          let params = {
            token: this.$store.state.login.token,
            // mainOrderId: that.$route.query.id //订单列表的id
            mainOrderId: '1317',
            state: state, //0处理中，1已完成
          };

          this.$Loading.open()
          that.afterData(params).then(res => {
            console.log(res);
            this.$Loading.close()
            if (res.data.result) {
              that.list = res.data.data || []
              that.id = res.data.data.id
            } else {
              Toast(res.data.info)
            }
          });
      },
      change() {
        console.log(this.active);
        if (this.active == 0) {
          this.haveDone()
        } else {
          this.loadData()
        }
      },
      shenqing() {
        this.$router.push({
          path: '/carefree_trave/applyDetail',
          query: {
            id1: this.id1,
            name: this.obj.name
,           buyTicketsNumber: this.obj.buyTicketsNumber
          }
        })
      },
      chuli() {
        this.$router.push({
          path: '/carefree_trave/handle',
          query: {
            id: this.id
          }
        })
      },
      complete() {
        this.$router.push({
          path: '/carefree_trave/complate',
          query: {
            id: this.id
          }
        })
      },
    }
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
          span {
            align-items: end;
            background: #deb98c;
            color: white;
            width: 80px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 6px;
            margin-left: 100px;
            margin-top: 15px;
          }
        }
      }
    }
  }
  /deep/ .van-tabs__line {
    background-color: #deb98c !important;
  }
  .tips {
    text-align: center;
    font-size: 16px;
    margin-top: 60px;
  }
</style>

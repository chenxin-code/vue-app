<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="权益明细"></nav-top>
    <nav-content>
      <van-tabs v-model="active" @change="loadData">
        <van-tab title="派发记录">
          <div class="box">
            <div class="couponDiv">
              <ul>
                <li v-for="item in list">
                  <div class="coupon-left">
                    <img :src="item.couponPic" alt="">
                    <!-- <div class="price-info"><span class="unit">￥</span> <span class="price">30</span></div> -->
                  </div>
                  <div class="coupon-right">
                    <div class="double-line"><span class="coupon">{{item.couponType}}</span><span class="text">{{item.name}}</span></div>
                    <div class="time-wrapper"><span class="time">{{item.useTime}}失效</span></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!--          <p class="tips" v-if="list.length==0">暂无数据</p>-->
        </van-tab>
        <van-tab title="使用记录">
          <div class="box">
            <div class="couponDiv">
              <ul>
                <li v-for="item in list">
                  <div class="coupon-left">
                    <img :src="item.couponPic" alt="">
                    <!-- <div class="price-info"><span class="unit">￥</span> <span class="price">30</span></div> -->
                  </div>
                  <div class="coupon-right">
                    <div class="double-line"><span class="coupon">{{item.couponType}}</span><span class="text">{{item.name}}</span></div>
                    <div class="time-wrapper"><span class="time">{{item.useTime}}失效</span></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!--          <p class="tips" v-if="list.length==0">暂无数据</p>-->
        </van-tab>
        <van-tab title="过期记录">
           <div class="box">
            <div class="couponDiv">
              <ul>
                <li v-for="item in list">
                  <div class="coupon-left">
                    <img :src="item.couponPic" alt="">
                    <!-- <div class="price-info"><span class="unit">￥</span> <span class="price">30</span></div> -->
                  </div>
                  <div class="coupon-right">
                    <div class="double-line"><span class="coupon">{{item.couponType}}</span><span class="text">{{item.name}}</span></div>
                    <div class="time-wrapper"><span class="time">{{item.useTime}}失效</span></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!--          <p class="tips" v-if="list.length==0">暂无数据</p>-->
        </van-tab>
      </van-tabs>
    </nav-content>
  </div>
</template>

<script>
  import {Toast} from 'vant'
  // import api from './api'
  export default {
    name: "afterSale",
    // mixins: [api],
    data() {
      return {
       active:0,
       equityType:'',
       list:[]
      };
    },
    mounted() {
      this.equityType = JSON.parse(this.$route.query.equityType);
      this.loadData(0)
    },
    methods: {
      loadData(type){
        let paramsData = {
          token: this.$store.state.login.token,
          equityType:this.equityType,
          type:type+1
        }
        this.$http.post('/app/equity_member/queryMyEquityCouponDetail', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.list = data.data
          } else {
            this.$Toast('查看明细失败')
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background-color: #f6f6f6 !important;
    .box {
      /*margin: 70px 0 20px 0*/
      .div1 {
        padding: 0.213333rem;
        margin 0 auto
        box-shadow: 0 0 0.24rem 0 rgba(194, 192, 192, 0.3);
        .div_p {
          border-bottom 1px solid #ededed
          padding 20px 13px
          font-size 14px;
          display: flex;
          justify-content: space-between;
          .span1 {
            color #cb020d
          }
        }
      }
      .couponDiv {
        padding: 0.213333rem;
        box-shadow: 0 0 0.24rem 0 rgba(197, 197, 197, 0.3);
        border-radius: 0.106667rem;
        overflow: hidden;
        display: flex;

        ul {
          width 100%

          li {
            display: flex;
            justify-content space-between
            height: 2.666667rem;
            margin-bottom 20px;

            .coupon-left {
              width: 3.2rem;
              text-align: center;
              padding: 0.373333rem 0.266667rem;
              color: #fff;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              background-size: 100% 100% !important;
              background-repeat: no-repeat !important;
              background: radial-gradient(to right, #e6bbb1, #c3503d);
              border-top-left-radius 8px;
              border-bottom-left-radius 8px
              .price-info {
                flex-shrink: 0;
                .unit {
                  font-size: 0.64rem;
                }
                .price {
                  font-size: 1.2rem;
                  font-weight: 600;
                  margin-left: -0.213333rem;
                }
              }
            }

            .coupon-right {
              padding: 0.213333rem;
              padding-right: 0.48rem;
              flex: 1;
              font-size: 0.373333rem;
              position: relative;
              overflow: hidden;
              min-height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              margin-bottom 10px
              border: 1px solid #d3d3d3;
              border-left: 0;
              border-top-right-radius 8px;
              border-bottom-right-radius 8px
              .coupon {
                padding: 6px;
                border-radius: 10px;
                margin auto 0
                margin-right 15px
                color white;
                background: radial-gradient(to right, #e6bbb1, #c3503d);
              }

              .double-line {
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                display: flex;
                line-clamp: 2;
                box-orient: vertical;

                .text {
                  vertical-align: middle;
                  line-height: 0.533333rem;
                  font-size: 18px;
                  margin-top: 0.1rem;
                }
              }

              .time-wrapper {
                padding-top: 0.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .time {
                  font-size: 0.32rem;
                  color: #999;
                }
              }

              .status {
                font-size: 0.266667rem;
                color: #999;
                padding-top: 0.213333rem;
                display: flex;
                justify-content: space-between;
              }

              .used {
                position: absolute;
                right: 0.266667rem;
                top: 50%;
                transform: translateY(-50%);
              }

            }
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
  /deep/ .nav-content {
    overflow-y auto;
    background white
  }
</style>

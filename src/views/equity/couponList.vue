/**券权益明细*/
<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="权益详情" :bgImg="bg"></nav-top>
    <nav-content>
      <div class="containerTop">
       <div class="card">
          <img src="./imgs/card.png" alt="">
          <div class="wenjuan"><img :src="detail.equityPic" alt="">
            <div>
              <p>{{detail.equityName}}</p>
              <p>{{detail.equityValue}}</p>
            </div>
          </div>
          <div class="youxiao"><span>{{detail.Effective}}</span><span>{{detail.levelEquity}}</span></div>
          <span class="describe" @click="equityData">权益描述</span>
        </div>
      </div>
      <div class="box">
        <div class="div1">
          <div class="div_p"><p>可用<span class="span1">{{detail.cumulativeNum}}张</span>问卷</p><span @click="toDetail">权益明细<span class="img iconfont mall-gengduojiantou"></span></span></div>
        </div>
        <div class="couponDiv">
          <ul>
            <li v-for="item in detail.couponModelList">
              <div class="coupon-left">
                <img :src="item.couponPic" alt="">
                <!-- <div class="price-info"><span class="unit">￥</span> <span class="price">30</span></div> -->
              </div>
              <div class="coupon-right">
                <div class="double-line"><span class="coupon">{{item.couponType}}</span><span class="text">{{item.name}}</span></div>
                <div class="time-wrapper"><span class="time">{{item.endTime}}失效</span></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "couponList",
    data() {
      return {
        detail:{}
      }
    },
    computed: {
      bg() {
        return require('./imgs/bg1.png')
      }
    },
    mounted() {
       this.detail = JSON.parse(this.$route.query.detail);
       this.eType = String(this.detail.equityType).substr(0,1);
       var detail = this.detail;
       if(detail.validityType==1){
         detail.Effective = '永久有效';
       }else if(detail.validityType==2){
         detail.Effective = detail.days+'天内有效';
       }else if(detail.validityType==3){
         detail.Effective = detail.endTime+'前有效';
       }
       
    },
    methods: {
      equityData() {
        this.$router.push({
          path: '/equity/magnification',
          query: {
            equityType:this.detail.equityType
          }
        })
      },
      toDetail() {
        this.$router.push({
          path: '/equity/couponDetail',
          query: {
            equityType:this.detail.equityType
          }
        })
      },
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  /deep/ .nav-content {
    overflow-y auto !important
  }
  .containerTop {
    width: 100%
    height 100px;
    background-position: 50% 50%
    background: url("./imgs/bg2.png") no-repeat center
    overflow: hidden
    background-size: 100% 100%
    .card {
      width 90%;
      position absolute;
      left 5%
      img {
        width 100%
      }
      .youxiao {
        position: absolute;
        bottom: 22px;
        width: 80%;
        left: 50%;
        margin-left: -40%;
        color: #896123;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
      }
      .wenjuan {
        position: absolute;
        top: 20%;
        left: 8%;
        img {
          width 40px !important
          float left
        }
        div {
          float left
          display flex
          flex-direction column
          height 40px;
          margin-left 6px
          p {
            margin auto 0
          }
          p:nth-child(1) {
            font-size 14px
          }
          p:nth-child(2) {
            font-size: 14px;
            color: #626763;
          }
        }
      }
    }
    .describe {
      width 60px;
      height 22px
      line-height 22px;
      text-align center
      z-index 999
      border-bottom-left-radius 5px;
      border-top-left-radius 5px;
      background #835419
      color: #dbc68f
      position absolute
      top 50%
      margin-top -11px;
      right: 4%;
    }
  }
  .box {
    margin: 70px 0 20px 0
    .div1 {
      padding: 0.213333rem;
      margin 0 auto
      box-shadow: 0 0 0.24rem 0 rgba(194, 192, 192, 0.3);
      .div_p {
        border-bottom 1px solid #ededed
        padding 20px 13px
        font-size 16px;
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

  /deep/ .van-tabs__line {
    background-color: radial-gradient(to right, #ce000e, #ff994f) !important
  }
  </style>
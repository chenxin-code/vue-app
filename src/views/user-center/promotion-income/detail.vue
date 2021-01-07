<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="订单详情"></nav-top>
    <nav-content>
      <div class="title">
<!--       <div class="dayDiv">-->
<!--         <span class="span">-->
<!--          <span>{{$route.query.data.rebateDateStr}}</span>-->
<!--          <i class="icon iconfont mall-arrow-down"></i>-->
<!--        </span>-->
<!--       </div>-->
        <van-tabs v-model="active" @click="tabClick">
          <van-tab title="全部" name="1"></van-tab>
          <van-tab title="已付款" name="2"></van-tab>
          <van-tab title="无效" name="0"></van-tab>
        </van-tabs>
      </div>
      <div class="contain">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="orderDetail">
          <div class="containTop" v-for="item in list">
            <div class="phone">
              <img src="static/image/invoice/idcard.png" alt="">
              <span>{{item.userName ? item.userName.substr(0,3)+'****'+item.userName.substr(7) : ''}}</span>
              <span class="selfShop" v-if="item.selfBuyFlag == 1">自购</span>
            </div>
            <div class="orderNo">
              <span>{{item.mainOrderId}}</span>
              <span>{{item.submitTime}}</span>
            </div>
            <div class="state">
              <span>状态： {{item.stateStr}}</span>
              <span v-if="item.stateStr == '无效'" @click="invalidData" class="invalid">什么是无效订单</span>
            </div>
            <van-card
              :num="item.number"
              :price="item.salePrice"
              :title="item.skuName"
              :thumb="item.phPictureUrl"
            />
            <div class="money">
              <p>总计:<span>￥{{item.payAmount}}</span></p>
              <p>预计收益:<span class="red">￥{{item.predictRebate}}</span></p>
              <p>到账佣金:<span class="red">￥{{item.realityRebate}}</span></p>
            </div>
          </div>
        </van-list>
      </div>
    </nav-content>
    <van-overlay :show="show" @click="show = false">
      <div class="wrapper">
        <div class="block">
          <div class="info">
            <div>无效订单</div>
            <img @click="show = false" src="static/image/invoice/close-btn.png" alt="">
          </div>
          <div class="div">
            该订单发生退货、换货申请，该种订单不会产生推广收益
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
  export default {
    name: "detail",
    data() {
      return {
        active: 1,
        show: false,
        state: 1,
        loading: false,
        finished: false,
        page: 0,
        list: []
      }
    },
    mounted() {
    },
    methods: {
      tabClick(data) {
        this.state = data
        this.list = []
        this.orderDetail()
      },
      invalidData() {
        this.show = true
      },
      orderDetail() {
        let that = this
        that.page = that.page + 1
        let paramsData = {
          token: this.$store.state.login.token,
          yearMonthDay : this.$route.query.data.rebateDateStr,
          page: that.page,
          rows: 10,
          state: this.state, //1 全部 2 已完成 0 无效
        };
        this.$Loading.open()
        this.$http.post("/app/json/app_distribution_user/shareRebateOrderList", paramsData).then(res => {
          this.$Loading.close()
          if (res.data.result) {
            that.loadStart = true
            let data = res.data.data || []
            that.list = that.list.concat(data) || []
            if(that.page>=res.data.totalPages) {
              that.finished = true
            } else {
              that.finished = false
            }
          } else {
            that.finished = true
          }
          that.loading = false
        });
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .body {
    background #f6f6f6 !important
    .title {
      background white
      overflow hidden
      padding-bottom: 12px;
      .dayDiv {
        margin 10px 0
        display flex
        justify-content center
        span {
          background #f6f6f6
          padding: 4px 12px;
          display: inline-block;
          border-radius: 16px;
        }
      }
    }
    .contain {
      margin-top 10px
      .containTop {
        background white
        margin-bottom 10px
        padding 5px 12px
        font-size 14px
        .phone {
          padding 14px 0
          display flex
          img {
            width 25px
            margin auto 0
          }
          span {
            margin auto 5px
          }
          .selfShop {
            background: #d02c37;
            color: #fff;
            padding: 5px 10px;
            border-radius: 12px;
            font-size: 12px;
          }
        }
        .orderNo {
          display flex
          justify-content space-between
          color #3b3b3b
          font-size 14px
          padding-bottom 14px
        }
        .state {
          padding-bottom 10px
          display: flex;
          justify-content: space-between;
          .invalid {
            color #d02c37
          }
        }
        .money {
          padding 12px 0
          border-top 1px solid #dfdfdf
          display flex
          justify-content space-between
          font-weight bold
          .red {
            color #d02c37
          }
        }
      }
    }
  }
  /deep/ .theme_bg_white {
    background-color: #d02c37 !important
  }

  /deep/ .theme_font_black {
    color white !important
  }
  /deep/ .van-card__content {
    justify-content center !important
    .van-card__bottom {
      margin-top 10px
      display flex
      .van-card__num {
        margin auto 10px
      }
    }
  }
  /deep/ .van-card {
    background transparent
    padding 0px
    font-size 14px
    .van-card__price {
      color #d02c37
      font-weight bold
    }
  }
  /deep/ .nav-content {
    overflow-y auto !important
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .block {
      width: 80%;
      height: 120px;
      border-radius: 5px;
      background-color: #fff;

      .info {
        width 95%
        margin 10px auto
        display: flex;
        line-height: 26px;
        text-align center
        font-size 16px
        font-weight 600

        div {
          flex 1
          font-weight 600
        }

        img {
          width 20px
          height 20px
          border-radius 50%
          border 1px solid #999999
          margin auto
        }
      }

      .div {
        width 90%
        text-align center
        margin 20px auto
        font-size 15px
        line-height 22px
      }
    }

  }
</style>

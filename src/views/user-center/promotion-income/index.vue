<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="推广收益"></nav-top>
    <nav-content>
      <div class="income">
        <p class="title">每天都是美美的</p>
        <div class="div">
          <div class="profit" @click="profitData('1')">
            <p>累计预估收益</p>
            <p class="money">￥<span>{{obj.totalPredictRebate}}</span></p>
          </div>
          <div class="profit" @click="profitData('2')">
            <p>累计实际收益</p>
            <p class="money">￥<span>{{obj.totalRealityRebate}}</span></p>
          </div>
        </div>
      </div>
      <div class="days">
        <p class="p">近七日数据</p>
        <div>
          <p>预计收益：￥{{obj.datePredictRebate}}</p>
          <p>实际收益：￥{{obj.dateRealityRebate}}</p>
        </div>
      </div>
      <div class="classification" v-if="list.length>0">
        <p>日期</p>
        <p>预估收益</p>
        <p>实际收益</p>
      </div>
      <div class="classification profitDetail" @click="detail(item)" v-for="item in list">
        <p>{{item.rebateDateStr}}</p>
        <p class="p_profit">￥{{item.predictRebate}}</p>
        <p class="p_profit">￥{{item.realityRebate}}</p>
        <i class="icon iconfont mall-gengduojiantou"></i>
      </div>
      <div v-show="shareRebate">
        <p class="nullData" v-show="list.length==0">暂无查询结果</p>
      </div>
      <p class="tip" @click="getTip">收益说明</p>
      <van-overlay :show="show" @click="show = false">
        <div class="wrapper">
          <div class="block">
            <div class="info">
              <div>收益说明</div>
              <img @click="show = false" src="static/image/invoice/close-btn.png" alt="">
            </div>
            <div class="div">
              实际收益 = 预估收益 - 无效订单收益
            </div>
          </div>
        </div>
      </van-overlay>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        show: false,
        list: [],
        obj: {},
        shareRebate: false,
      }
    },
    created() {
      let paramsData = {
        token: this.$store.state.login.token
      };
      this.$Loading.open()
      this.$http.post("/app/json/app_distribution_user/shareRebate", paramsData).then(res => {
        this.$Loading.close()
        this.shareRebate = true
        console.log(res);
        let data = res.data;
          if (data.status == 0) {
            this.list = data.data.dateRebateDetailList || [];
            this.obj = data.data
          } else {
            this.$Toast(res.data.info);
          }
        });
    },
    methods: {
      getTip() {
        this.show = true
      },
      profitData(data) {
      let query = {}
       if (data == 1) {
         query = 1
       } else {
         query = 2
       }
       this.$router.push({
         path: '/promotion_income/static',
         query: {
           query: query
         }
       })
      },
      detail(data) {
        this.$router.push({
          path: '/promotion_income/detail',
          query: {
            data: data
          }
        })
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /deep/ .nav-content {
    overflow-y auto !important
  }

  /deep/ .theme_bg_white {
    background-color: #d02c37 !important
  }

  /deep/ .theme_font_black {
    color white !important
  }

  .body {
    background #f6f6f6 !important

    .income {
      background white
      margin-bottom 10px

      .title {
        text-align center
        padding 10px 0
        font-size 14px
      }

      .div {
        display flex
        justify-content space-between
        padding: 20px 0;

        .profit {
          width 50%
          text-align center
          font-size 16px

          .money {
            color #d02a37
            margin-top 10px
            font-weight 600

            span {
              font-size 24px
              font-weight 600
            }
          }
        }
      }
    }

    .days {
      background: white;
      padding: 15px 10px;
      display: flex;
      justify-content: space-between;
      font-size 16px

      .p {
        margin auto 0
      }

      div {
        margin auto 0
        color #686868

        p {
          margin 7px 0
        }
      }
    }

    .classification {
      padding 15px 0
      display flex
      font-size 16px
      text-align center

      p {
        flex 1
      }
    }

    .profitDetail {
      background white
      .p_profit {
        color #d02a37
      }
    }

    .tip {
      font-size 15px
      color #d02a37
      margin 50% 0 20px 0
      text-align center
    }
  }

  .iconfont {
    margin-right 5px
  }

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

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
    }
  }
  .nullData {
    font-size 20px;
    margin-top 100px;
    text-align center;
  }

</style>

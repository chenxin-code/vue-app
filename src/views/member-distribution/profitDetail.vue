<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" :title="title"></nav-top>
    <nav-content>
      <div v-if="$store.state.webtype != 3">
              <!-- 账户余额-->
      <div class="profit" v-if="showView == 5">
        <p class="p1"><span>{{profit.moneyBalance}}</span> 元</p>
        <p>账户余额</p>
        <div class="div1">
          <div>
            <p>{{profit.moneyAccounted}}</p>
            <p>已入账收益金额（元）</p>
          </div>
          <div>
            <p>{{profit.moneyUnaccounted}}</p>
            <p>未入账收益金额（元）</p>
          </div>
        </div>
      </div>
      <!-- 账户积分-->
      <div class="profit" v-if="showView == 3">
        <p class="p1"><span>{{profit.integralBalance?profit.integralBalance:0}}</span></p>
        <p>账户积分</p>
        <div class="div1">
          <div>
            <p>{{profit.integralAccounted?profit.integralAccounted:0}}</p>
            <p>收益已入账积分</p>
          </div>
          <div>
            <p>{{profit.integralUnaccounted?profit.integralUnaccounted:0}}</p>
            <p>收益未入账积分</p>
          </div>
        </div>
      </div>
      <!-- 油滴-->
      <div class="profit" v-if="showView == 8">
        <p class="p1"><span>{{profit.oilBalance?profit.oilBalance:0}}</span> 升</p>
        <p>油滴</p>
        <div class="div1">
          <div>
            <p>{{profit.oilAccounted?profit.oilAccounted:0}}</p>
            <p>已入油滴</p>
          </div>
          <div>
            <p>{{profit.oilUnaccounted?profit.oilUnaccounted:0}}</p>
            <p>未入油滴</p>
          </div>
        </div>
      </div>
      <!-- 豌豆-->
      <div class="profit" v-if="showView == 9">
        <p class="p1"><span>{{profit.peasBalance?profit.peasBalance: 0}}</span> 个</p>
        <p>豌豆</p>
        <div class="div1">
          <div>
            <p>{{profit.peasAccounted?profit.peasAccounted:0}}</p>
            <p>已入账豌豆</p>
          </div>
          <div>
            <p>{{profit.peasUnaccounted?profit.peasUnaccounted:0}}</p>
            <p>未入账豌豆</p>
          </div>
        </div>
      </div>
      <div class="tip">
        <p class="tipP">说明：</p>
        <p>未入账收益：在售后期限内，所产生的收益，统称未入账收益；</p>
      </div>
      <div class="titleP">贡献收益订单</div>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadIndex">
        <div class="publicInvoice" v-for="(item,index) in orderList" :key="index">
          <div class="operation">
            <div class="div1">
              <img class="headPic" :src="item.headPicUrl?item.headPicUrl:'../../../static/image/microShop/head@2x.png'" alt="">
              <span>{{item.mobile}}</span>
            </div>
            <div class="fans">
              <span>{{item.orderCode}}</span>
              <span>{{item.submitTime}}</span>
            </div>
            <div v-for="(item1,index1) in item.distributionOrderItems" :key="index1">
              <div class="div2">
                <img :src="item1.picMainUrl" alt="">
                <div class="div3">
                  <span class="span">{{item1.skuName}}</span>
                  <div>
                    <span>规格：{{item1.specs}}</span>
                    <span>￥{{item1.salePrice}}</span>
                    <span>x{{item1.number}}</span>
                  </div>
                </div>
              </div>
              <div class="statistics">
                <span>总计：{{item1.sumPrice}}</span>
                <span>收益：{{item1.rebate}}</span>
                <!--              <span>{{item1.rewardState}}</span>-->
                <span v-if="item1.rewardState == 0">未奖励</span>
                <span v-if="item1.rewardState == 1">待奖励</span>
                <span v-if="item1.rewardState == 2">已奖励</span>
              </div>
            </div>
          </div>
        </div>
      </van-list>
      </div>
   <div v-if="$store.state.webtype == 3">
        <div class="enterBoxList">
        <div class="fans">
          <p>2000积分</p>
          <p @click="contributionType">贡献类型<span class="icon iconfont mall-gengduojiantou"></span></p>
        </div>
        <div class="enterBoxListTitle">
          <span>我的收益</span>
          <span>邀请时间</span>
          <span>贡献收益</span>
          <span>消费情况</span>
          <span>贡献类型</span>
        </div>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <ul>
            <li v-for="(item,index) in rankingList" :key="index">
              <div class="div1">
                <img class="img1" :src="item.wechatHeadPic" v-if="item.wechatHeadPic" alt="">
                <img class="img1" src="static/image/microShop/head@2x.png" alt="" v-else>
                <p>昵称</p>
              </div>
              <div class="div">
                <p>{{item.inviteDate[0]}}</p>
                <p>{{item.inviteDate[1]}}</p>
              </div>
              <div class="div3">
                <p><span>1000</span>积分</p>
              </div>
              <div class="div1">
                <p><span>￥1000</span></p>
              </div>
               <div class="div3">
                <p><span>商城消费</span></p>
              </div>
            </li>
          </ul>
        </van-list>
         <van-action-sheet
        v-model="show"
        :actions="actions"
        @select="onSelect"
      />
      </div>
   </div>
    </nav-content>
  </div>
</template>

<script>
  import api from './api'

  export default {
    name: "",
    mixins: [api],
    data() {
      return {
        showView: 0,
        pagenum: 0,
        profit: {},
        title: '',
        sellAmount: '',
        loading: false,
        finished: false,
        page: 0,
        show: false,
        orderList: [],
        actions: [
          { name: '全部' },
          { name: '商城消费' },
          { name: '油品消费' }
        ],
        timeStart: '',
        timeEnd: '',
        timeStart1: '',
        timeEnd1: '',
        integralAccountedTimeRange: '',
        listData: [
          {time: '2019-05-15 17:13', title: '加油卡加油开票 ', money: '300.00', card: '11111111111111'},
          {time: '2019-05-15 17:13', title: 'APP自助加油开票 ', money: '300.00', card: '222222222222'},
          {time: '2019-05-15 17:13', title: '商城购物开票', money: '300.00', card: '33333333333333'}
        ],
      }
    },
    created() {
      this.timeStart1 = this.$route.params.timeStart
      this.timeEnd1 = this.$route.params.timeEnd
    },
    mounted() {
      if (this.$store.state.webtype != 3) {
      this.title = '我的销量'
    } else {
      this.title = '我的收益'
    }
      if (this.$route.params.type == 3) {
        this.showView = 3
      } else if (this.$route.params.type == 8) {
        this.showView = 8
      } else if (this.$route.params.type == 9) {
        this.showView = 9
      }
      // this.loadIndex()
    },
    methods: {
      contributionType() {
        this.show = true
      },
      loadIndex() {
        let that = this
        that.page = that.page + 1
        if ( this.$store.state.webtype == 3) {
          let params = {
            token: this.$store.state.login.token,
            rows: 10,
            page: that.page,
            profitType: that.showView, //3 积分 8 油滴 9 豌豆
            timeStart: that.timeStart1=='开始时间'?'':that.timeStart1,
            timeEnd: that.timeEnd1=='结束时间'?'':that.timeEnd1
          }

          that.detailData1(params).then(res => {
            if (res.data.result === 'success') {
              let data = res.data.data || {}
              that.profit = data
              that.sellAmount = data.sellAmount
              that.integralAccountedTimeRange = data.integralAccountedTimeRange
              that.timeStart = res.data.timeStart
              that.timeEnd = res.data.timeEnd
              let array = that.profit.orderList
              that.orderList = that.orderList.concat(array) || []
              if (that.page >= res.data.totalPages) {
                that.finished = true
              }
            } else {
              that.finished = true
            }
            that.loading = false
          })
        } else {
          let params = {
            token: this.$store.state.login.token,
            rows: 10,
            page: that.page,
            profitType: that.showView //3 积分 8 油滴 9 豌豆
          }

          that.detailData(params).then(res => {
            if (res.data.result === 'success') {
              let data = res.data.data || {}
              that.profit = data
              let array = that.profit.orderList
              that.orderList = that.orderList.concat(array) || []
              if (that.page >= res.data.totalPages) {
                that.finished = true
              }
            } else {
              that.finished = true
            }
            that.loading = false
          })
        }
      },
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background #f6f6f6 !important;

    .tip {
      background white;
      margin 10px 0
      padding 20px
      /*text-align center*/
      font-size 14px;
      color #666666

      .tipP {
        font-size 14px;
        margin-bottom 10px;
        color black
      }
      div {
        display: flex;
        justify-content: space-between;
        width: 80%;
        margin-top: 15px;
      }
      .div1 {
        margin-top: 25px;
      }
    }

    .titleP {
      padding: 10px 20px;
      background: #f6f6f6;
      font-size: 16px;
    }

    .profit {
      background white;
      margin 10px 0
      padding 20px 0
      text-align center
      font-size 16px;

      .p1 {
        color #f44;
        margin 10px 0;

        span {
          font-size 22px;
          font-weight 600
        }
      }

      .div1 {
        display flex
        justify-content space-around
        margin-top 20px;

        div {
          p {
            margin 10px 0
          }

          p:nth-child(1) {
            font-weight 600
          }

          p:nth-child(2) {
            font-size 14px;
          }
        }
      }
    }

    .publicInvoice {
      /*box-shadow: #f3f3f3 0px 0px 15px;*/
      background white
      /*margin: 0 auto 5px auto;*/
      padding 15px 20px 0 20px
      overflow: hidden;
      margin-bottom 10px;

      .operation {
        width: 100%;
        margin: 0 auto;
        padding: 15px 0px 0 px 0;
        /*border-bottom: 1px solid #ebedf0;*/

        .div1 {
          display flex
          justify-content start
          font-size 16px;

          .headPic {
            width 25px;
            height 25px;
          }

          span {
            margin auto 10px;
          }
        }

        .fans {
          line-height: 30px;
          display: flex;
          justify-content: space-between;
          color #787878
        }

        .div2 {
          font-size 16px;
          padding 20px 0 10px 0
          display flex
          justify-content space-between
          border-bottom 1px solid #f6f6f6;

          img {
            width: 100px;
            height 100px;
            vertical-align: top;
            margin-right: 20px;
          }
        }

        .div3 {
          display flex
          flex-direction column;
          font-size 14px;
          color #9c9c9c;

          .span {
            font-size 18px;
            color black
          }

          span {
            margin 0 10px;
          }

          div {
            margin-top 30px;
            display flex
            justify-content space-between
          }
        }

        .statistics {
          display flex;
          padding: 15px 0;

          span {
            flex: 1
          }

          span:nth-child(2) {
            text-align center
          }

          span:nth-child(3) {
            color #F80F16
            text-align end
          }
        }

        .mall-jiantou {
          padding-left 30px;
          margin auto 0

          span {
            margin-top 7px;
            display inline-block
            font-size 16px;
            color: #F80F16
            font-weight 600
            margin-right 5px;
          }
        }

      }

      .te {
        border-bottom: none;
      }

      .maDiv {
        padding-bottom 10px;

        p {
          text-align: center;
          color: #787878;
          font-size 14px;
          margin-top: 0.3rem;
        }

        .ma {
          width: 150px;
          height: 150px;
          margin: 10px auto 10px auto;

          /deep/ .qrcode {
            width: 150px !important;
            height: 150px !important;
          }
        }
      }

      /deep/ .van-cell:not(:last-child)::after {
        right: 0.4rem;
      }

      .borDiv:not(:last-child)::after {
        border-bottom: 0;
      }

      .fa {
        /deep/ .van-field__control {
          text-align: right;
        }
      }

      .nei {
        /deep/ .van-field__control {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }

    /deep/ .nav-content {
      overflow-y auto;
    }
  }
</style>

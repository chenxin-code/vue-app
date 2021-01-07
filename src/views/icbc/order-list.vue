/**Created by liaoyingchao on 2020-06-19.*/

<template>
  <div class="order-list">
    <nav-top @backEvent="$router.go(-1)" :bgImg="require('./imgs/top-bg.png')"></nav-top>
    <nav-content>
      <div class="content-bg">
        <pull-to
          ref="scrollDiv"
          :isBottomAutoS="true"
          :bothEventForce="true"
          :top-load-method="topRefresh"
          :is-top-bounce="true"
          :bottom-load-method="loadMore"
          :is-bottom-bounce="noMore"
        >
          <div class="list">
            <div class="cell" v-for="item in listData" @click="toDetail(item)">
              <div class="row line_bottom">
                <div class="">订单号：{{item.id}}</div>
                <div class="">{{getItemState(item)}}</div>
              </div>
              <div class="row">
                <div class="title">{{item.skuNames.substr(0, item.skuNames.length - 2)}}</div>
              </div>
              <div class="row">
                <div class="">支付时间：{{item.payTime}}</div>
                <div class="amount" v-if="item.payModeSub == '305007'">消耗积分：<span>{{getPayPoints(item.payAmount)}}</span></div>
                <div class="amount" v-else>实付金额：¥<span>{{$util.toDecimal2(item.payAmount)}}</span></div>
              </div>
            </div>
          </div>
          <div class="no-data" v-if="listData.length == 0 && loaded">暂无购券记录！</div>
        </pull-to>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import PullTo from '@/components/Vendor/vue-pull-to/vue-pull-to'

  export default {
    name: "order-list",
    components: {
      PullTo
    },
    data() {
      return {
        page: 1,
        listData: [],
        noMore: false,
        loaded: false
      }
    },
    methods: {
      toDetail: function (item) {
        this.$router.push({
          path: '/icbc/orderdetail',
          query: {
            orderPayType: item.orderPayType,
            orderType: item.orderType,
            orderId: item.id
          }
        })
      },
      getPayPoints: function (payAmount) {
        let num = payAmount * 100
        if (this.$store.state.globalConfig.pay_icbc_points_conversion_ratio) {
          num = num * this.$store.state.globalConfig.pay_icbc_points_conversion_ratio
        }
        return num
      },
      getItemState: function (item) {
        let str = '已派券'
        if (item.rechargeState == '0' || item.rechargeState == '1') {
          str = '派券中'
        } else if (item.rechargeState == '3') {
          str = '派券失败'
        }
        return str
      },
      getTabOrders: function (loaded) {

        this.$Loading.open();
        let url = '/app/json/app_shopping_order/queryOrder';
        let paramsData = {
          orderType: '200017',
          state: '9',
          productType:'513',
          page: {
            index: this.page,
            pageSize: 10
          }
        };

        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            this.loaded = true

            let data = res.data;
            if (data.status == 0) {
              for (let i = 0; i < data.data.orderList.length; i++) {
                let item = data.data.orderList[i]
                if (item.wechatMerchantCouponAmount && item.wechatMerchantCouponAmount > 0) {
                  item.payAmount = item.payAmount - item.wechatMerchantCouponAmount
                }
                this.$mallCommon.dataProcessing(item)
                this.listData.push(item)
              }

              if (data.data.page.count > this.listData.length) {
                this.noMore = true;
              } else {
                this.noMore = false;
              }
            } else {
              this.$Toast(data.info);
            }
            if (loaded) {
              loaded('done');
            }
          },
          error => {
            this.loaded = true
            this.$Loading.close();
            this.$Toast('请求数据失败！');
            if (loaded) {
              loaded('done');
            }
          }
        );
      },
      topRefresh: function (loaded) {
        this.page = 1
        this.listData = []
        this.getTabOrders(loaded)
      },
      loadMore: function (loaded) {
        this.page += 1;
        this.getTabOrders(loaded)
      },
    },
    created() {
      this.getTabOrders()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .order-list {
    width 100%
    height 100%
    overflow hidden
    .content-bg {
      height 100%;
      background-color #efefef;
      overflow-y auto;
      -webkit-overflow-scrolling touch;
      .list {
        overflow hidden;
        .cell {
          margin 10px;
          box-shadow 0 1px 8px #efefef;
          background-color white;
          border-radius 8px;
          padding 4px 10px;
          .row {
            padding 12px 0;
            font-weight 500;
            display flex;
            align-items flex-end;
            justify-content space-between;
            font-size 12px;
            color #999;
            .title {
              color black;
              font-size 16px;
              margin-bottom -10px;
            }
            .amount {
              color black;
              font-size 12px;
              span {
                font-size 16px;
                font-weight 500;
              }
            }
          }
        }
      }
      .no-data {
        padding 30px;
        font-size 16px;
        color #999;
      }
    }
  }
</style>

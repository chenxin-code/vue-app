/**Created by liaoyingchao on 2019-04-30.*/

<template>
  <div class="order-list mall2">
    <nav-top :title="$store.state.globalConfig.enterprise_group_title || ''" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="my-content">
        <div class="tabs">
          <div class="tab-item" v-for="(item, idx) in tabs" @click="tabEvent(item)">
            <div class="text theme_font_black" :class="{'selected-btn': tabSelectedItem.tag == item.tag}">{{item.text}}</div>
            <!--<div class="line" :class="{theme_bg_red_i: tabSelectedItem.tag == item.tag}"></div>-->
          </div>
        </div>
        <div class="scroll-div">
          <div class="order-tab" v-if="tabSelectedItem.tag == '4'">
            <p class="theme_font_white theme_bg_light_red" :class="{theme_bg_red_i: $store.state.mall2.staticDeliverType == '2'}" @click="deliveryTypeSelected(2)">待收货</p>
            <p class="theme_font_white theme_bg_light_red" :class="{theme_bg_red_i: $store.state.mall2.staticDeliverType == '1'}" @click="deliveryTypeSelected(1)">待提货</p>
          </div>
          <div v-if="listData.length > 0">
            <div class="block-div" v-for="item in listData" @click="orderDetailEvent(item)">
              <div class="flex-row" style="display: block;">
                <OrderPro :itemData="item" :stateText="stateText"></OrderPro>
              </div>
              <div class="flex-row">
                <div class="full"></div>
                <div class="theme_font_common order-amount">
                  <label>订单金额：</label>
                  <span class="theme_font_red">¥</span>
                  <div v-if="item.applyPriceState==1">
                    <span class="big theme_font_red">{{getIntStr(item.adjustAmount)}}.</span>
                    <span class="theme_font_red">{{getDecimalStr(item.adjustAmount)}}</span>
                  </div>
                  <div v-else>
                    <span class="big theme_font_red">{{getIntStr(item.amount)}}.</span>
                    <span class="theme_font_red">{{getDecimalStr(item.amount)}}</span>
                  </div>

                </div>
              </div>
              <div class="flex-row flex-row-smallbottom" v-if="tabSelectedItem.tag == '1'">
                <div class="full"></div>
                <div class="row-btn row-btn-big-space theme_font_common theme_border_gray line_circle" @click.stop="cancelOrderEvent(item)">取消订单</div>
              </div>
              <div class="flex-row flex-row-smallbottom" v-if="tabSelectedItem.tag == '2'">
                <div class="full"></div>
                <div class="row-btn row-btn-big-space theme_font_common theme_border_gray line_circle" @click.stop="cancelOrderEvent(item)" >取消订单</div>
                <div class="row-btn row-btn-big-space theme_font_common theme_border_gray line_circle" @click.stop="uploadProof(item)" v-if="item.payType==0">上传支付凭证</div>
                <div class="row-btn row-btn-big-space theme_font_common theme_border_gray line_circle" @click.stop="pay(item)" v-if="item.payType!=0">立即支付</div>
              </div>
              <div class="flex-row flex-row-smallbottom" v-if="tabSelectedItem.tag == '4' && $store.state.mall2.staticDeliverType == '2'">
                <div class="full"></div>
                <!--<div class="row-btn row-btn-big-space theme_font_common theme_border_gray"  v-if="isShowExpress" @click.stop="checkWULEvent(item)">查看物流信息</div>-->
                <div class="row-btn row-btn-big-space theme_font_common theme_border_gray line_circle" @click.stop="finishedEvent(item)">确认收货</div>
              </div>
              <div class="flex-row flex-row-smallbottom" v-if="tabSelectedItem.tag == '4' && $store.state.mall2.staticDeliverType == '1'">
                <div class="full"></div>
                <!--<div class="row-btn row-btn-big-space theme_font_common theme_border_gray"  v-if="isShowExpress" @click.stop="checkWULEvent(item)">查看物流信息</div>-->
                <div class="row-btn row-btn-big-space theme_font_common theme_border_gray line_circle" @click.stop="cancelOrderEvent(item)" >取消订单</div>

              </div>
            </div>
          </div>
          <div v-else-if="loaded">
            <van-empty description="暂无订单" />
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import OrderPro from './base/order-pro'
  import { Dialog } from 'vant'

  export default {
    name: "order-list",
    components: {
      OrderPro
    },
    data() {
      return {
        tabs: [{
          text: '待确认',
          tag: '1',
          nowPage:1,
          isCanLoadMore:true
        }, {
          // text: '待收款',
          text: '待付款',
          tag: '2',
          nowPage:1,
          isCanLoadMore:true
        }, {
          text: '待发货',
          tag: '3',
          nowPage:1,
          isCanLoadMore:true
        }, {
          text: '待收(提)货',
          tag: '4',
          nowPage:1,
          isCanLoadMore:true
        }, {
          text: '已完成',
          tag: '5',
          nowPage:1,
          isCanLoadMore:true
        }, {
          text: '已取消',
          tag: '0',
          nowPage:1,
          isCanLoadMore:true
        }],
        tabSelectedItem: {},
        listData: [],
        loaded: false,
        stateText: ''
      }
    },
    computed: {
      isShowExpress() {
        return this.$store.state.webtype != 3
      }
    },
    methods: {
      deliveryTypeSelected: function (type) {
        this.$store.state.mall2.staticDeliverType = type
        this.getOrderList()
      },
      uploadProof(item){
        this.$router.push({
                      path: '/micro_sho/uploadproof',
                      query: {
                        id:item.id,
                        proofUrl:item.proofUrl
                      }
                    })
      },
      pay(item){
        console.log(item,"item")
        this.$router.replace({
          path: '/mall2/checkstand',
          query: {
            payInfo: JSON.stringify({
              orderId: item.id,
              orderType: item.orderType,
              payAmount: item.applyPriceState==1?item.adjustAmount:item.amount,
              tradeNo: item.tradeNo,
            }),
            occurOuCode:item.ouCode,
            type:'app_purchase_order'
            // payInfo: JSON.stringify(data.data),
            // occurOuCode: this.occurData.ouCode,
            // orderCategory: this.paramsData.orderCategory,
            // vipUnitUserCode: this.paramsData.vipUnitUserCode
          }
        })
      },
      finishedEvent: function (item) {
        let url = '/app/json/app_purchase_order/orderConfirm'
        let paramsData = {
          id: item.id
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.getOrderList()
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      checkWULEvent: function (item) {

      },
      cancelOrderEvent(item) {
        Dialog.confirm({
          title: '提示',
          className: 'reset-cancel-order-dialog',
          message: '您确定要取消该订单吗？',
        })
          .then(() => {
            let url = '/app/json/app_purchase_order/cancelOrder'
            let paramsData = {
              id: item.id
            };
            this.$Loading.open()
            this.$http.post(url, paramsData).then(
              res => {
                this.$Loading.close()
                let data = res.data
                if (data.status == 0) {
                  this.getOrderList()
                } else {
                  this.$Toast(data.info)
                }
              },
              error => {
                this.$Loading.close()
                this.$Toast('请求数据失败！')
              }
            )
          })
          .catch(() => {
            // on cancel
          })
      },
      getIntStr: function (str) {
        let arr = this.$util.toDecimal2(str).split('.')
        return arr[0]
      },
      getDecimalStr: function (str) {
        let arr = this.$util.toDecimal2(str).split('.')
        return arr[1]
      },
      getOrderList: function () {
        this.listData = []
        this.loaded = false
        let url = '/app/json/app_purchase_order/queryOrder'
        let paramsData = {
          status: this.tabSelectedItem.tag,
        };
        this.stateText = this.tabSelectedItem.text
        if (paramsData.status == '3') {
          paramsData.deliverType = '2'
        } else if (paramsData.status == '4') {
          if (this.$store.state.mall2.staticDeliverType == '1') {
            paramsData.status = '3'
            paramsData.deliverType = '1'
            this.stateText = '待提货'
          } else {
            this.stateText = '待收货'
          }
        }
        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.loaded = true
              this.listData = data.data.orderList
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      orderDetailEvent: function (item) {
        this.$router.push({
          path: '/mall2/purchaseorderdetail',
          query: {
            id: item.id
          }
        })
      },
      tabEvent: function (item) {
        this.tabSelectedItem = item
        this.getOrderList()
      }
    },
    created() {
      if (this.$store.state.globalConfig.enterprise_group_title) {
        document.title = this.$store.state.globalConfig.enterprise_group_title
      }
      this.tabEvent(this.tabs[0])
    }
  }
</script>

<style lang="stylus">
  .reset-cancel-order-dialog {
    .van-dialog__message {
      padding 8px 0 26px;
    }
  }
</style>
<style lang="stylus" scoped type="text/stylus">
  .order-list {
    width 100%
    height 100%
    overflow hidden
    .my-content {
      width 100%
      height 100%
      overflow hidden
      position relative;
      .scroll-div {
        position absolute;
        left 0px;
        right 0px;
        top 30px;
        bottom 0px;
        overflow-y auto
        .order-tab {
          width 100%;
          display flex;
          p {
            flex 1
            text-align center;
            font-size 16px;
            font-weight 500;
            padding 10px;
          }
        }
        .order-amount {
          font-size 12px;
          display flex;
          align-items flex-end;
          span {
            font-weight 500;
          }
          .big {
            font-size 18px;
          }
        }
      }
    }
  }
</style>

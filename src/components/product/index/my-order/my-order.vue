<template>
  <div class="my-order">
    <div v-if="moduleData.styleTempl == '1'" class="style1">
      <div class="content">
        <div class="title-row" :class="hotareaClass({idCode: moduleData.idCode + 'allOrderEvent'})" @click="hotEvent('allOrderEvent');allOrderEvent()">
          <div class="title">我的订单</div>
          <div class="text">全部订单</div>
          <img class="arrow" src="static/images/my-order/all-order.png"/>
        </div>
        <div class="items-row" v-if="refresh">
          <div class="item" v-for="(item, idx) in orderItems" :key="idx" @click="$market.customPush(item.link)">
            <img :src="getMyOrderIcon(item, idx)"/>
            <div class="text">{{item.name}}</div>
            <div class="count theme_bg_red theme_font_white" v-if="item.countKey && $store.state.mall2.order[item.countKey] > 0">{{$store.state.mall2.order[item.countKey]}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="moduleData.styleTempl == '2'" class="style1">
      <div class="content">
        <div class="title-row" :class="hotareaClass({idCode: moduleData.idCode + 'allOrderEvent'})" @click="hotEvent('allOrderEvent');allOrderEvent()">
          <div class="title">充电订单</div>
          <div class="text">全部订单</div>
          <img class="arrow" src="static/images/my-order/all-order.png"/>
        </div>
        <div class="items-row">
          <div class="item" v-for="(item,idx) in chargeItems" :key="idx" @click="$market.customPush(item.link)">
            <img :src="item.img"/>
            <div class="text">{{item.name}}</div>
            <div class="count theme_bg_red theme_font_white" v-if="item.countKey && $store.state.mall2.order[item.countKey] > 0">{{$store.state.mall2.order[item.countKey]}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Bus from "../bus";
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: 'my-order',
    components: {},
    props: ['myIndex', 'usePorpData', 'propData'],
    mixins: [hee],
    data() {
      return {
        orderItems: [{
          img: 'static/images/my-order/order0_1.png',
          name: '待支付',
          countKey: 'orderCount_dzf',
          link: {
            path: '/mall2/orderlist',
            query: {
              selectedIndex: 0
            }
          },
        },{
          img: 'static/images/my-order/order1_1.png',
          name: '待发货',
          countKey: 'orderCount_dfh',
          link: {
            path: '/mall2/orderlist',
            query: {
              selectedIndex: 1
            }
          },
        },{
          img: 'static/images/my-order/order2_1.png',
          name: '待收货',
          countKey: 'orderCount_dsh',
          link: {
            path: '/mall2/orderlist',
            query: {
              selectedIndex: 2,
              deliveryType: 2
            }
          },
        },{
          img: 'static/images/my-order/order3_1.png',
          name: '待提货',
          countKey: 'orderCount_dth',
          link: {
            path: '/mall2/orderlist',
            query: {
              selectedIndex: 2,
              deliveryType: 1
            }
          },
        },{
          img: 'static/images/my-order/servers_1.png',
          name: '退换/售后',
          link: {
            path: '/mall2/serviceindex',
          },
        }],
        chargeItems: [{
          img: 'static/images/my-order/order1.png',
          name: '充电中',
          countKey: null,
          link: {
            path: '/batteryorder',
            query: {
              index: 0
            }
          },
        },{
          img: 'static/images/my-order/order2.png',
          name: '已预约',
          countKey: null,
          link: {
            path: '/batteryorder',
            query: {
              index: 1
            }
          },
        },{
          img: 'static/images/my-order/order3.png',
          name: '已完成',
          countKey: null,
          link: {
            path: '/batteryorder',
            query: {
              index: 2,
            }
          },
        }],
        refresh: true
      };
    },
    computed: {
      pageData: function() {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function() {
        return this.pageData.moduleList[this.myIndex].data;
      },
    },
    created() {
      if (this.$store.state.webtype == -1 && !this.moduleData.idCode) {
        this.moduleData.idCode = this.$util.randomString()
      }
      if (this.$store.state.globalConfig.delivertype_default == '1') {
        this.orderItems = [{
          img: 'static/images/my-order/order0_1.png',
          name: '待支付',
          countKey: 'orderCount_dzf',
          link: {
            path: '/mall2/orderlist',
            query: {
              selectedIndex: 0
            }
          },
        },{
          img: 'static/images/my-order/order3_1.png',
          name: '待提货',
          countKey: 'orderCount_dth',
          link: {
            path: '/mall2/orderlist',
            query: {
              selectedIndex: 1,
              deliveryType: 1
            }
          },
        },{
          img: 'static/images/my-order/servers_1.png',
          name: '退换/售后',
          link: {
            path: '/mall2/serviceindex',
          },
        }];
      } else if (this.$store.state.globalConfig.delivertype_default == '2') {
        this.orderItems = [{
          img: 'static/images/my-order/order0_1.png',
          name: '待支付',
          countKey: 'orderCount_dzf',
          link: {
            path: '/mall2/orderlist',
            query: {
              selectedIndex: 0
            }
          },
        },{
          img: 'static/images/my-order/order1_1.png',
          name: '待发货',
          countKey: 'orderCount_dfh',
          link: {
            path: '/mall2/orderlist',
            query: {
              selectedIndex: 1
            }
          },
        },{
          img: 'static/images/my-order/order2_1.png',
          name: '待收货',
          countKey: 'orderCount_dsh',
          link: {
            path: '/mall2/orderlist',
            query: {
              selectedIndex: 2,
              deliveryType: 2
            }
          },
        },{
          img: 'static/images/my-order/servers_1.png',
          name: '退换/售后',
          link: {
            path: '/mall2/serviceindex',
          },
        }];
      }

      Bus.$on('refreshOrderItems', () => {
        this.refresh = false
        this.$nextTick(() => {
          this.refresh = true
        })
      });
      if (this.moduleData.styleTempl == '1') {
        this.getMyOrder();
      }
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      getMyOrderIcon: function (item, idx) {
        let keyIdx = idx + 1
        let key = 'orderIcon_' + keyIdx
        let img =this.moduleData[key];
        if (img && img != undefined && img != '') {
          return img
        }
        return item.img
      },
      modeleReshow: function () {
        if (this.moduleData.styleTempl == '1') {
          this.getMyOrder();
        }
      },
      allOrderEvent: function () {
        this.$market.customPush({
          path: '/mall2/orderlist',
        })
      },
      getMyOrder: function() {
        if (this.$store.state.login.token == '') {
          return ;
        }
        let url = this.$market.apiBaseURL() + '/app/json/app_shopping_order/queryBadge';
        let paramsData = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data) {
              let countArr = data.data;
              if (countArr.length >= 4) {
                this.$store.state.mall2.order.orderCount_dzf = countArr[0].count
                this.$store.state.mall2.order.orderCount_dfh = countArr[1].count
                this.$store.state.mall2.order.orderCount_dsh = countArr[2].count
                this.$store.state.mall2.order.orderCount_dth = countArr[3].count
              }
            }
          },
          error => {
          }
        );
      },
    },
  };
</script>

<style lang="stylus" scoped>
  @import '~@/common/stylus/variable.styl';
  //
  .my-order {
    .style1 {
      padding 5px 8px;
      .content {
        box-shadow 0 1px 8px #efefef;
        border-radius 8px;
        padding 8px;
        .title-row {
          padding 8px 0px;
          border-bottom 0.5px solid #ddd;
          display flex;
          align-items center;
          .title {
            font-size 15px;
            font-weight 500;
            flex 1;
            color #333;
          }
          .text {
            font-size 13px;
            color #666;
          }
          .arrow {
            margin-left 5px;
            height 12px;
          }
        }
        .items-row {
          margin-top 4px;
          padding 8px 0px;
          display flex;
          align-items center;
          .item {
            position relative;
            flex 1;
            text-align center;
            font-size 0px;
            img {
              width 24px;
              height 24px;
            }
            .text {
              margin-top 8px;
              font-size 13px;
              color #333;
            }
            .count {
              position absolute;
              right 20px;
              margin-right -10px;
              top -5px;
              z-index 1;
              padding 2px 5px;
              border-radius 10px;
              font-size 12px;
            }
          }
        }
      }
    }
  }
</style>


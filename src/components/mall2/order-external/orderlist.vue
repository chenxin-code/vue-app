/**Created by liaoyingchao on 2018/11/5.*/

<template>
  <div class="order mall2" :class="{theme_sys_base:orderCategory == 1,theme_sys_blue:orderCategory == 1}">
    <nav-top @backEvent="backEvent">
      <div
        class="right-btn theme_font_gray"
        style="right: 0px; height: 44px; top: 0px; padding-right: 10px;font-size: 12px;"
        @click="toHistory"
        v-if="$store.state.globalConfig.kshop_orderListUrl && $store.state.globalConfig.kshop_orderListUrl != undefined"
      >历史订单
      </div>
    </nav-top>
    <nav-content>
      <div class="tabs">
        <div class="tab-item" v-for="(item, idx) in tabs" @click="tabEvent(item, idx)">
          <div
            class="text theme_font_black"
            :class="{'selected-btn': tabSelectedItem.tag == item.tag}"
          >{{item.text}}
          </div>
          <!--<div class="line" :class="{theme_bg_red_i: tabSelectedItem.tag == item.tag}"></div>-->
        </div>
      </div>
      <div class="scroll-div">
        <pull-to
          ref="scrollDiv"
          :bottom-load-method="loadMore"
          :is-bottom-bounce="tabSelectedItem.isCanLoadMore"
        >
          <!--待支付-->
          <div v-if="tabSelectedItem.tag == '1'">
            <div class="block-div" v-for="item in listData" @click="orderDetailEvent1(item)" v-if="item.orderType == '200104'">
              {{$mallCommon.dataProcessing(item)}}
              <div class="flex-row">
                <div class="full">
                  <i class="dianpu-icon iconfont mall-dianpu theme_font_red"></i>
                  {{item.ouName}}
                </div>
                <div class="font-small theme_font_red">等待付款</div>
              </div>
              <div class="flex-row">
                <OrderPros :orderItemList="item.itemAbstractList" :type="'external'"></OrderPros>
              </div>
              <div class="flex-row">
                <div class="full"></div>
                <div class="font-small theme_font_tint">
                  <span>共{{item.itemAbstractList.length}}件商品 &nbsp; 需付款：</span>
                  <PriceOrder :orderitem="item"></PriceOrder>
                </div>
              </div>
              <div class="flex-row flex-row-smallbottom" v-if="item.orderType != '200117'">
                <div class="full"></div>
                <div
                  class="row-btn line_circle row-btn-big-space theme_font_common theme_border_gray"
                  @click.stop="payEvent(item)"
                >付款
                </div>
              </div>
            </div>
            <div class="block-div" v-for="item in listData" @click="orderDetailEvent(item)" v-if="item.orderType != '200104'">
              {{$mallCommon.dataProcessing(item)}}
              <div class="flex-row">
                <div class="full">
                  <i class="dianpu-icon iconfont mall-dianpu theme_font_red"></i>
                  {{item.ouName}}
                </div>
                <div class="font-small theme_font_red">等待付款</div>
              </div>
              <div class="flex-row">
                <OrderPros :orderItemList="item.itemAbstractList" :type="'external'"></OrderPros>
              </div>
              <div class="flex-row">
                <div class="full"></div>
                <div class="font-small theme_font_tint">
                  <span>共{{item.itemAbstractList.length}}件商品 &nbsp; 需付款：</span>
                  <PriceOrder :orderitem="item"></PriceOrder>
                </div>
              </div>
              <div class="flex-row flex-row-smallbottom" v-if="item.orderType != '200117'">
                <div class="full"></div>
                <div
                  class="row-btn line_circle row-btn-big-space theme_font_common theme_border_gray"
                  @click.stop="payEvent(item)"
                >付款
                </div>
              </div>
            </div>
          </div>
          <!--待发货-->
          <div v-if="tabSelectedItem.tag == '16'">
            <div class="block-div" v-for="item in listData" @click="orderDetailEvent2(item)" v-if="item.orderType == '200104'">
              {{$mallCommon.dataProcessing(item)}}
              <div class="flex-row">
                <div class="full">
                  <i class="dianpu-icon iconfont mall-dianpu theme_standard_font"></i>
                  {{item.storeName}}
                </div>
                <div class="font-small theme_standard_font">待发货</div>
              </div>
              <div class="flex-row">
                <OrderPros :orderItemList="item.itemAbstractList" :type="'external'"></OrderPros>
              </div>
              <div class="flex-row">
                <div class="full"></div>
                <div class="font-small theme_font_tint">
                  <span>共{{item.itemAbstractList.length}}件商品 &nbsp; 实付款：</span>
                  <PriceOrder :orderitem="item"></PriceOrder>
                </div>
              </div>
              <div
                class="flex-row flex-row-smallbottom"
                v-if="getProductType(item) != 2 && item.orderType != '200117'"
              >
                <div class="full"></div>
                <div class="row-btn line_circle theme_standard_font theme_standard_bdr" @click.stop="reBuy(item)">再次购买</div>
              </div>
            </div>
            <div class="block-div" v-for="item in listData" @click="orderDetailEvent(item)" v-if="item.orderType != '200104'">
              {{$mallCommon.dataProcessing(item)}}
              <div class="flex-row">
                <div class="full">
                  <i class="dianpu-icon iconfont mall-dianpu theme_standard_font"></i>
                  {{item.storeName}}
                </div>
                <div class="font-small theme_standard_font">待发货</div>
              </div>
              <div class="flex-row">
                <OrderPros :orderItemList="item.itemAbstractList" :type="'external'"></OrderPros>
              </div>
              <div class="flex-row">
                <div class="full"></div>
                <div class="font-small theme_font_tint">
                  <span>共{{item.itemAbstractList.length}}件商品 &nbsp; 实付款：</span>
                  <PriceOrder :orderitem="item"></PriceOrder>
                </div>
              </div>
              <div
                class="flex-row flex-row-smallbottom"
                v-if="getProductType(item) != 2 && item.orderType != '200117'"
              >
                <div class="full"></div>
                <div class="row-btn line_circle theme_standard_font theme_standard_bdr" @click.stop="reBuy(item)">再次购买</div>
              </div>
            </div>
          </div>
          <!--待收货、提货-->
          <div v-if="tabSelectedItem.tag == '4'">
            <div class="order-tab"
                 v-if="$store.state.globalConfig.delivertype_default != '2' && $store.state.globalConfig.delivertype_default != '1'">
              <p
                class="theme_font_white theme_bg_light_red"
                :class="{theme_bg_red_i: deliveryType == 2}"
                @click="deliveryTypeSelected(2)"
              >待收货</p>
              <p
                class="theme_font_white theme_bg_light_red"
                :class="{theme_bg_red_i: deliveryType == 1}"
                @click="deliveryTypeSelected(1)"
              >待提货</p>
            </div>
            <div
              class="pickup-coder theme_bg_light_blue"
              v-show="deliveryType == 1 && $store.state.globalConfig.webpos_type != 'cloudpos'"
              @click="showPickUpCode"
            >
              <div class="text theme_font_white">一键提货码</div>
              <img src="static/image/mall2/pickUpCode.png">
            </div>
            <div
              class="block-div"
              v-for="item in listData"
              @click="orderDetailEvent(item)"
              v-show="deliveryType == item.deliverType"
            >
              {{$mallCommon.dataProcessing(item)}}
              <div class="flex-row">
                <div class="full">
                  <i class="dianpu-icon iconfont mall-dianpu theme_standard_font"></i>
                  {{item.storeName}}
                </div>
                <div class="font-small theme_standard_font" v-if="item.deliverType == 2">待收货</div>
                <div class="font-small theme_standard_font" v-if="item.deliverType == 1">待提货</div>
              </div>
              <div class="flex-row">
                <OrderPros :orderItemList="item.itemAbstractList" :type="'external'"></OrderPros>
              </div>
              <div class="flex-row">
                <div class="full"></div>
                <div class="font-small theme_font_tint">
                  <span>共{{item.itemAbstractList.length}}件商品 &nbsp; 实付款：</span>
                  <PriceOrder :orderitem="item"></PriceOrder>
                </div>
              </div>
              <div
                class="flex-row flex-row-smallbottom"
                v-if="getProductType(item) != 2 && item.deliverType == 2 && item.orderType != '200117'"
              >
                <div class="full"></div>
                <div class="row-btn line_circle theme_standard_font theme_standard_bdr" @click.stop="reBuy(item)">再次购买</div>
                <!--<div class="row-btn line_circle theme_standard_font theme_standard_bdr">我要催单</div>-->
                <div v-if="isShowExpress"
                     class="row-btn line_circle theme_standard_font theme_standard_bdr"
                     @click.stop="showExpress(item)"
                >查看物流
                </div>
                <div
                  class="row-btn line_circle theme_standard_font theme_standard_bdr"
                  @click.stop="confirmProduct(item)"
                >确认收货
                </div>
              </div>
            </div>
          </div>
          <!--待服务-->
          <div v-if="tabSelectedItem.tag == '99'">
            <div
              class="block-div"
              v-for="item in listData"
              @click="orderDetailEvent(item)"
            >
              {{$mallCommon.dataProcessing(item)}}
              <div class="flex-row">
                <div class="full">
                  <i class="dianpu-icon iconfont mall-dianpu theme_standard_font"></i>
                  {{item.storeName}}
                </div>
                <div class="font-small theme_standard_font">待服务</div>
              </div>
              <div class="flex-row">
                <OrderPros :orderItemList="item.itemAbstractList" :type="'external'"></OrderPros>
              </div>
              <div class="flex-row">
                <div class="full"></div>
                <div class="font-small theme_font_tint">
                  <span>共{{item.itemAbstractList.length}}件商品 &nbsp; 实付款：</span>
                  <PriceOrder :orderitem="item"></PriceOrder>
                </div>
              </div>
            </div>
          </div>
          <!--已完成-->
          <div v-if="tabSelectedItem.tag == '9'">
            <div class="block-div" v-for="item in listData" @click="orderDetailEvent(item)">
              {{$mallCommon.dataProcessing(item)}}
              <div class="flex-row">
                <div class="full">
                  <i class="dianpu-icon iconfont mall-dianpu theme_standard_font"></i>
                  {{item.storeName}}
                </div>
                <div class="right-state">
                  <p class="scan-buy" v-if="item.orderMode == 4">扫码购</p>
                  <div class="font-small theme_standard_font" v-if="item.state != 6">已完成</div>
                  <div class="font-small theme_standard_font" v-if="item.state == 6">已拒收</div>
                </div>

              </div>
              <div class="flex-row share-btn">
                <OrderPros :orderItemList="item.itemAbstractList" :type="'external'"></OrderPros>
                <img
                  class="btn"
                  v-if="item.awardActivityList && item.awardActivityList.length"
                  @click.stop="shareActivity(item)"
                  src="../../../assets/icons/redbag.png"
                  alt
                >
              </div>
              <div class="flex-row">
                <div class="full"></div>
                <div class="font-small theme_font_tint">
                  <span>共{{item.itemAbstractList.length}}件商品 &nbsp; 实付款：</span>
                  <PriceOrder :orderitem="item"></PriceOrder>
                </div>
              </div>
              <div class="flex-row flex-row-smallbottom" v-if="item.orderType != '200117'">
                <div class="full"></div>
                <div class="row-btn line_circle theme_font_common theme_border_gray" @click.stop="showInvoice" v-if="$store.state.globalConfig.invoice_shopping_enable != 'false'">
                  查看发票
                </div>
                <div
                  class="row-btn line_circle theme_font_common theme_border_gray"
                  v-if="item.state != 6"
                  @click.stop="toComment"
                >评价晒单
                </div>
                <div
                  class="row-btn line_circle theme_standard_font theme_standard_bdr"
                  @click.stop="reBuy(item)"
                  v-if="getProductType(item) != 2"
                >再次购买
                </div>
              </div>
            </div>
          </div>
          <!--已取消-->
          <div v-if="tabSelectedItem.tag == '7'">
            <div class="block-div" v-for="item in listData" @click="orderDetailEvent(item)">
              {{$mallCommon.dataProcessing(item)}}
              <div class="flex-row">
                <div class="full">
                  <i class="dianpu-icon iconfont mall-dianpu theme_standard_font"></i>
                  {{item.ouName}}
                </div>
                <div class="font-small theme_standard_font">已取消</div>
              </div>
              <div class="flex-row">
                <OrderPros :orderItemList="item.itemAbstractList" :type="'external'"></OrderPros>
              </div>
              <div class="flex-row">
                <div class="full"></div>
                <div class="font-small theme_font_tint">
                  <span>共{{item.itemAbstractList.length}}件商品 &nbsp; 需付款：</span>
                  <PriceOrder :orderitem="item"></PriceOrder>
                </div>
              </div>
              <div
                class="flex-row flex-row-smallbottom"
                v-if="getProductType(item) != 2 && item.orderType != '200117'"
              >
                <div class="full"></div>
                <div class="row-btn line_circle theme_standard_font theme_standard_bdr" @click.stop="reBuy(item)">再次购买</div>
              </div>
            </div>
          </div>
        </pull-to>
      </div>
      <div class="no-data-div"
           :class="{'other-top': tabSelectedItem.tag == '4' && $store.state.globalConfig.delivertype_default != '2' && $store.state.globalConfig.delivertype_default != '1'}"
           v-if="showNoData">
        <div class="no-data-img">
          <img src="static/image/mall2/no-order.png">
        </div>
        <div class="recommend-div">
          <Recommend></Recommend>
        </div>
      </div>
      <img style="display: none" id="img" src="../../../../static/image/microShop/1@222x.png" alt="">
    </nav-content>
    <PickupCode v-if="showCode" :code="pickUpCode" @backEvent="codeBack"></PickupCode>
  </div>
</template>

<script>
  import OrderPros from './base/order-pros'
  import PullTo from '@/components/Vendor/vue-pull-to/vue-pull-to'
  import PickupCode from './base/pickup-code'
  import Recommend from '../list/recommend/index'
  import PriceOrder from '@/components/commonui/price/price-order'

  export default {
    name: "order",
    components: {
      OrderPros,
      PullTo,
      PickupCode,
      Recommend,
      PriceOrder
    },
    data() {
      return {
        showCode: false,
        tabs: [
        //   {
        //   text: '待支付',
        //   tag: '1',
        //   type: '200102',
        //   nowPage: 1,
        //   isCanLoadMore: true
        // },
          {
          text: '待发货',
          tag: '16',
          type: '200117',
          nowPage: 1,
          isCanLoadMore: true
        }, {
          text: '待收(提)货',
          tag: '4',
          type: '200117',
          nowPage: 1,
          isCanLoadMore: true
        }, {
          text: '已完成',
          tag: '9',
          type: '200117',
          nowPage: 1,
          isCanLoadMore: true
        }, {
          text: '已取消',
          tag: '7',
          type: '200102',
          nowPage: 1,
          isCanLoadMore: true
        }],
        tabIndex: 0,
        tabSelectedItem: {},
        listData: [],
        deliveryType: '2', // 1 自提 2 配送
        scrollTopValue1: '',
        pickUpCode: '',
        showNoData: false,
        orderCategory: '',
        vipUnitUserCode: '',
      }
    },
    computed: {
      isShowExpress() {
        return this.$store.state.webtype != 3
      }
    },
    methods: {
      toHistory: function () {
        this.$Loading.open();
        let redUrl = this.$store.state.globalConfig.kshop_orderListUrl
        let url = '/app/json/login/redirectToKShop';
        let paramsData = {
          redirectUrl: redUrl,
          orderCategory: this.orderCategory,
          vipUnitUserCode:this.vipUnitUserCode
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              let realUrl = data.data
              this.$bridgefunc.customPush({
                path: realUrl,
                isnativetop: '1'
              },false)
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
      //如果有一个商品是日期型商品  就肯定是日期型商品
      getProductType: function (item) {
        let abstractList = item.itemAbstractList;
        for (let i = 0; i < abstractList.length; i++) {
          let item = abstractList[i];
          if (item.productType == 2) {
            return '2';
          }
        }
        return ''
      },
      codeBack: function () {
        this.showCode = false
      },
      showPickUpCode: function () {
        if (this.listData.length == 0) {
          this.$Toast('您没有待提货订单！');
          return
        }
        this.$Loading.open();
        let url = '/app/json/app_shopping_order/getBatchDeliveryCheckcode';
        let paramsData = {
          token: this.$store.state.login.token,
          orderCategory: this.orderCategory,
          vipUnitUserCode:this.vipUnitUserCode
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.pickUpCode = data.data
              this.showCode = true
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
      showInvoice: function () {
        this.$Toast('暂不支持！')
      },
      deliveryTypeSelected: function (type) {
        this.deliveryType = type;
        this.tabSelectedItem.nowIndex = 0;
        this._getTabOrders(this.tabSelectedItem, null)
      },
      showExpress: function (item) {
        this.$router.push({
          path: '/mall2/logistics',
          query: {
            orderId: item.id,
            orderType: item.orderType,
            expressNo: item.expressNo,
            expressName:item.expressName
          }
        })
      },
      toComment: function (item) {
        this.$router.push({
          path: '/mall2/commentcenter',
        })
      },
      _confirmProductApi: function (item) {
        this.$Loading.open();
        let url = '/app/json/app_shopping_order/orderConfirm';
        let paramsData = {
          token: this.$store.state.login.token,
          orderId: item.id,
          orderType: item.orderType,
          orderCategory: this.orderCategory,
          vipUnitUserCode:this.vipUnitUserCode
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.tabEvent(this.tabs[3], 3)
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
      // 确认收货
      confirmProduct: function (item) {
        this.$MessageBox.confirm('您确定已经收到商品了吗？', '提示').then(action => {
          this._confirmProductApi(item);
        }).catch(action => {
        });
      },
      backEvent: function () {
        this.$util.wxmpBackHome(() => {
          this.$router.go(-1);
          this.$keepaliveHelper.deleteCache(this)
        })
      },
      tabEvent: function (item, idx) {
        this.tabIndex = idx;
        //切换重新请求数据
        item.nowIndex = 0;
        this.listData = [];
        this.showNoData = false
        this.tabSelectedItem = item;
        this._getTabOrders(item, null)
      },
      orderDetailEvent: function (item) {
        console.log(item);
        if (item.orderType == '200202') {
          this.$router.push({
            path: '/group_detail',
            query: {
              orderId: item.groupBuyId,
              mktGroupBuyId: item.groupBuyActivityId
            }
          })
          return;
        } else if (item.orderType == '200102' || item.orderType == '200117') {
          let externalOrderDetailUrl = item.externalOrderDetailUrl
          if (externalOrderDetailUrl && externalOrderDetailUrl != undefined && externalOrderDetailUrl != null && externalOrderDetailUrl != '') {
            let url = '/app/json/home/getExoLoginUrl';
            let paramsData = {
              token: this.$store.state.login.token,
              baseUrl: externalOrderDetailUrl,
              orderCategory: this.orderCategory,
              vipUnitUserCode:this.vipUnitUserCode
            };
            let externalOrderType = item.externalOrderType
            if (externalOrderType == '1') {
              paramsData.sysTag = 'ejoy'
            } else if (externalOrderType == '2') {
              paramsData.sysTag = 'elvyo'
            } else if (externalOrderType == '3') {
              paramsData.sysTag = 'youtoo'
            } else {
              let jsonData = {
                path: url,
                isnativetop: '1'
              };
              this.$bridgefunc.customPush(jsonData)
              return ;
            }
            this.$Loading.open()
            this.$http.post(url, paramsData).then(
              res => {
                this.$Loading.close();
                let data = res.data;
                if (data.status == 0) {
                  let url = data.data
                  if (url == '') {
                    this.$Toast('返回动态链接错误，请稍后重试！');
                    return;
                  }
                  let jsonData = {
                    path: url,
                    isnativetop: '1'
                  };
                  this.$bridgefunc.customPush(jsonData)
                } else {
                  this.$Toast(data.info);
                }
              },
              error => {
                this.$Loading.close();
                this.$Toast('请求数据失败！')
              }
            );
            return;
          }
        }
        let awardActivity = item.awardActivityList && item.awardActivityList.length ? item.awardActivityList[0] : {}
        this.$router.push({
          path: '/mall2/orderdetail',
          query: {
            orderId: item.id,
            tag: this.tabSelectedItem.tag,
            orderType: item.orderType,
            orderIndex: this.tabIndex,
            awardActivity: JSON.stringify(awardActivity),
            orderCategory: this.orderCategory,
            vipUnitUserCode: this.vipUnitUserCode
          }
        })
      },
      orderDetailEvent1: function (item) { //门票待支付
        console.log(item);
        this.$router.push({
          path: '/carefree_trave/tobePaidDetail',
          query: {
            orderId: item.id,
            tradeNo: item.tradeNo
          }
        })
      },
      orderDetailEvent2: function (item) { //门票待发货
        console.log(item);
        this.$router.push({
          path: '/carefree_trave/sendgoodsDetail',
          query: {
            orderId: item.id,
            tradeNo: item.tradeNo
          }
        })
      },
      loadMore: function (loaded) {
        this._getTabOrders(this.tabSelectedItem, loaded)
      },
      _getTabOrders: function (item, loaded) {

        this.$Loading.open();
        let url = '/app/json/app_shopping_order/queryExtOrder';
        let paramsData = {
          token: this.$store.state.login.token,
          orderType: item.type,
          state: item.tag,
          page: {
            index: item.nowIndex,
            pageSize: 20
          }
        };
        if (item.tag == 4) {
          paramsData.deliverType = this.deliveryType
          // // queryOrder接口屏蔽扫码购订单
          // if (this.deliveryType == 1) {
          //   paramsData.orderModeList = [0, 2];
          // }
        } else if (item.tag == 99) {
          paramsData.state = 4
          paramsData.deliverType = 3
        }
        paramsData.orderCategory = this.orderCategory;
        paramsData.vipUnitUserCode = this.vipUnitUserCode;

        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();

            let data = res.data;
            if (data.status == 0) {
              this.tabSelectedItem.nowIndex += 1;
              if (item.nowIndex > 1) {
                this.listData = this.listData.concat(data.data.orderList);
              } else {
                this.listData = data.data.orderList;
                if (this.listData.length == 0) {
                  this.showNoData = true
                } else {
                  this.showNoData = false
                }
              }
              if (data.data.orderList.length < 20) {
                this.tabSelectedItem.isCanLoadMore = false;
              }
            } else {
              this.$Toast(data.info);
            }
            if (loaded) {
              loaded('done');
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！');
            if (loaded) {
              loaded('done');
            }
          }
        );
      },
      payEvent: function (item) {
        // this.$router.push({
        //   name: '收银台',
        //   params: {
        //     payInfo: {
        //       orderId: item.id,
        //       orderType: item.orderType,
        //       payAmount: item.payAmount,
        //       tradeNo: item.tradeNo
        //     },
        //     occurOuCode: item.ouCode
        //   }
        // })
        this.$router.push({
          path: '/mall2/checkstand',
          query: {
            payInfo: JSON.stringify({
              orderId: item.id,
              orderType: item.orderType,
              payAmount: item.payAmount,
              tradeNo: item.tradeNo
            }),
            occurOuCode: item.ouCode
          }
        })
      },
      /* 冲突↓ */
      // payEvent: function (item) {
      //   this.$router.push({
      //     name: '收银台',
      //     params: {
      //       payInfo: {
      //         orderId: item.id,
      //         orderType: item.orderType,
      //         payAmount: item.payAmount,
      //         tradeNo: item.tradeNo
      //       },
      //       // error => {
      //       //   this.$Loading.close();
      //       //   this.$Toast('请求数据失败！')
      //       // }
      //     }
      //   })
      //   // shareActivity(list) {
      //   //   console.log(list);
      //   //   if (list.awardActivityList && list.awardActivityList.length > 0) {
      //   //     this.$router.push({path: '/share-gift/share', query: {awardActivity: JSON.stringify({orderId: list.id, ...list.awardActivityList[0]})}})
      //   //   }
      //   // })
      // },
      /* 冲突↑ */
      reBuy: function (item) {
        this.$Loading.open();
        let url = '/app/json/app_cart/addCart';
        let paramsData = {
          token: this.$store.state.login.token,
          carts: [],
          deliveryType: item.deliverType,
          orderCategory: this.orderCategory,
          vipUnitUserCode: this.vipUnitUserCode
        };
        let arr = []
        for (let i = 0; i < item.itemAbstractList.length; i++) {
          let product = item.itemAbstractList[i]
          let cd = {
            skuId: product.skuId,
            storeOuCode: product.storeOuCode,
            number: product.number,

          }
          arr.push(cd)
        }
        paramsData.carts = arr;
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.mall2.staticDeliverType = item.deliverType
              this.$store.state.mall2.cartNum = data.data;
              this.$router.push({
                path: '/mall2/cart',
                query: {
                  orderCategory: this.orderCategory,
                  vipUnitUserCode: this.vipUnitUserCode
                }
              })
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
      shareActivity(list) {
        console.log(list);
        console.log(list.id);
        if (list.awardActivityList && list.awardActivityList.length > 0) {
          let url = {orderId: list.id, ...list.awardActivityList[0]}
          url.activityPromotionalPic = document.getElementById('img').src
          let dataDesc = list.awardActivityList[0].activityDesc
          dataDesc = dataDesc.replace(/<\/?.+?>/g, '')
          url.activityDesc = dataDesc
          console.log(888, url.activityDesc);
          this.$router.push({path: '/share-gift/share', query: {awardActivity: JSON.stringify(url)}})
        }
      }
    },
    created() {
      if (this.$store.state.globalConfig.delivertype_default == '1') {
        this.tabs = [
        //   {
        //   text: '待支付',
        //   tag: '1',
        //   type: '200102',
        //   nowPage: 1,
        //   isCanLoadMore: true
        // },
          {
          text: '待提货',
          tag: '4',
          type: '200117',
          nowPage: 1,
          isCanLoadMore: true
        }, {
          text: '已完成',
          tag: '9',
          type: '200117',
          nowPage: 1,
          isCanLoadMore: true
        }, {
          text: '已取消',
          tag: '7',
          type: '200102',
          nowPage: 1,
          isCanLoadMore: true
        }];
      } else if (this.$store.state.globalConfig.delivertype_default == '2') {
        this.tabs = [
        //   {
        //   text: '待支付',
        //   tag: '1',
        //   type: '200102',
        //   nowPage: 1,
        //   isCanLoadMore: true
        // },
          {
          text: '待发货',
          tag: '16',
          type: '200117',
          nowPage: 1,
          isCanLoadMore: true
        }, {
          text: '待收货',
          tag: '4',
          type: '200117',
          nowPage: 1,
          isCanLoadMore: true
        }, {
          text: '已完成',
          tag: '9',
          type: '200117',
          nowPage: 1,
          isCanLoadMore: true
        }, {
          text: '已取消',
          tag: '7',
          type: '200102',
          nowPage: 1,
          isCanLoadMore: true
        }];
      }

      // if (this.$store.state.globalConfig.toBeServed == '1') {
        let dfw = {
          text: '待服务',
          tag: '99', // 虚拟的订单tag
          type: '200117',
          nowPage: 1,
          isCanLoadMore: true
        }
        this.tabs.splice(this.tabs.length-2, 0, dfw)
      // }


      let selectedIndex = this.$route.query.selectedIndex ? this.$route.query.selectedIndex : 0
      if (selectedIndex == 2) {
        let deliveryType = this.$route.query.deliveryType
        if (deliveryType && deliveryType != '' && deliveryType != undefined) {
          if (deliveryType == '1') {
            this.$store.state.mall2.staticDeliverType = '1'
          } else {
            this.$store.state.mall2.staticDeliverType = '2'
          }
        }
      }
      this.orderCategory = this.$route.query.orderCategory;
      this.vipUnitUserCode = this.$route.query.vipUnitUserCode;
      this.deliveryType = this.$store.state.mall2.staticDeliverType ? this.$store.state.mall2.staticDeliverType : '2'
      this.tabEvent(this.tabs[selectedIndex], selectedIndex)
    },
    activated() {
      this.$userCenter._getMyOrder();
      let idx = this.$store.state.mall2.order.backIndex
      if (idx > -1) {
        this.tabEvent(this.tabs[idx], idx)
        this.$store.state.mall2.order.backIndex = -1;
      } else {
        if (this.scrollTopValue1 > 0) {
          this.$refs.scrollDiv.setScrollTopValue(this.scrollTopValue1);
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.name == '订单详情' || to.path == '/mall2/cart' || to.path == '/mall2/commentcenter') {
        this.scrollTopValue1 = this.$refs.scrollDiv.getScrollTopValue()
      } else {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .order {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .scroll-div {
      position: absolute;
      left: 0px;
      right: 0px;
      top: 30px;
      bottom: 0px;
      overflow: hidden;

      .dianpu-icon {
        font-size: 18px;
        font-weight: 500;
        margin-right: 8px;
      }

      .order-tab {
        width: 100%;
        display: flex;

        p {
          flex: 1;
          text-align: center;
          font-size: 16px;
          font-weight: 500;
          padding: 10px;
        }
      }

      .pickup-coder {
        font-size: 14px;
        padding: 10px;
        display: flex;
        align-items: center;

        .text {
          flex: 1;
          padding-right: 8px;
          text-align: right;
        }

        img {
          width: 20px;
          height: 20px;
        }
      }

      .big-price {
        font-size: 32px;
      }

      .right-state {
        display flex
        align-items center

        .scan-buy {
          padding 4px 10px
          margin-right 10px
          background-color $color-theme-r
          color white
          font-size $font-size-medium
          border-radius 11px
        }
      }
    }

    .no-data-div {
      position: absolute;
      left: 0px;
      right: 0px;
      top: 30px;
      bottom: 0px;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      background: url('../../../../static/image/mall2/list-bg.png') no-repeat center center / 100% 100%;

      .no-data-img {
        margin-top: 20px;
        margin-bottom: 10px;
        text-align: center;

        img {
          width: 100px;
        }
      }

      .recommend-div {
        overflow: hidden;
      }
    }

    .other-top {
      top: 66px;
    }

    .share-btn {
      position: relative;

      .btn {
        position: absolute;
        right: 10px;
        top: 10px;
        width: 50px;
        animation: shake 2s infinite;
      }
    }
  }

  @keyframes shake {
    from {
      -webkit-transform: rotate(30deg);
      transform: rotate(30deg);
    }

    50% {
      transform: rotate(-10deg);
    }

    to {
      -webkit-transform: rotate(30deg);
      transform: rotate(30deg);
    }
  }
</style>

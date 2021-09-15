/**Created by liaoyingchao on 2018/11/5.*/

<template>
  <div
    class="order mall2"
    :class="{theme_sys_base:orderCategory == 1,theme_sys_blue:orderCategory == 1}"
  >
    <nav-top @backEvent="backEvent" v-if="!wxenvironment()">
      <div
        class="right-btn theme_font_gray"
        style="right: 0px; height: 44px; top: 0px; padding-right: 10px;font-size: 12px;"
        @click="toHistory"
        v-if="$store.state.globalConfig.kshop_orderListUrl && $store.state.globalConfig.kshop_orderListUrl != undefined"
      >历史订单</div>
    </nav-top>
    <nav-content :titleDefault="true">
      <div class="tabs">
        <div class="tab-item" v-for="(item, idx) in tabs" @click="tabEvent(item, idx)">
          <div
            class="text theme_font_black"
            :class="tabIndex == idx&&'selected-btn-1'"
          >{{item.text}}</div>
          <!--<div class="line" :class="{theme_bg_red_i: tabSelectedItem.tag == item.tag}"></div>-->
        </div>
      </div>
      <div class="scroll-div">
        <pull-to
          ref="scrollDiv"
          :isBottomAutoS="true"
          :bothEventForce="true"
          :top-load-method="topRefresh"
          :is-top-bounce="true"
          :bottom-load-method="loadMore"
          :is-bottom-bounce="tabSelectedItem.isCanLoadMore"
        >
          <!--待支付-->
          <div v-if="tabSelectedItem.tag == '1'">
            <div
              class="block-div"
              v-for="item in listData"
              @click="orderDetailEvent(item,'tobePay')"
              :key="item.id"
            >
<!--              <div class="flex-row">-->
<!--                <div class="full">-->
<!--                  <i class="dianpu-icon iconfont mall-dianpu theme_font_red"></i>-->
<!--                  {{item.ouName}}-->
<!--                  <span class="md-span theme_font_red" v-if="item.deliverType == '3'">（门店配送）</span>-->
<!--                </div>-->
<!--                <div class="font-small theme_font_red">等待付款</div>-->
<!--              </div>-->
              <div class="flex-row">
                <OrderPros
                  :dataItem="item"
                  :orderItemList="item.itemAbstractList"
                  :watermark="item.deliverType == '3' ? '1' : '0'"
                ></OrderPros>
              </div>
              <div class="flex-row">
                <div class="full"></div>
                <div class="font-small theme_font_tint">
                  <span>共{{productNumber(item.itemAbstractList)}}件商品 &nbsp; 需付款：</span>
                  <PriceOrder :orderitem="item"></PriceOrder>
                </div>
              </div>
              <div class="flex-row flex-row-smallbottom" v-if="item.orderType != '200117'">
                <div class="full"></div>
                <div
                  class="row-btn line_circle theme_font_common theme_border_gray"
                  v-if="$store.state.deployType == 4"
                  @click.stop="consultingService(item)"
                >咨询客服</div>
                <div
                  class="row-btn row-btn-big-space theme_font_common theme_border_gray line_circle"
                  @click.stop="payEvent(item)"
                >付款</div>
              </div>
            </div>
          </div>
          <!--待发货-->
          <div v-if="tabSelectedItem.tag == '16'">
<!--            <div-->
<!--              class="cancel-tip"-->
<!--              v-if="$store.state.globalConfig.delivery_cancel_order_tip && $store.state.globalConfig.delivery_cancel_order_tip != ''"-->
<!--            >{{$store.state.globalConfig.delivery_cancel_order_tip}}</div>-->
            <div
              class="block-div"
              v-for="item in listData"
              @click="orderDetailEvent(item,'tobeShip')"
            >
<!--              <div class="flex-row">-->
<!--                <div class="full">-->
<!--                  <i class="dianpu-icon iconfont mall-dianpu theme_standard_font"></i>-->
<!--                  {{item.storeName}}-->
<!--                  <span class="md-span theme_font_red" v-if="item.deliverType == '3'">（门店配送）</span>-->
<!--                </div>-->
<!--                <div class="font-small theme_standard_font">{{getPivotalProductType(item.itemAbstractList) == 8 ? '等待接单' : '待发货'}}</div>-->
<!--              </div>-->
              <div class="flex-row">
                <OrderPros
                  :dataItem="item"
                  :orderItemList="item.orderItemList"
                  :watermark="item.deliverType == '3' ? '1' : '0'"
                  :tag="16"
                ></OrderPros>
              </div>
              <div class="flex-row">
                <div class="full"></div>
                <div class="font-small theme_font_tint">
                  <span>共{{productNumber(item.itemAbstractList)}}件商品 &nbsp; 实付款：</span>
                  <PriceOrder :orderitem="item"></PriceOrder>
                </div>
              </div>
              <div
                class="flex-row flex-row-smallbottom"
                v-if="getProductType(item) != 2 && item.orderType != '200117'&&$store.state.globalConfig.cut_price_strict!=1"
              >
                <div class="full"></div>
                <!-- interfaceType = 0 自营-->
                <div
                  class="row-btn line_circle theme_font_common theme_border_gray"
                  v-if="$store.state.deployType == 4"
                  @click.stop="consultingService(item)"
                >咨询客服</div>
                <div
                  class="row-btn line_circle theme_font_common theme_border_gray"
                  v-if="$store.state.globalConfig.order_delivery_remind == 1 && dealPushDeliveryBtn(item.paidTime) == -1 "
                  @click.stop="pushDelivery(item)"
                >催促发货</div>
                <!-- v-if="item.deliverType == '2' && item.interfaceType == 0 && item.orderType == '200017' && item.payMode != 500 && item.orderMode != 12" -->
                <!-- 不允许修改订单 -->
                <div
                  class="row-btn line_circle theme_font_common theme_border_gray"
                  v-if="false"
                  @click.stop="modifyAddress(item)"
                >修改订单</div>
                <div
                  v-if="item.orderMode != 12"
                  class="row-btn line_circle theme_standard_font theme_standard_bdr"
                  @click.stop="reBuy(item)"
                >再次购买</div>
              </div>
            </div>
          </div>
          <!--待收货、提货-->
          <div v-if="tabSelectedItem.tag == '4'">
<!--            <div-->
<!--              class="order-tab"-->
<!--              v-if="$store.state.globalConfig.delivertype_default != '2' && $store.state.globalConfig.delivertype_default != '1' && $store.state.globalConfig.order_list_tabs_type != '2'"-->
<!--            >-->
<!--              <p-->
<!--                class="theme_font_white theme_bg_light_red"-->
<!--                :class="{theme_bg_red_i: deliveryType == 2}"-->
<!--                @click="deliveryTypeSelected(2)"-->
<!--              >待收货</p>-->
<!--              <p-->
<!--                class="theme_font_white theme_bg_light_red"-->
<!--                :class="{theme_bg_red_i: deliveryType == 1}"-->
<!--                @click="deliveryTypeSelected(1)"-->
<!--              >待提货</p>-->
<!--            </div>-->
<!--            <div-->
<!--              class="pickup-coder theme_bg_light_blue"-->
<!--              v-show="deliveryType == 1 && $store.state.globalConfig.webpos_type != 'cloudpos' && $store.state.globalConfig.showPickupCodeKey != '0'"-->
<!--              @click="showPickUpCode"-->
<!--            >-->
<!--              <div class="text theme_font_white">一键提货码</div>-->
<!--              <img src="static/image/mall2/pickUpCode.png" />-->
<!--            </div>-->
<!--            <div-->
<!--              class="cancel-tip"-->
<!--              v-if="deliveryType == 2 && $store.state.globalConfig.delivery_cancel_order_tip && $store.state.globalConfig.delivery_cancel_order_tip != ''"-->
<!--            >{{$store.state.globalConfig.delivery_cancel_order_tip}}</div>-->
<!--            <div-->
<!--              class="cancel-tip"-->
<!--              v-if="deliveryType == 1 && $store.state.globalConfig.pickup_cancel_order_tip && $store.state.globalConfig.pickup_cancel_order_tip != ''"-->
<!--            >{{$store.state.globalConfig.pickup_cancel_order_tip}}</div>-->
            <div class="block-div" v-for="item in listData" @click="orderDetailEvent(item)">
              <div
                class="pickup-tip"
                v-if="item.orderMode == 6 && item.selectReceiveTime && item.receiveEndTime && deliveryType == '1'"
              >
                <span class="theme_font_red">提货时间：</span>
                {{item.selectReceiveTime}}到{{item.receiveEndTime}}
              </div>
<!--              <div class="flex-row">-->
<!--                <div class="full">-->
<!--                  <i class="dianpu-icon iconfont mall-dianpu theme_standard_font"></i>-->
<!--                  {{item.storeName}}-->
<!--                  <span class="md-span theme_font_red" v-if="item.deliverType == '3'">（门店配送）</span>-->
<!--                </div>-->
<!--                <div class="font-small theme_standard_font" v-if="item.deliverType == 2 || item.deliverType == 3">{{getPivotalProductType(item.itemAbstractList) == 8 ? '待服务' : '待收货'}}</div>-->
<!--                <div class="font-small theme_standard_font" v-if="item.deliverType == 1">待提货</div>-->
<!--              </div>-->
              <div class="flex-row">
                <OrderPros
                  :dataItem="item"
                  :orderItemList="item.itemAbstractList"
                  :watermark="item.deliverType == '3' ? '1' : '0'"
                ></OrderPros>
              </div>
              <div class="flex-row">
                <div class="full"></div>
                <div class="font-small theme_font_tint">
                  <span>共{{productNumber(item.itemAbstractList)}}件商品 &nbsp; 实付款：</span>
                  <PriceOrder :orderitem="item"></PriceOrder>
                </div>
              </div>
              <div
                class="flex-row flex-row-smallbottom"
                v-if="getProductType(item) != 2 && (item.deliverType == 2 || item.deliverType == 3) && item.orderType != '200117'"
              >
                <div class="full"></div>
                <div
                  class="row-btn line_circle theme_font_common theme_border_gray"
                  v-if="$store.state.deployType == 4"
                  @click.stop="consultingService(item)"
                >咨询客服</div>
                <div
                  v-if="item.orderMode != 12"
                  class="row-btn line_circle theme_standard_font theme_standard_bdr"
                  @click.stop="reBuy(item)"
                >再次购买</div>
                <div
                  v-if="isShowExpress(item) && getPivotalProductType(item.itemAbstractList) != 8 && item.orderMode != 12"
                  class="row-btn line_circle theme_standard_font theme_standard_bdr"
                  @click.stop="expressType(item)"
                >查看物流</div>
                <!--  如果选择“用提货码确认订单”把确认收货按钮前台隐藏掉
                配送订单时, 如果  deliveryConfirmType 为null 或者为0 展示确认收货按钮, 如果为 1 隐藏确认收货按钮-->
                <div
                  class="row-btn line_circle theme_standard_font theme_standard_bdr"
                  @click.stop="confirmProduct(item)"
                  v-if="(item.interfaceType == '0' || (item.interfaceType == '1' && item.interfaceOrderType == '5')) && item.deliveryConfirmType != 1 && item.deliverType != 3 && item.orderMode != 12"
                >确认收货</div>
              </div>
            </div>
          </div>
          <!--待服务-->
          <div v-if="tabSelectedItem.tag == '99'">
            <div class="block-div" v-for="item in listData" @click="orderDetailEvent(item)">
<!--              <div class="flex-row">-->
<!--                <div class="full">-->
<!--                  <i class="dianpu-icon iconfont mall-dianpu theme_standard_font"></i>-->
<!--                  {{item.storeName}}-->
<!--                  <span class="md-span theme_font_red" v-if="item.deliverType == '3'">（门店配送）</span>-->
<!--                </div>-->
<!--                <div class="font-small theme_standard_font">待服务</div>-->
<!--              </div>-->
              <div class="flex-row">
                <OrderPros
                  :orderItemList="item.itemAbstractList"
                  :watermark="item.deliverType == '3' ? '1' : '0'"
                ></OrderPros>
              </div>
              <div class="flex-row">
                <div class="full"></div>
                <div class="font-small theme_font_tint">
                  <span>共{{productNumber(item.itemAbstractList)}}件商品 &nbsp; 实付款：</span>
                  <PriceOrder :orderitem="item"></PriceOrder>
                </div>
              </div>
            </div>
          </div>
          <!--已完成-->
          <div v-if="tabSelectedItem.tag == '9' && tabSelectedItem.productType != 512">
            <div
              class="block-div"
              v-for="item in listData"
              @click="orderDetailEvent(item,'completed')"
            >
              <div class="flex-row">
<!--                <div class="full">-->
<!--                  <i class="dianpu-icon iconfont mall-dianpu theme_standard_font"></i>-->
<!--                  {{item.storeName}}-->
<!--                  <span class="md-span theme_font_red" v-if="item.deliverType == '3'">（门店配送）</span>-->
<!--                </div>-->
                <div class="right-state">
                  <p class="scan-buy" v-if="item.orderMode == 4">扫码购</p>
                  <div class="font-small theme_standard_font" v-if="item.state != 6">已完成</div>
                  <div class="font-small theme_standard_font" v-if="item.state == 6">已拒收</div>
                </div>
              </div>
              <div class="flex-row share-btn">
                <OrderPros
                  :dataItem="item"
                  :orderItemList="item.itemAbstractList"
                  :watermark="item.deliverType == '3' ? '1' : '0'"
                ></OrderPros>
                <img
                  class="btn"
                  v-if="item.awardActivityList && item.awardActivityList.length"
                  @click.stop="shareActivity(item)"
                  src="../../../assets/icons/redbag.png"
                  alt
                />
              </div>
              <div class="flex-row">
                <div class="full"></div>
                <div class="font-small theme_font_tint">
                  <span>共{{productNumber(item.itemAbstractList)}}件商品 &nbsp; 实付款：</span>
                  <PriceOrder :orderitem="item"></PriceOrder>
                </div>
              </div>
              <div class="flex-row flex-row-smallbottom" v-if="item.orderType != '200117'&&$store.state.globalConfig.cut_price_strict!=1">
                <div class="full"></div>
                <div
                  class="row-btn line_circle theme_font_common theme_border_gray"
                  v-if="$store.state.deployType == 4"
                  @click.stop="consultingService(item)"
                >咨询客服</div>
                <!-- <div
                  class="row-btn line_circle theme_font_common theme_border_gray"
                  @click.stop="showInvoice"
                  v-if="$store.state.globalConfig.invoice_shopping_enable != 'false'"
                >查看发票</div> -->
                <div
                  class="row-btn line_circle theme_font_common theme_border_gray"
                  v-if="item.orderCanEvaluate && item.orderMode != 12"
                  @click.stop="toComment(item)"
                >评价晒单</div>
                <div
                  class="row-btn line_circle theme_standard_font theme_standard_bdr"
                  @click.stop="reBuy(item)"
                  v-if="getProductType(item) != 2 && getPivotalProductType(item.itemAbstractList) != 550 && item.orderMode != 12"
                >再次购买</div>
              </div>
            </div>
          </div>
          <!--我的服务-->
          <div v-if="tabSelectedItem.tag == '9' && tabSelectedItem.productType == 512">
            <div
              class="block-div"
              v-for="item in listData"
              @click="orderDetailEvent(item,'completed')"
            >
<!--              <div class="flex-row">-->
<!--                <div class="full">-->
<!--                  <i class="dianpu-icon iconfont mall-dianpu theme_standard_font"></i>-->
<!--                  {{item.storeName}}-->
<!--                  <span class="md-span theme_font_red" v-if="item.deliverType == '3'">（门店配送）</span>-->
<!--                </div>-->
<!--                <div class="right-state">-->
<!--                  <p class="scan-buy" v-if="item.orderMode == 4">扫码购</p>-->
<!--                  <div class="font-small theme_standard_font" v-if="item.state != 6">已完成</div>-->
<!--                  <div class="font-small theme_standard_font" v-if="item.state == 6">已拒收</div>-->
<!--                </div>-->
<!--              </div>-->
              <div class="flex-row share-btn">
                <OrderPros
                  :orderItemList="item.itemAbstractList"
                  :watermark="item.deliverType == '3' ? '1' : '0'"
                ></OrderPros>
                <img
                  class="btn"
                  v-if="item.awardActivityList && item.awardActivityList.length"
                  @click.stop="shareActivity(item)"
                  src="../../../assets/icons/redbag.png"
                  alt
                />
              </div>
              <div class="flex-row">
                <div class="full"></div>
                <div class="font-small theme_font_tint">
                  <span>共{{productNumber(item.itemAbstractList)}}件商品 &nbsp; 实付款：</span>
                  <PriceOrder :orderitem="item"></PriceOrder>
                </div>
              </div>
              <div class="flex-row flex-row-smallbottom" v-if="item.orderType != '200117'">
                <div class="full"></div>
                <div
                  class="row-btn line_circle theme_font_common theme_border_gray"
                  v-if="$store.state.deployType == 4"
                  @click.stop="consultingService(item)"
                >咨询客服</div>
                <!-- <div
                  class="row-btn line_circle theme_font_common theme_border_gray"
                  @click.stop="showInvoice"
                  v-if="$store.state.globalConfig.invoice_shopping_enable != 'false'"
                >查看发票</div> -->
                <div
                  class="row-btn line_circle theme_font_common theme_border_gray"
                  v-if="item.orderCanEvaluate"
                  @click.stop="toComment(item)"
                >评价晒单</div>
                <div
                  class="row-btn line_circle theme_standard_font theme_standard_bdr"
                  @click.stop="reBuy(item)"
                  v-if="getProductType(item) != 2"
                >再次购买</div>
              </div>
            </div>
          </div>
          <!--已取消-->
          <div v-if="tabSelectedItem.tag == '7'">
            <div
              class="block-div"
              v-for="item in listData"
              @click="orderDetailEvent(item,'canceled')"
            >
<!--              <div class="flex-row">-->
<!--                <div class="full">-->
<!--                  <i class="dianpu-icon iconfont mall-dianpu theme_standard_font"></i>-->
<!--                  {{item.ouName}}-->
<!--                </div>-->
<!--                <div class="font-small theme_standard_font">已取消</div>-->
<!--              </div>-->
              <div class="flex-row">
                <OrderPros
                  :orderItemList="item.itemAbstractList"
                  :watermark="item.deliverType == '3' ? '1' : '0'"
                ></OrderPros>
              </div>
              <div class="flex-row">
                <div class="full"></div>
                <div class="font-small theme_font_tint">
                  <span>共{{productNumber(item.itemAbstractList)}}件商品 &nbsp; 需付款：</span>
                  <PriceOrder :orderitem="item"></PriceOrder>
                </div>
              </div>
              <div
                class="flex-row flex-row-smallbottom"
                v-if="getProductType(item) != 2 && item.orderType != '200117' && getPivotalProductType(item.itemAbstractList) != 550"
              >
                <div class="full"></div>
                <div
                  class="row-btn line_circle theme_font_common theme_border_gray"
                  v-if="$store.state.deployType == 4"
                  @click.stop="consultingService(item)"
                >咨询客服</div>
                <div
                  v-if="item.orderMode != 12"
                  class="row-btn line_circle theme_standard_font theme_standard_bdr"
                  @click.stop="reBuy(item)"
                >再次购买</div>
              </div>
            </div>
          </div>
        </pull-to>
      </div>
      <div
        class="no-data-div"
        :class="{'other-top': tabSelectedItem.tag == '4' && $store.state.globalConfig.delivertype_default != '2' && $store.state.globalConfig.delivertype_default != '1' && $store.state.globalConfig.order_list_tabs_type != '2'}"
        v-if="showNoData"
      >
        <div class="no-data-img">
          <img src="static/image/mall2/no-order.png" />
        </div>
<!--        hideHotRecommend 扫码购去掉热门推荐-->
        <div
          class="recommend-div"
          v-if="$store.state.globalConfig.app_home_special_flag != 'cnooc' && $route.query.hideHotRecommend != 1"
        >
          <Recommend></Recommend>
        </div>
      </div>
      <img style="display: none" id="img" src="../../../../static/image/microShop/1@222x.png" alt />
    </nav-content>
    <van-dialog v-model="showDialog" title="选择快递单号" @confirm="confirmForm" show-cancel-button>
      <van-radio-group v-model="expressNo">
        <van-cell-group>
          <van-cell @click="selExpress(item2)" v-for="(item2,index) in expressNoList" :key="index" :title="item2" clickable >
            <template #right-icon>
              <van-radio checked-color="#ee0a24" :name="item2" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
    <PickupCode v-if="showCode" :code="pickUpCode" @backEvent="codeBack"></PickupCode>
  </div>
</template>

<script>
import OrderPros from './base/order-pros'
import PullTo from '@/components/Vendor/vue-pull-to/vue-pull-to'
import PickupCode from './base/pickup-code'
import Recommend from '../list/recommend/index'
import PriceOrder from '@/components/commonui/price/price-order'
import {Dialog} from 'vant'
import utils from "@/utils/util"
import appNav from '@zkty-team/x-engine-module-nav'

export default {
  name: 'order',
  components: {
    OrderPros,
    PullTo,
    PickupCode,
    Recommend,
    PriceOrder,
    [Dialog.name]: Dialog
  },
  data() {
    return {
      lastPath: '',
      showCode: false,
      showDialog: false,
      formItem: {},
      expressNo: '',
      expressNoList: [],
      tabs: [
        {
          text: '待支付',
          tag: '1',
          type: [
            '200015',
            '200502'
          ],
          nowPage: 1,
          isCanLoadMore: true
        },
        {
          text: '待发货',
          tag: '16',
          type: ['200017'],
          nowPage: 1,
          isCanLoadMore: true
        },
        {
          // text: '待收(提)货',
          text: '待收货',
          tag: '4',
          type: ['200017'],
          nowPage: 1,
          isCanLoadMore: true
        },
        {
          text: '已完成',
          tag: '9',
          type: ['200017'],
          nowPage: 1,
          isCanLoadMore: true
        },
        {
          text: '已取消',
          tag: '7',
          type: ['200018'],
          nowPage: 1,
          isCanLoadMore: true
        }
      ],
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
  computed: {},
  mounted() {

  },
  methods: {
    wxenvironment() {
      let ua = window.navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == "micromessenger";
    },
    dealPushDeliveryBtn(time) {
      let num = this.$store.state.globalConfig.order_delivery_remind_displaytime
      var curDate = new Date(time);
      var preDate = new Date(curDate.getTime() + num * 60 * 60 * 1000);
      let dateTime = utils.dateParse(utils.getPayTime()).getTime()
      let compareDateTime = utils.getPreTime(preDate.getTime())
      if (compareDateTime > dateTime) {
        // console.log('compareDat>date')
        return 1
      } else if (compareDateTime == dateTime) {
        // console.log('compareDat=date')
        return 0
      } else {
        // console.log('compareDat<date')
        return -1
      }
    },
    selExpress(item) {
      this.expressNo = item;
      this.formItem.expressNo = item;
      console.log(this.formItem)
    },
    confirmForm() {
      this.showExpress(this.formItem)
    },
    expressType(obj) {
      this.formItem = this.$util.deepClone(obj);
      let expressArr = []
      if(this.formItem.expressNo && typeof(this.formItem.expressNo) == 'string') {
        expressArr = this.formItem.expressNo.split(",");
      }
      if(expressArr.length == 1) {
        this.showExpress(this.formItem)
      } else {
        this.showDialog = true;
        this.expressNoList = expressArr;
      }
    },
    productNumber(orderItemList) {
      let num = 0
      for (let i = 0; i < orderItemList.length; i++) {
        let item = orderItemList[i]
        num += item.number
      }
      return num
    },
    getPivotalProductType: function (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].productType == 8) {
          return 8
        } else if (list[i].productType == 550) {
          return 550
        }
      }
    },
    consultingService: function (item) {
      let url = '/app/json/home/contactUs'
      let paramsData = {
        userId: this.$store.state.userInfo.userId,
        orderId: item.id,
      }
      this.$Loading.open()
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            let realUrl = data.data
            this.$bridgefunc.customPush({
              path: realUrl,
              isnativetop: '1'
            }, false)
          } else {
            this.$Toast(data.info)
          }
        },
        error => {
          this.$Loading.close()
          this.$Toast('请求数据失败！')
        }
      )
    },
    pushDelivery(item) {
      // 催促发货
      if (item.deliveryRemindState == 1) {
        // 是否已发送催促发货消息 (0: 否  1: 是)
        Dialog.alert({
          title: '提示',
          message: '商家已经收到发货提醒啦，请您耐心等待哟~',
        }).then(() => {
        });
      } else {
        this.$request.post('/app/json/app_shopping_order/sendDeliveryMsg', {
          orderType: item.orderType,
          orderId: item.id,
        }).then(res => {
          if (res.status === 0) {
            Dialog.alert({
              title: '提示',
              message: '已发送发货提醒，商家会尽快进行发货,请耐心等待',
            }).then(() => {
            });
          } else {
            this.$Toast(res.info)
          }
        })
      }
    },
    modifyAddress: function (item) {
      this.$router.push({
        path: '/mall2/modifyorderaddress',
        query: {
          address: JSON.stringify({
            address: item.address || '',
            addressFull: item.addressFull || '',
            cityId: item.cityId || '',
            cityName: item.cityName || '',
            countryId: item.countryId || '',
            countryName: item.countryName || '',
            provinceId: item.provinceId || '',
            provinceName: item.provinceName || '',
            townId: item.townId || '',
            townName: item.townName || '',
            receiver: item.receiver || '',
            mobile: item.mobile || ''
          }),
          orderId: item.id,
          tradeNo: item.tradeNo,
          orderType: item.orderType
        }
      });
    },
    toHistory: function() {
      this.$Loading.open()
      let redUrl = this.$store.state.globalConfig.kshop_orderListUrl
      let url = '/app/json/login/redirectToKShop'
      let paramsData = {
        redirectUrl: redUrl,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode
      }
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            let realUrl = data.data
            this.$bridgefunc.customPush(
              {
                path: realUrl,
                isnativetop: '1'
              },
              false
            )
          } else {
            this.$Toast(data.info)
          }
        },
        error => {
          this.$Loading.close()
          this.$Toast('请求数据失败！')
        }
      )
    },
    //如果有一个商品是日期型商品  就肯定是日期型商品
    getProductType: function(item) {
      let abstractList = item.itemAbstractList
      for (let i = 0; i < abstractList.length; i++) {
        let item = abstractList[i]
        if (item.productType == 2) {
          return '2'
        }
      }
      return ''
    },
    codeBack: function() {
      this.showCode = false
    },
    showPickUpCode: function() {
      if (this.listData.length == 0) {
        this.$Toast('您没有待提货订单！')
        return
      }
      this.$Loading.open()
      let url = '/app/json/app_shopping_order/getBatchDeliveryCheckcode'
      let paramsData = {
        token: this.$store.state.login.token,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode
      }
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.pickUpCode = data.data
            this.showCode = true
          } else {
            this.$Toast(data.info)
          }
        },
        error => {
          this.$Loading.close()
          this.$Toast('请求数据失败！')
        }
      )
    },
    showInvoice: function() {
      this.$Toast('暂不支持！')
    },
    deliveryTypeSelected: function(type) {
      this.deliveryType = 2 //默认待收货
      // this.deliveryType = type
      this.tabSelectedItem.nowIndex = 1
      this.listData = []
      this.showNoData = false
      // tabEvent
      this._getTabOrders(this.tabSelectedItem, null)
    },
    isShowExpress(item) {
      if (item.deliverType == 3) {
        // 蜂鸟配送
        return false
      }

      if (item.interfaceType == 2 || item.interfaceType == 1) {
        // 京东物流
        return true
      } else if ( this.$store.state.globalConfig.enableEMS == 1 && item.expressSendingMode == '1') {
        // 邮政物流
        return true
      } else if ( this.$store.state.globalConfig.order_ali_deliver_enable == '1' && item.interfaceType == '0' && item.deliverType == '2') {
        // 阿里物流
        return true
      } else {
        // 快递100
        if (this.$store.state.globalConfig.hide_express_btn == 1) {
          // 强制隐藏物流按钮，有的企业不需要
          return false
        } else if (this.$store.state.globalConfig.hasApiForExpress100 == 1) {
          // 对接了快递100的api
          return true
        }  else if (this.$store.state.webtype == 3) {
          // 小程序
          return false
        }
        return true
      }
      return false
    },
    showExpress: function(item) {
      console.log(item,'item')
      //京东快递
      if (item.interfaceType == 2 || item.interfaceType == 1) {
        //请求详情
        this.$Loading.open()
        let url = '/app/json/app_shopping_order/detail'
        let paramsData = {
          token: this.$store.state.login.token,
          orderId: item.id,
          orderType: item.orderType,
          orderCategory: this.orderCategory,
          vipUnitUserCode: this.vipUnitUserCode
        }
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close()
            let data = res.data
            if (data.status == 0) {
              this.$router.push({
                name: 'expressinfo',
                params: {
                  expressinfo: encodeURIComponent(
                    JSON.stringify(data.data.tracksList)
                  )
                }
              })
            } else {
              this.$Toast(data.info)
            }
          },
          error => {
            this.$Loading.close()
            this.$Toast('请求数据失败！')
          }
        )
      } else if (
        // EMS快递
        this.$store.state.globalConfig.enableEMS == 1 &&
        item.interfaceType == 0 &&
        item.expressSendingMode == '1'
      ) {
        this.$router.push({
          path: '/mall2/orderlogistics',
          query: {
            traceNo: item.expressNo
          }
        })
      } else if (
        // 阿里物流
        this.$store.state.globalConfig.order_ali_deliver_enable == '1' &&
        item.interfaceType == '0' &&
        item.deliverType == '2'
      ) {
        this.$router.push({
          path: '/mall2/aliexpressinfo',
          query: {
            orderType: item.orderType,
            orderId: item.id,
            logisticsOrderNo: item.expressNo,
          }
        })
      } else if (this.$store.state.globalConfig.hasApiForExpress100 == 1) {
        // 快递100API版本
        this.$router.push({
          path: '/mall2/100expressinfo',
          query: {
            expressNo: item.expressNo,
            expressName: item.expressName
          }
        })
      } else {
        // 快递100web版本
        let url =
          'https://m.kuaidi100.com/index_all.html?type=' +
          encodeURIComponent(item.expressName) +
          '&postid=' +
          encodeURIComponent(item.expressNo)
        this.$bridgefunc.customPush({
          path: url,
          isnativetop: '1',
          isVuePage: false
        })
      }
    },
    toComment: function(item) {
      console.log(item.itemAbstractList, 'toComment')
      if (item.itemAbstractList.length > 0) {
        if (item.itemAbstractList.length > 1) {
          // let arr = []
          // item.itemAbstractList.map(ele => {
          //   arr.push({
          //     skuId: ele.skuId,
          //     orderId: ele.id,
          //     phPictureUrl: ele.phPictureUrl,
          //     skuName: ele.skuName,
          //     number: ele.number
          //   })
          // })
          this.$router.push({
            path: '/mall2/comment2',
            query: {
              // itemList: JSON.stringify(arr)
              orderId: item.id
            }
          })
        } else {
          this.$router.push({
            path: '/mall2/comment',
            query: {
              skuId: item.itemAbstractList[0].skuId,
              orderId: item.itemAbstractList[0].id,
              phPictureUrl: item.itemAbstractList[0].phPictureUrl,
              skuName: item.itemAbstractList[0].skuName
            }
          })
        }
      }
    },
    _confirmProductApi: function(item) {
      this.$Loading.open()
      let url = '/app/json/app_shopping_order/orderConfirm'
      let paramsData = {
        token: this.$store.state.login.token,
        orderId: item.id,
        orderType: item.orderType,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode
      }
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.tabEvent(this.tabs[3], 3)
          } else {
            this.$Toast(data.info)
          }
        },
        error => {
          this.$Loading.close()
          this.$Toast('请求数据失败！')
        }
      )
    },
    // 确认收货
    confirmProduct: function(item) {
      this.$MessageBox
        .confirm('您确定已经收到商品了吗？', '提示')
        .then(action => {
          this._confirmProductApi(item)
        })
        .catch(action => {})
    },
    backEvent: function() {
      if (this.$route.query.backApp) {
        appNav.navigatorBack({ url: '0' }).then( res => {
          console.log(res)
        })
      } else {
        this.$router.push("/common")
      }
      // this.$util.wxmpBackHome(() => {
        
      //   this.$keepaliveHelper.deleteCache(this)
      // })
    },
    tabEvent: function(item, idx) {
      this.tabIndex = idx
      if (this.$store.state.globalConfig.order_list_tabs_type == '2') {
        if (idx == 3) {
          this.deliveryType = 1
        } else if (idx == 2) {
          this.deliveryType = 2
        }
      }
      //切换重新请求数据
      item.nowIndex = 1
      this.listData = []
      this.showNoData = false
      this.tabSelectedItem = item
      this._getTabOrders(item, null)
    },
    orderDetailEvent: function(item, orderState) {
      // tobePay  tobeShip  completed  canceled
      if(item.orderMode == 12){
        //社区团购订单
        let pageType = "";
        switch (orderState) {
          case undefined:
            pageType = "waitTakeDelivery"
            break;
          case 'tobePay':
            pageType = "waitPay"
            break;
          case 'tobeShip':
            pageType = "waitDelivery"
            break;
          case 'completed':
            pageType = "finish"
            break;
          case 'canceled':
            pageType = "cancel"
            break;
        }
        this.$router.push({
          path:"/orderInfo",
          query:{
            info:JSON.stringify({
              shoppingOrderId:item.shoppingOrderId,
              id:item.id,
              tradeNo:item.tradeNo,
            }),
            pageType:pageType,
            state:item.state,
          }
        })
        return
      }
      if (item.orderType == '200202') {
        this.$router.push({
          path: '/group_detail',
          query: {
            orderId: item.groupBuyId,
            mktGroupBuyId: item.groupBuyActivityId
          }
        })
        return
      } else if (item.orderType == '200102' || item.orderType == '200117') {
        let externalOrderDetailUrl = item.externalOrderDetailUrl
        if (
          externalOrderDetailUrl &&
          externalOrderDetailUrl != undefined &&
          externalOrderDetailUrl != null &&
          externalOrderDetailUrl != ''
        ) {
          let url = '/app/json/home/getExoLoginUrl'
          let paramsData = {
            token: this.$store.state.login.token,
            baseUrl: externalOrderDetailUrl,
            orderCategory: this.orderCategory,
            vipUnitUserCode: this.vipUnitUserCode
          }
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
            }
            this.$bridgefunc.customPush(jsonData)
            return
          }
          this.$Loading.open()
          this.$http.post(url, paramsData).then(
            res => {
              this.$Loading.close()
              let data = res.data
              if (data.status == 0) {
                let url = data.data
                if (url == '') {
                  this.$Toast('返回动态链接错误，请稍后重试！')
                  return
                }
                let jsonData = {
                  path: url,
                  isnativetop: '1'
                }
                this.$bridgefunc.customPush(jsonData)
              } else {
                this.$Toast(data.info)
              }
            },
            error => {
              this.$Loading.close()
              this.$Toast('请求数据失败！')
            }
          )
          return
        }
      } else if (item.shoppingOrderType == '200103') {
        let path = '',
          type = ''
        if (orderState === 'tobePay') {
          path = '/carefree_trave/tobePaidDetail'
          type = 'tobepaid'
        } else if (orderState === 'tobeShip') {
          path = '/carefree_trave/tobePaidDetail'
          type = 'sendGoods'
        } else if (orderState === 'completed') {
          path = '/carefree_trave/sendgoodsDetail'
          type = ''
        } else if (orderState === 'canceled') {
          path = '/carefree_trave/tobePaidDetail'
          type = 'cancelgood'
        }
        this.$router.push({
          path: path,
          query: {
            orderId: item.id,
            tradeNo: item.tradeNo,
            orderType: item.orderType,
            type: type
          }
        })
        return
      }

      let awardActivity =
        item.awardActivityList && item.awardActivityList.length
          ? item.awardActivityList[0]
          : {}
      this.$router.push({
        path: '/mall2/orderdetail',
        query: {
          payMode: item.payMode,
          tradeNo: item.tradeNo,
          shoppingOrderId: item.shoppingOrderId,
          orderPayType: item.orderPayType,
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
    topRefresh: function(loaded) {
      this.tabSelectedItem.nowIndex = 1
      this._getTabOrders(this.tabSelectedItem, loaded)
    },
    loadMore: function(loaded) {
      this._getTabOrders(this.tabSelectedItem, loaded)
    },
    _getTabOrders: function(item, loaded) {
    console.log('this.$store.state.globalConfig.delivertype_default',this.tabs)

      this.$Loading.open()
      let url = '/app/json/app_shopping_order/queryOrder'
      let paramsData = {
        token: this.$store.state.login.token,
        orderType: item.type[0],
        orderTypeList:item.type,
        state: item.tag,
        page: {
          index: item.nowIndex,
          pageSize: 10
        }
      }
      if (item.productType == '512') {
        url = '/app/json/app_shopping_order/queryOrderItem'
        paramsData.productType = 512
      }
      if (item.tag == 4) {  
        paramsData.deliverType = this.deliveryType
        // // queryOrder接口屏蔽扫码购订单
        // if (this.deliveryType == 1) {
        //   paramsData.orderModeList = [0, 2];
        // }
        if (this.deliveryType == 2) {
          paramsData.deliverTypeList = [2, 3]
        }
      } else if (item.tag == 99) {
        paramsData.state = 4
        paramsData.deliverType = 3
      }
      paramsData.orderCategory = this.orderCategory
      paramsData.vipUnitUserCode = this.vipUnitUserCode

      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close()

          let data = res.data
          if (data.status == 0) {
            if (item.nowIndex > 1) {
              // this.listData = this.listData.concat(data.data.orderList);
              for (let i = 0; i < data.data.orderList.length; i++) {
                let item = data.data.orderList[i]
                if (
                  item.wechatMerchantCouponAmount &&
                  item.wechatMerchantCouponAmount > 0
                ) {
                  item.payAmount =
                    item.payAmount - item.wechatMerchantCouponAmount
                }
                this.$mallCommon.dataProcessing(item)
                this.listData.push(item)
              }
            } else {
              for (let i = 0; i < data.data.orderList.length; i++) {
                let item = data.data.orderList[i]
                if (
                  item.wechatMerchantCouponAmount &&
                  item.wechatMerchantCouponAmount > 0
                ) {
                  item.payAmount =
                    item.payAmount - item.wechatMerchantCouponAmount
                }
                this.$mallCommon.dataProcessing(item)
                this.listData.push(item)
              }
              this.listData = data.data.orderList
              if (this.listData.length == 0) {
                this.showNoData = true
              } else {
                this.showNoData = false
              }
            }
            this.tabSelectedItem.nowIndex += 1
            if (data.data.page.count > this.listData.length) {
              this.tabSelectedItem.isCanLoadMore = true
            } else {
              this.tabSelectedItem.isCanLoadMore = false
            }
          } else {
            this.$Toast(data.info)
          }
          if (loaded) {
            loaded('done')
          }
        },
        error => {
          this.$Loading.close()
          this.$Toast('请求数据失败！')
          if (loaded) {
            loaded('done')
          }
        }
      )
    },
    payEvent: function(item) {
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
    reBuy: function(item) {
      if (item.deliverType == 3) {
        let arr = []
        for (let i = 0; i < item.itemAbstractList.length; i++) {
          let product = item.itemAbstractList[i]
          if (product.isGift == 0) {
            let cd = {
              skuId: product.skuId,
              storeOuCode: product.storeOuCode,
              number: product.number
            }
            arr.push(cd)
          }
        }
        sessionStorage.setItem('MDPS_Carts', JSON.stringify(arr))
        this.$router.push({
          path: '/mall2/store-delivery/list'
        })
        return
      }

      // 重新购买修改为直接重新下单
      this.$Loading.open()
      let url = '/app/json/app_cart/SettleCart'
      let paramsData = {
        token: this.$store.state.login.token,
        deliveryType: item.deliverType,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode,
        userAddress: this.$store.state.mall2.selectAddress,
        pickupId: this.$store.state.mall2.zitiAddress.id,
        userAddressId: '',
      }
      if (paramsData.deliveryType == 2) {
        if (this.$store.state.mall2.selectAddress.id > 0) {
          paramsData.userAddressId = this.$store.state.mall2.selectAddress.id
        }
      }
      let arr = []
      for (let i = 0; i < item.itemAbstractList.length; i++) {
        let product = item.itemAbstractList[i]
        let cd = {
          skuId: product.skuId,
          storeOuCode: product.storeOuCode,
          number: product.number
        }
        arr.push(cd)
      }
      paramsData.carts = arr

      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            let params = {
              res: data.data,
              paramsData: paramsData,
              deliveryType: paramsData.deliveryType
            };

            if (!(this.$store.state.mall2.selectAddress.id > 0) && this.detailData.deliveryType == 2) {
              if (this.matchAddress) {
                this.$store.state.mall2.selectAddress = this.matchAddress;
                this.$bridgefunc.vuexStorage(() => {
                })
              } else {
                params.noMatch = true;
              }
            }
            if (this.$mallCommon.isExistCanNotAttendActivity(data.data.occur) == true) {
              this.$MessageBox.confirm('部分商品不能参加活动</br>将按原价购买，是否继续？', '提示', {confirmButtonText: '确定'}).then(action => {
                this.$router.push({
                  name: '填写订单',
                  params: params
                })
              }).catch(action => {
              });
            } else {
              this.$router.push({
                name: '填写订单',
                params: params
              })
            }
            // this.$store.state.mall2.staticDeliverType = item.deliverType
            // this.$store.state.mall2.cartNum = data.data
            // this.$router.push({
            //   path: '/mall2/cart',
            //   query: {
            //     orderCategory: this.orderCategory,
            //     vipUnitUserCode: this.vipUnitUserCode,
            //     productType: item.productType, //话费充值,501
            //   }
            // })
          } else {
            this.$Toast(data.info)
          }
        },
        error => {
          this.$Loading.close()
          this.$Toast('请求数据失败！')
        }
      )
    },
    shareActivity(list) {
      console.log(list)
      console.log(list.id)
      if (list.awardActivityList && list.awardActivityList.length > 0) {
        let url = { orderId: list.id, ...list.awardActivityList[0] }
        url.activityPromotionalPic = document.getElementById('img').src
        let dataDesc = list.awardActivityList[0].activityDesc
        dataDesc = dataDesc.replace(/<[^>]+>/g, "") //replace(/<\/?.+?>/g, '')
        url.activityDesc = dataDesc
        console.log(888, url.activityDesc,url)
        this.$router.push({
          path: '/share-gift/share',
          query: { awardActivity: JSON.stringify(url) }
        })
      }
    }
  },
  created() {
    if(this,this.wxenvironment) {
      document.title = "订单列表"
    }
    //this.$store.state.globalConfig.pickup_cancel_order_tip = '123123123'
    //this.$store.state.globalConfig.delivery_cancel_order_tip = '4444545454'
    if (this.$store.state.globalConfig.delivertype_default == '1') {
      this.tabs = [
        {
          text: '待支付',
          tag: '1',
          type: ['200015','200502'],
          nowPage: 1,
          isCanLoadMore: true
        },
        {
          text: '待提货',
          tag: '4',
          type: ['200017'],
          nowPage: 1,
          isCanLoadMore: true
        },
        {
          text: '已完成',
          tag: '9',
          type: ['200017'],
          nowPage: 1,
          isCanLoadMore: true
        },
        {
          text: '已取消',
          tag: '7',
          type: ['200018'],
          nowPage: 1,
          isCanLoadMore: true
        }
      ]
    } else if (this.$store.state.globalConfig.delivertype_default == '2') {
      this.tabs = [
        {
          text: '待支付',
          tag: '1',
          type: ['200015','200502'],
          nowPage: 1,
          isCanLoadMore: true
        },
        {
          text: '待发货',
          tag: '16',
          type: ['200017'],
          nowPage: 1,
          isCanLoadMore: true
        },
        {
          text: '待收货',
          tag: '4',
          type: ['200017'],
          nowPage: 1,
          isCanLoadMore: true
        },
        {
          text: '已完成',
          tag: '9',
          type: ['200017'],
          nowPage: 1,
          isCanLoadMore: true
        },
        {
          text: '已取消',
          tag: '7',
          type: ['200018'],
          nowPage: 1,
          isCanLoadMore: true
        }
      ]
    } else if (this.$store.state.globalConfig.order_list_tabs_type == '2') {
      this.tabs = [
        {
          text: '待支付',
          tag: '1',
          type: ['200015','200502'],
          nowPage: 1,
          isCanLoadMore: true
        },
        {
          text: '待发货',
          tag: '16',
          type: ['200017'],
          nowPage: 1,
          isCanLoadMore: true
        },
        {
          text: '待收货',
          tag: '4',
          type: ['200017'],
          nowPage: 1,
          isCanLoadMore: true
        },
        {
          text: '待提货',
          tag: '4',
          type: ['200017'],
          nowPage: 1,
          isCanLoadMore: true
        },
        {
          text: '已完成',
          tag: '9',
          type: ['200017'],
          nowPage: 1,
          isCanLoadMore: true
        },
        {
          text: '已取消',
          tag: '7',
          type: ['200018'],
          nowPage: 1,
          isCanLoadMore: true
        }
      ]
    }

    if (this.$store.state.globalConfig.toBeServed == '1') {
      let dfw = {
        text: '待服务',
        tag: '99', // 虚拟的订单tag
        type: ['200017'],
        nowPage: 1,
        isCanLoadMore: true
      }
      this.tabs.splice(this.tabs.length - 2, 0, dfw)
    }
    if (this.$store.state.globalConfig.order_has_my_service == '1') {
      let dfw = {
        text: '我的服务',
        tag: '9', // 虚拟的订单tag
        type: ['200017'],
        productType: '512',
        nowPage: 1,
        isCanLoadMore: true
      }
      this.tabs.splice(this.tabs.length - 1, 0, dfw)
    }

    let selectedIndex = this.$route.query.selectedIndex
      ? this.$route.query.selectedIndex
      : 0
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
    this.orderCategory = this.$route.query.orderCategory
    this.vipUnitUserCode = this.$route.query.vipUnitUserCode
    this.lastPath = this.$route.query.lastPath
    this.deliveryType = this.$store.state.mall2.staticDeliverType
      ? this.$store.state.mall2.staticDeliverType
      : '2'
    this.tabEvent(this.tabs[selectedIndex], selectedIndex)
  },
  activated() {
    this.$userCenter._getMyOrder()
    let idx = this.$store.state.mall2.order.backIndex
    if (idx > -1) {
      this.tabEvent(this.tabs[idx], idx)
      this.$store.state.mall2.order.backIndex = -1
    } else {
      if (this.scrollTopValue1 > 0) {
        this.$refs.scrollDiv.setScrollTopValue(this.scrollTopValue1)
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == this.lastPath) {
      this.$keepaliveHelper.deleteCache(this)
    } else {
      this.scrollTopValue1 = this.$refs.scrollDiv.getScrollTopValue()
    }
    next()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.order {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .tabs {
    .tab-item {
      .text {
        padding 11px 0;
      }
    }
  }

  .scroll-div {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 41px;
    bottom: 0px;
    overflow: hidden;

    .cancel-tip {
      background-color: rgba(255, 255, 0, 0.3);
      line-height: 16px;
      font-size: 12px;
      padding: 5px 10px;
    }

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
      display: flex;
      align-items: center;

      .scan-buy {
        padding: 4px 10px;
        margin-right: 10px;
        background-color: $color-theme-r;
        color: white;
        font-size: $font-size-medium;
        border-radius: 11px;
      }
    }

    .pickup-tip {
      margin: -4px -8px 10px -8px;
      font-size: 12px;
      padding: 10px;
      background-color: #ddd;
      display: flex;
      align-items: center;
    }
  }

  .no-data-div {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 38px;
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
    top: 76px;
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

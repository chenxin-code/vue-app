/**Created by liaoyingchao on 2018/10/24.*/

<template>
  <div class="list">
    <div class="pickup-yd" v-if="pickuYD" @click.stop="pickuYD = false">
      <img src="static/image/mall2/pickup-yd.png" />
    </div>
    <nav-top
      :noTitle="true"
      @backEvent="backEvent"
      v-if="componentName != 'AXJFShop'"
    >
      <div
        class="search-div theme_bg_white_f5"
        style="
          left: 50px;
          right: 50px;
          height: 30px;
          top: 7px;
          padding: 0 15px;
          border-radius: 15px;
        "
        @click="toSearchEvent"
      >
        <i
          class="iconfont mall-sousuo theme_font_tint"
          style="font-size: 16px"
        ></i>
        <span
          class="theme_font_tint single-line"
          style="font-size: 14px; margin-left: 10px"
          >{{ searchKey ? searchKey : "搜你想要的商品" }}</span
        >
      </div>
      <div
        class="right-btn"
        style="right: 0px; height: 44px; top: 0px; padding-right: 10px"
        @click="listStyleEvent"
        v-if="pageType == ''"
      >
        <i
          class="iconfont mall-datubiao theme_font_common"
          style="font-size: 24px"
          v-if="listStyle == 2"
        ></i>
        <i
          class="iconfont mall-qiehuan theme_font_common"
          style="font-size: 24px"
          v-if="listStyle == 1"
        ></i>
      </div>
    </nav-top>
    <nav-content>
      <!-- 优化新增类目 -->
      <NewCategory
        @toggle="toggle"
        :NoCategory="NoCategory"
        v-show="showNewCategory"
        :domIndex="domIndex"
        v-if="isProgram"
        :category="category"
      ></NewCategory>
      <div class="all-content">
        <div
          class="row axjf-tip line_bottom"
          v-if="componentName == 'AXJFShop'"
          @click="axPointsDetail"
        >
          <div class="label">当前爱心积分</div>
          <div class="value">{{ axPoints }}</div>
          <i class="iconfont mall-gengduojiantou"></i>
        </div>
        <!--        <div class="row">-->
        <!--          <div class="type-btn line_circle"-->
        <!--               :class="{theme_light_bg: selectedType == item.tag, theme_standard_bdr_i: selectedType == item.tag}"-->
        <!--               @click="selectedTypeEvent(item.tag)" v-for="item in deliveryTypes">-->
        <!--            <i class="iconfont theme_font_common icon-size"-->
        <!--               :class="[item.fontclass, {theme_standard_font_i: selectedType == item.tag}]"></i>-->
        <!--            <span class="theme_font_common"-->
        <!--                  :class="{theme_standard_font_i: selectedType == item.tag}">{{item.text}}</span>-->
        <!--          </div>-->
        <!--          <div class="space"></div>-->
        <!--          <div class="local-div" @click="selectAddressClick()">-->
        <!--            <span class="theme_font_gray single-line" v-if="selectedType == 2">{{$store.state.mall2.selectAddress.addressFull}}</span>-->
        <!--            <span class="theme_font_gray single-line" v-if="selectedType == 1">{{$store.state.mall2.zitiAddress.storeName}}</span>-->
        <!--            <i class="iconfont mall-dingwei icon-size theme_font_gray"></i>-->
        <!--          </div>-->
        <!--        </div>-->
        <div
          class="row row-channel"
          v-if="dataType != '' && channels.length > 1"
        >
          <div
            class="channel-btn theme_font_black"
            @click="channelEvent(channel)"
            v-for="channel in channels"
          >
            <div
              class="text"
              :class="{ active: selectedChannel.id == channel.id }"
            >
              {{ channel.name }}
            </div>
          </div>
        </div>
        <div class="row row-filter top-showdow">
          <!-- <div
            class="filter-btn theme_font_black"
            @click="categoryEvent"
            v-if="categoryIdList == '' && dataType == ''"
          >
            <i
              class="iconfont mall-datubiao filter-size-1 theme_font_black"
            ></i>
            <span class="cate single-line">{{ cateText }}</span>
          </div> -->
          <div class="filter-btn theme_font_black" @click="filterEvent(0)">
            <span
              class="single-line"
              :class="{ theme_standard_font_i: filterType == 0 }"
              >综合排序</span
            >
          </div>
          <div class="filter-btn theme_font_black" @click="filterEvent(1)">
            <span
              class="single-line"
              :class="{
                theme_standard_font_i: filterType == 1 || filterType == 2,
              }"
              >销量</span
            >
          </div>
          <div class="filter-btn theme_font_black" @click="filterEvent(2)">
            <span
              class="single-line"
              :class="{
                theme_standard_font_i: filterType == 3 || filterType == 4,
              }"
              >价格</span
            >
            <div v-show="filterType == 3 || filterType == 4">
              <i
                class="iconfont mall-sanjiaoxiabiao arrow-icon theme_font_tint"
                :class="{ theme_standard_font_i: filterType == 3 }"
              ></i>
              <i
                class="iconfont mall-xiala arrow-icon theme_font_tint"
                :class="{ theme_standard_font_i: filterType == 4 }"
              ></i>
            </div>
          </div>
          <div
            class="filter-btn theme_font_black"
            @click="filterEvent(3)"
            v-if="$store.state.globalConfig.pro_sku_view == '1'"
          >
            <span
              class="single-line"
              :class="{ theme_standard_font_i: filterType == 5 }"
              >人气</span
            >
          </div>
          <div class="filter-btn theme_font_black" @click="superFilter">
            <span class="single-line">筛选</span>
            <i class="iconfont mall-shaixuan filter-size theme_font_tint"></i>
          </div>
        </div>
        <div class="list-content">
          <div class="list-pull-to">
            <pull-to
              ref="listContent"
              :bottomConfig="{
                pullText: '',
                triggerText: '释放更新',
                loadingText: '加载中...',
                doneText: isCanLoadMore ? '加载完成' : '没有更多数据了',
                failText: '加载失败',
                loadedStayTime: 400,
                stayDistance: 40,
                triggerDistance: 50,
              }"
              :bottom-load-method="_loadProList"
              :isBottomAutoS="true"
              :isBottomBounce="isCanLoadMore"
            >
              <div>
                <div
                  class="list-tip theme_bg_yl theme_font_red"
                  v-if="pageType != '' && endTime != ''"
                >
                  <p>限时促销： {{ tipText }}</p>
                  <p>
                    距离结束：
                    <countdown :endTime="endTime"></countdown>
                  </p>
                </div>
                <CardList
                  @productEvent="productEvent"
                  @addToCart="addToCart"
                  :listData="listData"
                  v-if="listData.length > 0 && listStyle == 1"
                ></CardList>
                <DetailList
                  @productEvent="productEvent"
                  @addToCart="addToCart"
                  :listData="listData"
                  v-if="listData.length > 0 && listStyle == 2"
                ></DetailList>
              </div>
            </pull-to>
          </div>
          <div class="no-list" v-if="isNoList && pageType == ''">
            <div class="img-div">
              <img src="static/image/mall2/no-data-img.png" />
            </div>
            <div
              class="tip theme_font_gray"
              v-if="selectedType == 1 && pageType == 'coupon'"
            >
              当前门店无可用商品，请切换自提点查看可用商品
            </div>
            <div class="tip theme_font_gray" v-else-if="selectedType == 1">
              抱歉没有找到相应商品，请切换自提点试试吧
            </div>
            <div class="tip theme_font_gray" v-else>抱歉没有找到相应商品~</div>
            <Recommend v-if="selectedType == '2'"></Recommend>
            <PickupRecommend
              v-if="selectedType == '1' && searchKey != ''"
              :searchKey="searchKey"
            ></PickupRecommend>
          </div>
        </div>
        <div
          class="activity-btns"
          v-if="pageType != '' && pageType != 'activity_nocart'"
        >
          <div class="subtotal-div" v-if="pageType == 'activity'">
            <p>
              <span>小计：</span>
              <span class="theme_font_red"
                >￥{{ $util.toDecimal2(activityInfo.amount) }}</span
              >
            </p>
            <p class="font-small theme_font_tint">
              <span>{{ activityInfo.activityDiscountDesc }}</span>
            </p>
          </div>
          <div class="subtotal-div" v-if="pageType == 'coupon'">
            <p>
              <span>小计：</span>
              <span class="theme_font_red"
                >￥{{ $util.toDecimal2(this.cartCanUseCouponAmount) }}</span
              >
            </p>
            <p class="font-small theme_font_tint">
              <span>{{ getCouponTip() }}</span>
            </p>
          </div>
          <div
            class="btn theme_bg_y theme_font_white"
            v-if="
              activityInfo.linkType == 3 ||
              activityInfo.linkType == 4 ||
              activityInfo.linkType == 5 ||
              activityInfo.linkType == 6
            "
            @click="goGift"
          >
            {{ getGiftText() }}
          </div>
          <div class="btn theme_bg_red theme_font_white" @click="goCart">
            去购物车
          </div>
        </div>
        <div
          ref="gouwuche"
          class="cart-div theme_bg_dark_d"
          :class="{ gouwucheani: addCartBtnAn }"
          v-if="!cardType || cardType != 552"
          @click.stop="goCart"
        >
          <img
            src="../wish-list/images/wish-icon-car.png"
            alt=""
            v-if="$route.query.entryType === 'wish'"
            class="wish-icon"
            @click.stop="$router.go(-1)"
          />
          <div v-else>
            <p
              class="cart-num theme_bg_red theme_font_white"
              v-if="$store.state.mall2.cartNum > 0"
            >
              {{ $store.state.mall2.cartNum }}
            </p>
            <i class="iconfont mall-gouwuche theme_font_white"></i>
          </div>
        </div>

        <div
          class="category-div"
          v-show="showCategory"
          v-if="cateList.length > 0"
        >
          <Category
            :cateList="cateList"
            @closeEvent="showCategory = false"
            @cateEvent="cateEvent"
          ></Category>
        </div>
      </div>
    </nav-content>
    <div class="guide-div" v-if="showGuide">
      <img
        class="guide-img-1"
        @click="showGuide = false"
        src="static/image/mall2/guides/list-guide-1.png"
      />
      <img
        class="guide-img-2"
        :style="{ top: $store.state.barHeight + $market.getNavHeight() + 'px' }"
        src="static/image/mall2/guides/list-guide-2.png"
      />
      <img
        class="guide-img-3"
        :style="{ top: $store.state.barHeight + $market.getNavHeight() + 'px' }"
        src="static/image/mall2/guides/list-guide-3.png"
      />
    </div>
    <transition name="bounce" @afterEnter="productImgAfterEnter">
      <img
        :src="this.addToCartItem.phMainUrl"
        alt=""
        class="productImg"
        v-if="showProductImg && addToCartItem"
      />
    </transition>
    <transition @after-enter="afterEnter" @before-enter="beforeEnter">
      <div class="anProductImg" v-if="showAddCartAn && addToCartItem">
        <img :src="this.addToCartItem.phMainUrl" alt="" />
      </div>
    </transition>
    <AllCategory
      :barHeight="$store.state.barHeight"
      v-show="showAllCategory"
      @closeEvent="showAllCategory = false"
      @cateEvent="cateEvent"
    ></AllCategory>
    <Filtrate
      :cateText="cateText"
      @filtrateEvent="filtrateEvent"
      @closeEvent="filtrateCloseEvent"
      :category="category"
      :cateLevel="cateLevel"
      v-if="showCreated"
      v-show="showFiltrate"
    ></Filtrate>
    <AdPage :pageAdKeywords="'AD_Key_ProductList'"></AdPage>
  </div>
</template>

<script>
import CardList from "./base/card-list";
import DetailList from "./base/detail-list";
import Filtrate from "./filtrate/index";
import Search from "../common/search";
import cartJS from "../cart/js/cart";
import GiftList from "../common/giftlist";
import PullTo from "@/components/Vendor/vue-pull-to/vue-pull-to";
import Category from "./category/index";
import AllCategory from "./category/all-categories";
import Countdown from "@/components/Vendor/countdown/countdown";
import Recommend from "./recommend/index";
import PickupRecommend from "./recommend/pickup-recommend";
import InitialLoadPickupAny from "@/utils/initialLoadPickupAny.js";
import AdPage from "@/components/product/index/subpage/adpage";
import NewCategory from "@/components/product/index/category/index";
import { mapMutations } from "vuex";
import appNav from '@zkty-team/x-engine-module-nav';

export default {
  name: "list",
  components: {
    Countdown,
    CardList,
    DetailList,
    Filtrate,
    GiftList,
    PullTo,
    Category,
    Recommend,
    PickupRecommend,
    AllCategory,
    AdPage,
    NewCategory,
  },
  props: ["componentName", "orderCategory", "vipUnitUserCode", "axPoints"],
  data() {
    return {
      deductionSkuId: "",
      listStyle: 1,
      pickuYD: false,
      deliveryTypes: [
        {
          text: "配送",
          fontclass: "mall-peisong",
          tag: "2",
        },
        {
          text: "自提",
          fontclass: "mall-ziti",
          tag: "1",
        },
      ],
      selectedType: 2,
      listZitiId: "",
      filterType: 0,
      category: "",
      listData: [],
      showCreated: false,
      showFiltrate: false,
      filterBrands: [],
      filterFeatureies: [],
      pageType: "",
      activityId: "",
      couponId: "",
      subtotal: "0.00",
      searchKey: "",
      scrollTopValue1: 0,
      backRefresh: false,
      activityInfo: {},
      cartJS: cartJS,
      cateLevel: "",
      nowPage: 1, //分页信息
      isCanLoadMore: false, // 是否可以上拉加载更多
      clsType: "1",
      isFirstEnter: true,
      maxPrice: "",
      minPrice: "",
      lastPath: "",
      proSkuHasStock: "",
      // 活动页面，相关数据
      cateText: "全部分类",
      showCategory: false,
      cateList: [],
      couFaceValue: "0",
      couThresholdAmount: "0",
      cartCanUseCouponAmount: "0",
      endTime: "",
      tipText: "",
      isNoList: false,
      storeOuCode: "",
      showGuide: false,
      showAllCategory: false,

      //当前点击加入购货物车的商品
      addToCartItem: undefined,
      //加入购物车的时候  显示图片动画
      showProductImg: false,
      // 抛物线动画
      showAddCartAn: false,
      //显示购物车按钮动画
      addCartBtnAn: false,
      easyCardId: "", // 从易捷卡页面过来的才有easyCardId
      cardType: "", // 551充值卡 552 计次卡 只有计次卡没有购物车悬浮按钮
      productType: "",
      categoryIdList: "", //多分类
      dataType: "",
      channelGroupId: "",
      channels: [],
      selectedChannel: {},
      nowCouponAmount: 0,
      //是否有类目id
      NoCategory: false,
      // 新类目显示隐藏
      showNewCategory: true,
      //新类目dom下标
      domIndex: 0,
      isProgram: false,
    };
  },
  mounted() {
    this.easyCardId = this.$route.query.easyCardId;
    this.cardType = this.$route.query.cardType;
  },
  methods: {
    //新增类目分类切换方法
    ...mapMutations(["setShowCategory"]),
    toggle(category) {
      this.category = category;
      this.cateLevel = 1;
      this.nowPage = 0;
      this.searchKey = "";
      this._loadProList();
    },

    axPointsDetail: function () {
      this.$emit("axPointsDetail");
    },
    channelEvent: function (channel) {
      this.selectedChannel = channel;
      this.nowPage = 0;
      this._loadProList();
    },
    getCouponTip: function () {
      let amount =
        this.cartCanUseCouponAmount != "" ? this.cartCanUseCouponAmount : "0";
      if (parseFloat(amount) > parseFloat(this.couThresholdAmount)) {
        return "您已可以使用优惠券，优惠" + this.nowCouponAmount + "元";
      } else {
        let num = this.$util.toDecimal2(
          parseFloat(this.couThresholdAmount) - parseFloat(amount)
        );
        return "还差" + num + "元可以优惠" + this.couFaceValue + "元";
      }
    },
    cateEvent: function (item) {
      // 更换分类之后 清空筛选属性信息
      this.showCreated = false;
      this.filterBrands = [];
      this.filterFeatureies = [];

      this.showAllCategory = false;
      this.showCategory = false;
      this.cateText = item.name;
      this.category = item.id;
      this.cateLevel = item.cateLevel;
      this.clsType = item.clsType;
      this.nowPage = 0;
      this._loadProList();
    },
    categoryEvent: function () {
      if (this.pageType != "") {
        this.showCategory = !this.showCategory;
      } else {
        this.showAllCategory = !this.showAllCategory;
      }
    },
    // linkType  1去凑单  2再逛逛 3领赠品 4去换购  5赠品未满足  6换购未满足
    getGiftText: function () {
      if (this.activityInfo.linkType == 3) {
        return "选择赠品";
      } else if (this.activityInfo.linkType == 4) {
        return "选择换购";
      } else if (this.activityInfo.linkType == 5) {
        return "查看赠品";
      } else if (this.activityInfo.linkType == 6) {
        return "查看换购";
      }
    },
    goCart: function () {
      if (this.$route.query.fromCart == 1) {
        this.$router.go(-1);
      } else {
        this.$router.push({
          path: "/mall2/cart",
          query: {
            orderCategory: this.orderCategory,
            vipUnitUserCode: this.vipUnitUserCode,
          },
        });
      }
    },
    goGift: function () {
      let isScan = cartJS.getGiftIsOnlyScan(this.activityInfo);
      let giftType = cartJS.getGiftType(this.activityInfo);

      GiftList.open({
        listData: this.activityInfo.gift,
        activityId: this.activityInfo.mktActivityId,
        sureFunc: this.sureFunc,
        isScan: isScan,
        giftType: giftType,
      });
    },
    sureFunc: function (carts) {
      this.$Loading.open();
      let url = "/app/json/app_cart/addCart";
      let paramsData = {
        token: this.$store.state.login.token,
        carts: carts,
        deliveryType: this.selectedType,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode,
      };
      this.$http.post(url, paramsData).then(
        (res) => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.$store.state.mall2.cartNum = data.data;
            this.$Toast("添加购物车成功！");
            this.deductionCart();
          } else {
            this.$Toast(data.info);
          }
        },
        (error) => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
    backEvent: function () {
      if (this.$route.query.backApp) {
        appNav.navigatorBack({ url: '0' }).then( res => {
          console.log(res)
        })
      } else {
        this.$router.go(-1)
      }
    },
    toSearchEvent: function () {
      Search.open({
        initData: {
          barHeight: this.$store.state.barHeight,
          searchHistory: this.$store.state.mall2.searchHistory,
        },
        clearSearchHistory: () => {
          this.$store.state.mall2.searchHistory = [];
        },
        searchEvent: (searchStr) => {
          this.category = "";
          this.cateLevel = "";
          this.setShowCategory(false);
          this.showNewCategory = this.$store.state.showNewCategory;

          Search.close();
          this.$mallCommon.pushSearchHistory(searchStr);
          this.searchKey = searchStr;
          this.nowPage = 0;
          this._loadProList();
        },
      });
    },
    listStyleEvent: function () {
      if (this.listStyle == 1) {
        this.listStyle = 2;
      } else {
        this.listStyle = 1;
      }
    },
    filtrateCloseEvent: function () {
      this.showFiltrate = false;
    },
    selectedTypeEvent: function (tag) {
      this.$store.state.mall2.staticDeliverType = tag;
      this.$bridgefunc.vuexStorage();
      this.selectedType = tag;
      if (tag == 1 && this.$store.state.mall2.zitiAddress.id == "") {
        this.backRefresh = true;
        this.$router.push({
          path: "/mall2/mypickupaddress",
        });
      } else {
        this.nowPage = 0;
        this._loadProList();
        this._getCartCount();

        // this.deductionCart();
      }
    },
    filterEvent: function (type) {
      this.showCategory = false;
      if (type == 0) {
        // 综合排序
        this.filterType = 0;
      } else if (type == 1) {
        // 销量 点一下降序 点一下取消
        if (this.filterType == 2) {
          this.filterType = 0;
        } else {
          this.filterType = 2;
        }
      } else if (type == 2) {
        // 价格
        if (this.filterType == 3) {
          this.filterType = 4;
        } else {
          this.filterType = 3;
        }
      } else if (type == 3) {
        // 人气
        if (this.filterType == 5) {
          this.filterType = 6;
        } else {
          this.filterType = 5;
        }
      }
      this.nowPage = 0;
      this._loadProList();
    },
    filtrateEvent: function (filtrateData) {
      this.showFiltrate = false;
      this.filterBrands = [];
      this.filterFeatureies = [];
      for (let i = 0; i < filtrateData.featureies.length; i++) {
        // this.filterFeatureies.push(filtrateData.featureies[i].id)
        this.filterFeatureies.push({
          id: filtrateData.featureies[i].id,
          featureType: filtrateData.featureies[i].featureType,
        });
      }
      this.maxPrice = filtrateData.maxPrice;
      this.filterBrands = filtrateData.brandIds;
      this.minPrice = filtrateData.minPrice;
      this.proSkuHasStock = filtrateData.proSkuHasStock;
      this.nowPage = 0;
      this._loadProList();
    },
    superFilter: function () {
      this.showCategory = false;
      this.showFiltrate = true;
      this.showCreated = true;
    },
    // 获取普通商品列表
    _loadProList: function (loaded) {
      console.log(3333333333333333333333);
      if (this.selectedType == "1") {
        InitialLoadPickupAny.checkIsInitialLoad((address) => {
          if (address) {
            this._loadProList();
          }
        });
      }
      this.isCanLoadMore = false;
      this.isNoList = false;
      let page = this.nowPage + 1;
      if (this.nowPage == 0) {
        this.listData = [];
      }
      this.$Loading.open();
      let paramsData = {
        page: page,
        rows: 20,
        orderByKey: "",
        ascOrDesc: "",
        // deliverType: this.selectedType,
        deliverType: "2",
        categoryId: this.category,
        cateLevel: this.cateLevel,
        brandIds: this.filterBrands,
        featureIds: this.filterFeatureies,
        // 券ID，券相关列表的时候使用
        couTypeCode: this.couponId,
        // 活动ID，活动的时候使用
        activityId: this.activityId,
        // 搜索key
        proName: this.searchKey,
        // 分类类型
        clsType: this.clsType,
        // 价格筛选
        maxPrice: this.maxPrice,
        minPrice: this.minPrice,
        proSkuHasStock: this.proSkuHasStock,
        easyCardId: this.$route.query.easyCardId,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode,
      };
      let url = "/app/json/product/getAppProSearchList";
      if (this.componentName == "BeanShop") {
        url = "/app/json/product/getAppProJDExchangeList";
      } else if (this.componentName == "AXJFShop") {
        // pcParentRuleId  6010 金豆兑换（默认） ；6021 爱心积分兑换
        url = "/app/json/product/getAppProJDExchangeList";
        paramsData.pcParentRuleId = "6021";
      }
      if (this.filterType == 1) {
        // 销量 升序
        paramsData.orderByKey = "1";
        paramsData.ascOrDesc = "0";
      } else if (this.filterType == 2) {
        // 销量 降序
        paramsData.orderByKey = "1";
        paramsData.ascOrDesc = "1";
      } else if (this.filterType == 3) {
        // 价格 降序
        paramsData.orderByKey = "0";
        paramsData.ascOrDesc = "0";
      } else if (this.filterType == 4) {
        // 价格 升序
        paramsData.orderByKey = "0";
        paramsData.ascOrDesc = "1";
      } else if (this.filterType == 5) {
        // 人气 降序
        paramsData.orderByKey = "2";
        paramsData.ascOrDesc = "1";
      } else if (this.filterType == 6) {
        // 人气 升序
        paramsData.orderByKey = "2";
        paramsData.ascOrDesc = "0";
      }
      if (this.selectedType == 1) {
        //  自提
        let zitiad = this.$store.state.mall2.zitiAddress;
        paramsData.pickUpId = zitiad.id;
      } else {
        // //  配送
        let sad = this.$store.state.mall2.selectAddress;
        paramsData.area = {
          provinceId: sad.provinceId,
          cityId: sad.cityId,
          countryId: sad.countryId,
          townId: sad.townId,
        };
      }
      if (this.productType && this.productType != "") {
        paramsData.productType = this.productType;
      }

      if (this.categoryIdList != "") {
        paramsData.categoryIdList = this.categoryIdList;
      }

      if (this.selectedChannel.id) {
        paramsData.categoryId = this.selectedChannel.id;
        paramsData.clsType = "4";
      }

      this.$http.post(url, paramsData).then(
        (res) => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            if (this.activityId) {
              this.$actionStatistics.listAction(
                "130020",
                JSON.stringify(paramsData),
                this.activityId
              );
            } else {
              this.$actionStatistics.listAction(
                "130010",
                JSON.stringify(paramsData),
                this.activityId
              );
            }

            if (this.nowPage != 0) {
              this.listData = this.listData.concat(data.data.list);
            } else {
              this.listData = data.data.list;
              if (this.listData.length == 0) {
                let isShow = sessionStorage.getItem("Pickup_YD_Is_Show");
                if (isShow != "1" && this.selectedType == "1") {
                  this.pickuYD = true;
                  sessionStorage.setItem("Pickup_YD_Is_Show", "1");
                } else {
                  this.isNoList = true;
                }
              } else {
                this.deductionSkuId = this.listData[0].skuId;
                this.storeOuCode = this.listData[0].storeOuCode;
                this.deductionCart();
              }
              if (this.pageType != "" && this.cateList.length <= 1) {
                let cList = data.data.cateList;
                this.cateList = [
                  {
                    name: "全部分类",
                    id: "",
                    childList: [
                      {
                        name: "全部分类",
                        id: "",
                      },
                    ],
                  },
                ];
                for (let i = 0; i < cList.length; i++) {
                  let subArr = cList[i].childList;
                  this.cateList = this.cateList.concat(subArr);
                }
              }
            }
            this.nowPage++;
            if (data.data.page.count <= this.listData.length) {
              this.isCanLoadMore = false;
            } else {
              this.isCanLoadMore = true;
            }
          } else {
            this.$Toast(data.info);
          }
          if (loaded) {
            loaded("done");
          }
        },
        (error) => {
          if (loaded) {
            loaded("done");
          }
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
    productEvent: function (product) {
      let path = "/mall2/detail/" + this.$util.getDataString();
      if (product.productType == 2) {
        path = "/mall2/ticketdetail";
      } else if (product.productType == 507) {
        // 生活缴费商品 处理
      }
      // else if (product.productType == 511 || product.productType == 508) {
      //   path = '/movie-ticket-order'
      // }
      this.$router.push({
        path: path,
        query: {
          id: product.id,
          skuId: product.skuId,
          lastPath: this.$route.path,
          // deliveryType: product.deliverType,
          productType: product.productType,
          activityId: product.activityId,
          orderCategory: this.orderCategory,
          vipUnitUserCode: this.vipUnitUserCode,
          easyCardId: this.easyCardId, // 只有易捷卡才需要此参数（为了详情页隐藏部分功能）
          cardNo: this.$route.query.cardNo, // 卡号 (提交订单页面查询易捷卡支付信息使用)
          skuCode: product.skuCode, // 商品编码
          storeOuCode: product.storeOuCode, // 店铺编码
          cardType: this.cardType, // 区分充值卡 计次卡
          cardName: this.$route.query.cardName, // 计次卡名称
        },
      });
    },
    // 获取购物车数量
    _getCartCount: function () {
      if (this.$store.state.login.token == "") {
        return;
      }
      let url = "/app/json/app_cart/getCartCount";
      let paramsData = {
        token: this.$store.state.login.token,
        deliveryType: this.selectedType,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode,
      };
      this.$http.post(url, paramsData).then(
        (res) => {
          let data = res.data;
          if (data.status == 0) {
            this.$store.state.mall2.cartNum = data.data;
          } else {
            this.$Toast(data.info);
          }
        },
        (error) => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
    addToCart: function (item) {
      this.$Loading.open();
      let url = "/app/json/app_cart/addCart";
      let paramsData = {
        token: this.$store.state.login.token,
        carts: [
          {
            skuId: item.skuId,
            storeOuCode: item.storeOuCode,
            activityId: this.activityId,
            selfActivityId: item.activityId,
            deliveryType: this.selectedType,
            number: 1,
          },
        ],
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode,
        deliveryType: item.deliverType,
      };
      this.$http.post(url, paramsData).then(
        (res) => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.$store.state.mall2.cartNum = data.data;

            this.$Toast("添加购物车成功！");
            if (this.pageType == "") {
              // 孙哥牛逼，加入购物车，直接返回了 count
              this.$store.state.mall2.cartNum = data.data;
              // this._getCartCount();
            } else {
              this.deductionCart();
            }
            //记录添加购物车的项
            this.addToCartItem = item;
            this.$nextTick(() => {
              this.showProductImg = true;
            });
          } else {
            this.$Toast(data.info);
          }
        },
        (error) => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
    deductionCart: function () {
      if (this.pageType == "" || this.pageType == "activity_nocart") {
        return;
      }
      this.$Loading.open();
      let url = "/app/json/app_cart/DeductionCart";
      let paramsData = {
        token: this.$store.state.login.token,
        deliveryType: this.selectedType,
        skuId: this.deductionSkuId,
        storeOuCode: this.storeOuCode,
        orderCategory: this.orderCategory,
        vipUnitUserCode: this.vipUnitUserCode,
      };
      if (this.selectedType == 2) {
        paramsData.provinceId = this.$store.state.mall2.selectAddress.provinceId;
        paramsData.cityId = this.$store.state.mall2.selectAddress.cityId;
        paramsData.countryId = this.$store.state.mall2.selectAddress.countryId;
      } else if (this.selectedType == 1) {
        paramsData.pickupId = this.$store.state.mall2.zitiAddress.id;
      }
      if (this.pageType == "coupon") {
        paramsData.couTypeCode = this.couponId;
      } else if (this.pageType == "activity") {
        paramsData.activityId = this.activityId;
      }
      this.$http.post(url, paramsData).then(
        (res) => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.activityInfo = data.data.activity;
            this.cartCanUseCouponAmount = data.data.amount;
            this.nowCouponAmount = data.data.couponAmount;
            //满足满赠或换购条件
            if (
              this.activityInfo.linkType == 3 ||
              this.activityInfo.linkType == 4
            ) {
              if (this.isFirstEnter) {
                this.isFirstEnter = false;
                this.goGift();
              }
            }
            if (
              this.pageType == "activity" ||
              this.pageType == "activity_nocart"
            ) {
              this.tipText = this.activityInfo.mktActivityTitle;
              this.endTime = this.$util.getDateFromString(
                this.activityInfo.endDate
              );
            } else {
              if (this.couponId.indexOf("40") == 0) {
                this.tipText = "以下商品可使用折扣券";
              } else if (this.couThresholdAmount > 0) {
                this.tipText =
                  "以下商品可使用满" +
                  this.couThresholdAmount +
                  "元减" +
                  this.couFaceValue +
                  "元的优惠券";
              } else {
                this.tipText =
                  "以下商品可使用优惠券减" + this.couFaceValue + "元";
              }
            }
          } else {
            this.$Toast(data.info);
          }
        },
        (error) => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
    // getProduct
    selectAddressClick: function () {
      //选择地址

      let path = "";
      if (this.selectedType == 2) {
        if (this.$store.state.globalConfig.app_home_special_flag == "cnooc") {
          this.backRefresh = true;
        }
        path = "/mall2/addresslist";
      } else {
        if (this.$store.state.globalConfig.app_home_special_flag == "cnooc") {
          return;
        }
        path = "/mall2/mypickupaddress";
        this.backRefresh = true;
      }
      if (this.$userCenter.checkLogined({ path: path }, 0) == false) {
        return;
      }
      this.$router.push({
        path: path,
        query: {
          productType: this.productType,
        },
      });
    },
    productImgAfterEnter: function (el) {
      this.showProductImg = false;
      this.showAddCartAn = true;
    },
    beforeEnter(el) {
      el.style.transform = `translate3d(0,0,0)`;
      el.children[0].style.opacity = 0;
    },
    afterEnter(el) {
      let elBottom = el.getBoundingClientRect().bottom;
      let elLeft = el.children[0].getBoundingClientRect().left;
      let gwcLeft = this.$refs.gouwuche.getBoundingClientRect().left;
      let gwcBottom = this.$refs.gouwuche.getBoundingClientRect().top;
      el.style.transform = `translate3d(0,${gwcBottom - elBottom}px,0)`;
      el.style.transition =
        "transform .55s cubic-bezier(0.3, -0.25, 0.7, -0.15)";
      el.children[0].style.transform = `translate3d(${gwcLeft - elLeft}px,0,0)`;
      el.children[0].style.transition = "transform .55s linear";
      el.children[0].style.opacity = 1;
      this.showAddCartAn = false;
      el.addEventListener("transitionend", () => {
        this.addCartBtnAn = true;
        this.$refs.gouwuche.addEventListener("webkitAnimationEnd", () => {
          this.addCartBtnAn = false;
        });
      });
    },
    queryChannelList: function () {
      let url = "/app/json/product/getAppProChannelList";
      let paramsData = {
        channelGroupId: this.channelGroupId,
      };
      this.$Loading.open();
      this.$http.post(url, paramsData).then(
        (res) => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.channels = data.data.list;
            // let channels = data.data.list
            if (this.channels.length > 0) {
              let channel = this.channels[0];
              this.selectedChannel = channel;
              this.nowPage = 0;
              this._loadProList();
            } else {
              this.$Toast("频道组为空！");
            }
          } else {
            this.$Toast(data.info);
          }
        },
        (error) => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
  },
  created() {
    this.domIndex = this.$route.query.domIndex ? this.$route.query.domIndex : 1;
    if (this.$route.query.category) {
      this.category = this.$route.query.category;
      console.log("11111111111111111111111111111111111111", this.category);
    } else {
      this.NoCategory = true;
    }
    this.cateLevel = this.$route.query.cateLevel
      ? this.$route.query.cateLevel
      : 1;
    //小程序不需要类目
    if (
      this.$store.state.webtype !== "3" &&
      this.$store.state.webtype !== "2"
    ) {
      this.isProgram = true;
    } else {
      this.isProgram = false;
    }

    this.showNewCategory = this.$store.state.showCategory;
    if (this.$store.state.globalConfig.delivertype_default == "1") {
      this.deliveryTypes = [
        {
          text: "自提",
          fontclass: "mall-ziti",
          tag: "1",
        },
      ];
    } else if (this.$store.state.globalConfig.delivertype_default == "2") {
      this.deliveryTypes = [
        {
          text: "配送",
          fontclass: "mall-peisong",
          tag: "2",
        },
      ];
    }

    // if (this.$store.state.globalConfig.app_home_special_flag == 'cnooc') {
    //   let dt = this.$market.returnCnoocDeliveryType()
    //   if (dt == '2' || dt == '') {
    //     this.$store.state.mall2.staticDeliverType = 2
    //     this.deliveryTypes = [{
    //       text: '配送',
    //       fontclass: 'mall-peisong',
    //       tag: '2'
    //     }];
    //   } else {
    //     this.deliveryTypes = [{
    //       text: '配送',
    //       fontclass: 'mall-peisong',
    //       tag: '2'
    //     }, {
    //       text: '自提',
    //       fontclass: 'mall-ziti',
    //       tag: '1'
    //     }];
    //   }
    // }

    this.dataType = this.$route.query.dataType || "";
    this.channelGroupId = this.$route.query.channelGroupId || "";
    this.productType = this.$route.query.productType || "";
    if (this.dataType == "filter") {
      this.filterBrands = JSON.parse(this.$route.query.brandIdList) || [];
      if (this.$route.query.deliveryType == 1) {
        this.$store.state.mall2.staticDeliverType = 1;
        this.deliveryTypes = [
          {
            text: "自提",
            fontclass: "mall-ziti",
            tag: "1",
          },
        ];
      } else if (this.$route.query.deliveryType == 2) {
        this.$store.state.mall2.staticDeliverType = 2;
        this.deliveryTypes = [
          {
            text: "配送",
            fontclass: "mall-peisong",
            tag: "2",
          },
        ];
      }
    }

    if (
      this.$store.state.list_guide_show == true &&
      (this.$store.state.webtype == "0" ||
        this.$store.state.webtype == "1" ||
        this.$store.state.webtype == "2" ||
        this.$store.state.webtype == "3")
    ) {
      this.$store.state.list_guide_show = false;
      this.$bridgefunc.vuexStorage();
      this.showGuide = true;
    }
    this.lastPath = this.$route.query.lastPath
      ? this.$route.query.lastPath
      : "";
    this.searchKey = this.$route.query.searchKey
      ? this.$route.query.searchKey
      : "";
    if (this.searchKey == "") {
      this.searchKey = this.$route.query.question
        ? this.$route.query.question
        : "";
    }

    this.pageType = this.$route.query.pageType
      ? this.$route.query.pageType
      : "";
    //活动但不显示购物车
    if (this.$route.params.id == 1002) {
      this.pageType = "activity_nocart";
    }
    this.activityId = this.$route.query.activity
      ? this.$route.query.activity
      : "";
    this.couponId = this.$route.query.coupon ? this.$route.query.coupon : "";
    this.clsType = this.$route.query.clsType ? this.$route.query.clsType : "1";
    this.cateText = this.$route.query.categoryName
      ? this.$route.query.categoryName
      : "全部分类";
    this.couThresholdAmount = this.$route.query.couThresholdAmount
      ? this.$route.query.couThresholdAmount
      : "0";
    this.couFaceValue = this.$route.query.couFaceValue
      ? this.$route.query.couFaceValue
      : "0";
    this.endTime = this.$route.query.endTime ? this.$route.query.endTime : "";
    this.deductionSkuId = this.$route.query.skuId
      ? this.$route.query.skuId
      : "";
    this.storeOuCode = this.$route.query.storeOuCode
      ? this.$route.query.storeOuCode
      : "";

    this.categoryIdList = this.$route.query.categoryIdList
      ? this.$route.query.categoryIdList
      : "";

    this.listZitiId = this.$store.state.mall2.zitiAddress.id;
    //配送方式 传过来了，更具优先级
    this.selectedType = this.$store.state.mall2.staticDeliverType;

    if (this.couponId != "" || this.activityId != "") {
      this.listStyle = 2;
    }
    this.nowPage = 0;
    if (this.dataType == "channel" && this.channelGroupId != "") {
      this.queryChannelList();
      return;
    }
    this._loadProList();
    if (this.deductionSkuId != "") {
      this.deductionCart();
    }
  },
  activated() {
    // 判断配送自提变了界面需要刷新
    if (this.$store.state.mall2.staticDeliverType != this.selectedType) {
      this.selectedType = this.$store.state.mall2.staticDeliverType;
      this.backRefresh = true;
    } else {
      // 如果是自提，需要判断自提点是否发生变化
      if (this.selectedType == 1) {
        if (this.listZitiId != this.$store.state.mall2.zitiAddress.id) {
          this.backRefresh = true;
        }
      }
    }

    if (this.backRefresh) {
      this.backRefresh = false;
      this.selectedTypeEvent(this.selectedType);
    } else {
      this.$refs.listContent.setScrollTopValue(this.scrollTopValue1);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path != this.lastPath) {
      this.scrollTopValue1 = this.$refs.listContent.getScrollTopValue();
    } else {
      this.$keepaliveHelper.deleteCache(this);
    }
    next();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .pickup-yd {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;

    img {
      position: absolute;
      right: 35px;
      top: 90px;
      width: 281px;
    }
  }

  .row {
    padding: 5px 15px;
    display: flex;

    &.axjf-tip {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      margin-bottom: 4px;

      .label {
        flex: 1;
      }

      .value {
        margin-right: 10px;
      }

      i {
        font-size: 12px;
      }
    }

    .type-btn {
      font-size: $font-size-medium;
      padding: 4px 10px;
      border-radius: 15px;
      overflow: hidden;

      // border 0.6px solid transparent;
      &.type-btn:before {
        border-color: transparent;
      }

      .icon-size {
        font-size: $font-size-medium;
      }
    }

    .space {
      flex: 1;
    }

    .local-div {
      max-width: 180px;
      display: flex;
      align-items: center;
      font-size: $font-size-medium-s;

      .icon-size {
        font-size: $font-size-medium;
      }

      span {
        padding: 2px;
      }
    }

    &.row-filter {
      justify-content: space-around;
    }

    &.row-channel {
      display: flex;
      overflow-x: auto;
      justify-content: space-between;
      align-items: center;

      .channel-btn {
        padding: 6px 0px 4px;
        padding-right: 20px;

        .text {
          text-align: center;
          white-space: nowrap;
          padding-bottom: 6px;
          position: relative;

          &.active {
            color: #f80f16;
          }

          &.active::before {
            content: '';
            display: block;
            clear: both;
            background-color: #f80f16;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 2px;
          }
        }
      }
    }

    .filter-btn {
      padding: 7px;
      display: flex;
      align-items: center;
      justify-content: center;

      .cate {
        max-width: 80px;
      }

      .arrows {
        display: inline;
      }

      .arrow-icon {
        margin-top: -4px;
        margin-bottom: -4px;
        display: block;
        font-size: 12px;
      }

      .filter-size {
        font-size: 17px;
      }

      .filter-size-1 {
        font-size: 14px;
        padding: 2px 3px 0px;
      }

      span {
        font-weight: 500;
      }
    }
  }

  .all-content {
    position: relative;
    display: flex;
    position: relative;
    justify-content: space-between;
    flex-direction: column;
    height: 100%;

    .top-showdow {
      margin-top: 3px;
      border-radius: 8px;
      box-shadow: 0px -2px 2px #efefef;
      overflow: hidden;
    }

    .list-content {
      flex: 1;
      background: url('../../../../static/image/mall2/list-bg.png') no-repeat center center / 100% 100%;
      overflow: hidden;
      /* -webkit-overflow-scrolling touch; */
      position: relative;

      .list-tip {
        padding: 4px 12px;

        p {
          display: flex;
          align-items: center;
          padding: 3px 0px;
        }
      }

      .list-pull-to {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding-bottom: 50px;
      }

      .no-list {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;

        .img-div {
          margin-top: 20px;
          text-align: center;

          img {
            width: 160px;
          }
        }

        .tip {
          margin-top: 10px;
          padding: 10px;
          font-size: 12px;
          text-align: center;
        }
      }
    }

    .activity-btns {
      height: 50px;
      border-top: 1px solid #ddd;
      display: flex;
      align-items: center;
      font-size: 14px;

      .subtotal-div {
        flex: 1;
        padding: 5px 8px;

        p {
          padding: 2px;
        }
      }

      .btn {
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        font-weight: 500;
        padding: 0px 15px;
      }

      .price {
        font-size: 14px;
        font-weight: 500;
      }
    }

    .cart-div {
      position: absolute;
      right: 16px;
      bottom: 120px;
      width: 36px;
      height: 36px;
      border-radius: 20px;
      padding: 8px;

      .cart-num {
        position: absolute;
        right: -5px;
        top: -5px;
        border-radius: 12px;
        padding: 2px 4px;
        font-size: 12px;
      }

      i {
        font-size: 20px;
      }

      .wish-icon {
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        left: 0;
        bottom: 0;
      }
    }

    .category-div {
      position: absolute;
      z-index: 10;
      left: 0px;
      right: 0px;
      top: 40px;
      bottom: 0px;
    }
  }

  .guide-div {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.3);

    .guide-img-1 {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 130px;
      margin-left: -55px;
    }

    .guide-img-2 {
      position: absolute;
      top: 0;
      right: 10px;
      margin-top: -8px;
      width: 165px;
    }

    .guide-img-3 {
      position: absolute;
      top: 0;
      left: 0;
      margin-top: -10px;
      width: 165px;
    }
  }

  .productImg {
    position: absolute;
    z-index: 1001;
    left: 147.5px;
    width: 80px;
    height: 80px;
    border-radius: 40px;
    top: 120px;
  }

  .gouwucheani {
    animation: addCart-in 0.75s;
  }

  @keyframes addCart-in {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.8);
    }

    100% {
      transform: scale(1);
    }
  }

  .anProductImg {
    position: absolute;
    z-index: 1001;
    left: 0px;
    width: 100%;
    top: 160px;
    overflow: hidden;
    text-align: center;

    img {
      width: 40px;
      height: 40px;
      border-radius: 20px;
    }
  }
}
</style>

/**Created by liaoyingchao on 2018/10/24.*/

<template>
  <div class="list">
    <nav-top :noTitle="true" @backEvent="backEvent" :bgImg="require('./shop/images/shop_nav_top.png')">
      <div class="search-div theme_bg_white_f5"
           style="left: 50px; right: 50px; height: 30px; top: 7px; padding: 0 15px; border-radius: 15px;"
           @click="toSearchEvent">
        <i class="iconfont mall-sousuo theme_font_tint" style="font-size: 16px;"></i>
        <span class="theme_font_tint"
              style="font-size: 14px;margin-left: 10px;">{{searchKey ? searchKey : '搜你想要的商品'}}</span>
      </div>
    </nav-top>
    <nav-content>
      <div class="all-content" v-if="shopDetail">
        <!--<div class="row" v-if="pageType == ''">-->
        <div class="shop-content" ref="shopContent" id="shopContent">
          <div class="shop-info">
            <img class="shop-img" v-if="shopDetail.imageUrl" :src="shopDetail.imageUrl" alt="">
            <img class="shop-img" v-else="" src="../../../../static/images/defaultImg.png" alt="">
            <div class="info">
              <p class="shop-name">{{shopDetail.storeName}}</p>
              <p class="shop-address">
                <span>{{shopDetail.address}}</span>
                <span>{{shopDetail.openTime}}</span>
              </p>
            </div>
          </div>
          <div class="shop-coupon">
            <ul class="coupon-list">
              <horizontal-scroll>
                <li class="coupon-item" v-for="item in couponModels" @click="getCoupon(item)">
                  <div class="coupon-con" :class="{disabled: item.enabled != 1}">
                    <div class="left ">
                      <div class="price">￥<span class="num">{{item.couFaceValue}}</span></div>
                      <div class="tip">满{{item.couThresholdAmount}}元可用</div>
                    </div>
                    <div class="right">
                      <div class="name">{{item.couTypeTitle}}</div>
                      <div class="btn ">{{item.enabled == 1 ? '点击领取' : '已领取'}}</div>
                    </div>
                  </div>
                </li>
              </horizontal-scroll>
            </ul>
          </div>
        </div>
        <div class="shop-pro-list" ref="shopProList">
          <div class="shop-nav">
            <div class="shop-nav-item" :class="{active: curNav === 0}" @click="curNav = 0"><span class="con">全部商品</span>
            </div>
            <div class="shop-nav-item" :class="{active: curNav === 1}" @click="curNav = 1"><span class="con">店铺促销</span>
            </div>
          </div>
          <div v-show="curNav === 0" class="shop-pro-list-content">
            <div class="row">
              <div class="type-btn line_circle"
                   :class="{theme_light_bg: selectedType == item.tag, theme_standard_bdr_i: selectedType == item.tag}"
                   @click="selectedTypeEvent(item.tag)" v-for="item in deliveryTypes" v-if="item.status == 1">
                <i class="iconfont theme_font_common icon-size"
                   :class="[item.fontclass, {theme_standard_font_i: selectedType == item.tag}]"></i>
                <span class="theme_font_common"
                      :class="{theme_standard_font_i: selectedType == item.tag}">{{item.text}}</span>
              </div>
            </div>
            <div class="row top-showdow" v-if="pageType == ''">
              <div class="filter-btn theme_font_black" @click="filterEvent(0)">
                <span :class="{theme_standard_font: filterType == 0}">综合排序</span>
              </div>
              <div class="filter-btn theme_font_black" @click="filterEvent(1)">
                <span :class="{theme_standard_font: filterType == 1 || filterType == 2}">销量</span>
              </div>
              <div class="filter-btn theme_font_black" @click="filterEvent(2)">
                <span :class="{theme_standard_font: filterType == 3 || filterType == 4}">价格</span>
                <div v-show="filterType == 3 || filterType == 4">
                  <i class="iconfont mall-sanjiaoxiabiao arrow-icon theme_font_tint"
                     :class="{theme_standard_font: filterType == 3}"></i>
                  <i class="iconfont mall-xiala arrow-icon theme_font_tint"
                     :class="{theme_standard_font: filterType == 4}"></i>
                </div>
              </div>
              <div class="filter-btn theme_font_black" @click="superFilter">
                <span>筛选</span>
                <i class="iconfont mall-shaixuan filter-size theme_font_tint"></i>
              </div>
            </div>
            <div class="row top-showdow" v-if="pageType != ''">
              <div class="filter-btn theme_font_black" @click="categoryEvent">
                <span>{{cateText}}</span>
              </div>
              <div class="filter-btn theme_font_black" @click="filterEvent(1)">
                <span :class="{theme_font_red: filterType == 1 || filterType == 2}">销量</span>
                <!--<div v-show="filterType == 1 || filterType == 2">-->
                <!--<i class="iconfont mall-sanjiaoxiabiao arrow-icon theme_font_tint"-->
                <!--:class="{theme_font_red: filterType == 1}"></i>-->
                <!--<i class="iconfont mall-xiala arrow-icon theme_font_tint" :class="{theme_font_red: filterType == 2}"></i>-->
                <!--</div>-->
              </div>
              <div class="filter-btn theme_font_black" @click="filterEvent(2)">
                <span :class="{theme_font_red: filterType == 3 || filterType == 4}">价格</span>
                <div v-show="filterType == 3 || filterType == 4">
                  <i class="iconfont mall-sanjiaoxiabiao arrow-icon theme_font_tint"
                     :class="{theme_font_red: filterType == 3}"></i>
                  <i class="iconfont mall-xiala arrow-icon theme_font_tint"
                     :class="{theme_font_red: filterType == 4}"></i>
                </div>
              </div>
              <div class="filter-btn theme_font_black" @click="superFilter">
                <span>筛选</span>
                <i class="iconfont mall-shaixuan filter-size theme_font_tint"></i>
              </div>
            </div>
            <div class="list-content">
              <div class="list-pull-to">
                <scroll ref="scroll" class="coupon-list" @scroll="scrollHandler" :hasMore="isCanLoadMore"
                        :pullUpLoad="true" :listenScroll="true" @pullingUp="_loadProList" :data="listData"
                        :probeType="2">
                  <div>
                    <div class="list-tip theme_bg_yl theme_font_red" v-if="pageType != '' && endTime != ''">
                      <p>限时促销： {{tipText}}</p>
                      <p>距离结束：
                        <countdown :endTime="endTime"></countdown>
                      </p>
                    </div>
                    <CardList @productEvent="productEvent" @addToCart="addToCart" :listData="listData"
                              v-if="listData.length > 0 && listStyle == 1"></CardList>
                    <DetailList @productEvent="productEvent" @addToCart="addToCart" :listData="listData"
                                v-if="listData.length > 0 && listStyle == 2"></DetailList>
                  </div>
                </scroll>
                <!--<pull-to
                  ref="listContent"
                  :bottomConfig="{pullText: '', triggerText: '释放更新', loadingText: '加载中...', doneText: isCanLoadMore?'加载完成':'没有更多数据了', failText: '加载失败', loadedStayTime: 400, stayDistance: 40, triggerDistance: 50}"
                  :bottom-load-method="_loadProList"
                  :isBottomAutoS="true"
                  :isBottomBounce="isCanLoadMore"
                >
                </pull-to>-->
              </div>
              <div class="no-list" v-if="isNoList && pageType == ''">
                <div class="img-div">
                  <img src="static/image/mall2/no-data-img.png">
                </div>
                <div class="tip theme_font_gray">抱歉没有找到相应商品~</div>
                <Recommend></Recommend>
              </div>
            </div>
            <div class="activity-btns" v-if="pageType != ''">
              <div class="subtotal-div" v-if="pageType == 'activity'">
                <p>
                  <span>小计：</span>
                  <span class="theme_font_red">￥{{$util.toDecimal2(activityInfo.amount)}}</span>
                </p>
                <p class="font-small theme_font_tint">
                  <span>{{activityInfo.activityDiscountDesc}}</span>
                </p>
              </div>
              <div class="subtotal-div" v-if="pageType == 'coupon'">
                <p>
                  <span>小计：</span>
                  <span class="theme_font_red">￥{{$util.toDecimal2(this.cartCanUseCouponAmount)}}</span>
                </p>
                <p class="font-small theme_font_tint">
                  <span>{{getCouponTip()}}</span>
                </p>
              </div>
              <div class="btn theme_bg_y theme_font_white"
                   v-if="activityInfo.linkType == 3 ||  activityInfo.linkType == 4 || activityInfo.linkType == 5 || activityInfo.linkType == 6"
                   @click="goGift">{{getGiftText()}}
              </div>
              <div class="btn theme_bg_red theme_font_white" @click="goCart">去购物车</div>
            </div>
            <!-- <div class="cart-div theme_bg_dark_d" v-if="pageType == ''" @click.stop="goCart">
               <p class="cart-num theme_bg_red theme_font_white" v-if="$store.state.mall2.cartNum > 0">
                 {{$store.state.mall2.cartNum}}</p>
               <i class="iconfont mall-gouwuche theme_font_white"></i>
             </div>-->
            <div class="category-div" v-if="showCategory">
              <Category :cateList="cateList" @closeEvent="showCategory = false" @cateEvent="cateEvent"></Category>
            </div>
          </div>
          <div v-show="curNav === 1" class="shop-pro-list-content">
            <div class="list-content">
              <div class="list-pull-to">
              <scroll ref="scroll" @scroll="scrollHandler" :listenScroll="true" :data="listData" :probeType="2">
                <div class="coupon-group">
                  <div class="coupon-group-item" v-for="item in shopDetailMktPros">
                    <div class="coupon-group-title">
                      <i class="coupon-group-title-tag">{{item.activityTag}}</i>
                      <span class="coupon-group-title-text">{{item.activityTitle}}</span>
                    </div>
                    <div class="coupon-group-pro-list">
                      <CardList @productEvent="productEvent" :isOpen="!!item.isOpen" @addToCart="addToCart"
                                :listData="item.searchModel.list"
                                v-if="item.searchModel.list.length > 0"></CardList>
                    </div>
                    <div class="open-arrow" :class="{active: item.isOpen}" @click="openList(item.activityId)">
                      <i class="iconfont-1 iconfont mall-arrow-down "></i>
                      <i class="iconfont-2 iconfont mall-arrow-down"></i>
                    </div>
                  </div>
                  <div class="no-pro-data">暂无促销活动~</div>
                </div>
              </scroll>
              </div>
            </div>
           </div>
        </div>

      </div>
    </nav-content>
    <Filtrate @filtrateEvent="filtrateEvent" @closeEvent="filtrateCloseEvent" :category="category" v-if="showCreated"
              v-show="showFiltrate"></Filtrate>
  </div>
</template>

<script>
  import CardList from './base/card-list'
  import DetailList from './base/detail-list'
  import Filtrate from './filtrate/index'
  import Search from '../common/search'
  import cartJS from  '../cart/js/cart'
  import GiftList from '../common/giftlist'
  import PullTo from '@/components/Vendor/vue-pull-to/vue-pull-to'
  import Category from './category/index'
  import Countdown from "@/components/Vendor/countdown/countdown";
  import Recommend from './recommend/index'
  import HorizontalScroll from '@/components/base/horizontal-scroll/horizontal-scroll'
  import Scroll from '@/components/base/scroll/scroll'

  const remRatio = 37.5
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
      HorizontalScroll,
      Scroll
    },
    data() {
      return {
        listStyle: 1,
        deliveryTypes: [{
          text: '配送',
          fontclass: 'mall-peisong',
          tag: '2'
        }, {
          text: '自提',
          fontclass: 'mall-ziti',
          tag: '1'
        }],
        selectedType: 2,
        listZitiId: '',
        filterType: 0,
        category: '',
        listData: [],
        showCreated: false,
        showFiltrate: false,
        filterBrands: [],
        filterFeatureies: [],
        pageType: '',
        activityId: '',
        couponId: '',
        subtotal: '0.00',
        searchKey: '',
        scrollTopValue1: 0,
        backRefresh: false,
        activityInfo: {},
        cartJS: cartJS,
        cateLevel: '',
        nowPage: 0,//分页信息
        isCanLoadMore: true,// 是否可以上拉加载更多
        clsType: '1',
        isFirstEnter: true,
        maxPrice: '',
        minPrice: '',
        lastPath: '',
        // 活动页面，相关数据
        cateText: '全部分类',
        showCategory: false,
        cateList: [],
        couFaceValue: '0',
        couThresholdAmount: '0',
        cartCanUseCouponAmount: '0',
        endTime: '',
        tipText: '',
        isNoList: false,
        shopContentHeight: 0, // 店铺信息高度
        shopDetail: null, // 店铺详情
        shopDetailMktPros: [], // 店铺促销活动
        curNav: 0,
        couponModels: [] // 店铺优惠券
      }
    },
    mounted() {

    },
    methods: {
      getCouponTip: function () {
        let amount = this.cartCanUseCouponAmount != '' ? this.cartCanUseCouponAmount : '0'
        if (parseFloat(amount) > parseFloat(this.couThresholdAmount)) {
          return '您已可以使用优惠券，优惠' + this.couFaceValue + '元'
        } else {
          let num = this.$util.toDecimal2(parseFloat(this.couThresholdAmount) - parseFloat(amount))
          return '还差' + num + '元可以优惠' + this.couFaceValue + '元'
        }
      },
      cateEvent: function (item) {
        // 更换分类之后 清空筛选属性信息
        this.showCreated = false
        this.filterBrands = []
        this.filterFeatureies = []

        this.showCategory = false;
        this.cateText = item.name
        this.category = item.id
        this.nowPage = 0;
        this.isCanLoadMore = true
        this._loadProList()
      },
      categoryEvent: function () {
        this.showCategory = !this.showCategory;
      },
      // linkType  1去凑单  2再逛逛 3领赠品 4去换购  5赠品未满足  6换购未满足
      getGiftText: function () {
        if (this.activityInfo.linkType == 3) {
          return '选择赠品'
        } else if (this.activityInfo.linkType == 4) {
          return '选择换购'
        } else if (this.activityInfo.linkType == 5) {
          return '查看赠品'
        } else if (this.activityInfo.linkType == 6) {
          return '查看换购'
        }
      },
      goCart: function () {
        if (this.$route.query.fromCart == 1) {
          this.$router.go(-1);
        } else {
          this.$router.push({
            path: '/mall2/cart'
          })
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
          giftType: giftType
        })
      },
      sureFunc: function (carts) {
        this.$Loading.open();
        let url = '/app/json/app_cart/addCart';
         let paramsData = {
          token: this.$store.state.login.token,
          carts: carts,
          deliveryType: this.selectedType
        };
         this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.mall2.cartNum = data.data;
              this.$Toast("添加购物车成功！")
              this.deductionCart();
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
      backEvent: function () {
        this.$router.go(-1)
      },
      toSearchEvent: function () {
        Search.open({
          initData: {
            barHeight: this.$store.state.barHeight,
            searchHistory: this.$store.state.mall2.searchHistory
          },
          clearSearchHistory: () => {
            this.$store.state.mall2.searchHistory = []
          },
          searchEvent: (searchStr) => {
            Search.close()
            console.log(searchStr)
            this.$mallCommon.pushSearchHistory(searchStr)
            this.searchKey = searchStr
            this.nowPage = 0;
            this.isCanLoadMore = true
            this._loadProList()
          }
        })
      },
      listStyleEvent: function () {
        if (this.listStyle == 1) {
          this.listStyle = 2
        } else {
          this.listStyle = 1
        }
      },
      filtrateCloseEvent: function () {
        this.showFiltrate = false
      },
      selectedTypeEvent: function (tag) {
        this.$store.state.mall2.staticDeliverType = tag
        this.$bridgefunc.vuexStorage()
        this.selectedType = tag;

        this.nowPage = 0;
        this.isCanLoadMore = true
        this._loadProList()
        this._getCartCount()
      },
      filterEvent: function (type) {
        this.showCategory = false
        if (type == 0) {
          // 综合排序
          this.filterType = 0
        } else if (type == 1) {
          // 销量 点一下降序 点一下取消
          if (this.filterType == 2) {
            this.filterType = 1
          } else {
            this.filterType = 2
          }
        } else if (type == 2) {
          // 价格
          if (this.filterType == 3) {
            this.filterType = 4
          } else {
            this.filterType = 3
          }
        }
        this.nowPage = 0;
        this.isCanLoadMore = true
        this._loadProList()
      },
      filtrateEvent: function (filtrateData) {
        this.showFiltrate = false
        this.filterBrands = []
        this.filterFeatureies = []
        for (let i = 0; i < filtrateData.brands.length; i++) {
          this.filterBrands.push(filtrateData.brands[i].id)
        }
        for (let i = 0; i < filtrateData.featureies.length; i++) {
          // this.filterFeatureies.push(filtrateData.featureies[i].id)
          this.filterFeatureies.push({
            id: filtrateData.featureies[i].id,
            featureType: filtrateData.featureies[i].featureType,
          })
        }
        this.maxPrice = filtrateData.maxPrice;
        this.minPrice = filtrateData.minPrice;
        this.nowPage = 0;
        this.isCanLoadMore = true
        this._loadProList()
      },
      superFilter: function () {
        this.showCategory = false
        this.showFiltrate = true;
        this.showCreated = true;
      },
      // 获取普通商品列表
      _loadProList: function (loaded) {
        this.isNoList = false
        if (this.nowPage === 0) {
          this.listData = [];
        }
        this.nowPage++
        this.$Loading.open();
        let url = '/app/json/product/getAppProSearchList';
        let paramsData = {
          token: this.$store.state.login.token,
          page: this.nowPage,
          rows: 20,
          orderByKey: '',
          ascOrDesc: '',
          proName: this.searchKey,
          deliverType: this.selectedType,
          // categoryId: this.category,
          // cateLevel: this.cateLevel,
          // brandIds: this.filterBrands,
          // featureIds: this.filterFeatureies,
          // 券ID，券相关列表的时候使用
          // couTypeCode: this.couponId,
          // 活动ID，活动的时候使用
          // activityId: this.activityId,
          // 搜索key
          // proName: this.searchKey,
          // 分类类型
          // clsType: this.clsType,
          // 价格筛选
          maxPrice: this.maxPrice,
          minPrice: this.minPrice,
          storeOuCode: this.shopDetail.storeCode,
          pickUpStoreOuCode: this.shopDetail.storeCode,
          pickUpId: this.shopDetail.id,
        };
        if (this.filterType == 1) {
          // 销量 升序
          paramsData.orderByKey = '1'
          paramsData.ascOrDesc = '0'
        } else if (this.filterType == 2) {
          // 销量 降序
          paramsData.orderByKey = '1'
          paramsData.ascOrDesc = '1'
        } else if (this.filterType == 3) {
          // 价格 降序
          paramsData.orderByKey = '0'
          paramsData.ascOrDesc = '0'
        } else if (this.filterType == 4) {
          // 价格 升序
          paramsData.orderByKey = '0'
          paramsData.ascOrDesc = '1'
        }
        if (this.selectedType == 1) {
          //  自提
          let zitiad = this.$store.state.mall2.zitiAddress;
          paramsData.pickUpId = zitiad.id
        } else {
          //  配送
            let sad = this.$store.state.mall2.selectAddress;
            paramsData.area = {
              provinceId: sad.provinceId,
              cityId: sad.cityId,
              countryId: sad.countryId,
              countyId: sad.countryId,
              townId: sad.townId
            }
        }
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.listData = this.listData.concat(data.data.list);
              //小于20条的时候  下拉状态提示
              if (this.nowPage >= data.data.page.totalPages) {
                this.isCanLoadMore = false;
              }
            } else {
              this.$Toast(data.info);
            }
            if (loaded) {
              loaded('done');
            }
          },
          error => {
            if (loaded) {
              loaded('done');
            }
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          });
      },
      productEvent: function (product) {
        console.log(product)
        let path = '/mall2/detail/' + this.$util.getDataString()
        if (product.productType == 2) {
          path = '/mall2/ticketdetail';
        }
        this.$router.push({
          path: path,
          query: {
            id: product.id,
            skuId: product.skuId,
            lastPath: this.$route.path,
            // deliveryType: product.deliverType,
            productType: product.productType,
          }
        })
      },
      // 获取购物车数量
      _getCartCount: function () {
        let url = '/app/json/app_cart/getCartCount';
        let paramsData = {
          token: this.$store.state.login.token,
          deliveryType: this.selectedType
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.mall2.cartNum = data.data
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
      addToCart: function (item) {
        this.$Loading.open();
        let url = '/app/json/app_cart/addCart';
        let paramsData = {
          token: this.$store.state.login.token,
          carts: [{
            skuId: item.skuId,
            storeOuCode: item.storeOuCode,
            activityId: this.activityId,
            selfActivityId:item.activityId,
            deliveryType: this.selectedType,
            number: 1,
          }],
          deliveryType: item.deliverType
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.mall2.cartNum = data.data;
              this.$Toast("添加购物车成功！")
              if (this.pageType == '') {
                // 孙哥牛逼，加入购物车，直接返回了 count
                this.$store.state.mall2.cartNum = data.data
                // this._getCartCount();
              } else {
                this.deductionCart();
              }
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
      deductionCart: function () {
        if (this.pageType == '') {
          return
        }
        this.$Loading.open();
        let url = '/app/json/app_cart/DeductionCart';
        let paramsData = {
          token: this.$store.state.login.token,
          deliveryType: this.selectedType,
          skuId: this.$route.query.skuId,
          storeOuCode: this.$route.query.storeOuCode
        };
        if (this.pageType == 'coupon') {
          paramsData.couTypeCode = this.couponId
        } else if (this.pageType == 'activity') {
          paramsData.activityId = this.activityId
        }
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.activityInfo = data.data.activity
              this.cartCanUseCouponAmount = data.data.amount
              //满足满赠或换购条件
              if (this.activityInfo.linkType == 3 || this.activityInfo.linkType == 4) {
                if (this.isFirstEnter) {
                  this.isFirstEnter = false;
                  this.goGift();
                }
              }
              if (this.pageType == 'activity') {
                this.tipText = this.activityInfo.mktActivityTitle
                this.endTime = this.$util.getDateFromString(this.activityInfo.endDate)
              } else {
                if (this.couThresholdAmount > 0) {
                  this.tipText = '以下商品可使用满' + this.couThresholdAmount + '元减' + this.couFaceValue + '元的优惠券'
                } else {
                  this.tipText = '以下商品可使用优惠券减' + this.couFaceValue + '元'
                }
              }
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

      // getProduct
      selectAddressClick: function () {//选择地址
        let path = ''
        if (this.selectedType == 2) {
          path = '/mall2/addresslist';
        } else {
          path = '/mall2/mypickupaddress';
          this.backRefresh = true;
        }
        this.$router.push({
          path: path,
        })
      },
      scrollHandler ({y}) {
        let scrollY = y + this.shopContentHeight
        if (scrollY < 0) {
          scrollY = 0
        } else if (scrollY > this.shopContentHeight) {
          scrollY = this.shopContentHeight
        }
        this.$refs.shopProList.style.top = scrollY + 'px'
        this.$refs.shopContent.style.opacity = scrollY / this.shopContentHeight
      },
      _getStoreDetail(unload) {
        this.$Loading.open();
        // 去掉油品相关的活动 bug：25256
        // let url = '/app/json/app_store/getStoreDetail';
        let url = '/app/json/app_store/getStoreDetailOnLineActivity';
        let paramsData = {
          token: this.$store.state.login.token,
          storeOuCode: this.$route.query.storeOuCode
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            this.$Loading.close();
            if (data.status == 0) {
              this.shopDetail = data.data || {}
              this.shopDetailMktPros = this.shopDetail.mktPros || []
              this.couponModels = this.shopDetail.couponModels || []
              let deliveryType = ''
              this.deliveryTypes.forEach(item => {
                if (item.tag == '2') {
                  item.status = this.shopDetail.deliveryStatus // 是否门店快递配送 1 是 0 否
                } else if (item.tag == '1') {
                  item.status = this.shopDetail.selfliftStatus // 是否门店自提 1 是 0 否
                }
                if (item.status == '1') {
                  deliveryType += item.tag
                }
              })
              if (deliveryType == '1' || deliveryType == '2') {
                this.$store.state.mall2.staticDeliverType = deliveryType
                this.selectedType = this.$store.state.mall2.staticDeliverType;
              }
              setTimeout(() => {
                this.initScrollListen()
              }, 300)
              if (!unload) {
                this._loadProList()
              }
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
      initScrollListen() {
        let el = document.getElementById('shopContent')
        this.shopContentHeight = el ? el.getBoundingClientRect().height : 0
        this.$refs.shopProList.style.top = this.shopContentHeight + 'px'
      },
      openList(id) {
        for (let i = 0; i < this.shopDetail.mktPros.length; i++) {
          if (this.shopDetail.mktPros[i].activityId === id) {
            this.$set(this.shopDetail.mktPros[i], 'isOpen', !this.shopDetail.mktPros[i].isOpen)
          }
        }
        this.$refs.scroll.refresh()
      },
      getCoupon(item) {
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          mktActivityId: item.mktActivityId,
          couTypeCode: item.couTypeCode,
          ruleId: item.ruleId
        }
        this.$http.post('/app/json/app_market/getCouScanUrl', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this._getStoreDetail(true)
            this.$Toast('领取成功')
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close()
        })
      }
    },
    created() {
      this.lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : ''
      this.searchKey = this.$route.query.searchKey ? this.$route.query.searchKey : ''
      this.category = this.$route.query.category ? this.$route.query.category : ''
      this.cateLevel = this.$route.query.cateLevel ? this.$route.query.cateLevel : ''
      this.pageType = this.$route.query.pageType ? this.$route.query.pageType : ''
      this.activityId = this.$route.query.activity ? this.$route.query.activity : ''
      this.couponId = this.$route.query.coupon ? this.$route.query.coupon : ''
      this.clsType = this.$route.query.clsType ? this.$route.query.clsType : '1'
      this.couThresholdAmount = this.$route.query.couThresholdAmount ? this.$route.query.couThresholdAmount : '0'
      this.couFaceValue = this.$route.query.couFaceValue ? this.$route.query.couFaceValue : '0'
      this.endTime = this.$route.query.endTime ? this.$route.query.endTime : ''

      this.listZitiId = this.$store.state.mall2.zitiAddress.id
      //配送方式 传过来了，更具优先级
      this.selectedType = this.$store.state.mall2.staticDeliverType;

      if (this.couponId != '' || this.activityId != '') {
        this.listStyle = 2;
      }
      this.nowPage = 0;
      this._getStoreDetail()
      //      this.deductionCart();
    },
    activated () {
      // 判断配送自提变了界面需要刷新
      if (this.$store.state.mall2.staticDeliverType != this.selectedType) {
        this.selectedType = this.$store.state.mall2.staticDeliverType;
        this.backRefresh = true
      } else {
        // 如果是自提，需要判断自提点是否发生变化
        if (this.selectedType == 1) {
          if (this.listZitiId != this.$store.state.mall2.zitiAddress.id) {
            this.backRefresh = true
          }
        }
      }

      if (this.backRefresh) {
        this.backRefresh = false
        this.selectedTypeEvent(this.selectedType)
      } else {
        this.$refs.scroll && this.$refs.scroll.scrollTo(this.scrollTopValue1);
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.path != this.lastPath) {
        // this.scrollTopValue1 = this.$refs.listContent.getScrollTopValue();
      } else {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"

  .list {
    /deep/ .theme_font_white {
      color: #1a1a1a;
    }
    position relative;
    width 100%
    height 100%
    overflow hidden

    .row {
      padding 7px 15px;
      display flex;

      .type-btn {
        font-size $font-size-medium
        padding 4px 10px;
        // border-radius 15px;
        // border 0.6px solid transparent;

        &.type-btn:before {
          border-color transparent
        }

        .icon-size {
          font-size $font-size-medium
        }
      }

      .space {
        flex 1;
      }

      .local-div {
        max-width 180px;
        display flex;
        align-items center;
        font-size $font-size-medium-s
        .icon-size {
          font-size $font-size-medium
        }
        span {
          padding 2px;
        }
      }

      .filter-btn {
        padding 7px;
        flex 1;
        display flex;
        align-items center;
        justify-content: center;

        .arrows {
          display inline;
        }

        .arrow-icon {
          margin-top -4px;
          margin-bottom -4px;
          display block;
          font-size 12px;
        }
        .filter-size {
          font-size 17px;
        }
        span {
          font-weight 500;
        }
      }
    }
    .shop-pro-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      position absolute
      padding-top: 8px;
      width 100%;
      bottom: 0
      .shop-nav {
        padding 0 10px 15px 10px;
        padding-bottom: 25px;
        display flex
        .shop-nav-item {
          flex 1
          text-align: center
          .con {
            color: #fff;
            font-size: 15px;
            position: relative
          }
          &.active .con:after {
            content: ''
            width 100%
            position: absolute
            bottom: -9px;
            left: 0;
            border-bottom: 2px solid #fff;
          }
        }
      }
    }
    .shop-pro-list-content {
      display: flex;
      flex-direction: column;
      background #fff;
      flex: 1;
      .coupon-group {
        padding 10px;
        .coupon-group-item {
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
          border-radius 4px;
          padding 10px;
          & + .coupon-group-item {
            margin-top: 8px;
          }
          .coupon-group-title {
            .coupon-group-title-tag {
              vertical-align: middle
              padding 3px 4px;
              color: #F80F16
              border: 1px solid #F80F16
              font-style normal
              border-radius 3px;
              font-size: 10px;
            }
            .coupon-group-title-text {
              padding-left: 10px;
            }
          }
          .open-arrow {
            height 30px;
            position: relative
            color: #999;
            margin-top: 10px;
            &.active {
              transform rotateZ(-180deg)
            }
            .iconfont {
              position absolute
              left: 50%;
              transform translateX(-50%)
              top: 20%;
              font-size: 14px;
            }
            .iconfont-2 {
              top: 40%
            }
          }
        }
        .no-pro-data{
          padding 20px;
          text-align: center
          color: #999;
          font-size:14px;
        }
      }
    }
    .all-content {
      position relative;
      display flex;
      justify-content space-between;
      flex-direction column;
      height 100%;
      background: url("./shop/images/shop_nav_bottom.png") no-repeat;
      background-size 100% auto;
      .top-showdow {
        margin-top 3px;
        border-radius 8px;
        box-shadow: 0px -2px 2px #efefef;
        overflow hidden
      }
      .list-content {
        flex 1;
        background: url('../../../../static/image/mall2/list-bg.png') no-repeat center center / 100% 100%;
        overflow hidden;
        /*-webkit-overflow-scrolling touch;*/
        position: relative;

        .list-tip {
          padding 4px 12px;
          p {
            display flex;
            align-items center;
            padding 3px 0px;
          }
        }
        .list-pull-to {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        .no-list {
          position absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow-x hidden;
          overflow-y auto;
          -webkit-overflow-scrolling touch;
          .img-div {
            margin-top 20px;
            text-align center;
            img {
              width 160px;
            }
          }
          .tip {
            margin-top 10px;
            padding 10px;
            font-size 12px;
            text-align center;
          }
        }
      }
      .activity-btns {
        height 50px;
        border-top 1px solid #ddd;
        display flex;
        align-items center;
        font-size 14px;
        .subtotal-div {
          flex 1;
          padding 5px 8px;
          p {
            padding 2px;
          }
        }
        .btn {
          height 50px;
          line-height 50px;
          font-size 18px;
          font-weight 500;
          padding 0px 15px;
        }
        .price {
          font-size 14px;
          font-weight 500;
        }
      }
      .cart-div {
        position absolute;
        right 16px;
        bottom 100px;
        width 36px;
        height 36px;
        border-radius 20px;
        padding 8px;
        .cart-num {
          position absolute;
          right -5px;
          top -5px;
          border-radius 12px;
          padding 2px 4px;
          font-size 12px;
        }
        i {
          font-size 20px;
        }
      }
      .category-div {
        position absolute;
        z-index 10;
        left 0px;
        right 0px;
        top 40px;
        bottom 0px;
      }
    }
    .shop-content {
      width 100%;
      color: #fff;
      padding-bottom: 8px;
      .shop-info {
        padding: 10px;
        display flex
        align-items center
        .shop-img {
          width 54px;
          height 54px;
          flex-shrink 0
          border-radius 50%
        }
        .info {
          padding-left: 15px;
          .shop-name {
            font-size: 15px;
          }
          .shop-address {
            padding-top: 10px;
            font-size: 12px;
          }
        }
      }
      .shop-coupon {
        padding-right: 10px;
        padding-top: 5px;
        .coupon-list {
          overflow: hidden
          white-space nowrap
          .coupon-item {
            padding-left: 10px;
            float: left
            .coupon-con {
              border-radius 5px;
              overflow: hidden
              height 60px
              display flex
              align-items center

              .left {
                background: linear-gradient(145deg, #5c9de1, #687add)
                text-align: center
                padding 8px 15px 0 15px;
                height 100%

                .price {
                  .num {
                    font-size: 30px;
                  }
                }
                .tip {
                  font-size: 10px;
                  padding-top: 6px;
                }
              }
              .right {
                text-align: center
                padding 8px 10px 0 10px;
                height 100%
                background: #fff;
                .name {
                  padding-top: 5px;
                  padding-bottom: 9px;
                  color: #687add
                }
                .btn {
                  display inline-block
                  padding: 4px 6px;
                  border-radius 8px;
                  color: #fff;
                  font-size: 10px;
                  background: linear-gradient(145deg, #5c9de1, #687add)
                }
              }
              &.disabled {
                .left {
                  background: #999
                }
                .right {
                  .name{
                    color:  #999
                  }
                  .btn {
                    background: #999
                  }
                }
              }
            }
          }
        }
      }

    }
  }
</style>

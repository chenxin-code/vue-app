/**Created by liaoyingchao on 2018/10/24.*/

<template>
  <div class="list">
    <div class="pickup-yd" v-if="pickuYD" @click.stop="pickuYD = false">
      <img src="static/image/mall2/pickup-yd.png">
    </div>
    <nav-top :noTitle="true" @backEvent="backEvent">
      <div class="search-div theme_bg_white_f5"
           style="left: 50px; right: 50px; height: 30px; top: 7px; padding: 0 15px; border-radius: 15px;"
           @click="toSearchEvent">
        <i class="iconfont mall-sousuo theme_font_tint" style="font-size: 16px;"></i>
        <span class="theme_font_tint single-line"
              style="font-size: 14px;margin-left: 10px;">{{searchKey ? searchKey : '搜你想要的商品'}}</span>
      </div>
      <div class="right-btn" style="right: 0px; height: 44px; top: 0px; padding-right: 10px;" @click="listStyleEvent"
           v-if="pageType == ''">
        <i class="iconfont mall-datubiao theme_font_common" style="font-size: 24px;" v-if="listStyle == 1"></i>
        <i class="iconfont mall-qiehuan theme_font_common" style="font-size: 24px;" v-if="listStyle == 2"></i>
      </div>
    </nav-top>
    <nav-content>
      <div class="all-content">
        <div class="row">
          <div class="local-div" @click="selectAddressClick()">
            <i class="iconfont mall-dingwei icon-size theme_font_gray"></i>
            <span class="theme_font_gray single-line" v-if="selectedType == 2">{{$store.state.mall2.selectAddress.addressFull}}</span>
            <span class="theme_font_gray single-line" v-if="selectedType == 1">{{$store.state.mall2.zitiAddress.storeName}}</span>
          </div>
        </div>
        <div class="row row-filter top-showdow">
          <div class="filter-btn theme_font_black" @click="categoryEvent">
            <i class="iconfont mall-datubiao filter-size-1 theme_font_black"></i>
            <span>{{cateText}}</span>
          </div>
          <div class="filter-btn theme_font_black" @click="filterEvent(0)">
            <span :class="{theme_standard_font_i: filterType == 0}">综合排序</span>
          </div>
          <div class="filter-btn theme_font_black" @click="filterEvent(1)">
            <span :class="{theme_standard_font_i: filterType == 1 || filterType == 2}">销量</span>
          </div>
          <div class="filter-btn theme_font_black" @click="filterEvent(2)">
            <span :class="{theme_standard_font_i: filterType == 3 || filterType == 4}">价格</span>
            <div v-show="filterType == 3 || filterType == 4">
              <i class="iconfont mall-sanjiaoxiabiao arrow-icon theme_font_tint"
                 :class="{theme_standard_font_i: filterType == 3}"></i>
              <i class="iconfont mall-xiala arrow-icon theme_font_tint"
                 :class="{theme_standard_font_i: filterType == 4}"></i>
            </div>
          </div>
          <div class="filter-btn theme_font_black" @click="superFilter">
            <span>筛选</span>
            <i class="iconfont mall-shaixuan filter-size theme_font_tint"></i>
          </div>
        </div>
        <div class="list-content">
          <div class="list-pull-to">
            <pull-to ref="listContent" :bottomConfig="{pullText: '', triggerText: '释放更新', loadingText: '加载中...', doneText: isCanLoadMore?'加载完成':'没有更多数据了', failText: '加载失败', loadedStayTime: 400, stayDistance: 40, triggerDistance: 50}"
              :bottom-load-method="_loadProList" :isBottomAutoS="true" :isBottomBounce="isCanLoadMore" >
              <div>
                <CardList @productEvent='productEvent' @addToCart='addToCart' :listData="listData" v-if="listData.length > 0 && listStyle == 1"></CardList>
                <DetailList @productEvent='productEvent' :listData="listData" v-if="listData.length > 0 && listStyle == 2" :rowStyle='1'></DetailList>
              </div>
            </pull-to>
          </div>
          <div class="no-list" v-if="!listData.length">
            <div class="img-div">
              <img src="static/image/mall2/no-data-img.png">
            </div>
            <div class="tip theme_font_gray">抱歉没有找到相应商品~</div>
          </div>
        </div>
        <div class="activity-btns">
          <div class="btn theme_font_white theme_bg_y" @click="toRecommendation(0)">推荐商品 ({{recommendationSku.skuList.length}})</div>
          <div class="btn theme_bg_red theme_font_white" @click="toRecommendation(1)">确定</div>
        </div>
      </div>
    </nav-content>
    <Filtrate @filtrateEvent="filtrateEvent" @closeEvent="filtrateCloseEvent" :category="category" v-if="showCreated" v-show="showFiltrate"></Filtrate>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapMutations } from "vuex";
  import CardList from './base/card-list'
  import DetailList from './base/detail-list'
  import Filtrate from '@/components/mall2/list/filtrate/index.vue'
  import Search from '@/components/mall2/common/search'
  import PullTo from '@/components/Vendor/vue-pull-to/vue-pull-to'
  import InitialLoadPickupAny from '@/utils/initialLoadPickupAny.js'

  export default {
    name: "list",
    components: {
      CardList,
      DetailList,
      Filtrate,
      PullTo
    },
    data() {
      return {
        skuAddArr: [],
        deductionSkuId: '',
        listStyle: 1,
        pickuYD: false,
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
        cartJS: '',
        cateLevel: '',
        nowPage: 1,//分页信息
        isCanLoadMore: false,// 是否可以上拉加载更多
        clsType: '1',
        isFirstEnter: true,
        maxPrice: '',
        minPrice: '',
        proSkuHasStock: '',
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
        storeOuCode: '',
        showGuide: false,
        showAllCategory: false,
        productType: '',
        categoryIdList: '', //多分类
        channels: [],
        selectedChannel: {},
      }
    },
    computed: {
      ...mapState(["recommendationSku"])
    },
    mounted() {
      // this.easyCardId = this.$route.query.easyCardId
      // this.cardType = this.$route.query.cardType
    },
    methods: {
      ...mapMutations(['setRecommendationSku']),
      channelEvent: function (channel) {
        this.selectedChannel = channel
        this.nowPage = 0;
        this._loadProList()
      },
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

        this.showAllCategory = false;
        this.showCategory = false;
        this.cateText = item.name
        this.category = item.id
        this.cateLevel = item.cateLevel
        this.clsType = item.clsType
        this.nowPage = 0;
        this._loadProList()
      },
      categoryEvent: function () {
        if (this.pageType != '') {
          this.showCategory = !this.showCategory;
        } else {
          this.showAllCategory = !this.showAllCategory;
        }
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
            path: '/mall2/cart',
            query: {
              orderCategory: this.orderCategory,
              vipUnitUserCode: this.vipUnitUserCode
            }
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
          deliveryType: this.selectedType,
          orderCategory: this.orderCategory,
          vipUnitUserCode: this.vipUnitUserCode
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
        // let num = this.$router.customRouterData.routerPaths.length -1
        // this.$router.go(-num);
         this.$router.go(-1);
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
        if (tag == 1 && (this.$store.state.mall2.zitiAddress.id == '')) {
          this.backRefresh = true
          this.$router.push({
            path: '/mall2/mypickupaddress'
          })
        } else {
          this.nowPage = 0;
          this._loadProList()
          this._getCartCount()

          // this.deductionCart();
        }
      },
      filterEvent: function (type) {
        this.showCategory = false
        if (type == 0) {
          // 综合排序
          this.filterType = 0
        } else if (type == 1) {
          // 销量 点一下降序 点一下取消
          if (this.filterType == 2) {
            this.filterType = 0
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
        this.proSkuHasStock = filtrateData.proSkuHasStock;
        this.nowPage = 0;
        this._loadProList()
      },
      superFilter: function () {
        this.showCategory = false
        this.showFiltrate = true;
        this.showCreated = true;
      },
      // 获取普通商品列表
      _loadProList: function (loaded) {
        // console.log(111, this.cateList)
        if (this.selectedType == '1') {
          InitialLoadPickupAny.checkIsInitialLoad((address) => {
            if (address) {
              this._loadProList()
            }
          });
        }
        this.isCanLoadMore = false;
        this.isNoList = false
        let page = this.nowPage + 1;
        if (this.nowPage == 0) {
          this.listData = [];
        }
        this.$Loading.open();
        let url = '/app/json/product/getAppProSearchList';
        if (this.componentName == 'BeanShop') {
          url = '/app/json/product/getAppProJDExchangeList';
        }
        let paramsData = {
          token: this.$store.state.login.token,
          page: page,
          rows: '',
          orderByKey: '',
          ascOrDesc: '',
          deliverType: this.selectedType,
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
          vipUnitUserCode: this.vipUnitUserCode
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
          // //  配送
          let sad = this.$store.state.mall2.selectAddress;
          paramsData.area = {
            provinceId: sad.provinceId,
            cityId: sad.cityId,
            countryId: sad.countryId,
            townId: sad.townId
          }
        }
        if (this.productType && this.productType != '') {
          paramsData.productType = this.productType
        }

        if (this.categoryIdList != '') {
          paramsData.categoryIdList = this.categoryIdList
        }

        if (this.selectedChannel.id) {
          paramsData.categoryId = this.selectedChannel.id
          paramsData.clsType = '4'
        }

        this.$http.post(url, paramsData).then(res => {
            console.log(222, this.cateList)
            this.$Loading.close();
            let data = res.data;
            console.log(333, data)
            if (data.status == 0) {
              if (this.activityId) {
                this.$actionStatistics.listAction('130020', JSON.stringify(paramsData), this.activityId)
              } else {
                this.$actionStatistics.listAction('130010', JSON.stringify(paramsData), this.activityId)
              }

              if (this.nowPage != 0) {
                this.listData = this.listData.concat(data.data.list);
              } else {
                this.listData = data.data.list;
                this.setHidden()
                if (this.listData.length == 0) {
                  let isShow = sessionStorage.getItem('Pickup_YD_Is_Show')
                  if (isShow != '1' && this.selectedType == '1') {
                    this.pickuYD = true
                    sessionStorage.setItem('Pickup_YD_Is_Show', '1')
                  } else {
                    this.isNoList = true
                  }
                } else {
                  this.deductionSkuId = this.listData[0].skuId
                  this.storeOuCode = this.listData[0].storeOuCode
                  this.deductionCart()
                }
                if (this.pageType != '' && this.cateList.length <= 1) {
                  let cList = data.data.cateList
                  this.cateList = [{
                    'name': '全部分类',
                    'id': '',
                    'childList': [{
                      'name': '全部分类',
                      'id': ''
                    }]
                  }]
                  for (let i = 0; i < cList.length; i++) {
                    let subArr = cList[i].childList
                    this.cateList = this.cateList.concat(subArr);
                    // console.log(333, this.cateList)
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
            easyCardId: true, // 只有易捷卡才需要此参数（为了详情页隐藏部分功能）
            recommendCommodity: true, // 只有推荐购物才需要此参数（为了详情页隐藏部分功能）
            cardNo: this.$route.query.cardNo, // 卡号 (提交订单页面查询易捷卡支付信息使用)
            skuCode: product.skuCode, // 商品编码
            storeOuCode: product.storeOuCode, // 店铺编码
            cardType: this.cardType, // 区分充值卡 计次卡
            cardName: this.$route.query.cardName // 计次卡名称
          }
        })
      },
      // 获取购物车数量
      _getCartCount: function () {
        if (this.$store.state.login.token == '') {
          return;
        }
        let url = '/app/json/app_cart/getCartCount';
        let paramsData = {
          token: this.$store.state.login.token,
          deliveryType: this.selectedType,
          orderCategory: this.orderCategory,
          vipUnitUserCode: this.vipUnitUserCode
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
            selfActivityId: item.activityId,
            deliveryType: this.selectedType,
            number: 1,
          }],
          orderCategory: this.orderCategory,
          vipUnitUserCode: this.vipUnitUserCode,
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
              //记录添加购物车的项
              this.addToCartItem = item;
              this.$nextTick(() => {
                this.showProductImg = true;
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
      deductionCart: function () {
        if (this.pageType == '' || this.pageType == 'activity_nocart') {
          return
        }
        this.$Loading.open();
        let url = '/app/json/app_cart/DeductionCart';
        let paramsData = {
          token: this.$store.state.login.token,
          deliveryType: this.selectedType,
          skuId: this.deductionSkuId,
          storeOuCode: this.storeOuCode,
          orderCategory: this.orderCategory,
          vipUnitUserCode: this.vipUnitUserCode
        };
        if (this.selectedType == 2) {
          paramsData.provinceId = this.$store.state.mall2.selectAddress.provinceId
          paramsData.cityId = this.$store.state.mall2.selectAddress.cityId
          paramsData.countryId = this.$store.state.mall2.selectAddress.countryId
        } else if (this.selectedType == 1) {
          paramsData.pickupId = this.$store.state.mall2.zitiAddress.id
        }
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
              if (this.pageType == 'activity' || this.pageType == 'activity_nocart') {
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
        if (this.$userCenter.checkLogined({path: path}, 0) == false) {
          return;
        }
        this.$router.push({
          path: path,
          query: {
            productType: this.productType
          }
        })
      },
      productImgAfterEnter: function (el) {
        this.showProductImg = false
        this.showAddCartAn = true
      },
      beforeEnter(el) {
        el.style.transform = `translate3d(0,0,0)`;
        el.children[0].style.opacity = 0;
      },
      afterEnter(el) {
        let elBottom = el.getBoundingClientRect().bottom;
        let elLeft = el.children[0].getBoundingClientRect().left
        let gwcLeft = this.$refs.gouwuche.getBoundingClientRect().left;
        let gwcBottom = this.$refs.gouwuche.getBoundingClientRect().top;
        el.style.transform = `translate3d(0,${gwcBottom - elBottom}px,0)`;
        el.style.transition = 'transform .55s cubic-bezier(0.3, -0.25, 0.7, -0.15)';
        el.children[0].style.transform = `translate3d(${gwcLeft - elLeft}px,0,0)`;
        el.children[0].style.transition = 'transform .55s linear';
        el.children[0].style.opacity = 1;
        this.showAddCartAn = false
        el.addEventListener('transitionend', () => {
          this.addCartBtnAn = true;
          this.$refs.gouwuche.addEventListener('webkitAnimationEnd', () => {
            this.addCartBtnAn = false;
          })
        })
      },
      queryChannelList: function () {
        let url = '/app/json/product/getAppProChannelList';
        let paramsData = {
          channelGroupId: this.channelGroupId,
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.channels = data.data.list
              // let channels = data.data.list
              if (this.channels.length > 0) {
                let channel = this.channels[0]
                this.selectedChannel = channel;
                this.nowPage = 0;
                this._loadProList()
              } else {
                this.$Toast('频道组为空！')
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
      addToCart(item) {
        if(Object.keys(item).length != 0){
          let skuAddArr = this.recommendationSku.skuList
          skuAddArr.push(item)
          this.setRecommendationSku({skuList: skuAddArr})
          this.$set(item, "hidden", '1')
        }
      },
      toRecommendation(status) {
        if (this.recommendationSku.skuList.length) {
          this.$router.push({ path: '/recommend-commodity/newRecommendation',query: {status: status}})
        } else {
          this.$Toast('请选择推荐商品');
        }
      },
      setHidden() {
        this.listData.forEach(res=>{
          this.$set(res, "hidden", '')
        })
        this.recommendationSku.skuList.forEach(item=>{
          this.listData.forEach(res=>{
            if (item.skuId == res.skuId) {
              this.$set(res, "hidden", '1')
            }
          })
        })
      }
    },
    created() {
      if (this.$store.state.list_guide_show == true) {
        this.$store.state.list_guide_show = false
        this.$bridgefunc.vuexStorage()
        this.showGuide = true
      }
      this.lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : ''
      this.searchKey = this.$route.query.searchKey ? this.$route.query.searchKey : ''
      this.category = this.$route.query.category ? this.$route.query.category : ''
      this.cateLevel = this.$route.query.cateLevel ? this.$route.query.cateLevel : ''
      this.pageType = this.$route.query.pageType ? this.$route.query.pageType : ''

      this.activityId = this.$route.query.activity ? this.$route.query.activity : ''
      this.couponId = this.$route.query.coupon ? this.$route.query.coupon : ''
      this.clsType = this.$route.query.clsType ? this.$route.query.clsType : '1'
      this.cateText = this.$route.query.categoryName ? this.$route.query.categoryName : '全部分类'
      this.couThresholdAmount = this.$route.query.couThresholdAmount ? this.$route.query.couThresholdAmount : '0'
      this.couFaceValue = this.$route.query.couFaceValue ? this.$route.query.couFaceValue : '0'
      this.endTime = this.$route.query.endTime ? this.$route.query.endTime : ''
      this.deductionSkuId = this.$route.query.skuId ? this.$route.query.skuId : ''
      this.storeOuCode = this.$route.query.storeOuCode ? this.$route.query.storeOuCode : ''

      this.categoryIdList = this.$route.query.categoryIdList ? this.$route.query.categoryIdList : ''

      this.listZitiId = this.$store.state.mall2.zitiAddress.id
      //配送方式 传过来了，更具优先级
      this.selectedType = this.$store.state.mall2.staticDeliverType;

      if (this.couponId != '' || this.activityId != '') {
        this.listStyle = 2;
      }
      this.nowPage = 0;
      this._loadProList()
    },
    activated() {
      // console.log(this.listData,this.recommendationSku.skuList)
      // this.$refs.listContent.setScrollTopValue(this.scrollTopValue1);
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
        this.$refs.listContent.setScrollTopValue(this.scrollTopValue1);
      }
      // this.setHidden()
    },
    beforeRouteLeave(to, from, next) {
      if (to.path != this.lastPath) {
        this.scrollTopValue1 = this.$refs.listContent.getScrollTopValue();
      } else {
        this.$keepaliveHelper.deleteCache(this)
      }
      if(to.name == '商品分类') {
        this.setRecommendationSku({skuList: []})
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
    position relative;
    width 100%
    height 100%
    overflow hidden

    .pickup-yd {
      position absolute;
      left 0;
      right 0;
      top 0;
      bottom 0;
      background-color rgba(0, 0, 0, 0.5)
      z-index 9999;

      img {
        position absolute;
        right 35px;
        top 90px;
        width 281px;
      }
    }

    .row {
      padding 5px 15px;
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

      &.row-filter {
        justify-content: space-around;
      }

      &.row-channel {
        display: flex;
        overflow-x: auto;
        justify-content: space-between;
        align-items center;

        .channel-btn {
          padding 6px 0px 4px;
          padding-right 20px;

          .text {
            text-align: center;
            white-space: nowrap;
            padding-bottom 6px
            position relative;

            &.active {
              color #f80f16;
            }

            &.active::before {
              content: "";
              display: block;
              clear: both;
              background-color #f80f16;
              position: absolute;
              left: 0;
              right 0;
              bottom: 0;
              height 2px;
            }
          }
        }
      }

      .filter-btn {
        padding 7px;
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

        .filter-size-1 {
          font-size 14px;
          padding 2px 3px 0px;
        }

        span {
          font-weight 500;
        }
      }
    }

    .all-content {
      position relative;
      display flex;
      position relative
      justify-content space-between;
      flex-direction column;
      height 100%;

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
        display flex;
        align-items center;

        .btn {
          flex 1
          height 100%
          line-height 50px;
          font-size 18px;
          font-weight 500;
          text-align center
        }
      }
    }

  }

</style>

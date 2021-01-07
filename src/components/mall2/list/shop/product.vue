/**Created by liaoyingchao on 2018/10/24.*/

<template>
  <div>
    <div class="row">
      <div class="type-btn"
           :class="{theme_bg_ml_red: selectedType == item.tag, theme_border_red_i: selectedType == item.tag}"
           @click="selectedTypeEvent(item.tag)" v-for="item in deliveryTypes">
        <i class="iconfont theme_font_common icon-size"
           :class="[item.fontclass, {theme_font_red_i: selectedType == item.tag}]"></i>
        <span class="theme_font_common" :class="{theme_font_red_i: selectedType == item.tag}">{{item.text}}</span>
      </div>
    </div>
    <div class="row top-showdow" v-if="pageType == ''">
      <div class="filter-btn theme_font_black" @click="filterEvent(0)">
        <span :class="{theme_font_red: filterType == 0}">综合排序</span>
      </div>
      <div class="filter-btn theme_font_black" @click="filterEvent(1)">
        <span :class="{theme_font_red: filterType == 1 || filterType == 2}">销量</span>
      </div>
      <div class="filter-btn theme_font_black" @click="filterEvent(2)">
        <span :class="{theme_font_red: filterType == 3 || filterType == 4}">价格</span>
        <div v-show="filterType == 3 || filterType == 4">
          <i class="iconfont mall-sanjiaoxiabiao arrow-icon theme_font_tint"
             :class="{theme_font_red: filterType == 3}"></i>
          <i class="iconfont mall-xiala arrow-icon theme_font_tint" :class="{theme_font_red: filterType == 4}"></i>
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
          <i class="iconfont mall-xiala arrow-icon theme_font_tint" :class="{theme_font_red: filterType == 4}"></i>
        </div>
      </div>
      <div class="filter-btn theme_font_black" @click="superFilter">
        <span>筛选</span>
        <i class="iconfont mall-shaixuan filter-size theme_font_tint"></i>
      </div>
    </div>
    <div class="list-content">
      <div class="list-pull-to">
        <pull-to
          ref="listContent"
          :bottomConfig="{pullText: '', triggerText: '释放更新', loadingText: '加载中...', doneText: isCanLoadMore?'加载完成':'没有更多数据了', failText: '加载失败', loadedStayTime: 400, stayDistance: 40, triggerDistance: 50}"
          :bottom-load-method="_loadProList"
          :isBottomAutoS="true"
          :isBottomBounce="isCanLoadMore"
        >
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
        </pull-to>
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
    <div class="cart-div theme_bg_dark_d" v-if="pageType == ''" @click.stop="goCart">
      <p class="cart-num theme_bg_red theme_font_white" v-if="$store.state.mall2.cartNum > 0">
        {{$store.state.mall2.cartNum}}</p>
      <i class="iconfont mall-gouwuche theme_font_white"></i>
    </div>
    <div class="category-div" v-if="showCategory">
      <Category :cateList="cateList" @closeEvent="showCategory = false" @cateEvent="cateEvent"></Category>
    </div>
    <Filtrate @filtrateEvent="filtrateEvent" @closeEvent="filtrateCloseEvent" :category="category" v-if="showCreated"
              v-show="showFiltrate"></Filtrate>
  </div>
</template>

<script>
  import CardList from '../../list/base/card-list'
  import DetailList from '../../list/base/detail-list'
  import Filtrate from '../../list/filtrate/index'
  import Search from '../../common/search'
  import cartJS from  '../../cart/js/cart'
  import GiftList from '../../common/giftlist'
  import PullTo from '@/components/Vendor/vue-pull-to/vue-pull-to'
  import Category from '../../list/category/index'
  import Countdown from "@/components/Vendor/countdown/countdown"
  import Recommend from '../../list/recommend/index'

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
      Recommend
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
        activityInfo:{},
        cartJS: cartJS,
        cateLevel: '',
        nowPage:1,//分页信息
        isCanLoadMore:false,// 是否可以上拉加载更多
        clsType: '1',
        isFirstEnter:true,
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
        isNoList: false
      }
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
        this._loadProList()
      },
      categoryEvent: function () {
        this.showCategory = !this.showCategory;
      },
      // linkType  1去凑单  2再逛逛 3领赠品 4去换购  5赠品未满足  6换购未满足
      getGiftText:function(){
        if(this.activityInfo.linkType == 3){
          return '选择赠品'
        }else  if(this.activityInfo.linkType == 4){
          return '选择换购'
        }else  if(this.activityInfo.linkType == 5){
          return '查看赠品'
        }else  if(this.activityInfo.linkType == 6){
          return '查看换购'
        }
      },
      goCart:function(){
        if(this.$route.query.fromCart == 1){
          this.$router.go(-1);
        }else {
          this.$router.push({
            path: '/mall2/cart'
          })
        }
      },
      goGift:function(){
        let isScan =  cartJS.getGiftIsOnlyScan(this.activityInfo);
        let giftType = cartJS.getGiftType(this.activityInfo);

        GiftList.open({
          listData: this.activityInfo.gift,
          activityId:this.activityInfo.mktActivityId,
          sureFunc: this.sureFunc,
          isScan:isScan,
          giftType:giftType
        })
      },
      sureFunc:function(carts){
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
          this.filterFeatureies.push(filtrateData.featureies[i].id)
        }
        this.maxPrice = filtrateData.maxPrice;
        this.minPrice = filtrateData.minPrice;
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
        this.isNoList = false
        let page = this.nowPage + 1;
        if (this.nowPage == 0) {
          this.listData = [];
        }
        this.$Loading.open();
        let url = '/app/json/product/getAppProSearchList';
        let paramsData = {
          token: this.$store.state.login.token,
          page: page,
          rows: 20,
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
          minPrice: this.minPrice
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
          //   let sad = this.$store.state.mall2.selectAddress;
          //   paramsData.area = {
          //     provinceId: sad.provinceId,
          //     cityId: sad.cityId,
          //     countryId: sad.countryId,
          //     townId: sad.townId
          //   }
        }
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              if(this.nowPage != 0){
                this.listData = this.listData.concat(data.data.list);
              } else {
                this.listData = data.data.list;
                if (this.listData.length == 0) {
                  this.isNoList = true
                }
                if (this.pageType != '') {
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
                  }
                }
              }
              this.nowPage ++;
              //小于20条的时候  下拉状态提示
              if(data.data.list.length < 20){
                this.isCanLoadMore = false;
              }else {
                this.isCanLoadMore = true;
              }
            } else {
              this.$Toast(data.info);
            }
            if(loaded){
              loaded('done');
            }
          },
          error => {
            if(loaded){
              loaded('done');
            }
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          });
      },
      productEvent: function (product) {
        console.log(product)
        let path = '/mall2/detail/' + this.$util.getDataString()
        if (product.productType == 2){
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
            activityId:this.activityId,
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
      deductionCart:function(){
        if(this.pageType == '') {
          return
        }
        this.$Loading.open();
        let url = '/app/json/app_cart/DeductionCart';
        let paramsData = {
          token: this.$store.state.login.token,
          deliveryType: this.selectedType,
          skuId:this.$route.query.skuId,
          storeOuCode:this.$route.query.storeOuCode
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
              if(this.activityInfo.linkType == 3 || this.activityInfo.linkType == 4){
                if(this.isFirstEnter){
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
      selectAddressClick:function () {//选择地址
        let path = ''
        if(this.selectedType == 2){
          path = '/mall2/addresslist';
        }else{
          path = '/mall2/mypickupaddress';
          this.backRefresh = true;
        }
        this.$router.push({
          path: path,
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
      this._loadProList()
      this.deductionCart();
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
        this.$refs.listContent.setScrollTopValue(this.scrollTopValue1);
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.path != this.lastPath) {
        this.scrollTopValue1 = this.$refs.listContent.getScrollTopValue();
      } else {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
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

    .row {
      padding 5px 15px;
      display flex;

      .type-btn {
        font-size $font-size-medium
        padding 4px 10px;
        border-radius 15px;
        border 0.5px solid transparent;

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
        background: url('../../../../../static/image/mall2/list-bg.png') no-repeat center center / 100% 100%;
        overflow hidden;
        -webkit-overflow-scrolling touch;
        position: relative;
        .list-tip {
          padding 4px 12px;
          p {
            display flex;
            align-items center;
            padding 3px 0px;
          }
        }
        .list-pull-to{
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        .no-list {
          position relative;
          z-index 9;
          width 100%;
          height 100%;
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
  }
</style>

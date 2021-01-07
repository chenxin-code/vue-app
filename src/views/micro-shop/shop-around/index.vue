<template>
  <div class="list">
      <div class="all-content" ref="allContent" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" :infinite-scroll-immediate-check="true" infinite-scroll-distance="100">
        <!-- 背景 -->
        <div class="shop-background"
            id='shop-background'
            v-if='$store.state.webtype != 2'
            :style="'background-image: url('+`${objData.backgroundImgUrl || 'static/image/microShop/up.png'}`+'); height: 190px;'">
          <div class="newSearch" ref="newSearch" id='newSearch' :style="{backgroundColor : `rgba(255,255,255,${backgroundColorNumber})`}">
            <i class="iconfont mall-fanhui theme_font_black fanhui" :style="{top: '32px'}" @click="backEvent"></i>
            <div class="search-div theme_bg_white_f5" :style="{top: '32px'}" :class="{'search-divA':$store.state.webtype != 2,'search-divB':$store.state.webtype == 2}" @click="toSearchEvent">
            <i class="iconfont mall-sousuo theme_font_tint" style="font-size: 16px;"></i>
              <span class="theme_font_tint" style="font-size: 14px;margin-left: 10px;">{{searchKey ? searchKey : '搜你想要的商品'}}</span>
            </div>
          </div>
          <div class="shop-background-content" id="shop-background-content-new">
            <div class="shop-background-content-top">
              <div class="containerTopImgTop">
                <img :src="objData.pictureUrl?objData.pictureUrl:$store.state.globalConfig.microshop_headurl" alt="">
                <span>{{objData.storeName || '逛微店'}}</span>
              </div>
              <div class="containerTopImgBum" @click="collection">
                <span>{{isCollect?'已收藏':'收藏'}}</span>
              </div>
            </div>
            <div class="containerTopText">
              <span>{{`简介：${objData.storeProfile || '请设置简介'}`}}</span>
            </div>
          </div>
        </div>
        <div class="shop-background" id='shop-background' v-if='$store.state.webtype == 2' :style="'background-image: url('+`${objData.backgroundImgUrl || 'static/image/microShop/up.png'}`+'); height: 190px;'">
          <div class="search" ref="search" id='search' :style="{backgroundColor : `rgba(255,255,255,${backgroundColorNumber})`}">
            <i class="iconfont mall-fanhui theme_font_black fanhui" :style="{top: '2px'}" v-if="$store.state.webtype != 2" @click="backEvent"></i>
            <div class="search-div theme_bg_white_f5" :style="{top: '2px'}" :class="{'search-divA':$store.state.webtype != 2,'search-divB':$store.state.webtype == 2}" @click="toSearchEvent">
            <i class="iconfont mall-sousuo theme_font_tint" style="font-size: 16px;"></i>
              <span class="theme_font_tint" style="font-size: 14px;margin-left: 10px;">{{searchKey ? searchKey : '搜你想要的商品'}}</span>
            </div>
          </div>
          <div class="shop-background-content">
            <div class="shop-background-content-top">
              <div class="containerTopImgTop">
                <img :src="objData.pictureUrl?objData.pictureUrl:$store.state.globalConfig.microshop_headurl" alt="">
                <!-- <img v-if="objData.pictureUrl" :src="objData.pictureUrl" alt />
                <img v-else :src="$store.state.globalConfig.microshop_headurl" alt /> -->
                <span>{{objData.storeName || '逛微店'}}</span>
              </div>
              <div class="containerTopImgBum" @click="collection">
                <span>{{isCollect?'已收藏':'收藏'}}</span>
              </div>
            </div>
            <div class="containerTopText">
              <span>{{`简介：${objData.storeProfile}`}}</span>
            </div>
          </div>
        </div>
        <div style="height: 100px;width:100%;padding: 5px 10px" v-if="$store.state.globalConfig.microshop_groupbuying_exhibition == 1">
          <img style="height: 100%; width:100%" src="static/image/microShop/入口.png" alt="" @click="groupbuyingBtn">
        </div>
        <div class="delivery" id='delivery' :class="{locationTop:isLocationTop,locationTopweb:isLocationTopweb}">
            <div class="type-btn" :class="{theme_light_bg: selectedType == item.tag, theme_standard_bdr_i: selectedType == item.tag}"
                @click="selectedTypeEvent(item.tag)" v-for="(item,index) in deliveryTypes" :key="index">
              <i class="iconfont theme_font_common icon-size" :class="[item.fontclass, {theme_standard_font_i: selectedType == item.tag}]" />
              <span class="theme_font_common" :class="{theme_standard_font_i: selectedType == item.tag}">{{item.text}}</span>
            </div>
            <div class="space"></div>
            <div class="local-div" @click="selectAddressClick()">
              <span class="theme_font_gray single-line"  v-if="selectedType == 2" >{{$store.state.mall2.selectAddress.addressFull}}</span>
              <span class="theme_font_gray single-line" v-if="selectedType == 1" >{{$store.state.mall2.zitiAddress.storeName}}</span>
              <i class="iconfont mall-dingwei icon-size theme_font_gray"></i>
            </div>
        </div>
        <div class="seizeSeat" v-show="isLocationTop || isLocationTopweb" />
        <div class="bestSellers" id="bestSellers" v-show="bestSellersObj.arr.length">
          <bestSellers ref="bestSellers" :params="bestSellersObj" @addShopping="addShopping" @productEvent="productEvent"/>
        </div>
        <div class="row-botton" :class="{isFitrateRow:isFitrateRow,fitrateRowweb:isFitrateRowweb}" v-show="screenArr.length">
          <fitrateRow :screenArr="screenArr" @setData="setData"/>
        </div>
        <div class="seizeSeat" v-show="isFitrateRow || isFitrateRowweb" />
        <list class="skuList" ref="listFun" @setDatalist='setDatalist' @productEvent="productEvent" @addShopping="addShopping" @listData="listData" @listStatus='listStatus' @refresh='refresh' :params="params" :styleObj="styleObj" :screenArr="screenArr" />
          <div ref="gouwuche" class="cart-div theme_bg_dark_d" :class="{'gouwucheani':addCartBtnAn}" @click.stop="goCart"  >
            <p class="cart-num theme_bg_red theme_font_white" v-if="($store.state.microSho.carts.length + $store.state.microSho.groupbuyingCarts.length) > 0" >{{$store.state.microSho.carts.length + $store.state.microSho.groupbuyingCarts.length}}</p>
            <i class="iconfont mall-gouwuche theme_font_white"></i>
          </div>
          <transition name="bounce" @afterEnter="productImgAfterEnter">
            <img :src="this.addToCartItem.picMainUrl || this.addToCartItem.mainMobilePicUrl" alt class="productImg" v-if="showProductImg && addToCartItem" />
          </transition>
          <transition @after-enter="afterEnter" @before-enter="beforeEnter">
            <div class="anProductImg" v-if="showAddCartAn  && addToCartItem">
              <img :src="this.addToCartItem.picMainUrl || this.addToCartItem.mainMobilePicUrl" alt />
            </div>
          </transition>
        </div>
  </div>
</template>

<script>
import Scroll from "@/components/base/scroll/scroll";
import Search from "@/components/mall2/common/search";
import bestSellers from "./common/horizontalRolling.vue";
import fitrateRow from "../common/fitrateRow.vue";
import list from "../common/list";
import { mapGetters } from "vuex";
export default {
  components: {
    list,
    Scroll,
    bestSellers,
    fitrateRow
  },
  computed: {
    ...mapGetters(["getPutaggregate"])
  },
  data() {
    return {
      deliveryTypes: [
        {
          text: "配送",
          fontclass: "mall-peisong",
          tag: '2'
        },
        {
          text: "自提",
          fontclass: "mall-ziti",
          tag: '1'
        }
      ],
      screenArr: [
        {
          name: "综合",
          type: 0,
          default: 0,
          allScreen: true,
          typeText: "sortType",
          sort: "sortProp",
          classStaId: "classStaId",
          classStaLevel: "classStaLevel",
          priceLow: "priceLow",
          priceHigh: "priceHigh"
        },
        { name: "销量", type: 2 },
        { name: "价格", type: 1 }
      ],
      params: {
        // page: 1,
        // rows: 10,
        skuName: "",
        storeCode: "",
        groupFlag: 0,
        deliverType: this.$store.state.mall2.staticDeliverType, // 配送方式 2快递运输 1上门自提 12都支持
        sortType: "asc", // 排序方式 desc 降序 asc 升序
        sortProp: "0", // 排序属性 0 综合 1 价格 2销量
        priceLow: "",
        priceHigh: "",
        classStaId: "", // 分类ID
        classStaLevel: "" // 分类级别
      },
      styleObj: {
        listStyle: false,
        rowStyle: 2,
        isObject: 2,
        isHeight: "",
        url: "/app/json/app_distribution_order/getMicroStorePros"
      },
      id: "",
      bestSellersH: 0,
      backgroundColorNumber: 0,
      isLocationTopweb: false,
      isFitrateRowweb: false,
      isLocationTop: false,
      isFitrateRow: false,
      loading: false,
      isCollect: false,
      scrollEl: null,
      scrollTopH: 0,
      searchKey: "",
      selectedType: '',
      objData: {
        backgroundImgUrl: '',
        pictureUrl: ''
      },
      bestSellersObj: {
        groupFlag: 0,
        storeCode: '',
        arr: [],
        recommendNums: ""
      },
      //当前点击加入购货物车的商品
      addToCartItem: undefined,
      //加入购物车的时候  显示图片动画
      showProductImg: false,
      // 抛物线动画
      showAddCartAn: false,
      //显示购物车按钮动画
      addCartBtnAn: false,
      statusOne: false,
      microStoreCode: ''
    };
  },
  beforeRouteLeave(to, from, next) {
    if(to.path == "/mall2/mypickupaddress"){
      this.statusOne = true
    }else{
      this.statusOne = false
    }
    this.$keepaliveHelper.deleteCache(this)
    next()
  },
  activated() {
    this.isLocationTop = false,
    this.isFitrateRow = false,
    this.isLocationTopweb = false,
    this.isFitrateRowweb = false,
    this.scrollEl.scrollTop = this.scrollTopH;
    this.$refs.bestSellers.personScroll(0)
    if(this.statusOne && this.selectedType == 1){
      if(this.params.page == 1){
        this.$refs.listFun.setData()
      }else{
        this.params.page = 1
      }
    }
  },
  created() {
    this.id = this.$util.getUrlParam(window.location.href, "id") || "";
    // this.microStoreCode = '3b87334313974515b1ed84cdce954012'
    this.microStoreCode = this.$route.query.storeID
    this.params.storeCode = this.microStoreCode
    sessionStorage.setItem("MICRO_StoreCode", this.microStoreCode);
    this.bestSellersObj.storeCode = this.microStoreCode
    this.$store.state.microSho.storeCoe = this.microStoreCode
    this.selectedType = this.$store.state.mall2.staticDeliverType
    if (this.$store.state.globalConfig.delivertype_default == "1") {
      this.deliveryTypes = [
        {
          text: "自提",
          fontclass: "mall-ziti",
          tag: "1"
        }
      ];
    } else if (this.$store.state.globalConfig.delivertype_default == "2") {
      this.deliveryTypes = [
        {
          text: "配送",
          fontclass: "mall-peisong",
          tag: "2"
        }
      ];
    }
  },
  mounted() {
    let search = document.getElementById('newSearch') || document.getElementById('search')
    let searchH = search ? search.getBoundingClientRect().height : 0
    let shopBackground = document.getElementById('shop-background')
    let shopBackgroundH = shopBackground ? shopBackground.getBoundingClientRect().height : 0
    let delivery = document.getElementById('delivery')
    let deliveryH = delivery ? delivery.getBoundingClientRect().height : 0
    let groupBuyingH = 0
    if (this.$store.state.globalConfig.microshop_groupbuying_exhibition == 1) {
        groupBuyingH = 110
    }
    this.scrollEl = this.$refs.allContent;
    this.scrollEl.addEventListener('scroll', e=>{
      this.scrollTopH = e.target.scrollTop
      if(this.$store.state.webtype != 2){
        this.isLocationTopweb = this.scrollTopH > shopBackgroundH + groupBuyingH - searchH
        this.isFitrateRowweb = this.scrollTopH > shopBackgroundH + groupBuyingH + this.bestSellersH - searchH
        this.backgroundColorNumber = this.scrollTopH / 100
      }else{
        this.isLocationTop = this.scrollTopH > shopBackgroundH + groupBuyingH - searchH
        this.isFitrateRow = this.scrollTopH > shopBackgroundH + groupBuyingH + this.bestSellersH - searchH
        this.backgroundColorNumber = this.scrollTopH / 139
      }
    });
  },
  methods: {
    backEvent(){
      this.$router.go(-1)
      this.$keepaliveHelper.deleteCache(this)
    },
    setScrollTop(){
      this.scrollEl.scrollTop = 0
    },
    refresh(){
      this.$nextTick(res=>{
        let bestSellers = document.getElementById('bestSellers')
        this.bestSellersH = bestSellers ? bestSellers.getBoundingClientRect().height : 0
      })
      // this.isLocationTop = false,
      // this.isFitrateRow = false
    },
    listStatus(status){
      this.loading = false
    },
    loadMore(){
      this.loading = true
      // this.$refs.listFun._loadProList()
    },
    setDatalist(){
      this.setScrollTop()
    },
    setData(item){
      this.$refs.listFun.setData(item)
    },
    toSearchEvent() {
      Search.open({
        initData: {
          barHeight: this.$store.state.barHeight,
          searchHistory: this.$store.state.mall2.searchHistory
        },
        clearSearchHistory: () => {
          this.$store.state.mall2.searchHistory = [];
        },
        searchEvent: searchStr => {
          Search.close();
          this.$mallCommon.pushSearchHistory(searchStr);
          this.searchKey = searchStr;
          this.params.page = 0;
          this.params.skuName = searchStr;
        }
      });
      this.setScrollTop()
    },
    selectedTypeEvent(tag) {
      this.selectedType = tag;
      console.log(tag)
      this.$store.state.mall2.staticDeliverType = tag;
      if (this.selectedType == 2) {
        this.showView = true;
      } else {
        this.showView = false;
      }
      this.params.deliverType = tag;
      this.setScrollTop()
    },
    selectAddressClick() {
      //选择地址
      this.lastPath = "mall2";
      let path = "";
      if (this.selectedType == 2) {
        path = "/mall2/addresslist";
      } else {
        path = "/mall2/mypickupaddress";
        // this.backRefresh = true;
      }
      if (this.$userCenter.checkLogined({ path: path }, 0) == false) {
        return;
      }
      this.$router.push({
        path: path
      });
      this.setScrollTop()
    },
    listData(item) {
      this.objData = Object.assign({}, item.data[0]);
      this.isCollect = this.objData.collect
      this.bestSellersObj.arr = [...item.data[0].retDatasRecommend];
      this.bestSellersObj.recommendNums = item.data[0].recommendNums;
    },
    productEvent(product) {
      console.log(this.microStoreCode)
      this.lastPath = "";
      let path = "/micro_sho/shareDetail/" + this.$util.getDataString();
      if (product.productType == 2) {
        path = "/micro_sho/shareTicketDetail";
      }
      this.$router.push({
        path: path,
        query: {
          id: product.skuId,
          skuId: product.skuId,
          lastPath: this.$route.path,
          deliveryType: this.$store.state.mall2.staticDeliverType,
          productType: product.productType,
          profit: product.profit,
          listData: product,
          microStoreCode: this.microStoreCode,
          proSkuDistributionId: product.proSkuDistributionId
        }
      });
    },
    addShopping(item) {
      console.log(item)
      let arr = this.$store.state.microSho.carts;
      if (arr.length == 0) {
        this.$store.state.microSho.carts.push({
          skuId: item.skuId,
          storeOuCode: item.storeOuCode,
          deliverType: item.deliverType,
          proSkuDistributionId: item.proSkuDistributionId,
          number: item.saleNumBegin,
          // number: 1,
          checked: 1,
          selfActivityId: -2
        });
      } else {
        let status = null;
        let arr = this.$store.state.microSho.carts;
        arr.forEach((element, index) => {
          if (item.skuId == element.skuId) {
            this.$store.state.microSho.carts[index].number += 1;
            status = true;
            return;
          }
        });
        if (!status) {
          this.$store.state.microSho.carts.push({
            skuId: item.skuId,
            storeOuCode: item.storeOuCode,
            deliverType: item.deliverType,
            proSkuDistributionId: item.proSkuDistributionId,
            number: item.saleNumBegin,
            // number: 1,
            checked: 1,
            selfActivityId: -2
          });
        }
      }
      this.addToCartItem = item;
      this.$nextTick(() => {
        this.showProductImg = true;
      });
      console.log(this.$store.state.microSho.carts)
    },
    productImgAfterEnter(el) {
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
    collection() {
      this.$Loading.open();
      this.$http
        .post("/app/json/micro_store_front_end/addOrCancelMicroStoreCollect", {
          storeId: this.id
        })
        .then(res => {
          this.$Loading.close();
          if (res.data.status == 0) {
            this.isCollect = !this.isCollect;
            this.$Toast(!this.isCollect ? "已取消收藏" : "收藏成功");
          } else {
            this.$Toast(res.data.info);
          }
        });
    },
    goCart() {
      let path = '/micro_sho/cart';
      if (this.$store.state.globalConfig.microshop_groupbuying_exhibition == 1) {
        path = '/micro_sho/buyingCart'
      }
      this.$router.push({
        path: path,
        query: {microStoreCode: this.microStoreCode}
      });
    },
    groupbuyingBtn() {
      this.$router.push({
        path: '/micro_sho/groupbuying',
        query: {
          id: this.id,
          storeID: this.microStoreCode
        }
      })
    }
  },
  beforeDestroy() {
    // this.$store.state.microSho.carts = []
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .all-content {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background: url('../../../../static/image/microShop/list-bg.png') repeat center center / 100% 100%;
    .shop-background{
      color #fff
      background-size: 100% 100%;
      .newSearch{
        z-index 5
        position fixed
        top 0
        width 100%
        height 84px /*no*/
        line-height 44px
        .fanhui{
          position fixed;
          top: 0px;
          margin-left: 10px;
          font-size: 20px;
        }
        .search-div {
          position fixed;
          margin-top 6px
          padding: 0 15px;
          border-radius: 15px;
          height: 30px; /*no*/
          line-height 30px
          .icon-font {
            font-size $font-size-medium;
          }
        }
      }
      .search{
        z-index 5
        position fixed
        top 0
        width 100%
        height 44px /*no*/
        line-height 44px
        .fanhui{
          position fixed;
          top: 0px;
          margin-left: 10px;
          font-size: 20px;
        }
        .search-div {
          position fixed;
          margin-top 6px
          padding: 0 15px;
          border-radius: 15px;
          height: 30px; /*no*/
          line-height 30px
          .icon-font {
            font-size $font-size-medium;
          }
        }
      }
      .search-divA{
        left 50px
        right 20px
      }
      .search-divB{
        left 10px
        right 10px
      }
      #shop-background-content-new{
        padding 84px 24px
      }
      .shop-background-content{
        height 100%
        padding 76px 24px
        .shop-background-content-top {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .containerTopImgTop {
            display: flex;
            align-items: center;

            span {
              padding: 4px;
              border-radius: 6px;
              display: inline-block;
            }

            img {
              width: 50px;
              height: 50px;
              border-radius: 50px;
            }

            span {
              margin-left: 10px;
              font-size: 18px;
              font-weight: 500;
            }
          }

          .containerTopImgBum {
            border: 0.5px solid #fff;
            padding: 2px 6px;
            border-radius: 10px;
          }
        }
        .containerTopText {
          width: 100%;
          display: inline-block;
          margin-top: 10px;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border-radius: 6px;

          span {
            padding: 4px;
            display: inline-block;
          }
        }
      }
    }
    .locationTop{
      width 100%
      z-index 5
      position fixed
      // top 44px
      top 1.16 rem
    }
    .locationTopweb{
      width 100%
      z-index 5
      position fixed
      // top 82px
      top 2.22 rem
    }
    .seizeSeat{
      height 40px
    }
    .delivery {
      display: flex;
      padding: 8px 14px;
      height 40px /*no*/
      background-color: #fff;

      .type-btn {
        font-size: $font-size-medium;
        padding: 4px 10px;
        border-radius: 15px;
        border: 0.6px solid transparent;

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
    }
    .isFitrateRow{
      z-index 5
      position fixed
      // top 84px
      top 2.22 rem
    }
    .fitrateRowweb{
      z-index 5
      position fixed
      // top 114px
      top 3.3 rem
    }
    .row-botton {
      width 100%
      height 40px /*no*/
      box-shadow: 0px -2px 2px #efefef;
      border-radius: 10px 10px 0 0;
      padding: 0px 15px;
      background-color #fff
      .type-btn {
        font-size: $font-size-medium;
        padding: 4px 10px;
        border-radius: 15px;
        border: 0.6px solid transparent;

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
    }
    .bestSellers{
      height 200px
    }
  }

  .cart-div {
    position: fixed;
    right: 16px;
    bottom: 170px;
    width: 36px;
    height: 36px;
    border-radius: 20px;
    padding: 8px;
    z-index: 20;

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
  }

  .productImg {
    position: fixed;
    z-index: 1000;
    left: 147.5px;
    width: 80px;
    height: 80px;
    border-radius: 40px;
    top: 120px;
  }

  .anProductImg {
    position: fixed;
    z-index: 1000;
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
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .15s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>

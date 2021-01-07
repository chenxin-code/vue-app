<template>
  <div class="preview-component">
    <div class="general-div">
      <component :is='getOtherHeader()' :headerData="headerData" :barHeight="barHeight" :scrollSite="scrollSite"></component>
      <!--MyCenterHeader-->
      <TopNav :usePorpData="true" :propData="pageData" v-if="pageData.header.data.type == 'custom'"
              :barHeight="barHeight" :scrollSite="scrollSite"></TopNav>
      <div :id="modulesDomId" class="modules-div" :style="getTopStyle()">
        <div class="screen-module" v-if="pageData.screenModule && pageData.screenModule.code != ''">
          <component :is="pageData.screenModule.code" :usePorpData="true" :propData="pageData"></component>
        </div>
        <scroll ref="preview_scroll" :data="fakeData" :pullDownRefresh="true" @scroll="pageSite" @pullingDown="topRefresh" :listenScroll="true" :hasMore="hasMore" :pullUpLoad="hasPullUpLoad()" @pullingUp="moduleLoadMore" v-else>
          <!---->
          <div class="s-content">
            <template v-for="(item, index) in pageData.moduleList">
              <div v-if="moduleIsShow(item.data)" :key="index">
                <component :ref="'page_module_'+index" :is="item.code" :myIndex="index" :usePorpData="true" :propData="pageData" :scrollSite="scrollSite" :barHeight="barHeight"></component>
              </div>
            </template>
            <ProductInfinite ref="ProductInfinite" v-if="pageData.productInfinite && pageData.productInfinite.data.type != 'none' && moduleIsShow(pageData.productInfinite.data)" :scrollSite="scrollSite" :usePorpData="true" :propData="pageData" :modulesDomId="modulesDomId" @loadedEvent="loadedEvent"></ProductInfinite>
            <div v-if="$store.state.webtype == '4'" class="bottom-tip">
              <p>服务由广州有路科技有限公司提供</p>
              <p>客服电话：4006162515</p>
            </div>
          </div>
        </scroll>
        <Floater ref="Floater_Module" v-if="pageData.floater && pageData.floater.data.type != 'none'" :usePorpData="true" :propData="pageData" @floterEdit="floterEdit"></Floater>
        <div class="to-top" v-show="showToTop" @click.stop="toTopEvent">
          <img src="static/images/toTop.png">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import TopNav from '@/views/design/components/top-nav/top-nav';
  import TopNav from '../top-nav/top-nav';
  import PullTo from '@/components/Vendor/vue-pull-to/vue-pull-to'
  import Scroll from '@/components/base/scroll/scroll'
  export default {
    name: 'preview-component',
    components: {
      TopNav,
      PullTo,
      Scroll,
      ImageAd: () => import('../image-ad/image-ad'),
      Rubik: () => import('../rubik/rubik'),
      ProductList: () => import('../product-list/product-list'),
      ProductInfinite: () => import('../product-infinite/product-infinite'),
      Auxiliary: () => import('../auxiliary/auxiliary'),
      MyCenter: () => import('../my-center/my-center'),
      MyCenterHeader: () => import('../my-center/my-center-header'),
      MyOrder: () => import('../my-order/my-order'),
      FuelPrices: () => import('../fuel-prices/fuel-prices'),
      MyAssets: () => import('../my-assets/my-assets'),
      SecondsKill: () => import('../seconds-kill/seconds-kill'),
      PickupAddress: () => import('../pickup-address/pickup-address'),
      MyPoints: () => import('../my-points/my-points'),
      MyPointsHeader: () => import('../my-points/my-points-header'),
      HScroll: () => import('../h-scroll/h-scroll'),
      Floater: () => import('../floater/floater'),
      HYTop: () => import('../hy-top/hy-top'),
      HYNews: () => import('../hy-news/hy-news'),
      News: () => import('../news/news'),
      CustomText: () => import('../text/custom-text'),
      FuelFree: () => import('../fuel-free/fuel-free'),
      CoverFlow: () => import('../coverflow/coverflow'),
      MemberCard: () => import('../member-card/member-card'),
      CouponsTag: () => import('../coupons-tag/coupons-tag'),
      CouponHQ: () => import('../coupon-hq/coupon-hq'),
      ProductTabs: () => import('../product-tabs/product-tabs'),
      MemberLevels: () => import('../member-levels/member-levels'),
      ESHTop: () => import('../esh-top/esh-top'),
      ESHNearStation: () => import('../esh-nearstation/esh-nearstation'),
      ESHDZJYQ: () => import('../esh-dzjyq/esh-dzjyq'),
      ESHJFHQ: () => import('../esh-jfhq/esh-jfhq'),
      ESHQQJY: () => import('../esh-qqjy/esh-qqjy'),
      HKTop: () => import('../hk-top/hk-top'),
      HYStation: () => import('@/views/design/components/hy-station/hy-station'),
      GetCoupon: () => import('../get-coupon/get-coupon')
    },
    props: [
      'pageData',
      'barHeight'
    ],
    data() {
      return {
        modulesDomId: this.$util.randomString(),
        msg: 'msg',
        showToTop: false,
        scrollSite: 0,
        markScrollSite: 0,
        refreshLoaded:null,
        headerData: {},
        hasMore: false,
      }
    },
    methods: {
      refresh() {
        this.$refs.preview_scroll.refresh()
      },
      hasPullUpLoad: function () {
        if (this.pageData.productInfinite && this.pageData.productInfinite.data.type != 'none') {
          return true
        }
        return false
      },
      loadedEvent: function (hasMore) {
        if (hasMore == true) {
          this.hasMore = true
          setTimeout(() => {
            let dom = this.$refs.preview_scroll
            dom.pullUpFinished &&　dom.pullUpFinished()
          }, 20)
        } else {
          this.hasMore = false
        }
      },
      moduleLoadMore: function (loaded) {
        let dom = this.$refs.ProductInfinite
        dom.loadMore()
      },
      moduleIsShow: function (moduleData) {
        if (moduleData.modelMustLogin == true) {
          if (this.$store.state.login.token == '') {
            return false
          }
        }
        if (moduleData.endTime == undefined || moduleData.endTime == '') {
          return true
        }
        let t1 = (new Date(moduleData.endTime)).getTime()
        let t2 = (new Date(this.$store.state.severTime.currentTime)).getTime()
        if (t1 > t2) {
          return true
        }
        return false
      },
      floterEdit: function () {
        console.log('click stop!')
      },
      bottomLoad: function () {

      },
      getOtherHeader: function () {
        if (this.pageData.header.data.type != 'none') {
          return ''
        }
        for (let i = 0; i < this.pageData.moduleList.length; i++) {
          let mdata = this.pageData.moduleList[i]
          if (mdata.code == 'MyCenter' && mdata.data.styleTempl != 1) {
            this.headerData = mdata.data
            return 'MyCenterHeader'
          } else if (mdata.code == 'MyPoints' && mdata.data.styleTempl == 1) {
            if (this.$util.isZTAPP()) {
              return ''
            }
            return 'MyPointsHeader'
          }
        }
        return ''
      },
      pageSite: function (pageSite) {
        // console.log('pageSite', this.scrollSite)
        this.scrollSite = -pageSite.y;
        if (this.scrollSite > 200) {
          this.showToTop = true;
        } else {
          this.showToTop = false;
        }
      },
      toTopEvent: function () {
        let el = this.$refs.preview_scroll
        el.scrollTo(0, 0, 300)
      },
      getTopStyle: function () {
        let styleStr = '';
        if (this.pageData.header.data.type == 'custom' && this.pageData.header.data.isFloat != true) {
          styleStr = 'top:' + (this.$market.getNavHeight(true) + this.barHeight) + 'px;';
        }
        return styleStr;
      },
      testFunc: function () {
        console.log('testFunc')
      },
      topRefresh:function(loaded){
        this.refreshLoaded = loaded;
        this.$emit('getPageData');
      },
      pageShow: function () {
        for (let i = 0; i < this.pageData.moduleList.length; i++) {
          let mData = this.pageData.moduleList[i]
          if (mData.code == 'MyAssets' || mData.code == 'MyOrder' || mData.code == 'MyCenter' || mData.code == 'FuelPrices' || mData.code == 'ProductList' || mData.code == 'SecondsKill') {
            let refStr = 'page_module_'+i
            let refArr = this.$refs[refStr]
            if (refArr && refArr.length > 0) {
              let dom = refArr[0]
              if (dom) {
                dom.modeleReshow()
              }
            }
          }

        }
        if (this.$refs.preview_scroll) {
          // this.$refs.preview_scroll.refresh()
          // setTimeout(() => {
          //   this.$refs.preview_scroll.scrollTo(0, this.scrollSite)
          // }, 20)
        }
        // debugger
        if (this.$refs.ProductInfinite) {
          this.$refs.ProductInfinite.modeleReshow()
        }
        if (this.$refs.Floater_Module) {
          this.$refs.Floater_Module.modeleReshow()
        }
      },
      imageAdRefresh:function () {
        for (let i = 0; i < this.pageData.moduleList.length; i++) {
          let mData = this.pageData.moduleList[i]
          if (mData.code == 'ImageAd' ) {
            let refStr = 'page_module_'+i
            let refArr = this.$refs[refStr]
            let dom = refArr[0]
            dom.modeleReshow()
          }
        }
      },
      setScrollSite: function (value) {
        value = parseInt(value)
        this.scrollSite = value
        setTimeout(() => {
          let el = this.$refs.preview_scroll
          console.log(this.scrollSite, el)
          if (el) {
            el.scrollTo(0, -this.scrollSite, 1)
          }
        }, 100)
      },
      getScrollSite: function () {
        return this.scrollSite
      }
    },
    watch:{
      'pageData' : function(val, oldVal) {
        if(this.refreshLoaded){
          this.refreshLoaded('done');
          this.refreshLoaded = null;
        }
      }
    },
    computed: {
      fakeData: function () {
        if (this.pageData.productInfinite && this.pageData.productInfinite.data.type != 'none') {
          return this.pageData.productInfinite.data.rows
        }
        return this.pageData.moduleList
      }
    },
    // activated() {
    //   console.log('preview component activated', this.scrollSite, this.markScrollSite)
    //   if (this.scrollSite > 0) {
    //     // this.$refs.myScrollView.setScrollTopValue(this.scrollSite)
    //   }
    // },
    // beforeRouteLeave (to, from, next) {
    //   this.markScrollSite = this.scrollSite
    //   next()
    // },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .preview-component {
    width 100%
    height 100%
    overflow hidden
    .general-div {
      position relative;
      width 100%
      height 100%
      overflow hidden
      .modules-div {
        position absolute
        width 100%
        top 0px;
        left 0px;
        right 0px;
        bottom 0px;
        overflow hidden
        >>>.scroll-content {
          min-height 100.1%
          .scroll {
            //min-height 120.1%
          }
        }
        .s-content {
          width 100%
          //min-height 100.1%
          overflow hidden
        }
        .screen-module {
          position absolute
          top 0px;
          left 0px;
          right 0px;
          bottom 0px;
          overflow hidden
        }
        .bottom-tip {
          padding 8px 10px 15px;
          text-align center;
          font-size 10px;
          color #999;
          p {
            line-height 16px;
          }
        }
      }

      .to-top {
        position absolute;
        right 10px;
        bottom 15px;
        overflow hidden;
        border-radius 20px;
        z-index 10;
        border 0.6px solid #ddd;
        background-color white;
        padding 6px;
        img {
          display block;
          width 18px;
          height 18px;
        }
      }
    }
  }
</style>

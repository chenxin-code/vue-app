/**Created by liaoyingchao on 2019/1/16.*/

<template>
  <div class="subpage" v-if="pageData != null">
    <div v-for="(item, index) in pageData.moduleList">
      <component :ref="'page_module_'+index" :is="item.code" :myIndex="index" :usePorpData="true" :propData="pageData" :comData="comData"></component>
    </div>
  </div>
</template>

<script>
  import staticDataRequest from "@/utils/staticData/staticDataRequest";

  export default {
    name: "subpage",
    components: {
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
      BtnProduct: () => import('../btn-product/btn-product')
    },
    props: ['divKeywords', 'pgCode', 'comData', 'propsPageData'],
    data() {
      return {
        pageData: null
      }
    },
    methods: {
      getMyPageData: function () {
        let url = '/appcontent/js/app_vue_page/vuePageData.js'
        let funcName = 'vuePageData_'
        let args = []
        args.push({appType: 1})
        args.push({accessType: 2})
        if (this.pgCode && this.pgCode != '') {
          funcName += this.pgCode
          args.push({pgCode: this.pgCode})
        } else {
          args.push({divKeywords: this.divKeywords})

          let md5Str = this.$util.md5String(this.divKeywords)
          funcName += md5Str
        }
        if (this.$store.state.webtype != -1) {
          args.push({webType: this.$store.state.webtype})
        }
        staticDataRequest.request(url, funcName, args).then(data => {
          if (data.status == 0) {
            let fdata = data.data.pageData;
            if (!fdata.pageDataJson) {
              return
            }
            this.pageData = JSON.parse(fdata.pageDataJson);
            this.$emit('dataLoaded')
          }
        })
        // let url = this.$market.apiBaseURL() + '/app/json/app_vue_page/vueGetPageData';
        // let params1 = {
        //   accessType: '2'
        // }
        // if (this.pgCode && this.pgCode != '') {
        //   params1.pgCode = this.pgCode
        // } else if (this.divKeywords && this.divKeywords != '') {
        //   params1.divKeywords = this.divKeywords
        // }
        // if (this.$store.state.webtype != -1) {
        //   params1.webType = this.$store.state.webtype
        // }
        // this.$http.post(url, params1).then(res => {
        //   let data = res.data;
        //   if (data.status == 0) {
        //     if (data.data && data.data.pageDataJson) {
        //       this.pageData = JSON.parse(data.data.pageDataJson);
        //     }
        //   } else {
        //
        //   }
        // }, error => {
        // })
      }
    },
    created() {
      if (this.propsPageData) {
        this.pageData = this.propsPageData
        this.$emit('dataLoaded')
      } else {
        this.getMyPageData();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .subpage {
    width 100%
    overflow hidden
  }
</style>

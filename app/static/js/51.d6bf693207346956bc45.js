(window.webpackJsonp=window.webpackJsonp||[]).push([[51],{ISz4:function(t,a,n){"use strict";n.r(a),n("TC2U");var s={props:{hasBack:{type:Boolean,default:!0}},data:function(){return{searchValue:"",indexList:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","#"],swiperList:[],swiperOptions:{pagination:{el:".swiper-pagination",clickable:!0},on:{touchEnd:this.touchEnd}},brandList:{}}},computed:{mySwiper:function(){return this.$refs.mySwiper.swiper}},mounted:function(){this.getHotBrand(),this.getHotBrandTopList()},methods:{getHotBrandTopList:function(){var t=this;this.$Loading.open(),this.$http.post("/app/json/app_brand/getHotBrandList",{isHot:1,page:1,rows:5}).then((function(a){var n=a.data;0==n.status?t.swiperList=n.data||[]:t.$Toast(n.info),t.$Loading.close()})).catch((function(a){t.$Toast("getHotBrandList err "+a),t.$Loading.close()}))},getHotBrand:function(t){var a=this;this.$Loading.open(),this.$http.post("/app/json/app_brand/getHotBrandList",{featureValue:t,page:1,rows:1e3}).then((function(n){a.brandList={};var s,i=n.data;0==i.status?t?(a.brandList["#"]=[],(s=a.brandList["#"]).push.apply(s,function(t){if(Array.isArray(t)){for(var a=0,n=Array(t.length);a<t.length;a++)n[a]=t[a];return n}return Array.from(t)}(i.data))):a.dealwithBrand(i.data):a.$Toast(i.info),a.$Loading.close()})).catch((function(t){a.$Toast("getHotBrandList err "+t),a.$Loading.close()}))},dealwithBrand:function(t){var a=this,n=[];this.indexList.forEach((function(t){a.brandList[t]=[]})),t instanceof Array&&t.length>0&&t.forEach((function(t){t.firstName?a.brandList[t.firstName.toUpperCase()]&&a.brandList[t.firstName.toUpperCase()].push(t):n.push(t)})),this.brandList["#"]=n},touchEnd:function(t){this.mySwiper.isEnd&&this.mySwiper.touches.diff<-150&&this.$router.push({path:"brand_hot_list"})},brandClick:function(t){this.$router.push({path:"brand_prod_list",query:{brandId:t.id}})},searchHandler:function(t){""!==t?this.getHotBrand(t):this.getHotBrand()},clearHandler:function(){this.getHotBrand()}}},i=(n("RoGn"),n("KHd+")),r=Object(i.a)(s,(function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("div",[t.hasBack?n("nav-top",{on:{backEvent:function(a){return t.$router.go(-1)}}}):t._e(),t._v(" "),n("nav-content",{staticClass:"container",class:{"no-top-nav":!t.hasBack}},[n("div",{staticClass:"swiper-container"},[t.swiperList.length>0?n("swiper",{ref:"mySwiper",staticClass:"my-swiper",attrs:{options:t.swiperOptions}},[t._l(t.swiperList,(function(a,s){return n("swiper-slide",{key:s,staticClass:"item"},[n("img",{attrs:{src:a.hotMainUrl,alt:""},on:{click:function(n){return t.brandClick(a)}}})])})),t._v(" "),n("div",{staticClass:"sliding-prompt"},[n("span",{staticClass:"icon"},[t._v("→")]),t._v(" "),n("p",{staticClass:"text"},[t._v("左滑查看更多")])]),t._v(" "),n("div",{staticClass:"swiper-pagination",attrs:{slot:"pagination"},slot:"pagination"})],2):t._e()],1),t._v(" "),n("div",{staticClass:"search-container"},[n("p",{staticClass:"label"},[t._v("找大牌")]),t._v(" "),n("van-search",{staticClass:"search-input",attrs:{"left-icon":"","right-icon":"search",placeholder:"请输入内容"},on:{search:t.searchHandler,clear:t.clearHandler},model:{value:t.searchValue,callback:function(a){t.searchValue=a},expression:"searchValue"}})],1),t._v(" "),n("div",{staticClass:"brand-list"},[n("van-index-bar",{staticClass:"reset-index-bar-style",attrs:{sticky:!1,"index-list":t.indexList}},t._l(t.brandList,(function(a,s){return n("div",{key:s},[n("van-index-anchor",{staticClass:"reset-anchor",attrs:{index:s}},[n("span",{staticClass:"text"},[t._v(t._s(s))])]),t._v(" "),a.length>0?n("div",t._l(a,(function(a){return n("van-cell",{key:a.id,attrs:{title:a.featureValue},on:{click:function(n){return t.brandClick(a)}}})})),1):n("div",[n("van-cell",{staticClass:"no-result",attrs:{title:"品牌入驻中~"}})],1)],1)})),0)],1)])],1)}),[],!1,null,"3701bf59",null);a.default=r.exports},RoGn:function(t,a,n){"use strict";var s=n("XlAX");n.n(s).a},TC2U:function(t,a,n){},XlAX:function(t,a,n){}}]);
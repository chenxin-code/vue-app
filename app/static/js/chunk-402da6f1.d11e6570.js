(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-402da6f1","chunk-28c407f0"],{"00d6":function(t,e,i){"use strict";var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"scroll",staticClass:"scroll-wrapper",on:{touchstart:t.touchstart}},[i("div",{ref:"scrollContent",staticClass:"scroll-content"},[t._t("default")],2)])},o=[],a=(i("a9e3"),i("4795"),i("1fba"));i("4de4"),i("4160"),i("159b");function n(t,e){var i,s,o,a={absolute:!1,clone:!1,includeMargin:!1,display:"block"},n=[],c="";i=function(){var e=[];l(t,e),e.push(t),o=e.filter((function(t){return"none"===r(t,"display")})),c+="visibility: hidden !important; display: "+a.display+" !important; ",!0===a.absolute&&(c+="position: absolute !important; "),o.forEach((function(t,e){var i=t.getAttribute("style");n.push(i),t.setAttribute("style",i?i+";"+c:c)}))},s=function(){o.forEach((function(t,e){var i=n[e];void 0===i?t.removeAttribute("style"):t.setAttribute("style",i)}))},i();var h=0;return"width"==e?h=t.clientWidth:"height"==e&&(h=t.clientHeight),s(),h}function l(t,e){t&&t.parentElement&&(e.push(t.parentNode),l(t.parentElement,e))}function r(t,e){return t.style[e]?t.style[e]:t.currentStyle?t.currentStyle[e]:window.getComputedStyle(t,null)[e]}var c=n,h={name:"",props:{dataList:{type:Array,default:function(){return[]}},click:{type:Boolean,default:!0},percentWidth:{type:Number,default:0}},data:function(){return{}},mounted:function(){this._refresh()},methods:{touchstart:function(t){},disable:function(){this.scroll&&this.scroll.disable()},enable:function(){this.scroll&&this.scroll.enable()},_refresh:function(){var t=this;this.$nextTick((function(){setTimeout((function(){t._setWidth(),t._initScroll()}),200)}))},_setWidth:function(){if(this.$refs.scrollContent){for(var t=this.$refs.scrollContent.children,e=this.$refs.scroll.clientWidth,i=0,s=0;s<t.length;s++){var o=t[s];this.percentWidth&&(o.style.width=e*this.percentWidth/100+"px"),i+=c(o,"width")}this.$refs.scrollContent.style.width=i+10+"px"}},_initScroll:function(){this.$refs.scroll&&(this.scroll=new a["a"](this.$refs.scroll,{scrollX:!0,scrollY:!1,click:this.click,preventDefault:!1}))}},components:{},watch:{dataList:{handler:function(t){t&&t.length&&this._refresh()},immediate:!0}}},u=h,p=(i("297f"),i("0c7c")),d=Object(p["a"])(u,s,o,!1,null,"77eb9db6",null);e["a"]=d.exports},"11b7":function(t,e,i){"use strict";i("e919")},"1a01":function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"list"},[i("nav-top",{attrs:{title:"店铺详情"},on:{backEvent:t.backEvent}}),i("nav-content",[t.shopDetail?i("div",{staticClass:"all-content"},[i("div",{ref:"shopContent",staticClass:"shop-content",attrs:{id:"shopContent"}},[i("div",{staticClass:"shop-logo"},[i("img",{attrs:{src:"",alt:""}})]),i("div",{staticClass:"shop-introduce"},[i("div",{staticClass:"shop-name"},[i("div",{staticClass:"text-col_1"},[t._v("麦当劳(北七家店)")]),i("div",{staticClass:"text-col_2"},[t._v("营业中")])]),i("div",{staticClass:"service-group"},[i("div",{staticClass:"service-item s1"},[t._v("加油")]),i("div",{staticClass:"service-item s2"},[t._v("加水")]),i("div",{staticClass:"service-item s3"},[t._v("厕所")]),i("div",{staticClass:"service-item s4"},[t._v("充值")])]),i("div",{staticClass:"coupon-receive"},[i("div",{staticClass:"coupon-receive-list"},[i("div",{staticClass:"coupon-recerve-text"},[t._v("￥"),i("i",{staticClass:"i1"},[t._v("10")]),t._v("满50元可用")]),i("div",{staticClass:"coupon-recerve-status"},[t._v("领")])]),i("div",{staticClass:"coupon-receive-list received"},[i("div",{staticClass:"coupon-recerve-text"},[t._v("￥"),i("i",{staticClass:"i1"},[t._v("5")]),t._v("满20元可用")]),i("div",{staticClass:"coupon-recerve-status"},[t._v("已领")])])]),i("div",{staticClass:"coupon-group"},[i("div",{staticClass:"coupon-list"},[t._v("满20减2")]),i("div",{staticClass:"coupon-list"},[t._v("满50减10")]),i("div",{staticClass:"coupon-list"},[t._v("满100减20")])])])]),i("div",{ref:"shopProList",staticClass:"shop-pro-list"},[i("div",{staticClass:"shop-nav"},[i("div",{staticClass:"shop-nav-item",class:{active:0===t.curNav},on:{click:function(e){t.curNav=0}}},[i("span",{staticClass:"con"},[t._v("全部商品")])]),i("div",{staticClass:"shop-nav-item",class:{active:1===t.curNav},on:{click:function(e){t.curNav=1}}},[i("span",{staticClass:"con"},[t._v("店铺介绍")])])]),i("div",{directives:[{name:"show",rawName:"v-show",value:0===t.curNav,expression:"curNav === 0"}],staticClass:"shop-pro-list-content"},[""==t.pageType?i("div",{staticClass:"row top-showdow"},[i("div",{staticClass:"filter-btn theme_font_black",on:{click:function(e){return t.filterEvent(0)}}},[i("span",{class:{theme_standard_font:0==t.filterType}},[t._v("综合排序")])]),i("div",{staticClass:"filter-btn theme_font_black",on:{click:function(e){return t.filterEvent(1)}}},[i("span",{class:{theme_standard_font:1==t.filterType||2==t.filterType}},[t._v("销量")])]),i("div",{staticClass:"filter-btn theme_font_black",on:{click:function(e){return t.filterEvent(2)}}},[i("span",{class:{theme_standard_font:3==t.filterType||4==t.filterType}},[t._v("价格")]),i("div",{directives:[{name:"show",rawName:"v-show",value:3==t.filterType||4==t.filterType,expression:"filterType == 3 || filterType == 4"}]},[i("i",{staticClass:"iconfont mall-sanjiaoxiabiao arrow-icon theme_font_tint",class:{theme_standard_font:3==t.filterType}}),i("i",{staticClass:"iconfont mall-xiala arrow-icon theme_font_tint",class:{theme_standard_font:4==t.filterType}})])]),i("div",{staticClass:"filter-btn theme_font_black",on:{click:t.superFilter}},[i("span",[t._v("筛选")]),i("i",{staticClass:"iconfont mall-shaixuan filter-size theme_font_tint"})])]):t._e(),""!=t.pageType?i("div",{staticClass:"row top-showdow"},[i("div",{staticClass:"filter-btn theme_font_black",on:{click:t.categoryEvent}},[i("span",[t._v(t._s(t.cateText))])]),i("div",{staticClass:"filter-btn theme_font_black",on:{click:function(e){return t.filterEvent(1)}}},[i("span",{class:{theme_font_red:1==t.filterType||2==t.filterType}},[t._v("销量")])]),i("div",{staticClass:"filter-btn theme_font_black",on:{click:function(e){return t.filterEvent(2)}}},[i("span",{class:{theme_font_red:3==t.filterType||4==t.filterType}},[t._v("价格")]),i("div",{directives:[{name:"show",rawName:"v-show",value:3==t.filterType||4==t.filterType,expression:"filterType == 3 || filterType == 4"}]},[i("i",{staticClass:"iconfont mall-sanjiaoxiabiao arrow-icon theme_font_tint",class:{theme_font_red:3==t.filterType}}),i("i",{staticClass:"iconfont mall-xiala arrow-icon theme_font_tint",class:{theme_font_red:4==t.filterType}})])]),i("div",{staticClass:"filter-btn theme_font_black",on:{click:t.superFilter}},[i("span",[t._v("筛选")]),i("i",{staticClass:"iconfont mall-shaixuan filter-size theme_font_tint"})])]):t._e(),i("div",{staticClass:"list-content"},[i("div",{staticClass:"list-pull-to"},[i("scroll",{ref:"scroll",staticClass:"coupon-list",attrs:{hasMore:t.isCanLoadMore,pullUpLoad:!0,listenScroll:!0,data:t.listData,probeType:2},on:{scroll:t.scrollHandler,pullingUp:t._loadProList}},[i("div",[""!=t.pageType&&""!=t.endTime?i("div",{staticClass:"list-tip theme_bg_yl theme_font_red"},[i("p",[t._v("限时促销： "+t._s(t.tipText))]),i("p",[t._v("距离结束： "),i("countdown",{attrs:{endTime:t.endTime}})],1)]):t._e(),t.listData.length>0&&1==t.listStyle?i("CardList",{attrs:{listData:t.listData},on:{productEvent:t.productEvent,addToCart:t.addToCart}}):t._e(),t.listData.length>0&&2==t.listStyle?i("DetailList",{attrs:{listData:t.listData},on:{productEvent:t.productEvent,addToCart:t.addToCart}}):t._e()],1)])],1),t.isNoList&&""==t.pageType?i("div",{staticClass:"no-list"},[i("div",{staticClass:"img-div"},[i("img",{attrs:{src:"static/image/mall2/no-data-img.png"}})]),i("div",{staticClass:"tip theme_font_gray"},[t._v("抱歉没有找到相应商品~")]),i("Recommend")],1):t._e()]),""!=t.pageType?i("div",{staticClass:"activity-btns"},["activity"==t.pageType?i("div",{staticClass:"subtotal-div"},[i("p",[i("span",[t._v("小计：")]),i("span",{staticClass:"theme_font_red"},[t._v("￥"+t._s(t.$util.toDecimal2(t.activityInfo.amount)))])]),i("p",{staticClass:"font-small theme_font_tint"},[i("span",[t._v(t._s(t.activityInfo.activityDiscountDesc))])])]):t._e(),"coupon"==t.pageType?i("div",{staticClass:"subtotal-div"},[i("p",[i("span",[t._v("小计：")]),i("span",{staticClass:"theme_font_red"},[t._v("￥"+t._s(t.$util.toDecimal2(this.cartCanUseCouponAmount)))])]),i("p",{staticClass:"font-small theme_font_tint"},[i("span",[t._v(t._s(t.getCouponTip()))])])]):t._e(),3==t.activityInfo.linkType||4==t.activityInfo.linkType||5==t.activityInfo.linkType||6==t.activityInfo.linkType?i("div",{staticClass:"btn theme_bg_y theme_font_white",on:{click:t.goGift}},[t._v(t._s(t.getGiftText())+" ")]):t._e(),i("div",{staticClass:"btn theme_bg_red theme_font_white",on:{click:t.goCart}},[t._v("去购物车")])]):t._e(),t.showCategory?i("div",{staticClass:"category-div"},[i("Category",{attrs:{cateList:t.cateList},on:{closeEvent:function(e){t.showCategory=!1},cateEvent:t.cateEvent}})],1):t._e()]),i("div",{directives:[{name:"show",rawName:"v-show",value:1===t.curNav,expression:"curNav === 1"}],staticClass:"shop-pro-list-content"},[i("div",{staticClass:"list-content"},[i("div",{staticClass:"list-pull-to"},[i("scroll",{ref:"scroll",attrs:{listenScroll:!0,data:t.listData,probeType:2},on:{scroll:t.scrollHandler}},[i("div",{staticClass:"coupon-group"},[t._l(t.shopDetailMktPros,(function(e){return i("div",{staticClass:"coupon-group-item"},[i("div",{staticClass:"coupon-group-title"},[i("i",{staticClass:"coupon-group-title-tag"},[t._v(t._s(e.activityTag))]),i("span",{staticClass:"coupon-group-title-text"},[t._v(t._s(e.activityTitle))])]),i("div",{staticClass:"coupon-group-pro-list"},[e.searchModel.list.length>0?i("CardList",{attrs:{isOpen:!!e.isOpen,listData:e.searchModel.list},on:{productEvent:t.productEvent,addToCart:t.addToCart}}):t._e()],1),i("div",{staticClass:"open-arrow",class:{active:e.isOpen},on:{click:function(i){return t.openList(e.activityId)}}},[i("i",{staticClass:"iconfont-1 iconfont mall-arrow-down "}),i("i",{staticClass:"iconfont-2 iconfont mall-arrow-down"})])])})),i("div",{staticClass:"no-pro-data"},[t._v("暂无促销活动~")])],2)])],1)])])])]):t._e()]),t.showCreated?i("Filtrate",{directives:[{name:"show",rawName:"v-show",value:t.showFiltrate,expression:"showFiltrate"}],attrs:{category:t.category},on:{filtrateEvent:t.filtrateEvent,closeEvent:t.filtrateCloseEvent}}):t._e()],1)},o=[],a=(i("acd8"),i("b0c0"),i("99af"),i("4160"),i("159b"),i("4795"),i("e42a")),n=i("0d16"),l=i("4fe5"),r=i("2f9a"),c=i("c597"),h=i("8592"),u=i("f648"),p=i("b659"),d=i("69f4"),f=i("947f"),v=i("00d6"),y=i("bba4"),m={name:"list",components:{Countdown:d["default"],CardList:a["a"],DetailList:n["a"],Filtrate:l["a"],GiftList:h["a"],PullTo:u["a"],Category:p["a"],Recommend:f["a"],HorizontalScroll:v["a"],Scroll:y["default"]},data:function(){return{listStyle:1,deliveryTypes:[{text:"配送",fontclass:"mall-peisong",tag:"2"},{text:"自提",fontclass:"mall-ziti",tag:"1"}],selectedType:2,listZitiId:"",filterType:0,category:"",listData:[],showCreated:!1,showFiltrate:!1,filterBrands:[],filterFeatureies:[],pageType:"",activityId:"",couponId:"",subtotal:"0.00",searchKey:"",scrollTopValue1:0,backRefresh:!1,activityInfo:{},cartJS:c["a"],cateLevel:"",nowPage:0,isCanLoadMore:!0,clsType:"1",isFirstEnter:!0,maxPrice:"",minPrice:"",lastPath:"",cateText:"全部分类",showCategory:!1,cateList:[],couFaceValue:"0",couThresholdAmount:"0",cartCanUseCouponAmount:"0",endTime:"",tipText:"",isNoList:!1,shopContentHeight:0,shopDetail:null,shopDetailMktPros:[],curNav:0,couponModels:[]}},mounted:function(){},methods:{getCouponTip:function(){var t=""!=this.cartCanUseCouponAmount?this.cartCanUseCouponAmount:"0";if(parseFloat(t)>parseFloat(this.couThresholdAmount))return"您已可以使用优惠券，优惠"+this.couFaceValue+"元";var e=this.$util.toDecimal2(parseFloat(this.couThresholdAmount)-parseFloat(t));return"还差"+e+"元可以优惠"+this.couFaceValue+"元"},cateEvent:function(t){this.showCreated=!1,this.filterBrands=[],this.filterFeatureies=[],this.showCategory=!1,this.cateText=t.name,this.category=t.id,this.nowPage=0,this.isCanLoadMore=!0,this._loadProList()},categoryEvent:function(){this.showCategory=!this.showCategory},getGiftText:function(){return 3==this.activityInfo.linkType?"选择赠品":4==this.activityInfo.linkType?"选择换购":5==this.activityInfo.linkType?"查看赠品":6==this.activityInfo.linkType?"查看换购":void 0},goCart:function(){1==this.$route.query.fromCart?this.$router.go(-1):this.$router.push({path:"/mall2/cart"})},goGift:function(){var t=c["a"].getGiftIsOnlyScan(this.activityInfo),e=c["a"].getGiftType(this.activityInfo);h["a"].open({listData:this.activityInfo.gift,activityId:this.activityInfo.mktActivityId,sureFunc:this.sureFunc,isScan:t,giftType:e})},sureFunc:function(t){var e=this;this.$Loading.open();var i="/app/json/app_cart/addCart",s={token:this.$store.state.login.token,carts:t,deliveryType:this.selectedType};this.$http.post(i,s).then((function(t){e.$Loading.close();var i=t.data;0==i.status?(e.$store.state.mall2.cartNum=i.data,e.$Toast("添加购物车成功！"),e.deductionCart()):e.$Toast(i.info)}),(function(t){e.$Loading.close(),e.$Toast("请求数据失败！")}))},backEvent:function(){this.$router.go(-1)},toSearchEvent:function(){var t=this;r["a"].open({initData:{barHeight:this.$store.state.barHeight,searchHistory:this.$store.state.mall2.searchHistory},clearSearchHistory:function(){t.$store.state.mall2.searchHistory=[]},searchEvent:function(e){r["a"].close(),t.$mallCommon.pushSearchHistory(e),t.searchKey=e,t.nowPage=0,t.isCanLoadMore=!0,t._loadProList()}})},listStyleEvent:function(){1==this.listStyle?this.listStyle=2:this.listStyle=1},filtrateCloseEvent:function(){this.showFiltrate=!1},selectedTypeEvent:function(t){this.$store.state.mall2.staticDeliverType=t,this.$bridgefunc.vuexStorage(),this.selectedType=t,this.nowPage=0,this.isCanLoadMore=!0,this._loadProList(),this._getCartCount()},filterEvent:function(t){this.showCategory=!1,0==t?this.filterType=0:1==t?2==this.filterType?this.filterType=1:this.filterType=2:2==t&&(3==this.filterType?this.filterType=4:this.filterType=3),this.nowPage=0,this.isCanLoadMore=!0,this._loadProList()},filtrateEvent:function(t){this.showFiltrate=!1,this.filterBrands=[],this.filterFeatureies=[];for(var e=0;e<t.brands.length;e++)this.filterBrands.push(t.brands[e].id);for(var i=0;i<t.featureies.length;i++)this.filterFeatureies.push({id:t.featureies[i].id,featureType:t.featureies[i].featureType});this.maxPrice=t.maxPrice,this.minPrice=t.minPrice,this.nowPage=0,this.isCanLoadMore=!0,this._loadProList()},superFilter:function(){this.showCategory=!1,this.showFiltrate=!0,this.showCreated=!0},_loadProList:function(t){var e=this;this.isNoList=!1,0===this.nowPage&&(this.listData=[]),this.nowPage++,this.$Loading.open();var i="/app/json/product/getAppProSearchList",s={token:this.$store.state.login.token,page:this.nowPage,rows:20,orderByKey:"",ascOrDesc:"",proName:this.searchKey,deliverType:this.selectedType,maxPrice:this.maxPrice,minPrice:this.minPrice,storeOuCode:this.shopDetail.storeCode,pickUpStoreOuCode:this.shopDetail.storeCode,pickUpId:this.shopDetail.id};if(1==this.filterType?(s.orderByKey="1",s.ascOrDesc="0"):2==this.filterType?(s.orderByKey="1",s.ascOrDesc="1"):3==this.filterType?(s.orderByKey="0",s.ascOrDesc="0"):4==this.filterType&&(s.orderByKey="0",s.ascOrDesc="1"),1==this.selectedType){var o=this.$store.state.mall2.zitiAddress;s.pickUpId=o.id}else{var a=this.$store.state.mall2.selectAddress;s.area={provinceId:a.provinceId,cityId:a.cityId,countryId:a.countryId,countyId:a.countryId,townId:a.townId}}this.$http.post(i,s).then((function(i){e.$Loading.close();var s=i.data;0==s.status?(e.listData=e.listData.concat(s.data.list),e.nowPage>=s.data.page.totalPages&&(e.isCanLoadMore=!1)):e.$Toast(s.info),t&&t("done")}),(function(i){t&&t("done"),e.$Loading.close(),e.$Toast("请求数据失败！")}))},productEvent:function(t){var e="/mall2/detail/"+this.$util.getDataString();2==t.productType&&(e="/mall2/ticketdetail"),this.$router.push({path:e,query:{id:t.id,skuId:t.skuId,lastPath:this.$route.path,productType:t.productType}})},_getCartCount:function(){var t=this,e="/app/json/app_cart/getCartCount",i={token:this.$store.state.login.token,deliveryType:this.selectedType};this.$http.post(e,i).then((function(e){var i=e.data;0==i.status?t.$store.state.mall2.cartNum=i.data:t.$Toast(i.info)}),(function(e){t.$Loading.close(),t.$Toast("请求数据失败！")}))},addToCart:function(t){var e=this;this.$Loading.open();var i="/app/json/app_cart/addCart",s={token:this.$store.state.login.token,carts:[{skuId:t.skuId,storeOuCode:t.storeOuCode,activityId:this.activityId,selfActivityId:t.activityId,deliveryType:this.selectedType,number:1}],deliveryType:t.deliverType};this.$http.post(i,s).then((function(t){e.$Loading.close();var i=t.data;0==i.status?(e.$store.state.mall2.cartNum=i.data,e.$Toast("添加购物车成功！"),""==e.pageType?e.$store.state.mall2.cartNum=i.data:e.deductionCart()):e.$Toast(i.info)}),(function(t){e.$Loading.close(),e.$Toast("请求数据失败！")}))},deductionCart:function(){var t=this;if(""!=this.pageType){this.$Loading.open();var e="/app/json/app_cart/DeductionCart",i={token:this.$store.state.login.token,deliveryType:this.selectedType,skuId:this.$route.query.skuId,storeOuCode:this.$route.query.storeOuCode};"coupon"==this.pageType?i.couTypeCode=this.couponId:"activity"==this.pageType&&(i.activityId=this.activityId),this.$http.post(e,i).then((function(e){t.$Loading.close();var i=e.data;0==i.status?(t.activityInfo=i.data.activity,t.cartCanUseCouponAmount=i.data.amount,3!=t.activityInfo.linkType&&4!=t.activityInfo.linkType||t.isFirstEnter&&(t.isFirstEnter=!1,t.goGift()),"activity"==t.pageType?(t.tipText=t.activityInfo.mktActivityTitle,t.endTime=t.$util.getDateFromString(t.activityInfo.endDate)):t.couThresholdAmount>0?t.tipText="以下商品可使用满"+t.couThresholdAmount+"元减"+t.couFaceValue+"元的优惠券":t.tipText="以下商品可使用优惠券减"+t.couFaceValue+"元"):t.$Toast(i.info)}),(function(e){t.$Loading.close(),t.$Toast("请求数据失败！")}))}},selectAddressClick:function(){var t="";2==this.selectedType?t="/mall2/addresslist":(t="/mall2/mypickupaddress",this.backRefresh=!0),this.$router.push({path:t})},scrollHandler:function(t){var e=t.y,i=e+this.shopContentHeight;i<0?i=0:i>this.shopContentHeight&&(i=this.shopContentHeight),this.$refs.shopProList.style.top=i+"px",this.$refs.shopContent.style.opacity=i/this.shopContentHeight},_getStoreDetail:function(t){var e=this;this.$Loading.open();var i="/app/json/app_store/getStoreDetailOnLineActivity",s={token:this.$store.state.login.token,storeOuCode:this.$route.query.storeOuCode};this.$http.post(i,s).then((function(i){var s=i.data;if(e.$Loading.close(),0==s.status){e.shopDetail=s.data||{},e.shopDetailMktPros=e.shopDetail.mktPros||[],e.couponModels=e.shopDetail.couponModels||[];var o="";e.deliveryTypes.forEach((function(t){"2"==t.tag?t.status=e.shopDetail.deliveryStatus:"1"==t.tag&&(t.status=e.shopDetail.selfliftStatus),"1"==t.status&&(o+=t.tag)})),"1"!=o&&"2"!=o||(e.$store.state.mall2.staticDeliverType=o,e.selectedType=e.$store.state.mall2.staticDeliverType),setTimeout((function(){e.initScrollListen()}),300),t||e._loadProList()}else e.$Toast(s.info)}),(function(t){e.$Loading.close(),e.$Toast("请求数据失败！")}))},initScrollListen:function(){var t=document.getElementById("shopContent");this.shopContentHeight=t?t.getBoundingClientRect().height:0,this.$refs.shopProList.style.top=this.shopContentHeight+"px"},openList:function(t){for(var e=0;e<this.shopDetail.mktPros.length;e++)this.shopDetail.mktPros[e].activityId===t&&this.$set(this.shopDetail.mktPros[e],"isOpen",!this.shopDetail.mktPros[e].isOpen);this.$refs.scroll.refresh()},getCoupon:function(t){var e=this;this.$Loading.open();var i={token:this.$store.state.login.token,mktActivityId:t.mktActivityId,couTypeCode:t.couTypeCode,ruleId:t.ruleId};this.$http.post("/app/json/app_market/getCouScanUrl",i).then((function(t){var i=t.data;0==i.status?(e._getStoreDetail(!0),e.$Toast("领取成功")):e.$Toast(i.info),e.$Loading.close()}))}},created:function(){this.lastPath=this.$route.query.lastPath?this.$route.query.lastPath:"",this.searchKey=this.$route.query.searchKey?this.$route.query.searchKey:"",this.category=this.$route.query.category?this.$route.query.category:"",this.cateLevel=this.$route.query.cateLevel?this.$route.query.cateLevel:"",this.pageType=this.$route.query.pageType?this.$route.query.pageType:"",this.activityId=this.$route.query.activity?this.$route.query.activity:"",this.couponId=this.$route.query.coupon?this.$route.query.coupon:"",this.clsType=this.$route.query.clsType?this.$route.query.clsType:"1",this.couThresholdAmount=this.$route.query.couThresholdAmount?this.$route.query.couThresholdAmount:"0",this.couFaceValue=this.$route.query.couFaceValue?this.$route.query.couFaceValue:"0",this.endTime=this.$route.query.endTime?this.$route.query.endTime:"",this.listZitiId=this.$store.state.mall2.zitiAddress.id,this.selectedType=this.$store.state.mall2.staticDeliverType,""==this.couponId&&""==this.activityId||(this.listStyle=2),this.nowPage=0,this._getStoreDetail()},activated:function(){this.$store.state.mall2.staticDeliverType!=this.selectedType?(this.selectedType=this.$store.state.mall2.staticDeliverType,this.backRefresh=!0):1==this.selectedType&&this.listZitiId!=this.$store.state.mall2.zitiAddress.id&&(this.backRefresh=!0),this.backRefresh?(this.backRefresh=!1,this.selectedTypeEvent(this.selectedType)):this.$refs.scroll&&this.$refs.scroll.scrollTo(this.scrollTopValue1)},beforeRouteLeave:function(t,e,i){t.path!=this.lastPath||this.$keepaliveHelper.deleteCache(this),i()}},C=m,g=(i("2a03"),i("0c7c")),A=Object(g["a"])(C,s,o,!1,null,"ca781988",null);e["default"]=A.exports},"297f":function(t,e,i){"use strict";i("6438")},"2a03":function(t,e,i){"use strict";i("3b4b")},"3b4b":function(t,e,i){},"61c8":function(t,e){t.exports="data:image/gif;base64,R0lGODlhZABkAKIEAN7e3rq6uv///5mZmQAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpBRjA4RUZDMDI3MjA2ODExODA4M0Y1OTQyMzVDRDM3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCMzE0Rjk3NDdDRTgxMUUzOUJCRjk0NjAxMUE1NzRBMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCMzE0Rjk3MzdDRTgxMUUzOUJCRjk0NjAxMUE1NzRBMCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDVBMTZDQjczOTIwNjgxMTgwODNGNTk0MjM1Q0QzNzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QUYwOEVGQzAyNzIwNjgxMTgwODNGNTk0MjM1Q0QzNzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+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"},6438:function(t,e,i){},"81d5":function(t,e,i){"use strict";var s=i("7b0b"),o=i("23cb"),a=i("50c4");t.exports=function(t){var e=s(this),i=a(e.length),n=arguments.length,l=o(n>1?arguments[1]:void 0,i),r=n>2?arguments[2]:void 0,c=void 0===r?i:o(r,i);while(c>l)e[l++]=t;return e}},bba4:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{ref:t.wrapperName,staticClass:"list-wrapper"},[s("div",{staticClass:"scroll-content"},[s("div",{ref:"listWrapper",staticClass:"scroll"},[t._t("default"),t.pullUpLoad&&t.data.length?s("div",{staticClass:"pullup-wrapper"},[t.hasMore?s("div",{staticClass:"after-trigger loading"},[s("img",{attrs:{src:i("61c8"),alt:""}}),s("span",{staticClass:"text"},[t._v("加载中...")])]):s("div",{staticClass:"before-trigger loading"},[s("span",{staticClass:"text"},[t._v(t._s(t.noMoreText))])])]):t._e()],2)]),t.pullDownRefresh?s("div",{ref:"pulldown",staticClass:"pulldown-wrapper",style:t.pullDownStyle},[t.beforePullDown?s("div",{staticClass:"before-trigger"},[s("bubble",{attrs:{y:t.bubbleY}})],1):s("div",{staticClass:"after-trigger"},[t.isPullingDown?s("div",{staticClass:"loading"},[s("img",{attrs:{src:i("61c8"),alt:""}})]):s("div",[s("span",[t._v(t._s(t.refreshTxt))])])])]):t._e()])},o=[],a=(i("a9e3"),i("6eba"),i("0d03"),i("d3b7"),i("4795"),i("1fba")),n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("canvas",{ref:"bubble",style:t.style,attrs:{width:t.width,height:t.height}})},l=[],r=(i("99af"),i("cb29"),{props:{y:{type:Number,default:0}},data:function(){return{width:50,height:80}},computed:{distance:function(){return Math.max(0,Math.min(this.y*this.ratio,this.maxDistance))},style:function(){return"width:".concat(this.width/this.ratio,"px;height:").concat(this.height/this.ratio,"px")}},created:function(){this.ratio=window.devicePixelRatio,this.width*=this.ratio,this.height*=this.ratio,this.initRadius=18*this.ratio,this.minHeadRadius=12*this.ratio,this.minTailRadius=5*this.ratio,this.initArrowRadius=10*this.ratio,this.minArrowRadius=6*this.ratio,this.arrowWidth=3*this.ratio,this.maxDistance=40*this.ratio,this.initCenterX=25*this.ratio,this.initCenterY=25*this.ratio,this.headCenter={x:this.initCenterX,y:this.initCenterY}},mounted:function(){this._draw()},methods:{_draw:function(){var t=this.$refs.bubble,e=t.getContext("2d");e.clearRect(0,0,t.width,t.height),this._drawBubble(e),this._drawArrow(e)},_drawBubble:function(t){t.save(),t.beginPath();var e=this.distance/this.maxDistance,i=this.initRadius-(this.initRadius-this.minHeadRadius)*e;this.headCenter.y=this.initCenterY-(this.initRadius-this.minHeadRadius)*e,t.arc(this.headCenter.x,this.headCenter.y,i,0,Math.PI,!0);var s=this.initRadius-(this.initRadius-this.minTailRadius)*e,o={x:this.headCenter.x,y:this.headCenter.y+this.distance},a={x:o.x-s,y:o.y},n={x:a.x,y:a.y-this.distance/2};t.quadraticCurveTo(n.x,n.y,a.x,a.y),t.arc(o.x,o.y,s,Math.PI,0,!0);var l={x:this.headCenter.x+i,y:this.headCenter.y},r={x:o.x+s,y:l.y+this.distance/2};t.quadraticCurveTo(r.x,r.y,l.x,l.y),t.fillStyle="rgb(170,170,170)",t.fill(),t.strokeStyle="rgb(153,153,153)",t.stroke(),t.restore()},_drawArrow:function(t){t.save(),t.beginPath();var e=this.distance/this.maxDistance,i=this.initArrowRadius-(this.initArrowRadius-this.minArrowRadius)*e;t.arc(this.headCenter.x,this.headCenter.y,i-(this.arrowWidth-e),-Math.PI/2,0,!0),t.arc(this.headCenter.x,this.headCenter.y,i,0,3*Math.PI/2,!1),t.lineTo(this.headCenter.x,this.headCenter.y-i-this.arrowWidth/2+e),t.lineTo(this.headCenter.x+2*this.arrowWidth-2*e,this.headCenter.y-i+this.arrowWidth/2),t.lineTo(this.headCenter.x,this.headCenter.y-i+3*this.arrowWidth/2-e),t.fillStyle="rgb(255,255,255)",t.fill(),t.strokeStyle="rgb(170,170,170)",t.stroke(),t.restore()}},watch:{y:function(){this._draw()}}}),c=r,h=i("0c7c"),u=Object(h["a"])(c,n,l,!1,null,"791c42b1",null),p=u.exports,d="scroll",f="horizontal",v="vertical",y={name:d,props:{data:{type:Array,default:function(){return[]}},probeType:{type:Number,default:1},click:{type:Boolean,default:!0},listenScroll:{type:Boolean,default:!1},listenBeforeScroll:{type:Boolean,default:!1},listenScrollEnd:{type:Boolean,default:!1},direction:{type:String,default:v},scrollbar:{type:null,default:!1},pullDownRefresh:{type:null,default:!1},pullUpLoad:{type:null,default:!1},hasMore:{type:Boolean,default:!0},startY:{type:Number,default:0},refreshDelay:{type:Number,default:20},freeScroll:{type:Boolean,default:!1},mouseWheel:{type:Boolean,default:!1},bounce:{default:!0},zoom:{default:!1}},data:function(){return{beforePullDown:!0,isRebounding:!1,isPullingDown:!1,isPullUpLoad:!1,pullDownStyle:"",bubbleY:0}},computed:{noMoreText:function(){return this.pullUpLoad&&this.pullUpLoad.txt&&this.pullUpLoad.txt.noMore||"没有更多数据了"},refreshTxt:function(){return this.pullDownRefresh&&this.pullDownRefresh.txt||"下拉刷新"},wrapperName:function(){return"wrapper_".concat(Date.now())}},created:function(){this.pullDownInitTop=-50,this.pullDownStyle="top:".concat(this.pullDownInitTop,"px")},mounted:function(){this.$nextTick(this.initScroll)},destroyed:function(){this.forceUpdate(),this.scroll&&this.destroy()},methods:{initScroll:function(){var t=this;if(this.scroll&&this.destroy(),this.$refs[this.wrapperName]){var e={probeType:this.probeType,click:this.click,scrollY:this.freeScroll||this.direction===v,scrollX:this.freeScroll||this.direction===f,scrollbar:this.scrollbar,pullDownRefresh:this.pullDownRefresh,pullUpLoad:this.pullUpLoad,startY:this.startY,freeScroll:this.freeScroll,mouseWheel:this.mouseWheel,bounce:this.bounce,zoom:this.zoom,preventDefaultException:{className:/(^|\s)swiper-img(\s|$)/}};this.scroll=new a["a"](this.$refs[this.wrapperName],e),this.listenScroll&&this.scroll.on("scroll",(function(e){t.$emit("scroll",e)})),this.listenScrollEnd&&this.scroll.on("scrollEnd",(function(e){t.$emit("scroll-end",e)})),this.listenBeforeScroll&&(this.scroll.on("beforeScrollStart",(function(){t.$emit("beforeScrollStart")})),this.scroll.on("scrollStart",(function(){t.$emit("scroll-start")}))),this.pullDownRefresh&&this._initPullDownRefresh(),this.pullUpLoad&&this._initPullUpLoad()}},disable:function(){this.scroll&&this.scroll.disable()},enable:function(){this.scroll&&this.scroll.enable()},refresh:function(){this.scroll&&this.scroll.refresh()},scrollTo:function(){this.scroll&&this.scroll.scrollTo.apply(this.scroll,arguments)},scrollToElement:function(){this.scroll&&this.scroll.scrollToElement.apply(this.scroll,arguments)},clickItem:function(t,e){this.$emit("click",e)},destroy:function(){this.scroll.destroy()},pullUpFinished:function(){this.isPullUpLoad=!1,this.scroll.finishPullUp(),this.refresh()},forceUpdate:function(t){var e=this;this.pullDownRefresh&&this.isPullingDown?(this.isPullingDown=!1,this._reboundPullDown().then((function(){e._afterPullDown()}))):this.pullUpLoad&&this.isPullUpLoad?(this.isPullUpLoad=!1,this.scroll.finishPullUp(),this.refresh()):this.refresh()},_initPullDownRefresh:function(){var t=this;this.scroll.on("pullingDown",(function(){t.beforePullDown=!1,t.isPullingDown=!0,t.$emit("pullingDown")})),this.scroll.on("scroll",(function(e){t.pullDownRefresh&&(t.beforePullDown?(t.bubbleY=Math.max(0,e.y+t.pullDownInitTop),t.pullDownStyle="top:".concat(Math.min(e.y+t.pullDownInitTop,10),"px")):t.bubbleY=0,t.isRebounding&&(t.pullDownStyle="top:".concat(10-(t.pullDownRefresh.stop-e.y),"px")))}))},_initPullUpLoad:function(){var t=this;this.scroll.on("pullingUp",(function(){t.isPullUpLoad=!0,t.hasMore&&t.$emit("pullingUp")}))},_reboundPullDown:function(){var t=this,e=this.pullDownRefresh.stopTime,i=void 0===e?600:e;return new Promise((function(e){setTimeout((function(){t.isRebounding=!0,t.scroll.finishPullDown(),e()}),i)}))},_afterPullDown:function(){var t=this;setTimeout((function(){t.pullDownStyle="top:".concat(t.pullDownInitTop,"px"),t.beforePullDown=!0,t.isRebounding=!1,t.refresh()}),this.scroll.options.bounceTime)},_getRect:function(t){if(t instanceof window.SVGElement){var e=t.getBoundingClientRect();return{top:e.top,left:e.left,width:e.width,height:e.height}}return{top:t.offsetTop,left:t.offsetLeft,width:t.offsetWidth,height:t.offsetHeight}},openPullUp:function(){this.scroll.openPullUp()},closePullUp:function(){this.scroll.closePullUp()}},watch:{data:{handler:function(){var t=this;setTimeout((function(){t.forceUpdate(!0),t.$refs.listWrapper&&(t.pullDownRefresh||t.pullUpLoad)&&(t.$refs.listWrapper.style.minHeight="".concat(t.$refs[t.wrapperName].clientHeight+1,"px"))}),this.refreshDelay)},deep:!0},hasMore:function(t){var e=this;t||setTimeout((function(){e.forceUpdate(),e.closePullUp()}),this.refreshDelay)}},components:{Bubble:p}},m=y,C=(i("11b7"),Object(h["a"])(m,s,o,!1,null,"566def9c",null));e["default"]=C.exports},cb29:function(t,e,i){var s=i("23e7"),o=i("81d5"),a=i("44d2");s({target:"Array",proto:!0},{fill:o}),a("fill")},e919:function(t,e,i){}}]);
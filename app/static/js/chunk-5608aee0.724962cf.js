(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5608aee0"],{"00d6":function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{ref:"scroll",staticClass:"scroll-wrapper",on:{touchstart:t.touchstart}},[s("div",{ref:"scrollContent",staticClass:"scroll-content"},[t._t("default")],2)])},i=[],r=(s("a9e3"),s("4795"),s("1fba"));s("4de4"),s("4160"),s("159b");function o(t,e){var s,a,i,r={absolute:!1,clone:!1,includeMargin:!1,display:"block"},o=[],l="";s=function(){var e=[];n(t,e),e.push(t),i=e.filter((function(t){return"none"===c(t,"display")})),l+="visibility: hidden !important; display: "+r.display+" !important; ",!0===r.absolute&&(l+="position: absolute !important; "),i.forEach((function(t,e){var s=t.getAttribute("style");o.push(s),t.setAttribute("style",s?s+";"+l:l)}))},a=function(){i.forEach((function(t,e){var s=o[e];void 0===s?t.removeAttribute("style"):t.setAttribute("style",s)}))},s();var d=0;return"width"==e?d=t.clientWidth:"height"==e&&(d=t.clientHeight),a(),d}function n(t,e){t&&t.parentElement&&(e.push(t.parentNode),n(t.parentElement,e))}function c(t,e){return t.style[e]?t.style[e]:t.currentStyle?t.currentStyle[e]:window.getComputedStyle(t,null)[e]}var l=o,d={name:"",props:{dataList:{type:Array,default:function(){return[]}},click:{type:Boolean,default:!0},percentWidth:{type:Number,default:0}},data:function(){return{}},mounted:function(){this._refresh()},methods:{touchstart:function(t){},disable:function(){this.scroll&&this.scroll.disable()},enable:function(){this.scroll&&this.scroll.enable()},_refresh:function(){var t=this;this.$nextTick((function(){setTimeout((function(){t._setWidth(),t._initScroll()}),200)}))},_setWidth:function(){if(this.$refs.scrollContent){for(var t=this.$refs.scrollContent.children,e=this.$refs.scroll.clientWidth,s=0,a=0;a<t.length;a++){var i=t[a];this.percentWidth&&(i.style.width=e*this.percentWidth/100+"px"),s+=l(i,"width")}this.$refs.scrollContent.style.width=s+10+"px"}},_initScroll:function(){this.$refs.scroll&&(this.scroll=new r["a"](this.$refs.scroll,{scrollX:!0,scrollY:!1,click:this.click,preventDefault:!1}))}},components:{},watch:{dataList:{handler:function(t){t&&t.length&&this._refresh()},immediate:!0}}},u=d,p=(s("297f"),s("0c7c")),m=Object(p["a"])(u,a,i,!1,null,"77eb9db6",null);e["a"]=m.exports},"1de8":function(t,e,s){"use strict";s("d537d")},"297f":function(t,e,s){"use strict";s("6438")},6438:function(t,e,s){},"959f":function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"product-list"},[s("div",{staticClass:"wrapper"},[s("div",{staticClass:"scroll"},[s("div",{staticClass:"layout-grid good-list",style:t.getSideMargin()},t._l(t.moduleData.rows,(function(e,a){return s("div",{staticClass:"goods",class:{"no-stock":"0"==e.stockNum&&"1"==t.$store.state.globalConfig.showNoStockCover,"row-three-pro":1==t.moduleData.rowThreeProduct},on:{click:function(s){return t.enterNav(e)}}},[s("div",{staticClass:"goods-picture"},[s("img",{staticClass:"full-img",attrs:{src:e.phMainUrl?e.phMainUrl+"?x-oss-process=image/format,jpg":"static/images/defaultImg_w.png"}}),e.cornerMark>0?s("div",{staticClass:"corner-mark"},[s("img",{attrs:{src:t._f("counerMarkUrl")(e)}})]):t._e()]),"1"==t.moduleData.layout.hasTitle?s("div",{staticClass:"goods-name double-line",domProps:{innerHTML:t._s(e.showTitle)}}):t._e(),e.activityTags.length>0?s("div",{staticClass:"activity-tags"},t._l(e.activityTags,(function(e){return s("div",{staticClass:"tag single-line"},[t._v(t._s(e))])})),0):t._e(),s("div",{staticClass:"goods-footer"},["1"==t.moduleData.layout.hasPrice?s("div",{staticClass:"price"},[s("PriceOrder",{attrs:{listitem:e,isRMBEnd:t.isRMBEnd}})],1):t._e(),"1"==t.moduleData.layout.btnType?s("div",{staticClass:"icon"},[2!=e.productType&&-1==t.$store.state.webtype?s("img",{attrs:{src:"static/images/product-list/icon_gods_car01.png"}}):2!=e.productType?s("i",{staticClass:"iconfont mall-gouwuche theme_font_red car-size",class:{theme_font_gray_i:"0"==e.stockNum},on:{click:function(s){return s.stopPropagation(),t.addToCart(e)}}}):t._e()]):t._e(),"2"==t.moduleData.layout.btnType?s("div",{staticClass:"icon"},[s("img",{attrs:{src:"static/images/product-list/icon_gods_car02.png"}})]):t._e(),"3"==t.moduleData.layout.btnType?s("div",{staticClass:"icon"},[s("img",{attrs:{src:"static/images/product-list/icon_gods_car03.png"}})]):t._e(),"4"==t.moduleData.layout.btnType?s("div",{staticClass:"icon"},[s("img",{attrs:{src:"static/images/product-list/icon_gods_car04.png"}})]):t._e(),"5"==t.moduleData.layout.btnType?s("div",{staticClass:"icon"},[s("img",{attrs:{src:"static/images/product-list/icon_gods_car05.png"}})]):t._e()])])})),0)])])])},i=[],r=(s("4160"),s("159b"),s("590c")),o={name:"product-list-grid",components:{PriceOrder:r["a"]},props:["myIndex","usePorpData","propData","isRMBEnd"],computed:{pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.pageData},moduleData:function(){return-1==this.myIndex?this.pageData.productInfinite.data:this.pageData.moduleList[this.myIndex].data},dev:function(){return"-1"===this.$store.state.webtype}},data:function(){return{}},created:function(){this.testCorerMark()},filters:{counerMarkUrl:function(t){return t.cornerMark<6?"static/images/product-list/icon_gods_hot0".concat(t.cornerMark,".png"):t.selfCornerMarkUrl}},methods:{testCorerMark:function(){var t=this;this.moduleData.rows.forEach((function(e){!e.cornerMark&&t.$set(e,"cornerMark",0),!e.selfCornerMarkUrl&&t.$set(e,"selfCornerMarkUrl","")}))},getSideMargin:function(){var t=this.moduleData.sideMargin;if(t){var e="margin-left:"+t+"%;";return e+="margin-right:"+t+"%;",e}return""},enterNav:function(t){this.$market.productEvent(t,this.$route,this.moduleData.onlyDeliveryType)},addToCart:function(t){var e=this;this.$Loading.open();var s="/app/json/app_cart/addCart",a={token:this.$store.state.login.token,carts:[{skuId:t.skuId,storeOuCode:t.storeOuCode,activityId:"",selfActivityId:t.activityId,deliveryType:this.$store.state.mall2.staticDeliverType,number:1}],orderCategory:void 0,vipUnitUserCode:void 0,deliveryType:t.deliverType};this.$http.post(s,a).then((function(t){e.$Loading.close();var s=t.data;0==s.status?(e.$store.state.mall2.cartNum=s.data,e.$toast("添加购物车成功！")):e.$Toast(s.info)}),(function(t){e.$Loading.close(),e.$Toast("请求数据失败！")}))}}},n=o,c=(s("de15"),s("0c7c")),l=Object(c["a"])(n,a,i,!1,null,"330bef07",null);e["a"]=l.exports},"9ffe":function(t,e,s){},d537d:function(t,e,s){},de15:function(t,e,s){"use strict";s("9ffe")},e14c:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("div",{staticClass:"product-list",style:t.$market.getModuleBgStyle(t.moduleData)},[s("HScroll",{attrs:{dataList:t.moduleData.tabs,click:!1}},t._l(t.moduleData.tabs,(function(e,a){return s("div",{key:a,staticClass:"tab",class:{selected:t.selectedId==a},on:{click:function(s){return t.selectChannel(e,a)}}},[s("div",{staticClass:"tab-cont",class:{"left-bdr":0!=a}},[s("div",{staticClass:"title"},[t._v(t._s(e.title))]),s("div",{staticClass:"line"})])])})),0),s("HScroll",{attrs:{dataList:t.sections,click:!1}},t._l(t.sections,(function(e,a){return s("div",{key:a,staticClass:"section",on:{click:function(e){return t.sectionEvent(a)}}},[s("div",{staticClass:"btn line_circle",class:{selected:t.sectionIdx==a}},[t._v(t._s(e.name))])])})),0),t.showTip?s("div",{staticClass:"tip theme_bg_yl theme_font_red"},[t._v("活动已结束，以下商品将会以原价进行购买")]):t._e(),t.dataLoaded&&0==t.moduleData.rows.length?s("div",{staticClass:"no-products"},[t._m(0),s("div",{staticClass:"tip theme_font_gray"},[t._v("抱歉没有找到相应商品~")])]):t._e(),"1"==t.moduleData.type?s("ProductListGrid",{attrs:{myIndex:t.myIndex,usePorpData:t.usePorpData,propData:t.propData}}):t._e()],1)])},i=[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"img-div"},[s("img",{attrs:{src:"static/image/mall2/no-data-img.png"}})])}],r=(s("e25e"),s("0d03"),s("99af"),s("ac1f"),s("5319"),s("959f")),o=s("00d6"),n={name:"product-tabs",components:{ProductListGrid:r["a"],HScroll:o["a"]},props:["myIndex","usePorpData","propData"],computed:{pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.pageData},moduleData:function(){return this.pageData.moduleList[this.myIndex].data}},data:function(){return{page:1,showTip:!1,deliveryTypes:[{text:"配送",fontclass:"mall-peisong",tag:"2"},{text:"自提",fontclass:"mall-ziti",tag:"1"}],dataLoaded:!1,filterType:0,cateText:"全部分类",cateData:null,filterBrands:[],filterFeatureies:[],maxPrice:"",minPrice:"",selectedItem:{},selectedId:0,sectionIdx:0,sections:[{name:"全部",min:"",max:""},{name:"0-500",min:"0",max:"500"},{name:"500-1000",min:"500",max:"1000"},{name:"1000-2000",min:"1000",max:"2000"},{name:"2000-5000",min:"2000",max:"5000"},{name:"5000-10000",min:"5000",max:"10000"},{name:"10000以上",min:"10000",max:""}],selectedSection:{},allProducts:[]}},methods:{sectionEvent:function(t){this.sectionIdx=t,this.selectedSection=this.sections[t],this.screenProducts()},screenProducts:function(){if(0!=this.sectionIdx){for(var t=[],e=0;e<this.allProducts.length;e++){var s=this.allProducts[e],a=s.points,i=this.selectedSection.min,r=this.selectedSection.max;i&&r?a>=i&&a<=r&&t.push(s):i&&a>=i&&t.push(s)}this.moduleData.rows=t}else this.moduleData.rows=this.allProducts},selectChannel:function(t,e){this.selectedId=e,this.selectedItem=t,this.getProducts()},getProducts:function(){this._getCurrentDatas()},_getCurrentDatas:function(){var t=this,e=this.$market.apiBaseURL()+"/app/json/product/getAppProSearchList",s={token:this.$store.state.login.token,brandIds:this.filterBrands,featureIds:this.filterFeatureies,maxPrice:this.maxPrice,minPrice:this.minPrice,page:1,rows:100};if(s.rows=this.selectedItem.productFrom.number,1==this.selectedItem.useApi){var a=this.selectedItem.productFrom.cate;s.clsType=a.clsType,s.categoryId=a.id,s.cateLevel=a.cateLevel}else if(2==this.selectedItem.useApi){var i=this.selectedItem.productFrom.activity;s.activityId=i.activityId}if(s.deliverType=this.$store.state.mall2.staticDeliverType,1==s.deliverType)s.pickUpId=this.$store.state.mall2.zitiAddress.id,s.pickupStoreOuCode=this.$store.state.mall2.zitiAddress.storeCode;else{var r=this.$store.state.mall2.selectAddress;s.area={provinceId:r.provinceId,cityId:r.cityId,countryId:r.countryId,countyId:r.countryId,townId:r.townId}}"-1"!=this.$store.state.webtype&&this.$Loading.open(),this.$http.post(e,s).then((function(e){"-1"!=t.$store.state.webtype&&t.$Loading.close(),t.dataLoaded=!0;var s=e.data;if(0==s.status){var a=s.data.list;if(1==t.page){t.moduleData.rows=[];for(var i=0;i<a.length;i++){var r=t.$market.dataProcessing(a[i]);t.moduleData.rows.push(r)}if(t.allProducts=t.moduleData.rows,3==t.selectedItem.useApi&&t.moduleData.rows.length>0){var o=t.moduleData.rows[0],n=o.mktEndDate;if(n&&void 0!=n&&""!=n){var c=t.getDateFromString(n),l=parseInt((new Date).getTime()/1e3);t.showTip=0==c||c<l}}t.sectionEvent(0)}else{for(var d=[],u=0;u<a.length;u++){var p=t.$market.dataProcessing(a[u]);d.push(p)}t.moduleData.rows=t.moduleData.rows.concat(d)}a.length>=10?t.$emit("loadedEvent",!0):t.$emit("loadedEvent",!1)}else t.page--,t.$emit("loadedEvent",!1)}),(function(e){"-1"!=t.$store.state.webtype&&t.$Loading.close(),t.page--,t.$emit("loadedEvent",!1)}))},getDateFromString:function(t){return""==t||null==t||void 0==t?0:(t=t.replace(/-/g,"/"),parseInt(new Date(t).getTime()/1e3))}},created:function(){this.moduleData.rows=[];var t=this.moduleData.tabs[0];this.selectChannel(t,0)}},c=n,l=(s("1de8"),s("0c7c")),d=Object(l["a"])(c,a,i,!1,null,"50645a98",null);e["default"]=d.exports}}]);
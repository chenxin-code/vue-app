(window.webpackJsonp=window.webpackJsonp||[]).push([[499],{Fmft:function(t,e,i){"use strict";i.r(e);var s=i("oCAZ"),a=i("hlqo"),n=i("A+eP"),l={name:"detail",components:{},data:function(){var t=this;return{id:"",detailData:{},loaded:!1,proImgIndex:0,swiperOption:{autoHeight:!1,spaceBetween:0,speed:500,autoplay:{delay:3e3,clickable:!0,disableOnInteraction:!1},loop:!0,paginationShow:!0,initialSlide:0,observer:!0,observeParents:!0,scrollbarDraggable:!0,scrollbarSnapOnRelease:!0,scrollbarHide:!1,on:{slideChange:function(){t.proImgIndex=this.realIndex}}},selectedNum:1,introductionIndex:1,introduction1:"",introduction2:"",introduction3:"",showPop:!1,deliverType:this.$store.state.mall2.staticDeliverType}},methods:{selectPickUpAddress:function(){var t=this;n.a.open({initData:{selectedId:this.$store.state.mall2.zitiAddress.id,token:this.$store.state.login.token,posx:this.$store.state.currentLocation.posx,posy:this.$store.state.currentLocation.posy,skuIds:[this.detailData.id]},addressEvent:function(e){n.a.close(),e&&(t.$store.state.mall2.zitiAddress=e,t.$bridgefunc.vuexStorage(),t.$userCenter._setDefaultPickupAddress(e.id))},otherAddressEvent:function(){var e=[t.detailData.id];t.$router.push({path:"/mall2/selfliftingsite",query:{skuIds:JSON.stringify(e)}}),n.a.close()}})},selectArea:function(){var t=this;a.a.open({initData:{selectedId:this.$store.state.mall2.selectAddress.id,token:this.$store.state.login.token},addressEvent:function(e,i){t.$store.state.mall2.selectAddress=e,t.$bridgefunc.vuexStorage(),a.a.close()}})},numChange:function(){this.generateSelectedText()},popClose:function(){this.showPop=!1},popSureEvent:function(){for(var t=this.detailData.purPriceRules,e=this.detailData.minPurNumber,i=this.detailData.minPurPrice,s=0;s<t.length;s++){var a=t[s],n=a.number,l=a.price;this.selectedNum>=n&&n>e&&(e=n,i=l)}this.$router.push({path:"/mall2/purchaseplace",query:{id:this.id,number:this.selectedNum,img:this.detailData.picMainUrl,showTitle:this.detailData.showTitle,price:i}})},backEvent:function(){this.$router.go(-1)},introductionSelected:function(t){this.introductionIndex=t},generateSelectedText:function(){this.selectedText="",this.selectedText+=this.selectedNum+(this.detailData.metric?this.detailData.metric:"件")},proSelectEvent:function(){this.showPop=!0},getPrices:function(){return s.a.getPriceShow(this.detailData.purPriceRules)},getProductImgs:function(){return this.detailData.picUrlJson.split(",")},showBigImageEvent:function(){},getPurchaseDetail:function(){var t=this,e={id:this.id};this.$Loading.open(),this.$http.post("/app/json/pro_sku_purchase/queryPurchaseDetail",e).then((function(e){t.$Loading.close();var i=e.data;0==i.status?(t.detailData=i.data,t.selectedNum=t.detailData.minPurNumber,t.introduction1=t.detailData.proSkuMedia.mobileDetail,t.introduction2=t.detailData.proSkuMedia.mobileParam,t.introduction3=t.detailData.afterHelp,t.generateSelectedText(),t.loaded=!0):t.$Toast(i.info)}),(function(e){t.$Loading.close(),t.$Toast("请求数据失败！")}))}},created:function(){this.id=this.$route.query.id,this.getPurchaseDetail()},beforeRouteLeave:function(t,e,i){"/mall2/purchaseplace"==t.path||"/mall2/selfliftingsite"==t.path||this.$keepaliveHelper.deleteCache(this),i()}},o=(i("GE+f"),i("KHd+")),c=Object(o.a)(l,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"detail mall2"},[t.loaded?i("div",{staticClass:"detail-content"},[i("div",{staticClass:"nav-top",style:{top:t.$store.state.barHeight+"px",height:t.$market.getNavHeight(!0)+"px","line-height":t.$market.getNavHeight(!0)+"px"}},[i("div",{staticClass:"nav-back-btn",staticStyle:{left:"10px",top:"5px",width:"34px",height:"34px",padding:"5px"},on:{click:t.backEvent}},[i("img",{staticStyle:{display:"block",width:"100%",height:"100%"},attrs:{src:"static/image/mall2/back.png"}})])]),t._v(" "),i("div",{staticClass:"scroll-div",style:{top:t.$store.state.barHeight+"px"}},[i("div",{staticClass:"swiper-div theme_bg_white",on:{click:t.showBigImageEvent}},[i("swiper",{attrs:{options:t.swiperOption}},t._l(t.getProductImgs(),(function(t,e){return i("swiper-slide",{key:e},[i("div",{staticClass:"swiper-img-div"},[i("img",{attrs:{src:t}})])])})),1),t._v(" "),i("div",{staticClass:"swiper-index"},t._l(t.getProductImgs(),(function(e,s){return i("div",{staticClass:"si-item theme_bg_white_ef",class:{"cus-index":t.proImgIndex==s,theme_bg_red_i:t.proImgIndex==s}})})),0)],1),t._v(" "),i("div",{staticClass:"pro-info"},[i("div",{staticClass:"price theme_font_red"},t._l(t.getPrices(),(function(e,s){return i("div",{staticClass:"price-item"},[0!=s?i("p",{staticClass:"xian"},[t._v(" ~ ")]):t._e(),t._v(" "),i("p",[t._v("¥")]),t._v(" "),i("p",{staticClass:"big"},[t._v(t._s(e.iNum)+".")]),t._v(" "),i("p",[t._v(t._s(e.dNum))])])})),0),t._v(" "),i("p",{staticClass:"title single-line"},[t._v(t._s(t.detailData.showTitle))]),t._v(" "),i("p",{staticClass:"theme_font_gray"},[t._v("起购数量："+t._s(t.detailData.minPurNumber))])]),t._v(" "),i("div",{staticClass:"block-div theme_bg_white"},[t._m(0),t._v(" "),t._l(t.detailData.purPriceRules,(function(e){return i("div",{staticClass:"flex-row"},[i("div",{staticClass:"theme_font_common full"},[t._v("购买数量 "+t._s(e.number))]),t._v(" "),i("div",{staticClass:"theme_font_common"},[t._v("售价： ")]),t._v(" "),i("div",{staticClass:"theme_font_red"},[t._v(" ¥"+t._s(t.$util.toDecimal2(e.price)))])])}))],2),t._v(" "),i("div",{staticClass:"block-div theme_bg_white"},[i("div",{staticClass:"flex-row",on:{click:t.proSelectEvent}},[i("div",{staticClass:"label-min theme_font_gray"},[t._v("已选")]),t._v(" "),i("div",{staticClass:"theme_font_black",staticStyle:{"font-weight":"500"}},[t._v(t._s(t.selectedText))]),t._v(" "),i("div",{staticClass:"full"}),t._v(" "),t._m(1)])]),t._v(" "),"2"==t.deliverType?i("div",{staticClass:"block-div theme_bg_white"},[i("div",{staticClass:"flex-row",staticStyle:{"align-items":"flex-start"},on:{click:t.selectArea}},[i("div",{staticClass:"label-min theme_font_gray"},[t._v("送至")]),t._v(" "),""==t.$store.state.mall2.selectAddress.id?i("div",{staticClass:"theme_font_black full address-div"},[t._v("\n            请选择配送区域\n          ")]):t._e(),t._v(" "),""!=t.$store.state.mall2.selectAddress.id?i("div",{staticClass:"theme_font_black full address-div"},[t._v("\n            "+t._s(t.$store.state.mall2.selectAddress.addressFull)+"\n          ")]):t._e(),t._v(" "),t._m(2)])]):t._e(),t._v(" "),"1"==t.deliverType?i("div",{staticClass:"block-div theme_bg_white"},[i("div",{staticClass:"flex-row",staticStyle:{"align-items":"flex-start"},on:{click:t.selectPickUpAddress}},[i("div",{staticClass:"label-middle theme_font_gray"},[t._v("自提点")]),t._v(" "),i("div",{staticClass:"theme_font_black full"},[t._v(t._s(t.$store.state.mall2.zitiAddress.storeName))]),t._v(" "),t._m(3)])]):t._e(),t._v(" "),i("div",{staticClass:"btns-div theme_bg_white"},[i("div",{staticClass:"btn-item theme_font_gray",class:{theme_font_red_i:1==t.introductionIndex},on:{click:function(e){return t.introductionSelected(1)}}},[t._v("商品介绍\n        ")]),t._v(" "),i("div",{staticClass:"btn-item theme_font_gray",class:{theme_font_red_i:2==t.introductionIndex},on:{click:function(e){return t.introductionSelected(2)}}},[t._v("规格参数\n        ")]),t._v(" "),i("div",{staticClass:"btn-item theme_font_gray",class:{theme_font_red_i:3==t.introductionIndex},on:{click:function(e){return t.introductionSelected(3)}}},[t._v("售后包装\n        ")])]),t._v(" "),i("div",{staticClass:"detail-detail"},[1==t.introductionIndex?i("div",{staticClass:"introduction-div",domProps:{innerHTML:t._s(t.introduction1)}}):t._e(),t._v(" "),2==t.introductionIndex?i("div",{staticClass:"introduction-div",domProps:{innerHTML:t._s(t.introduction2)}}):t._e(),t._v(" "),3==t.introductionIndex?i("div",{staticClass:"introduction-div",domProps:{innerHTML:t._s(t.introduction3)}}):t._e()])]),t._v(" "),i("div",{staticClass:"detail-bottom-btn theme_bg_y",on:{click:function(e){t.showPop=!0}}},[t._v("立即购买")])]):t._e(),t._v(" "),t.showPop?i("pop-view",{on:{closeEvent:t.popClose}},[i("div",{staticClass:"pop-body"},[i("div",{staticClass:"pro-row"},[i("div",{staticClass:"img-div"},[i("img",{attrs:{src:t.detailData.picMainUrl}})]),t._v(" "),i("div",{staticClass:"info-div"},[i("div",{staticClass:"title theme_font_black"},[t._v(t._s(t.detailData.showTitle))]),t._v(" "),i("div",{staticClass:"price theme_font_red"},t._l(t.getPrices(),(function(e,s){return i("div",{staticClass:"price-item"},[0!=s?i("span",{staticClass:"xian"},[t._v(" ~ ")]):t._e(),t._v(" "),i("span",[t._v("¥")]),t._v(" "),i("span",{staticClass:"big"},[t._v(t._s(e.iNum)+".")]),t._v(" "),i("span",[t._v(t._s(e.dNum))])])})),0)])]),t._v(" "),i("div",{staticClass:"pop-scroll-div"},[i("div",{staticClass:"block-div theme_bg_white",staticStyle:{margin:"0",padding:"8px","box-shadow":"none"}},[i("div",{staticClass:"flex-row"},[i("div",{staticClass:"theme_font_gray full"},[t._v("采购价格说明")])]),t._v(" "),t._l(t.detailData.purPriceRules,(function(e){return i("div",{staticClass:"flex-row"},[i("div",{staticClass:"theme_font_common full"},[t._v("购买数量 "+t._s(e.number))]),t._v(" "),i("div",{staticClass:"theme_font_common"},[t._v("售价： ")]),t._v(" "),i("div",{staticClass:"theme_font_red"},[t._v(" ¥"+t._s(t.$util.toDecimal2(e.price)))])])}))],2),t._v(" "),i("div",{staticClass:"count-line"},[i("div",{staticClass:"full theme_font_common"},[t._v("购买数量")]),t._v(" "),i("van-stepper",{attrs:{min:t.detailData.minPurNumber,max:1e5,integer:""},on:{change:t.numChange},model:{value:t.selectedNum,callback:function(e){t.selectedNum=e},expression:"selectedNum"}})],1)]),t._v(" "),i("div",{staticClass:"bottom-btn theme_font_white theme_bg_red",on:{click:t.popSureEvent}},[t._v("确定\n      ")])])]):t._e()],1)}),[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"flex-row"},[e("div",{staticClass:"theme_font_gray full"},[this._v("采购价格说明")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("i",{staticClass:"iconfont mall-gengduo more-icon theme_font_tint"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("i",{staticClass:"iconfont mall-gengduo more-icon theme_font_tint"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("i",{staticClass:"iconfont mall-gengduo more-icon theme_font_tint"})])}],!1,null,"8cc14bfe",null);e.default=c.exports},"GE+f":function(t,e,i){"use strict";var s=i("lVG9");i.n(s).a},lVG9:function(t,e,i){},oCAZ:function(t,e,i){"use strict";var s=i("ygAv"),a={getPriceShow:function(t){if(0==t.length)return"";for(var e=t[0].price,i=t[0].price,s=1;s<t.length;s++){var a=t[s].price;e>a&&(e=a),i<a&&(i=a)}return e==i?[this.getINumDNum(e)]:[this.getINumDNum(e),this.getINumDNum(i)]},getINumDNum:function(t){var e=s.a.toDecimal2(t).split(".");return{iNum:e[0],dNum:e[1]}}};e.a=a}}]);
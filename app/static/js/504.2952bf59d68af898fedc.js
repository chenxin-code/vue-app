(window.webpackJsonp=window.webpackJsonp||[]).push([[504,773,1e3,1001,1002,1003,1004],{A8ay:function(e,t,a){"use strict";var n={Header:{mName:"上导航(唯一)",btnEffect:[{cKey:"selectArea",name:"selectArea"},{cKey:"clickSearch",name:"clickSearch"},{cKey:"loginOut",name:"loginOut",imgUrl:"static/images/header/login-out.png"},{cKey:"showMore",name:"showMore",imgUrl:"static/images/header/more.png"},{cKey:"selectStation",name:"selectStation"},{cKey:"backNav",name:"backNav"},{cKey:"showMsg",name:"showMsg"},{cKey:"showScan",name:"showScan"},{cKey:"showShare",name:"showShare"},{cKey:"showQrcode",name:"showQrcode"},{cKey:"showService",name:"showService"},{cKey:"backNav",name:"backNav"}]},ImageAd:{mName:"图片广告/导航",name:{lbt:"轮播图",gndh:"功能导航",yhyg:"一行一个",lbdh:"列表导航"}},Rubik:{mName:"魔方",name:"魔方"},Auxiliary:{mName:"辅助组件"},MyCenter:{mName:"我的",btnEffect:[{cKey:"changeHeaderImg",name:"changeHeaderImg"},{cKey:"interestsEvent",name:"interestsEvent"},{cKey:"paidMemberInterestsEvent",name:"paidMemberInterestsEvent"},{cKey:"toScan",name:"toScan"},{cKey:"toRules",name:"toRules"}]},MyOrder:{mName:"我的订单",btnEffect:[{cKey:"allOrderEvent",name:"allOrderEvent"},{cKey:"interestsEvent",name:"interestsEvent"}]},FuelPrices:{mName:"今日油价",btnEffect:[{cKey:"toFuelPricesPage",name:"toFuelPricesPage"}]},MyAssets:{mName:"我的资产"},SecondsKill:{mName:"秒杀活动",btnEffect:[{cKey:"allSecondsKill",name:"allSecondsKill"}]},PickupAddress:{mName:"附近自提点",btnEffect:[{cKey:"allShops",name:"allShops"},{cKey:"allStation",name:"allStation"}]},MyPoints:{mName:"我的积分",btnEffect:[{cKey:"mx",name:"mx"}]},HScroll:{mName:"横滑组件",name:"横滑"},News:{mName:"资讯组件",btnEffect:[{cKey:"toNews",name:"新闻实事"}]},CoverFlow:{mName:"流动封面",name:"流动封面"},MemberCard:{mName:"会员卡",btnEffect:[{cKey:"bindCard",name:"bindCard"},{cKey:"interestsEvent",name:"interestsEvent"},{cKey:"youbi",name:"youbi"},{cKey:"ponitdetail",name:"ponitdetail"}]},CouponsTag:{mName:"电子券提醒",btnEffect:[{cKey:"",name:"CouponsTag"}]},MemberLevels:{mName:"会员级别",btnEffect:[{cKey:"",name:"MemberLevels"}]},TabsBlock:{mName:"Tabs",btnEffect:[{cKey:"",name:"TabsBlock"}]},HYTop:{mName:"海油顶部组件",btnEffect:[{cKey:"benefitsClick_1",name:"benefitsClick_1"},{cKey:"goStar",name:"goStar"},{cKey:"toCode",name:"toCode"},{cKey:"benefitsClick_2",name:"benefitsClick_2"}]},HYStation:{mName:"海油油站",btnEffect:[{cKey:"",name:"HYStation"}]},HYNews:{mName:"海油资讯",btnEffect:[{cKey:"moreNews",name:"moreNews"}]},WDInfo:{mName:"微店信息",btnEffect:[{cKey:"collection",name:"collection"},{cKey:"moreMicorShop",name:"moreMicorShop"}]},ESHTop:{mName:"e生活顶部",btnEffect:[{cKey:"",name:"ESHTop"}]},ESHNearStation:{mName:"e生活油站",btnEffect:[{cKey:"more",name:"more"}]},ESHDZJYQ:{mName:"e生活加油券",btnEffect:[{cKey:"oilcoupon",name:"oilcoupon"},{cKey:"orderlist",name:"orderlist"},{cKey:"oilcoupondetail",name:"oilcoupondetail"},{cKey:"supportstation",name:"supportstation"}]},ESHJFHQ:{mName:"e生活积分换券",btnEffect:[{cKey:"more",name:"more"}]},BtnProduct:{mName:"自定义购买",btnEffect:[{cKey:"leftBtnEvent",name:"leftBtnEvent"},{cKey:"buyEvent",name:"buyEvent"},{cKey:"toAgreement",name:"toAgreement"}]},HKTop:{mName:"好客顶部",btnEffect:[{cKey:"toProvince",name:"toProvince"},{cKey:"toLogin",name:"点我登录"},{cKey:"myhkd",name:"资产明细"},{cKey:"exchange",name:"权益领取"},{cKey:"orderlist",name:"我的订单"}]},CardProvincial:{mName:"卡车翼家组件",btnEffect:[{cKey:"addCardFun_1",name:"绑定柴油卡"},{cKey:"addCardFun_2",name:"立即认证"}]}},o={beginMaxValue:10,maxValue:10,totalLevel:5,pageTotal:{visit:0,clicks:0},itemClickTimes:{},itemClickPersons:{},menus:window.getMenus&&window.getMenus(),getPageClickTimes:function(){var e,t=(e=regeneratorRuntime.mark((function e(t,a){var n,o,i,s,c;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a?(n=a.url,o=a.params):(n="/system/json/data_stats/queryRealtimeDataStats",o={token:t.$store.state.login.token,group:"Access_PageHotspot",dateType:1,extend1:t.$route.query.pgCode}),e.next=3,t.$http.post(n,o);case 3:return i=e.sent,0==(s=i.data).status?(c=s.data,this.dataAnalysis(c)):t.$Message.error(s.info),e.abrupt("return",i);case 7:case"end":return e.stop()}}),e,this)})),function(){var t=e.apply(this,arguments);return new Promise((function(e,a){return function n(o,i){try{var s=t[o](i),c=s.value}catch(e){return void a(e)}if(!s.done)return Promise.resolve(c).then((function(e){n("next",e)}),(function(e){n("throw",e)}));e(c)}("next")}))});return function(e,a){return t.apply(this,arguments)}}(),resetData:function(){this.pageTotal={visit:0,clicks:0},this.itemClickTimes={},this.itemClickPersons={}},dataAnalysis:function(e){e||(e=[]),this.resetData(),this.maxValue=this.beginMaxValue;for(var t=0;t<e.length;t++){var a=e[t],n=a.mainKey,o=a.subKey;if(o)if(n.indexOf("pagenumber")>-1){a.value>this.maxValue&&(this.maxValue=a.value);var i=this.itemClickPersons[o];this.itemClickPersons[o]=i?i+a.value:a.value,this.pageTotal.visit+=a.value}else if(n.indexOf("pagemantime")>-1){a.value>this.maxValue&&(this.maxValue=a.value);var s=this.itemClickTimes[o];this.itemClickTimes[o]=s?s+a.value:a.value,this.pageTotal.clicks+=a.value}}},getTimesForKey:function(e){return this.itemClickTimes[e]},getPersonsForKey:function(e){return this.itemClickPersons[e]},getHotareaLevel:function(e){return Math.floor(this.totalLevel-e/this.maxValue*this.totalLevel)+1},getModuleClickStatistics:function(e){},getModuleData:function(e){var t=this;if(e._cache)return e._cache;var a=this.getHotareaEffect(e),n=0;return a.forEach((function(e){e.clicks=t.itemClickTimes[e.idCode]||0,e.visit=t.itemClickPersons[e.idCode]||0,n+=e.clicks})),a.forEach((function(e){var t=n?Number(e.clicks)/Number(n)*100:0;e.percent=t.toFixed(2)})),e._cache=a,a},getHotareaEffect:function(e){var t=n[e.code]||{},a=this.getRows(e,t),o=this.getBtnList(e,t);return a.concat(o)},getRows:function(e,t){var a=[];return e.data.rows&&e.data.rows.forEach((function(n,o){if(n.idCode){var i={};i.idCode=n.idCode;var s="string"==typeof s?t.name:t.name[e.data.type];i.name=(s||e.code)+(o+1),n.imgUrl&&(i.imgUrl=n.imgUrl),a.push(i)}})),a},getBtnList:function(e,t){var a=[],n=e.data.idCode;return n&&t.btnEffect&&t.btnEffect.forEach((function(e){var t={};t.idCode=n+e.cKey,t.name=e.name||e.cKey,e.imgUrl&&(t.imgUrl=e.imgUrl),a.push(t)})),a}},i=a("MCgc"),s=a("E/iu"),c={methods:{hotareaClass:function(e,t){if(1==i.a())return"";if(e.idCode){var a=o.getTimesForKey(e.idCode,!0);if(a>0){var n="hotarea_level_"+o.getHotareaLevel(a);if(t){var s={};return s[n]=!0,s}return n}}},actionBtnEvent:function(e,t){e&&t&&s.a.commonAction("140001","","","","",t,e,e,"")}}};t.a=c},BwLB:function(e,t,a){"use strict";var n=a("rb/7");a.n(n).a},WJkU:function(e,t,a){"use strict";a.r(t);var n=a("db0i"),o=a("L2JU"),i=a("KJ3S"),s=a("A8ay"),c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e},r={name:"btn-product",components:{},mixins:[s.a],data:function(){return{checked:!0,canEvent:!0}},props:["myIndex","usePorpData","propData"],computed:c({},Object(o.c)(["clientWidth"]),{pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.pageData},moduleData:function(){return this.pageData.moduleList[this.myIndex].data},getLabelText:function(){var e=this.moduleData.labelText;return this.moduleData.product&&null!=this.moduleData.product.activityPrice?e=e.replace("[price]",this.moduleData.product.activityPrice+""):e},getFloatUp:function(){var e="",t=this.moduleData.bgImgUrl;""!=t&&(e+="background: url('"+t+"') no-repeat center center / 100% 100%;");var a=this.moduleData.bgColor;""!=a&&(e+="background-color: "+a+";");var n=this.moduleData.floatUp;return n>0&&(e+="margin-top: -"+n+"%;"),this.moduleData.isFloat&&(-1==this.$store.state.webtype?e+="position: absolute;":e+="position: fixed;",e+="z-index: 20;left: 0;right: 0;bottom: 0;"),e},getSidesStyle:function(){var e="",t=this.moduleData.upMargin,a=this.moduleData.downMargin;t>0&&(e+="padding-top: "+t+"%;"),a>0&&(e+="padding-bottom: "+a+"%;");var n=this.moduleData.btnImage;return""!=n&&(e+="background: url('"+n+"') no-repeat center center / 100% 100%;"),e+"color: "+this.moduleData.labelColor+";"},getLeftBtnStyle:function(){var e="",t=this.moduleData.leftBtnWidth;return t&&(e+="width: "+t+"%;"),e}}),methods:{hotEvent:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.actionBtnEvent(this.pageData.pgCode,this.moduleData.idCode+e)},leftBtnEvent:function(){this.$market.enterNav({link:this.moduleData.leftLink})},getProductDetail:function(e){var t=this;this.$Loading.open();var a=this.$market.apiBaseURL()+"/app/json/product/getAppProDetail",n={productType:e.productType,skuId:e.skuId,lng:this.$store.state.currentLocation.posx,lat:this.$store.state.currentLocation.posy,deliverType:"2"};this.$http.post(a,n).then((function(e){t.$Loading.close();var a=e.data;0==a.status?t.moduleData.product=a.data:t.$Toast(a.info)}),(function(e){t.$Loading.close(),t.$Toast("请求数据失败！")}))},buyEvent:function(){var e=this;if(-1!=this.$store.state.webtype)if(this.moduleData.showAgreement&&0==this.checked)this.$Toast("请先阅读并同意相关须知或政策");else if(this.canEvent){this.canEvent=!1,setTimeout((function(){e.canEvent=!0}),1e3);var t=this.moduleData.product;this.$Loading.open();var a={deliveryType:2,virtualUserPhone:this.$store.state.login.phone};a.carts=[{number:1,skuId:t.skuId,storeOuCode:t.storeOuCode,selfActivityId:t.activityId,checked:1,isGift:0}],this.$http.post("/app/json/app_shopping_order/submit",a).then((function(t){var a=t.data;if(0==a.status){var o=a.data||{};"4"==e.$store.state.webtype?e.$market.payEvent({payMode:305,payModeSub:305005},o.orderType,o.orderId,"/icbc/ryhysuccess").then((function(){})).catch((function(){e.$Toast("支付失败！")})):"3"==e.$store.state.webtype?n.a.payEvent({payMode:210,payModeSub:210005},o.orderType,o.orderId,"/icbc/ryhysuccess").then((function(e){})).catch((function(){e.$Toast("支付失败！")})):2==e.$store.state.webtype&&n.a.payEvent({payMode:210,payModeSub:210002},o.orderType,o.orderId,"/icbc/ryhysuccess").then((function(e){})).catch((function(){e.$Toast("支付失败！")}))}else e.$Toast(a.info);e.$Loading.close()}))}},toAgreement:function(){var e=this.moduleData.agreementValue;e&&this.$market.customPush({path:"/usercenter/agreement",query:{value:e}})}},created:function(){var e=this;-1!=this.$store.state.webtype&&this.moduleData.product&&this.getProductDetail(this.moduleData.product),i.a.$on("productBtnEvent",(function(){e.buyEvent()}))}},m=(a("BwLB"),a("KHd+")),l=Object(m.a)(r,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"btn-product",style:e.getFloatUp},[a("div",{staticClass:"content-div"},[a("div",{staticClass:"left-btn",class:e.hotareaClass({idCode:e.moduleData.idCode+"leftBtnEvent"}),style:e.getLeftBtnStyle,on:{click:function(t){e.hotEvent("leftBtnEvent"),e.leftBtnEvent()}}},[a("img",{attrs:{src:e.moduleData.leftBtnImg}})]),e._v(" "),a("div",{staticClass:"btn-label",class:e.hotareaClass({idCode:e.moduleData.idCode+"buyEvent"}),style:e.getSidesStyle,on:{click:function(t){e.hotEvent("buyEvent"),e.buyEvent()}}},[a("span",[e._v(e._s(e.getLabelText))]),e._v(" "),a("span",{staticClass:"line-text"},[e._v(e._s(e.moduleData.lineText))])])]),e._v(" "),e.moduleData.showAgreement?a("div",{staticClass:"agreement"},[a("van-checkbox",{attrs:{"icon-size":"16px"},model:{value:e.checked,callback:function(t){e.checked=t},expression:"checked"}}),e._v(" "),a("div",{staticClass:"text",class:e.hotareaClass({idCode:e.moduleData.idCode+"toAgreement"}),on:{click:function(t){e.hotEvent("toAgreement"),e.toAgreement()}}},[e._v(e._s(e.moduleData.agreementText))])],1):e._e()])}),[],!1,null,"d8dced68",null);t.default=l.exports},"rb/7":function(e,t,a){}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[1002,1e3,1001,1003,1004],{A8ay:function(e,t,a){"use strict";var n={Header:{mName:"上导航(唯一)",btnEffect:[{cKey:"selectArea",name:"selectArea"},{cKey:"clickSearch",name:"clickSearch"},{cKey:"loginOut",name:"loginOut",imgUrl:"static/images/header/login-out.png"},{cKey:"showMore",name:"showMore",imgUrl:"static/images/header/more.png"},{cKey:"selectStation",name:"selectStation"},{cKey:"backNav",name:"backNav"},{cKey:"showMsg",name:"showMsg"},{cKey:"showScan",name:"showScan"},{cKey:"showShare",name:"showShare"},{cKey:"showQrcode",name:"showQrcode"},{cKey:"showService",name:"showService"},{cKey:"backNav",name:"backNav"}]},ImageAd:{mName:"图片广告/导航",name:{lbt:"轮播图",gndh:"功能导航",yhyg:"一行一个",lbdh:"列表导航"}},Rubik:{mName:"魔方",name:"魔方"},Auxiliary:{mName:"辅助组件"},MyCenter:{mName:"我的",btnEffect:[{cKey:"changeHeaderImg",name:"changeHeaderImg"},{cKey:"interestsEvent",name:"interestsEvent"},{cKey:"paidMemberInterestsEvent",name:"paidMemberInterestsEvent"},{cKey:"toScan",name:"toScan"},{cKey:"toRules",name:"toRules"}]},MyOrder:{mName:"我的订单",btnEffect:[{cKey:"allOrderEvent",name:"allOrderEvent"},{cKey:"interestsEvent",name:"interestsEvent"}]},FuelPrices:{mName:"今日油价",btnEffect:[{cKey:"toFuelPricesPage",name:"toFuelPricesPage"}]},MyAssets:{mName:"我的资产"},SecondsKill:{mName:"秒杀活动",btnEffect:[{cKey:"allSecondsKill",name:"allSecondsKill"}]},PickupAddress:{mName:"附近自提点",btnEffect:[{cKey:"allShops",name:"allShops"},{cKey:"allStation",name:"allStation"}]},MyPoints:{mName:"我的积分",btnEffect:[{cKey:"mx",name:"mx"}]},HScroll:{mName:"横滑组件",name:"横滑"},News:{mName:"资讯组件",btnEffect:[{cKey:"toNews",name:"新闻实事"}]},CoverFlow:{mName:"流动封面",name:"流动封面"},MemberCard:{mName:"会员卡",btnEffect:[{cKey:"bindCard",name:"bindCard"},{cKey:"interestsEvent",name:"interestsEvent"},{cKey:"youbi",name:"youbi"},{cKey:"ponitdetail",name:"ponitdetail"}]},CouponsTag:{mName:"电子券提醒",btnEffect:[{cKey:"",name:"CouponsTag"}]},MemberLevels:{mName:"会员级别",btnEffect:[{cKey:"",name:"MemberLevels"}]},TabsBlock:{mName:"Tabs",btnEffect:[{cKey:"",name:"TabsBlock"}]},HYTop:{mName:"海油顶部组件",btnEffect:[{cKey:"benefitsClick_1",name:"benefitsClick_1"},{cKey:"goStar",name:"goStar"},{cKey:"toCode",name:"toCode"},{cKey:"benefitsClick_2",name:"benefitsClick_2"}]},HYStation:{mName:"海油油站",btnEffect:[{cKey:"",name:"HYStation"}]},HYNews:{mName:"海油资讯",btnEffect:[{cKey:"moreNews",name:"moreNews"}]},WDInfo:{mName:"微店信息",btnEffect:[{cKey:"collection",name:"collection"},{cKey:"moreMicorShop",name:"moreMicorShop"}]},ESHTop:{mName:"e生活顶部",btnEffect:[{cKey:"",name:"ESHTop"}]},ESHNearStation:{mName:"e生活油站",btnEffect:[{cKey:"more",name:"more"}]},ESHDZJYQ:{mName:"e生活加油券",btnEffect:[{cKey:"oilcoupon",name:"oilcoupon"},{cKey:"orderlist",name:"orderlist"},{cKey:"oilcoupondetail",name:"oilcoupondetail"},{cKey:"supportstation",name:"supportstation"}]},ESHJFHQ:{mName:"e生活积分换券",btnEffect:[{cKey:"more",name:"more"}]},BtnProduct:{mName:"自定义购买",btnEffect:[{cKey:"leftBtnEvent",name:"leftBtnEvent"},{cKey:"buyEvent",name:"buyEvent"},{cKey:"toAgreement",name:"toAgreement"}]},HKTop:{mName:"好客顶部",btnEffect:[{cKey:"toProvince",name:"toProvince"},{cKey:"toLogin",name:"点我登录"},{cKey:"myhkd",name:"资产明细"},{cKey:"exchange",name:"权益领取"},{cKey:"orderlist",name:"我的订单"}]},CardProvincial:{mName:"卡车翼家组件",btnEffect:[{cKey:"addCardFun_1",name:"绑定柴油卡"},{cKey:"addCardFun_2",name:"立即认证"}]}},i={beginMaxValue:10,maxValue:10,totalLevel:5,pageTotal:{visit:0,clicks:0},itemClickTimes:{},itemClickPersons:{},menus:window.getMenus&&window.getMenus(),getPageClickTimes:function(){var e,t=(e=regeneratorRuntime.mark((function e(t,a){var n,i,c,o,r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a?(n=a.url,i=a.params):(n="/system/json/data_stats/queryRealtimeDataStats",i={token:t.$store.state.login.token,group:"Access_PageHotspot",dateType:1,extend1:t.$route.query.pgCode}),e.next=3,t.$http.post(n,i);case 3:return c=e.sent,0==(o=c.data).status?(r=o.data,this.dataAnalysis(r)):t.$Message.error(o.info),e.abrupt("return",c);case 7:case"end":return e.stop()}}),e,this)})),function(){var t=e.apply(this,arguments);return new Promise((function(e,a){return function n(i,c){try{var o=t[i](c),r=o.value}catch(e){return void a(e)}if(!o.done)return Promise.resolve(r).then((function(e){n("next",e)}),(function(e){n("throw",e)}));e(r)}("next")}))});return function(e,a){return t.apply(this,arguments)}}(),resetData:function(){this.pageTotal={visit:0,clicks:0},this.itemClickTimes={},this.itemClickPersons={}},dataAnalysis:function(e){e||(e=[]),this.resetData(),this.maxValue=this.beginMaxValue;for(var t=0;t<e.length;t++){var a=e[t],n=a.mainKey,i=a.subKey;if(i)if(n.indexOf("pagenumber")>-1){a.value>this.maxValue&&(this.maxValue=a.value);var c=this.itemClickPersons[i];this.itemClickPersons[i]=c?c+a.value:a.value,this.pageTotal.visit+=a.value}else if(n.indexOf("pagemantime")>-1){a.value>this.maxValue&&(this.maxValue=a.value);var o=this.itemClickTimes[i];this.itemClickTimes[i]=o?o+a.value:a.value,this.pageTotal.clicks+=a.value}}},getTimesForKey:function(e){return this.itemClickTimes[e]},getPersonsForKey:function(e){return this.itemClickPersons[e]},getHotareaLevel:function(e){return Math.floor(this.totalLevel-e/this.maxValue*this.totalLevel)+1},getModuleClickStatistics:function(e){},getModuleData:function(e){var t=this;if(e._cache)return e._cache;var a=this.getHotareaEffect(e),n=0;return a.forEach((function(e){e.clicks=t.itemClickTimes[e.idCode]||0,e.visit=t.itemClickPersons[e.idCode]||0,n+=e.clicks})),a.forEach((function(e){var t=n?Number(e.clicks)/Number(n)*100:0;e.percent=t.toFixed(2)})),e._cache=a,a},getHotareaEffect:function(e){var t=n[e.code]||{},a=this.getRows(e,t),i=this.getBtnList(e,t);return a.concat(i)},getRows:function(e,t){var a=[];return e.data.rows&&e.data.rows.forEach((function(n,i){if(n.idCode){var c={};c.idCode=n.idCode;var o="string"==typeof o?t.name:t.name[e.data.type];c.name=(o||e.code)+(i+1),n.imgUrl&&(c.imgUrl=n.imgUrl),a.push(c)}})),a},getBtnList:function(e,t){var a=[],n=e.data.idCode;return n&&t.btnEffect&&t.btnEffect.forEach((function(e){var t={};t.idCode=n+e.cKey,t.name=e.name||e.cKey,e.imgUrl&&(t.imgUrl=e.imgUrl),a.push(t)})),a}},c=a("MCgc"),o=a("E/iu"),r={methods:{hotareaClass:function(e,t){if(1==c.a())return"";if(e.idCode){var a=i.getTimesForKey(e.idCode,!0);if(a>0){var n="hotarea_level_"+i.getHotareaLevel(a);if(t){var o={};return o[n]=!0,o}return n}}},actionBtnEvent:function(e,t){e&&t&&o.a.commonAction("140001","","","","",t,e,e,"")}}};t.a=r}}]);
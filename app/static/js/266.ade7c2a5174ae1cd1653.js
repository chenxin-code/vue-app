(window.webpackJsonp=window.webpackJsonp||[]).push([[266,325,1e3,1001,1002,1003,1004],{"89IG":function(e,t,a){"use strict";var s={name:"member-level",components:{},data:function(){return{refresh:!0,value_style:"",show:!1,equityName:"",equityList:[]}},methods:{showEquity:function(e){var t=this;if("/mall2/membershipinterests"==this.$route.path){this.show=!0,this.equityName=e.name;var a={token:this.$store.state.login.token,levelNo:e.id};this.$http.post("/app/equity_member/queryLevelEquity",a).then((function(e){var a=e.data;0==a.status?t.equityList=a.data:t.$Toast("获取会员权益失败")}))}},checkEquity:function(e){var t=this;if(1==e.type){var a={token:this.$store.state.login.token,equityType:e.equityType,equityId:e.equityId};this.$http.post("/app/equity_member/queryMyEquityRecord",a).then((function(e){var a=e.data;if(0==a.status){var s=String(a.data.equityType).substr(0,1),n=a.data.equityType;"1"==s||"2"==s||"4"==s?t.$router.push({path:"/equity/have_equity",query:{detail:JSON.stringify(a.data)}}):"31"==n?t.$router.push({path:"/equity/question",query:{detail:JSON.stringify(a.data)}}):"32"==n?t.$router.push({path:"/equity/game_equity",query:{detail:JSON.stringify(a.data)}}):"33"==n?t.$router.push({path:"/equity/couponList",query:{detail:JSON.stringify(a.data)}}):"5"==s&&t.$router.push({path:"/equity/third_services",query:{detail:JSON.stringify(a.data)}})}else t.$Toast("获取我的权益失败")}))}else this.$router.push({path:"/equity/magnification",query:{equityType:e.equityType}})},hasDian:function(e,t){if(this.$store.state.mall2.myAssets.levSurplusPoints>=e)return!1;var a=this.$store.state.memberLevel[t-1];return a?this.$store.state.mall2.myAssets.levSurplusPoints>=a.pointAmount:void 0},getWlineStyle:function(e,t){if(this.$store.state.mall2.myAssets.levSurplusPoints>=e)return"width: 100%";var a=this.$store.state.memberLevel[t-1];if(a){var s=e-a.pointAmount,n=this.$store.state.mall2.myAssets.levSurplusPoints-a.pointAmount;if(s>0)return"width: "+n/s*100+"%"}},getLevelImg:function(e,t){return this.$store.state.mall2.myAssets.levSurplusPoints>=e?"static/images/mycenter/m_"+t+"_1.png":"static/images/mycenter/m_"+t+"_0.png"},refreshStyle:function(){var e=this.$refs.bubbleDiv;if(e){var t=e[0];if(t){var a=-t.offsetWidth/2;this.value_style="margin-left: "+a+"px;",console.log("this.value_style",this.value_style)}}}},watch:{"$store.state.mall2.myAssets.levSurplusPoints":function(){var e=this;this.refresh=!1,this.$nextTick((function(){e.refresh=!0}))}},mounted:function(){}},n=(a("XIWT"),a("KHd+")),i=Object(n.a)(s,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return e.refresh?a("div",{ref:"theComponent",staticClass:"member-level"},[e._l(e.$store.state.memberLevel,(function(t,s){return a("div",{staticClass:"item",class:{own:t.pointAmount<=e.$store.state.mall2.myAssets.levSurplusPoints}},[a("div",{staticClass:"name"},[e._v(e._s(t.name))]),e._v(" "),a("div",{staticClass:"img-div"},[a("img",{attrs:{src:e.getLevelImg(t.pointAmount,s+1)},on:{click:function(a){return e.showEquity(t)}}})]),e._v(" "),a("div",{staticClass:"points"},[e._v(e._s(t.pointAmount))]),e._v(" "),0!=s?a("div",{staticClass:"line-div"},[a("div",{staticClass:"line-w",style:e.getWlineStyle(t.pointAmount,s)},[e.hasDian(t.pointAmount,s)?a("div",{staticClass:"show-value"}):e._e(),e._v(" "),e.hasDian(t.pointAmount,s)?a("img",{staticClass:"dian",attrs:{src:"static/images/mycenter/dian.png"}}):e._e()])]):e._e()])})),e._v(" "),a("van-popup",{model:{value:e.show,callback:function(t){e.show=t},expression:"show"}},[a("p",{staticClass:"p1"},[e._v(e._s(e.equityName)+"会员权益")]),e._v(" "),a("div",{staticClass:"ulBox"},[a("div",{staticClass:"ul"},[a("ul",e._l(e.equityList,(function(t){return a("li",{on:{click:function(a){return e.checkEquity(t)}}},[a("img",{attrs:{src:t.equityPic,alt:""}}),e._v(" "),a("div",[a("p",{staticClass:"ul_p"},[e._v(e._s(t.equityName.substr(0,4)))])])])})),0)])]),e._v(" "),a("span",{staticClass:"fill",on:{click:function(t){e.show=!1}}},[e._v("关闭")])])],2):e._e()}),[],!1,null,"4503cd06",null);t.a=i.exports},A8ay:function(e,t,a){"use strict";var s={Header:{mName:"上导航(唯一)",btnEffect:[{cKey:"selectArea",name:"selectArea"},{cKey:"clickSearch",name:"clickSearch"},{cKey:"loginOut",name:"loginOut",imgUrl:"static/images/header/login-out.png"},{cKey:"showMore",name:"showMore",imgUrl:"static/images/header/more.png"},{cKey:"selectStation",name:"selectStation"},{cKey:"backNav",name:"backNav"},{cKey:"showMsg",name:"showMsg"},{cKey:"showScan",name:"showScan"},{cKey:"showShare",name:"showShare"},{cKey:"showQrcode",name:"showQrcode"},{cKey:"showService",name:"showService"},{cKey:"backNav",name:"backNav"}]},ImageAd:{mName:"图片广告/导航",name:{lbt:"轮播图",gndh:"功能导航",yhyg:"一行一个",lbdh:"列表导航"}},Rubik:{mName:"魔方",name:"魔方"},Auxiliary:{mName:"辅助组件"},MyCenter:{mName:"我的",btnEffect:[{cKey:"changeHeaderImg",name:"changeHeaderImg"},{cKey:"interestsEvent",name:"interestsEvent"},{cKey:"paidMemberInterestsEvent",name:"paidMemberInterestsEvent"},{cKey:"toScan",name:"toScan"},{cKey:"toRules",name:"toRules"}]},MyOrder:{mName:"我的订单",btnEffect:[{cKey:"allOrderEvent",name:"allOrderEvent"},{cKey:"interestsEvent",name:"interestsEvent"}]},FuelPrices:{mName:"今日油价",btnEffect:[{cKey:"toFuelPricesPage",name:"toFuelPricesPage"}]},MyAssets:{mName:"我的资产"},SecondsKill:{mName:"秒杀活动",btnEffect:[{cKey:"allSecondsKill",name:"allSecondsKill"}]},PickupAddress:{mName:"附近自提点",btnEffect:[{cKey:"allShops",name:"allShops"},{cKey:"allStation",name:"allStation"}]},MyPoints:{mName:"我的积分",btnEffect:[{cKey:"mx",name:"mx"}]},HScroll:{mName:"横滑组件",name:"横滑"},News:{mName:"资讯组件",btnEffect:[{cKey:"toNews",name:"新闻实事"}]},CoverFlow:{mName:"流动封面",name:"流动封面"},MemberCard:{mName:"会员卡",btnEffect:[{cKey:"bindCard",name:"bindCard"},{cKey:"interestsEvent",name:"interestsEvent"},{cKey:"youbi",name:"youbi"},{cKey:"ponitdetail",name:"ponitdetail"}]},CouponsTag:{mName:"电子券提醒",btnEffect:[{cKey:"",name:"CouponsTag"}]},MemberLevels:{mName:"会员级别",btnEffect:[{cKey:"",name:"MemberLevels"}]},TabsBlock:{mName:"Tabs",btnEffect:[{cKey:"",name:"TabsBlock"}]},HYTop:{mName:"海油顶部组件",btnEffect:[{cKey:"benefitsClick_1",name:"benefitsClick_1"},{cKey:"goStar",name:"goStar"},{cKey:"toCode",name:"toCode"},{cKey:"benefitsClick_2",name:"benefitsClick_2"}]},HYStation:{mName:"海油油站",btnEffect:[{cKey:"",name:"HYStation"}]},HYNews:{mName:"海油资讯",btnEffect:[{cKey:"moreNews",name:"moreNews"}]},WDInfo:{mName:"微店信息",btnEffect:[{cKey:"collection",name:"collection"},{cKey:"moreMicorShop",name:"moreMicorShop"}]},ESHTop:{mName:"e生活顶部",btnEffect:[{cKey:"",name:"ESHTop"}]},ESHNearStation:{mName:"e生活油站",btnEffect:[{cKey:"more",name:"more"}]},ESHDZJYQ:{mName:"e生活加油券",btnEffect:[{cKey:"oilcoupon",name:"oilcoupon"},{cKey:"orderlist",name:"orderlist"},{cKey:"oilcoupondetail",name:"oilcoupondetail"},{cKey:"supportstation",name:"supportstation"}]},ESHJFHQ:{mName:"e生活积分换券",btnEffect:[{cKey:"more",name:"more"}]},BtnProduct:{mName:"自定义购买",btnEffect:[{cKey:"leftBtnEvent",name:"leftBtnEvent"},{cKey:"buyEvent",name:"buyEvent"},{cKey:"toAgreement",name:"toAgreement"}]},HKTop:{mName:"好客顶部",btnEffect:[{cKey:"toProvince",name:"toProvince"},{cKey:"toLogin",name:"点我登录"},{cKey:"myhkd",name:"资产明细"},{cKey:"exchange",name:"权益领取"},{cKey:"orderlist",name:"我的订单"}]},CardProvincial:{mName:"卡车翼家组件",btnEffect:[{cKey:"addCardFun_1",name:"绑定柴油卡"},{cKey:"addCardFun_2",name:"立即认证"}]}},n={beginMaxValue:10,maxValue:10,totalLevel:5,pageTotal:{visit:0,clicks:0},itemClickTimes:{},itemClickPersons:{},menus:window.getMenus&&window.getMenus(),getPageClickTimes:function(){var e,t=(e=regeneratorRuntime.mark((function e(t,a){var s,n,i,r,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a?(s=a.url,n=a.params):(s="/system/json/data_stats/queryRealtimeDataStats",n={token:t.$store.state.login.token,group:"Access_PageHotspot",dateType:1,extend1:t.$route.query.pgCode}),e.next=3,t.$http.post(s,n);case 3:return i=e.sent,0==(r=i.data).status?(o=r.data,this.dataAnalysis(o)):t.$Message.error(r.info),e.abrupt("return",i);case 7:case"end":return e.stop()}}),e,this)})),function(){var t=e.apply(this,arguments);return new Promise((function(e,a){return function s(n,i){try{var r=t[n](i),o=r.value}catch(e){return void a(e)}if(!r.done)return Promise.resolve(o).then((function(e){s("next",e)}),(function(e){s("throw",e)}));e(o)}("next")}))});return function(e,a){return t.apply(this,arguments)}}(),resetData:function(){this.pageTotal={visit:0,clicks:0},this.itemClickTimes={},this.itemClickPersons={}},dataAnalysis:function(e){e||(e=[]),this.resetData(),this.maxValue=this.beginMaxValue;for(var t=0;t<e.length;t++){var a=e[t],s=a.mainKey,n=a.subKey;if(n)if(s.indexOf("pagenumber")>-1){a.value>this.maxValue&&(this.maxValue=a.value);var i=this.itemClickPersons[n];this.itemClickPersons[n]=i?i+a.value:a.value,this.pageTotal.visit+=a.value}else if(s.indexOf("pagemantime")>-1){a.value>this.maxValue&&(this.maxValue=a.value);var r=this.itemClickTimes[n];this.itemClickTimes[n]=r?r+a.value:a.value,this.pageTotal.clicks+=a.value}}},getTimesForKey:function(e){return this.itemClickTimes[e]},getPersonsForKey:function(e){return this.itemClickPersons[e]},getHotareaLevel:function(e){return Math.floor(this.totalLevel-e/this.maxValue*this.totalLevel)+1},getModuleClickStatistics:function(e){},getModuleData:function(e){var t=this;if(e._cache)return e._cache;var a=this.getHotareaEffect(e),s=0;return a.forEach((function(e){e.clicks=t.itemClickTimes[e.idCode]||0,e.visit=t.itemClickPersons[e.idCode]||0,s+=e.clicks})),a.forEach((function(e){var t=s?Number(e.clicks)/Number(s)*100:0;e.percent=t.toFixed(2)})),e._cache=a,a},getHotareaEffect:function(e){var t=s[e.code]||{},a=this.getRows(e,t),n=this.getBtnList(e,t);return a.concat(n)},getRows:function(e,t){var a=[];return e.data.rows&&e.data.rows.forEach((function(s,n){if(s.idCode){var i={};i.idCode=s.idCode;var r="string"==typeof r?t.name:t.name[e.data.type];i.name=(r||e.code)+(n+1),s.imgUrl&&(i.imgUrl=s.imgUrl),a.push(i)}})),a},getBtnList:function(e,t){var a=[],s=e.data.idCode;return s&&t.btnEffect&&t.btnEffect.forEach((function(e){var t={};t.idCode=s+e.cKey,t.name=e.name||e.cKey,e.imgUrl&&(t.imgUrl=e.imgUrl),a.push(t)})),a}},i=a("MCgc"),r=a("E/iu"),o={methods:{hotareaClass:function(e,t){if(1==i.a())return"";if(e.idCode){var a=n.getTimesForKey(e.idCode,!0);if(a>0){var s="hotarea_level_"+n.getHotareaLevel(a);if(t){var r={};return r[s]=!0,r}return s}}},actionBtnEvent:function(e,t){e&&t&&r.a.commonAction("140001","","","","",t,e,e,"")}}};t.a=o},BngH:function(e,t,a){},XIWT:function(e,t,a){"use strict";var s=a("kiCv");a.n(s).a},kiCv:function(e,t,a){},"p+j1":function(e,t,a){"use strict";a.r(t);var s=a("89IG"),n=a("A8ay"),i=a("L2JU"),r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var s in a)Object.prototype.hasOwnProperty.call(a,s)&&(e[s]=a[s])}return e},o={name:"member-levels",components:{MemberLevel:s.a},props:["myIndex","usePorpData","propData","barHeight"],computed:r({},Object(i.e)(["deployType"]),{pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.pageData},moduleData:function(){return this.pageData.moduleList[this.myIndex].data}}),watch:{"$store.state.mall2.myAssets":function(e,t){this.getNextDistance()}},mixins:[n.a],data:function(){return{nextLevelValue:0,nextLevelName:""}},methods:{toMemberLevel:function(){5==this.deployType&&this.$market.customPush({path:"/memberlevel"})},getNextDistance:function(){var e=this.$store.state.mall2.myAssets.levSurplusPoints,t=this.$store.state.memberLevel||[],a=this.$store.state.mall2.myAssets.levelNo;this.nextLevelValue=0;for(var s=0;s<t.length;s++)if(a==t[s].rankCode){if(s==t.length-1)return"";var n=t[s+1].pointAmount;return 5==this.deployType?(this.nextLevelValue=Math.floor(n-e),void(this.nextLevelName=t[s+1].name)):n-e}return"0"},getBgStyle:function(){var e="",t=this.moduleData.bgImgUrl;""!=t&&(e+="background: url('"+t+"') no-repeat center center / 100% 100%;");var a=this.moduleData.bgColor;return""!=a&&(e+="background-color: "+a+";"),e},getFloatUp:function(){var e="",t=this.moduleData.floatUp;t>0&&(e+="margin-top: -"+t+"%;");var a=this.moduleData.upMargin,s=this.moduleData.downMargin;a>0&&(e+="margin-top: "+a+"%;"),s>0&&(e+="margin-bottom: "+s+"%;");var n=this.moduleData.sidesMargin;return n>0&&(e+="margin-left: "+n+"%; margin-right: "+n+"%;"),e},getMyAssets:function(){var e=this,t=this.$market.apiBaseURL()+"/app/json/user/getUserWallet",a={token:this.$store.state.login.token};this.$http.post(t,a).then((function(t){var a=t.data;0==a.status&&(e.$store.state.mall2.myAssets=a.data,e.getNextDistance())}),(function(e){}))},getUserRank:function(){var e=this;this.$http.post("/app/json/user_rights/getUserRank",{}).then((function(t){var a=t.data;0==a.status&&""!=a.data&&a.data.length>0&&(e.$store.state.memberLevel=a.data)}),(function(e){}))}},created:function(){5==this.deployType&&(this.getUserRank(),""!=this.$store.state.login.token&&this.getMyAssets())}},l=(a("xMCV"),a("KHd+")),c=Object(l.a)(o,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"member-levels",class:{"div-zm":5==e.deployType},style:e.getBgStyle()},[5==e.deployType?[a("div",{staticClass:"member-level-div",style:e.getFloatUp(),on:{click:e.toMemberLevel}},[e.$store.state.mall2.myAssets.levelEndDate&&"0001"!=e.$store.state.mall2.myAssets.levelNo?a("div",{staticClass:"tip"},[a("span",[e._v(e._s(e.$t("loginRegisterLang.levalEffectDate")))]),e._v(" "),a("span",[e._v(e._s(e.$store.state.mall2.myAssets.levelEndDate))])]):e._e(),e._v(" "),a("MemberLevel",{attrs:{type:"zm"}}),e._v(" "),"en_US"==e.$store.state.language&&e.nextLevelName?a("div",{staticClass:"tip1"},[e._v(e._s(e.$t("loginRegisterLang.nextLevelTip1"))+" "+e._s(e.nextLevelName)+" "+e._s(e.$t("loginRegisterLang.nextLevelTip2"))+" "+e._s(e.nextLevelValue)+" RMB")]):e.nextLevelName?a("div",{staticClass:"tip1"},[e._v(e._s(e.$t("loginRegisterLang.nextLevelTip1"))+" "+e._s(e.nextLevelValue)+" "+e._s(e.$t("loginRegisterLang.nextLevelTip2"))+" "+e._s(e.nextLevelName))]):e._e()],1)]:[a("div",{staticClass:"member-level-div",class:e.hotareaClass({idCode:e.moduleData.idCode}),style:e.getFloatUp(),on:{click:function(t){e.hotEvent(),e.toMemberLevel()}}},[a("MemberLevel",{attrs:{type:"zm"}}),e._v(" "),a("div",{staticClass:"tip"},[e._v("距离下一级别还有"),a("span",{staticClass:"point"},[e._v(e._s(e.getNextDistance()))]),e._v("元距离")])],1)]],2)}),[],!1,null,"97b6c044",null);t.default=c.exports},xMCV:function(e,t,a){"use strict";var s=a("BngH");a.n(s).a}}]);
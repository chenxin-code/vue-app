(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6bf47c5b","chunk-13dc2166","chunk-34b7a3be","chunk-34b7a3be","chunk-34b7a3be","chunk-34b7a3be","chunk-34b7a3be"],{"03c6":function(e,t,a){"use strict";var n=a("1da1"),s=(a("c975"),a("4160"),a("159b"),a("a9e3"),a("b680"),a("99af"),a("b0c0"),a("96cf"),{Header:{mName:"上导航(唯一)",btnEffect:[{cKey:"selectArea",name:"selectArea"},{cKey:"clickSearch",name:"clickSearch"},{cKey:"loginOut",name:"loginOut",imgUrl:"static/images/header/login-out.png"},{cKey:"showMore",name:"showMore",imgUrl:"static/images/header/more.png"},{cKey:"selectStation",name:"selectStation"},{cKey:"backNav",name:"backNav"},{cKey:"showMsg",name:"showMsg"},{cKey:"showScan",name:"showScan"},{cKey:"showShare",name:"showShare"},{cKey:"showQrcode",name:"showQrcode"},{cKey:"showService",name:"showService"},{cKey:"backNav",name:"backNav"}]},ImageAd:{mName:"图片广告/导航",name:{lbt:"轮播图",gndh:"功能导航",yhyg:"一行一个",lbdh:"列表导航"}},Rubik:{mName:"魔方",name:"魔方"},Auxiliary:{mName:"辅助组件"},MyCenter:{mName:"我的",btnEffect:[{cKey:"changeHeaderImg",name:"changeHeaderImg"},{cKey:"interestsEvent",name:"interestsEvent"},{cKey:"paidMemberInterestsEvent",name:"paidMemberInterestsEvent"},{cKey:"toScan",name:"toScan"},{cKey:"toRules",name:"toRules"}]},MyOrder:{mName:"我的订单",btnEffect:[{cKey:"allOrderEvent",name:"allOrderEvent"},{cKey:"interestsEvent",name:"interestsEvent"}]},FuelPrices:{mName:"今日油价",btnEffect:[{cKey:"toFuelPricesPage",name:"toFuelPricesPage"}]},MyAssets:{mName:"我的资产"},SecondsKill:{mName:"秒杀活动",btnEffect:[{cKey:"allSecondsKill",name:"allSecondsKill"}]},PickupAddress:{mName:"附近自提点",btnEffect:[{cKey:"allShops",name:"allShops"},{cKey:"allStation",name:"allStation"}]},MyPoints:{mName:"我的积分",btnEffect:[{cKey:"mx",name:"mx"}]},HScroll:{mName:"横滑组件",name:"横滑"},News:{mName:"资讯组件",btnEffect:[{cKey:"toNews",name:"新闻实事"}]},CoverFlow:{mName:"流动封面",name:"流动封面"},MemberCard:{mName:"会员卡",btnEffect:[{cKey:"bindCard",name:"bindCard"},{cKey:"interestsEvent",name:"interestsEvent"},{cKey:"youbi",name:"youbi"},{cKey:"ponitdetail",name:"ponitdetail"}]},CouponsTag:{mName:"电子券提醒",btnEffect:[{cKey:"",name:"CouponsTag"}]},MemberLevels:{mName:"会员级别",btnEffect:[{cKey:"",name:"MemberLevels"}]},TabsBlock:{mName:"Tabs",btnEffect:[{cKey:"",name:"TabsBlock"}]},HYTop:{mName:"海油顶部组件",btnEffect:[{cKey:"benefitsClick_1",name:"benefitsClick_1"},{cKey:"goStar",name:"goStar"},{cKey:"toCode",name:"toCode"},{cKey:"benefitsClick_2",name:"benefitsClick_2"}]},HYStation:{mName:"海油油站",btnEffect:[{cKey:"",name:"HYStation"}]},HYNews:{mName:"海油资讯",btnEffect:[{cKey:"moreNews",name:"moreNews"}]},WDInfo:{mName:"微店信息",btnEffect:[{cKey:"collection",name:"collection"},{cKey:"moreMicorShop",name:"moreMicorShop"}]},ESHTop:{mName:"e生活顶部",btnEffect:[{cKey:"",name:"ESHTop"}]},ESHNearStation:{mName:"e生活油站",btnEffect:[{cKey:"more",name:"more"}]},ESHDZJYQ:{mName:"e生活加油券",btnEffect:[{cKey:"oilcoupon",name:"oilcoupon"},{cKey:"orderlist",name:"orderlist"},{cKey:"oilcoupondetail",name:"oilcoupondetail"},{cKey:"supportstation",name:"supportstation"}]},ESHJFHQ:{mName:"e生活积分换券",btnEffect:[{cKey:"more",name:"more"}]},BtnProduct:{mName:"自定义购买",btnEffect:[{cKey:"leftBtnEvent",name:"leftBtnEvent"},{cKey:"buyEvent",name:"buyEvent"},{cKey:"toAgreement",name:"toAgreement"}]},HKTop:{mName:"好客顶部",btnEffect:[{cKey:"toProvince",name:"toProvince"},{cKey:"toLogin",name:"点我登录"},{cKey:"myhkd",name:"资产明细"},{cKey:"exchange",name:"权益领取"},{cKey:"orderlist",name:"我的订单"}]},CardProvincial:{mName:"卡车翼家组件",btnEffect:[{cKey:"addCardFun_1",name:"绑定柴油卡"},{cKey:"addCardFun_2",name:"立即认证"}]}}),i={beginMaxValue:10,maxValue:10,totalLevel:5,pageTotal:{visit:0,clicks:0},itemClickTimes:{},itemClickPersons:{},menus:window.getMenus&&window.getMenus(),getPageClickTimes:function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(t,a){var n,s,i,r,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a?(n=a.url,s=a.params):(n="/system/json/data_stats/queryRealtimeDataStats",s={token:t.$store.state.login.token,group:"Access_PageHotspot",dateType:1,extend1:t.$route.query.pgCode}),e.next=3,t.$http.post(n,s);case 3:return i=e.sent,r=i.data,0==r.status?(o=r.data,this.dataAnalysis(o)):t.$Message.error(r.info),e.abrupt("return",i);case 7:case"end":return e.stop()}}),e,this)})));function t(t,a){return e.apply(this,arguments)}return t}(),resetData:function(){this.pageTotal={visit:0,clicks:0},this.itemClickTimes={},this.itemClickPersons={}},dataAnalysis:function(e){e||(e=[]),this.resetData(),this.maxValue=this.beginMaxValue;for(var t=0;t<e.length;t++){var a=e[t],n=a.mainKey,s=a.subKey;if(s)if(n.indexOf("pagenumber")>-1){a.value>this.maxValue&&(this.maxValue=a.value);var i=this.itemClickPersons[s];this.itemClickPersons[s]=i?i+a.value:a.value,this.pageTotal.visit+=a.value}else if(n.indexOf("pagemantime")>-1){a.value>this.maxValue&&(this.maxValue=a.value);var r=this.itemClickTimes[s];this.itemClickTimes[s]=r?r+a.value:a.value,this.pageTotal.clicks+=a.value}}},getTimesForKey:function(e){return this.itemClickTimes[e]},getPersonsForKey:function(e){return this.itemClickPersons[e]},getHotareaLevel:function(e){var t=Math.floor(this.totalLevel-e/this.maxValue*this.totalLevel)+1;return t},getModuleClickStatistics:function(e){},getModuleData:function(e){var t=this;if(e._cache)return e._cache;var a=this.getHotareaEffect(e),n=0;return a.forEach((function(e){e.clicks=t.itemClickTimes[e.idCode]||0,e.visit=t.itemClickPersons[e.idCode]||0,n+=e.clicks})),a.forEach((function(e){var t=n?Number(e.clicks)/Number(n)*100:0;e.percent=t.toFixed(2)})),e._cache=a,a},getHotareaEffect:function(e){var t=s[e.code]||{},a=this.getRows(e,t),n=this.getBtnList(e,t);return a.concat(n)},getRows:function(e,t){var a=[];return e.data.rows&&e.data.rows.forEach((function(n,s){if(n.idCode){var i={};i.idCode=n.idCode;var r="string"==typeof r?t.name:t.name[e.data.type];i.name=(r||e.code)+(s+1),n.imgUrl&&(i.imgUrl=n.imgUrl),a.push(i)}})),a},getBtnList:function(e,t){var a=[],n=e.data.idCode;return n&&t.btnEffect&&t.btnEffect.forEach((function(e){var t={};t.idCode=n+e.cKey,t.name=e.name||e.cKey,e.imgUrl&&(t.imgUrl=e.imgUrl),a.push(t)})),a}},r=i,o=a("3028"),c=a("13f8"),m={methods:{hotareaClass:function(e,t){if(1==o["a"]())return"";if(e.idCode){var a=r.getTimesForKey(e.idCode,!0);if(a>0){var n="hotarea_level_"+r.getHotareaLevel(a);if(t){var s={};return s[n]=!0,s}return n}}},actionBtnEvent:function(e,t){e&&t&&c["a"].commonAction("140001","","","","",t,e,e,"")}}};t["a"]=m},"04d64":function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return""!=e.$store.state.login.token?a("div",{staticClass:"member-card",style:e.getBgStyle()},[a("div",{staticClass:"card-div",style:e.getFloatUp()},[a("div",{staticClass:"img-bg"},[a("img",{staticClass:"bgimg",style:e.getInfoWidth(),attrs:{src:e.moduleData.cardImg}}),a("div",{staticClass:"info-div",style:e.getInfoWidth()},[a("div",{staticClass:"row"},[a("div",{staticClass:"user-name"},[e._v(e._s(e.$store.state.userInfo.nickName||e.getPhoneToName()))]),e.$store.state.mall2.myAssets.cardNum>0?a("div",{staticClass:"fuel-card-has"},[e._v(e._s(e.getHideNum()))]):a("div",{staticClass:"fuel-card",class:e.hotareaClass({idCode:e.moduleData.idCode+"bindCard"}),on:{click:function(t){e.hotEvent("bindCard"),e.bindCard()}}},[e._v("未绑卡")])]),a("div",{staticClass:"row"},[a("div",{staticClass:"info",class:e.hotareaClass({idCode:e.moduleData.idCode+"interestsEvent"}),on:{click:function(t){e.hotEvent("interestsEvent"),e.interestsEvent()}}},[e._v("成长值 | "+e._s(e.$store.state.mall2.myAssets.levSurplusPoints))]),a("div",{staticClass:"info",class:e.hotareaClass({idCode:e.moduleData.idCode+"youbi"}),on:{click:function(t){e.hotEvent("youbi"),e.youbi()}}},[e._v(e._s(e.getRewardName({rewardType:"100"})||"油币")+" | "+e._s(e.getRewardValue({rewardType:"100"})||"0"))]),a("div",{staticClass:"info",class:e.hotareaClass({idCode:e.moduleData.idCode+"ponitdetail"}),on:{click:function(t){e.hotEvent("ponitdetail"),e.ponitdetail()}}},[e._v("积分 | "+e._s(e.$store.state.mall2.myAssets.surplusPoints))])])])])])]):e._e()},s=[],i=a("03c6"),r={name:"member-card",components:{},props:["myIndex","usePorpData","propData","barHeight"],computed:{pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.pageData},moduleData:function(){return this.pageData.moduleList[this.myIndex].data}},mixins:[i["a"]],data:function(){return{linshiyoubigeshu:0}},methods:{hotEvent:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.actionBtnEvent(this.pageData.pgCode,this.moduleData.idCode+e)},getRewardName:function(e){if(e.rewardType)for(var t=this.$store.state.mall2.myAssets.rewardList,a=0;t&&a<t.length;a++)if(t[a].rewardsSurplusOrderType==e.rewardType)return t[a].rewardsSurplusName;return""},getRewardValue:function(e){if(e.rewardType)for(var t=this.$store.state.mall2.myAssets.rewardList,a=0;t&&a<t.length;a++)if(t[a].rewardsSurplusOrderType==e.rewardType)return t[a].rewardsSurplus;if(e.countKey){if(this.$store.state.mall2.myAssets[e.countKey])return this.$store.state.mall2.myAssets[e.countKey];if(this.$store.state.mall2.myAssets.accountInfo)return this.$store.state.mall2.myAssets.accountInfo[e.countKey]||"0"}return"0"},getyoubigeshu:function(){var e=this,t=this.$market.apiBaseURL()+"/app/json/acct/getAccountBaseInfo",a={token:this.$store.state.login.token,acctType:8,groupValue:"1"};this.$http.post(t,a).then((function(t){var a=t.data;0==a.status&&(e.linshiyoubigeshu=a.data.balanceUnit)}),(function(e){}))},getPhoneToName:function(){var e=this.$store.state.userInfo.phone;return-1!=this.$store.state.webtype&&this.$util.checkMobile(e)?e.substr(0,3)+"****"+e.substr(7,4):"未登录"},getHideNum:function(){var e=this.$store.state.mall2.myAssets.cardNos,t="";return e&&e.length>0&&(t=e[0],t.length>4&&(t=t.substring(t.length-4,t.length),t="****"+t)),t},bindCard:function(){this.$store.state.mall2.myAssets.cardNum<=0&&this.$market.customPush({path:"/refuelingCard?inway=replace"})},interestsEvent:function(){for(var e=[],t=this.$store.state.memberLevel,a=0;a<t.length;a++){var n=this.moduleData["cardImg_"+a];n&&null!=n&&""!=n?e.push(n):e.push("static/images/mycenter/my-card-bg.png")}this.$market.customPush({path:"/mall2/membershipinterests",query:{bgs:JSON.stringify(e)}})},ponitdetail:function(){this.$market.customPush({path:"/mall2/integralinfo"})},youbi:function(){this.$market.customPush({path:"/usercenter/rebatebonus"})},getInfoWidth:function(){var e="",t=this.moduleData.width;return t>0&&(e+="left: "+(30-t)+"%;width: "+(40+2*t)+"%;"),e},getBgStyle:function(){var e="",t=this.moduleData.bgImgUrl;""!=t&&(e+="background: url('"+t+"') no-repeat center center / 100% 100%;");var a=this.moduleData.bgColor;return""!=a&&(e+="background-color: "+a+";"),e},getFloatUp:function(){var e="",t=this.moduleData.floatUp;t>0&&(e+="margin-top: -"+t+"%;");var a=this.moduleData.upMargin,n=this.moduleData.downMargin;return a>0&&(e+="margin-top: "+a+"%;"),n>0&&(e+="margin-bottom: "+n+"%;"),e},modeleReshow:function(){this.getMyAssets()},getMyAssets:function(){var e=this,t=this.$market.apiBaseURL()+"/app/json/user/getUserWallet",a={token:this.$store.state.login.token};this.$http.post(t,a).then((function(t){var a=t.data;0==a.status&&(e.$store.state.mall2.myAssets=a.data)}),(function(e){}))}},created:function(){""!=this.$store.state.login.token&&this.getMyAssets()}},o=r,c=(a("b96f"),a("0c7c")),m=Object(c["a"])(o,n,s,!1,null,"0a5ff562",null);t["default"]=m.exports},1148:function(e,t,a){"use strict";var n=a("a691"),s=a("1d80");e.exports=function(e){var t=String(s(this)),a="",i=n(e);if(i<0||i==1/0)throw RangeError("Wrong number of repetitions");for(;i>0;(i>>>=1)&&(t+=t))1&i&&(a+=t);return a}},"2a18":function(e,t,a){},"408a":function(e,t,a){var n=a("c6b6");e.exports=function(e){if("number"!=typeof e&&"Number"!=n(e))throw TypeError("Incorrect invocation");return+e}},b680:function(e,t,a){"use strict";var n=a("23e7"),s=a("a691"),i=a("408a"),r=a("1148"),o=a("d039"),c=1..toFixed,m=Math.floor,l=function(e,t,a){return 0===t?a:t%2===1?l(e,t-1,a*e):l(e*e,t/2,a)},u=function(e){var t=0,a=e;while(a>=4096)t+=12,a/=4096;while(a>=2)t+=1,a/=2;return t},d=function(e,t,a){var n=-1,s=a;while(++n<6)s+=t*e[n],e[n]=s%1e7,s=m(s/1e7)},f=function(e,t){var a=6,n=0;while(--a>=0)n+=e[a],e[a]=m(n/t),n=n%t*1e7},h=function(e){var t=6,a="";while(--t>=0)if(""!==a||0===t||0!==e[t]){var n=String(e[t]);a=""===a?n:a+r.call("0",7-n.length)+n}return a},g=c&&("0.000"!==8e-5.toFixed(3)||"1"!==.9.toFixed(0)||"1.25"!==1.255.toFixed(2)||"1000000000000000128"!==(0xde0b6b3a7640080).toFixed(0))||!o((function(){c.call({})}));n({target:"Number",proto:!0,forced:g},{toFixed:function(e){var t,a,n,o,c=i(this),m=s(e),g=[0,0,0,0,0,0],y="",v="0";if(m<0||m>20)throw RangeError("Incorrect fraction digits");if(c!=c)return"NaN";if(c<=-1e21||c>=1e21)return String(c);if(c<0&&(y="-",c=-c),c>1e-21)if(t=u(c*l(2,69,1))-69,a=t<0?c*l(2,-t,1):c/l(2,t,1),a*=4503599627370496,t=52-t,t>0){d(g,0,a),n=m;while(n>=7)d(g,1e7,0),n-=7;d(g,l(10,n,1),0),n=t-1;while(n>=23)f(g,1<<23),n-=23;f(g,1<<n),d(g,1,1),f(g,2),v=h(g)}else d(g,0,a),d(g,1<<-t,0),v=h(g)+r.call("0",m);return m>0?(o=v.length,v=y+(o<=m?"0."+r.call("0",m-o)+v:v.slice(0,o-m)+"."+v.slice(o-m))):v=y+v,v}})},b96f:function(e,t,a){"use strict";a("2a18")}}]);
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-22ea5702","chunk-8695c7ec","chunk-34b7a3be","chunk-34b7a3be","chunk-34b7a3be","chunk-34b7a3be","chunk-34b7a3be"],{"03c6":function(e,t,a){"use strict";var n=a("1da1"),i=(a("c975"),a("4160"),a("159b"),a("a9e3"),a("b680"),a("99af"),a("b0c0"),a("96cf"),{Header:{mName:"上导航(唯一)",btnEffect:[{cKey:"selectArea",name:"selectArea"},{cKey:"clickSearch",name:"clickSearch"},{cKey:"loginOut",name:"loginOut",imgUrl:"static/images/header/login-out.png"},{cKey:"showMore",name:"showMore",imgUrl:"static/images/header/more.png"},{cKey:"selectStation",name:"selectStation"},{cKey:"backNav",name:"backNav"},{cKey:"showMsg",name:"showMsg"},{cKey:"showScan",name:"showScan"},{cKey:"showShare",name:"showShare"},{cKey:"showQrcode",name:"showQrcode"},{cKey:"showService",name:"showService"},{cKey:"backNav",name:"backNav"}]},ImageAd:{mName:"图片广告/导航",name:{lbt:"轮播图",gndh:"功能导航",yhyg:"一行一个",lbdh:"列表导航"}},Rubik:{mName:"魔方",name:"魔方"},Auxiliary:{mName:"辅助组件"},MyCenter:{mName:"我的",btnEffect:[{cKey:"changeHeaderImg",name:"changeHeaderImg"},{cKey:"interestsEvent",name:"interestsEvent"},{cKey:"paidMemberInterestsEvent",name:"paidMemberInterestsEvent"},{cKey:"toScan",name:"toScan"},{cKey:"toRules",name:"toRules"}]},MyOrder:{mName:"我的订单",btnEffect:[{cKey:"allOrderEvent",name:"allOrderEvent"},{cKey:"interestsEvent",name:"interestsEvent"}]},FuelPrices:{mName:"今日油价",btnEffect:[{cKey:"toFuelPricesPage",name:"toFuelPricesPage"}]},MyAssets:{mName:"我的资产"},SecondsKill:{mName:"秒杀活动",btnEffect:[{cKey:"allSecondsKill",name:"allSecondsKill"}]},PickupAddress:{mName:"附近自提点",btnEffect:[{cKey:"allShops",name:"allShops"},{cKey:"allStation",name:"allStation"}]},MyPoints:{mName:"我的积分",btnEffect:[{cKey:"mx",name:"mx"}]},HScroll:{mName:"横滑组件",name:"横滑"},News:{mName:"资讯组件",btnEffect:[{cKey:"toNews",name:"新闻实事"}]},CoverFlow:{mName:"流动封面",name:"流动封面"},MemberCard:{mName:"会员卡",btnEffect:[{cKey:"bindCard",name:"bindCard"},{cKey:"interestsEvent",name:"interestsEvent"},{cKey:"youbi",name:"youbi"},{cKey:"ponitdetail",name:"ponitdetail"}]},CouponsTag:{mName:"电子券提醒",btnEffect:[{cKey:"",name:"CouponsTag"}]},MemberLevels:{mName:"会员级别",btnEffect:[{cKey:"",name:"MemberLevels"}]},TabsBlock:{mName:"Tabs",btnEffect:[{cKey:"",name:"TabsBlock"}]},HYTop:{mName:"海油顶部组件",btnEffect:[{cKey:"benefitsClick_1",name:"benefitsClick_1"},{cKey:"goStar",name:"goStar"},{cKey:"toCode",name:"toCode"},{cKey:"benefitsClick_2",name:"benefitsClick_2"}]},HYStation:{mName:"海油油站",btnEffect:[{cKey:"",name:"HYStation"}]},HYNews:{mName:"海油资讯",btnEffect:[{cKey:"moreNews",name:"moreNews"}]},WDInfo:{mName:"微店信息",btnEffect:[{cKey:"collection",name:"collection"},{cKey:"moreMicorShop",name:"moreMicorShop"}]},ESHTop:{mName:"e生活顶部",btnEffect:[{cKey:"",name:"ESHTop"}]},ESHNearStation:{mName:"e生活油站",btnEffect:[{cKey:"more",name:"more"}]},ESHDZJYQ:{mName:"e生活加油券",btnEffect:[{cKey:"oilcoupon",name:"oilcoupon"},{cKey:"orderlist",name:"orderlist"},{cKey:"oilcoupondetail",name:"oilcoupondetail"},{cKey:"supportstation",name:"supportstation"}]},ESHJFHQ:{mName:"e生活积分换券",btnEffect:[{cKey:"more",name:"more"}]},BtnProduct:{mName:"自定义购买",btnEffect:[{cKey:"leftBtnEvent",name:"leftBtnEvent"},{cKey:"buyEvent",name:"buyEvent"},{cKey:"toAgreement",name:"toAgreement"}]},HKTop:{mName:"好客顶部",btnEffect:[{cKey:"toProvince",name:"toProvince"},{cKey:"toLogin",name:"点我登录"},{cKey:"myhkd",name:"资产明细"},{cKey:"exchange",name:"权益领取"},{cKey:"orderlist",name:"我的订单"}]},CardProvincial:{mName:"卡车翼家组件",btnEffect:[{cKey:"addCardFun_1",name:"绑定柴油卡"},{cKey:"addCardFun_2",name:"立即认证"}]}}),c={beginMaxValue:10,maxValue:10,totalLevel:5,pageTotal:{visit:0,clicks:0},itemClickTimes:{},itemClickPersons:{},menus:window.getMenus&&window.getMenus(),getPageClickTimes:function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(t,a){var n,i,c,o,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a?(n=a.url,i=a.params):(n="/system/json/data_stats/queryRealtimeDataStats",i={token:t.$store.state.login.token,group:"Access_PageHotspot",dateType:1,extend1:t.$route.query.pgCode}),e.next=3,t.$http.post(n,i);case 3:return c=e.sent,o=c.data,0==o.status?(r=o.data,this.dataAnalysis(r)):t.$Message.error(o.info),e.abrupt("return",c);case 7:case"end":return e.stop()}}),e,this)})));function t(t,a){return e.apply(this,arguments)}return t}(),resetData:function(){this.pageTotal={visit:0,clicks:0},this.itemClickTimes={},this.itemClickPersons={}},dataAnalysis:function(e){e||(e=[]),this.resetData(),this.maxValue=this.beginMaxValue;for(var t=0;t<e.length;t++){var a=e[t],n=a.mainKey,i=a.subKey;if(i)if(n.indexOf("pagenumber")>-1){a.value>this.maxValue&&(this.maxValue=a.value);var c=this.itemClickPersons[i];this.itemClickPersons[i]=c?c+a.value:a.value,this.pageTotal.visit+=a.value}else if(n.indexOf("pagemantime")>-1){a.value>this.maxValue&&(this.maxValue=a.value);var o=this.itemClickTimes[i];this.itemClickTimes[i]=o?o+a.value:a.value,this.pageTotal.clicks+=a.value}}},getTimesForKey:function(e){return this.itemClickTimes[e]},getPersonsForKey:function(e){return this.itemClickPersons[e]},getHotareaLevel:function(e){var t=Math.floor(this.totalLevel-e/this.maxValue*this.totalLevel)+1;return t},getModuleClickStatistics:function(e){},getModuleData:function(e){var t=this;if(e._cache)return e._cache;var a=this.getHotareaEffect(e),n=0;return a.forEach((function(e){e.clicks=t.itemClickTimes[e.idCode]||0,e.visit=t.itemClickPersons[e.idCode]||0,n+=e.clicks})),a.forEach((function(e){var t=n?Number(e.clicks)/Number(n)*100:0;e.percent=t.toFixed(2)})),e._cache=a,a},getHotareaEffect:function(e){var t=i[e.code]||{},a=this.getRows(e,t),n=this.getBtnList(e,t);return a.concat(n)},getRows:function(e,t){var a=[];return e.data.rows&&e.data.rows.forEach((function(n,i){if(n.idCode){var c={};c.idCode=n.idCode;var o="string"==typeof o?t.name:t.name[e.data.type];c.name=(o||e.code)+(i+1),n.imgUrl&&(c.imgUrl=n.imgUrl),a.push(c)}})),a},getBtnList:function(e,t){var a=[],n=e.data.idCode;return n&&t.btnEffect&&t.btnEffect.forEach((function(e){var t={};t.idCode=n+e.cKey,t.name=e.name||e.cKey,e.imgUrl&&(t.imgUrl=e.imgUrl),a.push(t)})),a}},o=c,r=a("3028"),s=a("13f8"),m={methods:{hotareaClass:function(e,t){if(1==r["a"]())return"";if(e.idCode){var a=o.getTimesForKey(e.idCode,!0);if(a>0){var n="hotarea_level_"+o.getHotareaLevel(a);if(t){var i={};return i[n]=!0,i}return n}}},actionBtnEvent:function(e,t){e&&t&&s["a"].commonAction("140001","","","","",t,e,e,"")}}};t["a"]=m},1148:function(e,t,a){"use strict";var n=a("a691"),i=a("1d80");e.exports=function(e){var t=String(i(this)),a="",c=n(e);if(c<0||c==1/0)throw RangeError("Wrong number of repetitions");for(;c>0;(c>>>=1)&&(t+=t))1&c&&(a+=t);return a}},2407:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return e.$market.moduleIsShow(e.moduleData)?a("div",{ref:"rubik",staticClass:"rubik",style:e.getBaseStyle(e.moduleData)},[a("div",{staticClass:"rubik-re",style:e.getSidesStyle(e.moduleData)},[a("div",{staticClass:"rubik-content",style:e.getStyle(e.moduleData)},e._l(e.moduleData.rows,(function(t,n){return a("div",{key:n,staticClass:"rubik-img",class:e.hotareaClass(t),style:e.getImgStyle(e.moduleData,n),on:{click:function(a){e.hotEvent(t.idCode),e.enterNav(t)}}},[a("img",{attrs:{src:t.imgUrl}})])})),0)])]):e._e()},i=[],c=a("5530"),o=(a("e25e"),a("2f62")),r=a("03c6"),s={name:"rubik",components:{},props:["myIndex","usePorpData","propData"],computed:Object(c["a"])(Object(c["a"])({},Object(o["c"])(["clientWidth"])),{},{pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.pageData},moduleData:function(){return this.pageData.moduleList[this.myIndex].data},contentWidth:function(){var e=this.moduleData.sidesMargin;return e>0?this.clientWidth*(100-e-e)/100:this.clientWidth}}),mixins:[r["a"]],data:function(){return{myWidth:0,myHeight:0}},methods:{hotEvent:function(e){this.actionBtnEvent(this.pageData.pgCode,e)},enterNav:function(e){this.$market.enterNav(e,this.pageData.pgCode)},getBaseStyle:function(e){var t="";""!=e.bgColor&&(t+="background-color: "+e.bgColor+";"),""!=e.bgImgUrl&&(t+="background: url('"+e.bgImgUrl+"') no-repeat center center / 100% 100%;");var a,n=this.moduleData.floatUp;if(n>0&&(t+="margin-top: -"+n+"%;"),e.type<=3&&""!=e.ratio)a=(this.contentWidth-e.type*e.space)/(e.type+1)*e.ratio;else if(8==e.type)if(e.customInfo.layouts.length){for(var i=this.contentWidth/e.customInfo.size,c=0,o=0;o<e.customInfo.layouts.length;o++){var r=e.customInfo.layouts[o],s=r.position_y+r.height;c<s&&(c=s)}a=i*c}else a=this.contentWidth;else a=this.contentWidth;return t+="height:"+a+"px;",this.myWidth=this.contentWidth+e.space,this.myHeight=a+e.space,t},getSidesStyle:function(){var e="",t=this.moduleData.sidesMargin;return t>0&&(e+="margin-left: "+t+"%; margin-right: "+t+"%;"),e},getStyle:function(e){var t="";return t+="margin:-"+e.space/2+"px;",t+="width:"+this.myWidth+"px;",t+="height:"+this.myHeight+"px;",t},getImgStyle:function(e,t){var a="";if(a+="margin:"+e.space/2+"px;",e.type<=3){var n=this.myWidth/(e.type+1)-e.space,i=this.myHeight-e.space;a+="width:"+n+"px;",a+="height:"+i+"px;",a+="top:0px;left:"+t*(n+e.space)+"px;"}else if(4==e.type){var c=this.myWidth/2-e.space;a+="width:"+c+"px;",a+="height:"+c+"px;",a+="top:"+parseInt(t/2)*(c+e.space)+"px;left:"+t%2*(c+e.space)+"px;"}else if(5==e.type){var o=this.myWidth/2-e.space;a+="width:"+o+"px;";var r=0==t?this.myHeight-e.space:o;a+="height:"+r+"px;",a+="top:"+parseInt(t/2)*(o+e.space)+"px;left:"+(t>0?1:0)*(o+e.space)+"px;"}else if(6==e.type){var s=this.myWidth/2-e.space,m=t>0?s:this.myWidth-e.space;a+="width:"+m+"px;",a+="height:"+s+"px;",a+="top:"+(t>0?1:0)*(s+e.space)+"px;left:"+parseInt(t/2)*(s+e.space)+"px;"}else if(7==e.type){var l=this.myWidth/2-e.space,u=this.myWidth/4-e.space,h=t>0?l:this.myHeight-e.space;a+="width:"+(t>1?u:l)+"px;",a+="height:"+h+"px;";var f=0;t>0&&(f=l+e.space),3==t&&(f+=u+e.space),a+="top:"+(t>1?1:0)*(l+e.space)+"px;left:"+f+"px;"}else if(8==e.type){if(e.customInfo.layouts.length<t+1)return"";var d=e.customInfo.layouts[t],p=this.myWidth/e.customInfo.size,y=p*d.width,g=p*d.height,v=p*d.position_y,b=p*d.position_x;a+="width:"+(y-e.space)+"px;",a+="height:"+(g-e.space)+"px;",a+="top:"+v+"px;left:"+b+"px;"}return a}},created:function(){}},m=s,l=(a("b2c8"),a("0c7c")),u=Object(l["a"])(m,n,i,!1,null,"4b78625d",null);t["default"]=u.exports},"408a":function(e,t,a){var n=a("c6b6");e.exports=function(e){if("number"!=typeof e&&"Number"!=n(e))throw TypeError("Incorrect invocation");return+e}},b2c8:function(e,t,a){"use strict";a("f80a")},b680:function(e,t,a){"use strict";var n=a("23e7"),i=a("a691"),c=a("408a"),o=a("1148"),r=a("d039"),s=1..toFixed,m=Math.floor,l=function(e,t,a){return 0===t?a:t%2===1?l(e,t-1,a*e):l(e*e,t/2,a)},u=function(e){var t=0,a=e;while(a>=4096)t+=12,a/=4096;while(a>=2)t+=1,a/=2;return t},h=function(e,t,a){var n=-1,i=a;while(++n<6)i+=t*e[n],e[n]=i%1e7,i=m(i/1e7)},f=function(e,t){var a=6,n=0;while(--a>=0)n+=e[a],e[a]=m(n/t),n=n%t*1e7},d=function(e){var t=6,a="";while(--t>=0)if(""!==a||0===t||0!==e[t]){var n=String(e[t]);a=""===a?n:a+o.call("0",7-n.length)+n}return a},p=s&&("0.000"!==8e-5.toFixed(3)||"1"!==.9.toFixed(0)||"1.25"!==1.255.toFixed(2)||"1000000000000000128"!==(0xde0b6b3a7640080).toFixed(0))||!r((function(){s.call({})}));n({target:"Number",proto:!0,forced:p},{toFixed:function(e){var t,a,n,r,s=c(this),m=i(e),p=[0,0,0,0,0,0],y="",g="0";if(m<0||m>20)throw RangeError("Incorrect fraction digits");if(s!=s)return"NaN";if(s<=-1e21||s>=1e21)return String(s);if(s<0&&(y="-",s=-s),s>1e-21)if(t=u(s*l(2,69,1))-69,a=t<0?s*l(2,-t,1):s/l(2,t,1),a*=4503599627370496,t=52-t,t>0){h(p,0,a),n=m;while(n>=7)h(p,1e7,0),n-=7;h(p,l(10,n,1),0),n=t-1;while(n>=23)f(p,1<<23),n-=23;f(p,1<<n),h(p,1,1),f(p,2),g=d(p)}else h(p,0,a),h(p,1<<-t,0),g=d(p)+o.call("0",m);return m>0?(r=g.length,g=y+(r<=m?"0."+o.call("0",m-r)+g:g.slice(0,r-m)+"."+g.slice(r-m))):g=y+g,g}})},f80a:function(e,t,a){}}]);
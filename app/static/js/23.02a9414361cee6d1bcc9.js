(window.webpackJsonp=window.webpackJsonp||[]).push([[23,1e3,1001,1002,1003,1004],{"44fq":function(e,t,a){"use strict";var i=a("L2JU"),s={name:"category",props:["category","NoCategory","domIndex"],data:function(){return{categoryList:[],currentSelect:0}},created:function(){var e=this;this.$http.post("/app/json/product/getAppProCategoryList").then((function(t){e.categoryList=t.data.data.list,e.categoryList.unshift({clsType:"",id:0,cateLevel:"",name:"推荐",parentId:"",phUrl:"",sort:""}),e.domIndex?e.$nextTick((function(){e.$refs.categoryList.scrollTo(e.$refs["category"+e.domIndex][0].offsetLeft-20,0)})):e.NoCategory&&"商品列表"==e.$route.name&&e.$nextTick((function(){e.$refs.categoryList.scrollTo(e.$refs.category1[0].offsetLeft-20,0)})),e.NoCategory&&"商品列表"==e.$route.name&&!e.$route.query.searchKey&&(e.$emit("toggle",e.categoryList[1].id),e.currentSelect=e.categoryList[1].id),e.category&&(e.currentSelect=e.category)})),console.log(this.$route)},mounted:function(){},components:{},methods:(Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var i in a)Object.prototype.hasOwnProperty.call(a,i)&&(e[i]=a[i])}return e})({navToSearch:function(e,t){if(this.currentSelect=e.id,0==e.id)this.$router.push("/common");else if("新首页"==this.$route.name){var a="/mall2/list/"+this.$util.getDataString();this.$router.push({path:a,query:{category:e.id,cateLevel:1,domIndex:t}})}else"商品列表"==this.$route.name&&this.$emit("toggle",e.id)}},Object(i.d)(["setShowCategory"])),computed:{bgColor:{get:function(){switch(this.$route.name){case"商品列表":return"#ffffff";case"新首页":return this.currentSelect=0,this.setShowCategory(!0),"#f74440";default:return"#ffffff"}},set:function(){}},textColor:{get:function(){switch(this.$route.name){case"商品列表":return"#f74440";case"首页":return this.setShowCategory(!0),this.currentSelect=0,"#ffffff";default:return"#ffffff"}},set:function(){}}}},n=(a("RI8a"),a("KHd+")),o=Object(n.a)(s,(function(){var e=this,t=e.$createElement,i=e._self._c||t;return e.$store.state.isPreview?e._e():i("div",{staticClass:"category",style:{backgroundColor:e.bgColor}},[i("div",{ref:"categoryList",staticClass:"categoryList"},e._l(e.categoryList,(function(t,s){return i("div",{key:s,staticClass:"categoryItem",on:{click:function(a){return e.navToSearch(t,s)}}},[i("div",{ref:"category"+s,refInFor:!0,staticClass:"categoryName",class:t.id==e.currentSelect?"select":"",style:{color:e.textColor}},[e._v("\n        "+e._s(t.name)+"\n      ")]),e._v(" "),i("img",{directives:[{name:"show",rawName:"v-show",value:t.id==e.currentSelect,expression:"item.id == currentSelect"}],attrs:{src:"新首页"==e.$route.name?a("eERq"):"商品列表"==e.$route.name?a("sHCL"):"",alt:""}})])})),0)])}),[],!1,null,"4e2ba9dd",null);t.a=o.exports},"9eyK":function(e,t,a){},A8ay:function(e,t,a){"use strict";var i={Header:{mName:"上导航(唯一)",btnEffect:[{cKey:"selectArea",name:"selectArea"},{cKey:"clickSearch",name:"clickSearch"},{cKey:"loginOut",name:"loginOut",imgUrl:"static/images/header/login-out.png"},{cKey:"showMore",name:"showMore",imgUrl:"static/images/header/more.png"},{cKey:"selectStation",name:"selectStation"},{cKey:"backNav",name:"backNav"},{cKey:"showMsg",name:"showMsg"},{cKey:"showScan",name:"showScan"},{cKey:"showShare",name:"showShare"},{cKey:"showQrcode",name:"showQrcode"},{cKey:"showService",name:"showService"},{cKey:"backNav",name:"backNav"}]},ImageAd:{mName:"图片广告/导航",name:{lbt:"轮播图",gndh:"功能导航",yhyg:"一行一个",lbdh:"列表导航"}},Rubik:{mName:"魔方",name:"魔方"},Auxiliary:{mName:"辅助组件"},MyCenter:{mName:"我的",btnEffect:[{cKey:"changeHeaderImg",name:"changeHeaderImg"},{cKey:"interestsEvent",name:"interestsEvent"},{cKey:"paidMemberInterestsEvent",name:"paidMemberInterestsEvent"},{cKey:"toScan",name:"toScan"},{cKey:"toRules",name:"toRules"}]},MyOrder:{mName:"我的订单",btnEffect:[{cKey:"allOrderEvent",name:"allOrderEvent"},{cKey:"interestsEvent",name:"interestsEvent"}]},FuelPrices:{mName:"今日油价",btnEffect:[{cKey:"toFuelPricesPage",name:"toFuelPricesPage"}]},MyAssets:{mName:"我的资产"},SecondsKill:{mName:"秒杀活动",btnEffect:[{cKey:"allSecondsKill",name:"allSecondsKill"}]},PickupAddress:{mName:"附近自提点",btnEffect:[{cKey:"allShops",name:"allShops"},{cKey:"allStation",name:"allStation"}]},MyPoints:{mName:"我的积分",btnEffect:[{cKey:"mx",name:"mx"}]},HScroll:{mName:"横滑组件",name:"横滑"},News:{mName:"资讯组件",btnEffect:[{cKey:"toNews",name:"新闻实事"}]},CoverFlow:{mName:"流动封面",name:"流动封面"},MemberCard:{mName:"会员卡",btnEffect:[{cKey:"bindCard",name:"bindCard"},{cKey:"interestsEvent",name:"interestsEvent"},{cKey:"youbi",name:"youbi"},{cKey:"ponitdetail",name:"ponitdetail"}]},CouponsTag:{mName:"电子券提醒",btnEffect:[{cKey:"",name:"CouponsTag"}]},MemberLevels:{mName:"会员级别",btnEffect:[{cKey:"",name:"MemberLevels"}]},TabsBlock:{mName:"Tabs",btnEffect:[{cKey:"",name:"TabsBlock"}]},HYTop:{mName:"海油顶部组件",btnEffect:[{cKey:"benefitsClick_1",name:"benefitsClick_1"},{cKey:"goStar",name:"goStar"},{cKey:"toCode",name:"toCode"},{cKey:"benefitsClick_2",name:"benefitsClick_2"}]},HYStation:{mName:"海油油站",btnEffect:[{cKey:"",name:"HYStation"}]},HYNews:{mName:"海油资讯",btnEffect:[{cKey:"moreNews",name:"moreNews"}]},WDInfo:{mName:"微店信息",btnEffect:[{cKey:"collection",name:"collection"},{cKey:"moreMicorShop",name:"moreMicorShop"}]},ESHTop:{mName:"e生活顶部",btnEffect:[{cKey:"",name:"ESHTop"}]},ESHNearStation:{mName:"e生活油站",btnEffect:[{cKey:"more",name:"more"}]},ESHDZJYQ:{mName:"e生活加油券",btnEffect:[{cKey:"oilcoupon",name:"oilcoupon"},{cKey:"orderlist",name:"orderlist"},{cKey:"oilcoupondetail",name:"oilcoupondetail"},{cKey:"supportstation",name:"supportstation"}]},ESHJFHQ:{mName:"e生活积分换券",btnEffect:[{cKey:"more",name:"more"}]},BtnProduct:{mName:"自定义购买",btnEffect:[{cKey:"leftBtnEvent",name:"leftBtnEvent"},{cKey:"buyEvent",name:"buyEvent"},{cKey:"toAgreement",name:"toAgreement"}]},HKTop:{mName:"好客顶部",btnEffect:[{cKey:"toProvince",name:"toProvince"},{cKey:"toLogin",name:"点我登录"},{cKey:"myhkd",name:"资产明细"},{cKey:"exchange",name:"权益领取"},{cKey:"orderlist",name:"我的订单"}]},CardProvincial:{mName:"卡车翼家组件",btnEffect:[{cKey:"addCardFun_1",name:"绑定柴油卡"},{cKey:"addCardFun_2",name:"立即认证"}]}},s={beginMaxValue:10,maxValue:10,totalLevel:5,pageTotal:{visit:0,clicks:0},itemClickTimes:{},itemClickPersons:{},menus:window.getMenus&&window.getMenus(),getPageClickTimes:function(){var e,t=(e=regeneratorRuntime.mark((function e(t,a){var i,s,n,o,r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a?(i=a.url,s=a.params):(i="/system/json/data_stats/queryRealtimeDataStats",s={token:t.$store.state.login.token,group:"Access_PageHotspot",dateType:1,extend1:t.$route.query.pgCode}),e.next=3,t.$http.post(i,s);case 3:return n=e.sent,0==(o=n.data).status?(r=o.data,this.dataAnalysis(r)):t.$Message.error(o.info),e.abrupt("return",n);case 7:case"end":return e.stop()}}),e,this)})),function(){var t=e.apply(this,arguments);return new Promise((function(e,a){return function i(s,n){try{var o=t[s](n),r=o.value}catch(e){return void a(e)}if(!o.done)return Promise.resolve(r).then((function(e){i("next",e)}),(function(e){i("throw",e)}));e(r)}("next")}))});return function(e,a){return t.apply(this,arguments)}}(),resetData:function(){this.pageTotal={visit:0,clicks:0},this.itemClickTimes={},this.itemClickPersons={}},dataAnalysis:function(e){e||(e=[]),this.resetData(),this.maxValue=this.beginMaxValue;for(var t=0;t<e.length;t++){var a=e[t],i=a.mainKey,s=a.subKey;if(s)if(i.indexOf("pagenumber")>-1){a.value>this.maxValue&&(this.maxValue=a.value);var n=this.itemClickPersons[s];this.itemClickPersons[s]=n?n+a.value:a.value,this.pageTotal.visit+=a.value}else if(i.indexOf("pagemantime")>-1){a.value>this.maxValue&&(this.maxValue=a.value);var o=this.itemClickTimes[s];this.itemClickTimes[s]=o?o+a.value:a.value,this.pageTotal.clicks+=a.value}}},getTimesForKey:function(e){return this.itemClickTimes[e]},getPersonsForKey:function(e){return this.itemClickPersons[e]},getHotareaLevel:function(e){return Math.floor(this.totalLevel-e/this.maxValue*this.totalLevel)+1},getModuleClickStatistics:function(e){},getModuleData:function(e){var t=this;if(e._cache)return e._cache;var a=this.getHotareaEffect(e),i=0;return a.forEach((function(e){e.clicks=t.itemClickTimes[e.idCode]||0,e.visit=t.itemClickPersons[e.idCode]||0,i+=e.clicks})),a.forEach((function(e){var t=i?Number(e.clicks)/Number(i)*100:0;e.percent=t.toFixed(2)})),e._cache=a,a},getHotareaEffect:function(e){var t=i[e.code]||{},a=this.getRows(e,t),s=this.getBtnList(e,t);return a.concat(s)},getRows:function(e,t){var a=[];return e.data.rows&&e.data.rows.forEach((function(i,s){if(i.idCode){var n={};n.idCode=i.idCode;var o="string"==typeof o?t.name:t.name[e.data.type];n.name=(o||e.code)+(s+1),i.imgUrl&&(n.imgUrl=i.imgUrl),a.push(n)}})),a},getBtnList:function(e,t){var a=[],i=e.data.idCode;return i&&t.btnEffect&&t.btnEffect.forEach((function(e){var t={};t.idCode=i+e.cKey,t.name=e.name||e.cKey,e.imgUrl&&(t.imgUrl=e.imgUrl),a.push(t)})),a}},n=a("MCgc"),o=a("E/iu"),r={methods:{hotareaClass:function(e,t){if(1==n.a())return"";if(e.idCode){var a=s.getTimesForKey(e.idCode,!0);if(a>0){var i="hotarea_level_"+s.getHotareaLevel(a);if(t){var o={};return o[i]=!0,o}return i}}},actionBtnEvent:function(e,t){e&&t&&o.a.commonAction("140001","","","","",t,e,e,"")}}};t.a=r},KgZr:function(e,t,a){},RI8a:function(e,t,a){"use strict";var i=a("KgZr");a.n(i).a},"Z3+7":function(e,t,a){"use strict";var i=a("9eyK");a.n(i).a},eERq:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAMCAYAAAB4MH11AAABUklEQVQ4T53Tz4uOURjG8c9FrFgoSTYWWLDxD1CStQ0lJDVKbJUosfCjSNn6UZRkpNhYa5qa+QdsWGBhQRZiYUfcOnpfPfP2zMz7OptT577u+/s813VOqmoNbuEIPuNKkof+Y1XVcVzERkzjTKrqLk525hX2JpmdhFFVezCDdPruNcBXrBsZNp9k94SAOewa6fnWAB+xqWfYiSQPxoFU1RTu92g/NcBVXOgp/mi5JHm+FKSqDgz8Xt2ju9YAG/AOa3sELY9HuJHkdbdeVTtwDsdGfB/KvmPr30Cq6hRuL2PHB7wfaLZg8zL600nuDAFtf4zD43g+huYJjiapf1eqqlbhGfaPMWApyQscTPKzibp3tlm1ApdxHisnBP3CdVxK8nvYuwAwPKyqnbiJfYsEuCBvvMTZJK9GP6oX0AFtw6HBA9qO9YPaF7zBPJ4mebvY3/4BsXBpDa5S858AAAAASUVORK5CYII="},p0jF:function(e,t,a){},sHCL:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAMCAYAAAB4MH11AAABu0lEQVQ4T52SP2hTURjFz7mNLrVDqbxnXRzUwS4OhXdFKhQRIXnBRUGslIKC6CqIguhQKyiCq1ZQELEitIsk7SIi2MEX6OBiB9uhgzbv4Z8hdNH0HjHU+kxq0njX8/vOuffcj0nf4DbX1XkX0BCEsgFveKXiY/zHSYJwxEHXQOwAOGEqKxdZtuE4oHMpP4nmcO/bwut2MpYP5Acp9woA/8zxAZdt7iuB7rQZwVk/Kh5qJyC24RtBA+kZAd8Y2/CjoJ31ZgY860XFR5sJSWx4xkEP61lCn1gOsmMgr9aLEr4bYsiPpqeahcQ2d9wJEyS2NnDSTVYOHvVWVjMLALoajSSCTzLQ7Z5o5n1a/2KzfVXwsqBhgKne16lKZ0d1T02Ig9x5Efda1LEEYHGN2Q1gVzOewgW/NH2/FiCAiQ2fCjq1mc5bMQSfeVHxNAGtP039/VvijDcJ8Fgrg+a6XvjV5ATn5n784v7qToCJg+woyCsAOtoMWoV0yy/NXCfgfs9u9DmIg/x+0d0BcKT+EhstAsCXlLnklwrvGle1yTUTm9/r6E5SGhC5D8L2Gk58pjQvctbIPPeiwod/2fwENsWaiOMtB+EAAAAASUVORK5CYII="},t8H8:function(e,t,a){"use strict";var i=a("p0jF");a.n(i).a},"v/Xm":function(e,t,a){"use strict";a.r(t),a("4X9F");var i=a("IkEG"),s={name:"top-nav",components:{},props:["usePorpData","propData","barHeight","scrollSite"],computed:{pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.pageData},myData:function(){return this.pageData.header.data},isCommon:{get:function(){switch(this.$route.path){case"/common":return!0;default:return!1}},set:function(){}},shoppingCartCount:{get:function(){return this.$store.state.mall2.cartNum},set:function(){}}},mixins:[a("A8ay").a],data:function(){return{currentValue:"",imgStyle:{display:"block",width:"20px",height:"20px"},imgStyle1:{display:"block",width:"26px",height:"26px"},topDivStyle:"opacity: 1;",isShowAddWechat:!1,isShowWechatFavDesc:!1,wechatDescPicUrl:"",wxReady:!1}},watch:{scrollSite:function(e,t){if(1==this.myData.isFloat)if(e>60)this.topDivStyle="opacity: 1;";else{var a=e/60;this.topDivStyle="opacity: "+a+";"}else this.topDivStyle="opacity: 1;"}},created:function(){this._getCartCount(),console.log("-------------this.$store.state.webtype--------------",this.$store.state.webtype,this.$store.state.userInfo.phone,this.$store.state.userInfo.userId)},activated:function(){this._getCartCount()},methods:{getWechatSignature:function(e){!(arguments.length>1&&void 0!==arguments[1])||arguments[1];var t={url:navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)?window.initUrl:window.location.href.split("#")[0]};this.$http.post("/app/json/we_chat/signature",t).then((function(t){var a=t.data;console.log("--------res------------",t),0==a.status?(wx.config({appId:a.data.appId,timestamp:a.data.timestamp,nonceStr:a.data.nonceStr,signature:a.data.signature,beta:!0,jsApiList:["getLocation","updateAppMessageShareData","updateTimelineShareData","onMenuShareTimeline","scanQRCode","onMenuShareAppMessage","chooseImage","getLocalImgData","uploadImage","downloadImage","openLocation","chooseInvoiceTitle","hideAllNonBaseMenuItem","hideMenuItems"]}),wx.ready((function(){console.log("----isSignature--------签名成功"),e&&wx.chooseImage({count:1,sizeType:["original","compressed"],sourceType:["album","camera"],success:function(e){var t=e.localIds;console.log("------------localIds-----------",t)}})})),wx.error((function(t){console.log("----签名配置失败--------",t),e&&e(!1)}))):(console.log(a.info),Toast("signature err "+a.info),e&&e(!1))}),(function(t){console.log("获取失败",t),Toast("获取数据失败"),e&&e(!1)}))},_getCartCount:function(){var e=this,t={token:this.$store.state.login.token,deliveryType:"2",orderCategory:"0",vipUnitUserCode:""};this.$http.post("/app/json/app_cart/getCartCount",t).then((function(t){e.shoppingCartCount=t.data.data}),(function(t){e.$Loading.close(),e.$Toast("请求数据失败！")}))},navToCar:function(){this.$router.push({path:"/mall2/cart",query:{orderCategory:"",vipUnitUserCode:""}})},hotEvent:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.actionBtnEvent(this.pageData.pgCode,this.myData.idCode+e)},closeFavorites:function(){this.isShowAddWechat=!1},addWechatFavorites:function(){this.isShowWechatFavDesc=!0},showShare:function(){this.$market.showShare({title:this.myData.shareTitle?this.myData.shareTitle:"",sharetext:this.myData.shareContent?this.myData.shareContent:"",imageurl:this.myData.shareImgUrl?this.myData.shareImgUrl:"",detailurl:window.location.href})},showQrcode:function(){var e;e=2==this.myData.memberCodeType?"/usercenter/myqrcode?isPreRegiste=true":3==this.myData.memberCodeType?"/usercenter/myqrcode?isToRegiste=true":4==this.myData.memberCodeType?"/usercenter/hx-qrcode":"/usercenter/myqrcode",this.$market.customPush({path:e})},getStyleHeaderBg:function(e){var t="";return this.barHeight&&(t+="paddingTop: "+this.barHeight+"px;"),t},getMessageNumber:function(){var e=this;if(this.$store.state.login.token){var t=this.$market.apiBaseURL()+"/app/json/message/getUnreadMsgCnt",a={token:this.$store.state.login.token};this.$http.post(t,a).then((function(t){var a=t.data;0==a.status&&(e.$store.state.indexData.msgNumber=a.data,e.$bridgefunc.vuexStorage())}),(function(e){}))}},getBgDivStyle:function(e){var t=this.topDivStyle,a=e.bgImgUrl;""!=a&&(t+="background: url('"+a+"') no-repeat center center / 100% 100%;");var i=e.bgColor;return""!=i&&(t+="background-color: "+i+";"),this.barHeight&&(t+="height: "+(this.barHeight+44)+"px;"),t},confirmLoginOut:function(){var e=this;i.a.confirm({title:"提示",message:"您确定要退出登录吗？"}).then((function(){e.$market.loginOut()})).catch((function(){}))}},mounted:function(){3==this.$store.state.webtype&&1!=this.$store.state.isAddToFavorites&&this.$store.state.globalConfig.hasFavoritesDescriptionPic&&(this.wechatDescPicUrl=this.$store.state.globalConfig.hasFavoritesDescriptionPic||"",this.isShowAddWechat=!0),this.myData.bgStyle||(this.myData.bgStyle="common"),-1!=this.$store.state.webtype||this.myData.idCode||(this.myData.idCode=this.$util.randomString()),1==this.myData.isFloat&&(this.topDivStyle="opacity: 0;"),this.myData.isShowMsg&&this.getMessageNumber()}},n=(a("t8H8"),a("KHd+")),o=Object(n.a)(s,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"top-nav",class:{pfixed:e.usePorpData}},["default"==e.myData.type?a("div",{staticClass:"default-div default-div-bg",style:e.getStyleHeaderBg(e.myData)},[a("div",{staticClass:"flex-box",style:{"min-height":this.$market.getNavHeight()+"px"}},[a("div",{staticClass:"nav-top-title",style:{"line-height":this.$market.getNavHeight()+"px",color:e.myData.titleColor}},[e._v("\n        "+e._s(e.myData.title)+"\n      ")])])]):e._e(),e._v(" "),"custom"==e.myData.type?a("div",{staticClass:"default-div",style:e.getStyleHeaderBg(e.myData)},[a("div",{staticClass:"bg-div",style:e.getBgDivStyle(e.myData)}),e._v(" "),""!=e.$store.state.login.token&&e.myData.isShowUserMessage?a("div",{staticClass:"user-msg",class:{"deeper-text":1!=e.myData.isFloat||e.scrollSite>60},style:{top:e.barHeight+"px"}},[e._v("\n      尊敬的"+e._s(e.$store.state.mall2.myAssets.levelNoStr)+"会员，您的积分余额："+e._s(e.$store.state.mall2.myAssets.surplusPoints)+"\n    ")]):e._e(),e._v(" "),"white"!=e.myData.bgStyle?a("div",{staticClass:"flex-div",style:{"min-height":this.$market.getNavHeight(!0)+"px",backgroundImage:"url("+e.myData.bgImgUrl2+")"}},["title"==e.myData.middelControl?a("div",{staticClass:"nav-top-title",style:{"line-height":this.$market.getNavHeight(!0)+"px",height:this.$market.getNavHeight(!0)+"px",color:e.myData.titleColor}},[e._v("\n        "+e._s(e.myData.title)+"\n      ")]):e._e(),e._v(" "),e.myData.isShowBack?a("div",{staticClass:"img-btn-pading space-margin",class:Object.assign({},{"img-btn-bg":1==e.myData.isFloat&&e.scrollSite<60},e.hotareaClass({idCode:e.myData.idCode+"backNav"},!0)),on:{click:function(t){e.hotEvent("backNav"),e.$market.backNav()}}},[a("img",{style:e.imgStyle,attrs:{src:"static/images/header/back.png"}})]):e._e(),e._v(" "),"search"==e.myData.middelControl?a("div",{staticClass:"search-div other-full space-margin",class:Object.assign({},{"search-div-bg":1==e.myData.isFloat&&e.scrollSite<60},e.hotareaClass({idCode:e.myData.idCode+"clickSearch"},!0))},[a("div",{staticClass:"search-bg",on:{click:function(t){e.hotEvent("clickSearch"),e.$market.clickSearch()}}},[a("div",{staticClass:"search-main",staticStyle:{height:"20px","line-height":"20px"}},[e._v("\n            商品名称\n          ")]),e._v(" "),a("div",{staticClass:"search-icon"},[a("img",{staticStyle:{display:"block"},attrs:{width:"16px",height:"16px",src:1==e.myData.isFloat&&e.scrollSite<60?"static/images/header/search-w.png":"static/images/header/search.png"}})])])]):e._e(),e._v(" "),"search"!=e.myData.middelControl?a("div",{staticClass:"other-full"}):e._e(),e._v(" "),e.isCommon&&"3"!==e.$store.state.webtype?a("span",{staticClass:"home-shoppingCart",on:{click:e.navToCar}},[a("i",{directives:[{name:"show",rawName:"v-show",value:e.shoppingCartCount>0,expression:"shoppingCartCount > 0"}]},[e._v(e._s(e.shoppingCartCount))]),e._v(" "),a("img",{attrs:{src:"static/images/card-provincial/shopping_cart.png"}})]):e._e(),e._v(" "),e.myData.isShowMsg?a("div",{staticClass:"img-btn-pading space-margin",class:Object.assign({},{"img-btn-bg":1==e.myData.isFloat&&e.scrollSite<60},e.hotareaClass({idCode:e.myData.idCode+"showMsg"},!0)),on:{click:function(t){e.hotEvent("showMsg"),e.$market.showMsg()}}},[e.$store.state.indexData.msgNumber>0?a("p",{staticClass:"msg-div"},[e._v("\n          "+e._s(e.$store.state.indexData.msgNumber)+"\n        ")]):e._e(),e._v(" "),a("img",{style:e.imgStyle,attrs:{src:"static/images/header/message-w.png"}})]):e._e(),e._v(" "),e.myData.isShowScan?a("div",{staticClass:"img-btn-pading space-margin",class:Object.assign({},{"img-btn-bg":1==e.myData.isFloat&&e.scrollSite<60},e.hotareaClass({idCode:e.myData.idCode+"showScan"},!0)),on:{click:function(t){e.hotEvent("showScan"),e.$market.showScan()}}},[a("img",{style:e.imgStyle,attrs:{src:"static/images/header/scan-w.png"}})]):e._e(),e._v(" "),e.myData.isShowShare?a("div",{staticClass:"img-btn-pading space-margin",class:Object.assign({},{"img-btn-bg":1==e.myData.isFloat&&e.scrollSite<60},e.hotareaClass({idCode:e.myData.idCode+"showShare"},!0)),on:{click:function(t){e.hotEvent("showShare"),e.showShare()}}},[a("img",{style:e.imgStyle,attrs:{src:"static/images/header/share-w.png"}})]):e._e(),e._v(" "),e.myData.isShowQrCode?a("div",{staticClass:"img-btn-pading space-margin",class:Object.assign({},{"img-btn-bg":1==e.myData.isFloat&&e.scrollSite<60},e.hotareaClass({idCode:e.myData.idCode+"showQrcode"},!0)),on:{click:function(t){e.hotEvent("showQrcode"),e.showQrcode()}}},[a("img",{style:e.imgStyle,attrs:{src:"static/images/header/qrcode-w.png"}})]):e._e(),e._v(" "),e.myData.isShowService?a("div",{staticClass:"img-btn-pading space-margin",class:Object.assign({},{"img-btn-bg":1==e.myData.isFloat&&e.scrollSite<60},e.hotareaClass({idCode:e.myData.idCode+"showService"},!0)),on:{click:function(t){e.hotEvent("showService"),e.$market.toYHTService()}}},[a("img",{style:e.imgStyle,attrs:{src:"static/images/header/service-w.png"}})]):e._e()]):e._e(),e._v(" "),"white"==e.myData.bgStyle?a("div",{staticClass:"flex-div white",style:{"min-height":this.$market.getNavHeight(!0)+"px",backgroundImage:"url("+e.myData.bgImgUrl2+")"}},["title"==e.myData.middelControl?a("div",{staticClass:"nav-top-title",style:{"line-height":this.$market.getNavHeight(!0)+"px",height:this.$market.getNavHeight(!0)+"px",color:e.myData.titleColor}},[e._v("\n        "+e._s(e.myData.title)+"\n      ")]):e._e(),e._v(" "),e.myData.isShowBack&&2!=e.$store.state.webtype&&3!=e.$store.state.webtype?a("div",{staticClass:"img-btn-pading space-margin",class:Object.assign({},{"img-btn-bg":1==e.myData.isFloat&&e.scrollSite<60},e.hotareaClass({idCode:e.myData.idCode+"backNav"},!0)),on:{click:function(t){e.hotEvent("backNav"),e.$market.backNav()}}},[a("img",{style:e.imgStyle,attrs:{src:"static/images/header/back.png"}})]):e._e(),e._v(" "),"search"==e.myData.middelControl?a("div",{staticClass:"search-div other-full space-margin search-div-bg"},[a("div",{staticClass:"search-bg",class:e.hotareaClass({idCode:e.myData.idCode+"clickSearch"},!0),on:{click:function(t){e.hotEvent("clickSearch"),e.$market.clickSearch()}}},[a("div",{staticClass:"search-main",staticStyle:{height:"20px","line-height":"20px"}},[e._v("\n            商品名称\n          ")]),e._v(" "),e._m(0)])]):e._e(),e._v(" "),"search"!=e.myData.middelControl?a("div",{staticClass:"other-full"}):e._e(),e._v(" "),e.myData.isShowMsg?a("div",{staticClass:"img-btn-pading space-margin",class:Object.assign({},{"img-btn-bg":1==e.myData.isFloat&&e.scrollSite<60},e.hotareaClass({idCode:e.myData.idCode+"showMsg"},!0)),on:{click:function(t){e.hotEvent("showMsg"),e.$market.showMsg()}}},[e.$store.state.indexData.msgNumber>0?a("p",{staticClass:"msg-div"},[e._v("\n          "+e._s(e.$store.state.indexData.msgNumber)+"\n        ")]):e._e(),e._v(" "),a("img",{style:1==e.myData.isFloat&&e.scrollSite<60?e.imgStyle:e.imgStyle1,attrs:{src:1==e.myData.isFloat&&e.scrollSite<60?"static/images/header/message-w.png":"static/images/header/message.png"}})]):e._e(),e._v(" "),e.myData.isShowScan?a("div",{staticClass:"img-btn-pading space-margin",class:Object.assign({},{"img-btn-bg":1==e.myData.isFloat&&e.scrollSite<60},e.hotareaClass({idCode:e.myData.idCode+"showScan"},!0)),on:{click:function(t){e.hotEvent("showScan"),e.$market.showScan()}}},[a("img",{style:e.imgStyle,attrs:{src:1==e.myData.isFloat&&e.scrollSite<60?"static/images/header/scan-w.png":"static/images/header/scan.png"}})]):e._e(),e._v(" "),e.myData.isShowShare?a("div",{staticClass:"img-btn-pading space-margin",class:Object.assign({},{"img-btn-bg":1==e.myData.isFloat&&e.scrollSite<60},e.hotareaClass({idCode:e.myData.idCode+"showShare"},!0)),on:{click:function(t){e.hotEvent("showShare"),e.showShare()}}},[a("img",{style:e.imgStyle,attrs:{src:1==e.myData.isFloat&&e.scrollSite<60?"static/images/header/share-w.png":"static/images/header/share.png"}})]):e._e(),e._v(" "),e.myData.isShowQrCode?a("div",{staticClass:"img-btn-pading space-margin",class:Object.assign({},{"img-btn-bg":1==e.myData.isFloat&&e.scrollSite<60},e.hotareaClass({idCode:e.myData.idCode+"showQrcode"},!0)),on:{click:function(t){e.hotEvent("showQrcode"),e.showQrcode()}}},[a("img",{style:e.imgStyle,attrs:{src:1==e.myData.isFloat&&e.scrollSite<60?"static/images/header/qrcode-w.png":"static/images/header/qrcode.png"}})]):e._e(),e._v(" "),e.myData.isShowService?a("div",{staticClass:"img-btn-pading space-margin",class:Object.assign({},{"img-btn-bg":1==e.myData.isFloat&&e.scrollSite<60},e.hotareaClass({idCode:e.myData.idCode+"showService"},!0)),on:{click:function(t){e.hotEvent("showService"),e.$market.toYHTService()}}},[a("img",{style:e.imgStyle,attrs:{src:1==e.myData.isFloat&&e.scrollSite<60?"static/images/header/service-w.png":"static/images/header/service.png"}})]):e._e()]):e._e()]):e._e(),e._v(" "),e.isShowAddWechat?a("div",{staticClass:"add-wechat-favorites"},[a("van-icon",{staticClass:"close-btn",attrs:{name:"cross"},on:{click:e.closeFavorites}}),e._v(" "),a("span",{staticClass:"text"},[e._v("添加到我的小程序，下拉微信首页就能找到")]),e._v(" "),a("div",{staticClass:"add-wechat-btn",on:{click:e.addWechatFavorites}},[e._v("添加")])],1):e._e(),e._v(" "),a("van-popup",{staticClass:"wechat-favdesc-modal",model:{value:e.isShowWechatFavDesc,callback:function(t){e.isShowWechatFavDesc=t},expression:"isShowWechatFavDesc"}},[a("img",{staticClass:"desc-pic",attrs:{src:e.wechatDescPicUrl,alt:""}})])],1)}),[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"search-icon"},[t("img",{staticStyle:{display:"block"},attrs:{width:"16px",height:"16px",src:"static/images/header/search-w.png"}})])}],!1,null,"01a433d2",null).exports,r={name:"preview-component",components:{NewCategory:a("44fq").a,TopNav:o,ImageAd:function(){return a.e(45).then(a.bind(null,"AAUX"))},Rubik:function(){return a.e(796).then(a.bind(null,"JAfl"))},ProductList:function(){return Promise.all([a.e(0),a.e(33)]).then(a.bind(null,"6cKT"))},ProductInfinite:function(){return Promise.all([a.e(0),a.e(39)]).then(a.bind(null,"h6oS"))},Auxiliary:function(){return a.e(69).then(a.bind(null,"5wcc"))},MyCenter:function(){return a.e(47).then(a.bind(null,"Ozsn"))},MyCenterHeader:function(){return a.e(792).then(a.bind(null,"AzRk"))},MyOrder:function(){return a.e(793).then(a.bind(null,"m7vU"))},FuelPrices:function(){return a.e(502).then(a.bind(null,"m+oH"))},MyAssets:function(){return a.e(790).then(a.bind(null,"TcXZ"))},SecondsKill:function(){return Promise.all([a.e(0),a.e(38)]).then(a.bind(null,"Pe7J"))},PickupAddress:function(){return a.e(795).then(a.bind(null,"IMmR"))},MyPoints:function(){return a.e(794).then(a.bind(null,"FH2X"))},MyPointsHeader:function(){return a.e(65).then(a.bind(null,"WgjJ"))},HScroll:function(){return Promise.all([a.e(0),a.e(320)]).then(a.bind(null,"Cit7"))},Floater:function(){return a.e(782).then(a.bind(null,"y6U2"))},HYTop:function(){return a.e(34).then(a.bind(null,"GZ48"))},HYNews:function(){return a.e(786).then(a.bind(null,"ajuS"))},News:function(){return a.e(503).then(a.bind(null,"cuCu"))},CustomText:function(){return a.e(799).then(a.bind(null,"Gznn"))},FuelFree:function(){return a.e(64).then(a.bind(null,"6zDU"))},CoverFlow:function(){return a.e(776).then(a.bind(null,"wqBJ"))},MemberCard:function(){return a.e(789).then(a.bind(null,"BNZD"))},CouponsTag:function(){return a.e(775).then(a.bind(null,"St0h"))},CouponHQ:function(){return Promise.all([a.e(0),a.e(41)]).then(a.bind(null,"Jvtp"))},ProductTabs:function(){return Promise.all([a.e(0),a.e(42)]).then(a.bind(null,"4Uzd"))},MyCard:function(){return a.e(791).then(a.bind(null,"9Gu7"))},MemberLevels:function(){return a.e(325).then(a.bind(null,"p+j1"))},ESHTop:function(){return a.e(781).then(a.bind(null,"Bw+z"))},ESHNearStation:function(){return a.e(779).then(a.bind(null,"p1NU"))},ESHDZJYQ:function(){return a.e(777).then(a.bind(null,"8hL0"))},ESHJFHQ:function(){return a.e(778).then(a.bind(null,"WB1r"))},ESHQQJY:function(){return a.e(780).then(a.bind(null,"u8O5"))},HKTop:function(){return a.e(785).then(a.bind(null,"8+bW"))},TabsBlock:function(){return a.e(798).then(a.bind(null,"lNLa"))},HYStation:function(){return a.e(787).then(a.bind(null,"+86L"))},CardProvincial:function(){return a.e(774).then(a.bind(null,"5nk6"))},BtnProduct:function(){return a.e(773).then(a.bind(null,"WJkU"))},GetCoupon:function(){return a.e(203).then(a.bind(null,"Ht6i"))}},props:["pageData","barHeight"],data:function(){return{modulesDomId:this.$util.randomString(),showToTop:!1,scrollSite:0,markScrollSite:0,refreshLoaded:null,headerData:{},hasMore:!1,refreshing:!1,loading:!0,scrollPadding:"0rem"}},created:function(){"/common"==this.$route.path&&(2==this.$store.state.webtype||3==this.$store.state.webtype?this.scrollPadding="1.333333rem":this.scrollPadding="4rem")},methods:{componentEvent:function(e){"refreshPage"==e.code&&this.$emit("getPageData")},refresh:function(){},hasPullUpLoad:function(){return!(!this.pageData.productInfinite||"none"==this.pageData.productInfinite.data.type)},loadedEvent:function(e){this.hasMore=1==e,this.loading=!1},moduleLoadMore:function(e){this.$refs.ProductInfinite.loadMore()},moduleIsShow:function(e){return(1!=e.modelMustLogin||""!=this.$store.state.login.token)&&(null==e.endTime||""==e.endTime||new Date(e.endTime).getTime()>new Date(this.$store.state.severTime.currentTime).getTime())},floterEdit:function(){console.log("click stop!")},bottomLoad:function(){},getOtherHeader:function(){if(this.pageData.header||(this.pageData.header={data:{}}),"none"!=this.pageData.header.data.type)return"";for(var e=0;e<this.pageData.moduleList.length;e++){var t=this.pageData.moduleList[e];if("MyCenter"==t.code&&1!=t.data.styleTempl)return this.headerData=t.data,this.headerData.pgCode=this.pageData.pgCode,"MyCenterHeader";if("MyPoints"==t.code&&1==t.data.styleTempl)return this.$util.isZTAPP()?"":"MyPointsHeader"}return""},pageSite:function(e){this.scrollSite=e.target.scrollTop,this.scrollSite>200?this.showToTop=!0:this.showToTop=!1},toTopEvent:function(){this.setScrollSite(0)},getTopStyle:function(){var e="";return"custom"==this.pageData.header.data.type&&1!=this.pageData.header.data.isFloat&&(e="top:"+(this.$market.getNavHeight(!0)+this.barHeight)+"px;"),e},testFunc:function(){console.log("testFunc")},topRefresh:function(e){this.refreshLoaded=e,this.$emit("getPageData")},pageShow:function(){for(var e=0;e<this.pageData.moduleList.length;e++){var t=this.pageData.moduleList[e];if("MyAssets"==t.code||"MyOrder"==t.code||"MyCenter"==t.code||"FuelPrices"==t.code||"ProductList"==t.code||"SecondsKill"==t.code){var a="page_module_"+e,i=this.$refs[a];if(i&&i.length>0){var s=i[0];s&&s.modeleReshow()}}}this.$refs.preview_scroll,this.$refs.ProductInfinite&&this.$refs.ProductInfinite.modeleReshow(),this.$refs.Floater_Module&&this.$refs.Floater_Module.modeleReshow()},imageAdRefresh:function(){for(var e=0;e<this.pageData.moduleList.length;e++)if("ImageAd"==this.pageData.moduleList[e].code){var t="page_module_"+e;this.$refs[t][0].modeleReshow()}},setScrollSite:function(e){var t=this;if(e=parseInt(e),this.scrollSite-e<10&&this.scrollSite-e>-10){var a=this.$refs.preview_scroll;a&&(a.scrollTo(0,e),this.scrollSite=e)}else{var i=(this.scrollSite-e)/20;i<0&&(i=-i),i<10&&(i=10);var s=this.$refs.preview_scroll;if(s)var n=setInterval((function(){t.scrollSite=t.scrollSite-i,t.scrollSite-e<10&&t.scrollSite-e>-10?(t.scrollSite=e,s.scrollTo(0,t.scrollSite),clearInterval(n)):s.scrollTo(0,t.scrollSite)}),10)}},getScrollSite:function(){return this.scrollSite}},watch:{pageData:function(e,t){this.refreshing=!1,this.refreshLoaded&&(this.refreshLoaded("done"),this.refreshLoaded=null)}},computed:{isCommon:{get:function(){switch(this.$route.path){case"/common":return!0;default:return!1}},set:function(){}}}},c=(a("Z3+7"),Object(n.a)(r,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"preview-component"},[a("div",{staticClass:"general-div"},[a(e.getOtherHeader(),{tag:"component",attrs:{headerData:e.headerData,barHeight:e.barHeight,scrollSite:e.scrollSite}}),e._v(" "),"custom"==e.pageData.header.data.type?a("TopNav",{attrs:{usePorpData:!0,propData:e.pageData,barHeight:e.barHeight,scrollSite:e.scrollSite}}):e._e(),e._v(" "),a("div",{staticClass:"modules-div",style:e.getTopStyle(),attrs:{id:e.modulesDomId}},[e.isCommon&&"3"!==e.$store.state.webtype?a("NewCategory"):e._e(),e._v(" "),e.pageData.screenModule&&""!=e.pageData.screenModule.code?a("div",{staticClass:"screen-module"},[a(e.pageData.screenModule.code,{tag:"component",attrs:{usePorpData:!0,propData:e.pageData}})],1):a("div",{ref:"preview_scroll",staticClass:"scroll-div",style:{"padding-bottom":e.scrollPadding},on:{scroll:e.pageSite}},[a("van-pull-refresh",{on:{refresh:e.topRefresh},model:{value:e.refreshing,callback:function(t){e.refreshing=t},expression:"refreshing"}},[a("van-list",{attrs:{finished:!e.hasMore,"finished-text":""},on:{load:e.moduleLoadMore},model:{value:e.loading,callback:function(t){e.loading=t},expression:"loading"}},[e._l(e.pageData.moduleList,(function(t,i){return e.moduleIsShow(t.data)?a(t.code,{key:i,ref:"page_module_"+i,refInFor:!0,tag:"component",attrs:{myIndex:i,usePorpData:!0,isScrollPage:!0,propData:e.pageData,scrollSite:e.scrollSite,barHeight:e.barHeight},on:{componentEvent:e.componentEvent}}):e._e()})),e._v(" "),e.pageData.productInfinite&&"none"!=e.pageData.productInfinite.data.type&&e.moduleIsShow(e.pageData.productInfinite.data)?a("ProductInfinite",{ref:"ProductInfinite",attrs:{scrollSite:e.scrollSite,usePorpData:!0,propData:e.pageData,modulesDomId:e.modulesDomId},on:{loadedEvent:e.loadedEvent}}):e._e(),e._v(" "),"4"==e.$store.state.webtype?a("div",{staticClass:"bottom-tip"},[a("p",[e._v("服务由广州有路科技有限公司提供")]),e._v(" "),a("p",[e._v("客服电话：4006162515")])]):e._e()],2)],1)],1),e._v(" "),e.pageData.floater&&"none"!=e.pageData.floater.data.type?a("Floater",{ref:"Floater_Module",attrs:{usePorpData:!0,propData:e.pageData},on:{floterEdit:e.floterEdit}}):e._e()],1)],1)])}),[],!1,null,"01a5c1b4",null));t.default=c.exports}}]);
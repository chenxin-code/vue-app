(window.webpackJsonp=window.webpackJsonp||[]).push([[227,797,1005],{"6Ac6":function(t,e,n){"use strict";var i={myCallBack:null,revNativeValue:function(t){this.myCallBack&&(this.myCallBack(t),this.myCallBack=null)},sinopecapp_loadNative:function(t,e,n){return n&&(this.myCallBack=n,window.revNativeValue=this.revNativeValue),/(Android)/i.test(navigator.userAgent)?sinopecapp.sinopecapp_loadNative(t,e):/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)?window.webkit.messageHandlers.sinopecapp_loadNative.postMessage({method:t,param:e}):void 0}};e.a=i},AqR5:function(t,e,n){"use strict";n.r(e);var i=n("chc6"),a={name:"subpage",components:{ImageAd:function(){return Promise.all([n.e(45),n.e(1e3)]).then(n.bind(null,"AAUX"))},Rubik:function(){return n.e(521).then(n.bind(null,"JAfl"))},ProductList:function(){return Promise.all([n.e(0),n.e(33)]).then(n.bind(null,"6cKT"))},ProductInfinite:function(){return Promise.all([n.e(0),n.e(39)]).then(n.bind(null,"h6oS"))},Auxiliary:function(){return n.e(69).then(n.bind(null,"5wcc"))},MyCenter:function(){return Promise.all([n.e(47),n.e(1001)]).then(n.bind(null,"Ozsn"))},MyCenterHeader:function(){return n.e(517).then(n.bind(null,"AzRk"))},MyOrder:function(){return n.e(518).then(n.bind(null,"m7vU"))},FuelPrices:function(){return n.e(431).then(n.bind(null,"m+oH"))},MyAssets:function(){return n.e(516).then(n.bind(null,"TcXZ"))},SecondsKill:function(){return Promise.all([n.e(0),n.e(38),n.e(1002)]).then(n.bind(null,"Pe7J"))},PickupAddress:function(){return n.e(520).then(n.bind(null,"IMmR"))},MyPoints:function(){return n.e(519).then(n.bind(null,"FH2X"))},MyPointsHeader:function(){return n.e(65).then(n.bind(null,"WgjJ"))},HScroll:function(){return Promise.all([n.e(0),n.e(265)]).then(n.bind(null,"Cit7"))},Floater:function(){return n.e(512).then(n.bind(null,"y6U2"))},HYTop:function(){return Promise.all([n.e(34),n.e(1003)]).then(n.bind(null,"GZ48"))},HYNews:function(){return n.e(514).then(n.bind(null,"ajuS"))},News:function(){return n.e(432).then(n.bind(null,"cuCu"))},CustomText:function(){return n.e(522).then(n.bind(null,"Gznn"))},FuelFree:function(){return n.e(64).then(n.bind(null,"6zDU"))},CoverFlow:function(){return n.e(506).then(n.bind(null,"wqBJ"))},MemberCard:function(){return n.e(515).then(n.bind(null,"BNZD"))},CouponsTag:function(){return n.e(505).then(n.bind(null,"St0h"))},CouponHQ:function(){return Promise.all([n.e(0),n.e(41),n.e(1004)]).then(n.bind(null,"Jvtp"))},ProductTabs:function(){return Promise.all([n.e(0),n.e(42)]).then(n.bind(null,"4Uzd"))},MemberLevels:function(){return n.e(266).then(n.bind(null,"p+j1"))},ESHTop:function(){return n.e(511).then(n.bind(null,"Bw+z"))},ESHNearStation:function(){return n.e(509).then(n.bind(null,"p1NU"))},ESHDZJYQ:function(){return n.e(507).then(n.bind(null,"8hL0"))},ESHJFHQ:function(){return n.e(508).then(n.bind(null,"WB1r"))},ESHQQJY:function(){return n.e(510).then(n.bind(null,"u8O5"))},HKTop:function(){return n.e(513).then(n.bind(null,"8+bW"))},BtnProduct:function(){return n.e(504).then(n.bind(null,"WJkU"))}},props:["divKeywords","pgCode","comData","propsPageData"],data:function(){return{pageData:null}},methods:{getMyPageData:function(){var t=this,e="vuePageData_",n=[];n.push({appType:1}),n.push({accessType:2}),this.pgCode&&""!=this.pgCode?(e+=this.pgCode,n.push({pgCode:this.pgCode})):(n.push({divKeywords:this.divKeywords}),e+=this.$util.md5String(this.divKeywords)),-1!=this.$store.state.webtype&&n.push({webType:this.$store.state.webtype}),i.a.request("/appcontent/js/app_vue_page/vuePageData.js",e,n).then((function(e){if(0==e.status){var n=e.data.pageData;if(!n.pageDataJson)return;t.pageData=JSON.parse(n.pageDataJson),t.$emit("dataLoaded")}}))}},created:function(){this.propsPageData?(this.pageData=this.propsPageData,this.$emit("dataLoaded")):this.getMyPageData()}},o=(n("xpvW"),n("KHd+")),s=Object(o.a)(a,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return null!=t.pageData?n("div",{staticClass:"subpage"},t._l(t.pageData.moduleList,(function(e,i){return n("div",[n(e.code,{ref:"page_module_"+i,refInFor:!0,tag:"component",attrs:{myIndex:i,usePorpData:!0,propData:t.pageData,comData:t.comData}})],1)})),0):t._e()}),[],!1,null,"505bd157",null);e.default=s.exports},Up3v:function(t,e,n){"use strict";var i=n("t/UJ");n.n(i).a},chc6:function(t,e,n){"use strict";var i=n("2nGb"),a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),s=document.getElementsByTagName("head")[0],u=function(){function t(e,n){var i=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.url=e||"",this.funcName=n;var a=document.createElement("script");e+=(~e.indexOf("?")?"&":"?")+"callback="+n,a.src=e,a.type="text/javascript",this.myTimer=setTimeout((function(){i.callCallback({status:1,info:"网络加载较慢！"}),i.clearup()}),1e4),window[n]=function(t){i.callCallback({status:0,data:t,info:""}),i.clearup()},a.onerror=function(){i.callCallback({status:1,info:"网络加载较慢！"}),i.clearup()},this.scriptNode=a,s.appendChild(this.scriptNode)}return o(t,[{key:"then",value:function(t){this.callbackFunc=t}},{key:"callCallback",value:function(t){var e=this;setTimeout((function(){e.callbackFunc(t)}),0)}},{key:"clearup",value:function(){this.myTimer&&clearTimeout(this.myTimer),this.myTimer=null,this.scriptNode.src="",s.removeChild(this.scriptNode)}}]),t}(),r={request:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];if(!t)throw new Error("url 不能为空");return 0!=t.indexOf("http")&&(t=i.a.baseURL+t),n.forEach((function(e){if("object"===(void 0===e?"undefined":a(e)))for(var n in e)t+=~t.indexOf("?")?"&":"?",t+=n+"="+e[n]})),new u(t,e)},cancelAll:function(){}};e.a=r},dnYj:function(t,e,n){"use strict";n.r(e);var i=n("AqR5"),a=n("6Ac6"),o=n("chc6"),s={name:"block-index-location",components:{SubPage:i.default},watch:{myHeight:function(){this.setSize()}},data:function(){return{pageData:null,myHeight:0,myWidth:0,times:6}},methods:{setSize:function(){if(7==this.$store.state.webtype){var t={width:this.myWidth,height:this.myHeight};a.a.sinopecapp_loadNative("setWebviewSize",JSON.stringify(t))}},getSize:function(){var t=this;this.myWidth=this.$refs.blockIndex.clientWidth,this.myHeight=this.$refs.blockIndex.clientHeight,this.times--,this.times<=0||setTimeout((function(){t.getSize()}),500)},dataLoaded:function(){var t=this;setTimeout((function(){t.getSize()}),500)},_setNewLocation:function(t){this.$store.state.indexData.province=t.province,this.$store.state.indexData.city=t.city,this.getPageData()},getPageData:function(){var t=this,e="7";"1"==this.$store.state.webtype?e="1":"2"==this.$store.state.webtype?e="2":"3"==this.$store.state.webtype?e="3":"4"==this.$store.state.webtype?e="4":"5"==this.$store.state.webtype?e="5":"7"==this.$store.state.webtype&&(e="7");var n="";this.businessType&&(n=this.businessType);var i=this.$store.state.indexData.city?this.$store.state.indexData.city:"",a=this.$store.state.indexData.province?this.$store.state.indexData.province:"",s="vuePageData_",u=[];u.push({appType:1}),u.push({webType:e}),u.push({accessType:2}),u.push({storeOuCode:""}),u.push({cityName:i}),u.push({provinceName:a}),u.push({businessType:n}),s+=this.$util.md5String(e+""+i),this.$STLoading.open(),o.a.request("/appcontent/js/app_vue_page/vuePageData.js",s,u).then((function(e){if(t.$STLoading.close(),0==e.status){var n=e.data.pageData;if(!n.pageDataJson)return;t.pageData=JSON.parse(n.pageDataJson)}else t.$Toast("获取页面配置信息失败！")}))}},created:function(){var t=this;this.$store.state.clientWidth=document.documentElement.clientWidth,this.$bridgefunc.getLocation((function(e){t._setNewLocation(e)}))}},u=(n("Up3v"),n("KHd+")),r=Object(u.a)(s,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{ref:"blockIndex",staticClass:"block-index-location"},[this.pageData?e("SubPage",{attrs:{propsPageData:this.pageData},on:{dataLoaded:this.dataLoaded}}):this._e()],1)}),[],!1,null,"e3ae5f2e",null);e.default=r.exports},iijq:function(t,e,n){},"t/UJ":function(t,e,n){},xpvW:function(t,e,n){"use strict";var i=n("iijq");n.n(i).a}}]);
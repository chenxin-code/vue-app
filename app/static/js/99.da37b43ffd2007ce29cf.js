(window.webpackJsonp=window.webpackJsonp||[]).push([[99,1005],{"0UZT":function(t,e,a){"use strict";a.r(e);var i=a("YSBa"),s=a("mbR2"),n={name:"index",components:{PreviewComponent:function(){return a.e(23).then(a.bind(null,"v/Xm"))},LinkComponent:function(){return a.e(66).then(a.bind(null,"4el2"))},WebViewComponent:function(){return a.e(67).then(a.bind(null,"KYXH"))},Tabbar:i.a,AdPage:s.a},data:function(){return{pgCode:"",pageShow:!1,pageData:{},fullPageData:{},tabbarSubDatas:[],selectedIndex:-1,isFirstShow:!0,lastPath:"",adPageKey:"",pagePosition:0,notch:!1}},computed:{},methods:{commonPageShow:function(t){var e=this.getComRef(t);if(this.$refs[e]){var a=this.$refs[e][0];a.pageShow&&(this.tabbarSubDatas[this.selectedIndex],a.pageShow())}},tabbarChanged:function(t){console.log(t),this.$refs.tabbar.tabbarEvent(t)},getHasbackEvent:function(t){return!1},getComRef:function(t){return"com"+t},getItemCode:function(t){return"LinkComponent"==t.code&&0==t.data.url.indexOf("http")&&(t.code="WebViewComponent"),"2"==t.code&&"/usercenter/rebatebonus"==t.data.url&&(t.code="RebateBonus"),t.code},getTopHeight:function(){return this.$store.state.barHeight},tabbarEvent:function(t){var e=this,a=this.tabbarSubDatas[t];if(a.hasShow&&this.selectedIndex!=t&&this.commonPageShow(t),""==this.$store.state.login.token&&"Mallshoppingcart"==a.code)return this.$store.state.indexData.selectedIndex=t,this.$store.state.pushData={},this.tabbarChanged(this.selectedIndex),void this.$util.toLogin();a.hasShow=!0,this.selectedIndex=t,this.$nextTick((function(){e.getComRef(t)&&e.$refs[e.getComRef(t)]&&"PreviewComponent"==a.code&&e.$refs[e.getComRef(t)][0].refresh()}))},getPageData:function(t,e){var a=this,i={};t&&(i.pgCode=t),i.cityName=this.$store.state.indexData.city?this.$store.state.indexData.city:"",i.provinceName=this.$store.state.indexData.province?this.$store.state.indexData.province:"",i.accessType=2,i.appType=1,this.$STLoading.open(),this.$http.post("/app/json/app_vue_page/vueGetPageData",i).then((function(t){var i=t.data;if(a.$STLoading.close(),0==i.status){var s=i.data,n=JSON.parse(s.pageDataJson);n.pgCode=s.pgCode,a.adPageKey="AD_Key_Common_"+s.pgCode,console.log(a.adPageKey),console.log(n),-1==e?(a.fullPageData=s,a.pageData=n,a.pageShow=!1,a.$nextTick((function(){a.pageShow=!0})),"1"==a.pageData.type&&a.getSubPageDatas()):a.tabbarSubDatas[e].data=n}else a.$Toast("网络加载较慢，请稍后重试!")})).catch((function(t){a.$STLoading.close(),a.$Toast("网络加载较慢，请稍后重试!")}))},getSubPageDatas:function(){for(var t=this,e=this.pageData.moduleList.length,a=[],i=-1,s=0;s<e;s++){var n=this.pageData.moduleList[s];1==n.default&&(i=s);var o=n.link,r={};"1"==o.type?(r.code="PreviewComponent",r.data="",r.pgCode=o.pgCode):"2"==o.type?(r.code=o.code,r.data={title:o.label,url:o.url}):"3"==o.type&&(r.code="LinkComponent",r.data={title:o.label,url:o.url}),r.hasShow=!1,a.push(r)}this.tabbarSubDatas=a;for(var c=0;c<this.tabbarSubDatas.length;c++){var l=this.tabbarSubDatas[c];"PreviewComponent"==l.code&&this.getPageData(l.pgCode,c)}-1!=i&&setTimeout((function(){t.$refs.tabbar2.tabbarEvent(i)}),20)}},watch:{},mounted:function(){window.screen.height/window.screen.width>(window.screen.height==window.screen.availHeight?1.8:1.65)&&"3"!==this.$store.state.webtype&&"2"!==this.$store.state.webtype&&"/common2/:id"!==this.$route.matched[0].path&&(this.notch=!0),console.log(this.$route)},activated:function(){if("0"==this.pageData.type){if(this.pageShow){var t=this.$refs.Ref_Com_One;t&&t.setScrollSite&&(t.setScrollSite(this.pagePosition),t.pageShow())}}else if(this.pageShow){var e=this.getComRef(this.selectedIndex);if(this.$refs[e]){var a=this.$refs[e][0];a.setScrollSite&&(a.setScrollSite(this.pagePosition),a.pageShow())}}},beforeRouteLeave:function(t,e,a){if(t.path==this.lastPath)this.$keepaliveHelper.deleteCache(this);else if("0"==this.pageData.type){var i=this.$refs.Ref_Com_One;i.getScrollSite&&(this.pagePosition=parseInt(i.getScrollSite()))}else{var s=this.getComRef(this.selectedIndex);if(this.$refs[s]){var n=this.$refs[s][0];n.getScrollSite&&(this.pagePosition=parseInt(n.getScrollSite()))}}a()},created:function(){this.$store.state.clientWidth=document.documentElement.clientWidth,this.pgCode=this.$route.query.pgCode?this.$route.query.pgCode:"",this.lastPath=this.$route.query.lastPath?this.$route.query.lastPath:"",this.getPageData(this.pgCode,-1),this.isFirstShow=!0}},o=(a("Ql8I"),a("KHd+")),r=Object(o.a)(n,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"mobile-preview"},[t.notch?a("div",{directives:[{name:"show",rawName:"v-show",value:!t.$store.state.isPreview,expression:"!$store.state.isPreview"}],staticClass:"top_bg"}):t._e(),t._v(" "),"0"==t.pageData.type&&t.pageShow?a("div",{staticClass:"full-div"},[a("PreviewComponent",{ref:"Ref_Com_One",tag:"component",attrs:{pageData:t.pageData,barHeight:t.getTopHeight()},on:{getPageData:function(e){return t.getPageData(t.pgCode,-1)}}})],1):t._e(),t._v(" "),"1"==t.pageData.type&&t.pageShow?a("div",{staticClass:"full-div"},[a("div",{staticClass:"page-content",class:{"page-content-2":"top"==t.pageData.tabbarType}},t._l(t.tabbarSubDatas,(function(e,i){return e.hasShow&&e.data?a("div",{directives:[{name:"show",rawName:"v-show",value:i==t.selectedIndex,expression:"index == selectedIndex"}],staticClass:"full-div"},[a(t.getItemCode(e),{ref:t.getComRef(i),refInFor:!0,tag:"component",attrs:{hasBack:t.getHasbackEvent(e.code),pageData:e.data,barHeight:t.getTopHeight(),commonShow:t.selectedIndex==i},on:{getPageData:function(a){return t.getPageData(e.pgCode,i)},tabbarEvent:t.tabbarChanged}})],1):t._e()})),0),t._v(" "),a("Tabbar",{ref:"tabbar2",attrs:{usePorpData:!0,propData:t.pageData},on:{tabbarEvent:t.tabbarEvent}})],1):t._e(),t._v(" "),t.adPageKey?a("AdPage",{attrs:{pageAdKeywords:t.adPageKey}}):t._e()],1)}),[],!1,null,"7c1314e9",null);e.default=r.exports},AXlJ:function(t,e,a){},Fx6t:function(t,e,a){},"L++y":function(t,e,a){"use strict";var i=a("P3+8");a.n(i).a},"P3+8":function(t,e,a){},Ql8I:function(t,e,a){"use strict";var i=a("Fx6t");a.n(i).a},Wkcn:function(t,e,a){"use strict";var i=a("oI26").a,s=(a("Zqkb"),a("KHd+")),n=Object(s.a)(i,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.moduleData?a("div",{staticClass:"mark",style:t.cornerMarkStyle},["1"==t.moduleData.cornerStyle?a("div",{staticClass:"style1"},[t._v("\n    "+t._s(t.getNum)+"\n  ")]):t._e(),t._v(" "),"2"==t.moduleData.cornerStyle?a("div",{staticClass:"style2"},[t._v("\n    "+t._s(t.getNum)+"\n  ")]):t._e()]):t._e()}),[],!1,null,"78df1dc7",null);e.a=n.exports},YSBa:function(t,e,a){"use strict";a("L2JU");var i={name:"tabbar",components:{CornerMark:a("Wkcn").a},computed:{pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.tabbarData}},props:["defaultIndex","usePorpData","propData"],data:function(){return{selectedIndex:this.defaultIndex,erudaTime:0,clickTime:-1}},methods:{getTopPadding:function(){var t="";return this.$store.state.barHeight&&(t+="paddingTop: "+this.$store.state.barHeight+"px;"),t},backEvent:function(){this.$market.backNav()},tabbarEvent:function(t){if(this.selectedIndex=t,this.$emit("tabbarEvent",t),0==t){var e=(new Date).getTime();e-this.clickTime<1e3||-1==this.clickTime?(this.erudaTime+=1,this.clickTime=e,5==this.erudaTime&&(eruda.init(),this.erudaTime=0,this.clickTime=-1)):(this.erudaTime=0,this.clickTime=-1)}},getStyleTabbarBg:function(t){var e=t.bgColor,a="";""!=e&&(a+="background-color: "+e+";");var i=t.bgImgUrl;return""!=i&&(a+="background: url('"+i+"') no-repeat center center / 100% 100%;"),a},getStyleItemWidth:function(t){return 4==t.moduleList.length?"width: 25%;":5==t.moduleList.length?"width: 20%;":2==t.moduleList.length?"width: 50%;":(t.moduleList.length,"width: 33.33%;")}},created:function(){this.pageData.titleColor||(this.pageData.titleColor="#000")}},s=(a("L++y"),a("KHd+")),n=Object(s.a)(i,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return"top"==t.pageData.tabbarType?a("div",{staticClass:"tabbar-top",style:t.getStyleTabbarBg(t.pageData)},[a("div",{staticClass:"tabbar-nav-div",style:t.getTopPadding()},[a("div",{staticClass:"tabbar-box",style:{height:t.$market.getNavHeight()+"px"}},[a("div",{staticClass:"back-div",on:{click:t.backEvent}},[a("img",{attrs:{width:"20px",height:"20px",src:"static/images/header/back-b.png"}})]),t._v(" "),t.pageData.title?a("div",{staticClass:"nav-top-title",style:{color:t.pageData.titleColor}},[t._v("\n        "+t._s(t.pageData.title)+"\n      ")]):t._e()])]),t._v(" "),a("div",{staticClass:"tabbar-search",on:{click:t.$market.clickSearch}},[t._m(0)]),t._v(" "),a("div",{staticClass:"tabbar-items"},t._l(t.pageData.moduleList,(function(e,i){return a("div",{staticClass:"tabbar-item",class:{activity:t.selectedIndex==i},style:t.getStyleItemWidth(t.pageData),on:{click:function(e){return t.tabbarEvent(i)}}},[a("span",[t._v(t._s(e.title))]),t._v(" "),a("div",{staticClass:"line"})])})),0)]):a("div",{staticClass:"tabbar",style:t.getStyleTabbarBg(t.pageData)},t._l(t.pageData.moduleList,(function(e,i){return a("div",{staticClass:"tabbar-item",class:{"img-style":"img_50"==t.pageData.layoutType,"img-style-2":"img_60"==t.pageData.layoutType},style:t.getStyleItemWidth(t.pageData),on:{click:function(e){return t.tabbarEvent(i)}}},[a("img",{directives:[{name:"show",rawName:"v-show",value:t.selectedIndex!=i,expression:"selectedIndex != index"}],attrs:{src:e.imgUrl1}}),t._v(" "),a("img",{directives:[{name:"show",rawName:"v-show",value:t.selectedIndex==i,expression:"selectedIndex == index"}],attrs:{src:e.imgUrl2}}),t._v(" "),t.$market.getCartNum(e.link.code)>0?a("div",{staticClass:"corner-mark"},[t._v(t._s(t.$market.getCartNum(e.link.code)))]):t._e(),t._v(" "),a("span",{directives:[{name:"show",rawName:"v-show",value:"img_word"==t.pageData.layoutType,expression:"pageData.layoutType == 'img_word'"}]},[t._v(t._s(e.title))])])})),0)}),[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"search-bg"},[e("div",{staticClass:"search-icon"},[e("img",{staticStyle:{display:"block"},attrs:{width:"14px",height:"14px",src:"static/images/header/search.png"}})]),this._v(" "),e("div",{staticClass:"search-main"},[this._v("\n        商品名称\n      ")])])}],!1,null,"0d9ca780",null);e.a=n.exports},Zqkb:function(t,e,a){"use strict";var i=a("hJ/q");a.n(i).a},chc6:function(t,e,a){"use strict";var i=a("2nGb"),s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n=function(){function t(t,e){for(var a=0;a<e.length;a++){var i=e[a];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,a,i){return a&&t(e.prototype,a),i&&t(e,i),e}}(),o=document.getElementsByTagName("head")[0],r=function(){function t(e,a){var i=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.url=e||"",this.funcName=a;var s=document.createElement("script");e+=(~e.indexOf("?")?"&":"?")+"callback="+a,s.src=e,s.type="text/javascript",this.myTimer=setTimeout((function(){i.callCallback({status:1,info:"网络加载较慢！"}),i.clearup()}),1e4),window[a]=function(t){i.callCallback({status:0,data:t,info:""}),i.clearup()},s.onerror=function(){i.callCallback({status:1,info:"网络加载较慢！"}),i.clearup()},this.scriptNode=s,o.appendChild(this.scriptNode)}return n(t,[{key:"then",value:function(t){this.callbackFunc=t}},{key:"callCallback",value:function(t){var e=this;setTimeout((function(){e.callbackFunc(t)}),0)}},{key:"clearup",value:function(){this.myTimer&&clearTimeout(this.myTimer),this.myTimer=null,this.scriptNode.src="",o.removeChild(this.scriptNode)}}]),t}(),c={request:function(t,e){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];if(!t)throw new Error("url 不能为空");return 0!=t.indexOf("http")&&(t=i.a.baseURL+t),a.forEach((function(e){if("object"===(void 0===e?"undefined":s(e)))for(var a in e)t+=~t.indexOf("?")?"&":"?",t+=a+"="+e[a]})),new r(t,e)},cancelAll:function(){}};e.a=c},g2bL:function(t,e,a){"use strict";var i=a("AXlJ");a.n(i).a},"hJ/q":function(t,e,a){},mbR2:function(t,e,a){"use strict";var i=a("chc6"),s={name:"adpage",components:{ImageAd:function(){return a.e(772).then(a.bind(null,"BAEh"))}},props:["pageAdKeywords","pgCode"],data:function(){return{pageData:null,show:!1}},computed:{showAdpage:function(){var t=this.show&&null!=this.pageData&&this.pageData.adData&&""!=this.pageData.adData;return t&&null==this.pageData.adData.rows.find((function(t){return 0!=t.canSee}))&&(t=!1),t}},methods:{adPageIsShow:function(t){var e=window.localStorage.getItem(this.pageAdKeywords+t);e?(new Date).getTime()>e&&(this.show=!0):this.show=!0},adPageHide:function(){this.show=!1},getMyPageData:function(){var t=this,e="vuePageData_",a=[];a.push({appType:1}),a.push({accessType:2}),this.pgCode&&""!=this.pgCode?(e+=this.pgCode,a.push({pgCode:this.pgCode})):(a.push({pageAdKeywords:this.pageAdKeywords}),e+=this.$util.md5String(this.pageAdKeywords)),i.a.request("/appcontent/js/app_vue_page/vuePageData.js",e,a).then((function(e){if(0==e.status){var a=e.data.pageData;if(!a.pageDataJson)return;t.pageData=JSON.parse(a.pageDataJson);var i=e.data.id||"",s=t.pageData.adData;if(t.adPageIsShow(i),s&&t.show)if("1"==s.showFrequency){var n=new Date;n=n.setDate(n.getDate()+1),n=new Date(n).setHours(2,0,0,0);var o=new Date(n).getTime();window.localStorage.setItem(t.pageAdKeywords+i,o)}else if("2"==s.showFrequency){var r=new Date;r=r.setDate(r.getDate()+999);var c=new Date(r).getTime();window.localStorage.setItem(t.pageAdKeywords+i,c)}else if("3"==s.showFrequency){var l=(new Date).getTime()+36e3;window.localStorage.setItem(t.pageAdKeywords+i,l)}else if("4"==s.showFrequency){var d=(new Date).getTime()+0;window.localStorage.setItem(t.pageAdKeywords+i,d)}else{var u=(new Date).getTime()+36e5;window.localStorage.setItem(t.pageAdKeywords+i,u)}}}))}},created:function(){this.getMyPageData()}},n=(a("g2bL"),a("KHd+")),o=Object(n.a)(s,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.showAdpage?a("div",{staticClass:"adpage",on:{click:function(e){return e.stopPropagation(),t.adPageHide(e)}}},[a("div",[a("ImageAd",{attrs:{usePorpData:!0,propData:t.pageData},on:{closeEvent:t.adPageHide}})],1)]):t._e()}),[],!1,null,"52850f74",null);e.a=o.exports},oI26:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_exports__.a={name:"cornerMark",props:{itemData:{type:Object},moduleData:{type:Object},code:{type:String}},data:function(){return{num:0}},computed:{cornerMarkStyle:function(){if(!this.moduleData)return"";var t=this.moduleData.cornerMarginTop,e=this.moduleData.cornerMarginRight,a={};return t&&(a.top=t+"%"),e&&(a.right=e+"%"),a},getNum:function(){return this.code?this.$market.getCartNum(this.code):this.num>99?"99+":this.num}},watch:{},methods:{getMark:function getMark(){var _this=this;if(!this.itemData)return"";var url=this.itemData.cornerMarkUrl,paramsData={ouCode:""};this.$http.post(url,paramsData).then((function(res){var data=res.data;if(0==data.status){var cornerMarkKey=_this.itemData.cornerMarkKey;_this.num=eval(cornerMarkKey)||0}}),(function(t){_this.$Message.error("网络加载较慢，请稍后重试!")}))}},created:function(){-1==this.$store.state.webtype?this.num=10:this.getMark()}}}}]);
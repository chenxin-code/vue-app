(window.webpackJsonp=window.webpackJsonp||[]).push([[274,1005],{AXlJ:function(e,t,a){},LGuW:function(e,t,a){"use strict";a.r(t);var n=a("uQt8"),o=a("mbR2"),s={name:"loginbind-qrcode",components:{CountButton:n.a,AdPage:o.a},data:function(){return{loginTitle:this.$store.state.globalConfig.projectName,phone:"",msgCode:"",referrer:""}},watch:{msgCode:function(e){this.msgCode=this.$util.checkVerifyCodeLenght(this.msgCode)}},methods:{download:function(){this.$router.push({path:"/usercenter/downloadshare"})},inputChange:function(e){var t=e.target.value;this.phone=this.$util.onlyNumber(t)},getMsgCode:function(e,t){var a=this;if(""!=this.phone)if(this.$util.checkMobile(this.phone)){this.$refs.countBtn.startTime(),this.$Loading.open();var n={smsType:"1000",phone:this.phone,imgVerifyCode:e,uuid:t};this.$http.post("/app/json/login/sendSms",n).then((function(e){a.$Loading.close(),console.log(e.data);var t=e.data;0==t.status?(console.log(t),a.$Toast("获取验证码成功")):(a.$refs.countBtn.resetClock(),a.$Toast(t.info?t.info:"获取短信验证码失败"))}),(function(e){a.$Loading.close(),a.$refs.countBtn.resetClock(),a.$Toast("系统运行过程中遇到问题，请稍候再试")}))}else this.$Toast("请输入正确的手机号码！");else this.$Toast("手机号不能为空!")},loginFun:function(){var e=this;this.$Loading.open();var t={phone:this.phone,smsVerifyCode:this.msgCode};this.referrer&&this.referrer.length&&(t.rfrCode=this.referrer,t.rfrCodeType=2),this.$http.post("/app/json/login/smsRegister",t).then((function(t){e.$Loading.close(),console.log(t.data);var a=t.data;0==a.status?e.$router.push({path:"/usercenter/downloadsharenew"}):e.$Toast(a.info?a.info:"注册失败")}),(function(t){e.$Loading.close(),e.$Toast("系统运行过程中遇到问题，请稍候再试")}))},getCheckOutFun:function(){""!=this.phone?/^1\d{10}$/.test(this.phone)?""!=this.msgCode?this.loginFun():this.$Toast("验证码不能为空!"):this.$Toast("手机号格式不对!"):this.$Toast("手机号不能为空!")}},created:function(){this.referrer=this.$route.query.qrCode,this.referrer&&""!=this.referrer||this.$Toast("推荐码不能为空")}},i=(a("utNN"),a("KHd+")),r=Object(i.a)(s,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return e.referrer&&e.referrer.length?a("div",{staticClass:"loginbind-qrcode login2"},[a("nav-content",[a("div",{staticClass:"app-info"},[a("div",{staticClass:"logo"},[a("img",{attrs:{src:e.$store.state.globalConfig.logoUrl}})]),e._v(" "),a("div",{staticClass:"title"},[e._v(e._s(e.loginTitle))])]),e._v(" "),a("div",{staticClass:"login-div"},[a("div",{staticClass:"text-input"},[a("div",{staticClass:"left"},[e._v("手机号")]),e._v(" "),a("div",{staticClass:"cell-phone"},[a("van-field",{attrs:{type:"tel",placeholder:"请输入手机号码",maxlength:"11",autosize:"",onkeypress:"return( /[\\d]/.test(String.fromCharCode(event.keyCode)))",pattern:"[0-9]*"},on:{input:function(t){e.phone=/^\d+/.exec(e.phone)?/^\d+/.exec(e.phone)[0]:""}},model:{value:e.phone,callback:function(t){e.phone=t},expression:"phone"}})],1)]),e._v(" "),a("div",{staticClass:"passwords-input"},[a("div",{staticClass:"passwords"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.msgCode,expression:"msgCode"}],attrs:{placeholder:"请输入短信验证码"},domProps:{value:e.msgCode},on:{input:function(t){t.target.composing||(e.msgCode=t.target.value)}}})]),e._v(" "),a("div",{staticClass:"forget-btn"},[a("count-button",{ref:"countBtn",staticClass:"theme_standard_font",attrs:{phone:e.phone},on:{getSmsEvent:e.getMsgCode}})],1)]),e._v(" "),a("div",{staticClass:"passwords-input"},[a("div",{staticClass:"left-img"},[a("img",{attrs:{src:"static/image/login2/registe5.png",alt:""}})]),e._v(" "),a("div",{staticClass:"passwords"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.referrer,expression:"referrer"}],attrs:{placeholder:"请输入推荐码",disabled:""},domProps:{value:e.referrer},on:{input:function(t){t.target.composing||(e.referrer=t.target.value)}}})])]),e._v(" "),a("div",{staticClass:"login-way"},[a("div",{staticClass:"btn-extend",on:{click:e.download}},[e._v("已注册，去安装")])]),e._v(" "),a("div",{staticClass:"common-btn theme_standard_bg theme_font_white mt100",on:{click:function(t){return e.getCheckOutFun()}}},[e._v("提交")])])]),e._v(" "),a("AdPage",{attrs:{pageAdKeywords:"AD_Key_LoginBindQrcode"}})],1):e._e()}),[],!1,null,"3400e407",null);t.default=r.exports},Q43f:function(e,t,a){},chc6:function(e,t,a){"use strict";var n=a("2nGb"),o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),i=document.getElementsByTagName("head")[0],r=function(){function e(t,a){var n=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.url=t||"",this.funcName=a;var o=document.createElement("script");t+=(~t.indexOf("?")?"&":"?")+"callback="+a,o.src=t,o.type="text/javascript",this.myTimer=setTimeout((function(){n.callCallback({status:1,info:"网络加载较慢！"}),n.clearup()}),1e4),window[a]=function(e){n.callCallback({status:0,data:e,info:""}),n.clearup()},o.onerror=function(){n.callCallback({status:1,info:"网络加载较慢！"}),n.clearup()},this.scriptNode=o,i.appendChild(this.scriptNode)}return s(e,[{key:"then",value:function(e){this.callbackFunc=e}},{key:"callCallback",value:function(e){var t=this;setTimeout((function(){t.callbackFunc(e)}),0)}},{key:"clearup",value:function(){this.myTimer&&clearTimeout(this.myTimer),this.myTimer=null,this.scriptNode.src="",i.removeChild(this.scriptNode)}}]),e}(),c={request:function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];if(!e)throw new Error("url 不能为空");return 0!=e.indexOf("http")&&(e=n.a.baseURL+e),a.forEach((function(t){if("object"===(void 0===t?"undefined":o(t)))for(var a in t)e+=~e.indexOf("?")?"&":"?",e+=a+"="+t[a]})),new r(e,t)},cancelAll:function(){}};t.a=c},g2bL:function(e,t,a){"use strict";var n=a("AXlJ");a.n(n).a},mbR2:function(e,t,a){"use strict";var n=a("chc6"),o={name:"adpage",components:{ImageAd:function(){return a.e(772).then(a.bind(null,"BAEh"))}},props:["pageAdKeywords","pgCode"],data:function(){return{pageData:null,show:!1}},computed:{showAdpage:function(){var e=this.show&&null!=this.pageData&&this.pageData.adData&&""!=this.pageData.adData;return e&&null==this.pageData.adData.rows.find((function(e){return 0!=e.canSee}))&&(e=!1),e}},methods:{adPageIsShow:function(e){var t=window.localStorage.getItem(this.pageAdKeywords+e);t?(new Date).getTime()>t&&(this.show=!0):this.show=!0},adPageHide:function(){this.show=!1},getMyPageData:function(){var e=this,t="vuePageData_",a=[];a.push({appType:1}),a.push({accessType:2}),this.pgCode&&""!=this.pgCode?(t+=this.pgCode,a.push({pgCode:this.pgCode})):(a.push({pageAdKeywords:this.pageAdKeywords}),t+=this.$util.md5String(this.pageAdKeywords)),n.a.request("/appcontent/js/app_vue_page/vuePageData.js",t,a).then((function(t){if(0==t.status){var a=t.data.pageData;if(!a.pageDataJson)return;e.pageData=JSON.parse(a.pageDataJson);var n=t.data.id||"",o=e.pageData.adData;if(e.adPageIsShow(n),o&&e.show)if("1"==o.showFrequency){var s=new Date;s=s.setDate(s.getDate()+1),s=new Date(s).setHours(2,0,0,0);var i=new Date(s).getTime();window.localStorage.setItem(e.pageAdKeywords+n,i)}else if("2"==o.showFrequency){var r=new Date;r=r.setDate(r.getDate()+999);var c=new Date(r).getTime();window.localStorage.setItem(e.pageAdKeywords+n,c)}else if("3"==o.showFrequency){var l=(new Date).getTime()+36e3;window.localStorage.setItem(e.pageAdKeywords+n,l)}else if("4"==o.showFrequency){var d=(new Date).getTime()+0;window.localStorage.setItem(e.pageAdKeywords+n,d)}else{var u=(new Date).getTime()+36e5;window.localStorage.setItem(e.pageAdKeywords+n,u)}}}))}},created:function(){this.getMyPageData()}},s=(a("g2bL"),a("KHd+")),i=Object(s.a)(o,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return e.showAdpage?a("div",{staticClass:"adpage",on:{click:function(t){return t.stopPropagation(),e.adPageHide(t)}}},[a("div",[a("ImageAd",{attrs:{usePorpData:!0,propData:e.pageData},on:{closeEvent:e.adPageHide}})],1)]):e._e()}),[],!1,null,"52850f74",null);t.a=i.exports},utNN:function(e,t,a){"use strict";var n=a("Q43f");a.n(n).a}}]);
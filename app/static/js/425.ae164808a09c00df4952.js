(window.webpackJsonp=window.webpackJsonp||[]).push([[425],{"1oqP":function(e,t,a){"use strict";var n=a("yyBO");a.n(n).a},C6Fg:function(e,t,a){},JX94:function(e,t,a){"use strict";a.r(t);var n=a("dqDD"),s={data:function(){return{cardNumber:19,number:"",phone:"",validate:"",referee:"",obtain:"获取验证码",disabled:!1,Member:"",prohibit:!1,noprefix:"",theScanCode:"",inway:"",lastPath:"",newList:"",cardPrompt:""}},mounted:function(){this.getphone(),this.recommenderHistory()},created:function(){this.showagreement(),this.inway=this.$route.query.inway?this.$route.query.inway:"",this.lastPath=this.$route.query.lastPath?this.$route.query.lastPath:"",this.rfrCodeType=1;var e=this.$store.state.mall2.behalf.referrerInvalidDate;e&&null!=e&&""!=e?new Date(e).getTime()>=(new Date).getTime()&&(this.referee=this.$store.state.mall2.behalf.referrer):this.referee=this.$store.state.mall2.behalf.referrer},methods:{showagreement:function(){var e=this;this.$request.post("/app/json/news/getNewsList",{values:24}).then((function(t){0==t.status&&(e.cardPrompt=t.data[0]?t.data[0].content:"")}))},backEvent:function(){this.$router.go(-1)},jiami:function(e){return e.substr(0,4)+"****"+e.substr(-4)},changeRfrCodeType:function(){this.rfrCodeType=1},sweep:function(){var e=this;this.$bridgefunc.scanCode((function(t){e.rfrCodeType=2;var a=t.code;a.indexOf("http")>-1&&(a=e.$util.getUrlParam(a,"qrCode")),e.theScanCode=a,e.referee=a}))},countdown:function(){var e=this,t=this,a=this,s=60;new RegExp("^[0-9]{"+this.cardNumber+"}$").test(this.number)?this.$request.post("/app/json/card/checkCardHasBind",{cardno:this.noprefix+this.number}).then((function(i){0==i.status?(e.$Loading.open(),e.$http.post("/app/json/message/sendVerifyBindCardSms",{phone:e.phone,cardno:e.noprefix+e.number}).then((function(e){a.$Loading.close(),console.log(e),"error"===e.data.result?Object(n.Toast)(e.data.info):(Object(n.Toast)("获取验证码成功"),function e(){if(0==s)return t.disabled=!1,t.obtain="获取验证码",s=60,!1;t.disabled=!0,t.obtain="重新发送("+s+")",s--,setTimeout((function(){e()}),1e3)}())}))):e.$Toast(i.info)})):Object(n.Toast)("请输入正确卡号")},renders:function(){var e=this;if(console.log(this.number),console.log(this.phone),console.log(this.validate),this.referee==this.theScanCode?this.rfrCodeType=2:this.rfrCodeType=1,new RegExp("^[0-9]{"+this.cardNumber+"}$").test(this.number))if(""!==this.validate){this.$Loading.open();var t=this;this.$http.post("/app/json/card/bindCard",{cardno:this.noprefix+this.number,smscode:this.validate,referrer:this.referee,bindway:3,rfrCodeType:this.rfrCodeType}).then((function(a){t.$Loading.close(),console.log(a),-1!==a.data.status?0===a.data.status&&("replace"==e.inway?e.$router.replace({path:e.lastPath}):e.$router.go(-1)):Object(n.Toast)(a.data.info)}))}else Object(n.Toast)("请输入正确短信验证码");else Object(n.Toast)("请输入正确卡号")},getphone:function(){var e=this;this.$Loading.open();var t=this;this.$http.post("/app/json/card/getcardnopre",{}).then((function(a){t.$Loading.close(),console.log(a),e.phone=a.data.data.phone,e.noprefix=a.data.data.noprefix,e.cardNumber=1*(19-e.noprefix.length),e.Member=e.phone}))},getNewsList:function(){var e=this;this.$Loading.open();var t=this;this.$http.post("/app/json/news/getNewsList",{values:21}).then((function(a){t.$Loading.close(),e.newList=a.data.data[0],console.log(e.newList)}))},recommenderHistory:function(){this.$Loading.open();var e=this;this.$http.post("/app/json/card/getBindCardReferrer",{}).then((function(t){console.log(333,t),e.$Loading.close(),t.data.data?(e.referee=t.data.data?t.data.data:"",e.prohibit=!0):e.prohibit=!1}))}}},i=(a("1oqP"),a("UYuH"),a("KHd+")),r=Object(i.a)(s,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"index"}},[a("nav-top",{attrs:{title:"加油卡绑定"},on:{backEvent:e.backEvent}}),e._v(" "),a("nav-content",[a("div",{staticClass:"conter"},[a("p",{staticClass:"ma-top"}),e._v(" "),a("div",{staticClass:"input"},[a("ul",{staticClass:"inputnumber"},[a("li",{staticClass:"cardnoTitle"},[e._v("加油卡号")]),e._v(" "),a("li",{staticClass:"cardnoLi"},[e._v(e._s(e.noprefix))]),e._v(" "),a("li",{staticClass:"cardnoInput"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.number,expression:"number"}],attrs:{type:"number",placeholder:"请输入卡号后"+e.cardNumber+"位"},domProps:{value:e.number},on:{input:function(t){t.target.composing||(e.number=t.target.value)}}})])]),e._v(" "),a("mt-field",{attrs:{label:"手机号码",placeholder:"请输入手机号",disabled:"",type:"tel"},model:{value:e.Member,callback:function(t){e.Member=t},expression:"Member"}}),e._v(" "),a("mt-field",{attrs:{label:"手机验证码",attr:{maxlength:6},placeholder:"请输入短信验证码",type:"type"},model:{value:e.validate,callback:function(t){e.validate=t},expression:"validate"}},[a("input",{staticClass:"fl-right",style:{background:"#fff",fontSize:"12px",color:"获取验证码"===e.obtain?"#f02c2c":"#ccc"},attrs:{type:"button",value:e.obtain,disabled:e.disabled},on:{click:e.countdown}})]),e._v(" "),e.$store.state.globalConfig.sunbox_binding_card_noreferee?e._e():a("mt-field",{attrs:{label:"推荐人",placeholder:"请输入推荐人（选填）"},on:{input:e.changeRfrCodeType},model:{value:e.referee,callback:function(t){e.referee=t},expression:"referee"}},[a("img",{attrs:{src:"static/image/fuelcard//btn_Sweep.png",width:"25",height:"25"},on:{click:e.sweep}})]),e._v(" "),a("p",{staticClass:"btn",on:{click:e.renders}},[e._v("提交")])],1),e._v(" "),e.cardPrompt?a("div",{staticClass:"card-prompt"},[a("h3",{staticClass:"title"},[e._v("温馨提示：")]),e._v(" "),a("div",{staticClass:"content",domProps:{innerHTML:e._s(e.cardPrompt)}})]):e._e()])])],1)}),[],!1,null,"fcf3776a",null);t.default=r.exports},UYuH:function(e,t,a){"use strict";var n=a("C6Fg");a.n(n).a},yyBO:function(e,t,a){}}]);
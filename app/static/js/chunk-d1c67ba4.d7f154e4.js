(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d1c67ba4"],{"4eae":function(t,s,a){"use strict";a("899c")},"899c":function(t,s,a){},b30d:function(t,s,a){"use strict";a.r(s);var e=function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"rebate-bonus-details"},[a("nav-top",{attrs:{title:t.globalConfig.Employees_wallet},on:{backEvent:t.backEvent}}),a("nav-content",{staticClass:"rebate-bonus-details-con"},[a("div",{staticClass:"main"},[a("div",{staticClass:"integral-title"},[a("div",{staticClass:"now-integral"},[a("p",{staticClass:"explain-num"},[a("span",{staticClass:"num"},[t._v(t._s(t.integralList.balanceUnit))]),a("span",{staticClass:"explain",on:{click:t.explainBtn}},[t._v("规则说明 ")])]),a("p",{staticClass:"text"},[t._v("当前"+t._s(t.globalConfig.Employees_wallet))])])]),a("div",{staticClass:"content"},[0!=t.expireUnit?a("div",{staticClass:"tips"},[t._v("余额过期提醒：您有"),a("span",{staticClass:"num",on:{click:t.openInfo}},[t._v(" "+t._s(t.expireUnit||"0")+" ")]),t._v("余额即将过期，请尽快使用！")]):t._e(),a("div",{staticClass:"tabs"},t._l(t.tabs,(function(s){return a("div",{key:s.id,staticClass:"tab-item",class:{active:s.id===t.tabId},on:{click:function(a){return t.tabEvent(s.id)}}},[a("div",{staticClass:"text"},[t._v(" "+t._s(s.text)+" ")])])})),0)])]),a("div",{staticClass:"list"},[a("commonList",{ref:"list",attrs:{statusObj:t.statusObj,source:t.source}})],1)])],1)},i=[],n=a("5530"),o="/account/json/acct_emp_rewards/getPaymentBaseList",c={methods:{getPaymentBaseListUrl:function(t){return this.$http.post(o,t)}}},l=a("2601"),u=a("2f62"),r={name:"rebate-bonus-list",mixins:[c],data:function(){return{page:0,rows:10,payTypeCodes:"100,300",tabId:"1",integralList:{},source:9,statusObj:{is:36,status:"1",effective:"effective-beans",invalid:"failed-beans",payTypeCodes:"100,300",totalAddUnit:0,expireBalanceUnit:0,totalConsumeUnit:0,url:"/app/json/acct/getAccountPaymentList"},tabs:[{text:"奖励明细",id:"1"},{text:"消费明细",id:"2"},{text:"过期明细",id:"3"}],expireUnit:"0"}},computed:Object(n["a"])({},Object(u["e"])(["globalConfig"])),mounted:function(){var t=this,s={token:this.$store.state.login.token,acctType:9};this.$http.post("/app/json/acct/getAccountBaseInfo",s).then((function(s){var a=s.data;0==a.status?(t.integralList=a.data,t.statusObj.totalAddUnit=a.data.totalAddUnit,t.statusObj.expireBalanceUnit=a.data.expireBalanceUnit,t.statusObj.totalConsumeUnit=a.data.totalConsumeUnit):t.$Toast(a.info)})),this.getAboutExpireUnit()},methods:{getAboutExpireUnit:function(){var t=this,s={token:this.$store.state.login.token,acctType:9,queryDays:this.$store.state.globalConfig.Count_overdue_days};this.$http.post("/app/json/acct/getAboutExpireUnit",s).then((function(s){var a=s.data;0==a.status?t.expireUnit=a.data.aboutExpireBalanceUnit:t.$Toast("获取当前过期积分失败")}))},openInfo:function(){this.$router.push({path:"/mall2/expire-integralinfo",query:{expireUnit:this.expireUnit,acctType:9}})},backEvent:function(){this.$router.go(-1)},explainBtn:function(){this.$router.push({path:"/usercenter/rule"})},tabEvent:function(t){this.tabId=t,this.statusObj.status=t,1==t?this.statusObj.payTypeCodes="100,300":2==t?this.statusObj.payTypeCodes="200":3==t&&(this.statusObj.payTypeCodes="400")}},components:{commonList:l["a"]}},p=r,d=(a("4eae"),a("0c7c")),b=Object(d["a"])(p,e,i,!1,null,"0fe0f942",null);s["default"]=b.exports}}]);
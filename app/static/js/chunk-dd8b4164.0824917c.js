(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-dd8b4164"],{"53b8":function(t,s,a){"use strict";a("f2cc")},a84b:function(t,s,a){"use strict";a.r(s);var i=function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"body"},[a("nav-top",{attrs:{title:"权益明细"},on:{backEvent:function(s){return t.$router.go(-1)}}}),a("nav-content",[a("van-tabs",{on:{change:t.loadData},model:{value:t.active,callback:function(s){t.active=s},expression:"active"}},[a("van-tab",{attrs:{title:"派发记录"}},[a("div",{staticClass:"box"},[a("div",{staticClass:"couponDiv"},[a("ul",t._l(t.list,(function(s){return a("li",[a("div",{staticClass:"coupon-left"},[a("img",{attrs:{src:s.couponPic,alt:""}})]),a("div",{staticClass:"coupon-right"},[a("div",{staticClass:"double-line"},[a("span",{staticClass:"coupon"},[t._v(t._s(s.couponType))]),a("span",{staticClass:"text"},[t._v(t._s(s.name))])]),a("div",{staticClass:"time-wrapper"},[a("span",{staticClass:"time"},[t._v(t._s(s.useTime)+"失效")])])])])})),0)])])]),a("van-tab",{attrs:{title:"使用记录"}},[a("div",{staticClass:"box"},[a("div",{staticClass:"couponDiv"},[a("ul",t._l(t.list,(function(s){return a("li",[a("div",{staticClass:"coupon-left"},[a("img",{attrs:{src:s.couponPic,alt:""}})]),a("div",{staticClass:"coupon-right"},[a("div",{staticClass:"double-line"},[a("span",{staticClass:"coupon"},[t._v(t._s(s.couponType))]),a("span",{staticClass:"text"},[t._v(t._s(s.name))])]),a("div",{staticClass:"time-wrapper"},[a("span",{staticClass:"time"},[t._v(t._s(s.useTime)+"失效")])])])])})),0)])])]),a("van-tab",{attrs:{title:"过期记录"}},[a("div",{staticClass:"box"},[a("div",{staticClass:"couponDiv"},[a("ul",t._l(t.list,(function(s){return a("li",[a("div",{staticClass:"coupon-left"},[a("img",{attrs:{src:s.couponPic,alt:""}})]),a("div",{staticClass:"coupon-right"},[a("div",{staticClass:"double-line"},[a("span",{staticClass:"coupon"},[t._v(t._s(s.couponType))]),a("span",{staticClass:"text"},[t._v(t._s(s.name))])]),a("div",{staticClass:"time-wrapper"},[a("span",{staticClass:"time"},[t._v(t._s(s.useTime)+"失效")])])])])})),0)])])])],1)],1)],1)},e=[],n={name:"afterSale",data:function(){return{active:0,equityType:"",list:[]}},mounted:function(){this.equityType=JSON.parse(this.$route.query.equityType),this.loadData(0)},methods:{loadData:function(t){var s=this,a={token:this.$store.state.login.token,equityType:this.equityType,type:t+1};this.$http.post("/app/equity_member/queryMyEquityCouponDetail",a).then((function(t){var a=t.data;0==a.status?s.list=a.data:s.$Toast("查看明细失败")}))}}},c=n,o=(a("53b8"),a("0c7c")),l=Object(o["a"])(c,i,e,!1,null,"2633d562",null);s["default"]=l.exports},f2cc:function(t,s,a){}}]);
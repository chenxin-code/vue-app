(window.webpackJsonp=window.webpackJsonp||[]).push([[891],{GVmg:function(t,e,i){"use strict";i.r(e);var s=(i("weGq"),i("KHd+")),n=Object(s.a)({data:function(){return{rebateList:[]}},mounted:function(){this.initPrizeDetail()},methods:{initPrizeDetail:function(){var t=this;this.$Loading.open(),this.$http.post("/app/json/wechat_qy/getprizeDetail",{orderNo:this.$route.query.orderNo,userId:this.$route.query.userId}).then((function(e){t.$Loading.close();var i=e.data;0==i.status?t.rebateList=i.data||[]:t.$Toast(i.info)})).catch((function(e){t.$Loading.close(),t.$Toast("getprizeDetail err "+e)}))}}},(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"container"},[i("ul",{staticClass:"rebate-list"},t._l(t.rebateList,(function(e,s){return i("li",{key:s,staticClass:"item"},[i("p",{staticClass:"title"},[t._v(t._s(e.prizeTypeName))]),t._v(" "),i("div",{staticClass:"content"},[t._v("\n\t\t\t\t"+t._s(e.prizeNum)+"\n\t\t\t")])])})),0)])}),[],!1,null,"6804b284",null);e.default=n.exports},XhL6:function(t,e,i){},weGq:function(t,e,i){"use strict";var s=i("XhL6");i.n(s).a}}]);
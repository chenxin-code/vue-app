(window.webpackJsonp=window.webpackJsonp||[]).push([[905],{"49BN":function(t,s,a){"use strict";var n=a("dl4/");a.n(n).a},REOZ:function(t,s,a){"use strict";a.r(s);var n={name:"ad-page",components:{},data:function(){return{allNumber:0,list:[]}},methods:{details:function(t){this.$bridgefunc.customPush({path:"/hkhistorydetail",query:{item:encodeURIComponent(JSON.stringify(t))}})}},created:function(){var t=this;this.$Loading.open(),this.$http.post("/platform/json/hzf/getHzfCouUsedRecord",{isJsonData:!0}).then((function(s){var a=s.data;0===Number(a.status)?(t.allNumber=a.data.totalAmount?a.data.totalAmount:0,t.list=a.data.info?a.data.info:[]):t.$Toast(s.data.info),t.$Loading.close()}))},destroyed:function(){this.$Loading.close()}},i=(a("49BN"),a("KHd+")),e=Object(i.a)(n,(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",[a("nav-top",{attrs:{title:"历史记录"},on:{backEvent:function(s){return t.$router.go(-1)}}}),t._v(" "),a("nav-content",{staticClass:"history-index"},[a("div",{staticClass:"top"},[a("p",{staticClass:"save"},[t._v("截止目前总计为您节省")]),t._v(" "),a("p",[a("span",[t._v(t._s(t.allNumber))]),t._v("元\n      ")])]),t._v(" "),a("div",{staticClass:"listAll"},t._l(t.list,(function(s){return a("div",{staticClass:"list",on:{click:function(a){return t.details(s)}}},[a("div",{staticClass:"content"},[a("p",{staticClass:"place"},[t._v(t._s(s.stationName))]),t._v(" "),a("p",{staticClass:"time"},[a("span",[t._v("使用时间")]),t._v(" "),a("span",[t._v(t._s(s.usedtime))])])]),t._v(" "),a("div",{staticClass:"number"},[t._v(t._s(s.facevalue))])])})),0)])],1)}),[],!1,null,"3ebb4ce6",null);s.default=e.exports},"dl4/":function(t,s,a){}}]);
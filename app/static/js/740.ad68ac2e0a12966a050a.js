(window.webpackJsonp=window.webpackJsonp||[]).push([[740],{"0Sqt":function(t,e,s){},Ax82:function(t,e,s){"use strict";s.r(e),s("H4fG");var n=s("UQt/"),a=(s("d/hb"),{name:"expressinfo",components:{Step:s("3A9a").a,Steps:n.a},data:function(){return{expressDetails:[],indexPrev:"0",expressNo:"",expressName:"",expressionCodeList:[]}},created:function(){this.$route.query.expressNo&&this.$route.query.expressName?(this.expressNo=this.$route.query.expressNo,this.expressName=this.$route.query.expressName,this.getCompanyNumber()):this.$Toast("快递信息有误，请检查订单中是否包含快递信息")},methods:{getCompanyNumber:function(){var t=this;this.$http.post("/app/json/app_dict/getDictByAlias",{alias:"expression_company_code"}).then((function(e){var s=e.data;if(0==s.status){t.expressionCodeList=s.data||[];var n=t.expressionCodeList.find((function(e){return e.dictValue==t.expressName}));n&&n.dictKey?t.getExpressionInfo(n.dictKey):t.$Toast("查询快递失败，未找到【"+t.expressName+"】公司的快递")}else t.$Toast(s.info)})).catch((function(e){t.$Toast("getDictByAlias err "+e)}))},getExpressionInfo:function(t){var e=this;this.$http.post("/app/json/app_third/query100",{com:t,num:this.expressNo}).then((function(t){var s=t.data;0==s.status?(e.expressDetails=s.data.data||[],console.table(JSON.parse(JSON.stringify(e.expressDetails)))):e.$Toast(s.info)})).catch((function(t){e.$Toast("query100 err "+t)}))},changeColour:function(t){var e=t.replace(/[^0-9]/gi,""),s=/^1[3456789]\d{9}$/;return s.test(e)&&(this.inputVal=e),s.test(e)||(this.inputVal=""),t},turnback:function(){this.$router.go(-1)}}}),i=(s("kOFX"),s("KHd+")),r=Object(i.a)(a,(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"expressinfo"},[s("nav-top",{on:{backEvent:t.turnback}}),t._v(" "),s("nav-content",[s("div",{staticClass:"scroll-order"},[s("div",[s("van-steps",{attrs:{direction:"vertical",active:0,"active-color":"red"}},t._l(t.expressDetails,(function(e,n){return s("van-step",{key:n},[s("h3",{class:{black:n==t.indexPrev},attrs:{inputVal:t.changeColour(e.context)}},[s("div",[s("span",[t._v("\n                "+t._s(e.context.substr(0,e.context.indexOf(t.inputVal)))+"\n              ")]),t._v(" "),s("a",{staticStyle:{color:"#2A70FE"},attrs:{href:"tel:"+t.inputVal}},[t._v(t._s(t.inputVal))]),t._v(" "),s("span",[t._v(t._s(e.context.substr(e.context.indexOf(t.inputVal)+t.inputVal.length)))])])]),t._v(" "),s("p",{class:{black:n==t.indexPrev}},[t._v(t._s(t.$util.getPayTimemin(e.time)))])])})),1)],1),t._v(" "),t.expressDetails?t._e():s("div",{staticClass:"no-data"},[t._v("暂未查询到物流信息")])])])],1)}),[],!1,null,"65b0c27e",null);e.default=r.exports},kOFX:function(t,e,s){"use strict";var n=s("0Sqt");s.n(n).a}}]);
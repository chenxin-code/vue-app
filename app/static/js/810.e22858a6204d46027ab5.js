(window.webpackJsonp=window.webpackJsonp||[]).push([[810],{"2RNl":function(t,e,a){"use strict";a.r(e);var n=a("db0i"),s={name:"index",components:{},data:function(){return{payInfo:{},payWay:[],hasToPay:!1,selectedPayWay:null,occurOuCode:""}},methods:{backEvent:function(){this.$router.go(-1)},payWaySelected:function(t){console.log(t),""!=t.payModeSub?this.selectedPayWay=t:this.$Toast("暂未开通！")},payEvent:function(){var t=this;null!=this.selectedPayWay?(this.hasToPay=!0,n.a.trafficPayEvent(this.selectedPayWay,this.payInfo.orderType,this.payInfo.orderId).then((function(){t.enterSuccess()})).catch((function(){t.hasToPay=!1}))):this.$Toast("请选择支付方式！")},enterSuccess:function(){this.$router.replace({path:"/pay-success",query:{selectedIndex:1}})},setPayWays:function(){var t,e=this;return(t=regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.a.getPayWays("200001",e.occurOuCode);case 2:e.payWay=t.sent,e.payWay.length>0&&(e.selectedPayWay=e.payWay[0]);case 4:case"end":return t.stop()}}),t,e)})),function(){var e=t.apply(this,arguments);return new Promise((function(t,a){return function n(s,o){try{var i=e[s](o),c=i.value}catch(t){return void a(t)}if(!i.done)return Promise.resolve(c).then((function(t){n("next",t)}),(function(t){n("throw",t)}));t(c)}("next")}))})()},checkPayResult:function(){var t=this;this.$Loading.open();var e={token:this.$store.state.login.token,orderType:this.payInfo.orderType,orderId:this.payInfo.orderId};this.$http.post("/app/json/app_shopping_order/detail",e).then((function(e){t.$Loading.close();var a=e.data;0==a.status&&3==a.data.state&&t.enterSuccess()}),(function(e){t.$Loading.close()}))}},created:function(){console.log(this.$route),this.occurOuCode=this.$route.params.occurOuCode?this.$route.params.occurOuCode:"",this.payInfo=this.$route.params.payInfo?this.$route.params.payInfo:{},this.$mallCommon.dataProcessing(this.payInfo),this.setPayWays()},mounted:function(){var t=this;this.$bridgefunc.enterForegroundCallBack((function(){t.hasToPay&&(t.hasToPay=!1,t.checkPayResult())}))},activated:function(){},beforeRouteLeave:function(t,e,a){this.$keepaliveHelper.deleteCache(this),a()}},o=(a("FL/8"),a("KHd+")),i=Object(o.a)(s,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"index mall2"},[a("nav-top",{attrs:{title:"收银台"},on:{backEvent:t.backEvent}}),t._v(" "),a("nav-content",[a("div",{staticClass:"block-div"},[a("div",{staticClass:"flex-row"},[a("div",{staticClass:"theme_font_common"},[t._v("\n                    需支付：\n                    "),a("span",{staticClass:"font-small theme_font_red"},[t._v("￥")]),t._v(" "),a("span",{staticClass:"price-z theme_font_red"},[t._v(t._s(t.payInfo.dpedData.integer))]),t._v(" "),a("span",{staticClass:"left-no-space font-small theme_font_red"},[t._v("."+t._s(t.payInfo.dpedData.decimals))])])]),t._v(" "),a("div",{staticClass:"flex-row"},[a("div",{staticClass:"theme_font_common"},[t._v("交易号："+t._s(t.payInfo.tradeNo))])])]),t._v(" "),a("div",{staticClass:"block-div"},[a("div",{staticClass:"flex-row"},[a("div",{staticClass:"title"},[t._v("支付方式")])]),t._v(" "),t._l(t.payWay,(function(e,n){return a("div",{key:n,staticClass:"flex-row",on:{click:function(a){return t.payWaySelected(e)}}},[a("div",{staticClass:"icon-div"},[a("img",{attrs:{src:e.icon}})]),t._v(" "),a("div",{staticClass:"full"},[t._v(t._s(e.text))]),t._v(" "),a("div",{staticClass:"selected-mark"},[t.selectedPayWay.payModeSub!=e.payModeSub?a("i",{staticClass:"iconfont mall-weixuanzhong theme_font_tint"}):t._e(),t._v(" "),t.selectedPayWay.payModeSub==e.payModeSub?a("i",{staticClass:"iconfont mall-xuanzhong theme_font_red"}):t._e()])])}))],2),t._v(" "),a("div",{staticClass:"bottom-btn theme_font_white theme_standard_bg",on:{click:t.payEvent}},[t._v("支付￥"+t._s(t.$util.toDecimal2(t.payInfo.payAmount))+"元")])])],1)}),[],!1,null,"8a3acb42",null);e.default=i.exports},"FL/8":function(t,e,a){"use strict";var n=a("Rj4X");a.n(n).a},Rj4X:function(t,e,a){}}]);
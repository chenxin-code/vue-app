(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1cf46753"],{"5bc7":function(t,e,a){},f45c:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"index mall2"},[a("nav-top",{attrs:{title:"收银台"},on:{backEvent:t.backEvent}}),a("nav-content",[a("div",{staticClass:"block-div"},[a("div",{staticClass:"flex-row"},[a("div",{staticClass:"theme_font_common"},[t._v(" 需支付： "),a("span",{staticClass:"font-small theme_font_red"},[t._v("￥")]),a("span",{staticClass:"price-z theme_font_red"},[t._v(t._s(t.payInfo.dpedData.integer))]),a("span",{staticClass:"left-no-space font-small theme_font_red"},[t._v("."+t._s(t.payInfo.dpedData.decimals))])])]),a("div",{staticClass:"flex-row"},[a("div",{staticClass:"theme_font_common"},[t._v("交易号："+t._s(t.payInfo.tradeNo))])])]),a("div",{staticClass:"block-div"},[a("div",{staticClass:"flex-row"},[a("div",{staticClass:"title"},[t._v("支付方式")])]),t._l(t.payWay,(function(e,s){return a("div",{key:s,staticClass:"flex-row",on:{click:function(a){return t.payWaySelected(e)}}},[a("div",{staticClass:"icon-div"},[a("img",{attrs:{src:e.icon}})]),a("div",{staticClass:"full"},[t._v(t._s(e.text))]),a("div",{staticClass:"selected-mark"},[t.selectedPayWay.payModeSub!=e.payModeSub?a("i",{staticClass:"iconfont mall-weixuanzhong theme_font_tint"}):t._e(),t.selectedPayWay.payModeSub==e.payModeSub?a("i",{staticClass:"iconfont mall-xuanzhong theme_font_red"}):t._e()])])}))],2),a("div",{staticClass:"bottom-btn theme_font_white theme_standard_bg",on:{click:t.payEvent}},[t._v("支付￥"+t._s(t.$util.toDecimal2(t.payInfo.payAmount))+"元")])])],1)},n=[],o=a("1da1"),c=(a("96cf"),a("ac1f"),a("5319"),a("75bd")),i={name:"index",components:{},data:function(){return{payInfo:{},payWay:[],hasToPay:!1,selectedPayWay:null,occurOuCode:""}},methods:{backEvent:function(){this.$router.go(-1)},payWaySelected:function(t){""!=t.payModeSub?this.selectedPayWay=t:this.$Toast("暂未开通！")},payEvent:function(){var t=this;null!=this.selectedPayWay?(this.hasToPay=!0,c["a"].trafficPayEvent(this.selectedPayWay,this.payInfo.orderType,this.payInfo.orderId).then((function(){t.enterSuccess()}))["catch"]((function(){t.hasToPay=!1}))):this.$Toast("请选择支付方式！")},enterSuccess:function(){this.$router.replace({path:"/life-pay-success",query:{selectedIndex:1}})},setPayWays:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,c["a"].getPayWays("205001",t.occurOuCode);case 2:t.payWay=e.sent,t.payWay.length>0&&(t.selectedPayWay=t.payWay[0]);case 4:case"end":return e.stop()}}),e)})))()},checkPayResult:function(){var t=this;this.$Loading.open();var e="/app/json/app_shopping_order/detail",a={token:this.$store.state.login.token,orderType:this.payInfo.orderType,orderId:this.payInfo.orderId};this.$http.post(e,a).then((function(e){t.$Loading.close();var a=e.data;0==a.status&&3==a.data.state&&t.enterSuccess()}),(function(e){t.$Loading.close()}))}},created:function(){this.occurOuCode=this.$route.params.occurOuCode?this.$route.params.occurOuCode:"",this.payInfo=this.$route.params.payInfo?this.$route.params.payInfo:{},this.$mallCommon.dataProcessing(this.payInfo),this.setPayWays()},mounted:function(){var t=this;this.$bridgefunc.enterForegroundCallBack((function(){t.hasToPay&&(t.hasToPay=!1,t.checkPayResult())}))},activated:function(){},beforeRouteLeave:function(t,e,a){this.$keepaliveHelper.deleteCache(this),a()}},r=i,l=(a("fcb6"),a("0c7c")),d=Object(l["a"])(r,s,n,!1,null,"c7043408",null);e["default"]=d.exports},fcb6:function(t,e,a){"use strict";a("5bc7")}}]);
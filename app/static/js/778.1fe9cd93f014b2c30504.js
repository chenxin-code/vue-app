(window.webpackJsonp=window.webpackJsonp||[]).push([[778],{"/BJo":function(t,a,o){},WB1r:function(t,a,o){"use strict";o.r(a);var s=o("p46w"),e=o.n(s),i={name:"esh-jfhq",components:{},props:["myIndex","usePorpData","propData"],mixins:[o("A8ay").a],data:function(){return{jfhqCouponList:[]}},computed:{pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.pageData},moduleData:function(){return this.pageData.moduleList[this.myIndex].data}},methods:{hotEvent:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.actionBtnEvent(this.pageData.pgCode,this.moduleData.idCode+t)},buyCouponEvent:function(t){this.$router.push({path:"/icbc/coupondetail",query:{type:2,couponData:JSON.stringify(t)}})},submitExchangeOrder:function(t){var a=this,o={exchangeDetailId:t.id};this.$Loading.open(),this.$http.post("/app/json/app_exchange/submitExchangeOrder",o).then((function(t){a.$Loading.close();var o=t.data,s=o.data||{};0==o.status?a.$market.doPay({payMode:305,payModeSub:305007},s.payInfo).then((function(){e.a.set("icbc_tradeNo",s.tradeNo)})).catch((function(){a.$Toast("支付失败！")})):a.$Toast(o.info)}),(function(t){a.$Loading.close(),a.$Toast("请求数据失败！")}))},resultHand:function(t,a){this.$Loading.close(),"1"==t?this.$router.replace({path:"/icbc/success",query:{orderType:a.orderType,orderId:a.id,fromPage:1}}):this.$Toast("支付失败！")},getJFCouponList:function(){var t=this,a={longitude:this.$store.state.currentLocation.posx,latitude:this.$store.state.currentLocation.posy};this.$Loading.open(),this.$http.post("/app/json/app_exchange/queryExchangeDetailList",a).then((function(a){t.$Loading.close();var o=a.data;0===o.status?t.jfhqCouponList=o.data:"-1"!=t.$store.state.webtype&&t.$Toast(o.info)}),(function(a){t.$Loading.close(),t.$Toast("系统运行过程中遇到问题，请稍候再试")}))}},created:function(){this.getJFCouponList()}},n=(o("xOCK"),o("KHd+")),c=Object(n.a)(i,(function(){var t=this,a=t.$createElement,o=t._self._c||a;return o("div",{staticClass:"esh-jfhq"},[t.jfhqCouponList.length>0?o("div",{staticClass:"jfhq-div"},[o("div",{staticClass:"title"},[o("div",{staticClass:"text"},[t._v("积分换券")]),t._v(" "),o("div",{staticClass:"more",class:t.hotareaClass({idCode:t.moduleData.idCode+"more"}),on:{click:function(a){t.hotEvent("more"),t.$market.customPush({path:"/icbc/pointstocoupon"})}}},[t._v("更多")])]),t._v(" "),t._l(t.jfhqCouponList,(function(a,s){return o("div",{key:s,staticClass:"coupon",on:{click:function(o){return t.buyCouponEvent(a)}}},[o("div",{staticClass:"mianer"},[o("span",[t._v("¥")]),t._v(" "),o("span",{staticClass:"big"},[t._v(t._s(t.$util.toDecimal2(a.couType.couFaceValue)))])]),t._v(" "),o("div",{staticClass:"cou-info"},[o("div",{staticClass:"cou-title double-line"},[t._v(t._s(a.couType.couTypeTitle))]),t._v(" "),o("div",{staticClass:"cou-time"},[t._v("有效期："+t._s(a.couType.validDays)+"天")])]),t._v(" "),o("div",{staticClass:"right"},[o("div",{staticClass:"text"},[t._v("消耗积分")]),t._v(" "),o("div",{staticClass:"points"},[t._v(t._s(a.exchangeUnit))]),t._v(" "),o("div",{staticClass:"btn",on:{click:function(o){return o.stopPropagation(),t.submitExchangeOrder(a)}}},[t._v("立即兑换")])])])}))],2):t._e()])}),[],!1,null,"2fe80cb5",null);a.default=c.exports},xOCK:function(t,a,o){"use strict";var s=o("/BJo");o.n(s).a}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[909],{"7M5p":function(t,o,n){"use strict";var e=n("IA2R");n.n(e).a},IA2R:function(t,o,n){},jKmX:function(t,o,n){"use strict";n.r(o);var e=n("yBvL"),u=n("PxLX"),s={data:function(){return{couponDetail:{},showCoupon:!1}},components:{coupon:e.a},created:function(){this.getMyCouInfo()},methods:{getMyCouInfo:function(){var t=this;"1"==this.$store.state.globalConfig.couponOpenVerify?u.a.open({type:"coupon_verify",sureFunc:this.imgSureFunc,vertifyCancelEvent:function(){t.goBack()},paras:{phone:this.$store.state.login.phone}}):this.couponRequest(null,null)},goBack:function(){this.$router.go(-1)},imgSureFunc:function(t,o){this.couponRequest(t,o)},couponRequest:function(t,o){var n=this,e={token:this.$store.state.login.token,couNo:this.$route.query.couNo};null!=t&&null!=o&&(e.type="20000",e.imgVerifyCode=t,e.uuid=o),this.$http.post("/app/json/coupon/getMyCouInfo",e).then((function(t){0===t.data.status?n.couponDetail=t.data.data||{}:n.$toast(t.info),n.showCoupon=!0}))},backEvent:function(){this.$router.go(-1)}}},i=(n("7M5p"),n("KHd+")),c=Object(i.a)(s,(function(){var t=this,o=t.$createElement,n=t._self._c||o;return n("div",[n("nav-top",{attrs:{title:"我的电子券"},on:{backEvent:t.backEvent}}),t._v(" "),n("nav-content",{staticClass:"coupon-center"},[t.showCoupon?n("coupon",{attrs:{item:t.couponDetail}}):t._e(),t._v(" "),t.couponDetail.couDesc?n("div",{staticClass:"rule-warpper"},[n("div",{staticClass:"title"},[t._v("使用说明：")]),t._v(" "),n("div",{staticClass:"content",domProps:{innerHTML:t._s(t.couponDetail.couDesc)}})]):t._e()],1)],1)}),[],!1,null,"4ef97dbe",null);o.default=c.exports}}]);
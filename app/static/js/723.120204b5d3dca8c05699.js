(window.webpackJsonp=window.webpackJsonp||[]).push([[723],{"2j/U":function(t,o,e){"use strict";e.r(o);var n={name:"my-coupon",components:{CouponList:e("7gz+").a},data:function(){return{tabSelected:"1",tabs:[{text:"未使用",tag:"1",count:0},{text:"使用记录",tag:"2",count:0},{text:"已过期",tag:"3",count:0}],couponList:[],selectedItem:{},isShowTipView:!0,couponType:3}},methods:{tabEvent:function(t){t!=this.tabSelected&&this._getCouponList(t),1==t?this.couponType=3:2==t?this.couponType=4:3==t&&(this.couponType=5),this.tabSelected=t},moreCoupon:function(){console.log("moreCoupon")},couponCenter:function(){console.log("couponCenter")},_getCouponList:function(t){var o=this;this.$Loading.open();var e=void 0;"1"==t?e="/app/json/coupon/unusedcoupons":"2"==t?e="/app/json/coupon/usedcoupons":"3"==t&&(e="/app/json/coupon/overduecoupons");var n={token:this.$store.state.login.token};this.$http.post(e,n).then((function(t){o.$Loading.close();var e=t.data;0==e.status?(console.log("电子券",e),e.data.length?(o.isShowTipView=!1,o.dealwithData(e.data)):o.isShowTipView=!0):o.$Toast(e.info)}),(function(t){o.$Loading.close(),o.$Toast("获取电子券失败！")}))},dealwithData:function(t){var o=[];for(var e in t){var n=t[e],s={consumptionDesc:"",couAmount:"",couCategory:"",couDesc:""};s.couFaceValue=parseInt(n.facevalue),s.couNeedActive="",s.couNo=n.coucode,s.couOriginCode="",s.couOriginType="",s.consumptionDesc=n.consumptionDesc,s.couPic=n.imgurl,s.couThresholdAmount=n.couThresholdAmount,s.couTypeAlias="",s.couTypeCode=n.biztype,s.couTypeCodeThird="",s.couTypeSubTitle=n.typename,s.couTypeTitle=n.typetitle,s.isReceived="",s.mktActivityId="",s.validEndDate=n.couenddate.substr(0,10),s.validStartDate=n.coustartdate.substr(0,10),o.push(s)}this.couponList=o,console.log("couponList",this.couponList)},getCouponEvent:function(t){},couponProducts:function(){console.log("couponProducts")},itemEvent:function(t){this.selectedItem=t},_getCouponCount:function(){var t=this,o={token:this.$store.state.login.token};this.$http.post("/app/json/coupon/getcount",o).then((function(o){var e=o.data;0==e.status?(console.log("电子券数量",e),t.tabs[0].count=e.usednum?e.usednum:0,t.tabs[1].count=e.unnusednum?e.unnusednum:0,t.tabs[2].count=e.expnum?e.expnum:0,console.log("tab",t.tabs)):t.$Toast(e.info)}),(function(t){}))}},created:function(){this._getCouponList(this.tabSelected),this._getCouponCount()},beforeRouteLeave:function(t,o,e){this.$keepaliveHelper.deleteCache(this),e()}},s=(e("v3Gx"),e("KHd+")),i=Object(s.a)(n,(function(){var t=this,o=t.$createElement,e=t._self._c||o;return e("div",{staticClass:"my-coupon mall2"},[e("nav-top",{on:{backEvent:function(o){return t.$router.go(-1)}}}),t._v(" "),e("nav-content",[e("div",{staticClass:"tabs"},t._l(t.tabs,(function(o){return e("div",{staticClass:"tab-item",on:{click:function(e){return t.tabEvent(o.tag)}}},[e("div",{staticClass:"text theme_font_black",class:{"selected-btn":t.tabSelected==o.tag}},[t._v("\n          "+t._s(o.text)+"\n        ")])])})),0),t._v(" "),e("div",{staticClass:"scroll-div theme_bg_ml_red"},[t.isShowTipView?t._e():e("coupon-list",{attrs:{coupons:t.couponList,listType:t.couponType},on:{getCouponEvent:t.getCouponEvent,couponProducts:t.couponProducts,itemEvent:t.itemEvent}}),t._v(" "),t.isShowTipView?e("div",{staticClass:"tipbg"},[e("div",{staticClass:"tipcont"},[e("i",{staticClass:"iconfont mall-youhuiquan-xianxing theme_font_tint"}),t._v(" "),e("div",{staticClass:"tiptitle theme_font_gray"},[t._v("没有券？"),e("br"),e("span",{staticClass:"theme_font_tint"},[t._v("去领券中心看看吧")])]),t._v(" "),e("div",{staticClass:"look theme_font_gray theme_border_light_i",on:{click:t.moreCoupon}},[t._v("去看看")])])]):t._e()],1)])],1)}),[],!1,null,"ec5e7b00",null);o.default=i.exports},P9ZV:function(t,o,e){},v3Gx:function(t,o,e){"use strict";var n=e("P9ZV");e.n(n).a}}]);
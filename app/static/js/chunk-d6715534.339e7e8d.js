(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d6715534"],{4944:function(t,o,s){"use strict";s("f29b")},9253:function(t,o,s){"use strict";s.r(o);var a=function(){var t=this,o=t.$createElement,s=t._self._c||o;return s("div",{staticClass:"container"},[s("nav-top",{on:{backEvent:function(o){return t.$router.go(-1)}}}),s("nav-content",[s("van-list",{staticClass:"coupon-list",attrs:{finished:t.finished,offset:200,"finished-text":"没有更多了"},on:{load:t.loadMore},model:{value:t.loading,callback:function(o){t.loading=o},expression:"loading"}},t._l(t.couponList,(function(o,a){return s("div",{key:a,staticClass:"coupon-item",on:{click:function(s){return t.tocouponDetail(o)}}},[1===o.userType?s("div",{staticClass:"userType"},[t._v("个人")]):2===o.userType?s("div",{staticClass:"userType"},[t._v("机构")]):t._e(),s("coupon-detail",{attrs:{item:o}})],1)})),0)],1),s("van-popup",{staticClass:"used-coupon-modal",attrs:{"get-container":t.getContainer},model:{value:t.popupVisible,callback:function(o){t.popupVisible=o},expression:"popupVisible"}},[s("p",{staticClass:"pop_top"},[t._v("已使用电子券详情")]),s("p",{staticClass:"pop_you"},[s("span",{staticClass:"label"},[t._v("核销网点：")]),t._v(" "+t._s(t.stationinfo.usedStationName)+" ")]),s("p",{staticClass:"pop_time"},[s("span",{staticClass:"label"},[t._v("使用时间：")]),t._v(" "+t._s(t.stationinfo.usedTime)+" ")]),s("p",{staticClass:"pop_num"},[s("span",{staticClass:"label"},[t._v("交易流水号：")]),t._v(" "+t._s(t.stationinfo.orderNo)+" ")]),s("p",{staticClass:"pop_num"},[s("span",{staticClass:"label"},[t._v("券号：")]),t._v(" "+t._s(t.stationinfo.couNo)+" ")]),s("p",{staticClass:"pop_num"},[s("span",{staticClass:"label"},[t._v("券动态码：")]),t._v(" "+t._s(t.stationinfo.couCheckCode)+" ")]),s("canvas",{staticClass:"qrcode-content",attrs:{id:"coupon-qrcode"}})])],1)},n=[],e=(s("da3c"),s("0b33")),i=(s("bda7"),s("5e46")),c=(s("8a58"),s("e41f")),p=s("d055"),u=s.n(p),d=s("1379"),l={components:{CouponDetail:d["a"],VanPopup:c["a"],VanTabs:i["a"],VanTab:e["a"]},data:function(){return{hasMechan:!1,stationCode:"",couponList:[],popupVisible:!1,stationinfo:{},userType:"",hasMore:!0,pageInfo:{page:0,rows:10},loading:!1,finished:!1}},mounted:function(){this.stationCode=this.$route.query.stationCode,this.userType=this.$route.query.userType},methods:{tocouponDetail:function(t){var o=this;this.popupVisible=!0,this.$http.post("/app/json/user_coupon/getCouDistUsedUserInfo",{couNo:t.couNo}).then((function(t){if(o.stationinfo=t.data.data,!t.data.data.couCheckCode)return o.$Toast("编码为空，无法展示二维码"),!1;u.a.toCanvas(document.getElementById("coupon-qrcode"),t.data.data.couCheckCode,{margin:1,width:170})}))["catch"]((function(t){o.$Toast(t)}))},dofindUsedCoupons:function(){var t=this;this.$http.post("/app/json/user_coupon/findUsedCoupons",this.pageInfo).then((function(o){t.loading=!1;var s=o.data;0==s.status?s.data instanceof Array&&s.data.length>0?(t.couponList.push.apply(t.couponList,s.data),t.couponList.length>=s.totalRecords&&(t.finished=!0)):t.finished=!0:(t.finished=!0,t.$Toast(s.info))}))["catch"]((function(o){t.finished=!0,t.$Toast(o)}))},getContainer:function(){return document.getElementsByTagName("body")[0]},loadMore:function(){this.pageInfo.page++,this.dofindUsedCoupons()}}},r=l,f=(s("4944"),s("0c7c")),h=Object(f["a"])(r,a,n,!1,null,"a915a142",null);o["default"]=h.exports},f29b:function(t,o,s){}}]);
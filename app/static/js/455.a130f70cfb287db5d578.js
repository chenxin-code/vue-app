(window.webpackJsonp=window.webpackJsonp||[]).push([[455],{"4mM8":function(t,n,i){t.exports=i.p+"static/img/bg3.83940e0.png"},MCVD:function(t,n,i){"use strict";i.r(n);var s={data:function(){return{show:!0,type:1,infoData:{}}},methods:{backEvent:function(){this.$router.replace("/service_list")},changeEq:function(t){this.type=t},submit:function(){var t={path:"/rights_use",query:{memberEquityTypeCode:this.infoData.equityType,equityId:this.infoData.id,equityName:this.infoData.equityName}};this.$router.push(t)}},created:function(){this.infoData=JSON.parse(window.localStorage.getItem("eqItem"))||{}},computed:{headImg:function(){return this.$store.state.userInfo.avtUrl},bgImg:function(){return 51008==(JSON.parse(window.localStorage.getItem("eqItem"))||{}).equityType?i("PCiY"):i("4mM8")}}},e=(i("s79+"),i("KHd+")),a=Object(e.a)(s,(function(){var t=this,n=t.$createElement,i=t._self._c||n;return i("div",[i("nav-top",{attrs:{noTitle:!0,bgImg:t.bgImg},on:{backEvent:t.backEvent}},[i("div",{staticClass:"account"},[i("div",{staticClass:"unit br",on:{click:function(n){return t.changeEq(1)}}},[i("span",{staticClass:"icon"}),t._v(" "),i("span",{staticClass:"tit",class:{cur:1==t.type}},[t._v("使用指南")])]),t._v(" "),i("div",{staticClass:"unit",on:{click:function(n){return t.changeEq(2)}}},[i("span",{staticClass:"icon ser"}),t._v(" "),i("span",{staticClass:"tit",class:{cur:2==t.type}},[t._v("权益介绍")])])])]),t._v(" "),i("nav-content",[i("div",{staticClass:"content",domProps:{innerHTML:t._s(1==t.type?t.infoData.equityDes:t.infoData.instructions)}}),t._v(" "),i("div",{staticClass:"btns"},[i("van-button",{staticClass:"use-btn",attrs:{type:"primary",round:"",color:"#F02C2D",block:""},on:{click:t.submit}},[t._v("立即使用")])],1)])],1)}),[],!1,null,"e6f9694c",null);n.default=a.exports},PCiY:function(t,n,i){t.exports=i.p+"static/img/bg2.c2e083f.png"},fP2k:function(t,n,i){},"s79+":function(t,n,i){"use strict";var s=i("fP2k");i.n(s).a}}]);
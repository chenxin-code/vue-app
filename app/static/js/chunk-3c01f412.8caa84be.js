(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3c01f412"],{c033:function(t,e,a){},ce6a:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"about-us"},[a("nav-top",{on:{backEvent:t.backEvent}}),a("nav-content",[a("div",{staticClass:"logo-cname mine-box-shodow"},[a("img",{staticClass:"logo-img",attrs:{src:t.$store.state.globalConfig.nameLogo,alt:""}})]),a("div",{staticClass:"about-content mine-box-shodow"},[a("div",{staticClass:"inner-content"},[t.customerService&&""!=t.customerService?a("div",{staticClass:"public-bar padding-lr border-bottom"},[a("span",{staticClass:"left-text"},[t._v("客服电话")]),a("span",{staticClass:"left-text"},[a("a",{staticClass:"theme_font_red_i",attrs:{href:"tel:"+t.customerService}},[t._v(t._s(t.customerService))])])]):t._e(),t.merchantPhone&&""!=t.merchantPhone?a("div",{staticClass:"public-bar  padding-lr border-bottom"},[a("span",{staticClass:"left-text"},[t._v("商户合作电话")]),a("span",{staticClass:"left-text "},[a("a",{staticClass:"theme_font_red_i",attrs:{href:"tel:"+t.merchantPhone}},[t._v(t._s(t.merchantPhone))])])]):t._e(),t.merchantEmail&&""!=t.merchantEmail?a("div",{staticClass:"public-bar padding-lr  border-bottom"},[a("span",{staticClass:"left-text"},[t._v("商户合作邮箱")]),a("span",{staticClass:"left-text theme_font_red"},[t._v(t._s(t.merchantEmail))])]):t._e(),t.technicalSupport&&""!=t.technicalSupport?a("div",{staticClass:"public-bar padding-lr border-bottom",on:{mousedown:t.touchstart,touchstart:t.touchstart,mouseup:t.touchend,touchend:t.touchend}},[a("span",{staticClass:"left-text"},[t._v("技术支持")]),a("span",{staticClass:"left-text theme_font_red"},[t._v(t._s(t.technicalSupport))])]):t._e()])])])],1)},o=[],c={name:"about-us",components:{},data:function(){return{customerService:this.$store.state.globalConfig.customerService,merchantPhone:this.$store.state.globalConfig.merchantPhone,merchantEmail:this.$store.state.globalConfig.merchantEmail,technicalSupport:this.$store.state.globalConfig.technicalSupport,touchstartTime:null}},methods:{backEvent:function(){this.$router.go(-1)},touchstart:function(){this.touchstartTime=this.$util.getDataString()},touchend:function(){var t=this.$util.getDataString();t-this.touchstartTime>3e3&&this.$router.push({path:"/logs"})}},created:function(){}},n=c,i=(a("d4ac"),a("0c7c")),r=Object(i["a"])(n,s,o,!1,null,"57e2fce2",null);e["default"]=r.exports},d4ac:function(t,e,a){"use strict";a("c033")}}]);
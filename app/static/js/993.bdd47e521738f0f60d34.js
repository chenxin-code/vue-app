(window.webpackJsonp=window.webpackJsonp||[]).push([[993],{"/xDd":function(t,e,n){},SVeU:function(t,e,n){"use strict";var s=n("/xDd");n.n(s).a},dQro:function(t,e,n){"use strict";n.r(e);var s=(n("SVeU"),n("KHd+")),o=Object(s.a)({components:{},data:function(){return{qrcode:""}},methods:{backEvent:function(){this.$router.go(-1)},getCode:function(){var t=this;this.$request.post("/app/json/user/queryQrcode").then((function(e){0===e.status?t.$request.post("/app/json/we_chat/getwxacodeunlimit",{path:"pages/common/home/index",scene:"rfrCode="+e.data,width:430}).then((function(e){0===e.status?t.qrcode="data:image/png;base64,"+e.data:t.$Toast(e.info||"获取小程序码失败")}),(function(t){})):t.$Toast(e.info)}))}},destroyed:function(){},mounted:function(){},created:function(){this.getCode()}},(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"qrcode-container"},[e("nav-top",{on:{backEvent:this.backEvent}}),this._v(" "),e("nav-content",[e("div",{staticClass:"qrcode-wrapper"},[e("img",{staticClass:"qrcode",attrs:{src:this.qrcode,alt:""}})]),this._v(" "),e("div",{staticClass:"code"},[this._v("会员编码："+this._s(this.$store.state.userInfo.userId))])])],1)}),[],!1,null,"191dcbec",null);e.default=o.exports}}]);
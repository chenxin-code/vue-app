(window.webpackJsonp=window.webpackJsonp||[]).push([[743],{"48UI":function(t,e,n){},"Byo/":function(t,e,n){"use strict";var s=n("48UI");n.n(s).a},JLTc:function(t,e,n){"use strict";n.r(e);var s={name:"mine-has-recommed",components:{},data:function(){return{tab:[]}},methods:{backEvent:function(){this.$router.go(-1)},getListData:function(t){var e=this;this.$Loading.open();var n={token:this.$store.state.login.token,refererType:t,page:1,rows:10};this.$http.post("/app/json/user/getMyReferUserList",n).then((function(t){e.$Loading.close();var n=t.data;0==n.status?e.tab=n.data?n.data.regUserInfoList:[]:e.$Toast(n.info)}),(function(t){e.$Loading.close(),console.log("获取消息列表",t)}))}},created:function(){var t=this.$route.query.refererType;this.getListData(t)}},a=(n("Byo/"),n("KHd+")),o=Object(a.a)(s,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"mine-has-recommed"},[n("nav-top",{on:{backEvent:t.backEvent}}),t._v(" "),n("nav-content",[n("div",{staticClass:"msg-list"},t._l(t.tab,(function(e,s){return n("div",{key:s,staticClass:"msg-item"},[n("p",[t._v("会员编号: "+t._s(e.userId))]),t._v(" "),n("p",[t._v("手机号码: "+t._s(e.phone))]),t._v(" "),n("p",[t._v("注册时间: "+t._s(e.regDate))])])})),0)])],1)}),[],!1,null,"91bc5a68",null);e.default=o.exports}}]);
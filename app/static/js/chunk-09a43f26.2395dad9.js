(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-09a43f26"],{"24b4":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"mine-has-recommed"},[n("nav-top",{on:{backEvent:t.backEvent}}),n("nav-content",[n("div",{staticClass:"msg-list"},t._l(t.tab,(function(e,a){return n("div",{key:a,staticClass:"msg-item"},[n("p",[t._v("会员编号: "+t._s(e.userId))]),n("p",[t._v("手机号码: "+t._s(e.phone))]),n("p",[t._v("注册时间: "+t._s(e.regDate))])])})),0)])],1)},s=[],o={name:"mine-has-recommed",components:{},data:function(){return{tab:[]}},methods:{backEvent:function(){this.$router.go(-1)},getListData:function(t){var e=this;this.$Loading.open();var n="/app/json/user/getMyReferUserList",a={token:this.$store.state.login.token,refererType:t,page:1,rows:10};this.$http.post(n,a).then((function(t){e.$Loading.close();var n=t.data;0==n.status?e.tab=n.data?n.data.regUserInfoList:[]:e.$Toast(n.info)}),(function(t){e.$Loading.close()}))}},created:function(){var t=this.$route.query.refererType;this.getListData(t)}},i=o,r=(n("f27a"),n("0c7c")),c=Object(r["a"])(i,a,s,!1,null,"44df9fd6",null);e["default"]=c.exports},"51af":function(t,e,n){},f27a:function(t,e,n){"use strict";n("51af")}}]);
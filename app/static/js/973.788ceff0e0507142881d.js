(window.webpackJsonp=window.webpackJsonp||[]).push([[973],{IJrk:function(t,e,i){},UtAt:function(t,e,i){"use strict";var a=i("IJrk");i.n(a).a},o9rr:function(t,e,i){"use strict";i.r(e);var a=i("ygAv"),n={data:function(){return{list:[],loading:!1,finished:!1,page:0,type:""}},mounted:function(){},methods:{loadMore:function(){var t=this;this.page=this.page+1;var e={token:this.$store.state.login.token,page:{index:this.page,pageSize:20}};this.$http.post("/app/json/app_package_refuel/queryMyInviteList",e).then((function(e){var i=e.data;0==i.status?(t.list=t.list.concat(i.data||[]),t.list.length>=i.totalRecords&&(t.finished=!0)):(t.finished=!0,t.$Toast(i.info?i.info:"获取列表失败")),t.loading=!1}))},timeJudge:function(t){var e=a.a.getMyDate(new Date),i=new Date(t),n=new Date(i.getTime()+2592e5);return a.a.dateCompare(e,a.a.getPreTime(n.getTime()).split(" ")[0])},dealState:function(t,e,i){return"WAIT_SIGN_UP"==t?(this.type=this.timeJudge(e.split(" ")[0]),-1!=this.type?"邀约中":"邀约失败"):"SIGNED_UP"==t?"邀约成功":void 0},openDetails:function(t){this.$router.push({path:"/invitation-details",query:{id:t.packageRefuelOrderId,startDate:t.startDate}})},dealTime:function(t){return t}},components:{}},s=(i("UtAt"),i("KHd+")),o=Object(s.a)(n,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"my-invitation"},[i("nav-top",{attrs:{title:"我的邀约"},on:{backEvent:function(e){return t.$router.go(-1)}}}),t._v(" "),i("nav-content",{staticClass:"my-invitation-container"},[i("ul",{staticClass:"list"},[i("van-list",{attrs:{finished:t.finished,"finished-text":"没有更多了"},on:{load:t.loadMore},model:{value:t.loading,callback:function(e){t.loading=e},expression:"loading"}},t._l(t.list,(function(e,a){return i("li",{key:a,staticClass:"item",on:{click:function(i){return t.openDetails(e)}}},[i("div",{staticClass:"time"},[t._v(t._s(e.createTime))]),t._v(" "),i("div",{staticClass:"info"},[i("div",{staticClass:"title"},[t._v(t._s(e.packageRefuelName)+"  "+t._s(e.duration)+"天")]),t._v(" "),i("div",{staticClass:"text"},[t._v("开通时间："+t._s(t.dealTime(e.startDate)))]),t._v(" "),i("div",{staticClass:"text"},[t._v("到期时间："+t._s(t.dealTime(e.endDate)))]),t._v(" "),i("div",{staticClass:"text"},[t._v("邀约状态："+t._s(t.dealState(e.state,e.startDate,e.endDate)))]),t._v(" "),-1==t.type&&e.signUpNum>e.joinNum+1?i("div",{staticClass:"text"},[t._v("失败原因：成员不足")]):t._e(),t._v(" "),-1==t.type&&e.signUpNum<e.joinNum+1?i("div",{staticClass:"text"},[t._v("失败原因：未确认开通")]):t._e()])])})),0)],1)])],1)}),[],!1,null,"096b6902",null);e.default=o.exports}}]);
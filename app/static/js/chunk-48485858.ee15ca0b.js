(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-48485858"],{"0b21":function(t,e,i){},a3da:function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"my-invitation"},[i("nav-top",{attrs:{title:"我的邀约"},on:{backEvent:function(e){return t.$router.go(-1)}}}),i("nav-content",{staticClass:"my-invitation-container"},[i("ul",{staticClass:"list"},[i("van-list",{attrs:{finished:t.finished,"finished-text":"没有更多了"},on:{load:t.loadMore},model:{value:t.loading,callback:function(e){t.loading=e},expression:"loading"}},t._l(t.list,(function(e,a){return i("li",{key:a,staticClass:"item",on:{click:function(i){return t.openDetails(e)}}},[i("div",{staticClass:"time"},[t._v(t._s(e.createTime))]),i("div",{staticClass:"info"},[i("div",{staticClass:"title"},[t._v(t._s(e.packageRefuelName)+"  "+t._s(e.duration)+"天")]),i("div",{staticClass:"text"},[t._v("开通时间："+t._s(t.dealTime(e.startDate)))]),i("div",{staticClass:"text"},[t._v("到期时间："+t._s(t.dealTime(e.endDate)))]),i("div",{staticClass:"text"},[t._v("邀约状态："+t._s(t.dealState(e.state,e.startDate,e.endDate)))]),-1==t.type&&e.signUpNum>e.joinNum+1?i("div",{staticClass:"text"},[t._v("失败原因：成员不足")]):t._e(),-1==t.type&&e.signUpNum<e.joinNum+1?i("div",{staticClass:"text"},[t._v("失败原因：未确认开通")]):t._e()])])})),0)],1)])],1)},n=[],s=(i("99af"),i("0d03"),i("ac1f"),i("1276"),i("ca00")),o={data:function(){return{list:[],loading:!1,finished:!1,page:0,type:""}},mounted:function(){},methods:{loadMore:function(){var t=this;this.page=this.page+1;var e={token:this.$store.state.login.token,page:{index:this.page,pageSize:20}};this.$http.post("/app/json/app_package_refuel/queryMyInviteList",e).then((function(e){var i=e.data;0==i.status?(t.list=t.list.concat(i.data||[]),t.list.length>=i.totalRecords&&(t.finished=!0)):(t.finished=!0,t.$Toast(i.info?i.info:"获取列表失败")),t.loading=!1}))},timeJudge:function(t){var e=s["a"].getMyDate(new Date),i=new Date(t),a=new Date(i.getTime()+2592e5);return s["a"].dateCompare(e,s["a"].getPreTime(a.getTime()).split(" ")[0])},dealState:function(t,e,i){return"WAIT_SIGN_UP"==t?(this.type=this.timeJudge(e.split(" ")[0]),-1!=this.type?"邀约中":"邀约失败"):"SIGNED_UP"==t?"邀约成功":void 0},openDetails:function(t){this.$router.push({path:"/invitation-details",query:{id:t.packageRefuelOrderId,startDate:t.startDate}})},dealTime:function(t){return t}},components:{}},l=o,c=(i("b67fb"),i("0c7c")),d=Object(c["a"])(l,a,n,!1,null,"12a7141b",null);e["default"]=d.exports},b67fb:function(t,e,i){"use strict";i("0b21")}}]);
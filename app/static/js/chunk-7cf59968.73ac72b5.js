(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7cf59968"],{"8dfd":function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"pay-settings"},[s("nav-top",{attrs:{title:"活动列表"},on:{backEvent:function(e){return t.$router.go(-1)}}}),s("nav-content",{staticClass:"pay-setting"},[s("div",{staticClass:"pay-box"},[s("ul",{staticClass:"prize-list"},t._l(t.prizeList,(function(e,i){return s("li",{key:i,staticClass:"prize-item",on:{click:function(s){return t.openDetails(e)}}},[s("div",{staticClass:"time"},[s("span",{staticClass:"text theme_font_black"},[t._v(t._s(e.activityTitle))])]),s("div",{staticClass:"content"},[s("div",{staticClass:"title theme_font_gray"},[t._v("活动时间："+t._s(e.startDate)+"-"+t._s(e.endDate))]),s("div",{staticClass:"title theme_font_gray"},[t._v("活动内容："+t._s(e.activityDesc))])])])})),0)])])],1)},a=[],n=s("76a0"),c={name:"",data:function(){return{prizeList:[]}},created:function(){},mounted:function(){this.loadMore()},methods:{openDetails:function(t){this.$router.push({path:"/usercenter/activitydetails",query:{item:t}})},loadMore:function(){var t=this,e={token:this.$store.state.login.token};this.$http.post("/app/json/app_market/queryCanAttendActivity",e).then((function(e){var s=e.data;0==s.status&&(t.prizeList=s.data)}))}},computed:{},components:{Cell:n["Cell"]}},o=c,r=(s("a60e"),s("0c7c")),l=Object(r["a"])(o,i,a,!1,null,"543b1b8e",null);e["default"]=l.exports},a60e:function(t,e,s){"use strict";s("f76f")},f76f:function(t,e,s){}}]);
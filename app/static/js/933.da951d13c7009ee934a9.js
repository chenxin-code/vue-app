(window.webpackJsonp=window.webpackJsonp||[]).push([[933],{eJu1:function(t,e,s){"use strict";var n=s("kMrc");s.n(n).a},kMrc:function(t,e,s){},seSy:function(t,e,s){"use strict";s.r(e);var n=(s("eJu1"),s("KHd+")),i=Object(n.a)({data:function(){return{newsList:[],title:"",source:"",values:""}},mounted:function(){this.title=this.$route.query.title,this.source=this.$route.query.source,1==this.source?(this.values="27",this.showagreement()):2==this.source&&(this.values="29",this.showagreement())},methods:{showagreement:function(){var t=this;this.$request.post("/app/json/news/getNewsList",{values:this.values}).then((function(e){0==e.status&&(t.newsList=e.data)}))}},components:{}},(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"problems"},[s("nav-top",{attrs:{title:t.title},on:{backEvent:function(e){return t.$router.go(-1)}}}),t._v(" "),s("nav-content",{staticClass:"problems-container"},t._l(t.newsList,(function(e,n){return s("div",{key:n,staticClass:"content",domProps:{innerHTML:t._s(e.content)}})})),0)],1)}),[],!1,null,"7ee2bcc6",null);e.default=i.exports}}]);
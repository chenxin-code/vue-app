(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-8fad9c64"],{"297d":function(t,i,n){},"47de":function(t,i,n){"use strict";var e=function(){var t=this,i=t.$createElement,n=t._self._c||i;return n("div",{staticClass:"search-wrapper"},[n("van-search",{attrs:{"show-action":"",placeholder:"请输入搜索关键词"},model:{value:t.value,callback:function(i){t.value=i},expression:"value"}},[n("div",{attrs:{slot:"action"},on:{click:t.onSearch},slot:"action"},[t._v("搜索")])]),n("van-popup",{style:{height:"30%"},attrs:{closeable:"",position:"top",duration:0,"get-container":".search-wrapper"},model:{value:t.show,callback:function(i){t.show=i},expression:"show"}},[n("div",{staticClass:"list"},[n("van-list",{attrs:{finished:t.finished,"finished-text":"没有更多了"},on:{load:t.onLoad},model:{value:t.loading,callback:function(i){t.loading=i},expression:"loading"}},t._l(t.list,(function(i){return n("van-cell",{key:i.id,attrs:{title:i.title},on:{click:function(n){return t.detailHandle(i.id)}}})})),1)],1)])],1)},s=[],a=(n("99af"),{name:"list",data:function(){return{value:"",list:[],loading:!0,finished:!1,page:0,show:!1}},watch:{list:function(t){}},mounted:function(){},methods:{onSearch:function(){this.list=[],this.loading=!0,this.finished=!1,this.show=!0,this.page=0,this.onLoad()},detailHandle:function(t){this.$router.push("/user_center/question_detail?id="+t)},onLoad:function(){var t=this;this.loading=!0,this.page++,this.$request.post("/app/jqGrid/question/list",{rows:20,page:this.page,title:this.value}).then((function(i){t.pageInitShow=!0,t.loading=!1,0===i.status?(t.list=t.list.concat(i.rows||[]),t.list.length>=i.records&&(t.finished=!0)):t.finished=!0}))}},components:{}}),o=a,l=(n("5d2c"),n("0c7c")),c=Object(l["a"])(o,e,s,!1,null,"1e578fd8",null);i["a"]=c.exports},"55fa":function(t,i,n){"use strict";n.r(i);var e=function(){var t=this,i=t.$createElement,n=t._self._c||i;return n("div",{staticClass:"question-list"},[n("nav-top",{attrs:{title:"问题列表"},on:{backEvent:function(i){return t.$router.go(-1)}}}),n("nav-content",{staticClass:"question-list-con"},[n("div",{staticClass:"search-container"},[n("Search")],1),n("div",{staticClass:"list"},[n("van-panel",{attrs:{title:"常见问题"}},[t._l(t.list,(function(i){return n("van-cell",{key:i.id,attrs:{title:i.title},on:{click:function(n){return t.detailHandle(i.id)}}})})),n("van-cell",{staticClass:"more",attrs:{title:"查看更多问题"},on:{click:t.moreHandle}})],2)],1)])],1)},s=[],a=(n("99af"),n("47de")),o={name:"list",data:function(){return{list:[],loading:!0,finished:!1,page:0}},mounted:function(){this.onLoad()},methods:{detailHandle:function(t){this.$router.push("/user_center/question_detail?id="+t)},onLoad:function(){var t=this;this.loading=!0,this.page++,this.$request.post("/app/jqGrid/question/list",{rows:10,page:this.page,title:this.value}).then((function(i){t.pageInitShow=!0,t.loading=!1,0===i.status?(t.list=t.list.concat(i.rows||[]),t.list.length>=i.records&&(t.finished=!0)):t.finished=!0}))},moreHandle:function(){this.$router.push("/user_center/question_category")}},components:{Search:a["a"]}},l=o,c=(n("a981"),n("0c7c")),r=Object(c["a"])(l,e,s,!1,null,"73a0a63c",null);i["default"]=r.exports},"5d2c":function(t,i,n){"use strict";n("297d")},a981:function(t,i,n){"use strict";n("f623")},f623:function(t,i,n){}}]);
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-50178b76"],{5294:function(t,e,n){t.exports=n.p+"static/images/e4222cc7f252bc0f5bdcce35c39aeee5.png"},8865:function(t,e,n){"use strict";n.r(e);var s=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"density-free-set"},[s("nav-top",{attrs:{title:"小额免密"},on:{backEvent:function(e){return t.$router.go(-1)}}}),s("nav-content",[s("div",{staticClass:"density-free"},[s("div",{staticClass:"img"},[s("img",{attrs:{src:n("5294"),alt:""}})]),s("div",{staticClass:"tips"},[t._v("您已开启小额免密")]),s("ul",{staticClass:"pay-list"},[s("li",{staticClass:"pay-item",on:{click:t.openPwdSet}},[s("mt-cell",{attrs:{title:t.freePayAmount+"元/笔",label:"支付金额≤"+t.freePayAmount+"/笔时无需输入密码","is-link":""}})],1)]),s("div",{staticClass:"btn theme_bg_red_i",on:{click:t.openDensitySet}},[t._v("关闭小额免密")])])])],1)},a=[],o=n("ade3"),i=(n("e17f"),n("2241")),c=(n("b0c0"),n("76a0")),r={name:"",data:function(){return{freePayAmount:"",showBook:!1}},created:function(){},mounted:function(){this.freePayAmount=this.$route.query.freePayAmount},methods:{openBook:function(){this.showBook=!0},openPwdSet:function(){this.$router.push({path:"/usercenter/changefreenum",query:{freePayAmount:this.freePayAmount}})},openDensitySet:function(){var t=this;this.$Loading.open();var e={token:this.$store.state.login.token};this.$http.post("/app/json/user/closeFreePay",e).then((function(e){var n=e.data;0==n.status&&i["a"].alert({title:"提示",message:"已关闭免密"}).then((function(){t.$route.query.payset})),t.$Loading.close()}))}},computed:{},components:Object(o["a"])({Cell:c["Cell"]},i["a"].name,i["a"])},u=r,l=(n("a0e9"),n("0c7c")),f=Object(l["a"])(u,s,a,!1,null,"171646dd",null);e["default"]=f.exports},a0e9:function(t,e,n){"use strict";n("e889")},e889:function(t,e,n){}}]);
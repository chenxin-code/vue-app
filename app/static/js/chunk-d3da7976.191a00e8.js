(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d3da7976"],{"7b72":function(t,a,s){},"8cb7":function(t,a,s){"use strict";s("7b72")},f3b7:function(t,a,s){"use strict";s.r(a);var i=function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"card-binding-index"},[s("nav-top",{attrs:{title:"外省卡绑卡详情"},on:{backEvent:function(a){return t.$router.go(-1)}}}),s("nav-content",{staticClass:"card-binding-content"},[s("div",{staticClass:"card-binding"},[s("div",{staticClass:"card-information card-status"},[s("div",{staticClass:"table-view"},[s("div",{staticClass:"table-view-cell"},[s("div",{staticClass:"table-view-cell-text"},[s("div",{staticClass:"left"},[t._v("审核状态：")]),s("div",{staticClass:"right"},[t._v(" "+t._s(2==t.recordsState?"审核中":1==t.recordsState?"审核成功":"审核失败")+" ")])])]),s("div",{staticClass:"table-view-cell"},[s("div",{staticClass:"table-view-cell-text"},[s("div",{staticClass:"left"},[t._v("申请时间：")]),s("div",{staticClass:"right"},[t._v(t._s(t.bindingData.createTime))])])]),0==t.recordsState?s("div",{staticClass:"table-view-cell"},[s("div",{staticClass:"table-view-cell-text"},[s("div",{staticClass:"left"},[t._v("审核失败原因：")]),s("div",{staticClass:"right"},[t._v(t._s(t.bindingData.approvalMessage))])])]):t._e()])]),s("div",{staticClass:"card-information card-status"},[s("div",{staticClass:"table-view"},[s("div",{staticClass:"table-view-cell"},[s("div",{staticClass:"table-view-cell-text"},[s("div",{staticClass:"left"},[t._v("外省卡卡号：")]),s("div",{staticClass:"right"},[t._v(" "+t._s(t.bindingData.cardNo)+" ")])])])])])])])],1)},e=[],c={data:function(){return{bindingData:{},recordsState:""}},mounted:function(){this.bindingData=this.$route.query.cardInfo?JSON.parse(this.$route.query.cardInfo):{},this.recordsState=this.$route.query.recordState},methods:{}},l=c,n=(s("8cb7"),s("0c7c")),d=Object(n["a"])(l,i,e,!1,null,"2ab7c6e3",null);a["default"]=d.exports}}]);
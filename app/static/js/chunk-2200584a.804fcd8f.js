(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2200584a"],{"6ef4":function(t,s,a){"use strict";a("88da")},"88da":function(t,s,a){},"9d44":function(t,s,a){"use strict";var i="/app/json/car_insure/applyInsure",e="/app/json/car_insure/myApplyInsure";s["a"]={methods:{commitData:function(t){return this.$http.post(i,t)},offerlistData:function(t){return this.$http.post(e,t)}}}},e9be:function(t,s,a){"use strict";a.r(s);var i=function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"body"},[a("nav-top",{attrs:{title:"我的报价单"},on:{backEvent:function(s){return t.$router.go(-1)}}}),a("nav-content",[a("div",[t._l(t.list,(function(s,i){return t.list.length>0?a("div",{key:i,staticClass:"listView"},[a("p",[t._v(t._s(s.createTime))]),a("div",{staticClass:"publicInvoice"},[a("div",{staticClass:"div1"},[a("span",[t._v("车牌号："+t._s(s.licenseNo))]),a("span",{staticClass:"red"},[t._v(t._s(s.stateStr))])]),a("div",{staticClass:"div1"},[a("span",[t._v("申请单号")]),a("span",[t._v(t._s(s.tradeNo))])]),a("div",{staticClass:"div1"},[a("span",[t._v("申请人")]),a("span",[t._v(t._s(s.carOwnerSurname))])]),a("div",{staticClass:"div1"},[a("span",[t._v("手机号")]),a("span",[t._v(t._s(s.carOwnerPhone))])]),a("div",{staticClass:"div1"},[a("span",[t._v("车架号")]),a("span",[t._v(t._s(s.frameNo))])]),a("div",{staticClass:"div1"},[a("span",[t._v("发动机号")]),a("span",[t._v(t._s(s.engineNo))])])])]):t._e()})),a("div",{directives:[{name:"show",rawName:"v-show",value:t.titleView,expression:"titleView"}]},[0==t.list.length?a("div",{staticClass:"publicInvoice public"},[a("div",{staticClass:"emptyDiv"},[a("img",{attrs:{src:"static/image/microShop/baojia2.png",alt:""}}),a("span",[t._v("您还没有报价单！")])])]):t._e()])],2)])],1)},e=[],n=(a("e7e5"),a("d399")),c=a("9d44"),r={name:"offerList",mixins:[c["a"]],data:function(){return{titleView:!1,list:[]}},created:function(){this.detailData()},methods:{detailData:function(){var t=this,s={token:t.$store.state.login.token};t.offerlistData(s).then((function(s){"success"===s.data.result?(t.titleView=!0,t.list=s.data.data||[]):Object(n["a"])(s.data.info)}))}}},o=r,l=(a("6ef4"),a("0c7c")),v=Object(l["a"])(o,i,e,!1,null,"178400e0",null);s["default"]=v.exports}}]);
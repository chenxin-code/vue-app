(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-71ab3996"],{"21c9":function(t,a,s){"use strict";s.r(a);var i=function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{attrs:{id:"oilMoneyss"}},[s("mt-header",{attrs:{title:"加油卡充值"}},[s("mt-button",{attrs:{slot:"left",icon:"back"},on:{click:t.backEvent},slot:"left"})],1),t.pageShow?s("div",{staticClass:"conter"},[s("div",{staticClass:"chongtop "},[s("p",[t._v("个人卡(主)")]),s("p",[t._v("卡号 "),s("span",{staticClass:"fl-right"},[t._v(t._s(t.cardnumber)+"  ")])]),s("p",[t._v("联系电话 "),s("span",{staticClass:"fl-right"},[t._v(t._s(t.cardphone)+"  ")])])]),s("div",{staticClass:"chongbottom"},[s("p",{staticClass:"zhiftext"},[t._v("支付方式")]),s("ul",{staticClass:"mode"},t._l(t.zhilist,(function(a,i){return s("li",{key:i,class:{bordercolor:t.indexs===i},on:{click:function(s){return t.tableqie(i,a)}}},[t._v(t._s(a.text)+" ")])})),0),s("p",{staticClass:"chongmode"},[t._v("您选择了"+t._s(t.zhifufang)),s("br"),t._v("请点击确定充值")])]),s("p",{staticClass:"btn",on:{click:t.renders}},[t._v("确定充值")])]):t._e(),t.pageShow&&t.isshowcard?s("div",{staticClass:"modal"},[s("div",{staticClass:"modal-boxs"},[s("router-link",{attrs:{to:"/addCard"}},[s("p",[t._v("请选择充值卡号")])]),s("ul",t._l(t.list,(function(a,i){return s("li",{key:i,on:{click:function(s){return t.choice(a.cardno,i)}}},[t._v(t._s(a.cardno)+" "),s("span",{staticClass:"fl-right"},[t._v("选择")]),t._v("    ")])})),0)],1)]):t._e(),t.pageShow&&t.isshowcards?s("div",{staticClass:"modal"},[s("div",{staticClass:"modal-boxs"},[s("p",[t._v("主卡卡号     "+t._s(t.cardnumber))]),s("p",[t._v("用户姓名    "+t._s(t.cardname))]),s("p",[t._v("手机号码     "+t._s(t.cardphone))]),s("p",[t._v("支付方式     "+t._s(t.zhifufang))]),s("div",[s("span",{on:{click:t.renders}},[t._v("取消")]),s("span",{staticClass:"fl-right",on:{click:t.confirmpayment}},[t._v("确定")])])])]):t._e()],1)},n=[],c=(s("ac1f"),s("5319"),s("6461")),e={data:function(){return{list:"",cardnumber:"",cardphone:"",cardname:"",pageShow:!1,isshowcard:!1,isshowcards:!1,zhifufang:"",bordercolor:"bordercolor",indexs:0,zhilist:"",zhifudizhi:""}},created:function(){this.render()},methods:{backEvent:function(){this.$router.go(-1)},replace:function(){this.isshowcard=!this.isshowcard},choice:function(t,a){this.isshowcard=!this.isshowcard,this.cardnumber=this.list[a].cardno,this.cardphone=this.list[a].reservedphone,this.cardname=this.list[a].cardholder},renders:function(){this.isshowcards=!this.isshowcards},tableqie:function(t,a){this.indexs=t,this.zhifufang=a.text},render:function(){var t=this;this.$Loading.open();var a=this,s="/app/json/card/getCardInfoList";this.$http.post(s,{}).then((function(s){a.$Loading.close();var i=s.data;0==i.status&&(i.data.cardAcctList&&i.data.cardAcctList.length>0?(a.list=s.data.data.cardAcctList,a.cardnumber=s.data.data.cardAcctList[0].cardno,a.cardphone=s.data.data.cardAcctList[0].reservedphone,a.cardname=s.data.data.cardAcctList[0].cardholder,t.rendermode(),t.pageShow=!0):t.$router.replace({path:"/refuelingCard",query:{inway:"replace",lastPath:"/rechargeer"}}))}))},rendermode:function(){var t=this;this.$Loading.open();var a=this,s="/app/json/card/getAppPayTextList";this.$http.post(s,{cardno:this.cardnumber}).then((function(s){a.$Loading.close(),t.zhilist=s.data.data,t.zhifufang=s.data.data[0].text,t.zhifudizhi=s.data.data[0].href}))},rendermode2:function(){var t=this;this.$Loading.open();var a=this,s="/app/json/card/getAppPayTextList";this.$http.post(s,{cardno:this.cardnumber}).then((function(s){a.$Loading.close(),t.zhilist=s.data.data,t.zhifudizhi=s.data.data[t.indexs].href;var i="跳转到银联支付 路径："+t.zhifudizhi+"<br/>";c["a"].addLog(i),t.$bridgefunc.customPush({path:t.zhifudizhi,isnativetop:"1",superback:1})}))},confirmpayment:function(){this.rendermode2()}}},r=e,d=(s("bb4c"),s("e025"),s("0c7c")),o=Object(d["a"])(r,i,n,!1,null,"1e9b4ab9",null);a["default"]=o.exports},"8fa3":function(t,a,s){},bb4c:function(t,a,s){"use strict";s("d649")},d649:function(t,a,s){},e025:function(t,a,s){"use strict";s("8fa3")}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[562],{"1Isw":function(t,a,i){"use strict";var e=i("57Ai");i.n(e).a},"57Ai":function(t,a,i){},"5gvm":function(t,a,i){"use strict";i.r(a),i("5+UC");var e=i("05lO"),s={name:"handle",mixins:[i("Z6Mb").a],data:function(){return{}},mounted:function(){this.loadData()},methods:{loadData:function(){var t=this,a={token:this.$store.state.login.token,id:this.$route.query.id};this.$Loading.open(),this.afterdetailData(a).then((function(a){console.log(a),t.$Loading.close(),a.data.result||Object(e.a)(a.data.info)}))}}},n=(i("1Isw"),i("KHd+")),r=Object(n.a)(s,(function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("div",{staticClass:"body"},[i("nav-top",{attrs:{title:"售后维修"},on:{backEvent:function(a){return t.$router.go(-1)}}}),t._v(" "),i("nav-content",[i("div",{staticClass:"statusBox"},[i("div",[i("img",{attrs:{src:"static/image/microShop/icon_finish.png",alt:""}}),i("span",[t._v("提交成功")])]),t._v(" "),i("p"),t._v(" "),i("div",[i("img",{attrs:{src:"static/image/microShop/icon_finish.png",alt:""}}),i("span",[t._v("售后审核")])]),t._v(" "),i("p"),t._v(" "),i("div",[i("img",{attrs:{src:"static/image/microShop/icon_finish.png",alt:""}}),i("span",[t._v("审批完成")])]),t._v(" "),i("p"),t._v(" "),i("div",[i("img",{attrs:{src:"static/image/microShop/icon_finish.png",alt:""}}),i("span",[t._v("退款完成")])])]),t._v(" "),i("div",{staticClass:"bg"}),t._v(" "),i("div",{staticClass:"box",on:{click:t.chuli}},[i("div",{staticClass:"div2"},[i("img",{attrs:{src:"static/image/microShop/icon_entrance ticket.png",alt:""}}),t._v(" "),i("div",[i("p",[t._v(t._s(t.detailObj.skuName))]),t._v(" "),i("p",[t._v("购买数量："+t._s(t.detailObj.payNumber)+"（张）")])])])]),t._v(" "),i("div",{staticClass:"box box1"},[i("p",[t._v("售后信息")]),t._v(" "),i("div",[i("span",[t._v("售后单号")]),i("span",[t._v(t._s(t.detailObj.returnTradeNo))])]),t._v(" "),i("div",[i("span",[t._v("售后类型")]),i("span",[t._v("申请退票")])]),t._v(" "),i("div",[i("span",[t._v("售后数量")]),i("span",[t._v(t._s(t.detailObj.number))])]),t._v(" "),i("div",[i("span",[t._v("申请时间")]),i("span",[t._v(t._s(t.detailObj.createTime))])])]),t._v(" "),i("div",{staticClass:"box div3"},[i("p",[t._v("申请备注")]),t._v(" "),i("textarea",{directives:[{name:"model",rawName:"v-model",value:t.detailObj.remark,expression:"detailObj.remark"}],attrs:{name:"",id:"",cols:"20",rows:"5",placeholder:"情况有变，临时计划变更！"},domProps:{value:t.detailObj.remark},on:{input:function(a){a.target.composing||t.$set(t.detailObj,"remark",a.target.value)}}})])])],1)}),[],!1,null,"0f5d0294",null);a.default=r.exports},Z6Mb:function(t,a,i){"use strict";a.a={methods:{ticketListData:function(t){return this.$http.post("/app/json/app_travel/queryTicketList",t)},orderData:function(t){return this.$http.post("/app/json/app_travel/queryTicketList",t)},orderdetailData:function(t){return this.$http.post("/app/json/app_travel/detail",t)},orderdetail1Data:function(t){return this.$http.post("/app/json/app_shopping_order/detail",t)},placeorderData:function(t){return this.$http.post("/app/json/app_travel/placeAnOrder",t)},cancelorderData:function(t){return this.$http.post("/app/json/app_travel/cancelOrder",t)},payorderData:function(t){return this.$http.post("/app/json/app_travel/placingOrder",t)},afterData:function(t){return this.$http.post("/app/json/app_travel/queryAfterSaleList",t)},afterdetailData:function(t){return this.$http.post("/app/json/app_travel/queryAfterSaleList",t)},afterapplyData:function(t){return this.$http.post("/app/json/app_travel/submitAfterSale",t)}}}}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[569],{"0jt+":function(t,a,e){"use strict";var s=e("vxnI");e.n(s).a},Z6Mb:function(t,a,e){"use strict";a.a={methods:{ticketListData:function(t){return this.$http.post("/app/json/app_travel/queryTicketList",t)},orderData:function(t){return this.$http.post("/app/json/app_travel/queryTicketList",t)},orderdetailData:function(t){return this.$http.post("/app/json/app_travel/detail",t)},orderdetail1Data:function(t){return this.$http.post("/app/json/app_shopping_order/detail",t)},placeorderData:function(t){return this.$http.post("/app/json/app_travel/placeAnOrder",t)},cancelorderData:function(t){return this.$http.post("/app/json/app_travel/cancelOrder",t)},payorderData:function(t){return this.$http.post("/app/json/app_travel/placingOrder",t)},afterData:function(t){return this.$http.post("/app/json/app_travel/queryAfterSaleList",t)},afterdetailData:function(t){return this.$http.post("/app/json/app_travel/queryAfterSaleList",t)},afterapplyData:function(t){return this.$http.post("/app/json/app_travel/submitAfterSale",t)}}}},qiPG:function(t,a,e){"use strict";e.r(a),e("5+UC");var s=e("05lO"),o={name:"tobePaidDetail",mixins:[e("Z6Mb").a],data:function(){return{obj:{},orderObj:{},orderId:"",ouCode:""}},created:function(){},mounted:function(){this.loadData()},methods:{loadData:function(){var t=this,a={token:this.$store.state.login.token,orderId:t.$route.query.orderId,tradeNo:t.$route.query.tradeNo,orderType:this.$route.query.orderType};t.orderdetailData(a).then((function(a){a.data.result&&(t.obj=a.data.data.travelJson||{},t.orderObj=a.data.data||{},t.ouCode=a.data.data.ouCode)}))},chupeople:function(t){this.$router.push({path:"/carefree_trave/travellingPeople",query:{peopleList:t}})},pay:function(){this.$router.push({path:"/mall2/checkstand",query:{payInfo:JSON.stringify({orderId:this.$route.query.orderId,tradeNo:this.$route.query.tradeNo,style:"travel",payAmount:this.obj.payment}),occurOuCode:this.ouCode}})},cancel:function(){var t=this,a=this,e={token:a.$store.state.login.token,orderId:a.$route.query.orderId};console.log(e),this.$Loading.open(),a.cancelorderData(e).then((function(e){t.$Loading.close(),"success"===e.data.result?(Object(s.a)("您已取消订单"),a.$router.go(-1)):Object(s.a)(e.data.info)}))}}},r=(e("0jt+"),e("KHd+")),n=Object(r.a)(o,(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"body"},[e("nav-top",{attrs:{title:"订单详情"},on:{backEvent:function(a){return t.$router.go(-1)}}}),t._v(" "),e("nav-content",["sendGoods"==t.$route.query.type?e("div",{staticClass:"statusBox"},[e("div",[e("img",{attrs:{src:"static/image/microShop/icon_finish.png",alt:""}}),e("span",[t._v("提交成功")])]),t._v(" "),e("p"),t._v(" "),e("div",[e("img",{attrs:{src:"static/image/microShop/icon_finish.png",alt:""}}),e("span",[t._v("商家出票")])]),t._v(" "),e("p"),t._v(" "),e("div",[e("img",{attrs:{src:"static/image/microShop/icon_finish.png",alt:""}}),e("span",[t._v("订单完成")])])]):t._e(),t._v(" "),"tobepaid"==t.$route.query.type?e("div",{staticClass:"title"},[e("span",[t._v("待支付："+t._s(t.obj.payment))]),t._v(" "),e("span",[t._v("订单金额："+t._s(t.obj.payment)+"元")])]):t._e(),t._v(" "),"cancelgood"==t.$route.query.type?e("div",{staticClass:"title"},[e("div",[e("p",[t._v("订单已取消")]),t._v(" "),e("p",[t._v("2019-09-09   23:23:23")])]),t._v(" "),e("span",{staticClass:"jindu"},[t._v("退款进度？")])]):t._e(),t._v(" "),e("div",{staticClass:"bg"}),t._v(" "),e("div",{staticClass:"box"},[e("div",{staticClass:"div1"},[e("div",[e("img",{attrs:{src:"static/image/microShop/icon_entrance ticket.png",alt:""}}),e("span",[t._v(t._s(t.obj.name))])]),t._v(" "),e("span",{staticClass:"state"},[t._v("待支付")])]),t._v(" "),e("div",{staticClass:"div2"},[e("img",{attrs:{src:t.obj.picUrl,alt:""}}),t._v(" "),e("div",[e("p",[t._v("共"+t._s(t.obj.buyTicketsNumber)+"张门票")]),t._v(" "),e("p",[t._v("实付款："+t._s(t.obj.payment)+"元")])])])]),t._v(" "),e("div",{staticClass:"box"},[e("div",{staticClass:"boxDiv"},[e("p",{staticClass:"chu"},[t._v("出行人")]),t._v(" "),e("ul",t._l(t.obj.players,(function(a,s){return s<3?e("li",{key:s},[e("p",[t._v(t._s(a.name))]),t._v(" "),e("span",[t._v("身份证号："+t._s(a.idNumber))]),t._v(" "),e("span",[t._v("手机号："+t._s(a.mobile))])]):t._e()})),0)])]),t._v(" "),e("div",{staticClass:"box box1"},[e("div",[t._v("订单信息")]),t._v(" "),e("p",[e("span",[t._v("订单编号")]),e("span",[t._v(t._s(t.orderObj.tradeNo))])]),t._v(" "),e("p",[e("span",[t._v("下单时间")]),e("span",[t._v(t._s(t.orderObj.createTime))])]),t._v(" "),e("p",[e("span",[t._v("订单实付金额")]),e("span",[t._v(t._s(t.orderObj.payAmount)+"元")])]),t._v(" "),e("p",[e("span",[t._v("短信接收手机号")]),e("span",[t._v(t._s(t.obj.contactMobile))])])]),t._v(" "),"tobepaid"==t.$route.query.type?e("div",{staticClass:"btns"},[e("span",{on:{click:t.pay}},[t._v("立即支付")]),t._v(" "),e("span",{on:{click:t.cancel}},[t._v("取消订单")])]):t._e(),t._v(" "),"cancelgood"==t.$route.query.type?e("div",{staticClass:"btns"},[e("span",[t._v("重新购买")])]):t._e()])],1)}),[],!1,null,"0b2b18ec",null);a.default=n.exports},vxnI:function(t,a,e){}}]);
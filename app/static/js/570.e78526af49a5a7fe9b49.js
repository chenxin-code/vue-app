(window.webpackJsonp=window.webpackJsonp||[]).push([[570],{Ap68:function(t,e,a){},Z6Mb:function(t,e,a){"use strict";e.a={methods:{ticketListData:function(t){return this.$http.post("/app/json/app_travel/queryTicketList",t)},orderData:function(t){return this.$http.post("/app/json/app_travel/queryTicketList",t)},orderdetailData:function(t){return this.$http.post("/app/json/app_travel/detail",t)},orderdetail1Data:function(t){return this.$http.post("/app/json/app_shopping_order/detail",t)},placeorderData:function(t){return this.$http.post("/app/json/app_travel/placeAnOrder",t)},cancelorderData:function(t){return this.$http.post("/app/json/app_travel/cancelOrder",t)},payorderData:function(t){return this.$http.post("/app/json/app_travel/placingOrder",t)},afterData:function(t){return this.$http.post("/app/json/app_travel/queryAfterSaleList",t)},afterdetailData:function(t){return this.$http.post("/app/json/app_travel/queryAfterSaleList",t)},afterapplyData:function(t){return this.$http.post("/app/json/app_travel/submitAfterSale",t)}}}},axnn:function(t,e,a){"use strict";a.r(e),a("5+UC");var o=a("05lO"),i=a("Z6Mb"),r=a("ZToj"),n=(a("L2JU"),{name:"detail",mixins:[i.a],data:function(){return{show:!1,obj:{},payment:"",timeFrame:"",contactName:"",contactMobile:"",contactIdNumber:"",remark:"",sku_market_price:"",allMoney:"",nums:"",lastPath:"",page:0}},computed:{peopleList:function(){return r.a.state.peopleList}},mounted:function(){if(console.log(this.peopleList),this.nums=this.$route.query.nums,this.allMoney=this.$route.query.allMoney,this.sku_market_price=this.$route.query.sku_market_price,this.loadData(),this.peopleList.length<=0){for(var t=[],e=0;e<Number(this.nums);e++)t.push({name:"",mobile:"",idNumber:"",index:e});r.a.commit("putpeople",t)}console.log(this.peopleList)},methods:{loadData:function(){var t=this,e=this;e.page=e.page+1;var a={token:this.$store.state.login.token,itemId:e.$route.query.itemId,pageThis:e.page,pageSize:10,keyWord:""};this.$Loading.open(),e.ticketListData(a).then((function(a){t.$Loading.close(),a.data.result&&(e.obj=a.data.data[0]||{})}))},editChu:function(t){this.$router.push({path:"/carefree_trave/editPeople",query:{peopleData:t}})},commit:function(){var t=this,e=this;e.timeFrame=e.obj.start_time+"~"+e.obj.expire_time;var a={token:e.$store.state.login.token,players:e.peopleList,name:e.obj.title,payment:e.allMoney,timeFrame:e.timeFrame,buyTicketsNumber:e.nums,contactName:e.contactName,contactMobile:e.contactMobile,remark:e.remark,refundTicketsNumber:"0",unitPrice:e.$route.query.price?e.$route.query.price:"",id:e.$route.query.itemId,refundChanrgeType:e.obj.refund_chanrge_type,refundChanrge:e.obj.refund_chanrge,selfRefundScale:e.obj.self_refund_scale,selfRefundFixed:e.obj.self_refund_fixed,refundType:e.obj.refund_type,suppliers:e.obj.supplier_list,picUrl:e.obj.image,distributionPrice:e.$route.query.priceA?e.$route.query.priceA:"",returnCash:e.$route.query.priceB?e.$route.query.priceB:"",marketValue:e.$route.query.price?e.$route.query.price:"",guidancePrice:e.$route.query.priceC?e.$route.query.priceC:"",smsContent:e.obj.sms_content};console.log(a);var i=!0;e.peopleList.forEach((function(t){""==t.name&&(i=!1)})),i?e.contactName?/^1(3|4|5|7|8|9)\d{9}$/.test(e.contactMobile)?(this.$Loading.open(),e.placeorderData(a).then((function(a){t.$Loading.close(),"success"===a.data.result?e.$router.push({path:"/mall2/checkstand",query:{payInfo:JSON.stringify({orderId:a.data.data.orderId,tradeNo:a.data.data.tradeNo,style:"travel",payAmount:e.allMoney,orderType:"200104"}),occurOuCode:a.data.data.occurOuCode}}):t.$toast(a.data.info)}))):Object(o.a)({message:"请输入正确的手机号",duration:2e3}):Object(o.a)({message:"请输入出行人姓名",duration:2e3}):Object(o.a)({message:"请完善出行人信息",duration:2e3})}}}),s=(a("qAV7"),a("KHd+")),p=Object(s.a)(n,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"body"},[a("nav-top",{attrs:{title:"订单填写"},on:{backEvent:function(e){return t.$router.go(-1)}}}),t._v(" "),a("nav-content",[a("div",{staticClass:"div div1"},[a("p",[t._v(t._s(t.obj.title))]),t._v(" "),a("p",[t._v("有效期范围："+t._s(t.obj.startTime)+"~"+t._s(t.obj.expireTime))]),t._v(" "),a("p",[t._v("购票数："+t._s(t.nums)+"张")]),t._v(" "),a("p",{on:{click:function(e){t.show=!0}}},[a("i",{staticClass:"icon iconfont mall-info"}),t._v("支持有条件退款")])]),t._v(" "),a("div",{staticClass:"box"},[a("div",{staticClass:"boxDiv"},[a("p",{staticClass:"chu"},[t._v("出行人")]),t._v(" "),a("ul",t._l(t.peopleList,(function(e,o){return a("li",{key:o},[e.idNumber?a("div",{staticClass:"chudiv",on:{click:function(a){return t.editChu(e)}}},[a("div",[a("p",[t._v(t._s(e.name))]),t._v(" "),a("span",[t._v("身份证号："+t._s(e.idNumber))]),t._v(" "),a("span",[t._v("手机号："+t._s(e.mobile))])]),t._v(" "),a("i",{staticClass:"icon iconfont mall-gengduojiantou"})]):a("div",{staticClass:"chudiv boxDiv1",on:{click:function(a){return t.editChu(e)}}},[a("div",[t._v("点击新增出行人")]),t._v(" "),a("i",{staticClass:"icon iconfont mall-gengduojiantou"})])])})),0)])]),t._v(" "),a("div",{staticClass:"div div2"},[a("p",[a("span",[t._v("联系人姓名")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.contactName,expression:"contactName"}],attrs:{type:"text",placeholder:"请输入联系人姓名"},domProps:{value:t.contactName},on:{input:function(e){e.target.composing||(t.contactName=e.target.value)}}})]),t._v(" "),a("p",[a("span",[t._v("联系人手机号")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.contactMobile,expression:"contactMobile"}],attrs:{type:"text",placeholder:"请输入联系人手机号"},domProps:{value:t.contactMobile},on:{input:function(e){e.target.composing||(t.contactMobile=e.target.value)}}})])]),t._v(" "),a("div",{staticClass:"div div3"},[a("p",[t._v("备注信息")]),t._v(" "),a("textarea",{directives:[{name:"model",rawName:"v-model",value:t.remark,expression:"remark"}],attrs:{name:"",id:"",cols:"20",rows:"5",placeholder:"请输入订单备注"},domProps:{value:t.remark},on:{input:function(e){e.target.composing||(t.remark=e.target.value)}}})]),t._v(" "),a("div",{staticClass:"div div4"},[a("p",[t._v("总额："),a("span",{staticClass:"span1"},[t._v("￥"+t._s(t.allMoney))])]),t._v(" "),a("span",{staticClass:"span2",on:{click:t.commit}},[t._v("提交订单")])])]),t._v(" "),a("van-action-sheet",{attrs:{title:"退票规则"},model:{value:t.show,callback:function(e){t.show=e},expression:"show"}},[a("div",{staticClass:"cai"},[a("p",[t._v("说明")]),t._v(" "),a("p",[t._v("按票数(张数)计算，手续费固定值*张数+票价*手续费比例*张数")]),t._v(" "),a("p",[t._v("按订单数，手续费固定值*1+票价*手续费比例*1")])])])],1)}),[],!1,null,"253339ce",null);e.default=p.exports},qAV7:function(t,e,a){"use strict";var o=a("Ap68");a.n(o).a}}]);
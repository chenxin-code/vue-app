(window.webpackJsonp=window.webpackJsonp||[]).push([[529],{CEw4:function(t,s,i){"use strict";s.a={methods:{exportinvoiceData:function(t){return this.$http.post("/app/json/user_invoice_assistant/importUserInvoiceHead",t)},golddetailData:function(t){return this.$http.post("/app/json/user_invoice_assistant/detailsOfInvoiceInfo",t)},invoicetipData:function(t){return this.$http.post("/app/json/news/getNewsList",t)},refundData:function(t){return this.$http.post("/app/json/user_invoice_assistant/invoiceRushRed",t)},cardMoData:function(t){return this.$http.post("/app/json/card/getUserCardList",t)},mingxiData:function(t){return this.$http.post("/app/json/user_invoice_assistant/detailsOfInvoiceList",t)},malldetailData:function(t){return this.$http.post("/app/json/app_shopping_order/detail",t)},shopdetailData:function(t){return this.$http.post("/app/json/user_invoice_assistant/convenienceStoredetail",t)},oildetailData:function(t){return this.$http.post("/app/json/refuel_center/detail",t)},hisdetailData:function(t){return this.$http.post("/app/json/user_invoice_assistant/invoiceContentDetails",t)},hisData:function(t){return this.$http.post("/app/json/user_invoice_assistant/invoiceContentDetailsList",t)},mallData:function(t){return this.$http.post("/app/json/app_shopping_order/queryOrder",t)},storeData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryConvenienceStoreOrder",t)},appData:function(t){return this.$http.post("/app/json/refuel_center/queryOrder",t)},goldData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryCashIn",t)},walletData:function(t){return this.$http.post("/app/json/user_invoice_assistant/sinopecWalletInvoiceList",t)},cardData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryUserRefuelingCardInfoList",t)},commitselfinvoiceData:function(t){return this.$http.post("/app/json/user_invoice_assistant/orderInvoicingInMall",t)},commitselfcardinvoiceData:function(t){return this.$http.post("/app/json/user_invoice_assistant/gasCardInvoice",t)},commitselfgoldinvoiceData:function(t){return this.$http.post("/app/json/user_invoice_assistant/cashInInvoicing",t)},emailData:function(t){return this.$http.post("/app/json/user_invoice_assistant/invoiceModifyMailbox",t)},histroydetailData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryInvoiceDetails",t)},histroyData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryInvoicedList",t)},riseData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryUserInvoiceHeadList",t)},openedData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryInvoicedList",t)},commitData:function(t){return this.$http.post("/app/json/user_invoice_assistant/addOrUpdateUserInvoiceHead",t)},delData:function(t){return this.$http.post("/app/json/user_invoice_assistant/deleteUserInvoiceHead",t)},morenData:function(t){return this.$http.post("/app/json/user_invoice_assistant/setDefaultUserInvoiceHead",t)},detailData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryInvoiceDetails",t)},souData:function(t){return this.$http.post("/app/json/user_invoice_assistant/searchInvoiceList",t)},soudetailData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryUserInvoiceHeadDetails",t)},tijiaoData:function(t){return this.$http.post("/app/json/user_invoice_assistant/addInvoicing",t)},saoData:function(t){return this.$http.post("/app/json/user_invoice_assistant/getResultFromQrcode",t)},morentitleData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryDefaultTittle",t)},daikaiData:function(t){return this.$http.post("/app/json/user_invoice_assistant/unInvoicingList",t)},chakanData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryUserInvoiceHeadDetails",t)}}}},RYSb:function(t,s,i){},ScwO:function(t,s,i){"use strict";i.r(s),i("5+UC");var e=i("05lO"),a=i("CEw4"),n=i("0FX9"),o=i.n(n),r=i("wd/R"),c=i.n(r),u={name:"historyInvoice",components:{QRCode:o.a},mixins:[a.a],data:function(){return{listData:[],sideFiltrateModalShow:!1,id:"",heightMoney:"",lowMoney:"",titleView:!1,statusList:[{state:"待处理",redData:!1,stateNum:3},{state:"已开票",redData:!1,stateNum:1},{state:"开票失败",redData:!1,stateNum:2}],typeList:[{ordertype:"加油订单开票",redData:!1,orderNum:100},{ordertype:"商品订单开票",redData:!1,orderNum:200}],invoiceStatus:"",orderType:"",minAmount:"",maxAmount:"",showCode:!1,index:null}},created:function(){this.loadData()},mounted:function(){console.log("退票",this.$store.state.globalConfig.isShowFlushRed,"打印发票二维码",this.$store.state.globalConfig.isShowInvoiceQrCode)},methods:{loadData:function(){var t=this,s=this,i={token:this.$store.state.login.token,invoiceStatus:s.invoiceStatus,orderType:s.orderType,minAmount:s.minAmount,maxAmount:s.maxAmount};s.histroyData(i).then((function(i){if(console.log(i),i.data.result){s.titleView=!0;var e=i.data.data||[];e.forEach((function(s){s.isShowFlushRed=t.$store.state.globalConfig.isShowFlushRed})),s.listData=e,console.log(t.listData)}}))},reset:function(){this.typeList.forEach((function(t){t.redData=!1})),this.statusList.forEach((function(t){t.redData=!1})),this.invoiceStatus="",this.orderType="",this.minAmount="",this.maxAmount=""},sure:function(){this.loadData(),this.sideFiltrateModalShow=!1,this.invoiceStatus="",this.orderType="",this.minAmount="",this.maxAmount="",this.statusList.forEach((function(t){t.redData=!1})),this.typeList.forEach((function(t){t.redData=!1}))},statusData:function(t){this.statusList.forEach((function(t){t.redData=!1})),t.redData=!0,this.invoiceStatus=t.stateNum},typeData:function(t){this.typeList.forEach((function(t){t.redData=!1})),t.redData=!0,this.orderType=t.orderNum},toDetail:function(t){this.$router.push({path:"/historyDetail",query:{id:t.id,orderTypeName:t.orderTypeName}})},Printing:function(t){t.invoicePdfAddr?(this.showCode=!0,this.$nextTick((function(){o.a.toCanvas(document.getElementById("qrcode"),t.invoicePdfAddr)}))):this.$Toast("二维码为空")},reorder:function(t){var s=this;this.$http.post("/app/json/user_invoice_assistant/againInvoice",{id:t.id}).then((function(t){var i=t.data;0==i.status?(s.$Toast("重新开票成功"),s.loadData()):s.$Toast(i.info)}))},isDuringDate:function(t){if(this.$store.state.globalConfig.invoiceRushRedLimitDays){var s=parseInt(this.$store.state.globalConfig.invoiceRushRedLimitDays),i=c()(new Date(t)).add(s,"days").format("YYYY-MM-DD hh:mm:ss"),e=new Date(i).getTime()-(new Date).getTime();return console.log(t,i),e>0}return!0},refundInvoice:function(t){var s=this,i={token:this.$store.state.login.token,orderId:t.orderId,transactionRecord:t.transactionRecord};console.log(this.$store.state.globalConfig.isEditInvoiceTitle),1==this.$store.state.globalConfig.isEditInvoiceTitle?this.$router.push({name:"taitou",params:{userInvoiceHeadId:t.userInvoiceHeadId||"",orderId:t.orderId||"",transactionRecord:t.transactionRecord,id:t.id||"",type:1,fromPage:"history"}}):(this.$Loading.open(),this.refundData(i).then((function(t){s.$Loading.close(),"success"===t.data.result?e.a.success("退票成功"):Object(e.a)(t.data.info)})))}}},p=(i("x+Op"),i("KHd+")),d=Object(p.a)(u,(function(){var t=this,s=t.$createElement,i=t._self._c||s;return i("div",{staticClass:"body"},[i("nav-top",{attrs:{title:"历史发票"},on:{backEvent:function(s){return t.$router.go(-1)}}},[i("div",{staticClass:"shareBox",on:{click:function(s){t.sideFiltrateModalShow=!0}}},[i("span",{staticClass:"iconfont mall-shaixuan"})])]),t._v(" "),i("nav-content",[i("div",[t._l(t.listData,(function(s,e){return t.listData.length>0?i("div",{key:e,staticClass:"publicInvoice"},[i("div",{on:{click:function(i){return t.toDetail(s)}}},[i("div",{staticClass:"div1"},[i("span",[t._v("申请时间："+t._s(s.createTime))]),t._v(" "),i("span",[t._v(t._s(s.makeOutStatusName))])]),t._v(" "),i("div",{staticClass:"div1"},[2!=t.$store.state.webtype?i("span",[t._v(t._s(s.orderTypeName))]):t._e(),t._v(" "),i("span",[t._v("可开票金额："+t._s(s.amount)+"元")])])]),t._v(" "),0==s.makeOutStatus||2==s.makeOutStatus?i("span",{staticClass:"reInvoice",on:{click:function(i){return t.reorder(s)}}},[t._v("重新开票")]):t._e(),t._v(" "),1==s.isShowFlushRed&&"1"==s.makeOutStatus&&t.isDuringDate(s.createTime)?i("span",{staticClass:"reInvoice",on:{click:function(i){return t.refundInvoice(s)}}},[t._v("退票")]):t._e(),t._v(" "),1==s.makeOutStatus&&1==t.$store.state.globalConfig.isShowInvoiceQrCode?i("span",{staticClass:"reInvoice",on:{click:function(i){return t.Printing(s)}}},[t._v("打印发票二维码")]):t._e()]):t._e()})),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:t.titleView,expression:"titleView"}]},[i("p",{directives:[{name:"show",rawName:"v-show",value:0==t.listData.length,expression:"listData.length==0"}],staticClass:"nullData"},[t._v("暂无可查询数据")])])],2)]),t._v(" "),i("van-overlay",{attrs:{show:t.showCode},on:{click:function(s){t.showCode=!1}}},[i("div",{staticClass:"wrapper",on:{click:function(t){t.stopPropagation()}}},[i("div",{staticClass:"block"},[i("canvas",{attrs:{id:"qrcode"}}),t._v(" "),i("van-icon",{attrs:{name:"close"},on:{click:function(s){t.showCode=!1}}})],1)])]),t._v(" "),i("transition",{attrs:{name:"filtrate-mask"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:t.sideFiltrateModalShow,expression:"sideFiltrateModalShow"}],staticClass:"filtrate-modal-mask",on:{click:function(s){t.sideFiltrateModalShow=!1}}})]),t._v(" "),i("transition",{attrs:{name:"filtrate"}},[t.sideFiltrateModalShow?i("div",{ref:"sideFiltrateModal",staticClass:"filtrate-modal-wrapper"},[i("div",{staticClass:"box"},[i("div",{staticClass:"screen1"},[i("span",{staticClass:"span"},[t._v("发票状态")]),t._v(" "),i("div",t._l(t.statusList,(function(s,e){return i("span",{key:e,class:{red:1==s.redData},on:{click:function(i){return t.statusData(s)}}},[t._v(t._s(s.state))])})),0)]),t._v(" "),i("div",{staticClass:"screen1"},[i("span",{staticClass:"span"},[t._v("发票类型")]),t._v(" "),i("div",t._l(t.typeList,(function(s,e){return i("span",{key:e,class:{red:1==s.redData},on:{click:function(i){return t.typeData(s)}}},[t._v(t._s(s.ordertype))])})),0)]),t._v(" "),i("div",{staticClass:"screen1 screen2"},[i("span",{staticClass:"span"},[t._v("发票金额")]),t._v(" "),i("div",[i("input",{directives:[{name:"model",rawName:"v-model",value:t.minAmount,expression:"minAmount"}],attrs:{placeholder:"最低金额（元）",type:"number"},domProps:{value:t.minAmount},on:{input:function(s){s.target.composing||(t.minAmount=s.target.value)}}}),t._v(" "),i("span",[t._v("~")]),t._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:t.maxAmount,expression:"maxAmount"}],attrs:{placeholder:"最高金额（元）",type:"number"},domProps:{value:t.maxAmount},on:{input:function(s){s.target.composing||(t.maxAmount=s.target.value)}}})])])]),t._v(" "),i("div",{staticClass:"filtrate-btn"},[i("div",{on:{click:t.reset}},[t._v("重置")]),t._v(" "),i("div",{staticClass:"theme_bg_red",on:{click:t.sure}},[t._v("确定")])])]):t._e()])],1)}),[],!1,null,"65e57cd0",null);s.default=d.exports},"x+Op":function(t,s,i){"use strict";var e=i("RYSb");i.n(e).a}}]);
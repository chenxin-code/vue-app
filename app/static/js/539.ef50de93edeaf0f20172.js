(window.webpackJsonp=window.webpackJsonp||[]).push([[539],{CEw4:function(t,a,e){"use strict";a.a={methods:{exportinvoiceData:function(t){return this.$http.post("/app/json/user_invoice_assistant/importUserInvoiceHead",t)},golddetailData:function(t){return this.$http.post("/app/json/user_invoice_assistant/detailsOfInvoiceInfo",t)},invoicetipData:function(t){return this.$http.post("/app/json/news/getNewsList",t)},refundData:function(t){return this.$http.post("/app/json/user_invoice_assistant/invoiceRushRed",t)},cardMoData:function(t){return this.$http.post("/app/json/card/getUserCardList",t)},mingxiData:function(t){return this.$http.post("/app/json/user_invoice_assistant/detailsOfInvoiceList",t)},malldetailData:function(t){return this.$http.post("/app/json/app_shopping_order/detail",t)},shopdetailData:function(t){return this.$http.post("/app/json/user_invoice_assistant/convenienceStoredetail",t)},oildetailData:function(t){return this.$http.post("/app/json/refuel_center/detail",t)},hisdetailData:function(t){return this.$http.post("/app/json/user_invoice_assistant/invoiceContentDetails",t)},hisData:function(t){return this.$http.post("/app/json/user_invoice_assistant/invoiceContentDetailsList",t)},mallData:function(t){return this.$http.post("/app/json/app_shopping_order/queryOrder",t)},storeData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryConvenienceStoreOrder",t)},appData:function(t){return this.$http.post("/app/json/refuel_center/queryOrder",t)},goldData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryCashIn",t)},walletData:function(t){return this.$http.post("/app/json/user_invoice_assistant/sinopecWalletInvoiceList",t)},cardData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryUserRefuelingCardInfoList",t)},commitselfinvoiceData:function(t){return this.$http.post("/app/json/user_invoice_assistant/orderInvoicingInMall",t)},commitselfcardinvoiceData:function(t){return this.$http.post("/app/json/user_invoice_assistant/gasCardInvoice",t)},commitselfgoldinvoiceData:function(t){return this.$http.post("/app/json/user_invoice_assistant/cashInInvoicing",t)},emailData:function(t){return this.$http.post("/app/json/user_invoice_assistant/invoiceModifyMailbox",t)},histroydetailData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryInvoiceDetails",t)},histroyData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryInvoicedList",t)},riseData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryUserInvoiceHeadList",t)},openedData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryInvoicedList",t)},commitData:function(t){return this.$http.post("/app/json/user_invoice_assistant/addOrUpdateUserInvoiceHead",t)},delData:function(t){return this.$http.post("/app/json/user_invoice_assistant/deleteUserInvoiceHead",t)},morenData:function(t){return this.$http.post("/app/json/user_invoice_assistant/setDefaultUserInvoiceHead",t)},detailData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryInvoiceDetails",t)},souData:function(t){return this.$http.post("/app/json/user_invoice_assistant/searchInvoiceList",t)},soudetailData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryUserInvoiceHeadDetails",t)},tijiaoData:function(t){return this.$http.post("/app/json/user_invoice_assistant/addInvoicing",t)},saoData:function(t){return this.$http.post("/app/json/user_invoice_assistant/getResultFromQrcode",t)},morentitleData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryDefaultTittle",t)},daikaiData:function(t){return this.$http.post("/app/json/user_invoice_assistant/unInvoicingList",t)},chakanData:function(t){return this.$http.post("/app/json/user_invoice_assistant/queryUserInvoiceHeadDetails",t)}}}},DvJ6:function(t,a,e){"use strict";e.r(a),e("5+UC");var s=e("05lO"),n=e("CEw4"),i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o={name:"orderListDetail",mixins:[n.a],data:function(){return{paramsData:{},oilView:!0,orderId:"",price:""}},created:function(){this.orderId=this.$route.query.orderId,this.orderTypeName=this.$route.query.orderTypeName,console.log(this.$route.query.orderTypeName)},mounted:function(){if("商城订单"==this.orderTypeName)this.loadData1(),this.oilView=!1;else if("加油订单"==this.orderTypeName||"ETC无感加油订单"==this.orderTypeName)this.loadData2(),this.oilView=!0;else if("便利店订单"==this.orderTypeName){var t=this,a={token:t.$store.state.login.token,orderId:t.orderId};t.shopdetailData(a).then((function(a){"success"===a.data.result?(t.paramsData=a.data.data||{},console.log(i(Number(t.paramsData.payAmount))),console.log(i(t.paramsData.invoiceCouponAmount)),t.paramsData.invoiceCouponAmount||(t.paramsData.invoiceCouponAmount=0),t.price=(t.paramsData.payAmount+t.paramsData.invoiceCouponAmount).toFixed(2)):Object(s.a)(a.data.info)})),t.oilView=!0}},methods:{loadData1:function(){var t=this,a={token:t.$store.state.login.token,orderType:200017,orderId:t.orderId};t.malldetailData(a).then((function(a){"success"===a.data.result?(t.paramsData=a.data.data||{},console.log(i(t.paramsData.payAmount)),console.log(i(t.paramsData.invoiceCouponAmount)),t.paramsData.invoiceCouponAmount||(t.paramsData.invoiceCouponAmount=0),t.price=(t.paramsData.payAmount+t.paramsData.invoiceCouponAmount).toFixed(2)):Object(s.a)(a.data.info)}))},loadData2:function(){var t=this,a={token:t.$store.state.login.token,orderId:t.orderId,orderType:100011};"janeIndex"==this.$route.query.source?this.$http.post("/app/json/user_invoice_assistant/ordEsayPayOrderDetail",a).then((function(a){var e=a.data;console.log("------\x3e",e),0==e.status||"success"===a.data.result?(t.paramsData=e.data||{},t.paramsData.shoppingOrderId=t.paramsData.id||"",t.paramsData.invoiceCouponAmount||(t.paramsData.invoiceCouponAmount=0),t.price=(t.paramsData.payAmount+t.paramsData.invoiceCouponAmount).toFixed(2)):Object(s.a)(a.data.info)})):t.oildetailData(a).then((function(a){"success"===a.data.result?(t.paramsData=a.data.data||{},console.log(i(t.paramsData.payAmount)),console.log(i(t.paramsData.invoiceCouponAmount)),t.paramsData.invoiceCouponAmount||(t.paramsData.invoiceCouponAmount=0),t.price=(t.paramsData.payAmount+t.paramsData.invoiceCouponAmount).toFixed(2)):Object(s.a)(a.data.info)}))}}},r=(e("brtO"),e("KHd+")),p=Object(r.a)(o,(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"body"},[e("nav-top",{attrs:{title:"订单详情"},on:{backEvent:function(a){return t.$router.go(-1)}}}),t._v(" "),e("nav-content",[e("div",{staticClass:"publicInvoice"},[e("van-cell-group",[e("div",{staticClass:"div1"},[e("span",{staticClass:"span"},[t._v(t._s(t.paramsData.storeName))]),t._v(" "),e("van-field",{attrs:{label:"订单号",disabled:""},model:{value:t.paramsData.shoppingOrderId,callback:function(a){t.$set(t.paramsData,"shoppingOrderId",a)},expression:"paramsData.shoppingOrderId"}}),t._v(" "),e("van-field",{attrs:{label:"下单时间",disabled:""},model:{value:t.paramsData.completeTime,callback:function(a){t.$set(t.paramsData,"completeTime",a)},expression:"paramsData.completeTime"}}),t._v(" "),t.oilView?e("van-field",{attrs:{label:"油品型号",disabled:""},model:{value:t.paramsData.refuelOilName,callback:function(a){t.$set(t.paramsData,"refuelOilName",a)},expression:"paramsData.refuelOilName"}}):t._e(),t._v(" "),t.oilView?e("van-field",{attrs:{label:"加油升数",disabled:""},model:{value:t.paramsData.refuelLiter,callback:function(a){t.$set(t.paramsData,"refuelLiter",a)},expression:"paramsData.refuelLiter"}}):t._e(),t._v(" "),t.oilView?t._e():e("div",{staticClass:"openBox"},[e("div",{staticClass:"openBox1"},[e("span",[t._v("配送方式")])]),t._v(" "),e("div",[1==t.paramsData.deliverType?e("span",{staticClass:"span"},[t._v("自提")]):t._e(),t._v(" "),2==t.paramsData.deliverType?e("span",{staticClass:"span"},[t._v("配送")]):t._e()])])],1),t._v(" "),t.oilView?t._e():e("div",{staticClass:"div1"},[e("van-field",{attrs:{label:"商品明细",disabled:""}}),t._v(" "),t._l(t.paramsData.itemAbstractList,(function(a){return e("div",[e("div",{staticClass:"van-multi-ellipsis--l2",staticStyle:{padding:"0 18px","margin-bottom":"3px"}},[t._v("\n                "+t._s(a.skuName)+"\n              ")]),t._v(" "),e("van-field",{attrs:{label:a.realPrice+"x"+a.number,disabled:""},model:{value:a.realPrice,callback:function(e){t.$set(a,"realPrice",e)},expression:"item.realPrice"}})],1)}))],2),t._v(" "),e("div",{staticClass:"div1 div2"},[e("van-field",{attrs:{label:"应付金额",disabled:""},model:{value:t.paramsData.totalAmount,callback:function(a){t.$set(t.paramsData,"totalAmount",a)},expression:"paramsData.totalAmount"}}),t._v(" "),e("van-field",{attrs:{label:"优惠金额",disabled:""},model:{value:t.paramsData.discountAmount,callback:function(a){t.$set(t.paramsData,"discountAmount",a)},expression:"paramsData.discountAmount"}}),t._v(" "),e("van-field",{attrs:{label:"代金券金额",disabled:""},model:{value:t.paramsData.couponAmount,callback:function(a){t.$set(t.paramsData,"couponAmount",a)},expression:"paramsData.couponAmount"}}),t._v(" "),e("van-field",{attrs:{label:"实付金额",disabled:""},model:{value:t.paramsData.payAmount,callback:function(a){t.$set(t.paramsData,"payAmount",a)},expression:"paramsData.payAmount"}}),t._v(" "),e("van-field",{attrs:{label:"可开票金额",disabled:""},model:{value:t.price,callback:function(a){t.price=a},expression:"price"}})],1)])],1)])],1)}),[],!1,null,"6cbc3e70",null);a.default=p.exports},brtO:function(t,a,e){"use strict";var s=e("y6AU");e.n(s).a},y6AU:function(t,a,e){}}]);
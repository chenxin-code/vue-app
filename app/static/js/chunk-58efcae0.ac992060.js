(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-58efcae0"],{"084c":function(a,t,n){"use strict";var e="/app/json/user_invoice_assistant/queryUserInvoiceHeadList",i="/app/json/user_invoice_assistant/queryInvoicedList",s="/app/json/user_invoice_assistant/queryInvoiceDetails",o="/app/json/user_invoice_assistant/addOrUpdateUserInvoiceHead",r="/app/json/user_invoice_assistant/deleteUserInvoiceHead",c="/app/json/user_invoice_assistant/setDefaultUserInvoiceHead",p="/app/json/user_invoice_assistant/searchInvoiceList",l="/app/json/user_invoice_assistant/queryUserInvoiceHeadDetails",u="/app/json/user_invoice_assistant/addInvoicing",d="/app/json/user_invoice_assistant/getResultFromQrcode",h="/app/json/user_invoice_assistant/queryDefaultTittle",v="/app/json/user_invoice_assistant/unInvoicingList",f="/app/json/user_invoice_assistant/queryUserInvoiceHeadDetails",m="/app/json/user_invoice_assistant/queryInvoicedList",_="/app/json/user_invoice_assistant/queryInvoiceDetails",g="/app/json/user_invoice_assistant/invoiceModifyMailbox",b="/app/json/user_invoice_assistant/orderInvoicingInMall",D="/app/json/user_invoice_assistant/gasCardInvoice",$="/app/json/refuel_center/queryOrder",j="/app/json/app_shopping_order/queryOrder",x="/app/json/user_invoice_assistant/queryCashIn",I="/app/json/user_invoice_assistant/sinopecWalletInvoiceList",k="/app/json/user_invoice_assistant/queryUserRefuelingCardInfoList",y="/app/json/user_invoice_assistant/queryConvenienceStoreOrder",C="/app/json/user_invoice_assistant/invoiceContentDetailsList",L="/app/json/user_invoice_assistant/invoiceContentDetails",q="/app/json/user_invoice_assistant/detailsOfInvoiceList",w="/app/json/app_shopping_order/detail",U="/app/json/user_invoice_assistant/convenienceStoredetail",z="/app/json/refuel_center/detail",T="/app/json/user_invoice_assistant/detailsOfInvoiceInfo",O="/app/json/card/getUserCardList",H="/app/json/news/getNewsList",N="/app/json/user_invoice_assistant/invoiceRushRed",A="/app/json/user_invoice_assistant/cashInInvoicing",M="/app/json/user_invoice_assistant/importUserInvoiceHead";t["a"]={methods:{exportinvoiceData:function(a){return this.$http.post(M,a)},golddetailData:function(a){return this.$http.post(T,a)},invoicetipData:function(a){return this.$http.post(H,a)},refundData:function(a){return this.$http.post(N,a)},cardMoData:function(a){return this.$http.post(O,a)},mingxiData:function(a){return this.$http.post(q,a)},malldetailData:function(a){return this.$http.post(w,a)},shopdetailData:function(a){return this.$http.post(U,a)},oildetailData:function(a){return this.$http.post(z,a)},hisdetailData:function(a){return this.$http.post(L,a)},hisData:function(a){return this.$http.post(C,a)},mallData:function(a){return this.$http.post(j,a)},storeData:function(a){return this.$http.post(y,a)},appData:function(a){return this.$http.post($,a)},goldData:function(a){return this.$http.post(x,a)},walletData:function(a){return this.$http.post(I,a)},cardData:function(a){return this.$http.post(k,a)},commitselfinvoiceData:function(a){return this.$http.post(b,a)},commitselfcardinvoiceData:function(a){return this.$http.post(D,a)},commitselfgoldinvoiceData:function(a){return this.$http.post(A,a)},emailData:function(a){return this.$http.post(g,a)},histroydetailData:function(a){return this.$http.post(_,a)},histroyData:function(a){return this.$http.post(m,a)},riseData:function(a){return this.$http.post(e,a)},openedData:function(a){return this.$http.post(i,a)},commitData:function(a){return this.$http.post(o,a)},delData:function(a){return this.$http.post(r,a)},morenData:function(a){return this.$http.post(c,a)},detailData:function(a){return this.$http.post(s,a)},souData:function(a){return this.$http.post(p,a)},soudetailData:function(a){return this.$http.post(l,a)},tijiaoData:function(a){return this.$http.post(u,a)},saoData:function(a){return this.$http.post(d,a)},morentitleData:function(a){return this.$http.post(h,a)},daikaiData:function(a){return this.$http.post(v,a)},chakanData:function(a){return this.$http.post(f,a)}}}},"0ab5":function(a,t,n){"use strict";n.r(t);var e=function(){var a=this,t=a.$createElement,n=a._self._c||t;return n("div",{staticClass:"body"},[n("nav-top",{attrs:{title:"代开发票"},on:{backEvent:function(t){return a.$router.go(-1)}}}),n("nav-content",[n("div",{staticClass:"publicInvoice"},[n("van-cell-group",[n("van-field",{attrs:{disabled:"",label:"订单号",placeholder:""},model:{value:a.dingdannNo,callback:function(t){a.dingdannNo=t},expression:"dingdannNo"}}),n("van-field",{attrs:{disabled:"",label:"发票类型",placeholder:""},model:{value:a.leixing,callback:function(t){a.leixing=t},expression:"leixing"}}),n("van-field",{attrs:{disabled:"",label:"发票内容",placeholder:""},model:{value:a.neirong,callback:function(t){a.neirong=t},expression:"neirong"}})],1),n("van-radio-group",{model:{value:a.radio,callback:function(t){a.radio=t},expression:"radio"}},[n("div",[a._v("发票抬头")]),n("van-radio",{attrs:{name:"1","checked-color":"#f44"},on:{click:function(t){return a.taitou(4)}}},[a._v("个人")]),n("van-radio",{attrs:{name:"2","checked-color":"#f44"},on:{click:function(t){return a.taitou(5)}}},[a._v("公司")])],1),a.company?n("van-cell-group",[n("van-field",{attrs:{label:"公司名称",placeholder:"请输入公司名称"},model:{value:a.gongname,callback:function(t){a.gongname=t},expression:"gongname"}}),n("van-field",{attrs:{label:"税号",placeholder:"请输入税号"},model:{value:a.shuihao,callback:function(t){a.shuihao=t},expression:"shuihao"}})],1):a._e()],1),a.company?a._e():n("div",{staticClass:"publicInvoice publicInvoice1"},[n("van-cell-group",[n("van-field",{attrs:{label:"收票人姓名",placeholder:"请输入收票人姓名"},model:{value:a.xingming,callback:function(t){a.xingming=t},expression:"xingming"}}),n("van-field",{attrs:{label:"收票人手机号",placeholder:"请输入收票人手机号"},model:{value:a.phone,callback:function(t){a.phone=t},expression:"phone"}}),n("div",{staticClass:"publicInvoiceDiv",on:{click:a.areaData}},[n("van-field",{attrs:{label:"收票人地区",disabled:""},model:{value:a.areas,callback:function(t){a.areas=t},expression:"areas"}}),n("span",{staticClass:"img"},[n("img",{attrs:{src:"/static/image/invoice/arrows.png",alt:""}})])],1),n("van-popup",{attrs:{position:"bottom"},model:{value:a.area,callback:function(t){a.area=t},expression:"area"}},[n("van-area",{attrs:{"area-list":a.areaList},on:{cancel:a.cancelArea,confirm:a.confirmArea}})],1),n("van-field",{attrs:{label:"详细地址",placeholder:"请输入详细地址"},model:{value:a.dizhi,callback:function(t){a.dizhi=t},expression:"dizhi"}})],1)],1),a.company?n("div",{staticClass:"publicInvoice publicInvoice1"},[n("van-cell-group",[n("van-field",{attrs:{label:"收票人姓名",placeholder:"请输入收票人姓名"},model:{value:a.xingming,callback:function(t){a.xingming=t},expression:"xingming"}}),n("van-field",{attrs:{label:"收票人手机号",placeholder:"请输入收票人手机号"},model:{value:a.phone,callback:function(t){a.phone=t},expression:"phone"}}),n("div",{staticClass:"publicInvoiceDiv",on:{click:a.areaData}},[n("van-field",{attrs:{label:"收票人地区",disabled:""},model:{value:a.areas,callback:function(t){a.areas=t},expression:"areas"}}),n("span",{staticClass:"img"},[n("img",{attrs:{src:"/static/image/invoice/arrows.png",alt:""}})])],1),n("van-popup",{attrs:{position:"bottom"},model:{value:a.area,callback:function(t){a.area=t},expression:"area"}},[n("van-area",{attrs:{"area-list":a.areaList},on:{cancel:a.cancelArea,confirm:a.confirmArea}})],1),n("van-field",{attrs:{label:"详细地址",placeholder:"请输入详细地址"},model:{value:a.dizhi,callback:function(t){a.dizhi=t},expression:"dizhi"}})],1)],1):a._e(),n("div",{staticClass:"answer theme_bg_red",on:{click:a.commit}},[a._v("提交")])])],1)},i=[],s=(n("b0c0"),n("084c")),o=n("17cc"),r={name:"stay",mixins:[s["a"]],data:function(){return{dingdannNo:"222",leixing:"普通发票",neirong:"商品明细",radio:"1",gongname:"",shuihao:"",phone:"",xingming:"",dizhi:"",area:!1,areas:"",areaList:o["a"],company:!1,paramsData:{}}},created:function(){var a=this;this.paramsData=a.$route.params,4===a.paramsData.titleType?(a.radio="4",a.company=!1):(a.radio="5",a.company=!0)},mounted:function(){},methods:{areaData:function(){this.area=!0},cancelArea:function(){this.area=!1},confirmArea:function(a){this.areas=a[0].name+"/"+a[1].name+"/"+a[2].name,this.area=!1},commit:function(){var a=this,t={id:a.paramsData.id,orderId:a.paramsData.orderId,token:this.$store.state.login.token,typeName:a.paramsData.typeName,detail:a.paramsData.detail,titleType:a.params.titleType,radio:a.radio,gongname:a.gongname,shuihao:a.shuihao,xingming:a.xingming,phone:a.phone,areas:a.areas,dizhi:a.dizhi};a.detailObj.radio?5!=a.radio||a.shuihao?""!==a.phone&&/^1(3|4|5|7|8|9)\d{9}$/.test(a.phone)?a.tijiaoData(t).then((function(a){"success"===a.data.result?Toast.success("提交成功"):Toast(a.data.info)})):Toast({message:"请输入正确的手机号",duration:2e3}):Toast({message:"请输入税号",duration:2e3}):Toast({message:"请输入抬头",duration:2e3})},taitou:function(a){var t=this;4===a?t.company=!1:5===a&&(t.company=!0)}}},c=r,p=(n("194bd"),n("0c7c")),l=Object(p["a"])(c,e,i,!1,null,"6ae8902e",null);t["default"]=l.exports},"194bd":function(a,t,n){"use strict";n("5b3fc")},"5b3fc":function(a,t,n){}}]);
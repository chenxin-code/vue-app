(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-799ca828"],{"084c":function(t,a,e){"use strict";var s="/app/json/user_invoice_assistant/queryUserInvoiceHeadList",i="/app/json/user_invoice_assistant/queryInvoicedList",n="/app/json/user_invoice_assistant/queryInvoiceDetails",o="/app/json/user_invoice_assistant/addOrUpdateUserInvoiceHead",r="/app/json/user_invoice_assistant/deleteUserInvoiceHead",p="/app/json/user_invoice_assistant/setDefaultUserInvoiceHead",l="/app/json/user_invoice_assistant/searchInvoiceList",c="/app/json/user_invoice_assistant/queryUserInvoiceHeadDetails",u="/app/json/user_invoice_assistant/addInvoicing",d="/app/json/user_invoice_assistant/getResultFromQrcode",v="/app/json/user_invoice_assistant/queryDefaultTittle",m="/app/json/user_invoice_assistant/unInvoicingList",h="/app/json/user_invoice_assistant/queryUserInvoiceHeadDetails",f="/app/json/user_invoice_assistant/queryInvoicedList",D="/app/json/user_invoice_assistant/queryInvoiceDetails",y="/app/json/user_invoice_assistant/invoiceModifyMailbox",_="/app/json/user_invoice_assistant/orderInvoicingInMall",g="/app/json/user_invoice_assistant/gasCardInvoice",b="/app/json/refuel_center/queryOrder",$="/app/json/app_shopping_order/queryOrder",j="/app/json/user_invoice_assistant/queryCashIn",T="/app/json/user_invoice_assistant/sinopecWalletInvoiceList",k="/app/json/user_invoice_assistant/queryUserRefuelingCardInfoList",I="/app/json/user_invoice_assistant/queryConvenienceStoreOrder",P="/app/json/user_invoice_assistant/invoiceContentDetailsList",O="/app/json/user_invoice_assistant/invoiceContentDetails",x="/app/json/user_invoice_assistant/detailsOfInvoiceList",w="/app/json/app_shopping_order/detail",C="/app/json/user_invoice_assistant/convenienceStoredetail",A="/app/json/refuel_center/detail",E="/app/json/user_invoice_assistant/detailsOfInvoiceInfo",N="/app/json/card/getUserCardList",q="/app/json/news/getNewsList",L="/app/json/user_invoice_assistant/invoiceRushRed",B="/app/json/user_invoice_assistant/cashInInvoicing",U="/app/json/user_invoice_assistant/importUserInvoiceHead";a["a"]={methods:{exportinvoiceData:function(t){return this.$http.post(U,t)},golddetailData:function(t){return this.$http.post(E,t)},invoicetipData:function(t){return this.$http.post(q,t)},refundData:function(t){return this.$http.post(L,t)},cardMoData:function(t){return this.$http.post(N,t)},mingxiData:function(t){return this.$http.post(x,t)},malldetailData:function(t){return this.$http.post(w,t)},shopdetailData:function(t){return this.$http.post(C,t)},oildetailData:function(t){return this.$http.post(A,t)},hisdetailData:function(t){return this.$http.post(O,t)},hisData:function(t){return this.$http.post(P,t)},mallData:function(t){return this.$http.post($,t)},storeData:function(t){return this.$http.post(I,t)},appData:function(t){return this.$http.post(b,t)},goldData:function(t){return this.$http.post(j,t)},walletData:function(t){return this.$http.post(T,t)},cardData:function(t){return this.$http.post(k,t)},commitselfinvoiceData:function(t){return this.$http.post(_,t)},commitselfcardinvoiceData:function(t){return this.$http.post(g,t)},commitselfgoldinvoiceData:function(t){return this.$http.post(B,t)},emailData:function(t){return this.$http.post(y,t)},histroydetailData:function(t){return this.$http.post(D,t)},histroyData:function(t){return this.$http.post(f,t)},riseData:function(t){return this.$http.post(s,t)},openedData:function(t){return this.$http.post(i,t)},commitData:function(t){return this.$http.post(o,t)},delData:function(t){return this.$http.post(r,t)},morenData:function(t){return this.$http.post(p,t)},detailData:function(t){return this.$http.post(n,t)},souData:function(t){return this.$http.post(l,t)},soudetailData:function(t){return this.$http.post(c,t)},tijiaoData:function(t){return this.$http.post(u,t)},saoData:function(t){return this.$http.post(d,t)},morentitleData:function(t){return this.$http.post(v,t)},daikaiData:function(t){return this.$http.post(m,t)},chakanData:function(t){return this.$http.post(h,t)}}}},7074:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"body"},[e("nav-top",{attrs:{title:"发票抬头"},on:{backEvent:function(a){return t.$router.go(-1)}}}),e("nav-content",[e("div",{attrs:{id:"apply"},on:{click:t.close}},[e("div",{staticClass:"publicInvoice"},[e("van-radio-group",{staticClass:"radioBtn",model:{value:t.typeObj.titleType,callback:function(a){t.$set(t.typeObj,"titleType",a)},expression:"typeObj.titleType"}},[e("div",{staticClass:"radioBtnDiv"},[e("van-radio",{attrs:{name:4,"checked-color":"#f44"}},[t._v("个人/非企业单位")]),e("van-radio",{attrs:{name:5,"checked-color":"#f44"}},[t._v("企业")])],1)])],1),4==t.typeObj.titleType?e("div",{staticClass:"publicInvoice"},[e("van-cell-group",{staticStyle:{position:"relative"}},[e("van-field",{staticClass:"paragraph",attrs:{label:"发票抬头",placeholder:"请输入发票抬头"},on:{input:t.monitor},model:{value:t.paramsPersonData.title,callback:function(a){t.$set(t.paramsPersonData,"title","string"===typeof a?a.trim():a)},expression:"paramsPersonData.title"}}),e("div",{class:{divPut:1==t.dropDown,nothing:0==t.dropDown}},[e("div",{staticClass:"divPut1"}),e("div",{staticClass:"divPut2"},[e("ul",t._l(t.isText,(function(a,s){return t.dropDown?e("li",{on:{click:function(e){return t.detailData(a)}}},[t._v(t._s(a.title))]):t._e()})),0)])])],1),e("van-cell-group",[e("van-field",{attrs:{label:"邮箱",placeholder:"输入邮箱"},model:{value:t.paramsPersonData.userEmail,callback:function(a){t.$set(t.paramsPersonData,"userEmail","string"===typeof a?a.trim():a)},expression:"paramsPersonData.userEmail"}}),e("van-field",{attrs:{label:"手机号",placeholder:"输入手机号",type:"number"},model:{value:t.paramsPersonData.userPhone,callback:function(a){t.$set(t.paramsPersonData,"userPhone","string"===typeof a?a.trim():a)},expression:"paramsPersonData.userPhone"}})],1),"history"!=this.$route.params.fromPage?e("van-cell-group",[e("div",{staticClass:"taiBtn"},[e("span",[t._v("设置默认抬头")]),e("van-switch",{attrs:{"active-color":"#f44",size:"24px"},model:{value:t.paramsPersonData.defaults,callback:function(a){t.$set(t.paramsPersonData,"defaults",a)},expression:"paramsPersonData.defaults"}})],1)]):t._e()],1):t._e(),5==t.typeObj.titleType?e("div",{staticClass:"publicInvoice"},[e("van-cell-group",{staticStyle:{position:"relative"}},[e("van-field",{staticClass:"paragraph",attrs:{label:"发票抬头",placeholder:"请输入发票抬头"},on:{input:t.monitor},model:{value:t.paramsData.title,callback:function(a){t.$set(t.paramsData,"title","string"===typeof a?a.trim():a)},expression:"paramsData.title"}}),e("div",{class:{divPut:1==t.dropDown,nothing:0==t.dropDown}},[e("div",{staticClass:"divPut1"}),e("div",{staticClass:"divPut2"},[e("ul",t._l(t.isText,(function(a,s){return t.dropDown?e("li",{on:{click:function(e){return t.detailData(a)}}},[t._v(t._s(a.title))]):t._e()})),0)])]),e("van-cell-group",[e("van-field",{attrs:{label:"税号",placeholder:"请输入税号"},model:{value:t.paramsData.orgTaxNo,callback:function(a){t.$set(t.paramsData,"orgTaxNo",a)},expression:"paramsData.orgTaxNo"}}),e("van-field",{attrs:{label:"邮箱",placeholder:"输入邮箱"},model:{value:t.paramsData.userEmail,callback:function(a){t.$set(t.paramsData,"userEmail","string"===typeof a?a.trim():a)},expression:"paramsData.userEmail"}}),e("van-field",{attrs:{label:"手机号",placeholder:"输入手机号",type:"tel"},model:{value:t.paramsData.userPhone,callback:function(a){t.$set(t.paramsData,"userPhone","string"===typeof a?a.trim():a)},expression:"paramsData.userPhone"}})],1)],1)],1):t._e(),5==t.typeObj.titleType?e("div",{staticClass:"publicInvoice"},[e("van-cell-group",[e("div",{staticClass:"openBox"},[e("div",{staticClass:"openBox1"},[e("span",[t._v("更多信息")]),e("span",[t._v("开户行和账号等（非必填）")])]),e("div",{on:{click:function(a){t.openView=!t.openView}}},[e("span",{staticClass:"span"},[t._v(t._s(t.openView?"展开":"收起"))])])]),t.openView?t._e():e("div",[e("van-field",{attrs:{label:"地址",placeholder:"请输入地址"},model:{value:t.paramsData.companyAddress,callback:function(a){t.$set(t.paramsData,"companyAddress",a)},expression:"paramsData.companyAddress"}}),e("van-field",{attrs:{label:"电话"},model:{value:t.paramsData.telephone,callback:function(a){t.$set(t.paramsData,"telephone","string"===typeof a?a.trim():a)},expression:"paramsData.telephone"}}),e("van-field",{attrs:{label:"开户行",placeholder:"请输入开户行"},model:{value:t.paramsData.openingBank,callback:function(a){t.$set(t.paramsData,"openingBank",a)},expression:"paramsData.openingBank"}}),e("van-field",{attrs:{label:"账户",placeholder:"请输入账户"},model:{value:t.paramsData.bankAccount,callback:function(a){t.$set(t.paramsData,"bankAccount",a)},expression:"paramsData.bankAccount"}})],1)])],1):t._e(),5==t.typeObj.titleType&&"history"!=this.$route.params.fromPage?e("div",{staticClass:"publicInvoice"},[e("van-cell-group",[e("div",{staticClass:"taiBtn"},[e("span",[t._v("设置默认抬头")]),e("van-switch",{attrs:{"active-color":"#f44",size:"24px"},model:{value:t.paramsData.defaults,callback:function(a){t.$set(t.paramsData,"defaults",a)},expression:"paramsData.defaults"}})],1)])],1):t._e(),2==t.$store.state.webtype?e("div",{staticClass:"publicInvoice",on:{click:t.exportInvoice}},[e("van-cell-group",[e("div",{staticClass:"taiBtn"},[e("span",[t._v("选择微信发票抬头")]),e("span",{staticClass:"img iconfont mall-gengduojiantou"})])])],1):t._e(),e("div",{staticClass:"answer theme_bg_red",on:{click:t.commit}},[t._v(t._s("history"!=this.$route.params.fromPage?"保存":"提交"))])])])],1)},i=[],n=(e("e7e5"),e("d399")),o=(e("4795"),e("a9e3"),e("da71"),e("5b7e")),r=e("084c"),p={name:"",mixins:[r["a"]],data:function(){return{result:[],list:[],radio:"",checked:!1,companyAddress:"",userEmail:"",orgTaxNo:"",idDetail:"",title:"",openView:!0,openingBank:"",userPhone:"",bankAccount:"",people:"",opentext:"展开",typeObj:{titleType:5},paramsPersonData:{titleType:4},paramsData:{titleType:5},open:"",dropDown:!1,detailObj:{},isText:[],titleId:"",type:"",userInvoiceHeadModels:[],userId:""}},created:function(){var t=this;t.titleId=t.$route.query.id?t.$route.query.id:t.$route.params.userInvoiceHeadId,t.type=t.$route.query.type?t.$route.query.type:t.$route.params.type,t.userId=t.$store.state.userInfo.userId,1==t.type?(t.typeObj.titleType=4,t.loadData()):t.typeObj.titleType=5,/Android/gi.test(navigator.userAgent)&&window.addEventListener("resize",(function(){"INPUT"!=document.activeElement.tagName&&"TEXTAREA"!=document.activeElement.tagName||window.setTimeout((function(){document.activeElement.scrollIntoViewIfNeeded()}),0)}))},mounted:function(){},methods:{exportInvoice:function(){var t=this;o["a"].getWechatSignature((function(a){a&&o["a"].wxinvoice((function(a){var e=JSON.parse(a.choose_invoice_title_info)||{};t.typeObj.titleType=Number(e.type),1==t.typeObj.titleType?(t.typeObj.titleType=4,t.paramsPersonData.titleType=4,t.paramsPersonData.title=e.title,t.paramsPersonData.orgTaxNo=e.taxNumber):0==t.typeObj.titleType&&(t.typeObj.titleType=5,t.paramsData.titleType=5,t.paramsData.title=e.title,t.paramsData.orgTaxNo=e.taxNumber,t.paramsData.companyAddress=e.companyAddress,t.paramsData.telephone=e.telephone,t.paramsData.openingBank=e.bankName,t.paramsData.bankAccount=e.bankAccount)}))}))},loadData:function(){var t=this,a={token:this.$store.state.login.token,id:this.titleId};t.soudetailData(a).then((function(a){a.data.result&&(a.data.data.defaults=1==a.data.data.defaults,t.typeObj.titleType=a.data.data.titleType,4==t.typeObj.titleType?t.paramsPersonData=a.data.data:5==t.typeObj.titleType&&(t.paramsData=a.data.data))}))},close:function(){this.dropDown=!1},monitor:function(t){var a=this,e={token:this.$store.state.login.token,title:t};a.souData(e).then((function(t){t.data.data.length>0?(a.isText=t.data.data,a.dropDown=!0):a.dropDown=!1})),t||(4==a.typeObj.titleType?a.paramsPersonData={}:5==a.typeObj.titleType&&(a.paramsData={}))},detailData:function(t){var a=this;4==t.titleType?(a.typeObj.titleType=4,a.paramsData={},a.paramsPersonData=t):5==t.titleType&&(a.typeObj.titleType=5,a.paramsPersonData={},a.paramsData=t)},commit:function(){var t=this,a=this,e={token:this.$store.state.login.token};if(4==a.typeObj.titleType?(a.paramsPersonData.titleType=4,Object.assign(e,a.paramsPersonData)):5==a.typeObj.titleType&&(a.paramsData.titleType=5,Object.assign(e,a.paramsData)),e.defaults=e.defaults?1:0,e.title)if(5!=e.titleType||e.orgTaxNo)if(e.userEmail||e.userPhone)if(!e.userPhone||/^1(3|4|5|6|7|8|9)\d{9}$/.test(e.userPhone)){var s=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;if(!e.userEmail||s.test(e.userEmail)){if(5==e.titleType){if(e.telephone&&!/^0\d{2,3}-\d{7,8}$/.test(e.telephone)&&!/^1(3|4|5|7|8|9)\d{9}$/.test(e.telephone))return void Object(n["a"])({message:"请输入正确的电话号",duration:2e3})}if("history"==this.$route.params.fromPage){var i=this,o=Object.assign({title:e.title,orgTaxNo:e.orgTaxNo,companyAddress:e.companyAddress,openingBank:e.openingBank,bankAccount:e.bankAccount,phone:e.userPhone,titleEmail:e.userEmail,mobile:e.telephone,titleType:e.titleType,token:this.$store.state.login.token},this.$route.params);delete o.type,delete o.fromPage,this.$Loading.open(),i.refundData(o).then((function(a){t.$Loading.close(),"success"===a.data.result?(i.userInvoiceHeadId={},n["a"].success("退票成功"),i.loadData()):Object(n["a"])(a.data.info)})),i.$router.go(-1)}else this.$Loading.open(),a.commitData(e).then((function(e){t.$Loading.close(),"success"===e.data.result?(n["a"].success("保存成功"),"recharge"===t.$route.query.fromPage?0==a.type?a.$router.go(-1):a.$router.go(-2):0==a.type?a.$router.go(-1):a.$router.go(-3)):Object(n["a"])(e.data.info)}))}else Object(n["a"])({message:"请输入正确的邮箱",duration:2e3})}else Object(n["a"])({message:"请输入正确的手机号",duration:2e3});else Object(n["a"])({message:"请输入邮箱或者手机号",duration:2e3});else Object(n["a"])({message:"请输入税号",duration:2e3});else Object(n["a"])({message:"请输入发票抬头",duration:2e3})},back:function(){var t=this;t.$router.go(-1)}}},l=p,c=(e("89270"),e("0c7c")),u=Object(c["a"])(l,s,i,!1,null,"018a759a",null);a["default"]=u.exports},89270:function(t,a,e){"use strict";e("f3ea")},f3ea:function(t,a,e){}}]);
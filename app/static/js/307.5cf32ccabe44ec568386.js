(window.webpackJsonp=window.webpackJsonp||[]).push([[307],{"9Uld":function(t,i,e){"use strict";e.r(i);var a={data:function(){return{switchBarType:2,switchBar:[{name:"配送",type:2},{name:"自提",type:1}],clickOil:!1,buyBillResults:!0,tradeStyle:"",oilName:"",oilCard:"",oilNum:"",tradeAddress:"",people:"",phone:"",appointmentOilDetails:""}},mounted:function(){this.appointmentOilDetails=JSON.parse(this.$route.query.appointmentOilDetails),this.switchBarType=this.appointmentOilDetails.deliveryType},methods:{openOtherGrabBill:function(){this.$router.go(-2)}},components:{TipsPopup:e("lTco").a}},s=(e("OTH5"),e("KHd+")),n=Object(s.a)(a,(function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("div",{staticClass:"oil-sale-container"},[a("nav-top",{attrs:{title:"预约提油"},on:{backEvent:function(i){return t.$router.go(-1)}}}),t._v(" "),a("nav-content",{staticClass:"buy-bill-results-container"},[a("div",{staticClass:"buy-bill-results-content"},[a("div",{staticClass:"bill-results"},[a("img",{attrs:{src:e("ASxQ"),alt:""}}),t._v(" "),a("div",{staticClass:"text"},[t._v("预约信息提交成功！等待后台确认")])]),t._v(" "),a("div",{staticClass:"buy-bill"},[a("div",{staticClass:"table-view"},[a("div",{staticClass:"table-view-cell"},[a("div",{staticClass:"table-view-cell-text"},[a("ul",{staticClass:"details-list"},[a("li",{staticClass:"details-item"},[a("div",{staticClass:"left"},[t._v("配送方式")]),t._v(" "),a("div",{staticClass:"right"},[a("div",{staticClass:"switch-bar"},t._l(t.switchBar,(function(i){return a("div",{staticClass:"switch-bar-item",class:[i.type===t.switchBarType?"theme_bg_blue theme_font_white active":""]},[t._v(t._s(i.name)+"\n                      ")])})),0)])]),t._v(" "),a("li",{staticClass:"details-item"},[a("div",{staticClass:"left"},[t._v("油品名称")]),t._v(" "),a("div",{staticClass:"right"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.appointmentOilDetails.matertialName,expression:"appointmentOilDetails.matertialName"}],attrs:{type:"text",disabled:"",placeholder:"请选择自提油品"},domProps:{value:t.appointmentOilDetails.matertialName},on:{input:function(i){i.target.composing||t.$set(t.appointmentOilDetails,"matertialName",i.target.value)}}})]),t._v(" "),a("TipsPopup")],1),t._v(" "),a("li",{staticClass:"details-item"},[a("div",{staticClass:"left"},[t._v("提油卡号")]),t._v(" "),a("div",{staticClass:"right"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.appointmentOilDetails.oilCardNo,expression:"appointmentOilDetails.oilCardNo"}],attrs:{type:"text",disabled:"",placeholder:"请选择提油卡"},domProps:{value:t.appointmentOilDetails.oilCardNo},on:{input:function(i){i.target.composing||t.$set(t.appointmentOilDetails,"oilCardNo",i.target.value)}}})]),t._v(" "),a("TipsPopup")],1),t._v(" "),a("li",{staticClass:"details-item"},[a("div",{staticClass:"left"},[t._v("提油数量")]),t._v(" "),a("div",{staticClass:"right"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.appointmentOilDetails.tonnes,expression:"appointmentOilDetails.tonnes"}],attrs:{type:"text",placeholder:"请输入提油数(t)"},domProps:{value:t.appointmentOilDetails.tonnes},on:{input:function(i){i.target.composing||t.$set(t.appointmentOilDetails,"tonnes",i.target.value)}}})])]),t._v(" "),2==t.switchBarType?a("li",{staticClass:"details-item"},[a("div",{staticClass:"left"},[t._v("配送地址")]),t._v(" "),a("div",{staticClass:"right"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.appointmentOilDetails.deliveryAddress,expression:"appointmentOilDetails.deliveryAddress"}],staticClass:"address",attrs:{type:"text",disabled:"",placeholder:"请选择配送地址"},domProps:{value:t.appointmentOilDetails.deliveryAddress},on:{input:function(i){i.target.composing||t.$set(t.appointmentOilDetails,"deliveryAddress",i.target.value)}}})])]):t._e(),t._v(" "),1==t.switchBarType?a("li",{staticClass:"details-item"},[a("div",{staticClass:"left"},[t._v("自提油库")]),t._v(" "),a("div",{staticClass:"right"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.appointmentOilDetails.pickUpOilDepotName,expression:"appointmentOilDetails.pickUpOilDepotName"}],attrs:{type:"text",disabled:"",placeholder:"请选择自提油库"},domProps:{value:t.appointmentOilDetails.pickUpOilDepotName},on:{input:function(i){i.target.composing||t.$set(t.appointmentOilDetails,"pickUpOilDepotName",i.target.value)}}})]),t._v(" "),a("TipsPopup")],1):t._e(),t._v(" "),a("li",{staticClass:"details-item"},[a("div",{staticClass:"left"},[t._v("收货人")]),t._v(" "),a("div",{staticClass:"right"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.appointmentOilDetails.consignee,expression:"appointmentOilDetails.consignee"}],attrs:{type:"text",disabled:"",placeholder:"请输入提货人"},domProps:{value:t.appointmentOilDetails.consignee},on:{input:function(i){i.target.composing||t.$set(t.appointmentOilDetails,"consignee",i.target.value)}}})])]),t._v(" "),a("li",{staticClass:"details-item"},[a("div",{staticClass:"left"},[t._v("联系方式")]),t._v(" "),a("div",{staticClass:"right"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.appointmentOilDetails.consigneePhone,expression:"appointmentOilDetails.consigneePhone"}],attrs:{type:"text",disabled:"",placeholder:"请输入联系方式"},domProps:{value:t.appointmentOilDetails.consigneePhone},on:{input:function(i){i.target.composing||t.$set(t.appointmentOilDetails,"consigneePhone",i.target.value)}}})])])])])])])])])])],1)}),[],!1,null,"7f4b83eb",null);i.default=n.exports},ASxQ:function(t,i){t.exports="data:image/png;base64,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"},OTH5:function(t,i,e){"use strict";var a=e("w8Aj");e.n(a).a},ey8M:function(t,i,e){},lTco:function(t,i,e){"use strict";var a=e("L2JU"),s=Object.assign||function(t){for(var i=1;i<arguments.length;i++){var e=arguments[i];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a])}return t},n={data:function(){return{columns:[],showOil:!1}},props:{isOpenPopup:{type:Boolean,default:!1},title:{type:String,default:"选择油库"}},mounted:function(){},methods:{onCancel:function(){this.showOil=!1},onConfirm:function(t,i){this.showOil=!1,this.$emit("getOilInfo",t),this.$emit("getOilNameNum",t),this.$emit("getOilCard",t)},openPopup:function(){1==this.isOpenPopup?this.showOil=!0:this.showOil=!1},queryPickUpDepot:function(){var t=this;this.$request.post("/app/json/app_oil_sale/queryPickUpDepot",{vipUnitUserCode:this.vipUnitUser.vipUnitUserId}).then((function(i){if(0===i.status){var e=[];i.data.map((function(t){return e.push({text:t.name,code:t.code}),e})),t.columns=e,t.$emit("getPickUpDepot",e)}else t.$Toast(i.info?i.info:"获取自提油库失败")}))},appQueryTakeOilCardList:function(){var t=this;this.$request.post("/app/json/app_oil_appoint/appQueryTakeOilCardList",{vipUnitUserCode:this.vipUnitUser.vipUnitUserId}).then((function(i){if(0===i.status){var e=[];i.data.map((function(t){return e.push({text:t.userCard}),e})),t.columns=e}else t.$Toast(i.info?i.info:"获取提油卡失败")})).catch((function(t){console.log(t)}))},appQueryTakeOilNameList:function(){var t=this;this.$request.post("/app/json/app_oil_appoint/appQueryTakeOilNameList",{vipUnitUserCode:this.vipUnitUser.vipUnitUserId}).then((function(i){if(0===i.status){var e=[];i.data.map((function(t){return e.push({text:t.oilname}),e})),t.columns=e}else t.$Toast(i.info?i.info:"获取油品名称失败")})).catch((function(t){console.log(t)}))}},computed:s({},Object(a.c)(["vipUnitUser"])),components:{}},l=(e("xQ2Z"),e("KHd+")),o=Object(l.a)(n,(function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",[e("div",{staticClass:"icon-info",on:{click:t.openPopup}},[t._m(0)]),t._v(" "),e("van-popup",{attrs:{position:"bottom"},model:{value:t.showOil,callback:function(i){t.showOil=i},expression:"showOil"}},[e("van-picker",{attrs:{"show-toolbar":"",title:t.title,columns:t.columns},on:{cancel:t.onCancel,confirm:t.onConfirm}})],1)],1)}),[function(){var t=this.$createElement,i=this._self._c||t;return i("span",{staticClass:"icon"},[i("img",{attrs:{width:"20px",height:"20px",src:"static/image/mall2/area.png"}})])}],!1,null,"638721b8",null);i.a=o.exports},w8Aj:function(t,i,e){},xQ2Z:function(t,i,e){"use strict";var a=e("ey8M");e.n(a).a}}]);
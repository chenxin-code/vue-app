(window.webpackJsonp=window.webpackJsonp||[]).push([[884],{XRt9:function(t,a,i){"use strict";var s=i("qRgr");i.n(s).a},bHUh:function(t,a,i){"use strict";i.r(a);var s={data:function(){return{isShowPromptPopup:!1,isShowContractPopup:!1,prodList:[],selectProd:{skuId:NaN},packageInfo:{},isShowSetPickupConfirm:!1}},created:function(){if(this.$route.params.packageInfo){var t=JSON.parse(this.$route.params.packageInfo);t.packageRefuelList instanceof Array&&t.packageRefuelList.length>0&&t.packageRefuelList.forEach((function(t){JSON.parse(t.proDetail)instanceof Array?t.proDetail=JSON.parse(t.proDetail)[0]:t.proDetail=JSON.parse(t.proDetail)})),this.packageInfo=t,console.log(JSON.parse(JSON.stringify(this.packageInfo)))}},mounted:function(){},methods:{changeDeliver:function(t){0==t.proDetail.deliverType?t.proDetail.deliverType=1:t.proDetail.deliverType=0},choseProd:function(t){this.selectProd=t},straightwayApprove:function(){var t=this;this.$Loading.open(),this.$http.post("/app/json/app_package_refuel/canJoinContract",{}).then((function(a){t.$Loading.close();var i=a.data;0==i.status?i.data.hasWaitAward?t.isShowPromptPopup=!0:t.isShowContractPopup=!0:t.$Toast(i.info)})).catch((function(a){t.$Loading.close(),t.$Toast("canJoinContract err "+a)}))},popupConfirmApprove:function(){this.selectProd.id?"EASYCARD"==this.selectProd.proType?(window.localStorage.setItem("packageProDetail",JSON.stringify(this.selectProd.proDetail)),this.$router.replace({path:"/recharge/recharge-card",query:{isFromPackage:1,packageRefuelId:this.selectProd.id,bundleName:this.packageInfo.name}})):this.$store.state.mall2.zitiAddress.id?this.$router.replace({path:"/fill-order",query:{productInfo:JSON.stringify(this.selectProd.proDetail),packageRefuelId:this.selectProd.id,bundleName:this.packageInfo.name}}):this.isShowSetPickupConfirm=!0:this.$Toast("请选择合约")}}},e=(i("XRt9"),i("KHd+")),o=Object(e.a)(s,(function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("div",{staticClass:"container"},[i("nav-top",{on:{backEvent:function(a){return t.$router.go(-1)}}}),t._v(" "),i("nav-content",[t._e(),t._v(" "),i("div",{staticClass:"content"},[i("div",{staticClass:"info"},[i("p",{staticClass:"title"},[t._v("套餐合约信息")]),t._v(" "),i("div",{staticClass:"text",domProps:{innerHTML:t._s(t.packageInfo.desc)}})])]),t._v(" "),i("van-button",{staticClass:"btm-btn",attrs:{color:"#F02C2D",type:"primary"},on:{click:t.straightwayApprove}},[t._v("立即签约")])],1),t._v(" "),i("van-popup",{staticClass:"prompt-popup",model:{value:t.isShowPromptPopup,callback:function(a){t.isShowPromptPopup=a},expression:"isShowPromptPopup"}},[i("p",{staticClass:"title"},[t._v("温馨提示")]),t._v(" "),i("p",{staticClass:"prompt-text"},[t._v("抱歉，检测到您的账号存在待激活的油滴，需激活完成后方可开通")]),t._v(" "),i("van-button",{staticClass:"reset-btn",attrs:{color:"#fff",type:"primary"},on:{click:function(a){t.isShowPromptPopup=!1}}},[t._v("取消")])],1),t._v(" "),i("van-popup",{staticClass:"contract-popup",attrs:{position:"bottom","close-on-click-overlay":!1},model:{value:t.isShowContractPopup,callback:function(a){t.isShowContractPopup=a},expression:"isShowContractPopup"}},[i("van-icon",{staticClass:"close-btn",attrs:{name:"cross"},on:{click:function(a){t.isShowContractPopup=!1}}}),t._v(" "),i("p",{staticClass:"title"},[t._v("合约列表")]),t._v(" "),i("ul",{staticClass:"product-list"},t._l(t.packageInfo.packageRefuelList,(function(a,s){return i("li",{key:s,staticClass:"item",on:{click:function(i){return t.choseProd(a)}}},[i("div",{staticClass:"left-radio"},[t.selectProd.id==a.id?i("van-icon",{staticClass:"select",attrs:{name:"checked"}}):i("van-icon",{staticClass:"unselect",attrs:{name:"circle"}})],1),t._v(" "),i("div",{staticClass:"right-content"},[i("div",{staticClass:"top-title"},[i("p",{staticClass:"contract-name"},[t._v(t._s(a.name))]),t._v(" "),"EASYCARD"==a.proType?i("div",{staticClass:"prod-type"},[t._v("线上充值")]):1==a.proDetail.deliverType?i("div",{staticClass:"prod-type"},[t._v("自提")]):2==a.proDetail.deliverType?i("div",{staticClass:"prod-type"},[t._v("配送")]):i("div",{staticClass:"prod-type"},[i("div",{staticClass:"switch-deliver",on:{click:function(i){return i.stopPropagation(),t.changeDeliver(a)}}},[i("span",{class:{active:0==a.deliverType}},[t._v("配送")]),t._v(" "),i("span",{class:{active:1==a.deliverType}},[t._v("自提")])])])]),t._v(" "),i("div",{staticClass:"btm-prod-info"},[i("div",{staticClass:"left-img"},[i("img",{attrs:{src:a.pic,alt:""}})]),t._v(" "),i("div",{staticClass:"right"},[i("p",{staticClass:"name"},[t._v(t._s("EASYCARD"==a.proType?a.proDetail.name:a.proDetail.skuName))]),t._v(" "),i("div",{staticClass:"price-info"},[i("p",{staticClass:"price"},[t._v("售价："+t._s("EASYCARD"==a.proType?t.$util.toDecimal2(a.proDetail.minRechargeAmount):t.$util.toDecimal2(a.proDetail.salePrice))+"元")]),t._v(" "),i("p",{staticClass:"back-price"},[t._v("返利："+t._s(t.$util.toDecimal2(a.proDetail.rebate))+"元")])])])])])])})),0),t._v(" "),i("van-button",{staticClass:"btm-btn",attrs:{color:"#F02C2D",type:"primary"},on:{click:t.popupConfirmApprove}},[t._v("立即签约")])],1),t._v(" "),i("van-popup",{staticClass:"has-meal-popup",model:{value:t.isShowSetPickupConfirm,callback:function(a){t.isShowSetPickupConfirm=a},expression:"isShowSetPickupConfirm"}},[i("p",{staticClass:"content"},[t._v("当前登录人未维护自提点，不可购买商品！")]),t._v(" "),i("div",{staticClass:"btn-container"},[i("van-button",{staticClass:"cancel-btn",attrs:{color:"#fff",type:"primary"},on:{click:function(a){t.isShowSetPickupConfirm=!1}}},[t._v("取消")]),t._v(" "),i("van-button",{staticClass:"confirm-btn",attrs:{color:"#F02C2D",type:"primary"},on:{click:function(a){t.isShowSetPickupConfirm=!1}}},[t._v("现在设置")])],1)])],1)}),[],!1,null,"6538d88e",null);a.default=o.exports},qRgr:function(t,a,i){}}]);
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c1d4b0a6"],{58991:function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"btn-product",style:t.getFloatUp},[a("div",{staticClass:"content-div"},[a("div",{staticClass:"left-btn",class:t.hotareaClass({idCode:t.moduleData.idCode+"leftBtnEvent"}),style:t.getLeftBtnStyle,on:{click:function(e){t.hotEvent("leftBtnEvent"),t.leftBtnEvent()}}},[a("img",{attrs:{src:t.moduleData.leftBtnImg}})]),a("div",{staticClass:"btn-label",class:t.hotareaClass({idCode:t.moduleData.idCode+"buyEvent"}),style:t.getSidesStyle,on:{click:function(e){t.hotEvent("buyEvent"),t.buyEvent()}}},[a("span",[t._v(t._s(t.getLabelText))]),a("span",{staticClass:"line-text"},[t._v(t._s(t.moduleData.lineText))])])]),t.moduleData.showAgreement?a("div",{staticClass:"agreement"},[a("van-checkbox",{attrs:{"icon-size":"16px"},model:{value:t.checked,callback:function(e){t.checked=e},expression:"checked"}}),a("div",{staticClass:"text",class:t.hotareaClass({idCode:t.moduleData.idCode+"toAgreement"}),on:{click:function(e){t.hotEvent("toAgreement"),t.toAgreement()}}},[t._v(t._s(t.moduleData.agreementText))])],1):t._e()])},n=[],s=a("5530"),i=(a("ac1f"),a("5319"),a("4795"),a("75bd")),c=a("2f62"),r=a("289d"),d=a("03c6"),u={name:"btn-product",components:{},mixins:[d["a"]],data:function(){return{checked:!0,canEvent:!0}},props:["myIndex","usePorpData","propData"],computed:Object(s["a"])(Object(s["a"])({},Object(c["c"])(["clientWidth"])),{},{pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.pageData},moduleData:function(){return this.pageData.moduleList[this.myIndex].data},getLabelText:function(){var t=this.moduleData.labelText;return this.moduleData.product&&void 0!=this.moduleData.product.activityPrice?(t=t.replace("[price]",this.moduleData.product.activityPrice+""),t):t},getFloatUp:function(){var t="",e=this.moduleData.bgImgUrl;""!=e&&(t+="background: url('"+e+"') no-repeat center center / 100% 100%;");var a=this.moduleData.bgColor;""!=a&&(t+="background-color: "+a+";");var o=this.moduleData.floatUp;o>0&&(t+="margin-top: -"+o+"%;");var n=this.moduleData.isFloat;return n&&(-1==this.$store.state.webtype?t+="position: absolute;":t+="position: fixed;",t+="z-index: 20;left: 0;right: 0;bottom: 0;"),t},getSidesStyle:function(){var t="",e=this.moduleData.upMargin,a=this.moduleData.downMargin;e>0&&(t+="padding-top: "+e+"%;"),a>0&&(t+="padding-bottom: "+a+"%;");var o=this.moduleData.btnImage;""!=o&&(t+="background: url('"+o+"') no-repeat center center / 100% 100%;");var n=this.moduleData.labelColor;return t+="color: "+n+";",t},getLeftBtnStyle:function(){var t="",e=this.moduleData.leftBtnWidth;return e&&(t+="width: "+e+"%;"),t}}),methods:{hotEvent:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.actionBtnEvent(this.pageData.pgCode,this.moduleData.idCode+t)},leftBtnEvent:function(){this.$market.enterNav({link:this.moduleData.leftLink})},getProductDetail:function(t){var e=this;this.$Loading.open();var a=this.$market.apiBaseURL()+"/app/json/product/getAppProDetail",o={productType:t.productType,skuId:t.skuId,lng:this.$store.state.currentLocation.posx,lat:this.$store.state.currentLocation.posy,deliverType:"2"};this.$http.post(a,o).then((function(t){e.$Loading.close();var a=t.data;0==a.status?e.moduleData.product=a.data:e.$Toast(a.info)}),(function(t){e.$Loading.close(),e.$Toast("请求数据失败！")}))},buyEvent:function(){var t=this;if(-1!=this.$store.state.webtype)if(this.moduleData.showAgreement&&0==this.checked)this.$Toast("请先阅读并同意相关须知或政策");else if(this.canEvent){this.canEvent=!1,setTimeout((function(){t.canEvent=!0}),1e3);var e=this.moduleData.product;this.$Loading.open();var a={deliveryType:2,virtualUserPhone:this.$store.state.login.phone};a.carts=[{number:1,skuId:e.skuId,storeOuCode:e.storeOuCode,selfActivityId:e.activityId,checked:1,isGift:0}],this.$http.post("/app/json/app_shopping_order/submit",a).then((function(e){var a=e.data;if(0==a.status){var o=a.data||{};"4"==t.$store.state.webtype?t.$market.payEvent({payMode:305,payModeSub:305005},o.orderType,o.orderId,"/icbc/ryhysuccess").then((function(){}))["catch"]((function(){t.$Toast("支付失败！")})):"3"==t.$store.state.webtype?i["a"].payEvent({payMode:210,payModeSub:210005},o.orderType,o.orderId,"/icbc/ryhysuccess").then((function(t){}))["catch"]((function(){t.$Toast("支付失败！")})):2==t.$store.state.webtype&&i["a"].payEvent({payMode:210,payModeSub:210002},o.orderType,o.orderId,"/icbc/ryhysuccess").then((function(t){}))["catch"]((function(){t.$Toast("支付失败！")}))}else t.$Toast(a.info);t.$Loading.close()}))}},toAgreement:function(){var t=this.moduleData.agreementValue;t&&this.$market.customPush({path:"/usercenter/agreement",query:{value:t}})}},created:function(){var t=this;-1!=this.$store.state.webtype&&this.moduleData.product&&this.getProductDetail(this.moduleData.product),r["a"].$on("productBtnEvent",(function(){t.buyEvent()}))}},l=u,p=(a("c639"),a("0c7c")),h=Object(p["a"])(l,o,n,!1,null,"7cff6de9",null);e["default"]=h.exports},c639:function(t,e,a){"use strict";a("f2939")},f2939:function(t,e,a){}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{"4ueV":function(t,e,i){},"5R0R":function(t,e,i){"use strict";var s=i("77hh");i.n(s).a},"77hh":function(t,e,i){},EztX:function(t,e,i){"use strict";var s=i("4ueV");i.n(s).a},LPSR:function(t,e,i){"use strict";var s=i("Ne4V");i.n(s).a},N5Jg:function(t,e,i){},Ne4V:function(t,e,i){},Vqiz:function(t,e,i){"use strict";var s=i("hZLh"),a=i("xZc2"),r=i("MxEj"),n=i("WQzh"),c={name:"cart-item",components:{CellSwipe:i("dqDD").CellSwipe,PriceOrder:n.a},props:["cartitem","storeitem","occuritem","isEditing","orderCategory","vipUnitUserCode"],data:function(){return{cartJS:a.a,singleActivities_2:[],curSingleActivity:null}},methods:{getDigitalDisplayName:function(t){return this.$mallCommon.accTypeToName(t,"200001")},onClose:function(t,e){switch(t){case"left":case"cell":case"outside":e.close();break;case"right":this.$emit("deleteCart",[this.cartitem]),e.close()}},initSingleActivity:function(){if(this.singleActivities_2=[],!this.cartitem.currentSelfActivity||2!=this.cartitem.currentSelfActivity.mktActivityPriceLevel&&0!==this.cartitem.currentSelfActivity.mktActivityPriceLevel?this.curSingleActivity=null:(this.curSingleActivity=this.cartitem,this.singleActivities_2.push(this.cartitem)),this.cartitem.selfActivity)for(var t=0;t<this.cartitem.selfActivity.length;t++){var e=this.cartitem.selfActivity[t],i=e.currentSelfActivity;2!=i.mktActivityPriceLevel&&0!==i.mktActivityPriceLevel||this.singleActivities_2.push(e)}},removeSingleActivity:function(){var t=[{skuId:this.cartitem.skuId,storeOuCode:this.cartitem.storeOuCode,selfActivityId:"-2"}];this.$emit("updateCart",t)},joinSingleActivity:function(t){var e=[{skuId:this.cartitem.skuId,storeOuCode:this.cartitem.storeOuCode,selfActivityId:t.mktActivityId}];this.$emit("updateCart",e)},reviseSingleActivity:function(){for(var t=this,e=[],i=0;i<this.singleActivities_2.length;i++){var s=this.singleActivities_2[i];e.push({mktActivityId:s.currentSelfActivity.mktActivityId,title:s.currentSelfActivity.mktActivityTitle+" "+s.digitalPrice+this.getDigitalDisplayName(s.acctType)+"+¥"+this.$util.toDecimal2(s.price),checked:s.currentSelfActivity.mktActivityId==this.curSingleActivity.currentSelfActivity.mktActivityId})}e.push({mktActivityId:"-2",title:"不参加兑换活动",checked:!1}),r.a.open({listData:e,sureFunc:function(e){var i=[{skuId:t.cartitem.skuId,storeOuCode:t.cartitem.storeOuCode,selfActivityId:e.mktActivityId}];t.$emit("updateCart",i)}})},deleteCartItem:function(){this.$emit("deleteCart",[this.cartitem])},enterGoodDetail:function(t){var e="/mall2/detail/"+this.$util.getDataString();this.$router.push({path:e,query:{storeOuCode:t.storeOuCode,skuId:t.skuId,lastPath:this.$route.path,productType:t.productType,activityId:this.curSingleActivity?this.curSingleActivity.currentSelfActivity.mktActivityId:"",vipUnitUserCode:this.vipUnitUserCode,orderCategory:this.orderCategory}})},setCartSel:function(t,e,i){this.$emit("setCartSel",t,e,i)},getActivityTitle:function(){for(var t=0;t<this.cartitem.activity.length;t++){var e=this.cartitem.activity[t];if(e.mktActivityId==this.cartitem.activityId)return e.mktActivityTitle}return""},getActivityTag:function(){for(var t=0;t<this.cartitem.activity.length;t++){var e=this.cartitem.activity[t];if(e.mktActivityId==this.cartitem.activityId)return e.mktActivityType}return""},getItemAmount:function(t,e){return a.a.getItemAmount(t,e)},reviseActivity:function(){for(var t=[],e=0;e<this.cartitem.activity.length;e++){var i=this.cartitem.activity[e],s=!1;this.cartitem.activityId==i.mktActivityId&&(s=!0),t.push({mktActivityId:i.mktActivityId,title:i.mktActivityTitle,checked:s})}r.a.open({listData:t,sureFunc:this.sureFunc})},sureFunc:function(t){var e=[{skuId:this.cartitem.skuId,storeOuCode:this.cartitem.storeOuCode,activityId:t.mktActivityId}];this.$emit("updateCart",e)},numBlur:function(){var t=this.cartitem.number;(t=parseInt((t-this.cartitem.saleNumBegin)/this.cartitem.saleNumStep)*this.cartitem.saleNumStep+this.cartitem.saleNumBegin)!=this.cartitem.number&&(this.cartitem.number=t,this.$Toast("输入数量不符合步幅限制，已自动调整"),this.numChange())},numChange:function(){this.$emit("numChange",this.cartitem)},getStateStr:function(){return 1==this.cartitem.state?"下架":4==this.cartitem.state?"无货":""},getFontColorClass:function(){return 1==this.cartitem.state||4==this.cartitem.state?"theme_font_gray_i":""}},created:function(){this.initSingleActivity(),this.cartitem.isGift>0&&(this.cartitem.price=0,this.cartitem.showLinePrice=!0)},watch:{cartitem:function(){this.initSingleActivity(),this.cartitem.isGift>0&&(this.cartitem.price=0,this.cartitem.showLinePrice=!0)}}},o=(i("5R0R"),i("KHd+")),l=Object(o.a)(c,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("van-swipe-cell",{staticClass:"cell-swipe",attrs:{"right-width":80,"on-close":t.onClose}},[i("div",{staticClass:"cart-item"},[i("div",{staticClass:"cart-item-sel"},[i("i",{directives:[{name:"show",rawName:"v-show",value:0==t.cartitem.isGift||t.isEditing,expression:"cartitem.isGift == 0 || isEditing "}],staticClass:"iconfont font-large",class:t.cartJS.getXZClass(t.isEditing,t.cartitem.checked,t.cartitem.dchecked),on:{click:function(e){return t.setCartSel(t.cartitem,t.storeitem,t.occuritem)}}})]),t._v(" "),i("div",{staticClass:"cell-content"},[i("div",{staticClass:"good-content"},[i("div",{staticClass:"good-img",class:{"img-samll":0!=t.cartitem.isGift}},[i("div",{staticClass:"click-div",on:{click:function(e){return e.stopPropagation(),t.enterGoodDetail(t.cartitem)}}}),t._v(" "),i("img",{attrs:{src:t.cartitem.phPictureUrl,alt:""}}),t._v(" "),1==t.cartitem.state||4==t.cartitem.state?i("div",{staticClass:"cart-item-state theme_font_white"},[t._v("\n              "+t._s(t.getStateStr())+"\n            ")]):t._e()]),t._v(" "),i("div",{staticClass:"good-detail"},[i("div",{staticClass:"good-info"},[i("p",{staticClass:"good-name line-two",class:t.getFontColorClass()},[1==t.cartitem.isGift?i("span",{staticClass:"good-tag theme_border_red  theme_font_red"},[t._v("赠品")]):t._e(),2==t.cartitem.isGift?i("span",{staticClass:"good-tag theme_border_red  theme_font_red"},[t._v("换购")]):t._e(),t._v("\n                "+t._s(t.cartitem.productName))]),t._v(" "),0==t.cartitem.isGift?i("p",{staticClass:"size theme_font_gray  single-line"},[t._v(t._s(t.cartitem.specs))]):t._e(),t._v(" "),i("div",{staticClass:"good-paras"},[i("div",{staticClass:"paras-left"},[i("PriceOrder",{attrs:{productData:t.cartitem}})],1),t._v(" "),i("div",{class:{"paras-right":0==t.cartitem.isGift&&1!=t.cartitem.state&&4!=t.cartitem.state}},[0==t.cartitem.isGift&&1!=t.cartitem.state&&4!=t.cartitem.state?i("van-stepper",{attrs:{min:t.cartitem.saleNumBegin,step:t.cartitem.saleNumStep,max:t.cartitem.saleNumMax,integer:"","disable-input":""},on:{blur:t.numBlur,change:t.numChange},model:{value:t.cartitem.number,callback:function(e){t.$set(t.cartitem,"number",e)},expression:"cartitem.number"}}):t._e(),t._v(" "),0!=t.cartitem.isGift?i("span",{staticClass:"gift-num theme_font_gray"},[t._v("x"+t._s(t.cartitem.number))]):t._e()],1)])])])]),t._v(" "),t.singleActivities_2.length>0&&null!=t.curSingleActivity&&1!=t.orderCategory?i("div",{staticClass:"good-salespro"},[i("p",{staticClass:"sa-type"},[t._v(t._s(t.curSingleActivity.currentSelfActivity.mktActivityType))]),t._v(" "),i("p",{staticClass:"sl-title single-line"},[t._v(t._s(t.curSingleActivity.currentSelfActivity.mktActivityTitle)+" "),i("span",{staticClass:"theme_standard_font"},[t._v(t._s(t.curSingleActivity.digitalPrice)+t._s(t.getDigitalDisplayName(t.curSingleActivity.acctType))+" ")]),t._v(" "),i("span",{directives:[{name:"show",rawName:"v-show",value:t.curSingleActivity.price,expression:"curSingleActivity.price"}],staticClass:"theme_standard_font"},[t._v(" + ¥"+t._s(t.$util.toDecimal2(t.curSingleActivity.price)))])]),t._v(" "),t.singleActivities_2.length>1?i("p",{staticClass:"good-salespro-right",on:{click:function(e){return t.reviseSingleActivity()}}},[t._v("修改")]):t._e(),t._v(" "),1==t.singleActivities_2.length?i("p",{staticClass:"good-salespro-right",on:{click:function(e){return t.removeSingleActivity()}}},[t._v("不参加")]):t._e()]):t._e(),t._v(" "),t._l(t.singleActivities_2,(function(e){return t.singleActivities_2.length>0&&null==t.curSingleActivity&&1!=t.orderCategory?i("div",{staticClass:"good-salespro"},[i("p",{staticClass:"sa-type"},[t._v(t._s(e.currentSelfActivity.mktActivityType))]),t._v(" "),i("p",{staticClass:"sl-title single-line"},[t._v(t._s(e.currentSelfActivity.mktActivityTitle)+" "),i("span",{staticClass:"theme_standard_font"},[t._v(t._s(e.digitalPrice)+t._s(t.getDigitalDisplayName(e.acctType)))]),t._v(" "),i("span",{directives:[{name:"show",rawName:"v-show",value:e.price,expression:"item.price"}],staticClass:"theme_standard_font"},[t._v("+ ¥"+t._s(t.$util.toDecimal2(e.price)))])]),t._v(" "),i("p",{staticClass:"good-salespro-right",on:{click:function(i){return t.joinSingleActivity(e.currentSelfActivity)}}},[t._v("参加")])]):t._e()})),t._v(" "),t.cartitem.activity.length>1&&0==t.cartitem.isGift?i("div",{staticClass:"good-salespro"},[i("p",{staticClass:"sl-tag theme_border_red_i theme_font_red"},[t._v(t._s(t.getActivityTag()))]),t._v(" "),i("p",{staticClass:"sl-title single-line"},[t._v(t._s(t.getActivityTitle()))]),t._v(" "),i("p",{staticClass:"good-salespro-right",on:{click:function(e){return t.reviseActivity()}}},[t._v("修改")])]):t._e()],2)]),t._v(" "),1!=t.cartitem.isGift?i("div",{staticClass:"del-btn",attrs:{slot:"right"},slot:"right"},[t._v("删除")]):t._e()])],1)}),[],!1,null,"c21f6840",null).exports,d=(i("LPSR"),Object(o.a)({name:"cart-item-invalid",components:{},props:["cartitem"],data:function(){return{}},methods:{},created:function(){}},(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"cart-item-invalid"},[i("div",{staticClass:"cell-content"},[i("div",{staticClass:"good-content"},[i("div",{staticClass:"good-img"},[i("img",{attrs:{src:t.cartitem.phPictureUrl,alt:""}})]),t._v(" "),i("div",{staticClass:"good-detail"},[i("div",{staticClass:"good-info"},[i("p",{staticClass:"good-name double-line theme_font_gray"},[t._v(t._s(t.cartitem.productName))]),t._v(" "),i("p",{staticClass:"size theme_font_gray single-line"},[t._v(t._s(t.cartitem.specs))]),t._v(" "),2==t.cartitem.invalidType?i("p",{staticClass:"size theme_font_red single-line"},[t._v("商品不在售卖时间")]):t._e()])])])])])}),[],!1,null,"56c41942",null).exports),u=i("Ziuy"),h=i("lH8D"),v=i("H7qB"),m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},g={name:"pay-div",props:["occuritem","isEditing"],components:{},data:function(){return{cartJS:a.a}},methods:{getTotalUnitStr:function(t){for(var e=this.$store.state.globalConfig.acctList,i=0;i<e.length;i++){var s=e[i];if(s.acctType==t)return s.displayName}return"积分"},getTotalUsePoints:function(t){var e=0;return(t.fixedDigital>0||t.payDigital>0)&&(e=parseInt(t.fixedDigital)+parseInt(t.payDigital)),e},getShowPrice:function(t){if(t.payAmount>0)return!0;for(var e=!1,i=0;i<t.digitalList.length;i++){var s=t.digitalList[i];if(this.getTotalUsePoints(s)){e=!0;break}}return!e},setOccSel:function(t){this.$emit("setOccSel",t)},toPay:function(t){localStorage.setItem("fromShoppingCar",!0),"501"==this.$route.query.productType&&(t.name="phone"),console.log(t,void 0===t?"undefined":m(t)),this.$emit("toPay",t)},toDelete:function(t){this.$emit("toDelete",t)},getTotalStr:function(){var t="";this.getShowPrice(this.occuritem)&&(t+=this.occuritem.amount);for(var e=0;e<this.occuritem.digitalList.length;e++){var i=this.occuritem.digitalList[e],s=this.getTotalUsePoints(i);s&&(s+=this.$mallCommon.getTotalUnitStr(i.acctType),t.length?t=t+"+"+s:t+=s)}return t}},created:function(){}},f=(i("EztX"),Object(o.a)(g,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"pay-div"},[i("div",{staticClass:"pay-left"},[i("div",{staticClass:"selectAll",on:{click:function(e){return t.setOccSel(t.occuritem)}}},[i("i",{staticClass:"iconfont   font-large-x",class:t.cartJS.getXZClass(t.isEditing,t.occuritem.checked,t.occuritem.dchecked)}),t._v(" "),i("span",{staticClass:"font-medium marL theme_font_black"},[t._v("全选")])]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:!t.isEditing,expression:"!isEditing"}],staticClass:"paymoney"},[i("div",[i("span",{staticClass:"theme_font_black font-large-x"},[t._v("合计:")]),t._v(" "),i("span",{directives:[{name:"show",rawName:"v-show",value:t.$mallCommon.getOccurShowPrice(t.occuritem),expression:"$mallCommon.getOccurShowPrice(occuritem)"}],staticClass:"font-large-x theme_font_red"},[t._v(t._s(t.cartJS.getItemAmount(t.occuritem.payAmount,0))+".")]),t._v(" "),i("span",{directives:[{name:"show",rawName:"v-show",value:t.$mallCommon.getOccurShowPrice(t.occuritem),expression:"$mallCommon.getOccurShowPrice(occuritem)"}],staticClass:"font-small theme_font_red"},[t._v(t._s(t.cartJS.getItemAmount(t.occuritem.payAmount,1)))]),t._v(" "),t._l(t.occuritem.digitalList,(function(e,s){return t.$mallCommon.getTotalUsePoints(e)>0?i("div",{staticClass:"digital-div"},[s!=t.$mallCommon.getFirstVartualIndex(t.occuritem)||t.$mallCommon.getOccurShowPrice(t.occuritem)?i("span",{staticClass:"font-small theme_font_red"},[t._v("+")]):t._e(),t._v(" "),i("span",{staticClass:"font-large-x theme_font_red"},[t._v(t._s(t.$mallCommon.getTotalUsePoints(e)))]),t._v(" "),i("span",{staticClass:"font-small theme_font_red"},[t._v(t._s(t.$mallCommon.getTotalUnitStr(e.acctType)))])]):t._e()}))],2),t._v(" "),i("p",{staticClass:"point theme_font_black font-small"},[t._v("总额: ￥"+t._s(t.$util.toDecimal2(t.getTotalStr()))+"    优惠:\n        ￥"+t._s(t.$util.toDecimal2(t.occuritem.discountAmount)))])])]),t._v(" "),t.isEditing?t._e():i("div",{staticClass:"pay-right theme_font_white theme_standard_bg font-large-x",on:{click:function(e){return t.toPay(t.occuritem)}}},[t._v("\n    结算 "),i("span",{staticClass:"font-small"},[t._v("("+t._s(t.cartJS.getPayNum(t.occuritem,t.isEditing))+")")])]),t._v(" "),t.isEditing?i("div",{staticClass:"pay-right theme_font_white theme_standard_bg font-large-x",on:{click:function(e){return t.toDelete(t.occuritem)}}},[t._v("\n    删除\n  ")]):t._e()])}),[],!1,null,"42648f7f",null).exports),p=i("mCA+"),y={name:"cart-list",components:{CartItem:l,Recommend:h.a,PayDiv:f,InvalidCartItem:d},props:["deliverType","isEditing","orderCategory","vipUnitUserCode","isPresale"],data:function(){return{occurArr:[],invalidCart:[],cartJS:a.a,isHasRequest:!1,heightArr:[],fixedIndex:-1,showFirstBt:!0,isX:!1}},methods:{clearInvalid:function(){var t=a.a.getInvalidArr(this.invalidCart);this.deleteCart(t)},toShop:function(t){this.$router.push({path:"/mall2/shop",query:{storeOuCode:t.storeOuCode,lastPath:this.$route.path}})},getCartRef:function(t){return"mall2cart"+t},goShopList:function(){2!=this.$store.state.webtype&&3!=this.$store.state.webtype||"/common"!=this.$route.path?this.$router.replace({path:"/common"}):location.reload()},coupon:function(t){var e=this;u.a.open({initData:{listData:t.userCanGetCoupon,storeOuCode:t.storeOuCode,skuId:"",type:"receive",categoryId:"",token:this.$store.state.login.token},selectedCoupon:function(t){u.a.close()},getedCoupon:function(t){},couponProducts:function(t){var i="/mall2/list/"+e.$util.getDataString();e.$router.push({path:i,query:{pageType:"coupon",coupon:t.couTypeCode,fromCart:"1",delivertype:e.deliverType,lastPath:e.$route.path,couFaceValue:t.couFaceValue,couThresholdAmount:t.couThresholdAmount,endTime:e.$util.getDateFromString(t.validEndDate)}}),u.a.close()}})},rightActivityClick:function(t){if(3!=t.linkType&&4!=t.linkType){var e="/mall2/list/"+this.$util.getDataString();this.$router.push({path:e,query:{pageType:"activity",activity:t.mktActivityId,fromCart:"1",delivertype:this.deliverType,skuId:t.cart[0].skuId,storeOuCode:t.cart[0].storeOuCode,lastPath:this.$route.path}})}else{var i=a.a.getGiftType(t);s.a.open({listData:t.gift,activityId:t.mktActivityId,sureFunc:this.sureFunc,giftType:i})}},sureFunc:function(t){var e=this;this.$Loading.open();var i={token:this.$store.state.login.token,carts:t,deliveryType:this.deliverType,orderCategory:this.orderCategory,vipUnitUserCode:this.vipUnitUserCode};this.$http.post("/app/json/app_cart/addCart",i).then((function(t){e.$Loading.close();var i=t.data;0==i.status?(e.$store.state.mall2.cartNum=i.data,e.$Toast("添加购物车成功！"),e.getDataList()):e.$Toast(i.info)}),(function(t){e.$Loading.close(),e.$Toast("请求数据失败！")}))},setCartSel:function(t,e,i){if(this.isEditing)a.a.setCartSel(t,this.isEditing,e,i);else{var s=[{skuId:t.skuId,storeOuCode:t.storeOuCode,checked:t.checked?0:1,activityId:t.activityId}];this.updateCart(s)}},setStoreSel:function(t,e,i){if(this.isEditing)a.a.setStoreSel(t,this.isEditing,e,i);else{var s=a.a.getSelStore(t,this.isEditing,"update");this.updateCart(s)}},setOccSel:function(t){if(this.isEditing)a.a.setOccSel(t,this.isEditing);else{var e=a.a.getSelOccur(t,this.isEditing,"update");this.updateCart(e)}},toPay:function(t){var e=this,i=a.a.getSelOccur(t,this.isEditing,"pay");if(0!=i.length){var s={token:this.$store.state.login.token,deliveryType:this.deliverType,carts:i,orderCategory:this.orderCategory,vipUnitUserCode:this.vipUnitUserCode};if(1==this.isPresale&&(s.cartType="1"),2==this.deliverType){if(""==this.$store.state.mall2.selectAddress.id||"undefined"==this.$store.state.mall2.selectAddress.id)return void this.$Toast("请先选择配送区域！");"-1"!=this.$store.state.mall2.selectAddress.id?s.userAddressId=this.$store.state.mall2.selectAddress.id:(s.userAddress={},s.userAddress.provinceId=this.$store.state.mall2.selectAddress.provinceId,s.userAddress.provinceName=this.$store.state.mall2.selectAddress.provinceName,s.userAddress.cityId=this.$store.state.mall2.selectAddress.cityId,s.userAddress.cityName=this.$store.state.mall2.selectAddress.cityName,s.userAddress.countryId=this.$store.state.mall2.selectAddress.countryId,s.userAddress.countryName=this.$store.state.mall2.selectAddress.countryName,s.userAddress.townId=this.$store.state.mall2.selectAddress.townId,s.userAddress.townName=this.$store.state.mall2.selectAddress.townName)}this.setCommonPara(s),this.$Loading.open(),this.$http.post("/app/json/app_cart/SettleCart",s).then((function(i){e.$Loading.close();var r=i.data;0==r.status?(e.occurArr=a.a.dealCartList(r.data.occur),e.isEditing&&a.a.setAllUnSel(e.occurArr),1==e.$mallCommon.isExistCanNotAttendActivity(r.data.occur)?e.$MessageBox.confirm("部分商品不能参加活动</br>将按原价购买，是否继续？","提示",{confirmButtonText:"确定"}).then((function(i){e.$router.push({name:"填写订单",params:{res:r.data,paramsData:s,deliveryType:e.deliverType,name:t.name}})})).catch((function(t){})):e.$router.push({name:"填写订单",params:{res:r.data,paramsData:s,deliveryType:e.deliverType,name:t.name}})):e.$Toast(r.info)}),(function(t){e.$Loading.close(),e.$Toast("请求数据失败！")}))}else this.$Toast("请选择要结算的商品")},toDelete:function(t){var e=a.a.getSelOccur(t,this.isEditing,"delete");this.deleteCart(e)},setCommonPara:function(t){return 2==this.deliverType?(t.provinceId=this.$store.state.mall2.selectAddress.provinceId,t.cityId=this.$store.state.mall2.selectAddress.cityId,t.countryId=this.$store.state.mall2.selectAddress.countryId):1==this.deliverType&&(t.pickupId=this.$store.state.mall2.zitiAddress.id),!0},getDataList:function(){var t=this,e={token:this.$store.state.login.token,deliveryType:this.deliverType,orderCategory:this.orderCategory,vipUnitUserCode:this.vipUnitUserCode};this.setCommonPara(e),1==this.isPresale&&(e.carts=p.a.getPros(),e.cartType="1"),this.$http.post("/app/json/app_cart/getCart",e).then((function(e){t.$Loading.close();var i=e.data;0==i.status?(t.isHasRequest=!0,t._getCartCount(),t.occurArr=a.a.dealCartList(i.data.occur),t.invalidCart=i.data.invalidCart?i.data.invalidCart:[],t.isEditing&&a.a.setAllUnSel(t.occurArr),t.$nextTick((function(){t._initScroll()}))):t.$Toast(i.info)}),(function(e){t.$Loading.close(),t.$Toast("请求数据失败！")}))},_initScroll:function(){var t=this;this.cityListScroll?(this.cityListScroll.refresh(),this.cityListScroll.off("scroll")):this.cityListScroll=new v.a(this.$refs.scrollwarp,{click:!0,probeType:3,bounce:!1});var e=this.$refs.scrollwarp.offsetHeight;if(1!=this.occurArr.length||""!=this.invalidCart){this.showFirstBt=!0;for(var i=0;i<this.occurArr.length;i++){var s=this.$refs[this.getCartRef(i)][0],a={top:s.offsetTop,height:s.offsetHeight,isFixed:!1};s.offsetHeight>e&&(a.isFixed=!0),this.heightArr.push(a)}this.cityListScroll.on("scroll",(function(i){if(i.y>5)t.fixedIndex=-1;else{var s=Math.abs(i.y);t.calculateFixedIndex(s,e)}})),this.calculateFixedIndex(0,e)}else{this.fixedIndex=0;var r=this.$refs[this.getCartRef(0)][0].offsetHeight;r<e&&(console.log(r,e),this.showFirstBt=!1)}},calculateFixedIndex:function(t,e){for(var i=!1,s=0;s<this.heightArr.length;s++){var a=this.heightArr[s],r=a.top,n=a.height,c=a.isFixed;if(t>=r&&t<=r+n){c&&t<=r+n-e&&(i=!0,this.fixedIndex=s);break}}i||(this.fixedIndex=-1)},_getCartCount:function(){var t=this,e={token:this.$store.state.login.token,deliveryType:this.deliverType,orderCategory:this.orderCategory,vipUnitUserCode:this.vipUnitUserCode};this.$http.post("/app/json/app_cart/getCartCount",e).then((function(e){var i=e.data;0==i.status?t.$store.state.mall2.cartNum=i.data:t.$Toast(i.info)}),(function(e){t.$Loading.close(),t.$Toast("请求数据失败！")}))},numChange:function(t){var e=[{skuId:t.skuId,storeOuCode:t.storeOuCode,number:t.number,isGift:t.isGift,activityId:t.activityId}];this.updateCart(e)},updateCart:function(t,e){var i=this;if(1==this.isPresale)return p.a.updateCart(t),void this.getDataList();var s={token:this.$store.state.login.token,deliveryType:this.deliverType,carts:t,orderCategory:this.orderCategory,vipUnitUserCode:this.vipUnitUserCode};this.$http.post("/app/json/app_cart/updateCart",s).then((function(t){i.$Loading.close();var s=t.data;0==s.status?(i.getDataList(),e&&e(!0)):(i.$Toast(s.info),e&&e(!1))}),(function(t){i.$Loading.close(),i.$Toast("请求数据失败！"),e&&e(!1)}))},deleteCart:function(t){var e=this;if(1==this.isPresale)return p.a.deleteCart(t),void this.getDataList();if(t.length){this.$Loading.open();var i={token:this.$store.state.login.token,deliveryType:this.deliverType,carts:t,orderCategory:this.orderCategory,vipUnitUserCode:this.vipUnitUserCode};this.$http.post("/app/json/app_cart/deleteCart",i).then((function(t){e.$Loading.close();var i=t.data;0==i.status?(e._getCartCount(),e.$Toast("删除成功"),e.getDataList()):e.$Toast(i.info)}),(function(t){e.$Loading.close(),e.$Toast("请求数据失败！")}))}else this.$Toast("请选择要删除的商品")}},watch:{isEditing:function(t,e){t&&this.occurArr&&(this.occurArr=a.a.setAllUnSel(this.occurArr))}},created:function(){console.log(this.$store.state.mall2.selectAddress),/iphone/gi.test(navigator.userAgent)&&812==screen.height&&375==screen.width?(console.log("是iphonex"),this.isX=!0):(console.log("不是iphonex"),this.isX=!1)}},C=(i("zZ1A"),Object(o.a)(y,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"cart-list"},[i("div",{directives:[{name:"show",rawName:"v-show",value:t.occurArr.length||t.invalidCart.length,expression:"occurArr.length || invalidCart.length"}],ref:"scrollwarp",staticClass:"cart-content"},[i("div",{staticClass:"scroll-content-div"},[t._l(t.occurArr,(function(e,s){return i("div",{ref:t.getCartRef(s),refInFor:!0,staticClass:"occur-div theme_bg_white"},[i("div",{staticClass:"occur-title theme_font_white theme_bg_ml_red",on:{click:function(i){return t.setOccSel(e)}}},[i("i",{staticClass:"iconfont font-large-x",class:t.cartJS.getOccClass(t.isEditing,e.checked,e.dchecked)}),t._v(" "),i("span",{staticClass:"theme_font_black"},[i("i",{staticClass:"iconfont mall-shoukuanfang"}),t._v("\n            "+t._s(e.store[0].storeName))])]),t._v(" "),t._l(e.store,(function(s,a){return i("div",{staticClass:"store-div"},[i("div",{staticClass:"store-title"},[i("div",{staticClass:"leftcontent"}),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:s.userCanGetCoupon&&s.userCanGetCoupon.length,expression:"\n                storeitem.userCanGetCoupon &&\n                storeitem.userCanGetCoupon.length\n              "}],staticClass:"rightcontent",on:{click:function(e){return t.coupon(s)}}},[i("span",[t._v("优惠券")]),t._v(" "),i("i",{staticClass:"iconfont mall-gengduo theme_font_gray font-large marL"})])]),t._v(" "),t._l(s.activity,(function(a,r){return i("div",{staticClass:"store-content"},[i("div",{staticClass:"activity-title"},[i("div",{staticClass:"leftcontent single-line"},[i("span",{staticClass:"ac-tag theme_font_white theme_bg_red"},[t._v(t._s(a.mktActivityType))]),t._v(" "),i("span",{staticClass:"ac-title theme_font_gray marL single-line"},[t._v(t._s(a.activityDiscountDesc))])]),t._v(" "),t.cartJS.getActivityRightTitle(a)?i("div",{staticClass:"rightcontent",on:{click:function(e){return t.rightActivityClick(a)}}},[i("span",{staticClass:"theme_font_red"},[t._v(t._s(t.cartJS.getActivityRightTitle(a)))]),t._v(" "),i("i",{staticClass:"iconfont mall-gengduojiantou theme_font_red font-large marL"})]):t._e()]),t._v(" "),i("div",{staticClass:"activity-content"},t._l(a.cart,(function(a,r){return i("CartItem",{key:a.skuId,attrs:{isEditing:t.isEditing,cartitem:a,occuritem:e,storeitem:s,orderCategory:t.orderCategory,vipUnitUserCode:t.vipUnitUserCode},on:{setCartSel:t.setCartSel,numChange:t.numChange,updateCart:t.updateCart,deleteCart:t.deleteCart}})})),1)])})),t._v(" "),i("div",{staticClass:"store-content marT10"},[i("div",{staticClass:"activity-content"},t._l(s.noActivityCart,(function(a,r){return i("CartItem",{key:a.skuId,attrs:{isEditing:t.isEditing,cartitem:a,occuritem:e,storeitem:s,orderCategory:t.orderCategory,vipUnitUserCode:t.vipUnitUserCode},on:{setCartSel:t.setCartSel,numChange:t.numChange,updateCart:t.updateCart,deleteCart:t.deleteCart}})})),1)])],2)})),t._v(" "),i("div",{staticClass:"pay-div-height"},[i("PayDiv",{directives:[{name:"show",rawName:"v-show",value:t.showFirstBt,expression:"showFirstBt"}],attrs:{occuritem:e,isEditing:t.isEditing},on:{setOccSel:t.setOccSel,toPay:t.toPay,toDelete:t.toDelete}})],1)],2)})),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:t.invalidCart&&t.invalidCart.length,expression:"invalidCart && invalidCart.length"}],staticClass:"occur-div theme_bg_white"},[i("div",{staticClass:"occur-title title-between theme_font_white theme_bg_ml_red"},[t._m(0),t._v(" "),i("span",{staticClass:"theme_font_tint flotr",on:{click:function(e){return e.stopPropagation(),t.clearInvalid(e)}}},[t._v("清除所有")])]),t._v(" "),i("div",{staticClass:"invalid-content"},t._l(t.invalidCart,(function(t,e){return i("InvalidCartItem",{key:e,attrs:{cartitem:t}})})),1)])],2),t._v(" "),t._l(t.occurArr,(function(e,s){return i("div",{directives:[{name:"show",rawName:"v-show",value:t.fixedIndex==s,expression:"fixedIndex == index"}],staticClass:"occur-title theme_font_white theme_bg_ml_red occur-top-fixed",on:{click:function(i){return t.setOccSel(e)}}},[i("i",{staticClass:"iconfont font-large-x",class:t.cartJS.getOccClass(t.isEditing,e.checked,e.dchecked)}),t._v(" "),i("span",{staticClass:"theme_font_black"},[i("i",{staticClass:"iconfont mall-shoukuanfang"}),t._v("\n        "+t._s(e.store[0].storeName))])])})),t._v(" "),i("div",{staticClass:"occur-bt-fixed"},[t._l(t.occurArr,(function(e,s){return i("PayDiv",{directives:[{name:"show",rawName:"v-show",value:t.fixedIndex==s,expression:"fixedIndex == index"}],key:s,staticClass:"pay-div theme_bg_white",attrs:{occuritem:e,isEditing:t.isEditing},on:{setOccSel:t.setOccSel,toPay:t.toPay,toDelete:t.toDelete}})})),t._v(" "),t.isX?i("div",{staticClass:"adapter-iphoneX"}):t._e()],2)],2),t._v(" "),t.occurArr.length||t.invalidCart.length||!t.isHasRequest?t._e():i("div",{staticClass:"nodata-content"},[i("div",{staticClass:"noCart"},[t._m(1),t._v(" "),i("p",{staticClass:"goShop theme_bg_red theme_font_white",on:{click:t.goShopList}},[t._v("\n        去购物\n      ")])]),t._v(" "),"cnooc"!=t.$store.state.globalConfig.app_home_special_flag&&1!=this.isPresale?i("div",{staticClass:"recommend-div"},[i("Recommend",{attrs:{deliverType:this.deliverType},on:{addCartFinish:t.getDataList}})],1):t._e()])])}),[function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"theme_font_black"},[e("i",{staticClass:"iconfont mall-shoukuanfang"}),this._v(" 失效的宝贝")])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"noCartTag"},[e("i",{staticClass:"iconfont mall-gouwuche btn-icon theme_font_tint"}),this._v(" "),e("p",{staticClass:"text theme_font_tint"},[this._v("您的购物车是空的,去逛逛吧！")])])}],!1,null,"d31bd744",null));e.a=C.exports},csf6:function(t,e,i){"use strict";var s=i("N4/4"),a=i("ZToj"),r=i("dRp0"),n=i("VQwz"),c=i("mfrH"),o=(i("ygAv"),{checkIsInitialLoad:function(t){"cnooc"!=a.a.state.globalConfig.app_home_special_flag?0==a.a.state.mall2.pickupAddressChecked?(a.a.state.mall2.pickupAddressChecked=!0,s.a.vuexStorage(),o.getLocation(t)):t(null):t()},getLocation:function(t){s.a.getLocation((function(e){e.city&&""!=e.city?(a.a.state.currentLocation.posx=e.longitude,a.a.state.currentLocation.posy=e.latitude,o.loadNeerPickupAddress(t)):t(null)}))},loadNeerPickupAddress:function(t){var e={posx:a.a.state.currentLocation.posx,posy:a.a.state.currentLocation.posy,page:{index:1,pageSize:1}};r.a.post("/app/json/user_address/searchSelfliftAddressList",e).then((function(e){var i=e.data;if(console.log("自提站点列表:",i),0==i.status)if(i.data&&i.data.length>0){var s=i.data[0];o.checkEqualAndDistance(s,t)}else t(null);else t(null)}),(function(e){t(null),console.log("自提站点",e)}))},checkEqualAndDistance:function(t,e){t.id!=a.a.state.mall2.zitiAddress.id&&t.distance<500?n.a.confirm("距离您最近的自提点是："+t.storeName+",是否切换到最近自提点","提示").then((function(i){console.log(i),o.reSelectPickupAddress(t,e)})).catch((function(t){e(null)})):e(null)},reSelectPickupAddress:function(t,e){a.a.state.mall2.zitiAddress=t,s.a.vuexStorage((function(){e(t)})),a.a.state.login.token&&""!=a.a.state.login.token&&(c.a._addToMyPickupAddress(t.id),c.a._setDefaultPickupAddress(t.id))}});e.a=o},"mCA+":function(t,e,i){"use strict";var s={prolist:[],savePros:function(){sessionStorage.setItem("prosale_cart_products",JSON.stringify(this.prolist))},getPros:function(){if(this.prolist.length>0)return this.prolist;var t=sessionStorage.getItem("prosale_cart_products");if(t)try{this.prolist=JSON.parse(t)}catch(t){console.error(t)}return this.prolist},getCartNum:function(){for(var t=0,e=this.getPros(),i=0;i<e.length;i++){var s=e[i];t+=parseInt(s.number)}return t},addCart:function(t){this.getPros();for(var e=0;e<t.length;e++){for(var i=t[e],s=!1,a=0;a<this.prolist.length;a++){var r=this.prolist[a];if(r.skuId==i.skuId){s=!0,r.number+=i.number;break}}0==s&&this.prolist.push(i)}this.savePros()},updateCart:function(t){this.getPros();for(var e=0;e<t.length;e++){for(var i=t[e],s=!1,a=0;a<this.prolist.length;a++){var r=this.prolist[a];if(r.skuId==i.skuId){for(var n in s=!0,i)r[n]=i[n];break}}0==s&&this.prolist.push(i)}return this.savePros(),this.prolist},deleteCart:function(t){this.getPros();for(var e=[],i=0;i<this.prolist.length;i++){for(var s=this.prolist[i],a=!1,r=0;r<t.length;r++){var n=t[r];if(s.skuId==n.skuId){a=!0;break}}0==a&&e.push(s)}return this.prolist=e,this.savePros(),this.prolist},getSettlePros:function(){for(var t=this.getPros(),e=[],i=0;i<t.length;i++){var s=t[i];1==s.check&&e.push(s)}return e}};e.a=s},xZc2:function(t,e,i){"use strict";var s=i("oCYn"),a=i("ygAv"),r=i("ZToj"),n=i("MCgc"),c={getTopArr:function(){var t=[{name:"配送",type:2,hasShow:!1,class:"mall-peisong",occurArr:[]}];if("cnooc"==r.a.state.globalConfig.app_home_special_flag){var e=n.b.returnCnoocDeliveryType();"2"!=e&&""!=e||(r.a.state.mall2.staticDeliverType=2,t=[{name:"配送",type:2,hasShow:!1,class:"mall-peisong",occurArr:[]}])}return t},dealCartList:function(t){for(var e=0;e<t.length;e++){var i=t[e];i.checked=!0;for(var s=0;s<i.store.length;s++){var a=i.store[s];a.checked=this.judgeStoreIsSel(a,!1),a.checked||(i.checked=!1);for(var r=a.activity,n=0;n<r.length;n++){var c=r[n];c.number=this.getActivityNum(c)}}}return t},getActivityNum:function(t){for(var e=0,i=0;i<t.cart.length;i++){var s=t.cart[i];0==s.isGift&&1==s.checked&&(e+=s.number)}return e},judgeStoreIsSel:function(t,e){for(var i=this.getCheckKey(e),s=0;s<t.activity.length;s++)for(var a=t.activity[s],r=0;r<a.cart.length;r++)if(!a.cart[r][i])return!1;for(var n=0;n<t.noActivityCart.length;n++)if(!t.noActivityCart[n][i])return!1;return!0},getItemAmount:function(t,e){var i=a.a.toDecimal2(t).split(".");return i.length>e?i[e]:"00"},getXZClass:function(t,e,i){return t?i?"mall-xuanzhong theme_standard_font":"mall-weixuanzhong theme_font_gray":e?"mall-xuanzhong theme_standard_font":"mall-weixuanzhong theme_font_gray"},getOccClass:function(t,e,i){return t?i?"mall-xuanzhong theme_standard_font":"mall-weixuanzhong theme_font_gray":e?"mall-xuanzhong theme_standard_font":"mall-weixuanzhong theme_font_gray"},setAllUnSel:function(t){for(var e=0;e<t.length;e++){var i=t[e];s.default.set(i,"dchecked",!1);for(var a=0;a<i.store.length;a++){var r=i.store[a];s.default.set(r,"dchecked",!1);for(var n=0;n<r.activity.length;n++)for(var c=r.activity[n],o=0;o<c.cart.length;o++){var l=c.cart[o];s.default.set(l,"dchecked",!1)}for(var d=0;d<r.noActivityCart.length;d++){var u=r.noActivityCart[d];s.default.set(u,"dchecked",!1)}}}return t},setOccSel:function(t,e){var i=this.getCheckKey(e);t[i]=!t[i];for(var s=0;s<t.store.length;s++){var a=t.store[s];this.setStoreSel(a,e,t[i])}},setStoreSel:function(t,e,i,s){var a=this.getCheckKey(e);null==i&&(i=!t[a]),t[a]=i;for(var r=0;r<t.activity.length;r++)for(var n=t.activity[r],c=0;c<n.cart.length;c++)n.cart[c][a]=i;for(var o=0;o<t.noActivityCart.length;o++)t.noActivityCart[o][a]=i;s&&this.resetOccurItem(s,e,i)},resetOccurItem:function(t,e,i){var s=this.getCheckKey(e),a=!0;if(i){for(var r=0;r<t.store.length;r++)if(!t.store[r][s]){a=!1;break}}else a=!1;t[s]=a},setCartSel:function(t,e,i,s){var a=this.getCheckKey(e);t[a]=!t[a];var r;r=!!t[a]&&this.judgeStoreIsSel(i,e),i[a]=r,this.resetOccurItem(s,e,r)},getPayNum:function(t,e){if(e)return 0;for(var i=this.getCheckKey(e),s=0,a=0;a<t.store.length;a++){for(var r=t.store[a],n=0;n<r.activity.length;n++)for(var c=r.activity[n],o=0;o<c.cart.length;o++){var l=c.cart[o];l[i]&&"0"==l.isGift&&(s+=l.number)}for(var d=0;d<r.noActivityCart.length;d++){var u=r.noActivityCart[d];u[i]&&(s+=u.number)}}return s},getCheckKey:function(t){return t?"dchecked":"checked"},getSelOccur:function(t,e,i){this.getCheckKey(e);for(var s=[],a=0;a<t.store.length;a++){var r=t.store[a],n=this.getSelStore(r,e,i);s=s.concat(n)}if("update"==i)for(var c=0;c<s.length;c++)s[c].checked=t.checked?0:1;return s},getSelStore:function(t,e,i){for(var s=this.getCheckKey(e),a=[],r=0;r<t.activity.length;r++)for(var n=t.activity[r],c=0;c<n.cart.length;c++){var o=n.cart[c];(o[s]||"update"==i)&&a.push(this.revertCartitemToDic(o,i,t))}for(var l=0;l<t.noActivityCart.length;l++){var d=t.noActivityCart[l];(d[s]||"update"==i)&&a.push(this.revertCartitemToDic(d,i,t))}return a},getInvalidArr:function(t){for(var e=[],i=0;i<t.length;i++){var s=t[i];e.push(this.revertCartitemToDic(s,"delete"))}return e},revertCartitemToDic:function(t,e,i){var s={};return"update"==e?(s={skuId:t.skuId,storeOuCode:t.storeOuCode,checked:i.checked?0:1,activityId:t.activityId,isGift:t.isGift},t.currentSelfActivity&&""!=t.currentSelfActivity&&t.currentSelfActivity.mktActivityId&&""!=t.currentSelfActivity.mktActivityId&&(s.selfActivityId=t.currentSelfActivity.mktActivityId)):"pay"==e?(s={id:t.id,skuId:t.skuId,storeOuCode:t.storeOuCode,number:t.number,activityId:t.activityId,checked:t.checked,isGift:t.isGift},t.currentSelfActivity&&""!=t.currentSelfActivity&&t.currentSelfActivity.mktActivityId&&""!=t.currentSelfActivity.mktActivityId&&(s.selfActivityId=t.currentSelfActivity.mktActivityId),null!=t.currentSelfActivity&&""==t.currentSelfActivity&&t.selfActivity&&""!=t.selfActivity&&t.selfActivity.length>0&&(s.selfActivityId="-2")):"delete"==e&&(s={skuId:t.skuId,storeOuCode:t.storeOuCode,isGift:t.isGift,activityId:t.activityId}),s},getActivityRightTitle:function(t){if(1==t.linkType||5==t.linkType||6==t.linkType)return"去凑单";if(2==t.linkType)return"再逛逛";if(3==t.linkType){for(var e=!1,i=0;i<t.cart.length;i++)if(1==t.cart[i].isGift){e=!0;break}return e?"重新领取":"领赠品"}if(4==t.linkType){for(var s=!1,a=0;a<t.cart.length;a++)if(2==t.cart[a].isGift){s=!0;break}return s?"重新领取":"去换购"}return"再逛逛"},getGiftIsOnlyScan:function(t){var e=!0;return 3!=t.linkType&&4!=t.linkType||(e=!1),e},getGiftType:function(t){var e=1;return 4!=t.linkType&&6!=t.linkType||(e=2),e}};e.a=c},zZ1A:function(t,e,i){"use strict";var s=i("N5Jg");i.n(s).a}}]);
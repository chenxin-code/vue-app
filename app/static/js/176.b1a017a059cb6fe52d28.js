(window.webpackJsonp=window.webpackJsonp||[]).push([[176,348],{"02kl":function(t,e,a){"use strict";var i=a("C3sG");a.n(i).a},"0KCG":function(t,e,a){"use strict";a.r(e),a("4X9F");var i=a("IkEG"),s=(a("5+UC"),a("05lO")),o=a("Ziuy"),n=a("Xt+m"),r=a("Qcq2"),c=a("tpV1"),l=a("7//l"),u=a("WQzh"),p=a("GGi1"),h=a("Gedb"),d=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var a=arguments[e];for(var i in a)Object.prototype.hasOwnProperty.call(a,i)&&(t[i]=a[i])}return t},v={name:"placeorder",components:{PriceOrder:u.a,Agreement:p.default},data:function(){return{contactFlag:!1,contratWayList:[],paramsData:{},payWays:[{text:"在线支付",tag:"1"},{text:"货到付款",tag:"0"},{text:"提货付款",tag:"0"}],payWays1:[{text:"在线支付",tag:"1"},{text:"货到付款",tag:"0"},{text:"提货付款",tag:"1"}],contratWayText:"选择联系方式",payWaySelected:1,payWayText:"在线支付",payWayPopShow:!1,contratWayPopShow:!1,usePoints:!1,payDigitals:[],useInvoice:!1,lastRes:{},pointsGain:0,occurData:{},usedCoupons:[],invoiceData:null,invoiceInfo:"",currentInvoice:{},proImgArr:[],showProsDetail:!1,pickupPhone:this.$store.state.userInfo.phone,pickupTime:"",currentStore:{},isFirst:!0,referrer:"",canEditReferrer:!0,scanCode:"",showAgreement:!1,showPointsRule:!1,digitalPWD:"",dictByAlias:[],easyCardId:"",cardBalance:"",showYjPayInfo:!1,cardType:"",showYJChange:!1,radio:1,radio1:0,cardList:[],cardDetails:"",userCanUseDigital:"",cardAmount:"",limitType:"",deliveryType:"",complete:!1,backReloadCoupon:!1,pickUpEndTime:"",hasShengxian:!1,selectItem:{},pageType:null,payWayPopShow1:!1,overFlag:!1,wishData:{payNiceName:"",payMsg:""},buyType:"",lbId:"",lsProductName:"",noNavTop:!1}},computed:{recommendDisabled:function(){return!this.$store.state.globalConfig.recommendDisabled||!Number(this.$store.state.globalConfig.recommendDisabled)}},created:function(){var t=this;this.complete=!0,this.lastRes=this.$route.params.res?this.$route.params.res:{},console.log(this.lastRes,"this.lastRes"),this.occurData=this.lastRes.occur[0],this.easyCardId=this.$route.params.easyCardId,this.cardType=this.$route.params.cardType,this.buyType=this.$route.params.buyType||"",this.lbId=this.$route.params.lbId||"",this.lsProductName=this.$route.params.lsProductName||"",this.paramsData=this.$route.params.paramsData?this.$route.params.paramsData:{},this.deliveryType=this.$route.params.deliveryType?this.$route.params.deliveryType:"2";var e=this.occurData.couNo;if(this.usedCoupons=[],e&&e.length>0)for(var a=0;a<e.length;a++)this.usedCoupons.push({couNo:e[a]});this.$route.params.paramsData?this._reSettleCart(this.$route.params.paramsData.carts):this.$MessageBox.alert("当前状态不支持刷新！","提示").then((function(e){t.$router.go(-1)})),"true"==this.limitType&&this.getCardList(),null!=this.$store.state.mall2.pickUpUser&&""!=this.$store.state.mall2.pickUpUser||(this.$store.state.mall2.pickUpUser=this.$store.state.login.nickName);var i=this.$store.state.globalConfig.order_timeout_pickup_cancel||0,s=new Date;s.setHours(s.getHours()+parseInt(i)),this.pickupTime=s,"wish"==this.$route.query.entryType&&this.getWishMsg(1)},mounted:function(){this.pageType=this.$route.query.pageType,2==this.pageType&&(this.payWaySelected=2,this.payWayText="提货付款"),this.noMath()},methods:{auther:function(t){this.$router.push({path:"/authentication/index",query:{}})},changePer:function(t,e){this.contratWayPopShow=!1,this.selectItem=t,this.radio1=e,1==t.type?this.contratWayText="企业":this.contratWayText="个人"},getAuthInfo:function(){var t=this;this.$http.post("/app/json/app_purchase_order/getAuthInfo",{}).then((function(e){var a=e.data;console.log(e),0==a.status?(t.contratWayList=e.data.data,t.contratWayPopShow=!0):t.$Toast(a.info)})).catch((function(e){t.$Toast(e)}))},toServiceEvent:function(t){var e=this,a={id:t.thirdServeId};this.$http.post("/app/json/product/getThirdServeDetail",a).then((function(t){var a=t.data;if(0==a.status){var i=a.data.pageUrl;if(""==i)return void e.$Toast("暂无详情！");-1!=i.indexOf("?")?i+="&":i+="?",i+="token="+token+"&lng="+store.state.currentLocation.posx+"&lat="+store.state.currentLocation.posy+"&pickupId="+store.state.mall2.zitiAddress.id+"&webtype="+store.state.webtype,window.location.href=i}}))},getSelectReceiveTime:function(){var t=this.$store.state.globalConfig.order_fresh_pickup_timeout_startday||0,e=this.$util.nextDate(t),a=this.$store.state.globalConfig.order_fresh_pickup_timeout_starttime||"09:00:00";return e.getFullYear()+"-"+(e.getMonth()+1)+"-"+e.getDate()+" "+a},getReceiveEndTime:function(){var t=this.$store.state.globalConfig.order_fresh_pickup_timeout_endday||1,e=this.$util.nextDate(t),a=this.$store.state.globalConfig.order_fresh_pickup_timeout_endtime||"15:00:00";return e.getFullYear()+"-"+(e.getMonth()+1)+"-"+e.getDate()+" "+a},getShortAddress:function(t){var e=this;this.$request.post("/app/json/short_address/getShortAddress",{code:t}).then((function(t){if(0==t.status){var a=JSON.parse(t.data.addressData);e.deliveryType=a.deliveryType,a.token=e.$store.state.login.token,e.paramsData=a,console.log(a),e._reSettleCart(a.carts)}else e.$toast(t.info)}))},getTotalPriceDuan:function(t){return this.$util.toDecimal2(this.occurData.payAmount).split(".")[t]},queryBtn:function(){this.showYJChange=!1,"a"==this.radio?this._reSettleCart(null,""):this._reSettleCart(null,this.cardDetails.cardNo)},getCardList:function(){var t=this,e=[];this.occurData.store.forEach((function(t){t.noActivityCart.forEach((function(t){e.push({skuId:t.skuId,storeOuCode:t.storeOuCode})}))})),this.$request.post("/app/json/app_user_easy_card/getCardList",{proSkus:e}).then((function(e){if(0==e.status){if(t.cardList=e.data||[],t.cardList.length)for(var a in t.cardList)t.cardList[a].cardNo==t.$route.params.cardNo&&(t.radio=parseInt(a))}else t.$Toast(e.info)}))},changeYjCard:function(t){"a"!=this.radio?(this.cardAmount=t.balance,this.cardDetails=t):(this.cardAmount=0,this.cardDetails="")},getCanNotUseStr:function(t){return 1==t||3==t?"余额不足":1==t?"订单金额不够":"未知原因"},getDictByAlias:function(){var t=this,e={token:this.$store.state.login.token,alias:"rewards_group"};this.$http.post("/app/json/app_dict/getDictByAlias",e).then((function(e){var a=e.data;0==a.status&&0!=a.data.length&&(t.dictByAlias=a.data)}))},getDigitalDisplayName:function(t){return this.$mallCommon.accTypeToName(t,"200001")},pointsRuleEvent:function(){this.showPointsRule=!0},getEndDate:function(){var t=this.$store.state.globalConfig.order_timeout_pickup_cancel||0,e=new Date;return t?e.setHours(e.getHours()+parseInt(t)):e.setDate(e.getDate()+14),e},scanCodeFunc:function(){var t=this;this.$bridgefunc.scanCode((function(e){t.scanCode=e.code,t.referrer=e.code}))},getTotalPrice:function(){return this.$util.toDecimal2(this.occurData.payAmount)},getImgArrs:function(t){for(var e=[],a=0;a<t.activity.length;a++)for(var i=t.activity[a].cart,s=0;s<i.length;s++)e.push(i[s].phPictureUrl);for(var o=t.noActivityCart,n=0;n<o.length;n++)e.push(o[n].phPictureUrl);return e},getNoStockImgArrs:function(t){for(var e=[],a=[],i=0;i<t.activity.length;i++)for(var s=t.activity[i].cart,o=0;o<s.length;o++){var n=s[o];if(n.number>n.stockNumber)""!=n.currentSelfActivity&&n.currentSelfActivity.mktActivityId&&""!=n.currentSelfActivity.mktActivityId&&(n.selfActivityId=n.currentSelfActivity.mktActivityId),e.push(n);else{var r={id:"",skuId:n.skuId,storeOuCode:n.storeOuCode,number:n.number,activityId:n.activityId,proSkuDistributionId:n.proSkuDistributionId||"",checked:n.checked,isGift:n.isGift,spCode:n.spCode};""!=n.currentSelfActivity&&n.currentSelfActivity.mktActivityId&&""!=n.currentSelfActivity.mktActivityId&&(r.selfActivityId=n.currentSelfActivity.mktActivityId),a.push(r)}}for(var c=t.noActivityCart,l=0;l<c.length;l++){var u=c[l];if(u.number>u.stockNumber)""!=u.currentSelfActivity&&u.currentSelfActivity.mktActivityId&&""!=u.currentSelfActivity.mktActivityId&&(u.selfActivityId=u.currentSelfActivity.mktActivityId),e.push(u);else{var p={id:"",skuId:u.skuId,storeOuCode:u.storeOuCode,number:u.number,activityId:u.activityId,proSkuDistributionId:u.proSkuDistributionId||"",checked:u.checked,isGift:u.isGift,spCode:u.spCode};""!=u.currentSelfActivity&&u.currentSelfActivity.mktActivityId&&""!=u.currentSelfActivity.mktActivityId&&(p.selfActivityId=u.currentSelfActivity.mktActivityId),a.push(p)}}return{noStockArr:e,canBuyArr:a}},showFreightDetail:function(){for(var t=[],e=0;e<this.occurData.store.length;e++){var a=this.occurData.store[e],i={};i.storeName=a.storeName,i.freightAmount=a.freightAmount,i.freightDiscountAmount=a.freightDiscountAmount,i.proImgs=this.getImgArrs(a),t.push(i)}r.a.open({initData:{listData:t},sureEvent:function(){r.a.close()}})},pickerConfirm:function(t){var e="星期"+"天一二三四五六 ".charAt(new Date(t).getDay()),a=this.$util.getMyDate(t);return console.log(t),a+" 【"+e+"】"},openPicker:function(){this.$refs.dateDom.open()},showProsDetailEvent:function(t){this.currentStore=t,this.showProsDetail=!0},getPeisongString:function(t){return"0"==t?"快递配送":"1"==t?"京东配送":"第三方配送"},toSelectZitiAddress:function(){},toSelectAddress:function(){this.$router.push({path:"/mall2/addresslist"})},useInvoiceEvent:function(){var t=this;if(this.useInvoice=!this.useInvoice,this.useInvoice&&null==this.invoiceData){this.$Loading.open();var e={token:this.$store.state.login.token};this.$http.post("/app/json/order_invoice/loadTwoTypeDefaultUserInvoiceHead",e).then((function(e){t.$Loading.close();var a=e.data;0==a.status?(t.invoiceData=a.data,"personal"==t.invoiceData.current?(t.currentInvoice=t.invoiceData.personal,t.currentInvoice.name=t.invoiceData.personal.title,t.invoiceInfo=t.invoiceData.personal.title,t.currentInvoice.type=0):(t.currentInvoice.type=1,t.currentInvoice=t.invoiceData.company,t.currentInvoice.invoiceTitle=t.invoiceData.company.title,t.invoiceInfo=t.invoiceData.company.title),t.invoiceData.phone=t.$store.state.login.phone,t.invoiceData.email=t.$store.state.userInfo.email,t.invoiceData.name=t.$store.state.userInfo.nickName):t.$Toast(a.info)}),(function(e){t.$Loading.close(),t.$Toast("请求数据失败！")}))}},changeInvoice:function(){var t=this;n.a.open({initData:d({},this.invoiceData,{token:this.$store.state.login.token}),selectedInvoice:function(e){console.log(e),t.currentInvoice=e,0==e.type?(t.invoiceInfo="个人",t.invoiceData.personal.title=e.name,t.invoiceData.personal.userPhone=e.phone,t.invoiceData.personal.userEmail=e.email):(t.invoiceInfo=e.company,t.invoiceData.company.userPhone=e.phone,t.invoiceData.company.userEmail=e.email,t.invoiceData.company.orgTaxNo=e.identifyNumber,t.invoiceData.company.title=e.company),n.a.close()},invoiceInformation:function(){t.showAgreement=!0}})},reloadSelectedCoupon:function(){if(0!=this.backReloadCoupon){this.backReloadCoupon=!1;var t=this.occurData.couNo;if(this.usedCoupons=[],t.length>0)for(var e=0;e<t.length;e++)this.usedCoupons.push({couNo:t[e]});for(var a=[],i=0;i<this.occurData.userCanUseCoupon.length;i++){var s=this.occurData.userCanUseCoupon[i].couNo;this.occurData.userCanUseCoupon[i].selected=!1;for(var n=0;n<this.usedCoupons.length;n++)if(this.usedCoupons[n].couNo==s){this.occurData.userCanUseCoupon[i].selected=!0;break}a.push(this.occurData.userCanUseCoupon[i])}o.a.reloadSelectedCoupon(a,[],this.occurData.userCanUseWhenNotSelectCoupon)}},couponEvent:function(){for(var t=this,e=[],a=0;a<this.occurData.userCanUseCoupon.length;a++){var i=this.occurData.userCanUseCoupon[a].couNo;this.occurData.userCanUseCoupon[a].selected=!1;for(var s=0;s<this.usedCoupons.length;s++)if(this.usedCoupons[s].couNo==i){this.occurData.userCanUseCoupon[a].selected=!0;break}e.push(this.occurData.userCanUseCoupon[a])}o.a.open({initData:{listData:[],userCanNotUseCoupon:this.occurData.userCanNotUseCoupon,userCanUseCoupon:this.occurData.userCanUseCoupon,userCanUseWhenNotSelectCoupon:this.occurData.userCanUseWhenNotSelectCoupon,type:"use",fiveEnter:!0,skuId:"",categoryId:"",storeOuCode:"",token:this.$store.state.login.token,payAmount:this.$util.toDecimal2(parseFloat(this.occurData.payAmount)+parseFloat(this.occurData.couponAmount))},selectedCoupon:function(e){t.usedCoupons=e,t.backReloadCoupon=!0,console.log(t.occurData,t.usedCoupons),t.occurData.payAmount=(t.occurData.amount-t.usedCoupons[0].couFaceValue).toFixed(2),t.occurData.couponAmount=t.usedCoupons[0].couFaceValue}})},useDigitalEvent:function(t){if(t.userCanUseDigital<=0){var e=this.getCanNotUseStr(t.deductionState);this.$Toast(e+"，不支持"+this.getDigitalDisplayName(t.acctType)+"支付！")}else{var a=t.acctType;if(t.payDigital<=t.fixedDigital){for(var i=[],s=0;s<this.payDigitals.length;s++)this.payDigitals[s].acctType!=a&&i.push(this.payDigitals[s]);this.payDigitals=i,this.payDigitals.push({acctType:a,payDigital:t.userCanUseDigital+t.fixedDigital})}else{for(var o=[],n=0;n<this.payDigitals.length;n++)this.payDigitals[n].acctType!=a?o.push(this.payDigitals[n]):o.push({acctType:a,payDigital:t.fixedDigital});this.payDigitals=o}this._reSettleCart(null)}},usePointsEvent:function(){0!=this.occurData.userCanUsePoints?(this.usePoints=!this.usePoints,this._reSettleCart(null)):this.$Toast("您没有当前订单可用积分！")},payWayShow:function(){2==this.pageType?this.payWayPopShow1=!0:this.payWayPopShow=!0},contratWayShow:function(){this.getAuthInfo()},payWayEvent:function(t){0!=t.tag?(this.payWaySelected=t.tag,this.payWayText=t.text):this.$Toast("暂不支持！")},payWayEvent1:function(t,e){0!=t.tag?(this.payWaySelected=e,this.payWayText=t.text):this.$Toast("暂不支持！")},popSureEvent:function(){this.payWayPopShow=!1},popSureEvent1:function(){this.contratWayPopShow=!1},popSureEvent2:function(){this.payWayPopShow1=!1},popClose:function(){this.payWayPopShow=!1},popClose2:function(){this.payWayPopShow1=!1},popClose1:function(){this.contratWayPopShow=!1},_reSettleCart:function(t,e){var a=this;this.$Loading.open();var i=this.paramsData;if(i.couNo=[],t)i.carts=t;else if(this.usedCoupons.length>0)for(var s=0;s<this.usedCoupons.length;s++)i.couNo.push(this.usedCoupons[s].couNo);else i.couNo.push("-1");i.limitWalletCardNo=e,2==this.deliveryType?""!=this.$store.state.mall2.selectAddress.id&&(i.userAddressId=this.$store.state.mall2.selectAddress.id):i.pickupId=this.$route.params.paramsData.pickupId?this.$route.params.paramsData.pickupId:this.$store.state.mall2.zitiAddress.id;for(var o=[],n=0;n<this.payDigitals.length;n++){var r=this.payDigitals[n];"LimitWallet"!=r.acctType&&o.push(r)}console.log(this.$route.params,"this.$route.params"),i.payDigital=o,i=Object.assign(i,{deliveryType:1,specialActivityId:i.specialActivityId,specialActivityType:1,couNo:"-1",pickupId:this.$route.params.paramsData.pickupId}),this.$http.post("/app/json/app_cart/SettleCartByAct",i).then((function(t){a.$Loading.close();var e=t.data;a.complete=!0,0==e.status?(a.hasShengxian=!1,a.lastRes=e.data,a.paramsData=i,a.initData(),"true"==a.limitType&&a.getCardList(),a.$mallCommon.isExistCanNotAttendActivity(e.data.occur,!0)):(a.$Toast(e.info),a.reloadSelectedCoupon())}),(function(t){a.$Loading.close(),a.$Toast("请求数据失败！"),a.reloadSelectedCoupon()}))},checkProductStock:function(){var t=this;if(2!=this.pageType||this.selectItem.realName)if(console.log("save"),this.$store.state.mall2.selectAddress.id>0||2!=this.deliveryType||"1"==this.occurData.needVirtualUserPhone){if(this.occurData&&this.occurData.needReferrer&&(!this.referrer||0==this.referrer.length))return this.$Toast("请填写推荐人"),!1;for(var e=0;e<this.payDigitals.length;e++){var a=this.payDigitals[e];if(a.payDigital>0&&a.payDigital>a.userBalanceDigital){var i="可用";return i+=this.getDigitalDisplayName(a.acctType),i+="余额不足！",void this.$Toast(i)}}for(var s=[],o=[],n=!1,r=0;r<this.occurData.store.length;r++){var l=this.occurData.store[r],u={};u.storeName=l.storeName;var p=this.getNoStockImgArrs(l);o=o.concat(p.canBuyArr),u.noStockArr=p.noStockArr,p.noStockArr.length>0&&(n=!0),s.push(u)}0!=o.length?this.cardBalance.balance-this.number<=0?this.$Toast("当前区域商品库存不足！"):n?c.a.open({initData:{listData:s},cancelEvent:function(){c.a.close()},submitEvent:function(){c.a.close(),t._reSettleCart(o)}}):2==this.pageType?"提货付款"==this.payWayText?(this.overFlag=!0,this._submitOrder(o)):this.checkHighest_recharge(o):this.checkCouponPrice(o):this.$Toast("当前区域商品库存不足！")}else this.$Toast("请维护并选择收货地址！");else this.$Toast("请选择预约单联系方式！")},checkHighest_recharge:function(t){var e=this;this.occurData.amount>1e4?Object(s.a)("订单金额已超过10000元，请选择提货支付支付方式"):this.occurData.amount>this.$store.state.globalConfig.bulkpurchase_modifyprice?(this.overFlag=!0,i.a.confirm({title:"标题",confirmButtonText:"申请改价",className:"price-con",getContainer:".placeorder",cancelButtonText:"算了吧~",message:"您的订单金额已到达改价金额"+this.$store.state.globalConfig.bulkpurchase_modifyprice+"元，可选择联系管理员进行改价后进行支付"}).then((function(){e.checkCouponPrice(t)})).catch((function(){}))):e.checkCouponPrice(t)},checkCouponPrice:function(t){var e=this;this.occurData.cashCouponFaceValue>this.occurData.cashCouponAmount?this.$MessageBox.confirm("您的优惠券金额比订单金额大，确定使用吗？","提示",{confirmButtonText:"确定"}).then((function(a){e.checkNeedPwd(t)})).catch((function(t){})):this.checkNeedPwd(t)},checkNeedPwd:function(t){var e=this;if(this.digitalPWD="",this.occurData.needPayPwd){if("1"==this.occurData.payPwdState)return void this.$Toast("支付密码已锁定，请稍后再试！");l.a.open({initData:{payPwdState:this.occurData.payPwdState},toSettingPwd:function(){e.$router.push({path:"/usercenter/nosetpwd",query:{isSet:0}}),l.a.close()},inputFinished:function(a){e.digitalPWD=a,e._submitOrder(t),l.a.close()}})}else this._submitOrder(t)},pustLiveStreamMsg:function(){var t=this,e={lbId:this.lbId,content:"【下单】成功下单 "+this.lsProductName+" 🎉🎉🎉"};this.$http.post("/app/json/live_broadcast/comment",e).then((function(e){var a=e.data;0==a.status||t.$Toast(a.info)}),(function(t){console.log(t)}))},_submitOrder:function(t){var e=this,a=this.$util.deepClone(this.paramsData);if(1==this.deliveryType&&(a.pickupReceiver=this.$store.state.mall2.pickUpUser,a.pickupMobile=this.pickupPhone,"false"!=this.$store.state.globalConfig.order_pickup_time_selecter_show)){var i=this.$util.getMyDate(this.pickupTime);a.selectReceiveTime=i}if(a.orderScene=this.$util.orderScene(),a.carts=t,a.couNo=[],this.usedCoupons.length>0)for(var s=0;s<this.usedCoupons.length;s++)a.couNo.push(this.usedCoupons[s].couNo);a.userAddress=this.$store.state.mall2.selectAddress,a.userAddressId=this.$store.state.mall2.selectAddress.id,a.token=this.$store.state.login.token,a.payDigital=this.payDigitals,""!=this.digitalPWD&&(a.payPwd=Object(h.a)(this.digitalPWD)),a.specialActivityId=this.$route.params.paramsData.specialActivityId,a.specialActivityType=this.$route.params.paramsData.specialActivityType,a.pickupId=this.$route.params.paramsData.pickupId,console.log(a,"paramsData"),this.$Loading.open(),this.$http.post("/app/json/app_shopping_order/submitByAct",a).then((function(a){e.$Loading.close();var i=a.data;0==i.status?(""!=e.lbId&&e.pustLiveStreamMsg(),sessionStorage.removeItem("RHY_Pickup_Address"),sessionStorage.removeItem("Place_Order_Params"),sessionStorage.removeItem("Place_Order_Delivery_Type"),e.$router.replace({path:"/mall2/checkstand",query:{payInfo:JSON.stringify(i.data),occurOuCode:e.occurData.ouCode,orderCategory:e.paramsData.orderCategory,vipUnitUserCode:e.paramsData.vipUnitUserCode,buyType:e.buyType,giftCards:JSON.stringify(t),deliveryType:e.deliveryType,name:e.$route.params.name,type:"five_enter"}})):e.$Toast(i.info)}),(function(t){e.$Loading.close(),e.$Toast("请求数据失败！")}))},returnStoreProducts:function(t){for(var e=0,a=0,i=[],s=[],o=0;o<t.noActivityCart.length;o++){var n=t.noActivityCart[o];a+=n.number,512==n.productType?s.push(n):(e++,i.push(n),6==n.productType&&(this.hasShengxian=!0))}for(var r=0;r<t.activity.length;r++)for(var c=0;c<t.activity[r].cart.length;c++){var l=t.activity[r].cart[c];a+=l.number,512==l.productType?s.push(l):(e++,i.push(l),6==l.productType&&(this.hasShengxian=!0))}var u={num:e,proNum:a,proArr:i,serviceArr:s};t.storeProData=u},initData:function(){if(this.pointsGain=this.lastRes.pointsGain,console.log(this.lastRes,"this.lastRes"),this.occurData=this.lastRes.occur[0],!this.occurData)return this.occurData={},void(1==this.deliveryType?this.$Toast("当前自提点无库存！"):this.$Toast("当前地址无库存！"));for(var t=0;t<this.occurData.store.length;t++){var e=this.occurData.store[t];this.returnStoreProducts(e)}var a=this.occurData.couNo;if(this.usedCoupons=[],a&&a.length>0)for(var i=0;i<a.length;i++)this.usedCoupons.push({couNo:a[i]});this.payDigitals=[];for(var s=0;s<this.occurData.digitalList.length;s++){var o=this.occurData.digitalList[s];"LimitWallet"==o.acctType&&(this.cardAmount=o.userBalanceDigital,this.userCanUseDigital=o.userCanUseDigital),o.payDigital>o.fixedDigital?this.payDigitals.push({acctType:o.acctType,userBalanceDigital:o.userBalanceDigital,payDigital:o.userCanUseDigital+o.fixedDigital}):this.payDigitals.push({acctType:o.acctType,userBalanceDigital:o.userBalanceDigital,payDigital:o.fixedDigital})}this.reloadSelectedCoupon()},noMath:function(){var t=this;this.$route.params.noMatch&&this.$route.params.noMatch&&this.$MessageBox.confirm("没有相关区域的收货地址，是否要添加？","提示",{confirmButtonText:"确定"}).then((function(e){t.$router.push({path:"addaddress",query:{type:1,isSave:!0,direct:"direct"}})})).catch((function(t){}))},getWishMsg:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.$http.post("/app/json/wish_order/getRandomWishOrderConfig",{type:2,isDefault:e}).then((function(e){var a=e.data;0==a.status?t.wishData=a.data:t.$Toast(a.info)})).catch((function(e){t.$Toast(e)}))},getContentTop:function(){return this.noNavTop?"top: 0px;":""}},activated:function(){this.isFirst?this.isFirst=!1:this._reSettleCart(null)},beforeRouteLeave:function(t,e,a){"/mall2/addresslist"==t.path||"/mall2/mypickupaddress"==t.path||"/mall2/addaddress"==t.path||"/usercenter/agreement"==t.path||"/usercenter/nosetpwd"==t.path||this.$keepaliveHelper.deleteCache(this),a()}},m=(a("4Tlb"),a("KHd+")),g=Object(m.a)(v,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"placeorder mall2"},[t.noNavTop?t._e():a("nav-top",{on:{backEvent:function(e){return t.$router.go(-1)}}}),t._v(" "),t.complete?a("nav-content",{style:t.getContentTop()},[a("div",{staticClass:"flex-div"},[a("div",{staticClass:"scroll-div"},[1==t.deliveryType&&1==t.occurData.needAddress?a("div",{staticClass:"block-div no-padding-bottom"},[a("div",{on:{click:t.toSelectZitiAddress}},[a("div",{staticClass:"pickup-shop"},[a("div",{staticStyle:{flex:"1"}},[a("div",{staticClass:"flex-row"},[a("div",{staticClass:"name theme_font_black"},[t._v("\n                    自提店铺："+t._s(t.$route.params.paramsData.storeName)+"\n                  ")])]),t._v(" "),a("div",{staticClass:"flex-row"},[a("div",{staticClass:"full theme_font_tint font-small",staticStyle:{"line-height":"1.4"}},[t._v("\n                    "+t._s(t.$route.params.paramsData.storeAddress)+"\n                    ")])])]),t._v(" "),a("div",[a("i",{staticClass:"iconfont mall-gengduojiantou theme_font_tint icon-font"})])])]),t._v(" "),a("div",{staticClass:"colorfulline"},[a("img",{attrs:{src:"static/image/mall2/colorfulline.png"}})])]):t._e(),t._v(" "),a("div",{staticClass:"block-div"},[a("div",{staticClass:"flex-row",on:{click:t.payWayShow}},[a("div",{staticClass:"label-middle theme_font_common"},[t._v("支付方式")]),t._v(" "),a("div",{staticClass:"full"}),t._v(" "),a("div",{staticClass:"theme_font_common right-margin"},[t._v(t._s(t.payWayText))]),t._v(" "),a("div",[a("i",{staticClass:"iconfont mall-gengduo more-icon theme_font_tint"})])])]),t._v(" "),2==t.pageType?a("div",{staticClass:"block-div"},[a("div",{staticClass:"flex-row",on:{click:t.contratWayShow}},[a("div",{staticClass:"label-middle theme_font_common",staticStyle:{width:"100px"}},[t._v("预约单联系方式")]),t._v(" "),a("div",{staticClass:"full"}),t._v(" "),a("div",{staticClass:"theme_font_common right-margin"},[t._v(t._s(t.contratWayText))]),t._v(" "),a("div",[a("i",{staticClass:"iconfont mall-gengduo more-icon theme_font_tint"})])]),t._v(" "),"选择联系方式"!=t.contratWayText?a("div",{},[a("van-cell",{attrs:{title:"姓名：",value:t.selectItem.realName}}),t._v(" "),a("van-cell",{attrs:{title:"联系电话：",value:t.selectItem.userName}})],1):t._e()]):t._e(),t._v(" "),t._l(t.occurData.store,(function(e){return a("div",{staticClass:"block-div"},[a("div",{staticClass:"flex-row"},[a("div",{staticClass:"name"},[t._v(t._s(e.storeName))])]),t._v(" "),1==e.storeProData.num?a("div",[t._l(e.storeProData.proArr,(function(e){return a("div",{staticClass:"pro-row"},[a("div",{staticClass:"img-div"},[a("img",{attrs:{src:e.phPictureUrl}})]),t._v(" "),a("div",{staticClass:"info-div"},[a("div",{staticClass:"title theme_font_black"},[t._v(t._s(e.productName))]),t._v(" "),a("div",{staticClass:"title theme_font_black"},[a("span",[t._v(t._s(e.specs))])]),t._v(" "),a("div",{staticClass:"price"},[a("PriceOrder",{attrs:{productData:e}}),t._v(" "),"wish"==t.$route.query.entryType?a("van-stepper",{staticClass:"wish-prod-stepper",attrs:{max:t.$route.params.wishProdInfo.saleNumMax,min:t.$route.params.wishProdInfo.saleNumBegin,step:t.$route.params.wishProdInfo.saleNumStep,integer:""},model:{value:e.number,callback:function(a){t.$set(e,"number",a)},expression:"prodata.number"}}):a("span",{staticStyle:{float:"right"}},[t._v("x "+t._s(e.number))])],1)])])})),t._v(" "),a("div",{staticClass:"service"},[a("div",{staticClass:"title"},[t._v("保障服务")]),t._v(" "),t._l(e.storeProData.serviceArr,(function(e){return a("div",{staticClass:"service-row line_top",on:{click:function(a){return t.toServiceEvent(e)}}},[a("div",{staticClass:"name single-line"},[t._v(t._s(e.productName))]),t._v(" "),a("div",{staticClass:"price"},[t._v("¥"+t._s(t.$util.toDecimal2(e.price))+" x "+t._s(e.number)+"\n                  "),a("i",{staticClass:"iconfont mall-gengduojiantou"})])])}))],2)],2):t._e(),t._v(" "),e.storeProData.num>1?a("div",{on:{click:function(a){return t.showProsDetailEvent(e)}}},[a("div",{staticClass:"pros-row"},[a("div",{staticClass:"pros-msg"},[a("span",[t._v("共"+t._s(e.storeProData.proNum)+"件")]),t._v(" "),a("i",{staticClass:"iconfont mall-gengduo more-icon theme_font_tint"})]),t._v(" "),t._l(e.storeProData.proArr,(function(e,i){return i<3?a("div",{staticClass:"img-div"},[a("img",{attrs:{src:e.phPictureUrl}})]):t._e()}))],2)]):t._e(),t._v(" "),a("div",{staticClass:"flex-row"},[a("div",{staticClass:"label-middle theme_font_common"},[t._v("备注")]),t._v(" "),a("div",{staticClass:"full"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.remark,expression:"store.remark"}],staticClass:"row-input theme_font_common",attrs:{placeholder:"请留下您想说的话"},domProps:{value:e.remark},on:{input:function(a){a.target.composing||t.$set(e,"remark",a.target.value)}}})])])])})),t._v(" "),(!t.cardType||t.cardType&&551==t.cardType)&&"false"!=t.$store.state.globalConfig.invoice_shopping_enable&&1!=t.paramsData.orderCategory?a("div",{staticClass:"block-div"},[a("div",{staticClass:"flex-row"},[a("div",{staticClass:"title full theme_font_common"},[t._v("发票")]),t._v(" "),a("div",{staticClass:"swith",on:{click:t.useInvoiceEvent}},[t.useInvoice?a("img",{attrs:{src:"static/image/mall2/switch-on.png"}}):t._e(),t._v(" "),t.useInvoice?t._e():a("img",{attrs:{src:"static/image/mall2/switch-off.png"}})])]),t._v(" "),t.useInvoice?a("div",{staticClass:"flex-row",on:{click:t.changeInvoice}},[a("div",{staticClass:"label-middle theme_font_common"},[t._v("发票信息")]),t._v(" "),a("div",{staticClass:"full"}),t._v(" "),a("div",{staticClass:"theme_font_black right-margin",class:{theme_font_tint:""==t.invoiceInfo}},[t._v("\n              "+t._s(""!=t.invoiceInfo?t.invoiceInfo:"请编辑发票信息")+"\n            ")]),t._v(" "),a("div",[a("i",{staticClass:"iconfont mall-gengduo more-icon theme_font_tint"})])]):t._e()]):t._e(),t._v(" "),(!t.cardType||t.cardType&&551==t.cardType)&&1!=t.paramsData.orderCategory&&"wish"!==t.$route.query.entryType?a("div",{staticClass:"block-div"},[a("div",{staticClass:"flex-row",on:{click:t.couponEvent}},[a("div",{staticClass:"label-middle theme_font_common"},[t._v("优惠券")]),t._v(" "),a("div",{staticClass:"full"}),t._v(" "),t.lastRes.occur?a("div",{staticClass:"theme_font_black right-margin"},[t._v("优惠"+t._s(t.$util.toDecimal2(t.occurData.couponAmount))+"元\n            ")]):t._e(),t._v(" "),a("div",[a("i",{staticClass:"iconfont mall-gengduo more-icon theme_font_tint"})])]),t._v(" "),t._l(t.occurData.digitalList,(function(e){return"LimitWallet"!=e.acctType?a("div",[0!=e.deductionState?a("div",{staticClass:"flex-row"},[a("div",{staticClass:"label-middle theme_font_common"},[t._v(t._s(t.getDigitalDisplayName(e.acctType)))]),t._v(" "),a("div",{staticClass:"full"}),t._v(" "),e.userCanUseDigital>0?a("div",{staticClass:"right-margin"},[t._v("\n                共"+t._s(e.userBalanceDigital)+"，可用"+t._s(e.userCanUseDigital)+"，抵￥"+t._s(t.$util.toDecimal2(e.userCanUseDigitalAmount))+"元\n              ")]):t._e(),t._v(" "),e.userCanUseDigital<=0?a("div",{staticClass:"right-margin"},[t._v("共"+t._s(e.userBalanceDigital)+"，"+t._s(t.getCanNotUseStr(e.deductionState))+"，不能使用\n              ")]):t._e(),t._v(" "),a("div",{staticClass:"swith",on:{click:function(a){return t.useDigitalEvent(e)}}},[e.payDigital>e.fixedDigital?a("img",{attrs:{src:"static/image/mall2/switch-on.png"}}):t._e(),t._v(" "),e.payDigital<=e.fixedDigital?a("img",{attrs:{src:"static/image/mall2/switch-off.png"}}):t._e()])]):t._e()]):t._e()}))],2):t._e()],2),t._v(" "),a("div",{staticClass:"bottom-btns"},[2==t.deliveryType&&1==t.occurData.needAddress?a("div",{staticClass:"tip theme_bg_yl theme_standard_font theme_light_bg"},[t._v(t._s(t.$store.state.mall2.selectAddress.addressFull)+"\n        ")]):t._e(),t._v(" "),"songli"==t.buyType?a("div",{staticClass:"btn theme_standard_bg theme_font_white",on:{click:t.checkProductStock}},[t._v("\n          提交礼单\n        ")]):a("div",{staticClass:"btn theme_standard_bg theme_font_white",on:{click:t.checkProductStock}},[t._v("提交订单")]),t._v(" "),a("div",{staticClass:"price"},[Object.keys(t.occurData).length?a("div",{staticClass:"rmb-div"},[a("span",{staticClass:"theme_font_red"},[t._v("￥")]),t._v(" "),a("span",{staticClass:"left-no-space price-big theme_font_red"},[t._v(t._s(t.getTotalPriceDuan(0)))]),t._v(" "),a("span",{staticClass:"theme_font_red"},[t._v("."+t._s(t.getTotalPriceDuan(1)))]),t._v(" "),t._l(t.occurData.digitalList,(function(e,i){return t.$mallCommon.getTotalUsePoints(e)>0?a("div",{staticClass:"digital-div"},[i!=t.$mallCommon.getFirstVartualIndex(t.occurData)||t.$mallCommon.getOccurShowPrice(t.occurData)?a("span",{staticClass:"price-big theme_font_red"},[t._v("+")]):t._e(),t._v(" "),a("span",{staticClass:"price-big theme_font_red"},[t._v(t._s(t.$mallCommon.getTotalUsePoints(e)))]),t._v(" "),a("span",{staticClass:"theme_font_red"},[t._v(t._s(t.$mallCommon.getTotalUnitStr(e.acctType)))])]):t._e()}))],2):t._e()])])])]):t._e(),t._v(" "),t.payWayPopShow?a("pop-view",{on:{closeEvent:t.popClose}},[a("div",{staticClass:"pop-body"},[a("div",{staticClass:"pop-title theme_font_common"},[t._v("请选择支付方式")]),t._v(" "),a("div",{staticClass:"items-div pop-scroll-div"},t._l(t.payWays,(function(e){return a("div",{staticClass:"item theme_font_common theme_bg_white_ef",class:{theme_light_bg:t.payWaySelected==e.tag,theme_standard_font_i:t.payWaySelected==e.tag,theme_standard_bdr_i:t.payWaySelected==e.tag},on:{click:function(a){return t.payWayEvent(e)}}},[t._v(t._s(e.text)+"\n        ")])})),0),t._v(" "),a("div",{staticClass:"bottom-btn theme_font_white theme_standard_bg bottom-space",on:{click:t.popSureEvent}},[t._v("确定\n      ")])])]):t._e(),t._v(" "),t.showProsDetail?a("pop-view",{on:{closeEvent:function(e){t.showProsDetail=!1}}},[a("div",{staticClass:"pop-body"},[a("div",{staticClass:"pop-title theme_font_common"},[t._v("商品明细")]),t._v(" "),a("div",{staticClass:"pop-scroll-div"},[t._l(t.currentStore.storeProData.proArr,(function(e){return a("div",{staticClass:"pro-row"},[a("div",{staticClass:"img-div"},[a("img",{attrs:{src:e.phPictureUrl}})]),t._v(" "),a("div",{staticClass:"info-div"},[a("div",{staticClass:"title-min theme_font_black"},[t._v(t._s(e.productName))]),t._v(" "),a("div",{staticClass:"title-min theme_font_gray"},[a("span",{staticClass:"font-small"},[t._v(t._s(e.specs))])]),t._v(" "),a("div",{staticClass:"price"},[a("PriceOrder",{attrs:{productData:e}}),t._v(" "),a("span",{staticStyle:{float:"right"}},[t._v("x "+t._s(e.number))])],1)])])})),t._v(" "),a("div",{staticClass:"service"},[a("div",{staticClass:"title"},[t._v("保障服务")]),t._v(" "),t._l(t.currentStore.storeProData.serviceArr,(function(e){return a("div",{staticClass:"service-row line_top",on:{click:function(a){return t.toServiceEvent(e)}}},[a("div",{staticClass:"name single-line"},[t._v(t._s(e.productName))]),t._v(" "),a("div",{staticClass:"price"},[t._v("¥"+t._s(t.$util.toDecimal2(e.price))+" x "+t._s(e.number)+"\n              "),a("i",{staticClass:"iconfont mall-gengduojiantou"})])])}))],2)],2)])]):t._e(),t._v(" "),a("mt-datetime-picker",{ref:"dateDom",attrs:{type:"date",startDate:new Date,endDate:t.getEndDate(),"year-format":"{value} 年","month-format":"{value} 月","date-format":"{value} 日"},model:{value:t.pickupTime,callback:function(e){t.pickupTime=e},expression:"pickupTime"}}),t._v(" "),t.showAgreement?a("Agreement",{attrs:{propsValue:9},on:{backEvent:function(e){t.showAgreement=!1}}}):t._e(),t._v(" "),t.showPointsRule?a("Agreement",{attrs:{propsValue:11},on:{backEvent:function(e){t.showPointsRule=!1}}}):t._e()],1)}),[],!1,null,"21658a64",null);e.default=g.exports},"4Tlb":function(t,e,a){"use strict";var i=a("wFC9");a.n(i).a},C3sG:function(t,e,a){},Fybm:function(t,e,a){"use strict";var i={name:"agreement-content",components:{},props:["value","noloading"],data:function(){return{agreementContent:""}},methods:{getAgreement:function(){var t=this;"true"!=this.noloading&&this.$Loading.open();var e=void 0,a=void 0;18==this.value?(e="/app/json/news/getNewsList",a={values:52}):(e="/app/json/news/getList",a={token:this.$store.state.login.token,value:this.value}),this.$http.post(e,a).then((function(e){"true"!=t.noloading&&t.$Loading.close();var a=e.data.data;if(a&&""!=a){var i=a[0];t.agreementContent=i.content}else console.log("协议内容为空")}),(function(e){"true"!=t.noloading&&t.$Loading.close(),t.$Toast("请求数据失败！")}))}},mounted:function(){this.getAgreement()},created:function(){}},s=(a("02kl"),a("KHd+")),o=Object(s.a)(i,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"agreement-content"},[e("div",{staticClass:"content",domProps:{innerHTML:this._s(this.agreementContent)}})])}),[],!1,null,"5e72c5d8",null);e.a=o.exports},GGi1:function(t,e,a){"use strict";a.r(e);var i={name:"agreement",components:{AgreementContent:a("Fybm").a},props:["propsValue"],data:function(){return{value:"",topTitle:"协议"}},methods:{backEvent:function(){this.propsValue?this.$emit("backEvent"):this.$router.go(-1)}},created:function(){this.value=this.$route.query.value?this.$route.query.value:3,this.topTitle="协议",this.propsValue&&(this.value=this.propsValue),3!=this.$store.state.webtype&&(9==this.value?(this.topTitle="发票须知",document.title="发票须知"):10==this.value?(this.topTitle="积分规则",document.title="积分规则"):11==this.value?(this.topTitle="积分使用规则",document.title="积分使用规则"):17==this.value?(this.topTitle="用户协议",document.title="用户协议"):18==this.value?(this.topTitle="捐赠协议",document.title="捐赠协议"):63==this.value?(this.topTitle="隐私协议",document.title="隐私协议"):65==this.value?(this.topTitle="使用规则",document.title="使用规则"):80==this.value&&(this.topTitle="使用规则",document.title="使用规则"))}},s=(a("XXIG"),a("KHd+")),o=Object(s.a)(i,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"agreement theme_bg_white"},[e("nav-top",{attrs:{title:this.topTitle},on:{backEvent:this.backEvent}}),this._v(" "),e("nav-content",[e("div",{staticClass:"content"},[e("AgreementContent",{attrs:{value:this.value}})],1)])],1)}),[],!1,null,"281a2789",null);e.default=o.exports},XXIG:function(t,e,a){"use strict";var i=a("XkAZ");a.n(i).a},XkAZ:function(t,e,a){},wFC9:function(t,e,a){}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[754],{A7JX:function(t,e,s){},DiUk:function(t,e,s){"use strict";s.r(e);var o=s("dqDD"),i=s("uQt8"),a=s("Ziuy"),n={name:"fillorder",components:{Field:o.Field,CountButton:i.a,Indicator:o.Indicator,Toast:o.Toast},data:function(){return{chooseIndex:0,phone:"",verifyCode:"",identityCard:"",memberCount:1,showDescription:!1,descriptions:[{title:"预订规则",values:["购买时间：18：00前可购买当天以后的票","有效期：制定日起当天使用"]},{title:"费用说明",values:["费用包括：汕头方特欢乐世界票（1大1小）1张"]},{title:"使用说明",values:["入园方式：汕头方特欢乐世界票（1大1小）1张","商品说明：适用于一位成人和一位儿童（1.2米<=儿童身高<1.5）"]},{title:"退改规则",values:["退款说明：门票已购买不支持退票","改票说明：不支持改期"]},{title:"其他说明",values:["限购说明：每笔订单限购5张","其他事项：门票一经预订不支持退款"]}],occur:[],currentOccur:{},overtime:!1,personList:[{name:"",Idcard:"",phone:""}],usedCoupon:{couNo:"-1"},cartItem:{},cusCouFaceValue:"优惠0.00元",isShow:!1,proName:"",saleNumBegin:"",saleNumStep:"",saleNumMax:"",stockNum:"",countMax:20,mobileParam:""}},methods:{numChange:function(){if(this.personList.length>this.memberCount){var t=this.personList.length-parseInt(this.memberCount);this.personList.splice(this.memberCount,t)}else if(this.personList.length<this.memberCount)for(var e=parseInt(this.memberCount)-this.personList.length,s=0;s<e;s++)this.personList.push({name:"",Idcard:"",phone:""})},readDescription:function(){this.showDescription=!this.showDescription},popClose:function(){this.showDescription=!this.showDescription},_getverifyCode:function(){var t=this;if(""!==this.phone&&this.$util.checkMobile(this.phone)){this.$Loading.open();var e={token:this.$store.state.login.token};console.log(e),this.$http.post("",e).then((function(e){t.$Loading.close();var s=e.data;0==s.status?(t.$refs.countBtn.countDown(),t.overtime=!1,Object(o.Toast)({message:s.info?s.info:"验证码发送成功",position:"bottom",duration:2e3})):Object(o.Toast)({message:s.info?s.info:"验证码发送失败",position:"bottom",duration:2e3})}),(function(e){t.$Loading.close(),Object(o.Toast)({message:"验证码发送失败",position:"bottom",duration:2e3})}))}else Object(o.Toast)({message:"请输入正确的手机号码",position:"bottom",duration:2e3})},chooseDate:function(t,e){this.chooseIndex=e},detailsClick:function(){},_submieClick:function(){var t=this;if(""!==this.verifyCode)if(""!==this.identityCard&&18==this.identityCard.length&&this.$util.IDCardCheck(this.identityCard))if(""!==this.phone&&this.$util.checkMobile(this.phone)){for(var e=!0,s=0;s<this.personList.length;s++){var i=this.personList[s],a="请完善出行人信息！";if(""==i.name&&(e=!1),""==i.Idcard?e=!1:this.$util.IDCardCheck(i.Idcard)||(e=!1,a="请输入正确的身份证号码！"),""==i.phone?e=!1:this.$util.checkMobile(i.phone)||(e=!1,a="请输入正确的手机号码！"),!e)return void Object(o.Toast)({message:a,position:"bottom",duration:2e3})}this.$Loading.open();var n={token:this.$store.state.login.token,guest:this.personList,virtualUserPhone:this.phone,virtualUserIdcard:this.identityCard,virtualCheckcode:this.verifyCode,carts:[{skuId:this.cartItem.skuId,storeOuCode:this.cartItem.storeOuCode,number:this.memberCount,checked:"1"}],deliveryType:this.cartItem.deliverType,couNo:[]};n.orderScene=this.$util.orderScene(),this.usedCoupon.couNo&&"-1"!=this.usedCoupon.couNo&&n.couNo.push(this.usedCoupon.couNo),console.log(n),this.$http.post("/app/json/app_shopping_order/submit",n).then((function(e){t.$Loading.close();var s=e.data;0==s.status?0==parseFloat(s.data.payAmount)?t.$router.replace({path:"/mall2/paysuccess",query:{selectedIndex:3}}):t.$router.replace({path:"/mall2/checkstand",query:{payInfo:JSON.stringify(s.data),occurOuCode:t.currentOccur.ouCode}}):t.$Toast(s.info)}),(function(e){t.$Loading.close(),t.$Toast("请求数据失败！")}))}else Object(o.Toast)({message:"请输入有效的手机号码",position:"bottom",duration:2e3});else Object(o.Toast)({message:"请输入有效的身份证号",position:"bottom",duration:2e3});else Object(o.Toast)({message:"请输入验证码",position:"bottom",duration:2e3})},countOverTime:function(t){this.overtime=t},getMsgCode:function(t,e){var s=this;if(""!=this.phone){this.$refs.countBtn.startTime(),this.$Loading.open();var o={phone:this.phone,smsType:"1110",imgVerifyCode:t,uuid:e};this.$http.post("/app/json/login/sendSms",o).then((function(t){s.$Loading.close(),console.log(t.data);var e=t.data;0==e.status?s.$Toast("获取短信验证码成功"):(s.$Toast(e.info?e.info:"获取短信验证码失败"),s.$refs.countBtn.resetClock())}),(function(t){s.$Loading.close(),s.$Toast("系统运行过程中遇到问题，请稍候再试"),s.$refs.countBtn.resetClock()}))}else this.$Toast("手机号不能为空!")},deleteClick:function(t,e){this.personList.splice(e,1),this.$store.state.mall2.tripPeopleList=this.personList},couponEvent:function(){for(var t=this,e=0;e<this.currentOccur.userCanUseCoupon.length;e++)this.currentOccur.userCanUseCoupon[e].couNo==this.usedCoupon.couNo?this.currentOccur.userCanUseCoupon[e].selected=!0:this.currentOccur.userCanUseCoupon[e].selected=!1;a.a.open({initData:{listData:[],userCanNotUseCoupon:this.currentOccur.userCanNotUseCoupon,userCanUseCoupon:this.currentOccur.userCanUseCoupon,type:"use",skuId:"",categoryId:"",storeOuCode:"",token:this.$store.state.login.token},selectedCoupon:function(e){console.log(e),t.usedCoupon=e,t._settleCart(),a.a.close()}})},_settleCart:function(){var t=this;this.$Loading.open();var e={token:this.$store.state.login.token,carts:[{skuId:this.cartItem.skuId,storeOuCode:this.cartItem.storeOuCode,number:this.memberCount,checked:"1"}],deliveryType:this.cartItem.deliverType,couNo:[]};console.log(this.usedCoupon),this.usedCoupon.couNo&&e.couNo.push(this.usedCoupon.couNo),console.log(e),this.$http.post("/app/json/app_cart/SettleCart",e).then((function(e){t.$Loading.close();var s=e.data;0==s.status?(t.occur=s.data.occur,t.currentOccur=t.occur[0],t.$mallCommon.isExistCanNotAttendActivity(s.data.occur,!0)):t.$Toast(s.info)}),(function(e){t.$Loading.close(),t.$Toast("请求数据失败！")}))},turnback:function(){this.$router.go(-1),this.$keepaliveHelper.deleteCache(this)}},watch:{memberCount:function(t,e){t&&this._settleCart()},"$store.state.mall2.tripPeopleList":function(){this.personList=this.$store.state.mall2.tripPeopleList},verifyCode:function(t){this.verifyCode=this.$util.checkVerifyCodeLenght(this.verifyCode)}},created:function(){if(this.occur=this.$route.params.occur?this.$route.params.occur:[],this.proName=this.$route.params.proName?this.$route.params.proName:"",this.saleNumBegin=this.$route.params.saleNumBegin,this.saleNumStep=this.$route.params.saleNumStep,this.saleNumMax=this.$route.params.saleNumMax,this.stockNum=this.$route.params.stockNum,this.mobileParam=this.$route.params.mobileParam?this.$route.params.mobileParam:"",this.countMax=this.saleNumMax>this.stockNum?this.stockNum:this.saleNumMax,this.occur.length){this.currentOccur=this.occur[0];var t=this.currentOccur.couNo;t.length>0&&(this.usedCoupon.couNo=t[0])}if(this.currentOccur.store.length){var e=this.currentOccur.store[0].activity;if(e.length){if(e.length){var s=e[0];s.cart.length&&(this.cartItem=s.cart[0],this.memberCount=this.cartItem.number)}}else e=this.currentOccur.store[0].noActivityCart,this.cartItem=e[0],this.memberCount=this.cartItem.number}},beforeRouteLeave:function(t,e,s){this.$keepaliveHelper.deleteCache(this),s()}},r=(s("jWeo"),s("KHd+")),c=Object(r.a)(n,(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"fillorder mall2"},[s("nav-top",{on:{backEvent:t.turnback}}),t._v(" "),s("nav-content",[s("div",{staticClass:"scroll-order"},[s("div",{staticClass:"top-title shadow-cell edge left-icon"},[s("div",{staticClass:"attention"},[s("div",{staticClass:"left-icon"},[s("P",{staticClass:"bigtitle"},[t._v(t._s(t.proName))])],1),t._v(" "),s("P",{staticClass:"right-note theme_font_red",on:{click:t.readDescription}},[t._v("购买说明")])],1)]),t._v(" "),s("div",{staticClass:"top-title shadow-cell edge"},[s("P",{staticClass:"bigtitle"},[t._v("使用日期"),s("span",{staticClass:"use-date theme_font_red"},[t._v("("+t._s(t.cartItem.bookingDate)+")")])]),t._v(" "),s("div",{staticClass:"limit-con"},[s("div",{staticClass:"left-place"},[s("p",{staticClass:"bigtitle"},[t._v(t._s(t.cartItem.bookingType)+"  \n              "),s("span",{staticClass:"small-font theme_font_red"},[t._v("￥")]),s("span",{staticClass:"bigtitle theme_font_red"},[t._v(t._s(t.cartItem.price))])]),t._v(" "),s("div",{staticClass:"content theme_font_common"},[t._v("成人或身高1.5米（不含）以上儿童")]),t._v(" "),s("div",{staticClass:"content theme_font_red"},[t._v("每笔订单最多可购20张，最少不少于1张")])]),t._v(" "),s("div",{staticClass:"right-place"},[s("van-stepper",{attrs:{min:t.saleNumBegin,max:t.countMax,step:t.saleNumStep,integer:""},on:{change:t.numChange},model:{value:t.memberCount,callback:function(e){t.memberCount=e},expression:"memberCount"}})],1)])],1),t._v(" "),s("div",{staticClass:"top-title shadow-cell edge"},[s("div",{staticClass:"menmber"},[s("P",{staticClass:"bigtitle"},[t._v("出行人"),s("span",{staticClass:"small-font"},[t._v("（您需填写"+t._s(t.memberCount)+"位出行人）")])])],1),t._v(" "),t._l(t.personList,(function(e,o){return t.personList.length?s("div",{staticClass:"person-cell"},[s("div",{staticClass:"info-row theme_font_gray"},[s("span",{staticClass:"theme_font_common"},[t._v("姓名")]),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.name,expression:"person.name"}],attrs:{placeholder:"请输入出行人姓名"},domProps:{value:e.name},on:{input:function(s){s.target.composing||t.$set(e,"name",s.target.value)}}})]),t._v(" "),s("div",{staticClass:"info-row theme_font_gray"},[s("span",{staticClass:"theme_font_common"},[t._v("身份证号")]),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.Idcard,expression:"person.Idcard"}],attrs:{placeholder:"请输入出行人身份证号码"},domProps:{value:e.Idcard},on:{input:function(s){s.target.composing||t.$set(e,"Idcard",s.target.value)}}})]),t._v(" "),s("div",{staticClass:"info-row theme_font_gray"},[s("span",{staticClass:"theme_font_common"},[t._v("手机号")]),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.phone,expression:"person.phone"}],attrs:{placeholder:"请输入出行人手机号"},domProps:{value:e.phone},on:{input:function(s){s.target.composing||t.$set(e,"phone",s.target.value)}}})])]):t._e()}))],2),t._v(" "),s("div",{staticClass:"top-title shadow-cell edge"},[s("div",{staticClass:"bigtitle"},[t._v("联系人信息"),s("span",{staticClass:"small-font"},[t._v("（必填）")])]),t._v(" "),s("div",{staticClass:"fields"},[s("div",{staticClass:"info-row theme_font_gray"},[s("span",{staticClass:"theme_font_common"},[t._v("手机号")]),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.phone,expression:"phone"}],attrs:{placeholder:"仅支持中国大陆手机号"},domProps:{value:t.phone},on:{input:function(e){e.target.composing||(t.phone=e.target.value)}}}),t._v(" "),s("div",[s("count-button",{ref:"countBtn",staticClass:"theme_font_red_i",attrs:{phone:t.phone},on:{getSmsEvent:t.getMsgCode}})],1)]),t._v(" "),s("div",{staticClass:"info-row theme_font_gray"},[s("span",{staticClass:"theme_font_common"},[t._v("验证码")]),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.verifyCode,expression:"verifyCode"}],attrs:{placeholder:"请输入验证码"},domProps:{value:t.verifyCode},on:{input:function(e){e.target.composing||(t.verifyCode=e.target.value)}}})]),t._v(" "),s("div",{staticClass:"info-row theme_font_gray"},[s("span",{staticClass:"theme_font_common"},[t._v("身份证号")]),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.identityCard,expression:"identityCard"}],attrs:{placeholder:"请输入18位有效身份证"},domProps:{value:t.identityCard},on:{input:function(e){e.target.composing||(t.identityCard=e.target.value)}}})])])]),t._v(" "),s("div",{staticClass:"top-title shadow-cell edge"},[s("div",{staticClass:"info-row theme_font_gray",on:{click:t.couponEvent}},[s("span",{staticClass:"theme_font_common"},[t._v("优惠券")]),t._v(" "),s("div",{staticClass:"value theme_font_black"},[t._v("优惠"+t._s(t.$util.toDecimal2(t.currentOccur.couponAmount))+"元")]),t._v(" "),s("div",[s("i",{staticClass:"iconfont mall-gengduojiantou theme_font_gray"})])]),t._v(" "),s("div",{staticClass:"info-row theme_font_gray"},[s("span",{staticClass:"theme_font_common"},[t._v("发票")]),t._v(" "),s("div",{staticClass:"value theme_font_tint"},[t._v("请参考商品详情说明或联系商家咨询")])])]),t._v(" "),s("div",{staticClass:"block-div"},[s("div",{staticClass:"flex-row"},[s("div",{staticClass:"label-middle full theme_font_common"},[t._v("商品金额")]),t._v(" "),s("div",{staticClass:"theme_font_black"},[t._v("￥"+t._s(t.$util.toDecimal2(t.currentOccur.amount)))])]),t._v(" "),s("div",{staticClass:"flex-row"},[s("div",{staticClass:"label-middle full theme_font_common"},[t._v("立减")]),t._v(" "),s("div",{staticClass:"theme_font_red"},[t._v("-￥"+t._s(t.$util.toDecimal2(t.currentOccur.discountAmount)))])]),t._v(" "),s("div",{staticClass:"flex-row"},[s("div",{staticClass:"label-middle full theme_font_common"},[t._v("优惠券")]),t._v(" "),s("div",{staticClass:"theme_font_red"},[t._v("-￥"+t._s(t.$util.toDecimal2(t.currentOccur.couponAmount)))])]),t._v(" "),s("div",{staticClass:"flex-row"},[s("div",{staticClass:"label-middle full theme_font_common"},[t._v("积分")]),t._v(" "),s("div",{staticClass:"theme_font_red"},[t._v("-￥"+t._s(t.$util.toDecimal2(t.currentOccur.pointsAmount)))])])])]),t._v(" "),s("div",{staticClass:"bottom-con"},[s("div",{staticClass:"tip-con theme_font_red theme_bg_yl"},[s("div",{staticClass:"tips"},[s("p",[t._v("请您确认平台将收集您的上述个人信息实现本服务")]),t._v(" "),s("p",[t._v("提交订单即视为同意")])])]),t._v(" "),s("div",{staticClass:"btn-con"},[s("div",{staticClass:"amount-con"},[s("p",{staticClass:"amount"},[t._v("应付总金额：\n            "),s("span",{staticClass:"theme_font_red small-font"},[t._v("￥")]),s("span",{staticClass:"theme_font_red  bigtitle"},[t._v(t._s(t.$util.toDecimal2(t.currentOccur.payAmount)))]),t._v("  共"+t._s(t.memberCount)+"张\n            ")])]),t._v(" "),s("div",{staticClass:"submit-btn theme_bg_red theme_font_white",on:{click:t._submieClick}},[s("p",[t._v("提交订单")])])])])]),t._v(" "),t.showDescription?s("pop-view",{on:{closeEvent:t.popClose}},[s("div",{staticClass:"introductions"},[s("div",{staticClass:"bigtitle"},[t._v("购买说明")]),t._v(" "),s("div",{staticClass:"subtitle theme_font_red"}),t._v(" "),s("div",{staticClass:"detail-content-div",domProps:{innerHTML:t._s(t.mobileParam)}})])]):t._e()],1)}),[],!1,null,"f3a7062e",null);e.default=c.exports},jWeo:function(t,e,s){"use strict";var o=s("A7JX");s.n(o).a}}]);
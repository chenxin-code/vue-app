(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2db0ab4c"],{"1b0a":function(t,e,s){"use strict";s("1f8e")},"1f8e":function(t,e,s){},2141:function(t,e,s){t.exports=s.p+"static/images/dc70a476ed494606d1748e349fb311c3.png"},a228:function(t,e,s){"use strict";s("eb80")},b8e8:function(t,e,s){t.exports=s.p+"static/images/eb5891cd388f2f1c8e4dad35da290ea6.png"},df21:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("nav-top",{attrs:{noBack:3==t.$store.state.webtype&&!t.$route.query.EnterFlag},on:{backEvent:t.backEvent}}),t.detailShow?s("nav-content",{staticClass:"group-detail-container"},[s("div",{staticClass:"group-detail"},[s("div",{staticClass:"detail-top"},[s("div",{staticClass:"countdown"},[s("span",[t._v("砍价倒计时:")]),s("countdown",{staticClass:"count-down-con",attrs:{hiddenDay:!1,endTime:t.detailsRow.timEnew,type:"theme_bg_white"},on:{timeOut:t.timeOut}})],1),1==t.$store.state.webtype?s("div",{staticClass:"sku-detail",on:{click:t.toDetails}},[s("span",[t._v("商品详情")])]):t._e()]),s("group",{attrs:{groupCoupon:t.detailsRow,showStatus:1,isLeader:!0},on:{success:t.success}})],1),2==t.$store.state.webtype||3==t.$store.state.webtype?s("div",{staticClass:"scrolling"},[1==t.detailsRow.state?s("div",{staticClass:"status"},[s("div",{staticClass:"text"},[t._v("已砍 "+t._s(t.$util.toDecimal2((100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.actPrice))/100))+"元，还差 "+t._s(t.$util.toDecimal2((100*Number(t.detailsRow.actPrice)-100*Number(t.detailsRow.minPrice))/100))+"元")]),s("div",{staticClass:"progress"},[s("van-progress",{attrs:{"pivot-text":"",color:"#ee0a24",percentage:100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.minPrice)?(100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.actPrice))/(100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.minPrice))*100:0}})],1),s("div",{staticClass:"progress-text"},[s("span",[t._v("¥ "+t._s(t.$util.toDecimal2(Number(100*t.detailsRow.origPrice-100*Number(t.detailsRow.minPrice))/100))+"元")])]),t.isCutPrice&&1==t.getIsTakePartCutObj.role?s("div",{staticClass:"progress-text"},[s("span",{staticStyle:{display:"block",margin:"0 auto","font-size":"16px"}},[t._v("助力成功")])]):t._e(),s("div",{staticClass:"btn"},[t.isCutPrice?t._e():s("span",{on:{click:function(e){return e.stopPropagation(),t.assistance(t.detailsRow)}}},[t._v("我要助力")]),t.isCutPrice&&0==t.getIsTakePartCutObj.role?s("span",{on:{click:function(e){return e.stopPropagation(),t.launchBtn(t.detailsRow)}}},[t._v("邀请好友砍价")]):t._e(),t.isCutPrice&&1==t.getIsTakePartCutObj.role?s("span",{on:{click:function(e){return e.stopPropagation(),t.enterHome.apply(null,arguments)}}},[t._v("发起我的砍价")]):t._e(),t.isCutPrice||1!=t.getIsTakePartCutObj.role?t._e():s("span",{on:{click:function(e){return e.stopPropagation(),t.enterHome.apply(null,arguments)}}},[t._v("发起我的砍价")])])]):t._e(),2==t.detailsRow.state?s("div",{staticClass:"status success"},[s("div",{staticClass:"text"},[t._v("已砍 "+t._s(t.$util.toDecimal2((100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.actPrice))/100))+"元，还差 "+t._s(t.$util.toDecimal2((100*Number(t.detailsRow.actPrice)-100*Number(t.detailsRow.minPrice))/100))+"元")]),s("div",{staticClass:"progress"},[s("van-progress",{attrs:{"pivot-text":"",color:"#44ab0a",percentage:(100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.actPrice))/(100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.minPrice))*100||0}})],1),0==t.getIsTakePartCutObj.role?s("div",{staticClass:"progress-text"},[s("span",{staticStyle:{"margin-right":"90px"}},[t._v("恭喜您砍价成功！")]),s("span",[t._v("¥ "+t._s(t.$util.toDecimal2(Number(100*t.detailsRow.origPrice-100*Number(t.detailsRow.minPrice))/100))+"元")])]):t._e(),0!=t.getIsTakePartCutObj.role?s("div",{staticClass:"progress-text"},[s("span",{staticStyle:{"margin-right":"90px"}},[t._v("您的好友已完成砍价")]),s("span",[t._v("¥ "+t._s(t.$util.toDecimal2(Number(100*t.detailsRow.origPrice-100*Number(t.detailsRow.minPrice))/100))+"元")])]):t._e(),t.isCutPrice&&1==t.getIsTakePartCutObj.role?s("div",{staticClass:"progress-text"},[s("span",{staticStyle:{display:"block",margin:"0 auto","font-size":"16px"}},[t._v("助力成功")])]):t._e(),2==t.detailsRow.orderState?s("div",{staticClass:"btn"},[t.getIsTakePartCutObj.role?t._e():s("span",{on:{click:function(e){return e.stopPropagation(),t.payEvent(t.detailsRow)}}},[t._v("去支付")]),t.getIsTakePartCutObj.role?s("span",{on:{click:function(e){return e.stopPropagation(),t.enterHome.apply(null,arguments)}}},[t._v("发起我的砍价")]):t._e()]):t._e(),3==t.detailsRow.orderState?s("div",{staticClass:"btn"},[t.getIsTakePartCutObj.role?t._e():s("span",[t._v("已支付")]),t.getIsTakePartCutObj.role?s("span",{on:{click:function(e){return e.stopPropagation(),t.enterHome.apply(null,arguments)}}},[t._v("发起我的砍价")]):t._e()]):s("div",{staticClass:"btn"},[0==t.getIsTakePartCutObj.role?s("span",{on:{click:function(e){return e.stopPropagation(),t.successBtn(t.detailsRow)}}},[t._v("立即购买")]):t._e(),1==t.getIsTakePartCutObj.role?s("span",{on:{click:function(e){return e.stopPropagation(),t.enterHome.apply(null,arguments)}}},[t._v("发起我的砍价")]):t._e()])]):t._e(),3==t.detailsRow.state||4==t.detailsRow.state?s("div",{staticClass:"status fail"},[s("div",{staticClass:"text"},[t._v("已砍 "+t._s(t.$util.toDecimal2((100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.actPrice))/100))+"元，还差 "+t._s(t.$util.toDecimal2((100*Number(t.detailsRow.actPrice)-100*Number(t.detailsRow.minPrice))/100))+"元")]),s("div",{staticClass:"progress"},[s("van-progress",{attrs:{"pivot-text":"",color:"#ee0a24",percentage:(100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.actPrice))/(100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.minPrice))*100||0}})],1),s("div",{staticClass:"progress-text"},[s("span",[t._v("¥ "+t._s(t.$util.toDecimal2(Number(100*t.detailsRow.origPrice-100*Number(t.detailsRow.minPrice))/100))+"元")])]),4==t.detailsRow.state&&0==t.getIsTakePartCutObj.role?s("div",{staticClass:"progress-tip"},[s("span",[t._v("您慢了一步，本场活动已销售空，砍价失败")])]):t._e(),1==t.getIsTakePartCutObj.role?s("div",{staticClass:"progress-tip"},[s("span",[t._v("您的好友砍价已失败")])]):t._e(),s("div",{staticClass:"btn"},[s("span",{on:{click:function(e){return e.stopPropagation(),t.failBtn.apply(null,arguments)}}},[t._v("砍价失败")])])]):t._e(),t.prizeCoupon.length?s("p",[t._v("帮砍赠券")]):t._e(),s("div",{staticClass:"evaluation"},t._l(t.prizeCoupon,(function(e,a){return s("couponGroup",{key:a,attrs:{groupCoupon:e,detailsRow:t.detailsRow,getIsTakePartCutObj:t.getIsTakePartCutObj,isCutPrice:t.isCutPrice},on:{getCouScan:t.getCouScan}})})),1),s("p",[t._v("砍价记录")]),s("div",{staticClass:"evaluation"},[t._l(t.friendList,(function(e,a){return s("div",{directives:[{name:"show",rawName:"v-show",value:a<3||t.isEvaluation,expression:"index < 3 || isEvaluation"}],key:a,staticClass:"evaluation-top"},[s("span",[t._v(t._s(e.userName))]),s("span",[t._v(t._s(e.role?"帮砍":"自砍")+" ¥"+t._s(e.cutPrice))]),s("span",[t._v(t._s(e.cutTime))])])})),t.friendList.length&&t.friendList.length>=3?s("div",{staticClass:"evaluationBtn"},[s("div",{staticClass:"evaluationText",on:{click:function(e){t.isEvaluation=!t.isEvaluation}}},[t.isEvaluation?t._e():s("span",[t._v("查看更多")]),t.isEvaluation?s("van-icon",{attrs:{name:"arrow-up"}}):t._e(),t.isEvaluation?s("span",[t._v("收起")]):t._e(),t.isEvaluation?t._e():s("van-icon",{attrs:{name:"arrow-down"}})],1)]):t._e(),s("div",{staticClass:"evaluationBtn",staticStyle:{color:"#989898"}},[t._v(" 暂无其他砍价记录~ ")])],2),s("p",[t._v("砍价流程")]),s("div",{staticClass:"group-process"},[s("div",{staticClass:"group-process-content"}),s("div",{staticClass:"group-process-actDesc",domProps:{innerHTML:t._s(t.detailsRow.actDesc)}},[t._v(t._s(t.rexFilter(t.detailsRow.actDesc)))])])]):s("div",{staticClass:"scrolling"},[1==t.detailsRow.state?s("div",{staticClass:"status"},[s("div",{staticClass:"text"},[t._v("已砍 "+t._s(t.$util.toDecimal2((100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.actPrice))/100))+"元，还差 "+t._s(t.$util.toDecimal2((100*Number(t.detailsRow.actPrice)-100*Number(t.detailsRow.minPrice))/100))+"元")]),s("div",{staticClass:"progress"},[s("van-progress",{attrs:{"pivot-text":"",color:"#ee0a24",percentage:100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.minPrice)?(100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.actPrice))/(100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.minPrice))*100:0}})],1),s("div",{staticClass:"progress-text"},[s("span",[t._v("¥ "+t._s(t.$util.toDecimal2(Number(100*t.detailsRow.origPrice-100*Number(t.detailsRow.minPrice))/100))+"元")])]),s("div",{staticClass:"btn"},[s("span",{on:{click:function(e){return e.stopPropagation(),t.launchBtn(t.detailsRow)}}},[t._v("邀请好友砍价")])])]):t._e(),2==t.detailsRow.state?s("div",{staticClass:"status success"},[s("div",{staticClass:"text"},[t._v("已砍成功")]),s("div",{staticClass:"progress"},[s("van-progress",{attrs:{"pivot-text":"",color:"#44ab0a",percentage:(100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.actPrice))/(100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.minPrice))*100||0}})],1),0==t.getIsTakePartCutObj.role?s("div",{staticClass:"progress-text"},[s("span",{staticStyle:{"margin-right":"90px"}},[t._v("恭喜您砍价成功！")]),s("span",[t._v("¥ "+t._s(t.$util.toDecimal2(Number(100*t.detailsRow.origPrice-100*Number(t.detailsRow.minPrice))/100))+"元")])]):t._e(),0!=t.getIsTakePartCutObj.role?s("div",{staticClass:"progress-text"},[s("span",{staticStyle:{"margin-right":"90px"}},[t._v("您的好友已完成砍价")]),s("span",[t._v("¥ "+t._s(t.$util.toDecimal2(Number(100*t.detailsRow.origPrice-100*Number(t.detailsRow.minPrice))/100))+"元")])]):t._e(),s("div",{staticClass:"btn"},[0==t.getIsTakePartCutObj.role&&3==t.detailsRow.orderState?s("span",[t._v("已支付")]):t._e(),0==t.getIsTakePartCutObj.role&&2==t.detailsRow.orderState?s("span",{on:{click:function(e){return e.stopPropagation(),t.payEvent(t.detailsRow)}}},[t._v("去支付")]):t._e(),0==t.getIsTakePartCutObj.role&&2!=t.detailsRow.orderState&&3!=t.detailsRow.orderState?s("span",{on:{click:function(e){return e.stopPropagation(),t.successBtn(t.detailsRow)}}},[t._v("立即购买")]):t._e(),1==t.getIsTakePartCutObj.role?s("span",{on:{click:function(e){return e.stopPropagation(),t.launchBtn(t.detailsRow)}}},[t._v("邀请好友砍价")]):t._e(),1==t.getIsTakePartCutObj.role?s("span",{on:{click:function(e){return e.stopPropagation(),t.enterHome.apply(null,arguments)}}},[t._v("发起我的砍价")]):t._e()])]):t._e(),3==t.detailsRow.state||4==t.detailsRow.state?s("div",{staticClass:"status fail"},[s("div",{staticClass:"text"},[t._v("已砍 "+t._s(t.$util.toDecimal2((100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.actPrice))/100))+"元，还差 "+t._s(t.$util.toDecimal2((100*Number(t.detailsRow.actPrice)-100*Number(t.detailsRow.minPrice))/100))+"元")]),s("div",{staticClass:"progress"},[s("van-progress",{attrs:{"pivot-text":"",color:"#ee0a24",percentage:(100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.actPrice))/(100*Number(t.detailsRow.origPrice)-100*Number(t.detailsRow.minPrice))*100||0}})],1),s("div",{staticClass:"progress-text"},[s("span",[t._v("¥ "+t._s(t.$util.toDecimal2(Number(100*t.detailsRow.origPrice-100*Number(t.detailsRow.minPrice))/100))+"元")])]),4==t.detailsRow.state&&0==t.getIsTakePartCutObj.role?s("div",{staticClass:"progress-tip"},[s("span",[t._v("您慢了一步，本场活动已销售空，砍价失败")])]):t._e(),1==t.getIsTakePartCutObj.role?s("div",{staticClass:"progress-tip"},[s("span",[t._v("您的好友砍价已失败")])]):t._e(),s("div",{staticClass:"btn"},[s("span",{on:{click:function(e){return e.stopPropagation(),t.failBtn.apply(null,arguments)}}},[t._v("砍价失败")])])]):t._e(),t.prizeCoupon.length?s("p",[t._v("帮砍赠券")]):t._e(),s("div",{staticClass:"evaluation"},t._l(t.prizeCoupon,(function(e,a){return s("couponGroup",{key:a,attrs:{groupCoupon:e,detailsRow:t.detailsRow,getIsTakePartCutObj:t.getIsTakePartCutObj,isCutPrice:t.isCutPrice},on:{getCouScan:t.getCouScan}})})),1),t.friendList.length?s("p",[t._v("砍价记录")]):t._e(),t.friendList.length?s("div",{staticClass:"evaluation"},[t._l(t.friendList,(function(e,a){return s("div",{directives:[{name:"show",rawName:"v-show",value:a<3||t.isEvaluation,expression:"index < 3 || isEvaluation"}],key:a,staticClass:"evaluation-top"},[s("span",[t._v(t._s(e.userName))]),s("span",[t._v(t._s(e.role?"帮砍":"自砍")+" ¥"+t._s(e.cutPrice))]),s("span",[t._v(t._s(e.cutTime))])])})),t.friendList.length&&t.friendList.length>=3?s("div",{staticClass:"evaluationBtn"},[s("div",{staticClass:"evaluationText",on:{click:function(e){t.isEvaluation=!t.isEvaluation}}},[t.isEvaluation?t._e():s("span",[t._v("查看更多")]),t.isEvaluation?s("van-icon",{attrs:{name:"arrow-up"}}):t._e(),t.isEvaluation?s("span",[t._v("收起")]):t._e(),t.isEvaluation?t._e():s("van-icon",{attrs:{name:"arrow-down"}})],1)]):t._e()],2):t._e(),s("p",[t._v("拼团流程")]),s("div",{staticClass:"group-process"},[s("div",{staticClass:"group-process-content"}),s("div",{staticClass:"group-process-actDesc",domProps:{innerHTML:t._s(t.detailsRow.actDesc)}},[t._v(t._s(t.rexFilter(t.detailsRow.actDesc)))])])])]):t._e(),s("div",{staticClass:"mall2"},[t.showPop?s("pop-view",{on:{closeEvent:t.popClose}},[s("div",{staticClass:"pop-body"},[s("div",{staticClass:"pro-row"},[s("div",{staticClass:"img-div"},[s("img",{attrs:{src:t.detailData.phMainUrl}})]),s("div",{staticClass:"info-div"},[s("div",{staticClass:"title theme_font_black",domProps:{innerHTML:t._s(t.getSkuNameStr(t.detailData))}})])]),s("div",{staticClass:"pop-scroll-div"},[s("div",{staticClass:"count-line"},[s("div",{staticClass:"full theme_font_common"},[t._v("购买数量（库存 "+t._s(t.stockNum<1e3?t.stockNum:"充足")+"）")]),s("van-stepper",{attrs:{min:t.minNum,max:t.maxNum,step:t.stepNum,integer:""},on:{change:t.numChange},model:{value:t.selectedNum,callback:function(e){t.selectedNum=e},expression:"selectedNum"}})],1)]),s("div",{staticClass:"bottom-btn theme_font_white theme_bg_red",on:{click:t.popSureEvent}},[t._v("立即购买 ")])])]):t._e()],1),s("van-popup",{staticClass:"stateBox",model:{value:t.shareView,callback:function(e){t.shareView=e},expression:"shareView"}},[s("img",{attrs:{src:"static/image/microShop/jiantou@2x.png",alt:""}}),s("p",[t._v("请点击右上角进行分享")])])],1)},i=[],o=s("5530"),r=(s("ac1f"),s("5319"),s("99af"),s("2f62")),n=s("da71"),c=s("5b7e"),l=s("ebec"),u=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[t.groupCoupon?a("div",{staticClass:"coupon",class:{shadow:!0},on:{click:function(e){return e.stopPropagation(),t.toDetails(t.groupCoupon)}}},[a("div",{staticClass:"coupon-type",style:{width:"65px",height:"65px"}},[a("img",{directives:[{name:"lazy",rawName:"v-lazy",value:t.formatPic||s("2141"),expression:"formatPic || require('../image/券@2x.png')"}],staticClass:"img",attrs:{alt:""}})]),a("div",{staticClass:"coupon-content"},[a("div",{staticClass:"content-operation"},[a("span",{staticClass:"title"},[t._v(" "+t._s(t.groupCoupon.prizeName)+" ")]),a("span",{staticClass:"operation"},[t._v(t._s(t.time(t.groupCoupon.startValidateTime||"")+" - "+t.time(t.groupCoupon.endValidateTime)))])]),3!=t.detailsRow.state&&t.getIsTakePartCutObj.role?a("div",{staticClass:"content-Btn"},[t.isCutPrice?t._e():a("span",[t._v("帮砍后领取")]),t.isCutPrice&&!t.getIsTakePartCutObj.isGetPrize?a("span",{on:{click:function(e){return e.stopPropagation(),t.getCouScan(t.groupCoupon)}}},[t._v("点击领取")]):t._e(),t.isCutPrice&&t.getIsTakePartCutObj.isGetPrize?a("span",{on:{click:function(e){return e.stopPropagation(),t.couponList.apply(null,arguments)}}},[t._v("去使用")]):t._e()]):t._e(),3==t.detailsRow.state||t.getIsTakePartCutObj.role?t._e():a("div",{staticClass:"content-Btn"},[a("span",[t._v("帮砍后领取")])])])]):t._e()])},d=[],p=(s("1276"),s("69f4")),m={name:"",components:{Countdown:p["default"]},props:{isCutPrice:{type:Boolean,required:!1,default:!1},getIsTakePartCutObj:{type:Object,default:function(){return null}},detailsRow:{type:Object,default:function(){return null}},groupCoupon:{type:Object,default:function(){return null}}},data:function(){return{}},mounted:function(){},computed:Object(o["a"])(Object(o["a"])({},Object(r["c"])(["userInfo"])),{},{formatPic:function(){var t="";return this.groupCoupon&&this.groupCoupon.coupon&&this.groupCoupon.couPic&&(t=this.$util.formatImage(this.groupCoupon.couPic)),t}}),methods:{time:function(t){var e=t.split(" ");return e[0]},getCouScan:function(t){this.$emit("getCouScan",t)},couponList:function(){this.$router.push({path:"/coupon_list"})}}},g=m,v=(s("1b0a"),s("0c7c")),h=Object(v["a"])(g,u,d,!1,null,"3eaaa88c",null),C=h.exports,b={name:"",data:function(){return{detailShow:!1,shareView:!1,time:"",param:{},skuItem:{},showPop:!1,deliveryType:"",selectedNum:1,stepNum:1,maxNum:1,minNum:1,stockNum:1,detailData:{},getIsTakePartCutObj:{role:0,isGetPrize:0},bargainOrderId:"",prizeCoupon:[],friendList:[],detailsRow:{tagging:"bargainDetails"},isEvaluation:!1,isCutPrice:!1}},computed:Object(o["a"])(Object(o["a"])({},Object(r["c"])(["userInfo"])),{},{bg:function(){return s("b8e8")}}),activated:function(){this.showPop=!1,this.skuItem=this.$route.query,this.param.id=this.skuItem.origId,1!=this.$store.state.webtype&&(this.param.origUserId=this.$route.query.userId),this.getdDetails(this.param),this._getProductDetail()},mounted:function(){},methods:{rexFilter:function(t){var e=t.replace(/&([^&;]+);/g,(function(t,e){var s={quot:'"',lt:"<",gt:">",apos:"'",amp:"&",ldquo:"“",rdquo:"”"},a=s[e];return"string"===typeof a?a:t}));return e},enterHome:function(){this.$router.push({path:"/bargain/home"})},shareM:function(){var t={},e=this.detailsRow;if(t.title=e.proName,t.sharetext=e.actDesc,t.imageurl=e.pcMainUrl,t.detailurl=this.$store.state.globalConfig.wxBaseUrl+n["a"].shareUrl+"/bargain/bargain_details?id=".concat(this.skuItem.id,"&skuId=").concat(this.skuItem.skuId,"&productId=").concat(this.skuItem.id,"&bargainActId=").concat(this.skuItem.bargainActId,"&storeOuCode=").concat(this.skuItem.storeOuCode,"&oprice=").concat(e.originalPrice||e.origPrice,"&kprice=").concat(e.minPrice,"&userId=").concat(this.userInfo.userId,"&origId=").concat(this.skuItem.origId),1==this.$store.state.webtype);else if(2==this.$store.state.webtype)c["a"].wxSetShareData(t);else if(3==this.$store.state.webtype){c["a"].wxmpPath(this.$route);var s={title:e.proName,path:n["a"].shareUrl+"/bargain/bargain_details?id=".concat(this.skuItem.id,"&skuId=").concat(this.skuItem.skuId,"&productId=").concat(this.skuItem.id,"&bargainActId=").concat(this.skuItem.bargainActId,"&storeOuCode=").concat(this.skuItem.storeOuCode,"&oprice=").concat(e.originalPrice||e.origPrice,"&kprice=").concat(e.minPrice,"&userId=").concat(this.userInfo.userId,"&origId=").concat(this.skuItem.origId),imageUrl:e.pcMainUrl};wx.miniProgram.postMessage({data:JSON.stringify(s)})}},phone:function(t){var e=/(\d{3})\d*(\d{4})/;return t.replace(e,"$1****$2")},getIsTakePartCut:function(t){var e=this;this.$request.post("/app/json/user_bargain/getIsTakePartCut",{origId:t,origUserId:this.detailsRow.origUserId}).then((function(t){0==t.status?(e.isCutPrice=!!t.data,e.getIsTakePartCutObj=t.data||{},e.detailShow=!0):e.$Toast(t.info)}))},timeOut:function(){var t=this;this.$request.post("/app/json/user_bargain/bargainActEnd",{id:this.detailsRow.id}).then((function(e){0==e.status||t.$Toast(e.info)}))},toDetails:function(){var t="/bargain/prodetail";this.$router.push({path:t,query:Object.assign({},this.skuItem,{justdetail:1})})},getdDetails:function(t){var e=this;this.$request.post("/app/json/user_bargain/getBargainProductDetail",t).then((function(t){0==t.status?(e.detailsRow=Object.assign({},{tagging:"bargainDetails"},t.data||{}),e.detailsRow.timEnew=e.$util.getDateFromString(e.detailsRow.createTime)+60*e.detailsRow.lengthTime,e.prizeCoupon=JSON.parse(e.detailsRow.prizeCoupon),e.getIsTakePartCut(e.detailsRow.id),e.shareM(),e.getFriendList()):(e.$Toast(t.info),e.detailsRow=Object.assign({},{tagging:"bargainDetails"}))}))},getFriendList:function(){var t=this,e=Object.assign({origId:this.detailsRow.id},{productId:this.detailsRow.productId,bargainActId:this.detailsRow.bargainActId,origUserId:this.detailsRow.origUserId});this.$request.post("/app/json/user_bargain/getFriendList",e).then((function(e){0==e.status?t.friendList=e.data||[]:t.$Toast(e.info)}))},getCouScan:function(t){var e=this;this.$request.post("/app/json/user_bargain/startPrizeAct",Object.assign({},{id:this.detailsRow.id,actId:this.detailsRow.actId},this.param)).then((function(t){0==t.status?(e.$Toast("领取成功"),e.getdDetails(e.param)):e.$Toast(t.info)}))},cutPriceBtn:function(){var t=this,e={productId:this.detailsRow.productId};1!=this.$store.state.webtype?(e.role=1,e.origUserId=this.detailsRow.origUserId):e.role=0,this.$request.post("/app/json/user_bargain/cutPrice",e).then((function(e){0==e.status?(t.$Toast("助力成功"),t.getdDetails(t.param),t.getFriendList(t.param)):t.$Toast(e.info)}))},success:function(){},assistance:function(){var t=this;this.$request.post("/app/json/user_bargain/cutPrice",{origId:this.detailsRow.id,productId:this.detailsRow.productId,origUserId:this.detailsRow.origUserId,role:1}).then((function(e){0==e.status?(t.$Toast("助力成功"),t.getdDetails(t.param),t.getFriendList(t.param)):t.$Toast(e.info)}))},launchBtn:function(t){var e=this,s={};s.title=t.proName,s.sharetext=t.actDesc,s.imageurl=t.pcMainUrl,s.detailurl=this.$store.state.globalConfig.wxBaseUrl+n["a"].shareUrl+"/bargain/bargain_details?id=".concat(this.skuItem.id,"&skuId=").concat(this.skuItem.skuId,"&productId=").concat(this.skuItem.id,"&bargainActId=").concat(this.skuItem.bargainActId,"&storeOuCode=").concat(this.skuItem.storeOuCode,"&oprice=").concat(t.originalPrice||t.origPrice,"&kprice=").concat(t.minPrice,"&userId=").concat(this.userInfo.userId,"&origId=").concat(this.skuItem.origId),1==this.$store.state.webtype?this.$bridgefunc.wechatShare(s):2==this.$store.state.webtype?c["a"].getWechatSignature((function(t){t&&(e.shareView=!0)})):3==this.$store.state.webtype&&(this.shareView=!0)},failBtn:function(){},payEvent:function(t){var e=this,s={orderType:"200015",orderId:t.orderId};this.$request.post("/app/json/app_shopping_order/detail",s).then((function(t){if(0==t.status){var s=t.data||{};e.$router.push({path:"/mall2/checkstand",query:{payInfo:JSON.stringify({orderId:s.id,orderType:s.orderType,payAmount:s.payAmount,tradeNo:s.tradeNo}),occurOuCode:s.ouCode,cutPrice:!0}})}else e.$Toast(t.info)}))},successBtn:function(){var t=this;this.$Loading.open();var e="/app/json/app_cart/SettleCart",s={token:this.$store.state.login.token,carts:[{skuId:this.detailData.skuId,storeOuCode:this.detailData.storeOuCode,number:1,checked:"1"}],deliveryType:this.detailData.deliveryType,userAddress:this.$store.state.mall2.selectAddress,pickupId:this.$store.state.mall2.zitiAddress.id,bargainOrderId:this.detailsRow.id};2==this.deliveryType&&this.$store.state.mall2.selectAddress.id>0&&(s.userAddressId=this.$store.state.mall2.selectAddress.id),this.$http.post(e,s).then((function(e){t.$Loading.close();var a=e.data;if(0==a.status){var i={cutPrice:1,res:a.data,paramsData:s,productType:t.detailData.productType,deliveryType:t.detailData.deliveryType,skuCode:t.$route.query.skuCode,storeOuCode:t.$route.query.storeOuCode},o=t.$route.query.recommendPhone;o&&void 0!=o&&""!=o&&(i.recommendPhone=o),t.$store.state.mall2.selectAddress.id>0||2!=t.detailData.deliveryType||(t.matchAddress?(t.$store.state.mall2.selectAddress=t.matchAddress,t.$bridgefunc.vuexStorage((function(){}))):i.noMatch=!0),1==t.$mallCommon.isExistCanNotAttendActivity(a.data.occur)?t.$MessageBox.confirm("部分商品不能参加活动</br>将按原价购买，是否继续？","提示",{confirmButtonText:"确定"}).then((function(e){t.$router.push({name:"填写订单",params:i})}))["catch"]((function(t){})):t.$router.push({name:"填写订单",params:i})}else t.$Toast(a.info)}),(function(e){t.$Loading.close(),t.$Toast("请求数据失败！")}))},_getProductDetail:function(){var t=this;this.$Loading.open();var e="/app/json/product/getAppProDetail",s={token:this.$store.state.login.token,skuId:this.skuItem.skuId,featureValueIds:this.myFeatures,lng:this.$store.state.currentLocation.posx,lat:this.$store.state.currentLocation.posy,deliverType:this.$store.state.mall2.staticDeliverType};1!=s.deliverType&&""!=s.deliverType||(s.pickUpId=this.$store.state.mall2.zitiAddress.id,s.pickupStoreOuCode=this.$store.state.mall2.zitiAddress.storeCode?this.$store.state.mall2.zitiAddress.storeCode:this.$route.query.storeOuCode?this.$route.query.storeOuCode:""),this.$http.post(e,s).then((function(e){t.$Loading.close();var s=e.data;if(0==s.status){t.detailData=s.data,0===t.detailData.remainNum&&t.$Toast("活动商品库存已售空，需原价购买！"),t.selectedNum<t.detailData.saleNumBegin&&(t.selectedNum=""!=t.detailData.saleNumBegin?t.detailData.saleNumBegin:1),t.deliveryType=t.detailData.deliveryType,t.stockNum=t.detailData.stockNum||0,t.stepNum=""!=t.detailData.saleNumStep?t.detailData.saleNumStep:1,t.minNum=""!=t.detailData.saleNumBegin?t.detailData.saleNumBegin:1,t.maxNum=""!=t.detailData.saleNumMax?t.detailData.saleNumMax:-1,void 0!=t.detailData.discountGoodsCntPerOrder&&""!=t.detailData.discountGoodsCntPerOrder&&t.maxNum>t.detailData.discountGoodsCntPerOrder&&(t.maxNum=t.detailData.discountGoodsCntPerOrder);var a=t.$mallCommon.priceFromItem(t.detailData);t.detailData.dpedData=a}else t.$Toast(s.info)}),(function(e){t.$Loading.close(),t.$Toast("请求数据失败！")}))},_getCustomStock:function(){var t=this;if((2!=this.deliveryType||""!=this.$store.state.mall2.selectAddress.id&&void 0!=this.$store.state.mall2.selectAddress.id||""!=this.$store.state.mall2.selectAddress.provinceId&&void 0!=this.$store.state.mall2.selectAddress.provinceId)&&(1!=this.deliveryType||""!=this.$store.state.mall2.zitiAddress.id&&void 0!=this.$store.state.mall2.zitiAddress.id)){var e="/app/json/app_stock/querySkuStockByApp",s={token:this.$store.state.login.token,productList:[{skuId:this.detailData.skuId}],areaAddress:{province:this.$store.state.mall2.selectAddress.provinceId,city:this.$store.state.mall2.selectAddress.cityId,area:this.$store.state.mall2.selectAddress.countryId,town:this.$store.state.mall2.selectAddress.townId},productType:this.detailData.productType,deliverType:this.deliveryType,selfPickStore:this.$store.state.mall2.zitiAddress.id,storeCode:this.detailData.storeOuCode};this.$Loading.open(),this.$http.post(e,s).then((function(e){t.$Loading.close();var s=e.data;if(0==s.status){var a=s.data.productList;a.length>0&&(t.stockNum=a[0].stockCurrentNumber,-1!=t.mktStockNum&&(t.stockNum=t.mktStockNum<t.stockNum?t.mktStockNum:t.stockNum),t.maxNum=""!=t.detailData.saleNumMax?t.detailData.saleNumMax:-1,void 0!=t.detailData.discountGoodsCntPerOrder&&""!=t.detailData.discountGoodsCntPerOrder&&t.maxNum>t.detailData.discountGoodsCntPerOrder&&(t.maxNum=t.detailData.discountGoodsCntPerOrder),t.maxNum=t.maxNum>t.stockNum?t.stockNum:t.maxNum)}else 2201==s.errorCode||t.$Toast(s.info)}),(function(e){t.$Loading.close(),t.$Toast("请求数据失败！")}))}},popClose:function(){this.showPop=!1},numChange:function(){this.generateSelectedText()},generateSelectedText:function(){},getSkuNameStr:function(t){var e=t.showTitle;return"2"==t.interfaceType?e='<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">'.concat(this.$store.state.globalConfig.interface_type_name_1||"京东","</span>")+e:"1"==t.interfaceType&&(e='<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">'.concat(this.$store.state.globalConfig.interface_type_name_2||"有路","</span>")+e),e},backEvent:function(){this.$router.go(-1),this.$keepaliveHelper.deleteCache(this)}},beforeRouteLeave:function(t,e,s){t.path==this.lastPath&&this.$keepaliveHelper.deleteCache(this),s()},components:{group:l["a"],Countdown:p["default"],couponGroup:C}},_=b,f=(s("a228"),Object(v["a"])(_,a,i,!1,null,"06b96548",null));e["default"]=f.exports},eb80:function(t,e,s){}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[447],{"0RZ3":function(t,a,s){t.exports=s.p+"static/img/bg1-2@2x.35bd759.png"},DCd4:function(t,a,s){"use strict";s.r(a);var i=s("2nGb"),e={name:"",mixins:[s("yV1S").a],data:function(){return{list:[],couPic:"static/image/microShop/succee-icon.png",show:!1,sharedView:!1,shareData:{},sharemiMrssage:"",shareView:!1,parzeList:"",couNo:"",awardNum:""}},created:function(){},mounted:function(){this.loadIndex()},methods:{loadIndex:function(){var t=this,a={token:this.$store.state.login.token};t.listData(a).then((function(a){console.log(a),"success"===a.data.result&&(t.list=a.data.data||[])}))},share:function(t){var a=this;console.log(t);var s=this;s.couNo=t;var e={token:this.$store.state.login.token,couNo:t};s.sharecont(e).then((function(e){console.log(e),"success"===e.data.result?(s.shareData={title:e.data.data.title,sharetext:e.data.data.subTitle,imageurl:e.data.data.imageUrl,detailurl:""+a.$store.state.globalConfig.wxBaseUrl+i.a.shareUrl+"/user_center/sharePage?couNo="+t},s.awardNum=e.data.data.awardNum,s.show=!0):s.$toast(e.data.info)}))},close:function(){this.show=!1,this.sharedView=!1},sharePage:function(){var t=this;t.show=!1,console.log("hhhhh",t.shareData),t.$bridgefunc.wechatShare(t.shareData,(function(a){if(console.log("分享",a),"1"==a){var s={token:t.$store.state.login.token,couNo:t.couNo};t.prize(s).then((function(a){console.log(a),"success"===a.data.result&&(t.parzeList=a.data.data.mktAwardModelList||[],t.parzeList.length>0&&(t.sharedView=!0))}))}else t.$toast("分享失败")}))}}},o=(s("PiXx"),s("KHd+")),n=Object(o.a)(e,(function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("div",[i("nav-top",{attrs:{title:"分享优惠券"},on:{backEvent:function(a){return t.$router.go(-1)}}}),t._v(" "),i("nav-content",[t.list.length>0?i("div",{staticClass:"box"},[i("div",{staticClass:"img"},[i("img",{attrs:{src:"static/image/microShop/banner@2x.png",alt:""}})]),t._v(" "),t._l(t.list,(function(a,s){return i("div",{key:s,staticClass:"couponDiv"},[i("div",{staticClass:"div"},[i("div",{staticClass:"divPic"},[i("div",{staticClass:"price-info"},[i("span",{staticClass:"unit"},[t._v("￥")]),i("span",{staticClass:"price"},[t._v(t._s(a.couFaceValue))])]),t._v(" "),i("div",{staticClass:"msg"},[t._v("满"+t._s(a.couFaceValue)+"元可用")])]),t._v(" "),i("div",{staticClass:"coupon-right"},[i("div",{staticClass:"double-line"},[i("span",{staticClass:"text"},[t._v(t._s(a.couTypeTitle))])]),t._v(" "),i("div",{staticClass:"time-wrapper"},[i("span",{staticClass:"time"},[t._v(t._s(a.startDate)+"-"+t._s(a.endDate))])]),t._v(" "),i("div",{staticClass:"status"}),t._v(" "),i("div",{staticClass:"used",on:{click:function(s){return t.share(a.couNo)}}},[i("img",{attrs:{src:"static/image/microShop/fenxiangico.png",alt:""}})])])])])}))],2):t._e(),t._v(" "),0==t.list.length?i("div",{staticClass:"nodata"},[t._v("暂无数据")]):t._e()]),t._v(" "),t.show?i("div",{staticClass:"tip tip2"},[i("i",{staticClass:"icon iconfont mall-guanbi",on:{click:t.close}}),t._v(" "),i("p",[t._v("优惠券分享有礼")]),t._v(" "),i("p",[i("span",[t._v("温馨提示：")]),t._v(" "),i("span",[t._v("首次分享已使用券，您将获得优惠券"+t._s(t.awardNum)+"张,好友点击后，也同样可以获得优惠券。")])])]):t._e(),t._v(" "),i("van-popup",{staticClass:"shareBox",style:{height:"15%"},attrs:{position:"bottom"},on:{click:t.sharePage},model:{value:t.show,callback:function(a){t.show=a},expression:"show"}},[i("img",{staticClass:"firendimg",attrs:{src:"static/image/microShop/zhifu2.png",alt:""}}),t._v(" "),i("p",[t._v("微信好友")])]),t._v(" "),t.sharedView?i("div",{staticClass:"boxModel",on:{click:t.close}},[i("div",{staticClass:"shared"},[i("img",{attrs:{src:s("0RZ3"),alt:""}}),t._v(" "),i("i",{staticClass:"icon iconfont mall-guanbi",on:{click:t.close}}),t._v(" "),i("p",{staticClass:"p"},[t._v("分享成功")]),t._v(" "),i("div",{staticClass:"prizes"},t._l(t.parzeList,(function(a,s){return i("p",{key:s},[t._v("恭喜您获得"+t._s(a.awardName)+t._s(a.awardNum))])})),0)])]):t._e(),t._v(" "),i("van-popup",{staticClass:"stateBox",model:{value:t.shareView,callback:function(a){t.shareView=a},expression:"shareView"}},[i("img",{attrs:{src:"static/image/microShop/jiantou@2x.png",alt:""}}),t._v(" "),i("p",[t._v("请点击右上角进行分享")])])],1)}),[],!1,null,"f0aa7460",null);a.default=n.exports},"Og/b":function(t,a,s){},PiXx:function(t,a,s){"use strict";var i=s("Og/b");s.n(i).a},yV1S:function(t,a,s){"use strict";a.a={methods:{listData:function(t){return this.$http.post("/app/json/fission_activity/getShareUsedCoupons",t)},sharecont:function(t){return this.$http.post("/app/json/fission_activity/share",t)},prize:function(t){return this.$http.post("/app/json/fission_activity/sharedReceiveAward",t)},detailData:function(t){return this.$http.post("/app/json/fission_activity/shareDetails",t)},getData:function(t){return this.$http.post("/app/json/fission_activity/beSharedReceiveAward",t)}}}}}]);
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5d39aec0"],{"294f":function(t,a,i){},"931b":function(t,a,i){"use strict";i("294f")},9576:function(t,a,i){t.exports=i.p+"static/images/607d9c66f224a5617bd4800d21a63728.png"},b6f0:function(t,a,i){"use strict";i.r(a);var e=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",[e("nav-top",{on:{backEvent:function(a){return t.$router.go(-1)}}}),e("nav-content",[e("div",{staticClass:"share-container"},[e("img",{staticClass:"title",attrs:{src:i("ba32"),alt:""}}),e("div",{staticClass:"content"},[e("p",[t._v("将订单分享给好友，需要"+t._s(t.awardActivity.awardPerson)+"人助力")]),e("p",[t._v("即可领取价值"+t._s(t.awardActivity.awardAmount)+"元"+t._s(t.awardActivity.awardName))])]),e("img",{staticClass:"btn",attrs:{src:i("9576"),alt:""},on:{click:t.sharePage}})]),e("img",{staticStyle:{display:"none"},attrs:{id:"img",src:"/static/image/microShop/1@222x.png",alt:""}})]),e("van-popup",{staticClass:"stateBox",model:{value:t.shareView,callback:function(a){t.shareView=a},expression:"shareView"}},[e("img",{attrs:{src:"static/image/microShop/jiantou@2x.png",alt:""}}),e("p",[t._v("请点击右上角进行分享")])])],1)},s=[],r=(i("99af"),i("5b7e"),i("da71")),c={name:"",data:function(){return{awardActivity:{},shareData:{},sharemiMrssage:"",shareView:!1}},mounted:function(){this.awardActivity=JSON.parse(this.$route.query.awardActivity);var t=encodeURIComponent(this.$route.query.awardActivity);this.sharemiMrssage=encodeURIComponent(this.$route.query.awardActivity);var a={title:this.awardActivity.activityTitle,sharetext:this.awardActivity.activityDesc,imageurl:this.awardActivity.activityPromotionalPic,detailurl:"".concat(this.$store.state.globalConfig.wxBaseUrl).concat(r["a"].shareUrl,"/share-gift/share-list?awardActivity=").concat(t)};this.shareData=a},methods:{sharePage:function(){if(1==this.$store.state.webtype)this.$bridgefunc.wechatShare(this.shareData);else if(3==this.$store.state.webtype){var t={title:this.awardActivity.activityTitle,path:"".concat(r["a"].shareUrl,"/share-gift/share-list?awardActivity=").concat(this.sharemiMrssage),imageUrl:this.awardActivity.activityPromotionalPic,rfrCode:this.$store.state.userInfo?this.$store.state.userInfo.userId:""};wx.miniProgram.postMessage({data:JSON.stringify(t)}),this.shareView=!0}}},components:{}},n=c,o=(i("931b"),i("0c7c")),h=Object(o["a"])(n,e,s,!1,null,"1130233a",null);a["default"]=h.exports},ba32:function(t,a,i){t.exports=i.p+"static/images/8d68d60e56ca1a51a21ab93713dc7ca9.png"}}]);
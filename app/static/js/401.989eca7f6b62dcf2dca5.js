(window.webpackJsonp=window.webpackJsonp||[]).push([[401],{HWIS:function(t,e,a){"use strict";a.r(e);var i=[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"logo-class"},[e("img",{attrs:{src:a("S03S")}}),this._v(" "),e("span",[this._v("中石油河北销售公司")])])}],o=(a("QFaU"),a("RL95")),r=(a("ilju"),a("5B+z")),s=a("oCYn"),n=(a("2nGb"),a("t1ii")),d=a.n(n),c=a("W34l");s.default.use(o.a).use(r.a);var u={data:function(){return{needUser:"3",friend:!0,activityNo:"",desc:"参与成功，你可以点击链接或者分享海报给好友，邀请参加！",activityDesc:"",homeBackgroundImage:"",buddyButtonImage:"",buddyGroupImage:"",groupFailIcon:"",buddyBackgroundImage:"",avtUrldef:d.a,listTemp:[],pNum:"3",show:!1,pinSuccess:"0",successDes:"",helpFailureMsg:"本周机会已用完，请下周再来！",helpSuccessMsg:"助力成功！您页可以发起拼团，领取优惠券！",buddyHelpMsg:"",orderNo:"",fshow:!1,sshow:!1,shareDesc:"拼团送券分享描述",shareIcon:"",shareTitle:"拼团送券分享标题",shareImage:""}},methods:{handelName:function(){var t=this,e=[{activityId:3,avtUrl:"",id:"",idLong:21,inAppId:null,joinTime:"2020-03-17 16:21:37",limitStart:null,listIndex:0,nickName:"H",objectId:null,orderId:8,userId:"646795",userPhone:"18502976290"}];if(!this.$store.state.login.token){var a=this.$util.getUrlParam(window.location.href,"token");this.$store.commit("setToken",a)}this.orderNo||(this.orderNo=this.$util.getUrlParam(window.location.href,"orderNo")),this.$http.post("/platform/json/group_buy/getGroupOrderByNo",{orderNo:this.orderNo,token:this.$store.state.login.token}).then((function(a){if(0==a.data.status)if(a.data.data.initiator)t.$router.push({path:"/groupInvite",name:"邀请好友",query:{orderNo:t.orderNo,secondStatus:!1}});else{t.helpSuccessMsg=a.data.data.groupActivity.helpSuccessMsg,t.helpFailureMsg=a.data.data.groupActivity.helpFailureMsg,t.buddyHelpMsg=a.data.data.groupActivity.buddyHelpMsg,t.activityNo=a.data.data.groupActivity.activityNo,t.activityDesc=a.data.data.groupActivity.activityDesc,t.buddyBackgroundImage=a.data.data.groupActivity.buddyBackgroundImage,t.homeBackgroundImage=a.data.data.groupActivity.homeBackgroundImage,t.buddyButtonImage=a.data.data.groupActivity.buddyButtonImage,t.buddyGroupImage=a.data.data.groupActivity.buddyGroupImage,t.pinSuccess="5",t.needUser=a.data.data.groupActivity.needUser,t.successDes=a.data.data.groupActivity.groupSuccessMsg,t.pNum=a.data.data.groupActivity.needUser-a.data.data.memberVoList.length,t.groupFailIcon=a.data.data.groupActivity.groupFailIcon,t.shareDesc=a.data.data.groupActivity.shareDesc,t.shareIcon=a.data.data.groupActivity.shareIcon,t.shareImage=a.data.data.groupActivity.shareImage,t.shareTitle=a.data.data.groupActivity.shareTitle;for(var i=0;i<t.needUser;i++)i<a.data.data.memberVoList.length?t.listTemp.push(a.data.data.memberVoList[i]):t.listTemp.push(e[0]);t.setShareConfig()}else t.$Toast({message:a.data.info,position:"bottom",duration:2e3})}))},pinCilck:function(){},Ipin:function(){this.$router.push({path:"/groupIndex",name:"拼团",query:{activityNo:this.activityNo}})},helpFriend:function(){var t=this;this.$MessageBox.confirm(this.buddyHelpMsg,"提示",{confirmButtonText:"助力"}).then((function(){t.yhelp()}))},getSign:function(t){var e=this;return new Promise((function(a,i){var o={url:t};e.$http.post("/platform/json/weixin_ticket/shareSign",o).then((function(t){"0"==t.data.status?a(t.data.data):i()}),(function(t){i()}))}))},setShareConfig:function(){var t=window.location.origin+"/app/we_chat/goPage?redirectUrl="+encodeURIComponent(window.location.origin+"/app-vue/app/#/groupHelp?orderNo="+this.orderNo);console.log(JSON.stringify({title:this.shareTitle,path:t,imageUrl:this.shareIcon,rfrCode:this.$store.state.userInfo?this.$store.state.userInfo.userId:""})),c.a.wxmpShare({title:this.shareTitle,path:t,imageUrl:this.shareIcon,rfrCode:this.$store.state.userInfo?this.$store.state.userInfo.userId:""})},showPopup:function(){this.show=!0},yhelp:function(){var t=this;this.orderNo||(this.orderNo=this.$util.getUrlParam(window.location.href,"orderNo")),this.$http.post("/platform/json/group_buy/joinGroup",{token:this.$store.state.login.token,orderNo:this.orderNo}).then((function(e){0==e.data.status?(t.listTemp=[],t.handelName(),t.$MessageBox.alert(t.helpSuccessMsg,"提示")):(t.helpFailureMsg=e.data.info,t.$MessageBox.alert(t.helpFailureMsg,"提示"))}))}},created:function(){if(this.orderNo=this.$util.getUrlParam(window.location.href,"orderNo"),!this.$store.state.login.token){var t=this.$util.getUrlParam(window.location.href,"token");this.$store.commit("setToken",t)}if(this.$store.state.login.token)this.handelName();else{var e=window.location.origin+window.location.pathname+"#/groupHelp?orderNo="+this.orderNo,a=window.location.origin+"/app/we_chat/goPage?redirectUrl="+encodeURIComponent(e);window.location.href=a}},components:{}},l=(a("bFla"),a("KHd+")),h=Object(l.a)(u,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"friend-class"},[t._m(0),t._v(" "),a("div",{staticStyle:{"text-align":"center","margin-top":"10px"}},[t.friend?a("h3",{staticStyle:{"font-size":"20px"}},[t._v("帮好友助力")]):t._e(),t._v(" "),t._e(),t._v(" "),t._e(),t._v(" "),t._e()]),t._v(" "),a("div",{staticStyle:{"text-align":"center","margin-top":"10px"}},[a("van-image",{attrs:{width:"100%",height:"auto",src:t.buddyBackgroundImage}})],1),t._v(" "),a("div",{staticStyle:{"margin-top":"15px"}},[t._v(t._s(t.desc))]),t._v(" "),a("div",{staticStyle:{width:"80%","margin-top":"15px","text-align":"center"}},t._l(t.listTemp,(function(e,i){return a("div",{key:i,staticStyle:{width:"33.33333%",float:"left"}},[e.id?a("van-image",{attrs:{round:"",width:"50px",height:"50px",src:e.avtUrl?e.avtUrl:t.avtUrldef}}):a("van-icon",{attrs:{name:"add-o",size:"55",color:"#FFDBA6"}})],1)})),0),t._v(" "),a("div",{staticStyle:{clear:"both"}}),t._v(" "),t.friend?a("div",{staticStyle:{"text-align":"center","margin-top":"15px"}},[a("van-image",{attrs:{width:"120px",height:"45px",src:t.buddyButtonImage},on:{click:t.helpFriend}}),t._v(" "),a("van-image",{staticStyle:{"margin-left":"10px"},attrs:{width:"120px",height:"45px",src:t.buddyGroupImage},on:{click:t.Ipin}})],1):t._e(),t._v(" "),a("div",{staticStyle:{"font-weight":"900","padding-top":"10px","align-self":"flex-start"}},[t._v("拼团活动规则")]),t._v(" "),a("div",{staticStyle:{"margin-top":"5px"}},[a("div",{staticStyle:{"line-height":"20px"},domProps:{innerHTML:t._s(t.activityDesc)}})])])}),i,!1,null,"1068c63e",null);e.default=h.exports},QFaU:function(t,e,a){"use strict";a("aO+S"),a("nXDD"),a("N0PS"),a("Cf6i")},S03S:function(t,e,a){t.exports=a.p+"static/img/logo.1ee120b.png"},bFla:function(t,e,a){"use strict";var i=a("r2dG");a.n(i).a},r2dG:function(t,e,a){},t1ii:function(t,e,a){t.exports=a.p+"static/img/90.cfc9b25.png"}}]);
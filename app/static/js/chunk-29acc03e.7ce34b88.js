(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-29acc03e"],{aea4:function(t,s,e){},b9c1:function(t,s,e){"use strict";e("aea4")},e7df:function(t,s,e){"use strict";e.r(s);var n=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"user-info"},[e("nav-top",{on:{backEvent:function(s){return t.$router.go(-1)}}}),e("nav-content",[e("div",{staticClass:"content"},[e("div",{staticClass:"list"},[e("div",{staticClass:"row line_bottom",on:{click:t.changeAvtUrl}},[e("div",{staticClass:"label"},[t._v("头像")]),e("div",{staticClass:"pic"},[e("img",{attrs:{src:t.getHeadImg()}})]),t.userInfo.passportNum?t._e():e("img",{staticClass:"zm-jiantou-12",attrs:{src:"static/image/setting/jt.png"}})]),e("div",{staticClass:"row line_bottom"},[e("div",{staticClass:"label"},[t._v("真实姓名")]),e("div",{staticClass:"value"},[t._v(t._s(t.userInfo.realName?t.userInfo.realName:""))])]),e("div",{staticClass:"row line_bottom"},[e("div",{staticClass:"label"},[t._v("性别")]),"2"==t.userInfo.sex?e("div",{staticClass:"value"},[t._v("女")]):t._e(),"1"==t.userInfo.sex?e("div",{staticClass:"value"},[t._v("男")]):e("div",{staticClass:"value"})]),e("div",{staticClass:"row line_bottom"},[e("div",{staticClass:"label"},[t._v("出生日期")]),e("div",{staticClass:"value"},[t._v(t._s(t.userInfo.birthday?t.userInfo.birthday:""))])]),e("div",{staticClass:"row line_bottom"},[e("div",{staticClass:"label"},[t._v("手机号")]),e("div",{staticClass:"value"},[t._v(t._s(t.$util.dealPhone(t.userInfo.phone)))])]),e("div",{staticClass:"row line_bottom",on:{click:function(s){return t.enterPassport(0)}}},[e("div",{staticClass:"label"},[t._v("身份证号")]),e("div",{staticClass:"value single-line"},[t._v(t._s(t.userInfo.idCardNumEncode?t.userInfo.idCardNumEncode:""))]),t.userInfo.idCardNumEncode?t._e():e("img",{staticClass:"zm-jiantou-12",attrs:{src:"static/image/setting/jt.png"}})]),e("div",{staticClass:"row icon-more",on:{click:function(s){return t.enterPassport(1)}}},[e("div",{staticClass:"label"},[t._v("护照号")]),e("div",{staticClass:"value single-line"},[t._v(t._s(t.userInfo.passportNumEncode?t.userInfo.passportNumEncode:""))]),e("img",{staticClass:"zm-jiantou-12",attrs:{src:"static/image/setting/jt.png"}})])]),e("div",{staticClass:"chum-public-btn unbind-btn"},[e("van-button",{attrs:{round:"",block:"",type:"info",color:"linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"},on:{click:t.unbindHandler}},[t._v("解除微信绑定")])],1)])])],1)},a=[],i=(e("e17f"),e("2241")),o=e("5530"),r=e("2f62"),u=e("f0ba"),c={name:"user-info",components:{},computed:Object(o["a"])({},Object(r["c"])(["userInfo"])),data:function(){return{}},methods:{modifyPhone:function(){this.$router.push({path:"/usercenter/modifyphone",query:{}})},getUserInfo:function(){var t=this,s="/app/json/user/getUserInfo",e={};this.$http.post(s,e).then((function(s){var e=s.data;0==e.status&&(t.$store.state.userInfo=e.data)}),(function(t){}))},changeAvtUrl:function(){var t=this;u["a"].open({linkFunc:function(s){t.submitRevise(s)},token:""})},updateImg:function(t){var s=this;this.$Loading.open();var e="/uploadFile",n={base64File:t,fileType:"jpg",fileName:"header_"+this.userInfo.phone};this.$http.post(e,n).then((function(t){s.$Loading.close();var e=t.data;0==e.status?s.submitRevise(e.data):s.$Toast(e.info)}),(function(t){s.$Loading.close(),s.$Toast("上传图片失败")}))},submitRevise:function(t){var s=this;this.$Loading.open("保存中");var e="/app/json/user/modifyHeadImg",n={headImg:t};this.$http.post(e,n).then((function(e){s.$Loading.close();var n=e.data;0==n.status?(s.$Toast({message:n.info?n.info:"修改头像成功",position:"bottom",duration:2e3}),s.$store.state.userInfo.avtUrl=t,s.$bridgefunc.vuexStorage()):s.$Toast({message:n.info?n.info:"修改头像失败",position:"bottom",duration:2e3})}),(function(t){s.$Loading.close(),s.$Toast({message:"保存失败",position:"bottom",duration:2e3})}))},getHeadImg:function(){return this.userInfo.avtUrl&&this.userInfo.avtUrl.length?this.userInfo.avtUrl:"2"==this.userInfo.gender?"static/image/setting/setting-img.png":"static/image/setting/setting-img-man.png"},enterPassport:function(t){if(0==t){if(this.userInfo.idCardNumEncode)return;this.$router.push({path:"/usercenter/idcardInfoedit",query:{type:t}})}else this.userInfo.passportNumEncode&&""!=this.userInfo.passportNumEncode?this.$router.push({path:"/usercenter/iddetail",query:{type:t,idData:""}}):this.$router.push({path:"/usercenter/passportedit",query:{type:t,idData:""}})},unbindHandler:function(){var t=this;i["a"].confirm({title:"提示",message:"解除绑定后会登出小程序是否继续？",confirmButtonColor:"#E0C28A"}).then((function(){t.$Loading.open();var s="/app/json/user/unBindThirdUser",e={token:t.$store.state.login.token,regChannel:6};t.$http.post(s,e).then((function(s){t.$Loading.close();var e=s.data;0==e.status?t.$userCenter.loginOut():t.$Toast(e.info?e.info:"登录失败")}),(function(s){t.$Loading.close(),t.$Toast("系统运行过程中遇到问题，请稍候再试")}))}))["catch"]((function(){}))}},created:function(){this.getUserInfo()}},l=c,d=(e("b9c1"),e("0c7c")),f=Object(d["a"])(l,n,a,!1,null,"23a2982e",null);s["default"]=f.exports}}]);
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e4474ea2"],{"44b6":function(t,e,s){},"52db":function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"list"},[s("nav-top",{on:{backEvent:t.backEvent}}),t.showList?s("PorsList",{attrs:{componentName:"AXJFShop",orderCategory:2,vipUnitUserCode:t.vipUnitUserCode,axPoints:t.points},on:{axPointsDetail:t.axPointsDetail}}):t._e()],1)},o=[],a=(s("a434"),s("38ad")),n={name:"list",components:{PorsList:a["default"]},data:function(){return{vipUnitUserCode:"",vipUserId:"",points:0,showList:!1}},methods:{backEvent:function(){var t=sessionStorage.getItem("SAVE_AXJF_Enterprise");if(t){var e=JSON.parse(t);sessionStorage.removeItem("SAVE_AXJF_Enterprise");for(var s=0;s<this.$store.state.globalConfig.acctList.length;s++){var i=this.$store.state.globalConfig.acctList[s];if("Enterprise"==i.acctType){this.$store.state.globalConfig.acctList.splice(s,1,e),this.$bridgefunc.vuexStorage();break}}}this.$router.go(-1)},axPointsDetail:function(){this.$router.push({path:"/mall2/axjf/pointsdetail",query:{userId:this.vipUserId,vipUnitUserCode:this.vipUnitUserCode}})},getAxPoints:function(){var t=this;this.$Loading.open();var e="/app/json/app_love_donation/getAccountBaseInfo",s={userId:this.vipUserId,acctType:"11"};this.$http.post(e,s).then((function(e){t.$Loading.close();var s=e.data;0==s.status?(t.points=s.data.balanceUnit,t.showList=!0):t.$Toast(s.info)}),(function(e){t.$Loading.close(),t.$Toast("请求数据失败！")}))},getVipUserId:function(){var t=this;this.$Loading.open();var e="/app/json/app_love_donation/queryBindLoveDonationList",s={};this.$http.post(e,s).then((function(e){t.$Loading.close();var s=e.data;0==s.status?s.data&&s.data.length>0?(t.vipUserId=s.data[0].vipUserId,t.vipUnitUserCode=s.data[0].vipUnitUserCode,t.getAxPoints()):t.$Toast("没有对应的爱心积分账户！"):t.$Toast(s.info)}),(function(e){t.$Loading.close(),t.$Toast("请求数据失败！")}))}},created:function(){for(var t=0;t<this.$store.state.globalConfig.acctList.length;t++){var e=this.$store.state.globalConfig.acctList[t];if("Enterprise"==e.acctType){sessionStorage.setItem("SAVE_AXJF_Enterprise",JSON.stringify(e)),e.displayName="爱心积分",this.$store.state.globalConfig.acctList.splice(t,1,e),this.$bridgefunc.vuexStorage();break}}this.getVipUserId()}},r=n,c=(s("ef11"),s("0c7c")),p=Object(c["a"])(r,i,o,!1,null,"766b1432",null);e["default"]=p.exports},ef11:function(t,e,s){"use strict";s("44b6")}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[711],{UtvK:function(t,s,i){"use strict";i.r(s);var e={name:"list",components:{PorsList:i("OK3W").default},data:function(){return{vipUnitUserCode:"",vipUserId:"",points:0,showList:!1}},methods:{backEvent:function(){var t=sessionStorage.getItem("SAVE_AXJF_Enterprise");if(t){var s=JSON.parse(t);sessionStorage.removeItem("SAVE_AXJF_Enterprise");for(var i=0;i<this.$store.state.globalConfig.acctList.length;i++)if("Enterprise"==this.$store.state.globalConfig.acctList[i].acctType){this.$store.state.globalConfig.acctList.splice(i,1,s),this.$bridgefunc.vuexStorage();break}}this.$router.go(-1)},axPointsDetail:function(){this.$router.push({path:"/mall2/axjf/pointsdetail",query:{userId:this.vipUserId,vipUnitUserCode:this.vipUnitUserCode}})},getAxPoints:function(){var t=this;this.$Loading.open();var s={userId:this.vipUserId,acctType:"11"};this.$http.post("/app/json/app_love_donation/getAccountBaseInfo",s).then((function(s){t.$Loading.close();var i=s.data;0==i.status?(t.points=i.data.balanceUnit,t.showList=!0):t.$Toast(i.info)}),(function(s){t.$Loading.close(),t.$Toast("请求数据失败！")}))},getVipUserId:function(){var t=this;this.$Loading.open(),this.$http.post("/app/json/app_love_donation/queryBindLoveDonationList",{}).then((function(s){t.$Loading.close();var i=s.data;0==i.status?i.data&&i.data.length>0?(t.vipUserId=i.data[0].vipUserId,t.vipUnitUserCode=i.data[0].vipUnitUserCode,t.getAxPoints()):t.$Toast("没有对应的爱心积分账户！"):t.$Toast(i.info)}),(function(s){t.$Loading.close(),t.$Toast("请求数据失败！")}))}},created:function(){for(var t=0;t<this.$store.state.globalConfig.acctList.length;t++){var s=this.$store.state.globalConfig.acctList[t];if("Enterprise"==s.acctType){sessionStorage.setItem("SAVE_AXJF_Enterprise",JSON.stringify(s)),s.displayName="爱心积分",this.$store.state.globalConfig.acctList.splice(t,1,s),this.$bridgefunc.vuexStorage();break}}console.log(this.$store.state.globalConfig.acctList),this.getVipUserId()}},o=(i("o+/5"),i("KHd+")),a=Object(o.a)(e,(function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"list"},[s("nav-top",{on:{backEvent:this.backEvent}}),this._v(" "),this.showList?s("PorsList",{attrs:{componentName:"AXJFShop",orderCategory:2,vipUnitUserCode:this.vipUnitUserCode,axPoints:this.points},on:{axPointsDetail:this.axPointsDetail}}):this._e()],1)}),[],!1,null,"f40621b8",null);s.default=a.exports},kuAp:function(t,s,i){},"o+/5":function(t,s,i){"use strict";var e=i("kuAp");i.n(e).a}}]);
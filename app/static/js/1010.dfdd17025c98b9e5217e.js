(window.webpackJsonp=window.webpackJsonp||[]).push([[1010],{"80Rc":function(t,a,e){"use strict";e.r(a);var n=e("p46w"),o=e.n(n),r={name:"",data:function(){return{jsonData:"",jsonData1:""}},created:function(){var t=this,a=this.$util.getUrlParam(window.location.href,"code"),e=this.$util.getUrlParam(window.location.href,"jygduserid"),n=this.$util.getUrlParam(window.location.href,"token"),r="";a?(r=this.$store.state.globalConfig.wxBaseUrl+"/app/json/wechat_etp/login?authCode="+a,window.location.replace(r)):e?(a=e,r="/app/json/login/JYGDUserAutoLogin"):n&&(a=n,r="/app/json/login/palmtopUserAutoLogin"),this.$http.post(r,{authCode:a}).then((function(a){var e=a.data;if(0==e.status){var n="/common";e.data.redirectUrl&&null!=e.data.redirectUrl&&""!=e.data.redirectUrl&&(n=e.data.redirectUrl),0==n.indexOf("http")&&(n=n.split("#")[1]),o.a.set("IS_FJSH","1"),t.$userCenter.saveLoginData(e.data),t.$router.replace({path:n})}else t.jsonData=JSON.stringify(e)}))},methods:{},components:{}},i=e("KHd+"),s=Object(i.a)(r,(function(){var t=this.$createElement;return(this._self._c||t)("div")}),[],!1,null,"7a7dfe7f",null);a.default=s.exports}}]);
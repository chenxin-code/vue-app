(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2fbde91e"],{b11a:function(s,i,t){},bb83:function(s,i,t){"use strict";t.r(i);var n=function(){var s=this,i=s.$createElement,t=s._self._c||i;return t("div",[t("nav-top",{on:{backEvent:function(i){return s.$router.go(-1)}}}),t("nav-content",[t("div",{staticClass:"system-permissions"},[t("div",{staticClass:"tip"},[s._v("为向您提供更好的用户体验，我们在特定场景可能需要向您申请以下手机系统权限")]),t("div",{staticClass:"list mine-box-shodow"},s._l(s.list,(function(i,n){return t("div",{staticClass:"item",class:{line_top:0!=n}},[t("div",{staticClass:"info"},[t("div",{staticClass:"name"},[s._v(s._s(i.name))]),t("div",{staticClass:"desc"},[s._v(s._s(i.description))])]),t("div",{staticClass:"jiantou",on:{click:function(t){return s.openPromissions(i.code)}}},[t("span",{class:{btn:1!=i.value}},[s._v(s._s("1"==i.value?"已允许":"去设置"))]),t("i",{staticClass:"iconfont mall-gengduojiantou"})])])})),0)])])],1)},e=[],o=(t("a434"),{name:"system-permissions",components:{},data:function(){return{list:[{code:"location",name:"允许访问位置信息权限",description:"根据您当前位置提供更契合您需求的页面展示",value:"0"},{code:"camera",name:"允许访问相机权限",description:"进行扫码、拍摄，用于扫码购物、发表评价、更换头像等",value:"0"},{code:"photo",name:"允许访问相册权限",description:"帮助您实现图片的保存和读取",value:"0"}]}},methods:{openPromissions:function(s){this.$bridgefunc.openPermissions(s)},getPermissions:function(){var s=this;this.$bridgefunc.getPermissions((function(i){if(i)for(var t=0;t<i.length;t++)for(var n=i[t],e=0;e<s.list.length;e++){var o=s.list[e];if(n.code==o.code&&1==n.value){o.value="1",s.list.splice(e,1,o);break}}}))}},created:function(){var s=this;this.getPermissions(),this.$bridgefunc.enterForegroundCallBack((function(){s.getPermissions()}))}}),a=o,c=(t("d668"),t("0c7c")),r=Object(c["a"])(a,n,e,!1,null,"12b68c3a",null);i["default"]=r.exports},d668:function(s,i,t){"use strict";t("b11a")}}]);
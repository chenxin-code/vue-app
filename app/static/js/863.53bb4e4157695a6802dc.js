(window.webpackJsonp=window.webpackJsonp||[]).push([[863],{TZzk:function(t,s,n){"use strict";n.r(s);var i=n("L2JU"),e={name:"setting",components:{},computed:(Object.assign||function(t){for(var s=1;s<arguments.length;s++){var n=arguments[s];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t})({},Object(i.c)(["userInfo"])),data:function(){return{}},methods:{myAddress:function(){this.$router.push({path:"/mall2/addresslist",query:{pageType:"1"}})},myIds:function(){this.$router.push({path:"/ids",query:{pageType:"1"}})},getHeadImg:function(){return this.userInfo.headImg&&this.userInfo.headImg.length?this.userInfo.headImg:"2"==this.userInfo.gender?"static/image/setting/setting-img.png":"static/image/setting/setting-img-man.png"}},created:function(){}},a=(n("y4Tf"),n("KHd+")),o=Object(a.a)(e,(function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"setting"},[n("nav-top",{on:{backEvent:function(s){return t.$router.go(-1)}}}),t._v(" "),n("nav-content",[n("div",{staticClass:"content"},[n("div",{staticClass:"list"},[n("div",{staticClass:"row line_bottom"},[n("div",{staticClass:"pic"},[n("img",{attrs:{src:t.getHeadImg()}})]),t._v(" "),n("i",{staticClass:"iconfont mall-gengduojiantou icon-more theme_font_black"})]),t._v(" "),n("div",{staticClass:"row line_bottom",on:{click:t.myAddress}},[n("div",{staticClass:"label"},[t._v("我的地址")]),t._v(" "),n("i",{staticClass:"iconfont mall-gengduojiantou icon-more theme_font_black"})]),t._v(" "),n("div",{staticClass:"row line_bottom",on:{click:t.myIds}},[n("div",{staticClass:"label"},[t._v("我的证件")]),t._v(" "),n("i",{staticClass:"iconfont mall-gengduojiantou icon-more theme_font_black"})]),t._v(" "),n("div",{staticClass:"row line_bottom"},[n("div",{staticClass:"label"},[t._v("语言")]),t._v(" "),n("div",{staticClass:"value"},[t._v("中文")]),t._v(" "),n("i",{staticClass:"iconfont mall-gengduojiantou icon-more theme_font_black"})])]),t._v(" "),n("div",{staticClass:"btn"})])])],1)}),[],!1,null,"6293ac4e",null);s.default=o.exports},Vjwn:function(t,s,n){},y4Tf:function(t,s,n){"use strict";var i=n("Vjwn");n.n(i).a}}]);
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-39110a12"],{"94d2":function(t,a,e){"use strict";e.r(a);var i,n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"tabs-block"},[e("van-tabs",{attrs:{border:!1,sticky:1==t.moduleData.sticky,"offset-top":t.getTopHeight(),"before-change":t.tabChange,background:t.getBgStyle,color:t.moduleData.lineColor,"title-active-color":t.moduleData.titleActiveColor,"title-inactive-color":t.moduleData.titleInactiveColor},model:{value:t.active,callback:function(a){t.active=a},expression:"active"}},[t._l(t.moduleData.tabs,(function(a,i){return e("van-tab",{key:i,attrs:{title:a.name}},[t.refersh&&t.getTabData(i)?e("SubPage",{attrs:{propsPageData:t.getTabData(i),barHeight:0}}):t._e()],1)})),t.moduleData.rightBtnImage?e("template",{slot:"nav-right"},[e("div",{staticClass:"right-btn-img"},[e("img",{attrs:{src:t.moduleData.rightBtnImage}})])]):t._e()],2),t.moduleData.rightBtnImage?e("div",{staticClass:"right-btn-img abs",class:t.hotareaClass({idCode:t.moduleData.idCode}),style:{backgroundColor:t.getBgStyle},on:{click:function(a){t.hotEvent(),t.rightEvent()}}},[e("img",{attrs:{src:t.moduleData.rightBtnImage}})]):t._e()],1)},o=[],s=e("ade3"),r=e("5530"),c=(e("d3b7"),e("3ca3"),e("ddb0"),e("9911"),e("2f62")),g=e("289d"),u=e("03c6"),l={name:"tabs-block",components:{SubPage:function(){return e.e("chunk-2c8056de").then(e.bind(null,"02a4"))}},props:["myIndex","usePorpData","propData"],mixins:[u["a"]],data:function(){return{refersh:!0,active:0,tabsData:{}}},computed:Object(r["a"])(Object(r["a"])({},Object(c["c"])(["clientWidth"])),{},{pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.pageData},moduleData:function(){return this.pageData.moduleList[this.myIndex].data},getBgStyle:function(){var t=this.moduleData.bgColor;return""!=t?t:""}}),created:function(){var t=this;g["a"].$on("tabLinkChanged",(function(a){var e=a.index,i=t.moduleData.tabs[e];1!=i.newPage&&"1"==i.link.type&&t.getPageData(i.link.pgCode,e)})),this.initTabData(this.active)},methods:(i={hotEvent:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.actionBtnEvent(this.pageData.pgCode,this.moduleData.idCode+t)},getTopHeight:function(){var t=this.$market.getBarHeight()+this.$market.getNavHeight();return t},initTabData:function(t){var a=this.moduleData.tabs[t];"1"==a.link.type&&this.getPageData(a.link.pgCode,t)},getTabData:function(t){var a=t+"";return this.tabsData[a]}},Object(s["a"])(i,"getTopHeight",(function(){var t=this.$store.state.barHeight+this.$market.getNavHeight();return t})),Object(s["a"])(i,"rightEvent",(function(){this.$market.enterNav({link:this.moduleData.rightLink})})),Object(s["a"])(i,"tabChange",(function(t){var a=this.moduleData.tabs[t];return 1!=a.newPage&&"1"==a.link.type?(this.getTabData(t)||this.getPageData(a.link.pgCode,t),!0):(this.$market.enterNav(a),!1)})),Object(s["a"])(i,"getPageData",(function(t,a){var e=this,i=this.$market.apiBaseURL()+"/app/json/app_vue_page/vueGetPageData",n={pgCode:t,accessType:"2"};this.$Loading.open(),this.$http.post(i,n).then((function(t){var i=t.data;if(e.$Loading.close(),0==i.status){if(i.data&&i.data.pageDataJson){var n=JSON.parse(i.data.pageDataJson),o=a+"";e.tabsData[o]=n,e.refersh=!1,e.$nextTick((function(){e.refersh=!0}))}}else e.$Message.error("网络加载较慢，请稍后重试!")}),(function(t){e.$Loading.close(),e.$Message.error("网络加载较慢，请稍后重试!")}))})),i)},h=l,d=(e("c65f"),e("0c7c")),p=Object(d["a"])(h,n,o,!1,null,"30f67630",null);a["default"]=p.exports},afe7:function(t,a,e){},c65f:function(t,a,e){"use strict";e("afe7")}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[367],{FYJB:function(t,i,e){"use strict";e("0c+n");var a,s=e("7oM2"),n=(e("ilju"),e("5B+z")),o=e("ygAv"),c=e("L2JU"),l=Object.assign||function(t){for(var i=1;i<arguments.length;i++){var e=arguments[i];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a])}return t};function r(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}var v={data:function(){return{sideFiltrateModalShow:!1,screen:"筛选",showStartTime:!1,showEndTime:!1,currentDateStart:new Date,currentDateEnd:new Date,beginTime:"",endTime:"",cardList:[],oilNameList:[],num:"0",oil:"0",changeNum:"",changeOilName:""}},props:{isShowChangeCard:{type:Boolean,default:!0},isShowChangeOilName:{type:Boolean,default:!1}},mounted:function(){this.getOilCardList(),this.appQueryTakeOilNameList()},methods:{confirmActivitesTime:function(t){this.showStartTime=!1,this.beginTime=o.a.getMyDate(t)},confirmEndTime:function(t){this.showEndTime=!1,this.endTime=o.a.getMyDate(t)},setColumnValue:function(t,i){new Date},confirm:function(){var t=this.changeNum,i=this.changeOilName;this.sideFiltrateModalShow=!this.sideFiltrateModalShow,this.$emit("childToDadValue",[this.beginTime,this.endTime,t,i])},clearData:function(){this.beginTime="",this.endTime="",this.changeNum="0"},changeCard:function(t,i){this.num=t,this.changeNum=i},changeOil:function(t,i){this.oil=t,this.changeOilName=i},getOilCardList:function(){var t=this,i={token:this.$store.state.login.token,vipUnitUserCode:this.vipUnitUser.vipUnitUserId};this.$request.post("/app/json/app_oil_appoint/appQueryTakeOilCardList",i).then((function(i){if(0===i.status){var e=i.data;t.cardList=e}})).catch((function(t){}))},appQueryTakeOilNameList:function(){var t=this;this.$request.post("/app/json/app_oil_appoint/appQueryTakeOilNameList",{vipUnitUserCode:this.vipUnitUser.vipUnitUserId}).then((function(i){0===i.status?t.oilNameList=i.data:t.$Toast(i.info?i.info:"获取油品名称失败")})).catch((function(t){console.log(t)}))}},computed:l({},Object(c.c)(["vipUnitUser"])),components:(a={},r(a,n.a.name,n.a),r(a,s.a.name,s.a),a)},d=(e("q19P"),e("KHd+")),u=Object(d.a)(v,(function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",[e("div",{directives:[{name:"show",rawName:"v-show",value:!t.sideFiltrateModalShow,expression:"!sideFiltrateModalShow"}],staticClass:"screening",on:{click:function(i){t.sideFiltrateModalShow=!0}}},[t._v("筛选")]),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.sideFiltrateModalShow,expression:"sideFiltrateModalShow"}],staticClass:"screening",on:{click:function(i){t.sideFiltrateModalShow=!1}}},[t._v("关闭")]),t._v(" "),e("transition",{attrs:{name:"filtrate"}},[t.sideFiltrateModalShow?e("div",{ref:"sideFiltrateModal",staticClass:"filtrate-modal-wrapper",style:{top:t.$store.state.barHeight+t.$market.getNavHeight()+"px"}},[e("div",{staticClass:"filtrate-container"},[e("div",{staticClass:"filtrate-content"},[e("div",{staticClass:"change-time"},[e("div",{staticClass:"table-view time-text"},[e("div",{staticClass:"table-view-cell info",on:{click:function(i){t.showStartTime=!0}}},[e("div",{staticClass:"table-view-cell-text"},[t._v("开始时间")]),t._v(" "),e("div",{staticClass:"table-view-cell-arrow"},[t._v(t._s(t.beginTime))])]),t._v(" "),e("div",{staticClass:"table-view-cell info",on:{click:function(i){t.showEndTime=!0}}},[e("div",{staticClass:"table-view-cell-text"},[t._v("结束时间")]),t._v(" "),e("div",{staticClass:"table-view-cell-arrow"},[t._v(t._s(t.endTime))])])])]),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowChangeCard,expression:"isShowChangeCard"}],staticClass:"card-num"},[e("div",{staticClass:"title"},[t._v("提油卡号")]),t._v(" "),e("ul",{staticClass:"list"},t._l(t.cardList,(function(i,a){return e("li",{key:a,staticClass:"item"},[e("div",{staticClass:"item",class:{active:t.num==a},on:{click:function(e){return t.changeCard(a,i.userCard)}}},[t._v("\n                  "+t._s(i.userCard)+"\n                ")])])})),0)]),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowChangeOilName,expression:"isShowChangeOilName"}],staticClass:"card-num"},[e("div",{staticClass:"title"},[t._v("油品选择")]),t._v(" "),e("ul",{staticClass:"list"},t._l(t.oilNameList,(function(i,a){return e("li",{key:a,staticClass:"item"},[e("div",{staticClass:"item",class:{active:t.oil==a},on:{click:function(e){return t.changeOil(a,i.oilname)}}},[t._v("\n                  "+t._s(i.oilname)+"\n                ")])])})),0)])]),t._v(" "),e("div",{staticClass:"filtrate-btn"},[e("button",{staticClass:"l-btn u-confirm",on:{click:t.clearData}},[t._v("清除")]),t._v(" "),e("button",{staticClass:"l-btn u-confirm theme_bg_blue_i",on:{click:t.confirm}},[t._v("确定")])])])]):t._e()]),t._v(" "),e("van-popup",{attrs:{position:"bottom"},model:{value:t.showStartTime,callback:function(i){t.showStartTime=i},expression:"showStartTime"}},[e("van-datetime-picker",{attrs:{type:"date"},on:{confirm:t.confirmActivitesTime,cancel:function(i){t.showStartTime=!1},change:t.setColumnValue},model:{value:t.currentDateStart,callback:function(i){t.currentDateStart=i},expression:"currentDateStart"}})],1),t._v(" "),e("van-popup",{attrs:{position:"bottom"},model:{value:t.showEndTime,callback:function(i){t.showEndTime=i},expression:"showEndTime"}},[e("van-datetime-picker",{attrs:{type:"date"},on:{confirm:t.confirmEndTime,cancel:function(i){t.showEndTime=!1},change:t.setColumnValue},model:{value:t.currentDateEnd,callback:function(i){t.currentDateEnd=i},expression:"currentDateEnd"}})],1)],1)}),[],!1,null,"14637aae",null);i.a=u.exports},LgzN:function(t,i,e){"use strict";e.r(i);var a=e("FYJB"),s=e("L2JU"),n={data:function(){return{cardList:[],startTime:"",endTime:"",oilCardno:"",oilName:"",complete:!1,hasMore:!0,isShowChangeOilName:!0}},mounted:function(){this.getInfo()},methods:{screenChild:function(t){this.startTime=t[0],this.endTime=t[1],this.oilCardno=t[2],this.oilName=t[3],this.cardList=[],this.getInfo()},getInfo:function(){var t=this,i={oilCardno:this.oilCardno,startTime:this.startTime,endTime:this.endTime,oilName:this.oilName,vipUnitUserCode:this.vipUnitUser.vipUnitUserId};this.$request.post("/app/json/app_oil_appoint/appQueryCompleteOrder",i).then((function(i){if(t.complete=!0,t.hasMore=!1,0===i.status){var e=i.data;t.cardList=e}else t.$Toast(i.info?i.info:"获取数据失败")})).catch((function(t){console.log(t)}))}},computed:(Object.assign||function(t){for(var i=1;i<arguments.length;i++){var e=arguments[i];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a])}return t})({},Object(s.c)(["vipUnitUser"])),components:{ScreenPopup:a.a}},o=(e("YhFX"),e("KHd+")),c=Object(o.a)(n,(function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"have-mention"},[e("nav-top",{staticClass:"nav-top",attrs:{title:"已售已提"},on:{backEvent:function(i){return t.$router.go(-1)}}},[e("div",[e("ScreenPopup",{attrs:{isShowChangeOilName:t.isShowChangeOilName},on:{childToDadValue:t.screenChild}})],1)]),t._v(" "),e("nav-content",{staticClass:"have-mention-container"},[t._l(t.cardList,(function(i,a){return t.complete?e("div",{key:a,staticClass:"my-title-info"},[e("div",{staticClass:"top"},[e("div",{staticClass:"card-num"},[t._v("油品名称："+t._s(i.oilname))])]),t._v(" "),e("div",{staticClass:"list"},[e("div",{staticClass:"item"},[e("div",{staticClass:"left"},[t._v("提油油库")]),t._v(" "),e("div",{staticClass:"right"},[t._v(t._s(i.oilHouse))])]),t._v(" "),e("div",{staticClass:"item"},[e("div",{staticClass:"left"},[t._v("提油卡号")]),t._v(" "),e("div",{staticClass:"right"},[t._v(t._s(i.userCard))])]),t._v(" "),e("div",{staticClass:"item"},[e("div",{staticClass:"left"},[t._v("提油数量")]),t._v(" "),e("div",{staticClass:"right"},[t._v(t._s(i.tons))])]),t._v(" "),e("div",{staticClass:"item"},[e("div",{staticClass:"left"},[t._v("提油时间")]),t._v(" "),e("div",{staticClass:"right"},[t._v(t._s(i.receiveTime))])])])]):t._e()})),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:!t.hasMore,expression:"!hasMore"}],staticClass:"no-data theme_font_tint"},[t._v("没有更多数据了~")])],2)],1)}),[],!1,null,"31f9a3c7",null);i.default=c.exports},SlTX:function(t,i,e){},YhFX:function(t,i,e){"use strict";var a=e("eKtQ");e.n(a).a},eKtQ:function(t,i,e){},q19P:function(t,i,e){"use strict";var a=e("SlTX");e.n(a).a}}]);
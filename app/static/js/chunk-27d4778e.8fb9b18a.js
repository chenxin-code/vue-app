(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-27d4778e"],{"40d2":function(t,e,a){"use strict";a("e637")},"48cd":function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("nav-content",[a("div",{staticClass:"container"},[a("div",{staticClass:"screen"},t._l(t.screenArr,(function(e,r){return a("div",{key:r,staticClass:"tab",class:{tabColor:t.rewardState==e.type},on:{click:function(a){return t.screenBtn(e)}}},[a("span",{staticClass:"name"},[t._v(t._s(""+e.name))]),t.rewardState==e.type?a("span",{staticClass:"line"}):t._e()])})),0),a("div",{staticClass:"container-box"},[a("ul",{staticClass:"device-list"},[a("van-pull-refresh",{on:{refresh:t.onRefresh},model:{value:t.isLoading,callback:function(e){t.isLoading=e},expression:"isLoading"}},[t._l(t.array,(function(e,r){return a("li",{key:r,staticClass:"row",on:{click:function(a){return t.orderdetail(e)}}},[a("div",{staticClass:"row-top",staticStyle:{color:"#666"}},[a("span",{staticClass:"row-top-left"},[a("span",{staticClass:"row-top-left-tel"},[t._v("设备编号: "+t._s(e.utilityAccount))])]),a("span",{staticClass:"row-top-right"},[a("i",[t._v(t._s(3==e.state?"":t.rechargeState(e.rechargeState)))]),t._v("   "),a("i",{staticStyle:{color:"#0e80ff"}},[t._v(t._s(3==e.state?t.rechargeState(e.rechargeState):t.status(e.state)))])])]),a("div",{staticClass:"row-content"},[a("div",{staticClass:"contentLift"},[a("div",{staticClass:"leftImg"},[a("img",{attrs:{src:e.orderExtendData.picUrl}})]),a("div",{staticClass:"leftText"},[a("span",{staticClass:"titer"},[t._v(t._s(e.skuNames))]),a("span",{staticStyle:{color:"#666"}},[t._v(t._s(e.storeName))])])]),a("div",{staticClass:"contentRight"},[0==e.priceMode?a("div",[a("span",{staticClass:"price-x theme_font_red"},[t._v("￥")]),a("span",{staticClass:"price-z theme_font_red"},[t._v(t._s(t.getInteger(e.orderExtendData.amount)))]),a("span",{staticClass:"price-x theme_font_red"},[t._v("."+t._s(t.getDecimals(e.orderExtendData.amount)))])]):a("div",{staticClass:"theme_font_red"},[a("span",{staticClass:"price-z"},[t._v(t._s(e.orderExtendData.amount))]),t._v(" "),a("span",{staticClass:"price-x"},[t._v(t._s(t.getDictByAliasText(e.orderExtendData.priceMode)))])])])]),a("div",{staticClass:"row-bottom"},[a("div",[a("span",[t._v(t._s(e.rechargeNo)+"分钟")]),t._v("  "),3==e.state&&10==e.rechargeState?a("van-count-down",{attrs:{time:e.stockupFinishTimeNew,format:"mm:ss"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",{staticClass:"block"},[t._v(t._s(2==(60*e.hours+e.minutes).toString().length?""+(60*e.hours+e.minutes):"0"+(60*e.hours+e.minutes)))]),a("span",{staticClass:"colon"},[t._v(":")]),a("span",{staticClass:"block"},[t._v(t._s(2==e.seconds.toString().length?e.seconds:"0"+e.seconds))])]}}],null,!0)}):t._e(),t._v(t._s(e.stockupFinishTimetrue)+" "),3!=e.state||5!=e.rechargeState&&10!=e.rechargeState&&e.stockupFinishTime?a("span",{staticStyle:{color:"#666"}},[t._v("使用时长 "+t._s(20==e.rechargeState?e.rechargeNo:((t.$util.getDateFromString(e.completeTime)-t.$util.getDateFromString(e.stockupFinishTime))/60).toFixed())+" 分钟")]):t._e()],1),3==e.state&&10==e.rechargeState?a("div",{staticClass:"bottom-btn"},[a("span",{on:{click:function(a){return a.stopPropagation(),t.stopClick(e)}}},[t._v("强制结束")]),a("span",{on:{click:function(a){return a.stopPropagation(),t.addSubmit(e)}}},[t._v("加时间")])]):t._e(),3!=e.state||20!=e.rechargeState&&30!=e.rechargeState?t._e():a("div",{staticClass:"bottom-btn"},[30!=e.rechargeState||e.afterSaleHasReturn?t._e():a("span",{on:{click:function(a){return a.stopPropagation(),t.applyRefund(e)}}},[t._v("申请退款")])]),12==e.state?a("div",{staticClass:"bottom-btn"}):t._e(),70==e.state?a("div",{staticClass:"bottom-btn"},[a("span",{on:{click:function(a){return a.stopPropagation(),t.applyRefund(e)}}},[t._v("我的申请")])]):t._e()])])})),a("li",{staticStyle:{"text-align":"center",margin:"10px 0",color:"rgb(179, 175, 175)"}},[t._v("暂无更多数据～")])],2)],1),t.array.length?t._e():a("div",{staticClass:"no-list"},[a("div",{staticClass:"img-div"},[a("img",{attrs:{src:"static/image/mall2/no-data-img.png"}})]),a("div",{staticClass:"tip theme_font_gray"},[t._v("抱歉没有找到相应订单~")])])])]),a("van-popup",{staticClass:"popupCard",attrs:{"close-on-click-overlay":!1},model:{value:t.stopStatus,callback:function(e){t.stopStatus=e},expression:"stopStatus"}},[a("div",{staticClass:"popupCardText"},[a("span",[t._v("设备正在运行是否要强制结束？")])]),a("div",{staticClass:"popupCardBtn"},[a("span",{on:{click:function(e){t.stopStatus=!1}}},[t._v("取消")]),a("span",{on:{click:t.stop}},[t._v("确定")])])])],1)},s=[],i=a("ade3"),n=(a("414a"),a("7a823")),o=(a("b0c0"),a("4160"),a("159b"),a("a9e3"),a("ac1f"),a("1276"),a("b82d")),c={name:"order",mixins:[o["a"]],data:function(){return{isLoading:!1,stopStatus:!1,rowItem:{},rewardState:"进行中",array:[],screenArr:[{name:"进行中",type:"进行中"},{name:"已完成",type:"已完成"},{name:"退款",type:"退款"}],queryOrder:{orderType:"700005002",state:"3",rechargeState:"10"}}},components:Object(i["a"])({},n["a"].name,n["a"]),computed:{},created:function(){this.getQueryOrder(this.queryOrder)},mounted:function(){},methods:{onRefresh:function(){this.getQueryOrder(this.queryOrder),this.isLoading=!1},setRewardState:function(t){this.rewardState=t||this.rewardState,"进行中"==t?this.queryOrder={orderType:"700005002",state:"3",rechargeState:"10"}:"已完成"==t?this.queryOrder={orderType:"700005002",state:"3",rechargeState:"20"}:"退款"==t&&(this.queryOrder={orderType:"700005003"}),this.getQueryOrder(this.queryOrder)},backEvent:function(){this.$router.go(-1)},screenBtn:function(t){this.array=[],this.rewardState=t.type,"进行中"==t.type?this.queryOrder={orderType:"700005002",state:"3",rechargeState:"10"}:"已完成"==t.type?this.queryOrder={orderType:"700005002",state:"3",rechargeState:"20"}:"退款"==t.type&&(this.queryOrder={orderType:"700005003"}),this.getQueryOrder(this.queryOrder)},addSubmit:function(t){this.$router.push({path:"/device_management/payment",query:{addSubmit:!0,id:t.orderExtendData.id}})},stopClick:function(t){this.stopStatus=!0,this.rowItem=t},stop:function(){var t=this;this.$request.post("/app/json/app_self_washer_order/stop",{orderType:this.rowItem.orderType,orderId:this.rowItem.id}).then((function(e){0==e.status?(t.stopStatus=!1,t.getQueryOrder(t.queryOrder),t.$Toast("结束成功！")):t.$Toast(e.info)}))},applyRefund:function(t){this.$router.push({path:"/device_management/applyRefund",query:{item:JSON.stringify(t)}})},finish:function(){this.getQueryOrder(this.queryOrder)},getQueryOrder:function(t){var e=this;this.$request.post("/app/json/app_self_washer_order/queryOrder",t||this.queryOrder).then((function(t){0==t.status?(e.array=t.data.orderList||[],e.array.forEach((function(t){t.stockupFinishTime&&(t.stockupFinishTimeNew=1e3*(60*Number(t.rechargeNo)-(e.$store.state.severTime.currentTime-e.$util.getDateFromString(t.stockupFinishTime)))),t.orderExtendData&&(t.orderExtendData=JSON.parse(t.orderExtendData))}))):e.$Toast(t.info)}))},text:function(t){var e="";return 3==t?e="积分":8==t?e="油滴":9==t?e="豌豆":0==t&&(e="元"),e},getInteger:function(t){var e=this.$util.toDecimal2(t),a=e.split(".");return a[0]},getDecimals:function(t){var e=this.$util.toDecimal2(t),a=e.split(".");return a[1]},buyAgain:function(t){this.$router.push({path:"/device_management/payment",query:{id:t.orderExtendData.id}})},orderdetail:function(t){this.$router.push({path:"/device_management/orderdetail",query:{orderType:t.orderType,id:t.id,rewardState:this.rewardState}})}}},u=c,d=(a("40d2"),a("0c7c")),p=Object(d["a"])(u,r,s,!1,null,"d2a0f00a",null);e["default"]=p.exports},b82d:function(t,e,a){"use strict";a("4160"),a("159b");e["a"]={data:function(){return{queryDictsByAliasArr:[]}},computed:{},components:{},created:function(){var t=this,e="/app/json/app_dict/getDictByAlias",a={token:this.$store.state.login.token,alias:"selfServiceDevicePayType"};this.$request.post(e,a).then((function(e){0==e.status?t.queryDictsByAliasArr=e.data||[]:t.$Toast(e.info)}))},methods:{useState:function(t){var e={typeText:"",color:""};return 0==t.deviceState?(e.typeText="已禁用",e.color="#e02d2c"):0==t.useState?(e.typeText="空闲中",e.color="#3c9443"):1==t.useState&&(e.typeText="使用中",e.color="#fe9010"),e},status:function(t){var e="";switch(t){case 70:e="审核中";break;case 12:e="已退款";break;case 71:e="已拒绝";break}return e},rechargeState:function(t){var e="";switch(t){case 0:e="启动失败";break;case 5:e="等待中";break;case 10:e="进行中";break;case 20:e="正常结束";break;case 30:e="强制结束";break}return e},getDictByAliasText:function(t){var e="";return this.queryDictsByAliasArr.forEach((function(a){a.dictKey!=t||(e=a.dictValue)})),e}}}},e637:function(t,e,a){}}]);
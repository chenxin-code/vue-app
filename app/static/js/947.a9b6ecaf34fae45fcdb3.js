(window.webpackJsonp=window.webpackJsonp||[]).push([[947],{"814x":function(t,e,r){"use strict";r.r(e);var s=r("3zjS"),n=r("u6Q6"),o={name:"",data:function(){return{currentType:"",scrollTopValue:0,isCanLoadMore:!1,groupList:[],menu:[{text:"全部拼团",type:""},{text:"进行中",type:"2"},{text:"已拼成",type:"10"},{text:"已结束",type:"9"}]}},components:{group:s.a,Scroll:n.default},mounted:function(){this.queryGroupList()},methods:{getLessMember:function(t){return t.groupBuyNumOfPerson-t.currentNumOfPerson},getItemImg:function(t){var e=t.leaderUserAward;return e.length>0?e[0].gameAwardPic:""},tabChange:function(t){this.currentType=t,this.groupList=[],this.queryGroupList()},scrollHandler:function(){},queryGroupList:function(){var t=this;this.$Loading.open();var e={token:this.$store.state.login.token,state:this.currentType};this.$request.post("/app/json/app_fight_group_order/query",e).then((function(e){0==e.status?t.groupList=e.data.orderList||[]:t.$Toast(e.info),t.$Loading.close()}))},openGroupDetails:function(t){this.$router.push({path:"/group_detail",query:{orderId:t.id,mktGroupBuyId:t.mktGroupBuyId,spuId:t.spuId}})}}},u=(r("Hhk3"),r("KHd+")),a=Object(u.a)(o,(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("nav-top",{on:{backEvent:function(e){return t.$router.go(-1)}}}),t._v(" "),s("nav-content",{staticClass:"my-group"},[s("div",{staticClass:"nav-bar"},t._l(t.menu,(function(e,r){return s("div",{key:r,staticClass:"nav-bar-item",class:{active:t.currentType===e.type},on:{click:function(r){return t.tabChange(e.type)}}},[s("span",{staticClass:"text"},[t._v(t._s(e.text))])])})),0),t._v(" "),s("div",{staticClass:"my-group-list"},[t.groupList.length?s("scroll",{attrs:{hasMore:t.isCanLoadMore,pullUpLoad:!0,listenScroll:!0,data:t.groupList,startY:t.scrollTopValue,probeType:2},on:{scroll:t.scrollHandler,pullingUp:t.queryGroupList}},t._l(t.groupList,(function(e,r){return s("div",{key:r},[s("group",{attrs:{groupCoupon:e,showStatus:1,isLeader:!0},on:{success:t.openGroupDetails}})],1)})),0):t._e(),t._v(" "),t.groupList.length?t._e():s("div",{staticClass:"no-list"},[s("div",{staticClass:"img-div"},[s("img",{attrs:{src:r("kBqt")}})]),t._v(" "),s("div",{staticClass:"tip theme_font_gray"},[t._v("暂无活动，快去发起拼券活动吧~")])])],1)])],1)}),[],!1,null,"2b21ea6c",null);e.default=a.exports},Hhk3:function(t,e,r){"use strict";var s=r("MuxD");r.n(s).a},MuxD:function(t,e,r){}}]);
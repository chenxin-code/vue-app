(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4b9ee615","chunk-3978ffff"],{"36a0":function(t,e,s){"use strict";s("d094")},"3ac8":function(t,e,s){"use strict";var a=s("5530"),i=(s("b64b"),s("ac1f"),s("5319"),s("13d5"),s("2f62"));e["a"]={data:function(){return{isDisplay:null,turnNumber:{1:"一",2:"二",3:"三",4:"四",5:"五",6:"六",7:"七",8:"八",9:"九",10:"十",11:"十一",12:"十二",13:"十三",14:"十四",15:"十五",16:"十六",17:"十七",18:"十八"},getNewsListUrl:"/app/json/news/getNewsList",checkTwoVMemmberUrl:"/app/json/app_jx_hui_buy/checkTwoVMemmber",checkBindOilCardUrl:"/app/json/app_jx_hui_buy/checkBindOilCard",cancelTwoVMemberUrl:"/app/json/app_jx_hui_buy/cancelTwoVMember",getPhoneInfoUrl:"/app/json/app_jx_hui_buy/getPhoneInfo",addTwoVMemberUrl:"/app/json/app_jx_hui_buy/addTwoVMember",getVVGetCouMktListUrl:"/app/json/app_market/getVVGetCouMktList",getCouScanUrl:"/app/json/app_market/getCouScanUrl",queryGetCouActivityAwardUrl:"/app/json/app_market/queryGetCouActivityAward",getUnusedCouponsWithColsUrl:"/app/json/coupon/getUnusedCouponsWithCols",getUsedCouponsUrl:"/app/json/coupon/getUsedCoupons",getMyCouInfoUrl:"/app/json/coupon/getMyCouInfo",useVVCouUrl:"/app/json/app_market/useVVCou",queryCanAttendActivityUrl:"/app/json/app_market/queryCanAttendActivity"}},computed:Object(a["a"])({},Object(i["c"])(["userInfo"])),methods:{checkTwoVMemmber:function(){var t=this;this.$request.post(this.checkTwoVMemmberUrl,{phone:this.userInfo.phone}).then((function(e){0==e.status?(Object.assign(t.statusObj,e.data||{}),t.isDisplay=Object.keys(e.data).length?2:1):t.$Toast(e.info)}))},replacePhone:function(t){return t.replace(/(\d{3})\d{4}(\d{4})/,"$1****$2")},duplicateRemoval:function(t,e){var s={};return t.reduce((function(t,a){return!s[a[e]]&&(s[a[e]]=t.push(a)),t}),[])}}}},d094:function(t,e,s){},ede5:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("nav-content",[s("div",{staticClass:"contentImg"},[s("div",{staticClass:"contentImgUserInfo"},[s("div",{staticClass:"userInfoImg"},[s("img",{attrs:{src:t.userInfo.headImg||"static/image/double-v-membership/头像@2x.png",alt:""}})]),s("div",{staticClass:"userInfoText"},[s("span",[t._v(t._s(t.userInfo.userName))]),2!=t.statusObj.state&&0==t.statusObj.isEffect?s("span",[t._v("待生效")]):t._e(),2!=t.statusObj.state&&1==t.statusObj.isEffect?s("span",{on:{click:function(e){t.popupCancel=!0}}},[t._v("取消会员")]):t._e(),2==t.statusObj.state?s("span",[t._v("会员")]):t._e()])]),s("div",{staticClass:"contentImgBottom"},[s("span"),s("span",[t._v(t._s((new Date).getFullYear()+"年"+((new Date).getMonth()+1)+"月会员特权"))])])]),s("div",{staticClass:"list"},[s("scroll",{attrs:{pullUpLoad:!0,listenScroll:!0,data:t.equityArr,hasMore:t.isCanLoadMore}},[s("van-collapse",{attrs:{accordion:""},on:{change:t.changeCollapse},model:{value:t.activeNames,callback:function(e){t.activeNames=e},expression:"activeNames"}},[t._l(t.openAccess,(function(e,a){return s("div",{key:a,staticClass:"equity"},[s("div",{staticClass:"mark"},[s("span",{staticClass:"text"},[t._v(t._s("特权"+t.turnNumber[a+1]))])]),s("div",{staticClass:"equity-details"},[s("div",{staticClass:"equity-details-left"},[s("span",[t._v(t._s(e.activityTitle))]),s("div",{staticClass:"content",domProps:{innerHTML:t._s(e.activityDesc)}})]),t.statusObj.isEffect?s("div",{staticClass:"equity-details-right"},[s("img",{attrs:{src:"static/image/double-v-membership/icon1@2x.png",alt:""}})]):t._e()])])})),t._l(t.equityArr,(function(e,a){return s("div",{key:"equityArr"+a,staticClass:"equity"},[s("div",{staticClass:"mark"},[s("span",{staticClass:"text"},[t._v(t._s("特权"+t.turnNumber[a+1+t.openAccess.length]))])]),s("div",{staticClass:"equity-details",class:{detailsBottom:0==a}},[s("div",{staticClass:"equity-details-left"},[s("span",[t._v(t._s(t.statusObj.isEffect?e.mktActivityTitle:e.activityTitle))]),t.statusObj.isEffect?s("div",{staticClass:"content",domProps:{innerHTML:t._s(e.mktActivityDesc)}}):s("div",{staticClass:"content",domProps:{innerHTML:t._s(e.activityDesc)}})]),t.statusObj.isEffect?s("div",{staticClass:"equity-details-right"},[t.couListState(e.couList)?s("span",{staticClass:"btn",on:{click:function(s){return t.receive(e)}}},[t._v("领取")]):s("img",{attrs:{src:"static/image/double-v-membership/icon1@2x.png",alt:""}})]):t._e()]),t.statusObj.isEffect&&!t.couListState(e.couList)?s("van-collapse-item",{attrs:{name:a}},[s("div",{attrs:{slot:"title"},slot:"title"},[t._v(t._s(t.activeNames===a?"权益详情 （仅限当月使用）":"点击可查看权益详情"))]),t._l(e.arr,(function(e,a){return s("div",{key:a,staticClass:"equity-details details-list"},[s("div",{staticClass:"equity-details-left"},[s("span",[t._v(t._s(e.couTypeTitle))])]),s("div",{staticClass:"equity-details-right"},[1==e.isActive||""===e.isActive?[e.mayUse?s("span",{staticClass:"btn",on:{click:function(s){return t.toUse(e)}}},[t._v("去使用")]):s("img",{attrs:{src:"static/image/double-v-membership/icon3@2x.png",alt:""}})]:[s("img",{attrs:{src:"static/image/double-v-membership/icon2@2x.png",alt:""}})]],2)])}))],2):t._e()],1)}))],2),s("div",{staticClass:"explain"},[s("p",[t._v("活动说明")]),s("div",{staticClass:"content",domProps:{innerHTML:t._s(t.cardPrompt)}})])],1)],1),s("van-popup",{staticClass:"popupCard",attrs:{"close-on-click-overlay":!1},model:{value:t.popupCancel,callback:function(e){t.popupCancel=e},expression:"popupCancel"}},[s("div",{staticClass:"popupCardText"},[s("span",[t._v("确认取消双V会员吗？")]),s("span",[t._v("取消后次月起不再享有会员特权，")]),s("span",[t._v("也不再扣费！")])]),s("div",{staticClass:"popupCardBtn"},[s("span",{on:{click:function(e){t.popupCancel=!1}}},[t._v("取消")]),s("span",{on:{click:t.cancelConfirm}},[t._v("确认")])])]),s("van-popup",{staticClass:"popupCard",attrs:{"close-on-click-overlay":!1},model:{value:t.isToUse,callback:function(e){t.isToUse=e},expression:"isToUse"}},[s("div",{staticClass:"popupCardText"},[s("span",[t._v("确认使用该券，")]),s("span",[t._v("充值到 "+t._s(t.replacePhone(t.userInfo.phone))+" 的手机号码吗？")])]),s("div",{staticClass:"popupCardBtn"},[s("span",{on:{click:function(e){t.isToUse=!1}}},[t._v("取消")]),s("span",{on:{click:t.toUseConfirm}},[t._v("确认")])])])],1)},i=[],o=s("2909"),n=(s("a9e3"),s("4160"),s("159b"),s("d3b7"),s("3ca3"),s("ddb0"),s("3ac8")),c={name:"opened",mixins:[n["a"]],props:{statusObj:{type:Object,default:function(){return{isEffect:!1}}},couponLayoutType:[String,Number]},data:function(){return{isToUse:!1,popupCancel:!1,activeNames:-1,isCanLoadMore:!1,equityArr:[],toUseObj:{},itemObj:{},cardPrompt:"",openAccess:[]}},beforeRouteLeave:function(t,e,s){this.$keepaliveHelper.deleteCache(this),s()},created:function(){this.getNewsList(),this.statusObj.isEffect?this.queryGetCouActivityAward():this.getVVGetCouMktList(),this.queryCanAttendActivity()},computed:{couponQrCodeEnabled:function(){return this.$store.state.globalConfig.couponQrCodeEnabled||1}},methods:{queryCanAttendActivity:function(){var t=this;this.$request.post(this.queryCanAttendActivityUrl,{orderType:999001}).then((function(e){0==e.status?t.openAccess=e.data||[]:t.$Toast(e.info)}))},couListState:function(t){var e=t,s=!1;return e.forEach((function(t){-1==t.state||(s=!0)})),s},getNewsList:function(){var t=this;this.$request.post(this.getNewsListUrl,{values:25}).then((function(e){0==e.status?t.cardPrompt=e.data[0]?e.data[0].content:"":t.$Toast(e.info)}))},getVVGetCouMktList:function(){var t=this;this.$request.post(this.getVVGetCouMktListUrl,{activityTag:"VV"}).then((function(e){0==e.status?t.equityArr=e.data:t.$Toast(e.info)}))},queryGetCouActivityAward:function(){var t=this;this.$request.post(this.queryGetCouActivityAwardUrl,{alias:"VV"}).then((function(e){if(0==e.status){var s=e.data[0];t.equityArr=s?s.activityModelList:[]}else t.$Toast(e.info)}))},receive:function(t){var e=this;this.$request.post(this.getCouScanUrl,{mktActivityId:t.mktActivityId}).then((function(t){0==t.status?1!=t.data.state?(e.$Toast("领取成功"),e.queryGetCouActivityAward()):e.$Toast("领取失败"):e.$Toast(t.info)}))},changeCollapse:function(t){var e=this;this.activeNames=t;var s=this.equityArr[t];if(s){this.equityArr.forEach((function(t,s){e.$set(e.equityArr[s],"arr",[])}));var a=s.couList||[];a.forEach((function(t){e.getData({mktActivityId:s.mktActivityId,couTypeCode:t.couTypeCode},e.activeNames)}))}},getData:function(t,e){this.getUnusedCouponsWithCols(t,e),this.getUsedCoupons(t,e)},getUnusedCouponsWithCols:function(t,e){var s=this;this.$request.post(this.getUnusedCouponsWithColsUrl,t).then((function(t){0==t.status?((t.data||[]).forEach((function(t){1!=t.isActive&&""!=t.isActive||s.$set(t,"mayUse",!0)})),s.equityArr.forEach((function(a,i){var n;e==i&&(s.equityArr[i].arr=[],(n=s.equityArr[i].arr).push.apply(n,Object(o["a"])(t.data||[])))}))):s.$Toast(t.info)}))},getUsedCoupons:function(t,e,s){var a=this;this.$request.post(this.getUsedCouponsUrl,t).then((function(t){(t.data||[]).forEach((function(t){1!=t.isActive&&""!=t.isActive||a.$set(t,"mayUse",!1)})),0==t.status?a.equityArr.forEach((function(s,i){var n;e==i&&(n=a.equityArr[i].arr).push.apply(n,Object(o["a"])(t.data||[]))})):a.$Toast(t.info)}))},cancelConfirm:function(){var t=this;this.$request.post(this.cancelTwoVMemberUrl,{phone:this.userInfo.phone}).then((function(e){0==e.status?(t.popupCancel=!1,t.$Toast("取消成功"),t.checkTwoVMemmber()):t.$Toast(e.info)}))},toUse:function(t){if(this.toUseObj=t,"SC"===t.couTypeCategoryAlias){var e="/mall2/list/"+this.$util.getDataString();this.$router.push({path:e,query:{pageType:"coupon",coupon:t.couTypeCode,couThresholdAmount:t.couThresholdAmount,couFaceValue:t.couFaceValue,lastPath:this.$route.path,endTime:this.$util.getDateFromString(t.validEndDate)}})}else"DSFJK"===t.couTypeCategoryAlias?this.isToUse=!0:3==this.couponQrCodeEnabled?this.$router.push({path:"/addCard",query:{couNo:t.couNo}}):2==this.couponLayoutType?this.$router.push({path:"/coupon_detail2",query:{couTypeCode:t.couTypeCode,couFaceValue:t.couFaceValue}}):this.$router.push({path:"/coupon_detail",query:{couNo:t.couNo}})},toUseConfirm:function(){this.couNo()},couNo:function(){var t=this;this.$request.post(this.getMyCouInfoUrl,{couNo:this.toUseObj.couNo||""}).then((function(e){0==e.status?t.dynamicCode(e.data.dynamicCode||""):t.$Toast(e.info)}))},dynamicCode:function(t){var e=this;this.$request.post(this.useVVCouUrl,{dynamicCode:t}).then((function(t){0==t.status?(e.isToUse=!1,e.$Toast("充值成功"),e.activeNames=-1,e.queryGetCouActivityAward()):e.$Toast(t.info)}))}},components:{Scroll:function(){return Promise.all([s.e("chunk-2d0b724a"),s.e("chunk-28c407f0")]).then(s.bind(null,"bba4"))}}},u=c,r=(s("36a0"),s("0c7c")),p=Object(r["a"])(u,a,i,!1,null,"2cad7008",null);e["default"]=p.exports}}]);
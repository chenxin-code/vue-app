(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b2bb3c18"],{"2e77":function(t,i,e){},4056:function(t,i,e){"use strict";e("68ef"),e("9d70"),e("3743"),e("09fe")},6680:function(t,i,e){t.exports=e.p+"static/images/8e419da2765fc2ec6b4951597cd1de3e.png"},7887:function(t,i,e){"use strict";e("c637")},aaf2:function(t,i,e){"use strict";e.r(i);var a=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"orderList"},[e("van-sticky",[e("navbar",{attrs:{title:"本团订单"}}),e("div",{staticClass:"tab"},t._l(t.tab,(function(i,a){return e("div",{key:a,staticClass:"tab_item",class:t.currentTab==a?"current_tab":"",on:{click:function(i){return t.changesTab(a)}}},[t._v(" "+t._s(i.name)+" ")])})),0)],1),e("div",{staticClass:"goods_list"},[e("van-pull-refresh",{on:{refresh:t.onRefresh},model:{value:t.refreshing,callback:function(i){t.refreshing=i},expression:"refreshing"}},[e("van-list",{attrs:{finished:t.finished,"finished-text":"没有更多了",error:t.error,"error-text":"请求失败，点击重新加载"},on:{load:t.onLoad,"update:error":function(i){t.error=i}},model:{value:t.loading,callback:function(i){t.loading=i},expression:"loading"}},t._l(0==t.currentTab?t.deliveryList:1==t.currentTab?t.pickUpList:2==t.currentTab?t.finishedList:3==t.currentTab?t.cancelList:t.allList,(function(i,a){return e("div",{key:a,staticClass:"goods_item",on:{click:function(e){return t.navToDetail(i)}}},[e("div",{staticClass:"goods_title"},[e("div",{staticClass:"goods_ID"},[t._v("#"+t._s(i.activityOrderItemNo))]),e("div",{staticClass:"goods_type"},[t._v(" "+t._s(1==i.activityOrderItemState?"待发货":3==i.activityOrderItemState?"待提货":4==i.activityOrderItemState?"已完成":5==i.activityOrderItemState?"已取消":"")+" ")])]),e("div",{staticClass:"good_user"},[e("div",{staticClass:"user"},[e("van-image",{staticClass:"user-image",attrs:{src:i.contactAvatar,"error-icon":t.defaultAvatar}}),e("div",{staticClass:"user_name"},[t._v(t._s(i.contactName))]),e("div",{staticClass:"user_phone"},[t._v(t._s(i.contactPhone))])],1),e("div",{directives:[{name:"show",rawName:"v-show",value:2==i.activityOrderItemState||3==i.activityOrderItemState,expression:"\n                item.activityOrderItemState == 2 ||\n                item.activityOrderItemState == 3\n              "}],staticClass:"user_type",class:2==i.activityOrderItemState?"delivery":3==i.activityOrderItemState?"pick_up":""},[t._v(" "+t._s(2==i.activityOrderItemState?"配送上门":3==i.activityOrderItemState?"自提":"")+" ")])]),e("div",{staticClass:"goods_img"},t._l(i.orderSkuImg,(function(t){return e("img",{key:t,attrs:{src:t,alt:""}})})),0),e("div",{staticClass:"goods_detail"},[e("div",{staticClass:"detail"},[e("span",[t._v("共计"+t._s(i.productQuantity)+"件商品，合计支付 ")]),e("span",[t._v(t._s(i.totalAmount))])]),e("div",{directives:[{name:"show",rawName:"v-show",value:0!==i.activityOrderItemState&&4!==i.activityOrderItemState&&5!==i.activityOrderItemState,expression:"\n                item.activityOrderItemState !== 0 &&\n                item.activityOrderItemState !== 4 &&\n                item.activityOrderItemState !== 5\n              "}],staticClass:"confirm",on:{click:function(e){return e.stopPropagation(),t.confirm(i)}}},[t._v(" 确认"+t._s(1==i.activityOrderItemState?"送达":2==i.activityOrderItemState?"配送":3==i.activityOrderItemState?"提货":"")+" ")])])])})),0)],1)],1),e("van-popup",{model:{value:t.showPopup,callback:function(i){t.showPopup=i},expression:"showPopup"}},[e("div",{staticClass:"popup"},[e("div",{staticClass:"popup_title"},[t._v("确认订单商品")]),e("div",{staticClass:"popup_detail"},[t._v(" "+t._s(1==t.skuInfo.activityOrderItemState?"抵达":2==t.skuInfo.activityOrderItemState?"送达消费者":3==t.skuInfo.activityOrderItemState?"被消费者提走":"")+" ")]),e("div",{staticClass:"popup_btn"},[e("div",{staticClass:"confirm_btn",on:{click:function(i){return t.confirmOrder()}}},[t._v("确认")]),e("div",{staticClass:"cancel_btn",on:{click:function(i){t.showPopup=!1}}},[t._v("取消")])])])])],1)},r=[],s=(e("4160"),e("159b"),e("ac1f"),e("1276"),e("99af"),e("4795"),e("4328")),n=e.n(s),c=e("eca0"),o=(e("acc4"),{name:"orderList",props:{},components:{navbar:c["a"]},data:function(){return{defaultAvatar:e("6680"),tab:[{name:"待发货"},{name:"待提货"},{name:"已完成"},{name:"已取消"}],allList:[],waitPayList:[],deliveryList:[],distributionList:[],pickUpList:[],finishedList:[],cancelList:[],currentTab:0,refreshing:!1,loading:!1,finished:!1,type:2,showPopup:!1,searchValue:"",currentPage:0,totalPage:0,error:!1,skuInfo:{},activityOrderNo:0}},created:function(){this.activityOrderNo=JSON.parse(this.$route.query.id)},methods:{changesTab:function(t){this.currentTab=t,this.currentPage=0,this.allList=[],this.waitPayList=[],this.deliveryList=[],this.distributionList=[],this.pickUpList=[],this.finishedList=[],this.cancelList=[],this.finished=!1,this.loading=!0,this.onLoad()},onLoad:function(){var t=this;this.loading=!0;var i=this.currentPage;i+=1,this.currentPage=i,this.refreshing=!1;var e={pageNum:i,pageSize:10,sortBy:"create_time_DESC",activityNo:this.activityOrderNo,orderItemState:0==this.currentTab?1:1==this.currentTab?3:2==this.currentTab?4:3==this.currentTab?5:void 0};this.$http.post("/app/json/group_buying_order/findGroupBuyingActivityOrderItemListByOrderId",n.a.stringify(e)).then((function(e){if(i<e.data.data.pages||i==e.data.data.pages)if("success"==e.data.result){var a=e.data.data.records;switch(a.forEach((function(t){""!==t.productSkuInfo?t["orderSkuImg"]=JSON.parse(t.productSkuInfo)[0].groupbuySkuPicurl.split(","):t["orderSkuImg"]=[]})),t.currentTab){case 0:t.deliveryList=t.deliveryList.concat(a);case 1:t.pickUpList=t.pickUpList.concat(a);case 2:t.finishedList=t.finishedList.concat(a);case 3:t.cancelList=t.cancelList.concat(a)}t.page=e.data.data.pages,setTimeout((function(){t.loading=!1}),1e3)}else t.loading=!1,t.error=!0;else t.finished=!0}))["catch"]((function(i){t.$toast("请求失败，点击重新加载"),t.loading=!1,t.error=!0}))},onRefresh:function(){var t=this,i=1;this.page=i,this.finished=!1,this.loading=!0;var e={pageNum:i,pageSize:10,sortBy:"create_time_DESC",activityNo:this.activityOrderNo,orderItemState:0==this.currentTab?1:1==this.currentTab?3:2==this.currentTab?4:3==this.currentTab?5:void 0};this.$http.post("/app/json/group_buying_order/findGroupBuyingActivityOrderItemListByOrderId",n.a.stringify(e)).then((function(i){if(200==i.status){var e=i.data.data.records;switch(e.forEach((function(t){""!==t.productSkuInfo?t["orderSkuImg"]=JSON.parse(t.productSkuInfo)[0].groupbuySkuPicurl.split(","):t["orderSkuImg"]=[]})),t.currentTab){case 0:t.deliveryList=e;case 1:t.pickUpList=e;case 2:t.finishedList=e;case 3:t.cancelList=e}t.totalPage=i.data.pages,setTimeout((function(){t.$toast("刷新成功"),t.loading=!1,t.refreshing=!1}),800)}}))["catch"]((function(i){t.$toast("网络繁忙,请稍后再试~")}))},navToDetail:function(t){this.$router.push({path:"/bulk_order_detail",query:{id:JSON.stringify(t.activityOrderItemNo)}})},confirm:function(t){this.showPopup=!0,this.skuInfo=t},confirmOrder:function(){var t=this,i=0;i=1==this.skuInfo.activityOrderItemState||2==this.skuInfo.activityOrderItemState||3==this.skuInfo.activityOrderItemState?this.skuInfo.activityOrderItemState:void 0,this.$http.post("/app/json/group_buying_order/confirmReceiveDeliveryPickup",{orderItemId:this.skuInfo.activityOrderItemNo,confirmType:i}).then((function(i){i.data.data.isTrue&&(t.showPopup=!1,t.$toast("操作成功"),t.changesTab(t.currentTab)),"error"==i.data.result&&(t.showPopup=!1,t.$toast(i.data.info))}))["catch"]((function(i){t.showPopup=!1,t.$toast("请求失败，请重新尝试")}))}}}),u=o,d=(e("bcac"),e("0c7c")),l=Object(d["a"])(u,a,r,!1,null,"1297f49f",null);i["default"]=l.exports},acc4:function(t,i,e){"use strict";e("4056");var a=e("44bf"),r=e("a026");r["default"].use(a["a"])},bcac:function(t,i,e){"use strict";e("2e77")},c637:function(t,i,e){},eca0:function(t,i,e){"use strict";var a=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"navbar"},[e("van-sticky",[e("van-nav-bar",{attrs:{title:t.title},on:{"click-left":t.navBack},scopedSlots:t._u([{key:"left",fn:function(){return[e("van-icon",{staticClass:"arrow_left",attrs:{name:"arrow-left",color:"#000000",size:"0.471467rem"}})]},proxy:!0}])})],1)],1)},r=[],s={name:"navbar",props:["title","backUrl"],data:function(){return{}},methods:{navBack:function(){this.backUrl?this.$router.push(this.backUrl):this.$router.go(-1)}}},n=s,c=(e("7887"),e("0c7c")),o=Object(c["a"])(n,a,r,!1,null,"0eab640b",null);i["a"]=o.exports}}]);
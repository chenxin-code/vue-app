(window.webpackJsonp=window.webpackJsonp||[]).push([[554],{ERC4:function(t,o,i){},VtCX:function(t,o,i){"use strict";var n=i("ERC4");i.n(n).a},mG4U:function(t,o,i){"use strict";var n=i("oCYn");o.a=new n.default},qMZ7:function(t,o,i){"use strict";i.r(o),i("mG4U");var n={data:function(){return{microShopList:[],cityObj:{cityId:"",storeName:""},loading:!1,finished:!1,page:0,microShopView:!1}},mounted:function(){this.$route.query.cityObj&&(this.cityObj=this.$route.query.cityObj)},methods:{loadMore:function(){var t=this;this.page=this.page+1,this.$request.post("/app/json/micro_store_front_end/getAllMictoStores",{storeName:this.cityObj.storeName,cityId:this.cityObj.cityId,page:this.page,rows:10}).then((function(o){0==o.status?(t.microShopList=t.microShopList.concat(o.data),t.microShopList.length>=o.totalRecords&&(t.finished=!0)):(t.finished=!0,t.$Toast(o.info?o.info:"获取列表失败")),t.loading=!1}))},followEvent:function(t,o){var i=this,n={token:this.$store.state.login.token,storeId:t.microStoreAttentionInfo.id};this.$http.post("/app/json/micro_store_front_end/addOrCancelMicroStoreCollect",n).then((function(n){var e=n.data;0==e.status?(1==o?i.$Toast("取消关注成功"):0==o&&i.$Toast("关注成功"),i.$Toast(""),0==t.microStoreAttentionInfo.attentionFlag?t.microStoreAttentionInfo.attentionFlag=1:t.microStoreAttentionInfo.attentionFlag=0):i.$Toast(e.info)}),(function(t){i.$Toast("请求数据失败！")}))},microShopItemClick:function(t){console.log(t),"2"==this.$store.state.globalConfig.micro_shop_check_page_type?this.$router.push({path:"/micro_sho/shop_around1",query:{storeID:t.storeCode,id:t.id}}):this.$router.push({path:"/micro_sho/shop_around",query:{storeID:t.storeCode,id:t.id}})},search:function(){this.$router.push({path:"/micro_sho/search_store_name"})}}},e=(i("VtCX"),i("KHd+")),s=Object(e.a)(n,(function(){var t=this,o=t.$createElement,i=t._self._c||o;return i("div",{staticClass:"microshop-list"},[i("nav-top",{attrs:{title:"微店列表"},on:{backEvent:function(o){return t.$router.go(-1)}}}),t._v(" "),i("nav-content",{staticClass:"microshop-list-content"},[i("div",{staticClass:"searchIcon",on:{click:t.search}},[i("i",{staticClass:"icon iconfont mall-sousuo"}),t._v(" "),i("span",[t._v("微店名称")])]),t._v(" "),i("van-list",{attrs:{finished:t.finished,"finished-text":"没有更多了"},on:{load:t.loadMore},model:{value:t.loading,callback:function(o){t.loading=o},expression:"loading"}},t._l(t.microShopList,(function(o,n){return i("div",{key:n},[i("ul",[i("li",{on:{click:function(i){return t.microShopItemClick(o)}}},[1==o.microStoreAttentionInfo.topFlag?i("p",{staticClass:"top"},[t._v("置顶")]):t._e(),t._v(" "),i("div",{staticClass:"contain"},[i("div",{staticClass:"div1"},[i("img",{attrs:{src:o.pictureUrl?o.pictureUrl:"/static/image/microShop/head@2x.png",alt:""}}),t._v(" "),i("div",{staticClass:"containDiv"},[i("p",{staticClass:"user"},[t._v(t._s(o.storeName))]),t._v(" "),i("div",{staticClass:"code"},[t._v("店铺号："+t._s(o.microStoreAttentionInfo.id))]),t._v(" "),i("div",{staticClass:"count"},[i("p",[t._v("关注"),i("span",[t._v(t._s(o.microStoreAttentionInfo.attentionCount))])]),t._v(" "),i("p",[t._v("订单"),i("span",[t._v(t._s(o.microStoreAttentionInfo.orderCount))]),t._v("笔")]),t._v(" "),i("p",[t._v("成交额"),i("span",[t._v(t._s(o.microStoreAttentionInfo.sellAmount))]),t._v("元")])])])]),t._v(" "),1==o.microStoreAttentionInfo.attentionFlag?i("span",{staticClass:"attentionName",on:{click:function(i){return i.stopPropagation(),t.followEvent(o,1)}}},[t._v("已关注")]):t._e(),t._v(" "),0==o.microStoreAttentionInfo.attentionFlag?i("span",{staticClass:"attentionName attentionNames",on:{click:function(i){return i.stopPropagation(),t.followEvent(o,0)}}},[t._v("关注")]):t._e()])])])])})),0),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:t.microShopView,expression:"microShopView"}]},[i("p",{directives:[{name:"show",rawName:"v-show",value:0==t.microShopList.length,expression:"microShopList.length==0"}],staticClass:"nullData"},[t._v("微店列表为空")])])],1)],1)}),[],!1,null,"2df97e56",null);o.default=s.exports}}]);
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1fa9fef5"],{"0442":function(t,e,s){t.exports=s.p+"static/images/9d2e8727d833722472c574b8dfc8872d.png"},"12ee":function(t,e,s){"use strict";s.r(e);var o=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"index"},[o("nav-top",{on:{backEvent:t.backEvent}}),o("nav-content",[o("div",[o("div",{directives:[{name:"show",rawName:"v-show",value:""==t.storeOuCode,expression:"storeOuCode == ''"}]},[o("div",{staticClass:"img"},[o("img",{attrs:{src:s("0442")}})])]),o("div",{directives:[{name:"show",rawName:"v-show",value:""!=t.storeOuCode,expression:"storeOuCode != ''"}]},[o("div",{staticClass:"img"},[o("img",{attrs:{src:s("9961")}})]),o("div",{staticClass:"store-name"},[t._v(t._s(t.shopDetail.storeName))]),o("div",{staticClass:"store-address"},[t._v(t._s(t.shopDetail.address))])]),""!=t.storeOuCode?o("div",{staticClass:"btn theme_bg_red theme_font_white",on:{click:t.scanGoods}},[t._v("请扫描商品条码")]):o("div",{staticClass:"btn theme_bg_red theme_font_white",on:{click:t.scanShop}},[t._v("请扫描店铺二维码")])])])],1)},a=[],i=(s("ac1f"),s("1276"),s("59bc")),n={name:"index",components:{},data:function(){return{storeOuCode:"",pickupId:"",shopDetail:{},lastPath:""}},methods:{backEvent:function(){this.$router.go(-1)},scanShop:function(){var t=this;this.$bridgefunc.scanCode((function(e){var s=e.code,o=JSON.parse(s);t.storeOuCode=o.storeOuCode,t.pickupId=o.pickupId,void 0==t.storeOuCode||null==t.storeOuCode||""==t.storeOuCode||void 0==t.pickupId||""==t.pickupId||null==t.pickupId?(t.$Toast("店铺码错误，店铺码需要包括storeOuCode和pickupId"),t.storeOuCode="",t.pickupId=""):t.storeOuCode&&t._getStoreDetail(t.storeOuCode)}))},scanGoods:function(){var t=this;1==this.$store.state.webtype?this.$bridgefunc.scanCode((function(e){var s=e.code;t.$router.push({path:"/mall2/scanbuywxlist",query:{code:s,storeOuCode:t.storeOuCode,pickupId:t.pickupId}})})):this.$bridgefunc.scanCode((function(e){var s=e.code.split(",")[1];t.$router.push({path:"/mall2/scanbuywxlist",query:{code:s,storeOuCode:t.storeOuCode,pickupId:t.pickupId}})}))},_getStoreDetail:function(t){var e=this;this.$Loading.open();var s="/app/json/app_store/getStoreDetail",o={token:this.$store.state.login.token,storeOuCode:t};this.$http.post(s,o).then((function(t){var s=t.data;e.$Loading.close(),0==s.status?e.shopDetail=s.data||{}:e.$Toast(s.info)}),(function(t){e.$Loading.close(),e.$Toast("请求数据失败！")}))}},created:function(){this.lastPath=this.$route.query.lastPath?this.$route.query.lastPath:"","2"==this.$store.state.webtype||"3"==this.$store.state.webtype?this.$bridgefunc.setItem("scanbuy_cart_number","0"):i["a"].set({key:"scanbuy_cart_number",value:"0",isPublic:!0}),window.localStorage.setItem("historyPros",JSON.stringify(this.historyPros)),window.localStorage.removeItem("historyPros")},beforeRouteLeave:function(t,e,s){t.path==this.lastPath&&this.$keepaliveHelper.deleteCache(this),s()}},r=n,c=(s("de02"),s("0c7c")),d=Object(c["a"])(r,o,a,!1,null,"43e7fe38",null);e["default"]=d.exports},9961:function(t,e,s){t.exports=s.p+"static/images/a3c385ddbab285fff8a1e824e11d661a.png"},aed9:function(t,e,s){},de02:function(t,e,s){"use strict";s("aed9")}}]);
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5e080114"],{"5c6b":function(t,o,e){"use strict";e.r(o);var s,a=function(){var t=this,o=t.$createElement,s=t._self._c||o;return s("div",{staticClass:"coupon-list"},[s("nav-top",{attrs:{title:"可用店铺"},on:{backEvent:t.backEvent}}),s("nav-content",{staticClass:"coupon-center"},[s("div",{staticClass:"main"},[s("van-dropdown-menu",[s("van-dropdown-item",{attrs:{options:t.option1},model:{value:t.distance,callback:function(o){t.distance=o},expression:"distance"}}),s("div",{staticClass:"right-top"},[s("div",{staticClass:"search-bg",on:{click:t.clickSearch}},[s("div",{staticClass:"search-main",staticStyle:{height:"30px","line-height":"30px"}},[s("i",{staticClass:"iconfont mall-sousuo theme_font_tint",staticStyle:{"font-size":"16px"}}),t._v(" "+t._s(t.keyWords?t.keyWords:"请输入可用店铺")+" ")])])])],1),s("ul",{staticClass:"stores-c"},[s("van-list",{attrs:{finished:t.finished,"finished-text":"没有更多了",offset:200},on:{load:t.loadMore},model:{value:t.isLoading,callback:function(o){t.isLoading=o},expression:"isLoading"}},t._l(t.list,(function(o,a){return s("li",{key:a,staticClass:"item"},[s("div",{staticClass:"top"},[s("div",{staticClass:"left"},[s("img",{staticClass:"prod-img",attrs:{src:e("ff76"),alt:""}})]),s("div",{staticClass:"center"},[s("p",{staticClass:"prod-name"},[t._v(t._s(o.ouName))]),s("p",{staticClass:"prod-address"},[s("van-icon",{attrs:{name:"location-o"}}),t._v("地址："+t._s(o.addressFull))],1),s("p",{staticClass:"prod-address"},[t._v("距离当前距离"+t._s(t.$util.toDecimal2(o.distance/1e3))+"km")])]),s("div",{staticClass:"right",on:{click:function(e){return t.goToMap(o)}}},[s("img",{staticClass:"icon-nav",attrs:{src:e("a085"),alt:""}}),s("span",{staticClass:"prod-distance"},[t._v("导航")])])])])})),0)],1)],1),s("van-dialog",{attrs:{title:"使用授权协议及免责申明","show-cancel-button":"",confirmButtonText:"同意并继续"},on:{confirm:t.enter},model:{value:t.show,callback:function(o){t.show=o},expression:"show"}},[s("div",{staticClass:"content",domProps:{innerHTML:t._s(t.content)}},[t._v(" "+t._s(t.content))])])],1)],1)},n=[],i=e("2909"),c=e("5530"),r=e("ade3"),u=(e("61ae"),e("d314")),l=(e("09d3"),e("2d6d")),h=(e("b0c0"),e("ac1f"),e("841c"),e("d3b7"),e("653a")),p=e("2f9a"),d=(e("2fbd"),e("ca00"),e("a18c"),e("d055"),e("b311"),e("3f12")),f={name:"",components:(s={},Object(r["a"])(s,l["a"].name,l["a"]),Object(r["a"])(s,u["a"].name,u["a"]),s),watch:{distance:function(){this.list=[],this.search()}},data:function(){return{dynamicCode:null,totalPage:null,pageInfo:{page:0,rows:10},list:[],show:!1,content:null,isLoading:!1,finished:!1,distance:5e3,keyWords:null,coupon:{},currentObj:{},option1:[{text:"5KM",value:5e3},{text:"10KM",value:1e4},{text:"20KM",value:2e4},{text:"50KM",value:5e4},{text:"100KM",value:1e5},{text:"全部",value:""}]}},created:function(){this.coupon=this.$route.query,this.loadMore(),this.getInfo()},methods:{clickSearch:function(){var t=this;p["a"].open({initData:{barHeight:h["a"].state.barHeight,searchHistory:[],flag:!1,text:"可用店铺"},clearSearchHistory:function(){h["a"].state.mall2.searchHistory=[]},searchEvent:function(o){p["a"].close(),t.keyWords=o,t.list=[],t.search()}})},goToMap:function(t){this.$bridgefunc.baiduNav({startlong:this.$store.state.currentLocation.posx,startlat:this.$store.state.currentLocation.posy,endlong:t.posx,endlat:t.posy,type:"nav"})},loadMore:function(){var t=this;this.isLoading=!0,this.pageInfo.page++,this.$Loading.open();var o=Object(c["a"])({couTypeCode:this.coupon.couTypeCode,getType:"1",posx:this.$store.state.currentLocation.posx,posy:this.$store.state.currentLocation.posy,distLess:this.distance,storeOuName:this.keyWords},this.pageInfo);this.$http.post("/app/json/coupon/queryCanUseCouStoreList",o).then((function(o){var e,s=o.data;(t.isLoading=!1,0==s.status)?(t.totalPage=o.data.totalPages,t.totalPage==t.pageInfo.page&&(t.finished=!0),"[object Array]"==Object.prototype.toString.call(o.data.data)?(e=t.list).push.apply(e,Object(i["a"])(o.data.data)):t.finished=!0):t.$Toast(s.info);t.$Loading.close()}))["catch"]((function(o){t.$Toast(o),t.finished=!0}))},backEvent:function(){"subject"==this.$route.query.type?this.$router.push({path:"/questionlist"}):"serviceSubject"==this.$route.query.type?this.$router.push({path:"/service/questionlist"}):"equity_car"==this.$route.query.type?this.$router.push({path:"/equity_card/equityList"}):this.$router.go(-1)},getInfo:function(){var t=this,o={};this.$http.post("/app/json/news/getNewsList?values=64",o).then((function(o){var e=o.data;0==e.status?t.content=o.data.data[0].content:t.$Toast(e.info)}))["catch"]((function(o){t.$Toast(o)}))},search:function(){this.pageInfo.page=0,this.loadMore()},getMyCouInfo:function(){var t=this;"1"==this.$store.state.globalConfig.couponOpenVerify?d["a"].open({type:"coupon_verify",sureFunc:this.imgSureFunc,vertifyCancelEvent:function(){t.$router.go(-1)},paras:{phone:this.$store.state.login.phone}}):this.couponRequest(null,null)},imgSureFunc:function(t,o){this.couponRequest(t,o)},couponRequest:function(t,o){var e=this;this.$Loading.open();var s=this.isGroupCoupon?this.couponList[this.ind].couNo:this.$route.query.couNo,a={token:this.$store.state.login.token,couNo:s};null!=t&&null!=o&&(a.type="20000",a.imgVerifyCode=t,a.uuid=o,a.couNo=this.coupon.couNo),this.$http.post("/app/json/coupon/getMyCouInfo",a).then((function(t){e.$Loading.close();var o=t.data;0==o.status?(e.dynamicCode=o.data.dynamicCode,window.location.href="http://mobile.shinexiche.com/welcome_wash?storeOuCode="+e.currentObj.storeCode+"&phone="+e.$store.state.login.phone+"&couNo="+e.coupon.couNo):"1"==e.$store.state.globalConfig.couponOpenVerify&&(e.$Toast("验证码验证失败，请重试！"),e.getMyCouInfo())}))},enter:function(){window.location.href="http://mobile.shinexiche.com/welcome_wash?storeOuCode="+this.currentObj.storeCode+"&phone="+this.$store.state.login.phone+"&couNo="+this.coupon.couNo},useBenefits:function(t){this.show=!0,this.currentObj=t}}},g=f,v=(e("6e70"),e("0c7c")),y=Object(v["a"])(g,a,n,!1,null,"650fe6b5",null);o["default"]=y.exports},"6e70":function(t,o,e){"use strict";e("c4ff")},c4ff:function(t,o,e){},ff76:function(t,o,e){t.exports=e.p+"static/images/b78efed328da4bf073ef1553117ded37.png"}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[678],{"2wRi":function(t,s,i){t.exports=i.p+"static/img/top-bg.9972178.png"},AFIC:function(t,s,i){"use strict";var a=i("x8yc");i.n(a).a},iY2m:function(t,s,i){"use strict";i.r(s);var a={name:"support-station",components:{},data:function(){return{stations:[]}},methods:{toDetail:function(t){this.$router.push({path:"/icbc/stationdetail",query:{station:JSON.stringify(t)}})},getEshNearStation:function(){var t=this,s={longitude:this.$store.state.currentLocation.posx,latitude:this.$store.state.currentLocation.posy};this.$Loading.open(),this.$http.post("/app/json/djljy/router?m=getOilStation",s).then((function(s){t.$Loading.close();var i=s.data;if(0===i.status){var a=JSON.parse(i.data);t.stations=a.oilStations,console.log(t.stations)}else t.$Toast(i.info)}),(function(s){t.$Loading.close(),t.$Toast("系统运行过程中遇到问题，请稍候再试")}))},backEvent:function(){this.$router.go(-1)}},created:function(){this.getEshNearStation()}},n=(i("AFIC"),i("KHd+")),e=Object(n.a)(a,(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"support-station"},[a("nav-top",{attrs:{bgImg:i("2wRi")},on:{backEvent:t.backEvent}}),t._v(" "),a("nav-content",[a("div",{staticClass:"content"},[a("div",{staticClass:"list"},t._l(t.stations,(function(s,i){return a("div",{staticClass:"cell",on:{click:function(i){return t.toDetail(s)}}},[a("div",{staticClass:"local-detail line_bottom"},[a("div",{staticClass:"img-div"},[a("img",{attrs:{src:"static/images/esh-nearstation/logo.png"}})]),t._v(" "),a("div",{staticClass:"info-div"},[a("div",{staticClass:"row"},[a("div",{staticClass:"title single-line"},[t._v(t._s(s.name))]),t._v(" "),a("div",{staticClass:"yz-space"})]),t._v(" "),a("div",{staticClass:"row1"},[a("div",{staticClass:"dw"},[a("img",{attrs:{src:"static/images/esh-nearstation/dw2.png",alt:""}})]),t._v(" "),a("div",{staticClass:"address double-line"},[t._v(t._s(s.address))]),t._v(" "),s.distance>1e3?a("div",{staticClass:"distance"},[t._v("\n                  距您"+t._s(t.$util.toDecimal2(s.distance/1e3))+"km\n                ")]):a("div",{staticClass:"distance"},[t._v("\n                  距您"+t._s(s.distance)+"m\n                ")])])])]),t._v(" "),a("div",{staticClass:"items-div"},[a("div",{staticClass:"item"},[t._v("便利店")]),t._v(" "),a("div",{staticClass:"item"},[t._v("油卡充值")]),t._v(" "),a("div",{staticClass:"item"},[t._v("加水")]),t._v(" "),a("div",{staticClass:"item"},[t._v("洗车")])])])})),0)])])],1)}),[],!1,null,"4e7ca02e",null);s.default=e.exports},x8yc:function(t,s,i){}}]);
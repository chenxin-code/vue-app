(window.webpackJsonp=window.webpackJsonp||[]).push([[762],{AjQE:function(t,i,e){},FSbx:function(t,i,e){"use strict";var s=e("AjQE");e.n(s).a},gJaG:function(t,i,e){"use strict";e.r(i);var s=e("dqDD"),n={name:"refuel-station-list",components:{Toast:s.Toast},data:function(){return{stations:[{stationCode:"",stationName:"",posx:"",posy:"",phone:"",provinceName:"",cityCompName:"",address:"",introdection:"",distance:"",water:"",cleaning:"",toilet:"",maintain:"",food:"",hotWater:"",selfService:"",recharge:"",cvs:"",state:"",cardService:"",weighBridge:"",bacco:"",drinks:"",scenic:"",catering:"",hotel:"",bank:"",selfOil:""}],longitude:"",latitude:""}},methods:{selectEvent:function(t){console.log("station",t),this.$store.state.refuelStation=t;var i=this;this.$bridgefunc.vuexStorage((function(){i.$bridgefunc.customGo(-1)}))},getStationList:function(){this.$Loading.open();var t=this;this.$http.post("/app/json/refuel/getStationList",{lng:t.longitude,lat:t.latitude,token:t.$store.state.login.token,pageIndex:"1"}).then((function(i){t.$Loading.close();var e=i.data;0==e.status?t.stations=e.data:(t.stations=[],Object(s.Toast)({message:e.info?e.info:"获取附近加油站失败",position:"bottom",duration:2e3}))}),(function(i){t.$Loading.close(),t.stations=[],Object(s.Toast)({message:"获取附近加油站失败",position:"bottom",duration:2e3})}))}},created:function(){var t=this;this.$bridgefunc.getLocation((function(i){t.longitude=i.longitude,t.latitude=i.latitude,t.getStationList()}))}},o=(e("FSbx"),e("KHd+")),a=Object(o.a)(n,(function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"bottom"},[e("div",{staticClass:"station-list"},t._l(t.stations,(function(i){return""!==i.stationCode?e("div",{staticClass:"cell-station"},[e("img",{staticClass:"logo-div full-img",attrs:{src:"static/image/refuel/logo.png"}}),t._v(" "),e("div",{staticStyle:{flex:"1"}},[e("div",{staticClass:"font-medium single-line"},[t._v(t._s(i.stationName))]),t._v(" "),e("div",[e("img",{staticClass:"position-img",attrs:{src:"static/image/refuel/refuel03.png"}}),t._v(" "),e("span",{staticClass:"position-span font-small-l"},[t._v("距离您"+t._s(i.distance)+"公里")])])]),t._v(" "),e("div",{staticClass:"select_style",on:{click:function(e){return t.selectEvent(i)}}},[t._v("加油")])]):t._e()})),0)])}),[],!1,null,"5199f6e2",null);i.default=a.exports}}]);
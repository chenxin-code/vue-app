(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-40edc243"],{3965:function(t,i,e){"use strict";e("d527")},8096:function(t,i,e){"use strict";e.r(i);var s=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"bottom"},[e("div",{staticClass:"station-list"},t._l(t.stations,(function(i){return""!==i.stationCode?e("div",{staticClass:"cell-station"},[e("img",{staticClass:"logo-div full-img",attrs:{src:"static/image/refuel/logo.png"}}),e("div",{staticStyle:{flex:"1"}},[e("div",{staticClass:"font-medium single-line"},[t._v(t._s(i.stationName))]),e("div",[e("img",{staticClass:"position-img",attrs:{src:"static/image/refuel/refuel03.png"}}),e("span",{staticClass:"position-span font-small-l"},[t._v("距离您"+t._s(i.distance)+"公里")])])]),e("div",{staticClass:"select_style",on:{click:function(e){return t.selectEvent(i)}}},[t._v("加油")])]):t._e()})),0)])},n=[],o=e("76a0"),a={name:"refuel-station-list",components:{Toast:o["Toast"]},data:function(){return{stations:[{stationCode:"",stationName:"",posx:"",posy:"",phone:"",provinceName:"",cityCompName:"",address:"",introdection:"",distance:"",water:"",cleaning:"",toilet:"",maintain:"",food:"",hotWater:"",selfService:"",recharge:"",cvs:"",state:"",cardService:"",weighBridge:"",bacco:"",drinks:"",scenic:"",catering:"",hotel:"",bank:"",selfOil:""}],longitude:"",latitude:""}},methods:{selectEvent:function(t){this.$store.state.refuelStation=t;var i=this;this.$bridgefunc.vuexStorage((function(){i.$bridgefunc.customGo(-1)}))},getStationList:function(){this.$Loading.open();var t="/app/json/refuel/getStationList",i=this;this.$http.post(t,{lng:i.longitude,lat:i.latitude,token:i.$store.state.login.token,pageIndex:"1"}).then((function(t){i.$Loading.close();var e=t.data;0==e.status?i.stations=e.data:(i.stations=[],Object(o["Toast"])({message:e.info?e.info:"获取附近加油站失败",position:"bottom",duration:2e3}))}),(function(t){i.$Loading.close(),i.stations=[],Object(o["Toast"])({message:"获取附近加油站失败",position:"bottom",duration:2e3})}))}},created:function(){var t=this;this.$bridgefunc.getLocation((function(i){t.longitude=i.longitude,t.latitude=i.latitude,t.getStationList()}))}},c=a,l=(e("3965"),e("0c7c")),r=Object(l["a"])(c,s,n,!1,null,"054c7bd8",null);i["default"]=r.exports},d527:function(t,i,e){}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[779],{"0MWW":function(t,s,a){},p1NU:function(t,s,a){"use strict";a.r(s);var i={name:"esh-nearstation",components:{},props:["myIndex","usePorpData","propData"],mixins:[a("A8ay").a],data:function(){return{stations:[]}},computed:{pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.pageData},moduleData:function(){return this.pageData.moduleList[this.myIndex].data}},methods:{hotEvent:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.actionBtnEvent(this.pageData.pgCode,this.moduleData.idCode+t)},getEshNearStation:function(){var t=this,s={longitude:this.$store.state.currentLocation.posx,latitude:this.$store.state.currentLocation.posy};this.$Loading.open(),this.$http.post("/app/json/djljy/router?m=getOilStation",s).then((function(s){t.$Loading.close();var a=s.data;if(0===a.status){var i=JSON.parse(a.data);t.stations=i.oilStations,console.log(t.stations)}else t.$Toast(a.info)}),(function(s){t.$Loading.close(),t.$Toast("系统运行过程中遇到问题，请稍候再试")}))}},created:function(){this.getEshNearStation()}},e=(a("zBjB"),a("KHd+")),n=Object(e.a)(i,(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"esh-nearstation"},[a("div",{staticClass:"title-row"},[a("div",{staticClass:"title"},[t._v("附近油站")]),t._v(" "),a("div",{staticClass:"more",class:t.hotareaClass({idCode:t.moduleData.idCode+"more"}),on:{click:function(s){t.hotEvent("more"),t.$market.customPush({path:"/icbc/nearstation"})}}},[t._v("更多")])]),t._v(" "),t.stations.length>0?a("div",{staticClass:"list"},t._l(t.stations,(function(s,i){return a("div",{key:i,staticClass:"cell",on:{click:function(s){return t.$market.customPush({path:"/icbc/preferentialfuel"})}}},[a("div",{staticClass:"local-detail line_bottom"},[t._m(0,!0),t._v(" "),a("div",{staticClass:"info-div"},[a("div",{staticClass:"row"},[a("div",{staticClass:"title single-line"},[t._v(t._s(s.name))]),t._v(" "),s.distance<500?a("div",{staticClass:"yz-btn"},[a("img",{attrs:{src:"static/images/esh-nearstation/jzjy.png"}}),t._v(" "),a("span",[t._v("进站加油")])]):a("div",{staticClass:"yz-btn"},[a("img",{staticClass:"dhdz",attrs:{src:"static/images/esh-nearstation/dhdz.png"}}),t._v(" "),a("span",[t._v("导航到站")])])]),t._v(" "),a("div",{staticClass:"row1"},[t._m(1,!0),t._v(" "),a("div",{staticClass:"address double-line"},[t._v(t._s(s.address))]),t._v(" "),s.distance>1e3?a("div",{staticClass:"distance"},[t._v("\n              距您"+t._s(t.$util.toDecimal2(s.distance/1e3))+"km\n            ")]):a("div",{staticClass:"distance"},[t._v("\n              距您"+t._s(s.distance)+"m\n            ")])])])]),t._v(" "),t._m(2,!0)])})),0):t._e()])}),[function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"img-div"},[s("img",{attrs:{src:"static/images/esh-nearstation/logo.png"}})])},function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"dw"},[s("img",{attrs:{src:"static/images/esh-nearstation/dw2.png",alt:""}})])},function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"items-div"},[s("div",{staticClass:"item"},[this._v("便利店")]),this._v(" "),s("div",{staticClass:"item"},[this._v("油卡充值")]),this._v(" "),s("div",{staticClass:"item"},[this._v("加水")]),this._v(" "),s("div",{staticClass:"item"},[this._v("洗车")])])}],!1,null,"5cd046aa",null);s.default=n.exports},zBjB:function(t,s,a){"use strict";var i=a("0MWW");a.n(i).a}}]);
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-624d6cd9"],{"35a0f":function(t,e,a){"use strict";a("e5b7")},e5b7:function(t,e,a){},fbce:function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"hy-station",style:t.getModuleBg()},[a("div",{staticClass:"content",style:t.getSidesStyle()},[a("img",{staticClass:"local-img",attrs:{src:"static/images/hy-top/position-icon.png"}}),a("div",{staticClass:"station-name",class:t.hotareaClass({idCode:t.moduleData.idCode}),on:{click:function(e){t.hotEvent(),t.selectStation()}}},[t._v(t._s(t.stationName))])])])},i=[],s=a("5530"),n=a("2f62"),r=a("03c6"),c={name:"hy-station",components:{},props:["myIndex","usePorpData","propData"],computed:Object(s["a"])(Object(s["a"])({},Object(n["c"])(["clientWidth"])),{},{pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.pageData},moduleData:function(){return this.pageData.moduleList[this.myIndex].data}}),mixins:[r["a"]],data:function(){return{stationName:""}},methods:{hotEvent:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.actionBtnEvent(this.pageData.pgCode,this.moduleData.idCode+t)},getModuleBg:function(){var t="",e=this.moduleData.bgImgUrl;""!=e&&(t+="background: url('"+e+"') no-repeat center center / 100% 100%;");var a=this.moduleData.bgColor;return""!=a&&(t+="background-color: "+a+";"),t},getSidesStyle:function(){var t="",e=this.moduleData.sidesMargin;e>0&&(t+="margin-left: "+e+"%; margin-right: "+e+"%;");var a=this.moduleData.upMargin,o=this.moduleData.downMargin;return a>0&&(t+="padding-top: "+a+"%;"),o>0&&(t+="padding-bottom: "+o+"%;"),t},selectStation:function(){this.$market.selectStation()},getNearStations:function(t){var e=this;this.$Loading.open();var a={token:window.localStorage.getItem("token"),posx:t?t.longitude:void 0,posy:t?t.latitude:void 0,isShowCommon:1,getType:2,count:5},o=this;this.$http.post("/app/json/hy_station/getStationList",a).then((function(t){o.$Loading.close();var a=t.data;0==a.status?(e.$store.state.refuelStation=a.data[0],e.stationName=a.data[0].stationName):o.$Toast({message:a.info,position:"bottom",duration:2e3})}),(function(t){o.$Loading.close()}))}},activated:function(){this.stationName!=this.$store.state.refuelStation.stationName&&(this.stationName=this.$store.state.refuelStation.stationName,this.$emit("componentEvent",{code:"refreshPage"}))},created:function(){this.$store.state.refuelStation&&this.$store.state.refuelStation.stationName?-1==this.$store.state.webtype?this.stationName="示例加油站":this.stationName=this.$store.state.refuelStation.stationName:this.$store.state.currentLocation.posx?this.getNearStations({longitude:this.$store.state.currentLocation.posx,latitude:this.$store.state.currentLocation.posy}):this.getNearStations(null)}},u=c,d=(a("35a0f"),a("0c7c")),l=Object(d["a"])(u,o,i,!1,null,"79e763cc",null);e["default"]=l.exports}}]);
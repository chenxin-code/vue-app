(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7516bb38"],{"2a39":function(t,a,e){"use strict";e("c005")},"72e0":function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return t.$market.moduleIsShow(t.moduleData)?e("div",{staticClass:"bg-div",style:t.getBgDivStyle()},[2==t.moduleData.styleType?e("div",{staticClass:"news-group"},[t._l(t.listShowDatas,(function(a){return e("div",{staticClass:"news-list",on:{click:function(e){return t.toNews(a)}}},[e("div",{staticClass:"image"},[e("img",{attrs:{src:a.picTitle,alt:""}})]),e("div",{staticClass:"text"},[t._v(t._s(a.title))])])})),0==t.listShowDatas.length?e("div",{staticStyle:{"text-align":"center",padding:"10px 0"}},[t._v("暂无任何数据")]):t._e()],2):t.listShowDatas.length>0||1!=t.usePorpData?e("div",{staticClass:"news",style:t.getSidesStyle()},[e("div",{staticClass:"title-img"},[e("img",{attrs:{src:t.moduleData.titleImg}})]),2==t.moduleData.runType?e("div",{staticClass:"news-div",class:t.hotareaClass({idCode:t.moduleData.idCode+"toNews"}),on:{click:function(a){t.hotEvent("toNews"),t.$market.toNews()}}},[e("div",{ref:"runDiv",staticClass:"run-div-1"},[e("transition-group",{attrs:{name:"runnews"}},t._l(t.listShowDatas,(function(a,s){return e("div",{directives:[{name:"show",rawName:"v-show",value:t.showIndex==s,expression:"showIndex == idx"}],key:"runnews_"+s,staticClass:"news-item"},[e("div",{staticClass:"category"},[t._v(t._s(a.categoryName))]),e("div",{staticClass:"title"},[t._v(t._s(a.title))])])})),0)],1)]):e("div",{staticClass:"news-div",class:t.hotareaClass({idCode:t.moduleData.idCode+"toNews"}),on:{click:function(a){t.hotEvent("toNews"),t.$market.toNews()}}},[e("div",{key:1,ref:"runDiv",staticClass:"run-div",style:{animationDuration:t.runTime+"s"}},t._l(t.listShowDatas,(function(a,s){return e("div",{key:s,staticClass:"news-item"},[e("div",{staticClass:"category"},[t._v(t._s(a.categoryName))]),e("div",{staticClass:"title"},[t._v(t._s(a.title))])])})),0),e("div",{key:2,staticClass:"run-div",style:{animationDuration:t.runTime+"s"}},t._l(t.listShowDatas,(function(a,s){return e("div",{key:s,staticClass:"news-item"},[e("div",{staticClass:"category"},[t._v(t._s(a.categoryName))]),e("div",{staticClass:"title"},[t._v(t._s(a.title))])])})),0)])]):t._e()]):t._e()},i=[],n=e("1da1"),o=(e("96cf"),e("4795"),e("99af"),e("289d")),l=e("f094"),r=e("03c6"),u={name:"news",components:{},props:["myIndex","usePorpData","propData"],mixins:[l["a"],r["a"]],data:function(){return{listShowDatas:"",showIndex:1,myTimeout:null,runTime:3,show:!1}},watch:{"moduleData.styleType":function(t){this._getMyData()}},computed:{pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.pageData},moduleData:function(){return this.pageData.moduleList[this.myIndex].data}},methods:{toNews:function(t){this.$router.push({path:"/newsdetail",query:{id:t.id}})},hotEvent:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.actionBtnEvent(this.pageData.pgCode,this.moduleData.idCode+t)},modeleReshow:function(){this._getMyData()},getBgDivStyle:function(){var t="",a=this.moduleData.bgImgUrl;""!=a&&(t+="background: url('"+a+"') no-repeat center center / 100% 100%;");var e=this.moduleData.bgColor;return""!=e&&(t+="background-color: "+e+";"),t},getSidesStyle:function(){var t="",a=this.moduleData.sidesMargin;return a>0&&(t+="margin-left: "+a+"%; margin-right: "+a+"%;"),t},runEvent:function(){var t=this;this.myTimeout=setTimeout((function(){t.showIndex+=1,t.showIndex>=t.listShowDatas.length&&(t.showIndex=0),t.runEvent()}),4e3)},getNewsDataByStyle_2:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function a(){var e,s,i;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return t.listShowDatas=[],e=t.$market.apiBaseURL()+"/app/json/news/getPageNewsList?state=1&isEnable=1",a.next=4,t.$http.get(e);case 4:s=a.sent,i=s.data,0==i.status&&(t.listShowDatas=i.data||[]);case 7:case"end":return a.stop()}}),a)})))()},_getMyData:function(){var t=this;if(2!=this.moduleData.styleType){var a=this.$market.apiBaseURL()+"/app/json/news/defaultList",e={token:this.$store.state.login.token,provinceName:this.$store.state.indexData.province,cityName:this.$store.state.indexData.city};this.listShowDatas=[],this.myTimeout&&(clearTimeout(this.myTimeout),this.myTimeout=null),this.$http.post(a,e).then((function(a){var e=a.data;0==e.status&&(2==t.moduleData.runType?(t.listShowDatas=e.data,1==t.listShowDatas.length&&(t.listShowDatas=t.listShowDatas.concat(t.listShowDatas)),t.showIndex=0,t.runEvent()):(t.listShowDatas=e.data,t.listShowDatas.length>0&&t.$nextTick((function(){setTimeout((function(){var a=t.$refs.runDiv.clientWidth;t.runTime=Math.floor(a/50),t.runTime<3*t.listShowDatas.length&&(t.runTime=3*t.listShowDatas.length)}),300)}))))}),(function(t){}))}else this.getNewsDataByStyle_2()},lazyLoadPageData:function(){this._getMyData()}},destroyed:function(){this.myTimeout&&(clearTimeout(this.myTimeout),this.myTimeout=null)},created:function(){var t=this;o["a"].$on("refreshNews",(function(){t._getMyData()}))}},c=u,d=(e("2a39"),e("0c7c")),h=Object(d["a"])(c,s,i,!1,null,"a74f2c9e",null);a["default"]=h.exports},c005:function(t,a,e){},f094:function(t,a,e){"use strict";a["a"]={data:function(){return{lazyLoadedData:!1}},props:["isScrollPage","scrollSite"],watch:{scrollSite:function(t,a){this.lazyLoadedData||t+1.3*document.documentElement.clientHeight>this.$el.offsetTop&&(this.lazyLoadedData=!0,this.lazyLoadPageData&&this.lazyLoadPageData())}},mounted:function(){if(this.isScrollPage){if(this.lazyLoadedData)return;1.3*document.documentElement.clientHeight>this.$el.offsetTop&&(this.lazyLoadedData=!0,this.lazyLoadPageData&&this.lazyLoadPageData())}else this.lazyLoadPageData&&this.lazyLoadPageData()}}}}]);
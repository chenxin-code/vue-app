(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5ee3ff5e"],{"510c":function(t,i,e){},"934a":function(t,i,e){"use strict";e.r(i);var s=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"latest-price"},[e("nav-top",{on:{backEvent:function(i){return t.$router.go(-1)}}}),e("nav-content",[e("div",{staticClass:"scroll-div"},[e("div",{staticClass:"top-div"},[e("div",{staticClass:"img-bg-corner"},[e("img",{attrs:{src:"static/image/index/latest-price/myBgImg-1.png"}})]),e("div",{staticClass:"info-div"},[e("div",{staticClass:"text-div"},[e("div",{staticClass:"big-text"},[t._v("最新油价")])]),e("div",{staticClass:"img-div"},[e("img",{attrs:{src:"static/image/index/latest-price/top-img.png"}})])])]),e("div",{staticClass:"content"},t._l(t.listShowDatas,(function(i,s){return e("div",{staticClass:"cate-div"},[e("div",{staticClass:"title-row"},[e("img",{attrs:{src:"static/image/index/latest-price/yj-"+(s+1)+".png"}}),e("span",[t._v(t._s(t.getTitleText(s)))])]),t._l(i,(function(i){return e("div",{staticClass:"items-div"},[e("div",[e("div",{staticClass:"items-title"},[t._v(t._s(i.name))]),t._l(i.arr,(function(i){return e("div",{staticClass:"item-div line_top"},[e("div",{staticClass:"title"},[e("p",{staticClass:"theme_font_common"},[t._v(t._s(i.oilName))]),e("p",{staticClass:"font-small theme_font_gray"},[t._v("自"+t._s(t.getTimeStr(i))+"开始执行")])]),e("div",{staticClass:"price theme_font_gray"},[t._v("￥"),e("span",{staticClass:"theme_font_black"},[t._v(t._s(i.oilPrice))]),t._v(t._s(i.listUnit))])])}))],2)])}))],2)})),0)])])],1)},a=[],n=(e("ac1f"),e("5319"),e("0d03"),{name:"latest-price",components:{},data:function(){return{proOilPriceModelList:[],listShowDatas:[]}},methods:{getTitleText:function(t){return 0==t?"汽油":1==t?"柴油":"天然气"},getTimeStr:function(t){var i=t.beginTime;i=i.replace(/-/g,"/");var e=new Date(i),s=e.getFullYear(),a=e.getMonth()+1,n=e.getDate(),r=e.getHours(),c=e.getMinutes(),o=e.getSeconds(),l=s+"年"+this.$util.getzf(a)+"月"+this.$util.getzf(n)+"日"+this.$util.getzf(r)+"时"+this.$util.getzf(c)+"分"+this.$util.getzf(o)+"秒";return l},getOilPrice:function(){var t=this,i="/app/json/product/queryOilPriceList",e={token:this.$store.state.login.token};this.$Loading.open(),this.$http.post(i,e).then((function(i){var e=i.data;t.$Loading.close(),0==e.status?e.data.proOilPriceModelList.length>0&&(t.proOilPriceModelList=e.data.proOilPriceModelList,t.dataProcessing()):t.$Toast(e.info)}),(function(i){t.$Loading.close(),t.$Toast("获取数据失败！")}))},dataProcessing:function(){for(var t={},i={},e={},s=0;s<this.proOilPriceModelList.length;s++){var a=this.proOilPriceModelList[s];0==a.oilCategory?this.itemInsertArr(t,a):1==a.oilCategory?this.itemInsertArr(i,a):2==a.oilCategory&&this.itemInsertArr(e,a)}this.listShowDatas=[],this.listShowDatas.push(t,i,e)},itemInsertArr:function(t,i){if(t[i.priceType])t[i.priceType].arr.push(i);else{var e=[];e.push(i),t[i.priceType]={name:i.priceTypeName,arr:e}}}},created:function(){this.getOilPrice()}}),r=n,c=(e("fbd8"),e("0c7c")),o=Object(c["a"])(r,s,a,!1,null,"79c03c42",null);i["default"]=o.exports},fbd8:function(t,i,e){"use strict";e("510c")}}]);
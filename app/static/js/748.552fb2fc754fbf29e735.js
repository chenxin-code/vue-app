(window.webpackJsonp=window.webpackJsonp||[]).push([[748],{"5sqD":function(t,e,o){},DGN9:function(t,e,o){"use strict";o.r(e);var a={name:"product",components:{PriceOrder:o("WQzh").a},data:function(){return{barCode:"",storeoucode:"",detailData:{},loaded:!1,historyPros:[]}},methods:{_getProductDetail:function(){var t=this,e={token:this.$store.state.login.token,barcode:this.barCode,pickupStoreOuCode:this.storeoucode};this.$Loading.open(),this.$http.post("/app/json/product/getAppProDetail",e).then((function(e){t.$Loading.close();var o=e.data;if(0==o.status){t.loaded=!0,t.detailData=o.data;var a=t.$mallCommon.priceFromItem(t.detailData);t.detailData.dpedData=a;for(var s=t.detailData.skuId,r=!1,i=0;i<t.historyPros.length;i++){var d=t.historyPros[i];if(d.skuId==s){r=!0,d.number+=1;break}}r||t.historyPros.push({skuId:t.detailData.skuId,storeOuCode:t.storeoucode,number:1,checked:1}),window.localStorage.setItem("historyPros",JSON.stringify(t.historyPros))}else t.$Toast(o.info)}),(function(e){t.$Loading.close(),t.$Toast("请求数据失败！")}))}},created:function(){var t=window.localStorage.getItem("historyPros");this.historyPros=t&&null!=t&&""!=t?JSON.parse(t):[],this.storeoucode=this.$route.query.storeoucode,this.barCode=this.$route.query.code,this._getProductDetail()}},s=(o("ZozW"),o("KHd+")),r=Object(s.a)(a,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return t.loaded?o("div",{staticClass:"product"},[o("div",{staticClass:"img-div"},[o("img",{attrs:{src:t.detailData.phMainUrl}})]),t._v(" "),o("div",{staticClass:"title single-line"},[t._v(t._s(t.detailData.showTitle))]),t._v(" "),o("div",{staticClass:"price"},[o("PriceOrder",{attrs:{scanProduct:t.detailData}})],1)]):t._e()}),[],!1,null,"0337438e",null);e.default=r.exports},ZozW:function(t,e,o){"use strict";var a=o("5sqD");o.n(a).a}}]);
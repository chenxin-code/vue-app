(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-789f36b2"],{"13d9":function(t,a,s){},"9a87":function(t,a,s){"use strict";s.r(a);var e=function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"sureorder"},[s("nav-top",{attrs:{title:"使用详情"},on:{backEvent:function(a){return t.$router.go(-1)}}}),s("nav-content",[s("div",{staticClass:"shadow-cell"},[s("div",{staticClass:"today"},[s("p",{staticClass:"p1"},[t._v("电子券号")]),s("p",{staticClass:"p2 code"},[t._v(t._s(t.item.coucode))])]),s("div",{staticClass:"today"},[s("p",{staticClass:"p1"},[t._v("面值金额")]),s("p",{staticClass:"p2"},[t._v(t._s(t.item.facevalue)+"元")])]),s("div",{staticClass:"today"},[s("p",{staticClass:"p1"},[t._v("交易单号")]),s("p",{staticClass:"p2"},[t._v(t._s(t.item.facevalue))])]),s("div",{staticClass:"today"},[s("p",{staticClass:"p1"},[t._v("交易站点")]),s("p",{staticClass:"p2"},[t._v(t._s(t.item.stationName))])]),s("div",{staticClass:"today"},[s("p",{staticClass:"p1"},[t._v("EPS流水号")]),s("p",{staticClass:"p2"},[t._v(t._s(t.item.voucher))])]),s("div",{staticClass:"today"},[s("p",{staticClass:"p1"},[t._v("交易时间")]),s("p",{staticClass:"p2"},[t._v(t._s(t.item.usedtime))])]),s("div",{staticClass:"bar"},[s("p",[t._v(t._s(t.item.voucher))]),s("canvas",{attrs:{id:"barcode"}})])])])],1)},i=[],o=s("62c5"),c=s.n(o),n={name:"myself",data:function(){return{item:"",code:"",coucode:"",facevalue:"",tradeno:"",tradeorg:"",epsno:"",usedtime:""}},methods:{getDetail:function(){var t=this,a="/platform/json/coupon/getusedcoudetail",s={voucher:this.item,token:this.$store.state.login.token,isJsonData:!0};this.$Loading.open();var e=this;this.$http.post(a,s).then((function(t){if(e.$Loading.close(),0===t.data.status){var a=t.data.data;a&&(e.coucode=a.coucode,e.facevalue=a.facevalue,e.tradeno=a.tradeno,e.tradeorg=a.tradeorg,e.epsno=a.epsno,e.usedtime=a.usedtime,e.code=a.coucode,e.$nextTick((function(){e.createBar(a.coucode)})))}else e.$Toast({message:t.data.info,position:"bottom",duration:2e3})}))["catch"]((function(a){t.$Loading.close(),t.$Toast({message:"请求失败",position:"bottom",duration:2e3})}))},createBar:function(t){var a=document.getElementById("barcode");c()(a,"45454545445",{width:2.5,height:50,displayValue:!1,fontSize:16})}},created:function(){var t=this;this.$nextTick((function(){t.createBar(t.item.voucher)})),this.item=JSON.parse(decodeURIComponent(this.$route.query.item)),this.getDetail()}},d=n,r=(s("c555"),s("0c7c")),u=Object(r["a"])(d,e,i,!1,null,"7a70e004",null);a["default"]=u.exports},c555:function(t,a,s){"use strict";s("13d9")}}]);
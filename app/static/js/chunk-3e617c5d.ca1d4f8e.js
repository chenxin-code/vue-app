(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3e617c5d"],{"43f2":function(t,e,s){"use strict";s("849a")},"849a":function(t,e,s){},db27:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"address-list"},[s("nav-top",{on:{backEvent:t.backEvent}}),s("nav-content",[s("div",{ref:"addresslistscrl",staticClass:"scrolcontent"},[t._l(t.lists,(function(e,a){return s("div",{staticClass:"address-cells shadow-cell",on:{click:function(s){return t.selectAddress(e,a)}}},[s("mt-cell-swipe",{staticClass:"my-cell-swipe",attrs:{right:[{content:"删除",style:{padding:"20px 30px",background:"#F80F16",color:"white",display:"flex",alignItems:"center"},handler:function(){return t._deleteAddress(e,a)}}]}},[s("div",{staticStyle:{width:"100%",display:"flex","align-items":"center"},attrs:{slot:"title"},slot:"title"},[e.id==t.$store.state.mall2.selectAddress.id&&0==t.pageType?s("div",{staticClass:"left-select"},[s("i",{staticClass:"iconfont mall-xuanzhong theme_font_red"})]):t._e(),s("div",{staticClass:"right-info"},[s("div",{staticClass:"name-phone"},[s("span",{staticClass:"realName theme_font_black left-con"},[t._v(t._s(e.receiverName))]),s("span",{staticClass:"tel theme_font_black left-con"},[t._v(t._s(e.mobile))]),1==e.isDefault?s("span",{staticClass:"default left-con theme_bg_red"},[t._v("默认")]):t._e()]),s("div",{staticClass:"address-edit"},[s("p",{staticClass:"address theme_font_gray"},[t._v(t._s(e.addressFull))]),s("div",{staticClass:"edit",on:{click:function(s){return s.stopPropagation(),t.editAddress(e)}}},[s("i",{staticClass:"iconfont mall-bianji theme_font_gray"})])])])])])],1)})),t.cannotUseList.length>0?s("div",[s("div",{staticClass:"cannot-use-address"},[s("div",{staticClass:"line line_top"}),s("div",{staticClass:"text"},[t._v("不可用地址")]),s("div",{staticClass:"line line_top"})]),t._l(t.cannotUseList,(function(e,a){return s("div",{staticClass:"address-cells shadow-cell"},[s("mt-cell-swipe",{staticClass:"my-cell-swipe",attrs:{right:[{content:"删除",style:{padding:"20px 30px",background:"#F80F16",color:"white",display:"flex",alignItems:"center"},handler:function(){return t._deleteAddress(e,a)}}]}},[s("div",{staticStyle:{width:"100%",display:"flex","align-items":"center"},attrs:{slot:"title"},slot:"title"},[e.id==t.$store.state.mall2.selectAddress.id&&0==t.pageType?s("div",{staticClass:"left-select"},[s("i",{staticClass:"iconfont mall-xuanzhong theme_font_red"})]):t._e(),s("div",{staticClass:"right-info"},[s("div",{staticClass:"name-phone"},[s("span",{staticClass:"realName theme_font_gray left-con"},[t._v(t._s(e.receiverName))]),s("span",{staticClass:"tel theme_font_gray left-con"},[t._v(t._s(e.mobile))]),1==e.isDefault?s("span",{staticClass:"default left-con theme_bg_red"},[t._v("默认")]):t._e()]),s("div",{staticClass:"address-edit"},[s("p",{staticClass:"address theme_font_gray"},[t._v(t._s(e.addressFull))]),s("div",{staticClass:"edit",on:{click:function(s){return s.stopPropagation(),t.editAddress(e)}}},[s("i",{staticClass:"iconfont mall-bianji theme_font_gray"})])])])])])],1)}))],2):t._e()],2),s("div",{staticClass:"bottom-btn theme_bg_red",on:{click:t.addAddressEvent}},[s("p",[t._v("新建收货地址")])])])],1)},i=[],d=s("76a0"),l={name:"addresslist",components:{Indicator:d["Indicator"],Toast:d["Toast"],CellSwipe:d["CellSwipe"]},data:function(){return{lists:[],scrollValue:0,reSetDefault:!1,pageType:"0",type:"",cannotUseList:[]}},methods:{backEvent:function(){this.$router.go(-1)},reSetDefaultAddress:function(t){this.reSetDefault=!1,this.$store.state.mall2.selectAddress=t,this._setDefaultAddress(t.id),this.$bridgefunc.vuexStorage()},_deleteAddress:function(t,e){var s=this;t.id==this.$store.state.mall2.selectAddress.id&&(this.reSetDefault=!0),this.$Loading.open();var a="/app/json/user_address/deleteUserAddress",i={id:t.id,token:this.$store.state.login.token};this.$http.post(a,i).then((function(t){s.$Loading.close();var e=t.data;0==e.status?s._getAddressList():s.$Toast(e.info)}),(function(t){s.$Loading.close(),s.$Toast("删除地址失败")}))},editAddress:function(t){this.$router.push({path:"/mall2/addaddress",query:{addressItem:encodeURIComponent(JSON.stringify(t)),type:2,pageType:this.pageType}})},addAddressEvent:function(){if("citydelivery"==this.type){var t=sessionStorage.getItem("Address_City_Seleted");t=JSON.parse(t),this.$router.push({path:"/mall2/addaddress",query:{type:1,pageType:this.pageType,defaultCity:t.cityName,defaultProvince:t.provinceName}})}else this.$router.push({path:"/mall2/addaddress",query:{type:1,pageType:this.pageType}})},selectAddress:function(t,e){"0"==this.pageType&&(this.$store.state.mall2.selectAddress=t,this._setDefaultAddress(t.id),this.$bridgefunc.vuexStorage(),this.backEvent())},_setDefaultAddress:function(t){var e="/app/json/user_address/addDefaultAddress",s={token:this.$store.state.login.token,deliveryId:t};this.$http.post(e,s).then((function(t){}),(function(t){}))},_getAddressList:function(){var t=this;this.$Loading.open();var e="/app/json/user_address/loadUserAddressList",s={token:this.$store.state.login.token,addressType:"1"};this.$http.post(e,s).then((function(e){t.$Loading.close();var s=e.data;if(0==s.status){var a=s.data;if("citydelivery"==t.type){var i=sessionStorage.getItem("Address_City_Seleted");i=JSON.parse(i);for(var d=[],l=[],n=0;n<a.length;n++){var r=a[n];r.cityId==i.cityId?d.push(r):l.push(r)}d.length>0?1==t.reSetDefault&&t.reSetDefaultAddress(d[0]):(t.$store.state.mall2.selectAddress={id:""},t.$bridgefunc.vuexStorage()),t.lists=d,t.cannotUseList=l}else a.length>0?1==t.reSetDefault&&t.reSetDefaultAddress(a[0]):(t.$store.state.mall2.selectAddress.id="",t.$bridgefunc.vuexStorage()),t.lists=a}else t.$Toast(s.info)}),(function(e){t.$Loading.close(),t.$Toast("获取数据失败")}))}},created:function(){this.pageType=this.$route.query.pageType?this.$route.query.pageType:"0",this.type=this.$route.query.type?this.$route.query.type:"",this._getAddressList()}},n=l,r=(s("43f2"),s("0c7c")),o=Object(r["a"])(n,a,i,!1,null,"3a79d74c",null);e["default"]=o.exports}}]);
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-46a2c735"],{"377d":function(t,e,s){},9415:function(t,e,s){"use strict";s("377d")},e14d:function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("nav-top",{on:{backEvent:function(e){return t.$router.go(-1)}}}),s("nav-content",[s("div",{staticClass:"address-edit"},[s("div",{staticClass:"list"},[s("div",{staticClass:"card-div"},[s("div",{staticClass:"row line_bottom"},[s("div",{staticClass:"label"},[t._v("小区/大厦/学校")]),s("div",{staticClass:"value",on:{click:t.toMap}},[s("div",{staticClass:"loaction single-line"},[t._v(t._s(t.location.area))])]),s("i",{staticClass:"iconfont mall-gengduojiantou theme_font_black icon-font"})]),s("div",{staticClass:"row line_bottom"},[s("div",{staticClass:"label"},[t._v("楼号-门牌号")]),s("div",{staticClass:"value"},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.position,expression:"position"}],attrs:{placeholder:"例如：B座1009"},domProps:{value:t.position},on:{input:function(e){e.target.composing||(t.position=e.target.value)}}})])]),s("div",{staticClass:"row line_bottom"},[s("div",{staticClass:"label"},[t._v("收货人")]),s("div",{staticClass:"value"},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.name,expression:"name"}],attrs:{placeholder:"请输入收货人姓名"},domProps:{value:t.name},on:{input:function(e){e.target.composing||(t.name=e.target.value)}}})])]),s("div",{staticClass:"row"},[s("div",{staticClass:"label"},[t._v("手机号")]),s("div",{staticClass:"value"},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.phone,expression:"phone"}],attrs:{placeholder:"请输入收货人手机号",type:"tel",maxlength:"11",onkeypress:"return( /[\\d]/.test(String.fromCharCode(event.keyCode)))",pattern:"[0-9]*"},domProps:{value:t.phone},on:{input:[function(e){e.target.composing||(t.phone=e.target.value)},function(e){t.phone=/^\d+/.exec(t.phone)?/^\d+/.exec(t.phone)[0]:""}],blur:t.phoneBlur}})])])])]),s("div",{staticClass:"bottom-btn theme_bg_red",on:{click:t.addAddressEvent}},[s("p",[t._v("保存并使用")])])])])],1)},o=[],a=(s("b0c0"),{name:"address-edit",components:{},data:function(){return{location:{},position:"",name:"",phone:"",editAddress:{},storeOuCode:""}},methods:{phoneBlur:function(){},toMap:function(){this.$router.push({path:"/mall2/store-delivery/address-map"})},addAddressEvent:function(){var t=this;if(this.$util.checkMobile(this.phone))if(""!=this.position)if(""!=this.name){var e="/app/json/user_address/updateStoreDeliveryUserAddress",s=this.location;s.storeOuCode=this.storeOuCode,s.houseNumber=this.position,s.receiverName=this.name,s.mobile=this.phone,""==s.countryId&&(s.countryId="-1"),""==s.townId&&(s.townId="-1"),s.addressFull=this.location.address+this.position,this.location.id&&(s.id=this.location.id),this.$Loading.open(),this.$http.post(e,s).then((function(e){t.$Loading.close();var s=e.data;0==s.status?(localStorage.setItem("Address_List_Seleted",JSON.stringify(s.data)),t.$router.go(-2)):t.$Toast(s.info)}),(function(e){t.$Loading.close(),t.$Toast("请求数据失败！")}))}else this.$Toast("请输入收货人姓名！");else this.$Toast("请输入门牌号！");else this.$Toast("请输入正确的手机号！")},getLoaction:function(){var t=this;this.$bridgefunc.getLocation((function(e){t.$mallCommon.nearAddress((function(e){t.location=e}),e)}))}},mounted:function(){var t=this,e=sessionStorage.getItem("Address_Map_Seleted");if(e){sessionStorage.removeItem("Address_Map_Seleted"),e=JSON.parse(e);var s={province:e.province,city:e.city,district:e.area,longitude:e.location.lng,latitude:e.location.lat,address:e.address+e.name,name:e.name};e.city==e.province&&(s.city=e.area,s.district=""),this.$mallCommon.pureLocationAnalysis((function(e){t.location=e}),s)}else"1"==this.$route.query.pageType?(this.editAddress=JSON.parse(this.$route.query.address),this.location=this.editAddress,this.position=this.editAddress.houseNumber,this.name=this.editAddress.receiverName,this.phone=this.editAddress.mobile):this.getLoaction()}}),n=a,d=(s("9415"),s("0c7c")),r=Object(d["a"])(n,i,o,!1,null,"1e469c62",null);e["default"]=r.exports}}]);
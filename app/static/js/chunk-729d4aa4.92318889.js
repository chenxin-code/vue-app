(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-729d4aa4","chunk-7baddb58"],{"01b8":function(t,e,i){"use strict";i("81fe")},"1d33":function(t,e,i){"use strict";i("a6be")},"4a7e":function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"modify-order-address mall2"},[i("nav-top",{on:{backEvent:t.backEvent}}),i("nav-content",[i("div",{staticClass:"scrolcontent"},[this.$store.state.globalConfig.OrderModification_TextPrompt?i("div",{staticClass:"promptText"},[t._v(t._s(this.$store.state.globalConfig.OrderModification_TextPrompt))]):t._e(),i("div",{staticClass:"shadow-con shadow-cell"},[i("mt-field",{staticClass:"mt-title border",attrs:{label:"收货人姓名",placeholder:"请输入收货人姓名"},nativeOn:{"!input":function(e){return t.receiverInputChange.apply(null,arguments)}},model:{value:t.receiver,callback:function(e){t.receiver=e},expression:"receiver"}}),i("mt-field",{staticClass:"mt-title border",attrs:{label:"手机号",placeholder:"请输入手机号码",type:"tel"},model:{value:t.mobile,callback:function(e){t.mobile=e},expression:"mobile"}}),i("div",{on:{click:function(e){return e.stopPropagation(),t.selectRegion.apply(null,arguments)}}},[i("mt-field",{staticClass:"mt-title border",attrs:{label:"选择区域",placeholder:"请选择区域",readonly:"readonly"},model:{value:t.regionText,callback:function(e){t.regionText=e},expression:"regionText"}},[i("img",{attrs:{width:"20px",height:"20px",src:"static/image/mall2/area.png"}})])],1),i("mt-field",{staticClass:"mt-title",attrs:{label:"详细地址",placeholder:"请输入详细地址"},nativeOn:{"!input":function(e){return t.addressInputChange.apply(null,arguments)}},model:{value:t.address,callback:function(e){t.address=e},expression:"address"}})],1)]),i("div",{staticClass:"bottom-btn theme_bg_red",on:{click:t.saveAddressEvent}},[i("p",{},[t._v("使用新地址")])])]),t.showSelect?i("RegionSelect",{ref:"regionselect",attrs:{initData:t.initData},on:{selectedItemsEvent:t.selectedItemsEvent,closeEvent:t.regionCloseEvent}}):t._e()],1)},a=[],n=(i("fb6a"),i("b0c0"),i("76a0")),o=i("8431"),r={name:"modify-order-address",components:{Field:n["Field"],RegionSelect:o["default"]},data:function(){return{eventType:1,receiver:"",mobile:"",regionText:"",address:"",isDefault:!0,showSelect:!1,initData:{title:"请选择地区"},region:[],selectedItems:[],addressId:"",provinceId:"",provinceName:"",cityId:"",cityName:"",countryId:"",countryName:"",townId:"",townName:"",zipCode:"",areaCode:"",id:"",addressFull:"",addressType:"1",pageType:"0",orderId:"",tradeNo:"",orderType:""}},methods:{receiverInputChange:function(t){var e=t.target.value;e.length>50&&(e=e.slice(0,50),this.$Toast("收货人最大输入50个字")),this.receiver=e},addressInputChange:function(t){var e=t.target.value;e.length>100&&(e=e.slice(0,100),this.$Toast("详细地址最大输入100个字")),this.address=e},backEvent:function(){this.$router.go(-1)},switchClick:function(){this.isDefault=!this.isDefault},saveAddressEvent:function(){var t=this;if(""!=this.receiver&&""!=this.mobile&&""!=this.regionText&&""!=this.address)if(this.$util.checkMobile(this.mobile))if(this.isEmojiCharacter(this.address))this.$Toast("详细地址里面不能输入表情符号！");else{var e="/app/json/app_shopping_order/modifyReceivingAddress";this.$Loading.open();var i={townName:this.townName,address:this.address,receiver:this.receiver,mobile:this.mobile,townId:this.townId,cityId:this.cityId,provinceId:this.provinceId,countryId:this.countryId,cityName:this.cityName,provinceName:this.provinceName,countryName:this.countryName,orderId:this.orderId,tradeNo:this.tradeNo,orderType:this.orderType};if(this.region.length>0)for(var s=0;s<4;s++){var a={id:"",name:""};this.region.length>s&&(a=this.region[s]),0==s?(i.provinceId=a.id,i.provinceName=a.name):1==s?(i.cityId=a.id,i.cityName=a.name):2==s?(i.countryId=a.id,i.countryName=a.name):3==s&&(i.townId=a.id,i.townName=a.name)}this.$http.post(e,i).then((function(e){t.$Loading.close();var i=e.data;0==i.status?(t.$Toast("修改成功！"),t.$router.go(-1)):t.$Toast(i.info)}),(function(e){t.$Loading.close(),t.$Toast("保存失败")}))}else this.$Toast("请填写正确的手机号码！");else this.$Toast("所有填写项都为必填项，请将信息填写完整！")},selectRegion:function(){this.showSelect=!0,this._getRegionData(0)},selectedItemsEvent:function(t){var e=t.item;if(this.selectedItems=t.selecteds,4==this.selectedItems.length)return this.showSelect=!1,this.region=this.selectedItems,void this.getRegionText();this._getRegionData(e.id)},regionCloseEvent:function(){this.showSelect=!1},_getRegionData:function(t){var e=this;this.$Loading.open();var i="/app/json/area/loadAreaList",s={token:this.$store.state.login.token,parentId:t};this.$http.post(i,s).then((function(t){e.$Loading.close();var i=t.data;if(0==i.status){var s=i.data;s.length>0?e.$nextTick((function(){this.$refs.regionselect.pushCustomOptions(s)})):(e.showSelect=!1,e.region=e.selectedItems,e.getRegionText())}else e.$Toast(i.info)}),(function(t){e.$Loading.close(),e.$Toast("获取数据失败")}))},getRegionText:function(){for(var t="",e=0;e<this.region.length;e++)t+=this.region[e].name;this.regionText=t,this.$refs.regionselect.reset(null)},isEmojiCharacter:function(t){for(var e=0;e<t.length;e++){var i=t.charCodeAt(e);if(55296<=i&&i<=56319){if(t.length>1){var s=t.charCodeAt(e+1),a=1024*(i-55296)+(s-56320)+65536;if(118784<=a&&a<=128895)return!0}}else if(t.length>1){s=t.charCodeAt(e+1);if(8419==s)return!0}else{if(8448<=i&&i<=10239)return!0;if(11013<=i&&i<=11015)return!0;if(10548<=i&&i<=10549)return!0;if(12951<=i&&i<=12953)return!0;if(169==i||174==i||12349==i||12336==i||11093==i||11036==i||11035==i||11088==i)return!0}}}},created:function(){this.orderId=this.$route.query.orderId,this.tradeNo=this.$route.query.tradeNo,this.orderType=this.$route.query.orderType;var t=this.$route.query.address?JSON.parse(decodeURIComponent(this.$route.query.address)):"";""!=t&&(this.address=t.address,this.receiver=t.receiver,this.mobile=t.mobile,this.townId=t.townId,this.townName=t.townName,this.cityName=t.cityName,this.cityId=t.cityId,this.provinceId=t.provinceId,this.provinceName=t.provinceName,this.countryId=t.countryId,this.countryName=t.countryName,this.regionText=t.provinceName+t.cityName+t.countryName+t.townName);var e=this.provinceName||"",i=this.cityName||"",s=this.countryName||"";if(e&&i&&s)switch(this.initData.canNotReselect=!0,this.$store.state.globalConfig.order_open_modify_all_address){case"1":this.initData.canNotReselect=!1,this.initData.initAreas=[];break;case"2":this.initData.initAreas=[e];break;case"3":this.initData.initAreas=[e,i];break;case"4":this.initData.initAreas=[e,i,s];break;default:this.initData.initAreas=[e,i]}}},c=r,d=(i("01b8"),i("0c7c")),l=Object(d["a"])(c,s,a,!1,null,"085ade1d",null);e["default"]=l.exports},"81fe":function(t,e,i){},8431:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"region-select"},[i("div",{staticClass:"other-div",on:{click:t.close}}),i("transition",{attrs:{name:"pop_transiton"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:t.popShow,expression:"popShow"}],staticClass:"select-content"},[i("div",{staticClass:"close-btn",on:{click:t.close}},[i("img",{attrs:{src:"static/image/mall/close.png"}})]),i("div",{staticClass:"font-medium-l-x title"},[t._v(t._s(t.initData.title?t.initData.title:"请选择区域"))]),i("div",{staticClass:"selected-item font-medium"},[t._l(t.selectedItems,(function(e,s){return i("div",{staticClass:"item-div",on:{click:function(e){return t.reSelect(s)}}},[i("div",{staticClass:"item-text"},[t._v(t._s(e.name))])])})),t.cusOptions.length>0?i("div",{staticClass:"item-div"},[i("div",{staticClass:"item-text item-selected theme_font_red"},[t._v("请选择")])]):t._e()],2),i("div",{staticClass:"options-div"},t._l(t.cusOptions,(function(e,s){return i("div",{staticClass:"option",on:{click:function(i){return t.selectOption(e,s)}}},[t._v(t._s(e.name))])})),0)])])],1)},a=[],n=(i("4795"),i("a434"),i("b0c0"),{name:"",props:{initData:{type:Object,default:{}}},data:function(){return{popShow:!1,selectedIndexs:[],selectedItems:[],dataCache:[],cusOptions:[],cusIndex:0,initAreas:[],myTimeout:null}},methods:{close:function(){var t=this;this.popShow=!1,this.myTimeout&&(clearTimeout(this.myTimeout),this.myTimeout=null),this.myTimeout=setTimeout((function(){t.$emit("closeEvent","")}),240)},reSelect:function(t){if(1!=this.initData.canNotReselect){var e=this.selectedItems.length-t;this.selectedItems.splice(t,e),this.selectedIndexs.splice(t,e);var i=this.dataCache[t];this.dataCache.splice(t+1,e),this.cusOptions=i}},selectOption:function(t,e){this.cusIndex=e,this.selectedItems.push(t),this.selectedIndexs.push(e),this.cusOptions=[];var i={item:t,selecteds:this.selectedItems};this.$emit("selectedItemsEvent",i)},pushCustomOptions:function(t){if(0==this.selectedIndexs.length&&(this.selectedIndexs=[],this.selectedItems=[],this.dataCache=[],this.cusIndex=0),this.dataCache.push(t),this.cusOptions=t,this.initAreas&&this.initAreas.length>0){for(var e=this.initAreas.shift(),i=!1,s=0;s<t.length;s++){var a=t[s];if(this.$util.areaEqual(e,a.name)){i=!0,this.selectOption(a,s);break}}0==i&&(this.initAreas=[])}},reset:function(t){this.selectedIndexs=[],this.selectedItems=[],this.cusIndex=0,t?(this.dataCache=[],this.dataCache.push(t),this.cusOptions=t):(this.cusOptions=this.dataCache[0],this.dataCache=[],this.dataCache.push(this.cusOptions))}},created:function(){try{this.initAreas=JSON.parse(JSON.stringify(this.initData.initAreas))}catch(t){this.initAreas=[]}},mounted:function(){this.popShow=!0}}),o=n,r=(i("1d33"),i("0c7c")),c=Object(r["a"])(o,s,a,!1,null,"6251ae42",null);e["default"]=c.exports},a6be:function(t,e,i){}}]);
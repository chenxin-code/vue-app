(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-747cdeee"],{"1c78":function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"group"},[i("nav-top",{on:{backEvent:e.backEvent}}),i("nav-content",[i("van-cell-group",{staticStyle:{"margin-bottom":"6px"}},[i("van-field",{attrs:{label:"行业群组:","input-align":"right",readonly:!0,border:""},model:{value:e.obj.clusterName,callback:function(t){e.$set(e.obj,"clusterName",t)},expression:"obj.clusterName"}}),i("van-field",{attrs:{label:"审批状态:","input-align":"right",readonly:!0,border:""},model:{value:e.obj.groupStatus,callback:function(t){e.$set(e.obj,"groupStatus",t)},expression:"obj.groupStatus"}}),i("van-field",{attrs:{label:"群组状态:","input-align":"right",readonly:!0,border:""},model:{value:e.obj.status,callback:function(t){e.$set(e.obj,"status",t)},expression:"obj.status"}})],1),e.usercertificate?i("van-cell-group",{staticStyle:{"margin-bottom":"6px"}},[i("van-field",{attrs:{label:"实名认证","input-align":"right",readonly:!0,border:""}}),i("van-field",{attrs:{label:"姓名:","input-align":"right",readonly:!0,border:""},model:{value:e.usercertificate.name,callback:function(t){e.$set(e.usercertificate,"name",t)},expression:"usercertificate.name"}}),i("van-field",{attrs:{label:"身份证号:","input-align":"right",readonly:!0,border:""},model:{value:e.usercertificate.idcardNum,callback:function(t){e.$set(e.usercertificate,"idcardNum",t)},expression:"usercertificate.idcardNum"}}),i("div",{staticClass:"certificates"},[i("div",{staticClass:"certificatesItem"},[i("div",{staticClass:"imgBox"},[i("img",{staticClass:"backgroundImg",attrs:{src:e.usercertificate.imgFront||"static/image/vocational-certification/rx@2x.png",alt:""}})]),i("div",{staticClass:"text"},[i("div",{staticClass:"textBox"},[i("span",[e._v("身份证正面")])])])]),i("div",{staticClass:"certificatesItem"},[i("div",{staticClass:"imgBox"},[i("img",{staticClass:"backgroundImg",attrs:{src:e.usercertificate.imgBehind||"static/image/vocational-certification/gh@2x.png",alt:""}})]),i("div",{staticClass:"text"},[i("div",{staticClass:"textBox"},[i("span",[e._v("身份证背面")])])])])])],1):e._e(),e.driverInfoModel?i("van-cell-group",{staticStyle:{"margin-bottom":"6px"}},[i("van-field",{attrs:{label:"驾驶证认证","input-align":"right",readonly:!0,border:""}}),i("van-field",{attrs:{label:"姓名:","input-align":"right",readonly:!0,border:""},model:{value:e.driverInfoModel.name,callback:function(t){e.$set(e.driverInfoModel,"name",t)},expression:"driverInfoModel.name"}}),i("van-field",{attrs:{label:"证件号:","input-align":"right",readonly:!0,border:""},model:{value:e.driverInfoModel.driveCode,callback:function(t){e.$set(e.driverInfoModel,"driveCode",t)},expression:"driverInfoModel.driveCode"}}),i("van-field",{attrs:{label:"档案编号:","input-align":"right",readonly:!0,border:""},model:{value:e.driverInfoModel.driveDocNo,callback:function(t){e.$set(e.driverInfoModel,"driveDocNo",t)},expression:"driverInfoModel.driveDocNo"}}),i("van-field",{attrs:{label:"驾驶证背面编号:","input-align":"right",readonly:!0,border:"","label-width":"120px"},model:{value:e.driverInfoModel.licenceCore,callback:function(t){e.$set(e.driverInfoModel,"licenceCore",t)},expression:"driverInfoModel.licenceCore"}}),i("div",{staticClass:"certificates"},[i("div",{staticClass:"certificatesItem"},[i("div",{staticClass:"imgBox"},[i("img",{staticClass:"backgroundImg",attrs:{src:e.driverInfoModel.imageUrl||"static/image/vocational-certification/rx@2x.png",alt:""}})]),i("div",{staticClass:"text"},[i("div",{staticClass:"textBox"},[i("span",[e._v("驾驶证首页")])])])]),i("div",{staticClass:"certificatesItem"},[i("div",{staticClass:"imgBox"},[i("img",{staticClass:"backgroundImg",attrs:{src:e.driverInfoModel.imageUrl2||"static/image/vocational-certification/gh@2x.png",alt:""}})]),i("div",{staticClass:"text"},[i("div",{staticClass:"textBox"},[i("span",[e._v("驾驶证副页")])])])])]),i("div",{staticClass:"certificates"},[i("div",{staticClass:"certificatesItem"},[i("div",{staticClass:"imgBox"},[i("img",{staticClass:"backgroundImg",attrs:{src:e.driverInfoModel.backImageUrl||"static/image/vocational-certification/rx@2x.png",alt:""}})]),i("div",{staticClass:"text"},[i("div",{staticClass:"textBox"},[i("span",[e._v("驾驶证背面图片")])])])])])],1):e._e(),e.vehicleModel?i("van-cell-group",[i("van-field",{attrs:{label:"行驶证认证","input-align":"right",readonly:!0,border:""}}),i("van-field",{attrs:{label:"所有人姓名",placeholder:"请输入所有人姓名",readonly:!0,"input-align":"right"},model:{value:e.vehicleModel.ownerName,callback:function(t){e.$set(e.vehicleModel,"ownerName",t)},expression:"vehicleModel.ownerName"}}),i("van-field",{attrs:{maxlength:"17",label:"车辆识别号",placeholder:"请输入车辆识别号",readonly:!0,"input-align":"right"},model:{value:e.vehicleModel.vin,callback:function(t){e.$set(e.vehicleModel,"vin",t)},expression:"vehicleModel.vin"}}),i("van-field",{attrs:{label:"发动机号",placeholder:"请输入发动机号",readonly:!0,"input-align":"right"},model:{value:e.vehicleModel.engineNum,callback:function(t){e.$set(e.vehicleModel,"engineNum",t)},expression:"vehicleModel.engineNum"}}),i("van-field",{attrs:{label:"车辆类型",placeholder:"请输入车辆类型",readonly:!0,"input-align":"right"},model:{value:e.vehicleModel.vehType,callback:function(t){e.$set(e.vehicleModel,"vehType",t)},expression:"vehicleModel.vehType"}}),i("div",{staticClass:"certificates"},[i("div",{staticClass:"certificatesItem"},[i("div",{staticClass:"imgBox"},[i("img",{staticClass:"backgroundImg",attrs:{src:e.vehicleModel.imageUrl||"static/image/vocational-certification/rx@2x.png",alt:""}})]),i("div",{staticClass:"text"},[i("div",{staticClass:"textBox"},[i("span",[e._v("行驶证首页")])])])])])],1):e._e()],1)],1)},r=[],n=i("889b"),s={name:"group",mixins:[n["a"]],data:function(){return{popupCard:!1,groupObj:{clusterName:"",groupStatus:""},obj:{industryClusterMember:{clusterState:""}},countDown:!0,recordTime:"",currentTime:"",usercertificate:{},driverInfoModel:{},vehicleModel:{}}},mounted:function(){this.obj=this.$route.query,this.obj.status="已关闭",this.obj.industryClusterMember?0==this.obj.industryClusterMember.examineState?this.obj.groupStatus="待审核":1==this.obj.industryClusterMember.examineState?this.obj.groupStatus="已审核":2==this.obj.industryClusterMember.examineState&&(this.obj.groupStatus="已拒绝"):this.obj.groupStatus="未申请",this.getCheckIdentifyAllDetail()},methods:{getCheckIdentifyAllDetail:function(){var e=this;this.$request.post(this.checkIdentifyAllDetail,{}).then((function(t){if(0==t.status){var i=t.data;e.usercertificate=i.usercertificate,e.driverInfoModel=i.driverInfoModel,e.vehicleModel=i.vehicleModel}else e.$Toast(t.info)}))},backEvent:function(){this.$router.go(-1)}}},l=s,o=(i("8c4b"),i("0c7c")),c=Object(o["a"])(l,a,r,!1,null,"18f89909",null);t["default"]=c.exports},"4ec9":function(e,t,i){"use strict";var a=i("6d61"),r=i("6566");e.exports=a("Map",(function(e){return function(){return e(this,arguments.length?arguments[0]:void 0)}}),r)},"889b":function(e,t,i){"use strict";var a=i("b85c"),r=i("3835"),n=i("2909"),s=i("5530"),l=(i("e25e"),i("4ec9"),i("d3b7"),i("3ca3"),i("ddb0"),i("4de4"),i("b64b"),i("b8bf"),i("2f62"));t["a"]={data:function(){return{stepsValue:{IDcard:"身份证",DriverCard:"驾驶证",DrivingCard:"行驶证"},Verification:{name:"姓名",imgFront:"身份证正面",imgBehind:"身份证背面",selfImageUrl:"手持身份证",idcardNum:"身份证号",sex:"性别",imageUrl:"驾驶证首页",imageUrl2:"驾驶证副页",backImageUrl:"驾驶证背面",driveCode:"证号",driveDocNo:"档案编号",licenceCore:"驾驶证背面编号",imageUrl3:"行驶证首页",plateNum:"车牌号",ownerName:"所有人姓名",vin:"车辆识别代号",engineNum:"发动机号",vehType:"车辆类型"},industryClusterUrl:"/app/json/user/industryCluster",checkIdentifyAllDetail:"/app/json/user/checkIdentifyAllDetail",identifySubmmitUrl:"/app/json/user/identifySubmmit",driverInfoSubmmitUrl:"/app/json/user/driverInfoSubmmit",bindVehicleUrl:"/app/json/user/bindVehicle",submmitIndustryUrl:"/app/json/user/submmitIndustry",findIdentifyClusterInfoUrl:"/app/json/user/findIdentifyClusterInfo",openOrCloseIndustryUrl:"/app/json/user/openOrCloseIndustry",checkBindOilCardUrl:"/app/json/user/isOnceBind"}},computed:Object(s["a"])({},Object(l["c"])(["userInfo"])),components:{},created:function(){},methods:{regIdNo:function(e){var t=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;return t.test(e)},plateNumber:function(e){var t=/(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$)/;return t.test(e)},newEnergy:function(e){var t=/(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF][A-HJ-NP-Z0-9][0-9]{4}))$)/;return t.test(e)},chinese:function(e){var t=/^[\u4e00-\u9fa5]+$/;return t.test(e)},englishNumbers:function(e){var t=/^[a-zA-Z0-9]{17}$/;return t.test(e)},numbers:function(e){var t=/^[0-9]{12}$/;return t.test(e)},gender:function(e){return parseInt(e.substr(16,1))%2==1?"男":"女"},mergeObj:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=new Map(Object(n["a"])(this.objToStrMap(t)).filter((function(t){var a=Object(r["a"])(t,2),n=a[0];a[1];return e.objToStrMap(i).has(n)})));return this.strMapToObj(a)},objToStrMap:function(e){for(var t=new Map,i=0,a=Object.keys(e);i<a.length;i++){var r=a[i];t.set(r,e[r])}return t},strMapToObj:function(e){var t,i=Object.create(null),n=Object(a["a"])(e);try{for(n.s();!(t=n.n()).done;){var s=Object(r["a"])(t.value,2),l=s[0],o=s[1];i[l]=o}}catch(c){n.e(c)}finally{n.f()}return i},cardListType:function(e){var t="";switch(e){case 0:t="未通过";break;case 1:t="已认证";break;case 2:t="已关闭";break;case 3:t="已移除";break;case 4:t="已解散";break;case 5:t="待审核";break}return t},imgBg:function(e){var t=e.industryClusterMember?e.industryClusterMember.clusterState:null,i="";return i=1==t?"标签1@2x":5==t?"标签3@2x":"标签2@2x",i}}}},"8c4b":function(e,t,i){"use strict";i("eab3")},b85c:function(e,t,i){"use strict";i.d(t,"a",(function(){return r}));i("a4d3"),i("e01a"),i("d3b7"),i("d28b"),i("3ca3"),i("ddb0"),i("277d");var a=i("06c5");function r(e,t){var i="undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!i){if(Array.isArray(e)||(i=Object(a["a"])(e))||t&&e&&"number"===typeof e.length){i&&(e=i);var r=0,n=function(){};return{s:n,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,l=!0,o=!1;return{s:function(){i=i.call(e)},n:function(){var e=i.next();return l=e.done,e},e:function(e){o=!0,s=e},f:function(){try{l||null==i["return"]||i["return"]()}finally{if(o)throw s}}}}},b8bf:function(e,t,i){var a=i("23e7"),r=i("83ab"),n=i("7c73");a({target:"Object",stat:!0,sham:!r},{create:n})},eab3:function(e,t,i){}}]);
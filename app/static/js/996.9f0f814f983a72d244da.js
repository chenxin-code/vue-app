(window.webpackJsonp=window.webpackJsonp||[]).push([[996],{"4uQB":function(t,i,e){"use strict";var a=e("QNCS");e.n(a).a},I2YW:function(t,i,e){"use strict";e.r(i);var a=e("iJsu"),s=e("mG4U"),n=e("8LpY"),r={name:"stepsContent",mixins:[a.a],props:{activeContent:{type:Object,default:function(){return{}}}},data:function(){return{initData:{title:"请选择地区"},showSelect:!1,isNewEnergy:!0,tips:!1,img:{credImg:"",credName:"",type:null},show:!1,isExamine:!1,parameterUrl:"",takeIndex:0,uploadData:{isShowUpload:!1},identityObj:{imgFront:"",imgBehind:"",name:"",idcardNum:"",sex:""},drive:{imageUrl:"",imageUrl2:"",backImageUrl:"",name:"",driveCode:"",driveDocNo:"",licenceCore:""},travel:{imageUrl2:"",plateNum:"",ownerName:"",vin:"",engineNum:"",vehType:""},qualificationsObj:{},qualifications:{papersName:"",paperImgUrl:"",clusterId:"",clusterCode:"",clusterName:"",areaName:"",areaId:"",ouCode:"",ouName:"",ouNameNew:"",referrer:""},status:{identityObj:!1,drive:!1,travel:!1},popupIDcard:!1,popupDriverCard:!1,popupDrivingCard:!1,activeTypeNew:"",isActiveObjNew:{},activeNew:{}}},mounted:function(){var t=this;this.qualificationsObj=JSON.parse((this.$route.query||{}).expression),this.idNameList=this.activeContent.expression.idNameList,this.idNameList.forEach((function(i){t.$set(i,"newCredImg","")})),this.$request.post(this.checkIdentifyAllDetail,{}).then((function(i){if(0==i.status){var e=i.data;e.usercertificate&&(Object.assign(t.identityObj,t.mergeObj(e.usercertificate,t.identityObj)),t.status.identityObj=!0),e.driverInfoModel&&(Object.assign(t.drive,t.mergeObj(e.driverInfoModel,t.drive)),t.status.drive=!0),e.vehicleModel&&(Object.assign(t.travel,t.mergeObj(e.vehicleModel,t.travel)),t.status.travel=!0),s.a.$emit("isActive",t.status)}else t.$Toast(i.info)}));var i=this.$store.state.mall2.selectAddress.provinceName;i&&(this.initData.initAreas=[i],this.initData.canNotReselect=!1)},methods:{clickRightIcon:function(){var t=this;this.$bridgefunc.scanCode((function(i){t.qualifications.referrer=i.code}))},focus:function(){this.show=!0,document.activeElement.blur()},inputKey:function(t){this.travel.plateNum=this.travel.plateNum+t},deleteKey:function(){this.travel.plateNum=this.travel.plateNum.substr(0,this.travel.plateNum.length-1)},seePictures:function(t,i){this.img={credImg:"",credName:"",type:null},this.tips=!0;var e=JSON.parse(JSON.stringify(t));i||(e.credImg="static/image/vocational-certification/"+e.credImg+".png"),Object.assign(this.img,e)},takePictures:function(t,i,e){var a=this;console.log(t,i,e),this.takeIndex=e,this.parameterUrl=i,n.a.open({linkFunc:function(t,i){i.indexOf(",")&&(i=i.split(",")[1]),a.picturesData(t,i)},type:t,token:this.$store.state.login.token})},picturesData:function(t,i){if("qualifications"!=this.activeContent.activeObj.type)if("backImageUrl"!=this.parameterUrl){var e=0;if("imgFront"==this.parameterUrl?e=0:"imgBehind"==this.parameterUrl?e=1:"imageUrl"==this.parameterUrl?e=2:"imageUrl2"==this.parameterUrl?e=3:"imageUrl3"==this.parameterUrl&&(e=4),2==this.$store.state.globalConfig.certificate_check_type)"backImageUrl"!=this.parameterUrl&&this.ocrCertificate(e,i,this.activeContent.activeObj.type,t);else switch(this.activeContent.activeObj.type){case"IDcard":this.identityObj[this.parameterUrl]=t;break;case"DriverCard":this.drive[this.parameterUrl]=t;break;case"DrivingCard":this.travel[this.parameterUrl]=t}}else this.drive[this.parameterUrl]=t;else this.$set(this.idNameList[this.takeIndex],"newCredImg",t)},ocrCertificate:function(t,i,e,a){var s=this;this.$request.post("/app/json/ocr/ocrCertificate",{ocrType:t,base64Str:i}).then((function(i){var n=i.data;if(0===i.status){switch(e){case"IDcard":s.identityObj[s.parameterUrl]=a;break;case"DriverCard":case"DriverCard":s.drive[s.parameterUrl]=a;break;case"DrivingCard":s.travel[s.parameterUrl]=a}"IDcard"==e?0==t&&(s.identityObj.idcardNum=n.idno,s.identityObj.name=n.name):"DriverCard"==e?2==t?(s.drive.name=n.name,s.drive.driveCode=n.license_no):(s.drive.driveDocNo=n.archive_no,s.drive.licenceCore=n.card_no):"DrivingCard"==e&&4==t&&(s.travel.plateNum=n.plateno,s.travel.ownerName=n.owner,s.travel.vin=n.vin,s.travel.engineNum=n.engine_no,s.travel.vehType=n.vehicle_type)}else s.$toast(i.info||"识别失败！")}))},submmitIndustryFun:function(){this.qualifications.clusterId=this.activeContent.id,this.qualifications.clusterCode=this.activeContent.clusterCode,this.qualifications.clusterName=this.activeContent.clusterName,this.$request.post(this.submmitIndustryUrl,this.qualifications).then((function(t){}))},getIdentityObj:function(t,i){var e=this,a=this.activeContent.steps[this.activeContent.steps.length-2].type;if(this.activeTypeNew=a,this.isActiveObjNew=t,this.activeNew=i,"IDcard"==this.activeContent.activeObj.type)if(this.status.identityObj)"IDcard"==a&&this.routerPush(),s.a.$emit("isActive",t,"true",i);else{for(var n in this.identityObj){if("idcardNum"==n){if(!this.identityObj[n])return this.$Toast(this.Verification[n]+"不能为空");if(!this.regIdNo(this.identityObj[n]))return this.$Toast("请输入正确的"+this.Verification[n]);this.identityObj.sex=this.gender(this.identityObj.idcardNum)}if("1"==this.$store.state.globalConfig.certificate_check_selfie&&!this.identityObj[n])return this.$Toast(this.Verification[n]+"不能为空");if("idcardNum"!=n&&"sex"!=n&&!this.identityObj[n])return this.$Toast(this.Verification[n]+"不能为空")}this.popupIDcard=!0}else if("DriverCard"==this.activeContent.activeObj.type)if(this.status.drive)s.a.$emit("isActive",t,"true",i),"DriverCard"==a&&this.routerPush();else{for(var r in this.drive){if("driveDocNo"==r){if(!this.drive[r])return this.$Toast(this.Verification[r]+"不能为空");if(!this.numbers(this.drive[r]))return this.$Toast(this.Verification[r]+"仅支持12位数字")}if("driveDocNo"!=r&&"licenceCore"!=r&&!this.drive[r])return this.$Toast(this.Verification[r]+"不能为空")}this.popupDriverCard=!0}else if("DrivingCard"==this.activeContent.activeObj.type)if(this.status.travel)s.a.$emit("isActive",t,"true",i),"DrivingCard"==a&&this.routerPush();else{for(var c in this.travel){if("plateNum"==c){if(!this.travel[c])return this.$Toast(this.Verification[c]+"不能为空");if(this.isNewEnergy){if(!this.plateNumber(this.travel[c]))return this.$Toast("请输入正确的"+this.Verification[c])}else if(!this.newEnergy(this.travel[c]))return this.$Toast("请输入正确的新能源"+this.Verification[c])}if("vehType"==c){if(!this.travel[c])return this.$Toast(this.Verification[c]+"不能为空");if(!this.chinese(this.travel[c]))return this.$Toast(this.Verification[c]+"只能输入中文")}if("vin"==c){if(!this.travel[c])return this.$Toast(this.Verification[c]+"不能为空");if(!this.englishNumbers(this.travel[c]))return this.$Toast(this.Verification[c]+"仅支持17位的数字和字母")}if("idcardNum"!=c&&"vehType"!=c&&"vin"!=c&&!this.travel[c])return this.$Toast(this.Verification[c]+"不能为空")}this.travel.imageUrl=this.travel.imageUrl2,this.popupDrivingCard=!0}else if("qualifications"==this.activeContent.activeObj.type){var o=!0;if(!this.qualifications.ouCode)return o=!1,this.$Toast("地市不能为空");var l=[],u=[],v=!0;this.idNameList.forEach((function(t){if(!t.newCredImg)return v=!1,e.$Toast("证件图不能为空");l.push(t.credName),u.push(t.newCredImg)})),o&&v&&(this.qualifications.ouName=this.qualifications.ouName,this.qualifications.ouCode=this.qualifications.ouCode,this.qualifications.referrer=this.qualifications.referrer,this.qualifications.papersName=l.join(","),this.qualifications.paperImgUrl=u.join(","),this.qualifications.clusterId=this.activeContent.id,this.qualifications.clusterCode=this.activeContent.clusterCode,this.qualifications.clusterName=this.activeContent.clusterName,this.$request.post(this.submmitIndustryUrl,this.qualifications).then((function(a){0===a.status?(e.$Toast("提交成功"),s.a.$emit("isActive",t,"true",i),e.routerPush()):e.$Toast(a.info)})))}},routerPush:function(){var t=this;this.isExamine=!0,setTimeout((function(i){t.$route.query.feedback?t.$router.go(-2):t.$router.go(-1)}),2e3)},onCancel:function(){this.uploadData.isShowUpload=!1},clickField:function(){this.$refs.address.initAddress()},selectedItemsEvent:function(t){var i=t.item;this.qualifications.areaName=i.name,this.qualifications.areaId=i.id,3==i.level&&(this.showSelect=!1),i.level<=2&&this._getRegionData(i.id)},setAddressEvent:function(t){this.qualifications.ouName=t.ouName,this.qualifications.ouNameNew=t.ouNameNew,this.qualifications.ouCode=t.ouCode},regionCloseEvent:function(){this.showSelect=!1},popupIDcardBtn:function(){var t=this;this.popupIDcard=!1,this.$request.post(this.identifySubmmitUrl,this.identityObj).then((function(i){0===i.status?(t.qualificationsObj.idNameList.length||(t.qualificationsObj.cardList.includes("DriverCard")&&t.qualificationsObj.cardList.includes("DrivingCard")?t.status.drive&&t.status.travel&&t.submmitIndustryFun():(t.qualificationsObj.cardList.includes("DriverCard")&&t.status.drive&&t.submmitIndustryFun(),t.qualificationsObj.cardList.includes("DrivingCard")&&t.status.travel&&t.submmitIndustryFun())),t.$Toast("提交成功"),s.a.$emit("isActive",t.isActiveObjNew,"true",t.activeNew),"IDcard"==t.activeTypeNew&&t.routerPush()):t.$Toast(i.info)}))},popupDriverCardBtn:function(){var t=this;this.popupDriverCard=!1,this.$request.post(this.driverInfoSubmmitUrl,this.drive).then((function(i){0===i.status?"身份信息不一致"==i.data.failMsg?t.$Toast("身份信息不一致"):(t.qualificationsObj.idNameList.length||(t.qualificationsObj.cardList.includes("DrivingCard")?t.status.travel&&t.submmitIndustryFun():t.submmitIndustryFun()),t.$Toast("提交成功"),s.a.$emit("isActive",t.isActiveObjNew,"true",t.activeNew),"DriverCard"==t.activeTypeNew&&t.routerPush()):t.$Toast(i.info)}))},popupDrivingCardBtn:function(){var t=this;this.popupDrivingCard=!1,this.$request.post(this.bindVehicleUrl,this.travel).then((function(i){0===i.status?(t.qualificationsObj.idNameList.length||t.submmitIndustryFun(),t.$Toast("提交成功"),s.a.$emit("isActive",t.isActiveObjNew,"true",t.activeNew),"DrivingCard"==t.activeTypeNew&&t.routerPush()):t.$Toast(i.info)}))},_getRegionData:function(t){var i=this;this.$Loading.open();var e={token:this.$store.state.login.token,parentId:t};this.$http.post("/app/json/area/loadAreaList",e).then((function(t){i.$Loading.close();var e=t.data;if(0==e.status){var a=e.data;a.length>0?i.$nextTick((function(){this.$refs.regionselect.pushCustomOptions(a)})):(i.showSelect=!1,i.getRegionText())}else i.$Toast(e.info)}),(function(t){i.$Loading.close(),console.log("获取失败",t),i.$Toast("获取数据失败")}))},getRegionText:function(){this.$refs.regionselect.reset(null)}},components:{photograph:function(){return e.e(994).then(e.bind(null,"gWuE"))},VirtualKeyboard:function(){return e.e(56).then(e.bind(null,"KZmt"))},orgTree:function(){return e.e(28).then(e.bind(null,"1mf/"))},RegionSelect:function(){return e.e(61).then(e.bind(null,"hDEW"))}}},c=(e("4uQB"),e("KHd+")),o=Object(c.a)(r,(function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"stepsContent"},["IDcard"==t.activeContent.activeObj.type?e("div",[e("div",{staticClass:"certificatesBox"},[e("div",{staticClass:"certificates"},[e("div",{staticClass:"certificatesItem"},[e("div",{staticClass:"imgBox",on:{click:function(i){return t.takePictures(3,"imgFront")}}},[e("img",{staticClass:"backgroundImg",attrs:{src:t.identityObj.imgFront||"static/image/vocational-certification/rx@2x.png",alt:""}}),t._v(" "),e("img",{staticClass:"tipsImg",attrs:{src:"static/image/vocational-certification/icon1@2x.png",alt:""}})]),t._v(" "),e("div",{staticClass:"text"},[e("div",{staticClass:"textBox",on:{click:function(i){return t.seePictures({credName:"身份证正面",credImg:"picture2@2x"})}}},[e("span",[t._v("身份证正面")]),t._v(" \n              "),e("van-icon",{staticClass:"question-o",attrs:{name:"question-o"}})],1)])]),t._v(" "),e("div",{staticClass:"certificatesItem"},[e("div",{staticClass:"imgBox",on:{click:function(i){return t.takePictures(3,"imgBehind")}}},[e("img",{staticClass:"backgroundImg",attrs:{src:t.identityObj.imgBehind||"static/image/vocational-certification/gh@2x.png",alt:""}}),t._v(" "),e("img",{staticClass:"tipsImg",attrs:{src:"static/image/vocational-certification/icon1@2x.png",alt:""}})]),t._v(" "),e("div",{staticClass:"text"},[e("div",{staticClass:"textBox",on:{click:function(i){return t.seePictures({credName:"身份证背面",credImg:"ID@2x"})}}},[e("span",[t._v("身份证背面")]),t._v(" \n              "),e("van-icon",{staticClass:"question-o",attrs:{name:"question-o"}})],1)])])])]),t._v(" "),e("van-cell-group",[e("van-field",{attrs:{disabled:t.status.identityObj,label:"姓名",placeholder:"请输入姓名",required:"","input-align":"right"},model:{value:t.identityObj.name,callback:function(i){t.$set(t.identityObj,"name",i)},expression:"identityObj.name"}}),t._v(" "),e("van-field",{attrs:{disabled:t.status.identityObj,label:"证件号",placeholder:"请输入18位身份证号",required:"","input-align":"right"},model:{value:t.identityObj.idcardNum,callback:function(i){t.$set(t.identityObj,"idcardNum",i)},expression:"identityObj.idcardNum"}})],1)],1):t._e(),t._v(" "),"DriverCard"==t.activeContent.activeObj.type?e("div",[e("div",{staticClass:"certificatesBox"},[e("div",{staticClass:"certificates"},[e("div",{staticClass:"certificatesItem"},[e("div",{staticClass:"imgBox",on:{click:function(i){return t.takePictures(3,"imageUrl")}}},[e("img",{staticClass:"backgroundImg",attrs:{src:t.drive.imageUrl||"static/image/vocational-certification/rx@2x.png",alt:""}}),t._v(" "),e("img",{staticClass:"tipsImg",attrs:{src:"static/image/vocational-certification/icon1@2x.png",alt:""}})]),t._v(" "),e("div",{staticClass:"text"},[e("div",{staticClass:"textBox",on:{click:function(i){return t.seePictures({credName:"驾驶证首页",credImg:"驾驶证正"})}}},[e("span",[t._v("驾驶证首页")]),t._v(" \n              "),e("van-icon",{staticClass:"question-o",attrs:{name:"question-o"}})],1)])]),t._v(" "),e("div",{staticClass:"certificatesItem"},[e("div",{staticClass:"imgBox",on:{click:function(i){return t.takePictures(3,"imageUrl2")}}},[e("img",{staticClass:"backgroundImg",attrs:{src:t.drive.imageUrl2||"static/image/vocational-certification/gh@2x.png",alt:""}}),t._v(" "),e("img",{staticClass:"tipsImg",attrs:{src:"static/image/vocational-certification/icon1@2x.png",alt:""}})]),t._v(" "),e("div",{staticClass:"text"},[e("div",{staticClass:"textBox",on:{click:function(i){return t.seePictures({credName:"驾驶证副页",credImg:"驾驶证反"})}}},[e("span",[t._v("驾驶证副页")]),t._v(" \n              "),e("van-icon",{staticClass:"question-o",attrs:{name:"question-o"}})],1)])])]),t._v(" "),e("div",{staticClass:"certificates"},[e("div",{staticClass:"certificatesItem"},[e("div",{staticClass:"imgBox",on:{click:function(i){return t.takePictures("3","backImageUrl","isCheck")}}},[e("img",{staticClass:"backgroundImg",attrs:{src:t.drive.backImageUrl||"static/image/vocational-certification/gh@2x.png",alt:""}}),t._v(" "),e("img",{staticClass:"tipsImg",attrs:{src:"static/image/vocational-certification/icon1@2x.png",alt:""}})]),t._v(" "),e("div",{staticClass:"text"},[e("div",{staticClass:"textBox",on:{click:function(i){return t.seePictures({credName:"驾驶证背面图片",credImg:"驾驶证背面"})}}},[e("span",[t._v("驾驶证背面图片")]),t._v(" \n              "),e("van-icon",{staticClass:"question-o",attrs:{name:"question-o"}})],1)])])])]),t._v(" "),e("van-cell-group",[e("van-field",{attrs:{disabled:t.status.drive,label:"姓名","label-width":"100",placeholder:"请输入姓名",clearable:"",required:"","right-icon":"question-o","input-align":"right"},on:{"click-right-icon":function(i){return t.seePictures({credName:"姓名",credImg:"name@2x"})}},model:{value:t.drive.name,callback:function(i){t.$set(t.drive,"name",i)},expression:"drive.name"}}),t._v(" "),e("van-field",{attrs:{disabled:t.status.drive,label:"证号","label-width":"100",placeholder:"请输入证号",clearable:"",required:"","right-icon":"question-o","input-align":"right"},on:{"click-right-icon":function(i){return t.seePictures({credName:"证号",credImg:"number@2x"})}},model:{value:t.drive.driveCode,callback:function(i){t.$set(t.drive,"driveCode",i)},expression:"drive.driveCode"}}),t._v(" "),e("van-field",{attrs:{disabled:t.status.drive,maxlength:"12",label:"档案编号","label-width":"100",placeholder:"请输入档案编号",clearable:"",required:"","right-icon":"question-o","input-align":"right"},on:{"click-right-icon":function(i){return t.seePictures({credName:"档案编号",credImg:"archives@2x"})}},model:{value:t.drive.driveDocNo,callback:function(i){t.$set(t.drive,"driveDocNo",i)},expression:"drive.driveDocNo"}}),t._v(" "),e("van-field",{attrs:{disabled:t.status.drive,label:"驾驶证背面编号","label-width":"140",placeholder:"请输入驾驶证背面编号",clearable:"","right-icon":"question-o","input-align":"right"},on:{"click-right-icon":function(i){return t.seePictures({credName:"驾驶证背面编号",credImg:"chip@2x"})}},model:{value:t.drive.licenceCore,callback:function(i){t.$set(t.drive,"licenceCore",i)},expression:"drive.licenceCore"}})],1)],1):t._e(),t._v(" "),"DrivingCard"==t.activeContent.activeObj.type?e("div",[e("div",{staticClass:"certificatesBox"},[e("div",{staticClass:"certificates"},[e("div",{staticClass:"certificatesItem"},[e("div",{staticClass:"imgBox",on:{click:function(i){return t.takePictures(3,"imageUrl3")}}},[e("img",{staticClass:"backgroundImg",attrs:{src:t.travel.imageUrl2||"static/image/vocational-certification/rx@2x.png",alt:""}}),t._v(" "),e("img",{staticClass:"tipsImg",attrs:{src:"static/image/vocational-certification/icon1@2x.png",alt:""}})]),t._v(" "),e("div",{staticClass:"text"},[e("div",{staticClass:"textBox",on:{click:function(i){return t.seePictures({credName:"行驶证首页",credImg:"行驶证"})}}},[e("span",[t._v("行驶证首页")]),t._v(" \n              "),e("van-icon",{staticClass:"question-o",attrs:{name:"question-o"}})],1)])])])]),t._v(" "),e("van-cell-group",[e("div",{staticClass:"plateNum"},[e("div",{staticClass:"plateNumImg"},[t.isNewEnergy?e("img",{staticClass:"img",attrs:{src:"static/image/vocational-certification/button2@2x.png",alt:""},on:{click:function(i){i.stopPropagation(),t.isNewEnergy=!1}}}):e("img",{staticClass:"img",attrs:{src:"static/image/vocational-certification/button1@2x.png",alt:""},on:{click:function(i){i.stopPropagation(),t.isNewEnergy=!0}}})]),t._v(" "),e("van-field",{attrs:{disabled:t.status.travel,maxlength:"8",label:"车牌号",placeholder:t.isNewEnergy?"请输入车牌号":"新能源车牌号",clearable:"",required:"","right-icon":"question-o","input-align":"right"},on:{focus:t.focus,"click-right-icon":function(i){return t.seePictures({credName:"车牌号",credImg:"platenumber@2x"})}},model:{value:t.travel.plateNum,callback:function(i){t.$set(t.travel,"plateNum",i)},expression:"travel.plateNum"}})],1),t._v(" "),e("van-field",{attrs:{disabled:t.status.travel,label:"所有人姓名",placeholder:"请输入所有人姓名",clearable:"",required:"","right-icon":"question-o","input-align":"right"},on:{"click-right-icon":function(i){return t.seePictures({credName:"所有人姓名",credImg:"name2@2x"})}},model:{value:t.travel.ownerName,callback:function(i){t.$set(t.travel,"ownerName",i)},expression:"travel.ownerName"}}),t._v(" "),e("van-field",{attrs:{disabled:t.status.travel,maxlength:"17",label:"车辆识别号",placeholder:"请输入车辆识别号",clearable:"",required:"","right-icon":"question-o","input-align":"right"},on:{"click-right-icon":function(i){return t.seePictures({credName:"车辆识别号",credImg:"VIN@2x"})}},model:{value:t.travel.vin,callback:function(i){t.$set(t.travel,"vin",i)},expression:"travel.vin"}}),t._v(" "),e("van-field",{attrs:{disabled:t.status.travel,label:"发动机号",placeholder:"请输入发动机号",clearable:"",required:"","right-icon":"question-o","input-align":"right"},on:{"click-right-icon":function(i){return t.seePictures({credName:"发动机号",credImg:"Enginenumber@2x"})}},model:{value:t.travel.engineNum,callback:function(i){t.$set(t.travel,"engineNum",i)},expression:"travel.engineNum"}}),t._v(" "),e("van-field",{attrs:{disabled:t.status.travel,label:"车辆类型",placeholder:"请输入车辆类型",clearable:"",required:"","right-icon":"question-o","input-align":"right"},on:{"click-right-icon":function(i){return t.seePictures({credName:"车辆类型",credImg:"type@2x"})}},model:{value:t.travel.vehType,callback:function(i){t.$set(t.travel,"vehType",i)},expression:"travel.vehType"}})],1)],1):t._e(),t._v(" "),"qualifications"==t.activeContent.activeObj.type?e("div",t._l(t.idNameList,(function(i,a){return e("div",{key:a},[e("van-cell-group",[e("div",{on:{click:t.clickField}},[e("van-field",{attrs:{label:"选择地市:","input-align":"right",placeholder:"请选择地市",readonly:!0},model:{value:t.qualifications.ouNameNew,callback:function(i){t.$set(t.qualifications,"ouNameNew",i)},expression:"qualifications.ouNameNew"}})],1),t._v(" "),e("van-field",{attrs:{label:"推荐人(选填):","input-align":"right",placeholder:"请填写推荐人手机号","right-icon":"scan"},on:{"click-right-icon":t.clickRightIcon},model:{value:t.qualifications.referrer,callback:function(i){t.$set(t.qualifications,"referrer",i)},expression:"qualifications.referrer"}}),t._v(" "),e("van-field",{attrs:{label:"证件名称:","input-align":"right",readonly:!0},model:{value:i.credName,callback:function(e){t.$set(i,"credName",e)},expression:"item.credName"}})],1),t._v(" "),e("div",{staticClass:"certificatesBox"},[e("div",{staticClass:"certificates"},[e("div",{staticClass:"certificatesItem"},[e("div",{staticClass:"imgBox",on:{click:function(i){return t.takePictures("","",a)}}},[e("img",{staticClass:"backgroundImg",attrs:{src:i.newCredImg||"static/image/vocational-certification/rx@2x.png",alt:""}}),t._v(" "),e("img",{staticClass:"tipsImg",attrs:{src:"static/image/vocational-certification/icon1@2x.png",alt:""}})]),t._v(" "),e("div",{staticClass:"text"},[e("div",{staticClass:"textBox",on:{click:function(e){return t.seePictures(i,!0)}}},[e("span",[t._v("查看示意图")]),t._v(" \n                "),e("van-icon",{staticClass:"question-o",attrs:{name:"question-o"}})],1)])])])])],1)})),0):t._e(),t._v(" "),"examine"==t.activeContent.activeObj.type?e("div",[t._l(t.idNameList,(function(i,a){return e("div",{key:a},[e("van-cell-group",[e("van-field",{attrs:{label:"选择地市:","input-align":"right",placeholder:"请选择地市",readonly:!0},model:{value:t.activeContent.ouNameNew,callback:function(i){t.$set(t.activeContent,"ouNameNew",i)},expression:"activeContent.ouNameNew"}}),t._v(" "),e("van-field",{attrs:{label:"推荐人:","input-align":"right",placeholder:"请填写推荐人手机号",readonly:!0},model:{value:t.activeContent.referrer,callback:function(i){t.$set(t.activeContent,"referrer",i)},expression:"activeContent.referrer"}}),t._v(" "),e("van-field",{attrs:{label:"证件名称:","input-align":"right",readonly:!0},model:{value:i.credName,callback:function(e){t.$set(i,"credName",e)},expression:"item.credName"}})],1),t._v(" "),e("div",{staticClass:"certificatesBox"},[e("div",{staticClass:"certificates"},[e("div",{staticClass:"certificatesItem"},[e("div",{staticClass:"imgBox"},[e("img",{staticClass:"backgroundImg",attrs:{src:i.credImg,alt:""}})]),t._v(" "),t._m(0,!0)])])])],1)})),t._v(" "),e("div",{staticClass:"popup"},[e("van-popup",{staticClass:"popupCard",attrs:{"close-on-click-overlay":!1},model:{value:t.isExamine,callback:function(i){t.isExamine=i},expression:"isExamine"}},[e("div",{staticClass:"popupCardText"},[e("p",[t._v("提交成功！")]),t._v(" "),e("span",[t._v("正在进行系统审核...")])])])],1)],2):t._e(),t._v(" "),e("photograph",{ref:"photograph",attrs:{uploadData:t.uploadData},on:{picturesData:t.picturesData,onCancel:t.onCancel}}),t._v(" "),e("virtual-keyboard",{attrs:{show:t.show},on:{input:t.inputKey,delete:t.deleteKey,blur:function(i){t.show=!1}}}),t._v(" "),e("van-popup",{staticClass:"tips",class:t.img.type?"tipsA":"tipsB",attrs:{position:"bottom","close-on-click-overlay":!1},model:{value:t.tips,callback:function(i){t.tips=i},expression:"tips"}},[e("div",{staticClass:"tipsIcon"},[e("van-icon",{staticClass:"icon",attrs:{name:"cross"},on:{click:function(i){t.tips=!1}}})],1),t._v(" "),e("div",{staticClass:"tipsContent"},[t.img.type?e("div",{staticClass:"topTipsContent"},[e("div",{staticClass:"topImg"},[e("img",{attrs:{src:"static/image/vocational-certification/standard@2x.png",alt:""}}),t._v(" "),e("p",[t._v("标准")])]),t._v(" "),e("div",{staticClass:"topImg"},[e("img",{attrs:{src:"static/image/vocational-certification/angle@2x.png",alt:""}}),t._v(" "),e("p",[t._v("倾斜")])]),t._v(" "),e("div",{staticClass:"topImg"},[e("img",{attrs:{src:"static/image/vocational-certification/vague@2x.png",alt:""}}),t._v(" "),e("p",[t._v("模糊")])])]):t._e(),t._v(" "),t.img.type?e("div",{staticClass:"topText"},[e("p",[t._v("身份证拍照正确样式")])]):t._e(),t._v(" "),e("img",{style:{width:t.img.type?"140px":""},attrs:{src:t.img.credImg,alt:""}}),t._v(" "),e("span",[t._v(t._s(t.img.credName))])])]),t._v(" "),e("org-tree",{ref:"address",on:{setAddressEvent:t.setAddressEvent}}),t._v(" "),e("div",{staticClass:"popup"},[e("van-popup",{staticClass:"examine",attrs:{"close-on-click-overlay":!1},model:{value:t.popupIDcard,callback:function(i){t.popupIDcard=i},expression:"popupIDcard"}},[e("div",{staticClass:"popupContent"},[e("van-cell-group",[e("van-field",{attrs:{label:"信息确认","input-align":"right",readonly:!0}}),t._v(" "),e("van-field",{attrs:{label:"姓名:","input-align":"right",readonly:!0},model:{value:t.identityObj.name,callback:function(i){t.$set(t.identityObj,"name",i)},expression:"identityObj.name"}}),t._v(" "),e("van-field",{attrs:{label:"证件号:","input-align":"right",readonly:!0},model:{value:t.identityObj.idcardNum,callback:function(i){t.$set(t.identityObj,"idcardNum",i)},expression:"identityObj.idcardNum"}})],1),t._v(" "),e("span",{staticClass:"contentText"},[t._v("请再次确认提交的信息内容，一经提交审批，将不予进行修改")])],1),t._v(" "),e("div",{staticClass:"popupCardBtn"},[e("span",{on:{click:function(i){t.popupIDcard=!1}}},[t._v("修改")]),t._v(" "),e("span",{on:{click:t.popupIDcardBtn}},[t._v("确定")])])]),t._v(" "),e("van-popup",{staticClass:"examine",attrs:{"close-on-click-overlay":!1},model:{value:t.popupDriverCard,callback:function(i){t.popupDriverCard=i},expression:"popupDriverCard"}},[e("div",{staticClass:"popupContent"},[e("van-cell-group",[e("van-field",{attrs:{label:"信息确认","input-align":"right",readonly:!0}}),t._v(" "),e("van-field",{attrs:{label:"姓名:","input-align":"right",readonly:!0},model:{value:t.drive.name,callback:function(i){t.$set(t.drive,"name",i)},expression:"drive.name"}}),t._v(" "),e("van-field",{attrs:{label:"证件号:","input-align":"right",readonly:!0},model:{value:t.drive.driveCode,callback:function(i){t.$set(t.drive,"driveCode",i)},expression:"drive.driveCode"}}),t._v(" "),e("van-field",{attrs:{label:"档案编号:","input-align":"right",readonly:!0},model:{value:t.drive.driveDocNo,callback:function(i){t.$set(t.drive,"driveDocNo",i)},expression:"drive.driveDocNo"}}),t._v(" "),e("van-field",{attrs:{label:"芯片编码:","input-align":"right",readonly:!0},model:{value:t.drive.licenceCore,callback:function(i){t.$set(t.drive,"licenceCore",i)},expression:"drive.licenceCore"}})],1),t._v(" "),e("span",{staticClass:"contentText"},[t._v("请再次确认提交的信息内容，一经提交审批，将不予进行修改")])],1),t._v(" "),e("div",{staticClass:"popupCardBtn"},[e("span",{on:{click:function(i){t.popupDriverCard=!1}}},[t._v("修改")]),t._v(" "),e("span",{on:{click:t.popupDriverCardBtn}},[t._v("确定")])])]),t._v(" "),e("van-popup",{staticClass:"examine",attrs:{"close-on-click-overlay":!1},model:{value:t.popupDrivingCard,callback:function(i){t.popupDrivingCard=i},expression:"popupDrivingCard"}},[e("div",{staticClass:"popupContent"},[e("van-cell-group",[e("van-field",{attrs:{label:"信息确认","input-align":"right",readonly:!0}}),t._v(" "),e("van-field",{attrs:{label:"所有人姓名:","input-align":"right",readonly:!0},model:{value:t.travel.ownerName,callback:function(i){t.$set(t.travel,"ownerName",i)},expression:"travel.ownerName"}}),t._v(" "),e("van-field",{attrs:{label:"车辆识别号:","input-align":"right",readonly:!0},model:{value:t.travel.vin,callback:function(i){t.$set(t.travel,"vin",i)},expression:"travel.vin"}}),t._v(" "),e("van-field",{attrs:{label:"发动机号:","input-align":"right",readonly:!0},model:{value:t.travel.engineNum,callback:function(i){t.$set(t.travel,"engineNum",i)},expression:"travel.engineNum"}}),t._v(" "),e("van-field",{attrs:{label:"车辆类型:","input-align":"right",readonly:!0},model:{value:t.travel.vehType,callback:function(i){t.$set(t.travel,"vehType",i)},expression:"travel.vehType"}})],1),t._v(" "),e("span",{staticClass:"contentText"},[t._v("请再次确认提交的信息内容，一经提交审批，将不予进行修改")])],1),t._v(" "),e("div",{staticClass:"popupCardBtn"},[e("span",{on:{click:function(i){t.popupDrivingCard=!1}}},[t._v("修改")]),t._v(" "),e("span",{on:{click:t.popupDrivingCardBtn}},[t._v("确定")])])])],1)],1)}),[function(){var t=this.$createElement,i=this._self._c||t;return i("div",{staticClass:"text"},[i("p",[this._v("查看示意图")])])}],!1,null,"5305ca96",null);i.default=o.exports},QNCS:function(t,i,e){}}]);
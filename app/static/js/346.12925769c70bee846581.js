(window.webpackJsonp=window.webpackJsonp||[]).push([[346],{Q4si:function(t,e,i){},Ulpt:function(t,e,i){"use strict";var s=i("Vdbu");i.n(s).a},Vdbu:function(t,e,i){},W9FF:function(t,e,i){"use strict";var s=i("Q4si");i.n(s).a},nNEF:function(t,e,i){"use strict";i.r(e),i("4X9F");var s=i("IkEG"),n=(i("dqDD"),i("p46w")),a=i.n(n),o={name:"aqgl",components:{gcanvas:i("wbJX").a},data:function(){return{showGesture:!1,gestureType:0,aqglList:[{name:"我的资料",id:"14",type:1},{name:"我的积分",id:"10",type:1},{name:"加油卡绑定",id:"11",type:1},{name:"微信绑定",id:"5",type:1,isHide:"1"!=this.$store.state.globalConfig.isShowWXLoginBtn},{name:"支付宝绑定",id:"15",type:1},{name:"指纹密码",id:"2",type:0,value:this.$store.state.login.touchID,isHide:"1"==this.$store.state.globalConfig.isHideFingerprintBtn,hideKey:"isHideFingerprintBtn"},{name:"人脸识别",id:"3",type:0,value:this.$store.state.login.faceID,isHide:!0},{name:"设置登录密码",id:"1",type:1},{name:"油滴支付密码",id:"13",type:1},{name:"手势密码",id:"6",type:0,value:this.$store.state.login.gestureID,isHide:"1"==this.$store.state.globalConfig.isHideGestureBtn,hideKey:"isHideGestureBtn"},{name:"手势设置",id:"4",type:1},{name:"自动加入自提点",id:"7",type:0,value:1==this.$store.state.addPickupAddressType}],oilVarietyList:[{text:"汽油"},{text:"柴油"}],activeIndex:0,actionInfo:{},appwxurl:""}},methods:{getOilChoice:function(){var t=this;this.$Loading.open(),this.$http.post("/app/json/user/userOilChoice",{}).then((function(e){t.$Loading.close();var i=e.data;0==i.status?1==i.data.type?t.activeIndex=0:t.activeIndex=1:t.$Toast(i.info)})).catch((function(e){t.$Loading.close(),t.$Toast("userOilChoice err "+e)}))},changeOilVariety:function(t){var e=this;this.$Loading.open(),this.$http.post("/app/json/user/updateUserOilChoice",{type:0===t?1:2}).then((function(i){e.$Loading.close();var s=i.data;0==s.status?(e.$Toast("选择成功！"),e.activeIndex=t):e.$Toast(s.info)})).catch((function(t){e.$Loading.close(),e.$Toast("userOilChoice err "+t)}))},getIndexArr:function(t){for(var e=[],i=0;i<t.length;i++){var s=t[i].index;e.push(s)}return e},isEqual:function(t){for(var e="",i="",s=0;s<this.$store.state.login.gestureNumbers.length;s++)e+=this.$store.state.login.gestureNumbers[s];for(s=0;s<t.length;s++)i+=t[s];return e===i},getGesture:function(t){if(this.isEqual(this.getIndexArr(t))){if(this.$refs.gcanvas.reset(),6==this.gestureType)return this.$store.state.login.gestureID=!1,this.$store.state.login.gestureNumbers=void 0,this.$store.state.login.gesturePwd="",this.$bridgefunc.vuexStorage(),this.$Toast("手势关闭成功"),void(this.showGesture=!1);if(4==this.gestureType)return this.showGesture=!1,void this.$router.push({path:"/usercenter/setgesture"})}else this.$Toast("手势错误"),this.$refs.gcanvas.reset()},getCellIsShow:function(t){return 4!=t.id||this.$store.state.login.gestureID},getSupportTypes:function(){var t=this;this.$bridgefunc.getSupportType((function(e){"1"==e.touchID&&(t.setShowWithID(2),console.log(123)),"1"==e.faceID&&t.setShowWithID(3)}))},setShowWithID:function(t){for(var e=0;e<this.aqglList.length;e++){var i=this.aqglList[e];i.id==t&&(i.isHide=!1)}},backEvent:function(){this.$router.go(-1)},changeSwitch:function(t,e){var i=this;2==t.id?this.$bridgefunc.fingerPrintRe((function(t){if("1"==t)i.$store.state.login.touchID?(i.$store.state.login.touchID=!1,i.$bridgefunc.vuexStorage(),i.$Toast("指纹登录关闭成功")):i.openSpecialPwd(4);else{var s=i.aqglList[e];s.value=!s.value,i.$Toast("指纹识别失败")}})):3==t.id?this.$bridgefunc.faceIDRe((function(t){if("1"==t)i.$store.state.login.faceID?(i.$store.state.login.faceID=!1,i.$bridgefunc.vuexStorage(),i.$Toast("面部登录关闭成功")):i.openSpecialPwd(3);else{var s=i.aqglList[e];s.value=!s.value,i.$Toast("识别失败")}})):6==t.id?(this.$store.state.login.gestureID?(this.gestureType=6,this.showGesture=!0):(this.$store.state.login.gestureID=!0,this.$Toast("手势打开成功")),this.$bridgefunc.vuexStorage()):7==t.id&&(1==this.$store.state.addPickupAddressType?this.$store.state.addPickupAddressType=2:this.$store.state.addPickupAddressType=1,this.$bridgefunc.vuexStorage())},openSpecialPwd:function(t){var e,i=this;return(e=regeneratorRuntime.mark((function e(){var s,n,a,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.$bridgefunc.getArgsWithPromise();case 2:s=e.sent,i.$Loading.open("请求中"),"/app/json/user/openSpecialPwd",n=i.$store.state.login.token,a=(new Date).valueOf(),o={token:n,userPwdMode:t,pwdCode:a,deviceId:s.deviceId,deviceName:s.deviceName,deviceModel:s.model,authType:"1"},i.$http.post("/app/json/user/openSpecialPwd",o).then((function(e){i.$Loading.close();var s=e.data;0==s.status?(3==t?(i.$store.state.login.faceID=!0,i.$store.state.login.facePwd=s.data):4==t&&(i.$store.state.login.touchID=!0,i.$store.state.login.touchPwd=s.data),i.$bridgefunc.vuexStorage(),i.$Toast({message:s.info?s.info:"打开成功！",position:"bottom",duration:2e3})):i.$Toast({message:s.info?s.info:"打开失败！",position:"bottom",duration:2e3})}),(function(t){i.$Loading.close(),i.$Toast({message:"打开失败！",position:"bottom",duration:2e3})}));case 9:case"end":return e.stop()}}),e,i)})),function(){var t=e.apply(this,arguments);return new Promise((function(e,i){return function s(n,a){try{var o=t[n](a),r=o.value}catch(t){return void i(t)}if(!o.done)return Promise.resolve(r).then((function(t){s("next",t)}),(function(t){s("throw",t)}));e(r)}("next")}))})()},jumpUrl:function(t){var e=this;if("0"==t.id)this.$MessageBox.confirm("修改手机号会将系统中绑定的加油卡</br>和微信自动解绑，是否继续？","提示",{confirmButtonText:"确定"}).then((function(t){e.$router.push({path:"/usercenter/choseway"})})).catch((function(t){}));else if("1"==t.id)this.$router.push({path:"/usercenter/setpassword"});else if("4"==t.id){if(!this.$store.state.login.gestureNumbers||0==this.$store.state.login.gestureNumbers.length)return void this.$router.push({path:"/usercenter/setgesture"});this.gestureType=4,this.showGesture=!0}else if("5"==t.id)this.$router.push({path:"/usercenter/bindwechat"});else if("8"==t.id)this.$router.push({path:"/usercenter/bindalipay"});else if("9"==t.id)this.$router.push({path:"/usercenter/canceluser"});else if("14"==t.id){var i=window.location.origin+"/app-vue/oildrop/openinginstructions";this.$market.enterNav({link:{type:"3",url:i,useOldProtocal:!0}})}else if("10"==t.id)if(2==this.actionInfo.state)s.a.alert({title:"提示",message:"您的账户已冻结，请联系客服进行处理！"});else if(2==this.$store.state.webtype){var n=this.appwxurl.wxPoint.turnUrl+"?wxOpenID="+a.a.get("wxopenid")+this.appwxurl.appPoint.turnParam;this.$market.enterNav({link:{type:"3",url:n,useOldProtocal:!0}})}else{var o=""+this.appwxurl.appPoint.turnUrl;this.$market.enterNav({link:{type:"3",url:o,useOldProtocal:!0}})}else if("11"==t.id)4==this.actionInfo.state?s.a.alert({title:"提示",message:"您的账户已锁定！"}):2==this.actionInfo.state?s.a.alert({title:"提示",message:"您的账户已冻结，请联系客服进行处理！"}):this.$router.push("/addCard");else if("13"==t.id){var r=window.location.origin+"/app-vue/oildrop/paymanagement";this.$market.enterNav({link:{type:"3",url:r,useOldProtocal:!0}})}else if("15"==t.id){var h=window.location.origin+"/app-vue/oildrop/zfb-bind";this.$market.enterNav({link:{type:"3",url:h,useOldProtocal:!0}})}},getYoudiTurnConfFunc:function(){var t=this;this.$Loading.open(),this.$http.post("/app/json/app_youdi/getYoudiTurnConf",{}).then((function(e){t.$Loading.close();var i=e.data;0==i.status?t.appwxurl=JSON.parse(i.data):t.$Toast(i.info)})).catch((function(e){t.$Loading.close(),t.$Toast("getYoudiTurnConf err "+e)}))}},created:function(){this.$route.query.actionInfo&&(this.actionInfo=this.$route.query.actionInfo,this.getYoudiTurnConfFunc()),"1"==this.$store.state.globalConfig.has_cancel_user&&this.aqglList.push({name:"注销账户",id:"9",type:1}),this.getSupportTypes(),this.getOilChoice()}},r=(i("Ulpt"),i("KHd+")),h=Object(r.a)(o,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"aqgl"},[i("nav-top",{on:{backEvent:t.backEvent}}),t._v(" "),i("nav-content",[i("div",{staticClass:"refueling-preference"},[i("p",{staticClass:"label"},[t._v("加油偏好")]),t._v(" "),i("ul",{staticClass:"oil-variety"},t._l(t.oilVarietyList,(function(e,s){return i("li",{key:s,staticClass:"item",class:{active:t.activeIndex==s},on:{click:function(e){return t.changeOilVariety(s)}}},[t._v(t._s(e.text))])})),0)]),t._v(" "),i("ul",{staticClass:"aqgl-list mine-box-shodow"},[t._l(t.aqglList,(function(e,s){return[(e.hideKey?"1"==t.$store.state.globalConfig[e.hideKey]:e.isHide)?t._e():i("li",{directives:[{name:"show",rawName:"v-show",value:t.getCellIsShow(e),expression:"getCellIsShow(item)"}],staticClass:"public-bar border-bottom",class:1==e.type?"icon-more":"",on:{click:function(i){return t.jumpUrl(e)}}},[i("span",{staticClass:"left-text"},[t._v(t._s(e.name))]),t._v(" "),0==e.type?i("span",{staticClass:"right-text"},[i("mt-switch",{on:{change:function(i){return t.changeSwitch(e,s)}},model:{value:e.value,callback:function(i){t.$set(e,"value",i)},expression:"item.value"}})],1):t._e()])]}))],2),t._v(" "),t.showGesture?i("div",{staticClass:"gesturelogin"},[i("div",{staticClass:"gesturediv"},[i("gcanvas",{ref:"gcanvas",on:{getGesture:t.getGesture}})],1)]):t._e()])],1)}),[],!1,null,"2ab3b9b2",null);e.default=h.exports},wbJX:function(t,e,i){"use strict";var s={name:"gcanvas",components:{},data:function(){return{ctx:"",devicePixelRatio:0,r:"",lastPoint:[],arr:[],restPoint:[],drawStyle:"red"}},methods:{init:function(){this.initDom(),this.lastPoint=[],this.touchFlag=!1,this.ctx=this.$refs.canvas.getContext("2d"),this.createCircle(),this.bindEvent()},reset:function(){this.createCircle()},bindEvent:function(){var t=this,e=this.$refs.canvas;e.addEventListener("touchstart",(function(e){e.preventDefault();for(var i=t.getPosition(e),s=0;s<t.arr.length;s++)if(Math.abs(i.x-t.arr[s].x)<t.r&&Math.abs(i.y-t.arr[s].y)<t.r){t.touchFlag=!0,t.lastPoint.push(t.arr[s]),t.drawPoint(this.drawStyle),t.restPoint.splice(s,1);break}}),!1),e.addEventListener("touchmove",(function(e){t.touchFlag&&t.update(t.getPosition(e))}),!1),e.addEventListener("touchend",(function(e){t.touchFlag&&(t.touchFlag=!1,t.update(void 0,!0),t.storePass(t.lastPoint))}),!1)},initDom:function(){this.devicePixelRatio=window.devicePixelRatio||1;var t=this.$refs.canvas,e=window.innerWidth,i=window.innerWidth;t.style.width=e+"px",t.style.height=i+"px",t.height=i*this.devicePixelRatio,t.width=e*this.devicePixelRatio},createCircle:function(){var t=0;this.r=this.ctx.canvas.width/14,this.lastPoint=[],this.arr=[],this.restPoint=[];for(var e=this.r,i=0;i<3;i++)for(var s=0;s<3;s++){var n={x:4*s*e+3*e,y:4*i*e+3*e,index:++t};this.arr.push(n),this.restPoint.push(n)}for(this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height),i=0;i<this.arr.length;i++)this.drawCle(this.arr[i].x,this.arr[i].y)},drawCle:function(t,e){this.ctx.fillStyle="#DDDDDD",this.ctx.beginPath(),this.ctx.arc(t,e,this.r,0,2*Math.PI,!0),this.ctx.closePath(),this.ctx.fill()},drawPoint:function(t){for(var e=0;e<this.lastPoint.length;e++)this.ctx.fillStyle=t,this.ctx.beginPath(),this.ctx.arc(this.lastPoint[e].x,this.lastPoint[e].y,this.r/2.5,0,2*Math.PI,!0),this.ctx.closePath(),this.ctx.fill()},drawStatusPoint:function(t){for(var e=0;e<this.lastPoint.length;e++)this.ctx.strokeStyle=t,this.ctx.beginPath(),this.ctx.arc(this.lastPoint[e].x,this.lastPoint[e].y,this.r,0,2*Math.PI,!0),this.ctx.closePath(),this.ctx.stroke()},drawLine:function(t,e,i){this.ctx.beginPath(),this.ctx.strokeStyle=t,this.ctx.lineWidth=3,this.ctx.moveTo(this.lastPoint[0].x,this.lastPoint[0].y);for(var s=1;s<this.lastPoint.length;s++)this.ctx.lineTo(this.lastPoint[s].x,this.lastPoint[s].y);this.ctx.lineTo(e.x,e.y),this.ctx.stroke(),this.ctx.closePath()},getPosition:function(t){var e=t.currentTarget.getBoundingClientRect();return{x:(t.touches[0].clientX-e.left)*this.devicePixelRatio,y:(t.touches[0].clientY-e.top)*this.devicePixelRatio}},update:function(t,e){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);for(var i=0;i<this.arr.length;i++)this.drawCle(this.arr[i].x,this.arr[i].y);if(this.drawPoint(this.drawStyle),this.drawStatusPoint(this.drawStyle),e)this.lastPoint.length&&this.drawLine(this.drawStyle,this.lastPoint[this.lastPoint.length-1],this.lastPoint);else for(this.drawLine(this.drawStyle,t,this.lastPoint),i=0;i<this.restPoint.length;i++)if(Math.abs(t.x-this.restPoint[i].x)<this.r&&Math.abs(t.y-this.restPoint[i].y)<this.r){this.lastPoint.push(this.restPoint[i]),this.drawPoint(this.drawStyle),this.restPoint.splice(i,1);break}},storePass:function(t){this.$emit("getGesture",t)}},mounted:function(){this.init()},created:function(){}},n=(i("W9FF"),i("KHd+")),a=Object(n.a)(s,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"gcanvas"},[e("canvas",{ref:"canvas",staticClass:"canvas"})])}),[],!1,null,"1bef0843",null);e.a=a.exports}}]);
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-67ab5448"],{2041:function(e,t,n){"use strict";n("e260d")},e260d:function(e,t,n){},f364:function(e,t,n){"use strict";n.r(t);var s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"modify-phone"},[n("nav-top",{on:{backEvent:e.back}}),n("nav-content",[n("div",{staticClass:"sms-root"},[n("div",{staticClass:"phone-row"},[1===e.step?n("div",{staticClass:"sms-input line_radius"},[n("van-field",{attrs:{readonly:!!(e.oldPhone&&e.oldPhone.length>0),disabled:!!(e.oldPhone&&e.oldPhone.length>0),type:"tel",placeholder:"请输入手机号",maxlength:"11",size:"16",onkeypress:"return( /[\\d]/.test(String.fromCharCode(event.keyCode)))",pattern:"[0-9]*"},on:{input:function(t){e.phone=/^\d+/.exec(e.phone)?/^\d+/.exec(e.phone)[0]:""},blur:e.validPhone},model:{value:e.phone,callback:function(t){e.phone=t},expression:"phone"}})],1):e._e(),2===e.step?n("div",{staticClass:"sms-input line_radius"},[n("van-field",{attrs:{type:"tel",placeholder:"请输入新手机号",maxlength:"11",size:"16",onkeypress:"return( /[\\d]/.test(String.fromCharCode(event.keyCode)))",pattern:"[0-9]*"},on:{input:function(t){e.newPhone=/^\d+/.exec(e.newPhone)?/^\d+/.exec(e.newPhone)[0]:""},blur:e.validPhone},model:{value:e.newPhone,callback:function(t){e.newPhone=t},expression:"newPhone"}})],1):e._e()]),n("div",{staticClass:"sms-input line_radius"},[1===e.step?n("van-field",{attrs:{type:"phone",maxlength:"6",border:!1,pattern:"[0-9]*",placeholder:"请输入验证码"},model:{value:e.smsCode,callback:function(t){e.smsCode=t},expression:"smsCode"}}):n("van-field",{attrs:{type:"phone",border:!1,pattern:"[0-9]*",maxlength:"6",placeholder:"请输入验证码"},model:{value:e.newSmsCode,callback:function(t){e.newSmsCode=t},expression:"newSmsCode"}}),n("div",{staticClass:"forget-btn"},[n("CountButton",{ref:"countBtn",staticClass:"verif-code-btn",attrs:{slot:"button",phone:1===e.step?e.phone:e.newPhone},on:{getSmsEvent:e.getMsgCode},slot:"button"})],1)],1),1===e.step?n("div",{staticClass:"next-btn theme_standard_bg",on:{click:e.nextStep}},[e._v("下一步")]):n("div",{staticClass:"next-btn theme_standard_bg",on:{click:e.confirm}},[e._v("提交")])])])],1)},o=[],i=n("b90b"),a={name:"modify-pwd",data:function(){return{phone:this.$store.state.userInfo.phone,oldPhone:this.$store.state.userInfo.phone,newPhone:"",smsCode:"",newSmsCode:"",step:1}},computed:{reg:function(){return""==this.$store.state.phoneSection.reg?/^1[0-9]{10}$/:this.$store.state.phoneSection.phoneRule}},created:function(){},methods:{validPhone:function(){/^1[23456789]\d{9}$/.test(this.phone)||this.$Toast("手机号码格式不正确")},nextStep:function(){/^1[23456789]\d{9}$/.test(this.phone)?this.smsCode?(this.step=2,this.$refs.countBtn.resetClock()):this.$Toast("请输入验证码！"):this.$Toast("请输入正确的手机号码！")},back:function(){1===this.step?this.$router.go(-1):this.step=1},getMsgCode:function(e,t){var n,s=this;if(1===this.step){if(!/^1[23456789]\d{9}$/.test(this.phone))return void this.$Toast("请输入正确的手机号码！");n=this.phone}else{if(!/^1[23456789]\d{9}$/.test(this.phone))return void this.$Toast("请输入正确的手机号码！");n=this.newPhone}this.$refs.countBtn.startTime();var o="/app/json/login/sendSms";this.$Loading.open(),this.$http.post(o,{phone:n,smsType:"1030",imgVerifyCode:e,uuid:t}).then((function(e){s.$Loading.close();var t=e.data,n=t.status,o=(t.result,t.info);0==n?s.$Toast("获取验证码成功"):(s.$refs.countBtn.resetClock(),s.$Toast(o))}))["catch"]((function(e){s.$Loading.close(),s.$refs.countBtn.resetClock(),s.$Toast("系统运行过程中遇到问题，请稍候再试")}))},confirm:function(){var e=this;if(/^1[23456789]\d{9}$/.test(this.phone))if(/^1[23456789]\d{9}$/.test(this.phone))if(this.newPhone!=this.phone)if(this.smsCode&&this.newSmsCode){var t="/app/json/user/modifyPhone";this.$Loading.open(),this.$http.post(t,{loginChannel:6,regChannel:5,phone:this.newPhone,smsVerifyCode:this.newSmsCode,originalPhone:this.phone,originalVerifyCode:this.smsCode}).then((function(t){e.$Loading.close();var n=t.data,s=n.status,o=(n.result,n.info);0===s?(e.$Toast("修改成功"),e.$router.go(-1)):(e.$refs.countBtn.resetClock(),e.$Toast(o))}))["catch"]((function(t){e.$Loading.close(),e.$Toast("系统运行过程中遇到问题，请稍候再试")}))}else this.$Toast("请输入验证码！");else this.$Toast("新手机号不能和原手机号相同");else this.$Toast("请输入正确的新手机号码！");else this.$Toast("请输入正确的原手机号码！")}},components:{CountButton:i["a"]}},h=a,r=(n("2041"),n("0c7c")),d=Object(r["a"])(h,s,o,!1,null,"5f7a6408",null);t["default"]=d.exports}}]);
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5defc846"],{"6d88":function(e,t,r){},"76fa":function(e,t,r){"use strict";r("6d88")},8037:function(e,t,r){"use strict";r.r(t);var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return e.referrer&&e.referrer.length?r("div",{staticClass:"pre-registration login2"},[r("nav-content",[r("div",{staticClass:"app-info"},[r("div",{staticClass:"logo"},[r("img",{attrs:{src:e.$store.state.globalConfig.logoUrl}})]),r("div",{staticClass:"title"},[e._v(e._s(e.loginTitle))])]),r("div",{staticClass:"login-div"},[r("div",{staticClass:"text-input"},[r("div",{staticClass:"left"},[e._v("手机号")]),r("div",{staticClass:"cell-phone"},[r("van-field",{attrs:{type:"tel",placeholder:"请输入手机号码",maxlength:"11",autosize:"",onkeypress:"return( /[\\d]/.test(String.fromCharCode(event.keyCode)))",pattern:"[0-9]*"},on:{input:function(t){e.phone=/^\d+/.exec(e.phone)?/^\d+/.exec(e.phone)[0]:""}},model:{value:e.phone,callback:function(t){e.phone=t},expression:"phone"}})],1)]),r("div",{staticClass:"passwords-input"},[r("div",{staticClass:"left-img"},[r("img",{attrs:{src:"static/image/login2/registe5.png",alt:""}})]),r("div",{staticClass:"passwords"},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.referrer,expression:"referrer"}],attrs:{placeholder:"请输入推荐码",disabled:""},domProps:{value:e.referrer},on:{input:function(t){t.target.composing||(e.referrer=t.target.value)}}})])]),r("div",{staticClass:"common-btn theme_standard_bg theme_font_white mt100",on:{click:function(t){return e.getCheckOutFun()}}},[e._v("立即注册")])])])],1):e._e()},n=[],i={name:"pre-registration",components:{},data:function(){return{loginTitle:this.$store.state.globalConfig.projectName,phone:"",referrer:""}},methods:{registeFun:function(){var e=this;this.$Loading.open();var t="/app/json/login/addPreRegInfo",r={phone:this.phone};this.referrer&&this.referrer.length&&(r["rfrCode"]=this.referrer,r["rfrCodeType"]=2),this.$http.post(t,r).then((function(t){e.$Loading.close();var r=t.data;if(0==r.status){var s="/usercenter/downloadsharenew";1==e.$store.state.globalConfig.pro_switch_share_downloadPage&&(s="/usercenter/downloadshare"),e.$router.push({path:s})}else e.$Toast(r.info?r.info:"注册失败")}),(function(t){e.$Loading.close(),e.$Toast("系统运行过程中遇到问题，请稍候再试")}))},getCheckOutFun:function(){var e=/^1\d{10}$/;""!=this.phone?e.test(this.phone)?this.registeFun():this.$Toast("手机号格式不对!"):this.$Toast("手机号不能为空!")}},created:function(){this.referrer=this.$route.query.qrCode,this.referrer&&""!=this.referrer||this.$Toast("推荐码不能为空")}},o=i,a=(r("76fa"),r("0c7c")),l=Object(a["a"])(o,s,n,!1,null,"8862d5ee",null);t["default"]=l.exports}}]);
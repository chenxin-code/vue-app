(window.webpackJsonp=window.webpackJsonp||[]).push([[343],{A6cC:function(t,i,s){"use strict";s.r(i);var e={name:"setgesture",components:{gcanvas:s("wbJX").a},data:function(){return{gTipStr:"设置手势密码",isWrong:!1,step:1,firstPoints:[],secondPoints:[]}},methods:{backEvent:function(){this.$router.go(-1)},isExist:function(t){return this.firstPoints.indexOf(t)>-1},getGesture:function(t){1==this.step?t.length<4?(this.gTipStr="至少连接4个点，请重新绘制",this.isWrong=!0,this.$refs.gcanvas.reset()):(this.gTipStr="请再次绘制",this.isWrong=!1,this.firstPoints=this.getIndexArr(t),this.step=2,this.$refs.gcanvas.reset()):(this.secondPoints=this.getIndexArr(t),this.isEqual()?this.openSpecialPwd(2):(this.gTipStr="两次绘制不同，请重新绘制",this.isWrong=!0,this.firstPoints=[],this.step=1,this.$refs.gcanvas.reset()))},openSpecialPwd:function(t){var i,s=this;return(i=regeneratorRuntime.mark((function i(){var e,n,a,r;return regeneratorRuntime.wrap((function(i){for(;;)switch(i.prev=i.next){case 0:return s.$Loading.open("请求中"),i.next=3,s.$bridgefunc.getArgsWithPromise();case 3:e=i.sent,"/app/json/user/openSpecialPwd",n=s.$store.state.login.token,a=(new Date).valueOf(),r={token:n,userPwdMode:t,pwdCode:a,deviceId:e.deviceId?e.deviceId:"123",deviceName:e.deviceName?e.deviceName:"test",deviceModel:e.model?e.model:"phone",authType:"1"},s.$http.post("/app/json/user/openSpecialPwd",r).then((function(t){s.$Loading.close();var i=t.data;0==i.status?(s.$store.state.login.gestureNumbers=s.secondPoints,s.$store.state.login.gesturePwd=i.data,s.$Toast({message:i.info?i.info:"手势设置成功！",position:"bottom",duration:2e3}),s.$bridgefunc.vuexStorage((function(){s.$router.go(-1)}))):s.$Toast({message:i.info?i.info:"手势设置失败！",position:"bottom",duration:2e3})}),(function(t){s.$Loading.close(),s.$Toast({message:"手势设置失败！",position:"bottom",duration:2e3})}));case 9:case"end":return i.stop()}}),i,s)})),function(){var t=i.apply(this,arguments);return new Promise((function(i,s){return function e(n,a){try{var r=t[n](a),o=r.value}catch(t){return void s(t)}if(!r.done)return Promise.resolve(o).then((function(t){e("next",t)}),(function(t){e("throw",t)}));i(o)}("next")}))})()},isEqual:function(){for(var t="",i="",s=0;s<this.firstPoints.length;s++)t+=this.firstPoints[s];for(s=0;s<this.secondPoints.length;s++)i+=this.secondPoints[s];return t===i},getIndexArr:function(t){for(var i=[],s=0;s<t.length;s++){var e=t[s].index;i.push(e)}return i}},created:function(){}},n=(s("nvyq"),s("KHd+")),a=Object(n.a)(e,(function(){var t=this,i=t.$createElement,s=t._self._c||i;return s("div",{staticClass:"setgesture"},[s("nav-top",{on:{backEvent:t.backEvent}}),t._v(" "),s("nav-content",[s("div",{staticClass:"g-top"},[s("div",{staticClass:"g-select"},t._l(9,(function(i){return s("div",{staticClass:"g-dot  ",class:t.isExist(i)?"theme_bg_red":"theme_bg_white_ef"})})),0),t._v(" "),s("div",{staticClass:"g-tip",class:t.isWrong?"theme_font_red":"theme_font_gray"},[t._v("\n        "+t._s(t.gTipStr)+"\n      ")])]),t._v(" "),s("div",{staticClass:"canvas"},[s("gcanvas",{ref:"gcanvas",on:{getGesture:t.getGesture}})],1),t._v(" "),s("p",{staticClass:"bt-tip theme_font_gray"},[t._v("\n      设置手势密码, 防止他人未经授权查看\n    ")])])],1)}),[],!1,null,"624cb84a",null);i.default=a.exports},NcGM:function(t,i,s){},Q4si:function(t,i,s){},W9FF:function(t,i,s){"use strict";var e=s("Q4si");s.n(e).a},nvyq:function(t,i,s){"use strict";var e=s("NcGM");s.n(e).a},wbJX:function(t,i,s){"use strict";var e={name:"gcanvas",components:{},data:function(){return{ctx:"",devicePixelRatio:0,r:"",lastPoint:[],arr:[],restPoint:[],drawStyle:"red"}},methods:{init:function(){this.initDom(),this.lastPoint=[],this.touchFlag=!1,this.ctx=this.$refs.canvas.getContext("2d"),this.createCircle(),this.bindEvent()},reset:function(){this.createCircle()},bindEvent:function(){var t=this,i=this.$refs.canvas;i.addEventListener("touchstart",(function(i){i.preventDefault();for(var s=t.getPosition(i),e=0;e<t.arr.length;e++)if(Math.abs(s.x-t.arr[e].x)<t.r&&Math.abs(s.y-t.arr[e].y)<t.r){t.touchFlag=!0,t.lastPoint.push(t.arr[e]),t.drawPoint(this.drawStyle),t.restPoint.splice(e,1);break}}),!1),i.addEventListener("touchmove",(function(i){t.touchFlag&&t.update(t.getPosition(i))}),!1),i.addEventListener("touchend",(function(i){t.touchFlag&&(t.touchFlag=!1,t.update(void 0,!0),t.storePass(t.lastPoint))}),!1)},initDom:function(){this.devicePixelRatio=window.devicePixelRatio||1;var t=this.$refs.canvas,i=window.innerWidth,s=window.innerWidth;t.style.width=i+"px",t.style.height=s+"px",t.height=s*this.devicePixelRatio,t.width=i*this.devicePixelRatio},createCircle:function(){var t=0;this.r=this.ctx.canvas.width/14,this.lastPoint=[],this.arr=[],this.restPoint=[];for(var i=this.r,s=0;s<3;s++)for(var e=0;e<3;e++){var n={x:4*e*i+3*i,y:4*s*i+3*i,index:++t};this.arr.push(n),this.restPoint.push(n)}for(this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height),s=0;s<this.arr.length;s++)this.drawCle(this.arr[s].x,this.arr[s].y)},drawCle:function(t,i){this.ctx.fillStyle="#DDDDDD",this.ctx.beginPath(),this.ctx.arc(t,i,this.r,0,2*Math.PI,!0),this.ctx.closePath(),this.ctx.fill()},drawPoint:function(t){for(var i=0;i<this.lastPoint.length;i++)this.ctx.fillStyle=t,this.ctx.beginPath(),this.ctx.arc(this.lastPoint[i].x,this.lastPoint[i].y,this.r/2.5,0,2*Math.PI,!0),this.ctx.closePath(),this.ctx.fill()},drawStatusPoint:function(t){for(var i=0;i<this.lastPoint.length;i++)this.ctx.strokeStyle=t,this.ctx.beginPath(),this.ctx.arc(this.lastPoint[i].x,this.lastPoint[i].y,this.r,0,2*Math.PI,!0),this.ctx.closePath(),this.ctx.stroke()},drawLine:function(t,i,s){this.ctx.beginPath(),this.ctx.strokeStyle=t,this.ctx.lineWidth=3,this.ctx.moveTo(this.lastPoint[0].x,this.lastPoint[0].y);for(var e=1;e<this.lastPoint.length;e++)this.ctx.lineTo(this.lastPoint[e].x,this.lastPoint[e].y);this.ctx.lineTo(i.x,i.y),this.ctx.stroke(),this.ctx.closePath()},getPosition:function(t){var i=t.currentTarget.getBoundingClientRect();return{x:(t.touches[0].clientX-i.left)*this.devicePixelRatio,y:(t.touches[0].clientY-i.top)*this.devicePixelRatio}},update:function(t,i){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);for(var s=0;s<this.arr.length;s++)this.drawCle(this.arr[s].x,this.arr[s].y);if(this.drawPoint(this.drawStyle),this.drawStatusPoint(this.drawStyle),i)this.lastPoint.length&&this.drawLine(this.drawStyle,this.lastPoint[this.lastPoint.length-1],this.lastPoint);else for(this.drawLine(this.drawStyle,t,this.lastPoint),s=0;s<this.restPoint.length;s++)if(Math.abs(t.x-this.restPoint[s].x)<this.r&&Math.abs(t.y-this.restPoint[s].y)<this.r){this.lastPoint.push(this.restPoint[s]),this.drawPoint(this.drawStyle),this.restPoint.splice(s,1);break}},storePass:function(t){this.$emit("getGesture",t)}},mounted:function(){this.init()},created:function(){}},n=(s("W9FF"),s("KHd+")),a=Object(n.a)(e,(function(){var t=this.$createElement,i=this._self._c||t;return i("div",{staticClass:"gcanvas"},[i("canvas",{ref:"canvas",staticClass:"canvas"})])}),[],!1,null,"1bef0843",null);i.a=a.exports}}]);
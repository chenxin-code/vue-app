(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-8cfbe53c"],{"17a3":function(t,e,i){},"1a5c":function(t,e,i){},"1df2":function(t,e,i){"use strict";i("87f6")},"1ede":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"get-coupon",class:{isFloat:t.moduleData.isFloat},style:t.getWrapStyle},[t.configuration?i("div",{staticClass:"coupon-group coupon-show"},[i("img",{attrs:{src:"static/images/get-coupon/8.png"}})]):[t.couList.length?[i("ul",{staticClass:"coupon-group"},t._l(t.couList,(function(e,a){return i("li",{key:e.ruleId,staticClass:"coupon-list"},[t._m(0,!0),i("div",{staticClass:"coupon-info"},[i("div",{staticClass:"conpon-info-col_1"},[i("div",{staticClass:"row-title"},[t._v(t._s(e.couTypeTitle))]),i("div",{staticClass:"row-discount"},[t._v(t._s(t._f("discount")(e)))])]),i("div",{staticClass:"conpon-info-col_2"},[t.receive?i("div",[t._v("待使用")]):"after"==t.dayType?i("div",[t._v("已结束")]):-1!=e.state?i("div",[t._v("待领取")]):i("div",[t._v("已领完")])])])])})),0),t.receive?t._e():i("sbx-progress",{attrs:{color:"#F7C64D",percentage:t.getPercentage()}})]:i("div",{staticStyle:{"text-align":"center"}},[t._v("暂时没有可领的券")])],i("div",{staticClass:"counpon-footer"},[t.receive?[i("div",{staticClass:"btn-submit",class:Object.assign({},t.hotareaClass(t.moduleData,!0),{"btn-disabled":!1}),on:{click:function(e){t.hotEvent(t.moduleData.idCode),t.getCoupons()}}},[i("img",{style:{height:t.moduleData.btnHeight+"px"},attrs:{src:t.btnSubmitImage}})])]:["before"!=t.dayType||t.configuration?t._e():[i("div",{staticClass:"counpon-footer-text"},[t._v("开始时间："+t._s(t.getFilterTime(t.couActivity.mktStartTime)))])],"during"==t.dayType||t.configuration?[i("div",{staticClass:"btn-submit",class:Object.assign({},t.hotareaClass(t.moduleData,!0),{"btn-disabled":!1}),on:{click:function(e){t.hotEvent(t.moduleData.idCode),t.getCoupons()}}},[i("img",{style:{height:t.moduleData.btnHeight+"px"},attrs:{src:t.btnSubmitImage}})]),t.hasCoupon?t._e():[null!=t.nextCouActivity?i("div",{staticClass:"counpon-footer-text"},[t._v("下一场预告："+t._s(t.getFilterTime(t.nextCouActivity.mktStartTime)))]):i("div",{staticClass:"counpon-footer-text"},[t._v("活动已结束")])]]:t._e(),"after"!=t.dayType||t.configuration?t._e():[i("div",{staticClass:"counpon-footer-text"},[t._v("活动已结束")])]]],2)],2)},s=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"coupon-image"},[i("img",{attrs:{src:"static/images/get-coupon/9.png"}})])}],n=(i("0d03"),i("d81d"),i("99af"),i("4e82"),i("4de4"),i("6eba"),i("a9e3"),i("ac1f"),i("5319"),i("e25e"),i("289d"),i("03c6")),o=i("5b7e"),r=i("c4dd"),c=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"sbx-progress"},[i("div",{staticClass:"sbx-progress__portion",style:{backgroundColor:t.color,width:t.percentage+"%"}}),i("div",{staticClass:"sbx-progress__pivot",style:{color:t.color}},[t._v(t._s(t.percentage)+"%")])])},u=[],l={props:{percentage:{type:Number,default:0},color:{type:String,default:"#333"}}},h=l,d=(i("2bc7"),i("0c7c")),p=Object(d["a"])(h,c,u,!1,null,"2ebc5082",null),m=p.exports,g={name:"get-coupon",mixins:[n["a"]],components:{CircleProgress:r["a"],SbxProgress:m},data:function(){return{couponData:{},couActivity:{},nextCouActivity:null,receive:!1,beginTime:!1,hasCoupon:!0,dayType:"before",lastDay:!1}},props:["myIndex","usePorpData","propData"],computed:{configuration:function(){return-1==this.$store.state.webtype},btnSubmitImage:function(){var t=this.moduleData;return this.receive?"static/images/get-coupon/10.png":this.hasCoupon?t.btnImage||"static/images/get-coupon/7.png":t.btnFinishedImage||"static/images/get-coupon/11.png"},pageData:function(){return 1==this.usePorpData?this.propData:this.$store.state.pageData},moduleData:function(){return this.pageData.moduleList[this.myIndex].data},getWrapStyle:function(){var t=this.moduleData,e={};e.backgroundImage="url(".concat(t.bgImg,")");var i=this.moduleData.isFloat;return i&&(e.position=-1==this.$store.state.webtype?"absolute":"fixed",e.marginTop=t.floatUp+"px"),e},couList:function(){return this.couActivity.couList||[]}},methods:{regLastDay:function(t,e){var i=t+864e5;this.lastDay=new Date(i).getDate()==new Date(e).getDate()},getPercentage:function(){var t=0,e=0;this.couList.map((function(i){t+=i.distRewardCnt,e+=i.limitRewardCnt})),t>=e&&(this.hasCoupon=!1);var i=this.calCent(t,e);return i},testLength:function(t){return(t+"").length>1?t:"0"+t},getFilterTime:function(t){var e="xxxx年xx月xx日 xx:xx:xx";if(t){var i=new Date(t);e="".concat(i.getFullYear(),"年").concat(this.testLength(i.getMonth()+1),"月").concat(this.testLength(i.getDate()),"日 ").concat(this.testLength(i.getHours()),":").concat(this.testLength(i.getMinutes()),":").concat(this.testLength(i.getSeconds()))}return e},hotEvent:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.actionBtnEvent(this.pageData.pgCode,this.moduleData.idCode+t)},testBegin:function(){var t=this.couActivity,e=new Date,i=new Date(t.mktStartTime),a=new Date(t.mktEndTime);if(e<i)this.dayType="before";else if(e>a)this.dayType="after";else{this.regLastDay(i,a),this.dayType="during";var s=e.getHours();this.testBeginTime(s)}},testBeginTime:function(t){var e=0,i=24;1==this.$store.state.globalConfig.yn_coupon_login_type&&(e=10),this.beginTime=t>=e&&t<i},getCouActivityAward:function(){var t=this,e=""!=this.$store.state.login.token,i=e?"/app/json/app_market/queryGetCouActivityAward":"/app/json/app_market/queryGetCouActivityAwardWithoutToken",a={provinceId:this.$store.state.indexData.provinceId||"",cityId:this.$store.state.indexData.cityId||"",countryId:this.$store.state.indexData.countryId||"",townId:this.$store.state.indexData.townId||""};this.$Loading.open(),this.$http.post(i,a).then((function(i){t.$Loading.close();var a=i.data;if(0==a.status&&a.data){t.couponData=a.data;for(var s=0;s<a.data.length;s++){var n=a.data[s].activityModelList;if(n.length){t.setCouActivity(n),t.testBegin(),e&&t.testReceive(t.couList);break}}}t.pageInit=!0}))},getTime:function(t){return new Date(t).getTime()},setCouActivity:function(t){var e=this,i={},a=t.sort((function(t,i){return e.getTime(t.mktStartTime)-e.getTime(i.mktStartTime)})),s=a.filter((function(t){return e.getTime(t.mktEndTime)>=Date.now()}));s.length?(i=s[0],s[1]&&(this.nextCouActivity=s[1])):i=a[a.length-1],this.couActivity=i},existCoupon:function(){var t=!0;if(this.couList.length){var e=this.couList[0],i=Number(e.distRewardCnt),a=Number(e.limitRewardCnt);i>=a&&(t=!1)}else t=!1;return t},showMessageBox:function(t){var e=this;this.$MessageBox.alert(t,"提示",{confirmButtonText:"确定"}).then((function(t){e.$router.replace({path:"/usercenter/downloadshare",query:{fromCoupon:"1"}})}))},getCoupons:function(){var t=""!=this.$store.state.login.token;this.testBegin(),t&&this.receive?this.$market.goCouponsTarget(this.moduleData):this.existCoupon()?this.$market.getCoupons(this.couActivity.mktActivityId,this.moduleData):this.showMessageBox("券已领完，下次请早点来，下载APP参加更多活动。")},testReceive:function(t){if(t.length){var e=t[0];-1==e.state&&this.existCoupon()&&(this.receive=!0)}},calCent:function(t,e){if(t&&e){var i=Math.floor(parseInt(t/e*1e4))/100;return i>=100?100:i}return 0}},filters:{discount:function(t){var e;switch(t.couCategory){case 20:var i=Number(t.couFaceValue)>100?parseInt(t.couFaceValue):t.couFaceValue;e="满".concat(t.couThresholdAmount,"元减").concat(i,"元");break;case 40:var a=1e3*t.couDiscountValue/100;e="满".concat(t.couThresholdAmount,"元享").concat(a,"折");break;default:e="立减".concat(t.couFaceValue,"元");break}return e}},created:function(){try{wx,o["a"].hideMeItems(["menuItem:share:appMessage","menuItem:share:timeline","menuItem:copyUrl","menuItem:editTag","menuItem:delete","menuItem:originPage","menuItem:readMode","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:email","menuItem:share:brand","menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"])}catch(t){}this.getCouActivityAward()}},f=g,v=(i("1df2"),Object(d["a"])(f,a,s,!1,null,"0e8f97b4",null));e["default"]=v.exports},"2bc7":function(t,e,i){"use strict";i("17a3")},"60f2":function(t,e,i){"use strict";i("1a5c")},"81d5":function(t,e,i){"use strict";var a=i("7b0b"),s=i("23cb"),n=i("50c4");t.exports=function(t){var e=a(this),i=n(e.length),o=arguments.length,r=s(o>1?arguments[1]:void 0,i),c=o>2?arguments[2]:void 0,u=void 0===c?i:s(c,i);while(u>r)e[r++]=t;return e}},"87f6":function(t,e,i){},c4dd:function(t,e,i){"use strict";var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"circle-wrapper",style:t.style},[i("svg",{attrs:{viewBox:"0 0 1060 1060"}},[i("path",{style:t.hoverStyle,attrs:{d:t.path}}),i("path",{staticClass:"layer-circle",style:t.layerStyle,attrs:{d:t.path}})]),i("div",{staticClass:"circle-content"},[t._t("default")],2)])},s=[],n=(i("a9e3"),i("cb29"),i("6eba"),i("0d03"),i("acd8"),i("b680"),"#F80F16"),o="rgb(235, 237, 240)",r={props:{value:Number,speed:Number,size:{type:String,default:"100px"},fill:{type:String,default:"none"},rate:{type:Number,default:100},color:{type:String,default:n},layerColor:{type:String,default:o},strokeWidth:{type:Number,default:40},clockwise:{type:Boolean,default:!0}},beforeCreate:function(){this.perimeter=3140,this.path="M 530 530 m -500, 0 a 500, 500 0 1, 1 1000, 0 a 500, 500 0 1, 1 -1000, 0"},computed:{style:function(){return{width:this.size,height:this.size}},layerStyle:function(){var t=this.perimeter*(100-this.value)/100;return t=this.clockwise?t:2*this.perimeter-t,{stroke:"".concat(this.color),strokeDashoffset:"".concat(t,"px"),strokeWidth:"".concat(this.strokeWidth+1,"px")}},hoverStyle:function(){return{fill:"".concat(this.fill),stroke:"".concat(this.layerColor),strokeWidth:"".concat(this.strokeWidth,"px")}}},watch:{rate:{handler:function(){this.startTime=Date.now(),this.startRate=this.value,this.endRate=this.format(this.rate),this.increase=this.endRate>this.startRate,this.duration=Math.abs(1e3*(this.startRate-this.endRate)/this.speed),this.speed?(this.cancel(this.rafId),this.rafId=this.raf(this.animate)):this.$emit("input",this.endRate)},immediate:!0}},methods:{animate:function(){var t=Date.now(),e=Math.min((t-this.startTime)/this.duration,1),i=e*(this.endRate-this.startRate)+this.startRate;this.$emit("input",this.format(parseFloat(i.toFixed(1)))),(this.increase?i<this.endRate:i>this.endRate)&&(this.rafId=this.raf(this.animate))},format:function(t){return Math.min(Math.max(t,0),100)},raf:function(t){window.requestAnimationFrame(t)},cancel:function(t){window.cancelAnimationFrame(t)}}},c=r,u=(i("60f2"),i("0c7c")),l=Object(u["a"])(c,a,s,!1,null,"cdfcecb4",null);e["a"]=l.exports},cb29:function(t,e,i){var a=i("23e7"),s=i("81d5"),n=i("44d2");a({target:"Array",proto:!0},{fill:s}),n("fill")}}]);
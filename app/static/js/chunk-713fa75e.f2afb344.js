(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-713fa75e"],{"238d":function(e,t,n){},ab85:function(e,t,n){"use strict";n("238d")},ad74:function(e,t,n){"use strict";n.r(t);var a,s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("nav-top",{on:{backEvent:function(t){return e.$router.go(-1)}}}),n("nav-content",{staticClass:"vip-car"},[n("div",{staticClass:"content-con"},[n("div",{staticClass:"info"},[n("div",{staticClass:"info-con",on:{click:e.instruction}},[n("span",{staticClass:"icon"},[e._v("?")]),e._v(" "),n("span",[e._v("办签说明")])])]),n("van-form",{ref:"form",attrs:{"validate-first":""},on:{failed:e.onFailed,submit:e.save}},[n("div",{staticClass:"form"},[n("van-field",{attrs:{required:"",name:"liveAddress",label:"常住地",placeholder:"您的常住地是哪",rules:[{required:!0,message:"请输入常住地"}]},on:{click:function(t){e.show2=!0}},model:{value:e.liveAddress,callback:function(t){e.liveAddress=t},expression:"liveAddress"}}),n("van-field",{attrs:{required:"",name:"targetPlace",label:"出行国家",placeholder:"您要去哪个国家",rules:[{required:!0,message:"请输入出行国家"}]},on:{click:function(t){e.show1=!0}},model:{value:e.targetPlace,callback:function(t){e.targetPlace=t},expression:"targetPlace"}}),n("van-field",{attrs:{required:"",name:"useBeginTime",label:"出行日期",placeholder:"计划出行日期",rules:[{required:!0,message:"请选择出行日期"}]},on:{click:function(t){e.showCalendar=!0}},model:{value:e.useBeginTime,callback:function(t){e.useBeginTime=t},expression:"useBeginTime"}})],1),n("div",{staticClass:"form"},[n("van-field",{attrs:{name:"userName",required:"",label:"姓名",placeholder:"请输入姓名",disabled:"",rules:[{required:!0,message:"请输入姓名"}]},model:{value:e.userName,callback:function(t){e.userName=t},expression:"userName"}}),n("van-field",{attrs:{name:"userPhone",label:"联系方式",required:"",placeholder:"请输入手机号",rules:[{required:!0,message:"请输入手机号"},{pattern:e.patternPhone,message:"请输入有效手机号"}]},model:{value:e.userPhone,callback:function(t){e.userPhone=t},expression:"userPhone"}}),n("van-field",{staticClass:"gray",attrs:{name:"userMessage",label:"备注信息",type:"textarea",placeholder:"","label-class":"spacial"},model:{value:e.userMessage,callback:function(t){e.userMessage=t},expression:"userMessage"}})],1)]),n("van-calendar",{attrs:{"show-confirm":!1},on:{confirm:e.onConfirm},model:{value:e.showCalendar,callback:function(t){e.showCalendar=t},expression:"showCalendar"}})],1),n("div",{staticClass:"handle-con"},[n("van-button",{staticClass:"btn cancel",attrs:{round:"",type:"default"},on:{click:e.cancel}},[e._v("取消")]),n("van-button",{staticClass:"btn save",attrs:{round:"",type:"info","native-type":"submit"},on:{click:e.confirm}},[e._v(" 提交需求 ")])],1)]),n("van-action-sheet",{attrs:{title:"说明",round:!1},model:{value:e.show,callback:function(t){e.show=t},expression:"show"}},[n("div",{staticClass:"line"}),n("div",{staticClass:"content",domProps:{innerHTML:e._s(e.content)}},[e._v(" "+e._s(e.content)+" ")]),n("van-button",{staticClass:"sliver",attrs:{type:"info","native-type":"submit"},on:{click:function(t){e.show=!1}}},[e._v(" 我知道了 ")])],1),n("van-action-sheet",{attrs:{actions:e.actions,title:"选择签证国家"},on:{select:e.onSelect},model:{value:e.show1,callback:function(t){e.show1=t},expression:"show1"}},[n("div",{staticClass:"line"}),n("div",{staticClass:"btn-con"},e._l(e.countryList,(function(t,a){return n("van-button",{key:a,staticClass:"country",class:{select:!t.flag},attrs:{round:"",type:"info"},on:{click:function(n){return e.addClass(t)}}},[e._v(e._s(t.dictValue))])})),1),n("van-button",{staticClass:"sliver",attrs:{type:"info","native-type":"submit"},on:{click:e.select}},[e._v(" 确定 ")])],1),n("van-action-sheet",{attrs:{actions:e.actions,title:"选择常住地"},on:{select:e.onSelect},model:{value:e.show2,callback:function(t){e.show2=t},expression:"show2"}},[n("div",{staticClass:"line"}),n("div",{staticClass:"btn-con"},e._l(e.homeList,(function(t,a){return n("van-button",{key:a,staticClass:"country",class:{select:e.homeIndex==a},attrs:{round:"",type:"info"},on:{click:function(n){return e.select2(t,a)}}},[e._v(e._s(t.name))])})),1)]),n("CheckPaidMember",{on:{failHandler:e.failHandler}})],1)},i=[],o=n("ade3"),c=(n("6d73"),n("473d")),l=(n("38d5"),n("772a")),r=(n("b0c0"),n("d3b7"),n("3ca3"),n("ddb0"),n("4160"),n("159b"),n("ac1f"),n("5319"),n("d81d"),{name:"visaApplication",components:(a={},Object(o["a"])(a,l["a"].name,l["a"]),Object(o["a"])(a,c["a"].name,c["a"]),Object(o["a"])(a,"CheckPaidMember",(function(){return n.e("chunk-2d0db310").then(n.bind(null,"6f8b"))})),a),data:function(){var e;return e={actions:[],show:!1,show1:!1,show2:!1,active:1,content:null,userPhone:null,userName:null,useBeginTime:null,targetPlace:null,liveAddress:null,userMessage:null,homeIndex:null,list:[{name:"接机"},{name:"送机"}],countryList:[{name:"英国",flag:!0},{name:"法国",flag:!0},{name:"德国",flag:!0},{name:"意大利",flag:!0},{name:"德国",flag:!0}],selectList:[],form:{},showCalendar:!1},Object(o["a"])(e,"show",!1),Object(o["a"])(e,"homeList",[]),Object(o["a"])(e,"patternPhone",/^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/),e},methods:{failHandler:function(){this.$router.go(-1)},cancel:function(){this.$router.go(-1)},onSelect:function(){},confirm:function(){this.$refs.form.submit()},instruction:function(){this.show=!0},onFailed:function(){},select:function(){var e=this;this.selectList=[],this.targetPlace="",this.countryList.forEach((function(t,n,a){t.flag||(e.selectList.push(t),e.targetPlace+=","+t.dictValue)})),this.targetPlace.length>0&&(this.targetPlace=this.targetPlace.substr(1)),this.show1=!1},select2:function(e,t){this.homeIndex=t,this.liveAddress=e.name,this.show2=!1},onConfirm:function(e){this.useBeginTime=this.$util.getMyDate(e).replace(/-/g,"/"),this.showCalendar=!1},save:function(e){var t=this,n=Object.assign(e,{serviceType:this.serviceType,equityMemberId:this.$route.query.id,memberId:this.$route.query.memberId,memberName:this.$route.query.memberName});this.$http.post("/app/json/equity_use_visa/addVisa",n).then((function(e){var n=e.data;0==n.status?t.$router.push({path:"/benefits/success",query:{id:e.data.data}}):t.$Toast(n.info)}))["catch"]((function(e){t.$Toast(e)}))},getInfo:function(){var e=this,t={};this.$http.post("/app/json/news/getNewsList?values=59",t).then((function(t){var n=t.data;0==n.status?e.content=t.data.data[0].content:e.$Toast(n.info)}))["catch"]((function(t){e.$Toast(t)}))},getCountry:function(){var e=this,t={alias:"visa_country"};this.$http.post("/app/json/app_dict/getDictByAlias",t).then((function(t){var n=t.data;0==n.status?(e.countryList=t.data.data,e.countryList.map((function(t,n,a){e.$set(t,"flag",!0)}))):e.$Toast(n.info)}))["catch"]((function(t){e.$Toast(t)}))},addClass:function(e){e.flag?e.flag=!1:e.flag=!0},getHome:function(){var e=this,t="/app/json/area/loadAreaList",n={token:this.$store.state.login.token,parentId:0};this.$http.post(t,n).then((function(t){e.$Loading.close();var n=t.data;0==n.status?e.homeList=n.data:e.$Toast(n.info)}),(function(t){e.$Loading.close(),e.$Toast("获取数据失败")}))}},created:function(){this.userName=this.$route.query.memberName,this.userPhone=this.$route.query.memberPhone,this.getInfo(),this.getHome(),this.getCountry()},mounted:function(){document.getElementsByName("liveAddress")[0].addEventListener("focus",(function(){document.activeElement.blur()})),document.getElementsByName("targetPlace")[0].addEventListener("focus",(function(){document.activeElement.blur()})),document.getElementsByName("useBeginTime")[0].addEventListener("focus",(function(){document.activeElement.blur()}))},beforeDestroy:function(){document.getElementsByName("liveAddress")[0].removeEventListener("focus",(function(){document.activeElement.blur()})),document.getElementsByName("targetPlace")[0].removeEventListener("focus",(function(){document.activeElement.blur()})),document.getElementsByName("useBeginTime")[0].removeEventListener("focus",(function(){document.activeElement.blur()}))}}),u=r,d=(n("ab85"),n("0c7c")),m=Object(d["a"])(u,s,i,!1,null,"528e110f",null);t["default"]=m.exports}}]);
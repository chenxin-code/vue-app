(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ccbaeab6"],{"325e":function(t,i,e){"use strict";e.r(i);var a=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"body"},[e("nav-top",{attrs:{title:"问卷列表"},on:{backEvent:function(i){return t.$router.go(-1)}}},[e("div",{staticClass:"shareBox"},[e("div",[e("router-link",{attrs:{to:"/historyList"}},[e("i",{staticClass:"icon iconfont mall-dingdan"})])],1)])]),e("nav-content",[e("div",{staticClass:"containDiv"},[t.answerList.length>0?e("div",{staticClass:"contain"},t._l(t.answerList,(function(i,a){return e("div",[2===i.serviceType?e("div",{staticClass:"publicInvoice"},[e("p",{staticClass:"p"},[e("span",[t._v(t._s(i.title))]),e("span",[t._v("未填写")])]),e("van-cell-group",[e("van-field",{attrs:{disabled:"",label:"派发时间"},model:{value:i.createTime,callback:function(e){t.$set(i,"createTime",e)},expression:"item.createTime"}}),e("van-field",{attrs:{disabled:"",label:"订单编号"},model:{value:i.ouCode,callback:function(e){t.$set(i,"ouCode",e)},expression:"item.ouCode"}}),e("van-field",{attrs:{disabled:"",label:"订单类型"},model:{value:i.orderType,callback:function(e){t.$set(i,"orderType",e)},expression:"item.orderType"}}),e("van-field",{attrs:{disabled:"",label:"有效期"},model:{value:t.validityTime,callback:function(i){t.validityTime=i},expression:"validityTime"}}),e("div",{staticClass:"publicInvoiceDiv",on:{click:function(e){return t.detail(i.questionPrize)}}},[e("van-field",{attrs:{label:"问卷奖品",disabled:""}}),e("span",{staticClass:"img"},[e("img",{attrs:{src:"static/image/invoice/arrows.png",alt:""}})])],1),e("van-field",{staticClass:"neirong",attrs:{disabled:"",label:"问卷说明"},model:{value:i.remark,callback:function(e){t.$set(i,"remark",e)},expression:"item.remark"}})],1),e("div",{staticClass:"answerd",on:{click:function(e){return t.dati(i)}}},[e("a",{staticClass:"theme_bg_red"},[t._v("填写问卷")])])],1):t._e(),1===i.serviceType||4===i.serviceType?e("div",{staticClass:"publicInvoice"},[e("p",{staticClass:"p"},[e("span",[t._v(t._s(i.title))]),e("span",[t._v("未填写")])]),e("van-cell-group",[e("van-field",{attrs:{disabled:"",label:"开始时间"},model:{value:i.questionStartTime,callback:function(e){t.$set(i,"questionStartTime",e)},expression:"item.questionStartTime"}}),e("van-field",{attrs:{disabled:"",label:"结束时间"},model:{value:i.questionEndTime,callback:function(e){t.$set(i,"questionEndTime",e)},expression:"item.questionEndTime"}}),e("div",{staticClass:"publicInvoiceDiv",on:{click:function(e){return t.detail(i.questionPrize)}}},[e("van-field",{attrs:{label:"问卷奖品",disabled:""}}),e("span",{staticClass:"img"},[e("img",{attrs:{src:"static/image/invoice/arrows.png",alt:""}})])],1),e("van-field",{staticClass:"neirong",attrs:{disabled:"",label:"问卷说明"},model:{value:i.remark,callback:function(e){t.$set(i,"remark",e)},expression:"item.remark"}})],1),e("div",{staticClass:"answerd",on:{click:function(e){return t.dati(i)}}},[e("a",{staticClass:"theme_bg_red"},[t._v("填写问卷")])])],1):t._e()])})),0):t._e(),0==t.answerList.length?e("div",{staticClass:"contain"},[e("span",{staticClass:"emptyState"},[t._v("暂无列表")])]):t._e()]),t.detailData1?e("div",{staticClass:"detailModal"},[e("div",{staticClass:"detailDiv"},[e("div",{staticClass:"divTitle"},[e("p",{staticClass:"title-p"},[t._v("问卷奖品")]),e("div",{staticClass:"closeBtn",on:{click:t.closeDetail}},[e("img",{attrs:{src:"static/image/invoice/close-btn.png",alt:""}})])]),e("ul",[t._l(t.jiangList,(function(i,a){return t.jiangList.length>0?e("li",{key:a},[e("img",{attrs:{src:i.prizeImgUrl?i.prizeImgUrl:"static/image/invoice/jiang.png",alt:""}}),e("span",[t._v(t._s(i.prizeName))]),e("span",[t._v(t._s(i.prizeNum))])]):t._e()})),0==t.jiangList.length?e("p",{staticClass:"pNull"},[t._v("暂无奖品")]):t._e()],2)])]):t._e()])],1)},s=[],n=(e("e7e5"),e("d399")),o=(e("c975"),e("0d03"),e("4160"),e("159b"),e("ac1f"),e("1276"),e("fb6a"),e("797f")),r=e("c1df"),l=e.n(r),c={name:"answerList",mixins:[o["a"]],data:function(){return{url:"",id:"",detailData1:!1,answerList:[],createTime:"",validityTime:"",jiangList:[],detailId:"",ouCode:"",orderId:""}},mounted:function(){this.loadData(),this.Intercept()},methods:{detail:function(t){this.detailData1=!0,-1==t.indexOf("&quot")?this.jiangList=JSON.parse(t)||[]:this.jiangList=[]},dati:function(t){var i=this,e=this;e.detailId=t.configId,e.ouCode=t.ouCode,e.orderId=t.orderId,this.$Loading.open();var a={id:e.detailId,token:this.$store.state.login.token,ouCode:e.ouCode,orderId:e.orderId};e.participateData(a).then((function(t){i.$Loading.close(),"success"===t.data.result?e.$router.push({path:"/subject",query:{subId:e.detailId,orderId:e.orderId}}):Object(n["a"])(t.data.info)}))},closeDetail:function(){this.detailData1=!1},formatDate:function(t){var i=new Date(t),e=i.getFullYear(),a=i.getMonth()+1;i=i.getDate();return e+"/"+a+"/"+i},loadData:function(){var t=this,i={token:this.$store.state.login.token};t.listData(i).then((function(i){i.data.result&&(t.answerList=i.data.data||[],t.answerList.forEach((function(i){i.createTime=l()(i.createTime).format("YYYY/MM/DD HH:mm:ss"),i.questionStartTime=l()(i.questionStartTime).format("YYYY/MM/DD HH:mm:ss"),i.questionEndTime=l()(i.questionEndTime).format("YYYY/MM/DD HH:mm:ss"),t.validityTime=i.questionStartTime+"至"+i.questionEndTime})))}))},Intercept:function(){var t=this.url||window.location.href,i=t.substr(t.indexOf("?")),e=i.slice(1).split("=");this.id=e[1]}},computed:{},components:{},watch:{}},d=c,u=(e("d5f5"),e("0c7c")),p=Object(u["a"])(d,a,s,!1,null,"920c9c30",null);i["default"]=p.exports},"797f":function(t,i,e){"use strict";var a="/app/json/questionaire/startAnswer",s="/app/json/questionaire/appUserConfig",n="/app/json/questionaire/submit",o="/app/json/questionaire/completeAct",r="/app/json/questionaire/findQuestionaireByuserId",l="/app/json/questionaire/historyQuestionaireList",c="/app/json/questionaire/questionaireDetail";i["a"]={methods:{participateData:function(t){return this.$http.post(a,t)},questionData:function(t){return this.$http.post(s,t)},commitData:function(t){return this.$http.post(n,t)},prizeData:function(t){return this.$http.post(o,t)},listData:function(t){return this.$http.post(r,t)},historyData:function(t){return this.$http.post(l,t)},historydetailData:function(t){return this.$http.post(c,t)}}}},a4ff:function(t,i,e){},d5f5:function(t,i,e){"use strict";e("a4ff")}}]);
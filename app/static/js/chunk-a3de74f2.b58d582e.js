(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-a3de74f2","chunk-4a7ac694"],{"1cd0":function(t,e,s){},4251:function(t,e,s){"use strict";s("1cd0")},"4c53":function(t,e,s){"use strict";var a=s("23e7"),i=s("857a"),n=s("af03");a({target:"String",proto:!0,forced:n("sub")},{sub:function(){return i(this,"sub","","")}})},"4ff7":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"body"},[s("nav-top",{attrs:{title:"规则说明"},on:{backEvent:function(e){return t.$router.go(-1)}}}),s("nav-content",[s("div",{staticClass:"content"},[s("div",[s("p",{staticClass:"p1 theme_font_red"},[t._v("如何获取答题机会？")]),s("p",{staticClass:"p2"},[t._v("1、每人都可免费获得一次游戏")])]),s("div",[s("p",{staticClass:"p1 theme_font_red"},[t._v("答题都有啥奖励呢？")]),s("p",{staticClass:"p2"},[t._v("1、积分、游戏机会")])]),s("div",[s("p",{staticClass:"p1 theme_font_red"},[t._v("规则说明")]),s("p",{staticClass:"p2"},[t._v("1、必须全部答完才可以获得奖励")])])])])],1)},i=[],n={name:"rule"},o=n,r=(s("4251"),s("0c7c")),l=Object(r["a"])(o,a,i,!1,null,"ac9c50d0",null);e["default"]=l.exports},6234:function(t,e,s){},"797f":function(t,e,s){"use strict";var a="/app/json/questionaire/startAnswer",i="/app/json/questionaire/appUserConfig",n="/app/json/questionaire/submit",o="/app/json/questionaire/completeAct",r="/app/json/questionaire/findQuestionaireByuserId",l="/app/json/questionaire/historyQuestionaireList",c="/app/json/questionaire/questionaireDetail";e["a"]={methods:{participateData:function(t){return this.$http.post(a,t)},questionData:function(t){return this.$http.post(i,t)},commitData:function(t){return this.$http.post(n,t)},prizeData:function(t){return this.$http.post(o,t)},listData:function(t){return this.$http.post(r,t)},historyData:function(t){return this.$http.post(l,t)},historydetailData:function(t){return this.$http.post(c,t)}}}},"7ab6":function(t,e,s){"use strict";s("6234")},"9fc4":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"body"}},[s("nav-top",{attrs:{title:"吐槽墙"},on:{backEvent:t.backEvent}}),s("nav-content",[s("div",{staticClass:"content"},[s("div",{staticClass:"oil-content"},[s("div",{staticClass:"icon"},[s("img",{attrs:{src:"static/image/mall2/logoItem.png",alt:""}})]),s("div",{staticClass:"detail"},[s("div",{staticClass:"title"},[t._v(t._s(t.$route.query.storeName))]),s("div",{staticClass:"address"},[s("van-icon",{attrs:{name:"location-o"}}),t._v(t._s(t.$route.query.address))],1)])]),s("div",{staticClass:"answer-con"},t._l(t.answerList,(function(e,a){return s("div",{key:a,staticClass:"top"},[6===e.kindId?s("div",{staticClass:"singleList score"},[s("div",{staticClass:" score-con"},[s("span",{staticClass:"wall-title"},[t._v(t._s(e.orderNo)+"、"+t._s(e.title))]),s("label",{staticClass:"title-con"},[t._v(t._s(e.title))]),s("div",{staticClass:"evaluteBox"},[1===e.styleType?s("van-rate",{attrs:{color:"#25aff8","void-color":"#25aff8"},on:{change:function(e){return t.evaluateData(a,e)}},model:{value:e.result,callback:function(s){t.$set(e,"result",s)},expression:"item.result"}}):t._e(),2===e.styleType?s("van-rate",{attrs:{color:"#25aff8",icon:"like","void-color":"#25aff8","void-icon":"like-o"},on:{change:function(e){return t.evaluateData(a,e)}},model:{value:e.result,callback:function(s){t.$set(e,"result",s)},expression:"item.result"}}):t._e(),3===e.styleType?s("van-rate",{attrs:{color:"#25aff8",icon:"static/image/microShop/xiaoicon.png","void-color":"#25aff8","void-icon":"smile-o"},on:{change:function(e){return t.evaluateData(a,e)}},model:{value:e.result,callback:function(s){t.$set(e,"result",s)},expression:"item.result"}}):t._e(),s("p",[t._v(t._s(e.evaluate))])],1)])]):t._e(),1===e.kindId?s("div",{staticClass:"singleList"},[s("div",{staticClass:"divObj"},[s("span",{staticClass:"wall-title"},[t._v(t._s(e.orderNo)+"、"+t._s(e.title))]),s("van-radio-group",{on:{change:t.changeResult},model:{value:e.result,callback:function(s){t.$set(e,"result",s)},expression:"item.result"}},t._l(e.options,(function(e,a){return s("van-radio",{key:a,attrs:{"checked-color":"#25aff8",name:t.optionsObj[a]}},[t._v(t._s(t.optionsObj[a])+" 、"+t._s(e.lable)+" ")])})),1)],1)]):t._e(),2===e.kindId?s("div",{staticClass:"singleList che-con multipleList"},[s("div",{staticClass:" "},[s("span",{staticClass:"wall-title"},[t._v(t._s(e.orderNo)+"、"+t._s(e.title))]),s("div",{staticClass:"checkItem-con"},t._l(e.options,(function(a,i){return s("van-button",{key:i,staticClass:"btn-con",class:a.flag?"select":"",attrs:{round:"",type:"default",size:"small"},on:{click:function(s){return t.selectO(e.options,e,i)}}},[t._v(t._s(a.lable))])})),1)])]):t._e(),5===e.kindId?s("div",{staticClass:"singleList"},[s("div",{staticClass:"divObj divObj1"},[s("span",{staticClass:"wall-title"},[t._v(t._s(e.orderNo)+"、"+t._s(e.title))]),e.limitMin&&!e.limitMax?s("textarea",{directives:[{name:"model",rawName:"v-model",value:e.result,expression:"item.result"}],staticClass:"textType",staticStyle:{"min-height":"90px"},attrs:{placeholder:"请输入最少"+e.limitMin+"个字"},domProps:{value:e.result},on:{input:function(s){s.target.composing||t.$set(e,"result",s.target.value)}}}):t._e(),e.limitMax&&!e.limitMin?s("textarea",{directives:[{name:"model",rawName:"v-model",value:e.result,expression:"item.result"}],staticClass:"textType",staticStyle:{"min-height":"90px"},attrs:{placeholder:"请输入最多"+e.limitMax+"个字"},domProps:{value:e.result},on:{input:function(s){s.target.composing||t.$set(e,"result",s.target.value)}}}):t._e(),e.limitMin&&e.limitMax?s("textarea",{directives:[{name:"model",rawName:"v-model",value:e.result,expression:"item.result"}],staticClass:"textType",staticStyle:{"min-height":"90px"},attrs:{placeholder:"请输入"+e.limitMin+"到"+e.limitMax+"个字"},domProps:{value:e.result},on:{input:function(s){s.target.composing||t.$set(e,"result",s.target.value)}}}):t._e(),e.limitMin||e.limitMax?t._e():s("textarea",{directives:[{name:"model",rawName:"v-model",value:e.result,expression:"item.result"}],staticClass:"textType",staticStyle:{"min-height":"90px"},domProps:{value:e.result},on:{input:function(s){s.target.composing||t.$set(e,"result",s.target.value)}}})])]):t._e(),7===e.kindId?s("div",{staticClass:"singleList text-con"},[s("div",{staticClass:"lin-con"}),s("span",{staticClass:"wall-title"},[t._v(t._s(e.orderNo)+"、"+t._s(e.title))]),s("div",{},[s("van-field",{staticStyle:{width:"100%",background:"white",border:"1px solid #ccc","border-radius":"8px"},attrs:{rows:"2",autosize:"",maxlength:e.limitMax||100,type:"textarea",placeholder:"亲，您对加油站的评价，是我们更好服务的动力哦！","show-word-limit":""},model:{value:e.result,callback:function(s){t.$set(e,"result",s)},expression:"item.result"}})],1)]):t._e(),4===e.kindId?s("div",{staticClass:"singleList"},[s("div",{staticClass:"divObj"},[s("span",{staticClass:"wall-title"},[t._v(t._s(e.orderNo)+"、"+t._s(e.title))]),s("div",{staticClass:"xiala",on:{click:function(s){return t.select1(e)}}},[s("span",[t._v(t._s(e.result||"请选择"))]),s("span",{staticClass:"icon iconfont mall-xiala"})]),s("van-action-sheet",{attrs:{id:"xialaView",actions:e.options},on:{select:function(s){return t.onSelect(s,e)}},model:{value:e.show,callback:function(s){t.$set(e,"show",s)},expression:"item.show"}})],1)]):t._e(),3===e.kindId?s("div",{staticClass:"singleList"},[s("div",{staticClass:"divObj"},[s("span",{staticClass:"wall-title"},[t._v(t._s(e.orderNo)+"、"+t._s(e.title))]),t._l(e.options,(function(a,i){return s("div",{key:i,staticClass:"pics"},[s("div",[s("span",[t._v(t._s(t.optionsObj[i])+"、")]),s("img",{attrs:{src:a.imgUrl,alt:""}})]),s("div",[s("van-radio-group",{model:{value:e.result,callback:function(s){t.$set(e,"result",s)},expression:"item.result"}},[s("van-radio",{attrs:{"checked-color":"#25aff8",name:t.optionsObj[i]}},[t._v(t._s(a.lable)+" ")])],1)],1)])}))],2)]):t._e()])})),0),s("div",{staticClass:"bottom theme_bg_red",class:{gray:0==t.answerList.length},on:{click:t.commit}},[t._v("提交吐槽")])])]),s("van-popup",{attrs:{"close-on-click-overlay":!1},model:{value:t.commitModel,callback:function(e){t.commitModel=e},expression:"commitModel"}},[s("div",{staticClass:"modal"},[s("p",{staticClass:"title-p"},[s("span",[t._v("成功提交问券")]),s("span",[t._v("恭喜您获得以下奖品")])]),s("ul",t._l(t.mktAwardList,(function(e,a){return s("li",{key:a},[s("img",{attrs:{src:e.prizeImgUrl?e.prizeImgUrl:"static/image/microShop/icon52x.png",alt:""}}),s("span",[t._v(t._s(e.prizeName)+t._s(e.prizeNum))]),s("span",{on:{click:function(s){return t.seeView(e.prizeType)}}},[t._v("查看")])])})),0)]),s("div",{staticClass:"btns"},[s("span",{staticClass:"theme_bg_red",on:{click:t.closeBtn}},[t._v("确定")])])])],1)},i=[],n=(s("e17f"),s("2241")),o=(s("e7e5"),s("d399")),r=(s("0d03"),s("d3b7"),s("25f0"),s("4160"),s("159b"),s("b0c0"),s("4c53"),s("99af"),s("c975"),s("ac1f"),s("1276"),s("fb6a"),s("797f")),l=(s("4ff7"),s("da71")),c={name:"",mixins:[r["a"]],data:function(){return{twoFlag:!1,randomId:null,answerList:[],optionsObj:[],radioname:"",paramsData:{},radio:"B",list:["a","b","c","d"],result:["a","b"],value:3,show:!1,commitModel:!1,actions:[],mktAwardList:[],id:"",url:"",shareTitle:"",shareContent:"",shareImgUrl:"",shareurl:"",shareUserid:"",shareView:!0,tip:"",details:"",token:null}},beforeRouteEnter:function(t,e,s){"/submitEvaluation"==e.path?s((function(t){t.twoFlag=!0})):s()},created:function(){var t=this;t.paramsData=t.$route.query,t.$route.query?t.shareUserid=t.$route.query.shareUserid:t.shareUserid=""},mounted:function(){var t,e=this;t=this.$route.query.questionaireId?this.$route.query.questionaireId:this.paramsData.subId||this.paramsData.id,this.randomId=Math.random().toString(36).substr(2);var s={id:t,ouCode:this.$route.query.ouCode,orderId:this.randomId};this.participateData(s).then((function(t){e.$Loading.close(),"success"===t.data.result?e.loadData():Object(o["a"])(t.data.info)})),this.Intercept(),this.getLetter()},methods:{changeResult:function(t){},evaluateData:function(t,e){var s=this.answerList[t];1==s.result?s.evaluate="非常差":2==s.result?s.evaluate="差":3==s.result?s.evaluate="一般":4==s.result?s.evaluate="好":5==s.result&&(s.evaluate="非常好")},generateBig_1:function(){for(var t=[],e=65;e<91;e++)t.push(String.fromCharCode(e));return t},getLetter:function(){this.optionsObj=this.generateBig_1()},seeView:function(t){var e="";"20030"==t?e="/mall2/win_record":"20010"==t?e="/usercenter/rebatebonus":"20020"==t?e="/mall2/integralinfo":"20001"==t&&(e="/coupon_list"),this.$router.push({path:e,query:{type:"subject"}})},loadData:function(){var t=this,e=this,s="",a="";s=e.$route.query.questionaireId?e.$route.query.questionaireId:e.paramsData.subId||e.paramsData.id,a=e.$route.query.ouCode;var i={id:s,ouCode:a};e.questionData(i).then((function(s){if("success"===s.data.result){t.details=s.data.data;var a=s.data.data.subjectList;e.userId=s.data.data.userId;var i=s.data.data.questionShare?JSON.parse(s.data.data.questionShare):"";0==i.length?e.shareView=!1:e.shareView=!0,a.forEach((function(t){if(t.show=!1,1===t.kindId||2===t.kindId||3===t.kindId||4===t.kindId){var e=JSON.parse(t.options);e.forEach((function(t){t.name=t.lable})),t.options=e}2===t.kindId?t.result=[]:6===t.kindId?t.result=0:(t.result="",4===t.kindId&&(t.show=!1))})),a.forEach((function(t){t.evaluate="",t.tips=""})),e.answerList=JSON.parse(JSON.stringify(a)),e.answerList.forEach((function(t,s,a){2==t.kindId&&t.options.forEach((function(t,a,i){e.$set(e.answerList[s].options[a],"flag",!1)}))})),e.shareTitle=s.data.data.shareTitle,e.shareContent=s.data.data.shareContent,e.shareImgUrl=s.data.data.shareImgUrl}}))},select1:function(t){t.show=!0},commit:function(){if(this.twoFlag)this.$Toast("问卷已提交");else if(this.$route.query.questionaireId){for(var t=0;t<this.answerList.length;t++){if(this.answerList[t].result>100)return void this.$Toast("".concat(this.answerList[t].title,"不能超过100分"));if(""==this.answerList[t].result)return void this.$Toast("请输入".concat(this.answerList[t].title))}this.submitEvaluateScore()}else this.sub()},submitEvaluateScore:function(){var t=this,e=[];this.answerList.forEach((function(t){e.push({subjectId:t.id,result:t.result.toString()})})),this.$request.post("/app/json/evaluation_center/submitEvaluateScore",{empEvaluationMessageId:this.$route.query.id,configId:this.details.id,surveyResultModels:e}).then((function(e){0===e.status?(t.$Toast("提交成功"),t.$router.go(-2)):t.$Toast(e.info?e.info:"提交失败")}))},sub:function(){var t=this,e=[];t.answerList.forEach((function(t){e.push({kindId:t.kindId,configId:t.configId,subjectId:t.id,kindName:t.kindName,options:t.options,title:t.title,styleType:t.styleType,orderNo:t.orderNo,result:t.result.toString()})}));var s=!0;if(t.answerList.forEach((function(t){1==t.mustAnswer&&""==t.result&&(s=!1)})),s){var a=!0;t.answerList.forEach((function(e,s){5==e.kindId&&(e.limitMin&&!e.limitMax&&e.result.length<e.limitMin&&(t.tip="第"+(s+1)+"题简答题最少输入"+e.limitMin+"个字",a=!1),e.limitMax&&!e.limitMin&&e.result.length>e.limitMax&&(t.tip="第"+(s+1)+"题简答题最多输入"+e.limitMax+"个字",a=!1),e.limitMin&&e.limitMax&&(e.result.length>=e.limitMin&&e.result.length<=e.limitMax?a=!0:(t.tip="第"+(s+1)+"题简答题字数限制在"+e.limitMin+"至"+e.limitMax+"之间",a=!1)))})),a?(t.$Loading.open(),t.commitData({resultJson:JSON.stringify(e),id:t.paramsData.id||t.paramsData.subId,orderId:this.randomId,ouCode:t.paramsData.ouCode}).then((function(e){if(t.$Loading.close(),"success"===e.data.result){Object(o["a"])("提交成功");var s={id:t.paramsData.id,shareUserid:t.shareUserid,orderId:t.paramsData.orderId};t.$Loading.open(),t.prizeData(s).then((function(e){t.$Loading.close(),"success"===e.data.result?(t.mktAwardList=e.data.data.mktAwardList||[],t.mktAwardList.length>0?t.commitModel=!0:t.commitModel=!1,t.$router.push({path:"/submitEvaluation"})):(t.commitModel=!1,t.$router.go(-1))}))}else Object(o["a"])(e.data.info)}))):Object(o["a"])(t.tip)}else Object(o["a"])("您还有必答题尚未答完，请先答完必答题！")},sharegoods:function(){var t=this,e={title:t.shareTitle,sharetext:t.shareContent,imageurl:t.shareImgUrl,detailurl:"".concat(this.$store.state.globalConfig.wxBaseUrl).concat(l["a"].shareUrl,"/subject?shareUserid=").concat(this.$store.state.userInfo.userId,"&id=").concat(t.paramsData.subId,"&orderId=").concat(t.paramsData.orderId)};this.$bridgefunc.wechatShare(e)},closeBtn:function(){this.commitModel=!1,this.$router.go(-1)},backEvent:function(){var t=this;n["a"].confirm({message:"问卷尚未答完，确定要离开吗？",cancelButtonText:"现在离开",confirmButtonText:"继续答题"}).then((function(){}))["catch"]((function(){t.$router.go(-1)}))},onSelect:function(t,e){e.result=t.name,e.show=!1},Intercept:function(){var t=this.url||window.location.href,e=t.substr(t.indexOf("?")),s=e.slice(1).split("=");this.id=s[1]},selectO:function(t,e,s){var a=this,i=null;this.answerList.forEach((function(n,o,r){n.id==e.id&&(i=o,n.options.forEach((function(e,i,n){t[s].name==e.name&&a.$set(a.answerList[o].options[i],"flag",!a.answerList[o].options[i].flag)})))})),this.answerList[i].result=[],this.answerList[i].options.forEach((function(t,e,s){t.flag&&a.answerList[i].result.push(a.optionsObj[e])}))}},computed:{},components:{},watch:{}},u=c,d=(s("7ab6"),s("0c7c")),p=Object(d["a"])(u,a,i,!1,null,"c5d9f278",null);e["default"]=p.exports}}]);
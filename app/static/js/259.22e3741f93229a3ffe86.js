(window.webpackJsonp=window.webpackJsonp||[]).push([[259,725],{QuqH:function(t,s,e){},"T/eX":function(t,s,e){"use strict";e.r(s);var a=(e("dsmH"),e("KHd+")),i=Object(a.a)({name:"rule"},(function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"body"},[e("nav-top",{attrs:{title:"规则说明"},on:{backEvent:function(s){return t.$router.go(-1)}}}),t._v(" "),e("nav-content",[e("div",{staticClass:"content"},[e("div",[e("p",{staticClass:"p1 theme_font_red"},[t._v("如何获取答题机会？")]),t._v(" "),e("p",{staticClass:"p2"},[t._v("1、每人都可免费获得一次游戏")])]),t._v(" "),e("div",[e("p",{staticClass:"p1 theme_font_red"},[t._v("答题都有啥奖励呢？")]),t._v(" "),e("p",{staticClass:"p2"},[t._v("1、积分、游戏机会")])]),t._v(" "),e("div",[e("p",{staticClass:"p1 theme_font_red"},[t._v("规则说明")]),t._v(" "),e("p",{staticClass:"p2"},[t._v("1、必须全部答完才可以获得奖励")])])])])],1)}),[],!1,null,"3fd2fb9a",null);s.default=i.exports},abfZ:function(t,s,e){"use strict";var a=e("QuqH");e.n(a).a},bxsp:function(t,s,e){"use strict";e.r(s);var a=e("eX/C"),i=(e("L2JU"),e("T/eX"),e("2nGb")),n={name:"",mixins:[a.a],data:function(){return{answerList:[],i:0,optionsObj:{},paramsData:{},radio:"B",list:["a","b","c","d"],result:["a","b"],value:3,show:!1,actions:[],mktAwardList:[],id:"",url:"",evaluate:"",shareView:!0,shareTitle:"",shareContent:"",shareImgUrl:""}},created:function(){this.getLetter(),this.paramsData=this.$route.query},mounted:function(){this.loadData()},methods:{loadData:function(){var t=this,s={id:t.paramsData.id,token:this.$store.state.login.token,orderId:t.paramsData.orderId};t.historydetailData(s).then((function(s){if("success"===s.data.result){var e=JSON.parse(s.data.data.resultJson);console.log(JSON.parse(JSON.stringify(e))),e.forEach((function(t){t.evaluate=""})),t.userId=s.data.data.userId,0==(s.data.data.questionShare?JSON.parse(s.data.data.questionShare):"").length?t.shareView=!1:t.shareView=!0,e.forEach((function(t,s){if(1===t.kindId||2===t.kindId||3===t.kindId||4===t.kindId){var e=JSON.parse(t.options)||[];e.forEach((function(t){t.name=t.lable})),t.options=e}2===t.kindId?t.result=t.result.split(","):6===t.kindId?(t.result=Number(t.result)||0,1==t.result?t.evaluate="非常差":2==t.result?t.evaluate="差":3==t.result?t.evaluate="一般":4==t.result?t.evaluate="好":5==t.result&&(t.evaluate="非常好")):4===t.kindId&&(t.show=!1)})),t.answerList=e,t.shareTitle=s.data.data.shareTitle,t.shareContent=s.data.data.shareContent,t.shareImgUrl=s.data.data.shareImgUrl}}))},select1:function(t){t.show=!0},generateBig_1:function(){for(var t=[],s=65;s<91;s++)t.push(String.fromCharCode(s));return t},getLetter:function(){this.optionsObj=this.generateBig_1()},onSelect:function(t,s){s.result=t.name,s.show=!1},sharegoods:function(){var t={title:this.shareTitle,sharetext:this.shareContent,imageurl:this.shareImgUrl,detailurl:""+this.$store.state.globalConfig.wxBaseUrl+i.a.shareUrl+"/questionDetail?shareUserid="+this.$store.state.userInfo.userId+"&id="+this.paramsData.id+"&orderId="+this.paramsData.orderId};this.$bridgefunc.wechatShare(t)},Intercept:function(){var t=this.url||window.location.href,s=t.substr(t.indexOf("?")).slice(1).split("=");this.id=s[1]}},computed:{},components:{},watch:{}},r=(e("abfZ"),e("KHd+")),o=Object(r.a)(n,(function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{attrs:{id:"body"}},[e("nav-top",{attrs:{title:"问卷调查"},on:{backEvent:function(s){return t.$router.go(-1)}}},[t.shareView?t._e():e("div",{staticClass:"shareBox",on:{click:t.sharegoods}},[e("div",[e("i",{staticClass:"icon iconfont mall-fenxiang"})])])]),t._v(" "),e("nav-content",[e("div",{staticClass:"content"},t._l(t.answerList,(function(s,a){return e("div",{key:a,staticClass:"top"},[1===s.kindId?e("div",{staticClass:"singleList"},[e("span",{staticClass:"theme_bg_red"},[t._v("单选")]),t._v(" "),e("div",{staticClass:"divObj"},[e("div",{staticClass:"titleHead"},[e("span",[t._v(t._s(a+1)+"、")]),t._v(" "),e("span",{domProps:{innerHTML:t._s(s.title)}})]),t._v(" "),e("van-radio-group",{model:{value:s.result,callback:function(e){t.$set(s,"result",e)},expression:"item.result"}},t._l(s.options,(function(s,a){return e("van-radio",{key:a,attrs:{disabled:"",name:t.optionsObj[a]}},[t._v(t._s(t.optionsObj[a])+" 、"+t._s(s.lable))])})),1)],1)]):t._e(),t._v(" "),2===s.kindId?e("div",{staticClass:"singleList multipleList"},[e("span",{staticClass:"theme_bg_red"},[t._v("多选")]),t._v(" "),e("div",{staticClass:"divObj"},[e("div",{staticClass:"titleHead"},[e("span",[t._v(t._s(a+1)+"、")]),t._v(" "),e("span",{domProps:{innerHTML:t._s(s.title)}})]),t._v(" "),e("van-checkbox-group",{model:{value:s.result,callback:function(e){t.$set(s,"result",e)},expression:"item.result"}},t._l(s.options,(function(s,a){return e("van-checkbox",{key:a,attrs:{disabled:"","checked-color":"#25aff8",name:t.optionsObj[a]}},[t._v(t._s(t.optionsObj[a])+" 、"+t._s(s.lable))])})),1)],1)]):t._e(),t._v(" "),5===s.kindId?e("div",{staticClass:"singleList"},[e("span",{staticClass:"theme_bg_red"},[t._v("问答")]),t._v(" "),e("div",{staticClass:"divObj"},[e("div",{staticClass:"titleHead"},[e("span",[t._v(t._s(a+1)+"、")]),t._v(" "),e("span",{domProps:{innerHTML:t._s(s.title)}})]),t._v(" "),e("textarea",{directives:[{name:"model",rawName:"v-model",value:s.result,expression:"item.result"}],staticClass:"textType",staticStyle:{"min-height":"90px"},attrs:{disabled:"",maxlength:s.limitMax},domProps:{value:s.result},on:{input:function(e){e.target.composing||t.$set(s,"result",e.target.value)}}})])]):t._e(),t._v(" "),7===s.kindId?e("div",{staticClass:"singleList"},[e("span",{staticClass:"theme_bg_red"},[t._v("文本")]),t._v(" "),e("div",{staticClass:"divObj"},[e("div",{staticClass:"titleHead"},[e("span",[t._v(t._s(a+1)+"、")]),t._v(" "),e("span",{domProps:{innerHTML:t._s(s.title)}})]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:s.result,expression:"item.result"}],staticClass:"textType",attrs:{disabled:"",maxlength:s.limitMax},domProps:{value:s.result},on:{input:function(e){e.target.composing||t.$set(s,"result",e.target.value)}}})])]):t._e(),t._v(" "),6===s.kindId?e("div",{staticClass:"singleList score"},[e("span",{staticClass:"theme_bg_red"},[t._v("打分")]),t._v(" "),e("div",{staticClass:"divObj"},[e("div",{staticClass:"titleHead"},[e("span",[t._v(t._s(a+1)+"、")]),t._v(" "),e("span",{domProps:{innerHTML:t._s(s.title)}})]),t._v(" "),e("div",{staticClass:"evaluteBox"},[1===s.styleType?e("van-rate",{attrs:{"void-color":"#c7c7c7","disabled-color":"#25aff8",disabled:""},model:{value:s.result,callback:function(e){t.$set(s,"result",e)},expression:"item.result"}}):t._e(),t._v(" "),2===s.styleType?e("van-rate",{attrs:{"void-color":"#c7c7c7",icon:"like","disabled-color":"#25aff8","void-icon":"like-o",disabled:""},model:{value:s.result,callback:function(e){t.$set(s,"result",e)},expression:"item.result"}}):t._e(),t._v(" "),3===s.styleType?e("van-rate",{attrs:{"void-color":"#c7c7c7",icon:"static/image/microShop/xiaoicon.png","disabled-color":"#25aff8","void-icon":"smile-o",disabled:""},model:{value:s.result,callback:function(e){t.$set(s,"result",e)},expression:"item.result"}}):t._e(),t._v(" "),e("p",[t._v(t._s(s.evaluate))])],1)])]):t._e(),t._v(" "),4===s.kindId?e("div",{staticClass:"singleList"},[e("span",{staticClass:"theme_bg_red"},[t._v("下拉")]),t._v(" "),e("div",{staticClass:"divObj"},[e("div",{staticClass:"titleHead"},[e("span",[t._v(t._s(a+1)+"、")]),t._v(" "),e("span",{domProps:{innerHTML:t._s(s.title)}})]),t._v(" "),e("div",{staticClass:"xiala"},[e("span",[t._v(t._s(s.result||"请选择"))]),t._v(" "),e("span",{staticClass:"icon iconfont mall-xiala"})]),t._v(" "),e("van-action-sheet",{attrs:{actions:s.options},on:{select:function(e){return t.onSelect(e,s)}},model:{value:s.show,callback:function(e){t.$set(s,"show",e)},expression:"item.show"}})],1)]):t._e(),t._v(" "),3===s.kindId?e("div",{staticClass:"singleList"},[e("span",{staticClass:"theme_bg_red"},[t._v("图片")]),t._v(" "),e("div",{staticClass:"divObj"},[e("div",{staticClass:"titleHead"},[e("span",[t._v(t._s(a+1)+"、")]),t._v(" "),e("span",{domProps:{innerHTML:t._s(s.title)}})]),t._v(" "),t._l(s.options,(function(a,i){return e("div",{key:i,staticClass:"pics"},[e("div",[e("span",[t._v(t._s(t.optionsObj[i])+"、")]),t._v(" "),e("img",{attrs:{src:a.imgUrl,alt:""}})]),t._v(" "),e("div",[e("van-radio-group",{model:{value:s.result,callback:function(e){t.$set(s,"result",e)},expression:"item.result"}},[e("van-radio",{attrs:{"checked-color":"#25aff8",name:t.optionsObj[i],disabled:""}},[t._v(t._s(a.lable))])],1)],1)])}))],2)]):t._e()])})),0)])],1)}),[],!1,null,"62694619",null);s.default=o.exports},dsmH:function(t,s,e){"use strict";var a=e("xq1S");e.n(a).a},"eX/C":function(t,s,e){"use strict";s.a={methods:{participateData:function(t){return this.$http.post("/app/json/questionaire/startAnswer",t)},questionData:function(t){return this.$http.post("/app/json/questionaire/appUserConfig",t)},commitData:function(t){return this.$http.post("/app/json/questionaire/submit",t)},prizeData:function(t){return this.$http.post("/app/json/questionaire/completeAct",t)},listData:function(t){return this.$http.post("/app/json/questionaire/findQuestionaireByuserId",t)},historyData:function(t){return this.$http.post("/app/json/questionaire/historyQuestionaireList",t)},historydetailData:function(t){return this.$http.post("/app/json/questionaire/questionaireDetail",t)}}}},xq1S:function(t,s,e){}}]);
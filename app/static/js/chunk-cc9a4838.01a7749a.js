(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-cc9a4838"],{"094d":function(t,e,s){"use strict";s("53f2")},"53f2":function(t,e,s){},"7c3e":function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("nav-top",{on:{backEvent:function(e){return t.$router.go(-1)}}}),s("nav-content",{staticClass:"container"},[s("div",{staticClass:"top-c"},[s("swiper",{ref:"mySwiper",staticClass:"swiper-container",attrs:{options:t.swiperOption}},t._l(t.cardList,(function(e,i){return s("swiper-slide",{key:i},[s("div",{staticClass:"swiper-item",style:{"background-image":"url("+e.backgroundPic+")"}},[s("p",{staticClass:"card-title"},[t._v(t._s(e.equityCardName))])])])})),1),s("div",{staticClass:"explanation-btn",on:{click:t.intro}},[t._v("权益说明>")]),s("div",{staticClass:"interests-list"},t._l(t.interestsList,(function(e,i){return s("div",{key:i,staticClass:"item",on:{click:function(s){return t.enjoyBenefits(e)}}},[s("img",{staticClass:"icon-inter",attrs:{src:e.equityPic,alt:""}}),s("p",{staticClass:"name"},[t._v(t._s(e.equityName))]),s("van-icon",{staticClass:"icon-arrow",attrs:{name:"arrow"}})],1)})),0)],1),s("div",{staticClass:"chum-public-btn btm-btn"},[s("van-button",{attrs:{disabled:t.disReceiveBtn,round:"",block:"",type:"info",color:"linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"},on:{click:t.receiveHandler}},[t._v("立即领取 ")])],1)]),s("van-popup",{staticClass:"receive-modal",attrs:{"close-on-click-overlay":!1},model:{value:t.successModal,callback:function(e){t.successModal=e},expression:"successModal"}},[s("p",{staticClass:"text"},[t._v("恭喜您成功领取了【"+t._s(t.interestName)+"】,进入“我的-我的卡包”页面进行查看！")]),s("div",{staticClass:"btn-c"},[s("span",{on:{click:function(e){t.successModal=!1}}},[t._v("稍后查看")]),s("span",{staticClass:"red",on:{click:t.viewNow}},[t._v("立即查看")])])])],1)},n=[],a=(s("4160"),s("159b"),s("a15b"),s("c1df"),{data:function(){return{swiperOption:{slidesPerView:1.5,centeredSlides:!0,speed:500,observer:!0,observeParents:!0},cardList:[],interestsList:[],currentObj:null,successModal:!1,cardInfo:{},interestName:"",disReceiveBtn:!1}},mounted:function(){this.$route.query.cardInfo&&(this.cardInfo=JSON.parse(decodeURIComponent(this.$route.query.cardInfo)),this.initInfo())},computed:{mySwiper:function(){return this.$refs.mySwiper.swiper}},components:{},methods:{initInfo:function(){var t=this;this.$Loading.open(),this.$http.post("/app/json/equity_card/receiveDetail",{id:this.cardInfo.equityCardId}).then((function(e){t.$Loading.close();var s=e.data;0==s.status?(t.cardList.push(s.data),t.cardList[0]&&(t.interestName=t.cardList[0].equityCardName),t.interestsList=s.data.equityItemModels[0].infoModels||[],t.currentObj=t.interestsList[0]||null):t.$Toast(s.info)}))["catch"]((function(e){t.$Loading.close(),t.$Toast("equityMemberUseRecord err ".concat(e))}))},intro:function(){var t=[];this.interestsList.forEach((function(e){t.push(e.id)})),this.$router.push({path:"/benefits/benefitsInfo",query:{entryType:1,id:t.join(",")}})},receiveHandler:function(){var t=this;this.$Loading.open(),this.$http.post("/app/json/app_equity_card/addEquityCardMember",this.cardInfo).then((function(e){t.$Loading.close();var s=e.data;0==s.status?(t.successModal=!0,t.disReceiveBtn=!0):t.$Toast(s.info)}))["catch"]((function(e){t.$Loading.close(),t.$Toast("addEquityCardMember err ".concat(e))}))},viewNow:function(){this.$router.push({path:"/my_card_case"})}}}),c=a,r=(s("094d"),s("0c7c")),o=Object(r["a"])(c,i,n,!1,null,"7f99eb15",null);e["default"]=o.exports}}]);
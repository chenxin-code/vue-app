(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-37d63e2f"],{"7f92":function(e,t,i){"use strict";i("e384")},e384:function(e,t,i){},fe81:function(e,t,i){"use strict";i.r(t);var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("nav-top",{on:{backEvent:function(t){return e.$router.go(-1)}}}),i("nav-content",{staticClass:"container"},[i("div",{staticClass:"swiper-f"},[i("swiper",{ref:"mySwiper",staticClass:"swiper-container",attrs:{options:e.swiperOption}},e._l(e.cardList,(function(t,s){return i("swiper-slide",{key:s},[i("div",{staticClass:"swiper-item",style:{"background-image":"url("+t.cardMemberModel.backgroundPic+")"}},[i("p",{staticClass:"card-title"},[e._v(e._s(t.cardMemberModel.equityCardName))]),i("div",{staticClass:"btm-info"},[i("p",{staticClass:"expiration-date"},[e._v(e._s(e.dealWithExpirDate(t.cardMemberModel)))]),i("p",{staticClass:"card-no"},[e._v("NO."+e._s(t.cardMemberModel.equityCardCode))])]),4==t.cardMemberModel.receiveType?i("p",{staticClass:"tips"},[e._v("赠送")]):e._e()])])})),1),i("div",{directives:[{name:"show",rawName:"v-show",value:1==e.entryType,expression:"entryType == 1"}],staticClass:"swiper-pagination"})],1),i("div",{staticClass:"explanation-btn",on:{click:function(t){return e.intro(e.currentObj)}}},[e._v("权益说明>")]),e.interestsList.length?i("div",{staticClass:"interests-list"},e._l(e.interestsList,(function(t,s){return i("div",{key:s,staticClass:"item",class:{disabled:0===e.dealwithSurplusNum(t.surplusNumber)},on:{click:function(i){return e.enjoyBenefits(t)}}},[i("img",{staticClass:"icon-inter",attrs:{src:t.equityPic,alt:""}}),i("p",{staticClass:"name"},[i("span",{staticClass:"eq-name"},[e._v(e._s(t.equityName))]),""!==t.surplusNumber?i("span",{staticClass:"count"},[e._v(e._s(-1==e.dealwithSurplusNum(t.surplusNumber)?"无限":"剩余"+e.dealwithSurplusNum(t.surplusNumber)+"次"))]):e._e()]),i("van-icon",{staticClass:"icon-arrow",attrs:{name:"arrow"}})],1)})),0):i("div",{staticClass:"no-result"},[e._v("暂无权益~")])]),i("CheckPaidMember",{on:{failHandler:e.failHandler}})],1)},a=[],r=(i("d3b7"),i("3ca3"),i("ddb0"),i("4160"),i("159b"),i("c1df")),n=i.n(r),c={data:function(){return{swiperOption:{slidesPerView:1.5,centeredSlides:!0,speed:500,observer:!0,observeParents:!0,pagination:{el:".swiper-pagination",type:"fraction"},on:{slideChange:this.slideChange}},cardList:[],interestsList:[],currentObj:null,entryType:0,equityCardName:"",equityCardId:NaN}},mounted:function(){this.entryType=this.$route.query.entryType||0,this.equityCardName=this.$route.query.equityCardName||"",this.equityCardId=this.$route.query.equityCardId||NaN,this.initInfo()},computed:{mySwiper:function(){return this.$refs.mySwiper.swiper}},components:{CheckPaidMember:function(){return i.e("chunk-2d0db310").then(i.bind(null,"6f8b"))}},methods:{failHandler:function(){this.$router.go(-1)},checkHasPassport:function(){var e=this;this.$Loading.open(),this.$http.post("/app/json/user/getUserCertificateList",{cateType:1}).then((function(t){e.$Loading.close();var i=t.data;0==i.status?i.data?e.$router.push({path:"/usercenter/myqrcode"}):(e.$Toast("请先维护护照信息"),e.$router.push({path:"/usercenter/passportedit"})):e.$Toast(i.info)}))["catch"]((function(t){e.$Loading.close(),e.$Toast("getUserCertificateList err ".concat(t))}))},slideChange:function(){this.interestsList=this.cardList[this.mySwiper.activeIndex].memberModels||[],this.currentObj=this.cardList[this.mySwiper.activeIndex]||null},initInfo:function(){var e=this;this.$Loading.open();var t={equityCardState:1,receiveType:99};1==this.entryType&&(t.receiveType=5),this.$http.post("/app/json/equity_card/equityMemberUseRecord",t).then((function(t){e.$Loading.close();var i=t.data;if(0==i.status){if(e.cardList=i.data||[],i.data instanceof Array&&i.data.length>0&&(e.interestsList=i.data[0].memberModels||[],e.currentObj=i.data[0]||null,e.equityCardName)){var s=NaN;i.data.forEach((function(t,i){t.equityCardName==e.equityCardName&&(s=i)})),e.$nextTick((function(){e.mySwiper.slideTo(s,500,!1)}))}}else e.$Toast(i.info)}))["catch"]((function(t){e.$Loading.close(),e.$Toast("equityMemberUseRecord err ".concat(t))}))},dealWithExpirDate:function(e){var t="有效期：-";return t=1==e.validityType?"有效期：永久有效":"有效期至："+n()(e.invalidTime).format("YYYY-MM-DD"),t},intro:function(e){e&&this.$router.push({path:"/benefits/benefitsInfo",query:{id:e.cardMemberModel.id}})},enjoyBenefits:function(e){if(0===e.surplusNumber||"0"===e.surplusNumber)return!1;var t="";switch(e.equityType){case 51001:t="/benefits/vipCar";break;case 51003:t="/benefits/selectStore";break;case 51004:this.checkHasPassport();break;case 51005:t="/benefits/customTraval";break;case 51006:t="/benefits/visaApplication";break;case 51007:t="/benefits/myInsurance";break;default:t="";break}this.$router.push({path:t,query:{id:e.id,equityId:e.equityId,memberId:e.memberId,memberName:e.memberName,memberPhone:e.memberPhone}})},dealwithSurplusNum:function(e){return""!==e&&(0===e||"0"===e?0:"无限制"===e?-1:e)}},beforeRouteLeave:function(e,t,i){"/benefits/vipCar"!=e.path&&"/benefits/selectStore"!=e.path&&"/benefits/customTraval"!=e.path&&"/benefits/visaApplication"!=e.path&&"/benefits/myInsurance"!=e.path&&"/benefits/benefitsInfo"!=e.path&&"/usercenter/myqrcode"!=e.path&&"/usercenter/passportedit"!=e.path&&this.$keepaliveHelper.deleteCache(this),i()}},o=c,u=(i("7f92"),i("0c7c")),d=Object(u["a"])(o,s,a,!1,null,"5346e674",null);t["default"]=d.exports}}]);
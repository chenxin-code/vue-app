(window.webpackJsonp=window.webpackJsonp||[]).push([[406],{"8bSg":function(t,i,a){"use strict";var e=a("FAbF");a.n(e).a},FAbF:function(t,i,a){},QFaU:function(t,i,a){"use strict";a("aO+S"),a("nXDD"),a("N0PS"),a("Cf6i")},QKzN:function(t,i,a){t.exports=a.p+"static/img/threepin.48f56eb.png"},"SS/v":function(t,i,a){t.exports=a.p+"static/img/fivepin.648d12e.png"},k4sI:function(t,i,a){"use strict";a.r(i),a("QFaU");var e=a("RL95"),o=(a("ilju"),a("5B+z")),n=a("QKzN"),s=a.n(n),r=a("SS/v"),c=a.n(r);a("oCYn").default.use(e.a).use(o.a);var d={data:function(){return{threepin:s.a,fivepin:c.a,actValid:!0,errorInfo:"活动暂未开启，敬请期待！",desc:"邀请好友，（共同战役，成功邀请三位好友拼团，即可获取加油券）",activityDesc:"",homeBackgroundImage:"",activityNo:"",threeUserActNo:"",fiveUserActNo:""}},methods:{handelName:function(){var t=this;this.activityNo||(this.activityNo=this.$util.getUrlParam(window.location.href,"activityNo")),this.$http.post("/platform/json/group_buy/getGroupActivityByNo",{activityNo:this.activityNo}).then((function(i){200==i.status?0==i.data.status?(t.activityNo=i.data.data.activityNo,t.threeUserActNo=i.data.data.threeUserActNo,t.activityDesc=i.data.data.activityDesc,t.fiveUserActNo=i.data.data.fiveUserActNo,t.homeBackgroundImage=i.data.data.homeBackgroundImage):(t.actValid=!1,t.errorInfo=i.data.info):t.$Toast({message:i.data.info,position:"bottom",duration:2e3})}))},threePin:function(){var t=this;this.$http.post("/platform/json/group_buy/StartGroup",{activityNo:this.threeUserActNo,token:this.$store.state.login.token}).then((function(i){200==i.status&&(0==i.data.status?t.$router.push({path:"/groupInvite",name:"邀请好友",query:{orderNo:i.data.data,activityNo:t.activityNo}}):t.$Toast({message:i.data.info,position:"bottom",duration:2e3}))}))},fivePin:function(){var t=this;this.$http.post("/platform/json/group_buy/StartGroup",{activityNo:this.fiveUserActNo,token:this.$store.state.login.token}).then((function(i){200==i.status&&(0==i.data.status?t.$router.push({path:"/groupInvite",name:"邀请好友",query:{orderNo:i.data.data,activityNo:t.activityNo}}):t.$Toast({message:i.data.info,position:"bottom",duration:2e3}))}))}},created:function(){var t=this;this.activityNo=this.$util.getUrlParam(window.location.href,"activityNo");var i=this.$util.getUrlParam(window.location.href,"isgetLastOredr"),a=this.$util.getUrlParam(window.location.href,"token"),e=this.$store.state.login.token;if(a||e)e||this.$store.commit("setToken",a),i?this.handelName():this.$http.post("/platform/json/group_buy/getLastOrder",{activityNo:this.activityNo,token:this.$store.state.login.token}).then((function(i){i.data.data?t.$router.push({path:"/groupInvite",name:"邀请好友",query:{orderNo:i.data.data.orderNo,secondStatus:!1}}):t.handelName()}));else{var o=window.location.origin+window.location.pathname+"#/groupIndex?activityNo="+this.activityNo,n=window.location.origin+"/app/we_chat/goPage?redirectUrl="+encodeURIComponent(o);window.location.href=n}}},h=(a("8bSg"),a("KHd+")),u=Object(h.a)(d,(function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("div",{staticClass:"friend-class"},[a("div",{directives:[{name:"show",rawName:"v-show",value:t.actValid,expression:"actValid"}]},[a("div",[a("van-image",{attrs:{width:"100%",height:"auto",fit:"contain",src:t.homeBackgroundImage}})],1),t._v(" "),a("div",{staticStyle:{"text-align":"center",display:"flex"}},[t.threeUserActNo?a("div",{staticStyle:{width:"50%",margin:"0 auto",padding:"3px"}},[a("van-image",{attrs:{width:"100%",height:"auto",fit:"contain",src:t.threepin},on:{click:t.threePin}})],1):t._e(),t._v(" "),t.fiveUserActNo?a("div",{staticStyle:{width:"50%",margin:"0 auto",padding:"3px"}},[a("van-image",{attrs:{width:"100%",height:"auto",fit:"contain",src:t.fivepin},on:{click:t.fivePin}})],1):t._e()]),t._v(" "),a("div",{staticStyle:{clear:"both"}}),t._v(" "),a("div",{staticStyle:{"font-weight":"900",padding:"5px 10px","align-self":"flex-start"}},[t._v("拼团活动规则")]),t._v(" "),a("div",{staticStyle:{"margin-top":"5px",padding:"0 10px"}},[a("div",{staticStyle:{"line-height":"20px"},domProps:{innerHTML:t._s(t.activityDesc)}})])]),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:!t.actValid,expression:"!actValid"}],staticStyle:{"margin-top":"50%",color:"#4100ff","font-size":"19px"}},[t._v("\n    "+t._s(t.errorInfo)+"\n  ")])])}),[],!1,null,"045ebc02",null);i.default=u.exports}}]);
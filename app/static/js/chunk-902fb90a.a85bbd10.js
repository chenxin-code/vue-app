(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-902fb90a"],{"41da":function(t,e,n){"use strict";n.r(e);var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("nav-top",{attrs:{title:"电子加油卡"},on:{backEvent:t.goback}}),n("nav-content",{staticStyle:{padding:"0 10px"}},[n("div",{staticClass:"card"},[n("h2",[t._v("当前余额（元）")]),n("p",{staticClass:"price"},[t._v(" ￥"),n("span",[t._v(t._s(t.userInfo.refundAmount||0))])]),n("p",[t._v(" 加油天津APP作为电子加油卡唯一使用渠道 ")])]),n("div",{staticClass:"info"},[t.showRef?n("van-cell",{attrs:{title:"申请退款","is-link":"",value:"可退款￥"+(t.userInfo.refundAmount||0)},on:{click:t.goForRefund}}):t._e(),n("van-cell",{attrs:{title:"补开发票","is-link":""},on:{click:t.goForEleCard}}),n("van-cell",{attrs:{title:"余额变动明细","is-link":""},on:{click:t.goForDetail}})],1),n("van-popup",{staticClass:"popup",style:{height:"25%",width:"70%",borderRadius:"6px"},model:{value:t.showDialog,callback:function(e){t.showDialog=e},expression:"showDialog"}},[n("div",{staticClass:"top"},[t._v(" 一旦发起退款，退款到账前申请流程不可中止，期间电子加油卡余额将不可使用，整个流程大概需要2~4个月。 ")]),n("div",{staticClass:"bottom"},[t.showInterval?n("div",{staticClass:"red-btn interval"},[n("span",[t._v(t._s(t.countTime))]),n("span",[t._v("s")])]):n("div",{staticClass:"red-btn submit",on:{click:t.toRefund}},[t._v(" 确定 ")]),n("div",{staticClass:"cancel",on:{click:t.cancelBtn}},[t._v(" 取消 ")])])])],1)],1)},s=[],i=(n("4795"),{data:function(){return{showDialog:!1,showInterval:!1,timer:null,showRef:!1,userInfo:{state:50},countTime:10}},created:function(){this.getInfo(),this.getShowRef()},methods:{goForEleCard:function(){var t={path:"/openinvoiceDetail",query:{type:"electronicCard",totalMoney:this.userInfo.refundAmount}};this.$router.push(t)},getShowRef:function(){var t=this;this.$Loading.open();var e={token:this.$store.state.login.token,clusterCode:"TIANJIN_ELECARD_REFUND_CLUSTER"};this.$http.post("/app/json/app_user_cluster/checkClusterUserByCode",e).then((function(e){t.$Loading.close();var n=e.data;0==n.status?t.showRef=n.data:t.$toast(n.info)}))["catch"]((function(e){t.$Loading.close()}))},getInfo:function(){var t=this,e={token:this.$store.state.login.token};this.$Loading.open(),this.$http.post("/app/json/app_user_ele_card_refund/userEleCardRefundDetail",e).then((function(e){var n=e.data;t.$Loading.close(),0==n.status?t.userInfo=n.data||{}:t.$toast(n.info)}))["catch"]((function(e){t.$Loading.close()}))},goback:function(){this.$router.go(-1)},goForDetail:function(){this.$router.push("/balance_change_details")},goForRefund:function(){if(0==this.userInfo.state||15==this.userInfo.state||25==this.userInfo.state)this.showDialog=!0,this.showInterval=!0;else{if(30==this.userInfo.state||!this.userInfo.refundAmount)return void this.$toast("当前无可退款金额");var t={path:"/electronic_refund_result",query:{type:2,time:this.userInfo.createTime}};this.$router.push(t)}},toRefund:function(){var t={path:"/electronic_refund",query:{refundAmount:this.userInfo.refundAmount||0}};this.$router.push(t)},countDown:function(){var t=this;clearInterval(this.timer),this.countTime=10,this.timer=setInterval((function(){t.countTime--,t.countTime<=0&&(t.showInterval=!1,clearInterval(t.timer))}),1e3)},cancelBtn:function(){this.showInterval=!1,this.showDialog=!1,clearInterval(this.timer)}},watch:{showInterval:function(t){t?this.countDown():clearInterval(this.timer)}}}),a=i,r=(n("e33c"),n("0c7c")),c=Object(r["a"])(a,o,s,!1,null,"f645a46a",null);e["default"]=c.exports},98508:function(t,e,n){},e33c:function(t,e,n){"use strict";n("98508")}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[935],{"6Oi5":function(t,e,s){"use strict";s.r(e);var a=s("db0i"),n={data:function(){return{showKeyboard:!0,show:!1,money:"",radio:"",showRecharg:!1,payStyle:{},selectedPayWay:[],submitInfo:"",moneyInp:""}},mounted:function(){this.settle()},created:function(){},methods:{onInput:function(t){this.money=this.money+t,"."===this.money.substring(0,1)&&(this.$Toast("请输入正确金额"),this.money=""),this.money=this.money.replace(/\.{2,}/g,".").replace(".","$#$").replace(/\./g,"").replace("$#$",".").replace(/^(\-)*(\d+)\.(\d\d).*$/,"$1$2.$3")},onDelete:function(){this.money=this.money.slice(0,this.money.length-1)},settle:function(){var t=this;this.$Loading.open();var e={token:this.$store.state.login.token,rechargeAmount:"10"};this.$http.post("/app/json/elec/settle",e).then((function(e){var s=e.data;if(0==s.status){var a=s.data.ouCode;t.setPayWays(a)}else t.$Toast(s.info);t.$Loading.close()}))},setPayWays:function(t){var e=this;this.selectedPayWay=[],a.a.getPayWays("150004",t).then((function(t){e.selectedPayWay=t||[],console.log(t),e.selectedPayWay.length>0&&(e.radio=0,e.payStyle=e.selectedPayWay[0])}))},nowPay:function(){var t=this;if(console.log(this.radio),""!==this.radio){this.$Loading.open();var e={token:this.$store.state.login.token,rechargeAmount:this.money};this.$http.post("/app/json/elec/submit",e).then((function(e){var s=e.data;0==s.status?(t.submitInfo=s.data,t.pay()):t.$Toast(s.info),t.$Loading.close()}))}else this.$Toast("请选择支付方式")},pay:function(){var t=this;null!=this.payStyle?a.a.elecPayEvent(this.payStyle,this.submitInfo.orderType,this.submitInfo.orderId).then((function(){t.enterSuccess()})).catch((function(){})):this.$Toast("请选择支付方式！")},enterSuccess:function(){this.$router.replace({path:"/pay-success",query:{orderType:this.submitInfo.orderType,orderId:this.submitInfo.orderId}})},changeStyle:function(t,e){this.radio=e,this.payStyle=t},recharge:function(){""!=this.money&&(""===this.radio?this.$Toast("请选择支付方式"):this.showRecharg=!0)},instructions:function(){this.$router.push({path:"/problems",query:{title:"说明",source:"2"}})}},components:{}},o=(s("X/Pg"),s("KHd+")),i=Object(o.a)(n,(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"wallet-recharge"},[s("nav-top",{attrs:{title:"充值"},on:{backEvent:function(e){return t.$router.go(-1)}}},[s("div",{staticClass:"my-cards",on:{click:function(e){return e.stopPropagation(),t.instructions(e)}}},[t._v("说明")])]),t._v(" "),s("nav-content",{staticClass:"wallet-recharge-container"},[s("div",{staticClass:"top"},[s("div",{staticClass:"title"},[t._v("充值金额")]),t._v(" "),s("div",{staticClass:"inp"},[s("div",{staticClass:"left"},[s("span",{staticClass:"icon"},[t._v("￥")]),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.money,expression:"money"}],attrs:{type:"text",readonly:"",clickable:"",placeholder:"请输入金额"},domProps:{value:t.money},on:{click:function(e){t.showKeyboard=!0},input:function(e){e.target.composing||(t.money=e.target.value)}}})]),t._v(" "),""!=t.money?s("div",{staticClass:"right",on:{click:function(e){t.money=""}}},[s("van-icon",{attrs:{name:"close",color:"#666",size:"18px"}})],1):t._e()])]),t._v(" "),s("div",{staticClass:"top"},[s("div",{staticClass:"pay-stype"},[s("div",{staticClass:"title"},[t._v("支付方式")]),t._v(" "),s("div",{staticClass:"style"},[s("van-radio-group",{model:{value:t.radio,callback:function(e){t.radio=e},expression:"radio"}},[s("van-cell-group",t._l(t.selectedPayWay,(function(e,a){return s("van-cell",{key:a,attrs:{clickable:""},on:{click:function(s){return t.changeStyle(e,a)}}},[s("div",{staticClass:"pay-label",attrs:{slot:"title"},slot:"title"},[s("img",{staticClass:"pay-icon",attrs:{src:e.icon,alt:""}}),t._v(t._s(e.text)+"\n                ")]),t._v(" "),s("van-radio",{attrs:{name:a,"checked-color":"#F80F16"},on:{click:function(s){return t.changeStyle(e,a)}}})],1)})),1)],1)],1)])]),t._v(" "),s("div",{staticClass:"submit-btn",class:{active:""==t.money},on:{click:t.recharge}},[t._v("充值")]),t._v(" "),s("van-action-sheet",{attrs:{title:"确认充值"},model:{value:t.showRecharg,callback:function(e){t.showRecharg=e},expression:"showRecharg"}},[s("div",{staticClass:"recharge-popup"},[s("div",{staticClass:"num"},[t._v("\n          ￥"),s("span",{staticClass:"text"},[t._v(t._s(t.money))])]),t._v(" "),s("div",{staticClass:"info"},[s("div",{staticClass:"details"},[s("span",{staticClass:"title"},[t._v("订单信息")]),t._v(" "),s("span",{staticClass:"content"},[t._v("钱包充值")])]),t._v(" "),s("div",{staticClass:"details"},[s("span",{staticClass:"title"},[t._v("支付方式")]),t._v(" "),s("span",{staticClass:"content"},[t._v(t._s(t.payStyle.text))])])])]),t._v(" "),s("div",{staticClass:"submit-btn",on:{click:t.nowPay}},[t._v("立即充值")])]),t._v(" "),s("van-number-keyboard",{attrs:{show:t.showKeyboard,"extra-key":".","close-button-text":"完成"},on:{blur:function(e){t.showKeyboard=!1},input:t.onInput,delete:t.onDelete},model:{value:t.moneyInp,callback:function(e){t.moneyInp=e},expression:"moneyInp"}})],1)],1)}),[],!1,null,"0fcf5061",null);e.default=i.exports},FLjA:function(t,e,s){},"X/Pg":function(t,e,s){"use strict";var a=s("FLjA");s.n(a).a}}]);
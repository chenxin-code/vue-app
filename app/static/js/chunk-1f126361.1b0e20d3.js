(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1f126361"],{a6ce:function(t,a,i){"use strict";i.r(a);var s=function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("div",{staticClass:"content"},[i("div",{staticClass:"add-pro-btn",on:{click:t.addProCard}},[i("van-icon",{attrs:{name:"add",size:"20",color:"#E20000"}}),i("p",{staticStyle:{"margin-left":"5px"}},[t._v("添加外省卡")])],1),i("div",{staticClass:"add-card-list"},t._l(t.addcardList,(function(a,s){return i("div",{key:s,staticClass:"card-item"},[i("div",{staticClass:"left"},[t._v("加油卡卡号：")]),i("div",{staticClass:"center"},[i("input",{directives:[{name:"model",rawName:"v-model",value:a.cardNumber,expression:"item.cardNumber"}],attrs:{type:"text",placeholder:"加油卡卡号"},domProps:{value:a.cardNumber},on:{input:function(i){i.target.composing||t.$set(a,"cardNumber",i.target.value)}}})]),i("div",{staticClass:"right"},[i("van-icon",{attrs:{name:"delete",size:"18"},on:{click:function(a){return t.deleteCard(s)}}})],1)])})),0),i("van-dialog",{attrs:{title:"温馨提示"},model:{value:t.ismodal,callback:function(a){t.ismodal=a},expression:"ismodal"}},[i("p",[t._v("是否解绑该加油卡？")])]),i("div",{staticClass:"bind-btns"},[i("div",{staticClass:"bind-card-btn"},[i("p",{on:{click:t.goCardlist}},[t._v("预约")])])])],1)},d=[],e=(i("4160"),i("159b"),i("498a"),i("a434"),{data:function(){return{ismodal:!1,addcardList:[{cardNumber:""}]}},mounted:function(){},methods:{goCardlist:function(){var t=this,a=[],i=!0;if(this.addcardList.forEach((function(s,d){if(!s.cardNumber||19!=s.cardNumber.trim().length)return i=!1,void t.$Toast("第".concat(d+1,"张加油卡卡号不正确"));a.push(s.cardNumber)})),i){var s={cardNoList:a};this.$request.post("/app/json/card/submitOtherProvincesCard",s).then((function(a){0==a.status?(t.$Toast("预约成功"),t.$emit("goCardlist")):t.$Toast(a.info)}))}},addProCard:function(){this.addcardList.push({cardNumber:""})},deleteCard:function(t){this.addcardList.splice(t,1)}}}),c=e,r=(i("c11c"),i("0c7c")),n=Object(r["a"])(c,s,d,!1,null,"9599bc78",null);a["default"]=n.exports},c11c:function(t,a,i){"use strict";i("d0d7")},d0d7:function(t,a,i){}}]);
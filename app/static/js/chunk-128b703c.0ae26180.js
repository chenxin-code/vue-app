(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-128b703c"],{"0b0a":function(t,a,o){"use strict";o.r(a);var i=function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("div",[i("nav-top",{on:{backEvent:function(a){return t.$router.go(-1)}}}),i("nav-content",{staticClass:"container"},[i("div",{staticClass:"info-alert"},[i("img",{staticClass:"alert-icon",attrs:{src:o("1754"),alt:""}}),i("span",{staticClass:"text"},[t._v("因会员卡部分权益需要使用您的身份信息,请务必如实填写")])]),i("div",{staticClass:"form-container"},[i("div",{staticClass:"item"},[i("div",{staticClass:"label"},[t._v("真实姓名")]),i("van-field",{staticClass:"form-input",attrs:{placeholder:"请输入您的真实姓名"},model:{value:t.formData.name,callback:function(a){t.$set(t.formData,"name",a)},expression:"formData.name"}})],1),i("div",{staticClass:"item"},[i("div",{staticClass:"label"},[t._v("身份证")]),i("van-field",{staticClass:"form-input",attrs:{placeholder:"请输入您的身份证号"},on:{blur:t.cardCodeBlur},model:{value:t.formData.idcardNum,callback:function(a){t.$set(t.formData,"idcardNum",a)},expression:"formData.idcardNum"}})],1),i("div",{staticClass:"item"},[i("div",{staticClass:"label"},[t._v("出生日期")]),i("div",{on:{click:function(a){t.isShowDatePicker=!0}}},[i("van-field",{staticClass:"form-input",attrs:{placeholder:"点击选择出生日期",readonly:""},model:{value:t.showBirthday,callback:function(a){t.showBirthday=a},expression:"showBirthday"}})],1)]),i("div",{staticClass:"item"},[i("div",{staticClass:"label"},[t._v("性别")]),i("div",{staticClass:"gender-content"},t._l(t.genderList,(function(a,o){return i("div",{key:o,staticClass:"item",class:{active:o==t.activeIndex},on:{click:function(i){return t.choseGender(a,o)}}},[t._v(t._s(a)+" ")])})),0)])]),i("div",{staticClass:"chum-public-btn"},[i("div",{staticClass:"protocol-c",on:{click:function(a){t.isShowProModal=!0}}},[t.isAgree?i("img",{staticClass:"protocol-state",attrs:{src:o("37e6d"),alt:""}}):i("img",{staticClass:"protocol-state",attrs:{src:o("aa7c"),alt:""}}),i("span",[t._v("我已阅读并同意")]),i("span",{staticClass:"red"},[t._v("《CHUM付费会员开通协议》")])]),i("van-button",{staticClass:"btn",attrs:{round:"",block:"",type:"info",color:"linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"},on:{click:t.confirmHandler}},[t._v("确定激活 ")])],1)]),i("MemberProtocol",{on:{getProtocolResult:t.getProtocolResult},model:{value:t.isShowProModal,callback:function(a){t.isShowProModal=a},expression:"isShowProModal"}}),i("van-popup",{attrs:{position:"bottom"},model:{value:t.isShowDatePicker,callback:function(a){t.isShowDatePicker=a},expression:"isShowDatePicker"}},[i("van-datetime-picker",{attrs:{"min-date":t.minDate,"max-date":t.maxDate,type:"date"},on:{confirm:t.confirmChoseBirthday,cancel:function(a){t.isShowDatePicker=!1}},model:{value:t.tempBirthday,callback:function(a){t.tempBirthday=a},expression:"tempBirthday"}})],1)],1)},e=[],s=(o("e17f"),o("2241")),r=(o("0d03"),o("ac1f"),o("5319"),o("b0c0"),o("199c")),n=o("c1df"),c=o.n(n),A={name:"perfect-information",data:function(){return{formData:{name:"",idcardNum:"",birthDate:"",cateType:0},genderList:["男","女"],activeIndex:0,isAgree:!1,isShowProModal:!1,isShowDatePicker:!1,showBirthday:"",tempBirthday:new Date("1990-01-01"),minDate:new Date(c()().subtract(70,"y").format("YYYY-MM-DD")),maxDate:new Date}},components:{MemberProtocol:r["a"]},methods:{choseGender:function(t,a){this.activeIndex=a},cardCodeBlur:function(){""!=this.formData.idcardNum?0!=this.$util.identityCodeValid(this.formData.idcardNum)?(this.showBirthday=this.$util.getBirth(this.formData.idcardNum),this.formData.birthDate=this.$util.getBirth(this.formData.idcardNum).replace("年","-").replace("月","-").replace("日","")):this.$Toast("证件号输入错误"):this.$Toast("证件号不能为空")},confirmHandler:function(){var t=this;return this.formData.name?this.formData.idcardNum?0==this.$util.identityCodeValid(this.formData.idcardNum)?(this.$Toast("证件号输入错误"),!1):this.formData.birthDate?this.isAgree?(0==this.activeIndex?this.formData.sex=1:1==this.activeIndex&&(this.formData.sex=2),this.$Loading.open(),void this.$http.post("/app/json/user/identifySubmmit",this.formData).then((function(a){t.$Loading.close();var o=a.data;0==o.status?t.toActivationCard():t.$Toast(o.info)}))["catch"]((function(a){t.$Loading.close(),t.$Toast("identifySubmmit err ".concat(a))}))):(this.$Toast("请先阅读并同意协议条款！"),!1):(this.$Toast("请选择出生日期"),!1):(this.$Toast("请输入身份证号码"),!1):(this.$Toast("请输入姓名"),!1)},toActivationCard:function(){var t=this;this.$Loading.open(),this.$http.post("/app/json/equity_card/activationCard",{id:this.$route.query.cardId}).then((function(a){t.$Loading.close();var o=a.data;0==o.status?s["a"].alert({title:"提示",message:"激活成功！"}).then((function(){t.$router.go(-1)})):t.$Toast(o.info)}))["catch"]((function(a){t.$Loading.close(),t.$Toast("activationCard err ".concat(a))}))},getProtocolResult:function(t){this.isAgree=t},confirmChoseBirthday:function(t){this.formData.birthDate=c()(t).format("YYYY-MM-DD"),this.showBirthday=c()(t).format("YYYY年MM月DD"),this.isShowDatePicker=!1}}},l=A,d=(o("d4b0"),o("0c7c")),u=Object(d["a"])(l,i,e,!1,null,"2fa31e51",null);a["default"]=u.exports},1754:function(t,a){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACpUlEQVRYR+2XP2gTURzHv793sWouLRbsJLjlXlFKFVxcSju7OXRxUJpcSh2KICiYwXZoBwUdCtHkGlzciqM4tk6dxD8o5p06CV0UGppc0NrcTy40mrZJ++6wuOSt7/1+38/97vF+3x/hPy+Kql/JWzNCUArgH0R0J55WS1FyRQLYFr/bKkhM0/FMaSEsRCQAz5GfARxn0INAkMA3CVBxW40dKkC1aA0TizkwX2orRPScyc8mUu5bXRDtCjTKTpQFIQbwVwAlMBRAgghnGDgLYACMLZ95rnfSndGB0AJo/edMuJ1Iq3vtknsFWQRhItjzfZ7VgTgQYOeFowumXXq135d5zmAG4LwuxL4AG0UpDR+rAPpjJIaOpj++1ylrzRm8zOBnANbrAhf7Ukp1itsXwHNkDsAUwPOm7WZ1xJtnao58yMANAI9MW12PBFB1pCLAYvbPJzKf3oQBqBaS54jEawbchK1kaICNvHXSEPQNQNm0VX8Y8eZZz5HrAE7UfR7om3S/t8vR8RdUnMFRAV4mYCXKAxOI1Ry5zMCoDxrrtUsrXYBuBboV6FYgVAU8R04ByDFjKZFR41FewuZDBGLbTLuL2gDl3FB/z5HNVQYkA8MJW72LAuAV5AQIRQBrpq1OaQP89QC8YNrudBTxZkzVsV4SaKSTQdnTC1o9ABlbp+MTXwL7FXk1fKRPQSddq/s8vLsp7QFoeoCgCUVWbRPYaEptbNoegD8X51+qb+dqd6EP9IStHJ5j5QHKEHA/bqtbO/YWrSdguqZrRpuxoQCqBXmFCE+D4GASEsJ4QeJnz+YvMS4ENSYlg2LJY+kPweCitUIBBBmreeuqMKjAjJ5dCmUiZMLOiKEBAtHK4+SIMMQ8AAlwHUSr7PuzYX1jo5JadTrEQ78BZJhvMPP//8MAAAAASUVORK5CYII="},"199c":function(t,a,o){"use strict";var i=function(){var t=this,a=t.$createElement,o=t._self._c||a;return o("div",[o("van-popup",{staticClass:"protocol-modal",attrs:{position:"bottom","close-on-click-overlay":!1},model:{value:t.isShowProModal,callback:function(a){t.isShowProModal=a},expression:"isShowProModal"}},[o("p",{staticClass:"title"},[t._v(t._s(t.protocolData.title))]),o("div",{staticClass:"content",domProps:{innerHTML:t._s(t.protocolData.content)}}),o("div",{staticClass:"btm-btn"},[o("van-button",{staticClass:"btn",attrs:{round:"",type:"default"},on:{click:t.disagreeHandler}},[t._v("不同意")]),o("van-button",{staticClass:"btn",attrs:{round:"",color:"linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)",type:"info"},on:{click:t.agreeHandler}},[t._v("同意 ")])],1)])],1)},e=[],s={name:"member-protocol",model:{prop:"isShowProModal",event:"change"},props:{isShowProModal:Boolean},data:function(){return{protocolData:{title:"",content:""}}},mounted:function(){this.initProtocol()},methods:{initProtocol:function(){var t=this;this.$http.post("/app/json/news/getNewsList?values=55").then((function(a){var o=a.data;0==o.status?t.protocolData=o.data[0]||{}:t.$Toast(o.info)}))["catch"]((function(a){t.$Toast("getNewsList err ".concat(a))}))},agreeHandler:function(){this.$emit("change",!1),this.$emit("getProtocolResult",!0)},disagreeHandler:function(){this.$emit("change",!1),this.$emit("getProtocolResult",!1)}}},r=s,n=(o("9aab"),o("0c7c")),c=Object(n["a"])(r,i,e,!1,null,"37c3240e",null);a["a"]=c.exports},"37e6d":function(t,a){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAAH7+Yj7AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAAB65masAAAEmElEQVRYCdVYa2wVRRT+Zu9tgd7WVBAVkhpalF5eGltbMNEEQSupwfj4gRDa/ugj8YGIEkl8YDBqQkIQhcTa1mhFCSSaIMT4IFQIYCwtBKUvpKQBraSIYKWlte3d9czE2e7j3t29t5trnR87M+d855szs7tzzgwDlcaPyjVey8KsAq5QpNZYexeyxvryH6BhgTRnilKlGAVcoalqjYnzzuVvC4Mgf85dtgGhybfgWH3FqLB13+uiIx+2gaTCWtsGtwJkX3doTvFLUibqgtIaU9+2brOWPIufD7xrAvGOwidvlEYDcT3TNI3RdFUj2NRmrG9BWV2GbWgTyNDRJ2OQRW06AmcvXa8bxQTOvLcS7V9vsgPnLXtNF96YuwhnD9fqfd7QGVv2bcT8R95A6IZsXDx90ATiHfFVSOmpPa9ACaTKrqnWGaVUjQzJpqm2AU1aQ8f9zRjArk3GGgLF2b+a/kJXI2dAtuepOPOMahMmDBetw+2PvjXK9G/L9Pps2iiCrPzHcVN4CZo/fSqK1vI9SMS8hzeCMYZTX2yQImRm3YFZi1eLneSX45/rcmvD8bea89DLCE5Ix8SMqTj2cSXtXu7vz3HKbV++aXXAta/Q3PpcUXEAFL6dEGlDHDYxoYFAYDrjWlqfStrLttAapcdEOykYGgtL6+6mF6nRDl9xgIgWO+G96grL6hTHt+yVSMeRpwn/KTqJsUFB019CIh8/hIHUEHictJaEPGRKEPkr3kHX9/VWvkSmzFBQUo2f9ryK4YHesRMWltWi7atNGOy9YCPjAtuU6eMUO0w0NNd1HqxG38Uz0dRCZiM8sXst8p7YiuDE60xGBSXv41zTblw+12ySWzs2wpHBqzixaw3ylm9BSlqmwOev3I6eju/Q07bfam/rR90PR/7ux/Gdq5G/chuGaOF7f2vF+aZdNuNoApuHEhQZHkDzzmfQf6mL1u09KXatYxJyS3V4EGcatruSGAGOhEag17a/hBROfCWkHft5hccBr9NxxFFcKiytrRUxpXlH1bSIqn7iVyhwHNiLkmdxirLqrpKaC0wEPDrNeLFLNkYcvUQ0TvbIHsfjvtHxLMFUweMgY4KRb77+JWNyJobxuHcw6uYfYzK+iJXgBISLXkD61BxcpbjZTsHYqSTPQabgtvuexvV0Lhnqv4KTn62n+g8n34QuKQ7OWLgK/JgeGRpAC922XLt83tUxCXB18NZFTyKQmoazh6rB4348Zdr8YmTlPQZVHcHp/VspT2iJx1xgXXP/FEqVwg+uw6TM6bh2pRsd324Gz3qcypSchci5p1xAeCp6qfOIE9xR5+qgtOZHUf5xp03OwgBlmB3fbLalrRk3h5F7/xq6J0lB94970X1yrzRPuPbsoByBZ/zhorUITZmBwb960E6OBukTmL30Rcp2Q/i98yi6jn4o4WOu43ZQjhhImYTcB56j7WKmEP3Z3ULZ3ja6pYxIiC91wg76MroHknEfSf4HDtK1gIeV/m8g/MqC3674de3j6yxEyk83P5KUX4k37aiq0DSVdlg2N+l5orhw01oZUz4oKKmp41dS3Ld/AFmuY9fC7uBoAAAAAElFTkSuQmCC"},"7d61d":function(t,a,o){},"9aab":function(t,a,o){"use strict";o("f123")},aa7c:function(t,a){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAADC0lEQVR4Xu3dP2/TUBQF8HvrRPFAhbrSiQUGpCyAmBjCwAhUfAGYouaPbBYQfAAQLNhqkqpDBV8ARFckmoEJAUsHJFiYylpBGBIl6UXPaqFpQ2v3dEpORtvHkX8+0pOX+1TG/OI4vmhmz0Tk2rjzU3hsXVXvB0Hwef+z694D7XY7t7GxEYlIxcxUVbfMbM3zvDVV/aKqP6rV6u9JBmw2m6fM7MxwOLxgZjdU9aaZzamqiUirWCyGpVJpsGvwF7DVas31+/1XZlZS1a6IPPd9/2m5XP45yWBHPdvKysrpbrf7QETumZmvqu18Pn+7UqlsuWwCuNO8tw5PRDY9z7tVr9c/HXXzaTq/tLR0aTgcvhGReYdYLBavuyYmgHEcN8ys6vAKhcKVxcXFzWnCSfusy8vL871e78MOYjMIgpq6BUNEPopIb2Zm5iqbdzina+L29vZ7ESmIyGWNouidW21V9UkQBI/Svo1pvi6O48dm9lBE1h2gW263fN8/O+0LRtpS7Cws35PV2QGKyMswDO+mvQGvE4mi6IWI3EkAPc9bqNfrboXhL6VAHMcLZvY6Aczlcudrtdq3lFleJiKNRuPcYDD4mgDm8/nZSf/COOm37r5Y+v1+JwEMw3Dkk+6k/2xS75cswAQ8/usl4PHtkiQBCQgKgHE2kICgABhnAwkICoBxNpCAoAAYZwMJCAqAcTaQgKAAGGcDCQgKgHE2kICgABhnAwkICoBxNpCAoAAYZwMJCAqAcTaQgKAAGGcDCQgKgHE2kICgABhnAwkICoBxNpCAoAAYZwMJCAqAcTaQgKAAGGcDCQgKgHE2kICgABhnAwkICoBxNpCAoAAYZwMJCAqAcTaQgKAAGGcDCQgKgHE2kICgABhnA08KkIN3skuurq7OdjqdXxz9lN0uSYyMfuLwseyKI8PHOP4uO+DI+DsOYMwGuH8AI0eAZvNzQ3v/jQDlENpsegeG0Lo4xyCnQxw7BtlFOYj7aMBDB3G7OEfBj0dMNQp+N8rNCESOvRnBXn9uh3Ggjf/dDuMPY+LsM8OGfmQAAAAASUVORK5CYII="},d4b0:function(t,a,o){"use strict";o("7d61d")},f123:function(t,a,o){}}]);
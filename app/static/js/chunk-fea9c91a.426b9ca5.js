(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-fea9c91a","chunk-612ce34b"],{"22b4":function(t,e,a){"use strict";a("67c0")},2999:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("transition",{attrs:{name:"slide"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],staticClass:"virtual-keyboard",on:{touchstart:function(t){t.stopPropagation()}}},t._l(t.keyboard,(function(e,n){return i("div",{key:n,staticClass:"keyboard-row"},[3===n?i("span",{staticClass:"keyboard-item fn-key",on:{click:t.changeKey}},[t._v(t._s(1===t.keyType?"ABC":"中文"))]):t._e(),t._l(e,(function(e){return i("span",{staticClass:"keyboard-item",class:{"flex-shrink":2===n||3===n},style:{width:2===n||3===n?t.keyWidth:"auto"},on:{click:function(a){return t.inputKey(e)}}},[t._v(t._s(e))])})),3===n?i("span",{staticClass:"keyboard-item fn-key"},[i("img",{staticClass:"delete",attrs:{src:a("b2be"),alt:""},on:{click:t.deleteKey}})]):t._e()],2)})),0)])},n=[],s=(a("a9e3"),a("4795"),{name:"",props:{show:Boolean,type:{type:Number,default:1}},data:function(){return{vanShow:!0,keyboardZh:[["京","津","渝","沪","冀","晋","辽","吉","黑","苏"],["浙","皖","闽","赣","鲁","豫","鄂","湘","粤","琼"],["川","贵","云","陕","甘","青","蒙","桂","宁","新"],["藏","使","领","警","学","港","澳"]],keyboardEn:[[1,2,3,4,5,6,7,8,9,0],["Q","W","E","R","T","Y","U","I","O","P"],["A","S","D","F","G","H","J","K","L"],["Z","X","C","V","B","N","M"]],keyboard:[],keyWidth:0,keyType:1}},methods:{setWidth:function(){this.keyWidth=document.querySelectorAll(".keyboard-item")[0].clientWidth+"px"},changeKey:function(){this.keyType=1===this.keyType?0:1,this.keyboard=1===this.keyType?this.keyboardZh:this.keyboardEn},deleteKey:function(){this.$emit("delete")},inputKey:function(t){this.$emit("input",t)},onBlur:function(){this.$emit("blur"),this.$emit("update:show",!1)},selfHandler:function(){this.$emit("update:show",!0)},handler:function(t){document.body[(t?"add":"remove")+"EventListener"]("touchstart",this.onBlur)}},mounted:function(){this.keyType=this.type,this.keyboard=1==this.keyType?this.keyboardZh:this.keyboardEn,this.handler(!0)},destroyed:function(){this.handler(!1)},activated:function(){this.handler(!0)},deactivated:function(){this.handler(!1)},watch:{show:function(t){t&&(clearTimeout(this.timer),this.timer=setTimeout(this.setWidth,20))},type:function(t){t&&(this.keyType=t,this.keyboard=1==this.keyType?this.keyboardZh:this.keyboardEn,this.handler(!0))}},components:{}}),o=s,r=(a("8bdc"),a("0c7c")),c=Object(r["a"])(o,i,n,!1,null,"02c6819a",null);e["default"]=c.exports},"67c0":function(t,e,a){},"6afa":function(t,e,a){},"8bdc":function(t,e,a){"use strict";a("6afa")},b2be:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABV0lEQVRYhe2Wy23DMAyGNUJG8FEAfwIawSNkBI+QEbKBR/Eldx8yQEYIMoFHcA+lAFa2JDp1ChQwAR7y/D4wfMS5I474D0FEFwDjzjkAaK3w+UM5WOETM5+9980eSURBvvdhhqevhRBOth/QuRDCiYg6/bgoIPApA+8AzET0tEgIbJDPdFUBAazCY0gTVSU0HMAY35sVANBGuC7ZOxI5eFZAGmPSpapFTqIEXxVI4BcLPCdRgy8ENJyZ+y3wVALAC8CtBF8IRNt34UrirhbM3dCc3wLM3FeXQiWSss8AXmYBsY8lHH8JH2MlSiO6EJAnHlslcg1nHNGfVd8qUev2kkR2EVklLKNWkiiuYjkcz9xkWOElieox8t43ud2gTmkVviLRmQQUaHU7Ami3nGPnnNOHzSSgJOJsX5n5vEfGk27aPYnE3/4lSySuzNzvmd77xiRwxBGfjC/Uf6m5/t20ZAAAAABJRU5ErkJggg=="},ceee:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"body"},[a("nav-top",{attrs:{title:"在线签约"},on:{backEvent:function(e){return t.$router.go(-1)}}}),a("nav-content",[a("div",{staticClass:"tipDiv"},[a("p",{staticClass:"box"},[t._v("签约信息")]),a("div",{staticClass:"table-view"},[a("div",{staticClass:"table-view-cell"},[a("div",{staticClass:"table-view-cell-text"},[a("div",{staticClass:"left"},[a("img",{staticClass:"img1",attrs:{src:"static/image/janePay/icon_VIPNumber.png",alt:""}}),a("span",[t._v("会员手机号")])]),a("div",{staticClass:"center"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.phone,expression:"phone"}],attrs:{type:"text",disabled:""},domProps:{value:t.phone},on:{input:function(e){e.target.composing||(t.phone=e.target.value)}}})])])]),t.$store.state.globalConfig.density_free_sign_type.length>1?a("div",{staticClass:"table-view-cell"},[a("div",{staticClass:"table-view-cell-text"},[a("div",{staticClass:"left"},[a("img",{staticClass:"img1",attrs:{src:"static/image/janePay/renzheng.png",alt:""}}),a("span",[t._v("签约方式")])]),a("div",{staticClass:"center"},[a("van-radio-group",{staticClass:"radioBtn",on:{change:t.selectRadio},model:{value:t.radio,callback:function(e){t.radio=e},expression:"radio"}},[a("div",{staticClass:"radioBtnDiv"},[1==t.singWay1?a("van-radio",{attrs:{name:"3","checked-color":"#ff884f"}},[t._v("标签号")]):t._e(),2==t.singWay2?a("van-radio",{attrs:{name:"1","checked-color":"#ff884f"}},[t._v("身份证号")]):t._e(),3==t.singWay3?a("van-radio",{attrs:{name:"2","checked-color":"#ff884f"}},[t._v("车牌号")]):t._e()],1)])],1)])]):t._e(),"3"==t.radio?a("div",[a("div",{staticClass:"table-view-cell"},[a("div",{staticClass:"table-view-cell-text"},[a("div",{staticClass:"left"},[a("img",{staticClass:"img1",attrs:{src:"static/image/janePay/icon_OilCard.png",alt:""}}),a("span",[t._v("标签号")])]),a("div",{staticClass:"center"},[a("mt-field",{attrs:{label:"",placeholder:"扫码或手动输入卡编号"},on:{input:t.changeRfrCodeType},model:{value:t.tidSign,callback:function(e){t.tidSign=e},expression:"tidSign"}},[a("img",{attrs:{src:"static/image/fuelcard//btn_Sweep.png",width:"25",height:"25"},on:{click:t.sweep}})])],1)])]),a("div",{staticClass:"table-view-cell"},[a("div",{staticClass:"table-view-cell-text"},[a("div",{staticClass:"left"},[a("img",{staticClass:"img1",attrs:{src:"static/image/janePay/icon_recommended.png",alt:""}}),a("span",[t._v("车牌号")])]),a("div",{staticClass:"center"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.plateNum,expression:"plateNum"}],staticClass:"carint",attrs:{type:"text",readonly:"",placeholder:"请输入车牌号"},domProps:{value:t.plateNum},on:{focus:t.focus,touchstart:function(t){t.stopPropagation()},input:function(e){e.target.composing||(t.plateNum=e.target.value)}}})])])])]):t._e(),"1"==t.radio&&1==t.shenfenView?a("div",[a("div",{staticClass:"table-view-cell"},[a("div",{staticClass:"table-view-cell-text"},[a("div",{staticClass:"left"},[a("img",{staticClass:"img1",attrs:{src:"static/image/janePay/ren.png",alt:""}}),a("span",[t._v("姓名")])]),a("div",{staticClass:"center"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.shenfen.name,expression:"shenfen.name"}],attrs:{placeholder:"请输入姓名",type:"text"},domProps:{value:t.shenfen.name},on:{input:function(e){e.target.composing||t.$set(t.shenfen,"name",e.target.value)}}})])])]),a("div",{staticClass:"table-view-cell"},[a("div",{staticClass:"table-view-cell-text"},[a("div",{staticClass:"left"},[a("img",{staticClass:"img1",attrs:{src:"static/image/janePay/icon_recommended.png",alt:""}}),a("span",[t._v("身份证号")])]),a("div",{staticClass:"center"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.shenfen.idcardNum,expression:"shenfen.idcardNum"}],attrs:{type:"text",readonly:"",placeholder:"请输入身份证号"},domProps:{value:t.shenfen.idcardNum},on:{focus:t.focus,touchstart:function(t){t.stopPropagation()},input:function(e){e.target.composing||t.$set(t.shenfen,"idcardNum",e.target.value)}}})])])])]):t._e(),"2"==t.radio?a("div",{staticClass:"table-view-cell"},[a("div",{staticClass:"table-view-cell-text"},[a("div",{staticClass:"left"},[a("img",{staticClass:"img1",attrs:{src:"static/image/janePay/ren.png",alt:""}}),a("span",[t._v("姓名")])]),a("div",{staticClass:"center"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.chepai.ownerName,expression:"chepai.ownerName"}],attrs:{placeholder:"请输入姓名",type:"text"},domProps:{value:t.chepai.ownerName},on:{input:function(e){e.target.composing||t.$set(t.chepai,"ownerName",e.target.value)}}})])])]):t._e(),"2"==t.radio?a("div",{staticClass:"table-view-cell",on:{click:t.cheColor}},[a("div",{staticClass:"table-view-cell-text"},[a("div",{staticClass:"left"},[a("img",{staticClass:"img1",attrs:{src:"static/image/janePay/icon_colour.png",alt:""}}),a("span",[t._v("车牌颜色")])]),a("div",{staticClass:"center right1"},[a("mt-field",{attrs:{disabled:t.disabled},model:{value:t.colorstyle,callback:function(e){t.colorstyle=e},expression:"colorstyle"}})],1),a("i",{staticClass:"icon iconfont mall-arrow-down"})])]):t._e(),"2"==t.radio?a("div",{staticClass:"table-view-cell"},[a("div",{staticClass:"table-view-cell-text"},[a("div",{staticClass:"left"},[a("img",{staticClass:"img1",attrs:{src:"static/image/janePay/icon_recommended.png",alt:""}}),a("span",[t._v("车牌号")])]),a("div",{staticClass:"center"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.plateNum,expression:"plateNum"}],staticClass:"carint",attrs:{type:"text",readonly:"",placeholder:"请输入车牌号"},domProps:{value:t.plateNum},on:{focus:t.focus,touchstart:function(t){t.stopPropagation()},input:function(e){e.target.composing||(t.plateNum=e.target.value)}}})]),t.actions.length>0?a("i",{staticClass:"icon iconfont mall-arrow-down",on:{click:t.morePlate}}):t._e(),a("van-action-sheet",{attrs:{id:"xialaView",actions:t.actions},on:{select:function(e){return t.onSelect(e,t.item)}},model:{value:t.showxiala,callback:function(e){t.showxiala=e},expression:"showxiala"}})],1)]):t._e(),a("div",{staticClass:"table-view-cell",on:{click:t.pays}},[a("div",{staticClass:"table-view-cell-text"},[a("div",{staticClass:"left"},[a("img",{staticClass:"img1",attrs:{src:"static/image/janePay/icon_Signing2.png",alt:""}}),a("span",[t._v("签约支付方")])]),a("div",{staticClass:"center right1"},[a("mt-field",{attrs:{disabled:t.disabled},model:{value:t.styleMoney1,callback:function(e){t.styleMoney1=e},expression:"styleMoney1"}}),a("mt-field",{staticStyle:{display:"none"},attrs:{disabled:t.disabled},model:{value:t.way,callback:function(e){t.way=e},expression:"way"}})],1),a("i",{staticClass:"icon iconfont mall-arrow-down"})])]),t.$store.state.globalConfig.preAuthAmountViewPermission&&t.preAuthAmountView?a("div",{staticClass:"table-view-cell"},[a("div",{staticClass:"table-view-cell-text"},[a("div",{staticClass:"left"},[a("img",{staticClass:"img1",attrs:{src:"static/image/janePay/icon_OilCard.png",alt:""}}),a("span",[t._v("预授权金额")])]),a("div",{staticClass:"center"},[a("mt-field",{attrs:{label:"",placeholder:"请输入预授权金额"},model:{value:t.preAuthAmount,callback:function(e){t.preAuthAmount=e},expression:"preAuthAmount"}},[a("van-icon",{attrs:{name:"question-o"},on:{click:t.getTips}})],1)],1)])]):t._e(),a("div",{staticClass:"table-view-cell"},[a("div",{staticClass:"table-view-cell-text"},[a("div",{staticClass:"left"},[a("img",{staticClass:"img1",attrs:{src:"static/image/janePay/icon_OilCard.png",alt:""}}),a("span",[t._v("推荐人")])]),a("div",{staticClass:"center"},[a("mt-field",{attrs:{label:"",placeholder:"扫码或手动输入推荐人"},on:{input:t.changeRfrCodeType},model:{value:t.referrer,callback:function(e){t.referrer=e},expression:"referrer"}},[a("img",{attrs:{src:"static/image/fuelcard//btn_Sweep.png",width:"25",height:"25"},on:{click:t.sweepReferrer}})])],1)])]),a("div",{staticClass:"btns"},[a("div",{staticClass:"div1"},[a("van-checkbox",{attrs:{"checked-color":"#ff884f"},on:{click:t.allSelect},model:{value:t.allRadio,callback:function(e){t.allRadio=e},expression:"allRadio"}},[t._v("我已阅读并同意 "),a("router-link",{attrs:{to:"/jane/agreement"}},[t._v("《加油支付协议》")])],1)],1),a("div",{staticClass:"div2",on:{click:t.passfreeQuery}},[t._v("下一步")])])])])]),a("virtual-keyboard",{attrs:{show:t.show},on:{input:t.inputKey,delete:t.deleteKey,blur:function(e){t.show=!1}}}),a("van-overlay",{attrs:{show:t.toastView},on:{click:function(e){t.toastView=!1}}},[t.toastView?a("div",{staticClass:"toast"},[t._v("当车辆进站后，已签约用户发起预授权后冻结预授权金额，加油后再实际扣款(如所填预授权金额小于实际加油金额将禁止使用此支付方式)")]):t._e()]),a("van-action-sheet",{attrs:{actions:t.actions1},on:{select:t.onSelect1},model:{value:t.show1,callback:function(e){t.show1=e},expression:"show1"}}),a("van-action-sheet",{attrs:{actions:t.actions2},on:{select:t.onSelect2},model:{value:t.show2,callback:function(e){t.show2=e},expression:"show2"}}),a("van-action-sheet",{attrs:{actions:t.actionsche},on:{select:t.onSelectche},model:{value:t.showche,callback:function(e){t.showche=e},expression:"showche"}}),a("van-overlay",{attrs:{show:t.showSigned}},[a("div",{staticClass:"wrapper",on:{click:function(t){t.stopPropagation()}}},[a("div",{staticClass:"block"},[a("div",{staticClass:"Signed"},[a("img",{attrs:{src:"static/image/janePay/chenggong.png",alt:""}}),a("p",[t._v("恭喜您签约成功")])]),a("div",{staticClass:"sureBtn",on:{click:t.signed}},[t._v("确定")])])])])],1)},n=[],s=(a("e7e5"),a("d399")),o=(a("e17f"),a("2241")),r=a("5530"),c=(a("c975"),a("b0c0"),a("4795"),a("4160"),a("159b"),a("a434"),a("ac1f"),a("1276"),a("d7b9"),a("2f62")),l=a("2999"),u=(a("da71"),a("75bd"),a("f109")),p={name:"signing",mixins:[u["a"]],data:function(){return{showSigned:!1,plateNum:"",radio:"",referrer:"",rfrCodeType:"",disabled:!0,allRadio:!0,colorstyle:"蓝",toastView:!1,way:"",waySub:"",show:!1,actions:[],showxiala:!1,shenfenView:!1,styleMoney1:"",styleMoney:"",cardStyle:"",cardType:"",preAuthAmountView:!1,preAuthAmount:null,show2:!1,actions2:[{name:"借记卡",id:"1"},{name:"贷记卡",id:"3"},{name:"合并卡",id:"A"}],tidSign:"",show1:!1,actions1:[],showche:!1,actionsche:[{name:"绿"},{name:"黄"},{name:"蓝"},{name:"白"},{name:"黑"}],signingstyle:"",gonghangView:!1,id:"",phone:"",shenfen:{},chepai:{},list:[],signType:"",isweChat:[],backUUID:"",singWay1:"",singWay2:"",singWay3:"",hasToSign:!1,isSign:!1}},computed:Object(r["a"])({},Object(c["c"])(["userInfo"])),mounted:function(){var t=this;this.getPhone();var e="";e=this.$store.state.globalConfig.density_free_sign_type||"",""==e?(this.singWay1=1,this.singWay2=2,this.singWay3=3):(e.indexOf("1")>=0&&(this.singWay1=1),e.indexOf("2")>=0&&(this.singWay2=2),e.indexOf("3")>=0&&(this.singWay3=3),"1"==e.substring(0,1)?this.radio="3":"2"==e.substring(0,1)?this.radio="1":"3"==e.substring(0,1)&&(this.radio="2")),this.backUUID=this.$util.randomString(),this.listenAndriodBack(),this.isauthentication(),this.chepaiList(),this.$bridgefunc.enterForegroundCallBack((function(){t.hasToSign&&t.checkSignResult()}))},methods:{checkSignResult:function(){this.hasToSign=!1},listenAndriodBack:function(){var t=this;this.$bridgefunc.registeBridge("phonebridge",(function(e){var a=JSON.parse(e);a.type==t.backUUID&&o["a"].close()}))},signed:function(){this.showSigned=!1,this.$router.go(-1)},onSelect1:function(t){this.show1=!1,this.styleMoney1=t.name,this.way=t.payWayName,this.waySub=t.payWayModel,this.isSign=!1,"340002"==this.waySub?(this.gonghangView=!0,4==this.$store.state.globalConfig.pass_free_preAuth_type?this.preAuthAmountView=!0:this.preAuthAmountView=!1):"310001"==this.waySub?this.gonghangView=!0:"305004"==this.waySub?1==this.$store.state.globalConfig.pass_free_preAuth_type?this.preAuthAmountView=!0:this.preAuthAmountView=!1:"210007"==this.waySub?3==this.$store.state.globalConfig.pass_free_preAuth_type?this.preAuthAmountView=!0:this.preAuthAmountView=!1:"305006"==this.waySub?5==this.$store.state.globalConfig.pass_free_preAuth_type?this.preAuthAmountView=!0:this.preAuthAmountView=!1:"320004"==this.waySub&&(2==this.$store.state.globalConfig.pass_free_preAuth_type?this.preAuthAmountView=!0:this.preAuthAmountView=!1)},getTips:function(){var t=this;t.toastView=!0,setTimeout((function(){t.toastView=!1}),1e4)},passfreeQuery:function(){var t=this,e=this;if("305006"==this.waySub||"320004"==this.waySub){var a={token:this.$store.state.login.token,payModelSub:e.waySub,plateNo:e.plateNum};e.jiansheData(a).then((function(e){if("success"==e.data.result){var a=e.data.data||{};if(a.contractCode)return void(t.showSigned=!0);t.nextIndex()}else Object(s["a"])(e.data.info)}))}else this.nextIndex()},openWxService:function(){var t=this,e={payModelSub:this.waySub,plateNo:this.plateNum,openid:this.$store.state.login.wxOpenid};this.$request.post("/app/json/user/openWxService",e).then((function(e){if(0==e.status){t.$Loading.close();var a=e.data.info;t.$bridgefunc.wxFreePay(a)}else t.$Toast(e.info)}))},sweepReferrer:function(){var t=this;this.$bridgefunc.scanCode((function(e){t.rfrCodeType=2,t.referrer=e.code}))},pays:function(){var t=this;if("2"==t.radio){if("绿"==t.colorstyle){if(8!=t.plateNum.length)return void t.$Toast("请输入8位车牌号")}else if(7!=t.plateNum.length)return void t.$Toast("请输入7位车牌号")}else if("3"==t.radio&&7!=t.plateNum.length)return void t.$Toast("请输入7位车牌号");this.show1=!0},cheColor:function(){this.showche=!0},cardpays:function(){this.show2=!0},onSelect2:function(t){this.show2=!1,this.cardStyle=t.name,this.cardType=t.id},onSelectche:function(t){this.colorstyle=t.name,this.showche=!1},selectRadio:function(t){this.radio=t,this.isauthentication()},morePlate:function(){this.showxiala=!0},onSelect:function(t){this.showxiala=!1,this.plateNum=t.name},getPhone:function(){var t=this;this.$request.post("/app/json/user_auth/findUserPhone",{}).then((function(e){0===e.status?t.phone=e.data:t.$Toast(e.info)}))},isauthentication:function(){var t=this,e=this;this.gonghangView=!1;var a={token:this.$store.state.login.token};e.judgeData(a).then((function(a){"success"==a.data.result?(e.isweChat=JSON.parse(a.data.data.payWayModel)||[],e.isweChat.forEach((function(t){"ETC"==t.payWayName?t.name="工行ETC":t.name=t.payWayName})),e.actions1=e.isweChat,e.actions1.forEach((function(t,a){"305006"==t.payWayModel&&(e.actions1.splice(a,1),e.actions1.unshift(t))})),e.styleMoney1=e.actions1[0].payWayName,e.waySub=e.actions1[0].payWayModel,e.way=e.actions1[0].payWayName,"340002"==e.actions1[0].payWayModel?(t.gonghangView=!0,4==t.$store.state.globalConfig.pass_free_preAuth_type&&(t.preAuthAmountView=!0)):"310001"==e.actions1[0].payWayModel?t.gonghangView=!0:"305004"==e.actions1[0].payWayModel?1==t.$store.state.globalConfig.pass_free_preAuth_type&&(t.preAuthAmountView=!0):"210007"==e.actions1[0].payWayModel?3==t.$store.state.globalConfig.pass_free_preAuth_type&&(t.preAuthAmountView=!0):"305006"==e.actions1[0].payWayModel?5==t.$store.state.globalConfig.pass_free_preAuth_type&&(t.preAuthAmountView=!0):"320004"==e.actions1[0].payWayModel&&2==t.$store.state.globalConfig.pass_free_preAuth_type&&(t.preAuthAmountView=!0),"1"==e.radio?1==a.data.data.isCertificate?(e.shenfen=a.data.data.usercertificate||{},e.shenfenView=!0):(e.shenfenView=!1,t.$bridgefunc.andriodaddback(t.backUUID,(function(){o["a"].alert({title:"提示",message:"请先完成实名认证"}).then((function(){t.$bridgefunc.delandriodback(t.backUUID,(function(){t.authentication()}))}))}))):"2"==e.radio&&1==a.data.data.isVehicle&&(e.plateNum=a.data.data.vehicleModel.plateNum||"",e.chepai=a.data.data.vehicleModel||{})):Object(s["a"])(a.data.info)}))},authentication:function(){this.$router.push({path:"/real-name-authentication"})},chepaiList:function(){var t=this,e={token:this.$store.state.login.token};t.chepaiData(e).then((function(e){if("success"==e.data.result){var a=e.data.data||[];a.forEach((function(t){t.name=t.plateNum})),t.actions=a}}))},focus:function(){this.show=!0,document.activeElement.blur()},inputKey:function(t){this.plateNum.length<8&&(this.plateNum=this.plateNum+t)},deleteKey:function(){this.plateNum=this.plateNum.substr(0,this.plateNum.length-1)},changeRfrCodeType:function(){this.rfrCodeType=1},nextIndex:function(){var t=this,e=this;if(0!=e.allRadio)if(1!=e.isSign){if("1"==e.radio)e.signType=3,e.colorstyle="";else if("2"==e.radio){if("绿"==e.colorstyle){if(8!=e.plateNum.length)return void e.$Toast("请输入8位车牌号")}else if(7!=e.plateNum.length)return void e.$Toast("请输入7位车牌号");e.signType=2,e.colorstyle=e.colorstyle}else if("3"==e.radio){if(16!=e.tidSign.length)return void e.$Toast("请输入16位标签");if(7!=e.plateNum.length)return void e.$Toast("请输入7位车牌号");e.signType=1,e.colorstyle=e.colorstyle}if(1!=this.preAuthAmountView||e.preAuthAmount){var a="/app/json/user/applySign",i={token:this.$store.state.login.token,plateNo:e.plateNum?e.plateNum:"",generateKey:e.tidSign?e.tidSign:"",payModelSub:e.waySub,signType:e.signType,idCardNo:e.shenfen.idcardNum?e.shenfen.idcardNum:"",returnUrl:window.location.origin+"/app-vue/app/index.html#/jane/complete",plateColor:e.colorstyle,preAuthAmount:e.preAuthAmount,referrer:e.referrer?this.referrer:""};if(this.$Loading.open(),"340002"==e.waySub||"310001"==e.waySub)this.$Loading.close(),i.cardType=e.cardType,i.phone=e.phone,"310001"==e.waySub?(i.title="平安银行签约信息",i.types=1):(i.title="农行签约信息",i.types=2),e.$router.push({path:"/jane/agriculturalBank",query:{bankMessage:i}});else if("210009"==e.waySub){if(!e.$store.state.login.wxOpenid)return this.$Toast("请先进行微信绑定"),void this.$router.push("/usercenter/bindwechat");var n={payModelSub:e.waySub,plateNo:e.plateNum,openid:e.$store.state.login.wxOpenid};this.$request.post("/app/json/user/queryWxOpenstate",n).then((function(a){t.$Loading.close(),0==a.status?a.data.contractCode?(e.$Toast("已签约成功"),t.$router.go(-1)):t.openWxService():t.$Toast(a.info)}))}else e.$http.post(a,i).then((function(a){t.$Loading.close(),"success"==a.data.result?"305004"==e.waySub?t.$bridgefunc.customPush({path:window.location.origin+"/app-vue/app/index.html#/jane/janeView",isnativetop:"1",superback:1,query:{info:encodeURIComponent(JSON.stringify(i))}}):("320004"==e.waySub||"305006"==e.waySub)&&(t.$Loading.close(),e.$bridgefunc.customPush({path:a.data.data.info,isnativetop:"1",superback:1})):e.$Toast(a.data.info)}))}else e.$Toast("请输入预授权金额")}else e.$Toast("您已经签约过了");else e.$Toast("请勾选同意协议")},getvar:function(t,e){for(var a=t.split("?"),i=a[1].split("&"),n=i.length-1;n>=0;n--){var s=i[n].split("=");if(s[0]==e)return s[1]}return!1},sweep:function(){var t=this;this.$bridgefunc.scanCode((function(e){t.rfrCodeType=2,t.tidSign=e.code}))},allSelect:function(){var t=this;t.allRadio=!t.allRadio}},components:{VirtualKeyboard:l["default"]}},d=p,h=(a("22b4"),a("0c7c")),f=Object(h["a"])(d,i,n,!1,null,"465496ce",null);e["default"]=f.exports},d7b9:function(t,e,a){"use strict";a("e17f");var i=a("2241"),n=(a("e7e5"),a("d399")),s=a("d4ec"),o=a("bee2");a("d3b7"),a("c975"),a("ac1f"),a("466d"),a("1276"),a("a15b"),a("d81d"),a("0d03"),a("25f0"),a("fb6a"),a("e25e");function r(){var t=window.navigator.userAgent.toLowerCase();return"micromessenger"==t.match(/MicroMessenger/i)}var c=a("5530"),l=a("da71"),u=a("bc3a"),p=a.n(u),d=a("a026"),h=a("a78e"),f=a.n(h),g=a("4328"),m=a.n(g);d["default"].use(n["a"]),d["default"].use(i["a"]);var y=p.a.create({baseURL:l["a"].baseURL,timeout:1e4,responseType:"json",withCredentials:!1,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}});y.interceptors.request.use((function(t){n["a"].loading({mask:!0,duration:0});var e=f.a.get("usertoken");return"post"===t.method?t.data=m.a.stringify(Object(c["a"])(Object(c["a"])({},t.data),{},{token:e})):"get"===t.method&&(t.params=Object(c["a"])(Object(c["a"])({},t.params),{},{token:e})),t}),(function(t){return Promise.reject(t)})),y.interceptors.response.use((function(t){return n["a"].clear(),-1==t.data.status&&t.data.info.indexOf("用户信息为空")>-1&&i["a"].confirm({title:"提示",message:"用户信息失效, 请重新登录"}).then((function(){})),t}),(function(t){return n["a"].clear(),Promise.reject(t)}));var v=y,w=a("378f"),b=a("653a"),C=function(){function t(e){Object(s["a"])(this,t),this.jsApiList=e}return Object(o["a"])(t,[{key:"share",value:function(t,e,a,i){return r()?this._wxShare(t,e,a,i):this._appShare(t,e,a,i)}},{key:"chooseImage",value:function(t){return r()?this._wxChooseImage(t):this._appChooseImage()}},{key:"_wxChooseImage",value:function(t){var e=this;return new Promise((function(a,i){e._init(["chooseImage","uploadImage"]).then((function(){wx.chooseImage({count:t||1,sourceType:["camera"],sizeType:["original"],success:function(t){var e=t.localIds[0];wx.getLocalImgData({localId:e,success:function(t){var e=t.localData,i=e.substr(e.indexOf(",")+1);a({imagedata:[i]})}})}})}))}))}},{key:"_wxUploadImage",value:function(t){return new Promise((function(e,a){wx.uploadImage({localId:t,isShowProgressTips:1,success:function(t){e(t.serverId)}})}))}},{key:"_wxShare",value:function(t,e,a,i){var n=this;return new Promise((function(s,o){n._init(["onMenuShareTimeline","onMenuShareAppMessage","updateAppMessageShareData","updateTimelineShareData"]).then((function(){wx.onMenuShareTimeline({title:t,link:e,imgUrl:a,success:function(){s()}}),wx.onMenuShareAppMessage({title:t,desc:i,link:e,imgUrl:a,success:function(){s()}}),wx.updateAppMessageShareData({title:t,desc:i,link:e,imgUrl:a,success:function(){}}),wx.updateTimelineShareData({title:t,link:e,imgUrl:a,success:function(){}})}))}))}},{key:"_appShare",value:function(t,e,a,i){if("new"==b["a"].state.globalConfig.yht_protocol_type){var n={title:t,sharetext:i,imageurl:a,detailurl:e};w["a"].share(n)}else{var s={type:"share",para:{title:t,sharetext:i,imageurl:a,detailurl:e}};location.href=location.origin+"?appprotocol="+encodeURIComponent(JSON.stringify(s))}}},{key:"_appUploadImage",value:function(t){var e="appCallbackUploadImage",a={type:"webuploadimage",para:{callback:e,num:t||1}};return location.href=location.origin+"?appprotocol="+encodeURIComponent(JSON.stringify(a)),new Promise((function(t){window[e]=function(e){t(e)}}))}},{key:"_appChooseImage",value:function(){if("new"==b["a"].state.globalConfig.yht_protocol_type)return new Promise((function(t){w["a"].getPhoto(3,(function(e){var a=[];a.push(e),t({imagedata:a})}))}));var t="photoCallBack",e={type:"nativephoto",para:{type:"3"}};return location.href=location.origin+"?appprotocol="+encodeURIComponent(JSON.stringify(e)),new Promise((function(e){window[t]=function(t){e(t)}}))}},{key:"scanCode",value:function(){if("new"==b["a"].state.globalConfig.yht_protocol_type)return new Promise((function(t){w["a"].scanCode((function(e){t(e)}))}));var t="qrCallBack",e={type:"qrscan"};return location.href=location.origin+"?appprotocol="+encodeURIComponent(JSON.stringify(e)),new Promise((function(e){window[t]=function(t){e(t)}}))}},{key:"wxSign",value:function(t){if("new"==b["a"].state.globalConfig.yht_protocol_type)w["a"].wxFreePay(t);else{var e={type:"wxfreepay",para:{pre_entrustweb_id:t}};location.href=location.origin+"?appprotocol="+encodeURIComponent(JSON.stringify(e))}}},{key:"getLocation",value:function(){return new Promise((function(t){wx.getLocation({type:"wgs84",success:function(t){}})}))}},{key:"_init",value:function(t){var e=this;return new Promise((function(a,i){e._getConfig().then((function(e){wx.config({appId:e.appid,timestamp:e.timestamp,nonceStr:e.nonce,signature:e.signature,jsApiList:t}),wx.ready((function(){a()})),wx.error((function(t){i(t)}))}))["catch"]((function(t){i()}))}))}},{key:"_getConfig",value:function(){return new Promise((function(t,e){var a="",i=navigator.userAgent,n=!!i.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);a=n?window.initUrl:window.location.href.split("#")[0],v.post("/app/json/wx/getAccessToken",{url:encodeURIComponent(a)}).then((function(e){0===e.data.status&&t(Object.assign({},e.data.data,e.data.data.signature))}))["catch"]((function(t){e(t)}))}))}},{key:"openNewPage",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if("new"==b["a"].state.globalConfig.yht_protocol_type)w["a"].newPage({weburl:t,isnativetop:!0});else{var a={type:"newpage",para:{isnative:e,islogin:!0,isnativetop:!0,isopen:!0}};e?a.para.code=t:a.para.weburl=t,location.href=location.origin+"?appprotocol="+encodeURIComponent(JSON.stringify(a))}}},{key:"finishPage",value:function(){var t={type:"finish"};location.href=location.origin+"?appprotocol="+encodeURIComponent(JSON.stringify(t))}},{key:"openLogin",value:function(){var t={type:"login"};location.href=location.origin+"?appprotocol="+encodeURIComponent(JSON.stringify(t))}},{key:"chooseImg",value:function(){var t=this;return new Promise((function(e,a){t.chooseImage().then((function(t){if(t.imagedata&&t.imagedata.length){var a=t.imagedata[0];v.get("/app/json/app_youdi/getSunboxToken").then((function(t){var s=t.data.data;n["a"].loading({mask:!0,duration:0}),p.a.post("/uploadFile",m.a.stringify({base64File:a,fileType:"png",fileName:"1",token:s,bucketName:"default_file"})).then((function(t){var s=t.data.data,o={imgUrl:s,baseImgUrl:a};n["a"].clear(),s?e(o):i["a"].alert({title:"提示",message:"上传失败！"})}))}))}}))}))}}]),t}();e["a"]=new C},f109:function(t,e,a){"use strict";var i="/app/json/user/getSignTagListByUserId",n="/app/json/user/getSignDetail",s="/app/json/user/brokageSign",o="/app/json/user/getSignLogListByUserId",r="/app/json/user/applySign",c="/app/json/app_shopping_order/queryEasyPayOrder",l="/app/json/user/getSignDetailById",u="/app/json/user/checkIdentifyAllDetail",p="/app/json/user/getVehicleListByUserId",d="/app/json/user/queryBankCardType",h="/app/json/user/signAgreementConfirm",f="/app/json/user/signResendReq",g="/app/json/user/passfreeQuery",m="/app/json/user/confirmCompletetSign",y="/app/json/user/cancelApply";e["a"]={methods:{gongcompleteData:function(t){return this.$http.post(m,t)},jiansheData:function(t){return this.$http.post(g,t)},duanxinData:function(t){return this.$http.post(f,t)},messageData:function(t){return this.$http.post(h,t)},leixing:function(t){return this.$http.post(d,t)},chepaiData:function(t){return this.$http.post(p,t)},judgeData:function(t){return this.$http.post(u,t)},signlistData:function(t){return this.$http.post(i,t)},signlistdetailData:function(t){return this.$http.post(n,t)},jieyueData:function(t){return this.$http.post(s,t)},jiluData:function(t){return this.$http.post(o,t)},nextData:function(t){return this.$http.post(r,t)},orderData:function(t){return this.$http.post(c,t)},successData:function(t){return this.$http.post(l,t)},cancelApply:function(t){return this.$http.post(y,t)}}}}}]);
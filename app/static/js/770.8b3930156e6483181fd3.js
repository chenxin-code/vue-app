(window.webpackJsonp=window.webpackJsonp||[]).push([[770],{BERX:function(n,i,t){"use strict";var o=t("m+5i");t.n(o).a},bfK0:function(n,i,t){"use strict";t.r(i);var o={data:function(){return{information:{empNo:"",realName:"",depId:"",depName:"",unitId:"",unitName:"",orgid:""}}},mounted:function(){this.getUserEmpByUserId()},methods:{backEvent:function(){this.$router.go(-1)},getUserEmpByUserId:function(){var n=this;this.$request.post("/app/json/user/getUserEmpByUserId").then((function(i){0==i.status?(n.information=Object.assign({},i.data),n.information.orgid?n.information.status=!0:(n.information.orgid="未绑定",n.information.status=!1)):n.$Toast(i.info)}))},binding:function(){var n=this;"未绑定"==this.information.orgid||""==this.information.orgid?this.$bridgefunc.scanCode((function(i){n.information.orgid=i.code})):this.$request.post("/app/json/user/bindUserEmpQrCode",{orgid:this.information.orgid}).then((function(i){0==i.status?n.information.status=!1:n.$Toast(i.info)}))}}},a=(t("BERX"),t("KHd+")),e=Object(a.a)(o,(function(){var n=this,i=n.$createElement,t=n._self._c||i;return t("div",[t("nav-top",{on:{backEvent:n.backEvent}}),n._v(" "),t("nav-content",[t("div",{staticClass:"information"},[t("van-cell-group",[t("van-field",{attrs:{label:"员工编号","input-align":"right",readonly:!0},model:{value:n.information.empNo,callback:function(i){n.$set(n.information,"empNo",i)},expression:"information.empNo"}}),n._v(" "),t("van-field",{attrs:{label:"员工姓名","input-align":"right",readonly:!0},model:{value:n.information.realName,callback:function(i){n.$set(n.information,"realName",i)},expression:"information.realName"}}),n._v(" "),t("van-field",{attrs:{label:"油站编码","input-align":"right",readonly:!0},model:{value:n.information.depId,callback:function(i){n.$set(n.information,"depId",i)},expression:"information.depId"}}),n._v(" "),t("van-field",{attrs:{label:"油站名称","input-align":"right",readonly:!0},model:{value:n.information.depName,callback:function(i){n.$set(n.information,"depName",i)},expression:"information.depName"}}),n._v(" "),t("van-field",{attrs:{label:"所属分公司","input-align":"right",readonly:!0},model:{value:n.information.unitName,callback:function(i){n.$set(n.information,"unitName",i)},expression:"information.unitName"}}),n._v(" "),t("van-field",{attrs:{label:"二维码序号","input-align":"right",readonly:!0},model:{value:n.information.orgid,callback:function(i){n.$set(n.information,"orgid",i)},expression:"information.orgid"}})],1)],1)]),n._v(" "),n.information.status?n._e():t("div",{staticClass:"bottom-btns"},[t("span",{on:{click:n.binding}},[n._v(n._s("未绑定"==n.information.orgid||""==n.information.orgid?"二维码绑定":"提交"))])])],1)}),[],!1,null,"1b6f67ac",null);i.default=e.exports},"m+5i":function(n,i,t){}}]);
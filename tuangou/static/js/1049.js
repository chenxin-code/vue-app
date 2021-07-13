(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1049],{

/***/ "./src/views/micro-shop/open-microshop/api.js":
/*!****************************************************!*\
  !*** ./src/views/micro-shop/open-microshop/api.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar applyUrl = '/app/json/micro_store_front_end/applyMicroStore'; // 申请微店\n\nvar stateUrl = '/app/json/micro_store_front_end/queryMicroStoreOpenState'; // 微店状态查询\n\nvar stateUrlhn = '/app/json/micro_store_front_end/queryMicroStoreOpenProcess'; // 河南微店状态查询\n\nvar profitUrl = '/app/json/micro_store_front_end/queryMicroStoreForProfit'; //累计微店收益\n\nvar getRewardUrl = '/app/json/micro_store_front_end/getRewardTypeList'; //\n\nvar profitUrlhn = '/app/json/micro_store_front_end/cashEarningsDetail'; //河南现金收益\n\nvar monthUrl = '/app/json/micro_store_front_end/getMonthProfitList'; //收益月度排名\n\nvar detailUrl = '/app/json/micro_store_front_end/getEmployeeInfoByUserId'; //开通微店查详情\n\nvar modifyUrl = '/app/json/micro_store_front_end/queryMicroStoreForDecoration'; //装修前\n\nvar modifyafterUrl = '/app/json/micro_store_front_end/updateMicroStoreInfoById'; //装修修改\n\nvar modifyBankUrl = '/app/json/micro_store_front_end/saveBankInfo'; //银行卡修改\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  methods: {\n    applyData: function applyData(params) {\n      return this.$http.post(applyUrl, params);\n    },\n    stateData: function stateData(params) {\n      return this.$http.post(stateUrl, params);\n    },\n    stateDatahn: function stateDatahn(params) {\n      return this.$http.post(stateUrlhn, params);\n    },\n    profitData: function profitData(params) {\n      return this.$http.post(profitUrl, params);\n    },\n    profitDatahn: function profitDatahn(params) {\n      return this.$http.post(profitUrlhn, params);\n    },\n    monthData: function monthData(params) {\n      return this.$http.post(monthUrl, params);\n    },\n    detailData: function detailData(params) {\n      return this.$http.post(detailUrl, params);\n    },\n    modifyData: function modifyData(params) {\n      return this.$http.post(modifyUrl, params);\n    },\n    getRewardData: function getRewardData(params) {\n      return this.$http.post(getRewardUrl, params);\n    },\n    modifyafterData: function modifyafterData(params) {\n      return this.$http.post(modifyafterUrl, params);\n    },\n    modifyBankData: function modifyBankData(params) {\n      return this.$http.post(modifyBankUrl, params);\n    }\n  }\n});\n\n//# sourceURL=webpack:///./src/views/micro-shop/open-microshop/api.js?");

/***/ })

}]);
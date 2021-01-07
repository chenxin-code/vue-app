const signlistUrl = '/app/json/user/getSignTagListByUserId' //查询用户的签约列表(标签管理列表)
const signlistdetailUrl = '/app/json/user/getSignDetail' //查询用户的签约列表详情(标签管理列表11)
const jieyueUrl = '/app/json/user/brokageSign' //解约极简支付
const jiluUrl = '/app/json/user/getSignLogListByUserId' //记录查询列表(0解约)
const nextUrl = '/app/json/user/applySign' //下一步
const orderUrl = '/app/json/app_shopping_order/queryEasyPayOrder' //简付订单查询接口
const successUrl = '/app/json/user/getSignDetailById' //成功的详情
const judgeUrl = '/app/json/user/checkIdentifyAllDetail' //查询是否实名认证、驾驶证认证，车辆认证的接口
const chepaiUrl = '/app/json/user/getVehicleListByUserId' //根据userid查询添加车辆的列表
const cardleixingUrl = '/app/json/user/queryBankCardType' // 银行卡类型列表
const messageUrl = '/app/json/user/signAgreementConfirm' // 签约成功调的接口
const duanxinUrl = '/app/json/user/signResendReq' // 短信接口
const jiansheUrl = '/app/json/user/passfreeQuery' // 建行签约前调用查询车牌是否签约接口
const gongcompleteUrl = '/app/json/user/confirmCompletetSign' // 工行签约成功调用的接口
const cancelApplyUrl = '/app/json/user/cancelApply' // 取消申请
export default {
  methods: {
    gongcompleteData(params) {
      return this.$http.post(gongcompleteUrl, params)
    },
    jiansheData(params) {
      return this.$http.post(jiansheUrl, params)
    },
    duanxinData(params) {
      return this.$http.post(duanxinUrl, params)
    },
    messageData(params) {
      return this.$http.post(messageUrl, params)
    },
    leixing(params) {
      return this.$http.post(cardleixingUrl, params)
    },
    chepaiData(params) {
      return this.$http.post(chepaiUrl, params)
    },
    judgeData(params) {
      return this.$http.post(judgeUrl, params)
    },
    signlistData(params) {
      return this.$http.post(signlistUrl, params)
    },
    signlistdetailData(params) {
      return this.$http.post(signlistdetailUrl, params)
    },
    jieyueData(params) {
      return this.$http.post(jieyueUrl, params)
    },
    jiluData(params) {
      return this.$http.post(jiluUrl, params)
    },
    nextData(params) {
      return this.$http.post(nextUrl, params)
    },
    orderData(params) {
      return this.$http.post(orderUrl, params)
    },
    successData(params) {
      return this.$http.post(successUrl, params)
    },
    cancelApply(params){
      return this.$http.post(cancelApplyUrl,params);
    },
  }
}

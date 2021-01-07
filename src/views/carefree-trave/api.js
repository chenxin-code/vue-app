const ticketListUrl = '/app/json/app_travel/queryTicketList' // 门票列表和详情接口、日历
const orderUrl = '/app/json/app_travel/queryTicketList' // 我的订单接口
const orderdetailUrl = '/app/json/app_travel/detail' // 订单详情
const orderdetail1Url = '/app/json/app_shopping_order/detail' // 已完成订单详情
const placeorderUrl = '/app/json/app_travel/placeAnOrder' // 下单接口
const cancelorderUrl = '/app/json/app_travel/cancelOrder' // 取消订单
const payorderUrl = '/app/json/app_travel/placingOrder' // 支付成功接口
const afterUrl = '/app/json/app_travel/queryAfterSaleList' // 售后列表接口
const afterdetailUrl = '/app/json/app_travel/queryAfterSaleList' // 售后详情（处理中、已完成）接口
const afterapplyUrl = '/app/json/app_travel/submitAfterSale' // 售后申請情（待申请）接口
export default {
  methods: {
    ticketListData(params) {
      return this.$http.post(ticketListUrl, params)
    },
    orderData(params) {
      return this.$http.post(orderUrl, params)
    },
    orderdetailData(params) {
      return this.$http.post(orderdetailUrl, params)
    },
    orderdetail1Data(params) {
      return this.$http.post(orderdetail1Url, params)
    },
    placeorderData(params) {
      return this.$http.post(placeorderUrl, params)
    },
    cancelorderData(params) {
      return this.$http.post(cancelorderUrl, params)
    },
    payorderData(params) {
      return this.$http.post(payorderUrl, params)
    },
    afterData(params) {
      return this.$http.post(afterUrl, params)
    },
    afterdetailData(params) {
      return this.$http.post(afterdetailUrl, params)
    },
    afterapplyData(params) {
      return this.$http.post(afterapplyUrl, params)
    },
  }
}

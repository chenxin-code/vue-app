const robUrl = '/app/json/app_shopping_order/startOrderActivity' //抢
const profitUrl = '/app/json/app_shopping_order/queryOrderAward' //查参与抢券明细的接口
const receivestateUrl = '/app/json/app_shopping_order/getIsCanJoinActivity' //抢的状态
export default {
  methods: {
    robData(params) {
      return this.$http.post(robUrl, params)
    },
    profitData(params) {
      return this.$http.post(profitUrl, params)
    },
    receivestateData(params) {
      return this.$http.post(receivestateUrl, params)
    },
  }
}

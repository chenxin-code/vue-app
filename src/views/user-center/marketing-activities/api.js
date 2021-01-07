const activelistUrl = '/app/json/app_market/queryCanAttendActivity' //获取可参与活动列表
const yugaolistUrl = '/app/json/app_market/queryCanAttendActivityNotStart' //下期预告
const historylistUrl = '/app/json/app_market/queryCanAttendActivityHistory' //历史
const recordUrl = '/app/json/app_market/queryMyAwardGroupByActivity' //参与记录
export default {
  methods: {
    activelistData(params) {
      return this.$http.post(activelistUrl, params)
    },
    yugaolistData(params) {
      return this.$http.post(yugaolistUrl, params)
    },
    historylistData(params) {
      return this.$http.post(historylistUrl, params)
    },
    recordData(params) {
      return this.$http.post(recordUrl, params)
    },
  }
}

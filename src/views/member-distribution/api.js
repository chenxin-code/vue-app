const profitUrl = '/app/json/app_distribution_user/myProfits' //我的收益-我的粉丝-加载更多
// const profitUrl1 = '/app/json/app_distribution_user/myProfitsHb' //我的收益-我的粉丝-加载更多（河北小程序）
const profitUrl1 = '/app/json/app_distribution_user/mySell' //我的收益-我的粉丝-加载更多（河北小程序）
const detailUrl = '/app/json/app_distribution_user/myProfitsDetail' //我的收益-收益详情
const detailUrl1 = '/app/json/app_distribution_user/myProfitsDetailHb' //我的收益-收益详情（河北小程序）
export default {
  methods: {
    profitData(params) {
      return this.$http.post(profitUrl, params)
    },
    profitData1(params) {
      return this.$http.post(profitUrl1, params)
    },
    detailData(params) {
      return this.$http.post(detailUrl, params)
    },
    detailData1(params) {
      return this.$http.post(detailUrl1, params)
    },
  }
}

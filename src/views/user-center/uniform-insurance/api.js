const commitUrl = '/app/json/car_insure/applyInsure' //一键投保
const offerlistUrl = '/app/json/car_insure/myApplyInsure' //我的报价单
export default {
  methods: {
    commitData(params) {
      return this.$http.post(commitUrl, params)
    },
    offerlistData(params) {
      return this.$http.post(offerlistUrl, params)
    }
  }
}

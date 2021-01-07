const paymentBaseListUrl = '/account/json/acct_rewards/getPaymentBaseList' // 油豆
// '/account/json/acct_points/getPaymentBaseList'

export default {
  methods: {
    getPaymentBaseList (params) {
      return this.$http.post(paymentBaseListUrl, params)
    }
  }
}
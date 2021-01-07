const paymentBaseListUrl = '/account/json/acct_emp_rewards/getPaymentBaseList' // 油豆
// '/account/json/acct_points/getPaymentBaseList'

export default {
  methods: {
    getPaymentBaseListUrl (params) {
      return this.$http.post(paymentBaseListUrl, params)
    }
  }
}
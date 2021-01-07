const writelisttUrl = '/app/json/coupon/getUnUsedCouponsByMch' //获取用户商户券列表接口
const writeUrl = '/app/json/coupon/useCouByUser' //用户核销券接口
export default {
  methods: {
    writelistData(params) {
      return this.$http.post(writelisttUrl, params)
    },
    writeData(params) {
      return this.$http.post(writeUrl, params)
    }
  }
}

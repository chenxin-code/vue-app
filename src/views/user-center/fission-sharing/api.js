const listUrl = '/app/json/fission_activity/getShareUsedCoupons' // 1.	获取分享券列表接口

const shareUrl = '/app/json/fission_activity/share' // 2.	获取分享内容接口

const prizeUrl = '/app/json/fission_activity/sharedReceiveAward' // 3.	分享后自动领取奖励接口

const detailUrl = '/app/json/fission_activity/shareDetails' // 4.	分享页面详情接口

const getlUrl = '/app/json/fission_activity/beSharedReceiveAward' // 5.	领取优惠券接口

export default {
  methods: {
    listData(params) {
      return this.$http.post(listUrl, params)
    },
    sharecont(params) {
      return this.$http.post(shareUrl, params)
    },
    prize(params) {
      return this.$http.post(prizeUrl, params)
    },
    detailData(params) {
      return this.$http.post(detailUrl, params)
    },
    getData(params) {
      return this.$http.post(getlUrl, params)
    },
  }
}

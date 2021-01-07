export default {
  data() {
    return {
      aliasUrl: '/app/json/app_dict/getDictByAlias',
      commonAreasList: [],
      OnlineCarList: [],
      commonOilList: []
    }
  },
  mounted() {
    // 常用油品
    this.$request.post(this.aliasUrl, {alias: 'industry_commonOilProducts'}).then(res => {
      if (res.status == 0) {
        this.commonOilList = res.data || []
      }
    })
    //  网约车类型
    this.$request.post(this.aliasUrl, {alias: 'industry_onlineCarTypes'}).then(res => {
      if (res.status == 0) {
        this.OnlineCarList = res.data || []
      }
    })
    // 常驻地区
    this.$request.post(this.aliasUrl, {alias: 'industry_commonAreas'}).then(res => {
      if (res.status == 0) {
        this.commonAreasList = res.data || []
      }
    })
  }
}
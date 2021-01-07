const applyUrl = '/app/json/micro_store_front_end/applyMicroStore' // 申请微店

const stateUrl = '/app/json/micro_store_front_end/queryMicroStoreOpenState' // 微店状态查询

const stateUrlhn = '/app/json/micro_store_front_end/queryMicroStoreOpenProcess' // 河南微店状态查询

const profitUrl = '/app/json/micro_store_front_end/queryMicroStoreForProfit' //累计微店收益

const getRewardUrl = '/app/json/micro_store_front_end/getRewardTypeList' //

const profitUrlhn = '/app/json/micro_store_front_end/cashEarningsDetail' //河南现金收益

const monthUrl = '/app/json/micro_store_front_end/getMonthProfitList' //收益月度排名

const detailUrl = '/app/json/micro_store_front_end/getEmployeeInfoByUserId' //开通微店查详情

const modifyUrl = '/app/json/micro_store_front_end/queryMicroStoreForDecoration' //装修前

const modifyafterUrl = '/app/json/micro_store_front_end/updateMicroStoreInfoById' //装修修改

const modifyBankUrl = '/app/json/micro_store_front_end/saveBankInfo' //银行卡修改

export default {
  methods: {
    applyData(params) {
      return this.$http.post(applyUrl, params)
    },
    stateData(params) {
      return this.$http.post(stateUrl, params)
    },
    stateDatahn(params) {
      return this.$http.post(stateUrlhn, params)
    },
    profitData(params) {
      return this.$http.post(profitUrl, params)
    },
    profitDatahn(params) {
      return this.$http.post(profitUrlhn, params)
    },
    monthData(params) {
      return this.$http.post(monthUrl, params)
    },
    detailData(params) {
      return this.$http.post(detailUrl, params)
    },
    modifyData(params) {
      return this.$http.post(modifyUrl, params)
    },
    getRewardData(params) {
      return this.$http.post(getRewardUrl, params)
    },
    modifyafterData(params) {
      return this.$http.post(modifyafterUrl, params)
    },
    modifyBankData(params) {
      return this.$http.post(modifyBankUrl, params)
    }
  }
}

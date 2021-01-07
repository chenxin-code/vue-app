const participateUrl = '/app/json/questionaire/startAnswer' // 判断用户是否有资格参与
const questionUrl = '/app/json/questionaire/appUserConfig' // 加载试题
const questionUrlDefault = '/app/json/questionaire/getDefaultConfig' // 新接口加载试题1
const commitUrl = '/app/json/questionaire/submit' // 提交试题
const prizeUrl = '/app/json/questionaire/completeAct' // 答题结束后调用返回奖品
const listUrl = '/app/json/questionaire/findQuestionaireByuserId' // 问券列表
const historyUrl = '/app/json/questionaire/historyQuestionaireList' // 问券历史列表
const historydetailUrl = '/app/json/questionaire/questionaireDetail' // 问券历史列表详情
export default {
  methods: {
    participateData(params) {
      return this.$http.post(participateUrl, params)
    },
    questionData(params) {
      return this.$http.post(questionUrl, params)
    },
    questionUrlData(params) {
      return this.$http.post(questionUrlDefault, params)
    },
    commitData(params) {
      return this.$http.post(commitUrl, params)
    },
    prizeData(params) {
      return this.$http.post(prizeUrl, params)
    },
    listData(params) {
      return this.$http.post(listUrl, params)
    },
    historyData(params) {
      return this.$http.post(historyUrl, params)
    },
    historydetailData(params) {
      return this.$http.post(historydetailUrl, params)
    }
  }
}

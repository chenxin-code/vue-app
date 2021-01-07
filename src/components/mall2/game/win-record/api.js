const queryGameAwardDistUrl = '/app/json/app_game/queryGameAwardDist' // 获取我的奖品列表
export default {
  methods: {
    // 获取我的奖品列表
    queryGameAwardDist(params) {
      return this.$http.post(queryGameAwardDistUrl, params)
    }
  }
}
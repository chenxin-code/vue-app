const queryUrl = '/app/json/micro_store_front_end/getCollectMicroStoreByUserId' //查询已收藏店铺列表
const upUrl = '/app/json/micro_store_front_end/sortOrCancelMicroStoreCollect' //店铺置顶与取消置顶
const collectionUrl = '/app/json/micro_store_front_end/addOrCancelMicroStoreCollect' //店铺收藏与取消收藏

export default {
  methods: {
    applyData(params) {
      return this.$http.post(queryUrl, params)
    },
    upData(params) {
      return this.$http.post(upUrl, params)
    },
    collectionData(params) {
      return this.$http.post(collectionUrl, params)
    },

  }
}

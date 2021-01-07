<template>
  <div>

  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  mounted() {
    let timeDate = new Date().getTime()
    let tempScope = 'openid,phone'
    if (this.$store.state.globalConfig.abc_third_client_scope) {
      tempScope = this.$store.state.globalConfig.abc_third_client_scope
    }
    if (this.$store.state.globalConfig.abc_third_client_id) {
      let queryObj = {
        client_id: this.$store.state.globalConfig.abc_third_client_id,
        redirect_uri: encodeURIComponent(`${window.location.origin}/app-vue/app/static/abc.html`),
        state: timeDate,
        scope: tempScope,
        response_type: 'code'
      }
      // let queryStr = JSON.stringify(queryObj).replace(/\"/g, "\\\"")
      let queryStr = JSON.stringify(queryObj)
      let urlStr = `https://www.abchina.com/luascript/oauthLogin/${queryStr}`
      console.log(urlStr)
      window.top.location.href = urlStr
    } else {
      this.$Toast('未配置 abc_third_client_id')
    }
  }
}
</script>
<style scoped>
  
</style>
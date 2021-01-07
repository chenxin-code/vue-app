<template>
  <div class="container"></div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  mounted() {
    this.$http.post("/app/json/user_info/findStationCityCodeHjzx", {})
      .then(res => {
        let data = res.data;
        if (data.status == 0) {
          let entryUrl = `https://cc.cnooc.com.cn/zhyIM/webchat.html?phone=${ window.btoa(window.encodeURIComponent(data.data.phone)) }&standardCode=${ window.btoa(window.encodeURIComponent(data.data.standardCode)) }`
          this.$bridgefunc.customPush({
            path: entryUrl,
            isnativetop: '1',
          })
        } else {
          this.$Toast(data.info)
        }
      })
      .catch(err => {
        this.$Toast(`findStationCityCodeHjzx err ${err}`)
      });
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/deploy/cnooc/assets/stylus/cnooc-variable.styl';
@import '~@/deploy/cnooc/assets/stylus/cnooc-public.styl';
  
</style>
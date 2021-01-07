<template>
  <div>
    <!--<div>{{jsonData1}}</div>-->
    <!--<div>{{jsonData}}</div>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import Cookie from 'js-cookie'

  export default {
    name: '',
    data() {
      return {
        jsonData: '',
        jsonData1: ''
      }
    },
    created() {
      let code = this.$util.getUrlParam(window.location.href, 'code')
      let jygduserid = this.$util.getUrlParam(window.location.href, 'jygduserid')
      let token = this.$util.getUrlParam(window.location.href, 'token')
      let url = ''
      if (code) {
        url = this.$store.state.globalConfig.wxBaseUrl + '/app/json/wechat_etp/login?authCode='+code
        window.location.replace(url)
        // url = '/app/json/wechat_etp/login?authCode='+code
        // this.$router.replace({
        //   path: url
        // })
      } else if (jygduserid) {
        code = jygduserid
        url = '/app/json/login/JYGDUserAutoLogin'
      } else if (token) {
        code = token
        url = '/app/json/login/palmtopUserAutoLogin'
      }
      this.$http.post(url, {authCode: code}).then(res => {
        let data = res.data
        if (data.status == 0) {
          let url = '/common'
          if (data.data.redirectUrl && data.data.redirectUrl != undefined && data.data.redirectUrl != '') {
            url = data.data.redirectUrl;
          }
          if (url.indexOf("http") == 0) {
            // weburl = window.location.href.split('#')[0] + '#' + weburl
            url = url.split('#')[1]
          }

          Cookie.set('IS_FJSH', '1')
          this.$userCenter.saveLoginData(data.data);

          this.$router.replace({
            path: url
          })
        } else {
          this.jsonData = JSON.stringify(data)
        }
      })
    },
    methods: {},
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
</style>

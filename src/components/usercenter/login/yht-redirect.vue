/**Created by liaoyingchao on 2020-05-26.*/

<template>
  <div class="yht-redirect">
    
  </div>
</template>

<script>
  import Cookie from 'js-cookie'

  export default {
    name: "yht-redirect",
    components: {},
    data() {
      return {
        path: '',
        pathToken: ''
      }
    },
    methods: {
      getUserInfo: function () {
        let token = Cookie.get('usertoken')
        if (!token || token == '') {
          token = this.pathToken
        }
        let url = '/app/json/app_youdi/getSunboxToken';
        let paramsData = {
          token: token
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              let sunboxToken = data.data;
              this.doRedirect(sunboxToken)
            } else {
              this.$Toast(data.info)
            }
          },
          error => {
            this.$Toast('请求数据失败！')
          }
        );
      },
      doRedirect: function (token) {

        let latitude = Cookie.get('latitude') || ''// 40
        let longitude = Cookie.get('longitude') || ''// 116
        let toPath = this.path
        if (toPath.indexOf("?") != -1) {
          toPath = toPath + '&'
        } else {
          toPath = toPath + '?'
        }
        toPath += 'token=' + token + '&lng=' + longitude + '&lat=' + latitude + '&webtype=' + this.$store.state.webtype + '&pickupId=' + this.$store.state.mall2.zitiAddress.id + '&isYHT=' + '1';
        window.location.replace(toPath)
      }
    },
    created() {
      this.path = this.$route.query.redirect
      this.pathToken = this.$route.query.token
      this.getUserInfo()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .yht-redirect {
    width 100%
    height 100%
    overflow hidden
  }
</style>

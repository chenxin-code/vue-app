<template>
  <div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cusToken: '',
      type: '', // 为空的时候表示为掌厅配置的页面, 2 掌厅原配置， 3 走内容中心配置
      link: {}, // 内容中心配置的link
    }
  },
  mounted() {
    this.type = this.$route.query.type || ''
    this.link = this.$route.query.link ? JSON.parse(decodeURIComponent(this.$route.query.link)) : {}
    if (this.type == 4) {
      this.link = {
        type: '2',
        url: '/common'
      }
    }
    if (this.$route.query.token) {
      this.getUserToken()
    } else {
      this.getRedUrl()
    }
  },
  methods: {
    getUserToken() {
      this.$http.post('/app/json/login/palmtopUserAutoLogin', {
        code: this.$route.query.token
      }).then(res => {
        let data = res.data
        if (data.status == 0) {
          this.cusToken = data.data.token || ''
          this.$store.state.userInfo = data.data
          this.$store.state.login.bindCardState = data.data.bindCardState
          this.$store.state.login.phone = data.data.phone;
          this.$store.state.login.token = data.data.token
          this.$bridgefunc.vuexStorage(() => {
            if (this.type == '3' || this.type == '4') {
              this.redirectToPage()
            } else {
              this.getRedUrl()
            }
          }, true)
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Toast(`palmtopUserAutoLogin err ${err}`)
      })
    },
    getUserInfo: function (toPath) {
      this.$Loading.open()
      let url = '/app/json/user/getUserInfo';
      let params1 = {
        token: this.cusToken,
        hbsy_web_tag_type: '0'
      }
      this.$http.post(url, params1).then(res => {
        this.$Loading.close();
        let data = res.data;
        if (data.status == 0) {
          data.data.token = this.cusToken
          this.$store.state.userInfo = data.data
          this.$store.state.login.bindCardState = data.data.bindCardState
          this.$store.state.login.phone = data.data.phone;
          this.$store.state.login.token = this.cusToken
          if (this.type == '3' || this.type == '4') {
            this.$bridgefunc.vuexStorage(() => {
              this.link.isztRedirect = true
              this.$market.enterNav({
                link: this.link
              })
            }, true)
          } else {
            toPath += '&phone=' + this.$store.state.userInfo.phone + '&userId=' + this.$store.state.userInfo.userId
            window.location.replace(toPath)
          }
        } else {
          this.$Toast(data.info)
        }
      }, error => {
        this.$Loading.close();
        this.$Toast('请求数据失败！')
      })
    },
    redirectToPage: function (toPath) {
      if (this.type == '3' || this.type == '4') {
        this.link.isztRedirect = true
        this.$market.enterNav({
          link: this.link
        })
      } else {
        toPath += '&phone=' + this.$store.state.userInfo.phone + '&userId=' + this.$store.state.userInfo.userId
        window.location.replace(toPath)
      }
    },
    getRedUrl() {
      this.$http.post('/app/json/app_vue_page/getRedirectUrl', {
        channelUrl: 'link-configuration',
        funcCode: this.$route.query.funcCode,
      }).then(res => {
        let data = res.data
        if (data.status == 0) {
          // console.log(data.data)
          if (data.data) {
            if (data.data.indexOf('hasPgCodeType') > -1) { // 编码类型
              if (this.$util.isZTAPP() && this.type == '') {
                window.location.replace(window.location.origin + '/app-vue/app/index.html#/blockindex?pgCode=' + data.data.split('=')[1] + '&token=' + this.cusToken)
              } else {
                window.location.replace(window.location.origin + '/app-vue/app/index.html#/common?pgCode=' + data.data.split('=')[1] + '&token=' + this.cusToken)
              }
            } else if (data.data.indexOf('http') > -1) { // 完整路径形式
              window.location.replace(data.data)
            } else if (data.data.indexOf('/app-vue/game/index.html') > -1) { // game
              let path = window.location.origin + data.data + '&token=' + this.cusToken
              this.redirectToPage(path)
              // path += '&phone=' + this.$store.state.userInfo.phone + '&userId=' + this.$store.state.userInfo.userId
              // window.location.replace(path)
              // window.location.replace(data.data)
            } else { // 路由类型
              this.$router.replace({
                path: data.data,
                query: {
                  token: this.cusToken
                }
              })
            }
          }
        } else {
          this.$Toast(data.info)
        }
      })
      .catch(err => {
        this.$Toast(`getRedirectUrl err ${err}`)
      })
    }
  }
}
</script>
<style scoped>
  
</style>

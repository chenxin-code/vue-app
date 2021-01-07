<template>
  <div class="enterprise-group" :style="{background: 'url('+bgm+') no-repeat', 'background-size': '100% 100%'}">
    <nav-top title="企业群组" :bgImg="'1'" :navTopStyle="{background: 'transparent'}" :noBack="true"
             @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <img class="msg" src="./images/msg.png" alt="">
      <div class="footer-btn" @click="joinEnterpriseGroup">
        <img class="img" src="./images/footer-btn.png" alt="">
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'enterprise-group',
    data() {
      return {}
    },
    mounted() {
    },
    methods: {
      joinEnterpriseGroup() {
        if (this.$store.state.login.token) {
          const rfrCode = this.$route.query.clusterQrCode
          this.$request.post('/app/json/app_user_cluster/addUserCluster', {rfrCode}).then(res => {
            if (res.status === 0) {
              const data = res.data
              // 未开通油滴
              if (data.state == 0) {
                this.$dialog.confirm({
                  confirmButtonText: '前往开通',
                  cancelButtonText: '算了吧',
                  message: '检测到您还未开通油滴账户，请前往开通吧？'
                }).then(() => {
                  this.$bridgefunc.customPush({
                    path: window.location.origin + "/app-vue/oildrop/openinginstructions?oilPartner=2",
                    isnativetop: "0",
                    superback: 1,
                    isVuePage: '0'
                  })
                })
                // 已开通
              } else if (data.state == 1) {
                this.$router.push('/enterprise-group/result?type=success')
                // 失败
              } else if (data.state == -1) {
                this.$Toast(data.message)
              }
            } else {
              this.$Toast(res.info)
            }
          })
        } else {
          this.$util.toLogin()
        }
      }
    },
    computed:{
      bgm(){
        if(this.$route.query.clusterImgUrl) {
          return this.$route.query.clusterImgUrl
        } else {
          return import('./images/bg.png');
        }
      }
    },
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .enterprise-group {
    background: url('./images/bg.png') no-repeat
    background-size: 100% 100%;

    .msg {
      width 90%;
      margin 40px auto
      display block
    }

    .footer-btn {
      position: absolute;
      bottom 20px;
      left: 15px;
      right 15px;

      .img {
        width 100%
      }
    }
  }
</style>

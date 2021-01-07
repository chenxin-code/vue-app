<template>
  <div class="icbc">
    <div class="test-tip" v-if="$store.state.globalConfig.icbcBriefTest == '1'" @click="clickTimesEvent">
      <div class="title">马上回来</div>
      <div>我们正在进行短暂测试，</div>
      <div>对您造成不便，敬请谅解！</div>
    </div>
    <div class="btns" v-if="clickTimes > 5">
      <div class="btn line_radius" @click="openEruda">打开日志</div>
      <div class="btn line_radius" @click="doContinue">开始测试</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Cookie from 'js-cookie'
  // import Eruda from 'eruda'

  export default {
    name: 'transfer',
    data() {
      return {
        clickTimes: 1
      }
    },
    mounted() {
      // Eruda.init()
      if (this.$store.state.globalConfig.icbcBriefTest == '1') {
        return ;
      }
      this.doContinue()
    },
    methods: {
      clickTimesEvent: function () {
        this.clickTimes ++
        // this.$Toast(this.clickTimes + '')
      },
      doContinue: function () {
        window.hybrid_app.merLogin('icbc_login')
        window.icbc_login = (code) => {
          if (code) {
            this.icbcLogin(code)
          } else {
            this.$Toast('获取code失败！')
          }
        }
      },
      openEruda: function () {
        eruda.init()
      },
      icbcLogin(code) {
        this.$Loading.open();
        let url = '/app/json/login/ICBCUserAutoLogin';
        this.$http.post(url, {code: code}).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$userCenter.saveLoginData(data.data);
              let token = data.data.token
              if (token) {
                Cookie.set("usertoken", token)
                this.$bridgefunc.vuexStorage(() => {
                  this.toRealPage()
                })
              }
            } else {
              this.$Toast(data.info ? data.info : '授权登录失败');
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("授权登录失败");
          }
        )
      },
      toRealPage: function () {
        if (this.$store.state.globalConfig.icbcRedirectUrl) {
          this.$router.replace({
            path: this.$store.state.globalConfig.icbcRedirectUrl
          })
        } else {
          this.$router.replace({
            path: '/common'
          })
        }
      }
    },
    components: {},
    created() {
      this.$store.state.login.token = ''
      // Eruda.init()
      // this.$store.state.login.token = 'c:app:A2C291FE552245729AB68E12FBBF2109'
      // this.$store.commit('setWebType', 4)
      // this.$store.state.barHeight = 0
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .test-tip {
    text-align center;
    margin-top 100px;
    color #666;
    line-height 28px;
    .title {
      font-size 16px;
      font-weight 600;
      padding-bottom 20px;
    }
  }
  .btns {
    margin-top 40px;

    .btn {
      margin 10px auto;
      width 100px;
      line-height 40px;
      text-align center;
    }
  }
</style>

<template>
  <div class="qrcode-container">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="qrcode-wrapper">
        <img class="qrcode" :src="qrcode" alt="">
      </div>
      <div class="code">会员编码：{{$store.state.userInfo.userId}}</div>
    </nav-content>
  </div>
</template>
<script>
  export default {
    components: {},
    data() {
      return {
        qrcode: ''
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1);
      },
      getCode: function () {
        this.$request.post('/app/json/user/queryQrcode').then(res => {
          if (res.status === 0) {
            this.$request.post('/app/json/we_chat/getwxacodeunlimit', {
              path: `pages/common/home/index`,
              scene: `rfrCode=${res.data}`,
              width: 430
            }).then(res => {
              if (res.status === 0) {
                this.qrcode = 'data:image/png;base64,' + res.data
              } else {
                this.$Toast(res.info || '获取小程序码失败')
              }
            }, error => {
            })
          } else {
            this.$Toast(res.info)
          }
        })
      },
    },
    destroyed() {
    },
    mounted() {
      // const custom_params = {
      //   a: 1
      // }
      // this.$request.post('/app/json/we_chat/getwxacode', {
      //   path: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=2&type=9&custom_params=${encodeURIComponent(JSON.stringify(custom_params))}`,
      //   width: 1280
      // }).then(res => {
      //   if (res.status === 0) {
      //     this.qrcode = 'data:image/png;base64,' + res.data
      //   } else {
      //     this.$Toast(res.info || '获取小程序码失败')
      //   }
      // }, error => {
      // })
    },
    created() {
      this.getCode()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .qrcode-container{
    .qrcode-wrapper{
      margin 10px
      position relative
      border-radius 5px
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
      background white
      text-align: center
      .qrcode{
        width 80%;
      }
    }
    .code {
      text-align center
      padding: 30px 0
      color: #bf0006
      font-size: 16px
    }
  }
</style>

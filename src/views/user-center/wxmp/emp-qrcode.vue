<template>
  <div class="qrcode-container">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="qrcode-wrapper" v-show="qrcode && loaded">
        <img class="qrcode" :src="qrcode" alt="">
      </div>
      <div class="qrcode-wrapper" v-show="!qrcode && !loaded">
        <div class="tip-title">提示</div>
        <div class="tip-content">您暂无邀请资格</div>
        <div class="tip-desc">
          <p>请通过以下方式获取推荐资格。</p>
          <p>1. 询问加油站员工获取邀请码。</p>
          <p>2. 点击"我的"、"我的推荐人"输入邀请码。</p>
          <p>3. 获得推荐资格。</p>
        </div>
      </div>
      <div class="code-wrapper">
        <div class="code">手机号：{{$store.state.userInfo.phone}}</div>
        <div class="code">会员码：{{$store.state.userInfo.userId}}</div>
      </div>
      <div class="note">邀请好友：</div>
      <div class="note">{{$store.state.globalConfig.empQrcodeDes}}</div>
      <div class="note str">注：此页面须截屏转发。</div>
    </nav-content>
  </div>
</template>
<script>
  export default {
    components: {},
    data() {
      return {
        qrcode: '',
        loaded: false
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1);
      },
      getCode: function () {
        this.$request.post('/app/json/user/getUserRfrCode').then(res => {
          this.$request.post('/app/json/we_chat/getwxacodeunlimit', {
            path: `pages/common/home/index`,
            scene: `rfrCode=${res.data.qrCode}`,
            width: 430
          }).then(res => {
            if (res.status === 0) {
              this.qrcode = 'data:image/png;base64,' + res.data
            } else {
              this.$Toast(res.info || '获取小程序码失败')
            }
          }, error => {
          })
        })

      }
    },
    destroyed() {
    },
    mounted() {
    },
    created() {
      this.$request.post('/app/json/app_user_referrer/isExistTopReferrer').then(res => {
        this.loaded = res.data
        if (res.status === 0 && (/^true$/i).test(res.data)) {
          this.getCode()
        }
      })
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
      padding 20px;
      .qrcode{
        width 100%;
      }
    }
    .tip-title{
      font-size:20px;
      font-weight bold
    }
    .tip-content{
      font-size:16px;
      padding-top:15px;
      font-weight bold
      padding-bottom:20px;
    }
    .tip-desc{
      padding-top:20px;
      border-top:1px dashed #dddddd
      color #888;
      text-align left
      line-height:21px;
    }
    .code-wrapper{
      padding 20px 0
    }
    .code {
      text-align center
      color: #bf0006
      font-size: 16px
      & + .code{
        margin-top:10px;
      }
    }
    .note{
      padding 0 15px;
      color #747474;
      line-height 19px;
      &.str{
        color: #bf0006
      }
    }
  }
</style>

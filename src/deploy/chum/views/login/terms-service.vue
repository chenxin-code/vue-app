<template>
  <div>
    <nav-top @backEvent=""></nav-top>
    <nav-content class="container">
      <div class="content">
        <div class="content-list" v-for="item in newsList">
          <div class="title">{{item.item}}</div>
          <div class="con" v-html="item.content"></div>
        </div>
      </div>
      <div class="btns chum-public-btn">
        <van-button class="cancel" round plain hairline type="info" @click.native="agreeTermsAndLogin(false)"
                    color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
        >不同意</van-button>
        <van-button class="agree" round  type="info" @click.native="agreeTermsAndLogin(true)"
                    color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
        >同意</van-button>
      </div>
    </nav-content>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        newsList: []
      }
    },
    created() {
      this.$request.post('/app/json/news/getNewsList', {values: 3}).then(res => {
        if (res.status === 0) {
          this.newsList = res.data || []
        }
      })
    },
    methods: {
      // 同意协议并注册登录
      agreeTermsAndLogin(f) {
        this.$router.go(-1)
        this.$store.state.isAgreement = f
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
@import '~@/deploy/chum/assets/stylus/chum-public.styl'

.container {
  background-color: #F6F6F6;
  display flex
  flex-direction column
  .content {
    background-color: #FFF;
    border-radius 5px;
    margin 15px 20px;
    padding 15px 10px;
    overflow-y auto
    flex 1
    line-height 21px;
    .title{
      font-size:18px;
    }
  }
  .content-list{
  }
  .btns{
    flex-shrink 0
    display flex
    align-items center
    padding 0 20px 20px 20px;
    .cancel{
      border none;
      background: transparent
      margin-right:15px;
      flex 1
      color #71490e;
    }
    .agree{
      flex 1
    }
  }
}

</style>

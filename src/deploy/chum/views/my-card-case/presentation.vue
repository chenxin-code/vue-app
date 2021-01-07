<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="explanation">
        <p class="title">{{ explanationData.title }}</p>
        <div class="content" v-html="explanationData.content">
        </div>
      </div>
      <van-button class="comm-btn" type="default" color="#C9A063" @click="shareHandler">发送领取链接</van-button>
      <van-button class="comm-btn" type="default" @click="toMyCard">返回【我的卡包】</van-button>
    </nav-content>
    <van-popup v-model="shareView" class="state-box">
      <img src="static/image/microShop/jiantou@2x.png" alt="">
      <p>请点击右上角进行分享</p>
    </van-popup>
  </div>
</template>

<script>
  import wxfunc from '@/utils/wxfunc'
  import Config from '@/api/config'

  export default {
    data() {
      return {
        shareView: false,
        explanationData: {
          title: '',
          content: '',
        }
      }
    },
    mounted() {
      this.initExplanation()
    },
    methods: {
      initExplanation() {
        this.$http.post('/app/json/news/getNewsList?values=56').then(res => {
          let data = res.data
          if (data.status == 0) {
            this.explanationData = data.data[0] || {}
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Toast(`getNewsList err ${err}`)
        })
      },
      toMyCard() {
        this.$router.go(-1)
      },
      shareHandler() {
        wxfunc.wxmpShare({
          title: this.$route.query.equityCardName,
          path: `${Config.shareUrl}/card_detail?isShareOpen=1&cardId=${this.$route.query.cardId}&userId=${this.$route.query.userId}&equityCardId=${this.$route.query.equityCardId}&cardType=1`,
          imageUrl: this.$store.state.globalConfig.shareImage ? this.$store.state.globalConfig.shareImage : '',
          rfrCode: c
        })
        console.log({
          title: this.$route.query.equityCardName,
          path: `${Config.shareUrl}/card_detail?isShareOpen=1&cardId=${this.$route.query.cardId}&userId=${this.$route.query.userId}&equityCardId=${this.$route.query.equityCardId}&cardType=1`,
          imageUrl: this.$store.state.globalConfig.shareImage ? this.$store.state.globalConfig.shareImage : '',
          rfrCode: this.$store.state.userInfo ? this.$store.state.userInfo.userId : ''
        })
        this.$Loading.open()
        this.$http.post('/app/json/equity_card/updateEquityCardState', {
          id: this.$route.query.cardId,
          equityCardState: 3
        }).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.shareView = true
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Loading.close()
          this.$Toast(`updateEquityCardState err ${err}`)
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/deploy/chum/assets/stylus/chum-public.styl'
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .container {
    .explanation {
      margin 20px 20px 0;

      .title {
        font-size 15px;
        font-weight 500;
      }

      .content {
        margin-top 10px;
        font-size 13px;
        line-height 20px;
      }
    }

    .comm-btn {
      display block;
      height 50px;
      width 250px;
      line-height 50px;
      margin 30px auto 0;

      .van-button__text {
        font-size 16px;
        font-weight 700;
      }
    }
  }

  >>> .state-box {
    z-index: 2001;
    width: 80%;
    text-align: center;
    font-size: 16px;
    color white;
    top 200px;

    img {
      width 80px;
      margin 0 0 15px 160px;
    }
  }

  >>> .van-popup {
    background transparent;
  }

  >>> .van-overlay {
    background-color rgba(0, 0, 0, 0.6)
  }
</style>

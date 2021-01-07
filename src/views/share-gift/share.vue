<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <!-- 内容区域 -->
    <nav-content>
      <div class="share-container">
        <img class="title" src="./assets/image/title@2x.png" alt="">
        <div class="content">
          <p>将订单分享给好友，需要{{awardActivity.awardPerson}}人助力</p>
          <p>即可领取价值{{awardActivity.awardAmount}}元{{awardActivity.awardName}}</p>
        </div>
        <img @click="sharePage" class="btn" src="./assets/image/button1@2x.png" alt="">
      </div>
      <img style="display: none" id="img" src="/static/image/microShop/1@222x.png" alt="">
    </nav-content>
    <van-popup v-model="shareView" class="stateBox">
      <img src="static/image/microShop/jiantou@2x.png" alt="">
      <p>请点击右上角进行分享</p>
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  import wxfunc from '@/utils/wxfunc'
  import Config from '@/api/config'

  export default {
    name: '',
    data() {
      return {
        awardActivity: {},
        shareData: {},
        sharemiMrssage: '',
        shareView: false, //分享遮罩
      }
    },
    mounted() {
      console.log(this.$route.query.awardActivity);
      this.awardActivity = JSON.parse(this.$route.query.awardActivity)
      let shareMrssage = encodeURIComponent(this.$route.query.awardActivity)
      this.sharemiMrssage = encodeURIComponent(this.$route.query.awardActivity)
      const shareData = {
        title: this.awardActivity.activityTitle,
        sharetext: this.awardActivity.activityDesc,
        imageurl: this.awardActivity.activityPromotionalPic,
        // imageurl: 'http://tbdmgt.deepermobile.com/download?uploadFile.id=34642',
        detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/share-gift/share-list?awardActivity=${shareMrssage}`
      }
      this.shareData = shareData
      console.log(this.shareData)
    },
    methods: {
      sharePage() {
        if (this.$store.state.webtype == 1) {
          this.$bridgefunc.wechatShare(this.shareData)
        } else if (this.$store.state.webtype == 3) {
          let shareData = {
            title: this.awardActivity.activityTitle,
            path: `${Config.shareUrl}/share-gift/share-list?awardActivity=${this.sharemiMrssage}`,
            imageUrl: this.awardActivity.activityPromotionalPic,
            rfrCode: this.$store.state.userInfo ? this.$store.state.userInfo.userId : ''
          }
          wx.miniProgram.postMessage({data:JSON.stringify(shareData)})
          this.shareView = true
          console.log(666,shareData.path);
          console.log(33,encodeURIComponent(shareData.path))
        }
      },
    },
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .share-container {
    height 100%
    background: url('./assets/image/bg2@2x.png') no-repeat
    -webkit-background-size: 100% 100%
    background-size: 100% 100%
    padding-top: 80px;
    text-align: center

    .title {
      width 80%
    }

    .content {
      padding 10px 0 30px 0
      color: #fff;
      line-height: 21px;
    }

    .btn {
      width 70%;
    }
  }
  >>> .stateBox {
    z-index: 2001;
    /*height: 180px;*/
    /*line-height: 180px;*/
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

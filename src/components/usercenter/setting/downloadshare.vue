/**Created by liaoyingchao on 2018/11/11.*/

<template>
  <div class="downloadshare login2" :style="{backgroundImage: `url(${bgImg})`}">
    <div v-show="!isWx && !hideTop" class="qrcode-top "
         :style="{height: (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}"
         @backEvent="backEvent">
      <div class="navcontent"
           :style="{top: this.$store.state.barHeight+ 'px','height': this.$market.getNavHeight()+'px','line-height': this.$market.getNavHeight()+'px'}">
        <div class="title-div theme_font_white">{{$t('downloadshareTitle')}}</div>
        <div class="nav-back-btn" @click="backEvent">
          <i class="iconfont mall-fanhui theme_font_white" style="margin-left: 10px; font-size: 20px;"></i>
        </div>
        <span class="share-btn" @click="shareClick">
           <i class="iconfont mall-fenxiang"></i>
        </span>
      </div>
    </div>
    <nav-content>
      <div class="scroll-div">
        <div class="tip" v-if="showDownloadTip">可点击右上角，选择在浏览器打开</div>
        <div class="show-content" :class="{'wx-height': isWx}">
          <div class="show-img">
            <img :src="$store.state.globalConfig.downloadImgUrl" alt="">
          </div>
          <div class="qr-code">
            <div class="img-content">
              <canvas class="img qr-code-content" id="downloadUrl"></canvas>
            </div>

            <p class="theme_font_white desc">{{$t('downloadshareLang.downloadTip')}}</p>
            <p class="theme_font_white desc">
              "{{$store.state.globalConfig.downloadName}}"APP
            </p>
            <div class="download-btn" @click.stop="downloadHandler" v-if="showDownloadBtn">
              <img class="img" src="~@/assets/download/download-now.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </nav-content>

  </div>
</template>

<script>
  import {Toast} from 'mint-ui'
  import QRCode from 'qr-code-with-logo'
  import enterpriseImg from '@/utils/enterpriseImg.js'
  import Config from '@/api/config.js'
  import {Dialog} from 'vant'
  import Vue from 'vue'

  export default {
    name: "index",
    components: {
      Toast
    },
    data() {
      return {
        hideTop:false,
        downloadUrl: ''
      }
    },
    computed: {
      isWx() {
        return this.$store.state.webtype == 2
      },
      bgImg() {
        return this.$store.state.globalConfig.downloadBgImgUrl
      },
      showDownloadBtn() {
        return this.$store.state.webtype != 1
      },
      showDownloadTip() {
        return this.$store.state.webtype == 2 || this.$util.isQQ()
      }
    },
    methods: {

      backEvent: function () {
        this.$router.go(-1)
      },
      getData: function () {
        this.$Loading.open();
        let url = '/app/json/home/getVersion';
        let paramsData = {};
        paramsData.appSysType = this.$util.isIos() ? 1 : 2

        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status === 0) {
              this.downloadUrl = data.data.downloadUrl || ''
            } else {
              this.$Toast(data.info)
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      },
      shareClick: function () {
        let shareData = {};
        shareData.title = this.$store.state.globalConfig.shareTitle || '';
        shareData.sharetext = this.$store.state.globalConfig.shareDesc || '';
        shareData.imageurl = this.$store.state.globalConfig.downloadImgUrl || '';
        shareData.detailurl = window.location.href // 分享的地址 // todo
        console.log(shareData)
        this.$bridgefunc.share(shareData);
      },
      downloadHandler() {
        if (this.downloadUrl) {
          window.location.href = this.downloadUrl
        } else {
          this.$Toast('下载地址错误！');
        }
      }

    },
    mounted() {
      if (this.isWx) {
        Dialog.confirm({
          title: '下载提示',
          message: '请在默认浏览器中打开',
          showCancelButton: false,
          confirmButtonText: '知道了'
        })
      }
      this.getData();

      let dic = {
        canvas: document.getElementById('downloadUrl'),
        content: location.href,
        nodeQrCodeOptions:{
          margin: 0
        }
      }
      let src = enterpriseImg('qr-logo.png');
      if(src){
        dic.logo =  {
          src: src,
        }
      }
      QRCode.toCanvas(dic)
    },
    // i18n: {
    //   messages: {
    //     en: {downloadTip: 'scan download installation'},
    //     zh: {downloadTip: '扫一扫下载安装'}
    //   }
    // },
    created() {
      this.$route.query.fromCoupon == '1'
        ? this.hideTop = true
        : null;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .downloadshare {
    width 100%
    height 100%
    overflow hidden
    background: url("~@/assets/download/download.png") 0px 0px no-repeat;
    background-size: 100% 100%;

    .qrcode-top {
      position absolute;
      width 100%;
      overflow hidden
      z-index 5;
    }

    .navcontent {
      position: absolute;
      width 100%
      bottom 0px
      left 0px
      overflow hidden;

      .title-div {
        position absolute;
        left 50px;
        right 50px;
        bottom 0px;
        text-align center;
        font-weight $font-weight-x
        font-size $font-size-large;
        height 100%
      }

      .nav-back-btn {
        position absolute;
        top 0px
        left 0px;
        bottom 0px;
        z-index 10;
      }

      .share-btn {
        position: absolute
        right 18px;
        color #fff;

        .iconfont {
          font-size: 20px;
        }
      }
    }

    .scroll-div {
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      overflow hidden
      /*-webkit-overflow-scrolling touch*/

      .show-content {
        display flex
        align-items center
        justify-content space-between
        padding 20px 20px 0 20px

        &.wx-height {
          padding-top: 64px;
        }

        .show-img {
          width 55%

          img {
            width 100%
            height 100%
          }
        }

        .qr-code {
          text-align: center

          .img-content {
            width: 100px;
            height: 100px;
            border-radius 5px
            display inline-block
            background-color white
            overflow: hidden;

            .img {
              width 100% !important;
              height 100% !important;
              display block;
            }
          }

          .desc {
            text-align center
            margin-top 10px
            font-size $font-size-small

            & + .desc {
              margin-top 5px
            }
          }
        }

      }
    }

    .download-btn {
      width 130px
      margin-top 10px
      font-size: 0

      .img {
        width 100%
      }
    }

    .tip {
      background: #fff9e7;
      color: #f2852e;
      padding 9px;
      text-align: center
    }
  }
</style>

/**Created by liaoyingchao on 2020-04-03.*/

<template>
  <div class="live-stream">
    <div class="my-overlay" @click.stop="overlayEvent"></div>
    <div id="stream_div"></div>
  </div>
</template>

<script>
  // import 'video.js/dist/video-js.css'
  // import {videoPlayer} from 'vue-video-player'
  // import hls from 'videojs-contrib-hls'
  // import Vue from 'vue'

  // Vue.use(hls)

  export default {
    name: "live-stream",
    components: {
    },
    data() {
      return {
        lbId: '',
        detail: {}
      }
    },
    methods: {
      overlayEvent: function () {
        this.player.volume(1.0)
      },
      getDetailInfo: function () {
        if (this.lbId == '') {
          this.$Toast('没有获取到直播ID！')
          return ;
        }
        this.$Loading.open();
        let url = '/app/json/live_broadcast/detail';
        let params = {
          lbId: this.lbId
        }

        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.detail = data.data;
            this.initPlayer()
            // setTimeout(() => {
              // this.player.mute(false)
            // }, 1000)
            // this.p
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },
      getVideoStyle: function (item) {
        let width = document.documentElement.clientWidth
        let height = document.documentElement.clientHeight
        let resolution = item.resolution
        let resolutionArr = []
        if (resolution && resolution != '') {
          resolutionArr = resolution.split('*')
        }
        if (resolutionArr && resolutionArr.length == 2) {
          let resolutionW = parseFloat(resolutionArr[0])
          let resolutionH = parseFloat(resolutionArr[1])
          if (resolutionW > 0 && resolutionH > 0) {
            let ratioW = width / resolutionW
            let ratioH = height / resolutionH
            if (ratioW > ratioH) {
              item.fullVideoWidth = width
              item.fullVideoHeight = 'auto'
              // height = parseInt(ratioW * resolutionH)
            } else {
              item.fullVideoWidth = 'auto'
              item.fullVideoHeight = height
              // width = parseInt(ratioH * resolutionW)
            }
          }
        } else {
          item.fullVideoWidth = width
          item.fullVideoHeight = height
        }
        // return 'width: '+width+'px;'+'height: '+height+'px;'
      },
      initPlayer: function () {
        this.getVideoStyle(this.detail)
        // 初始化播放器
        let idStr = 'stream_div'
        let width = this.detail.fullVideoWidth
        let height = this.detail.fullVideoHeight
        // console.log(width,height)
        this.player = new TcPlayer(idStr, {
          "m3u8": this.detail.pullHlsUrl,
          "flv": this.detail.pullFlvUrl,
          "autoplay": true,
          "flash": false,
          "controls": "none",
          "poster": this.detail.lbImg,
          width: width,
          height: height,
          listener: (msg) => {
            // console.log(msg)
            if (msg.type == 'error') {
              console.error(msg)
            } else if (msg.type == 'loadeddata') {
              // console.error(msg)
            } else if (msg.type == 'resize') {

            }
          }
        });
        // this.player.mute(true)
        this.player.volume(0)
      }
    },
    created() {
    },
    mounted() {
      this.lbId = this.$route.query.lbId || ''
      this.getDetailInfo()
      // this.playIndex(this.videoIndex)

      // this.playerOptions.sources[0].src = this.$route.query.url
      // // this.playerOptions.sources[0].src = 'https://cdn.letv-cdn.com/2018/12/05/JOCeEEUuoteFrjCg/playlist.m3u8'
      // this.$refs.videoPlayer.player.play()


      // setTimeout(() => {
      //   let videos = this.$refs.videoAuto;
      //   // videos.loop = 'loop';
      //   videos.player.play();
      // }, 500)
      // autoVido(){
      //   let self= this
      //   let videos = self.$refs.videoAuto;
      //   videos.loop = 'loop';
      //   videos.play();
      // }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .live-stream {
    width 100%
    height 100%
    overflow hidden
    position relative;
    .my-overlay {
      position absolute;
      top 0;
      left 0;
      right 0;
      bottom 0;
      z-index 99;
    }

    >>> .vjs-modal-dialog-content {
      font-size 0;
    }

    >>> .vcp-bigplay {
      width 0;
      height 0;
    }

    >>> .vcp-player {
      width 100%;
      height 100%;
    }

    >>> .vcp-error-tips {
      font-size 0;
    }

    >>> .vcp-poster-pic {
      width 100%;
      height 100%;
    }
  }
</style>

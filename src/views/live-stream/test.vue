/**Created by liaoyingchao on 2019-11-26.*/

<template>
  <div class="test">
    <video id="my-video" muted class="video-js vjs-default-skin" controls preload="auto" poster="">
      <source src="http://ivi.bupt.edu.cn/hls/cctv3hd.m3u8" type="application/x-mpegURL">
    </video>
  </div>
</template>

<script>
  import videojs from 'video.js'
  import 'videojs-contrib-hls'

  export default {
    name: "test",
    components: {},
    data() {
      return {
        url: ''
      }
    },
    methods: {},
    mounted() {
      videojs('my-video', {
        bigPlayButton: false,
        textTrackDisplay: false,
        posterImage: true,
        errorDisplay: false,
        controlBar: true
      }, function () {
        this.play()
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .test {
    width 100%
    height 100%
    overflow hidden
    #my-video {
      width 100%;
    }
  }
</style>

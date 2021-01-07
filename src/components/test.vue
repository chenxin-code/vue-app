<template>
  <div class="bottom">
    <div class="times">请求次数：{{times}}， 成功次数：{{successTimes}}</div>
    <div class="row" v-for="(text, idx) in errorList">{{idx}}、{{text}}</div>
  </div>
</template>

<script>
  import 'video.js/dist/video-js.css'
  import { videoPlayer } from 'vue-video-player'

  export default {
    name: 'test',
    components: {
      videoPlayer
    },
    data() {
      return {
        times: 0,
        successTimes: 0,
        errorList: []
      }
    },
    methods: {
      getMyPageData: function () {
        if (this.times >= 100) {
          return
        }
        this.times ++
        let url = 'https://app.im.cnooc.com.cn/app/json/user_info/loadUserIndexInfo';
        if (this.times % 3 == 0) {
          url = 'https://app.im.cnooc.com.cn/app/json/user/loginOrgUser'
        } else if (this.times % 3 == 1) {
          url = 'https://app.im.cnooc.com.cn/app/json/message/queryUnreadMsgCnt'
        }
        let params1 = {}
        this.$http.post(url, params1).then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.successTimes ++
          } else {
            let str = data.status + ': ' + data.info
            this.errorList.splice(0, 0, str)
          }
          this.getMyPageData()
        }).catch(error => {
          let str = 'error: ' + error.message
          this.errorList.splice(0, 0, str)
          this.getMyPageData()
        })
      },
      test: function () {

      }
    },
    mounted(){

    },
    created() {
      // this.getMyPageData()
      // this.getMyPageData()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .bottom {
    position absolute
    top 0px
    bottom 0px
    left 0px
    right 0px
    background-color red
    overflow-y auto;
    .row {
      padding 5px;
    }
    .scroll{
      position absolute
      top: 100px
      width 100%
      height 200px
      background red
      .ul{
        li{
          height 50px
          background-color royalblue
        }
      }
    }

  }
</style>

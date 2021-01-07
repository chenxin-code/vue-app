/**Created by liaoyingchao on 2019/1/17.*/

<template>
  <div class="msg-detail">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content-div">
        <div class="title">{{msgInfo.sketch}}</div>
        <div class="content theme_font_common">{{msgInfo.content}}</div>
        <div class="time theme_font_tint">{{msgInfo.appSendTime}}</div>
      </div>
      <div class="bottom-btn theme_standard_bg" @click="toPingjia" v-if="msgInfo.btnTitle && msgInfo.btnTitle != ''">{{msgInfo.btnTitle}}</div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "msg-detail",
    components: {},
    data() {
      return {
        msgInfo: {},
        lastPath: ''
      }
    },
    methods: {
      toPingjia: function () {
        let url = this.msgInfo.btnLink
        if (url.indexOf('http') == 0) {
          this.$bridgefunc.customPush({
            path: url
          })
        } else {
          this.$router.push({
            path: url
          })
        }
      }
    },
    created() {
      this.lastPath = this.$route.query.lastPath
      this.msgInfo = this.$route.params
      let oContent = this.msgInfo.content
      if (oContent) {
        let ocArr = oContent.split('[BUTTON:url:')
        if (ocArr.length == 2) {
          this.msgInfo.content = ocArr[0]
          let btnInfo = ocArr[1]
          let btnArr = btnInfo.split(';title:')
          if (btnArr.length == 2) {
            this.msgInfo.btnLink = btnArr[0]
            this.msgInfo.btnTitle = btnArr[1].substr(0, btnArr[1].length-1)
          }
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == this.lastPath) {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .msg-detail {
    width 100%
    height 100%
    overflow hidden
    position relative;
    .content-div {
      padding 5px 10px;
    }
    .bottom-btn {
      position absolute;
      left 0;
      right 0;
      bottom 0;
      padding 15px;
      font-size 16px;
      font-weight 500;
      color white;
      text-align center;
    }
    .title {
      font-size $font-size-large;
      text-align center;
      padding 5px 4px;
    }
    .time {
      font-size $font-size-small
      text-align right;
      padding 10px 4px;
    }
    .content {
      text-indent: 2em;
      padding 5px 0px;
      font-size 14px;
      line-height 20px;
    }
  }
</style>

/**Created by liaoyingchao on 2019-04-22.*/

<template>
  <div class="web-view">
    <iframe class="iframe-content" :src="frameUrl" frameborder="0"></iframe>
  </div>
</template>

<script>
  export default {
    name: "web-view",
    components: {},
    props: ['pageData'],
    data() {
      return {

      }
    },
    computed: {
      frameUrl: function () {
        let urlStr = this.pageData.url;
        if (urlStr.indexOf("?") == -1) {
          urlStr = urlStr+'?token='+this.$store.state.login.token;
        }else {
          urlStr = urlStr+'&token='+this.$store.state.login.token;
        }
        return  urlStr;

      },

    },
    methods: {
      clickEvent: function () {
        console.log('clickEvent')
      },
      // backEvent: function () {
      //   this.$refs.myIframe.contentWindow.postMessage('go(-1)','*')
        // console.log()
        // this.$refs.myIframe.contentWindow.history.go(-1)
      // }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .web-view {
    width 100%
    height 100%
    overflow hidden
    position relative
    .iframe-content{
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background white
    }
  }
</style>

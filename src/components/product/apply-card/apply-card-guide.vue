<template>
  <div class="apply-card-guide">
    <nav-top title="办卡指南" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="apply-card-guide-details">
      <div class="news" v-html="newsList"></div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    data() {
      return {
        newsList: []
      }
    },
    created() {
    },
    mounted() {
      this.showagreement()
    },
    methods: {
      showagreement() {
        // 获取内容中心
        this.$request.post('/app/json/news/getNewsList', { values: 15 }).then(res => {
          if (res.status == 0) {
            this.newsList = res.data[0] ? res.data[0].content : ''
          } else {
            this.$Toast(res.info ? res.info : '获取获取内容中心失败')
          }
        })
      }
    },
    computed: {},
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .apply-card-guide {
    .apply-card-guide-details {
      padding: 11px 15px
      overflow-y auto
      -webkit-overflow-scrolling touch
      .news {
        line-height 20px
        >>> img {
          width 100%
        }
      }
    }
  }
</style>

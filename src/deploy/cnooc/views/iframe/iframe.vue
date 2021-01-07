<template>
  <div class="container">
    <nav-top @backEvent="backHandler" :title="pageTitle"></nav-top>
    <nav-content>
      <iframe :src="pageUrl" frameborder="0" class="page-container"></iframe>
    </nav-content>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      pageType: 0,
      pageUrl: '',
      pageTitle: '我的卡片',
      comeFromPage: ''
    }
  },
  mounted() {
    this.pageTitle = this.$route.query.pageTitle
    this.pageUrl = this.$route.query.pageUrl
    this.comeFromPage = this.$route.query.comeFromPage
  },
  methods: {
    backHandler() {
      if (this.comeFromPage == '/common') {
        this.$router.replace('/common')
      } else {
        this.$router.go(-1)
      }
    },
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .page-container {
    width 100%
    height 100%
  }
</style>
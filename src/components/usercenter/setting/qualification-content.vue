<template>
  <div>
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="content" v-html="contentHtml"></div>
    </nav-content>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      contentHtml: '',
    }
  },
  created() {
    this.$http.post(`/app/json/news/getNewsList?values=${this.$route.query.queryType}`, {}).then(res => {
      let data = res.data
      if (data.status == 0) {
        if (data.data) {
          this.contentHtml = data.data[0].content || ''
        }
      } else {
        this.$Toast(data.info)
      }
    }).catch(err => {
      this.$Toast(`getNewsList err ${err}`)
    })
  },
  methods: {
    backEvent() {
      this.$router.go(-1);
    },
  }
}
</script>
<style lang="stylus" scoped>
@import "~@/common/stylus/variable.styl"
@import "../css/usercenter.styl"
.content {
  width 100%;
  height 100%;
  overflow-y auto;
  img {
    display block;
    width 100%;
  }
}
</style>

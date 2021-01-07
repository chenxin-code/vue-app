<template>
  <div class="container">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content" v-html="descContent"></div>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {
      descContent: '',
    }
  },
  mounted() {
    this.initDetail()
  },
  methods: {
    initDetail() {
      this.$Loading.open()
      this.$http.post('/app/json/news/details', {
        categoryId: 12
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.descContent = data.data[0].content || ''
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`details err ${err}`)
      })
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.content {
  img {
    display block;
    width 100%;
  }
}
</style>

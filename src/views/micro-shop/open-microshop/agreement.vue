<template>
  <div>
    <nav-top title="微店开通条款" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="agree" v-html="content"></div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "agreement",
    data() {
      return {
        content: ''
      }
    },
    mounted() {
      this.getagreement()
    },
    methods: {
      getagreement() {
        this.$request.post('/app/json/news/getNewsList', {values: 51}).then(res => {
          if (res.result === "success") {
            let data = res.data || []
            this.content = data[0].content
          } else {
            this.$Toast(res.info)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .agree {
    font-size: 16px;
    line-height: 24px;
    height 100%;
    overflow-y auto
    margin: 10px 20px;
    padding-bottom:20px;
  }
</style>

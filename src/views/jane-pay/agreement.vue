<template>
  <div>
    <nav-top title="加油支付协议" @backEvent="$router.go(-1)"></nav-top>
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
        this.$request.post('/app/json/news/getNewsList', {values: 39}).then(res => {
          console.log('协议内容1',res);
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
    margin: 10px 20px;
  }
</style>

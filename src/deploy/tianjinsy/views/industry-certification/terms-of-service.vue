<template>
  <div>
    <nav-top title="职业认证" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content" v-html="cardPrompt"></div>
    </nav-content>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        cardPrompt: ''
      }
    },
    mounted() {
      this.$request.post('/app/json/news/getNewsList', {values: 75}).then(res => {
        if (res.status == 0) {
          this.cardPrompt = res.data[0] ? res.data[0].content : ''
        }
      })
    },
    methods: {},
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  .content {
    height: 100%;
    padding: 10px;
  }
</style>
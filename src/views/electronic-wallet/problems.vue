<template>
  <div class="problems">
    <nav-top :title="title" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="problems-container">
      <div class="content" v-for="(item, index) in newsList" :key="index" v-html="item.content"></div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        newsList: [],
        title: '',
        source: '',
        values: '' // 常见问题27 电子钱包充值页面说明29 电子钱包开通协议26 退款说明30
      }
    },
    mounted() {
      this.title = this.$route.query.title
      this.source = this.$route.query.source
      if (this.source == 1) { // 常见问题
        // 常见问题
        this.values = '27'
        this.showagreement()
      } else if (this.source == 2) { // 说明
        // 说明
        this.values = '29'
        this.showagreement()
      }
    },
    methods: {
      showagreement() {
        this.$request.post('/app/json/news/getNewsList', { values: this.values }).then(res => {
          if (res.status == 0) {
            this.newsList = res.data
          }
        })
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .problems {
    .problems-container {
      padding: 11px 15px
    }
  }
</style>

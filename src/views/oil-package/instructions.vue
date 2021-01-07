<template>
  <div class="instructions">
    <nav-top title="套餐说明" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="instructions-container">
      <div class="news" v-html="newsList"></div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        newsList: '' // 内容中心
      }
    },
    mounted() {
      this.showagreement()
    },
    methods: {
      showagreement() {
        // 获取内容中心
        this.$request.post('/app/json/news/getNewsList', { values: 36 }).then(res => {
          if (res.status == 0) {
            this.newsList = res.data[0] ? res.data[0].content : ''
          } else {
            this.$Toast(res.info ? res.info : '获取获取内容中心失败')
          }
        })
      },
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .instructions {
    .instructions-container {
      padding: 11px 15px
      overflow-y auto
      -webkit-overflow-scrolling touch
      .news {
        line-height 18px
        >>> img {
          width 100%
        }
      }
    }
  }
</style>

<template>
  <div class="help-instructions">
    <nav-top title="帮助说明" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="help-instructions-container">
      <div class="content" v-html="newsList"></div>
<!--      <ul class="list">-->
<!--        <li class="item" v-for="(item, index) in helpList" :key="index">-->
<!--          <div class="help-title">如何获取易贝</div>-->
<!--          <div class="content">油豆的获取和通过商城消费，油豆的获取和通过商城消费油豆的获取和通过商城消费油豆的获取和通过商城消费。</div>-->
<!--        </li>-->
<!--      </ul>-->
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        helpList: [1, 2],
        newsList: ''
      }
    },
    mounted() {
      this.showagreement()
    },
    methods: {
      showagreement() {
        this.$request.post('/app/json/news/getNewsList', { values: 37 }).then(res => {
          if (res.status == 0) {
            this.newsList = res.data[0].content
          }
        })
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .help-instructions {
    .help-instructions-container {
      padding: 11px 15px
      .list {
        .item {
          box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
          background: #fff
          border-radius 6px
          padding: 11px 15px
          line-height 20px
          font-size: 12px
          margin-bottom: 8px
          .help-title {
            font-size: 16px
            font-weight bold
            padding-bottom: 5px
          }
        }
      }
    }
  }
</style>

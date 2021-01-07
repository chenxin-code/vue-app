<template>
  <div>
    <nav-top title="问题列表" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="title">{{detail.title}}</div>
      <div class="content" v-html="detail.content"></div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'detail',
    data() {
      return {
        detail: {}
      }
    },
    mounted() {
      this.$request.post('/app/json/question/detail', {id: this.$route.query.id}).then(res => {
        if (res.status === 0) {
          this.detail = res.data || {}
        } else {

        }
      })
    },
    methods: {},
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .title {
    text-align center
    padding 11px 6px;
    font-size:15px;
    font-weight 600
  }

  .content {
    line-height: 19px;
    padding 5px 11px;
  }
</style>

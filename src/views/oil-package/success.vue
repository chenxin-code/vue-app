<template>
  <div class="success">
    <nav-top title="开通成功" @backEvent="$router.go(-3)"></nav-top>
    <nav-content class="success-container">
      <div class="content">
        <div class="img">
          <img src="./image/icon-Success.png" alt="">
        </div>
        <div class="text">{{overdueDate ? '续签成功' : '开通成功'}}</div>
      </div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        overdueDate: ''
      }
    },
    mounted() {
      this.overdueDate = this.$route.query.overdueDate
    },
    methods: {},
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .success {
    background-color: #f8f8f8 !important
    .success-container {
      .content {
        padding: 50px 0
        display flex
        justify-content center
        align-items center
        flex-direction column
        font-size 14px
        font-weight bold
        .img {
          padding-bottom: 10px
          img {
            width: 60px
          }
        }
      }
    }
  }
</style>

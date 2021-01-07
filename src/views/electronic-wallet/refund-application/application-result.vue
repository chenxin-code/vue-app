<template>
  <div class="application-result">
    <nav-top title="退款申请" @backEvent="$router.go(-1)">
      <div class="my-cards" @click.stop="history">申请历史</div>
    </nav-top>
    <nav-content class="application-result-container">
      <div class="top">
        <div class="img">
          <img src="../image/icon3@2x.png" alt="">
        </div>
        <div class="text">申请成功</div>
        <div class="tips">客服人员稍后将与您联系，请耐心等待</div>
      </div>
      <div class="submit-btn" @click="completeBtn">完成</div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {}
    },
    mounted() {
    },
    methods: {
      history() {
        // 申请历史
        this.$router.push({path: '/application-history'})
      },
      completeBtn() {
        // 完成按钮
        this.$router.go(-1)
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .application-result {
    .application-result-container {
      padding: 30px 15px
      .top {
        text-align center
        .img {
          img {
            width: 50px
          }
        }
        .text {
          padding: 20px 0 10px 0
        }
        .tips {
          color: $color-text-d
          padding-bottom: 30px
        }
      }
      .submit-btn {
        background-color: $color-theme-r;
        color: #fff;
        text-align: center;
        padding: 0.32rem 0;
        border-radius: 50px;
        width: 100%;
        margin: 0 auto
        box-shadow: 0 3px 10px 1px rgba(240, 44, 45, 0.5);

        &[disabled] {
          opacity 0.5
        }
      }
    }
  }
  .my-cards {
    position absolute
    right 10px
    top 0
    font-size 13px
  }
</style>

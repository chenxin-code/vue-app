/**Created by liaoyingchao on 2019-12-18.*/

<template>
  <div class="tip" v-if="visible">
    <van-dialog
      v-model="visible"
      title="温馨提示"
      show-cancel-button
      confirm-button-text="同意"
      cancel-button-text="不同意"
      @confirm="agree"
      @cancel="cancel"
    >
      <div class="content" v-html="initData.content"></div>
    </van-dialog>
  </div>
</template>

<script>
  export default {
    name: "tip",
    components: {},
    data() {
      return {
        visible: false,
        initData: {
          content: ''
        },
        agreeEvent: function () {
          console.log('agreeEvent')
        },
        cancelEvent: function () {
          console.log('cancelEvent')
        }
      }
    },
    methods: {
      agree: function () {
        this.agreeEvent()
      },
      cancel: function () {
        this.cancelEvent()
      }
    },
    mounted() {
      setTimeout(() => {
        document.querySelectorAll('a').forEach(a => {
          console.log(a)
          let href = a.href
          a.onclick=(e) => {
            this.$bridgefunc.newPage({
              weburl: href,
              isnativetop: '1'
            })
            e.preventDefault()
          }
        })
      }, 100)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .tip {
    width 100%
    height 100%
    overflow hidden
    .van-dialog {
      top 50%;
    }
    .content {
      max-height 55vh;
      overflow-y auto;
      padding 20px;
    }
  }
</style>

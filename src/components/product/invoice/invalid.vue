<template>
  <div class="body">
    <nav-top @backEvent="backEvent" title="开具发票"></nav-top>
    <nav-content>
      <div class="invilid" v-if="showView">
        <div class="img">
          <img src="/static/image/invoice/shixiao.png" alt="">
        </div>
        <p>二维码已失效</p>
      </div>
      <div class="invilid" v-if="!showView">
        <div class="img">
          <img src="/static/image/invoice/yiyi.png" alt="">
        </div>
        <p>该二维码已经扫码开票了</p>
      </div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    name: "invalid",
    data() {
      return {
        backUUID: "",
        state: '',
        showView: false
      };
    },
    created() {
      let that = this
      console.log(1111111111, that.$route.params)
      this.backUUID = this.$util.randomString();
      that.state = that.$route.params.state
      if (that.state === 1) { //已开票
        that.showView = false
      } else if (that.state === 2) { //失效
        that.showView = true
      }
      this.$bridgefunc.andriodaddback(this.backUUID, () => {
        this.$bridgefunc.delandriodback(this.backUUID, () => {
          this.backEvent();
        });
      });
    },
    methods: {
      backEvent() {
        this.$router.push({
          path: '/entrance'
        })
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  #app .body {
    background #f3f3f3

    .invilid {
      width 70%;
      margin 60px auto 0 auto

      .img {
        width 80%
        margin 0 auto

        img {
          width 100%
        }
      }

      p {
        width 100%;
        margin 0 auto
        line-height 50px;
        text-align center
        font-size 18px;
      }
    }
  }
</style>

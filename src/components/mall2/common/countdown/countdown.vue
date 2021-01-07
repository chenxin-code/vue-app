/**Created by liaoyingchao on 2018/12/20.*/

<template>
  <div class="countdown">
    <div class="red-div theme_font_white" :class="[type || 'theme_bg_red']" v-if="d != 0">{{d}}</div>
    <span v-if="d != 0">天</span>
    <div class="red-div theme_font_white" :class="[type || 'theme_bg_red']">{{h}}</div>
    :
    <div class="red-div theme_font_white" :class="[type || 'theme_bg_red']">{{m}}</div>
    :
    <div class="red-div theme_font_white" :class="[type || 'theme_bg_red']">{{s}}</div>
  </div>
</template>

<script>
  import countDownJs from './js/index'

  export default {
    name: "countdown",
    // 这里都传时间戳，方便计算
    props: ['endTime', 'type'], // 默认红色 type: className 秒杀倒计时样式
    components: {},
    data() {
      return {
        d: '0',
        h: '00',
        m: '00',
        s: '00',
      }
    },
    methods: {
      parsingTime: function () {
        if (this.endTime) {
          let curTime = this.$store.state.severTime.currentTime
          let endTime = this.endTime
          let vTime = endTime - curTime
          this.d = 0
          this.h = '0'
          this.m = '0'
          this.s = '0'
          if (vTime > 59) {
            this.s = vTime % 60
            vTime = parseInt(vTime / 60)
            if (vTime > 59) {
              this.m = vTime % 60
              vTime = parseInt(vTime / 60)
              if (vTime > 23) {
                this.h = parseInt(vTime % 24)
                vTime = parseInt(vTime / 24)
                this.d = vTime
              } else {
                this.h = vTime
              }
            } else {
              this.m = vTime
            }
          } else {
            if (vTime >= 0) {
              this.s = vTime
            }
          }
          if (this.h < 10) {
            this.h = '0' + this.h
          }
          if (this.m < 10) {
            this.m = '0' + this.m
          }
          if (this.s < 10) {
            this.s = '0' + this.s
          }
        }
      }
    },
    created() {
      this.parsingTime()
      countDownJs.heartbeat()
    },
    destroyed() {
      countDownJs.removeHeartbeat()
    },
    watch: {
      '$store.state.severTime.currentTime': function () {
        this.parsingTime()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .countdown {
    overflow hidden
    display flex;
    align-items center;
    justify-content: center;
    .red-div {
      min-width 20px;
      text-align center;
      margin 0 3px;
      border-radius 3px;
      padding 4px 2px;
      font-size 10px;
    }
  }
</style>

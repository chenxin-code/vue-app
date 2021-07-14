<template>
  <div class="bg" @click.stop="closeEvent">
    <transition name="pop_transiton">
      <div class="pop-bottom theme_bg_white" :style="getFullStyle()" v-show="popShow" @click.stop="stopClick">
        <div class="close-btn" :style="getFullBtnStyle()"  @click.stop="closeEvent">
          <i class="iconfont mall-guanbi theme_font_tint"></i>
        </div>
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
  import store from  '@/vuex/store'

  export default {
    name: 'popview',
    components: {},
    props: ['pageType', 'popHeight'],
    data() {
      return {
        popShow: false,
        myTimeout: null
      }
    },
    methods: {
      getFullStyle: function () {
        let str = ''
        if (this.pageType == 'fullpage') {
          str += 'height: 100vh;'
          str += 'border-radius: 0;'
          str += 'padding-top: '+store.state.barHeight+'px;'
        }
        if (this.popHeight) {
          str = `height: ${this.popHeight}px;`
        }
        return str
      },
      getFullBtnStyle: function () {
        let str = ''
        if (this.pageType == 'fullpage') {
          str += 'margin-top: '+store.state.barHeight+'px;'
        }
        return str
      },
      stopClick: function () {
        console.log('stopClick')
      },
      closeEvent: function () {
        this.popShow = false;
        if (this.myTimeout) {
          clearTimeout(this.myTimeout)
          this.myTimeout = null
        }
        this.myTimeout = setTimeout(() => {
          this.$emit('closeEvent', '')
        }, 240)
      }
    },
    mounted() {
      this.popShow = true;
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color rgba(0, 0, 0, 0.5)
    z-index 100
    .pop-bottom {
      position absolute;
      overflow hidden;
      bottom 0px;
      left 0px;
      right 0px;
      height 70vh;
      border-radius 8px 8px 0 0;
      .close-btn {
        position absolute;
        right 0px;
        top 0px;
        padding 7px;
        z-index 99;
        i {
          font-size 15px;
        }
      }
    }
  }

</style>

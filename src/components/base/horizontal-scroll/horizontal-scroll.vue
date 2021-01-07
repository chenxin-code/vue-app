<template>
  <div class="scroll-wrapper" ref="scroll" @touchstart="touchstart">
    <div class="scroll-content" ref="scrollContent">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import FastClick from 'fastclick'
  import BScroll from 'better-scroll'

  import actualRect from '@/utils/actualRect.js'

  export default {
    name: '',
    props: {
      dataList: {
        type: Array,
        default() {
          return []
        }
      },
      click: { // 是否派发点击事件
        type: Boolean,
        default: true
      },
      percentWidth: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {}
    },
    mounted() {
      this._refresh()
    },
    methods: {
      touchstart(e) {
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      _refresh() {
        this.$nextTick(() => {
          setTimeout(()=>{
            this._setWidth()
            this._initScroll()
          },200)
        })
      },
      _setWidth() {
        if (!this.$refs.scrollContent) {
          return;
        }
        let childrens = this.$refs.scrollContent.children
        let scrollWidth = this.$refs.scroll.clientWidth
        let width = 0;
        for (let i = 0; i < childrens.length; i++) {
          let child = childrens[i]
          if(this.percentWidth){
            child.style.width = scrollWidth * this.percentWidth / 100 + 'px'
          }
          width +=  actualRect(child,"width");
        }
        this.$refs.scrollContent.style.width = width + 10 + 'px'
      },
      _initScroll() {
        if (!this.$refs.scroll) {
          return ;
        }
        this.scroll = new BScroll(this.$refs.scroll, {
          scrollX: true,
          scrollY: false,
          click: this.click,
          preventDefault: false
        })
      }
    },
    components: {},
    watch: {
      dataList: {
        handler: function(val) {
          if (val && val.length) {
              this._refresh()
          }
        },
        immediate: true
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .scroll-wrapper, .scroll-content{
    position: relative
    overflow: hidden
    white-space nowrap
  }
</style>

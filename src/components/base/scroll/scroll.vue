<!--pullDownRefresh 开启下拉加载  pullingDown下拉事件 data必传，刷新容器高度-->
<!--<scroll :data="pageData.moduleList" :pullDownRefresh="true" @pullingDown="topRefresh" >-->

<!--pullLoad开启上拉功能 pullingUp上拉事件 data 数据 hasMore 是否有更多-->
<!--如果tab切换等多次使用scroll ，需执行 this.$refs.scroll.openPullUp() 重新开启上拉功能-->
<!--<scroll ref="scroll" class="coupon-list" :hasMore="hasMore" :pullUpLoad="true" @pullingUp="loadMore" :data="couponList"></scroll>-->
<template>
  <div :ref="wrapperName" class="list-wrapper">
    <div class="scroll-content">
      <div ref="listWrapper" class="scroll">
        <slot></slot>
        <div class="pullup-wrapper" v-if="pullUpLoad && data.length">
          <div class="before-trigger loading" v-if="!hasMore">
            <span class="text">{{noMoreText}}</span>
          </div>
          <div class="after-trigger loading" v-else>
            <img src="./loading.gif" alt=""><span class="text">加载中...</span>
          </div>
        </div>
      </div>
    </div>
    <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
      <div class="before-trigger" v-if="beforePullDown">
        <bubble :y="bubbleY"></bubble>
      </div>
      <div class="after-trigger" v-else>
        <div v-if="isPullingDown" class="loading">
          <img src="./loading.gif" alt="">
        </div>
        <div v-else><span>{{refreshTxt}}</span></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Bubble from './bubble/bubble.vue'
  const COMPONENT_NAME = 'scroll'
  const DIRECTION_H = 'horizontal'
  const DIRECTION_V = 'vertical'
  export default {
    name: COMPONENT_NAME,
    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      probeType: { // 滚动实时监听类型，1,2,3, 3实时派发
        type: Number,
        default: 1
      },
      click: { // 是否派发点击事件
        type: Boolean,
        default: true
      },
      listenScroll: { // 是否监听滚动事件
        type: Boolean,
        default: false
      },
      listenBeforeScroll: {
        type: Boolean,
        default: false
      },
      listenScrollEnd: {
        type: Boolean,
        default: false
      },
      direction: { // 滚动方向
        type: String,
        default: DIRECTION_V
      },
      scrollbar: {
        type: null,
        default: false
      },
      pullDownRefresh: { // 下拉刷新
        type: null,
        default: false
      },
      pullUpLoad: { // 上拉加载
        type: null,
        default: false
      },
      hasMore: { // 上拉加载
        type: Boolean,
        default: true
      },
      startY: { // 滚动Y坐标值
        type: Number,
        default: 0
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      freeScroll: {
        type: Boolean,
        default: false
      },
      mouseWheel: {
        type: Boolean,
        default: false
      },
      bounce: {
        default: true
      },
      zoom: {
        default: false
      }
    },
    data() {
      return {
        beforePullDown: true,
        isRebounding: false,
        isPullingDown: false,
        isPullUpLoad: false,
        pullDownStyle: '',
        bubbleY: 0
      }
    },
    computed: {
      noMoreText() {
        return (this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.noMore) || '没有更多数据了'
      },
      refreshTxt() {
        return (this.pullDownRefresh && this.pullDownRefresh.txt) || '下拉刷新'
      },
      wrapperName() {
        return `wrapper_${Date.now()}`
      }
    },
    created() {
      this.pullDownInitTop = -50
      this.pullDownStyle = `top:${this.pullDownInitTop}px`
    },
    mounted() {
      this.$nextTick(this.initScroll)
    },
    destroyed() {
      this.forceUpdate()
      this.scroll && this.destroy()
    },
    methods: {
      initScroll() {
        this.scroll && this.destroy()
        if (!this.$refs[this.wrapperName]) {
          return
        }
        // if (this.$refs.listWrapper && (this.pullDownRefresh || this.pullUpLoad)) {
        //   this.$refs.listWrapper.style.minHeight = `${this.$refs[this.wrapperName].clientHeight + 1}px`
        // }
        let options = {
          probeType: this.probeType,
          click: this.click,
          scrollY: this.freeScroll || this.direction === DIRECTION_V,
          scrollX: this.freeScroll || this.direction === DIRECTION_H,
          scrollbar: this.scrollbar,
          pullDownRefresh: this.pullDownRefresh,
          pullUpLoad: this.pullUpLoad,
          startY: this.startY,
          freeScroll: this.freeScroll,
          mouseWheel: this.mouseWheel,
          bounce: this.bounce,
          zoom: this.zoom,
          preventDefaultException: {
            className: /(^|\s)swiper-img(\s|$)/
          }
        }
        this.scroll = new BScroll(this.$refs[this.wrapperName], options)
        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }
        if (this.listenScrollEnd) {
          this.scroll.on('scrollEnd', (pos) => {
            this.$emit('scroll-end', pos)
          })
        }
        if (this.listenBeforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScrollStart')
          })
          this.scroll.on('scrollStart', () => {
            this.$emit('scroll-start')
          })
        }
        if (this.pullDownRefresh) {
          this._initPullDownRefresh()
          // this.$refs.listWrapper.style.minHeight = this.$refs[this.wrapperName].clientHeight
        }
        if (this.pullUpLoad) {
          this._initPullUpLoad()
        }
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      clickItem(e, item) {
        this.$emit('click', item)
      },
      destroy() {
        this.scroll.destroy()
      },
      pullUpFinished() {
        this.isPullUpLoad = false
        this.scroll.finishPullUp()
        this.refresh()
      },
      forceUpdate(dirty) {
        if (this.pullDownRefresh && this.isPullingDown) {
          this.isPullingDown = false
          this._reboundPullDown().then(() => {
            this._afterPullDown()
          })
        } else if (this.pullUpLoad && this.isPullUpLoad) {
          this.isPullUpLoad = false
          this.scroll.finishPullUp()
          this.refresh()
        } else {
          this.refresh()
        }
      },
      _initPullDownRefresh() {
        this.scroll.on('pullingDown', () => {
          this.beforePullDown = false
          this.isPullingDown = true
          this.$emit('pullingDown')
        })
        this.scroll.on('scroll', (pos) => {
          if (!this.pullDownRefresh) {
            return
          }
          if (this.beforePullDown) {
            this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop)
            this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10)}px`
          } else {
            this.bubbleY = 0
          }
          if (this.isRebounding) {
            this.pullDownStyle = `top:${10 - (this.pullDownRefresh.stop - pos.y)}px`
          }
        })
      },
      _initPullUpLoad() {
        this.scroll.on('pullingUp', () => {
          this.isPullUpLoad = true
          if (this.hasMore) {
            this.$emit('pullingUp')
          }
        })
      },
      _reboundPullDown() {
        const {stopTime = 600} = this.pullDownRefresh
        return new Promise((resolve) => {
          setTimeout(() => {
            this.isRebounding = true
            this.scroll.finishPullDown()
            resolve()
          }, stopTime)
        })
      },
      _afterPullDown() {
        setTimeout(() => {
          this.pullDownStyle = `top:${this.pullDownInitTop}px`
          this.beforePullDown = true
          this.isRebounding = false
          this.refresh()
        }, this.scroll.options.bounceTime)
      },
      _getRect(el) {
        if (el instanceof window.SVGElement) {
          let rect = el.getBoundingClientRect()
          return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          }
        } else {
          return {
            top: el.offsetTop,
            left: el.offsetLeft,
            width: el.offsetWidth,
            height: el.offsetHeight
          }
        }
      },
      openPullUp() {
        this.scroll.openPullUp()
      },
      closePullUp() {
        this.scroll.closePullUp()
      }
    },
    watch: {
      data: {
        handler: function () {
          setTimeout(() => {
            this.forceUpdate(true)
            if (this.$refs.listWrapper && (this.pullDownRefresh || this.pullUpLoad)) {
              this.$refs.listWrapper.style.minHeight = `${this.$refs[this.wrapperName].clientHeight + 1}px`
            }
          }, this.refreshDelay)
        },
        deep: true
      },
      hasMore(val) {
        if (!val) {
          setTimeout(() => {
            this.forceUpdate()
            this.closePullUp()
          }, this.refreshDelay)
        }
      }
    },
    components: {
      Bubble
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .list-wrapper
    position: relative
    height: 100%
    overflow: hidden
    background: #fff
    .loading
      text-align: center
      img{
        width: 22px
        height: 22px
        display: inline-block
        vertical-align middle
        margin-right:8px;
      }
      .text
        vertical-align middle
        font-size 13px;
        color:#999
    .scroll-content
      position: relative
      z-index: 1
  .pulldown-wrapper
    position: absolute
    width: 100%
    left: 0
    display: flex
    justify-content center
    align-items center
    transition: all
    .after-trigger
      margin-top: 10px
  .pullup-wrapper
    width: 100%
    display: flex
    justify-content center
    align-items center
    padding: 16px 0
</style>

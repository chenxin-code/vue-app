/**Created by steven on 2018/12/13.*/

<template>
  <div ref="wrapper" class="pull-refresh">
    <!--bsscroll下面最好只有一个div-->
    <div class="scroll-content">
      <div ref="listWrapper">
        <slot>
        </slot>
      </div>

      <div v-if="bottomLoadMethod && isBottomBounce"
           class="action-block">
        <div class="bottom-load-wrapper">
          <img class="refresh-icon"
               :class="{
               'icon-loading': state === 'loading'
             }"
               :src="bottomIconSrc"
               alt="">
          <span class="refresh-span">{{ bottomText }}</span>
        </div>
      </div>
    </div>
    <div v-if="topLoadMethod && isTopBounce"
         :style="{ height: `${topBlockHeight}px`, top: `${topGap}px` }"
         class="top-load-wrapper">
      <div class="action-block">
        <img class="refresh-icon"
             :class="{
               'icon-loading': state === 'loading'
             }"
             :src="topIconSrc"
             alt="">
        <span class="refresh-span">{{ topText }}</span>
      </div>
    </div>

  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import { TOP_DEFAULT_CONFIG, BOTTOM_DEFAULT_CONFIG } from './config';

export default {
  name: "pull-refresh",
  components: {
    BScroll
  },
  props:{
    topLoadMethod: {
      type: Function
    },
    bottomLoadMethod: {
      type: Function
    },

    listenScroll:{
      type: Function
    },
    isTopBounce: {
      type: Boolean,
      default: true
    },
    isBottomBounce: {
      type: Boolean,
      default: true
    },
    topBlockHeight: {
      type: Number,
      default: 50
    },
    bottomBlockHeight: {
      type: Number,
      default: 50
    },
    isBottomAutoPull:{
      type:Boolean,
      default: false
    },
    topConfig: {
      type: Object,
      default: () => {
        return {};
      }
    },
    bottomConfig: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },

  data () {
    return {
      state: '',
      topGap:-50
    }
  },
  computed:{
    _topConfig:function () {
      return this.$assign({},TOP_DEFAULT_CONFIG,this.topConfig);
    },
    _bottomConfig:function () {
      return this.$assign({},BOTTOM_DEFAULT_CONFIG,this.bottomConfig);
    },
    topText(){
      if(this.state == 'loading'){
        return this._topConfig.loadingText;
      }else if(this.state == 'done'){
        return this._topConfig.doneText;
      }else if(this.state == 'trigger'){
        return this._topConfig.triggerText;
      } else{
        return this._topConfig.pullText;
      }
    },
    bottomText(){
      if(this.state == 'loading'){
        return this._bottomConfig.loadingText;
      }else if(this.state == 'done'){
        return this._bottomConfig.doneText;
      }else if(this.state == 'trigger'){
        return this._bottomConfig.triggerText;
      } else{
        return this._bottomConfig.pullText;
      }
    },
    bottomIconSrc(){
      if(this.state == 'loading'){
        return require('./imgs/refreshloading.png');
      }else if(this.state == 'done'){
        return require('./imgs/loading-done.png');
      } else{
        return require('./imgs/bottom-arrow.png');
      }
    },
    topIconSrc(){
      if(this.state == 'loading'){
        return require('./imgs/refreshloading.png');
      }else if(this.state == 'done'){
        return require('./imgs/loading-done.png');
      } else{
        return require('./imgs/top-arrow.png');
      }
    }
  },

  created() {
  },
  mounted() {
    this.$nextTick(()=>{
      this.initScroll()
    })
  },
  destroy() {
    this.scroll.destroy()
  },
  watch: {

    isTopBounce(){
      if(this.isTopBounce){
        this.openPullDown();
      }else {
        this.closePullDown();
      }
    },
    isBottomBounce(val,newval){
      if(this.isBottomBounce){
        this.openPullUp();
      }else {
        this.closePullUp();
      }
    },
  },


  methods: {
    refresh() {
      this.scroll && this.scroll.refresh()
    },

    //打开上拉
    openPullUp(){
      if(this.scroll){
        this.scroll.openPullUp(
          {
            threshold: 20,
            stop:this.bottomBlockHeight
          }
        );
        this._initPullUpLoad()
      }
    },
    //关闭上拉
    closePullUp(){
      if(this.scroll){
        this.scroll.closePullUp();
        this.scroll.off('pullingUp');
      }
    },
    //关闭下拉
    closePullDown(){
      if(this.scroll){
        this.scroll.closePullDown();
        this.scroll.off('pullingDown');
      }
    },
    //打开下拉
    openPullDown(){
      if(this.scroll){
        this.scroll.openPullDown(
          {
            threshold: 70,
            stop:this.bottomBlockHeight
          }
        );
        this._initPullDownRefresh();
      }
    },

    wrapperRefresh(){
      if (this.$refs.listWrapper) {
        this.$refs.listWrapper.style.minHeight = `${this.$refs.wrapper.offsetHeight + 1}px`
      }
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    scrollY(){
      return this.scroll.y;
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.wrapperRefresh();

      let options = {
        probeType: 3,
        click: true,
        zoom: false,
      }

      this.scroll = new BScroll(this.$refs.wrapper, options)
      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          this.listenScroll(pos.y);
        })
      }

      if (this.isTopBounce && this.topLoadMethod) {
        this.openPullDown();
      }

      if (this.isBottomBounce && this.bottomLoadMethod) {
        this.openPullUp();
      }
    },
    _initPullDownRefresh() {
      this.scroll.on('pullingDown', () => {
        this.direction = 'down';
        //出发下拉
        this.state = 'loading';
        this.topLoadMethod(this.loadDone);
      })
      this.scroll.on('scroll', (pos) => {
        if (!this.isTopBounce || !this.topLoadMethod) {
          return
        }
        if (this.state != 'loading') {
          this.topGap = Math.min(pos.y - this.topBlockHeight, 0)
        }
      })
    },
    _initPullUpLoad() {
      this.scroll.on('pullingUp', () => {

        this.direction = 'up'
        this.state = 'loading';
        this.bottomLoadMethod(this.loadDone);
      })
    },

    loadDone() {
      if(this.state == 'loading'){
        this.state = 'done';
        setTimeout(() => {
          if (this.direction == 'down'){
            this.scroll.finishPullDown();
          }else if (this.direction == 'up'){
            this.scroll.finishPullUp();
          }
          this._afterPull();
          // this.closePullDown();
        }, 600)

      }else {
        this.refresh()
      }
    },
    _afterPull() {
      setTimeout(() => {
        this.state = ''
        this.refresh()
      }, this.scroll.options.bounceTime)
    },
    //
    getContainerStyle:function () {

    }

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
.pull-refresh {
  position relative
  width 100%
  height 100%
  overflow hidden
  background #fff
  .scroll-content{
    position: relative
    z-index: 1
  }


  .action-block {
    width: 100%;
    line-height: 50px;
    text-align: center;
    color: #999;
    .refresh-icon{
      width: 20px;
      height: 20px;
      vertical-align: middle
    }
    .refresh-span{
      height: 100%;
      vertical-align: middle;
      display: inline-block
    }
  }

  .bottom-load-wrapper {
    /*position absolute
    top -50px
    width 100%*/
  }
  .top-load-wrapper {
    position absolute
    top -50px
    width 100%
  }

  .icon-loading {
    transform: rotate(0deg);
    animation-name: loading;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }

  @keyframes loading
  {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
  }

}
</style>

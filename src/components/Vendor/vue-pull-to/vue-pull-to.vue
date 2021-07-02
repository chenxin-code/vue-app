<template>
  <div class="vue-pull-to-wrapper"
       :style="{ height: wrapperHeight, transform: `translate3d(0, ${diff}px, 0)` }">
    <div v-if="topLoadMethod"
         :style="{ height: `${topBlockHeight}px`, marginTop: `${-topBlockHeight}px` }"
         class="action-block">
      <div class="top-load-wrapper">

        <img v-if="topIconSrc && topIconSrc != 'undefined'" class="refresh-icon"
             :class="{
               'icon-loading': state === 'loading'
             }"
             :src="topIconSrc"
             alt="">
        <span class="refresh-span">{{ topText }}</span>
      </div>

    </div>
    <div class="scroll-container" :style="{paddingBottom:`${bottomBlockHeight}px`}">
      <slot></slot>
      <!-- v-if="bottomLoadMethod && isBottomBounce && isBottomAutoS" -->
      <!-- :style="{ height: `${bottomBlockHeight}px`, marginBottom: `${-bottomBlockHeight}px` }" -->
      <!-- 商品详情不需要显示loading -->
      <div 
          v-if="$route.matched[0].path != '/mall2/detail/:id'" 
           :style="{ height: `${bottomBlockHeight}px`}"
           class="action-block">
        <div class="bottom-load-wrapper">
          <img class="refresh-icon"
               v-if="bottomIconSrc && bottomIconSrc != 'undefined'"
               :class="{
               'icon-loading': state === 'loading'
             }"
               :src="bottomIconSrc"
               alt="">
          <span class="refresh-span">{{ bottomText }}</span>
        </div>
      </div>
    </div>
    <!-- v-if="bottomLoadMethod && isBottomBounce && !isBottomAutoS" -->
    <!-- :style="{ height: `${bottomBlockHeight}px`, marginBottom: `${-bottomBlockHeight}px` }" -->
    <!-- 商品详情不需要显示加载完成 -->
    <div 
        v-if="$route.matched[0].path != '/mall2/detail/:id'"
         :style="{ height: `${bottomBlockHeight}px`}"
         class="action-block">
      <div class="bottom-load-wrapper">
        <img class="refresh-icon"
             v-if="bottomIconSrc && bottomIconSrc != 'undefined'"
             :class="{
               'icon-loading': state === 'loading'
             }"
             :src="bottomIconSrc"
             alt="">
        <span class="refresh-span">{{ bottomText }}</span>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import { throttle } from './utils';
  import { TOP_DEFAULT_CONFIG, BOTTOM_DEFAULT_CONFIG } from './config';

  export default {
    name: 'vue-pull-to',
    props: {
      doSiteCallback: {
        type: Boolean,
        default: false
      },
      distanceIndex: {
        type: Number,
        default: 2
      },
      topBlockHeight: {
        type: Number,
        default: 50
      },
      bottomBlockHeight: {
        type: Number,
        default: 50
      },
      wrapperHeight: {
        type: String,
        default: '100%'
      },
      topLoadMethod: {
        type: Function
      },
      bottomLoadMethod: {
        type: Function
      },
      isThrottleTopPull: {
        type: Boolean,
        default: true
      },
      isThrottleBottomPull: {
        type: Boolean,
        default: true
      },
      isThrottleScroll: {
        type: Boolean,
        default: false
      },
      isTopBounce: {
        type: Boolean,
        default: true
      },
      isBottomBounce: {
        type: Boolean,
        default: true
      },
      isBottomAutoS:{
        type:Boolean,
        default: false
      },
      bothEventForce: {
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
    data() {
      return {
        topIconSrc: '',
        bottomIconSrc: '',
        scrollEl: null,
        startScrollTop: 0,
        startY: 0,
        currentY: 0,
        distance: 0,
        direction: 0,
        diff: 0,
        beforeDiff: 0,
        topText: '',
        bottomText: '',
        state: '',
        bottomReached: false,
        throttleEmitTopPull: null,
        throttleEmitBottomPull: null,
        throttleEmitScroll: null,
        throttleOnInfiniteScroll: null,
        myTimer: null,
        lastSite: 0,
        speed: 0
      };
    },
    computed: {
      _topConfig: function () {
        return this.$assign({}, TOP_DEFAULT_CONFIG, this.topConfig);
      },
      _bottomConfig: function () {
        return this.$assign({}, BOTTOM_DEFAULT_CONFIG, this.bottomConfig);
      }
    },
    watch: {
      state(val) {

        if (val === 'pull' ) {
          if (this.direction === 'down') {
            this.topIconSrc =  require('./imgs/top-arrow.png') ;
          } else {
            this.bottomIconSrc = require('./imgs/bottom-arrow.png');
          }
        }else if (val === 'trigger') {
          if (this.direction === 'down') {
            this.topIconSrc = require('./imgs/bottom-arrow.png');
          } else {
            this.bottomIconSrc = require('./imgs/top-arrow.png');
          }
        }else if (val === 'loading') {
          this.topIconSrc = require('./imgs/refreshloading.png');
          this.bottomIconSrc = require('./imgs/refreshloading.png');
        } else if (val === 'loaded-done') {
          this.topIconSrc = require('./imgs/loading-done.png');
          this.bottomIconSrc = require('./imgs/loading-done.png');
        }

        if (this.direction === 'down') {
          this.$emit('top-state-change', val);
        } else {
          this.$emit('bottom-state-change', val);
        }
      }
    },
    methods: {
      siteCallBack: function () {
        if (this.myTimer) {
          clearInterval(this.myTimer)
          this.myTimer = null
        }
        let times = 20
        let speed = this.speed
        if (speed < 5) {
          return ;
        }
        let scrollTop = this.scrollEl.scrollTop
        let maxSize = this.scrollEl.scrollHeight - this.scrollEl.offsetHeight
        let a = - speed / times;
        this.myTimer = window.setInterval(() => {
          speed += a
          scrollTop += speed
          if ((scrollTop >= 220 && speed > 0) || scrollTop >= maxSize || scrollTop <= 0) {
            if (scrollTop < 0) {
              this.$emit('pageSite', 0);
            }
            if (this.myTimer) {
              clearInterval(this.myTimer)
              this.myTimer = null
            }
            return
          }
          this.$emit('pageSite', scrollTop);
          times --;
          if (times < 0) {
            if (this.myTimer) {
              clearInterval(this.myTimer)
              this.myTimer = null
            }
          }
        }, 50)
      },
      actionPull() {
        this.state = 'pull';
        this.direction === 'down'
          ? this.topText = this._topConfig.pullText
          : this.bottomText = this._bottomConfig.pullText;
      },
      actionTrigger() {
        this.state = 'trigger';
        this.direction === 'down'
          ? this.topText = this._topConfig.triggerText
          : this.bottomText = this._bottomConfig.triggerText;
      },
      actionLoading() {
        this.state = 'loading';
        if (this.direction === 'down') {
          this.topText = this._topConfig.loadingText;
          /* eslint-disable no-useless-call */
          this.topLoadMethod.call(this, this.actionLoaded);
          this.scrollTo(this._topConfig.stayDistance);
        } else {
          this.bottomText = this._bottomConfig.loadingText;
          if (this.isBottomAutoS){
            this.bottomLoadMethod.call(this, this.actionLoaded);
          } else {
            this.scrollTo(-this._bottomConfig.stayDistance);
            this.bottomLoadMethod.call(this, this.actionLoaded);
          }
        }
      },
      actionLoaded(loadState = 'done') {
        this.state = `loaded-${loadState}`;
        let loadedStayTime;
        let stayDistance;
        if (this.direction === 'down') {
          this.topText = loadState === 'done'
            ? this._topConfig.doneText
            : this._topConfig.failText;
          loadedStayTime = this._topConfig.loadedStayTime;
          stayDistance =  this._topConfig.stayDistance;
        } else {
          if(this.isBottomAutoS){
            loadedStayTime = 0;
            this.bottomText = loadState === 'done'
              ? this._bottomConfig.doneText
              : this._bottomConfig.failText;
          }else {
            this.bottomText = loadState === 'done'
              ? this._bottomConfig.doneText
              : this._bottomConfig.failText;
            loadedStayTime = this._bottomConfig.loadedStayTime;
          }
          stayDistance =  this._bottomConfig.stayDistance;
        }
        setTimeout(() => {
            this.scrollTo(0);
          // reset state
          setTimeout(() => {
            this.state = '';
          }, 200);
        }, loadedStayTime);
      },
      scrollTo(y, duration = 200) {
        this.$el.style.transition = `${duration}ms`;
        this.diff = y;
        setTimeout(() => {
          this.$el.style.transition = '';
        }, duration);
      },

      checkBottomReached() {
        return this.scrollEl.scrollTop + this.scrollEl.offsetHeight + 1 >= this.scrollEl.scrollHeight;
      },

      handleTouchStart(event) {
        if (this.myTimer) {
          clearInterval(this.myTimer)
          this.myTimer = null
        }
        this.startY = event.touches[0].clientY;
        this.beforeDiff = this.diff;
        this.startScrollTop = this.scrollEl.scrollTop;
        this.bottomReached = this.checkBottomReached();
      },

      handleTouchMove(event) {
        this.currentY = event.touches[0].clientY;
        this.distance = (this.currentY - this.startY) / this.distanceIndex + this.beforeDiff;
        this.direction = this.distance > 0 ? 'down' : 'up';

        if (this.startScrollTop === 0 && this.direction === 'down' && this.isTopBounce) {
          event.preventDefault();
          event.stopPropagation();
          this.diff = this.distance;
          this.isThrottleTopPull ? this.throttleEmitTopPull(this.diff) : this.$emit('top-pull', this.diff);

          if (typeof this.topLoadMethod !== 'function') return;

          if (this.distance < this._topConfig.triggerDistance &&
            this.state !== 'pull' && this.state !== 'loading') {
            this.actionPull();
          } else if (this.distance >= this._topConfig.triggerDistance &&
            this.state !== 'trigger' && this.state !== 'loading') {
            this.actionTrigger();
          }
        } else if (this.bottomReached && this.direction === 'up' && this.isBottomBounce) {
          event.preventDefault();
          event.stopPropagation();
          this.diff = this.distance;
          this.isThrottleBottomPull ? this.throttleEmitBottomPull(this.diff) : this.$emit('bottom-pull', this.diff);

          if (typeof this.bottomLoadMethod !== 'function') return;

          if (Math.abs(this.distance) < this._bottomConfig.triggerDistance &&
            this.state !== 'pull' && this.state !== 'loading') {
            this.actionPull();
          } else if (Math.abs(this.distance) >= this._bottomConfig.triggerDistance &&
            this.state !== 'trigger' && this.state !== 'loading') {
            this.actionTrigger();
          }
        }
      },

      handleTouchEnd() {
        // if (this.doSiteCallback) {
        //   this.siteCallBack();
        // }
        if (this.diff !== 0) {
          if (this.state === 'trigger') {
            this.actionLoading();
            return;
          }
          // pull cancel
          this.scrollTo(0);
        }
      },

      setScrollTopValue: function (value) {
        this.scrollEl.scrollTop = value;
      },
      getScrollTopValue:function(){
        return this.scrollEl.scrollTop;
      },

      handleScroll(event) {
        // if (this.doSiteCallback) {
        //   this.speed = this.scrollEl.scrollTop - this.lastSite
        //   this.lastSite = this.scrollEl.scrollTop
          this.$emit('pageSite', this.scrollEl.scrollTop);
        // }
        if(this.state != 'loading'  && this.isBottomBounce && this.isBottomAutoS && (event.target.scrollTop+event.target.offsetHeight > event.target.scrollHeight-this.bottomBlockHeight)){
          this.direction = 'up'
          this.actionLoading();
        }
        this.isThrottleScroll ? this.throttleEmitScroll(event) : this.$emit('scroll', event);
        // this.throttleOnInfiniteScroll();
      },

      onInfiniteScroll() {
        if (this.checkBottomReached()) {
          this.$emit('infinite-scroll');
        }
      },

      throttleEmit(delay, mustRunDelay = 0, eventName) {
        const throttleMethod = function () {
          const args = [...arguments];
          args.unshift(eventName);
          this.$emit.apply(this, args);
        };
        return throttle(throttleMethod, delay, mustRunDelay);
      },

      bindEvents() {
        if(!this.isBottomAutoS){
          this.scrollEl.addEventListener('touchstart', this.handleTouchStart);
          this.scrollEl.addEventListener('touchmove', this.handleTouchMove);
          this.scrollEl.addEventListener('touchend', this.handleTouchEnd);
        } else {
          if (this.bothEventForce == true) {
            this.scrollEl.addEventListener('touchstart', this.handleTouchStart);
            this.scrollEl.addEventListener('touchmove', this.handleTouchMove);
            this.scrollEl.addEventListener('touchend', this.handleTouchEnd);
          }
        }
        this.scrollEl.addEventListener('scroll', this.handleScroll);
      },

      createThrottleMethods() {
        this.throttleEmitTopPull = this.throttleEmit(200, 300, 'top-pull');
        this.throttleEmitBottomPull = this.throttleEmit(200, 300, 'bottom-pull');
        this.throttleEmitScroll = this.throttleEmit(100, 150, 'scroll');
        this.throttleOnInfiniteScroll = throttle(this.onInfiniteScroll, 400);
      },

      init() {
        this.createThrottleMethods();
        this.scrollEl = this.$el.querySelector('.scroll-container');
        this.bindEvents();
      }
    },
    mounted() {
      this.init();
      console.log(this.bottomLoadMethod,this.isBottomBounce,this.isBottomAutoS)
    }
  };
</script>

<style >
  .vue-pull-to-wrapper {
    height: 100%;
  }

  .scroll-container {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .vue-pull-to-wrapper .action-block {
    position: relative;
    width: 100%;
  }

  .refresh-icon{
    /*text-align: center;*/
    width: 20px;
    height: 20px;
    vertical-align: middle
  }
  .refresh-span{height: 100%;vertical-align: middle;display: inline-block}


  .bottom-load-wrapper {
    line-height: 50px;
    text-align: center;
    color: #999;
  }
  .top-load-wrapper {
    line-height: 50px;
    text-align: center;
    color: #999;
    /*background: red;*/
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
</style>

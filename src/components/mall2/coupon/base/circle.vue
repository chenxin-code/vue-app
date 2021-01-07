<template>
  <div :style="style" class="circle-wrapper">
    <svg viewBox="0 0 1060 1060">
      <path :style="hoverStyle" :d="path"/>
      <path class="layer-circle" :style="layerStyle" :d="path"/>
    </svg>
    <div class="circle-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  const RED = '#F80F16'
  const WHITE = '#ffffff'
  const GRAY = 'rgb(235, 237, 240)'
  export default {
    props: {
      value: Number,
      speed: Number,
      size: {
        type: String,
        default: '100px'
      },
      fill: {
        type: String,
        default: 'none'
      },
      rate: {
        type: Number,
        default: 100
      },
      color: {
        type: String,
        default: RED
      },
      layerColor: {
        type: String,
        default: GRAY
      },
      strokeWidth: {
        type: Number,
        default: 40
      },
      clockwise: {
        type: Boolean,
        default: true
      }
    },

    beforeCreate() {
      this.perimeter = 3140;
      this.path = 'M 530 530 m -500, 0 a 500, 500 0 1, 1 1000, 0 a 500, 500 0 1, 1 -1000, 0';
    },

    computed: {
      style() {
        return {
          width: this.size,
          height: this.size
        };
      },

      layerStyle() {
        let offset = this.perimeter * (100 - this.value) / 100;
        offset = this.clockwise ? offset : this.perimeter * 2 - offset;
        return {
          stroke: `${this.color}`,
          strokeDashoffset: `${offset}px`,
          strokeWidth: `${this.strokeWidth + 1}px`
        };
      },

      hoverStyle() {
        return {
          fill: `${this.fill}`,
          stroke: `${this.layerColor}`,
          strokeWidth: `${this.strokeWidth}px`
        };
      }
    },

    watch: {
      rate: {
        handler() {
          this.startTime = Date.now();
          this.startRate = this.value;
          this.endRate = this.format(this.rate);
          this.increase = this.endRate > this.startRate;
          this.duration = Math.abs((this.startRate - this.endRate) * 1000 / this.speed);
          if (this.speed) {
            this.cancel(this.rafId);
            this.rafId = this.raf(this.animate);
          } else {
            this.$emit('input', this.endRate);
          }
        },
        immediate: true
      }
    },

    methods: {
      animate() {
        const now = Date.now();
        const progress = Math.min((now - this.startTime) / this.duration, 1);
        const rate = progress * (this.endRate - this.startRate) + this.startRate;
        this.$emit('input', this.format(parseFloat(rate.toFixed(1))));
        if (this.increase ? rate < this.endRate : rate > this.endRate) {
          this.rafId = this.raf(this.animate);
        }
      },

      format(rate) {
        return Math.min(Math.max(rate, 0), 100);
      },
      raf(id) {
        window.requestAnimationFrame(id)
      },
      cancel(id) {
        window.cancelAnimationFrame(id)
      }
    }
  }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  .circle-wrapper {
    display inline-block
    text-align: center
    position: relative
    .circle-content {
      position: absolute
      top: 50%;
      left: 50%;
      transform translate3d(-50%, -50%, 0)
    }
  }

  .layer-circle {
    fill: none;
    stroke-linecap: round;
    stroke-dasharray: 3140;
    stroke-dashoffset: 3140;
    transform: rotate(90deg);
    transform-origin: center;
  }
</style>

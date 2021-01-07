<template>
  <transition name="slide">
    <div class="virtual-keyboard" v-show="show" @touchstart.stop>
      <div class="keyboard-row" v-for="(item, index) in keyboard" :key="index">
        <span class="keyboard-item fn-key" @click="changeKey" v-if="index === 3">{{keyType === 1 ? 'ABC' : '中文'}}</span>
        <span class="keyboard-item" @click="inputKey(key)" :class="{'flex-shrink': index === 2 || index === 3}"
              :style="{width: index === 2 || index === 3 ? keyWidth : 'auto'}" v-for="key in item">{{key}}</span>
        <span class="keyboard-item fn-key" v-if="index === 3">
          <img class="delete" @click="deleteKey" src="./image/delete.png" alt="">
        </span>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    props: {
      show: Boolean,
      type: { //中英文
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        vanShow: true,
        keyboardZh: [
          ['京', '津', '渝', '沪', '冀', '晋', '辽', '吉', '黑', '苏'],
          ['浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '琼'],
          ['川', '贵', '云', '陕', '甘', '青', '蒙', '桂', '宁', '新'],
          ['藏', '使', '领', '警', '学', '港', '澳']
        ],
        keyboardEn: [
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
          ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
          ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
          ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
        ],
        keyboard: [],
        keyWidth: 0,
        keyType: 1
      }
    },
    methods: {
      setWidth() {
        this.keyWidth = document.querySelectorAll('.keyboard-item')[0].clientWidth + 'px'
      },
      changeKey() {
        this.keyType = this.keyType === 1 ? 0 : 1
        this.keyboard = this.keyType === 1 ? this.keyboardZh : this.keyboardEn
      },
      deleteKey() {
        this.$emit('delete')
      },
      inputKey(key) {
        this.$emit('input', key)
      },
      onBlur() {
        this.$emit('blur');
        this.$emit('update:show', false)
      },
      selfHandler() {
        this.$emit('update:show', true)
      },
      handler(action) {
        document.body[(action ? 'add' : 'remove') + 'EventListener']('touchstart', this.onBlur);
      }
    },
    mounted() {
      this.keyType = this.type
      this.keyboard = this.keyType == 1 ? this.keyboardZh : this.keyboardEn
      this.handler(true)
    },
    destroyed() {
      this.handler(false)
    },

    activated() {
      this.handler(true)
    },

    deactivated() {
      this.handler(false)
    },
    watch: {
      show(val) {
        if (val) {
          clearTimeout(this.timer)
          this.timer = setTimeout(this.setWidth, 20)
        }
      },
      type(val) {
        if (val) {
          this.keyType = val
          this.keyboard = this.keyType == 1 ? this.keyboardZh : this.keyboardEn
          this.handler(true)
        }
      }
    },
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  $height = 38px;
  .virtual-keyboard {
    background: #d1d5da
    padding 8px 3px 8px 3px;
    position fixed
    z-index 2001;
    bottom: 0;
    left: 0;
    right: 0;

    .keyboard-row {
      display flex;
      align-items center
      justify-content center

      & + .keyboard-row {
        margin-top: 9px;
      }

      .keyboard-item {
        flex 1
        height $height
        line-height: $height
        text-align: center
        font-size: 18px;
        background: #fff;
        color #222;
        margin 0 2px;
        border-radius 5px;

        box-shadow 0 3px 0 0 rgba(0, 0, 0, 0.08);

        &.fn-key {
          background: #adb3bc
          font-size: 14px;
        }

        &.flex-shrink {
          flex-shrink 0
          flex-basis: auto;
          flex-grow: 0;
        }

        .delete {
          width 20px;
          display: inline-block;
          vertical-align: middle;
          margin-top: -2px;
        }
      }
    }
  }

  .slide-enter-active, .slide-leave-active {
    transition: all .3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(0, 100%, 0)
  }
</style>

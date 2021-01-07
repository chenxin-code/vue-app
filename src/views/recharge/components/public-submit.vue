<template>
  <div>
    <button
      @click="$emit('click')"
      class="submit-btn"
      :class="{active: haveEasyCard == true}"
    >
      <slot></slot>
    </button>
  </div>
</template>
<script>
  export default {
    name: 'public-submit',
    props: {
      haveEasyCard: {
        type: Boolean,
        default: false,
      }
    }
  }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl'
  @import '~@/common/stylus/mixin.styl'
  .submit-btn {
    position fixed
    z-index 999
    outline none
    border none
    font-size 16px
    color #fff
    left 0
    bottom 0
    width 100%
    height 45px
    background-color $color-theme-r
  }
  .active {
    background $color-background-ll
  }
</style>

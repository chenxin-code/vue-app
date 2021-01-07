/**Created by steven on 2018/3/12.*/

<template>
  <div class="st-navbar" :class="{'is-fixed': fixed }">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'st-navbar',

    props: {
      fixed: Boolean,
      value: {}
    }
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'

  .fixed {
    position: fixed 0 0 * 0;
    z-index: 999;
  }
  .st-navbar {
    display: -webkit-box;
    background-color: white;
    overflow-x: auto;
    /*overflow-y: hidden;*/
    -webkit-overflow-scrolling:touch;


  }
  .st-navbar::-webkit-scrollbar {display: none/* 隐藏滚动条，但依旧具备可以滚动的功能 */}




</style>


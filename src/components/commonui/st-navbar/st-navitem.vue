/**Created by steven on 2018/3/12.*/

<template>
  <div
     @click="$parent.$emit('input', id)"
     :class="{ 'st-selected': $parent.value === id }"
     class="st-navitem">
    <div class="stnavitem-label"><slot></slot></div>
  </div>
</template>

<script>
  /**
   * mt-tab-item
   * @module components/tab-item
   * @desc 搭配 tabbar 或 navbar 使用
   * @param {*} id - 选中后的返回值，任意类型
   * @param {slot} [icon] - icon 图标
   * @param {slot} - 文字
   *
   * @example
   * <mt-tab-item>
   *   <img slot="icon" src="http://placehold.it/100x100">
   *   订单
   * </mt-tab-item>
   */
  export default {
    name: 'st-navitem',

    props: ['id']
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'

  .st-navitem{
    width 25%
    min-width 65px;
    text-align center;
    box-sizing border-box
    .stnavitem-label {
      padding 2px 7px 0px 7px
      color inherit;
      font-size: 14px;
      line-height: 45px;
    }
  }
  .st-selected{
    border-bottom 1px solid  $color-theme-text-l
    color: $color-theme-text-l;
    .stnavitem-label {
      color: $color-theme-text-l;
      font-size: 14px;
    }
  }
</style>


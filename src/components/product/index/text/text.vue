<template>
  <div class="design-preview-controller">
    <div class="text">{{layoutInfo.text}}</div>
    <div  class="design-editor-item">
      <input type="text" v-model="layoutInfo.text">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import designMixin from '@/mixins/design-mixin'

  export default {
    mixins: [designMixin]
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .text{
    padding:10px;
  }
</style>

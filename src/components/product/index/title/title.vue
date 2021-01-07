<template>
    <div class="title-layout">
      <div class="title-content"></div>
      <div class="design-editor-item">

      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import designMixin from '@/mixins/design-mixin'

  export default {
    mixins: [designMixin]
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.title-content{
  background: url("./title-bg.png") no-repeat;
  height :64px;
  background-size:100% 100%;
}
</style>

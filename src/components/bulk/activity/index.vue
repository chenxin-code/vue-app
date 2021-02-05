<template>
  <!-- // created by hjc 团购活动首页 -->
  <div class="activity">
    <nav-top @backEvent="$router.go(-1)" title="活动首页"></nav-top>
  </div>
</template>

<script>
export default {
  name: "activity",
  props: {},
  data() {
    return {};
  },
  created() {},
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
</style>


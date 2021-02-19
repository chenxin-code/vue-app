<template>
  <!-- // created by hjc  -->
  <div class="index">
    <router-view></router-view>
    <div class="footer">
      <switchMenu></switchMenu>
    </div>
  </div>
</template>

<script>
import switchMenu from "@/components/bulk/components/switchMenu";
export default {
  name: "index",
  props: {},
  data() {
    return {};
  },
  created() {},
  components: {
    switchMenu,
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.router_class {
  background-color: #F6F6F6 !important;
}

.footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 49px;
}
</style>


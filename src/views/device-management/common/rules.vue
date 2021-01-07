<template>
  <div class="box">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content class="rules-container">
      <div class="title">活动说明</div>
      <div class="content" v-html="instruction"></div>
    </nav-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      instruction: '',
    };
  },
  mounted() {
    this.instruction =  this.$route.query.instruction || ''
  },
  methods: {
    backEvent() {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.box {
  width: 100%;
  height: 100%;
  .rules-container {
    padding: 10px 20px;
    .title {
      color: $color-theme;
      font-weight: 500;
      font-size: 16px;
    }
    .content {
      color: rgb(102, 102, 102)
      margin-top 10px
    }
  }
}
</style>
